#!/usr/bin/env node
/**
 * Seed exercises + program templates from content/ YAML into Supabase.
 *
 *   node scripts/seed-exercises.mjs --check   # validate only, no writes
 *   node scripts/seed-exercises.mjs --push    # validate + upsert to Supabase
 *
 * Reads:
 *   content/exercises/*.yaml            → public.exercises (upsert by name)
 *   content/programs/*.yaml             → public.programs + program_exercises
 *
 * Needs a service-role key to write (RLS blocks anon inserts):
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-exercises.mjs --push
 * URL is read from src/integrations/supabase/client.ts.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { createClient } from '@supabase/supabase-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv.includes('--push') ? 'push' : 'check';

// ─── Vocabularies (kept in sync with muscle-mapping.ts / exercises.ts) ───
const BODY_AREAS = ['Foot/Ankle', 'Knee', 'Hip', 'L Spine', 'T Spine', 'C Spine', 'Shoulder', 'Elbow', 'Wrist'];
const JOINT_MOVEMENTS = new Set(['Ankle Dorsiflexion','Ankle Plantarflexion','Ankle Inversion','Ankle Eversion','Toe Extension','Knee Flexion','Knee Extension','Knee Internal Rotation','Knee External Rotation','Hip Flexion','Hip Extension','Hip Abduction','Hip Adduction','Hip Internal Rotation','Hip External Rotation','Hip Neutral','Lumbar Flexion','Lumbar Extension','Lumbar Lateral Flexion','Lumbar Rotation','Lumbar Neutral','Thoracic Flexion','Thoracic Extension','Thoracic Lateral Flexion','Thoracic Rotation','Cervical Flexion','Cervical Extension','Cervical Lateral Flexion','Cervical Rotation','Cervical Neutral','Shoulder Flexion','Shoulder Extension','Shoulder Abduction','Shoulder Adduction','Shoulder Internal Rotation','Shoulder External Rotation','Shoulder Horizontal Abduction','Shoulder Horizontal Adduction','Shoulder Retraction','Shoulder Stabilization','Elbow Flexion','Elbow Extension','Forearm Pronation','Forearm Supination','Wrist Flexion','Wrist Extension','Wrist Radial Deviation','Wrist Ulnar Deviation']);
const MUSCLE_KEYWORDS = ['calf','calves','gastrocnemius','soleus','achilles','foot','feet','plantar','intrinsic','toe','tibialis','ankle','dorsi','inversion','eversion','quadriceps','quad','vmo','vastus','rectus femoris','hamstring','hamstrings','biceps femoris','semitendinosus','semimembranosus','knee','vastus medialis','inner quad','vastus lateralis','outer quad','glute','gluteus','gluteus maximus','gluteus medius','gluteus minimus','hip flexor','psoas','iliacus','adductor','adductors','inner thigh','erector spinae','longissimus','multifidi','quadratus lumborum','lower back','spinal stabilizer','paraspinal','abdominis','abs','rectus abdominis','core','transverse abdominis','oblique','obliques','external oblique','internal oblique','upper ab','lower ab','upper back','trapezius','rhomboid','trap','traps','rhomboids','serratus','upper trapezius','upper trap','lower trapezius','lower trap','neck','cervical','suboccipital','head','skull','pectoral','pectoralis','chest','pec','deltoid','deltoids','rotator cuff','supraspinatus','infraspinatus','teres minor','subscapularis','biceps','bicep','brachii','triceps','tricep','anterior deltoid','front delt','posterior deltoid','rear delt','upper chest','pectoralis minor','clavicular','lower chest','pectoralis major sternal','forearm','flexor carpi','extensor carpi','brachioradialis','hand','finger','thenar','hypothenar'];

const DIFFICULTY = ['beginner', 'intermediate', 'advanced'];
const INTENSITY = ['low', 'moderate', 'high'];

// ─── Load YAML blocks from a directory ───
function loadDir(dir) {
  const path = join(ROOT, dir);
  if (!existsSync(path)) return [];
  const out = [];
  for (const f of readdirSync(path).filter((f) => /\.ya?ml$/.test(f))) {
    const parsed = YAML.parse(readFileSync(join(path, f), 'utf8'));
    if (Array.isArray(parsed)) out.push(...parsed.map((x) => ({ ...x, _file: f })));
    else if (parsed) out.push({ ...parsed, _file: f });
  }
  return out;
}

// ─── Validate one exercise ───
function validateExercise(ex, i) {
  const errs = [];
  const where = `${ex._file}#${i + 1} "${ex.name ?? '(no name)'}"`;
  if (!ex.name) errs.push(`${where}: missing name`);
  if (!BODY_AREAS.includes(ex.bodyArea)) errs.push(`${where}: bodyArea "${ex.bodyArea}" not in ${BODY_AREAS.join('|')}`);
  const jms = ex.jointMovements ?? [];
  if (jms.length === 0) errs.push(`${where}: needs at least one jointMovements`);
  for (const jm of jms) if (!JOINT_MOVEMENTS.has(jm)) errs.push(`${where}: unknown jointMovement "${jm}"`);
  const tms = ex.targetMuscles ?? [];
  if (tms.length === 0) errs.push(`${where}: needs at least one targetMuscles`);
  const matches = tms.some((tm) => MUSCLE_KEYWORDS.some((kw) => String(tm).toLowerCase().includes(kw)));
  if (tms.length && !matches) errs.push(`${where}: no targetMuscles match the muscle vocabulary — BodyMap can't link it`);
  if (!ex.instructions) errs.push(`${where}: missing instructions`);
  if (ex.difficulty && !DIFFICULTY.includes(ex.difficulty)) errs.push(`${where}: difficulty must be ${DIFFICULTY.join('|')}`);
  if (ex.intensity && !INTENSITY.includes(ex.intensity)) errs.push(`${where}: intensity must be ${INTENSITY.join('|')}`);
  return errs;
}

// ─── Map authoring shape → DB row ───
function toRow(ex) {
  const tips = [...(ex.tips ?? [])];
  if (ex.feelCue) tips.unshift(`Feel: ${ex.feelCue}`);
  if (ex.variables) {
    for (const [k, v] of Object.entries(ex.variables)) {
      if (v) tips.push(`${k[0].toUpperCase() + k.slice(1)}: ${v}`);
    }
  }
  return {
    name: ex.name,
    description: ex.description ?? null,
    instructions: ex.instructions ?? null,
    difficulty: ex.difficulty ?? 'beginner',
    intensity: ex.intensity ?? 'low',
    duration: ex.duration ?? null,
    equipment: ex.equipment ?? [],
    categories: ex.categories ?? [],
    joint_movements: ex.jointMovements ?? [],
    muscle_groups: ex.targetMuscles ?? [],
    video_url: ex.videoUrl ?? null,
    tips: tips.length ? tips : null,
    baseline: ex.baseline ?? null,
    regression: ex.regression ?? null,
    progression: ex.progression ?? null,
  };
}

function getSupabase() {
  const client = readFileSync(join(ROOT, 'src/integrations/supabase/client.ts'), 'utf8');
  const url = client.match(/https:\/\/[a-z0-9]+\.supabase\.co/)[0];
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error('\n✗ SUPABASE_SERVICE_ROLE_KEY not set. Get it from Supabase dashboard → Settings → API → service_role.');
    console.error('  Run: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-exercises.mjs --push\n');
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── Main ───
const exercises = loadDir('content/exercises');
const programs = loadDir('content/programs');

const allErrs = exercises.flatMap(validateExercise);
if (allErrs.length) {
  console.error(`\n✗ ${allErrs.length} validation error(s):\n`);
  allErrs.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`✓ ${exercises.length} exercises valid.`);
if (programs.length) console.log(`✓ ${programs.length} program file(s) found.`);

if (mode === 'check') {
  console.log('\nCheck only — no writes. Re-run with --push to seed Supabase.');
  process.exit(0);
}

const sb = getSupabase();

// Upsert exercises by name
const rows = exercises.map(toRow);
const { data: upserted, error } = await sb
  .from('exercises')
  .upsert(rows, { onConflict: 'name' })
  .select('id, name');
if (error) { console.error('✗ exercise upsert failed:', error.message); process.exit(1); }
console.log(`✓ Upserted ${upserted.length} exercises.`);

// Wire program templates
const byName = new Map(upserted.map((e) => [e.name, e.id]));
for (const prog of programs) {
  if (!prog.templateId) { console.warn(`  skip ${prog._file}: no templateId`); continue; }
  // Find or create the program row (matched by name = template id-ish handled by caller)
  const progName = prog.name ?? prog.templateId;
  let { data: existing } = await sb.from('programs').select('id').eq('name', progName).maybeSingle();
  let programId = existing?.id;
  if (!programId) {
    const { data: created, error: pErr } = await sb
      .from('programs')
      .insert({ name: progName, is_premade: true, is_active: true })
      .select('id')
      .single();
    if (pErr) { console.error(`✗ program "${progName}":`, pErr.message); continue; }
    programId = created.id;
  }
  // Rebuild this program's exercises
  await sb.from('program_exercises').delete().eq('program_id', programId);
  const peRows = [];
  for (const day of prog.days ?? []) {
    (day.exercises ?? []).forEach((e, idx) => {
      const exId = byName.get(e.name);
      if (!exId) { console.warn(`  ${progName} day ${day.day}: exercise "${e.name}" not found — skipped`); return; }
      peRows.push({ program_id: programId, exercise_id: exId, day_number: day.day, order_index: idx, sets: e.sets ?? null, reps: e.reps ?? null, notes: e.notes ?? null });
    });
  }
  if (peRows.length) {
    const { error: peErr } = await sb.from('program_exercises').insert(peRows);
    if (peErr) console.error(`✗ ${progName} exercises:`, peErr.message);
    else console.log(`✓ ${progName}: ${peRows.length} exercises wired.`);
  }
}
console.log('\nDone.');
