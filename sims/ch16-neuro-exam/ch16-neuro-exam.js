// Neuro Exam Decision Tree MicroSim
// Chapter 16: How Doctors Examine the Brain (From Neuron to Bedside)
// CANVAS_HEIGHT = 825 (drawHeight 640 + controlHeight 185); iframe height = 827
// The learner picks a fictional case, chooses exam steps and scans (each reveals a finding),
// then commits to a localization and gets feedback that explains the reasoning.
// All three cases are fictional teaching composites. Findings follow standard textbook
// patterns: upper motor neuron (UMN) vs lower motor neuron (LMN) signs, forehead-sparing
// (central) vs whole-face (peripheral) facial weakness, and a spinal cord "sensory level".
// MicroSim template version 2026.03 (structure copied from bouncing-ball.js)

// ---------- global layout variables (standard MicroSim names) ----------
let containerWidth;
let canvasWidth = 400;
let drawHeight = 640;          // fixed drawing region (no controls here)
let controlHeight = 185;       // 5 rows of controls: (5 x 35) + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 140;    // no sliders in this sim; kept for template consistency
let defaultTextSize = 16;

// ---------- controls ----------
let caseSelect, resetButton, locSelect, checkButton;
let examButtons = [];

// ---------- state ----------
let currentCase = 0;
let revealed = [];          // keys of exam steps already done, in the order chosen
let lastKey = null;         // key of the most recent step (shown in the detail box)
let feedback = null;        // {correct: bool, text: string}
let wrongTries = 0;

// Exam steps, in the order a neurologist usually goes
const STEPS = [
  { key: 'mental', label: 'Mental status' },
  { key: 'cn', label: 'Cranial nerves' },
  { key: 'strength', label: 'Strength' },
  { key: 'reflexes', label: 'Reflexes' },
  { key: 'sensation', label: 'Sensation' },
  { key: 'coord', label: 'Coordination' },
  { key: 'gait', label: 'Gait' },
  { key: 'ct', label: 'Order CT' },
  { key: 'mri', label: 'Order MRI' }
];

const LOCATIONS = [
  'Left cerebral hemisphere',
  'Right cerebral hemisphere',
  'Brainstem',
  'Spinal cord',
  'Peripheral nerve',
  'Muscle'
];

// ---------- the three fictional cases ----------
// tag = short line for the findings list; detail = full explanation for the detail box
const CASES = [
  {
    name: 'Case 1: Right-sided weakness',
    patient: 'Mr. Okafor, 68, was eating lunch when his right hand dropped his fork and his words came out jumbled. His wife called 911. The symptoms started suddenly, 50 minutes ago.',
    answer: 'Left cerebral hemisphere',
    findings: {
      mental: { tag: 'Mental status: alert, but halting speech and word-finding trouble',
        detail: 'He is awake and follows simple commands, but his speech is slow and effortful and he struggles to find words (aphasia). Language problems point to the dominant hemisphere, which is the left in most people.' },
      cn: { tag: 'Cranial nerves: right lower face droops, forehead moves normally',
        detail: 'His lower right face droops, but he wrinkles both sides of his forehead and closes both eyes tightly. A droop that spares the forehead is a central (upper motor neuron) pattern. His eyes tend to drift to the left, and he misses fingers held up on his right side.' },
      strength: { tag: 'Strength: right arm 2/5, right leg 4/5, left side 5/5',
        detail: 'His right arm moves but cannot lift against gravity (2/5). His right leg is only mildly weak (4/5). His left side is full strength (5/5). Face and arm weaker than leg is typical of the middle cerebral artery territory.' },
      reflexes: { tag: 'Reflexes: 2+ and equal for now; right Babinski sign',
        detail: 'Tendon reflexes are still normal (2+) and equal on both sides. In a brand-new stroke, brisk reflexes often take days to appear. But when the sole of his right foot is stroked, the big toe goes up (Babinski sign), an upper motor neuron sign that can show up early.' },
      sensation: { tag: 'Sensation: duller on right face and arm',
        detail: 'Pinprick and light touch feel duller on his right face and right arm. Numbness on the same side as the weakness fits one lesion in the opposite (left) hemisphere.' },
      coord: { tag: 'Coordination: left side normal; right too weak to test',
        detail: 'Finger-to-nose is smooth with his left hand. His right arm is too weak to test fairly, so its clumsiness cannot be blamed on the cerebellum.' },
      gait: { tag: 'Gait: not tested; he cannot stand safely',
        detail: 'He cannot stand without help, so walking is not tested. Patient safety comes first.' },
      ct: { tag: 'CT (no contrast): no bleeding seen',
        detail: 'The non-contrast head CT shows no bleeding. That is the key first question, because clot-dissolving medicine must not be given if there is bleeding. Early ischemic strokes often look normal on CT in the first hours.' },
      mri: { tag: 'MRI (diffusion): fresh injury in left frontal and parietal lobes',
        detail: 'Diffusion-weighted MRI shows a bright area of new injury in the left frontal and parietal lobes, the territory of the left middle cerebral artery.' }
    },
    reasons: {
      'Left cerebral hemisphere': 'Correct! Right face (forehead spared) and arm weaker than leg, right-sided numbness, a right Babinski sign, and aphasia all point to the LEFT hemisphere. Motor pathways cross, and language lives in the dominant (usually left) side. MRI confirms a left middle cerebral artery stroke.',
      'Right cerebral hemisphere': 'Not quite. Motor pathways cross in the lower medulla, so weakness of the RIGHT body comes from the LEFT hemisphere. Aphasia also points to the left, dominant side.',
      'Brainstem': 'Not quite. A brainstem lesion often gives crossed signs (a cranial nerve problem on one side, body weakness on the other) and does not usually cause aphasia. Here the face and body are weak on the same side, and language is affected. That is cortex.',
      'Spinal cord': 'Not quite. A spinal cord lesion cannot weaken the face or cause aphasia, because the face and language are controlled above the cord.',
      'Peripheral nerve': 'Not quite. One nerve cannot weaken the face, arm, and leg together. Nerve damage also lowers reflexes, but here they are normal and there is a Babinski sign.',
      'Muscle': 'Not quite. Muscle disease does not cause numbness, aphasia, or a Babinski sign. These findings come from the central nervous system.'
    }
  },
  {
    name: 'Case 2: Face droop on waking',
    patient: 'Ms. Rivera, 29, woke up and saw in the mirror that the right side of her face was drooping. Water dribbles from the right corner of her mouth. She feels otherwise well.',
    answer: 'Peripheral nerve',
    findings: {
      mental: { tag: 'Mental status: normal; language normal',
        detail: 'She is alert and oriented, and her language is normal. Only sounds made with the lips are a little slurred, because her face is weak.' },
      cn: { tag: 'Cranial nerves: whole right face weak, forehead included; right eye won\'t fully close',
        detail: 'She cannot wrinkle the right side of her forehead or fully close her right eye, and the right corner of her mouth droops. Food tastes odd on the front of her tongue. Weakness of the WHOLE half-face, forehead included, is a peripheral (lower motor neuron) pattern. Facial feeling, eye movements, hearing, and tongue are normal.' },
      strength: { tag: 'Strength: 5/5 in all four limbs',
        detail: 'Arms and legs are full strength (5/5) on both sides.' },
      reflexes: { tag: 'Reflexes: 2+ and equal; toes point down',
        detail: 'Reflexes are normal (2+) and equal on both sides. Both big toes curl down when the sole is stroked (normal).' },
      sensation: { tag: 'Sensation: normal everywhere, including the face',
        detail: 'Touch and pinprick are normal on the face (trigeminal nerve, CN V) and the body.' },
      coord: { tag: 'Coordination: normal',
        detail: 'Finger-to-nose and heel-to-shin are smooth and accurate on both sides.' },
      gait: { tag: 'Gait: normal',
        detail: 'She walks normally, including heel-to-toe.' },
      ct: { tag: 'CT: normal',
        detail: 'The head CT is normal. For a typical case like this, imaging is usually not needed; the diagnosis comes from the history and exam.' },
      mri: { tag: 'MRI brain: normal',
        detail: 'The brain MRI is normal. MRI is mainly used if the weakness creeps on slowly or other nerves are involved.' }
    },
    reasons: {
      'Peripheral nerve': 'Correct! Weakness of the whole right half of the face, forehead included, with everything else normal, is a lower motor neuron pattern: the right facial nerve (cranial nerve VII). This picture fits Bell\'s palsy.',
      'Left cerebral hemisphere': 'Not quite. A left-hemisphere lesion would weaken the RIGHT lower face but spare the forehead, because the forehead gets signals from both hemispheres. Her forehead is weak, and her limbs are normal.',
      'Right cerebral hemisphere': 'Not quite. A right-hemisphere lesion would affect the LEFT side, and a brain lesion above the brainstem spares the forehead. Her right forehead is weak.',
      'Brainstem': 'Close, but not the best answer. A brainstem lesion can damage the facial nerve\'s nucleus, but it would usually bring other signs, such as limb weakness or other cranial nerve problems. Here, everything else is normal.',
      'Spinal cord': 'Not quite. The facial nerve leaves the brainstem directly and never travels in the spinal cord. Her limbs are also normal.',
      'Muscle': 'Not quite. Her weakness covers exactly the territory of one nerve on one side of the face, with every other muscle normal. That points to the nerve, not to muscle disease.'
    }
  },
  {
    name: 'Case 3: Stiff, weak legs',
    patient: 'Mr. Chen, 52, has had 3 weeks of legs that feel stiff and heavy. He has tripped twice, and he has to rush to the bathroom to urinate. His arms feel fine.',
    answer: 'Spinal cord',
    findings: {
      mental: { tag: 'Mental status: normal',
        detail: 'He is alert and oriented, with normal memory and language.' },
      cn: { tag: 'Cranial nerves: normal',
        detail: 'Vision, eye movements, facial strength and feeling, hearing, swallowing, and tongue are all normal.' },
      strength: { tag: 'Strength: arms 5/5; both legs 4/5',
        detail: 'Both arms are full strength (5/5). Both legs are weak (4/5) and stiff when moved.' },
      reflexes: { tag: 'Reflexes: arms 2+; knees and ankles 3+; both toes up',
        detail: 'Arm reflexes are normal (2+). Knee and ankle reflexes are brisk (3+), and both big toes go up when the soles are stroked (Babinski signs). These upper motor neuron signs are in the legs only.' },
      sensation: { tag: 'Sensation: dull below the belly button on both sides',
        detail: 'Pinprick feels dull from about the level of the belly button (the T10 dermatome) downward, on both sides, and normal above it. A horizontal line like this, called a sensory level, points to the spinal cord.' },
      coord: { tag: 'Coordination: arms normal; legs slowed by stiffness',
        detail: 'Finger-to-nose is normal. Heel-to-shin is slow because his legs are stiff and weak, not because of a shaky, cerebellar pattern.' },
      gait: { tag: 'Gait: stiff and slow, toes scrape the floor',
        detail: 'He walks stiffly and slowly, and his toes scrape the floor. This is a spastic gait, typical of upper motor neuron damage to both legs.' },
      ct: { tag: 'CT head: normal',
        detail: 'The head CT is normal. A head scan cannot see the spinal cord in the chest region, so it does not answer this question.' },
      mri: { tag: 'MRI spine: cord squeezed in the thoracic (chest-level) spine',
        detail: 'MRI of the spine shows the spinal cord being compressed in the thoracic (chest-level) spine. A brain MRI is normal.' }
    },
    reasons: {
      'Spinal cord': 'Correct! Weak, stiff legs with brisk reflexes and Babinski signs (upper motor neuron), normal arms and face, a sensory level near the belly button, and bladder urgency all point to the thoracic spinal cord. MRI shows the cord being squeezed.',
      'Left cerebral hemisphere': 'Not quite. One hemisphere weakens the opposite side of the body, usually including the face or arm, not both legs equally. It also cannot make a horizontal sensory level across the trunk.',
      'Right cerebral hemisphere': 'Not quite. One hemisphere weakens the opposite side of the body, not both legs equally. It also cannot make a horizontal sensory level across the trunk.',
      'Brainstem': 'Not quite. A brainstem lesion that weakened both legs would usually affect cranial nerves and the arms too. Here the face and arms are normal.',
      'Peripheral nerve': 'Not quite. Nerve damage lowers reflexes. These leg reflexes are brisk, with Babinski signs, which are upper motor neuron signs.',
      'Muscle': 'Not quite. Muscle disease does not cause numbness, a sensory level, brisk reflexes, or bladder trouble.'
    }
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  // Row 1: case chooser and reset
  caseSelect = createSelect();
  for (let i = 0; i < CASES.length; i++) caseSelect.option(CASES[i].name, i);
  caseSelect.selected(0);
  caseSelect.changed(() => { currentCase = int(caseSelect.value()); resetCase(); });
  caseSelect.style('font-size', '14px');

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetCase);
  resetButton.style('font-size', '14px');

  // Rows 2-4: nine exam-step buttons in a 3 x 3 grid
  for (let i = 0; i < STEPS.length; i++) {
    const b = createButton(STEPS[i].label);
    b.style('font-size', '14px');
    b.mousePressed(() => doStep(STEPS[i].key));
    examButtons.push(b);
  }

  // Row 5: localization chooser and check
  locSelect = createSelect();
  locSelect.option('Choose a location...', '');
  for (const loc of LOCATIONS) locSelect.option(loc, loc);
  locSelect.style('font-size', '14px');

  checkButton = createButton('Check');
  checkButton.mousePressed(checkLocalization);
  checkButton.style('font-size', '14px');

  positionControls();
  resetCase();

  describe('Neuro Exam Decision Tree. The learner chooses one of three fictional patients, presses exam-step buttons such as Strength, Reflexes, or Order MRI to reveal findings in a findings panel, then chooses where the problem is (left or right cerebral hemisphere, brainstem, spinal cord, peripheral nerve, or muscle) and gets feedback explaining the reasoning.');
}

function resetCase() {
  revealed = [];
  lastKey = null;
  feedback = null;
  wrongTries = 0;
  if (locSelect) locSelect.selected('');
  updateButtonStyles();
}

function doStep(key) {
  if (!revealed.includes(key)) revealed.push(key);
  lastKey = key;
  updateButtonStyles();
}

function checkLocalization() {
  const choice = locSelect.value();
  const c = CASES[currentCase];
  if (choice === '') {
    feedback = { correct: null, text: 'Choose a location from the list first, then press Check.' };
    return;
  }
  if (revealed.length < 3) {
    feedback = { correct: null, text: 'Gather at least 3 findings before you decide. Doctors localize from a pattern, not one clue.' };
    return;
  }
  if (choice === c.answer) {
    feedback = { correct: true, text: c.reasons[choice] };
  } else {
    wrongTries++;
    let t = c.reasons[choice];
    if (wrongTries >= 2) t += ' The answer is: ' + c.answer + '. Choose it and press Check to see why.';
    feedback = { correct: false, text: t };
  }
}

// mark steps already done so the learner can see what is left
function updateButtonStyles() {
  for (let i = 0; i < STEPS.length; i++) {
    if (revealed.includes(STEPS[i].key)) {
      examButtons[i].style('background-color', 'lightsteelblue');
    } else {
      examButtons[i].style('background-color', 'white');
    }
  }
}

function positionControls() {
  const gap = 8;
  const left = 10;
  const usable = canvasWidth - 2 * left;
  // Row 1
  textSize(16);
  const caseLabelW = 50;
  const resetW = 70;
  caseSelect.position(left + caseLabelW, drawHeight + 8);
  caseSelect.size(max(120, usable - caseLabelW - resetW - gap));
  resetButton.position(canvasWidth - left - resetW, drawHeight + 6);
  resetButton.size(resetW, 26);
  // Rows 2-4: 3 x 3 grid
  const bw = floor((usable - 2 * gap) / 3);
  for (let i = 0; i < examButtons.length; i++) {
    const col = i % 3;
    const row = floor(i / 3);
    examButtons[i].position(left + col * (bw + gap), drawHeight + 41 + row * 35);
    examButtons[i].size(bw, 28);
  }
  // Row 5
  const locLabelW = 75;
  const checkW = 70;
  locSelect.position(left + locLabelW, drawHeight + 148);
  locSelect.size(max(120, usable - locLabelW - checkW - gap));
  checkButton.position(canvasWidth - left - checkW, drawHeight + 146);
  checkButton.size(checkW, 26);
}

// ---------- text helpers (manual word wrap so layout heights are exact) ----------
function wrapLines(str, w) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line === '' ? word : line + ' ' + word;
    if (textWidth(test) > w && line !== '') {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line !== '') lines.push(line);
  return lines;
}

// Build every block of text for the current state at text size ts, and return the total height
function buildLayout(ts, boxW) {
  const lh = ts + 5;
  const pad = 8;
  const innerW = boxW - 2 * pad;
  textSize(ts);
  const c = CASES[currentCase];
  const blocks = [];

  // Patient box
  textStyle(NORMAL);
  blocks.push({ kind: 'patient', header: 'Patient (fictional)', lines: wrapLines(c.patient, innerW) });

  // Findings box
  let fl = [];
  if (revealed.length === 0) {
    fl.push({ text: 'No findings yet. Choose exam steps below.', bullet: false });
  } else {
    for (const key of revealed) {
      const ls = wrapLines(c.findings[key].tag, innerW - 14);
      for (let j = 0; j < ls.length; j++) fl.push({ text: ls[j], bullet: j === 0 });
    }
  }
  blocks.push({ kind: 'findings', header: 'Findings (' + revealed.length + ' of 9 steps used)', lines: fl });

  // Detail / feedback box
  let header, body, kind;
  if (feedback) {
    kind = feedback.correct === true ? 'right' : (feedback.correct === false ? 'wrong' : 'note');
    header = feedback.correct === true ? 'Localization: correct' : (feedback.correct === false ? 'Localization: try again' : 'Hold on');
    body = feedback.text;
  } else if (lastKey) {
    kind = 'detail';
    const stepLabel = STEPS.find(s => s.key === lastKey).label;
    header = 'Latest: ' + stepLabel;
    body = c.findings[lastKey].detail;
  } else {
    kind = 'detail';
    header = 'How to play';
    body = 'Think like a doctor: Where is the problem? Run at least 3 exam steps, then pick a location and press Check.';
  }
  blocks.push({ kind: kind, header: header, lines: wrapLines(body, innerW) });

  // heights
  let total = 0;
  for (const b of blocks) {
    b.h = pad + lh + b.lines.length * lh + pad;
    total += b.h + 8;
  }
  return { blocks: blocks, total: total, lh: lh, pad: pad };
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 500 ? 20 : 24);
  text('Neuro Exam Decision Tree', canvasWidth / 2, 8);

  // Instruction line (wrapped)
  textStyle(NORMAL);
  textSize(14);
  let y = canvasWidth < 500 ? 36 : 40;
  const instr = wrapLines('Pick a case, press exam buttons to collect findings, then choose where the problem is and press Check.', canvasWidth - 30);
  fill('dimgray');
  for (const l of instr) { noStroke(); text(l, canvasWidth / 2, y); y += 18; }
  y += 6;

  // Choose the largest text size (16 down to 14) whose layout fits the drawing region
  const boxX = 10;
  const boxW = canvasWidth - 20;
  let L;
  for (let ts = 16; ts >= 14; ts--) {
    L = buildLayout(ts, boxW);
    if (y + L.total <= drawHeight - 4) break;
  }

  textAlign(LEFT, TOP);
  for (const b of L.blocks) {
    // box style carries meaning: correct, incorrect, note, or neutral
    let bg = 'white', border = 'silver', headColor = 'black';
    if (b.kind === 'right') { bg = 'honeydew'; border = 'seagreen'; headColor = 'darkgreen'; }
    if (b.kind === 'wrong') { bg = 'mistyrose'; border = 'firebrick'; headColor = 'darkred'; }
    if (b.kind === 'note') { bg = 'lightyellow'; border = 'goldenrod'; headColor = 'saddlebrown'; }
    if (b.kind === 'detail') { bg = 'ivory'; border = 'steelblue'; headColor = 'midnightblue'; }
    stroke(border);
    strokeWeight(b.kind === 'right' || b.kind === 'wrong' ? 2 : 1);
    fill(bg);
    rect(boxX, y, boxW, b.h, 10);
    strokeWeight(1);

    let ty = y + L.pad;
    noStroke();
    fill(headColor);
    textStyle(BOLD);
    text(b.header, boxX + L.pad, ty);
    ty += L.lh;
    textStyle(NORMAL);
    fill('black');
    for (const ln of b.lines) {
      noStroke();
      if (b.kind === 'findings' && typeof ln === 'object') {
        if (ln.bullet) text('•', boxX + L.pad, ty);
        text(ln.text, boxX + L.pad + 14, ty);
      } else {
        text(ln, boxX + L.pad, ty);
      }
      ty += L.lh;
    }
    y += b.h + 8;
  }

  // Control-area labels
  fill('black');
  noStroke();
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Case:', 10, drawHeight + 19);
  text('Location:', 10, drawHeight + 159);
  textStyle(NORMAL);
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
