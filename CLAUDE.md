# From Neuron to Bedside: Project Instructions

An interactive, free, open neuroscience textbook for high school students and future doctors.
It's aligned to the topics tested in the Brain Bee, and every chapter ends at the bedside with a clinical case.
Author: Aaryav Sharma. Built with Dan McCreary's intelligent-textbook framework.

Read `Materials/textbook-design-principles.md` before generating any chapter content.

## Audience and voice

- **Primary readers:** students in grades 9–12. Most have had one year of high school biology and no chemistry beyond the basics.
- **Secondary readers:** Brain Bee competitors, pre-med undergraduates who want an intuitive first pass, and teachers running a neuroscience elective or club.
- **Reading level:** Flesch-Kincaid grade 9–11. Short sentences. Define every term the first time it appears, in plain words, before using the technical name.
- **Tone:** curious, warm, precise. Treat the reader as a future scientist or doctor, not as a child.
- **Never** use jargon to sound smart. If a sentence would confuse a smart 15-year-old, rewrite it.

## Accuracy rules (non-negotiable)

1. **Never invent statistics, studies, quotes, or citations.** Every number must have a real, linked source. Prefer NIH/NINDS, CDC, WHO, peer-reviewed reviews, and the Lancet/GBD studies. If you are not sure a source exists, write `[CITATION NEEDED]` and keep going. Do not guess.
2. **Clinical cases are fictional composites.** Never present a case as a real patient. Classic historical cases (Patient H.M., Phineas Gage) may be named because they are well documented in the literature.
3. **Not medical advice.** Every Bedside case ends with the standard line: *"This is a fictional teaching case. It is not medical advice. If you or someone you know has symptoms like these, talk to a doctor."*
4. **Drug and therapy names** must be accurate as of the writing date, with approval status stated carefully. Example: "tofersen received FDA accelerated approval in 2023 for SOD1-ALS." Do not call investigational therapies "approved."
5. **Brain Facts (SfN)** is "All rights reserved." Use it only as a map of which topics to cover. Never copy its text, figures, or question wording.
6. **Open sources we can adapt (with attribution):** OpenStax *Introduction to Behavioral Neuroscience* (CC BY-NC-SA 4.0), NIH/NINDS pages (US government work, public domain unless marked otherwise), Wikipedia (CC BY-SA, reference only). See `Materials/sources.md`.
7. Check that every code block or MicroSim actually runs.

## Every chapter MUST include (in this order)

1. **Hook:** a 1–2 paragraph real-world story or question (not a toy example).
2. **Intuition first:** explain the idea with an everyday analogy *before* naming structures or giving numbers.
3. **Core science:** sections with the actual neuroscience, using the concepts assigned by the learning graph.
4. **At least one MicroSim** (`#### Diagram:` spec block, p5.js), using the idea listed in `Materials/chapter-plan.md`.
5. **Bedside case:** use the template below.
6. **Common Misconceptions:** 3–5 myths with corrections (e.g., "we only use 10% of our brain").
7. **Brain Bee Practice:** 5 short-answer questions in the style of a Brain Bee oral round, with answers in a collapsible block.
8. **Exercises:** 12 total, 2 per Bloom's level (Remember, Understand, Apply, Analyze, Evaluate, Create).
9. **Key Takeaways:** 5–7 bullets.

## Bedside case template

```markdown
## At the Bedside: <Case title>

!!! note "Meet the patient"
    <Age, setting, and what the patient or family notices, in plain language.>

**What the doctor checks:** <exam findings / tests>
**Where is the problem? (localization):** <reasoning from symptoms to the brain structure>
**Diagnosis:** <condition>
**Why it happens:** <link back to this chapter's science>
**Treatment today:** <standard care>
**What's new in research:** <one current advance, with a real citation>

??? question "Your turn: diagnose a variation"
    <A short twist on the case for the reader to reason through, with the answer.>

*This is a fictional teaching case. It is not medical advice. If you or someone you know has symptoms like these, talk to a doctor.*
```

## Learning mascot: Ply the Sea Slug

- **Who:** Ply is an *Aplysia californica* sea slug, the animal Eric Kandel used to discover how memories form at synapses (Nobel Prize, 2000). Purple-red, round, friendly, with two "ear-like" rhinophores.
- **Catchphrase:** "Every big idea starts at a single synapse!"
- **Voice:** encouraging, curious, and a little funny about being a slug with only ~20,000 neurons.
- **Admonition types:** `mascot-welcome` (chapter opening, exactly 1), `mascot-thinking` (key idea, 1–3), `mascot-tip` (0–2), `mascot-warning` (common mistake, 0–2), `mascot-encourage` (hard part, 0–2), `mascot-celebration` (end, 0–1).
- **Rules:** at most 6 Ply admonitions per chapter, never back-to-back, and 1–3 sentences each. Never decorative: each one must teach or support something.
- **Image placement:** put the image in the admonition body, never in the title.
  `![Ply waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }`

## Running examples

- **"Maya's brain"** (Chapters 1–16): a fictional high school junior whose ordinary day (waking up, driving, studying, soccer practice, a stressful test, sleeping) is used to open chapters and connect systems. Keep her details consistent: she's 16, plays soccer, and is studying for the Brain Bee.
- **The Aplysia** for cellular learning (Chapters 1–3, 9).

## Learning graph taxonomy codes

Use these exact codes in `learning-graph.csv`:

`FOUND | CELL | SIG | ANAT | SENS | MOTOR | DEV | COG | STATE | DIS | CLIN | RES`

| Code | Meaning |
|------|---------|
| FOUND | Foundational biology/chemistry needed first |
| CELL | Neurons, glia, cell biology of the nervous system |
| SIG | Electrical and chemical signaling |
| ANAT | Neuroanatomy |
| SENS | Sensory systems and pain |
| MOTOR | Movement and motor control |
| DEV | Development, adolescence, aging |
| COG | Learning, memory, language, decision-making |
| STATE | Sleep, emotion, stress, consciousness |
| DIS | Disorders and diseases |
| CLIN | Clinical exam, imaging, diagnosis, treatment |
| RES | Research methods, tools, careers |

## MkDocs notes

- `site_name`: From Neuron to Bedside
- `site_author`: Aaryav Sharma
- `site_url`: https://<github-username>.github.io/neuroscience-textbook/  (fill in the real username)
- Do not add `navigation.tabs`; use side navigation only.
- After adding each chapter's `index.md`, update the `nav:` section of `mkdocs.yml`.
- Keep `.claude/`, `logs/`, and `site/` out of git.
- License: CC BY-NC-SA 4.0. Every page footer shows the copyright line.
