// Aplysia Habituation and Sensitization MicroSim
// CANVAS_HEIGHT = 530 (drawHeight 480 + controlHeight 50)
// Use iframe height 532px to embed this MicroSim.
// A simplified, qualitative model of the gill-withdrawal reflex of the sea slug Aplysia.
//  - Touching the siphon activates a siphon sensory neuron (SN), which excites a gill motor neuron (MN).
//  - Repeated touches depress the SN -> MN synapse (less transmitter released): habituation.
//  - A tail shock activates a facilitating interneuron that releases serotonin (5-HT) onto the
//    SN terminal, so the SN releases more transmitter: sensitization (or dishabituation).
//  - Rest lets habituation partly recover and lets short-term facilitation fade.
// All numbers are arbitrary units chosen to show the direction of each change, not real data.
// The sim is event driven: nothing changes until the learner presses a button.

// ---------- layout globals ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// ---------- controls ----------
let touchButton, shockButton, restButton, resetButton;

// ---------- model state (arbitrary units) ----------
// depression: 1 = fresh synapse, falls with each siphon touch (habituation)
// facilitation: 1 = no serotonin effect, rises after a tail shock (sensitization)
let depression = 1.0;
let facilitation = 1.0;
const DEPRESS_PER_TOUCH = 0.78;   // each touch keeps 78% of the depression factor
const MIN_DEPRESSION = 0.12;
const SHOCK_BOOST = 1.0;          // added to facilitation by one tail shock
const SHOCK_RESTORE = 0.5;        // serotonin also restores half of the lost release at a depressed synapse
const MAX_FACILITATION = 2.5;
const REST_RECOVERY = 0.5;        // a rest recovers half of the remaining habituation
const REST_FADE = 0.5;            // a rest removes half of the remaining facilitation

let trials = [];                  // {amp, type}  type: 'normal' | 'sensitized'
const MAX_BARS = 16;
let events = [];                  // markers drawn between bars: 'shock' or 'rest'
let message = 'Press "Touch siphon" to test the reflex.';

// ---------- animation state (only runs right after a button press) ----------
let gillAnim = 0;        // frames left in gill-withdrawal animation
let gillAmount = 0;      // 0..1 how far the gill pulls in on this trial
let shockAnim = 0;       // frames left in tail-shock flash
let spikeAnim = 0;       // frames left for the signal travelling SN -> MN
const ANIM_FRAMES = 45;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  touchButton = createButton('Touch siphon');
  touchButton.position(10, drawHeight + 12);
  touchButton.mousePressed(touchSiphon);

  shockButton = createButton('Shock tail');
  shockButton.position(125, drawHeight + 12);
  shockButton.mousePressed(shockTail);

  restButton = createButton('Rest');
  restButton.position(220, drawHeight + 12);
  restButton.mousePressed(restPeriod);

  resetButton = createButton('Reset');
  resetButton.position(280, drawHeight + 12);
  resetButton.mousePressed(resetModel);

  describe('Simplified Aplysia gill-withdrawal reflex. Buttons touch the siphon, shock the tail, or rest the animal. ' +
    'A bar chart shows the gill-withdrawal response on each trial, and a meter shows the strength of the synapse ' +
    'from the siphon sensory neuron to the gill motor neuron. Repeated touches shrink the response (habituation); ' +
    'a tail shock makes later touches produce a larger response (sensitization).');
}

// ---------- model ----------
function synapticStrength() {
  return depression * facilitation;   // 1.0 = baseline strength
}

function touchSiphon() {
  let s = synapticStrength();
  // response amplitude in arbitrary units, baseline = 100; capped so bars fit
  let amp = constrain(100 * s, 0, 250);
  let type = facilitation > 1.05 ? 'sensitized' : 'normal';
  trials.push({ amp: amp, type: type });
  if (trials.length > MAX_BARS) {
    trials.shift();
    // shift event markers too
    events = events.map(e => ({ at: e.at - 1, kind: e.kind })).filter(e => e.at >= 0);
  }
  gillAmount = constrain(amp / 250, 0.05, 1);
  gillAnim = ANIM_FRAMES;
  spikeAnim = ANIM_FRAMES;
  // habituation: this touch depresses the synapse for next time
  depression = max(MIN_DEPRESSION, depression * DEPRESS_PER_TOUCH);
  if (type === 'sensitized') {
    message = 'Response ' + nf(amp, 0, 0) + ': serotonin is boosting transmitter release.';
  } else if (amp < 50) {
    message = 'Response ' + nf(amp, 0, 0) + ': habituated. Same touch, much smaller withdrawal.';
  } else {
    message = 'Response ' + nf(amp, 0, 0) + '. Touch again and watch the bars.';
  }
}

function shockTail() {
  facilitation = min(MAX_FACILITATION, facilitation + SHOCK_BOOST);
  depression = depression + SHOCK_RESTORE * (1 - depression);
  events.push({ at: trials.length, kind: 'shock' });
  shockAnim = ANIM_FRAMES;
  message = 'Tail shock: the interneuron released serotonin (5-HT). Now touch the siphon.';
}

function restPeriod() {
  depression = depression + REST_RECOVERY * (1 - depression);
  facilitation = 1 + REST_FADE * (facilitation - 1);
  events.push({ at: trials.length, kind: 'rest' });
  message = 'Rest: habituation partly recovers and short-term sensitization fades.';
}

function resetModel() {
  depression = 1.0;
  facilitation = 1.0;
  trials = [];
  events = [];
  gillAnim = 0; shockAnim = 0; spikeAnim = 0;
  message = 'Reset. Press "Touch siphon" to test the reflex.';
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();

  // drawing area
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  // control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title and instruction
  noStroke();
  fill('black');
  let narrow = canvasWidth < 640;
  textAlign(CENTER, TOP);
  textSize(narrow ? 18 : 22);
  text('Aplysia Habituation and Sensitization', canvasWidth / 2, 8);
  textSize(14);
  fill('dimgray');
  noStroke();
  textAlign(CENTER, TOP);
  text('Touch the siphon several times, then shock the tail and touch again. (Simplified model)',
    margin, narrow ? 32 : 36, canvasWidth - 2 * margin, 40);

  let leftW = narrow ? canvasWidth : canvasWidth * 0.5;

  if (narrow) {
    drawSlug(0, 68, canvasWidth, 92);
    drawCircuit(0, 160, canvasWidth, 130);
    drawChart(0, 290, canvasWidth, 150);
  } else {
    drawSlug(0, 60, leftW, 200);
    drawCircuit(0, 262, leftW, 180);
    drawChart(leftW, 60, canvasWidth - leftW, 382);
  }

  // status message (wraps on narrow screens)
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(15);
  text(message, margin, drawHeight - 38, canvasWidth - 2 * margin, 36);

  // step animations
  if (gillAnim > 0) gillAnim--;
  if (shockAnim > 0) shockAnim--;
  if (spikeAnim > 0) spikeAnim--;

  // control-area label: synaptic strength value
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  if (canvasWidth > 520) {
    text('Synapse strength: ' + nf(synapticStrength(), 1, 2) + ' x baseline', 350, drawHeight + 24);
  }
}

// Side view of the sea slug with siphon and gill
function drawSlug(x0, y0, w, h) {
  let cx = x0 + w * 0.5;
  let cy = y0 + h * 0.55;
  let bw = min(w * 0.6, 300);
  let bh = h * 0.45;

  // tail shock flash
  if (shockAnim > 0) {
    noStroke();
    fill(255, 200, 0, map(shockAnim, 0, ANIM_FRAMES, 0, 200));
    circle(cx + bw * 0.5, cy + bh * 0.15, 70);
  }

  // body
  stroke('purple');
  strokeWeight(2);
  fill('plum');
  ellipse(cx, cy, bw, bh);
  // tail (right)
  triangle(cx + bw * 0.42, cy - bh * 0.18, cx + bw * 0.42, cy + bh * 0.3, cx + bw * 0.62, cy + bh * 0.2);
  // head (left) with rhinophores
  ellipse(cx - bw * 0.5, cy + bh * 0.05, bh * 0.75, bh * 0.6);
  line(cx - bw * 0.52, cy - bh * 0.2, cx - bw * 0.58, cy - bh * 0.55);
  line(cx - bw * 0.46, cy - bh * 0.2, cx - bw * 0.44, cy - bh * 0.58);
  // eye
  noStroke();
  fill('black');
  circle(cx - bw * 0.56, cy, 5);

  // mantle region on top-back
  stroke('purple');
  fill('orchid');
  arc(cx + bw * 0.12, cy - bh * 0.28, bw * 0.42, bh * 0.55, PI, TWO_PI, CHORD);

  // gill: feathery shape under the mantle, shrinks during withdrawal
  let pull = 0;
  if (gillAnim > 0) {
    let t = 1 - gillAnim / ANIM_FRAMES;          // 0 -> 1
    pull = gillAmount * sin(PI * min(1, t * 1.6)); // quick pull in, slower relax
    if (t > 0.62) pull = gillAmount * map(t, 0.62, 1, 1, 0) * 0.98;
  }
  let gScale = 1 - 0.8 * pull;
  let gx = cx + bw * 0.12;
  let gy = cy - bh * 0.42;
  stroke('firebrick');
  strokeWeight(2);
  fill('salmon');
  for (let i = -2; i <= 2; i++) {
    let lx = gx + i * 12 * gScale;
    ellipse(lx, gy - 14 * gScale, 10 * gScale + 2, 30 * gScale + 2);
  }

  // siphon: tube sticking up and back from the mantle
  stroke('purple');
  strokeWeight(7);
  noFill();
  let sx = cx + bw * 0.3;
  let sy = cy - bh * 0.38;
  line(sx, sy, sx + 26, sy - 34);
  strokeWeight(1);

  // touch marker on siphon
  if (spikeAnim > ANIM_FRAMES - 12) {
    noStroke();
    fill('dodgerblue');
    circle(sx + 26, sy - 34, 16);
  }

  // labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('siphon', sx + 32, sy - 40);
  textAlign(RIGHT, CENTER);
  text('gill', gx - 36, gy - 26);
  textAlign(CENTER, TOP);
  text('tail', cx + bw * 0.55, cy + bh * 0.42);
  text('head', cx - bw * 0.5, cy + bh * 0.42);
}

// Simplified circuit: siphon SN -> gill MN, tail SN -> facilitating interneuron -> SN terminal
function drawCircuit(x0, y0, w, h) {
  // panel
  stroke('silver');
  fill('white');
  rect(x0 + 10, y0, w - 20, h - 6, 10);

  let compact = h < 160;
  let rowY = y0 + (compact ? h * 0.4 : h * 0.4);
  let snX = x0 + w * 0.16;
  let mnX = x0 + w * 0.68;
  let synX = mnX - 22;
  let gillX = x0 + w * 0.9;
  let inX = synX;
  let inY = y0 + (compact ? h * 0.72 : h * 0.72);
  let tailX = x0 + w * 0.16;

  let s = synapticStrength();

  // axon SN -> synapse
  stroke('steelblue');
  strokeWeight(3);
  line(snX + 16, rowY, synX - 6, rowY);
  // synapse knob (size reflects strength)
  noStroke();
  fill('steelblue');
  let knob = constrain(8 + 8 * s, 8, 30);
  circle(synX - 6, rowY, knob);
  // MN axon to gill
  stroke('seagreen');
  strokeWeight(3);
  line(mnX + 16, rowY, gillX - 10, rowY);
  // cells
  noStroke();
  fill('steelblue');
  circle(snX, rowY, 32);
  fill('seagreen');
  circle(mnX, rowY, 32);
  fill('salmon');
  rect(gillX - 10, rowY - 12, 22, 24, 4);

  // interneuron path from tail
  stroke('darkorange');
  strokeWeight(3);
  line(tailX + 16, inY, inX - 16, inY);
  line(inX, inY - 16, inX - 4, rowY + knob / 2 + 4);
  noStroke();
  fill('darkorange');
  circle(tailX, inY, 26);
  circle(inX, inY, 32);

  // serotonin dots after a shock
  if (facilitation > 1.05) {
    let n = floor(map(facilitation, 1, MAX_FACILITATION, 1, 7));
    fill('orange');
    for (let i = 0; i < n; i++) {
      circle(inX + 10 + (i % 3) * 7, rowY + knob / 2 + 8 + floor(i / 3) * 7, 5);
    }
  }

  // travelling spike after a touch
  if (spikeAnim > 0) {
    let t = 1 - spikeAnim / ANIM_FRAMES;
    let px;
    if (t < 0.5) px = lerp(snX, synX, t / 0.5);
    else px = lerp(mnX, gillX, (t - 0.5) / 0.5);
    noStroke();
    fill('gold');
    circle(px, rowY, 10);
  }
  if (shockAnim > 0) {
    let t = 1 - shockAnim / ANIM_FRAMES;
    noStroke();
    fill('gold');
    circle(lerp(tailX, inX, t), inY, 10);
  }

  // labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text('siphon sensory', snX + 10, rowY - 17);
  text('motor neuron', mnX, rowY - 17);
  textAlign(CENTER, TOP);
  text('gill', gillX, rowY + 14);
  text('tail sensory', tailX, inY + 15);
  if (w < 500) {
    textAlign(LEFT, CENTER);
    text('interneuron', inX + 20, inY - 6);
    text('(5-HT)', inX + 20, inY + 10);
  } else {
    textAlign(LEFT, CENTER);
    text('interneuron (5-HT)', inX + 20, inY + 2);
  }

  // synaptic strength meter
  let mx = x0 + 22;
  let my = y0 + 8;
  textAlign(LEFT, TOP);
  textSize(14);
  noStroke();
  fill('black');
  text('Sensory-to-motor synapse strength: ' + nf(s, 1, 2) + ' x', mx, my);
  if (!compact) {
    let barW = w - 60;
    let barY = my + 20;
    stroke('silver');
    fill('whitesmoke');
    rect(mx, barY, barW, 10, 3);
    noStroke();
    fill(s >= 1 ? 'steelblue' : 'lightsteelblue');
    rect(mx, barY, barW * constrain(s / MAX_FACILITATION, 0, 1), 10, 3);
    // baseline tick
    stroke('black');
    let bx = mx + barW * (1 / MAX_FACILITATION);
    line(bx, barY - 3, bx, barY + 13);
    strokeWeight(1);
  }
}

// Bar chart of gill-withdrawal response across trials
function drawChart(x0, y0, w, h) {
  stroke('silver');
  fill('white');
  rect(x0 + 8, y0, w - 18, h, 10);

  let px = x0 + 50;
  let small = h < 200;
  let py = y0 + (small ? 40 : 46);
  let pw = w - 76;
  let ph = h - (small ? 82 : 100);
  let maxAmp = 250;

  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  text('Gill-withdrawal response on each touch', x0 + w / 2, y0 + 6);

  // axes
  stroke('gray');
  line(px, py, px, py + ph);
  line(px, py + ph, px + pw, py + ph);
  // baseline line at 100
  let by = py + ph - ph * (100 / maxAmp);
  stroke('lightgray');
  drawingContext.setLineDash([4, 4]);
  line(px, by, px + pw, by);
  drawingContext.setLineDash([]);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('100', px - 4, by);
  text('0', px - 4, py + ph);
  text('250', px - 4, py);

  // bars
  let slot = pw / MAX_BARS;
  for (let i = 0; i < trials.length; i++) {
    let bh = ph * (trials[i].amp / maxAmp);
    noStroke();
    fill(trials[i].type === 'sensitized' ? 'darkorange' : 'steelblue');
    rect(px + i * slot + slot * 0.15, py + ph - bh, slot * 0.7, bh);
  }
  // event markers between bars
  for (let e of events) {
    let ex = px + e.at * slot;
    if (e.at > MAX_BARS) continue;
    strokeWeight(2);
    stroke(e.kind === 'shock' ? 'darkorange' : 'seagreen');
    line(ex, py, ex, py + ph);
    strokeWeight(1);
    noStroke();
    fill(e.kind === 'shock' ? 'darkorange' : 'seagreen');
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(e.kind === 'shock' ? 'S' : 'R', ex, py);
  }

  // axis label + legend
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  if (!small) text('Touch number (arbitrary units on vertical axis)', px + pw / 2, py + ph + 4);
  textAlign(LEFT, TOP);
  let ly = py + ph + (small ? 8 : 24);
  fill('steelblue'); rect(px, ly + 2, 12, 12);
  fill('darkorange'); rect(px + 80, ly + 2, 12, 12);
  fill('black');
  text('normal', px + 16, ly);
  text('after shock', px + 96, ly);
  if (pw > 300) {
    fill('darkorange'); text('S = shock', px + 200, ly);
    fill('seagreen'); text('R = rest', px + 280, ly);
  }
  if (trials.length === 0) {
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(15);
    text('No touches yet', px + pw / 2, py + ph / 2);
  }
}

// ---------- responsive helpers (keep at end) ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
