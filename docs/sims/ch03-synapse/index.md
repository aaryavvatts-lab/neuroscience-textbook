---
title: Synapse Simulator
description: A close-up of a chemical synapse. Fire the presynaptic neuron and see how a reuptake blocker, a receptor antagonist, or fewer receptors change cleft transmitter and the postsynaptic potential.
image: /sims/ch03-synapse/ch03-synapse.png
og:image: /sims/ch03-synapse/ch03-synapse.png
quality_score: 85
status: implemented
---

# Synapse Simulator

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Synapse Simulator fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This simulator zooms in on one chemical synapse, in slow motion. The presynaptic terminal at the top holds vesicles full of neurotransmitter. When the neuron fires, vesicles release transmitter particles (red dots) into the synaptic cleft. The particles drift across, bind receptors on the postsynaptic cell (green cups that turn bright green while bound), let go, and are pumped back into the terminal by reuptake transporters (blue blocks).

Two graphs show what matters. The top graph tracks how much transmitter is in the cleft. The bottom graph tracks the postsynaptic membrane potential in millivolts, starting from a resting potential of −70 mV. The dashed line marks threshold at −55 mV. When the potential reaches threshold, the postsynaptic cell fires an action potential (up to about +30 mV), and the counter records how many releases succeeded.

A menu switches between four conditions:

- **Normal:** transporters clear the cleft quickly, and almost every release reaches threshold. This is because the simulator is modeled on a strong synapse with a large safety margin, like the junction between a motor neuron and a muscle fiber. Most synapses in the brain are weaker: one release makes an EPSP too small to reach threshold, and the cell fires only when many EPSPs add up (summation, Chapter 3, Section 3.5).
- **Reuptake blocker (like an SSRI):** transporters are blocked, so transmitter lingers and the response lasts longer.
- **Receptor antagonist:** a drug occupies 8 of the 12 receptors without activating them, so the cleft looks normal but the response is small.
- **Fewer receptors (myasthenia-like):** 6 of the 12 receptors are gone, as when antibodies remove acetylcholine receptors in myasthenia gravis. The response is smaller and fails more often at high firing rates.

The model is qualitative, and it represents one strong excitatory synapse, not a typical synapse in the brain. Particle numbers, receptor numbers, and timing are chosen to show the correct direction of each change, not real measurements. The resting potential, threshold, and spike peak match the values in Chapter 2. Release gets smaller when the neuron fires rapidly, because the store of ready vesicles takes time to refill. At a real neuromuscular junction, an enzyme (acetylcholinesterase) clears acetylcholine instead of reuptake. The simulator keeps one cleanup method in every condition so that only one thing changes at a time.

## How to Use

1. Press **Fire once** to send a single action potential into the terminal. Watch the particles cross the cleft, bind receptors, and disappear into the transporters.
2. Press **Start** to let the neuron fire on its own at the rate set by the **Firing rate** slider (0 to 5 per second, in slow motion). Press **Pause** to freeze the scene at any moment.
3. Use the **Condition** menu to switch conditions. Switching resets the graphs so you can compare fairly.
4. For each condition, predict what will happen to both graphs *before* you press Start, then check.
5. In the "Fewer receptors" condition, compare the success counter at 1 per second and at 5 per second.
6. Press **Reset** to clear the graphs and counters.

## Learning Objective

**Bloom level: Apply.** Students will predict how a reuptake blocker, a receptor antagonist, and a loss of receptors each change the amount of neurotransmitter in the synaptic cleft and the size and duration of the postsynaptic potential, and then test those predictions.

## Iframe Embed Code

You can add this MicroSim to any web page with the following line:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch03-synapse/main.html" height="552px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 20 to 25 minutes

**Prerequisites:** resting potential, threshold, and action potentials (Chapter 2); the basic steps of chemical synaptic transmission (Chapter 3, Sections 3.3 to 3.6).

**Activity:**

1. **Warm-up (3 minutes).** Ask: "If a drug made neurotransmitter stay in the cleft longer, what would happen to the next cell?" Have students write a one-sentence prediction.
2. **Normal baseline (4 minutes).** Students press Fire once several times and sketch the shape of both graphs.
3. **Predict, then test (10 minutes).** For each of the other three conditions, students fill in a table with columns "Cleft graph: higher, lower, or the same?", "Response: bigger, smaller, or longer?", and "Did the cell reach threshold?" They fill in the prediction column first, then run the condition and fill in the observation column.
4. **Myasthenia gravis connection (4 minutes).** In the Fewer receptors condition, students record the success counter after about 10 releases at 1 per second and at 5 per second. Discuss why weakness in myasthenia gravis gets worse with use.
5. **Wrap-up (3 minutes).** Students sort the drugs from Section 3.8 into "changes the cleft graph" and "changes only the response."

**Assessment questions:**

1. In which condition does the cleft graph look normal while the response shrinks? What does that tell you about where the drug acts?
2. Why does blocking reuptake make the postsynaptic response last longer?
3. Why do failures in the Fewer receptors condition become more common at a higher firing rate?
4. Pyridostigmine slows the breakdown of acetylcholine. Which part of the simulator would it change, and how might that help a person with myasthenia gravis?

## Related Chapter

[Chapter 3: Synapses and Neurotransmitters](../../chapters/03-synapses-and-neurotransmitters/index.md)
