---
title: "Neuro Exam Decision Tree"
description: "Interactive case-based MicroSim: run neurological exam steps on three fictional patients, collect findings, and localize the lesion."
image: /sims/ch16-neuro-exam/ch16-neuro-exam.png
og:image: /sims/ch16-neuro-exam/ch16-neuro-exam.png
quality_score: 85
status: implemented
---

# Neuro Exam Decision Tree

<iframe src="main.html" height="827px" width="100%" scrolling="no"></iframe>

[Run the Neuro Exam Decision Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Doctors don't start a neurological workup by ordering a scan. They take a history, examine the patient step by step, and then ask one question: **where in the nervous system is the problem?** This MicroSim lets you practice that reasoning on three fictional patients:

1. **Right-sided weakness:** sudden weakness and trouble speaking (a left-hemisphere pattern)
2. **Face droop on waking:** weakness of one whole side of the face (a peripheral facial nerve pattern)
3. **Stiff, weak legs:** weeks of leg stiffness with a numb band below the belly button (a spinal cord pattern)

Each exam button reveals one finding. You decide which findings matter, then commit to a location: left cerebral hemisphere, right cerebral hemisphere, brainstem, spinal cord, peripheral nerve, or muscle. The feedback explains why your answer does or doesn't fit.

All three patients are fictional teaching composites. The findings follow standard textbook patterns, such as upper versus lower motor neuron signs and forehead-sparing versus whole-face weakness. Real patients are often less tidy.

## How to Use

1. Choose a case from the **Case** menu and read the patient summary.
2. Press exam buttons (Mental status, Cranial nerves, Strength, Reflexes, Sensation, Coordination, Gait) and scan buttons (Order CT, Order MRI). Each one adds a short finding to the **Findings** list and shows a longer explanation below it. Buttons you've used turn blue.
3. After at least 3 steps, choose a location from the **Location** menu and press **Check**.
4. Read the feedback. If you're wrong, try again. After two wrong tries, the sim tells you the answer so you can choose it and read the reasoning.
5. Press **Reset** to start the same case over, or choose a new case.

**Challenge:** Can you localize each case correctly using only 3 steps? Which 3 steps are most useful for each case?

## Learning Objective

**Bloom Level:** Analyze

Students will be able to **localize** a lesion to the left or right cerebral hemisphere, brainstem, spinal cord, peripheral nerve, or muscle by analyzing a pattern of exam findings (upper versus lower motor neuron signs, side of the body, and level of sensory loss).

## Iframe Embed Code

You can add this MicroSim to any web page with this line:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch16-neuro-exam/main.html" height="827px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (also useful for Brain Bee patient-diagnosis practice)

**Duration:** 20 to 25 minutes

**Prerequisites:** The motor pathway crosses to the opposite side (Chapter 7), the parts of the brain (Chapter 4), cranial nerves, and the idea of upper versus lower motor neurons (Chapters 7 and 16).

**Activity:**

1. **Warm-up (5 min):** Ask the class, "If the left side of the brain is damaged, which side of the body gets weak? Why?"
2. **Pairs (12 min):** Partners work through all three cases. Before pressing Check, each pair writes down their localization and the two findings that convinced them most.
3. **The 3-step challenge (5 min):** Pairs restart one case and try to localize it with only 3 exam steps. Which steps did they pick, and why?
4. **Debrief (3 min):** Compare the facial findings in Case 1 and Case 2. Why does one spare the forehead and the other doesn't?

**Assessment questions:**

1. In Case 1, which two findings best show that the problem is in the brain, not the spinal cord?
2. Why is weakness of the whole half of the face, forehead included, a sign of facial nerve damage rather than a stroke in the cortex?
3. In Case 3, what is a "sensory level," and why does it point to the spinal cord?
4. Brisk reflexes and a Babinski sign are upper motor neuron signs. Name two lower motor neuron signs.
5. Why is a head CT not enough to find the problem in Case 3?

## Related Chapter

This MicroSim supports [Chapter 16: How Doctors Examine the Brain](../../chapters/16-how-doctors-examine-the-brain/index.md).
