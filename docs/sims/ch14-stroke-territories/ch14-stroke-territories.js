// Stroke Territory Map MicroSim
// CANVAS_HEIGHT = 700  (drawHeight 620 + controlHeight 80)
// Use iframe height 702 when embedding this MicroSim.
//
// Learning objective (Apply): given which cerebral artery is blocked
// (anterior, middle, or posterior cerebral artery) and on which side,
// predict which body regions and functions are typically affected.
//
// Two linked panels:
//   (a) a schematic axial (horizontal) brain slice drawn like a CT scan:
//       front at the top, and the person's RIGHT on the viewer's LEFT
//       (the radiology convention doctors use);
//   (b) a body figure facing the viewer (so the person's RIGHT is also on
//       the viewer's LEFT), plus a small "what the person sees" circle.
// Choosing an artery and side darkens that territory, highlights the
// opposite side of the body, and lists the typical deficits.
//
// Deficit patterns follow the "Selected Stroke Syndromes" table in the
// Merck Manual Professional Version, "Overview of Stroke" (reviewed 2025):
//   ACA: contralateral weakness maximal in the leg; may add apathy, poor judgment,
//        urinary incontinence.
//   MCA: contralateral weakness and numbness worse in face and arm than leg,
//        contralateral homonymous hemianopia; aphasia if the dominant (usually
//        left) hemisphere is hit; neglect if the nondominant (usually right) one is.
//   PCA: contralateral homonymous hemianopia; memory loss possible.
// These are TYPICAL patterns only. Real strokes vary in size and location.
// The territory shapes are simplified wedges, not an exact anatomical atlas.
// MicroSim template version 2026.03

// ---------- layout globals (MicroSim standard names) ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 80;          // 2 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;      // no sliders here, kept for template consistency
let defaultTextSize = 16;

// ---------- controls ----------
let arterySelect;
let sideSelect;
let predictCheckbox;

// ---------- state ----------
let artery = 'none';   // 'none' | 'ACA' | 'MCA' | 'PCA'
let side = 'left';     // which hemisphere is damaged: 'left' | 'right'

// Territory boundaries, measured as the angle (degrees) from the FRONT of the
// slice, sweeping back along one hemisphere. 0 = straight ahead, 180 = straight back.
const TERRITORY = {
  ACA: { from: 0,   to: 38,  light: 'palegreen',  dark: 'seagreen',   name: 'ACA' },
  MCA: { from: 38,  to: 138, light: 'lightblue',  dark: 'steelblue',  name: 'MCA' },
  PCA: { from: 138, to: 180, light: 'thistle',    dark: 'darkorchid', name: 'PCA' }
};

// Body involvement: 2 = main problem, 1 = milder or possible, 0 = usually spared
const BODY = {
  ACA: { face: 0, arm: 1, leg: 2, vision: 0 },
  MCA: { face: 2, arm: 2, leg: 1, vision: 1 },
  PCA: { face: 0, arm: 0, leg: 0, vision: 2 }
};

// Info panel text (typical deficits). Keys: artery + '-' + side
const INFO = {
  'none': {
    title: 'No artery blocked',
    lines: [
      'Pick a blocked artery and a side below, or click a colored region of the brain slice.',
      'Both pictures face you, so the person\'s RIGHT side (R) is on YOUR left.',
      'The Vision circle shows what the person sees, with their left half on the left.',
      'Before you look at the body, predict: which side of the body will be affected?'
    ]
  },
  'ACA-left': {
    title: 'Left anterior cerebral artery (ACA) blocked',
    lines: [
      'Damaged area: the inner (midline) part of the left frontal and parietal lobes, where the leg areas of the motor and touch strips sit.',
      'Typical signs: RIGHT leg weakness and numbness, worse than the arm. The face is usually spared.',
      'May also cause apathy, poor judgment, or trouble controlling the bladder.'
    ]
  },
  'ACA-right': {
    title: 'Right anterior cerebral artery (ACA) blocked',
    lines: [
      'Damaged area: the inner (midline) part of the right frontal and parietal lobes, where the leg areas of the motor and touch strips sit.',
      'Typical signs: LEFT leg weakness and numbness, worse than the arm. The face is usually spared.',
      'May also cause apathy, poor judgment, or trouble controlling the bladder.'
    ]
  },
  'MCA-left': {
    title: 'Left middle cerebral artery (MCA) blocked',
    lines: [
      'Damaged area: the outer surface of the left hemisphere, including the face and arm areas of the motor and touch strips.',
      'Typical signs: RIGHT face and arm weakness and numbness, worse than the leg.',
      'Aphasia (trouble with language), because language areas are on the left in most people.',
      'Can also cause loss of the RIGHT half of vision in both eyes.'
    ]
  },
  'MCA-right': {
    title: 'Right middle cerebral artery (MCA) blocked',
    lines: [
      'Damaged area: the outer surface of the right hemisphere, including the face and arm areas of the motor and touch strips.',
      'Typical signs: LEFT face and arm weakness and numbness, worse than the leg.',
      'Neglect: the person may ignore the LEFT side of space and of their own body.',
      'Can also cause loss of the LEFT half of vision in both eyes.'
    ]
  },
  'PCA-left': {
    title: 'Left posterior cerebral artery (PCA) blocked',
    lines: [
      'Damaged area: the left occipital lobe (vision) and the inner part of the left temporal lobe.',
      'Typical signs: loss of the RIGHT half of vision in both eyes (right homonymous hemianopia).',
      'Arms and legs are usually not weak. Memory problems are possible.'
    ]
  },
  'PCA-right': {
    title: 'Right posterior cerebral artery (PCA) blocked',
    lines: [
      'Damaged area: the right occipital lobe (vision) and the inner part of the right temporal lobe.',
      'Typical signs: loss of the LEFT half of vision in both eyes (left homonymous hemianopia).',
      'Arms and legs are usually not weak. Memory problems are possible.'
    ]
  }
};

// geometry cache (recomputed each frame from canvasWidth)
let brain = { cx: 0, cy: 0, a: 0, b: 0 };
let bodyPanel = { x: 0, w: 0 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Row 1: artery and side selects
  arterySelect = createSelect();
  arterySelect.option('None', 'none');
  arterySelect.option('ACA (anterior)', 'ACA');
  arterySelect.option('MCA (middle)', 'MCA');
  arterySelect.option('PCA (posterior)', 'PCA');
  arterySelect.selected('none');
  arterySelect.parent(document.querySelector('main'));
  arterySelect.position(70, drawHeight + 8);
  arterySelect.style('font-size', '15px');
  arterySelect.changed(() => { artery = arterySelect.value(); });

  sideSelect = createSelect();
  sideSelect.option('Left', 'left');
  sideSelect.option('Right', 'right');
  sideSelect.selected('left');
  sideSelect.parent(document.querySelector('main'));
  sideSelect.style('font-size', '15px');
  sideSelect.changed(() => { side = sideSelect.value(); });

  // Row 2: predict-first checkbox
  predictCheckbox = createCheckbox(' Predict first (hide the body until I uncheck this)', false);
  predictCheckbox.parent(document.querySelector('main'));
  predictCheckbox.position(10, drawHeight + 45);
  predictCheckbox.style('font-size', '15px');

  positionControls();

  describe('Stroke Territory Map. Left: a brain slice drawn like a CT scan, front at top, with the person\'s right hemisphere on the viewer\'s left. Each hemisphere is divided into three colored territories: anterior cerebral artery in front along the midline, middle cerebral artery on the outer side, and posterior cerebral artery at the back. Right: a body figure facing the viewer and a circle showing what the person sees. Choosing a blocked artery and side darkens that territory, highlights the face, arm, leg, or half of vision on the opposite side of the body, and lists the typical deficits.');
}

function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds (MicroSim standard)
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title and instruction
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Stroke Territory Map', canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  noStroke();
  text('Block an artery: see which side of the body is affected.', canvasWidth / 2, 36);

  computeGeometry();
  drawBrainPanel();
  drawBodyPanel();
  drawInfoPanel();
  drawControlLabels();
}

// ---------------- geometry ----------------
function computeGeometry() {
  const half = canvasWidth / 2;
  const panelTop = 62;
  const panelH = 300;
  // brain ellipse fits in the left half
  brain.a = min(half * 0.36, 96);             // half-width of whole slice
  brain.b = min(panelH * 0.39, brain.a * 1.25); // half-height (front-back): brains are longer than wide
  brain.cx = half / 2 + 2;
  brain.cy = panelTop + 34 + brain.b + 8;
  bodyPanel.x = half;
  bodyPanel.w = half;
}

// point on the slice outline of one hemisphere.
// s = -1 draws on the viewer's left (person's RIGHT), s = +1 viewer's right (person's LEFT)
// theta = degrees from the front (0) to the back (180)
function rimPoint(s, theta, shrink) {
  const k = shrink || 1;
  const t = radians(theta);
  return {
    x: brain.cx + s * brain.a * k * sin(t),
    y: brain.cy - brain.b * k * cos(t)
  };
}

function hemisphereSign(hemi) {
  // person's right hemisphere is on viewer's left in the CT convention
  return hemi === 'right' ? -1 : 1;
}

function drawTerritory(hemi, key, isBlocked) {
  const s = hemisphereSign(hemi);
  const T = TERRITORY[key];
  const gap = 3; // small gap so the midline fissure shows
  // apex sits slightly behind center so the ACA strip reaches back along the midline
  const apex = { x: brain.cx + s * gap, y: brain.cy + brain.b * 0.12 };
  stroke('white');
  strokeWeight(1.5);
  fill(isBlocked ? T.dark : T.light);
  beginShape();
  vertex(apex.x, apex.y);
  for (let th = T.from; th <= T.to; th += 2) {
    const p = rimPoint(s, th);
    vertex(p.x + s * (th < 2 || th > 178 ? gap : 0), p.y);
  }
  endShape(CLOSE);

  // territory label at the middle of the wedge
  // (on narrow screens, label only the viewer-right hemisphere so labels don't collide)
  if (brain.a < 85 && s < 0) return;
  const mid = (T.from + T.to) / 2;
  const lp = rimPoint(s, mid, key === 'ACA' ? 0.62 : 0.6);
  noStroke();
  fill(isBlocked ? 'white' : 'black');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(T.name, lp.x + (key === 'ACA' ? s * 4 : 0), lp.y);
}

function drawBrainPanel() {
  const half = canvasWidth / 2;
  // panel heading
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text('Brain slice (CT view)', half / 2, 62);

  // orientation labels
  fill('dimgray');
  textSize(14);
  noStroke();
  text('Front', brain.cx, brain.cy - brain.b - 20);
  text('Back', brain.cx, brain.cy + brain.b + 4);

  // the three territories in each hemisphere
  for (const hemi of ['right', 'left']) {
    for (const key of ['ACA', 'MCA', 'PCA']) {
      const blocked = (artery === key && side === hemi);
      drawTerritory(hemi, key, blocked);
    }
  }

  // outline of slice and midline fissure
  noFill();
  stroke('gray');
  strokeWeight(2);
  ellipse(brain.cx, brain.cy, brain.a * 2, brain.b * 2);
  stroke('gray');
  strokeWeight(1.5);
  line(brain.cx, brain.cy - brain.b, brain.cx, brain.cy + brain.b);

  // simple lateral ventricles outline (landmark only)
  stroke('slategray');
  strokeWeight(1.5);
  noFill();
  const vw = brain.a * 0.12, vh = brain.b * 0.42;
  ellipse(brain.cx - vw * 1.1, brain.cy - brain.b * 0.02, vw, vh);
  ellipse(brain.cx + vw * 1.1, brain.cy - brain.b * 0.02, vw, vh);

  // R and L markers, like the markers on a real CT image
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('R', brain.cx - brain.a - 14, brain.cy - brain.b * 0.7);
  text('L', brain.cx + brain.a + 14, brain.cy - brain.b * 0.7);
  textStyle(NORMAL);
}

// ---------------- body panel ----------------
function levelColor(level) {
  if (level === 2) return 'crimson';
  if (level === 1) return 'lightsalmon';
  return null;
}

function drawBodyPanel() {
  const x0 = bodyPanel.x;
  const w = bodyPanel.w;
  const bx = x0 + w * 0.42;          // body midline
  const top = 62;
  const sc = min(1, w / 300);       // scale figure on narrow screens

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text('Body (facing you)', x0 + w / 2, top);

  const hidden = predictCheckbox && predictCheckbox.checked() && artery !== 'none';

  // which body side is affected: opposite to the damaged hemisphere
  // affected body side is the person's RIGHT if the LEFT hemisphere is damaged.
  // person's right is drawn on the viewer's left (s = -1)
  const bodySide = (side === 'left') ? -1 : 1;
  const inv = (artery !== 'none' && !hidden) ? BODY[artery] : { face: 0, arm: 0, leg: 0, vision: 0 };

  // figure dimensions
  const headR = 24 * sc;
  const headY = top + 58 * sc;
  const torsoTop = headY + headR + 10 * sc;
  const torsoW = 64 * sc;
  const torsoH = 92 * sc;
  const armW = 18 * sc;
  const legW = 24 * sc;
  const legH = 100 * sc;

  // base figure
  stroke('dimgray');
  strokeWeight(1.5);
  fill('wheat');
  // arms (viewer-left arm = person's right arm)
  for (const s of [-1, 1]) {
    const ax = bx + s * (torsoW / 2 + armW / 2 + 2);
    rect(ax - armW / 2, torsoTop + 4 * sc, armW, torsoH + 8 * sc, 8);
  }
  // legs
  for (const s of [-1, 1]) {
    const lx = bx + s * (legW / 2 + 3 * sc);
    rect(lx - legW / 2, torsoTop + torsoH, legW, legH, 8);
  }
  // torso and neck
  rect(bx - torsoW / 2, torsoTop, torsoW, torsoH, 10);
  rect(bx - 7 * sc, headY + headR - 2, 14 * sc, 12 * sc);
  // head
  ellipse(bx, headY, headR * 2, headR * 2.2);

  // highlights on the affected side
  const s = bodySide;
  const cFace = levelColor(inv.face);
  const cArm = levelColor(inv.arm);
  const cLeg = levelColor(inv.leg);
  noStroke();
  if (cArm) {
    fill(cArm);
    const ax = bx + s * (torsoW / 2 + armW / 2 + 2);
    rect(ax - armW / 2, torsoTop + 4 * sc, armW, torsoH + 8 * sc, 8);
  }
  if (cLeg) {
    fill(cLeg);
    const lx = bx + s * (legW / 2 + 3 * sc);
    rect(lx - legW / 2, torsoTop + torsoH, legW, legH, 8);
  }
  if (cFace) {
    fill(cFace);
    // half of the face on the affected side
    if (s < 0) arc(bx, headY, headR * 2, headR * 2.2, HALF_PI, HALF_PI * 3, PIE);
    else arc(bx, headY, headR * 2, headR * 2.2, -HALF_PI, HALF_PI, PIE);
  }

  // face features (drawn on top); mouth droops on the weak side
  fill('black');
  noStroke();
  circle(bx - headR * 0.38, headY - headR * 0.2, 4 * sc + 2);
  circle(bx + headR * 0.38, headY - headR * 0.2, 4 * sc + 2);
  stroke('black');
  strokeWeight(2);
  noFill();
  const droop = (inv.face === 2) ? 6 * sc : 0;
  const mL = { x: bx - headR * 0.4, y: headY + headR * 0.45 + (s < 0 ? droop : 0) };
  const mR = { x: bx + headR * 0.4, y: headY + headR * 0.45 + (s > 0 ? droop : 0) };
  line(mL.x, mL.y, mR.x, mR.y);

  // midline (dashed)
  stroke('gray');
  strokeWeight(1);
  for (let yy = headY - headR * 1.1; yy < torsoTop + torsoH + legH; yy += 8) {
    line(bx, yy, bx, yy + 4);
  }

  // R and L markers for the person's own sides
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('R', bx - torsoW / 2 - armW - 16, headY);
  text('L', bx + torsoW / 2 + armW + 16, headY);
  textStyle(NORMAL);

  // vision circle: what the person sees (their left on the left, as they see it)
  const vx = x0 + w - max(30, 40 * sc);
  const vy = top + 64;
  const vr = 24;
  noStroke();
  fill('black');
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text('Vision', vx, vy - vr - 16);
  textSize(11);
  fill('dimgray');
  text('(their view)', vx, vy - vr - 3);
  stroke('dimgray');
  strokeWeight(1.5);
  fill('white');
  circle(vx, vy, vr * 2);
  const cVis = levelColor(inv.vision);
  if (cVis) {
    noStroke();
    fill(inv.vision === 2 ? 'dimgray' : 'silver');
    // lost half of vision is OPPOSITE the damaged hemisphere.
    // In this circle the person's LEFT field is drawn on the left.
    if (side === 'right') arc(vx, vy, vr * 2, vr * 2, HALF_PI, HALF_PI * 3, PIE);
    else arc(vx, vy, vr * 2, vr * 2, -HALF_PI, HALF_PI, PIE);
  }
  stroke('dimgray');
  strokeWeight(1);
  line(vx, vy - vr, vx, vy + vr);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('L   R', vx, vy + vr + 3);

  // legend
  const legY = vy + vr + 30;
  textAlign(LEFT, CENTER);
  textSize(14);
  const lgx = vx - 26;
  fill('crimson'); noStroke(); rect(lgx - 4, legY - 7, 14, 14);
  fill('black'); noStroke(); text('main', lgx + 14, legY);
  fill('lightsalmon'); noStroke(); rect(lgx - 4, legY + 13, 14, 14);
  fill('black'); noStroke(); text('milder', lgx + 14, legY + 20);

  if (hidden) {
    stroke('navy');
    strokeWeight(1);
    fill('white');
    rectMode(CENTER);
    rect(bx, torsoTop + torsoH * 0.5, 130, 66, 8);
    rectMode(CORNER);
    noStroke();
    fill('navy');
    textAlign(CENTER, CENTER);
    textSize(15);
    text('Predict first!\nUncheck the box\nto reveal.', bx, torsoTop + torsoH * 0.5);
  }
}

// ---------------- info panel ----------------
function drawInfoPanel() {
  const px = 10;
  const py = 372;
  const pw = canvasWidth - 20;
  const ph = drawHeight - py - 8;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 10);

  const key = (artery === 'none') ? 'none' : artery + '-' + side;
  const hidden = predictCheckbox && predictCheckbox.checked() && artery !== 'none';
  const info = INFO[key];

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  text(info.title, px + 12, py + 8, pw - 24, 24);
  textStyle(NORMAL);
  textSize(14);

  let y = py + 34;
  if (hidden) {
    noStroke();
    fill('navy');
    const rows = wrapText('Prediction mode: which side of the body, and which parts (face, arm, leg, or vision), do you expect? Uncheck the box to check your answer.', pw - 24);
    for (const r of rows) {
      noStroke();
      text(r, px + 12, y);
      y += 17;
    }
  } else {
    // wrap each bullet to the panel width and stack the rows
    for (const ln of info.lines) {
      const rows = wrapText('\u2022 ' + ln, pw - 24);
      for (const r of rows) {
        noStroke();
        fill('black');
        text(r, px + 12, y);
        y += 17;
      }
      y += 4;
    }
  }
  // standing caveat
  noStroke();
  fill('firebrick');
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('Typical patterns only; real strokes vary.', px + 12, py + ph - 6);
}

// split a string into rows that fit maxW pixels at the current text size
function wrapText(str, maxW) {
  const words = str.split(' ');
  const rows = [];
  let row = '';
  for (const w of words) {
    const test = row ? row + ' ' + w : w;
    if (textWidth(test) > maxW && row) {
      rows.push(row);
      row = '  ' + w;   // indent continuation rows under the bullet
    } else {
      row = test;
    }
  }
  if (row) rows.push(row);
  return rows;
}

// ---------------- controls ----------------
function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(15);
  text('Artery:', 10, drawHeight + 20);
  const sideLabelX = sideSelect ? sideSelect.x - 90 : 260;
  noStroke();
  text('Hemisphere:', sideLabelX, drawHeight + 20);
}

function positionControls() {
  if (!arterySelect) return;
  arterySelect.position(70, drawHeight + 8);
  const aw = arterySelect.elt.offsetWidth || 140;
  const sx = 70 + aw + 102;   // room for the 'Hemisphere:' label
  sideSelect.position(sx, drawHeight + 8);
  predictCheckbox.position(10, drawHeight + 45);
}

function mousePressed() {
  // click a territory in the brain slice to select it
  const dx = mouseX - brain.cx;
  const dy = mouseY - brain.cy;
  if (brain.a <= 0 || brain.b <= 0) return;
  const inside = (dx * dx) / (brain.a * brain.a) + (dy * dy) / (brain.b * brain.b) <= 1;
  if (!inside || abs(dx) < 3) return;
  const hemi = dx < 0 ? 'right' : 'left';     // viewer-left = person's right
  // angle from the front, measured on the scaled ellipse around the wedge apex
  const ax = abs(dx) / brain.a;
  const ay = (mouseY - (brain.cy + brain.b * 0.12)) / brain.b;
  const theta = degrees(atan2(ax, -ay));      // 0 = front, 180 = back
  // boundary directions seen from the same apex (so clicks match the drawn wedges)
  const edge = (deg) => degrees(atan2(sin(radians(deg)), cos(radians(deg)) + 0.12));
  let key = 'MCA';
  if (theta < edge(TERRITORY.ACA.to)) key = 'ACA';
  else if (theta >= edge(TERRITORY.PCA.from)) key = 'PCA';
  artery = key;
  side = hemi;
  arterySelect.selected(key);
  sideSelect.selected(hemi);
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
