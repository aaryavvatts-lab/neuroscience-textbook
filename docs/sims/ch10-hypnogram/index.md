---
title: Hypnogram Builder
description: An interactive hypnogram of an illustrative 9-hour teen night with schematic EEG waves for each sleep stage and a slider that shows which stages are lost when sleep is cut short.
image: /sims/ch10-hypnogram/ch10-hypnogram.png
og:image: /sims/ch10-hypnogram/ch10-hypnogram.png
quality_score: 85
status: implemented
---

# Hypnogram Builder

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Hypnogram Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A hypnogram is a graph of sleep stages across a night. This MicroSim shows an illustrative (made-up but typical) night for a healthy teenager who sleeps 9 hours. The night is built from cycles of about 90 minutes. Deep N3 sleep is packed into the first half of the night, and REM periods (red bars) get longer toward morning.

Click any stage name, or hover over the night, to see a schematic EEG trace for that stage: alpha waves for relaxed waking, theta waves for N1, a sleep spindle and K-complex for N2, tall slow delta waves for N3, and low-voltage mixed waves with sawtooth waves for REM. The traces are simplified drawings, not real recordings, but their frequencies and relative sizes follow standard sleep-scoring descriptions.

The **Hours of sleep** slider moves an "alarm" line earlier in the night. A readout shows how many minutes of REM, N2, and N3 are kept and lost compared with the full 9-hour night.

## How to Use

1. Click each stage label (Wake, REM, N1, N2, N3) on the left, or choose a stage from the **Show EEG for** menu. Compare the speed and height of the waves.
2. Move your mouse across the hypnogram from left to right. The label shows the time and stage under the cursor, and the EEG panel switches to that stage.
3. Drag the **Hours of sleep** slider from 9.0 down to 6.0 hours. Watch the gray "lost" region grow and read the minutes lost for each stage.
4. Try 7.5 hours and 4.5 hours. Which stage is the last to be affected? Which is hit first?
5. Click **Reset to 9 h** to restore the full night.

## Learning Objective

Students will be able to **interpret** a hypnogram to identify each sleep stage by its EEG signature and explain why shortening sleep removes mostly REM and N2 sleep rather than deep N3 sleep.

**Bloom's Taxonomy level:** Analyze (interpret)

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch10-hypnogram/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 20 to 25 minutes

**Prerequisites:** Students should know what an EEG measures, the meaning of frequency and amplitude, and the four sleep stages (N1, N2, N3, REM) from Chapter 10.

**Activity:**

1. **Predict (3 minutes).** Before opening the sim, ask students: "If you sleep 6 hours instead of 9, which sleep stage do you think you lose the most of?" Have them write down a prediction.
2. **Explore the stages (7 minutes).** In pairs, students click through all five stages and sketch each EEG trace in their notebooks with a one-word label (for example, "spindles" for N2).
3. **Cut the night short (7 minutes).** Students set the slider to 7.5, 6.0, and 4.5 hours and record minutes kept for REM, N2, and N3 in a table.
4. **Explain (5 minutes).** Students compare their prediction with the data and write two sentences explaining the pattern using the words "early night," "late night," "N3," and "REM."

**Assessment questions:**

1. Which stage has the tallest, slowest EEG waves, and when in the night does most of it occur?
2. At 6.0 hours, about what fraction of the night's REM is lost in this model, and why?
3. A classmate says, "Short sleep only costs you deep sleep." Use the sim's numbers to correct this claim.
4. Name the two EEG features that identify N2 sleep.

## Related Chapter

[Chapter 10: Sleep and Brain States](../../chapters/10-sleep-and-brain-states/index.md)
