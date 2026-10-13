// Amyloid and Tau Cascade MicroSim
// CANVAS_HEIGHT = 650 (drawHeight 570 + controlHeight 80)
// Use iframe height 652px to embed this MicroSim.
// A schematic timeline (age 40 to 90) of Alzheimer's disease biomarkers.
// Curve ORDER follows the hypothetical biomarker model of Jack et al. (Lancet Neurology, 2010):
// amyloid becomes abnormal first, then tau, then neurodegeneration, then cognitive symptoms.
// All values are relative (0-100% of each curve's maximum). Schematic model, not real patient data.
// The anti-amyloid treatment option is illustrative only.
// Not animated, so there is no Start/Pause button. Everything updates when the learner moves the controls.

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
// fixed drawing region above the controls (no controls in this region)
let drawHeight = 570;
// two rows of controls: (2 x 35) + 10 = 80
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
// room for the "Age: 65 years" label to the left of the slider
let sliderLeftMargin = 150;
let defaultTextSize = 16;

// controls
let ageSlider;
let treatCheckbox;

// treatment state
let treated = false;
let treatStartAge = null;

// schematic curve parameters: logistic curves with a midpoint age and steepness
// Provenance: illustrative values chosen only to reproduce the ORDER and rough spacing
// described by Jack et al. 2010 and NIA ("changes may begin a decade or more before symptoms").
const curves = [
  { key: 'amyloid', label: 'Amyloid plaques', short: 'Amyloid', color: 'darkorange', mid: 56, k: 0.22 },
  { key: 'tau', label: 'Tau tangles', short: 'Tau', color: 'royalblue', mid: 66, k: 0.22 },
  { key: 'neuro', label: 'Neuron loss / shrinkage', short: 'Neuron loss', color: 'dimgray', mid: 71, k: 0.20 },
  { key: 'symptoms', label: 'Memory & thinking problems', short: 'Symptoms', color: 'crimson', mid: 78, k: 0.25 }
];

const AGE_MIN = 40;
const AGE_MAX = 90;
const ABNORMAL = 0.20; // schematic "abnormal on tests" line

// fixed relative positions for plaques in the tissue panel (fraction of panel width, y offset)
const plaqueSpots = [
  [0.20, -32], [0.60, 30], [0.42, -36], [0.82, 26],
  [0.10, 30], [0.70, -34], [0.30, 34], [0.90, -30]
];
// order in which neurons are lost (index of the 5 neurons)
const lossOrder = [2, 0, 4, 1];
// order in which neurons get tangles
const tangleOrder = [2, 0, 4, 1, 3];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: age slider (min 40, max 90, default 50, step 1, unit years)
  ageSlider = createSlider(AGE_MIN, AGE_MAX, 50, 1);
  ageSlider.parent(document.querySelector('main'));
  ageSlider.position(sliderLeftMargin, drawHeight + 8);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Row 2: treatment checkbox
  treatCheckbox = createCheckbox(' Start anti-amyloid treatment at this age (illustrative)', false);
  treatCheckbox.parent(document.querySelector('main'));
  treatCheckbox.position(10, drawHeight + 45);
  treatCheckbox.style('font-size', '16px');
  treatCheckbox.style('font-family', 'Arial, Helvetica, sans-serif');
  treatCheckbox.changed(toggleTreatment);

  describe('A schematic timeline from age 40 to 90 with four rising curves for Alzheimer disease: amyloid plaques rise first, then tau tangles, then neuron loss, and memory and thinking problems last. An age slider moves a marker and shows a cartoon of brain tissue and the clinical stage: preclinical, mild cognitive impairment, or dementia. A checkbox starts an illustrative anti-amyloid treatment that lowers the amyloid curve.');
}

function toggleTreatment() {
  treated = treatCheckbox.checked();
  treatStartAge = treated ? ageSlider.value() : null;
}

// logistic curve value from 0 to 1
function logistic(age, c) {
  return 1 / (1 + Math.exp(-c.k * (age - c.mid)));
}

// value of a curve at an age, including the illustrative treatment effect on amyloid only
function valueAt(key, age) {
  const c = curves.find(cc => cc.key === key);
  let v = logistic(age, c);
  if (key === 'amyloid' && treated && treatStartAge !== null && age > treatStartAge) {
    const start = logistic(treatStartAge, c);
    // illustrative: amyloid falls over a few years after treatment starts
    v = start * Math.exp(-(age - treatStartAge) / 1.5);
  }
  return v;
}

function stageFor(age) {
  const s = valueAt('symptoms', age);
  const a = logistic(age, curves[0]);
  if (s < 0.15) {
    if (a < ABNORMAL) return { name: 'No measurable Alzheimer changes yet', color: 'honeydew', code: 0 };
    return { name: 'Preclinical Alzheimer disease: brain changes, no symptoms', color: 'lightyellow', code: 1 };
  }
  if (s < 0.5) return { name: 'Mild cognitive impairment (MCI)', color: 'moccasin', code: 2 };
  if (s < 0.75) return { name: 'Dementia (mild stage)', color: 'lightsalmon', code: 3 };
  return { name: 'Dementia (moderate to severe)', color: 'lightcoral', code: 4 };
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
  rect(0, drawHeight, canvasWidth, controlHeight);

  const age = ageSlider.value();

  // ----- chart geometry -----
  const chartLeft = 58;
  const chartRight = canvasWidth - 20;
  const chartTop = 72;
  const chartBottom = 290;
  const xOf = a => map(a, AGE_MIN, AGE_MAX, chartLeft, chartRight);
  const yOf = v => map(v, 0, 1, chartBottom, chartTop);

  // chart background and grid
  fill('white');
  stroke('gainsboro');
  rect(chartLeft, chartTop, chartRight - chartLeft, chartBottom - chartTop);
  strokeWeight(1);
  for (let a = AGE_MIN; a <= AGE_MAX; a += 10) {
    stroke('gainsboro');
    line(xOf(a), chartTop, xOf(a), chartBottom);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, TOP);
    text(a, xOf(a), chartBottom + 4);
  }
  // y axis labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('0%', chartLeft - 4, chartBottom);
  text('100%', chartLeft - 4, chartTop);
  // axis titles
  textAlign(CENTER, TOP);
  noStroke();
  text('Age (years)', (chartLeft + chartRight) / 2, chartBottom + 20);
  push();
  translate(14, (chartTop + chartBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  noStroke();
  text('Relative level', 0, 0);
  pop();

  // abnormal threshold line (dashed)
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(chartLeft, yOf(ABNORMAL), chartRight, yOf(ABNORMAL));
  drawingContext.setLineDash([]);
  noStroke();
  fill('gray');
  textAlign(RIGHT, BOTTOM);
  textSize(14);
  text('abnormal on tests', chartRight - 4, yOf(ABNORMAL) - 2);

  // if treated, draw the untreated amyloid curve faintly for comparison
  if (treated) {
    noFill();
    stroke('navajowhite');
    strokeWeight(3);
    drawingContext.setLineDash([6, 4]);
    beginShape();
    for (let a = AGE_MIN; a <= AGE_MAX; a += 0.25) vertex(xOf(a), yOf(logistic(a, curves[0])));
    endShape();
    drawingContext.setLineDash([]);
  }

  // the four curves
  for (const c of curves) {
    noFill();
    stroke(c.color);
    strokeWeight(3);
    beginShape();
    for (let a = AGE_MIN; a <= AGE_MAX; a += 0.25) vertex(xOf(a), yOf(valueAt(c.key, a)));
    endShape();
  }

  // treatment start marker
  if (treated) {
    stroke('darkorange');
    strokeWeight(1);
    drawingContext.setLineDash([2, 3]);
    line(xOf(treatStartAge), chartTop, xOf(treatStartAge), chartBottom);
    drawingContext.setLineDash([]);
  }

  // age marker
  stroke('black');
  strokeWeight(2);
  line(xOf(age), chartTop, xOf(age), chartBottom);
  for (const c of curves) {
    fill(c.color);
    stroke('white');
    strokeWeight(1.5);
    circle(xOf(age), yOf(valueAt(c.key, age)), 10);
  }

  // legend (top-left of chart, where the curves are still low)
  const legX = chartLeft + 8;
  let legY = chartTop + 8;
  const narrow = canvasWidth < 560;
  fill(255, 255, 255, 230);
  stroke('silver');
  rect(legX - 4, legY - 4, narrow ? 120 : 226, curves.length * 19 + 6, 6);
  for (const c of curves) {
    stroke(c.color);
    strokeWeight(3);
    line(legX + 2, legY + 8, legX + 22, legY + 8);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, CENTER);
    text(narrow ? c.short : c.label, legX + 28, legY + 8);
    legY += 19;
  }

  // ----- title and instruction (drawn after the chart) -----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Amyloid and Tau Cascade', canvasWidth / 2, 8);
  textSize(15);
  noStroke();
  fill('darkslategray');
  text('Drag the age slider. Which curve turns abnormal first?', canvasWidth / 2, 38);

  // ----- lower panel: tissue cartoon + stage -----
  const panelTop = 330;
  const panelBottom = 492;
  const splitX = canvasWidth >= 560 ? canvasWidth * 0.55 : canvasWidth * 0.52;
  drawTissue(10, panelTop, splitX - 15, panelBottom - panelTop, age);
  drawStage(splitX, panelTop, canvasWidth - splitX - 10, panelBottom - panelTop, age);

  // ----- treatment note -----
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text(treatmentNote(), 10, 498, canvasWidth - 20, 52);

  // ----- footnote -----
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  text(canvasWidth < 560 ? 'Schematic model, not real patient data' : 'Schematic model, not real patient data (order after Jack et al., 2010)', canvasWidth / 2, drawHeight - 4);

  // ----- control labels -----
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Age: ' + age + ' years', 10, drawHeight + 18);
}

function treatmentNote() {
  if (!treated) {
    return 'Try it: set an age, then check the box to see what an anti-amyloid drug does to the amyloid curve (illustrative).';
  }
  const st = stageFor(treatStartAge);
  const start = 'Treatment started at age ' + treatStartAge + '. ';
  if (st.code <= 1) {
    return start + 'Amyloid falls. Whether treating before symptoms delays them is still being tested in clinical trials.';
  }
  if (st.code <= 3) {
    return start + 'Amyloid falls. In trials of early-stage patients, decline was slowed modestly, not stopped. Tau and lost neurons are not restored.';
  }
  return start + 'Not an approved use: these drugs are approved only for MCI or mild dementia. By this stage, many neurons in key areas are already lost.';
}

// cartoon of brain tissue at this age: plaques outside cells, tangles inside cells, lost neurons faded
function drawTissue(x, y, w, h, age) {
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Brain tissue (cartoon)', x + 8, y + 6);

  const amy = valueAt('amyloid', age);
  const tau = valueAt('tau', age);
  const neuro = valueAt('neuro', age);
  const nPlaque = Math.round(amy * plaqueSpots.length);
  const nTangle = Math.round(tau * 5);
  const nLost = Math.round(neuro * 4);

  const midY = y + 80;
  const lost = lossOrder.slice(0, nLost);
  const tangled = tangleOrder.slice(0, nTangle);

  // plaques (between cells)
  for (let i = 0; i < nPlaque; i++) {
    const px = x + 12 + plaqueSpots[i][0] * (w - 24);
    const py = midY + plaqueSpots[i][1];
    noStroke();
    fill('orange');
    circle(px, py, 13);
    fill('darkorange');
    circle(px + 5, py - 3, 8);
    circle(px - 4, py + 4, 7);
  }

  // five neurons
  for (let i = 0; i < 5; i++) {
    const nx = x + (w / 6) * (i + 1);
    const isLost = lost.includes(i);
    const hasTangle = tangled.includes(i);
    strokeWeight(2);
    if (isLost) {
      stroke('lightgray');
      drawingContext.setLineDash([3, 3]);
    } else {
      stroke('seagreen');
    }
    // dendrites and axon
    line(nx, midY, nx - 10, midY - 22);
    line(nx, midY, nx + 10, midY - 22);
    line(nx, midY, nx, midY + 30);
    fill(isLost ? 'white' : 'mediumseagreen');
    circle(nx, midY, 22);
    drawingContext.setLineDash([]);
    // tangle inside the cell body
    if (hasTangle && !isLost) {
      noFill();
      stroke('midnightblue');
      strokeWeight(2);
      beginShape();
      for (let t = 0; t <= 1; t += 0.1) vertex(nx - 6 + 12 * t, midY + 4 * Math.sin(t * 12));
      endShape();
    }
  }

  // key
  const ky = y + h - 22;
  const k1 = x + 16;
  const k2 = x + 12 + w * 0.36;
  const k3 = x + 18 + w * 0.68;
  noStroke();
  fill('orange');
  circle(k1, ky + 7, 11);
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('plaque', k1 + 10, ky + 7);
  noFill();
  stroke('midnightblue');
  strokeWeight(2);
  const tx = k2;
  beginShape();
  for (let t = 0; t <= 1; t += 0.1) vertex(tx + 12 * t, ky + 7 + 4 * Math.sin(t * 12));
  endShape();
  noStroke();
  fill('black');
  text('tangle', tx + 17, ky + 7);
  stroke('lightgray');
  drawingContext.setLineDash([3, 3]);
  fill('white');
  circle(k3, ky + 7, 12);
  drawingContext.setLineDash([]);
  noStroke();
  fill('black');
  text(w > 300 ? 'lost neuron' : 'lost', k3 + 10, ky + 7);
}

// clinical stage box and the four relative levels
function drawStage(x, y, w, h, age) {
  const st = stageFor(age);
  fill(st.color);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Clinical stage at age ' + age + ':', x + 8, y + 6, w - 16, 20);
  textSize(16);
  textStyle(BOLD);
  text(st.name, x + 8, y + 26, w - 16, 44);
  textStyle(NORMAL);
  textSize(14);
  let ry = y + 74;
  const rows = [
    ['Amyloid', valueAt('amyloid', age)],
    ['Tau', valueAt('tau', age)],
    ['Neuron loss', valueAt('neuro', age)],
    ['Symptoms', valueAt('symptoms', age)]
  ];
  for (const r of rows) {
    noStroke();
    fill('black');
    text(r[0] + ': ' + Math.round(r[1] * 100) + '%', x + 8, ry);
    ry += 20;
  }
}

// These two functions must be present for width-responsive MicroSims
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
