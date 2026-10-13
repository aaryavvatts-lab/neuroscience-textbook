---
title: "Chapter 2: The Action Potential"
description: "How neurons use ion gradients, voltage-gated channels, and an all-or-none spike to send fast electrical signals, and how lidocaine stops them."
image: /sims/ch02-action-potential/ch02-action-potential.png
date: "2026-10-12"
version: 1.0
---

# Chapter 2: The Action Potential

## Summary

Neurons send messages as brief electrical pulses called action potentials. The chapter starts with the tiny voltage that every resting neuron keeps across its membrane, then shows how sodium and potassium channels open and close in a set order to make a spike that is always the same size. You will see why a neuron needs a short rest after each spike, how the strength of a stimulus is coded as a firing rate, and why myelin makes signals travel faster. The chapter ends at the dentist's chair, where a local anesthetic called lidocaine blocks sodium channels, switches off pain, and leaves a numb lip.

## Concepts Covered

1. Membrane Potential
2. Resting Potential
3. Sodium-Potassium Pump
4. Ion Channel
5. Voltage-Gated Channel
6. Depolarization
7. Repolarization
8. Hyperpolarization
9. Threshold
10. Action Potential
11. All-or-None Principle
12. Refractory Period
13. Saltatory Conduction
14. Conduction Velocity
15. Firing Rate Coding
16. Local Anesthetic
17. Neurotoxin

## Prerequisites

- [Chapter 1: Neurons, Glia, and the Nervous System](../01-neurons-and-glia/index.md) (cell membrane, ions, concentration gradients, axons, myelin, and nodes of Ranvier)

!!! mascot-welcome "Let's get charged up"
    ![Ply waving hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every thought you have, every step Maya takes on the soccer field, and every twitch of my little slug body rides on the same electrical pulse. In this chapter you'll learn how a neuron makes that pulse from nothing but salt, water, and a few clever proteins. Once you get this, a lot of medicine starts to make sense, from numbing shots to nerve poisons.

## 2.1 The Hot Pan Problem

It's Tuesday night, and Maya is making pasta after soccer practice. Without thinking, she grabs the pot's hot metal handle. Before she knows what happened, her hand has jerked back. A split second later comes a sharp sting, and then, a little after that, a slow, burning ache that lasts for minutes.

That moment holds three puzzles. How did her hand move before she "decided" to move it? Why did the pain come in two waves? And how does a signal travel from her fingertips so quickly at all?

The first puzzle has a short answer. Pulling away from heat is a **withdrawal reflex**: skin sensors send a signal into the spinal cord, where interneurons quickly relay it to motor neurons that contract the arm muscles. Because this loop runs through the spinal cord, the arm can start moving without waiting for the brain to decide. (You will study reflexes in detail in Chapter 7.)

The second puzzle is about speed. Pain-sensing nerve fibers come in more than one type. Thin fibers wrapped in myelin, called A-delta fibers, carry signals at roughly 15 meters per second and produce the first, sharp, pricking pain. Even thinner fibers with no myelin, called C fibers, carry signals at roughly 1 meter per second and produce the slower, burning pain ([Hu et al., 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC6615513/)). The burning arrives later because its signal is traveling on a slower road.

The third puzzle, how the signal travels at all, is the subject of this chapter. The answer is a brief electrical pulse called the action potential. Once you understand it, you can explain Maya's two pains, a dentist's numbing shot, and why a pufferfish toxin can stop a person from breathing.

## 2.2 Intuition First: A Charged Battery and a Burning Fuse

**A neuron at rest is like a charged battery.** A battery stores energy because it keeps electric charges separated. A neuron does the same thing. Its outer skin, the cell membrane, keeps different amounts of salt particles on each side. Little protein pumps work all day to keep those salts in place, and that separation stores energy, ready to be used.

**Firing is like flushing a toilet.** If you press the handle gently, nothing happens. Press a little harder and, once you pass a certain point, the whole flush happens, and it is always the same flush. Pressing harder does not make a bigger flush. Afterward, you have to wait for the tank to refill before you can flush again. A neuron's signal works the same way: it either fires completely or not at all, and it needs a short recovery time afterward.

**The signal travels like a burning fuse.** When you light one end of a fuse, each burning spot lights the next one, so the flame moves along by itself. An action potential moves down an axon the same way: each patch of membrane that fires triggers the next patch.

!!! mascot-thinking "Battery, flush, fuse"
    ![Ply thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    If you ever get lost in this chapter, ask yourself which picture you're in. Resting potential is the battery, the spike is the flush, and conduction down the axon is the fuse.

## 2.3 The Membrane Potential: A Tiny Battery

Recall from Chapter 1 that **ions** are atoms with an electric charge, and that the **cell membrane** is a thin, oily wall that ions cannot easily cross on their own. Inside and outside a neuron, the most important ions are sodium (Na⁺) and potassium (K⁺), which each carry one positive charge.

The **membrane potential** is the difference in electrical charge, measured as voltage, between the inside of a cell and the outside. Scientists measure it with a very fine electrode inside the cell and another outside. Because the voltage is small, it is measured in **millivolts (mV)**, which are thousandths of a volt. A neuron's membrane potential is written as the inside compared with the outside, so a negative number means the inside is more negative.

When a neuron is not sending a signal, its membrane potential sits at a steady value called the **resting potential**. A common textbook value is about **−70 mV**. The real number varies from neuron to neuron and between species, and many neurons rest somewhere between about −60 and −80 mV. That is the "charged battery" from Section 2.2.

### Where the charge comes from

The resting potential exists because the two main ions are unevenly spread across the membrane. The table below summarizes the typical concentrations, in millimolar (mM), a unit of how crowded the ions are.

| Ion | Outside the neuron (mM) | Inside the neuron (mM) | Where is it crowded? |
|---|---|---|---|
| Sodium (Na⁺) | about 145 | about 12 | Outside, about 12 times more |
| Potassium (K⁺) | about 4 | about 155 | Inside, almost 40 times more |

Two things work together to turn this unevenness into a voltage.

First, a resting neuron's membrane has many open "leak" pores that let potassium through, and far fewer that let sodium through. Potassium ions are crowded inside, so some of them drift out through the leaks, following their **concentration gradient** (the tendency of particles to spread from where they are crowded to where they are not). Each K⁺ ion that leaves takes a positive charge with it. Large negatively charged molecules, such as proteins, can't follow it out, so the inside becomes negative.

Second, that growing negative charge pulls positive potassium ions back in. The resting potential is roughly where this electrical pull nearly balances the concentration push. Because a small amount of sodium also leaks in, the resting potential ends up a little less negative than it would be if only potassium mattered.

### The pump that keeps the battery charged

If ions keep leaking, why doesn't the battery run down? The answer is the **sodium-potassium pump**, a protein in the membrane that uses energy from ATP (the cell's energy molecule) to move ions against their gradients. For each ATP it uses, the pump pushes **three sodium ions out** and brings **two potassium ions in**. This keeps sodium crowded outside and potassium crowded inside.

That pumping is expensive: the OpenStax *Introduction to Behavioral Neuroscience* text cites an estimate that ion pumps use about 28% of the brain's energy budget.

??? info "Optional enrichment: the Nernst equation"
    Each ion has a voltage at which its electrical pull exactly balances its concentration push. This is called its **equilibrium potential**. For an ion with a single positive charge at body temperature (37 °C), the Nernst equation gives it as:

    $$E_{ion} = 61.5\ \text{mV} \times \log_{10}\left(\frac{[\text{ion}]_{outside}}{[\text{ion}]_{inside}}\right)$$

    The 61.5 mV comes from physical constants (the gas constant, body temperature in kelvins, and Faraday's constant). Try potassium, using the values from the table above (4 mM outside, 155 mM inside):

    $$E_K = 61.5 \times \log_{10}\left(\frac{4}{155}\right) = 61.5 \times (-1.59) \approx -98\ \text{mV}$$

    The real resting potential (about −70 mV) is less negative than \( E_K \) because the membrane also leaks a little sodium, whose equilibrium potential is strongly positive. Notice what happens if the potassium outside the cell rises from 4 to 8 mM: \( E_K \) moves to about −79 mV, so the resting potential also becomes less negative. You can test this idea in the MicroSim later in the chapter.

## 2.4 Ion Channels: Doors in the Wall

An **ion channel** is a protein that forms a tiny tunnel through the cell membrane, letting particular ions pass. Many channels are picky. A potassium channel lets potassium through but mostly blocks sodium, and a sodium channel does the reverse. Ions flow through an open channel "downhill," from where they are crowded to where they are not, without using ATP.

Some channels, like the potassium leak channels in Section 2.3, are open most of the time. Others are **gated**, meaning they open and close in response to a signal. The most important gated channels in this chapter are **voltage-gated channels**: channels that open or close when the membrane potential changes. Think of them as doors with a motion sensor that responds to voltage instead of movement.

Two kinds of voltage-gated channels make the action potential.

- **Voltage-gated sodium channels** open quickly when the inside of the cell becomes less negative. They also have a second gate, called the **inactivation gate**, that swings shut very soon after the channel opens and stays shut until the membrane returns close to rest. So these channels have three states: closed and ready, open, and inactivated (shut and not ready).
- **Voltage-gated potassium channels** also open when the inside becomes less negative, but they open more slowly and stay open a bit longer.

This table compares the four membrane proteins we have met so far.

| Protein | Opens when... | What moves | Job in signaling |
|---|---|---|---|
| Potassium leak channel | Mostly always open | K⁺ out | Sets the negative resting potential |
| Voltage-gated Na⁺ channel | Membrane becomes less negative (fast) | Na⁺ rushes in | Drives the rising phase of the spike |
| Voltage-gated K⁺ channel | Membrane becomes less negative (slow) | K⁺ flows out | Brings the voltage back down |
| Sodium-potassium pump | Always running, uses ATP | 3 Na⁺ out, 2 K⁺ in | Keeps the gradients charged over time |

### How we learned this: a squid's giant axon

Much of what you just read was worked out by Alan Hodgkin and Andrew Huxley, in a famous series of experiments published in 1952. They used the **squid giant axon**, a nerve fiber that can be up to about 1.5 mm wide (typically about 0.5 mm), wide enough to slide a wire electrode inside it. They also wrote a mathematical description of how sodium and potassium currents create the action potential. Hodgkin and Huxley shared the 1963 Nobel Prize in Physiology or Medicine with John Eccles "for their discoveries concerning the ionic mechanisms involved in excitation and inhibition" in nerve cell membranes. Their approach became the basis for many later computer models of neurons and heart cells.

## 2.5 Anatomy of a Spike

An **action potential** is a brief, rapid reversal of the membrane potential, where the inside of the neuron swings from negative to positive and back again in about one to two milliseconds. It is the "flush" from Section 2.2. Neuroscientists often call it a **spike** because of its sharp shape on a graph.

First, three words for the direction the voltage moves. All three compare the membrane potential to the resting potential.

- **Depolarization** means the inside becomes *less negative* (moving up toward zero or above). "Polarized" means charges are separated; *de*polarizing means reducing that separation.
- **Repolarization** means the voltage is moving back down toward the resting potential after a depolarization.
- **Hyperpolarization** means the inside becomes *more negative* than the resting potential.

!!! mascot-tip "Up is 'de,' down past rest is 'hyper'"
    ![Ply giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Students often mix these up because depolarization makes the number go up. Remember that "polarized" means the battery is charged, so depolarizing is like draining it toward zero, and hyperpolarizing is like overcharging it.

### The key step: threshold

Small inputs, such as signals from other neurons, nudge the membrane potential by a few millivolts, and most nudges fade away. But if the inside depolarizes enough to reach a critical voltage called the **threshold**, voltage-gated sodium channels begin to open in large numbers. A common textbook value for threshold is about **−55 mV**, roughly 15 mV above rest. (Like the resting potential, the real value differs between neuron types.)

Threshold is a tipping point because of feedback. When some sodium channels open, Na⁺ rushes in, which depolarizes the membrane further, which opens more sodium channels, which lets in even more Na⁺. This is a **positive feedback loop**, where a change causes more of the same change. Below threshold, the leak of potassium out of the cell wins and the voltage drifts back to rest. Above threshold, the sodium feedback loop wins and a full spike is unstoppable.

### The five phases

1. **Rest (about −70 mV).** Leak channels and the pump hold the battery steady. Voltage-gated channels are closed.
2. **Rising phase (depolarization).** A stimulus pushes the membrane to threshold. Voltage-gated Na⁺ channels open and sodium floods in. In less than a millisecond, the inside shoots up past zero to a peak of roughly **+30 to +40 mV**.
3. **Peak and turnaround.** Sodium channels' inactivation gates swing shut, so sodium stops entering. At about the same time, the slower voltage-gated K⁺ channels are opening in large numbers.
4. **Falling phase (repolarization).** Potassium flows out through the open K⁺ channels, carrying positive charge out, and the voltage drops quickly back toward rest.
5. **Undershoot (hyperpolarization), then recovery.** The K⁺ channels are slow to close, so for a few milliseconds extra potassium keeps leaving and the inside dips below rest, often to around **−80 mV** or a little lower. As the K⁺ channels close, the membrane settles back to rest.

This table summarizes the phases side by side.

| Phase | Approximate voltage | Na⁺ channels | K⁺ channels | Direction |
|---|---|---|---|---|
| Rest | −70 mV | Closed, ready | Closed | Steady |
| Rising | −55 mV up to +30 to +40 mV | Open | Starting to open | Depolarization |
| Falling | +35 mV down to about −70 mV | Inactivated | Open | Repolarization |
| Undershoot | about −80 mV | Inactivated, then resetting | Still open, slowly closing | Hyperpolarization |
| Back to rest | −70 mV | Closed, ready | Closed | Steady |

!!! mascot-warning "The pump doesn't make the spike"
    ![Ply with a warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common mistake is to say the sodium-potassium pump brings the voltage back down after a spike. It doesn't. Voltage-gated K⁺ channels do the fast repolarizing; the pump works slowly in the background to keep the gradients charged over many spikes.

## 2.6 The All-or-None Principle

Because the sodium feedback loop takes over once threshold is reached, every action potential in a given neuron, starting from the same resting conditions, has essentially the same size and shape. This is the **all-or-none principle**: a neuron either fires a full action potential or does not fire at all. There is no such thing as half a spike. (The size can change only if conditions change. The simulator in Section 2.11 shows one example: when extra potassium outside the cell keeps some sodium channels inactivated, the spikes shrink.)

Think back to the toilet handle. A stimulus that only reaches −60 mV is a gentle press: a small bump that fades. One that reaches −55 mV gives a full spike, and one three times stronger gives the *same* spike with the same peak.

But Maya can tell a warm handle from a scorching one. If every spike is the same size, how does her nervous system say "much hotter"? The answer depends on timing, starting with the refractory period.

## 2.7 The Refractory Period: Time to Reset

Right after an action potential, a neuron cannot fire again immediately. This recovery window is called the **refractory period**. It has two parts.

- **Absolute refractory period.** During and just after the spike, most voltage-gated sodium channels are inactivated. Their inactivation gates are shut, and no stimulus, however strong, can open them. No second action potential is possible. This is the toilet tank that has not refilled yet.
- **Relative refractory period.** A little later, many sodium channels have reset, but the membrane is still in its undershoot, and potassium channels are still open. A second action potential is possible, but it takes a *stronger than normal* stimulus to reach threshold.

The refractory period has two big consequences.

1. **It keeps signals moving forward.** As an action potential travels down an axon, the patch of membrane just behind it is refractory, so the signal cannot turn around and travel backward. The fuse cannot re-light the part that has already burned.
2. **It sets a speed limit on firing.** Because each spike needs a recovery time, a neuron can only fire so many times per second. The OpenStax behavioral neuroscience text notes that without voltage-gated K⁺ channels, a typical neuron would take about two to three times as long to return to rest after a spike, which would greatly limit how often it could fire.

!!! mascot-encourage "This is the trickiest part"
    ![Ply encouraging you](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If refractory periods feel slippery, that's normal. Just link each one to a channel: absolute means "sodium channels are inactivated," and relative means "sodium channels are back, but potassium is still pulling the voltage down." You'll test both in the simulator soon.

## 2.8 Firing Rate Coding: Louder Means Faster, Not Bigger

Now we can answer Maya's hot-versus-warm question. Since every spike is the same size, a neuron reports stimulus strength mainly by **how often** it fires. This is called **firing rate coding**: a stronger stimulus produces more action potentials per second, while each individual spike stays the same size.

Suppose a sensory neuron is pushed by a steady stimulus. After each spike, the membrane drops into the undershoot and then climbs back toward threshold. A weak stimulus makes that climb slow, so spikes are spread out. A strong stimulus makes the climb fast, so the next spike comes sooner. The refractory period sets the upper limit: no matter how strong the stimulus, the next spike can't come before the sodium channels have reset.

The illustrative numbers below come from this book's simulator model, not a measured neuron, but the pattern (stronger stimulus, more spikes, same height) is what real neurons show.

| Steady stimulus (simulator units) | Spikes per second (simulator) | Peak of each spike |
|---|---|---|
| 5 | 0 (never reaches threshold) | none |
| 6 | about 50 | about +35 mV |
| 8 | about 80 | about +35 mV |
| 10 | about 110 | about +35 mV |

So when Maya grabs a scorching handle, her heat- and pain-sensing neurons fire faster than they would for a warm one, and her brain reads the higher rate as "much hotter."

## 2.9 Traveling Down the Axon: Conduction Velocity and Myelin

An action potential's job is to *travel*, sometimes a long way. Some axons in the sciatic nerve run from the base of the spinal cord all the way to the big toe.

When one patch of axon fires, positive charge from the incoming sodium spreads a short distance inside the axon and depolarizes the next patch to threshold. That patch fires, and so on, like the burning fuse. Because each patch makes a brand-new spike, the signal arrives as large as it started.

**Conduction velocity** is how fast an action potential travels along an axon, usually measured in meters per second (m/s). Two features of an axon raise it.

- **Diameter.** A wider axon has less resistance to current flowing along its inside, so the charge spreads farther and faster. The squid's giant axon, for example, helps control the jet of water the squid uses to move quickly.
- **Myelin.** As you learned in Chapter 1, myelin is a fatty wrapping made by glial cells (oligodendrocytes in the brain and spinal cord, Schwann cells in the rest of the body). Myelin insulates the axon so charge does not leak out, and it leaves small gaps called **nodes of Ranvier** where voltage-gated sodium channels are packed.

### Saltatory conduction

In a myelinated axon, current spreads quickly under each insulated stretch and triggers a new spike at the next node, so the signal seems to jump from node to node. This is called **saltatory conduction**, from the Latin *saltare*, "to leap." Unmyelinated axons instead use slower **continuous conduction**, regenerating the spike patch by patch.

The difference is large. According to the OpenStax behavioral neuroscience text, signals in unmyelinated axons typically travel about 0.5 to 10 m/s, while saltatory conduction can reach up to about 150 m/s. That's fast for biology, but nowhere near the speed of light (roughly 300 million m/s).

### A quick calculation

This explains Maya's two pains. Imagine the path from her fingertip to her spinal cord is about 1 meter long (a round number for an adult arm and shoulder, used here only for easy math).

- Sharp pain on A-delta fibers at about 15 m/s: \( \frac{1\ \text{m}}{15\ \text{m/s}} \approx 0.07\ \text{s} \), or about 70 milliseconds.
- Burning pain on C fibers at about 1 m/s: \( \frac{1\ \text{m}}{1\ \text{m/s}} = 1\ \text{s} \).

The burning signal arrives roughly a whole second behind the sharp one, which matches the "sting, then burn" that Maya felt.

!!! note "Connection to Chapter 1"
    In [multiple sclerosis](../01-neurons-and-glia/index.md), the immune system attacks myelin in the brain and spinal cord. Without that insulation, current leaks out between nodes, so action potentials can slow down or fail to reach the next node. That is one reason MS can cause vision problems, numbness or tingling, and muscle weakness.

## 2.10 Blocking the Signal: Local Anesthetics and Neurotoxins

Every action potential depends on voltage-gated sodium channels, so blocking them stops the signal. Medicine uses this on purpose; nature uses it as a weapon.

### Local anesthetics

A **local anesthetic** is a drug that blocks nerve signals in one area of the body, causing numbness without making the person unconscious. Lidocaine, the most familiar example, works by binding inside voltage-gated sodium channels and blocking them. If enough sodium channels in a stretch of axon are blocked, that stretch cannot reach threshold, so pain signals from the treated area never get past it to the brain.

A pharmacology review on local anesthetics in dentistry explains a few practical details ([Becker and Reed, 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3403589/)):

- Local anesthetics bind more strongly to sodium channels that are open or inactivated than to resting ones, so fast-firing fibers are blocked more easily.
- Thin fibers are blocked more easily than thick ones, because fewer channels need to be blocked to stop the signal.
- Pain fibers are more sensitive than fibers for pressure and body position. A patient may still feel pressure after pain is completely blocked.
- Adding epinephrine, which narrows the small blood vessels near the injection, slows the drug's absorption into the blood and makes the numbness last longer.

### Neurotoxins

A **neurotoxin** is a poison that harms or disrupts the nervous system. Many neurotoxins target the same channels as medicines do, but without any control over dose or location.

The best-known sodium-channel neurotoxin is **tetrodotoxin (TTX)**, found in some pufferfish and other animals. TTX blocks voltage-gated sodium channels, so nerves and muscles cannot fire action potentials. After a person eats contaminated or improperly prepared pufferfish, early symptoms can include numbness or tingling around the lips and mouth, followed in severe cases by weakness, paralysis, and failure of the breathing muscles. There is no specific antidote. Treatment is supportive care, such as helping the person breathe with a ventilator until the body clears the toxin. TTX is heat-stable, so cooking the fish does not make it safe.

Both lidocaine and TTX block sodium channels. The difference is where they go: a dentist places lidocaine in one small area and it wears off in a few hours, while TTX spreads through the body and can reach the nerves that control breathing.

### Too much potassium outside the cell

Signals can also fail if the "battery" changes. If potassium outside cells rises, less potassium leaks out, and the resting potential moves closer to threshold. At first neurons fire more easily. But if the membrane stays depolarized, more sodium channels become inactivated, and the cell gets *harder* to fire or cannot fire at all. In the body, a high blood potassium level (normally about 3.7 to 5.2 mEq/L, which is the same as mM for potassium) can become a medical emergency, mainly because it can disturb the heart's rhythm.

## 2.11 Try It: The Action Potential Simulator

You now have every idea the simulator uses. It plots **membrane voltage (mV)** on the vertical axis against **time (ms)** on the horizontal axis, like a doctor's or scientist's recording. A side panel shows what fraction of sodium and potassium channels are open, inactivated, closed, or blocked at each moment.

#### Diagram: Action Potential Simulator

<iframe src="../../sims/ch02-action-potential/main.html" height="657px" width="100%" scrolling="no"></iframe>

[Open the Action Potential Simulator fullscreen](../../sims/ch02-action-potential/main.html){ .md-button .md-button--primary }

<details markdown="1">
<summary>MicroSim specification: Action Potential Simulator</summary>
Type: microsim
**sim-id:** ch02-action-potential<br/>
**Library:** p5.js<br/>
**Status:** Implemented<br/>
**Bloom Level:** Apply<br/>
**Bloom Verb:** predict<br/>
**Learning Objective:** The learner will predict whether a stimulus produces an action potential, given its strength, its timing after a previous spike, the outside K⁺ concentration, and whether Na⁺ channels are blocked by lidocaine.

**Canvas:** width-responsive; drawing area plus a five-row control area (iframe height 657 px).

**Controls:** Start/Pause; Stimulate (one 0.5 ms pulse); Stimulate twice (two pulses separated by the gap slider); Reset; Stimulus strength 0 to 10, step 1, default 3 (each unit pushes the membrane up about 2.8 mV); Gap between 2 stimuli 2 to 20 ms, step 1, default 3; Outside K⁺ 2 to 20 mM, step 1, default 4; checkbox "Block Na+ channels (lidocaine)" (blocks 85% of Na⁺ channels in the model); checkbox "Hold stimulus" (a steady stimulus at the chosen strength).

**Behavior:** Simplified teaching model (not the full Hodgkin-Huxley equations). Rest −70 mV at 4 mM K⁺ (Goldman equation). A spike fires when V >= −55 mV and enough Na⁺ channels are ready; peak +35 mV, undershoot about −80 mV.

**Chapter Anchors:** strength 5 gives no spike, 6 fires; at strength 10 a second stimulus fails at a 2 or 3 ms gap and fires at 4 ms or more; strength 8 needs 7 ms or more, strength 6 about 18 ms; hold stimulus 6, 8, 10 gives about 50, 80, 110 spikes/s with the same peak; outside K⁺ 8 mM rests near −61 mV, 10 mM near −58 mV with a peak near +17 mV, 11 mM or more gives no spikes; lidocaine gives no spike even at strength 10.
</details>

Press **Stimulate** at the default strength of 3. You'll see a small bump that fades, because the membrane never reaches the dashed threshold line. Raise the strength one step at a time to find the weakest stimulus that fires (in this model, 6), then try 8 and 10. The "Last spike peak" readout stays at +35 mV no matter how hard you push: that's all-or-none. Now check **Hold stimulus** and try 6, 8, and 10. The spikes don't grow, but they come closer together: that's firing rate coding.

Next, uncheck Hold and use **Stimulate twice**. At strength 10 with a 3 ms gap, the second stimulus fails because the sodium channels are still inactivated (the gray part of the Na⁺ bar). At 4 ms both fire. At strength 6, the second stimulus needs a much longer gap, because the undershoot holds the membrane far below threshold. Then check **Block Na+ channels (lidocaine)** and stimulate at full strength: the bump may cross the threshold line, but too few sodium channels work to start the feedback loop, so no spike appears. Finally, uncheck it and slide **Outside K⁺** to 8, 10, and 12 mM to watch the resting line rise and the spikes shrink, then fail.

## At the Bedside: A Numb Lip at the Dentist

!!! note "Meet the patient"
    Maya, 16, is at the dentist to fill a cavity in a lower back tooth. The dentist gives her an injection of lidocaine near the back of her lower jaw. Soon, the left half of her lower lip, her chin on that side, and part of her tongue feel thick and "rubbery." During the filling, she feels pressure and vibration from the drill but no pain. Afterward, she asks: "Did the shot hurt my nerve? And why can I still feel pushing if I can't feel anything else?"

**What the doctor checks:** Before starting, the dentist confirms the numbness covers the expected area on that side: the lower teeth, lower lip, chin, and part of the tongue. Maya can still move her lips normally, which shows that the nerves controlling those muscles are working.

**Where is the problem? (localization):** The lower teeth, lower lip, and front part of the tongue on one side all send their sensory signals through branches of the **inferior alveolar nerve** and its neighbors, which belong to the mandibular branch of the **trigeminal nerve** (cranial nerve V). The injection places lidocaine around that nerve as it enters the jaw, blocking signals from everything downstream. Lip movement is controlled by a different cranial nerve, the facial nerve, which was not blocked, so movement is normal.

**Diagnosis:** Expected, temporary sensory nerve block from a local anesthetic (an inferior alveolar nerve block). This is the intended effect, not an injury.

**Why it happens:** Lidocaine binds inside voltage-gated sodium channels in the axons of the nerve. With enough channels blocked, the axon cannot reach threshold, so action potentials from the tooth and lip cannot travel past the injection site to the brain. Pain fibers are thin and are blocked more easily than the thicker fibers that carry pressure, which is why Maya can still feel pushing but not pain.

**Treatment today:** Dentists commonly use lidocaine, often combined with epinephrine to make the numbness last longer. Soft-tissue numbness after a lower-jaw block can last several hours. The main safety advice is practical: watch for accidental lip or cheek biting, including while eating, until feeling returns. This matters most for young children. Feeling comes back on its own as the drug washes away from the nerve.

**What's new in research:** On January 30, 2025, the U.S. FDA approved suzetrigine (brand name Journavx), a non-opioid pill for moderate to severe acute pain in adults. It is the first drug in a new class that targets one specific sodium channel type, NaV1.8, which is important in pain-sensing neurons of the peripheral nervous system. Unlike lidocaine, it is designed to quiet pain signals while leaving most other nerves alone ([FDA announcement](https://www.fda.gov/news-events/press-announcements/fda-approves-novel-non-opioid-treatment-moderate-severe-acute-pain); [review in *Molecules*, PMC12843740](https://pmc.ncbi.nlm.nih.gov/articles/PMC12843740/)). As of 2026, it is approved only for short-term acute pain. Phase 3 trials testing it for nerve pain caused by diabetes are still enrolling patients ([ClinicalTrials.gov, NCT06628908](https://clinicaltrials.gov/study/NCT06628908)), so that use is investigational.

??? question "Your turn: diagnose a variation"
    A 40-year-old man eats dried pufferfish that a friend brought from overseas. Soon afterward his lips and tongue tingle and go numb, then his arms feel weak, and he starts having trouble breathing. Which channel is affected, and why are his symptoms so much more dangerous than Maya's numb lip?

    **Answer:** This pattern suggests tetrodotoxin poisoning. Like lidocaine, TTX blocks voltage-gated sodium channels, so action potentials fail. But instead of being injected into one small spot, the toxin is absorbed into the blood and reaches nerves and muscles throughout the body, including those that control breathing. There is no specific antidote, so emergency care focuses on supporting breathing until the toxin is cleared.

*This is a fictional teaching case. It is not medical advice. If you or someone you know has symptoms like these, talk to a doctor.*

## Common Misconceptions

**Myth:** A stronger stimulus makes a bigger action potential.  
**Reality:** Action potentials are all-or-none. Once threshold is reached, every spike in a given neuron peaks at about the same voltage. A stronger stimulus makes the neuron fire *more often* (firing rate coding), not bigger.

**Myth:** Nerve signals travel at the speed of light, like electricity in a wire.  
**Reality:** Action potentials are carried by ions moving through channels, which is much slower. Even the fastest myelinated axons reach only about 150 m/s, and unmyelinated pain fibers can be closer to 1 m/s. Light travels about 300 million m/s.

**Myth:** The sodium-potassium pump is what brings the voltage back down after each spike.  
**Reality:** Voltage-gated potassium channels do the fast repolarization. The pump restores the gradients slowly in the background.

**Myth:** If your lip is numb after a dental shot, the nerve has been damaged.  
**Reality:** A local anesthetic temporarily blocks sodium channels in the nerve. As the drug washes away over a few hours, the channels work again and feeling returns.

## Brain Bee Practice

??? question "1. What is the approximate resting potential of a typical neuron, and which ion's leak mainly sets it?"
    About −70 mV (inside negative compared with outside). It is set mainly by potassium ions leaking out through open potassium leak channels.

??? question "2. Which channels open during the rising phase of an action potential, and which open during the falling phase?"
    Voltage-gated sodium channels open during the rising phase, letting Na⁺ rush in. Voltage-gated potassium channels open during the falling phase, letting K⁺ flow out and repolarize the membrane.

??? question "3. Why can't a neuron fire a second action potential during the absolute refractory period?"
    Most voltage-gated sodium channels are inactivated: their inactivation gates are shut and cannot reopen until the membrane returns close to rest. No stimulus, however strong, can trigger a spike.

??? question "4. What is saltatory conduction, and why is it faster?"
    It is the jumping of an action potential from one node of Ranvier to the next along a myelinated axon. Myelin insulates the axon so current spreads quickly between nodes, and the spike only has to be regenerated at the nodes.

??? question "5. How do lidocaine and tetrodotoxin produce their effects?"
    Both block voltage-gated sodium channels, so axons cannot reach threshold and action potentials fail. Lidocaine is a local anesthetic placed in one area; tetrodotoxin is a neurotoxin that can spread through the body and paralyze breathing muscles.

## Exercises

### Remember

1. Define *threshold* and give its approximate value in a typical textbook neuron.
2. List, in order, the five phases of an action potential described in Section 2.5.

??? note "Answer"
    1. Threshold is the membrane voltage at which enough voltage-gated sodium channels open to trigger a full action potential, about −55 mV in typical textbook examples.
    2. Rest, rising phase (depolarization), peak and turnaround, falling phase (repolarization), undershoot (hyperpolarization) and return to rest.

### Understand

3. Explain in your own words why the inside of a resting neuron is negative.
4. Explain why the refractory period makes action potentials travel in only one direction along an axon.

??? note "Answer"
    3. Potassium is crowded inside and leaks out through open K⁺ channels, carrying positive charge out. Large negative molecules stay behind, so the inside becomes negative. The sodium-potassium pump keeps the gradients in place.
    4. The patch of membrane the spike just left is refractory, with its sodium channels inactivated, so it cannot fire again right away. The spreading current can only trigger the patch ahead, which is still ready.

### Apply

5. In the simulator, set the strength to 8 and use **Stimulate twice**. Predict the shortest gap that will produce two spikes, then test your prediction. Explain the result using channel states.
6. A person's sensory neuron is firing 20 times per second in response to a warm object. If the object becomes much hotter, predict what happens to the size of each spike and to the firing rate, and explain why.

### Analyze

7. Compare lidocaine and tetrodotoxin: what they have in common at the molecular level, and why one is used in a dental office while the other is a dangerous poison.
8. In the simulator, raising outside K⁺ from 4 to 8 mM makes the neuron *easier* to fire, but raising it to 12 mM makes it *impossible* to fire. Break this down step by step using the resting potential and sodium channel inactivation.

### Evaluate

9. A classmate claims, "Myelin makes the action potential bigger, and that's why it travels faster." Evaluate this claim. What is right, what is wrong, and what is a better explanation?
10. The simulator uses a simplified model, not the full Hodgkin-Huxley equations. Judge whether this is a reasonable choice for this textbook: what does it show well, and what might it hide?

### Create

11. Invent a new analogy (not the battery, flush, or fuse) that explains both the all-or-none principle and the refractory period. Say which part matches which part of the neuron.
12. Write a one-paragraph handout for a 12-year-old after a lower-jaw numbing shot, explaining why their lip is numb, how long it may last, and how to stay safe. Base every statement on this chapter.

## Key Takeaways

- A resting neuron is a charged battery: its membrane potential sits near −70 mV because potassium leaks out and the sodium-potassium pump (3 Na⁺ out, 2 K⁺ in per ATP) keeps the gradients charged.
- Voltage-gated sodium and potassium channels open in sequence to make the action potential: Na⁺ rushes in (depolarization to about +30 to +40 mV), then K⁺ flows out (repolarization), with a brief undershoot (hyperpolarization).
- Threshold (about −55 mV in textbook examples) is a tipping point created by positive feedback, which is why action potentials are all-or-none.
- The refractory period, caused by sodium channel inactivation and the undershoot, keeps signals moving forward and limits how fast a neuron can fire.
- Neurons code stimulus strength mainly as firing rate, not spike size.
- Myelin and wider axons raise conduction velocity; saltatory conduction lets signals leap between nodes of Ranvier at up to about 150 m/s.
- Local anesthetics such as lidocaine and neurotoxins such as tetrodotoxin both block voltage-gated sodium channels, which shows how one molecular target can be a medicine or a poison.

!!! mascot-celebration "You've mastered the spike!"
    ![Ply celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now explain how a neuron fires, why it resets, and how a dentist turns pain off. But when a spike reaches the end of an axon, it hits a gap. In Chapter 3, we'll find out how neurons pass the message across that gap at the synapse, which is where my own claim to fame begins!
