---
title: "Amyloid and Tau Cascade"
description: "A schematic timeline of Alzheimer's disease showing amyloid, tau, neuron loss, and symptoms rising in order, with an illustrative anti-amyloid treatment."
image: /sims/ch13-amyloid-tau-cascade/ch13-amyloid-tau-cascade.png
og:image: /sims/ch13-amyloid-tau-cascade/ch13-amyloid-tau-cascade.png
quality_score: 85
status: implemented
---

# Amyloid and Tau Cascade

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the Amyloid and Tau Cascade MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Alzheimer's disease doesn't start when memory problems start. Brain changes begin a decade or more before symptoms appear. This MicroSim draws a **schematic** timeline from age 40 to 90 with four curves:

1. **Amyloid plaques** (orange): clumps of beta-amyloid protein that build up *between* neurons.
2. **Tau tangles** (blue): twisted threads of tau protein *inside* neurons.
3. **Neuron loss and brain shrinkage** (gray).
4. **Memory and thinking problems** (red).

The order of the curves follows the widely cited hypothetical biomarker model of Jack and colleagues (*Lancet Neurology*, 2010), in which amyloid becomes abnormal first and symptoms come last. The exact ages and curve shapes are illustrative. In this model, amyloid crosses the dashed "abnormal on tests" line at about age 50, tau at about 60, neuron loss at about 65, and symptoms at about 73. The clinical stage changes from preclinical to mild cognitive impairment at about age 72 and to dementia at about age 78. Real people vary a lot. Jack and colleagues noted that roughly 20 to 40 percent of older adults with normal thinking already have significant amyloid in their brains, and the delay between amyloid and symptoms differs from person to person.

The checkbox starts an **illustrative** anti-amyloid treatment at the chosen age. The amyloid curve falls, but the other curves stay the same, because the model makes no claim about how much treatment changes them. The message under the panels summarizes what real trials have shown.

**Schematic model, not real patient data.**

## How to Use

1. Start at age 50. Notice that the orange amyloid curve has already reached the "abnormal on tests" line, yet the clinical stage says there are no symptoms.
2. Drag the age slider slowly to the right. Watch the order in which each curve crosses the dashed line.
3. Watch the tissue cartoon: orange plaques appear between cells first, then blue tangles appear inside cells, then neurons fade away.
4. Find the age where the stage changes to mild cognitive impairment (MCI), and then to dementia.
5. Set the age to 74 (MCI) and check the treatment box. Move the slider forward and read the message.
6. Uncheck the box, set the age to 86, and check it again. Read how the message changes.

## Learning Objective

**Bloom Level:** Understand (verb: explain)

The learner will explain why Alzheimer's brain changes are best detected and treated early, using the order in which amyloid, tau, neuron loss, and symptoms rise.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch13-amyloid-tau-cascade/main.html" height="652px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 20 minutes

**Activity:**

1. (3 min) Ask: "If your grandparent started forgetting names last year, when do you think the brain changes started?" Collect guesses.
2. (7 min) In pairs, students drag the slider from 40 to 90 and record the age at which each curve crosses the "abnormal on tests" line. They write the four curves in order.
3. (5 min) Students start treatment once at age 74 and once at age 86, and copy the message they see each time.
4. (5 min) Class discussion: Why do doctors want blood tests and PET scans that detect amyloid before symptoms? Why aren't anti-amyloid drugs a cure?

**Assessment questions:**

1. In the model, which change appears first, and about how many years pass before the stage changes to mild cognitive impairment? *(Amyloid, at about age 50; roughly 20 years pass before MCI at about age 72.)*
2. Why does removing amyloid late in the disease not bring back memory? *(Tau tangles have spread and many neurons are already lost; dead neurons are not replaced.)*
3. A 55-year-old has a positive amyloid scan but a normal memory test. Which stage is that in the model? *(Preclinical Alzheimer's disease.)*

## Related Chapter

[Chapter 13: The Aging Brain and Neurodegeneration](../../chapters/13-aging-and-neurodegeneration/index.md)

## References

- Jack CR Jr, et al. (2010). [Hypothetical model of dynamic biomarkers of the Alzheimer's pathological cascade](https://pmc.ncbi.nlm.nih.gov/articles/PMC2819840/). *Lancet Neurology* 9(1):119-128.
- National Institute on Aging. [What Happens to the Brain in Alzheimer's Disease?](https://www.nia.nih.gov/health/alzheimers-causes-and-risk-factors/what-happens-brain-alzheimers-disease)
- National Institute on Aging. [Alzheimer's Disease Fact Sheet](https://www.nia.nih.gov/health/alzheimers-and-dementia/alzheimers-disease-fact-sheet)
