// Action Potential Simulator - From Neuron to Bedside, Chapter 2
// CANVAS_HEIGHT = 655 (drawHeight 470 + controlHeight 185)
// Use iframe height = 657px (canvas height + 2)
//
// Learning objective (Apply): predict how stimulus strength, a second stimulus,
// outside K+ concentration, and a Na+ channel blocker (lidocaine) change the
// membrane voltage trace, using threshold, all-or-none, and refractory ideas.
//
// MODEL NOTE (shown to learners as "simplified teaching model"):
// This is a reduced, phenomenological model, not the full Hodgkin-Huxley equations.
//  - Below threshold the membrane acts like a leaky capacitor (time constant 5 ms)
//    that relaxes toward the resting potential.
//  - Resting potential comes from the Goldman (GHK) voltage equation at 37 C with
//    K+ inside 140 mM, Na+ inside 15 mM, Na+ outside 145 mM, and a Na:K
//    permeability ratio of 0.042. With 4 mM K+ outside this gives about -70 mV.
//  - The K+ equilibrium potential comes from the Nernst equation (61.5 mV x log10 ratio).
//  - When V reaches threshold (-55 mV) and enough Na+ channels are ready (not
//    inactivated or blocked), a spike fires with a fixed shape: rise to +35 mV in
//    0.5 ms (Na+ in), fall in 1.0 ms (K+ out) to an undershoot near -80 mV, then a
//    slow return to rest as K+ channels close (time constant 4 ms).
//  - Na+ inactivation (h) drops to zero during each spike and recovers with a
//    2 ms time constant. While h is low the cell cannot fire (absolute refractory
//    period) and then needs a stronger push (relative refractory period).
//  - Lidocaine is modeled as blocking 85% of Na+ channels.

// ---------- canvas layout ----------
let containerWidth;
let canvasWidth = 800;
let drawHeight = 470;
let controlHeight = 185; // 5 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 245;
let defaultTextSize = 16;

// ---------- controls ----------
let startButton, stimButton, pairButton, resetButton;
let strengthSlider, gapSlider, koSlider;
let lidoCheckbox, holdCheckbox;
let isRunning = false; // MicroSims always start paused
let mouseInside = true;

// ---------- model parameters ----------
const P = {
  tauM: 5,          // ms, membrane time constant
  mvPerUnit: 2.8,   // mV of depolarization per unit of stimulus strength
  pulseDur: 0.5,    // ms, length of one stimulus pulse
  VTH: -55,         // mV, threshold
  VPEAK: 35,        // mV, spike peak when Na+ channels are fully available
  rise: 0.5,        // ms, rising phase
  fall: 1.0,        // ms, falling phase
  tauN: 4,          // ms, K+ channels closing after the spike
  gA: 0.133,        // 1/ms, strength of the extra K+ current after a spike
  tauH: 2,          // ms, recovery from Na+ inactivation
  tauHdown: 12,     // ms, slow inactivation during long depolarization
  hMin: 0.4,        // fraction of ready Na+ channels needed to fire
  thrRaise: 25,     // mV, how much threshold rises when few Na+ channels are ready
  Ki: 140, Nai: 15, Nao: 145, pNa: 0.042,
  blockFrac: 0.85   // lidocaine blocks 85% of Na+ channels in this model
};

const SIM_DT = 0.01;        // ms per integration step
const STEPS_PER_FRAME = 5;  // 0.05 ms of model time per frame (slowed down a lot)
const SWEEP_MS = 50;        // width of one sweep of the plot

let cell;
let simTime = 0;       // ms since reset (continuous)
let sweepStart = 0;    // ms at which current sweep began
let trace = [];        // {t, v} points for this sweep
let stimMarks = [];    // stimulus times in this sweep
let pulses = [];       // scheduled pulse start times (absolute)
let spikesThisSweep = 0;
let lastPeak = null;
let lastTrough = null;
let troughTracking = false;
let lastSweepSpikes = null;
let lastSweepHold = false;

function restV(Ko) {
  return 61.5 * Math.log10((Ko + P.pNa * P.Nao) / (P.Ki + P.pNa * P.Nai));
}
function eK(Ko) {
  return 61.5 * Math.log10(Ko / P.Ki);
}
function hInf(V) {
  return 1 / (1 + Math.exp((V + 58) / 4));
}

function newCell(Ko) {
  const vr = restV(Ko);
  return { V: vr, h: hInf(vr), n: 0, spike: null, naOpen: 0, phase: 'rest' };
}

function stepCell(c, t, dt, Ko, I, block) {
  const vr = restV(Ko);
  const ek = eK(Ko);
  const avail = block ? (1 - P.blockFrac) : 1;
  const hEff = c.h * avail;
  if (c.spike) {
    const s = c.spike;
    const tt = t - s.t0;
    if (tt < P.rise) {
      const f = tt / P.rise;
      c.V = s.v0 + (s.peak - s.v0) * (0.5 - 0.5 * Math.cos(Math.PI * f));
      c.h = s.h0 * (1 - f);
      c.naOpen = s.h0 * f;
      c.n = 0;
      c.phase = 'rising';
    } else if (tt < P.rise + P.fall) {
      const f = (tt - P.rise) / P.fall;
      const U = (vr / P.tauM + P.gA * ek) / (1 / P.tauM + P.gA);
      c.V = s.peak + (U - s.peak) * (0.5 - 0.5 * Math.cos(Math.PI * f));
      c.h = 0;
      c.naOpen = Math.max(0, 1 - 4 * f) * s.h0;
      c.n = Math.min(1, f * 1.2);
      c.phase = 'falling';
    } else {
      c.spike = null;
      c.n = 1;
      c.naOpen = 0;
      c.phase = 'after';
    }
  } else {
    const dV = (vr - c.V) / P.tauM + P.gA * c.n * (ek - c.V) + I;
    c.V += dt * dV;
    c.n += dt * (-c.n / P.tauN);
    const hi = hInf(c.V);
    c.h += dt * (hi - c.h) / (hi < c.h ? P.tauHdown : P.tauH);
    c.naOpen = 0;
    const thr = P.VTH + P.thrRaise * (1 - Math.min(1, hEff / 0.6));
    if (c.V >= thr && hEff >= P.hMin) {
      const peak = P.VTH + (P.VPEAK - P.VTH) * Math.sqrt(Math.min(1, (hEff - 0.3) / 0.3));
      c.spike = { t0: t, v0: c.V, peak: peak, h0: c.h };
      spikesThisSweep++;
      lastPeak = peak;
      lastTrough = null;
      troughTracking = true;
    }
    if (!c.spike) {
      if (c.n > 0.05 && c.V < vr - 1) c.phase = 'undershoot';
      else if (c.h * avail < 0.6 * avail && c.h < hInf(vr) - 0.15) c.phase = 'refractory';
      else if (c.V > vr + 1) c.phase = 'subthreshold';
      else c.phase = 'rest';
    }
  }
  if (troughTracking && !c.spike) {
    if (lastTrough === null || c.V < lastTrough) lastTrough = c.V;
    if (c.n < 0.05) troughTracking = false;
  }
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // pause the animation while the mouse is outside the page (saves CPU in an iframe)
  document.addEventListener('mouseleave', () => { mouseInside = false; });
  document.addEventListener('mouseenter', () => { mouseInside = true; });

  // Row 0: buttons
  startButton = createButton('Start');
  startButton.position(10, drawHeight + 5);
  startButton.mousePressed(toggleSimulation);

  stimButton = createButton('Stimulate');
  stimButton.position(75, drawHeight + 5);
  stimButton.mousePressed(() => schedulePulses(false));

  pairButton = createButton('Stimulate twice');
  pairButton.position(165, drawHeight + 5);
  pairButton.mousePressed(() => schedulePulses(true));

  resetButton = createButton('Reset');
  resetButton.position(295, drawHeight + 5);
  resetButton.mousePressed(resetSim);

  // Row 1-3: sliders
  strengthSlider = createSlider(0, 10, 3, 1);
  strengthSlider.position(sliderLeftMargin, drawHeight + 40);

  gapSlider = createSlider(2, 20, 3, 1);
  gapSlider.position(sliderLeftMargin, drawHeight + 75);

  koSlider = createSlider(2, 20, 4, 1);
  koSlider.position(sliderLeftMargin, drawHeight + 110);

  // Row 4: checkboxes
  lidoCheckbox = createCheckbox(' Block Na+ channels (lidocaine)', false);
  lidoCheckbox.position(10, drawHeight + 148);
  lidoCheckbox.style('font-size', '16px');

  holdCheckbox = createCheckbox(' Hold stimulus', false);
  holdCheckbox.position(265, drawHeight + 148);
  holdCheckbox.style('font-size', '16px');

  sizeSliders();
  resetSim();

  describe('Action potential simulator. A plot of membrane voltage in millivolts against time in milliseconds, with lines for the resting potential near -70 mV and the threshold near -55 mV. Buttons deliver one or two stimuli; sliders set stimulus strength, the gap between two stimuli, and the outside potassium concentration; checkboxes block sodium channels with lidocaine or hold the stimulus on. A side panel shows how many sodium and potassium channels are open, inactivated, closed, or blocked.');
}

function schedulePulses(twice) {
  if (!isRunning) toggleSimulation();
  const t0 = simTime + 0.2;
  pulses.push(t0);
  if (twice) pulses.push(t0 + gapSlider.value());
}

function resetSim() {
  cell = newCell(koSlider ? koSlider.value() : 4);
  simTime = 0;
  sweepStart = 0;
  trace = [];
  stimMarks = [];
  pulses = [];
  spikesThisSweep = 0;
  lastPeak = null;
  lastTrough = null;
  troughTracking = false;
  lastSweepSpikes = null;
}

function stimulusCurrent(t, strength, hold) {
  // current in mV/ms; a pulse gives a peak bump of strength x 2.8 mV
  const pulseI = strength * P.mvPerUnit / (P.tauM * (1 - Math.exp(-P.pulseDur / P.tauM)));
  let I = hold ? strength * P.mvPerUnit / P.tauM : 0;
  for (const p of pulses) {
    if (t >= p && t < p + P.pulseDur) I = Math.max(I, pulseI);
  }
  return I;
}

function advance() {
  const Ko = koSlider.value();
  const strength = strengthSlider.value();
  const hold = holdCheckbox.checked();
  const block = lidoCheckbox.checked();
  for (let k = 0; k < STEPS_PER_FRAME; k++) {
    // record stimulus marks when a pulse starts
    for (const p of pulses) {
      if (p >= simTime && p < simTime + SIM_DT) stimMarks.push(p - sweepStart);
    }
    const I = stimulusCurrent(simTime, strength, hold);
    stepCell(cell, simTime, SIM_DT, Ko, I, block);
    simTime += SIM_DT;
    if (k === STEPS_PER_FRAME - 1 || cell.spike) {
      trace.push({ t: simTime - sweepStart, v: cell.V });
    }
    if (simTime - sweepStart >= SWEEP_MS) {
      lastSweepSpikes = spikesThisSweep;
      lastSweepHold = hold;
      sweepStart = simTime;
      trace = [{ t: 0, v: cell.V }];
      stimMarks = [];
      spikesThisSweep = 0;
    }
  }
  // forget pulses that are long past
  pulses = pulses.filter(p => p > simTime - 5);
}

function draw() {
  updateCanvasSize();

  // drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (isRunning && mouseInside) advance();

  const narrow = canvasWidth < 640;
  const panelW = narrow ? canvasWidth - 20 : 250;
  const plotLeft = 62;
  const plotRight = narrow ? canvasWidth - 15 : canvasWidth - panelW - 25;
  const plotTop = 78;
  const plotBottom = narrow ? 276 : drawHeight - 45;

  drawPlot(plotLeft, plotRight, plotTop, plotBottom);

  // title and instructions (drawn after the grid)
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Action Potential Simulator', canvasWidth / 2, 8);
  textSize(16);
  fill('dimgray');
  noStroke();
  const instr = narrow ? 'Press Stimulate. Find the weakest stimulus that fires.'
                       : 'Press Stimulate. Find the weakest stimulus that fires a spike, then test a second stimulus.';
  text(instr, canvasWidth / 2, 40);

  if (narrow) {
    drawPanel(10, 318, panelW, drawHeight - 326, true);
  } else {
    drawPanel(canvasWidth - panelW - 10, plotTop - 10, panelW, drawHeight - plotTop - 2, false);
  }

  drawControlLabels();
}

function vToY(v, top, bottom) {
  return map(v, -100, 50, bottom, top);
}

function drawPlot(left, right, top, bottom) {
  // plot background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(left, top, right - left, bottom - top);

  // grid and y-axis labels
  textSize(14);
  for (let v = -100; v <= 50; v += 25) {
    const y = vToY(v, top, bottom);
    stroke('gainsboro');
    strokeWeight(1);
    line(left, y, right, y);
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text((v > 0 ? '+' : '') + v, left - 6, y);
  }
  // x-axis labels
  for (let t = 0; t <= SWEEP_MS; t += 10) {
    const x = map(t, 0, SWEEP_MS, left, right);
    stroke('gainsboro');
    line(x, top, x, bottom);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(t, x, bottom + 4);
  }
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  text('Time (ms)', (left + right) / 2, bottom + 22);
  push();
  translate(16, (top + bottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  noStroke();
  text('Membrane voltage (mV)', 0, 0);
  pop();

  const Ko = koSlider.value();
  const vr = restV(Ko);

  // zero line
  stroke('darkgray');
  strokeWeight(1);
  const y0 = vToY(0, top, bottom);
  line(left, y0, right, y0);

  // threshold line (dashed)
  const yTh = vToY(P.VTH, top, bottom);
  stroke('firebrick');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 5]);
  line(left, yTh, right, yTh);
  // resting line (dotted)
  const yR = vToY(vr, top, bottom);
  stroke('seagreen');
  drawingContext.setLineDash([2, 4]);
  line(left, yR, right, yR);
  drawingContext.setLineDash([]);

  noStroke();
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  fill('firebrick');
  text('threshold about -55 mV', right - 4, yTh - 2);
  fill('seagreen');
  textAlign(RIGHT, TOP);
  noStroke();
  text('resting potential ' + nf(vr, 0, 0) + ' mV', right - 4, Math.max(yR + 2, yTh + 4));

  // stimulus marks
  for (const s of stimMarks) {
    const x = map(s, 0, SWEEP_MS, left, right);
    fill('darkorange');
    noStroke();
    triangle(x, bottom - 12, x - 6, bottom - 1, x + 6, bottom - 1);
  }
  if (stimMarks.length > 0) {
    noStroke();
    fill('darkorange');
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(stimMarks.length > 1 ? 'stimuli' : 'stimulus', map(stimMarks[0], 0, SWEEP_MS, left, right), bottom - 14);
  }
  if (holdCheckbox.checked()) {
    noStroke();
    fill('darkorange');
    textAlign(LEFT, BOTTOM);
    textSize(14);
    text('stimulus held on', left + 6, bottom - 16);
  }

  // voltage trace
  noFill();
  stroke('mediumblue');
  strokeWeight(2.5);
  beginShape();
  for (const p of trace) {
    vertex(map(p.t, 0, SWEEP_MS, left, right), vToY(p.v, top, bottom));
  }
  endShape();

  // current point
  if (trace.length > 0) {
    const p = trace[trace.length - 1];
    fill('mediumblue');
    noStroke();
    circle(map(p.t, 0, SWEEP_MS, left, right), vToY(p.v, top, bottom), 8);
  }
  strokeWeight(1);
}

function phaseText(c) {
  if (lidoCheckbox.checked() && c.phase !== 'rising' && c.phase !== 'falling' && c.V > restV(koSlider.value()) + 1) {
    return 'Na+ blocked: passive bump only';
  }
  switch (c.phase) {
    case 'rising': return 'Depolarization: Na+ rushes in';
    case 'falling': return 'Repolarization: K+ flows out';
    case 'undershoot': return 'Hyperpolarization (undershoot)';
    case 'refractory': return 'Refractory: Na+ channels resetting';
    case 'subthreshold': return 'Below threshold: no spike yet';
    default: return 'Resting';
  }
}

function drawBar(x, y, w, parts) {
  // parts: [{frac, color}]
  let cx = x;
  for (const p of parts) {
    const pw = w * constrain(p.frac, 0, 1);
    fill(p.color);
    noStroke();
    rect(cx, y, pw, 14);
    cx += pw;
  }
  noFill();
  stroke('gray');
  rect(x, y, w, 14);
}

function drawPanel(x, y, w, h, compact) {
  fill('white');
  stroke('silver');
  rect(x, y, w, h, 10);
  const c = cell;
  const block = lidoCheckbox.checked();
  const avail = block ? (1 - P.blockFrac) : 1;
  const Ko = koSlider.value();

  // Na+ channel states (fractions of all Na+ channels)
  const naOpen = constrain(c.naOpen, 0, 1);
  const naInact = constrain(1 - c.h - naOpen, 0, 1);
  const naClosed = constrain(1 - naOpen - naInact, 0, 1);
  const kOpen = constrain(c.n, 0, 1);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(16);

  if (!compact) {
    let yy = y + 10;
    text('Voltage now: ' + nf(c.V, 0, 0) + ' mV', x + 10, yy); yy += 22;
    fill('purple'); noStroke();
    text(phaseText(c), x + 10, yy, w - 20, 44); yy += 46;

    fill('black'); noStroke();
    text('Voltage-gated Na+ channels', x + 10, yy); yy += 21;
    drawBar(x + 10, yy, w - 20, block ? [
      { frac: naOpen * avail, color: 'darkorange' },
      { frac: naInact * avail, color: 'darkgray' },
      { frac: naClosed * avail, color: 'moccasin' },
      { frac: P.blockFrac, color: 'black' }] : [
      { frac: naOpen, color: 'darkorange' },
      { frac: naInact, color: 'darkgray' },
      { frac: naClosed, color: 'moccasin' }]);
    yy += 18;
    textSize(14); noStroke(); fill('black');
    text('open ' + nf(100 * naOpen * avail, 0, 0) + '%   inactivated ' + nf(100 * naInact * avail, 0, 0) + '%', x + 10, yy); yy += 18;
    text(block ? 'blocked by lidocaine ' + nf(100 * P.blockFrac, 0, 0) + '%' : 'closed and ready ' + nf(100 * naClosed, 0, 0) + '%', x + 10, yy); yy += 24;

    textSize(16); fill('black'); noStroke();
    text('Voltage-gated K+ channels', x + 10, yy); yy += 21;
    drawBar(x + 10, yy, w - 20, [
      { frac: kOpen, color: 'steelblue' },
      { frac: 1 - kOpen, color: 'lightsteelblue' }]);
    yy += 18;
    textSize(14); noStroke(); fill('black');
    text('open ' + nf(100 * kOpen, 0, 0) + '%   closed ' + nf(100 * (1 - kOpen), 0, 0) + '%', x + 10, yy); yy += 24;

    text('Na+/K+ pump: always running', x + 10, yy); yy += 18;
    text('Outside K+: ' + Ko + ' mM (normal about 4)', x + 10, yy); yy += 24;

    textSize(16); fill('black'); noStroke();
    text('Last spike peak: ' + (lastPeak === null ? 'none yet' : (lastPeak >= 0 ? '+' : '') + nf(lastPeak, 0, 0) + ' mV'), x + 10, yy); yy += 21;
    text('Undershoot: ' + (lastTrough === null ? '-' : nf(lastTrough, 0, 0) + ' mV'), x + 10, yy); yy += 21;
    text('Spikes this sweep: ' + spikesThisSweep, x + 10, yy); yy += 21;
    if (lastSweepSpikes !== null) {
      textSize(14); noStroke();
      text('Last 50 ms sweep: ' + lastSweepSpikes + ' spikes', x + 10, yy); yy += 17;
      text('= about ' + (lastSweepSpikes * 20) + ' spikes per second', x + 10, yy);
    }
    textSize(14); fill('dimgray'); noStroke();
    text('Simplified teaching model', x + 10, y + h - 22);
  } else {
    // compact two-column layout for narrow screens
    const colW = (w - 30) / 2;
    let yy = y + 8;
    text('V: ' + nf(c.V, 0, 0) + ' mV', x + 10, yy);
    fill('purple'); noStroke();
    textSize(14);
    text(phaseText(c), x + 20 + colW, yy, colW, 40);
    yy += 26;
    fill('black'); noStroke(); textSize(14);
    text('Na+ channels', x + 10, yy);
    text('K+ channels', x + 20 + colW, yy); yy += 18;
    drawBar(x + 10, yy, colW, block ? [
      { frac: naOpen * avail, color: 'darkorange' },
      { frac: naInact * avail, color: 'darkgray' },
      { frac: naClosed * avail, color: 'moccasin' },
      { frac: P.blockFrac, color: 'black' }] : [
      { frac: naOpen, color: 'darkorange' },
      { frac: naInact, color: 'darkgray' },
      { frac: naClosed, color: 'moccasin' }]);
    drawBar(x + 20 + colW, yy, colW, [
      { frac: kOpen, color: 'steelblue' },
      { frac: 1 - kOpen, color: 'lightsteelblue' }]);
    yy += 18;
    noStroke(); fill('black');
    text('open ' + nf(100 * naOpen * avail, 0, 0) + '%' + (block ? ', blocked 85%' : ''), x + 10, yy);
    text('open ' + nf(100 * kOpen, 0, 0) + '%', x + 20 + colW, yy); yy += 22;
    text('Peak: ' + (lastPeak === null ? 'none' : nf(lastPeak, 0, 0) + ' mV') + '   Spikes: ' + spikesThisSweep, x + 10, yy); yy += 18;
    fill('dimgray'); noStroke();
    text('Simplified teaching model', x + 10, yy);
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Stimulus strength: ' + strengthSlider.value(), 10, drawHeight + 50);
  text('Gap between 2 stimuli: ' + gapSlider.value() + ' ms', 10, drawHeight + 85);
  text('Outside K+: ' + koSlider.value() + ' mM', 10, drawHeight + 120);
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function sizeSliders() {
  const w = Math.max(80, canvasWidth - sliderLeftMargin - margin);
  strengthSlider.size(w);
  gapSlider.size(w);
  koSlider.size(w);
}

// These two functions must be present for width-responsive MicroSims
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  sizeSliders();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
