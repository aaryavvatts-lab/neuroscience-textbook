---
title: Synaptic Pruning Over a Lifetime
description: An age slider from birth to 30 shows synapses being overproduced and then pruned, earlier in sensory cortex and later in prefrontal cortex, while white matter keeps growing.
image: /sims/ch08-synaptic-pruning/ch08-synaptic-pruning.png
og:image: /sims/ch08-synaptic-pruning/ch08-synaptic-pruning.png
quality_score: 85
status: implemented
---

# Synaptic Pruning Over a Lifetime

<iframe src="main.html" height="642px" width="100%" scrolling="no"></iframe>

[Run the Synaptic Pruning Over a Lifetime MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The developing brain builds far more synapses than it keeps. Then, over years, it removes the least-used ones (synaptic pruning) and wraps long-distance axons in more myelin. These changes do not happen everywhere at once. Sensory areas, such as the cortex that handles hearing, reach their peak synapse density within months of birth and finish pruning in childhood. The prefrontal cortex, which helps with planning and self-control, peaks later and keeps pruning through adolescence and into the twenties.

The MicroSim has two parts:

- **Top:** two small patches of neurons, one from sensory cortex (blue) and one from prefrontal cortex (orange). Solid lines are working synapses. Dashed gray lines are synapses that have been pruned. The tan "sleeves" around three long axons get thicker as myelin is added.
- **Bottom:** a graph of relative synapse density for each region and relative white matter volume, with a red marker at the age you choose.

All curves are **approximate, schematic trends based on research**. They are drawn in relative units, not measured numbers, and real people vary a lot. The shapes follow three published findings:

- Synapse density in human auditory (hearing) cortex peaks around 3 months after birth, while prefrontal cortex peaks after 15 months. Net synapse loss ends by about age 12 in auditory cortex but continues to mid-adolescence in prefrontal cortex (Huttenlocher and Dabholkar, 1997).
- Pruning of dendritic spines in human prefrontal cortex continues into the third decade of life, the twenties (Petanjek and colleagues, 2011).
- Total white matter volume keeps rising slowly after childhood and peaks at about 29 years (Bethlehem and colleagues, 2022).

## How to Use

1. Start with the age slider at 0 (birth). Notice that both patches have few synapses and almost no myelin.
2. Drag the slider slowly to age 3. Watch both regions fill with synapses. Which one peaks first?
3. Keep going to age 12. Watch the dashed "pruned" lines appear in the sensory patch while the prefrontal patch stays crowded.
4. Move to age 16, Maya's age. Read the note above the graph. Which region is still pruning?
5. Continue to age 30. Notice that the white matter curve is still creeping upward in the twenties.
6. Press **Start** to watch the whole lifetime play out automatically. Press **Pause** to stop.

## Learning Objective

**Bloom Level:** Understand (compare)

Students will compare the timing of synapse overproduction, synaptic pruning, and myelination in sensory cortex versus prefrontal cortex from birth to age 30, and explain why this timing means brain development continues through the teenage years and into the twenties.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch08-synaptic-pruning/main.html" height="642px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 15 to 20 minutes

**Prerequisites:** neurons and synapses (Chapter 1 and Chapter 3), myelin (Chapter 1), and the location of the prefrontal cortex (Chapter 4).

**Activity:**

1. **Predict (3 minutes).** Before opening the sim, students sketch on paper how they think the number of synapses changes from birth to age 30. Most will draw a line that only goes up.
2. **Explore (7 minutes).** In pairs, students follow the How to Use steps. They record the age at which each curve peaks and the age at which each one levels off.
3. **Explain (5 minutes).** Each pair writes two sentences: one explaining why losing synapses can make the brain work better, and one explaining why "brain development finishes at exactly 25" is too simple.

**Assessment questions:**

1. Which region reaches its peak synapse density first, sensory cortex or prefrontal cortex?
2. At age 16, which region is still pruning?
3. White matter volume is still rising in the mid-twenties. What does that tell you about the claim that the brain "finishes" at a single age?
4. Why does the sim label its curves as "schematic" instead of giving exact synapse counts?

**Answers:** (1) Sensory cortex, within months of birth. (2) Prefrontal cortex. (3) Some kinds of development, like myelination of long connections, keep going gradually into the late twenties, so there is no single finish line. (4) The exact counts come from small numbers of brain samples and vary between people; the sim shows the general pattern, not precise measurements.

## Related Chapter

[Chapter 8: The Developing and Teenage Brain](../../chapters/08-developing-teenage-brain/index.md)
