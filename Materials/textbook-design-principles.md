# Textbook Design Principles: Going Beyond Brain Facts

This document explains exactly how *From Neuron to Bedside* aims to be a better learning resource than what high school neuroscience students have today. It's the contract every generated chapter must follow. (This mirrors the "Exceeding CS224W" document Anvith Pothula used for his Graph Neural Networks textbook.)

---

## The core argument

*Brain Facts* (Society for Neuroscience, 8th edition, 2018) is an excellent, trustworthy primer, and it's the official study source for most English-speaking Brain Bee chapters. But it was designed as a reference booklet, not a course:

- It's a static PDF. Nothing moves, and you can't experiment.
- It has no practice questions, no answers, no exercises, and no feedback.
- It explains *what* is true but rarely builds intuition for *why*.
- It doesn't teach the clinical reasoning tested in the higher Brain Bee rounds (patient diagnosis, neuroanatomy, brain imaging).
- It's 8 years old, and neuroscience and neurology have moved fast since 2018 (anti-amyloid antibodies, antisense therapies, gene therapy, brain-computer interfaces).
- Interactive prep exists, but it's paid ($450-$900 for commercial camps). That's an equity problem.

This textbook keeps the trustworthiness and broad coverage, and adds everything a self-directed high school student needs.

---

## Dimension 1: Intuition before terminology

**Problem:** Neuroscience is a vocabulary avalanche. Students memorize "depolarization" without understanding it.

**Solution:** Every new idea starts with an everyday analogy before any technical word appears. For example, the neuron's resting potential is first explained as "a battery charged by pumps that keep salt on one side of a wall," and only then given the name and the −70 mV value.

## Dimension 2: Interactive MicroSims for every chapter

**Problem:** You can't watch an action potential in a PDF.

**Solution:** Every chapter has at least one p5.js simulation the student controls. For example:

| Chapter | MicroSim |
|---|---|
| 2 | Action potential simulator: adjust Na⁺/K⁺ levels, add lidocaine or a toxin, watch the spike change |
| 4 | Clickable brain atlas: click a region, see its function and what happens when it's damaged |
| 5 | Visual pathway lesion simulator: cut the pathway at different points, see the visual field loss |
| 7 | Reflex arc and basal ganglia "gas pedal / brake" model |
| 10 | Hypnogram builder: drag sleep stages across a night, see EEG waves change |
| 14 | Stroke territory map: block an artery, see which body functions are affected |
| 16 | MRI slice viewer and neuro-exam decision tree |

Each MicroSim can be embedded anywhere with an iframe, so teachers can reuse them.

## Dimension 3: Every chapter ends at the bedside

**Problem:** Students (and future doctors) rarely see how basic neuroscience explains real illness.

**Solution:** Each chapter has a fictional composite **Bedside case**. Students follow the doctor's reasoning: symptoms → exam → *where is the problem?* → diagnosis → why it happens → treatment → what's new. This is the main pre-med feature, and it directly trains the "patient diagnosis" skill tested in higher Brain Bee rounds.

## Dimension 4: Practice and feedback built in

**Problem:** There's no free, structured way to check understanding.

**Solution:** Every chapter has:

- 10 auto-graded multiple-choice quiz questions with explanations
- 5 Brain Bee-style short-answer questions with hidden answers
- 12 exercises spread across all six Bloom's levels
- A "Common Misconceptions" section that busts myths like the 10% myth and "left-brained vs. right-brained"

## Dimension 5: A learning graph, so nothing is used before it's taught

**Problem:** Students hit "neurotransmitter" or "receptor" before anyone explains it.

**Solution:** About 250 concepts are arranged in a prerequisite graph (a DAG). Chapters are ordered so every concept is introduced before it's used, and students can explore the graph visually.

## Dimension 6: Current science, carefully sourced

**Problem:** Medical science changes fast, and mistakes can slip into any text.

**Solution:**

- Every statistic links to a real source (NIH/NINDS, CDC, WHO, peer-reviewed reviews).
- Each "What's new in research" box names a real, verifiable advance and states its approval status carefully.
- There's a mandatory human fact-check pass and an outside expert review before v1.0.
- Wording on investigational therapies is never stronger than the evidence.

## Dimension 7: Written for teenagers, about teenagers

**Problem:** Most neuroscience texts are written for college students.

**Solution:**

- Reading level is grade 9 to 11.
- A running example, Maya, a 16-year-old soccer player studying for the Brain Bee, makes every system personal.
- Topics teens care about get real attention: sleep and screens, concussions in sports, the teenage brain and risk, vaping and addiction, stress before tests.

## Dimension 8: Free and open forever

It's licensed CC BY-NC-SA 4.0 and hosted free on GitHub Pages. No accounts, no paywall, no ads, and it works on a phone. Anyone can fix a typo or suggest an improvement through GitHub.

---

## Summary: the design contract

Every chapter MUST:

- ✅ Open with a real-world hook (often through Maya)
- ✅ Give an everyday analogy **before** technical terms
- ✅ Cover all concepts assigned by the learning graph
- ✅ Include at least one MicroSim spec (`#### Diagram:`) with p5.js notes
- ✅ Include an "At the Bedside" clinical case using the template in `CLAUDE.md`
- ✅ Include "Common Misconceptions" (3 to 5)
- ✅ Include "Brain Bee Practice" (5 questions with hidden answers)
- ✅ End with 12 exercises across all 6 Bloom's levels and 5 to 7 Key Takeaways
- ✅ Cite real sources for every statistic, with no invented citations
- ✅ Stay within Ply-mascot limits (≤6 per chapter, never back-to-back)

When in doubt, ask: *would a curious 15-year-old with one year of biology understand this, and would a future doctor find it useful?* If either answer is no, rewrite it.
