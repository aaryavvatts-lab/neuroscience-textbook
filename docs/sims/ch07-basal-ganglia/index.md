---
title: Basal Ganglia Gas and Brake
description: A simplified basal ganglia circuit. Slide dopamine from low to high and watch the direct (GO) and indirect (NO-GO) pathways change movement output.
image: /sims/ch07-basal-ganglia/ch07-basal-ganglia.png
og:image: /sims/ch07-basal-ganglia/ch07-basal-ganglia.png
twitter:image: /sims/ch07-basal-ganglia/ch07-basal-ganglia.png
social:
   cards: false
quality_score: 85
status: implemented
---
# Basal Ganglia Gas and Brake

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Basal Ganglia Gas and Brake MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim shows the classic, simplified textbook model of the basal ganglia motor loop. The motor cortex excites the **striatum**. From there, two pathways lead to the **GPi/SNr**, the output nuclei that act as a brake on the thalamus:

- The **direct pathway** (striatal neurons with D1 dopamine receptors) inhibits GPi/SNr. Inhibiting the brake releases the thalamus, so this pathway works like a gas pedal ("GO").
- The **indirect pathway** (striatal neurons with D2 receptors, then GPe, then the subthalamic nucleus) ends by exciting GPi/SNr. That presses the brake harder ("NO-GO").

Dopamine from the **substantia nigra pars compacta (SNc)** excites D1 neurons and inhibits D2 neurons. Both effects favor movement. When you lower dopamine, the brake gets stronger and the movement meter drops into the "too little" (hypokinetic, Parkinson-like) zone. When you raise dopamine far above normal, the brake gets weaker and the meter moves into the "too much" (hyperkinetic) zone.

Arrows with a pointed head and a **+** sign are excitatory (the transmitter is glutamate). Lines that end in a flat bar with a **−** sign are inhibitory (the transmitter is GABA). Thicker, brighter lines mean that connection is more active.

**This is a simplified model.** The activity numbers are illustrative, not measured. Real basal ganglia have more connections (for example, a "hyperdirect" pathway from cortex straight to the subthalamic nucleus), and scientists still debate how cleanly the two pathways separate.

## How to Use

1. Start at the default, 100% of normal dopamine. Notice that every pathway has medium thickness and the meter reads "Normal."
2. Before you move anything, predict: if dopamine falls, which pathway gets weaker, and which gets stronger?
3. Drag the dopamine slider down to 30%. Check your prediction. The direct pathway (D1 to GPi/SNr) thins, the indirect pathway thickens, the brake (GPi/SNr) gets stronger, and the thalamus goes quiet.
4. Drag the slider up to 170%. Now the direct pathway dominates, the brake weakens, and the meter enters "Too much."
5. Find the dopamine levels where the meter switches zones. Press **Reset** to return to normal.

## Learning Objective

**Bloom Level:** Understand (explain)

The learner will explain how a change in dopamine shifts the balance between the direct and indirect pathways and predict whether movement output will be too little, normal, or too much.

## Iframe Embed Code

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://aaryavvatts-lab.github.io/neuroscience-textbook/sims/ch07-basal-ganglia/main.html" height="602px" width="100%" scrolling="no"></iframe>
```

## Lesson Plan

**Grade level:** 9 to 12 (also useful for Brain Bee preparation)

**Duration:** 15 to 20 minutes

**Prerequisites:** neurons, synapses, excitatory versus inhibitory transmitters, dopamine, and the location of the basal ganglia and thalamus (Chapters 1 to 4 and Chapter 7 of *From Neuron to Bedside*).

**Activity:**

1. (3 min) Warm-up: ask students what happens to a car that is parked with the brake on, and what happens if you press the gas without releasing the brake.
2. (5 min) In pairs, students trace the circuit on the screen at 100% dopamine and label each connection as "excites" or "inhibits." They should find the "double negative": the direct pathway inhibits an inhibitor, which releases the thalamus.
3. (5 min) Students write a prediction for 30% dopamine, then test it. Repeat for 170%.
4. (5 min) Class discussion: connect 30% to Parkinson's disease (loss of dopamine neurons in the SNc) and 170% to the extra movements (dyskinesia) that some people develop after years of levodopa treatment.

**Assessment questions:**

1. Which nucleus in this model acts as the "brake" on the thalamus? *(GPi/SNr)*
2. Dopamine excites D1 neurons but inhibits D2 neurons. Why do both effects lead to more movement? *(Exciting the direct pathway releases the brake; inhibiting the indirect pathway stops it from pressing the brake harder.)*
3. Predict the meter reading when dopamine is 40% of normal, and explain your answer using the words "direct," "indirect," and "thalamus."
4. Name one way this model is simpler than the real brain. *(It leaves out the hyperdirect pathway and many other connections, and it uses made-up activity numbers.)*

## Related Chapter

[Chapter 7: Movement: Muscles, Reflexes, and Motor Control](../../chapters/07-movement/index.md)
