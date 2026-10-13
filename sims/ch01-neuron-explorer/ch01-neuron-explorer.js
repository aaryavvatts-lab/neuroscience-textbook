// Neuron Explorer MicroSim (Chapter 1: Neurons, Glia, and the Nervous System)
// CANVAS_HEIGHT = 635  (drawHeight 520 + controlHeight 115); iframe height = 637
// Learning objective (Understand / explain): explain the job of each part of a
// neuron and two nearby glial cells, and explain why losing myelin (as in
// multiple sclerosis) slows a signal or stops it.
//
// SIMPLIFIED MODEL (illustrative, not measured data):
// - In healthy myelinated axon, the signal is renewed at every node of Ranvier
//   and crosses each myelinated segment quickly (8 frames per segment).
// - In a demyelinated segment, current leaks out, so the signal crawls
//   (40 frames per segment) and fades: strength = start * 0.55^(segments crossed).
// - If the faded signal reaches the next healthy node with strength >= 25%,
//   the node renews it to 100%. If strength drops below 25% first, it is blocked.
//   So 1-2 damaged segments = slower but arrives; 3-4 damaged segments = blocked.
// MicroSim template version 2026.03

// ---------- layout globals (standard MicroSim names) ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 520;
let controlHeight = 115; // 3 rows of controls: (3 x 35) + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// ---------- controls ----------
let sendButton, pauseButton, msCheckbox, damageSlider, partSelect;

// ---------- simulation state ----------
let isRunning = false;     // MicroSims start paused; nothing moves until Send signal
let mouseOverMain = false; // animation only advances while the pointer is over the sim
const NUM_SEGMENTS = 6;    // myelinated segments (internodes) along the axon
const FIRST_DAMAGED = 2;   // MS damage starts at segment index 2 (under the oligodendrocyte)
const FAST_FRAMES = 8;     // frames to cross one healthy myelinated segment
const SLOW_FRAMES = 40;    // frames to cross one demyelinated segment
const FADE_PER_SEGMENT = 0.55;
const RENEW_THRESHOLD = 0.25;

let signal = null;   // {x, strength, stretchStartX, stretchStartStrength, frames, inDamage}
let flashes = [];    // node flashes when the signal is renewed
let statusText = 'Press "Send signal" to fire the neuron.';
let selectedPart = null;
let hoveredPart = null;
let labelBoxes = []; // hotspots created by drawn labels

// Geometry (recomputed every frame from canvasWidth)
let G = {};

// ---------- the content shown in the info panel ----------
const PARTS = {
  dendrites: {
    name: 'Dendrites',
    job: 'Branch-like receivers. They collect incoming messages from other neurons and pass them toward the cell body. One neuron can have many dendrites.'
  },
  soma: {
    name: 'Cell body (soma)',
    job: 'The neuron\'s control center. It holds the nucleus (the cell\'s DNA), makes most of the proteins the neuron needs, and adds up the messages arriving from the dendrites.'
  },
  hillock: {
    name: 'Axon hillock',
    job: 'The cone where the axon leaves the cell body. Here and just past it (the start of the axon), the neuron "decides": if the incoming messages add up to enough, it fires a signal down the axon.'
  },
  axon: {
    name: 'Axon',
    job: 'A long, thin cable that carries the signal away from the cell body. A neuron usually has one axon. Some human axons are about a meter long, reaching from the spinal cord to the toes.'
  },
  myelin: {
    name: 'Myelin sheath',
    job: 'A fatty, insulating wrap around the axon, made by glial cells. Like the plastic coating on a wire, it keeps the signal from leaking out, so the signal travels much faster.'
  },
  node: {
    name: 'Node of Ranvier',
    job: 'A tiny bare gap between myelin segments. Nodes are packed with ion channels, so the signal is renewed at full strength at each node and seems to jump from node to node.'
  },
  terminal: {
    name: 'Axon terminals',
    job: 'The swollen tips of the axon\'s branches. Here the neuron passes its message to the next cell, usually by releasing chemical messengers (you will meet them in Chapter 3).'
  },
  oligodendrocyte: {
    name: 'Oligodendrocyte (glial cell)',
    job: 'A glial cell of the brain and spinal cord (CNS). Its arms wrap myelin around segments of several different axons. In multiple sclerosis, the immune system attacks this myelin.'
  },
  astrocyte: {
    name: 'Astrocyte (glial cell)',
    job: 'A star-shaped glial cell. It supports and feeds neurons, cleans up chemicals around synapses, and its "end-feet" wrap blood vessels, helping maintain the blood-brain barrier.'
  },
  vessel: {
    name: 'Blood vessel (capillary)',
    job: 'A tiny blood vessel. Its tightly sealed wall, wrapped by astrocyte end-feet, forms the blood-brain barrier: it lets in needed molecules like glucose and keeps many others out.'
  }
};
const PART_ORDER = ['dendrites', 'soma', 'hillock', 'axon', 'myelin', 'node', 'terminal', 'oligodendrocyte', 'astrocyte', 'vessel'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);
  computeGeometry();

  // pause animation progress while the pointer is outside the sim (controls live inside <main>)
  mainElement.addEventListener('mouseenter', () => mouseOverMain = true);
  mainElement.addEventListener('mouseleave', () => mouseOverMain = false);
  mainElement.addEventListener('touchstart', () => mouseOverMain = true, {passive: true});

  // Row 1: Send signal, Pause/Resume, Remove myelin checkbox
  sendButton = createButton('Send signal');
  sendButton.parent(mainElement);
  sendButton.position(10, drawHeight + 5);
  sendButton.mousePressed(sendSignal);

  pauseButton = createButton('Pause');
  pauseButton.parent(mainElement);
  pauseButton.position(115, drawHeight + 5);
  pauseButton.mousePressed(togglePause);

  msCheckbox = createCheckbox(' Remove myelin (MS)', false);
  msCheckbox.parent(mainElement);
  msCheckbox.position(200, drawHeight + 8);
  msCheckbox.style('font-size', '16px');
  msCheckbox.changed(resetSignal);

  // Row 2: damaged segments slider (label drawn on the canvas to the left)
  damageSlider = createSlider(1, 4, 2, 1);
  damageSlider.parent(mainElement);
  damageSlider.position(sliderLeftMargin, drawHeight + 42);
  damageSlider.size(canvasWidth - sliderLeftMargin - margin);
  damageSlider.input(resetSignal);

  // Row 3: keyboard-friendly way to pick a part
  partSelect = createSelect();
  partSelect.parent(mainElement);
  partSelect.position(130, drawHeight + 78);
  partSelect.option('(choose a part)', 'none');
  for (const key of PART_ORDER) partSelect.option(PARTS[key].name, key);
  partSelect.changed(() => {
    const v = partSelect.value();
    selectedPart = (v === 'none') ? null : v;
  });
  partSelect.style('font-size', '15px');

  describe('Neuron Explorer: a labeled neuron with dendrites, cell body, axon hillock, axon, myelin sheath, nodes of Ranvier, and axon terminals, plus an oligodendrocyte, an astrocyte, and a blood vessel. Hovering, clicking, or choosing a part shows its job in an info panel. Send signal animates a signal traveling down the axon; checking Remove myelin (MS) damages myelin segments so the signal slows, fades, and can be blocked.');
}

function draw() {
  updateCanvasSize();
  computeGeometry();
  labelBoxes = [];

  // background regions (required MicroSim standard)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  // title and instructions
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Neuron Explorer', canvasWidth / 2, 10);
  textSize(15);
  fill('dimgray');
  text('Hover or click a part to see its job. Then send a signal, with and without myelin.', margin, 40, canvasWidth - 2 * margin, 40);

  // advance the animation
  if (isRunning && mouseOverMain && signal) updateSignal();

  // hover detection (labels first, then shapes)
  hoveredPart = null;

  // draw the scene
  drawVessel();
  drawAstrocyte();
  drawDendrites();
  drawSoma();
  drawAxon();
  drawOligodendrocyte();
  drawTerminals();
  drawSignal();
  drawLabels();

  if (mouseY >= 0 && mouseY < drawHeight && mouseX >= 0 && mouseX < canvasWidth) {
    hoveredPart = hitTest(mouseX, mouseY);
  }
  drawHighlight(hoveredPart || selectedPart);

  // status line
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  fill(signal && signal.blocked ? 'firebrick' : 'navy');
  text(statusText, margin, G.statusY, canvasWidth - 2 * margin, 40);

  drawInfoPanel();

  // control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const n = damageSlider.value();
  text('Damaged segments: ' + n, 10, drawHeight + 50);
  text('Explore a part:', 10, drawHeight + 88);
  cursor(hoveredPart ? HAND : ARROW);
}

// ---------------- geometry ----------------
function computeGeometry() {
  const W = canvasWidth;
  G.sy = 235;                         // axon centerline
  G.r = W < 560 ? 24 : 32;            // soma radius
  G.sx = Math.max(70, W * 0.16);      // soma center x
  G.ax0 = G.sx + G.r + 22;            // axon start (end of hillock)
  G.ax1 = W * 0.84;                   // axon end (start of terminals)
  G.initial = Math.min(30, (G.ax1 - G.ax0) * 0.08); // unmyelinated initial segment
  G.myStart = G.ax0 + G.initial;      // first myelin begins here
  G.L = (G.ax1 - G.myStart) / NUM_SEGMENTS;
  G.gap = Math.max(5, G.L * 0.09);    // width of node gaps
  G.oligoX = G.myStart + (FIRST_DAMAGED + 1) * G.L;
  G.oligoY = G.sy - 85;
  G.astroX = G.myStart + 0.9 * G.L;
  G.astroY = G.sy + 82;
  G.vesselY = G.sy + 120;
  G.vesselX0 = W * 0.03;
  G.vesselX1 = Math.min(W * 0.62, G.astroX + 3 * G.L);
  G.statusY = 84;
  G.panelY = G.sy + 168;
}

function damagedSet() {
  const s = new Set();
  if (msCheckbox && msCheckbox.checked()) {
    const n = damageSlider.value();
    for (let i = FIRST_DAMAGED; i < FIRST_DAMAGED + n && i < NUM_SEGMENTS; i++) s.add(i);
  }
  return s;
}

function segIndexAt(x) {
  if (x < G.myStart) return -1;
  return Math.min(NUM_SEGMENTS - 1, Math.floor((x - G.myStart) / G.L));
}

// ---------------- drawing ----------------
function drawVessel() {
  stroke('indianred');
  strokeWeight(2);
  fill('mistyrose');
  rect(G.vesselX0, G.vesselY - 9, G.vesselX1 - G.vesselX0, 18, 9);
  // red blood cells (decorative dots inside the vessel)
  noStroke();
  fill('salmon');
  for (let x = G.vesselX0 + 20; x < G.vesselX1 - 10; x += 40) ellipse(x, G.vesselY, 14, 9);
  addLabel('vessel', 'Blood vessel', G.vesselX0 + 4, G.vesselY + 16, LEFT, 3);
}

function drawAstrocyte() {
  const x = G.astroX, y = G.astroY;
  stroke('darkorange');
  strokeWeight(3);
  // star-shaped processes
  for (let k = 0; k < 7; k++) {
    const a = -PI / 2 + k * TWO_PI / 7 + 0.2;
    line(x, y, x + cos(a) * 26, y + sin(a) * 22);
  }
  // end-foot reaching down to the blood vessel
  line(x, y, x - 6, G.vesselY - 10);
  noStroke();
  fill('darkorange');
  ellipse(x - 6, G.vesselY - 11, 16, 6);
  fill('orange');
  stroke('darkorange');
  strokeWeight(1);
  ellipse(x, y, 20, 20);
  addLabel('astrocyte', 'Astrocyte', x + 30, y - 6, LEFT, 2);
}

function drawDendrites() {
  stroke('purple');
  strokeWeight(3);
  noFill();
  const sx = G.sx, sy = G.sy, r = G.r;
  const reach = Math.min(sx - 12, 70);
  const angles = [-0.75, -0.35, 0.05, 0.45, 0.8];
  for (const a of angles) {
    const x1 = sx - r * cos(a), y1 = sy + r * sin(a);
    const x2 = sx - reach * cos(a) - 6, y2 = sy + (reach + 8) * sin(a);
    line(x1, y1, x2, y2);
    // small side branches
    line(x2, y2, x2 - 10, y2 - 12);
    line(x2, y2, x2 - 12, y2 + 8);
  }
  addLabel('dendrites', 'Dendrites', 6, sy - 88, LEFT, 1);
}

function drawSoma() {
  const sx = G.sx, sy = G.sy, r = G.r;
  // axon hillock: a cone from the soma to the axon
  stroke('purple');
  strokeWeight(1);
  fill('plum');
  beginShape();
  vertex(sx + r * 0.7, sy - r * 0.6);
  vertex(G.ax0, sy - 4);
  vertex(G.ax0, sy + 4);
  vertex(sx + r * 0.7, sy + r * 0.6);
  endShape(CLOSE);
  // cell body
  strokeWeight(2);
  ellipse(sx, sy, 2 * r, 2 * r);
  // nucleus
  noStroke();
  fill('mediumpurple');
  ellipse(sx - 3, sy - 2, r * 0.8, r * 0.8);
  addLabel('soma', 'Cell body', sx - 34, sy + r + 8, LEFT, 1);
  addLabel('hillock', 'Axon hillock', sx + r * 0.6, sy - r - 30, LEFT, 1);
}

function drawAxon() {
  const sy = G.sy;
  const dmg = damagedSet();
  // the axon itself (visible at the initial segment, nodes, and where myelin is lost)
  stroke('sienna');
  strokeWeight(5);
  line(G.ax0, sy, G.ax1, sy);
  // myelin segments
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const x0 = G.myStart + i * G.L + G.gap / 2;
    const x1 = G.myStart + (i + 1) * G.L - G.gap / 2;
    if (dmg.has(i)) {
      // damaged myelin: thin, broken remnants (a "plaque")
      stroke('rosybrown');
      strokeWeight(1);
      drawingContext.setLineDash([4, 5]);
      noFill();
      rect(x0, sy - 9, x1 - x0, 18, 8);
      drawingContext.setLineDash([]);
    } else {
      stroke('goldenrod');
      strokeWeight(1.5);
      fill('lightyellow');
      rect(x0, sy - 9, x1 - x0, 18, 8);
    }
  }
  // node tick marks
  noStroke();
  fill('sienna');
  for (let i = 1; i < NUM_SEGMENTS; i++) {
    const nx = G.myStart + i * G.L;
    ellipse(nx, sy, 6, 6);
  }
  const midHealthy = G.myStart + 0.5 * G.L;
  addLabel('myelin', 'Myelin sheath', midHealthy - 20, sy + 16, LEFT, 1);
  const nodeX = G.myStart + 5 * G.L;
  stroke('gray');
  strokeWeight(1);
  line(nodeX, sy - 12, nodeX, sy - 26);
  addLabel('node', 'Node of Ranvier', nodeX - 60, sy - 46, LEFT, 1);
  addLabel('axon', 'Axon', G.myStart + 3.6 * G.L, sy + 16, LEFT, 2);
  if (dmg.size > 0) {
    noStroke();
    fill('firebrick');
    textSize(14);
    textAlign(CENTER, TOP);
    const cx = G.myStart + (FIRST_DAMAGED + dmg.size / 2) * G.L;
    text('myelin lost', cx, sy + 36);
  }
}

function drawOligodendrocyte() {
  const x = G.oligoX, y = G.oligoY;
  const dmg = damagedSet();
  // processes to two myelin segments of THIS axon...
  const targets = [FIRST_DAMAGED, FIRST_DAMAGED + 1];
  strokeWeight(2);
  for (const i of targets) {
    const tx = G.myStart + (i + 0.5) * G.L;
    stroke(dmg.has(i) ? 'rosybrown' : 'teal');
    if (dmg.has(i)) drawingContext.setLineDash([4, 5]);
    line(x, y, tx, G.sy - 9);
    drawingContext.setLineDash([]);
  }
  // ...and to a neighboring axon (one oligodendrocyte myelinates several axons)
  stroke('silver');
  strokeWeight(3);
  const nx0 = x + 0.6 * G.L, nx1 = Math.min(canvasWidth - 10, x + 2.6 * G.L);
  line(nx0, y - 18, nx1, y - 18);
  stroke('teal');
  strokeWeight(2);
  line(x, y, x + 1.2 * G.L, y - 18);
  fill('palegoldenrod');
  stroke('goldenrod');
  strokeWeight(1);
  rect(x + 0.8 * G.L, y - 24, 0.8 * G.L, 12, 6);
  if (nx1 - x > 2.2 * G.L && canvasWidth > 600) {
    noStroke();
    fill('gray');
    textSize(14);
    textAlign(LEFT, BOTTOM);
    text('another axon', x + 1.7 * G.L, y - 22);
  }
  // cell body
  fill('mediumaquamarine');
  stroke('teal');
  strokeWeight(1.5);
  ellipse(x, y, 26, 22);
  addLabel('oligodendrocyte', 'Oligodendrocyte', x - 150, y - 8, LEFT, 1);
}

function drawTerminals() {
  const sy = G.sy;
  const x0 = G.ax1;
  const span = Math.max(30, canvasWidth * 0.96 - x0);
  stroke('sienna');
  strokeWeight(3);
  const ends = [-34, -12, 12, 34];
  for (const dy of ends) {
    const ex = x0 + span * 0.8, ey = sy + dy;
    line(x0, sy, ex, ey);
    noStroke();
    fill(signal && signal.arrived ? 'gold' : 'tan');
    ellipse(ex + 4, ey, 12, 12);
    stroke('sienna');
  }
  addLabel('terminal', 'Axon terminals', Math.min(x0 - 20, canvasWidth - 130), sy + 46, LEFT, 1);
}

function drawSignal() {
  // node flashes
  for (const f of flashes) {
    noFill();
    stroke(255, 165, 0, 255 * f.life / 12);
    strokeWeight(3);
    ellipse(f.x, G.sy, 30 - f.life, 30 - f.life);
    if (isRunning && mouseOverMain) f.life--;
  }
  flashes = flashes.filter(f => f.life > 0);
  if (!signal || signal.blocked && signal.fade <= 0) return;
  const s = signal.blocked ? signal.fade : signal.strength;
  noStroke();
  fill(255, 215, 0, 80 * s + 20);
  ellipse(signal.x, G.sy, 34, 34);
  fill(255, 140, 0, 200 * s + 40);
  ellipse(signal.x, G.sy, 16, 16);
  if (signal.blocked && isRunning && mouseOverMain) signal.fade -= 0.03;
}

// ---------------- labels and hit testing ----------------
// Labels double as hotspots. Priority 1 labels always draw; priority 2-3 labels
// are skipped if they would overlap a label already drawn (narrow screens).
function addLabel(key, txt, x, y, align, priority) {
  textSize(14);
  const w = textWidth(txt) + 8;
  const h = 20;
  x = constrain(x, 2, canvasWidth - w - 2);
  const box = {key, txt, x, y, w, h, priority};
  for (const b of labelBoxes) {
    if (priority > 1 && x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y) return;
  }
  labelBoxes.push(box);
}

function drawLabels() {
  for (const b of labelBoxes) {
    stroke('silver');
    strokeWeight(1);
    fill(255, 255, 255, 220);
    rect(b.x, b.y, b.w, b.h, 5);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, CENTER);
    text(b.txt, b.x + 4, b.y + b.h / 2);
  }
}

function hitTest(mx, my) {
  // labels first
  for (const b of labelBoxes) {
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return b.key;
  }
  const sy = G.sy;
  if (dist(mx, my, G.oligoX, G.oligoY) < 16) return 'oligodendrocyte';
  if (dist(mx, my, G.astroX, G.astroY) < 26) return 'astrocyte';
  if (mx > G.vesselX0 && mx < G.vesselX1 && Math.abs(my - G.vesselY) < 10) return 'vessel';
  if (dist(mx, my, G.sx, sy) < G.r + 3) return 'soma';
  if (mx < G.sx - G.r && mx > 2 && Math.abs(my - sy) < 80) return 'dendrites';
  if (mx >= G.sx + G.r * 0.6 && mx < G.ax0 && Math.abs(my - sy) < G.r * 0.6) return 'hillock';
  if (Math.abs(my - sy) < 12 && mx >= G.ax0 && mx <= G.ax1) {
    for (let i = 1; i < NUM_SEGMENTS; i++) {
      if (Math.abs(mx - (G.myStart + i * G.L)) <= Math.max(5, G.gap / 2 + 1)) return 'node';
    }
    if (mx < G.myStart) return 'axon';
    const i = segIndexAt(mx);
    if (damagedSet().has(i)) return 'axon';
    // centerline of a myelinated segment = the axon inside; edges = myelin
    return Math.abs(my - sy) <= 2 ? 'axon' : 'myelin';
  }
  if (mx > G.ax1 && Math.abs(my - sy) < 45) return 'terminal';
  return null;
}

function drawHighlight(key) {
  if (!key) return;
  noFill();
  stroke('royalblue');
  strokeWeight(3);
  const sy = G.sy;
  if (key === 'soma') ellipse(G.sx, sy, 2 * G.r + 10, 2 * G.r + 10);
  else if (key === 'dendrites') rect(4, sy - 72, G.sx - G.r - 4, 144, 10);
  else if (key === 'hillock') rect(G.sx + G.r * 0.5, sy - G.r * 0.7, G.ax0 - G.sx - G.r * 0.5 + 4, G.r * 1.4, 6);
  else if (key === 'axon') rect(G.ax0 - 2, sy - 6, G.ax1 - G.ax0 + 4, 12, 6);
  else if (key === 'myelin') {
    const dmg = damagedSet();
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      if (dmg.has(i)) continue;
      rect(G.myStart + i * G.L + G.gap / 2 - 2, sy - 12, G.L - G.gap + 4, 24, 9);
    }
  } else if (key === 'node') {
    for (let i = 1; i < NUM_SEGMENTS; i++) ellipse(G.myStart + i * G.L, sy, 16, 16);
  } else if (key === 'terminal') rect(G.ax1, sy - 46, canvasWidth * 0.96 - G.ax1 + 8, 92, 10);
  else if (key === 'oligodendrocyte') ellipse(G.oligoX, G.oligoY, 40, 36);
  else if (key === 'astrocyte') ellipse(G.astroX, G.astroY, 62, 56);
  else if (key === 'vessel') rect(G.vesselX0 - 3, G.vesselY - 12, G.vesselX1 - G.vesselX0 + 6, 24, 10);
}

function drawInfoPanel() {
  const key = hoveredPart || selectedPart;
  const x = margin / 2, y = G.panelY, w = canvasWidth - margin, h = drawHeight - y - 8;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!key) {
    fill('dimgray');
    textSize(15);
    text('Info panel: hover over, click, or choose any labeled part to see what it does. ' +
         'Try "Remove myelin (MS)" and send a signal to see why myelin matters.', x + 12, y + 12, w - 24, h - 20);
    return;
  }
  const p = PARTS[key];
  fill('navy');
  textSize(17);
  text(p.name, x + 12, y + 10, w - 24, 24);
  fill('black');
  // shrink body text a little on narrow screens so it fits the panel
  textSize(canvasWidth < 520 ? 14 : 15);
  text(p.job, x + 12, y + 36, w - 24, h - 42);
}

// ---------------- simulation ----------------
function sendSignal() {
  computeGeometry();
  signal = {
    x: G.ax0,
    strength: 1,
    stretchStartX: null,
    stretchStartStrength: 1,
    frames: 0,
    arrived: false,
    blocked: false,
    fade: 1
  };
  flashes = [{x: G.ax0, life: 12}];
  isRunning = true;
  mouseOverMain = true; // the pointer (or finger) is on the Send button, inside the sim
  pauseButton.html('Pause');
  statusText = 'Signal fired at the start of the axon... (move the pointer over the sim to watch)';
}

function togglePause() {
  if (!signal) return;
  isRunning = !isRunning;
  pauseButton.html(isRunning ? 'Pause' : 'Resume');
}

function resetSignal() {
  signal = null;
  flashes = [];
  isRunning = false;
  pauseButton.html('Pause');
  statusText = msCheckbox.checked()
    ? 'Myelin removed from ' + damageSlider.value() + ' segment(s). Press "Send signal".'
    : 'Healthy myelin. Press "Send signal" to fire the neuron.';
}

function updateSignal() {
  if (signal.arrived || signal.blocked) return;
  const dmg = damagedSet();
  const i = segIndexAt(signal.x);
  const damaged = dmg.has(i);
  const v = G.L / (damaged ? SLOW_FRAMES : FAST_FRAMES);
  const oldX = signal.x;
  signal.x += v;
  signal.frames++;

  if (damaged) {
    if (signal.stretchStartX === null) {
      signal.stretchStartX = G.myStart + i * G.L;
      signal.stretchStartStrength = signal.strength;
    }
    const segsCrossed = (signal.x - signal.stretchStartX) / G.L;
    signal.strength = signal.stretchStartStrength * Math.pow(FADE_PER_SEGMENT, segsCrossed);
    if (signal.strength < RENEW_THRESHOLD) {
      signal.blocked = true;
      statusText = 'Signal BLOCKED: it faded out in the bare stretch before reaching a healthy node. The message never arrives.';
      return;
    }
    statusText = 'Crawling through demyelinated axon... strength ' + Math.round(signal.strength * 100) + '%';
  } else {
    statusText = 'Jumping quickly from node to node... strength 100%';
  }

  // crossing a node boundary?
  for (let k = 1; k < NUM_SEGMENTS; k++) {
    const nx = G.myStart + k * G.L;
    if (oldX < nx && signal.x >= nx) {
      const nextDamaged = dmg.has(k);
      if (!nextDamaged) {
        // healthy node renews the signal to full strength
        signal.strength = 1;
        signal.stretchStartX = null;
        flashes.push({x: nx, life: 12});
      }
    }
  }

  if (signal.x >= G.ax1) {
    signal.x = G.ax1;
    signal.arrived = true;
    isRunning = false;
    const healthyFrames = Math.ceil((G.ax1 - G.ax0) / (G.L / FAST_FRAMES));
    const ratio = signal.frames / healthyFrames;
    if (dmg.size === 0) {
      statusText = 'Arrived at the axon terminals! Healthy myelin: travel time 1.0x (the fastest).';
    } else {
      statusText = 'Arrived, but late: about ' + ratio.toFixed(1) + 'x the healthy travel time. Damaged myelin slows the signal.';
    }
  }
}

function mousePressed() {
  if (mouseY >= 0 && mouseY < drawHeight && mouseX >= 0 && mouseX < canvasWidth) {
    const hit = hitTest(mouseX, mouseY);
    selectedPart = hit;
    if (partSelect) partSelect.selected(hit ? hit : 'none');
  }
}

// ---------------- responsive functions (keep at end) ----------------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  damageSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
