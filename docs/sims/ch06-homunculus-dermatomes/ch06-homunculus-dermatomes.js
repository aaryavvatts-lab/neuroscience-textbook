// Homunculus and Dermatome Map MicroSim
// CANVAS_HEIGHT = 750 (drawHeight 700 + controlHeight 50)
// Use iframe height 752px to embed this MicroSim.
// Learning objective: given a touched body region, locate where it is represented
// on the opposite primary somatosensory cortex (postcentral gyrus) and name the
// spinal level (dermatome) or cranial nerve that carries it.
// Not animated, so there is no Start/Pause button.
// Dermatome levels follow the ISNCSCI key sensory points (see Wikipedia "Dermatome
// (anatomy)", Important dermatomes list). Cortex segment sizes are illustrative,
// loosely following the Penfield sensory homunculus. They are NOT measured areas.

// ---------- canvas layout ----------
let containerWidth;
let canvasWidth = 800;
let drawHeight = 700;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

// ---------- controls ----------
let regionSelect;
let sideSelect;
let quizButton;
let labelsCheckbox;

// ---------- state ----------
let selectedRegion = 'thumb';
let selectedSide = 'right'; // the PERSON's right or left side
let hoverRegion = null;
let quizActive = false;
let quizTarget = null; // {region, side}
let quizAttempts = 0;
let quizMessage = '';
let quizMessageColor = 'black';
let score = 0;
let asked = 0;
let lastClickedSegment = null;

// ---------- cortex segments (medial to lateral) ----------
// weight = illustrative share of the postcentral gyrus strip
const segments = [
  { name: 'Toes', w: 3 },
  { name: 'Foot', w: 3.5 },
  { name: 'Leg', w: 4 },
  { name: 'Hip', w: 2.5 },
  { name: 'Trunk', w: 3.5 },
  { name: 'Neck & head', w: 3 },
  { name: 'Shoulder', w: 2.5 },
  { name: 'Arm', w: 3.5 },
  { name: 'Wrist', w: 2.5 },
  { name: 'Hand (palm)', w: 4.5 },
  { name: 'Little finger', w: 3 },
  { name: 'Ring finger', w: 3 },
  { name: 'Middle finger', w: 3 },
  { name: 'Index finger', w: 3 },
  { name: 'Thumb', w: 4 },
  { name: 'Eye & nose', w: 3 },
  { name: 'Face', w: 4 },
  { name: 'Lips', w: 7 },
  { name: 'Teeth & jaw', w: 3.5 },
  { name: 'Tongue', w: 4.5 },
  { name: 'Throat', w: 3 }
];

// ---------- body regions ----------
// x, y are body coordinates for the person's RIGHT side (viewer's left = negative x).
// The LEFT side uses -x. Midline regions (lips, belly button) have x = 0.
const regions = {
  lips: {
    label: 'Lips', x: 0, y: 50, cortex: ['Lips'],
    level: 'No spinal dermatome. Trigeminal nerve (cranial nerve V)',
    spot: 'Upper lip: V2 (maxillary) branch. Lower lip: V3 (mandibular) branch.',
    note: 'The lips get one of the biggest areas of the map.'
  },
  shoulder: {
    label: 'Top of shoulder', x: -40, y: 82, cortex: ['Shoulder'],
    level: 'C4',
    spot: 'Key test spot: over the acromioclavicular joint at the top of the shoulder.',
    note: 'A broad area of skin, but only a modest strip of cortex.'
  },
  thumb: {
    label: 'Thumb', x: -88, y: 236, cortex: ['Thumb'],
    level: 'C6',
    spot: 'Key test spot: back of the thumb near its base (proximal phalanx).',
    note: 'The thumb area is large because the skin is packed with receptors.'
  },
  middle: {
    label: 'Middle finger', x: -76, y: 252, cortex: ['Middle finger'],
    level: 'C7',
    spot: 'Key test spot: back of the middle finger near its base.',
    note: 'Each finger has its own patch of cortex, in order.'
  },
  little: {
    label: 'Little finger', x: -64, y: 246, cortex: ['Little finger'],
    level: 'C8',
    spot: 'Key test spot: back of the little finger near its base.',
    note: 'Thumb C6, middle C7, little C8: the levels step across the hand.'
  },
  nipple: {
    label: 'Chest at nipple line', x: -22, y: 112, cortex: ['Trunk'],
    level: 'T4',
    spot: 'Key test spot: 4th rib space at the nipple line.',
    note: 'The whole trunk shares a fairly small strip of cortex.'
  },
  umbilicus: {
    label: 'Belly button area', x: 0, y: 168, cortex: ['Trunk'],
    level: 'T10',
    spot: 'Key test spot: level of the umbilicus (belly button).',
    note: 'T10 at the belly button is a classic landmark doctors memorize.'
  },
  knee: {
    label: 'Inner knee', x: -12, y: 308, cortex: ['Leg'],
    level: 'L3',
    spot: 'Key test spot: inner knee (medial femoral condyle). Charts differ: the front of the knee sits near the L3/L4 border.',
    note: 'The leg area sits near the top of the brain, close to the midline.'
  },
  ankle: {
    label: 'Inner ankle', x: -16, y: 392, cortex: ['Foot', 'Leg'],
    level: 'L4',
    spot: 'Key test spot: over the inner ankle bone (medial malleolus).',
    note: 'Leg and foot areas wrap onto the inner (medial) wall of the brain.'
  },
  footTop: {
    label: 'Top of foot', x: -24, y: 412, cortex: ['Foot'],
    level: 'L5',
    spot: 'Key test spot: top of the foot near the third toe knuckle.',
    note: 'The foot area is on the inner (medial) wall of the hemisphere.'
  },
  heel: {
    label: 'Outer heel (little-toe side)', x: -40, y: 420, cortex: ['Foot'],
    level: 'S1',
    spot: 'Key test spot: outer side of the heel bone (lateral calcaneus).',
    note: 'Spinal level S1 (not the S1 cortex) covers the outer edge of the foot.'
  }
};
const regionOrder = ['lips', 'shoulder', 'nipple', 'umbilicus', 'thumb', 'middle', 'little', 'knee', 'ankle', 'footTop', 'heel'];

// geometry caches (recomputed every frame)
let bodyScale = 1, bodyCx = 150, bodyTop = 80;
let cortexPath = []; // array of {x, y, nx, ny, s}
let segmentRanges = []; // {start, end} in path length
let readoutTop;
let cortexInfo = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  regionSelect = createSelect();
  for (const key of regionOrder) regionSelect.option(regions[key].label, key);
  regionSelect.selected(selectedRegion);
  regionSelect.position(10, drawHeight + 12);
  regionSelect.changed(() => { selectedRegion = regionSelect.value(); quizActive = false; });

  sideSelect = createSelect();
  sideSelect.option("Person's right side", 'right');
  sideSelect.option("Person's left side", 'left');
  sideSelect.selected(selectedSide);
  sideSelect.position(240, drawHeight + 12);
  sideSelect.changed(() => { selectedSide = sideSelect.value(); quizActive = false; });

  quizButton = createButton('Quiz me');
  quizButton.position(430, drawHeight + 12);
  quizButton.mousePressed(startQuiz);

  labelsCheckbox = createCheckbox('Show labels', true);
  labelsCheckbox.position(520, drawHeight + 14);

  describe('Two-panel interactive map. Left: a front-view body outline with clickable dots on body regions such as the thumb, lips, nipple line, belly button, knee and foot. Right: a cross-section of one brain hemisphere showing the primary somatosensory cortex as a strip divided into body-part areas of different sizes, like the sensory homunculus. Clicking a region highlights its area on the opposite hemisphere and shows its dermatome level. A quiz mode asks the learner to click the correct cortex area.');
}

function draw() {
  updateCanvasSize();
  if (width !== containerWidth) resizeCanvas(containerWidth, containerHeight);

  // drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title and instruction
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Homunculus and Dermatome Map', canvasWidth / 2, 8);
  textSize(15);
  fill('dimgray');
  noStroke();
  const instr = quizActive
    ? 'Quiz: click the cortex area where the highlighted body spot is represented.'
    : 'Click a dot on the body. See where it lands on the opposite cortex and its spinal level.';
  const instrShort = quizActive ? 'Quiz: click the matching cortex area.' : 'Click a dot on the body.';
  text(canvasWidth < 640 ? instrShort : instr, canvasWidth / 2, 38);

  readoutTop = drawHeight - 162;
  const bodyPanelW = canvasWidth < 560 ? canvasWidth * 0.40 : canvasWidth * 0.34;

  computeBodyGeometry(bodyPanelW);
  hoverRegion = findRegionAt(mouseX, mouseY);
  drawBody();

  computeCortexGeometry(bodyPanelW);
  drawCortex();

  drawReadout();

  // control labels
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(RIGHT, CENTER);
  if (canvasWidth >= 640) text('Score: ' + score + ' / ' + asked, canvasWidth - margin, drawHeight + 25);

  cursor(hoverRegion ? HAND : ARROW);
}

// ---------------- body ----------------
function computeBodyGeometry(panelW) {
  const availH = readoutTop - 75;
  bodyScale = min((panelW - 20) / 210, availH / 440);
  bodyCx = panelW / 2;
  bodyTop = 70 + (availH - 440 * bodyScale) / 2;
}

function bx(x) { return bodyCx + x * bodyScale; }
function by(y) { return bodyTop + y * bodyScale; }

function drawBody() {
  const s = bodyScale;
  // panel label
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  text('Front view', bodyCx, 58 + 0);

  stroke('gray');
  strokeWeight(1.5);
  fill('bisque');
  // legs
  for (const sgn of [-1, 1]) {
    beginShape();
    vertex(bx(sgn * 6), by(206));
    vertex(bx(sgn * 36), by(206));
    vertex(bx(sgn * 32), by(300));
    vertex(bx(sgn * 28), by(398));
    vertex(bx(sgn * 14), by(398));
    vertex(bx(sgn * 10), by(300));
    endShape(CLOSE);
    // foot
    ellipse(bx(sgn * 26), by(414), 34 * s, 18 * s);
  }
  // arms
  for (const sgn of [-1, 1]) {
    beginShape();
    vertex(bx(sgn * 44), by(78));
    vertex(bx(sgn * 58), by(84));
    vertex(bx(sgn * 82), by(218));
    vertex(bx(sgn * 66), by(220));
    vertex(bx(sgn * 46), by(120));
    endShape(CLOSE);
    // hand: palm facing forward, thumb on the outer side
    ellipse(bx(sgn * 75), by(232), 24 * s, 28 * s);
    // fingers (little finger nearest the body, thumb farthest out)
    strokeWeight(5 * s);
    stroke('peru');
    line(bx(sgn * 66), by(240), bx(sgn * 64), by(252)); // little
    line(bx(sgn * 71), by(243), bx(sgn * 70), by(258)); // ring
    line(bx(sgn * 76), by(244), bx(sgn * 76), by(260)); // middle
    line(bx(sgn * 81), by(242), bx(sgn * 82), by(256)); // index
    line(bx(sgn * 85), by(228), bx(sgn * 91), by(240)); // thumb
    stroke('gray');
    strokeWeight(1.5);
  }
  // torso
  beginShape();
  vertex(bx(-46), by(76));
  vertex(bx(46), by(76));
  vertex(bx(38), by(210));
  vertex(bx(-38), by(210));
  endShape(CLOSE);
  // neck and head
  rect(bx(-9), by(60), 18 * s, 18 * s);
  ellipse(bx(0), by(32), 52 * s, 62 * s);
  // simple face marks
  noStroke();
  fill('gray');
  circle(bx(-9), by(28), 4 * s);
  circle(bx(9), by(28), 4 * s);
  stroke('indianred');
  strokeWeight(2);
  line(bx(-7), by(50), bx(7), by(50));
  // nipples and belly button marks
  noStroke();
  fill('rosybrown');
  circle(bx(-22), by(112), 4 * s);
  circle(bx(22), by(112), 4 * s);
  circle(bx(0), by(168), 4 * s);

  // side labels (person's right is the viewer's left)
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, TOP);
  text("Person's\nRIGHT", bx(-82), by(120));
  text("Person's\nLEFT", bx(82), by(120));

  // hotspots
  const quizKey = quizActive ? quizTarget.region + '|' + quizTarget.side : null;
  for (const key of regionOrder) {
    for (const side of ['right', 'left']) {
      const p = hotspotPos(key, side);
      const isSel = !quizActive && key === selectedRegion && side === selectedSide;
      const isQuiz = quizActive && quizKey === key + '|' + side;
      const isHover = hoverRegion && hoverRegion.key === key && hoverRegion.side === side;
      if (isSel || isQuiz) {
        stroke('black');
        strokeWeight(2);
        fill(isQuiz ? 'gold' : 'orangered');
        circle(p.x, p.y, 18);
      } else {
        stroke('white');
        strokeWeight(1.5);
        fill(isHover ? 'orange' : 'steelblue');
        circle(p.x, p.y, isHover ? 14 : 11);
      }
    }
  }
}

function hotspotPos(key, side) {
  const r = regions[key];
  let x = r.x;
  if (x === 0) x = side === 'right' ? -5 : 5; // midline spots: split by side
  else if (side === 'left') x = -x;
  return { x: bx(x), y: by(r.y) };
}

function findRegionAt(mx, my) {
  if (my > readoutTop) return null;
  let best = null;
  let bestD = 11;
  for (const key of regionOrder) {
    for (const side of ['right', 'left']) {
      const p = hotspotPos(key, side);
      const d = dist(mx, my, p.x, p.y);
      if (d < bestD) { bestD = d; best = { key, side }; }
    }
  }
  return best;
}

// ---------------- cortex ----------------
function activeHemisphere() {
  // touch from the person's right side goes to the LEFT hemisphere, and vice versa
  const side = quizActive ? quizTarget.side : selectedSide;
  return side === 'right' ? 'left' : 'right';
}

function computeCortexGeometry(bodyPanelW) {
  const x0 = bodyPanelW + 5;
  const pw = canvasWidth - x0 - 5;
  const top = 92;
  const ph = readoutTop - top - 8;
  const medialSpace = labelsOn() ? min(110, pw * 0.26) : 30;
  const lateralSpace = labelsOn() ? min(115, pw * 0.27) : 30;
  let r = min(pw - medialSpace - lateralSpace, (ph - (labelsOn() ? 88 : 20) - 24) / 1.45);
  r = max(r, 60);
  const hemi = activeHemisphere();
  // In a front (coronal) view the person's LEFT hemisphere is on the viewer's right.
  // Left hemisphere: midline on its left edge, bulging right. Right hemisphere: mirrored.
  const dir = hemi === 'left' ? 1 : -1;
  const midX = hemi === 'left' ? x0 + medialSpace : x0 + pw - medialSpace;
  const cy = top + (labelsOn() ? 88 : 20) + r;

  // build path: medial wall (from 0.32r below the top, up to the top), then the
  // outer arc from the top (-90 deg) to the lateral sulcus (+15 deg)
  cortexPath = [];
  const pts = [];
  const nMed = 12;
  for (let i = 0; i <= nMed; i++) {
    const yy = cy - r + 0.32 * r * (1 - i / nMed);
    pts.push({ x: midX, y: yy, nx: -dir, ny: 0 });
  }
  const nArc = 120;
  for (let i = 1; i <= nArc; i++) {
    const th = radians(-90 + (105 * i) / nArc);
    pts.push({ x: midX + dir * r * cos(th), y: cy + r * sin(th), nx: dir * cos(th), ny: sin(th) });
  }
  let sAcc = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) sAcc += dist(pts[i].x, pts[i].y, pts[i - 1].x, pts[i - 1].y);
    pts[i].s = sAcc;
    cortexPath.push(pts[i]);
  }
  const total = sAcc;
  const wsum = segments.reduce((a, b) => a + b.w, 0);
  segmentRanges = [];
  let acc = 0;
  for (const seg of segments) {
    const start = (acc / wsum) * total;
    acc += seg.w;
    segmentRanges.push({ start, end: (acc / wsum) * total });
  }
  cortexInfo = { midX, cy, r, dir, hemi, top, x0, pw };
}

function labelsOn() {
  if (canvasWidth < 640) return false;
  return labelsCheckbox ? labelsCheckbox.checked() : true;
}

function pointAt(s) {
  for (let i = 1; i < cortexPath.length; i++) {
    if (cortexPath[i].s >= s) {
      const a = cortexPath[i - 1], b = cortexPath[i];
      const t = (s - a.s) / max(0.0001, b.s - a.s);
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), nx: lerp(a.nx, b.nx, t), ny: lerp(a.ny, b.ny, t) };
    }
  }
  return cortexPath[cortexPath.length - 1];
}

function drawCortex() {
  const { midX, cy, r, dir, hemi } = cortexInfo;
  // hemisphere outline (coronal slice)
  stroke('gray');
  strokeWeight(1.5);
  fill('lavenderblush');
  beginShape();
  vertex(midX, cy + 0.42 * r);
  vertex(midX, cy - r);
  for (let a = -90; a <= 90; a += 3) {
    const th = radians(a);
    // a notch for the lateral sulcus near +18 deg
    let rr = r;
    if (a > 14 && a < 24) rr = r * 0.8;
    vertex(midX + dir * rr * cos(th), cy + r * sin(th) * (a > 0 ? 0.42 : 1));
  }
  endShape(CLOSE);
  // white matter
  noStroke();
  fill('whitesmoke');
  ellipse(midX + dir * r * 0.45, cy - 0.2 * r, r * 0.95, r * 0.95);
  // midline label
  stroke('darkgray');
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(midX, cy - r - 10, midX, cy + 0.45 * r);
  drawingContext.setLineDash([]);

  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(CENTER, TOP);
  text('midline', midX, cy + 0.45 * r + 3);
  textAlign(CENTER, CENTER);
  fill('black');
  textSize(15);
  const hemiTitle = (hemi === 'left' ? 'LEFT' : 'RIGHT') + (canvasWidth < 640 ? ' hemisphere (S1)' : ' hemisphere, postcentral gyrus (S1)');
  text(hemiTitle, cortexInfo.x0 + cortexInfo.pw / 2, 74);
  fill('dimgray');
  textSize(14);
  text('(front view slice)', midX + dir * r * 0.45, cy - 0.2 * r);

  // target segment(s)
  let highlight = [];
  if (!quizActive) highlight = regions[selectedRegion].cortex.slice(0, 1);
  if (quizActive && quizMessage.startsWith('Correct')) highlight = regions[quizTarget.region].cortex.slice(0, 1);

  // strip segments
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const rg = segmentRanges[i];
    const isHi = highlight.includes(seg.name);
    const isWrong = quizActive && lastClickedSegment === seg.name && !quizMessage.startsWith('Correct');
    strokeWeight(16);
    strokeCap(SQUARE);
    noFill();
    stroke(isHi ? 'orangered' : isWrong ? 'silver' : (i % 2 === 0 ? 'cornflowerblue' : 'lightskyblue'));
    beginShape();
    for (let s = rg.start; s <= rg.end; s += 2) {
      const p = pointAt(s);
      vertex(p.x, p.y);
    }
    const pe = pointAt(rg.end);
    vertex(pe.x, pe.y);
    endShape();
    // separator tick
    strokeWeight(1);
    stroke('white');
    const ps = pointAt(rg.start);
    line(ps.x - ps.nx * 8, ps.y - ps.ny * 8, ps.x + ps.nx * 8, ps.y + ps.ny * 8);

    // labels
    if (labelsOn() || isHi) {
      const pm = pointAt((rg.start + rg.end) / 2);
      const lx = pm.x + pm.nx * 12;
      const ly = pm.y + pm.ny * 12;
      push();
      translate(lx, ly);
      let ang = atan2(pm.ny, pm.nx);
      let flip = false;
      if (ang > HALF_PI || ang < -HALF_PI) { ang += PI; flip = true; }
      rotate(ang);
      noStroke();
      fill(isHi ? 'orangered' : 'black');
      textSize(isHi ? 15 : 14);
      textStyle(isHi ? BOLD : NORMAL);
      textAlign(flip ? RIGHT : LEFT, CENTER);
      text(seg.name, 0, 0);
      textStyle(NORMAL);
      pop();
    }
  }
  strokeCap(ROUND);
}

function findSegmentAt(mx, my) {
  if (!cortexPath.length) return null;
  let bestS = null, bestD = 18;
  for (const p of cortexPath) {
    const d = dist(mx, my, p.x, p.y);
    if (d < bestD) { bestD = d; bestS = p.s; }
  }
  // also allow clicking on a label (up to ~100 px outward along the normal)
  if (bestS === null) {
    for (let s = 0; s <= cortexPath[cortexPath.length - 1].s; s += 2) {
      const p = pointAt(s);
      const vx = mx - p.x, vy = my - p.y;
      const along = vx * p.nx + vy * p.ny;
      const across = abs(-vx * p.ny + vy * p.nx);
      if (along > 8 && along < 100 && across < 7) { bestS = s; break; }
    }
  }
  if (bestS === null) return null;
  for (let i = 0; i < segmentRanges.length; i++) {
    if (bestS >= segmentRanges[i].start && bestS <= segmentRanges[i].end) return segments[i].name;
  }
  return null;
}

// ---------------- readout ----------------
function drawReadout() {
  const x = 10, y = readoutTop, w = canvasWidth - 20, h = 154;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const narrow = canvasWidth < 640;
  const fs = narrow ? 14 : 15;
  const lh = fs + 4;
  let yy = y + 8;
  // writes wrapped text line by line and moves yy down
  function para(str, size, col, bold) {
    textSize(size);
    textStyle(bold ? BOLD : NORMAL);
    fill(col);
    noStroke();
    for (const ln of wrapLines(str, w - 20)) {
      text(ln, x + 10, yy);
      yy += size + 4;
    }
    textStyle(NORMAL);
  }

  if (quizActive) {
    const r = regions[quizTarget.region];
    para('Quiz ' + asked + " (score " + score + "): person's " + quizTarget.side.toUpperCase() + ' side, ' + r.label.toLowerCase() + ' (gold dot). Which cortex area receives it?', fs, 'black', true);
    yy += 4;
    para(quizMessage || 'Click a segment of the blue strip on the right.', fs, quizMessageColor, false);
    yy += 4;
    para('Hint: touch is mapped on the OPPOSITE hemisphere. The strip runs from the inner (midline) wall to the side of the brain.', 14, 'dimgray', false);
    return;
  }

  const r = regions[selectedRegion];
  const hemi = selectedSide === 'right' ? 'LEFT' : 'RIGHT';
  para('Selected: ' + r.label + ", person's " + selectedSide.toUpperCase() + ' side', fs, 'black', true);
  para('Cortex: ' + r.cortex[0].toLowerCase() + ' area of the ' + hemi + ' postcentral gyrus. ' + r.note, fs, 'black', false);
  const lvlText = r.level.startsWith('No') ? 'Nerve: ' + r.level : 'Spinal level (dermatome): ' + r.level;
  para(lvlText, fs, 'darkred', true);
  para(r.spot, fs, 'black', false);
  yy = max(yy, y + h - 22);
  para(narrow ? 'Maps vary between people.' : 'Levels: ISNCSCI key points. Maps vary between sources and people. Cortex sizes are illustrative.', 14, 'dimgray', false);
}

// simple word wrap using the current text size
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const wd of words) {
    const test = cur ? cur + ' ' + wd : wd;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = wd;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------- interaction ----------------
function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0) return;
  if (quizActive) {
    const seg = findSegmentAt(mouseX, mouseY);
    if (!seg) return;
    if (quizMessage.startsWith('Correct')) return;
    lastClickedSegment = seg;
    const r = regions[quizTarget.region];
    const hemi = quizTarget.side === 'right' ? 'LEFT' : 'RIGHT';
    if (r.cortex.includes(seg)) {
      if (quizAttempts === 0) score++;
      quizMessage = 'Correct! The ' + r.label.toLowerCase() + ' maps to the ' + r.cortex[0].toLowerCase() + ' area of the ' + hemi + ' hemisphere. ' + (r.level.startsWith('No') ? 'Carried by the trigeminal nerve, not a spinal dermatome.' : 'Spinal level: ' + r.level + '.') + ' Press "Quiz me" for another.';
      quizMessageColor = 'darkgreen';
    } else {
      quizAttempts++;
      if (quizAttempts >= 2) {
        quizMessage = 'Not quite. You clicked ' + seg + '. The answer is ' + r.cortex[0] + ' on the ' + hemi + ' hemisphere (now shown in red). Press "Quiz me" to try another.';
        quizMessageColor = 'firebrick';
        lastClickedSegment = null;
        // reveal by switching to explore view of the same item
        selectedRegion = quizTarget.region;
        selectedSide = quizTarget.side;
        regionSelect.selected(selectedRegion);
        sideSelect.selected(selectedSide);
        quizActive = false;
      } else {
        quizMessage = 'Not quite: you clicked ' + seg + '. Think about where this body part sits on the homunculus, then try once more.';
        quizMessageColor = 'firebrick';
      }
    }
    return;
  }
  const hit = findRegionAt(mouseX, mouseY);
  if (hit) {
    selectedRegion = hit.key;
    selectedSide = hit.side;
    regionSelect.selected(selectedRegion);
    sideSelect.selected(selectedSide);
  }
}

function startQuiz() {
  const keys = regionOrder;
  let k, sd;
  do {
    k = keys[floor(random(keys.length))];
    sd = random() < 0.5 ? 'right' : 'left';
  } while (quizTarget && quizTarget.region === k && quizTarget.side === sd);
  quizTarget = { region: k, side: sd };
  quizActive = true;
  quizAttempts = 0;
  quizMessage = '';
  quizMessageColor = 'black';
  lastClickedSegment = null;
  asked++;
}

// ---------------- responsive ----------------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
  redraw();
}

function positionControls() {
  if (!regionSelect) return;
  if (canvasWidth < 640) {
    regionSelect.position(10, drawHeight + 12);
    regionSelect.size(140);
    sideSelect.position(158, drawHeight + 12);
    sideSelect.size(140);
    quizButton.position(306, drawHeight + 12);
    labelsCheckbox.hide();
  } else {
    regionSelect.position(10, drawHeight + 12);
    regionSelect.size(220);
    sideSelect.position(240, drawHeight + 12);
    sideSelect.size(170);
    quizButton.position(430, drawHeight + 12);
    labelsCheckbox.show();
    labelsCheckbox.position(520, drawHeight + 14);
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  if (regionSelect) positionControls();
}
