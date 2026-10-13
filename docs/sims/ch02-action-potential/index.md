---
title: "Action Potential Simulator"
description: "Interactive membrane-voltage plot showing threshold, the all-or-none spike, refractory periods, firing rate coding, lidocaine block, and the effect of outside potassium."
image: /sims/ch02-action-potential/ch02-action-potential.png
og:image: /sims/ch02-action-potential/ch02-action-potential.png
quality_score: 85
status: implemented
---

# Action Potential Simulator

<iframe src="main.html" height="657px" width="100%" scrolling="no"></iframe>

[Run the Action Potential Simulator fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This simulator plots a neuron's membrane voltage (in millivolts) against time (in milliseconds), like a recording from an electrode inside a cell. You can deliver one stimulus or two stimuli in a row, hold a steady stimulus on, block sodium channels with the local anesthetic lidocaine, and change the potassium concentration outside the cell. Dashed and dotted lines mark the threshold (about −55 mV) and the current resting potential (about −70 mV at the normal outside potassium of 4 mM). A side panel shows what fraction of voltage-gated sodium channels are open, inactivated, closed and ready, or blocked, and what fraction of voltage-gated potassium channels are open.

The sim uses a **simplified teaching model**, not the full Hodgkin-Huxley equations. Below threshold, the membrane behaves like a leaky capacitor that relaxes back to rest. The resting potential comes from the Goldman equation, so it shifts when you change outside potassium. When the voltage reaches threshold and enough sodium channels are ready, a spike with a fixed shape fires: a rise to about +35 mV, a fall, and an undershoot near −80 mV. Sodium channel inactivation drops during each spike and recovers over a few milliseconds, which creates the absolute and relative refractory periods. Time is slowed down a lot so you can watch each phase.

## How to Use

1. Press **Stimulate** at the default strength of 3. The voltage bumps up and fades without crossing threshold.
2. Raise **Stimulus strength** one step at a time and press **Stimulate** after each change. Find the weakest strength that fires a spike (6 in this model). Try 8 and 10 and watch the "Last spike peak" readout: it stays at +35 mV.
3. Check **Hold stimulus** and try strengths 6, 8, and 10. Count the spikes in each 50 ms sweep. Stronger stimuli give more spikes per second, not bigger spikes. Uncheck it when you are done.
4. Use **Stimulate twice**. At strength 10, set the **Gap between 2 stimuli** to 3 ms (the second stimulus fails), then 4 ms (both fire). Repeat at strengths 8 and 6 and find the shortest gap that works.
5. Check **Block Na+ channels (lidocaine)** and stimulate at strength 10. No spike appears, only a passive bump.
6. Uncheck lidocaine and move **Outside K+** to 8, 10, and 12 mM. Watch the resting line rise and the spikes shrink, then fail.
7. Press **Reset** at any time to clear the trace. **Start/Pause** freezes and resumes the clock.

## Learning Objective

**Bloom level: Apply.** The learner will predict whether a stimulus produces an action potential, given its strength, its timing after a previous spike, the outside K⁺ concentration, and whether Na⁺ channels are blocked by lidocaine.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch02-action-potential/main.html" height="657px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (biology, AP Biology, AP Psychology, or a neuroscience elective)

**Duration:** 25 to 35 minutes

**Prerequisites:** Ions and concentration gradients, the parts of a neuron, and the vocabulary from Chapter 2 (resting potential, threshold, depolarization, repolarization, hyperpolarization).

**Activity: Predict, then test**

1. *Warm-up (5 min).* Students sketch what they think a spike looks like on a voltage-vs-time graph and label rest, threshold, and peak.
2. *Threshold hunt (5 min).* In pairs, students predict the weakest strength that will fire, then test it. They record the peak voltage at strengths 6, 8, and 10.
3. *Refractory challenge (10 min).* For strengths 10, 8, and 6, students first predict and then measure the shortest gap that gives two spikes. They explain the trend using the channel panel (inactivated sodium channels versus the undershoot).
4. *Rate coding (5 min).* With "Hold stimulus" on, students record spikes per 50 ms sweep at strengths 6, 8, and 10 and convert to spikes per second.
5. *Clinical connection (5 to 10 min).* Students test lidocaine and high outside potassium, then write two sentences linking each result to a real situation (a dental numbing shot; high blood potassium).

**Assessment questions:**

1. Why does the peak stay at about +35 mV when you raise the stimulus from 6 to 10?
2. At strength 10, why does a second stimulus fail at a 3 ms gap but succeed at 4 ms?
3. Why does a strength-6 second stimulus need a much longer gap than a strength-10 one?
4. With lidocaine on, the voltage bump can rise above the threshold line without a spike. Explain why.
5. Raising outside K⁺ to 8 mM makes the neuron easier to fire, but 12 mM makes it impossible. Explain both results.

## Related Chapter

[Chapter 2: The Action Potential](../../chapters/02-action-potential/index.md)
