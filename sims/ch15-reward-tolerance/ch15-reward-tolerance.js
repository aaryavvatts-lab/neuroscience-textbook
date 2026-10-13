// Reward Pathway and Tolerance MicroSim
// CANVAS_HEIGHT = 545  (drawHeight 460 + controlHeight 85)
// Use iframe height = 547px (canvas height + 2)
// A SCHEMATIC teaching model, not a quantitative model of any real drug.
// Left: a simplified mesolimbic / mesocortical dopamine pathway on a side view of the brain
//       (VTA -> nucleus accumbens, VTA -> prefrontal cortex, prefrontal cortex -> nucleus accumbens)
//       plus a close-up of dopamine receptors on a nucleus accumbens neuron.
// Right: dopamine signaling over time (relative units) on a scrolling plot.
// Buttons: Natural reward (moderate bump), Drug dose (large spike), Stop drug (withdrawal dip),
//          Start/Pause, Reset.
// MicroSim template version 2026.03 (structure copied from bouncing-ball.js)

// global variables for width and height
let containerWidth; // calculated from the <main> element on init and on resize
let canvasWidth = 400;
// fixed top drawing region above the controls (no controls in here)
let drawHeight = 460;
// control region: two rows of buttons = (2 x 35) + 15
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 15;
let sliderLeftMargin = 160; // kept for template consistency (this sim has no sliders)
let defaultTextSize = 16;

// ---------------- model parameters (schematic, relative units) ----------------
const DAY_FRAMES = 60;          // frames per simulated day while running (about 1 s per day)
const WINDOW_DAYS = 20;         // days shown on the plot
const NATURAL_AMP = 0.6;        // natural reward bump above baseline (x receptor availability)
const DRUG_AMP = 2.4;           // drug spike above baseline (x receptor availability)
const NATURAL_TAU = 0.25;       // days to peak of a natural bump
const DRUG_TAU = 0.15;          // days to peak of a drug spike (faster)
const DOSE_RECEPTOR_LOSS = 0.12;// receptor availability lost per drug dose
const MIN_RECEPTORS = 0.35;     // floor on receptor availability
const RECOVERY_RATE = 0.10;     // per day, receptors drift back toward 1.0 when no drug
const WITHDRAWAL_SCALE = 0.5;   // depth of withdrawal dip = scale x (1 - receptors)
const WITHDRAWAL_DECAY = 0.20;  // per day, withdrawal dip fades
const Y_MAX = 3.6;              // top of the y axis (relative units)
const TOTAL_RECEPTOR_ICONS = 10;

// ---------------- state ----------------
let simDay = 0;                 // current simulated time in days
let receptors = 1.0;            // relative receptor availability (1 = normal)
let withdrawal = 0.0;           // current depth of the withdrawal dip
let events = [];                // {t, amp, tau, kind}
let eventsLog = [];             // button presses shown as N / D / S markers on the plot
let samples = [];               // {t, s} history for the plot
let doseCount = 0;
let lastDoseDay = -999;
let phase = 'start';            // start | natural | firstDose | tolerance | withdrawal | recovered
let abstinent = false;
let stopDay = 0;

// controls
let startButton, naturalButton, drugButton, stopButton, resetButton;
let isRunning = false; // MicroSims always start paused

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // Row 1
  startButton = createButton('Start');
  startButton.mousePressed(toggleSimulation);
  naturalButton = createButton('Natural reward');
  naturalButton.mousePressed(giveNaturalReward);
  drugButton = createButton('Drug dose');
  drugButton.mousePressed(giveDrugDose);
  // Row 2
  stopButton = createButton('Stop drug');
  stopButton.mousePressed(stopDrug);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSimulation);

  positionControls();
  resetSimulation();

  describe('Schematic simulation of the brain reward pathway. On the left, a side view of the brain shows dopamine neurons in the ventral tegmental area sending signals to the nucleus accumbens and prefrontal cortex, with a row of dopamine receptor icons. On the right, a plot shows dopamine signaling over days in relative units. A natural reward gives a small bump, a drug dose gives a large spike, repeated doses shrink the spike, lower the baseline and remove receptor icons, and stopping the drug causes a dip below baseline that slowly recovers.');
}

function positionControls() {
  const row1Y = drawHeight + 10;
  const row2Y = drawHeight + 47;
  let x = 10;
  for (const b of [startButton, naturalButton, drugButton]) {
    b.position(x, row1Y);
    x += b.elt.offsetWidth + 8;
  }
  x = 10;
  for (const b of [stopButton, resetButton]) {
    b.position(x, row2Y);
    x += b.elt.offsetWidth + 8;
  }
}

function draw() {
  updateCanvasSize();

  // drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control area
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  if (isRunning) stepModel(1 / DAY_FRAMES);

  // title and instruction line
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 560 ? 20 : 24);
  text('Reward Pathway and Tolerance (schematic)', canvasWidth / 2, 8);
  textSize(canvasWidth < 560 ? 14 : 15);
  fill('dimgray');
  noStroke();
  text('Press Start. Try Natural reward, then Drug dose several times, then Stop drug.', 10, 38, canvasWidth - 20);

  // panel geometry
  const top = canvasWidth < 560 ? 78 : 64;
  const panelH = 300;
  const leftW = constrain(canvasWidth * 0.40, 160, 380);
  drawPathwayPanel(8, top, leftW - 12, panelH);
  drawPlotPanel(leftW + 4, top, canvasWidth - leftW - 12, panelH);

  // explanation box
  drawMessage(8, top + panelH + 8, canvasWidth - 16, drawHeight - (top + panelH + 8) - 8);

  // control-area status text (right of row 2 buttons)
  const statusX = resetButton.elt.offsetLeft + resetButton.elt.offsetWidth + 14;
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  let status = 'Day ' + nf(simDay, 1, 1) + '  Doses: ' + doseCount;
  if (abstinent) status += '  Drug-free: ' + nf(simDay - stopDay, 1, 1) + ' d';
  textSize(canvasWidth < 500 ? 14 : defaultTextSize);
  noStroke();
  text(status, statusX, drawHeight + 59);
}

// ---------------- model ----------------
function phasicSignal(t) {
  let p = 0;
  for (const e of events) {
    const x = t - e.t;
    if (x > 0 && x < 3) {
      p += e.amp * (x / e.tau) * Math.exp(1 - x / e.tau);
    }
  }
  return p;
}

function signalAt(t) {
  return max(0, receptors - withdrawal + phasicSignal(t));
}

function stepModel(dt) {
  simDay += dt;
  // receptors recover slowly once the drug has worn off (more than 1 day since last dose)
  if (simDay - lastDoseDay > 1) {
    receptors += RECOVERY_RATE * (1 - receptors) * dt;
  }
  withdrawal -= WITHDRAWAL_DECAY * withdrawal * dt;
  if (withdrawal < 0.001) withdrawal = 0;

  samples.push({ t: simDay, s: signalAt(simDay) });
  // keep history only for the visible window
  while (samples.length > 0 && samples[0].t < simDay - WINDOW_DAYS - 0.5) samples.shift();
  events = events.filter(e => simDay - e.t < 3);

  if (abstinent && receptors > 0.95 && withdrawal < 0.03) phase = 'recovered';
}

function ensureRunning() {
  if (!isRunning) {
    isRunning = true;
    startButton.html('Pause');
  }
}

function giveNaturalReward() {
  ensureRunning();
  events.push({ t: simDay, amp: NATURAL_AMP * receptors, tau: NATURAL_TAU, kind: 'natural' });
  if (phase === 'start') phase = 'natural';
  if (phase === 'withdrawal' || (phase === 'tolerance' && receptors < 0.7)) phase = phase + 'Natural';
  logEvent('natural');
}

function giveDrugDose() {
  ensureRunning();
  events.push({ t: simDay, amp: DRUG_AMP * receptors, tau: DRUG_TAU, kind: 'drug' });
  doseCount += 1;
  lastDoseDay = simDay;
  // each dose removes some receptors (downregulation); the new baseline is lower
  receptors = max(MIN_RECEPTORS, receptors - DOSE_RECEPTOR_LOSS);
  abstinent = false;
  withdrawal = 0;
  phase = doseCount >= 3 ? 'tolerance' : 'firstDose';
  logEvent('drug');
}

function stopDrug() {
  ensureRunning();
  if (doseCount === 0) {
    phase = 'noDrug';
    return;
  }
  if (abstinent) return;
  abstinent = true;
  stopDay = simDay;
  // withdrawal dip: deeper when tolerance (receptor loss) is greater
  withdrawal = WITHDRAWAL_SCALE * (1 - receptors);
  phase = 'withdrawal';
  logEvent('stop');
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  simDay = 0;
  receptors = 1.0;
  withdrawal = 0;
  events = [];
  samples = [{ t: 0, s: 1 }];
  doseCount = 0;
  lastDoseDay = -999;
  abstinent = false;
  phase = 'start';
  eventsLog = [];
  isRunning = false;
  startButton.html('Start');
}

// ---------------- drawing: pathway panel ----------------
function drawPathwayPanel(x, y, w, h) {
  // panel background
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text(w > 220 ? 'Reward pathway (side view)' : 'Reward pathway', x + w / 2, y + 6);

  // brain outline (side view, front of the head on the LEFT)
  const cx = x + w * 0.52;
  const cy = y + 105;
  const bw = w * 0.86;
  const bh = 120;
  // brainstem (drawn first so the brain outline covers its top)
  stroke('gray');
  strokeWeight(2);
  fill('mistyrose');
  beginShape();
  vertex(cx + bw * 0.10, cy + bh * 0.30);
  vertex(cx + bw * 0.26, cy + bh * 0.30);
  vertex(cx + bw * 0.22, cy + bh * 0.85);
  vertex(cx + bw * 0.12, cy + bh * 0.85);
  endShape(CLOSE);
  ellipse(cx, cy, bw, bh);
  // cerebellum
  fill('pink');
  ellipse(cx + bw * 0.36, cy + bh * 0.36, bw * 0.24, bh * 0.32);

  // region positions
  const pfc = { x: cx - bw * 0.34, y: cy - bh * 0.12 };
  const nac = { x: cx - bw * 0.12, y: cy + bh * 0.26 };
  const vta = { x: cx + bw * 0.16, y: cy + bh * 0.30 };

  // activity glow from the current phasic signal
  const p = phasicSignal(simDay);
  const glow = constrain(p / 2.4, 0, 1);

  // pathways
  drawArrow(vta, nac, glow, 'orange', 0);
  drawArrow(vta, pfc, glow * 0.7, 'orange', -bh * 0.55);
  drawArrow(pfc, nac, 0.15, 'steelblue', 0);

  // region dots
  noStroke();
  fill('darkorange');
  circle(vta.x, vta.y, 16);
  fill('mediumpurple');
  circle(nac.x, nac.y, 16);
  fill('steelblue');
  circle(pfc.x, pfc.y, 16);

  // region labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('PFC', pfc.x - 10, pfc.y - 18);
  textAlign(CENTER, TOP);
  text('NAc', nac.x, nac.y + 10);
  textAlign(LEFT, TOP);
  text('VTA', vta.x + 10, vta.y + 4);

  // key
  textAlign(LEFT, TOP);
  textSize(14);
  let ky = y + 180;
  noStroke();
  fill('darkorange');
  rect(x + 10, ky + 4, 14, 4);
  fill('black');
  noStroke();
  text('dopamine', x + 30, ky - 3);
  fill('steelblue');
  rect(x + 10 + (w > 260 ? w / 2 : 0), ky + 4 + (w > 260 ? 0 : 18), 14, 4);
  fill('black');
  noStroke();
  text('control signals', x + 30 + (w > 260 ? w / 2 : 0), ky - 3 + (w > 260 ? 0 : 18));

  // receptor close-up
  const ry = y + (w > 260 ? 214 : 228);
  const shown = Math.round(TOTAL_RECEPTOR_ICONS * receptors);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Receptors on an NAc neuron: ' + shown + ' of ' + TOTAL_RECEPTOR_ICONS, x + 10, ry, w - 20);
  // membrane
  const my = ry + (w > 300 ? 52 : 62);
  stroke('mediumpurple');
  strokeWeight(4);
  line(x + 12, my, x + w - 12, my);
  const spacing = (w - 30) / TOTAL_RECEPTOR_ICONS;
  for (let i = 0; i < TOTAL_RECEPTOR_ICONS; i++) {
    const rx = x + 15 + spacing * (i + 0.5);
    if (i < shown) {
      // receptor: a cup shape sitting in the membrane
      stroke('purple');
      strokeWeight(2);
      fill('plum');
      arc(rx, my - 2, min(14, spacing * 0.8), 18, PI, TWO_PI, CHORD);
    } else {
      // empty slot (receptor removed)
      stroke('silver');
      strokeWeight(1);
      noFill();
      arc(rx, my - 2, min(14, spacing * 0.8), 18, PI, TWO_PI, CHORD);
    }
  }
}

function drawArrow(a, b, glow, col, bend) {
  // bend = how far the midpoint of the path is pushed up (negative) or down; 0 = straight
  const thick = 2 + 5 * glow;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + bend;
  stroke(col);
  strokeWeight(thick);
  noFill();
  beginShape();
  vertex(a.x, a.y);
  quadraticVertex(mx, my, b.x, b.y);
  endShape();
  // arrowhead at b, pointing along the end of the curve, stopping short of the dot
  const ang = atan2(b.y - my, b.x - mx);
  const tipX = b.x - cos(ang) * 10;
  const tipY = b.y - sin(ang) * 10;
  noStroke();
  fill(col);
  push();
  translate(tipX, tipY);
  rotate(ang);
  triangle(0, 0, -11, -6, -11, 6);
  pop();
}

// ---------------- drawing: plot panel ----------------
function drawPlotPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text(w > 300 ? 'Dopamine signaling over time' : 'Dopamine signaling', x + w / 2, y + 6);

  // plot area
  const px = x + 46;
  const py = y + 32;
  const pw = w - 58;
  const ph = h - 72;

  // y axis label (rotated)
  push();
  translate(x + 14, py + ph / 2);
  rotate(-HALF_PI);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('signal (relative units)', 0, 0);
  pop();

  // axes
  stroke('gray');
  strokeWeight(1);
  line(px, py, px, py + ph);
  line(px, py + ph, px + pw, py + ph);

  // y ticks
  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 3; v++) {
    const yy = map(v, 0, Y_MAX, py + ph, py);
    stroke('gainsboro');
    strokeWeight(1);
    line(px + 1, yy, px + pw, yy);
    noStroke();
    fill('black');
    text(v, px - 5, yy);
  }

  // time window
  const tEnd = max(WINDOW_DAYS, simDay);
  const tStart = tEnd - WINDOW_DAYS;

  // x ticks every 5 days
  textAlign(CENTER, TOP);
  for (let d = Math.ceil(tStart / 5) * 5; d <= tEnd; d += 5) {
    const xx = map(d, tStart, tEnd, px, px + pw);
    stroke('gray');
    line(xx, py + ph, xx, py + ph + 4);
    noStroke();
    fill('black');
    text(d, xx, py + ph + 5);
  }
  noStroke();
  fill('black');
  text('time (days, schematic)', px + pw / 2, py + ph + 22);

  // original baseline (dashed)
  const yBase = map(1, 0, Y_MAX, py + ph, py);
  stroke('seagreen');
  strokeWeight(1.5);
  for (let xx = px; xx < px + pw; xx += 10) line(xx, yBase, min(xx + 5, px + pw), yBase);
  noStroke();
  fill('seagreen');
  textAlign(RIGHT, BOTTOM);
  textSize(14);
  text('original baseline', px + pw - 2, yBase - 2);

  // current baseline (receptor availability minus withdrawal)
  const curBase = max(0, receptors - withdrawal);
  if (abs(curBase - 1) > 0.15) {
    const yCur = map(curBase, 0, Y_MAX, py + ph, py);
    stroke('crimson');
    strokeWeight(1);
    for (let xx = px; xx < px + pw; xx += 8) line(xx, yCur, min(xx + 3, px + pw), yCur);
    noStroke();
    fill('crimson');
    textAlign(LEFT, TOP);
    text(abstinent && withdrawal > 0.03 ? 'baseline now (withdrawal)' : 'current baseline', px + 4, yCur + 2);
  }

  // signal trace
  noFill();
  stroke('darkorange');
  strokeWeight(2.5);
  beginShape();
  for (const smp of samples) {
    if (smp.t < tStart) continue;
    const xx = map(smp.t, tStart, tEnd, px, px + pw);
    const yy = map(min(smp.s, Y_MAX), 0, Y_MAX, py + ph, py);
    vertex(xx, yy);
  }
  endShape();

  // markers for events in view
  for (const e of eventsLog) {
    if (e.t < tStart) continue;
    const xx = map(e.t, tStart, tEnd, px, px + pw);
    noStroke();
    fill(e.kind === 'drug' ? 'crimson' : (e.kind === 'stop' ? 'black' : 'seagreen'));
    textAlign(CENTER, TOP);
    textSize(14);
    text(e.kind === 'drug' ? 'D' : (e.kind === 'stop' ? 'S' : 'N'), xx, py + 2);
  }
}

function logEvent(kind) {
  eventsLog.push({ t: simDay, kind: kind });
  eventsLog = eventsLog.filter(e => simDay - e.t < WINDOW_DAYS + 1);
}

// ---------------- drawing: explanation box ----------------
function drawMessage(x, y, w, h) {
  const msgs = {
    start: 'Signal sits at the original baseline. Press Start, then Natural reward (N) to see a normal reward signal.',
    natural: 'A natural reward (food, music, a win) gives a moderate, brief rise in dopamine signaling. Now try one Drug dose (D).',
    firstDose: 'A drug gives a much larger, faster spike than a natural reward. Each dose also removes some receptors. Give more doses.',
    tolerance: 'Tolerance: each dose now gives a smaller spike, and the baseline has sunk below normal because receptors were removed.',
    toleranceNatural: 'With fewer receptors, the same natural reward feels smaller. Everyday pleasures lose their pull.',
    withdrawal: 'Withdrawal: without the drug, signaling dips below even the lowered baseline. Watch receptors return over the following days.',
    withdrawalNatural: 'During withdrawal, a natural reward gives only a small bump. Recovery takes time, not willpower alone.',
    recovered: 'Mostly recovered: receptors and baseline are close to normal. Learned cue-driven cravings can last much longer (not shown).',
    noDrug: 'No drug has been given yet, so there is nothing to stop. Try Drug dose first.'
  };
  stroke('silver');
  strokeWeight(1);
  fill('lightyellow');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  text(msgs[phase] || msgs.start, x + 10, y + 7, w - 20, h - 10);
}

// These two functions must be present for width-responsive MicroSims
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
