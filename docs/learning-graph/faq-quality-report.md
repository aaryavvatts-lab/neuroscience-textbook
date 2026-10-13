---
title: FAQ Quality Report
description: Counts, Bloom's Taxonomy distribution, chapter coverage, and link checks for the From Neuron to Bedside FAQ.
---

# FAQ Quality Report

Generated: 2026-10-12
File: [Frequently Asked Questions](../faq.md)

## Overall Statistics

- **Total questions:** 75 (target 60 to 75)
- **Categories:** 12
- **Average answer length:** about 63 words (range 39 to 87). Answers are 2 to 5 sentences plus a pointer to the chapter, which is shorter than the generator skill's 100 to 300 word default on purpose, to keep the FAQ quick to scan for high school readers.
- **Answers with a link into the book:** 72 of 75 (96%)
- **Answers citing an outside source (NIH, CDC, peer-reviewed paper, etc.):** 39 of 75 (52%)
- **Chapters linked:** 16 of 16, plus the Glossary, Appendix B, About, How to Use, License, How to Cite, Contact, and Course Description pages

## Questions by Category

| Category | Questions |
|---|---|
| Getting Started | 9 |
| Brain Basics | 4 |
| Signals and Chemistry | 7 |
| Brain Anatomy | 4 |
| Senses and Movement | 7 |
| Development and the Teenage Brain | 5 |
| Learning, Memory, and Sleep | 8 |
| Emotion, Stress, and Mental Health | 7 |
| Brain Disorders and Treatments | 8 |
| How Doctors Examine the Brain | 5 |
| Brain Bee and Careers | 5 |
| Common Myths | 6 |
| **Total** | **75** |

## Bloom's Taxonomy Distribution (estimate)

Each question was assigned the level of thinking a full answer asks of the reader. These are judgment calls, not measurements.

| Level | Count | Share | Examples |
|---|---|---|---|
| Remember | 21 | 28% | "How many neurons does the human brain have?", "What is the Brain Bee?" |
| Understand | 24 | 32% | "How do neurons talk to each other across a synapse?", "What happens in the brain while I sleep?" |
| Apply | 9 | 12% | "What should I do if someone has a seizure?", "What is the best way to study, according to brain science?" |
| Analyze | 7 | 9% | "Why does the left side of the brain control the right side of the body?", "What's the difference between a CT scan and an MRI?" |
| Evaluate | 13 | 17% | All six Common Myths questions, "Is depression caused by a 'chemical imbalance'?", "Is pulling an all-nighter worth it?" |
| Create | 1 | 1% | "How can I use this book to prepare for the Brain Bee?" (building a study plan) |

The FAQ leans toward Remember and Understand, as an FAQ should, with a larger-than-usual Evaluate share because the myth-busting questions ask readers to weigh evidence. Create-level work lives in each chapter's exercises rather than here.

## Chapter Coverage

| Chapter | FAQ questions that link to it |
|---|---|
| 1. Neurons, Glia, and the Nervous System | 5 (neurons, glia, blood-brain barrier, myelin/MS, 10% myth) |
| 2. The Action Potential | 5 (MicroSim, action potential, speed, rate coding, local anesthetics) |
| 3. Synapses and Neurotransmitters | 3 (synapse, dopamine, caffeine) |
| 4. Neuroanatomy | 3 (lobes, Phineas Gage, brain size myth) |
| 5. Vision | 1 (blind spot) |
| 6. Hearing, Touch, Taste, Smell, and Pain | 4 (senses, tongue map, gate control, phantom limb) |
| 7. Movement | 4 (crossing rule, cerebellum, reflexes, Parkinson's) |
| 8. The Developing and Teenage Brain | 4 (age 25, risk-taking, pruning, FASD) |
| 9. Learning, Memory, and Neuroplasticity | 6 (Ply/Aplysia, memory, H.M., plasticity, studying, learning styles) |
| 10. Sleep and Brain States | 4 (all-nighters, teen sleep, sleep stages, narcolepsy) |
| 11. Emotion, Stress, and the Body | 3 (amygdala, stress response, PTSD) |
| 12. Language, Attention, and Decision-Making | 1 (left/right brain myth) |
| 13. Aging and Neurodegeneration | 3 (dementia, Alzheimer's treatment, ALS/Huntington's) |
| 14. Brain Injury, Stroke, and Epilepsy | 4 (stroke, concussion, seizure first aid, epilepsy) |
| 15. Psychiatric Disorders and Addiction | 6 (vaping, depression, prevalence/stigma, addiction, naloxone, plus crisis lines) |
| 16. How Doctors Examine the Brain | 6 (neuro exam, localization, CT vs MRI, brain scans, lumbar puncture, Brain Bee prep) |

**Glossary concept coverage:** 90 of the 253 glossary terms (36%) appear by name in the FAQ. Many more are covered in substance under a different wording (for example "agonist and antagonist," "all-or-none principle," and "anti-amyloid antibody"), so real coverage is somewhat higher. This is below the generator skill's 60% target because the FAQ was built around questions students actually ask, not around the concept list.

## Link Verification

- Checked with `logs/check-faq.py` (verifies that each relative link's file exists and that each `#anchor` matches a heading in the target file under MkDocs slug rules).
- **Final result:** 88 relative links, 81 with section anchors, **0 broken**.
- Section anchors were used at the author's request so readers land on the right section. The anchors include section numbers (for example `#16-myelin-...`), so **if chapter headings are renamed or renumbered, rerun `python3 logs/check-faq.py`**.
- External links (42 unique URLs) were opened during fact-checking. See `logs/faq-factcheck.md`.

## Accuracy and Safety

- Every statistic and date was checked against a primary or authoritative source. See `logs/faq-factcheck.md` for the full log.
- No doses, no treatment instructions beyond public first-aid guidance from the CDC, and a "Not medical advice" notice at the top of the page.
- Crisis resources (988 and the SAMHSA National Helpline, 1-800-662-4357) appear in the mental health section and the opening notice.
- Language is person-first and non-stigmatizing (for example "people with schizophrenia," "addiction is treatable," "PTSD is not a sign of weakness").

## Suggested Additional Questions

These topics are in the book but not in the FAQ yet. Good candidates for a future update:

1. "What is aphasia, and does it affect intelligence?" (Chapter 12)
2. "Are ADHD and autism real medical conditions?" (Chapter 15)
3. "Does schizophrenia mean having a split personality?" (Chapter 15)
4. "What did split-brain studies show?" (Chapter 12)
5. "What is an EEG, and what are brain waves?" (Chapters 10 and 16)
6. "What is myasthenia gravis?" (Chapter 3)
7. "Why does damage behind the optic chiasm affect both eyes?" (Chapter 5)
8. "What is neglect syndrome?" (Chapter 12)
9. "Is multitasking a myth?" (Chapter 12)
10. "What is CTE?" (Chapter 14; already fact-checked, cut only for length)
