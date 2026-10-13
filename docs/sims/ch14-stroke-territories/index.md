---
title: Stroke Territory Map
description: Block the anterior, middle, or posterior cerebral artery on either side and see which side of the body and which functions are typically affected.
image: /sims/ch14-stroke-territories/ch14-stroke-territories.png
og:image: /sims/ch14-stroke-territories/ch14-stroke-territories.png
quality_score: 85
status: implemented
---

# Stroke Territory Map

<iframe src="main.html" height="702px" width="100%" scrolling="no"></iframe>

[Run the Stroke Territory Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A stroke's symptoms depend on which artery is blocked and on which side of the brain. This MicroSim links two pictures:

- **A brain slice drawn like a CT scan.** The front of the brain is at the top, and the person's right hemisphere is on *your* left, the convention doctors use when reading scans. Each hemisphere is divided into the territories of the **anterior cerebral artery (ACA)**, **middle cerebral artery (MCA)**, and **posterior cerebral artery (PCA)**.
- **A body figure facing you.** Its right side is also on your left. A small "Vision" circle shows what the person sees, with their left half of vision on the left.

When you block an artery, its territory darkens, the face, arm, and leg on the **opposite** side of the body light up (dark red for the main problem, light red for milder or possible problems), the mouth droops for MCA strokes, and the lost half of vision is shaded for PCA (and possibly MCA) strokes. An info panel lists the typical deficits.

The patterns follow the "Selected Stroke Syndromes" table in the *Merck Manual Professional Version* ([Overview of Stroke](https://www.merckmanuals.com/professional/neurologic-disorders/stroke/overview-of-stroke)). They are **typical patterns only; real strokes vary** in size and location, and the territory shapes are simplified wedges, not an exact anatomical atlas.

## How to Use

1. Read the starting panel. Notice the **R** and **L** markers: both pictures face you, so the person's right is on your left.
2. Check **Predict first** to hide the body.
3. Choose an artery (ACA, MCA, or PCA) and a hemisphere (Left or Right), or click a colored region of the brain slice.
4. Predict which side of the body will be affected and whether the face, arm, leg, vision, language, or attention will be involved.
5. Uncheck **Predict first** to reveal the answer and read the info panel.
6. Repeat for all six combinations and look for the rule that never changes.

## Learning Objective

**Bloom level: Apply.** Given which cerebral artery (ACA, MCA, or PCA) is blocked and in which hemisphere, students will predict which side of the body and which functions are typically affected.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch14-stroke-territories/main.html" height="702px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 15 to 20 minutes

**Prerequisites:** the motor and touch body maps (Chapter 6), crossing motor pathways (Chapter 7), visual fields (Chapter 5), and language areas (Chapter 12)

**Activity: Stroke detective**

1. (3 min) Review: each hemisphere controls the opposite side of the body, and the leg area of the motor strip sits near the midline and the face and arm areas sit on the outer side.
2. (8 min) In pairs, students turn on **Predict first** and work through all six artery-and-side combinations. For each, one partner predicts and the other checks the sim. Record results in a table: artery, side, body parts affected, special signs (aphasia, neglect, vision loss).
3. (5 min) Give three short patient descriptions and ask students to name the most likely blocked artery and side:
    - Left leg much weaker than the left arm, face normal (right ACA)
    - Right face and arm weakness with trouble speaking (left MCA)
    - Cannot see the left half of the world, no weakness (right PCA)
4. (3 min) Discuss why real strokes might not match these patterns exactly.

**Assessment questions**

1. A right MCA stroke usually affects which side of the body, and what attention problem may appear?
2. Why does an ACA stroke affect the leg more than the arm?
3. A patient has no weakness but has lost the right half of vision in both eyes. Which artery and which side are most likely involved?
4. Why does language trouble usually go with left MCA strokes rather than right MCA strokes?

## Related Chapter

[Chapter 14: Brain Injury, Stroke, and Epilepsy](../../chapters/14-injury-stroke-epilepsy/index.md)
