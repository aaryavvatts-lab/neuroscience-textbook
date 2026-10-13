---
title: "HPA Axis Feedback Loop"
description: "Trigger a stressor and watch cortisol rise and fall through the HPA axis, then weaken its negative feedback or repeat the stress to see cortisol stay high."
image: /sims/ch11-hpa-axis/ch11-hpa-axis.png
og:image: /sims/ch11-hpa-axis/ch11-hpa-axis.png
quality_score: 85
status: implemented
---

# HPA Axis Feedback Loop

<iframe src="main.html" height="627px" width="100%" scrolling="no"></iframe>

[Run the HPA Axis Feedback Loop MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Your body answers a stressor with two systems working at two speeds. The **fast** path runs through sympathetic nerves to the adrenal medulla, which releases adrenaline within seconds. The **slow** path is the hormone chain called the **HPA axis**: the hypothalamus releases CRH, the anterior pituitary releases ACTH, and the adrenal cortex releases cortisol. Cortisol raises blood glucose and helps the body cope, and it also travels back to the brain and shuts its own production down. That brake is called **negative feedback**.

The top half of the MicroSim is a causal-loop diagram. Plus signs (+) mean "increases the next step." Minus signs (−) on the dashed red arrows mean "slows the earlier step," which is cortisol's negative feedback on the hypothalamus and pituitary. Boxes glow more strongly as their hormone rises above its resting level. The bottom half plots cortisol (thick red line) and adrenaline (thin orange line) over time.

This is a **simplified teaching model in relative units** (1.0 = resting baseline). It is not fitted to patient data. It leaves out the daily cortisol rhythm, vasopressin, the hippocampus and prefrontal cortex, and differences between people.

## How to Use

1. Leave **Feedback strength** at 1.0 and press **Stressor!** The clock starts. Notice that adrenaline jumps within a few simulated minutes, while cortisol rises more slowly and peaks later.
2. Watch cortisol return to the dashed baseline line. With intact feedback, that takes about an hour in this model.
3. Before the next step, predict: if the brake is weaker, will the cortisol peak be higher, lower, or the same? Then drag **Feedback strength** down to 0.3 and press **Stressor!** again. Compare the two peaks.
4. Press **Reset**, set the slider back to 1.0, and check **Chronic stress**. A new stressor now arrives every 30 simulated minutes. Notice that cortisol never gets back to baseline.
5. Finally, keep **Chronic stress** checked and slide **Feedback strength** to 0. Cortisol climbs far higher and stays there. This is the model's picture of a stress system that cannot switch off.
6. Use **Start/Pause** to freeze the graph at any moment and read the values in the boxes and the legend.

## Learning Objective

**Bloom Level:** Analyze

**Bloom Verb:** differentiate

Students will differentiate a healthy, self-limiting acute stress response from a sustained cortisol elevation. They do this by predicting, and then observing, how the cortisol curve changes when negative feedback is weakened or when stressors repeat.

## Iframe Embed Code

You can add this MicroSim to any web page with this line:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch11-hpa-axis/main.html" height="627px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, AP Psychology, anatomy and physiology, or a neuroscience club)

**Duration:** 20 to 25 minutes

**Prerequisites:** hormones travel in the blood; the hypothalamus and pituitary sit at the base of the brain; the meaning of "negative feedback" (a thermostat is a good analogy).

**Activity:**

1. **Warm-up (3 min).** Ask: "What does a thermostat do when the room gets too hot?" Connect it to negative feedback.
2. **Predict (3 min).** Students sketch what they think cortisol will do after one stressor, and write one sentence about how a broken "thermostat" would change their sketch.
3. **Explore (10 min).** In pairs, students run the four scenarios: (a) one stressor with feedback 1.0, (b) one stressor with feedback 0.3, (c) chronic stress with feedback 1.0, (d) chronic stress with feedback 0. For each one, they record the highest cortisol value and whether cortisol returned to baseline.
4. **Explain (5 min).** Students compare their data with their predictions and explain each difference using the words *CRH, ACTH, cortisol,* and *negative feedback*.
5. **Connect (3 min).** Discuss: Why do adrenaline and cortisol peak at different times? Why might a stress system that stays switched on for weeks affect sleep, mood, and memory?

**Assessment questions:**

1. Which hormone does the pituitary release in response to CRH, and which gland does that hormone act on?
2. In the model, why does adrenaline peak before cortisol?
3. A student says, "Negative feedback means stress is bad for you." Use the simulation to correct this statement.
4. Describe two different ways cortisol can end up staying high in the model, and explain how they differ.
5. What is one thing this simple model leaves out that real bodies have?

## Related Chapter

This MicroSim supports [Chapter 11: Emotion, Stress, and the Body](../../chapters/11-emotion-and-stress/index.md).
