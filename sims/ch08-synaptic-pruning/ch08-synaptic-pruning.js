// Synaptic Pruning Over a Lifetime - width responsive p5.js MicroSim
// CANVAS_HEIGHT = 640 (drawHeight 590 + controlHeight 50); iframe height = 642
// Chapter 8: The Developing and Teenage Brain (From Neuron to Bedside)
// Learning objective: compare the timing of synapse overproduction, pruning,
// and myelination in sensory cortex versus prefrontal cortex from birth to age 30.
//
// IMPORTANT: every curve here is an approximate, SCHEMATIC trend in relative units.
// The shapes follow published findings, but the exact heights are not measurements:
//  - Sensory (auditory) cortex synapse density peaks around 3 months after birth;
//    net synapse elimination there has ended by about age 12.
//    Prefrontal (middle frontal gyrus) density peaks after 15 months; elimination
//    extends to mid-adolescence (Huttenlocher & Dabholkar 1997, J Comp Neurol).
//  - Prefrontal dendritic spines are 2-3x adult values in childhood and remodeling
//    continues through the third decade (Petanjek et al. 2011, PNAS).
//  - Total white matter volume rises fast in early childhood, then slowly,
//    peaking near 28.7 years (Bethlehem et al. 2022, Nature).
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 590;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
// room for the Start button (about 70 px) and the "Age: 16.0 years" label
let sliderLeftMargin = 230;
let defaultTextSize = 16;

// application specific globals
let ageSlider;
let startButton;
let isRunning = false; // all MicroSims start paused
let age = 0;
const maxAge = 30;

let patches = []; // two network patches: sensory and prefrontal
const nNeurons = 11;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 12);
  startButton.mousePressed(toggleSimulation);

  ageSlider = createSlider(0, maxAge, 0, 0.1);
  ageSlider.position(sliderLeftMargin, drawHeight + 15);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);

  randomSeed(8);
  patches.push(makePatch('sensory'));
  patches.push(makePatch('prefrontal'));

  describe('Age slider from birth to 30 years. Top: two small patches of neurons, one in sensory cortex and one in prefrontal cortex, whose synapses multiply and then are pruned, while a few long-range axons gain thicker myelin. Bottom: a schematic graph of relative synapse density for sensory and prefrontal cortex and relative white matter volume, with a marker at the chosen age. Sensory cortex peaks and prunes early; prefrontal cortex peaks later and keeps pruning into the twenties; white matter keeps rising into the late twenties.');
}

// ---------- schematic curves (relative units, 0 to 1) ----------
// smooth rise to a peak, a plateau, then decline to an adult level
function densityCurve(a, startLevel, peakAge, plateauEnd, pruneEnd, adultLevel) {
  if (a <= peakAge) {
    let t = a / peakAge;
    return startLevel + (1 - startLevel) * (1 - pow(1 - t, 2));
  }
  if (a <= plateauEnd) return 1;
  if (a <= pruneEnd) {
    let t = (a - plateauEnd) / (pruneEnd - plateauEnd);
    let s = t * t * (3 - 2 * t); // smoothstep
    return 1 - (1 - adultLevel) * s;
  }
  return adultLevel;
}

function sensoryDensity(a) {
  // peak about 3 months; pruning in childhood, essentially over by about 12
  return densityCurve(a, 0.35, 0.25, 3, 12, 0.6);
}

function prefrontalDensity(a) {
  // peak after 15 months (drawn near 2 years); high through childhood;
  // pruning through adolescence and continuing into the twenties
  let base = densityCurve(a, 0.25, 2, 9, 26, 0.6);
  return base;
}

function whiteMatter(a) {
  // fast rise in early childhood, slow rise after, peak near 28.7 years
  let v = 0.25 + 0.75 * (1 - exp(-a / 6.5));
  if (a > 28.7) v -= 0.002 * (a - 28.7) * (a - 28.7);
  return v;
}

// myelin thickness of the long-range axons in each patch (schematic)
function myelinLevel(region, a) {
  if (region === 'sensory') return 1 - exp(-a / 2.5);
  return 1 - exp(-a / 9);
}

function densityFor(region, a) {
  return region === 'sensory' ? sensoryDensity(a) : prefrontalDensity(a);
}

// ---------- network patches ----------
function makePatch(region) {
  let neurons = [];
  for (let i = 0; i < nNeurons; i++) {
    // jittered grid so the neurons spread across the patch
    let col = i % 4;
    let row = floor(i / 4);
    neurons.push({ x: 0.13 + col * 0.25 + random(-0.06, 0.06), y: 0.3 + row * 0.26 + random(-0.05, 0.05) });
  }
  // candidate synapses: every pair, keep the closer ones
  let pairs = [];
  for (let i = 0; i < nNeurons; i++) {
    for (let j = i + 1; j < nNeurons; j++) {
      let d = dist(neurons[i].x, neurons[i].y, neurons[j].x, neurons[j].y);
      pairs.push({ i: i, j: j, d: d });
    }
  }
  pairs.sort((p, q) => p.d - q.d);
  let local = pairs.slice(0, 30);
  // each local synapse gets a random rank; low ranks are the "most used" ones that survive pruning
  for (let k = 0; k < local.length; k++) local[k].rank = random();
  local.sort((p, q) => p.rank - q.rank);
  // three long-range connections become the myelinated axons
  let longRange = pairs.slice(pairs.length - 3);
  return { region: region, neurons: neurons, local: local, longRange: longRange };
}

function drawPatch(p, x0, y0, w, h) {
  let isSensory = p.region === 'sensory';
  let mainColor = isSensory ? 'steelblue' : 'darkorange';
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, w, h, 8);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  text(isSensory ? 'Sensory cortex patch' : 'Prefrontal cortex patch', x0 + 8, y0 + 6);

  let d = densityFor(p.region, age);
  // peak value reached so far
  let peakSoFar = 0;
  for (let a = 0; a <= age; a += 0.25) peakSoFar = max(peakSoFar, densityFor(p.region, a));
  let total = p.local.length;
  let nowCount = round(d * total);
  let peakCount = round(peakSoFar * total);

  const px = (n) => x0 + n.x * w;
  const py = (n) => y0 + n.y * h;

  // myelinated long-range axons (drawn first, under the synapses)
  let m = myelinLevel(p.region, age);
  for (let c of p.longRange) {
    let a1 = p.neurons[c.i], a2 = p.neurons[c.j];
    stroke('wheat');
    strokeWeight(2 + 9 * m);
    line(px(a1), py(a1), px(a2), py(a2));
    stroke('dimgray');
    strokeWeight(1.5);
    line(px(a1), py(a1), px(a2), py(a2));
  }

  // pruned synapses: faint dashed lines
  drawingContext.setLineDash([4, 5]);
  stroke('lightgray');
  strokeWeight(1.5);
  for (let k = nowCount; k < peakCount; k++) {
    let c = p.local[k];
    line(px(p.neurons[c.i]), py(p.neurons[c.i]), px(p.neurons[c.j]), py(p.neurons[c.j]));
  }
  drawingContext.setLineDash([]);

  // active synapses
  stroke(mainColor);
  strokeWeight(2);
  for (let k = 0; k < nowCount; k++) {
    let c = p.local[k];
    line(px(p.neurons[c.i]), py(p.neurons[c.i]), px(p.neurons[c.j]), py(p.neurons[c.j]));
  }

  // neuron cell bodies
  stroke('black');
  strokeWeight(1);
  fill(mainColor);
  for (let n of p.neurons) circle(px(n), py(n), 12);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text('Synapses shown: ' + nowCount, x0 + w - 8, y0 + h - 4);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) {
    age += 0.05;
    if (age > maxAge) age = 0;
    ageSlider.value(age);
  } else {
    age = ageSlider.value();
  }

  // title and instruction
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 20 : 24);
  text('Synaptic Pruning Over a Lifetime', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  let instr = 'Move the age slider. Watch when each region adds, then prunes, synapses.';
  if (textWidth(instr) > canvasWidth - 20) instr = 'Move the age slider. Compare the two regions.';
  text(instr, canvasWidth / 2, 40);

  // ---- network patches ----
  let gap = 12;
  let patchTop = 64;
  let patchH = 160;
  let patchW = (canvasWidth - 2 * 15 - gap) / 2;
  drawPatch(patches[0], 15, patchTop, patchW, patchH);
  drawPatch(patches[1], 15 + patchW + gap, patchTop, patchW, patchH);

  // key for the patches
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  let keyY = patchTop + patchH + 6;
  stroke('wheat'); strokeWeight(8); line(20, keyY + 8, 44, keyY + 8);
  stroke('dimgray'); strokeWeight(1.5); line(20, keyY + 8, 44, keyY + 8);
  noStroke(); fill('black');
  text('myelinated axon', 50, keyY);
  drawingContext.setLineDash([4, 5]);
  stroke('gray'); strokeWeight(1.5); line(180, keyY + 8, 204, keyY + 8);
  drawingContext.setLineDash([]);
  noStroke(); fill('black');
  text('pruned synapse', 210, keyY);

  drawGraph();
}

function drawGraph() {
  let gx0 = 62;
  let gy0 = 292;
  let gx1 = canvasWidth - 20;
  let gy1 = 472;
  let gw = gx1 - gx0;
  let gh = gy1 - gy0;
  const X = (a) => gx0 + (a / maxAge) * gw;
  const Y = (v) => gy1 - v * gh * 0.85; // headroom above the highest curve

  // shade adolescence (WHO: ages 10 to 19)
  noStroke();
  fill('lavender');
  rect(X(10), gy0, X(19) - X(10), gh);
  fill('slateblue');
  textAlign(CENTER, TOP);
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('adolescence (10-19)', (X(10) + X(19)) / 2, gy1 - 4);

  // axes
  stroke('black');
  strokeWeight(1);
  line(gx0, gy0, gx0, gy1);
  line(gx0, gy1, gx1, gy1);
  for (let a = 0; a <= maxAge; a += 5) {
    line(X(a), gy1, X(a), gy1 + 5);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(14);
    text(a, X(a), gy1 + 7);
    stroke('black');
  }
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Age (years)', (gx0 + gx1) / 2, gy1 + 24);
  push();
  translate(18, (gy0 + gy1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Relative level', 0, 0);
  pop();
  textAlign(RIGHT, CENTER);
  text('high', gx0 - 6, gy0 + 6);
  text('low', gx0 - 6, gy1 - 6);

  // curves
  noFill();
  strokeWeight(3);
  stroke('steelblue');
  beginShape();
  for (let a = 0; a <= maxAge; a += 0.05) vertex(X(a), Y(sensoryDensity(a)));
  endShape();
  stroke('darkorange');
  beginShape();
  for (let a = 0; a <= maxAge; a += 0.05) vertex(X(a), Y(prefrontalDensity(a)));
  endShape();
  stroke('seagreen');
  drawingContext.setLineDash([8, 6]);
  beginShape();
  for (let a = 0; a <= maxAge; a += 0.1) vertex(X(a), Y(whiteMatter(a)));
  endShape();
  drawingContext.setLineDash([]);

  // age marker
  stroke('crimson');
  strokeWeight(2);
  line(X(age), gy0, X(age), gy1);
  noStroke();
  fill('steelblue'); circle(X(age), Y(sensoryDensity(age)), 11);
  fill('darkorange'); circle(X(age), Y(prefrontalDensity(age)), 11);
  fill('seagreen'); circle(X(age), Y(whiteMatter(age)), 11);

  // legend (wraps to two lines on narrow screens)
  let ly = gy1 + 46;
  textSize(14);
  textAlign(LEFT, CENTER);
  let items = [
    ['steelblue', 'Sensory synapses', false],
    ['darkorange', 'Prefrontal synapses', false],
    ['seagreen', 'White matter (myelin)', true]
  ];
  let lx = gx0 - 40;
  for (let it of items) {
    let w = 34 + textWidth(it[1]) + 16;
    if (lx + w > canvasWidth - 10) { lx = gx0 - 40; ly += 20; }
    stroke(it[0]); strokeWeight(3);
    if (it[2]) drawingContext.setLineDash([8, 6]);
    line(lx, ly, lx + 26, ly);
    drawingContext.setLineDash([]);
    noStroke(); fill('black');
    text(it[1], lx + 32, ly);
    lx += w;
  }

  // caveat line
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(14);
  let caveat = 'Approximate, schematic trends based on research. Relative units, not measurements; people vary.';
  if (textWidth(caveat) > canvasWidth - 20) {
    text('Approximate, schematic trends based on research.', canvasWidth / 2, ly + 14);
    text('Relative units, not measurements; people vary.', canvasWidth / 2, ly + 32);
  } else {
    text(caveat, canvasWidth / 2, ly + 16);
  }

  // readout of the current stage, in the control area
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Age: ' + nf(age, 1, 1) + ' yr', 80, drawHeight + 25);
  drawStageNote(gx0, gy0);
}

function stageNote(a) {
  if (a < 1) return 'Infancy: synapses form fast. Sensory cortex peaks first.';
  if (a < 3) return 'Toddler years: prefrontal synapses reach their peak too.';
  if (a < 6) return 'Early childhood: sensory pruning begins. Prefrontal stays near its peak.';
  if (a < 10) return 'Late childhood: sensory pruning continues. Myelin keeps growing.';
  if (a < 13) return 'Early teens: sensory pruning is mostly done. Prefrontal pruning speeds up.';
  if (a < 20) return 'Teens: prefrontal pruning and myelination are still under way.';
  if (a < 26) return 'Twenties: prefrontal fine-tuning continues; white matter still rising.';
  return 'Late twenties: changes slow down. White matter volume peaks around here.';
}

function drawStageNote(gx0, gy0) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  let note = stageNote(age);
  let y = gy0 - 26;
  if (textWidth(note) > canvasWidth - 30) {
    textSize(14);
    // split roughly in half on a space
    let mid = note.indexOf(' ', floor(note.length / 2));
    text(note.substring(0, mid), 15, y - 8);
    text(note.substring(mid + 1), 15, y + 8);
  } else {
    text(note, 15, y);
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
