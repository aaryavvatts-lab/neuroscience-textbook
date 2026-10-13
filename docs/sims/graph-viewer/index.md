---
title: Learning Graph Viewer
description: Interactive viewer for the From Neuron to Bedside learning graph. Explore all 253 neuroscience concepts, their 12 categories, and the prerequisites that connect them.
hide:
   toc
---
# Learning Graph Viewer

[Open Learning Graph Viewer Fullscreen (recommended)](./main.html){ .md-button .md-button--primary }

<iframe src="./main.html" width="100%" height="700px" scrolling="no"></iframe>

This interactive viewer lets you explore the learning graph for *From Neuron to Bedside*: 253 concepts, from the cell membrane to the neurological exam, and the prerequisite arrows that connect them.

## Categories

Each node is colored by its category in the [concept taxonomy](../../learning-graph/concept-taxonomy.md):

| Color | Category | Code |
|-------|----------|------|
| Steel blue | Foundational Biology and Chemistry | `FOUND` |
| Dark green | Neurons and Glia | `CELL` |
| Gold | Electrical and Chemical Signaling | `SIG` |
| Teal | Neuroanatomy | `ANAT` |
| Orange | Sensory Systems and Pain | `SENS` |
| Dark slate blue | Movement and Motor Control | `MOTOR` |
| Lime green | Development and Aging | `DEV` |
| Dark orchid | Learning, Memory, and Cognition | `COG` |
| Light sky blue | Sleep, Emotion, and Stress | `STATE` |
| Crimson | Disorders and Diseases | `DIS` |
| Hot pink | Clinical Exam, Imaging, and Treatment | `CLIN` |
| Saddle brown | Research Methods and Careers | `RES` |

Larger boxes are concepts that more of the book builds on (a higher Concept Impact Score). Foundational concepts are the ones with no outgoing arrows.

## Features

- **Search**: Type in the search box to find specific concepts
- **Category Filtering**: Use checkboxes to show/hide concept categories
- **Interactive Navigation**: Click and drag to explore, scroll to zoom
- **Statistics**: View real-time counts of visible nodes and edges

## Using the Viewer

1. **Search for Concepts**: Start typing in the search box to find concepts. Click on a result to focus on that node.

2. **Filter by Category**: Use the category checkboxes in the sidebar to show or hide groups of related concepts. Use "Check All" or "Uncheck All" for bulk operations.

3. **Navigate the Graph**:
    - Drag to pan around the graph
    - Scroll to zoom in and out
    - Click on a node to select it and highlight its connections
    - Click the hamburger menu to collapse or expand the sidebar

4. **View Statistics**: The sidebar shows counts of visible nodes, edges, and foundational concepts.

## Graph Structure

- **Foundational Concepts**: Prerequisites with no dependencies
- **Advanced Concepts**: Topics that build on multiple prerequisites
- **Edges**: Arrows point from a concept to its prerequisites

The graph uses a force-directed layout that positions related concepts near each other.
