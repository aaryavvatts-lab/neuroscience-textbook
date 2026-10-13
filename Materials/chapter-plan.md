# Chapter Plan: From Neuron to Bedside

Pass this file to the `chapter-content-generator` skill with each chapter, for example:

```
Run the chapter-content-generator skill on chapter 2 @docs/chapters/02-*/index.md
using @Materials/chapter-plan.md (Chapter 2 section) and @Materials/sources.md as source material
```

Each chapter lists: **Hook** · **Bedside case** · **Flagship MicroSim** (the v1.0 sim) · **Stretch MicroSim** (v1.1) · **Misconceptions to bust** · **Key open sources**.
Concept numbers refer to `concept-list.md`.

---

## Chapter 1: Neurons, Glia, and the Nervous System (concepts 1–24)
- **Hook:** Maya's alarm goes off. Before she's even awake, millions of neurons are already firing. What *is* a neuron, and why do brains need so many helper cells?
- **Bedside case:** A 28-year-old has blurry vision in one eye and tingling in her legs that comes and goes. The diagnosis is multiple sclerosis: the immune system attacks myelin. It connects to oligodendrocytes and conduction. What's new: B-cell–depleting therapies.
- **Flagship MicroSim:** *Neuron Explorer*. A labeled neuron; hover over each part to see its job. Toggle "remove myelin" to see the signal slow down and fail.
- **Stretch MicroSim:** Glia matcher. Drag each glial type onto its job.
- **Misconceptions:** "The brain is only neurons." "Glia are just glue." "We only use 10% of our brain."
- **Sources:** OpenStax Behavioral Neuroscience (cells of the nervous system); NINDS Multiple Sclerosis page.

## Chapter 2: The Action Potential (25–41)
- **Hook:** You touch a hot pan and pull away before you *feel* it. How fast are nerve signals, and how do they work?
- **Bedside case:** A teen gets a lidocaine shot at the dentist and loses feeling in her lip. Lidocaine blocks voltage-gated sodium channels. Extension: why pufferfish toxin (tetrodotoxin) is dangerous.
- **Flagship MicroSim:** *Action Potential Simulator*. A voltage-vs-time trace. Sliders for stimulus strength, extracellular Na⁺ and K⁺, and a "block Na⁺ channels (lidocaine)" toggle. Shows threshold, all-or-none, and the refractory period.
- **Stretch MicroSim:** Myelinated vs unmyelinated race (saltatory conduction).
- **Misconceptions:** "Stronger stimulus = bigger spike" (it's a higher *rate*, not a bigger spike). "Signals travel at the speed of light."
- **Sources:** OpenStax (neurophysiology chapter); a Hodgkin & Huxley 1952 summary (enrichment).

## Chapter 3: Synapses and Neurotransmitters (42–62)
- **Hook:** Maya drinks coffee before a test. How does a chemical change how neurons talk?
- **Bedside case:** A 35-year-old has drooping eyelids and weakness that gets worse through the day. The diagnosis is myasthenia gravis: antibodies against acetylcholine receptors at the neuromuscular junction. Treatments include acetylcholinesterase inhibitors and immunotherapy. What's new: FcRn-blocking drugs.
- **Flagship MicroSim:** *Synapse Simulator*. Release vesicles, watch neurotransmitter bind, add an SSRI (blocks reuptake) or an antagonist, and see the EPSP change.
- **Stretch MicroSim:** EPSP/IPSP summation at the axon hillock.
- **Misconceptions:** "Dopamine is the 'pleasure chemical.'" "Serotonin = happiness."
- **Sources:** OpenStax (neurochemistry); NINDS Myasthenia Gravis page.

## Chapter 4: A Tour of the Brain (63–85)
- **Hook:** In 1848, an iron rod went through Phineas Gage's skull, and he survived. Why did his personality change?
- **Bedside case:** Phineas Gage (historical, well documented) plus a modern composite patient with a frontal lobe injury after a car crash. It teaches localization of function and the prefrontal cortex.
- **Flagship MicroSim:** *Clickable Brain Atlas*. A lateral and midsagittal brain. Click a region to see its function, an example of damage, and a Brain Bee fact.
- **Stretch MicroSim:** Cranial nerve "12 nerves" quiz game.
- **Misconceptions:** "Left-brained vs right-brained people." "Bigger brain = smarter."
- **Sources:** OpenStax (nervous system organization); a historical Phineas Gage review.

## Chapter 5: Vision (86–99)
- **Hook:** Maya can't see the ball coming from the side during soccer. Is something wrong with her eyes, or her brain?
- **Bedside case:** An adult keeps bumping into door frames. The doctor finds bitemporal hemianopia, caused by a pituitary tumor pressing on the optic chiasm. Treatment is surgery.
- **Flagship MicroSim:** *Visual Pathway Lesion Simulator*. Cut the optic nerve, chiasm, tract, or radiation and watch the matching visual-field map go dark.
- **Stretch MicroSim:** Color-cone mixing and color blindness.
- **Misconceptions:** "The eye works like a camera and the brain just records it."
- **Sources:** OpenStax (vision); National Eye Institute (NEI) pages.

## Chapter 6: Hearing, Touch, Taste, Smell, and Pain (100–114)
- **Hook:** Why does a paper cut hurt more than a bruise? Why does food taste bland when you have a cold?
- **Bedside case:** A veteran feels pain in a hand that was amputated (phantom limb pain). It teaches cortical maps and remapping. Treatment idea: mirror therapy.
- **Flagship MicroSim:** *Homunculus and Dermatome Map*. Touch a body region and see where it lands in the somatosensory cortex and which spinal level carries it.
- **Stretch MicroSim:** Gate-control "rub the bump" demo.
- **Misconceptions:** "There are only 5 senses." "The tongue has taste zones."
- **Sources:** OpenStax (senses, pain); NIDCD hearing pages.

## Chapter 7: Movement (115–129)
- **Hook:** Maya kicks a soccer ball. How many brain areas fire to make one kick?
- **Bedside case:** A 62-year-old has a resting tremor, slowness, and a shuffling walk. The diagnosis is Parkinson's disease: loss of dopamine neurons in the substantia nigra. Treatments are levodopa and deep brain stimulation. What's new: alpha-synuclein seed-amplification biomarker tests.
- **Flagship MicroSim:** *Basal Ganglia Gas & Brake*. Adjust dopamine and watch the direct and indirect pathways change movement output, from too little (Parkinson's) to too much (chorea).
- **Stretch MicroSim:** Knee-jerk reflex arc animation.
- **Misconceptions:** "Muscles decide how hard to contract on their own." "Parkinson's is just shaking."
- **Sources:** NINDS Parkinson's Disease page; OpenStax (motor systems).

## Chapter 8: The Developing and Teenage Brain (130–142)
- **Hook:** Why do teenagers take more risks? Is it really "brain not finished yet"?
- **Bedside case:** A child has learning and attention difficulties, and the history reveals prenatal alcohol exposure (FASD). The second part is a non-disease scenario about adolescent risk-taking and peers.
- **Flagship MicroSim:** *Synaptic Pruning Over a Lifetime*. A slider moves from birth to age 25 and shows synapse density and myelination by region.
- **Stretch MicroSim:** Critical-period "use it or lose it" demo.
- **Misconceptions:** "The teenage brain is just a broken adult brain." "Brain development ends at 18."
- **Sources:** NIMH "The Teen Brain" fact sheet; CDC FASD pages.

## Chapter 9: Learning, Memory, and Neuroplasticity (143–158)
- **Hook:** Maya studies for the Brain Bee. Why does cramming the night before work worse than spacing her studying out?
- **Bedside case:** Patient H.M. (historical), whose hippocampal removal caused severe anterograde amnesia. It teaches memory systems; H.M. could still learn motor skills.
- **Flagship MicroSim:** *Aplysia Habituation & LTP*. Touch the sea slug's siphon repeatedly and watch the reflex weaken (habituation). Pair stimuli and watch synaptic strength grow (LTP).
- **Stretch MicroSim:** Spaced vs massed practice forgetting-curve simulator.
- **Misconceptions:** "Memory works like a video recording." "Learning styles (visual/auditory) determine how you learn best."
- **Sources:** Kandel Nobel lecture (2000); a Scoville & Milner (1957) summary; OpenStax (learning and memory).

## Chapter 10: Sleep and Brain States (159–172)
- **Hook:** Maya sleeps 6 hours on school nights. What is that doing to her memory and mood?
- **Bedside case:** A 17-year-old falls asleep suddenly in class and collapses when laughing (cataplexy). The diagnosis is narcolepsy type 1: loss of orexin neurons.
- **Flagship MicroSim:** *Hypnogram Builder*. A night of sleep cycles; click a stage to see its EEG wave. A "short sleep" toggle shows lost REM.
- **Stretch MicroSim:** Circadian clock vs school start time.
- **Misconceptions:** "You can catch up on all lost sleep on weekends." "The brain shuts off during sleep."
- **Sources:** CDC sleep pages; AASM teen sleep recommendations; NINDS Narcolepsy page.

## Chapter 11: Emotion, Stress, and the Body (173–183)
- **Hook:** Maya's heart pounds before a big test. Where does that feeling come from?
- **Bedside case:** A young adult has nightmares, flashbacks, and avoidance months after a car crash. The diagnosis is PTSD. It teaches the amygdala, the HPA axis, and fear conditioning. Treatment: trauma-focused psychotherapy.
- **Flagship MicroSim:** *HPA Axis Feedback Loop*. A causal-loop diagram. Increase stress and watch cortisol rise; break the negative feedback to see chronic stress.
- **Stretch MicroSim:** Fear conditioning and extinction demo.
- **Misconceptions:** "Stress is always bad." "The amygdala is the 'fear center' and does nothing else."
- **Sources:** NIMH PTSD page; OpenStax (emotion and stress).

## Chapter 12: Language, Attention, and Decision-Making (184–194)
- **Hook:** How can a person understand every word you say but be unable to speak, or speak fluently but make no sense?
- **Bedside case:** Two stroke patients, one with Broca's aphasia and one with Wernicke's. A variation adds hemispatial neglect.
- **Flagship MicroSim:** *Aphasia Sorter*. Read or hear speech samples and sort them into Broca, Wernicke, or normal, with feedback.
- **Stretch MicroSim:** Reward-prediction-error "slot machine" demo.
- **Misconceptions:** "Multitasking makes you more productive." "Language lives only in the left hemisphere for everyone."
- **Sources:** National Aphasia Association; NIDCD aphasia page; OpenStax (language and cognition).

## Chapter 13: The Aging Brain and Neurodegeneration (195–208)
- **Hook:** Maya's grandfather keeps forgetting her name. Is that normal aging?
- **Bedside case:** A 74-year-old has progressive memory loss, and amyloid PET is positive. The diagnosis is early Alzheimer's disease. The case discusses anti-amyloid antibodies (lecanemab, donanemab) and their benefits and risks, including ARIA. A second case covers SOD1-ALS and tofersen (FDA accelerated approval 2023, based on a biomarker).
- **Flagship MicroSim:** *Amyloid & Tau Cascade*. A timeline of protein buildup vs symptoms, showing why early detection matters.
- **Stretch MicroSim:** "How an antisense drug works": an mRNA blocked before it makes a protein.
- **Misconceptions:** "Dementia is a normal part of aging." "Alzheimer's has no treatments at all."
- **Sources:** National Institute on Aging (NIA) Alzheimer's pages; NINDS ALS page; FDA drug announcements.

## Chapter 14: Brain Injury, Stroke, and Epilepsy (209–221)
- **Hook:** Maya heads the ball and feels "foggy." Should she keep playing?
- **Bedside cases:**
  1. A high school soccer player's concussion: symptoms, removal from play, and return-to-learn/return-to-play steps.
  2. A grandparent's sudden face droop: BE-FAST, ischemic stroke, and "time is brain" (clot-busting drugs, thrombectomy).
  3. A teen's first seizure: seizure first aid.
- **Flagship MicroSim:** *Stroke Territory Map*. Block the anterior, middle, or posterior cerebral artery and see which body parts and functions are affected.
- **Stretch MicroSim:** Concussion return-to-play stepper.
- **Misconceptions:** "You have to lose consciousness to have a concussion." "Put something in a person's mouth during a seizure."
- **Sources:** CDC HEADS UP concussion; CDC / American Stroke Association stroke signs; Epilepsy Foundation seizure first aid; Lancet Neurology 2024 GBD study.

## Chapter 15: Psychiatric Disorders, Developmental Disorders, and Addiction (222–235)
- **Hook:** Maya's friend vapes "to relax." What does nicotine do to a teenage brain?
- **Bedside case:** An opioid overdose with slowed breathing and pinpoint pupils. The case covers naloxone reversal and evidence-based treatment of opioid use disorder. A variation covers teen nicotine dependence.
- **Flagship MicroSim:** *Reward Pathway & Tolerance*. Repeated drug doses shrink the dopamine response (tolerance), and withdrawal drops below baseline.
- **Stretch MicroSim:** Neurotransmitter-to-medication matcher.
- **Misconceptions:** "Addiction is a lack of willpower." "Mental illness is rare." "ADHD isn't real."
- **Sources:** NIDA (teens, vaping, opioids); SAMHSA naloxone; NIMH disorder pages. Use careful, non-stigmatizing language and include help resources (988 Suicide & Crisis Lifeline).

## Chapter 16: How Doctors Examine the Brain (236–246)
- **Hook:** You're the doctor now. A patient walks in with weakness on one side. What do you do first?
- **Bedside case:** A full workup that pulls the whole book together: history → neuro exam → localization → CT/MRI → differential diagnosis → final diagnosis.
- **Flagship MicroSim:** *Neuro Exam Decision Tree + MRI Slice Viewer*. Choose exam steps, see findings, scroll through labeled axial slices, and make a diagnosis.
- **Stretch MicroSim:** "Which scan?" chooser (CT vs MRI vs EEG vs PET).
- **Misconceptions:** "A brain scan can read your thoughts." "fMRI shows neurons firing directly."
- **Sources:** NINDS brain-imaging pages; OpenStax (research methods).

## Appendix A: Brain Bee Strategy and Mock Exam
- How Brain Bee rounds work (local → national → international; oral Q&A, neuroanatomy, histology, patient diagnosis). Check your own chapter's rules.
- A 4-week study plan using this book.
- A 50-question mock exam drawn from all chapters (original questions only).

## Appendix B: Careers in Neuroscience and Medicine
- Neuroscientist, neurologist, neurosurgeon, psychiatrist, neuropsychologist, neural engineer, nurse, PT/OT, speech-language pathologist.
- High school → college → med school / PhD pathways; research opportunities for teens.

## v1.1 (after launch): Chapter 17, Frontiers
Gene therapy and ASOs, brain-computer interfaces, AI in neuroscience, and neuroethics. Sim: BCI cursor decoder.
