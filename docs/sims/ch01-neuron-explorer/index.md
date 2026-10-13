---
title: "Neuron Explorer"
description: "Explore the parts of a neuron and two glial cells, then send a signal down the axon with and without myelin to see why multiple sclerosis slows or blocks signals."
image: /sims/ch01-neuron-explorer/ch01-neuron-explorer.png
og:image: /sims/ch01-neuron-explorer/ch01-neuron-explorer.png
quality_score: 85
status: implemented
---

# Neuron Explorer

<iframe src="main.html" height="637px" width="100%" scrolling="no"></iframe>

[Run the Neuron Explorer MicroSim fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Neuron Explorer shows a labeled neuron (dendrites, cell body, axon hillock, axon, myelin sheath, nodes of Ranvier, and axon terminals) next to two kinds of glial cells: an oligodendrocyte that wraps myelin around the axon and an astrocyte whose "end-foot" touches a blood vessel. Hover over, click, or choose any part to read its job in the info panel.

The **Send signal** button fires a signal at the start of the axon. With healthy myelin, the signal races along and is renewed at each node of Ranvier. Check **Remove myelin (MS)** to strip myelin from 1 to 4 segments, as happens in multiple sclerosis. In the bare stretch, the signal leaks charge, slows to a crawl, and fades. One or two damaged segments make it arrive late. Three or four damaged segments make it fade out before it reaches a healthy node, so the message is blocked.

The signal model is **simplified and illustrative**. The speeds and fading rate are chosen to show the pattern, not measured from a real nerve. Real conduction speeds are given in the chapter.

## How to Use

1. Hover over (or click) each labeled part. Read its job in the info panel at the bottom. You can also pick a part from the **Explore a part** menu.
2. Press **Send signal** with healthy myelin. Watch the signal flash at each node and reach the axon terminals.
3. Check **Remove myelin (MS)** and leave **Damaged segments** at 2. Send the signal again. Compare its speed and strength with step 2.
4. Move the slider to 3 or 4 damaged segments and send another signal. What happens this time?
5. Use **Pause** / **Resume** to freeze the signal and read the strength value in the status line.

## Learning Objective

**Bloom level: Understand (explain).** Students will be able to explain the job of each part of a neuron and its nearby glial cells, and explain why losing myelin (as in multiple sclerosis) makes a signal slower and can stop it completely.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch01-neuron-explorer/main.html" height="637px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, anatomy and physiology, or a neuroscience club)

**Duration:** 15 to 20 minutes

**Prerequisites:** Basic cell structure (nucleus, cell membrane, proteins). Students should have read Sections 1.4 to 1.7 of Chapter 1.

**Activity:**

1. **Label race (5 min).** In pairs, one student names a part's job out loud ("collects incoming messages") and the partner finds the part in the sim and checks the info panel.
2. **Predict, then test (5 min).** Before removing any myelin, students write a prediction: "If myelin is removed from two segments, the signal will..." Then they test it and record what happened.
3. **Find the breaking point (5 min).** Students raise the number of damaged segments one at a time and record the first setting where the signal is blocked.
4. **Connect to medicine (5 min).** Students explain in two sentences how this links to the blurry vision and tingling in the chapter's multiple sclerosis case.

**Assessment questions:**

1. Which glial cell in the sim makes myelin in the brain and spinal cord? What makes myelin in the rest of the body?
2. Why does the signal get renewed at nodes of Ranvier but fade in a bare stretch of axon?
3. In the sim, removing myelin from two segments slows the signal, but removing it from three segments blocks it. Explain this difference in your own words.
4. MS symptoms can come and go. Using the sim, explain how a small amount of damage might cause a slowed signal while a larger patch causes a lost signal.

## Related Chapter

[Chapter 1: Neurons, Glia, and the Nervous System](../../chapters/01-neurons-and-glia/index.md)
