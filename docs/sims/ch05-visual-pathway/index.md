---
title: Visual Pathway Lesion Simulator
description: Place a lesion along the visual pathway, from optic nerve to occipital cortex, and see the matching visual field loss in each eye.
image: /sims/ch05-visual-pathway/ch05-visual-pathway.png
og:image: /sims/ch05-visual-pathway/ch05-visual-pathway.png
quality_score: 85
status: implemented
---
# Visual Pathway Lesion Simulator

<iframe src="main.html" height="707px" width="100%" scrolling="no"></iframe>

[Run the Visual Pathway Lesion Simulator Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim is a top-down (bird's-eye) map of the human visual pathway. Light from the **left visual field** lands on the nasal (inner) retina of the left eye and the temporal (outer) retina of the right eye. Those fibers are drawn in **blue**, and they all end up in the **right** hemisphere. Information about the **right visual field** is drawn in **orange** and ends up in the **left** hemisphere.

The key rule is that fibers from the **nasal** half of each retina cross at the **optic chiasm**, and fibers from the **temporal** half stay on the same side. After the chiasm, each optic tract, lateral geniculate nucleus (LGN), optic radiation, and primary visual cortex (V1) carries the opposite half of the visual world from **both** eyes.

When you place a lesion, the cut fibers turn gray and dashed. Two circular maps show what each eye can still see, drawn the way the patient sees it (left side of the circle = the patient's left). Dark gray means vision is lost.

The maps are idealized. Real lesions are often partial, and a defect can be uneven between the two eyes.

## How to Use

1. Start with **None (healthy)** and trace the blue fibers from both eyes to the right side of the brain.
2. Check **Hide result** so you can predict before you look.
3. Pick a lesion from the **Lesion site** menu, or click one of the red dots on the diagram.
4. Sketch what you think each eye will lose. Then uncheck **Hide result** and compare.
5. Repeat for all five lesion sites. For each one, explain your answer using the words *nasal*, *temporal*, *crossing*, and *same side*.

## Learning Objective

**Bloom level: Analyze.** Given a lesion site anywhere from the optic nerve to the occipital cortex, the student will predict the visual field defect in each eye and, working backward, localize a lesion from a described field defect.

## Iframe Embed Code

You can add this MicroSim to any web page with this code:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch05-visual-pathway/main.html" height="707px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (also useful for Brain Bee and pre-med review)

**Duration:** 20 to 25 minutes

**Prerequisites:** Chapter 4 (occipital, temporal, and parietal lobes; thalamus) and Chapter 5 sections on the retina, optic chiasm, and visual fields.

**Activity (predict, test, explain):**

1. *Warm-up (3 min).* Students cover one eye and notice that each eye alone still sees both the left and right sides of the world.
2. *Prediction round (10 min).* In pairs, students turn on **Hide result**, choose each lesion, and draw two circles per lesion on paper, shading what they predict is lost. Then they reveal the answer and score themselves.
3. *Reverse round (7 min).* The teacher describes a field defect ("both eyes lose the upper-right quarter"). Students find the lesion site that produces it.
4. *Wrap-up (5 min).* Each pair writes one sentence explaining why a lesion in front of the chiasm affects one eye, but a lesion behind the chiasm affects both eyes.

**Assessment questions:**

1. Which single lesion makes each eye lose its outer half of vision? Why does that location cause that pattern?
2. A patient loses the left half of the visual field in both eyes, but the very center is spared. Where is the lesion most likely to be?
3. Why does a lesion of the left optic nerve not cause any loss in the right eye?
4. Damage to Meyer's loop in the left temporal lobe causes loss in which quarter of the visual field? Explain using the fact that the image on the retina is upside down.

**Answers:** (1) The center of the optic chiasm, because the crossing fibers there come from both nasal retinas, which see the temporal fields. (2) The right occipital cortex (V1), often from a stroke. (3) The left optic nerve carries fibers only from the left eye. (4) The upper-right quarter ("pie in the sky"). Meyer's loop carries fibers from the lower retina, which sees the upper visual field, and the left hemisphere handles the right visual field.

## Related Chapter

[Chapter 5: Vision](../../chapters/05-vision/index.md)
