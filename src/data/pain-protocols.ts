/**
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

export const PAIN_PROTOCOLS: PainProtocol[] = [
  {
    "slug": "foot-and-ankle-pain",
    "condition": "Foot & Ankle Pain",
    "title": "Foot & Ankle Pain Protocol",
    "rootCause": "Foot and ankle pain comes from:\n1. **Lack of movement variety** — modern life walks on flat surfaces in supportive shoes\n2. **The calf crisis** — 9 muscles plantar flex the ankle, none trained through full ROM\n3. **Shoes** — elevated heels shorten the Achilles, narrow toe boxes prevent toe splay\n4. **Gradual transition needed** — going barefoot on a shoe-adapted foot is shock loading\n\n**The ankle is a 4-direction joint** (dorsiflexion, plantarflexion, inversion, eversion). Most people only train one direction.\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Heel Pain / Plantar Fasciitis",
        "body": "**Where:** Pain at the bottom of the heel, especially first steps in the morning.\n\n**Root cause:** Plantar fascia tightness from tight calves + weak foot intrinsics. The Achilles/calf complex pulls on the calcaneus → plantar fascia takes the strain.\n\n**Fix path:** Calf release, plantar fascia SMR (tennis ball), toe extension work, intrinsic foot strengthening."
      },
      {
        "name": "Type 2: Anterior Ankle / Dorsiflexion Restriction",
        "body": "**Where:** Limited ankle bend, blocked squat depth.\n\n**Root cause:** Ankle joint restriction (talus doesn't glide posteriorly). Tight calves + shoe immobilization.\n\n**Fix path:** Heel wedge work, talus mobilization, calf release."
      },
      {
        "name": "Type 3: Lateral Ankle / Instability",
        "body": "**Where:** History of ankle sprains, fear of re-injury, giving way.\n\n**Root cause:** Peroneal weakness + proprioceptive deficits after sprain.\n\n**Fix path:** Eversion strength (banded), single-leg balance, proprioceptive training."
      },
      {
        "name": "Type 4: Medial Ankle / Arch Pain",
        "body": "**Where:** Pain along inner ankle and arch, foot fatigue.\n\n**Root cause:** Tibialis posterior weakness. This is the primary arch support muscle.\n\n**Fix path:** Tibialis posterior activation (banded inversion), intrinsic foot strengthening.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR",
        "body": "- Calf release (foam roller — all 3 heads)\n- Plantar fascia SMR (frozen water bottle or tennis ball under arch)\n- Peroneal release (lacrosse ball into lateral lower leg)"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Toe extension/flexion — can you individually move each toe?\n- Ankle circles — full 4-direction range\n- Short foot exercise — pull ball of foot toward heel"
      },
      {
        "name": "3. Isometrics",
        "body": "- Short foot hold (arch lifted, toes flat, hold 30s)\n- Single-leg balance on heel wedge\n- Toe flexion isometric (grip the floor)"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Calf raises through full ROM (5-second lowering)\n- Banded inversion/eversion (eccentric focus)\n- Single-leg heel wedge hinge\n\n---"
      }
    ],
    "compensationChain": "```\nTight calves → can't fully extend knee\n  → Low back over-extends to compensate\n    → Hip can't work properly\n      → Everything upstream compensates\n```\n\n---",
    "fullFixPath": "1. **Assess:** Heel, anterior, lateral, or medial?\n2. **Check ankle dorsiflexion** — knee-to-wall test\n3. **SMR:** Release calves, plantar fascia, peroneals\n4. **Activate:** Foot intrinsics, tibialis posterior, peroneals\n5. **Strengthen:** Full 4-direction ankle work\n6. **Progress:** Single-leg → eyes closed → unstable surface\n\n---",
    "related": [
      "Knee Pain",
      "Lower Back Pain",
      "Compensation Chains"
    ]
  },
  {
    "slug": "hip-pain",
    "condition": "Hip Pain",
    "title": "Hip Pain Protocol",
    "rootCause": "Hip pain comes from:\n1. **Prolonged sitting** — 90° hip flexion for 8+ hours shortens hip flexors and shuts off glutes\n2. **Glute amnesia** — the glutes go dormant, leaving the hip flexors, TFL, and adductors to do the work\n3. **Limited hip mobility** — restricted internal rotation is the #1 finding in desk workers\n\n**The hip is a ball-and-socket joint designed for 6 directions:** flexion, extension, abduction, adduction, internal rotation, external rotation. If any one is missing, the others compensate and the low back or knee takes the hit.\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Deep Groin / Anterior Hip Pain",
        "body": "**Where:** Deep in the front of the hip, groin area, often felt during hip flexion or sitting.\n\n**Root cause:** Psoas tightness from prolonged sitting. The psoas is the only muscle that connects the spine to the leg — when it's tight, it pulls on both. Often accompanied by snapping or clicking.\n\n**Fix path:** Release the psoas (kneeling hip flexor stretch with SMR), restore hip extension, then strengthen glutes to balance the pull."
      },
      {
        "name": "Type 2: Lateral Hip / Trochanteric Pain",
        "body": "**Where:** Outside of the hip, pain on the side, often worse when lying on that side.\n\n**Root cause:** Glute medius weakness + TFL overcompensation. The TFL becomes a \"fake glute\" — it does the abductor work but can't stabilize the way glute med does.\n\n**Fix path:** Glute med activation (clamshells, side-lying hip abduction), TFL release with lacrosse ball, strengthen glute med in its full range."
      },
      {
        "name": "Type 3: Deep Buttock / Piriformis",
        "body": "**Where:** Deep in the buttock, sometimes radiating down the back of the leg (sciatica-like).\n\n**Root cause:** Piriformis tightness from prolonged hip flexion + weak deep rotators. The piriformis can compress the sciatic nerve when tight.\n\n**Fix path:** Piriformis SMR (lacrosse ball), hip external rotation strengthening, deep rotator activation.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR (Self-Myofascial Release)",
        "body": "- Lacrosse ball to glutes (piriformis, deep rotators)\n- Foam roller to TFL and adductors\n- Lacrosse ball to psoas (belly-up, ball at hip crease)"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Glute squeezes — can you feel it? If not, massage first\n- Side-lying clamshell — focus on glute med, not TFL\n- Standing hip hinges — find the glute, not the low back"
      },
      {
        "name": "3. Isometrics",
        "body": "- Standing hip abduction hold (glute med)\n- Single-leg glute bridge hold\n- Side plank with top leg isometric hold"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Single-leg Romanian deadlift (slow lowering phase)\n- Cossack squats (slow descent into lateral hip stretch + strength)\n- Banded hip abduction with 5-second lowering\n\n---"
      }
    ],
    "compensationChain": "From Compensation Chains:\n\n```\nTight hips (sitting) → psoas shortens → glutes shut off\n  → Anterior pelvic tilt → lumbar extension → ribs flare\n    → T-spine can't extend → shoulders internally rotate → head juts forward\n```\n\n**Knee pain often starts at the hip.** Hip abductor weakness (glute med) → knee valgus → patellar tracking issues. Fix the hip, the knee often resolves.\n\n**Low back pain is often hip pain in disguise.** SI joint pain specifically — when the hips can't move, the SI joint takes the load.\n\n---",
    "fullFixPath": "1. **Assess:** Which type? Anterior (psoas), lateral (glute med/TFL), or deep (piriformis)?\n2. **SMR:** Release the tight structures — psoas, TFL, adductors, piriformis depending on type\n3. **Activate:** Glute med (side-lying), glute max (bridge), deep rotators\n4. **Strengthen:** Full 6-direction hip work through full ROM\n5. **Maintain:** Daily hip mobility — the 6-direction flow\n\n---",
    "related": [
      "Lower Back Pain",
      "Knee Pain",
      "Compensation Chains",
      "Core Principles"
    ]
  },
  {
    "slug": "knee-pain",
    "condition": "Knee Pain",
    "title": "Knee Pain Protocol",
    "rootCause": "Knee pain comes from:\n1. **Ankle immobility** — limited dorsiflexion forces the knee to compensate during squat/lunge\n2. **Hip weakness** — weak glute med allows the thigh to internally rotate and the knee to collapse\n3. **Adductor tightness + weakness** — the adductors pull the knee into valgus when tight AND can't stabilize when weak\n\n**The knee is a hinge joint. It does flexion and extension.** If it's forced to rotate (because the ankle or hip isn't providing it), pain follows.\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Front of Knee (Patellofemoral / Anterior Knee)",
        "body": "**Where:** Pain around or behind the kneecap, worse with squatting, stairs, or prolonged sitting with bent knees.\n\n**Root cause:** VMO weakness + lateral quad overpull. The VMO is the medial stabilizer of the patella. When it's weak (common in sitters), the lateral quad pulls the kneecap out of tracking.\n\n**Fix path:** VMO activation (terminal knee extension, slow leg raises with medial rotation), quadriceps balance work."
      },
      {
        "name": "Type 2: Inner Knee (Medial)",
        "body": "**Where:** Pain on the inside of the knee joint.\n\n**Root cause:** Adductor tightness pulling the knee into valgus + weak glute med unable to resist. The medial collateral ligament gets stressed.\n\n**Fix path:** Adductor release (foam roller), glute med strengthening, single-leg stance with hip stability."
      },
      {
        "name": "Type 3: Outer Knee (Lateral / IT Band)",
        "body": "**Where:** Pain on the outside of the knee, often during running or repeated knee flexion.\n\n**Root cause:** TFL/IT band tightness. The IT band is a fascial structure that connects the TFL to the lateral knee. When the TFL is overworking (compensating for glute med), the IT band gets tight.\n\n**Fix path:** TFL release (lacrosse ball), glute med activation (not TFL), IT band flossing.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR",
        "body": "- Foam roll adductors (inner thigh)\n- Lacrosse ball to TFL (front of hip, lateral)\n- Calf release (ankle mobility)\n- Quad foam rolling (focus VMO and lateral quad)"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- VMO squeeze — can you feel the teardrop contract?\n- Glute med activation — side-lying clamshell with perfect form\n- Ankle dorsiflexion self-assessment — heel wedge test"
      },
      {
        "name": "3. Isometrics",
        "body": "- Single-leg wall squat isometric (30-45 degree bend)\n- Terminal knee extension with band at the knee\n- Glute bridge with adductor squeeze (foam roller between knees)"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Unilateral leg press (slow lowering, 5 seconds)\n- Step-downs (eccentric focus, controlled descent)\n- Banded ankle dorsiflexion + squat (address root cause)\n\n---"
      }
    ],
    "compensationChain": "From Compensation Chains:\n\n```\nTight calves → limited ankle dorsiflexion → knee valgus → hip adductors overwork\n  → Pelvis rocks → SI joint stress → lumbar spine compensates\n```\n\n**The calf crisis:** Tight calves prevent full knee extension → low back over-extends to compensate. The fix starts at the ankle, not the knee.\n\n**Knee pain and low back pain share the same root causes:**\n1. Foot/ankle tightness and weakness (root cause #1)\n2. Hip mobility/stability issues\n3. Core stability/bracing deficits\n\n**Fix path:** Ankle → Hip → Core → THEN the knee.\n\n---",
    "fullFixPath": "1. **Assess:** Where is the pain? Anterior (patellar), medial (valgus), lateral (IT band)?\n2. **Check ankle dorsiflexion** — heel wedge test. If limited, start here.\n3. **Check hip stability** — single leg stance. If hip drops, glute med is weak.\n4. **SMR:** Release tight calves, adductors, TFL\n5. **Activate:** VMO, glute med, ankle intrinsic muscles\n6. **Strengthen:** Eccentric quad, glute med, ankle mobility work\n7. **Progress:** Unilateral work, full ROM, loaded movement\n\n---",
    "related": [
      "Lower Back Pain",
      "Hip Pain",
      "Compensation Chains",
      "Core Principles"
    ]
  },
  {
    "slug": "lower-back-pain",
    "condition": "Lower Back Pain",
    "title": "Lower Back Pain Protocol",
    "rootCause": "Low back pain comes from:\n1. **Abdomen instability/weakness** — the core can't stabilize the pelvis and spine. **Core stability is required to heal low back pain** — there is no fixing the lumbar without it.\n2. **Poor hip mobility** — the hips can't move, so the low back does the moving instead\n\n**Hip health absolutely determines back health.** If the hips are stiff, the lumbar spine becomes the compensatory joint — it does work it wasn't designed to do.\n\n**The whole spine shares the load — fix it as a system.** Strengthening the T-spine helps the lumbar. Same for the C-spine. Other parts of the spine will *adapt* to our dysfunction so we can keep going on with life — but over time that adaptation really costs the human body. The classic desk pattern stacks up: **lower cross / anterior pelvic tilt** at the bottom, **kyphosis of the upper back** with a **forward-rounded T-spine and shoulders**, a **dropped chest/sternum**, and the resulting **poor rib position and breathing function** on top. The ribs play a huge role in overall body health — rib position and breathing mechanics are part of the low back picture, not separate from it.\n\n**The path is not always ground-up.** The calf and ankle are a problem in almost everyone, but the fix doesn't always run bottom-to-top. It can be ground-up — or it can start at the problem area and work outward. **Ryan is the exercise prescription scientist and chooses the exercises for every protocol** — the chain logic explains *why*, it does not auto-generate the *what*.\n\n---",
    "subtypes": [
      {
        "name": "Type 1: SI Joint Pain",
        "body": "**Where:** Pain at the sacroiliac joint — you feel it in the low back, but the source is the hips.\n\n**Root cause:** The hips can't move well. When the hips are restricted, the SI joint takes the brunt of force transfer between upper and lower body. The SI joint is designed for stability, not mobility — when it's forced to move because the hips can't, it gets angry.\n\n**This is a hip problem masquerading as a back problem.**\n\n**Fix path:** Hip mobility work — restore range of motion in all 6 hip movements (flexion, extension, abduction, adduction, internal rotation, external rotation). The SI joint pain resolves when the hips can actually move."
      },
      {
        "name": "Type 2: Spinal Tightness (Paraspinal)",
        "body": "**Where:** Tightness closer to the spine itself — the muscles running parallel to the lumbar spine are locked up.\n\n**Root cause:**\n- **Abdomen is weak** — can't stabilize the front, so the back muscles overwork\n- **Adductors are weak AND very tight** (typically) — tight adductors pull the pelvis into altered positions, weak adductors can't stabilize the hip\n- **Multifidi** — the deep spinal stabilizers. These are extensors of the spine. When we sit, we slouch into flexion, so the extensors are chronically stretched and weaken. They need release (SMR), stretch, AND strengthening.\n- **Longissimus thoracis** — the larger paraspinal extensor. Same pattern: chronically stretched and weak from sitting in flexion. Needs release, stretch, and strengthen.\n\n**The pattern:** Weak abdomen → spine loses anterior support → paraspinals lock up to protect → multifidi and longissimus thoracis become weak from chronic stretch (slouched sitting = flexion) → they can't stabilize or extend properly → chronic tightness, weakness, and pain.\n\n**Key insight:** The paraspinal muscles are NOT just tight — they are weak. Sitting in flexion stretches the extensors and lets them go to sleep. They need the full protocol: release, stretch, AND strengthen.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR (Self-Myofascial Release)",
        "body": "- Foam roll, lacrosse ball, or other tool on tight/sleeping spots\n- Find the tissue that's locked up, apply pressure, breathe, let it release\n- This \"wakes up the nerve before you use the muscle\" — see Brain-Body Connection"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Gentle movements that bring blood flow and neurological attention to the area\n- Reconnect the brain to the tissue\n- The brain needs to know the muscle exists before it can fire it properly"
      },
      {
        "name": "3. Isometrics",
        "body": "- Hold a contraction in the target position\n- Builds strength and neurological connection without moving through restricted ranges\n- Creates stability where there was none"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Controlled lowering phase — the muscle lengthens under tension\n- Builds real strength in the lengthened position (where most injuries occur)\n- This is where lasting strength and resilience are built\n\n---"
      }
    ],
    "compensationChain": "Low back pain is part of the larger compensation chain. From Compensation Chains:\n\n- **Knee pain and low back pain share the same root causes:**\n  1. Foot/ankle tightness and weakness (root cause #1)\n  2. Hip mobility/stability issues\n  3. Abdomen stability/bracing deficits\n\n- **The Calf Crisis chain:** Tight calves → can't fully extend knee → low back over-extends to compensate → lumbar stress\n\n- **Fix path:** Ankle → Hip → Core → THEN the low back\n\n**The low back is almost always the victim, not the culprit.** The question is whether the hips, the ankles, or the core is the actual problem — and the answer is usually \"all three to varying degrees.\"\n\n---",
    "fullFixPath": "1. **Assess:** Where is the pain — SI joint or spinal?\n2. **If SI joint:** → Hip mobility work (all 6 directions). See Hip Pain protocol.\n3. **If spinal tightness:**\n   - **SMR:** Release the paraspinals (multifidi + longissimus thoracis), release tight adductors\n   - **Awareness/Awakening:** Banded supine spine flatten (pelvis reset) — turns on core, reconnects to deep stabilizers\n   - **Isometrics:** Hold the flattened spine position, brace against the band, isometric abdominal holds\n   - **Slow Eccentric Strengthening:** Strengthen the spinal extensors (multifidi + longissimus thoracis) — they are WEAK from chronic flexion, not just tight. Strengthen adductors through eccentric ranges. Progress abdominal bracing in progressively harder positions.\n   - **Ongoing:** Stretch adductors (tight), strengthen adductors (weak), maintain hip mobility\n\n---",
    "related": [
      "Compensation Chains",
      "Hip Pain",
      "Knee Pain",
      "Core Principles"
    ]
  },
  {
    "slug": "neck-pain",
    "condition": "Neck Pain",
    "title": "Neck Pain Protocol",
    "rootCause": "Neck pain comes from:\n1. **Forward head posture** — the head shifts forward of the shoulders, increasing cervical load\n2. **Upper trap overwork** — the upper traps stabilize the head and elevate the shoulders beyond their capacity\n3. **Deep neck flexor weakness** — the front-of-neck muscles (longus colli, longus capitis) go dormant\n4. **Suboccipital lockup** — the muscles at the base of the skull shorten and compress\n\n**The neck is designed to support a 10-12 lb head. When the head shifts forward, the lever arm increases, and the neck muscles have to work 3-4x harder.**\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Upper Neck / Base of Skull",
        "body": "**Where:** Tension and pain at the base of the skull, often with headaches originating from the neck (cervicogenic headaches).\n\n**Root cause:** Suboccipital group locks up from sustained forward head posture. These are the smallest, deepest neck muscles — they have a high density of muscle spindles and are highly sensitive to sustained postural load.\n\n**Fix path:** Suboccipital release (lacrosse ball at base of skull), chin tucks, deep neck flexor activation."
      },
      {
        "name": "Type 2: Side of Neck / Levator Scapulae",
        "body": "**Where:** Pain on the side of the neck, especially when turning the head or looking up.\n\n**Root cause:** Levator scapulae tightness from elevation + rotation compensation. The levator connects the upper cervical spine to the medial scapula — when the scapula is protracted and elevated, the levator shortens.\n\n**Fix path:** Levator release (finger pressure above the clavicle), upper trap relaxation, scapular depression."
      },
      {
        "name": "Type 3: Front of Neck / SCM",
        "body": "**Where:** Tension in the front of the neck, difficulty swallowing, breathing restriction.\n\n**Root cause:** Sternocleidomastoid (SCM) tightness from forward head posture. The SCM is a head rotator and flexor — it's chronically shortened when the head is forward.\n\n**Fix path:** SCM stretching, chin tucks, deep neck flexor strengthening.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR",
        "body": "- Suboccipital release — lacrosse ball between shoulder blades, let head relax back\n- Upper trap squeeze — pinch and hold, or lacrosse ball\n- Levator scapulae trigger point — find the taut band above the clavicle"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Chin tucks — the single most important neck exercise. Retract the head back over the shoulders.\n- Neck rotations — full range, breathe into the restriction\n- Shoulder shrugs + drops — release the upper traps"
      },
      {
        "name": "3. Isometrics",
        "body": "- Chin tuck isometric hold (hold the retracted position)\n- Neck side flexion isometric (hand against head, resist)\n- Deep neck flexor endurance (supine, lift head 1 inch, hold)"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Eccentric neck rotation (slow turn, 5 seconds each direction)\n- Prone neck extension (slowly raise and lower head, controlling through full ROM)\n- Serratus anterior work (the scapula is the platform the neck sits on)\n\n---"
      }
    ],
    "compensationChain": "From Compensation Chains:\n\n```\nChest tightness (sitting) → slouched shoulders → head juts forward\n  → Upper traps overwork → suboccipitals lock up\n    → Deep neck flexors go dormant → cervical instability\n```\n\n**The chain doesn't start at the neck.** Fix the T-spine and the scapula, and the neck often resolves.\n\n---",
    "fullFixPath": "1. **Assess:** Base of skull (suboccipitals), side (levator), or front (SCM)?\n2. **Check thoracic extension** — a kyphotic T-spine forces the neck into compensation\n3. **Check scapular position** — protracted scapulae = head forward\n4. **SMR:** Suboccipitals, upper traps, levator\n5. **Activate:** Deep neck flexors (chin tucks), lower traps\n6. **Strengthen:** T-spine extension, scapular control, deep neck flexor endurance\n7. **Maintain:** Posture awareness throughout the day\n\n---",
    "related": [
      "Shoulder Pain",
      "Compensation Chains",
      "Brain-Body Connection"
    ]
  },
  {
    "slug": "shoulder-pain",
    "condition": "Shoulder Pain",
    "title": "Shoulder Pain Protocol",
    "rootCause": "Shoulder pain comes from:\n1. **Poor T-spine mobility** — if the T-spine can't extend, the shoulder can't move overhead properly\n2. **Pectoral tightness** — slouched sitting shortens the pecs, pulling the shoulder forward\n3. **Serratus anterior weakness** — the scapula can't sit flat on the ribs\n4. **Lower trap dormancy** — the shoulder blade can't depress properly\n\n**The shoulder is a ball-and-socket on a floating platform (the scapula).** If the platform isn't stable and mobile, the ball can't move correctly.\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Anterior Shoulder / Impingement",
        "body": "**Where:** Pain in the front of the shoulder with overhead motion, reaching, or pressing.\n\n**Root cause:** Scapulae protract from slouched sitting → the AC joint loses centration → the subacromial space narrows → any overhead motion impinges. Tight pecs + weak lower traps + poor T-spine extension are the triad.\n\n**Fix path:** Thoracic extension (foam roller), lower trap activation, serratus anterior strengthening, then overhead work."
      },
      {
        "name": "Type 2: Rotator Cuff / Deep Pain",
        "body": "**Where:** Deep ache in the shoulder, pain with rotation, difficulty sleeping on that side.\n\n**Root cause:** The 4 rotator cuff muscles (supraspinatus, infraspinatus, teres minor, subscapularis) are chronically underloaded and deconditioned from desk work, then suddenly overloaded.\n\n**Fix path:** Isometric rotator cuff work at low intensity, slow eccentric strengthening, scapular stability."
      },
      {
        "name": "Type 3: AC Joint / Top of Shoulder",
        "body": "**Where:** Sharp pain at the top of the shoulder, pain with cross-body adduction.\n\n**Root cause:** AC joint compression from poor scapular mechanics + pecs pulling forward. The clavicle and scapula meet at an angle they weren't designed for.\n\n**Fix path:** Pec release, upper trap relaxation, scapular retraction + depression work.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR",
        "body": "- Lacrosse ball to pec minor (front of shoulder near armpit)\n- Foam roller to T-spine (extension, not flexion)\n- Lacrosse ball to upper traps and levator scapulae\n- Release serratus with massage ball (side of ribs)"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Pec isometric stretch (corner stretch, 30-second hold)\n- Lower trap squeeze (prone Y raises — can you feel the lower trap?)\n- Serratus punches (lying on back, arm reaches to ceiling, feel ribs expand)\n- \"Scapular clock\" — find full scapular ROM (elevation, depression, protraction, retraction)"
      },
      {
        "name": "3. Isometrics",
        "body": "- Wall-supported overhead hold (builds shoulder flexion without load)\n- Prone Y isometric hold (lower traps + scapular stability)\n- External rotation isometric (band at neutral, hold)"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Eccentric external rotation (band, 5-second lowering)\n- Prone Y raises (slow elevate, 3-second lower)\n- Overhead thumb taps (wall seated) — controls T-spine extension + shoulder flexion\n\n---"
      }
    ],
    "compensationChain": "From Compensation Chains:\n\n```\nSlouched sitting → pectorals shorten → upper traps overwork\n  → Scapulae protract → glenohumeral joint loses centration\n    → AC joint loads wrong → impingement with overhead motion\n```\n\n**Shoulder looks at:**\n1. Hand/Wrist — the chain starts here\n2. Neck (C-Spine) — upper trap dominance\n3. Upper back (T-Spine) — extension is a prerequisite\n4. Chest/Ribs — pec tightness, rib flare, breathing mechanics\n\n**Fix path:** Wrist → C-Spine → T-Spine → Chest/Ribs → THEN the shoulder.\n\n---",
    "fullFixPath": "1. **Assess:** Anterior (impingement), deep (rotator cuff), or AC joint?\n2. **Check T-spine extension** — can you extend your T-spine on a foam roller? If not, start here.\n3. **Check scapular control** — can you retract and depress without hiking your shoulders?\n4. **SMR:** Pec minor, upper traps, T-spine\n5. **Activate:** Lower traps, serratus anterior, deep neck flexors\n6. **Strengthen:** Scapular stability → rotator cuff → overhead → loaded\n7. **Progress:** Full shoulder flexion with T-spine integrity\n\n---",
    "related": [
      "Neck Pain",
      "Compensation Chains",
      "Core Principles"
    ]
  },
  {
    "slug": "wrist-and-elbow-pain",
    "condition": "Wrist & Elbow Pain",
    "title": "Wrist & Elbow Pain Protocol",
    "rootCause": "Wrist and elbow pain comes from:\n1. **Typing posture** — wrists in sustained extension/flexion\n2. **Shoulder & T-spine dysfunction** — if the shoulder doesn't move well, the elbow and wrist compensate\n3. **Muscle imbalance** — forearm flexors chronically shortened, extensors weak\n4. **Grip strength deficit** — weak hands = more grip tension = more forearm load\n\n---",
    "subtypes": [
      {
        "name": "Type 1: Medial Elbow (Golfer's Elbow)",
        "body": "**Where:** Pain on the inside of the elbow, worse with gripping or typing.\n\n**Root cause:** Flexor tendon overload at medial epicondyle from chronic shortening.\n\n**Fix path:** Forearm flexor SMR, eccentric wrist flexion, grip strength work."
      },
      {
        "name": "Type 2: Lateral Elbow (Tennis Elbow)",
        "body": "**Where:** Pain on the outside of the elbow.\n\n**Root cause:** Extensor tendon overload. Both tight in shortened position AND weak in lengthened position.\n\n**Fix path:** Extensor SMR, eccentric wrist extension, supination/pronation work."
      },
      {
        "name": "Type 3: Wrist Flexion Pain (Carpal Tunnel-like)",
        "body": "**Where:** Wrist pain, tingling in thumb/first two fingers.\n\n**Root cause:** Median nerve compression from tight forearm flexors + sustained wrist flexion.\n\n**Fix path:** Forearm flexor release, wrist extension stretch, nerve glides."
      },
      {
        "name": "Type 4: Thumb Pain (De Quervain's)",
        "body": "**Where:** Pain at base of thumb with pinching or gripping.\n\n**Root cause:** Abductor pollicis longus and extensor pollicis brevis overload from typing.\n\n**Fix path:** Thumb abduction/extension eccentric work, SMR to first dorsal compartment.\n\n---"
      }
    ],
    "treatmentSteps": [
      {
        "name": "1. SMR",
        "body": "- Forearm flexor release (lacrosse ball, palm side)\n- Forearm extensor release (top of forearm)\n- Hand intrinsic release (massage ball in palm)"
      },
      {
        "name": "2. Awareness / Awakening",
        "body": "- Finger yoga — individual finger isolation\n- Wrist circles — full range, both directions\n- Pronation/supination assessment"
      },
      {
        "name": "3. Isometrics",
        "body": "- Wrist flexion isometric (palm up, resist)\n- Wrist extension isometric (palm down, resist)\n- Grip holds at various intensities"
      },
      {
        "name": "4. Slow Eccentric Strengthening",
        "body": "- Eccentric wrist flexion (5-second lowering)\n- Eccentric wrist extension (5-second lowering)\n- Forearm spinner work\n- Farmer carries\n\n---"
      }
    ],
    "compensationChain": "```\nSlouched sitting → shoulders internally rotate\n  → Elbow position shifts → wrist takes load in typing\n    → Forearm flexors shorten → grip weakens\n```\n\n**The fix for wrist pain often starts at the shoulder and neck.**\n\n---",
    "fullFixPath": "1. **Assess:** Medial (golfer's), lateral (tennis), carpal, or thumb?\n2. **Check shoulder mechanics** — external rotation available?\n3. **Check typing posture** — wrist angle, elbow position\n4. **SMR:** Forearm flexors + extensors, hand intrinsics\n5. **Activate:** Extensors, grip through full ROM\n6. **Strengthen:** Eccentric work, 4-direction wrist work\n7. **Progress:** Forearm spinner, farmer carries\n\n---",
    "related": [
      "Shoulder Pain",
      "Neck Pain",
      "Compensation Chains"
    ]
  }
];
