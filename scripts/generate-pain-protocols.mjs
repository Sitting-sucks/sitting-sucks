#!/usr/bin/env node
/**
 * Generate src/data/pain-protocols.ts from the vault's pain protocol notes.
 *
 * Usage: node scripts/generate-pain-protocols.mjs [vault-dir]
 * Default vault dir: /mnt/h/Knowledge Vault/Knowledge/Movement/Pain & Conditions
 *
 * Parses each note's 7-part structure (Root Cause, Critical Assessment subtypes,
 * Universal Treatment steps, Compensation Chain, Full Fix Path, Related Notes)
 * into typed data the app renders. Re-run whenever Ryan updates the vault notes.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const VAULT_DIR = process.argv[2] ?? '/mnt/h/Knowledge Vault/Knowledge/Movement/Pain & Conditions';
const OUT = new URL('../src/data/pain-protocols.ts', import.meta.url).pathname;

const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = (s) =>
  s
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2') // [[target|label]] -> label
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // [[target]] -> target
    .trim();

function parseSubsections(body) {
  const parts = body.split(/^### /m).filter(Boolean);
  if (parts.length <= 1) return [];
  return parts.slice(body.trimStart().startsWith('###') ? 0 : 1).map((p) => {
    const [head, ...rest] = p.split('\n');
    return { name: clean(head.trim()), body: clean(rest.join('\n')) };
  });
}

function parseProtocol(file) {
  const raw = readFileSync(join(VAULT_DIR, file), 'utf8');
  const condition = file.replace(/\.md$/, '');
  const title = (raw.match(/^# (.+)$/m) ?? [null, condition])[1];

  const sections = {};
  for (const part of raw.split(/^## /m).slice(1)) {
    const [head, ...rest] = part.split('\n');
    sections[head.trim()] = rest.join('\n').trim();
  }
  const find = (needle) => {
    const key = Object.keys(sections).find((k) => k.toLowerCase().includes(needle));
    return key ? sections[key] : '';
  };

  const related = [...find('related').matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1]);

  return {
    slug: slugify(condition),
    condition,
    title: clean(title),
    rootCause: clean(find('root cause')),
    subtypes: parseSubsections(find('critical assessment')),
    treatmentSteps: parseSubsections(find('universal treatment')),
    compensationChain: clean(find('compensation chain')),
    fullFixPath: clean(find('full fix path')),
    related,
  };
}

const files = readdirSync(VAULT_DIR).filter((f) => f.endsWith('.md'));
const protocols = files.map(parseProtocol);

const header = `/**
 * Pain Protocols — GENERATED from the vault, do not edit by hand.
 * Source: Knowledge/Movement/Pain & Conditions/*.md
 * Regenerate: node scripts/generate-pain-protocols.mjs
 */

export interface ProtocolSection {
  name: string;
  body: string;
}

export interface PainProtocol {
  slug: string;
  /** Matches PAIN_CONDITION_COLORS keys and MUSCLE_MAP painCondition */
  condition: string;
  title: string;
  rootCause: string;
  subtypes: ProtocolSection[];
  treatmentSteps: ProtocolSection[];
  compensationChain: string;
  fullFixPath: string;
  related: string[];
}

export const PAIN_PROTOCOLS: PainProtocol[] = `;

writeFileSync(OUT, header + JSON.stringify(protocols, null, 2) + ';\n');
console.log(`Wrote ${protocols.length} protocols to ${OUT}`);
for (const p of protocols) {
  console.log(
    `  ${p.slug}: subtypes=${p.subtypes.length} steps=${p.treatmentSteps.length} chain=${p.compensationChain.length}ch related=${p.related.length}`
  );
}
