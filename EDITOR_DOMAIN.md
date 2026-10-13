# Domain: Introductory neuroscience and clinical neurology for high school students

This brief is for the `science-editor` skill (and any human editor). It describes this manuscript, the reader, what must never be blurred, and what counts as ground truth.

## What the manuscript is

- **Format:** MkDocs Material site. Markdown in `docs/`. 16 chapters at `docs/chapters/NN-slug/index.md`, each with `quiz.md` and `references.md`. Two appendices in `docs/appendices/`. There's a glossary (`docs/glossary.md`), an FAQ (`docs/faq.md`), and 16 p5.js MicroSims in `docs/sims/<sim>/` (`main.html`, `<sim>.js`, `index.md`, `metadata.json`).
- **Supporting material:**
  - `Materials/` holds the course description, design principles, concept list, chapter plan, and source rules.
  - `docs/learning-graph/` holds the 253-concept prerequisite graph.
  - `CLAUDE.md` holds house rules.
- **The one question the book answers:** how does the nervous system work, from a single neuron to the hospital bedside, and how do doctors use that knowledge to find and treat disease?

## The reader (this replaces the skill's default reader)

The skill's default reader holds a graduate degree. **This book's reader does not.** Edit for this reader instead:

- A U.S. high school student (grades 9 to 12) with one year of biology and basic algebra. Some will be preparing for the Brain Bee, and some want to become doctors.
- Bright and motivated, but new to every term in this field.

The two consequences still hold:

1. **Never assume domain knowledge.** Define every term before or where it is used, in plain words, with an example. Don't write "as is well known."
2. **Never trade truth for simplicity.** A simplification is allowed only if it is still true at the level stated, and the text says where the simple picture stops working. A simplification that becomes false is a blocking defect. Condescension is also a defect.

## The five-part standard, adapted for this book

The skill's standard is "prove, do not assert." For a high school science text, use these five parts in place of formal proof. Every substantive claim must have them:

1. **A precise statement.** Turn loose claims into exact ones. "Dopamine is the pleasure chemical" is loose and false. "Dopamine signals help the brain learn which actions lead to rewards and drive wanting" is precise.
2. **Every term defined**, with a concrete example.
3. **The mechanism shown in the smallest case.** Show the cause-and-effect chain (for example, ions moving through one channel, or one synapse) rather than just naming the result. If a number is involved, show where it comes from.
4. **The limit or caveat.** Every analogy says where it breaks. Every generalization says when it fails ("most," "typically," "in most right-handed people"). Every treatment says what it cannot do.
5. **A tie to something concrete:** a MicroSim, a Bedside case, a real number with its source, or a named study.

## Results and ideas that must never be blurred

Each of these pairs gets run together in popular writing. A passage that blurs one is a blocking defect.

- **Correlation vs causation** (brain imaging studies, screen time, and so on).
- **FDA "approved" vs "accelerated approval" vs "cleared" (510(k)) vs "Breakthrough designation" vs "investigational."** These are different regulatory statuses.
- **Statistical significance vs clinical meaningfulness** (for example, anti-amyloid antibodies modestly slow decline; they are not cures).
- **Action potential (all-or-none)** vs **graded potential** (EPSP and IPSP).
- **Upper vs lower motor neuron** signs.
- **Ischemic vs hemorrhagic** stroke.
- **Neurodiversity framing vs disorder framing.** Use the person-first or identity-first language that the community in question prefers, and say so.
- **Fictional composite cases vs real historical patients** (H.M. and Phineas Gage are real).
- **Mouse or animal findings vs human findings.**

## Canonical values (the prose must match these everywhere)

- Resting potential about −70 mV. Threshold about −55 mV (it varies by neuron type). Action potential peak about +30 to +40 mV. Undershoot about −80 mV.
- Human brain: around 86 billion neurons (Azevedo et al., 2009), and roughly as many non-neuronal cells.
- *Aplysia*: about 20,000 neurons (Nobel Prize 2000 press materials).
- Brain Bee founded 1998 by Dr. Norbert Myslinski (International Brain Bee "About" page).
- Phineas Gage: September 13, 1848. The tamping iron damaged mainly the left frontal lobe (Ratiu 2004; Van Horn 2012).
- Patient H.M. (Henry Molaison): surgery in 1953; died in 2008.
- Kandel's Nobel Prize: 2000, shared with Arvid Carlsson and Paul Greengard.
- Teens need 8 to 10 hours of sleep per night (AASM, ages 13 to 18).
- Stroke signs: BE FAST. Crisis line: 988. SAMHSA National Helpline: 1-800-662-4357.
- Lancet Neurology 2024 (GBD 2021): about 3.4 billion people (43%) affected by nervous system conditions.

## Primary sources and the currency rule

- **Preferred sources:**
  - U.S. government health pages: NINDS, NIMH, NIA, NIDA, NEI, NIDCD, CDC, FDA
  - peer-reviewed papers (PubMed / PMC)
  - OpenStax *Introduction to Behavioral Neuroscience* (CC BY-NC-SA)
- **Never repair a citation from memory.** Open the source and confirm it says what the text claims. If you can't open it, mark it unverified and remove or soften the claim.
- **Currency rule (as of October 2026):**
  - Any statistic must be the most recent figure the source publishes. If a newer survey year exists (NIMH/NSDUH, CDC NYTS/YRBS, autism or ADHD prevalence), update the number and its year.
  - Any drug, device, or trial status must be current as of October 2026.
  - Remove or replace outdated framing, for example older diagnostic criteria or superseded guidelines.
  - Each time-sensitive statement says "as of 2026" or gives its year.

## The running examples

- **Maya:** a 16-year-old soccer player studying for the Brain Bee. She appears in chapter hooks.
- **Ply:** an *Aplysia* sea slug and the mascot, speaking in first person in admonitions.
- **Bedside cases:** fictional composites unless explicitly historical.

## Conventions

- Chapter page shape, in order: Summary, Concepts Covered, Prerequisites, sections N.x, MicroSim (`#### Diagram:`), At the Bedside, Common Misconceptions, Brain Bee Practice, Exercises (1 to 12 across Bloom's levels), Key Takeaways.
- Headings are frozen, because other pages link to their anchors.
- Writing style: plain words, no em or en dashes in prose, no hype, reading level grade 9 to 11.
- Math: inline `\( \)` and display `$$`. Never single `$`.
- No medication doses and no personal medical advice. Every Bedside case ends with the disclaimer line.
- Hardening checks to re-run after edits:
  - `python3 logs/check-chapters.py`
  - `python3 logs/compare-facts.py <backup> <file>` (only where a fact change is intended and sourced)
  - `mkdocs build --strict`
