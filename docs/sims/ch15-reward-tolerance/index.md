---
title: "Reward Pathway and Tolerance"
description: "A schematic MicroSim of the dopamine reward pathway showing natural rewards, drug spikes, tolerance from receptor downregulation, and withdrawal."
image: /sims/ch15-reward-tolerance/ch15-reward-tolerance.png
og:image: /sims/ch15-reward-tolerance/ch15-reward-tolerance.png
quality_score: 85
status: implemented
---

# Reward Pathway and Tolerance

<iframe src="main.html" height="547px" width="100%" scrolling="no"></iframe>

[Run the Reward Pathway and Tolerance MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim is a **schematic** (simplified) model of how the brain's reward pathway responds to natural rewards and to an addictive drug. The left panel shows a side view of the brain. Dopamine neurons in the **ventral tegmental area (VTA)** send signals to the **nucleus accumbens (NAc)** and the **prefrontal cortex (PFC)**, and the PFC sends control signals back to the NAc. Below the brain, a row of 10 receptor icons stands for the dopamine receptors on a nucleus accumbens neuron.

The right panel plots dopamine signaling over time in **relative units**, where the original baseline equals 1. A natural reward produces a moderate, brief bump. A drug dose produces a much larger, faster spike. With repeated doses, receptors are removed (downregulation), so each spike shrinks and the baseline sinks below normal: this is **tolerance**. Pressing **Stop drug** causes a dip below even the lowered baseline (**withdrawal**), which slowly recovers over simulated days as receptors return.

All numbers are illustrative. The model shows the direction of the changes described by NIDA and OpenStax, not measurements of any real drug. It does not show learned, cue-triggered craving, which can last much longer than the receptor changes.

## How to Use

1. Press **Start** to run the clock (about 1 simulated day per second). The sim begins paused.
2. Press **Natural reward**. Watch the small bump on the plot (marked **N**) and the glow along the VTA pathways.
3. Press **Drug dose** once (marked **D**). Compare the spike height with the natural reward.
4. Press **Drug dose** five or six more times, a second or two apart. Watch the spikes shrink, the trace settle below the green "original baseline," and receptor icons disappear.
5. Press **Natural reward** again and compare its bump with step 2.
6. Press **Stop drug** (marked **S**). Watch the withdrawal dip and the slow recovery of the signal and the receptors over the next 20 to 30 days.
7. Press **Reset** to start over. Use **Pause** at any time to study the plot.

## Learning Objective

**Bloom level: Understand.** Students will explain how repeated drug doses produce tolerance (smaller dopamine responses and a lower baseline caused by receptor downregulation) and how stopping the drug produces a below-baseline withdrawal state that recovers slowly.

## Iframe Embed Code

You can add this MicroSim to any web page with the following code:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch15-reward-tolerance/main.html" height="547px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 20 to 25 minutes

**Prerequisites:** neurons and synapses, neurotransmitters and receptors, dopamine, and the idea that synapses can change with experience (Chapters 3 and 9).

**Activity:**

1. **Predict (3 min).** Before using the sim, students write a prediction: "If someone takes the same drug every day, will each dose feel the same? Why or why not?"
2. **Explore (10 min).** In pairs, students follow the How to Use steps. One partner runs the sim while the other records: the height of the first drug spike, the height of the sixth spike, the number of receptor icons after six doses, and the lowest point of the signal after Stop drug.
3. **Explain (5 min).** Pairs write two to three sentences that use the words *receptor*, *tolerance*, and *withdrawal* to explain their data.
4. **Connect (5 min).** Class discussion: Why might everyday activities feel less enjoyable to someone with tolerance? Why does recovery take time and support, and not just willpower?

**Assessment questions:**

1. Why does the sixth drug dose produce a smaller spike than the first?
2. After several doses, why is a natural reward's bump smaller than it was at the start?
3. What happens to the signal right after Stop drug, and what has to change for it to recover?
4. Name one thing this schematic model leaves out about real addiction.

## Related Chapter

[Chapter 15: Psychiatric Disorders, Developmental Disorders, and Addiction](../../chapters/15-psychiatric-disorders-and-addiction/index.md)
