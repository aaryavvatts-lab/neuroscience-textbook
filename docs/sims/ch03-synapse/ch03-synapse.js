// Synapse Simulator MicroSim (Chapter 3: Synapses and Neurotransmitters)
// From Neuron to Bedside, by Aaryav Sharma. License: CC BY-NC-SA 4.0
// CANVAS_HEIGHT = 550 (drawHeight 470 + controlHeight 80). Iframe height = 552.
//
// A close-up of one chemical synapse. Each "Fire" releases neurotransmitter
// particles from vesicles. Particles drift and diffuse across the cleft, bind
// receptors on the postsynaptic membrane, unbind, and are cleared by reuptake
// transporters on the presynaptic membrane (a few drift away out of the synapse).
// The postsynaptic potential (PSP) is driven by the number of receptors that are
// bound at each moment. If the PSP reaches threshold, the postsynaptic cell fires.
//
// The model is QUALITATIVE. Particle counts, receptor counts, time constants and
// the gain from "bound receptors" to millivolts are illustrative choices, picked so
// the four conditions show the correct direction of change. Only the resting
// potential (-70 mV), threshold (about -55 mV) and spike peak (about +30 mV) are
// textbook values (Chapter 2). Time runs in slow motion.
//
// Conditions:
//   Normal                  - transporters clear the cleft quickly; brief EPSP.
//                             Modeled on a STRONG synapse with a high safety factor
//                             (like the neuromuscular junction), so one release is
//                             usually enough to reach threshold. Most central
//                             synapses are weaker and need summation.
//   Reuptake blocker (SSRI) - transporters blocked; transmitter lingers; PSP longer
//   Receptor antagonist     - a drug sits on most receptors; few channels open
//   Fewer receptors (MG)    - antibodies removed half the receptors; smaller PSP
//                             that often fails to reach threshold, worse at high rates.
//                             (At a real neuromuscular junction an enzyme,
//                             acetylcholinesterase, clears acetylcholine instead of
//                             reuptake; the sim keeps one clearance method so only
//                             one thing changes between conditions.)

// ---------- canvas layout (MicroSim standard) ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 470;
let controlHeight = 80;          // 2 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 330;      // Start + Fire buttons + label/value
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, fireButton, resetButton, rateSlider, conditionSelect;
let isRunning = false;           // MicroSims start paused

// ---------- model constants (illustrative) ----------
const DT = 1 / 60;               // model seconds per frame
const V_REST = -70;              // mV
const V_THRESH = -55;            // mV
const V_PEAK = 30;               // mV
const V_UNDERSHOOT = -75;        // mV
const TAU_PSP = 0.03;            // s, how fast the PSP follows open channels
const GAIN_MV = 7;             // mV of depolarization per bound receptor
const PARTICLES_PER_RELEASE = 40;// particles released when the store is full
const RELEASE_FRACTION = 0.5;   // fraction of the releasable store used per spike
const STORE_RECOVERY_TAU = 2.0;  // s, refilling of the releasable store
const BIND_TIME = 0.1;          // s a transmitter stays on a receptor
const REFRACTORY = 0.08;          // s after a postsynaptic spike
const HISTORY_SECONDS = 4;       // width of the trace windows
const DIFFUSE_LOSS = 0.0025;      // chance per frame a free particle drifts out of the synapse

const CONDITIONS = [
  'Normal',
  'Reuptake blocker (like an SSRI)',
  'Receptor antagonist',
  'Fewer receptors (myasthenia-like)'
];
const CONDITION_NOTES = [
  'Normal: modeled on a strong synapse (like nerve to muscle), so almost every release reaches threshold. Most brain synapses need summation.',
  'Reuptake blocker: transporters are blocked (gray X). Transmitter lingers and keeps binding, so the response lasts longer.',
  'Antagonist: a drug (gray caps) sits on most receptors without opening them. Transmitter is there, but the PSP is small.',
  'Fewer receptors (like myasthenia gravis): half the receptors are gone. The PSP is smaller and often misses threshold, more often at high firing rates.'
];

// receptor and transporter positions in normalized cleft coordinates (x: 0..1)
const RECEPTOR_X = [0.15, 0.22, 0.29, 0.36, 0.43, 0.50, 0.57, 0.64, 0.71, 0.78, 0.85, 0.92];
const TRANSPORTER_X = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
const RECEPTOR_HALF_WIDTH = 0.03;
const TRANSPORTER_HALF_WIDTH = 0.05;

// ---------- model state ----------
let particles = [];      // {x, y, vy, bound(-1 or receptor index), t}
let receptors = [];      // {x, present, blocked, boundTimer}
let condition = 0;
let simTime = 0;
let nextSpikeTime = 0;
let store = 1.0;         // readily releasable store (0..1)
let V = V_REST;
let spikePhase = -1;     // >=0 while drawing a postsynaptic action potential
let refractoryTimer = 0;
let releaseCount = 0;
let postSpikeCount = 0;   // releases that made the postsynaptic cell fire
let armed = false;        // one postsynaptic spike allowed per release
let pendingRelease = 0;  // releases requested by the Fire button
let cleftHistory = [];   // free particles in cleft, one entry per frame
let vHistory = [];       // membrane potential, one entry per frame
let releaseMarks = [];   // frame indices where a release happened (for the trace)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: Start/Pause, Fire, Reset, firing-rate slider
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleSimulation);

  fireButton = createButton('Fire once');
  fireButton.position(70, drawHeight + 8);
  fireButton.mousePressed(fireOnce);

  resetButton = createButton('Reset');
  resetButton.position(150, drawHeight + 8);
  resetButton.mousePressed(resetModel);

  rateSlider = createSlider(0, 5, 1, 1);
  rateSlider.position(sliderLeftMargin, drawHeight + 8);
  rateSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 2: condition select
  conditionSelect = createSelect();
  for (let c of CONDITIONS) conditionSelect.option(c);
  conditionSelect.selected(CONDITIONS[0]);
  conditionSelect.position(100, drawHeight + 45);
  conditionSelect.changed(changeCondition);

  resetModel();
  // Starting state: one release frozen part-way across the cleft (still paused)
  pendingRelease = 1;
  for (let i = 0; i < 24; i++) stepModel();
  describe('A close-up of a chemical synapse. Pressing Fire releases neurotransmitter particles from vesicles in the presynaptic terminal. The particles cross the synaptic cleft, bind receptors on the postsynaptic membrane, and are cleared by reuptake transporters. Two graphs show the amount of transmitter in the cleft and the postsynaptic membrane potential in millivolts, with a dashed threshold line. A menu switches between normal, a reuptake blocker, a receptor antagonist, and fewer receptors as in myasthenia gravis.');
}

// ---------- model ----------
function setupReceptors() {
  receptors = [];
  for (let i = 0; i < RECEPTOR_X.length; i++) {
    let present = true;
    let blocked = false;
    // Fewer receptors: keep 6 of 12 (antibodies have removed the rest)
    if (condition === 3) present = (i % 2 === 0);
    // Antagonist: 8 of 12 receptors occupied by the drug
    if (condition === 2) blocked = (i % 3 !== 1);
    receptors.push({ x: RECEPTOR_X[i], present: present, blocked: blocked, boundTimer: 0 });
  }
}

function resetModel() {
  particles = [];
  simTime = 0;
  nextSpikeTime = 1.0;
  store = 1.0;
  V = V_REST;
  spikePhase = -1;
  refractoryTimer = 0;
  releaseCount = 0;
  postSpikeCount = 0;
  armed = false;
  pendingRelease = 0;
  cleftHistory = [];
  vHistory = [];
  releaseMarks = [];
  setupReceptors();
}

function changeCondition() {
  condition = CONDITIONS.indexOf(conditionSelect.value());
  resetModel();
}

function fireOnce() {
  pendingRelease++;
  if (!isRunning) toggleSimulation();
}

function releaseTransmitter() {
  // A presynaptic action potential opens calcium channels; vesicles fuse and
  // empty their transmitter into the cleft. Release shrinks if the store is low.
  let n = round(PARTICLES_PER_RELEASE * store);
  store -= RELEASE_FRACTION * store;
  for (let i = 0; i < n; i++) {
    particles.push({
      x: 0.5 + (Math.random() - 0.5) * 0.3,   // active zone in the middle
      y: 0.12,
      vy: 0.05 + Math.random() * 0.03,       // pushed out of the vesicle
      bound: -1,
      t: 0
    });
  }
  releaseCount++;
  armed = true;
  releaseMarks.push(vHistory.length);
}

function stepModel() {
  simTime += DT;
  // automatic firing at the chosen rate
  let rate = rateSlider.value();
  if (rate > 0 && simTime >= nextSpikeTime) {
    releaseTransmitter();
    nextSpikeTime = simTime + 1 / rate;
  }
  if (pendingRelease > 0) {
    releaseTransmitter();
    pendingRelease--;
  }
  // refill the releasable store
  store += (1 - store) * (DT / STORE_RECOVERY_TAU);

  let reuptakeOn = (condition !== 1);
  let survivors = [];
  for (let p of particles) {
    if (p.bound >= 0) {
      p.t -= DT;
      if (p.t <= 0) {                 // unbind and bounce back into the cleft
        receptors[p.bound].boundTimer = 0;
        p.bound = -1;
        p.y = 0.93;
        p.vy = -0.05 - Math.random() * 0.03;
      }
      survivors.push(p);
      continue;
    }
    // drift (decays) plus random diffusion
    p.vy *= 0.9;
    p.y += p.vy + gaussian() * 0.15;
    p.x += gaussian() * 0.03;
    // out the open sides of the cleft, or away in 3-D: diffused away
    if (p.x < 0 || p.x > 1 || Math.random() < DIFFUSE_LOSS) continue;
    // postsynaptic membrane: try to bind a free receptor
    if (p.y >= 0.95) {
      let r = receptorAt(p.x);
      if (r >= 0 && Math.random() < 0.8) {
        p.bound = r;
        p.t = BIND_TIME;
        receptors[r].boundTimer = BIND_TIME;
        p.y = 0.95;
        survivors.push(p);
        continue;
      }
      p.y = 1.9 - p.y;               // reflect
    }
    // presynaptic membrane: reuptake transporters
    if (p.y <= 0) {
      if (reuptakeOn && onTransporter(p.x)) continue;
      p.y = -p.y;                    // reflect
    }
    survivors.push(p);
  }
  particles = survivors;

  // postsynaptic membrane potential
  let bound = 0;
  for (let r of receptors) if (r.boundTimer > 0) bound++;
  if (spikePhase >= 0) {
    // draw a stereotyped action potential in the postsynaptic cell
    spikePhase += DT;
    if (spikePhase < 0.03) V = lerp(V_THRESH, V_PEAK, spikePhase / 0.03);
    else if (spikePhase < 0.08) V = lerp(V_PEAK, V_UNDERSHOOT, (spikePhase - 0.03) / 0.05);
    else { spikePhase = -1; refractoryTimer = REFRACTORY; }
  } else {
    let target = V_REST + GAIN_MV * bound;
    V += (target - V) * (DT / TAU_PSP);
    if (refractoryTimer > 0) refractoryTimer -= DT;
    else if (armed && V >= V_THRESH) { // threshold reached: all-or-none spike
      spikePhase = 0;
      postSpikeCount++;
      armed = false;
    }
  }

  // histories
  let free = 0;
  for (let p of particles) if (p.bound < 0) free++;
  cleftHistory.push(free);
  vHistory.push(V);
  let maxLen = round(HISTORY_SECONDS / DT);
  if (vHistory.length > maxLen) {
    cleftHistory.shift();
    vHistory.shift();
    releaseMarks = releaseMarks.map(m => m - 1).filter(m => m >= 0);
  }
}

function receptorAt(x) {
  for (let i = 0; i < receptors.length; i++) {
    let r = receptors[i];
    if (r.present && !r.blocked && r.boundTimer <= 0 && Math.abs(x - r.x) <= RECEPTOR_HALF_WIDTH) return i;
  }
  return -1;
}

function onTransporter(x) {
  for (let tx of TRANSPORTER_X) if (Math.abs(x - tx) <= TRANSPORTER_HALF_WIDTH) return true;
  return false;
}

function gaussian() {
  // Box-Muller standard normal
  let u = 1 - Math.random();
  let v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning) stepModel();

  // title and instruction line
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Synapse Simulator', canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  noStroke();
  text('Press Fire once or Start. Then switch the condition and compare.', 10, 38, canvasWidth - 20, 40);

  // layout: side by side when wide, stacked when narrow
  let wide = canvasWidth >= 680;
  let top = wide ? 64 : 80;
  let noteH = wide ? 62 : 78;
  let synBox, g1, g2;
  if (wide) {
    let sw = canvasWidth * 0.56;
    synBox = { x: 10, y: top, w: sw - 15, h: drawHeight - top - noteH - 6 };
    let gx = sw + 5, gw = canvasWidth - gx - 10;
    let gh = (drawHeight - top - noteH - 16) / 2;
    g1 = { x: gx, y: top, w: gw, h: gh };
    g2 = { x: gx, y: top + gh + 10, w: gw, h: gh };
  } else {
    let avail = drawHeight - top - noteH - 6;
    synBox = { x: 10, y: top, w: canvasWidth - 20, h: avail * 0.52 };
    let gy = top + avail * 0.52 + 6;
    let gw = (canvasWidth - 30) / 2;
    let gh = avail * 0.48 - 6;
    g1 = { x: 10, y: gy, w: gw, h: gh };
    g2 = { x: 20 + gw, y: gy, w: gw, h: gh };
  }

  drawSynapse(synBox);
  drawCleftGraph(g1);
  drawVoltageGraph(g2);
  drawNote(10, drawHeight - noteH - 2, canvasWidth - 20, noteH);
  drawControlLabels();
}

function drawSynapse(b) {
  // geometry: terminal on top, cleft in the middle, postsynaptic cell below
  let preY = b.y + b.h * 0.42;
  let postY = b.y + b.h * 0.66;
  let cx0 = b.x + b.w * 0.06, cx1 = b.x + b.w * 0.94;
  let mapX = (x) => lerp(cx0, cx1, x);
  let mapY = (y) => lerp(preY + 4, postY - 4, y);

  // presynaptic terminal
  stroke('peru');
  strokeWeight(2);
  fill('bisque');
  rect(b.x + b.w * 0.04, b.y, b.w * 0.92, preY - b.y, 0, 0, 40, 40);
  // postsynaptic cell
  stroke('cadetblue');
  fill('lavender');
  rect(b.x + b.w * 0.02, postY, b.w * 0.96, b.y + b.h - postY, 30, 30, 0, 0);

  // vesicles: two rows of four; the number shown follows the releasable store
  let nVes = round(store * 8);
  for (let i = 0; i < 8; i++) {
    let col = i % 4, row = floor(i / 4);
    let vx = b.x + b.w * 0.5 + (col - 1.5) * 26 + (row === 1 ? 13 : 0);
    let vy = b.y + (preY - b.y) * (row === 0 ? 0.68 : 0.42);
    if (i < nVes) {
      stroke('darkorange');
      strokeWeight(1.5);
      fill('lightyellow');
      circle(vx, vy, 20);
      noStroke();
      fill('crimson');
      circle(vx - 3, vy - 2, 4);
      circle(vx + 3, vy + 2, 4);
      circle(vx + 2, vy - 4, 4);
    }
  }

  // reuptake transporters on the presynaptic membrane
  for (let tx of TRANSPORTER_X) {
    let x = mapX(tx);
    stroke('navy');
    strokeWeight(1);
    fill(condition === 1 ? 'lightgray' : 'royalblue');
    rect(x - 9, preY - 9, 18, 14, 3);
    if (condition === 1) {
      stroke('black');
      strokeWeight(2);
      line(x - 7, preY - 7, x + 7, preY + 3);
      line(x + 7, preY - 7, x - 7, preY + 3);
    }
  }

  // receptors on the postsynaptic membrane
  for (let r of receptors) {
    if (!r.present) continue;
    let x = mapX(r.x);
    stroke('darkgreen');
    strokeWeight(2);
    fill(r.boundTimer > 0 ? 'limegreen' : 'honeydew');
    // a cup open toward the cleft
    beginShape();
    vertex(x - 9, postY - 8);
    vertex(x - 9, postY + 6);
    vertex(x + 9, postY + 6);
    vertex(x + 9, postY - 8);
    vertex(x + 4, postY - 8);
    vertex(x + 4, postY);
    vertex(x - 4, postY);
    vertex(x - 4, postY - 8);
    endShape(CLOSE);
    if (r.blocked) {         // antagonist drug sitting in the binding site
      noStroke();
      fill('dimgray');
      rect(x - 6, postY - 11, 12, 9, 2);
    }
  }

  // neurotransmitter particles
  noStroke();
  fill('crimson');
  for (let p of particles) circle(mapX(p.x), mapY(p.y), 6);

  // labels
  fill('black');
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text('Presynaptic terminal (vesicles)', b.x + b.w * 0.07, b.y + 6);
  textAlign(LEFT, CENTER);
  fill('saddlebrown');
  text('Synaptic cleft', b.x + 4, (preY + postY) / 2);
  fill('black');
  textAlign(LEFT, TOP);
  text('Postsynaptic cell with receptors', b.x + b.w * 0.07, postY + 14);
  // legend
  let ly = postY + 34;
  noStroke();
  fill('crimson');
  circle(b.x + b.w * 0.07 + 5, ly + 8, 8);
  fill('black');
  text('transmitter', b.x + b.w * 0.07 + 14, ly);
  let lx2 = b.x + b.w * 0.07 + 110;
  fill('royalblue');
  rect(lx2, ly + 2, 14, 11, 2);
  fill('black');
  text('transporter', lx2 + 18, ly);
  if (b.w > 420) {
    let lx3 = lx2 + 112;
    fill('limegreen');
    rect(lx3, ly + 2, 14, 11, 2);
    fill('black');
    text('bound receptor', lx3 + 18, ly);
  }
}

function drawPanel(g, title) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(g.x, g.y, g.w, g.h, 8);
  fill('black');
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(title, g.x + 8, g.y + 5);
}

function drawCleftGraph(g) {
  drawPanel(g, 'Transmitter in cleft (particles)');
  let px = g.x + 8, py = g.y + 44, pw = g.w - 16, ph = g.h - 52;
  let maxVal = 120;
  stroke('gainsboro');
  line(px, py + ph, px + pw, py + ph);
  noFill();
  stroke('crimson');
  strokeWeight(2);
  let maxLen = round(HISTORY_SECONDS / DT);
  beginShape();
  for (let i = 0; i < cleftHistory.length; i++) {
    let x = px + pw * (i / maxLen);
    let y = py + ph - ph * min(cleftHistory[i], maxVal) / maxVal;
    vertex(x, y);
  }
  endShape();
  strokeWeight(1);
  let now = cleftHistory.length ? cleftHistory[cleftHistory.length - 1] : 0;
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  text('now: ' + now, g.x + 8, g.y + 23);
}

function drawVoltageGraph(g) {
  drawPanel(g, 'Postsynaptic potential (mV)');
  let px = g.x + 40, py = g.y + 44, pw = g.w - 48, ph = g.h - 52;
  let vMin = -80, vMax = 40;
  let mapV = (v) => py + ph - ph * (v - vMin) / (vMax - vMin);
  // axis ticks
  fill('dimgray');
  noStroke();
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('+30', px - 4, mapV(30));
  text('-70', px - 4, mapV(-70) + 5);
  // resting line and dashed threshold line
  stroke('gainsboro');
  line(px, mapV(-70), px + pw, mapV(-70));
  stroke('orange');
  drawingContext.setLineDash([5, 4]);
  line(px, mapV(V_THRESH), px + pw, mapV(V_THRESH));
  drawingContext.setLineDash([]);
  fill('darkorange');
  noStroke();
  textAlign(RIGHT, CENTER);
  text('-55', px - 4, mapV(V_THRESH) - 6);
  // release marks
  let maxLen = round(HISTORY_SECONDS / DT);
  stroke('pink');
  for (let m of releaseMarks) {
    let x = px + pw * (m / maxLen);
    line(x, py + ph - 8, x, py + ph);
  }
  // trace
  noFill();
  stroke('mediumblue');
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < vHistory.length; i++) {
    vertex(px + pw * (i / maxLen), mapV(vHistory[i]));
  }
  endShape();
  strokeWeight(1);
  // key for the dashed line, on a white patch so the trace cannot hide it
  textSize(14);
  let key = '- - threshold';
  noStroke();
  fill(255, 255, 255, 220);
  rect(px + pw - textWidth(key) - 6, mapV(18) - 9, textWidth(key) + 6, 18);
  fill('darkorange');
  textAlign(RIGHT, CENTER);
  text(key, px + pw - 3, mapV(18));
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  text('fired: ' + postSpikeCount + ' of ' + releaseCount + ' releases', g.x + 8, g.y + 23);
}

function drawNote(x, y, w, h) {
  stroke('silver');
  fill('ivory');
  rect(x, y, w, h, 8);
  fill('black');
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(CONDITION_NOTES[condition], x + 8, y + 6, w - 16, h - 8);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  let rate = rateSlider.value();
  text('Firing rate: ' + rate + '/s', 212, drawHeight + 18);
  text('Condition:', 10, drawHeight + 55);
  if (canvasWidth >= 560) {
    textSize(14);
    fill('dimgray');
    textAlign(RIGHT, CENTER);
    text('slow motion', canvasWidth - margin, drawHeight + 55);
  }
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// ---------- responsive sizing (MicroSim standard) ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  rateSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
