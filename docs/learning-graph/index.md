---
title: Learning Graph
description: The learning graph for From Neuron to Bedside, a map of 253 neuroscience concepts and the prerequisites that connect them.
---
# Learning Graph for From Neuron to Bedside

[Open the Learning Graph Viewer Fullscreen](../sims/graph-viewer/main.html){ .md-button .md-button--primary }

<iframe src="../sims/graph-viewer/main.html" width="100%" height="600px" frameborder="0"></iframe>

This section contains the learning graph for *From Neuron to Bedside*. A learning graph is
a map of the concepts taught in this textbook. Each concept is a node in a network graph.
Concepts are connected by arrows (directed edges) that show which concepts you need to
understand first. For example, the arrow from **Action Potential** points to **Threshold**,
**Voltage-Gated Channel**, and **Depolarization**, because you need those ideas before an
action potential makes sense.

A learning graph is the foundational data structure for an intelligent textbook. It works like
a roadmap: it shows the paths a student can take from basic ideas, like **Cell Membrane** and
**Ion**, all the way to the bedside, like diagnosing **Parkinson's Disease** or treating a
**Stroke**.

The foundational concepts sit at the start of the graph. They have no prerequisites of their
own. Only arrows from other concepts point into them. The most advanced concepts, such as
**Differential Diagnosis** and **Lesion Localization**, sit at the far end. To master them you
need every concept along the paths they point to.

## Course Description

The concepts come from the course description for *From Neuron to Bedside*, which follows the
topics tested in the Brain Bee and adds a clinical case to every chapter. The course
description uses the 2001 Bloom's Taxonomy (Remember, Understand, Apply, Analyze, Evaluate,
Create) to order its learning objectives.

## List of Concepts

The course description was turned into a [Concept List](./concept-list.md) of 253 concepts,
grouped by chapter. Each concept has a short Title Case label of at most 32 characters, so it
fits on a node in the graph.

## Concept Dependency List

Next, the dependencies between concepts were mapped as a Directed Acyclic Graph (DAG). A DAG
has no cycles, so no concept ever ends up depending on itself. Every prerequisite comes from
the same chapter or an earlier one, so reading the book in order never asks you to use an idea
before it has been taught.

The graph is available in two formats:

- A [CSV file](learning-graph.csv) with the columns `ConceptID`, `ConceptLabel`, `Dependencies`, and `TaxonomyID`.
- A [JSON file](learning-graph.json) in the vis-network format, with `metadata`, `groups`, `nodes`, and `edges` sections. Each edge has a `from` concept and the `to` concept it depends on.

## Analysis and Documentation

### Learning Graph Quality Validation

This report checks the overall quality of the learning graph using graph algorithms.

- Graph structure validation: every concept is connected
- DAG validation: no cycles
- Foundational concepts: 5 entry points
- Indegree analysis: which concepts the most other concepts depend on
- Longest dependency chains

[View the Learning Graph Quality Validation](quality-metrics.md)

### Concept Taxonomy

To see patterns in the graph, each concept is assigned to one of 12 categories, such as
Neuroanatomy, Sensory Systems and Pain, or Disorders and Diseases. Each category has its own
color in the graph viewer.

- 12 categories with short codes (for example `SIG` for Electrical and Chemical Signaling)
- Categories ordered from foundational biology to clinical practice and research
- No category holds more than 30% of the concepts

[View the Concept Taxonomy](concept-taxonomy.md)

### Taxonomy Distribution

This report shows how many concepts fall into each category, with the full list of concepts
in every category.

- Statistical breakdown
- Detailed concept listing by category
- Visual distribution table
- Balance check

[View the Taxonomy Distribution Report](./taxonomy-distribution.md)
