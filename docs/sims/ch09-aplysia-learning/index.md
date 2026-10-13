---
title: "Aplysia Habituation and Sensitization"
description: "Touch a simplified sea slug's siphon and shock its tail to see how one synapse weakens with habituation and strengthens with sensitization."
image: /sims/ch09-aplysia-learning/ch09-aplysia-learning.png
og:image: /sims/ch09-aplysia-learning/ch09-aplysia-learning.png
quality_score: 85
status: implemented
---

# Aplysia Habituation and Sensitization

<iframe src="main.html" height="532px" width="100%" scrolling="no"></iframe>

[Run the Aplysia Habituation and Sensitization MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

The sea slug *Aplysia* pulls its gill in when its siphon is touched. Eric Kandel and his colleagues used this simple defensive reflex to show that learning changes the strength of synapses. In the reflex circuit, a siphon sensory neuron connects directly to a gill motor neuron. A tail shock activates facilitating interneurons that release serotonin (5-HT) onto the sensory neuron's terminal.

This MicroSim is a **simplified, qualitative model** of that circuit:

- Each siphon touch makes the sensory neuron release a little less transmitter next time, so the gill-withdrawal response shrinks. This is **habituation**.
- A tail shock adds serotonin, which makes the sensory neuron release more transmitter, so later touches produce a bigger response. This is **sensitization** (called **dishabituation** when it restores a habituated response).
- Resting lets habituation partly recover and lets short-term sensitization fade.

The numbers on the vertical axis are arbitrary units. They show the direction of each change, not real measurements.

## How to Use

1. Press **Touch siphon** once. Note the height of the first blue bar (about 100, the baseline).
2. Press **Touch siphon** five or six more times. Watch the bars get shorter and the synapse-strength meter fall below 1.0.
3. Press **Shock tail**. An orange "S" line marks the shock, and orange dots show serotonin reaching the sensory neuron's terminal.
4. Press **Touch siphon** again. The orange bar is taller than the last blue bar.
5. Press **Rest**, then touch again. Compare the response with the habituated bars.
6. Press **Reset**, then shock the tail *before* any touches. Compare the first response with the baseline of 100.

## Learning Objective

**Bloom Level:** Understand (explain)

The learner will explain how repeated siphon touches and a tail shock change the strength of the sensory-to-motor synapse, and how that change produces habituation or sensitization of the gill-withdrawal reflex.

## Iframe Embed Code

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch09-aplysia-learning/main.html" height="532px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12

**Duration:** 20 minutes

**Prerequisites:** sensory and motor neurons, synapses, neurotransmitters, excitatory postsynaptic potentials (Chapters 1 to 3)

### Activity

1. **Predict (3 min):** Before using the sim, students write down what they think will happen to the gill-withdrawal response if the siphon is touched ten times in a row.
2. **Habituation (5 min):** Students touch the siphon at least six times and sketch the bar pattern. They answer: Did the touch change, or did the synapse change?
3. **Sensitization (5 min):** Students shock the tail, touch again, and describe the role of the interneuron and serotonin.
4. **Recovery (3 min):** Students rest the animal and test again, then compare with their prediction.
5. **Connect (4 min):** In pairs, students give one human example of habituation (ignoring a ticking clock) and one of sensitization (jumping at small noises after a scare).

### Assessment Questions

1. Which synapse weakens during habituation in this model, and what happens to transmitter release?
2. Which neurotransmitter does the facilitating interneuron release, and where does it act?
3. Why does a tail shock make the response to a *siphon* touch bigger, even though the siphon touch itself did not change?
4. Kandel found that long-term memory in *Aplysia* needs new proteins and can involve growth of new synaptic connections. How is that different from what this short-term model shows?

## Related Chapter

[Chapter 9: Learning, Memory, and Neuroplasticity](../../chapters/09-learning-memory-plasticity/index.md)
