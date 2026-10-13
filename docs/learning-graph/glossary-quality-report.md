---
title: Glossary Quality Report
description: ISO 11179 compliance self-assessment, coverage counts, and open questions for the From Neuron to Bedside glossary.
---

# Glossary Quality Report

This report covers `docs/glossary.md`. All counts come from `logs/check-glossary.py`, which passes with no errors.

## Summary

| Metric | Value |
|--------|-------|
| Concepts in `Materials/concept-list.md` | 253 |
| Glossary terms (H4 headings) | 253 (100% coverage, no extra terms) |
| Terms with an **Example:** | 253 (100%) |
| Terms with a "Taught in" chapter link | 253 (100%) |
| "See also" cross-references | 347 total, 0 broken |
| Alphabetical order | 100% (case-insensitive, checked across the whole file) |
| Average definition length | 22 words (range 7 to 37; none over 50) |
| Circular definitions found | 0 |

### Headings that expand the concept label

Six labels were shortened to fit the 32-character limit, so the glossary heading spells them out:

- Excitatory Postsynaptic Pot. → **Excitatory Postsynaptic Potential (EPSP)**
- Inhibitory Postsynaptic Pot. → **Inhibitory Postsynaptic Potential (IPSP)**
- Chronic Traumatic Enceph. → **Chronic Traumatic Encephalopathy (CTE)**
- Fetal Alcohol Spectrum → **Fetal Alcohol Spectrum Disorders (FASD)**
- Scientific Method in Neuro → **Scientific Method in Neuroscience**
- ADHD → **Attention-Deficit/Hyperactivity Disorder (ADHD)**

Some other headings add an expansion in parentheses after the full label. Examples are GABA (Gamma-Aminobutyric Acid), HPA Axis (Hypothalamic-Pituitary-Adrenal Axis), NREM/REM Sleep, PET Scan (Positron Emission Tomography), Magnetic Resonance Imaging (MRI), Functional MRI (fMRI), ALS, TBI, PTSD, ASD and BCI.

## ISO 11179 self-assessment

| Criterion | Score (out of 25) | Notes |
|-----------|-------------------|-------|
| Precision | 23 | Each definition is written for the way the term is used in this course. Clinical terms were checked against standard references. Approval dates for drugs and therapies were confirmed by web search on 2026-10-12. |
| Conciseness | 23 | Every definition is one or two sentences (average 22 words). Terms that pair two ideas, such as "Rods and Cones", "Agonist and Antagonist" and "Ventral and Dorsal Streams", run longer (30 to 37 words) because they define both halves. |
| Distinctiveness | 24 | Close pairs say how they differ. Examples are short-term vs working memory, learning vs memory, stroke vs ischemic vs hemorrhagic stroke, and nociception vs pain pathway. The text is original and not copied from Brain Facts or any other source. |
| Non-circularity | 24 | No definition uses its own term to define itself. The two-part entries define each half in independent terms. Sympathetic vs Parasympathetic does not rely on "fight or flight". |
| Free of business rules | 22 | Definitions describe what things are, not policies. A few entries are guidance or criteria by nature, such as Seizure First Aid, BE-FAST, Return-to-Learn and Play, Teen Sleep Needs (8 to 10 hours) and Depression (at least two weeks). Their definitions keep the factual or diagnostic core, and advice such as "call 911 after 5 minutes" sits only in the examples. |
| **Overall** | **~93/100** | Above the skill's 85-point target. |

## Readability

- **Estimated Flesch-Kincaid grade:** about 10.1 for examples, 12.8 for definitions and 11.5 overall. These come from a rough syllable-count script.
- Definitions score higher than the target band (grades 9 to 11). ISO style favors one-sentence definitions, and each one must name a technical term (for example, "voltage-gated", "neurodegenerative", "cerebrospinal"). Examples stay in the target band.
- Appropriate for audience: **Yes, with caveats.** If the editor wants definitions at grade 11 or below, the best fix is to split the longest definitions into two sentences.

## Format notes and deviations from the skill

- The glossary-generator skill says to use only `####` headings and no letter grouping. The lead editor asked for an A-Z jump bar with `## A`, `## B`, … sections. I followed the editor. Terms are still a flat alphabetical list, and the letter headings only mark where each letter starts.
- Each entry ends with a `*Taught in [Chapter N](...)*` line. That line was added at the editor's request and is not part of the skill's format.

## Chapter links to double-check

- **Appendix concepts (247 to 253):** I chose where each one links. The editor may want to move some of them.
    - Scientific Method in Neuroscience → Chapter 9
    - Animal Models → Chapter 9 (the *Aplysia* work)
    - Research Ethics → Chapter 9 (Patient H.M., consent)
    - Correlation vs Causation → Chapter 16 (interpreting fMRI)
    - Brain-Computer Interface → Chapter 16
    - Neuroscience Careers and Pre-Med Pathway → `appendices/careers.md`
- **Pages that don't exist yet:** `docs/appendices/careers.md` and every chapter `index.md` are still missing. These links will show as broken in `mkdocs build --strict` until those pages are written.

## Terms and facts I was less sure of

- **Chronic Traumatic Encephalopathy:** The glossary says CTE "can currently be confirmed only after death." This is still the standard view, and research criteria for diagnosing it in living people exist. Re-check before publishing.
- **Anti-Amyloid Antibody:** Lecanemab got traditional FDA approval in July 2023 (after accelerated approval in January 2023). Donanemab was approved in July 2024. Both are for early Alzheimer's disease (MCI or mild dementia with confirmed amyloid). The glossary says they "modestly slow decline" and need MRI monitoring for ARIA.
- **Antisense Oligonucleotide:** Tofersen (Qalsody) received FDA accelerated approval on April 25, 2023, for SOD1-ALS.
- **Gene Therapy:** Zolgensma was FDA-approved in 2019 for children under 2 with spinal muscular atrophy. The glossary says "young children".
- **Clot-Busting Treatment:** Names alteplase and tenecteplase. Tenecteplase (TNKase) was FDA-approved for acute ischemic stroke in March 2025.
- **Naloxone:** Says the nasal spray has been sold without a prescription in the US "since 2023". The FDA approved it for over-the-counter sale in March 2023, and it reached stores later that year.
- **Numbers used:** Only well-established figures appear:
    - resting potential about −70 mV and threshold about −55 mV ("often around")
    - 3 Na⁺ out / 2 K⁺ in
    - action potential 1 to 2 ms
    - sleep cycle about 90 minutes
    - teen sleep 8 to 10 hours (AASM recommendation for ages 13 to 18)
    - Huntington's inheritance 50%
    - seizure first aid 5 minutes (CDC guidance)
    - H.M. surgery 1953, Phineas Gage 1848, Kandel's Nobel Prize 2000

    None has a linked source inside the glossary. The chapters that teach these terms should carry the citations.
- **Teen Sleep Needs:** The definition includes "sleep experts recommend 8 to 10 hours," which is close to a recommendation rather than a definition. Keep it or move it into the example.
- **Deep Brain Stimulation:** I avoided listing the exact FDA indications and said only that it can help some people with Parkinson's disease.
- **Brain-Computer Interface:** Described as being in clinical trials. Update this if a BCI device gets FDA market authorization.

## Language choices

- Uses person-first or identity-respecting wording: "a person with schizophrenia", "a teen with depression", "a person with an opioid use disorder", and "autistic person" (which many autistic people prefer). Disorders are described as treatable medical conditions.
- Maya appears only in examples that match her canon details (she is 16 and plays soccer).
