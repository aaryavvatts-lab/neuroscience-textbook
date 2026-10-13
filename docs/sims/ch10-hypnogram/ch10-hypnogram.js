// Hypnogram Builder MicroSim (Chapter 10: Sleep and Brain States)
// CANVAS_HEIGHT = 700
// Use this CANVAS_HEIGHT + 2 for the iframe height that embeds this MicroSim (702px).
// Shows an illustrative hypnogram for a teen sleeping 9 hours, a schematic EEG
// trace for each sleep stage, and a slider that cuts the night short to show
// which stages are lost (mostly late-night REM and N2).
// The sim is not animated, so it needs no Start/Pause button.
// Built from the p5.js MicroSim template (version 2026.03).

// ---------- canvas layout ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;          // fixed drawing region
let controlHeight = 80;        // two rows of controls: (2 x 35) + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

// ---------- plot layout (inside drawing region) ----------
let plotLeft = 70;             // room for the stage labels on the left
let plotTop = 104;
let rowH = 34;                 // height of each stage row
let plotBottom;                // computed in setup

// ---------- model data ----------
// Stage rows from top to bottom, the usual hypnogram order
const STAGES = ['Wake', 'REM', 'N1', 'N2', 'N3'];
const FULL_NIGHT_MIN = 540;    // 9 hours = 540 minutes

// ILLUSTRATIVE night for a healthy teen (not one person's real recording).
// Each entry: [stage, minutes]. About 90-minute cycles, most N3 early,
// REM periods that grow longer toward morning.
const SEGMENTS = [
  // Cycle 1 (0-90 min)
  ['N1', 7], ['N2', 18], ['N3', 45], ['N2', 10], ['REM', 10],
  // Cycle 2 (90-182 min)
  ['N2', 20], ['N3', 40], ['N2', 15], ['REM', 15], ['Wake', 2],
  // Cycle 3 (182-272 min)
  ['N1', 3], ['N2', 32], ['N3', 20], ['N2', 15], ['REM', 20],
  // Cycle 4 (272-362 min)
  ['N2', 45], ['N3', 8], ['N2', 12], ['REM', 25],
  // Cycle 5 (362-449 min)
  ['N1', 3], ['N2', 52], ['REM', 30], ['Wake', 2],
  // Cycle 6 (449-540 min)
  ['N1', 2], ['N2', 54], ['REM', 35]
];
const CYCLE_STARTS = [0, 90, 182, 272, 362, 449];

// One-line descriptions shown under the EEG trace
const STAGE_INFO = {
  'Wake': { name: 'Wake (relaxed, eyes closed)',
            line: 'Alpha waves, about 8-13 Hz: awake and calm with eyes closed.' },
  'N1':   { name: 'N1 (falling asleep)',
            line: 'Theta waves, about 4-7 Hz: the lightest, drifting-off stage.' },
  'N2':   { name: 'N2 (light sleep)',
            line: 'Sleep spindles (quick bursts, about 12-14 Hz) and big K-complexes.' },
  'N3':   { name: 'N3 (deep, slow-wave sleep)',
            line: 'Tall, slow delta waves (about 0.5-2 Hz): hardest stage to wake from.' },
  'REM':  { name: 'REM (dreaming sleep)',
            line: 'Low-voltage, mixed fast waves plus "sawtooth" waves; most body muscles are switched off.' }
};

// colors (named colors only)
const STAGE_COLOR = {
  'Wake': 'darkorange', 'REM': 'crimson', 'N1': 'teal', 'N2': 'royalblue', 'N3': 'midnightblue'
};

// ---------- state ----------
let sleepSlider;
let stageSelect;
let resetButton;
let selectedStage = 'N3';      // stage shown in the EEG panel when not hovering
let fullTotals = {};           // minutes per stage for the full 9 h night

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  plotBottom = plotTop + rowH * STAGES.length;
  fullTotals = minutesByStage(FULL_NIGHT_MIN);

  // Row 1: hours-of-sleep slider (4 to 9 hours, step 0.5, default 9)
  sleepSlider = createSlider(4, 9, 9, 0.5);
  sleepSlider.parent(document.querySelector('main'));
  sleepSlider.position(sliderLeftMargin, drawHeight + 8);
  sleepSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 2: stage menu (keyboard-friendly way to pick an EEG) and a reset button
  stageSelect = createSelect();
  stageSelect.parent(document.querySelector('main'));
  for (let s of STAGES) stageSelect.option(s);
  stageSelect.selected(selectedStage);
  stageSelect.position(130, drawHeight + 45);
  stageSelect.changed(() => { selectedStage = stageSelect.value(); });

  resetButton = createButton('Reset to 9 h');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(215, drawHeight + 44);
  resetButton.mousePressed(() => { sleepSlider.value(9); });

  describe('A hypnogram of an illustrative 9-hour teen night with rows for Wake, REM, N1, N2 and N3 across the hours of the night. ' +
    'Clicking a stage name or hovering over the night shows a schematic EEG wave for that stage. ' +
    'A slider shortens the night and reports how many minutes of REM, N2 and N3 are lost.');
}

function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const hours = sleepSlider.value();
  const cutoffMin = hours * 60;
  const plotRight = canvasWidth - margin;

  // ---- grid and axes first ----
  drawGrid(plotRight);

  // ---- title and instruction ----
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Hypnogram Builder', canvasWidth / 2, 10);
  textSize(15);
  fill('dimgray');
  noStroke();
  textAlign(CENTER, TOP);
  text('Click a stage name (or hover over the night) to see its EEG. Drag the slider to cut the night short.',
       10, 42, canvasWidth - 20, 40);

  // ---- alarm label position (computed first so cycle labels can avoid it) ----
  textSize(14);
  let alarmBox = null;
  if (cutoffMin < FULL_NIGHT_MIN) {
    const xc = timeToX(cutoffMin, plotRight);
    const w = textWidth('Alarm') + 10;
    const bx = constrain(xc - w / 2, plotLeft, plotRight - w);
    alarmBox = { x: bx, w: w };
  }

  // ---- cycle markers (each cycle is about 90 minutes) ----
  textAlign(LEFT, TOP);
  for (let i = 0; i < CYCLE_STARTS.length; i++) {
    const x = timeToX(CYCLE_STARTS[i], plotRight);
    const lw = textWidth('C' + (i + 1)) + 4;
    if (alarmBox && x + lw > alarmBox.x - 2 && x < alarmBox.x + alarmBox.w + 2) continue;
    fill('gray');
    noStroke();
    text('C' + (i + 1), x + 2, plotTop - 20);
  }

  // ---- lost part of the night ----
  if (cutoffMin < FULL_NIGHT_MIN) {
    const xc = timeToX(cutoffMin, plotRight);
    noStroke();
    fill(200, 200, 200, 140);
    rect(xc, plotTop, plotRight - xc, plotBottom - plotTop);
    stroke('black');
    strokeWeight(2);
    line(xc, plotTop - 2, xc, plotBottom);
    fill('white');
    stroke('black');
    strokeWeight(1);
    rect(alarmBox.x, plotTop - 22, alarmBox.w, 20, 4);
    fill('black');
    noStroke();
    textAlign(CENTER, CENTER);
    text('Alarm', alarmBox.x + alarmBox.w / 2, plotTop - 12);
  }

  // ---- the hypnogram line ----
  drawHypnogram(cutoffMin, plotRight);

  // ---- stage labels (clickable) ----
  drawStageLabels();

  // ---- hover cursor ----
  let hoverStage = null;
  let hoverMin = null;
  if (mouseX >= plotLeft && mouseX <= plotRight && mouseY >= plotTop && mouseY <= plotBottom) {
    hoverMin = constrain(map(mouseX, plotLeft, plotRight, 0, FULL_NIGHT_MIN), 0, FULL_NIGHT_MIN - 0.01);
    hoverStage = stageAt(hoverMin);
    stroke('dimgray');
    strokeWeight(1);
    line(mouseX, plotTop, mouseX, plotBottom);
    const label = nf(hoverMin / 60, 1, 1) + ' h: ' + hoverStage + (hoverMin > cutoffMin ? ' (lost)' : '');
    textSize(14);
    const tw = textWidth(label) + 10;
    const bx = constrain(mouseX + 6, plotLeft, plotRight - tw);
    fill('white');
    stroke('silver');
    rect(bx, plotTop + 2, tw, 20, 5);
    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    text(label, bx + 5, plotTop + 12);
  }

  // ---- readout: minutes kept vs lost ----
  drawReadout(hours, cutoffMin);

  // ---- EEG panel ----
  const shownStage = hoverStage ? hoverStage : selectedStage;
  drawEEGPanel(shownStage, hoverStage !== null && hoverMin > cutoffMin);

  // ---- control labels ----
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Hours of sleep: ' + nf(hours, 1, 1) + ' h', 10, drawHeight + 18);
  text('Show EEG for:', 10, drawHeight + 56);
}

// ---------- drawing helpers ----------

function drawGrid(plotRight) {
  // light row bands
  for (let i = 0; i < STAGES.length; i++) {
    const y = plotTop + i * rowH;
    noStroke();
    fill(i % 2 === 0 ? 'white' : 'aliceblue');
    rect(plotLeft, y, plotRight - plotLeft, rowH);
  }
  // hour grid lines and labels
  textSize(14);
  for (let h = 0; h <= 9; h++) {
    const x = timeToX(h * 60, plotRight);
    stroke('gainsboro');
    strokeWeight(1);
    line(x, plotTop, x, plotBottom);
    fill('black');
    noStroke();
    textAlign(CENTER, TOP);
    text(h, x, plotBottom + 4);
  }
  noFill();
  stroke('silver');
  rect(plotLeft, plotTop, plotRight - plotLeft, plotBottom - plotTop);
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  text('Hours after falling asleep (illustrative teen night)', (plotLeft + plotRight) / 2, plotBottom + 22);
}

function drawHypnogram(cutoffMin, plotRight) {
  let t = 0;
  let prevY = null;
  for (let seg of SEGMENTS) {
    const stage = seg[0];
    const dur = seg[1];
    const y = rowY(stage);
    const x0 = timeToX(t, plotRight);
    const x1 = timeToX(t + dur, plotRight);
    const lost = t >= cutoffMin;
    // vertical connector from previous stage
    if (prevY !== null) {
      stroke(t > cutoffMin ? 'darkgray' : 'black');
      strokeWeight(1.5);
      line(x0, prevY, x0, y);
    }
    // split segment at the cutoff if needed
    if (t < cutoffMin && t + dur > cutoffMin) {
      const xc = timeToX(cutoffMin, plotRight);
      drawSegment(stage, x0, xc, y, false);
      drawSegment(stage, xc, x1, y, true);
    } else {
      drawSegment(stage, x0, x1, y, lost);
    }
    prevY = y;
    t += dur;
  }
}

function drawSegment(stage, x0, x1, y, lost) {
  if (lost) {
    stroke('darkgray');
    strokeWeight(stage === 'REM' ? 6 : 3);
  } else {
    stroke(STAGE_COLOR[stage]);
    strokeWeight(stage === 'REM' ? 6 : 3);
  }
  line(x0, y, x1, y);
}

function drawStageLabels() {
  textSize(16);
  for (let s of STAGES) {
    const y = rowY(s);
    const isSel = (s === selectedStage);
    stroke(isSel ? STAGE_COLOR[s] : 'silver');
    strokeWeight(isSel ? 2 : 1);
    fill(isSel ? 'lightyellow' : 'white');
    rect(6, y - 13, plotLeft - 12, 26, 6);
    fill(STAGE_COLOR[s]);
    noStroke();
    textAlign(CENTER, CENTER);
    text(s, 6 + (plotLeft - 12) / 2, y);
  }
}

function drawReadout(hours, cutoffMin) {
  const kept = minutesByStage(cutoffMin);
  const y0 = plotBottom + 46;
  fill('black');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text('With ' + nf(hours, 1, 1) + ' h of sleep (vs. a full 9 h night):', 10, y0);
  textSize(15);
  const rows = ['REM', 'N2', 'N3'];
  for (let i = 0; i < rows.length; i++) {
    const s = rows[i];
    const full = fullTotals[s];
    const k = Math.round(kept[s]);
    const lostMin = full - k;
    const pct = full > 0 ? Math.round(100 * lostMin / full) : 0;
    fill(STAGE_COLOR[s]);
    noStroke();
    text(s + ': ' + k + ' of ' + full + ' min kept (lost ' + lostMin + ' min, ' + pct + '%)', 20, y0 + 22 + i * 19);
  }
}

function drawEEGPanel(stage, isLost) {
  const top = 400;
  const bottom = drawHeight - 8;
  const left = 10;
  const right = canvasWidth - 10;
  // panel
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(left, top, right - left, bottom - top, 10);

  // heading and description
  fill(STAGE_COLOR[stage]);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text('EEG: ' + STAGE_INFO[stage].name + (isLost ? '  (lost tonight)' : ''), left + 10, top + 8);
  textStyle(NORMAL);
  fill('dimgray');
  noStroke();
  textSize(14);
  text('Schematic shape, not a real recording', left + 10, top + 28);
  fill('black');
  noStroke();
  text(STAGE_INFO[stage].line, left + 10, top + 46, right - left - 20, 36);

  // trace area
  const waveTop = top + 100;
  const waveBottom = bottom - 30;
  const mid = (waveTop + waveBottom) / 2;
  const halfH = (waveBottom - waveTop) / 2;
  const x0 = left + 15;
  const x1 = right - 15;
  stroke('gainsboro');
  strokeWeight(1);
  line(x0, mid, x1, mid);

  stroke(STAGE_COLOR[stage]);
  strokeWeight(1.6);
  noFill();
  beginShape();
  const seconds = 3;  // the trace shows 3 seconds
  for (let px = x0; px <= x1; px += 1) {
    const t = map(px, x0, x1, 0, seconds);
    const v = eegValue(stage, t);            // schematic microvolts
    vertex(px, mid - v * halfH / 70);        // 70 uV fills half the trace height
  }
  endShape();

  // labels for the features students should spot
  fill('black');
  noStroke();
  textSize(14);
  textAlign(CENTER, BOTTOM);
  const tx = (sec) => map(sec, 0, seconds, x0, x1);
  if (stage === 'N2') {
    text('spindle', tx(0.8), waveTop + 14);
    text('K-complex', tx(2.15), waveTop + 2);
  } else if (stage === 'REM') {
    text('sawtooth waves', tx(1.5), waveTop + 10);
  }

  // 1-second time bar
  const barW = (x1 - x0) / seconds;
  stroke('black');
  strokeWeight(2);
  line(x0, bottom - 16, x0 + barW, bottom - 16);
  fill('black');
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text('1 second', x0 + barW + 8, bottom - 16);
}

// ---------- model functions ----------

// Schematic EEG value (roughly in microvolts) for a stage at time t seconds.
// Frequencies follow standard sleep-scoring descriptions; shapes are simplified.
function eegValue(stage, t) {
  const TWO_PI_T = TWO_PI * t;
  if (stage === 'Wake') {
    // alpha rhythm about 10 Hz with a little faster activity
    return 18 * sin(TWO_PI_T * 10) + 4 * sin(TWO_PI_T * 19 + 1) + 3 * sin(TWO_PI_T * 23 + 2);
  }
  if (stage === 'N1') {
    // low-voltage theta about 4-7 Hz
    return 12 * sin(TWO_PI_T * 5.5) + 6 * sin(TWO_PI_T * 4.2 + 1) + 4 * sin(TWO_PI_T * 9 + 0.5) + 2 * sin(TWO_PI_T * 17);
  }
  if (stage === 'N2') {
    // theta background + one spindle (about 13 Hz, 0.8 s; spindles are about 12-14 Hz) + one K-complex
    let v = 6 * sin(TWO_PI_T * 5) + 3 * sin(TWO_PI_T * 3.7 + 1) + 2 * sin(TWO_PI_T * 15);
    if (t > 0.4 && t < 1.2) {
      const env = pow(sin(PI * (t - 0.4) / 0.8), 2);
      v += 22 * env * sin(TWO_PI_T * 13);
    }
    // K-complex: a sharp wave followed by a slower wave of opposite sign
    v += 65 * gauss(t, 2.0, 0.07) - 38 * gauss(t, 2.3, 0.14);
    return v;
  }
  if (stage === 'N3') {
    // tall slow delta waves about 1 Hz
    return 50 * sin(TWO_PI_T * 1.0 + 0.3) + 14 * sin(TWO_PI_T * 1.7 + 1) + 4 * sin(TWO_PI_T * 6);
  }
  if (stage === 'REM') {
    // low-voltage mixed frequency + a burst of sawtooth waves (about 3 Hz)
    let v = 5 * sin(TWO_PI_T * 7) + 4 * sin(TWO_PI_T * 13 + 1) + 2 * sin(TWO_PI_T * 21 + 2);
    if (t > 0.9 && t < 2.1) {
      const phase = ((t - 0.9) * 3) % 1;     // 3 teeth per second
      const tooth = phase < 0.75 ? phase / 0.75 : (1 - phase) / 0.25;  // slow rise, quick fall
      const ramp = min(1, (t - 0.9) / 0.1, (2.1 - t) / 0.1);         // fade in and out
      v = (1 - 0.5 * ramp) * v + ramp * (56 * tooth - 28);
    }
    return v;
  }
  return 0;
}

function gauss(t, center, width) {
  return exp(-pow((t - center) / width, 2));
}

// minutes in each stage between sleep onset and limitMin
function minutesByStage(limitMin) {
  const totals = { 'Wake': 0, 'REM': 0, 'N1': 0, 'N2': 0, 'N3': 0 };
  let t = 0;
  for (let seg of SEGMENTS) {
    const start = t;
    const end = t + seg[1];
    const overlap = max(0, min(end, limitMin) - start);
    totals[seg[0]] += overlap;
    t = end;
  }
  return totals;
}

function stageAt(minute) {
  let t = 0;
  for (let seg of SEGMENTS) {
    if (minute < t + seg[1]) return seg[0];
    t += seg[1];
  }
  return SEGMENTS[SEGMENTS.length - 1][0];
}

function rowY(stage) {
  return plotTop + STAGES.indexOf(stage) * rowH + rowH / 2;
}

function timeToX(minute, plotRight) {
  return map(minute, 0, FULL_NIGHT_MIN, plotLeft, plotRight);
}

// clicking a stage label selects that stage's EEG
function mousePressed() {
  if (mouseX >= 0 && mouseX <= plotLeft && mouseY >= plotTop && mouseY <= plotBottom) {
    const idx = floor((mouseY - plotTop) / rowH);
    if (idx >= 0 && idx < STAGES.length) {
      selectedStage = STAGES[idx];
      stageSelect.selected(selectedStage);
    }
  }
}

// These two functions must be present for width-responsive MicroSims
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  sleepSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
