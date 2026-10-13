// HPA Axis Feedback Loop MicroSim
// CANVAS_HEIGHT = 625 (drawHeight 545 + controlHeight 80); iframe height = 627
// Chapter 11: Emotion, Stress, and the Body (From Neuron to Bedside)
//
// A simplified causal-loop model of the stress response.
//   SLOW hormonal path (HPA axis): stressor -> hypothalamus (CRH) -> anterior pituitary (ACTH)
//                                  -> adrenal cortex (cortisol) -> body effects
//   Negative feedback: cortisol inhibits the hypothalamus and the pituitary.
//   FAST neural path: hypothalamus -> sympathetic nerves -> adrenal medulla (adrenaline).
//
// The model (relative units, every hormone has a resting baseline of 1.0):
//   inhibition  = 1 + feedback * K_FB * max(0, cortisol - 1)
//   dCRH/dt     = (D_CRH * 1 + STRESS_GAIN * stress) / inhibition - D_CRH * CRH
//   dACTH/dt    = D_ACTH * CRH / inhibition - D_ACTH * ACTH
//   dCort/dt    = D_CORT * ACTH - D_CORT * cortisol
//   dAdren/dt   = D_ADREN * (1 - adrenaline) + ADREN_GAIN * stress
//   dstress/dt  = -stress / TAU_STRESS          (each "Stressor" press adds 1)
// Assumptions and limits: this is a teaching model, not a physiological fit.
// Time constants are chosen so cortisol lags adrenaline by minutes and can stay
// up for an hour or more, matching the qualitative description in the chapter.
// It ignores the daily cortisol rhythm, vasopressin, the hippocampus and
// prefrontal inputs, receptor types, and individual differences.
// MicroSim template version 2026.03

// ---------- canvas layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 545;
let controlHeight = 80;          // 2 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 285;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, stressButton, resetButton, chronicCheckbox, feedbackSlider;
let isRunning = false;           // all MicroSims start paused

// ---------- model constants ----------
const DT = 1 / 6;                // simulated minutes per frame
const D_CRH = 0.2;               // CRH clearance (per minute)
const D_ACTH = 0.1;              // ACTH clearance (per minute)
const D_CORT = 1 / 30;           // cortisol clearance (per minute), slowest
const D_ADREN = 0.5;             // adrenaline clearance (per minute), fastest
const STRESS_GAIN = 4;           // how hard a stressor drives CRH
const ADREN_GAIN = 1;            // how hard a stressor drives adrenaline
const K_FB = 1.5;                // strength of cortisol's brake at feedback = 1
const TAU_STRESS = 8;            // a single stressor fades over about 8 minutes
const CHRONIC_PERIOD = 30;       // a new stressor every 30 minutes when chronic
const WINDOW = 240;              // minutes shown on the plot
const Y_MAX = 8;                 // plot ceiling (x baseline)

// ---------- model state ----------
let stress, crh, acth, cortisol, adrenaline, simTime, lastChronicPulse;
let history = [];                // {t, cort, adren, pulse}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: buttons and checkbox
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  stressButton = createButton('Stressor!');
  stressButton.position(72, drawHeight + 8);
  stressButton.mousePressed(addStressor);

  resetButton = createButton('Reset');
  resetButton.position(158, drawHeight + 8);
  resetButton.mousePressed(resetModel);

  chronicCheckbox = createCheckbox(' Chronic stress', false);
  chronicCheckbox.position(225, drawHeight + 10);
  chronicCheckbox.changed(() => { lastChronicPulse = -Infinity; });

  // Row 2: feedback slider (0 = broken brake, 1 = intact)
  feedbackSlider = createSlider(0, 1, 1, 0.1);
  feedbackSlider.position(sliderLeftMargin, drawHeight + 45);
  feedbackSlider.size(canvasWidth - sliderLeftMargin - margin);

  resetModel();

  describe('A causal loop diagram of the stress response. A stressor drives the hypothalamus to release CRH, ' +
    'the pituitary to release ACTH, and the adrenal cortex to release cortisol, which raises blood glucose. ' +
    'Cortisol feeds back with minus signs to slow the hypothalamus and pituitary. A faster sympathetic path ' +
    'releases adrenaline from the adrenal medulla. Below, a live graph plots cortisol and adrenaline over time. ' +
    'Buttons add a stressor, start or pause, and reset; a checkbox makes the stress chronic; a slider sets feedback strength.');
}

function resetModel() {
  stress = 0; crh = 1; acth = 1; cortisol = 1; adrenaline = 1;
  simTime = 0; lastChronicPulse = -Infinity;
  history = [{ t: 0, cort: 1, adren: 1, pulse: false }];
}

function addStressor() {
  stress += 1;
  if (history.length > 0) history[history.length - 1].pulse = true;
  if (!isRunning) toggleSimulation();   // a stressor press starts the clock
}

function stepModel(feedback) {
  const inhibition = 1 + feedback * K_FB * max(0, cortisol - 1);
  crh += DT * ((D_CRH + STRESS_GAIN * stress) / inhibition - D_CRH * crh);
  acth += DT * (D_ACTH * crh / inhibition - D_ACTH * acth);
  cortisol += DT * (D_CORT * acth - D_CORT * cortisol);
  adrenaline += DT * (D_ADREN * (1 - adrenaline) + ADREN_GAIN * stress);
  stress += DT * (-stress / TAU_STRESS);
  simTime += DT;
}

function draw() {
  updateCanvasSize();

  // required backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  const feedback = feedbackSlider.value();

  // advance the model
  if (isRunning) {
    if (chronicCheckbox.checked() && simTime - lastChronicPulse >= CHRONIC_PERIOD) {
      lastChronicPulse = simTime;
      stress += 1;
      if (history.length > 0) history[history.length - 1].pulse = true;
    }
    stepModel(feedback);
    history.push({ t: simTime, cort: cortisol, adren: adrenaline, pulse: false });
    while (history.length > 2 && history[0].t < simTime - WINDOW) history.shift();
  }

  // title and instruction
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 19 : 22);
  textStyle(BOLD);
  text('HPA Axis Feedback Loop', canvasWidth / 2, 8);
  textStyle(NORMAL);
  textSize(14);
  fill('dimgray');
  noStroke();
  text('Press Stressor! Then weaken the feedback or check Chronic stress and compare.', 10, 36,
       canvasWidth - 20);

  drawLoopDiagram(feedback);
  drawPlot();
  drawControlLabels(feedback);
}

// ---------- causal loop diagram ----------
function drawLoopDiagram(feedback) {
  const colW = canvasWidth / 3;
  const bw = min(170, colW - 24);
  const bh = 50;
  const cx = [colW * 0.5, colW * 1.5, colW * 2.5];
  const y1 = 80, y2 = 178;
  const small = canvasWidth < 560;

  // node boxes: x center, y top, title, subtitle, level (for glow)
  const nodes = {
    stressor: { x: cx[0], y: y1, t: 'Stressor', s: small ? 'test, crash...' : 'test, danger, crash', lvl: 1 + 2 * stress },
    hypo:     { x: cx[1], y: y1, t: 'Hypothalamus', s: 'CRH ' + fmt(crh), lvl: crh },
    pit:      { x: cx[2], y: y1, t: 'Pituitary', s: 'ACTH ' + fmt(acth), lvl: acth },
    body:     { x: cx[0], y: y2, t: 'Body effects', s: small ? 'glucose, HR ↑' : 'glucose ↑, heart rate ↑', lvl: max(cortisol, adrenaline) },
    medulla:  { x: cx[1], y: y2, t: 'Adrenal medulla', s: 'adrenaline ' + fmt(adrenaline), lvl: adrenaline },
    cortex:   { x: cx[2], y: y2, t: 'Adrenal cortex', s: 'cortisol ' + fmt(cortisol), lvl: cortisol }
  };

  // arrows first (so boxes sit on top)
  const fwdColor = 'steelblue';
  const fastColor = 'darkorange';
  // stressor -> hypothalamus
  arrowLine(nodes.stressor.x + bw / 2, y1 + bh / 2, nodes.hypo.x - bw / 2, y1 + bh / 2, fwdColor, 2.5, false);
  signBadge((nodes.stressor.x + nodes.hypo.x) / 2, y1 + bh / 2 - 13, '+', fwdColor);
  // hypothalamus -> pituitary (CRH)
  arrowLine(nodes.hypo.x + bw / 2, y1 + bh / 2, nodes.pit.x - bw / 2, y1 + bh / 2, fwdColor, 2.5, false);
  signBadge((nodes.hypo.x + nodes.pit.x) / 2, y1 + bh / 2 - 13, '+', fwdColor);
  // pituitary -> adrenal cortex (ACTH)
  arrowLine(nodes.pit.x - 14, y1 + bh, nodes.cortex.x - 14, y2, fwdColor, 2.5, false);
  signBadge(nodes.pit.x - 30, (y1 + bh + y2) / 2, '+', fwdColor);
  // adrenal cortex -> body effects (routed underneath the medulla)
  const yLow = y2 + bh + 16;
  stroke(fwdColor); strokeWeight(2.5); noFill();
  line(nodes.cortex.x, y2 + bh, nodes.cortex.x, yLow);
  line(nodes.cortex.x, yLow, nodes.body.x, yLow);
  arrowLine(nodes.body.x, yLow, nodes.body.x, y2 + bh, fwdColor, 2.5, false);
  fill(fwdColor); noStroke(); textAlign(CENTER, TOP); textSize(14);
  text('cortisol (slow, minutes to hours)', (nodes.body.x + nodes.cortex.x) / 2, yLow + 3);

  // fast sympathetic path
  arrowLine(nodes.hypo.x, y1 + bh, nodes.medulla.x, y2, fastColor, 2.5, false);
  arrowLine(nodes.medulla.x - bw / 2, y2 + bh / 2, nodes.body.x + bw / 2, y2 + bh / 2, fastColor, 2.5, false);
  fill(fastColor); noStroke(); textSize(14);
  textAlign(RIGHT, CENTER);
  text(small ? 'nerves (fast)' : 'sympathetic nerves (fast, seconds)', nodes.hypo.x - 6, (y1 + bh + y2) / 2);

  // negative feedback arrows (dashed); thickness and opacity follow the slider
  const fbAlpha = 60 + 195 * feedback;
  const fbW = 1 + 3 * feedback;
  const fbCol = color(178, 34, 34, fbAlpha);   // firebrick, faded when weak
  // cortex -> hypothalamus (diagonal)
  const ax = nodes.cortex.x - bw / 2 + 6, ay = y2 + 4;
  const bx = nodes.hypo.x + bw / 2 - 6, by = y1 + bh - 2;
  arrowLine(ax, ay, bx, by, fbCol, fbW, true);
  signBadge(lerp(ax, bx, 0.5), lerp(ay, by, 0.5), '−', fbCol);
  // cortex -> pituitary (arc on the right side)
  const rx = nodes.cortex.x + bw / 2;
  const bulge = min(22, (canvasWidth - rx) - 6);
  stroke(fbCol); strokeWeight(fbW); noFill();
  drawingContext.setLineDash([6, 5]);
  bezier(rx, y2 + bh / 2, rx + bulge, y2 + bh / 2, rx + bulge, y1 + bh / 2, rx + 2, y1 + bh / 2 + 4);
  drawingContext.setLineDash([]);
  arrowHead(rx + 2, y1 + bh / 2 + 4, PI, fbCol, fbW);
  signBadge(nodes.pit.x + 22, (y1 + bh + y2) / 2, '−', fbCol);

  // boxes on top
  for (const key in nodes) drawNode(nodes[key], bw, bh, key === 'stressor');
}

function drawNode(n, bw, bh, isStressor) {
  // glow strength: 0 at baseline, up to 1 when level is about 4x baseline
  const g = constrain((n.lvl - 1) / 3, 0, 1);
  stroke('slategray');
  strokeWeight(1.5);
  if (isStressor) fill(lerpColor(color('white'), color('gold'), g));
  else fill(lerpColor(color('white'), color('lightsalmon'), g));
  rect(n.x - bw / 2, n.y, bw, bh, 8);
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(bw < 120 ? 14 : 15);
  text(n.t, n.x, n.y + 6);
  textStyle(NORMAL);
  textSize(14);
  noStroke();
  text(n.s, n.x, n.y + 27);
}

function fmt(v) { return '×' + v.toFixed(1); }

function arrowLine(x1, y1, x2, y2, col, w, dashed) {
  stroke(col); strokeWeight(w); noFill();
  if (dashed) drawingContext.setLineDash([6, 5]);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
  arrowHead(x2, y2, atan2(y2 - y1, x2 - x1), col, w);
}

function arrowHead(x, y, ang, col, w) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(col);
  const s = 6 + w;
  triangle(0, 0, -s * 1.5, -s * 0.7, -s * 1.5, s * 0.7);
  pop();
}

function signBadge(x, y, sym, col) {
  stroke(col); strokeWeight(1.5); fill('white');
  circle(x, y, 20);
  noStroke(); fill(col);
  textAlign(CENTER, CENTER); textSize(16); textStyle(BOLD);
  text(sym, x, y - 1);
  textStyle(NORMAL);
}

// ---------- live plot ----------
function drawPlot() {
  const left = 52, right = canvasWidth - 16;
  const top = 315, bottom = drawHeight - 42;
  const w = right - left, h = bottom - top;

  // plot box and grid
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(left, top, w, h);
  stroke('gainsboro');
  for (let v = 1; v <= Y_MAX; v++) {
    const y = map(v, 0, Y_MAX, bottom, top);
    line(left, y, right, y);
  }
  // baseline line
  stroke('gray'); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  const yb = map(1, 0, Y_MAX, bottom, top);
  line(left, yb, right, yb);
  drawingContext.setLineDash([]);

  // axis labels
  fill('black'); noStroke(); textSize(14);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= Y_MAX; v += 2) text(v, left - 6, map(v, 0, Y_MAX, bottom, top));
  push();
  translate(14, (top + bottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  noStroke();
  text('level (× baseline)', 0, 0);
  pop();
  const tEnd = max(WINDOW, simTime);
  const tStart = tEnd - WINDOW;
  textAlign(CENTER, TOP);
  noStroke();
  for (let m = ceil(tStart / 60) * 60; m <= tEnd; m += 60) {
    const x = map(m, tStart, tEnd, left, right);
    text(m, x, bottom + 4);
  }
  text('time (minutes, simplified model, relative units)', (left + right) / 2, bottom + 22);

  // stressor markers
  for (const p of history) {
    if (p.pulse) {
      const x = map(p.t, tStart, tEnd, left, right);
      stroke('goldenrod'); strokeWeight(2);
      line(x, top, x, top + 10);
    }
  }

  // traces: adrenaline (thin, fast) then cortisol (thick, slow)
  noFill();
  stroke('darkorange'); strokeWeight(2);
  beginShape();
  for (const p of history) vertex(map(p.t, tStart, tEnd, left, right), map(min(p.adren, Y_MAX), 0, Y_MAX, bottom, top));
  endShape();
  stroke('firebrick'); strokeWeight(3.5);
  beginShape();
  for (const p of history) vertex(map(p.t, tStart, tEnd, left, right), map(min(p.cort, Y_MAX), 0, Y_MAX, bottom, top));
  endShape();

  // legend and readout (in the strip above the plot box, so traces never hide it)
  const ly = top - 14;
  const lx = left;
  textSize(14); textAlign(LEFT, CENTER);
  stroke('firebrick'); strokeWeight(3.5); line(lx, ly, lx + 20, ly);
  noStroke(); fill('black'); text('cortisol ' + fmt(cortisol), lx + 26, ly);
  stroke('darkorange'); strokeWeight(2); line(lx + 140, ly, lx + 160, ly);
  noStroke(); fill('black'); text('adrenaline ' + fmt(adrenaline), lx + 166, ly);
  if (canvasWidth > 600) {
    textAlign(RIGHT, CENTER);
    fill('dimgray');
    noStroke();
    text('dashed = baseline, gold ticks = stressors', right, ly);
  }
}

// ---------- control labels ----------
function drawControlLabels(feedback) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  let word = feedback >= 0.8 ? 'intact' : (feedback > 0 ? 'weakened' : 'off');
  text('Feedback strength: ' + feedback.toFixed(1) + ' (' + word + ')', 10, drawHeight + 56);
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  feedbackSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
