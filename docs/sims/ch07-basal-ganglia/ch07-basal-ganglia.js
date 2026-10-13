// Basal Ganglia Gas and Brake MicroSim
// CANVAS_HEIGHT = 600 (drawHeight 550 + controlHeight 50)
// Use iframe height = 602px
// Chapter 7 of From Neuron to Bedside: Movement: Muscles, Reflexes, and Motor Control
//
// A SIMPLIFIED, textbook-standard ("classic" Albin/DeLong-style) model of the
// basal ganglia motor loop:
//   Cortex --(+ glutamate)--> Striatum (D1 neurons and D2 neurons)
//   Direct pathway:   Striatum D1 --(- GABA)--> GPi/SNr
//   Indirect pathway: Striatum D2 --(- GABA)--> GPe --(- GABA)--> STN --(+ glutamate)--> GPi/SNr
//   GPi/SNr --(- GABA)--> Thalamus --(+ glutamate)--> Cortex
//   SNc dopamine: excites D1 (direct) neurons, inhibits D2 (indirect) neurons
// Net effect: dopamine strengthens "GO" and weakens "NO-GO", so it releases the
// thalamus from the GPi/SNr brake and favors movement.
// The activity numbers are ILLUSTRATIVE (0 to 1 scale), not measured data.
// Real circuits include more connections (for example, the hyperdirect
// cortex-to-STN pathway) that this model leaves out on purpose.
// MicroSim template version 2026.03 structure (bouncing-ball.js)

// global variables for width and height
let containerWidth; // calculated from the <main> container on init and resize
let canvasWidth = 400;
// fixed top drawing region (no controls here)
let drawHeight = 550;
// control region below the drawing region
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
// room for the Reset button and the "Dopamine: 100% of normal" label
let sliderLeftMargin = 290;
let defaultTextSize = 16;

// controls
let dopamineSlider;
let resetButton;

// model state (0..1 activity values, illustrative)
let dopamine = 1.0; // 1.0 = normal
let act = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // Reset button (row 1)
  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 12);
  resetButton.mousePressed(resetDopamine);

  // Dopamine slider: 0% to 200% of normal, step 10, default 100
  dopamineSlider = createSlider(0, 200, 100, 10);
  dopamineSlider.position(sliderLeftMargin, drawHeight + 15);
  dopamineSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A simplified basal ganglia circuit diagram. Motor cortex excites the striatum. ' +
    'The direct pathway (striatum D1 neurons) inhibits the GPi/SNr output nuclei. The indirect pathway ' +
    '(striatum D2 neurons to GPe to subthalamic nucleus) excites GPi/SNr. GPi/SNr inhibits the thalamus, ' +
    'which excites the cortex. A dopamine slider from 0 to 200 percent of normal changes how thick each ' +
    'pathway arrow is and moves a movement-output meter from too little movement (Parkinson-like) ' +
    'through normal to too much movement (hyperkinetic).');
}

function draw() {
  updateCanvasSize();

  // drawing region background (required MicroSim standard)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control region background
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  dopamine = dopamineSlider.value() / 100;
  computeModel();

  drawTitle();
  drawCircuit();
  drawMeter();
  drawControlLabels();
}

// ---------------- Model ----------------
// All values are on a 0..1 scale. Normal dopamine (1.0) puts every node at 0.5.
function computeModel() {
  let d = dopamine - 1; // -1 (no dopamine) .. 0 (normal) .. +1 (double)
  act.cortex = 0.5;                       // steady cortical input to the striatum
  act.snc = constrain(dopamine / 2, 0, 1); // dopamine release from SNc
  act.d1 = constrain(0.5 + 0.35 * d, 0, 1); // D1: dopamine EXCITES the direct (GO) neurons
  act.d2 = constrain(0.5 - 0.35 * d, 0, 1); // D2: dopamine INHIBITS the indirect (NO-GO) neurons
  act.gpe = 1 - act.d2;                    // D2 striatal neurons inhibit GPe
  act.stn = 1 - act.gpe;                   // GPe inhibits STN
  // GPi/SNr: inhibited by the direct pathway, excited by STN
  act.gpi = constrain(0.5 - 0.5 * (act.d1 - 0.5) + 0.5 * (act.stn - 0.5), 0, 1);
  act.thal = 1 - act.gpi;                  // GPi/SNr inhibits the thalamus (the "brake")
  act.output = act.thal;                   // thalamus excites motor cortex: movement output
}

// ---------------- Drawing helpers ----------------
function drawTitle() {
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(constrain(canvasWidth / 20, 18, 24));
  text('Basal Ganglia Gas and Brake', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  noStroke();
  text('Simplified model. Activity values are illustrative.', 10, 36, canvasWidth - 20, 20);
  // legend
  let ly = 62;
  textAlign(LEFT, CENTER);
  let lx = 12;
  stroke('royalblue');
  strokeWeight(3);
  line(lx, ly, lx + 26, ly);
  drawArrowHead(lx + 30, ly, 0, 'royalblue', 8);
  noStroke();
  fill('black');
  text('+ excites', lx + 36, ly);
  let lx2 = lx + 112;
  stroke('crimson');
  strokeWeight(3);
  line(lx2, ly, lx2 + 26, ly);
  line(lx2 + 28, ly - 8, lx2 + 28, ly + 8);
  noStroke();
  fill('black');
  text('− inhibits', lx2 + 36, ly);
  let lx3 = lx2 + 118;
  stroke('darkorchid');
  strokeWeight(3);
  drawingContext.setLineDash([5, 4]);
  line(lx3, ly, lx3 + 26, ly);
  drawingContext.setLineDash([]);
  noStroke();
  fill('black');
  text('dopamine', lx3 + 34, ly);
}

// layout positions as fractions of the canvas width
function nodePos() {
  let W = canvasWidth;
  let top = 102;
  return {
    cortex: { x: 0.5 * W, y: top, w: 0.42 * W, h: 36, l1: 'Motor cortex', l2: '' },
    d1:     { x: 0.36 * W, y: top + 82, w: 0.25 * W, h: 42, l1: 'Striatum D1', l2: 'GO (direct)' },
    d2:     { x: 0.70 * W, y: top + 82, w: 0.25 * W, h: 42, l1: 'Striatum D2', l2: 'NO-GO (indirect)' },
    snc:    { x: 0.14 * W, y: top + 160, w: 0.19 * W, h: 42, l1: 'SNc', l2: 'dopamine' },
    gpe:    { x: 0.70 * W, y: top + 160, w: 0.19 * W, h: 36, l1: 'GPe', l2: '' },
    stn:    { x: 0.70 * W, y: top + 232, w: 0.19 * W, h: 36, l1: 'STN', l2: '' },
    gpi:    { x: 0.36 * W, y: top + 232, w: 0.25 * W, h: 42, l1: 'GPi / SNr', l2: 'the brake' },
    thal:   { x: 0.36 * W, y: top + 300, w: 0.25 * W, h: 36, l1: 'Thalamus', l2: '' }
  };
}

function drawCircuit() {
  let p = nodePos();
  let W = canvasWidth;

  // ---- Edges first (so boxes sit on top) ----
  // Cortex -> striatum (excitatory, glutamate)
  edge(p.d1.x, p.cortex.y + p.cortex.h / 2, p.d1.x, p.d1.y - p.d1.h / 2, +1, act.cortex);
  edge(p.d2.x - 0.04 * W, p.cortex.y + p.cortex.h / 2, p.d2.x - 0.04 * W, p.d2.y - p.d2.h / 2, +1, act.cortex);

  // Dopamine from SNc: + on D1, - on D2 (dashed purple)
  dopamineEdge(p.snc.x, p.snc.y - p.snc.h / 2, p.d1.x - p.d1.w / 2 + 6, p.d1.y + p.d1.h / 2, +1, act.snc, 'D1 +');
  dopamineEdge(p.snc.x + p.snc.w / 2, p.snc.y + 6, p.d2.x - p.d2.w / 2 + 4, p.d2.y + p.d2.h / 2 - 2, -1, act.snc, 'D2 −');

  // Direct pathway: D1 -| GPi/SNr
  edge(p.d1.x, p.d1.y + p.d1.h / 2, p.d1.x, p.gpi.y - p.gpi.h / 2, -1, act.d1);
  // Indirect pathway: D2 -| GPe -| STN -> GPi/SNr
  edge(p.d2.x, p.d2.y + p.d2.h / 2, p.gpe.x, p.gpe.y - p.gpe.h / 2, -1, act.d2);
  edge(p.gpe.x, p.gpe.y + p.gpe.h / 2, p.stn.x, p.stn.y - p.stn.h / 2, -1, act.gpe);
  edge(p.stn.x - p.stn.w / 2, p.stn.y, p.gpi.x + p.gpi.w / 2, p.gpi.y, +1, act.stn);
  // Output: GPi/SNr -| thalamus
  edge(p.gpi.x, p.gpi.y + p.gpi.h / 2, p.thal.x, p.thal.y - p.thal.h / 2, -1, act.gpi);
  // Thalamus -> cortex (routed up the left edge)
  let laneX = 0.025 * W;
  let w = 1.5 + 8 * act.thal;
  let c = color('royalblue');
  c.setAlpha(70 + 185 * act.thal);
  stroke(c);
  strokeWeight(w);
  noFill();
  line(p.thal.x - p.thal.w / 2, p.thal.y, laneX, p.thal.y);
  line(laneX, p.thal.y, laneX, p.cortex.y);
  line(laneX, p.cortex.y, p.cortex.x - p.cortex.w / 2 - 10, p.cortex.y);
  drawArrowHead(p.cortex.x - p.cortex.w / 2 - 2, p.cortex.y, 0, c, 8 + w);
  signBadge((laneX + p.cortex.x - p.cortex.w / 2) / 2, p.cortex.y, +1);

  // pathway name labels
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('direct', p.d1.x + 10, p.gpi.y - p.gpi.h / 2 - 14);
  textAlign(RIGHT, CENTER);
  text('indirect', p.gpe.x - 14, (p.gpe.y + p.stn.y) / 2);

  // ---- Nodes ----
  node(p.cortex, act.cortex, 'lavender');
  node(p.d1, act.d1, 'lightskyblue');
  node(p.d2, act.d2, 'lightsalmon');
  node(p.snc, act.snc, 'plum');
  node(p.gpe, act.gpe, 'wheat');
  node(p.stn, act.stn, 'wheat');
  node(p.gpi, act.gpi, 'lightcoral');
  node(p.thal, act.thal, 'lightskyblue');

  // brake status next to GPi/SNr and thalamus
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  let bx = p.thal.x + p.thal.w / 2 + 10;
  let brake = act.gpi > 0.65 ? 'Brake: STRONG' : (act.gpi < 0.35 ? 'Brake: WEAK' : 'Brake: normal');
  text(brake, bx, p.thal.y - 8);
  text('Thalamus activity: ' + nf(act.thal * 100, 0, 0) + '%', bx, p.thal.y + 12);
}

// draw a connection; sign +1 = excitatory (arrowhead), -1 = inhibitory (flat bar)
// thickness and brightness scale with the activity of the sending node
function edge(x1, y1, x2, y2, sign, strength) {
  let w = 1.5 + 8 * strength;
  let c = color(sign > 0 ? 'royalblue' : 'crimson');
  c.setAlpha(70 + 185 * strength);
  let ang = atan2(y2 - y1, x2 - x1);
  // stop the line short of the end so the head or bar sits at the box edge
  let ex = x2 - cos(ang) * 6;
  let ey = y2 - sin(ang) * 6;
  stroke(c);
  strokeWeight(w);
  line(x1, y1, ex, ey);
  if (sign > 0) {
    drawArrowHead(x2, y2, ang, c, 8 + w);
  } else {
    strokeWeight(max(3, w));
    let bl = 9 + w / 2;
    line(ex - sin(ang) * bl, ey + cos(ang) * bl, ex + sin(ang) * bl, ey - cos(ang) * bl);
  }
  signBadge((x1 + x2) / 2, (y1 + y2) / 2, sign);
}

function dopamineEdge(x1, y1, x2, y2, sign, strength, label) {
  let w = 1 + 7 * strength;
  let c = color('darkorchid');
  c.setAlpha(60 + 195 * strength);
  stroke(c);
  strokeWeight(w);
  drawingContext.setLineDash([7, 5]);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
  let ang = atan2(y2 - y1, x2 - x1);
  if (sign > 0) {
    drawArrowHead(x2, y2, ang, c, 8 + w);
  } else {
    strokeWeight(max(3, w));
    let bl = 8 + w / 2;
    line(x2 - sin(ang) * bl, y2 + cos(ang) * bl, x2 + sin(ang) * bl, y2 - cos(ang) * bl);
  }
  // label near the middle of the line
  let mx = x1 + (x2 - x1) * 0.55;
  let my = y1 + (y2 - y1) * 0.55;
  noStroke();
  fill('white');
  rectMode(CENTER);
  rect(mx, my, 42, 20, 5);
  rectMode(CORNER);
  fill('darkorchid');
  textSize(14);
  textAlign(CENTER, CENTER);
  noStroke();
  text(label, mx, my);
}

function drawArrowHead(x, y, ang, c, size) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(c);
  triangle(0, 0, -size, -size / 2, -size, size / 2);
  pop();
}

function signBadge(x, y, sign) {
  stroke(sign > 0 ? 'royalblue' : 'crimson');
  strokeWeight(1.5);
  fill('white');
  circle(x, y, 18);
  noStroke();
  fill(sign > 0 ? 'royalblue' : 'crimson');
  textSize(15);
  textAlign(CENTER, CENTER);
  text(sign > 0 ? '+' : '−', x, y);
}

// node box: brighter when more active
function node(n, a, col) {
  let base = color(col);
  let fillC = lerpColor(color('gainsboro'), base, constrain(0.25 + a, 0, 1));
  stroke(a > 0.65 ? 'black' : 'gray');
  strokeWeight(a > 0.65 ? 2.5 : 1.2);
  fill(fillC);
  rectMode(CENTER);
  rect(n.x, n.y, n.w, n.h, 8);
  rectMode(CORNER);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(n.w < 95 ? 14 : 15);
  if (n.l2 === '') {
    text(n.l1, n.x, n.y);
  } else {
    text(n.l1, n.x, n.y - 9);
    textSize(14);
    fill('dimgray');
    noStroke();
    // shorten the second line on very narrow layouts
    let l2 = n.l2;
    if (textWidth(l2) > n.w - 4 && l2.indexOf('(') > 0) l2 = l2.substring(0, l2.indexOf('(') - 1);
    text(l2, n.x, n.y + 10);
  }
}

// movement output meter at the bottom of the drawing region
function drawMeter() {
  let x0 = 0.05 * canvasWidth;
  let x1 = 0.95 * canvasWidth;
  let y = 450;
  let h = 22;
  let bw = x1 - x0;
  noStroke();
  fill('black');
  textAlign(LEFT, BOTTOM);
  textSize(15);
  text('Movement output', x0, y - 14);
  // zones: < 35% too little, 35% to 65% normal, > 65% too much
  stroke('gray');
  strokeWeight(1);
  fill('lightsteelblue');
  rect(x0, y, bw * 0.35, h);
  fill('honeydew');
  rect(x0 + bw * 0.35, y, bw * 0.30, h);
  fill('navajowhite');
  rect(x0 + bw * 0.65, y, bw * 0.35, h);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text('Too little', x0 + bw * 0.175, y + h + 4);
  text('Normal', x0 + bw * 0.5, y + h + 4);
  text('Too much', x0 + bw * 0.825, y + h + 4);
  // needle (marks the current movement output)
  let nx = x0 + bw * act.output;
  stroke('black');
  strokeWeight(3);
  line(nx, y - 4, nx, y + h);
  noStroke();
  fill('black');
  triangle(nx, y - 2, nx - 7, y - 12, nx + 7, y - 12);

  // status text
  let msg;
  if (act.output < 0.35) {
    msg = 'HYPOKINETIC (too little): the brake on the thalamus is too strong. Movements are slow, small, and hard to start, as in Parkinson\'s disease.';
  } else if (act.output > 0.65) {
    msg = 'HYPERKINETIC (too much): the brake is too weak. Extra, unwanted movements slip through, as in levodopa-induced dyskinesia or chorea.';
  } else {
    msg = 'BALANCED: GO and NO-GO are in balance. Wanted movements are released and unwanted ones are held back.';
  }
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(msg, x0, y + h + 24, bw, 60);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Dopamine: ' + dopamineSlider.value() + '% of normal', 80, drawHeight + 25);
}

function resetDopamine() {
  dopamineSlider.value(100);
}

// These two functions must be present for width responsiveness
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  dopamineSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
