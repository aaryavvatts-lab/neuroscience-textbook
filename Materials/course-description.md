# Course Description: From Neuron to Bedside

## Course Title

**From Neuron to Bedside: An Interactive Neuroscience Textbook for High School Students and Future Doctors**

## Inspiration and Standard

Most high schools teach little or no neuroscience. Students who want to learn it, including thousands who compete in the Brain Bee each year, usually study from a free but static booklet (the Society for Neuroscience's *Brain Facts*, 2018). The only interactive prep options cost hundreds of dollars. The higher rounds of the Brain Bee also test skills no free resource teaches: neuroanatomy identification, patient diagnosis, and reading brain scans.

This textbook covers the same core topics, then goes further. It explains each idea with an intuition-first approach, makes it hands-on with interactive simulations, and connects it to medicine through a clinical case in every chapter. It is free, open, and written for high school students, including those who have never taken a neuroscience class.

See `textbook-design-principles.md` for the full design contract.

## Overview

The human brain has about 86 billion neurons, and neurological conditions are now the leading cause of illness and disability worldwide, affecting about 3.4 billion people (Lancet Neurology, 2024). This course takes students from a single neuron to the hospital bedside.

Students start by learning how neurons and glia are built and how they send electrical and chemical signals. They then tour the brain's anatomy and see how the senses, movement, sleep, emotion, memory, and language emerge from it. They also study how the brain develops through the teenage years and how it ages.

Each chapter ends with a fictional patient whose symptoms the student learns to trace back to a specific part of the nervous system: a soccer player with a concussion, a grandparent with a stroke, a teenager with a seizure, a patient with Parkinson's disease. The final chapter teaches how doctors actually examine the brain, through the neurological exam, MRI, CT, EEG, and PET. This prepares students for the diagnosis rounds of the Brain Bee and gives future doctors an early start on clinical reasoning.

Every chapter includes interactive p5.js simulations (MicroSims), Brain Bee-style practice questions, common misconceptions, and exercises across all six levels of Bloom's Taxonomy.

**Topics include:**

- Neurons, glia, and the organization of the nervous system
- The action potential and synaptic transmission
- Neurotransmitters and how drugs act on them
- Neuroanatomy of the brain, spinal cord, and cranial nerves
- Vision, hearing, touch, taste, smell, and pain
- Motor control, reflexes, the basal ganglia, and the cerebellum
- Brain development, the adolescent brain, and the aging brain
- Learning, memory, and neuroplasticity
- Sleep, circadian rhythms, emotion, and stress
- Language, attention, and decision-making
- Neurodegenerative disease (Alzheimer's, Parkinson's, ALS, Huntington's)
- Stroke, traumatic brain injury and concussion, and epilepsy
- Psychiatric and developmental disorders, and addiction
- The neurological exam and brain imaging
- Research methods and careers in neuroscience and medicine

## Target Audience

- **High school students (grades 9–12)** who are curious about the brain, considering medicine or science, or preparing for the Brain Bee
- **Teachers** running a neuroscience elective, an AP Biology or AP Psychology unit on the nervous system, or a science club
- **Early undergraduates and pre-med students** who want an intuitive, clinically connected first pass before a college neuroscience course

## Prerequisites

### Required
- One year of high school biology (cells, DNA, proteins, cell membranes)
- Basic algebra (reading graphs, ratios, simple equations)

### Helpful but taught where needed
- Basic chemistry (ions, charge, concentration gradients), reviewed in Chapter 1
- No programming is required. MicroSims run in the browser.

## Chapter Structure (16 chapters + 2 appendices)

| Chapter | Title | Bedside case |
|---|---|---|
| 1 | Neurons, Glia, and the Nervous System | Multiple sclerosis |
| 2 | The Action Potential | Local anesthetics and nerve block |
| 3 | Synapses and Neurotransmitters | Myasthenia gravis |
| 4 | A Tour of the Brain: Neuroanatomy | Phineas Gage and frontal lobe injury |
| 5 | Vision | Visual field loss from a pituitary tumor |
| 6 | Hearing, Touch, Taste, Smell, and Pain | Phantom limb pain |
| 7 | Movement: Muscles, Reflexes, and Motor Control | Parkinson's disease |
| 8 | The Developing and Teenage Brain | Fetal alcohol spectrum disorder and adolescent risk-taking |
| 9 | Learning, Memory, and Neuroplasticity | Patient H.M. and amnesia |
| 10 | Sleep and Brain States | Narcolepsy |
| 11 | Emotion, Stress, and the Body | Post-traumatic stress disorder |
| 12 | Language, Attention, and Decision-Making | Broca's and Wernicke's aphasia |
| 13 | The Aging Brain and Neurodegeneration | Alzheimer's disease and ALS |
| 14 | Brain Injury, Stroke, and Epilepsy | A high school soccer player's concussion; stroke (BE-FAST) |
| 15 | Psychiatric Disorders, Developmental Disorders, and Addiction | Opioid overdose and naloxone |
| 16 | How Doctors Examine the Brain | Putting it together: a full neurological workup |
| A | Brain Bee Strategy and Mock Exam | — |
| B | Careers in Neuroscience and Medicine | — |

## Topics Not Covered

- Advanced electrophysiology mathematics (e.g., full Hodgkin–Huxley differential equations). The simulations show the behavior, and the equations are mentioned only as enrichment.
- Detailed pharmacology dosing, prescribing, or any treatment recommendations for individuals
- Computational neuroscience and neural network programming
- Comparative neuroanatomy beyond the sea slug *Aplysia* and brief animal-model examples
- Philosophy of mind, beyond a short discussion of consciousness

## Learning Objectives

Using Bloom's Taxonomy (2001 revision), students who complete this textbook will be able to:

### Remember (Level 1)
- Identify the parts of a neuron (dendrites, soma, axon, axon terminals, myelin, nodes of Ranvier) and the main types of glia
- Name the four lobes of the cerebral cortex, the brainstem, the cerebellum, and key deep structures (thalamus, hypothalamus, hippocampus, amygdala, basal ganglia)
- List the major neurotransmitters (glutamate, GABA, dopamine, serotonin, acetylcholine, norepinephrine) and one main function of each
- Recall the stages of sleep and the warning signs of stroke (BE-FAST)

### Understand (Level 2)
- Explain how ion gradients and voltage-gated channels produce an action potential
- Describe how a chemical synapse converts an electrical signal into a chemical one and back
- Explain why myelin speeds conduction, and why losing it causes symptoms
- Summarize how the adolescent brain differs from the adult brain and why that matters for decision-making
- Describe how long-term potentiation supports learning and memory

### Apply (Level 3)
- Use a simulation to predict how changing ion concentrations or blocking a channel alters an action potential
- Trace a sensory signal (for example, touching a hot stove) from receptor to cortex and back to muscle
- Apply the BE-FAST checklist to a described scenario to decide whether it suggests a stroke
- Match a drug or toxin (lidocaine, botulinum toxin, SSRIs, opioids, naloxone) to the step of signaling it affects

### Analyze (Level 4)
- Localize a lesion: given a set of symptoms, determine which part of the nervous system is most likely affected
- Compare how Alzheimer's disease, Parkinson's disease, and ALS damage different cell populations, and how that produces different symptoms
- Distinguish correlation from causation in a brain-imaging or behavior study
- Interpret a simple EEG hypnogram, visual field map, or MRI slice

### Evaluate (Level 5)
- Critique a popular claim about the brain (for example, "left-brained vs. right-brained people" or brain-training apps) using evidence
- Judge the strengths and limits of different brain-imaging methods (MRI, fMRI, CT, EEG, PET) for a given clinical question
- Weigh the benefits, risks, and ethical questions of a new neurological therapy, such as gene therapy or brain-computer interfaces

### Create (Level 6)
- Design a simple experiment to test a hypothesis about sleep, memory, or attention in teenagers
- Write a fictional clinical case that a classmate must diagnose, including symptoms, exam findings, and a localization
- Propose a public-awareness message about concussion, stroke signs, or substance use that is accurate and grounded in neuroscience
