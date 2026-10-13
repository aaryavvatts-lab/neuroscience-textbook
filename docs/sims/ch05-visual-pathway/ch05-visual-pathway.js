// Visual Pathway Lesion Simulator - Chapter 5 (Vision) of From Neuron to Bedside
// CANVAS_HEIGHT = 705 (drawHeight 620 + controlHeight 85); iframe height = 707
// A top-down (bird's-eye) schematic of the human visual pathway. The student places a
// lesion (from the menu or by clicking a red dot) and two visual-field maps show what
// each eye loses. Field maps are drawn as the PATIENT sees them: left side of each
// circle = patient's left visual field.
//
// Color code used everywhere in this sim:
//   blue   = information about the LEFT visual field  (ends up in the RIGHT hemisphere)
//   orange = information about the RIGHT visual field (ends up in the LEFT hemisphere)
//
// Science (see logs/05-factcheck.md):
//   - Nasal retinal fibers cross at the optic chiasm; temporal fibers stay on the same side.
//   - Optic nerve lesion  -> blindness in that one eye.
//   - Chiasm (center)     -> bitemporal hemianopia (outer half of each eye's field).
//   - Optic tract         -> contralateral homonymous hemianopia (often incongruous).
//   - Meyer's loop        -> contralateral homonymous superior quadrantanopia ("pie in the sky").
//   - Occipital cortex    -> contralateral homonymous hemianopia, often with macular sparing.
// Simplifications: field maps are idealized; real defects can be partial or uneven.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160; // kept for template consistency (this sim has no sliders)
let defaultTextSize = 16;

// controls
let lesionSelect;
let hideCheckbox;

// pathway drawing transform (local schematic is 400 x 270 units)
let pathOX = 0;
let pathOY = 62;
let pathScale = 1;

// lesion sites: menu label, key, and the clickable point in local schematic units
const LESIONS = [
  { key: 'none',        label: 'None (healthy)' },
  { key: 'leftNerve',   label: 'Left optic nerve',              x: 153, y: 88 },
  { key: 'chiasm',      label: 'Optic chiasm (center)',         x: 200, y: 117 },
  { key: 'rightTract',  label: 'Right optic tract',             x: 241, y: 156 },
  { key: 'leftMeyer',   label: "Left optic radiation (Meyer's loop)", x: 52, y: 196 },
  { key: 'rightCortex', label: 'Right occipital cortex (V1)',   x: 236, y: 258 }
];

// result text for each lesion
const RESULTS = {
  none: {
    name: 'Normal visual fields',
    why: 'Each eye sees both halves. The left field (blue) is sent to the right brain, and the right field (orange) is sent to the left brain.'
  },
  leftNerve: {
    name: 'Left monocular blindness',
    why: "The left eye's only cable to the brain is cut before the chiasm, so the left eye sees nothing. The right eye is normal."
  },
  chiasm: {
    name: 'Bitemporal hemianopia',
    why: 'The crossing fibers from both nasal retinas are cut, so each eye loses the outer (temporal) half of its field. Classic cause: a pituitary tumor pressing up on the chiasm.'
  },
  rightTract: {
    name: 'Left homonymous hemianopia',
    why: 'The right optic tract carries the LEFT field from BOTH eyes, so both eyes lose the left half. (Real tract lesions are often uneven between the eyes.)'
  },
  leftMeyer: {
    name: "Right superior homonymous quadrantanopia (\"pie in the sky\")",
    why: "Meyer's loop swings through the left temporal lobe carrying the UPPER part of the right field, so both eyes lose the upper-right quarter."
  },
  rightCortex: {
    name: 'Left homonymous hemianopia with macular sparing',
    why: 'Damage to right V1 (often a stroke) removes the left field in both eyes, but central vision is often spared.'
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // Row 1: lesion site menu
  lesionSelect = createSelect();
  for (let L of LESIONS) {
    lesionSelect.option(L.label, L.key);
  }
  lesionSelect.selected('none');
  lesionSelect.position(110, drawHeight + 10);
  lesionSelect.style('font-size', '16px');

  // Row 2: predict-first option
  hideCheckbox = createCheckbox(' Hide result (predict first, then uncheck)', false);
  hideCheckbox.position(10, drawHeight + 48);
  hideCheckbox.style('font-size', '16px');

  describe('Top-down diagram of the visual pathway from both eyes through the optic nerves, optic chiasm, optic tracts, lateral geniculate nuclei and optic radiations to the primary visual cortex. Choose a lesion site and two circular visual field maps, one per eye, show which parts of the visual field are lost.');
}

function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds (required MicroSim standard)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  // title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  text('Visual Pathway Lesion Simulator', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // instruction line
  textSize(15);
  fill('dimgray');
  noStroke();
  text('Pick a lesion site (menu or red dot), predict the field loss, then check the maps.',
       10, 36, canvasWidth - 20, 40);

  let lesion = lesionSelect.value();

  drawPathway(lesion);
  drawFieldMaps(lesion);

  // control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Lesion site:', 10, drawHeight + 22);
}

// ---------------------------------------------------------------------------
// Pathway schematic (local coordinates: 400 wide x 270 tall)
// ---------------------------------------------------------------------------
function drawPathway(lesion) {
  pathScale = min(1, (canvasWidth - 20) / 400);
  pathOX = (canvasWidth - 400 * pathScale) / 2;
  pathOY = 70;

  push();
  translate(pathOX, pathOY);
  scale(pathScale);

  // faint brain outline and midline
  fill('lavender');
  stroke('thistle');
  strokeWeight(1.5);
  ellipse(200, 185, 360, 190);
  stroke('thistle');
  drawingContext.setLineDash([5, 5]);
  line(200, 95, 200, 280);
  drawingContext.setLineDash([]);

  // which fiber groups are cut by this lesion
  let cut = {
    LT: lesion === 'leftNerve',
    LN: lesion === 'leftNerve' || lesion === 'chiasm' || lesion === 'rightTract',
    RN: lesion === 'chiasm',
    RT: lesion === 'rightTract',
    leftMeyer: lesion === 'leftMeyer',
    leftParietal: false,
    rightMeyer: lesion === 'rightTract',
    rightParietal: lesion === 'rightTract',
    leftV1: false,
    rightV1: lesion === 'rightTract' || lesion === 'rightCortex'
  };

  // --- eyes (front of the eye faces the top of the screen) ---
  drawEye(120, 40, 'left');
  drawEye(280, 40, 'right');

  // --- retina-to-LGN fibers (4 groups) ---
  // LT: left eye temporal retina (sees RIGHT field, orange) stays on the left
  fiber([[110, 64], [186, 114], [170, 146], [133, 182]], 'darkorange', cut.LT);
  // LN: left eye nasal retina (sees LEFT field, blue) crosses to the right
  fiber([[130, 64], [194, 112], [207, 122], [238, 146], [267, 182]], 'royalblue', cut.LN);
  // RN: right eye nasal retina (sees RIGHT field, orange) crosses to the left
  fiber([[270, 64], [206, 112], [193, 122], [162, 146], [133, 182]], 'darkorange', cut.RN);
  // RT: right eye temporal retina (sees LEFT field, blue) stays on the right
  fiber([[290, 64], [214, 114], [230, 146], [267, 182]], 'royalblue', cut.RT);

  // --- LGN (in the thalamus) ---
  fill('plum');
  stroke('purple');
  strokeWeight(1.5);
  ellipse(130, 186, 30, 18);
  ellipse(270, 186, 30, 18);

  // --- optic radiations ---
  // left hemisphere (carries RIGHT field, orange)
  radiationMeyer(130, 194, -1, 'darkorange', cut.leftMeyer);
  radiationParietal(136, 194, -1, 'darkorange', cut.leftParietal);
  // right hemisphere (carries LEFT field, blue)
  radiationMeyer(270, 194, 1, 'royalblue', cut.rightMeyer);
  radiationParietal(264, 194, 1, 'royalblue', cut.rightParietal);

  // --- primary visual cortex (V1) at the back of each occipital lobe ---
  noFill();
  strokeWeight(7);
  stroke(cut.leftV1 ? 'darkgray' : 'darkorange');
  arc(200, 245, 92, 64, HALF_PI, PI - 0.15);
  stroke(cut.rightV1 ? 'darkgray' : 'royalblue');
  arc(200, 245, 92, 64, 0.15, HALF_PI);
  if (lesion === 'rightCortex') {
    // the occipital pole (central vision) is often spared
    stroke('royalblue');
    arc(200, 245, 92, 64, HALF_PI - 0.12, HALF_PI);
  }

  // --- labels ---
  textSize(14);
  noStroke();
  fill('black');
  textAlign(RIGHT, CENTER);
  text('Left eye', 88, 30);
  text('Optic nerve', 128, 96);
  text('Optic tract', 145, 140);
  text('LGN', 108, 186);
  textAlign(CENTER, CENTER);
  text("Meyer's loop", 52, 158);
  textAlign(LEFT, CENTER);
  text('Right eye', 312, 30);
  text('Optic chiasm', 262, 108);
  text('LGN', 292, 186);
  text('Optic radiation', 300, 222);
  textAlign(CENTER, TOP);
  text('V1 (occipital lobe)', 200, 280);

  // --- clickable lesion points ---
  for (let L of LESIONS) {
    if (L.key === 'none') continue;
    let active = (L.key === lesion);
    let hover = dist(localMouseX(), localMouseY(), L.x, L.y) < 12;
    if (active) {
      stroke('red');
      strokeWeight(4);
      line(L.x - 9, L.y - 9, L.x + 9, L.y + 9);
      line(L.x - 9, L.y + 9, L.x + 9, L.y - 9);
    } else {
      fill(hover ? 'red' : 'white');
      stroke('red');
      strokeWeight(2);
      circle(L.x, L.y, 13);
    }
  }
  pop();
}

// draw one eye seen from above: lens at the front (top), retina halves at the back
function drawEye(cx, cy, side) {
  // white of the eye
  fill('white');
  stroke('gray');
  strokeWeight(1.5);
  circle(cx, cy, 52);
  // lens at the front of the eye
  fill('lightcyan');
  stroke('steelblue');
  ellipse(cx, cy - 20, 18, 8);
  // retina = back half of the eye, split into nasal and temporal halves
  noFill();
  strokeWeight(6);
  // screen-left back quarter and screen-right back quarter
  // left eye: screen-left = temporal (sees RIGHT field, orange); screen-right = nasal (LEFT field, blue)
  // right eye: screen-left = nasal (RIGHT field, orange); screen-right = temporal (LEFT field, blue)
  stroke('darkorange');
  arc(cx, cy, 46, 46, HALF_PI, PI);
  stroke('royalblue');
  arc(cx, cy, 46, 46, 0, HALF_PI);
}

// draw a fiber bundle as a polyline; gray and dashed if it is cut
function fiber(pts, col, isCut) {
  noFill();
  strokeWeight(isCut ? 2.5 : 3.5);
  stroke(isCut ? 'darkgray' : col);
  if (isCut) drawingContext.setLineDash([6, 5]);
  beginShape();
  for (let p of pts) vertex(p[0], p[1]);
  endShape();
  drawingContext.setLineDash([]);
}

// Meyer's loop: swings forward and outward into the temporal lobe, then back to V1
// dir = -1 for the left hemisphere, +1 for the right hemisphere
function radiationMeyer(x, y, dir, col, isCut) {
  noFill();
  strokeWeight(isCut ? 2.5 : 3.5);
  stroke(isCut ? 'darkgray' : col);
  if (isCut) drawingContext.setLineDash([6, 5]);
  bezier(x, y, x + dir * 110, y - 60, x + dir * 110, y + 70, 200 + dir * 42, 259);
  drawingContext.setLineDash([]);
}

// upper (parietal) part of the optic radiation: a more direct path to V1
function radiationParietal(x, y, dir, col, isCut) {
  noFill();
  strokeWeight(isCut ? 2.5 : 3.5);
  stroke(isCut ? 'darkgray' : col);
  if (isCut) drawingContext.setLineDash([6, 5]);
  bezier(x, y, x, y + 40, 200 + dir * 30, 258, 200 + dir * 26, 271);
  drawingContext.setLineDash([]);
}

function localMouseX() { return (mouseX - pathOX) / pathScale; }
function localMouseY() { return (mouseY - pathOY) / pathScale; }

// clicking a red dot selects that lesion
function mousePressed() {
  if (mouseY > drawHeight) return;
  for (let L of LESIONS) {
    if (L.key === 'none') continue;
    if (dist(localMouseX(), localMouseY(), L.x, L.y) < 14) {
      lesionSelect.selected(L.key);
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Visual field maps (as the patient sees them)
// ---------------------------------------------------------------------------
function drawFieldMaps(lesion) {
  let R = 52;
  let cy = 466;
  let gap = min(170, canvasWidth / 4 + 20);
  let cxL = canvasWidth / 2 - gap / 2 - R + 10;
  let cxR = canvasWidth / 2 + gap / 2 + R - 10;

  // section heading
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text('What each eye sees (patient\'s view)', canvasWidth / 2, 384);
  textStyle(NORMAL);

  if (hideCheckbox.checked() && lesion !== 'none') {
    fill('gainsboro');
    stroke('gray');
    strokeWeight(1);
    rect(20, 400, canvasWidth - 40, 205, 10);
    fill('black');
    noStroke();
    textSize(16);
    text('Result hidden. Sketch your prediction for each eye,\nthen uncheck "Hide result" to compare.',
         canvasWidth / 2, 500);
    return;
  }

  drawOneField(cxL, cy, R, 'Left eye', lesion, 'L');
  drawOneField(cxR, cy, R, 'Right eye', lesion, 'R');

  // result name and explanation
  let res = RESULTS[lesion];
  fill(lesion === 'none' ? 'darkgreen' : 'firebrick');
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  // shrink long result names so they stay on one line (a second line would be clipped)
  let nameSize = 17;
  textSize(nameSize);
  while (nameSize > 11 && textWidth(res.name) > canvasWidth - 24) {
    nameSize -= 0.5;
    textSize(nameSize);
  }
  text(res.name, 10, cy + R + 14, canvasWidth - 20, 24);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  text(res.why, 12, cy + R + 36, canvasWidth - 24, 84);
}

// draw one circular field map. x < 0 is the patient's left, y < 0 (screen) is up.
function drawOneField(cx, cy, R, title, lesion, eye) {
  // eye label
  fill('black');
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(15);
  text(title, cx, cy - R - 4);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill('dimgray');
  text('L', cx - R - 12, cy);
  text('R', cx + R + 12, cy);

  // intact field: left half blue-tinted, right half orange-tinted
  noStroke();
  fill('lightskyblue');
  arc(cx, cy, 2 * R, 2 * R, HALF_PI, PI + HALF_PI, PIE);
  fill('navajowhite');
  arc(cx, cy, 2 * R, 2 * R, -HALF_PI, HALF_PI, PIE);

  // lost areas
  fill('dimgray');
  let D = 2 * R;
  if (lesion === 'leftNerve' && eye === 'L') {
    circle(cx, cy, D);
  } else if (lesion === 'chiasm') {
    // temporal half of each eye: left half for the left eye, right half for the right eye
    if (eye === 'L') arc(cx, cy, D, D, HALF_PI, PI + HALF_PI, PIE);
    else arc(cx, cy, D, D, -HALF_PI, HALF_PI, PIE);
  } else if (lesion === 'rightTract') {
    arc(cx, cy, D, D, HALF_PI, PI + HALF_PI, PIE);
  } else if (lesion === 'leftMeyer') {
    // upper-right quadrant (screen angles -90 deg to 0 deg)
    arc(cx, cy, D, D, -HALF_PI, 0, PIE);
  } else if (lesion === 'rightCortex') {
    arc(cx, cy, D, D, HALF_PI, PI + HALF_PI, PIE);
    // spared central (macular) region
    fill('lightskyblue');
    arc(cx, cy, D * 0.24, D * 0.24, HALF_PI, PI + HALF_PI, PIE);
  }

  // outline, meridians and fixation point
  noFill();
  stroke('black');
  strokeWeight(1.5);
  circle(cx, cy, D);
  stroke('gray');
  strokeWeight(1);
  line(cx - R, cy, cx + R, cy);
  line(cx, cy - R, cx, cy + R);
  fill('black');
  noStroke();
  circle(cx, cy, 5);
}

// These two functions must be present for width-responsive MicroSims
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  // keep the lesion menu inside the control area on narrow screens
  if (typeof lesionSelect !== 'undefined') {
    lesionSelect.style('max-width', (canvasWidth - 120) + 'px');
  }
}
