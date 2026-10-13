// Clickable Brain Atlas MicroSim
// CANVAS_HEIGHT = 680 (drawHeight 600 + controlHeight 80)
// Use iframe height = 682 for every page that embeds this MicroSim.
// A stylized, procedurally drawn human brain in two views:
//   1. Lateral view (seen from the left side, front of the head facing left)
//   2. Midsagittal view (the brain cut down the midline, front facing left)
// Hover over a region to highlight it, click it to read its main jobs,
// what happens if it is damaged, and a Brain Bee fact.
// "Quiz me" mode names a structure and the student clicks it.
// Shapes are stylized, but every region sits in its correct anatomical position.
// MicroSim template version 2026.03 (structure copied from bouncing-ball.js)

// ---------- global layout variables (standard MicroSim names) ----------
let containerWidth;          // calculated from the <main> container
let canvasWidth = 400;       // responsive width
let drawHeight = 600;        // fixed drawing region height
let controlHeight = 80;      // two rows of controls: (2 x 35) + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 160;  // kept for template consistency (this sim has no sliders)
let defaultTextSize = 16;

// ---------- controls ----------
let viewSelect;
let labelCheckbox;
let quizButton;
let nextButton;

// ---------- application state ----------
let currentView = 'lateral';
let hoveredId = null;
let selectedId = null;
let quizMode = false;
let quizOrder = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let quizFeedback = '';
let quizCorrectFlag = false;
let quizClickedId = null;

// brain drawing box (pixels), recomputed every frame
let box = { x: 0, y: 0, w: 100, h: 100, s: 1, ox: 0, oy: 0 };
let panel = { x: 0, y: 0, w: 100, h: 100 };
let panelTextBottom = 0; // lowest y used by panel text (lets us check that text fits)

// Brain coordinates are in "units": x from -2 to 102 (front = left), y from -8 to 95 (top = up)
const UNIT_X0 = -2, UNIT_X1 = 102, UNIT_Y0 = -8, UNIT_Y1 = 95;

// ======================================================================
// REGION CONTENT (every fact is logged in logs/04-factcheck.md)
// ======================================================================
const INFO = {
  prefrontal: {
    name: 'Prefrontal cortex',
    jobs: 'The front part of the frontal lobe. Plans ahead, weighs choices, holds information in mind, controls impulses, and shapes personality and social behavior.',
    damage: 'Poor planning and judgment and impulsive or socially inappropriate behavior, even when strength and senses are normal.',
    fact: 'Studies of Phineas Gage\'s actual skull place his 1848 injury in the left frontal lobe only.'
  },
  frontal: {
    name: 'Frontal lobe (motor areas)',
    jobs: 'The largest lobe. Its back strip, just in front of the central sulcus, is the primary motor cortex, which commands voluntary movement. The front part is the prefrontal cortex.',
    damage: 'Weakness or paralysis on the opposite side of the body. Damage to Broca\'s area (left side) makes speaking slow and effortful.',
    fact: 'The primary motor cortex sits on the precentral gyrus, the ridge just in front of the central sulcus.'
  },
  parietal: {
    name: 'Parietal lobe',
    jobs: 'Touch, pain, temperature, and body position. The primary somatosensory cortex lies just behind the central sulcus. Also tracks where things are around you.',
    damage: 'Numbness on the opposite side of the body. Right parietal damage often causes neglect: the person ignores the left side of space.',
    fact: 'The primary somatosensory cortex sits on the postcentral gyrus, the ridge just behind the central sulcus.'
  },
  temporal: {
    name: 'Temporal lobe',
    jobs: 'Hearing, understanding language, recognizing faces, and forming new memories (with the hippocampus, tucked inside it).',
    damage: 'Trouble understanding speech (left side, Wernicke\'s area), trouble recognizing faces, or trouble forming new memories.',
    fact: 'It is the second-largest lobe. The lateral (Sylvian) fissure separates it from the frontal and parietal lobes.'
  },
  occipital: {
    name: 'Occipital lobe',
    jobs: 'Vision. The primary visual cortex at the very back of the brain receives signals from the eyes after a stop in the thalamus.',
    damage: 'Loss of part of the visual field, even when both eyes are perfectly healthy.',
    fact: 'The lobe that processes vision is the one farthest from your eyes.'
  },
  cerebellum: {
    name: 'Cerebellum',
    jobs: 'Coordinates smooth, well-timed movement and balance, and helps you learn motor skills like a soccer kick or a dance step.',
    damage: 'Clumsy, poorly aimed movements and unsteady walking (ataxia) on the SAME side of the body as the damage.',
    fact: 'The cerebellum is only about 10% of brain volume but holds roughly 80% of the brain\'s neurons.'
  },
  brainstem: {
    name: 'Brainstem',
    jobs: 'Connects the brain to the spinal cord. Controls breathing, heart rate, blood pressure, swallowing, and alertness. Ten of the 12 cranial nerves attach here.',
    damage: 'Can be life-threatening: trouble breathing, loss of consciousness, and problems moving the eyes, face, or throat.',
    fact: 'Its three parts, from top to bottom, are the midbrain, the pons, and the medulla oblongata.'
  },
  spinal: {
    name: 'Spinal cord',
    jobs: 'Carries touch and pain messages up to the brain and movement commands down to muscles. Runs simple reflexes on its own.',
    damage: 'Loss of movement and feeling below the level of the injury.',
    fact: '31 pairs of spinal nerves branch off it. In the cord, gray matter is in the center and white matter outside, the reverse of the cerebrum.'
  },
  centralSulcus: {
    name: 'Central sulcus (landmark)',
    jobs: 'A deep groove that divides the frontal lobe (in front) from the parietal lobe (behind).',
    damage: 'Injury here hits the movement strip in front and the touch strip behind it, causing weakness and numbness on the opposite side.',
    fact: 'Movement in front, feeling behind: motor cortex is just anterior to it and somatosensory cortex just posterior.'
  },
  lateralSulcus: {
    name: 'Lateral sulcus (landmark)',
    jobs: 'A deep fissure that separates the temporal lobe (below) from the frontal and parietal lobes (above).',
    damage: 'This area is fed by the middle cerebral artery. Strokes here often affect language (left side) and movement and feeling of the face and arm.',
    fact: 'Also called the Sylvian fissure. A hidden lobe of cortex, the insula, lies folded deep inside it.'
  },
  cerebrum: {
    name: 'Cerebrum (medial surface)',
    jobs: 'The inner wall of one hemisphere: gray-matter cortex on the surface, white matter underneath. This view shows the inner sides of the frontal, parietal, and occipital lobes.',
    damage: 'Depends on the spot. Damage to the inner frontal lobe, fed by the anterior cerebral artery, can weaken the opposite leg.',
    fact: 'The cerebrum makes up more than four-fifths of the brain\'s weight.'
  },
  corpusCallosum: {
    name: 'Corpus callosum',
    jobs: 'The largest bundle of axons linking the left and right hemispheres, so the two sides can share information.',
    damage: 'If it is cut (rarely, to treat severe epilepsy), "split-brain" effects appear: one hemisphere may not know what the other one sees.',
    fact: 'About 200 to 250 million axons cross here. It is white matter, colored by myelin.'
  },
  thalamus: {
    name: 'Thalamus',
    jobs: 'The brain\'s relay station. It sorts incoming sensory signals and sends each one to the right area of cortex.',
    damage: 'Loss of feeling on the opposite side of the body, because touch signals can no longer reach the cortex.',
    fact: 'Smell is the only sense that does not pass through the thalamus first.'
  },
  hypothalamus: {
    name: 'Hypothalamus',
    jobs: 'Keeps the body in balance (homeostasis): temperature, hunger, thirst, sleep, and hormones. It also helps run the autonomic nervous system.',
    damage: 'Problems controlling body temperature, appetite, thirst, sleep, or hormone levels.',
    fact: 'It is about the size of a pearl, yet it controls the pituitary, the body\'s "master gland."'
  },
  pituitary: {
    name: 'Pituitary gland',
    jobs: 'Releases hormones that control growth, the stress response, the thyroid, and reproduction, following orders from the hypothalamus.',
    damage: 'Hormone imbalances. A pituitary tumor can press on the nearby crossing of the optic nerves and cause vision loss (Chapter 5).',
    fact: 'Its back half (the posterior pituitary) develops from the same embryonic region as the hypothalamus.'
  },
  midbrain: {
    name: 'Midbrain',
    jobs: 'Top part of the brainstem. Helps control eye movements and visual and hearing reflexes. Contains the substantia nigra, whose dopamine neurons help start movement.',
    damage: 'Eye movement problems. Loss of dopamine neurons in the substantia nigra causes most of the movement symptoms of Parkinson\'s disease (Chapter 7).',
    fact: 'Substantia nigra is Latin for "black substance," named for the dark pigment in its neurons.'
  },
  pons: {
    name: 'Pons',
    jobs: 'Middle part of the brainstem. Links the cerebrum with the cerebellum and helps regulate breathing and sleep. Its cranial nerves serve the face, chewing, and eye movement.',
    damage: 'Weakness, trouble with facial movement, chewing, or eye movements, and disordered breathing. Large injuries can be fatal.',
    fact: 'Pons is Latin for "bridge."'
  },
  medulla: {
    name: 'Medulla oblongata',
    jobs: 'Bottom part of the brainstem. Runs vital functions: breathing, heart rate, and blood pressure, plus swallowing, coughing, and vomiting.',
    damage: 'Life-threatening: breathing can stop and heart rate and blood pressure can fail.',
    fact: 'At the bottom of the medulla, about 90% of the main motor axons cross sides. That is why each hemisphere moves the opposite side of the body.'
  },
  fourthVentricle: {
    name: 'Fourth ventricle',
    jobs: 'A fluid-filled space between the brainstem and cerebellum. Cerebrospinal fluid (CSF) flows through it on its way to bathe the brain and spinal cord.',
    damage: 'A blockage here can trap CSF, swelling the ventricles (hydrocephalus) and raising pressure on the brain.',
    fact: 'There are four ventricles: two lateral, the third, and the fourth. They hold only about 25 mL of the body\'s roughly 150 mL of CSF.'
  }
};

// Midsagittal cerebellum gets a different Brain Bee fact
const CEREBELLUM_MID_FACT = 'Cut down the middle, its white matter branches like a tree. Anatomists call it the arbor vitae, Latin for "tree of life."';

// ======================================================================
// GEOMETRY (all in brain units; front of head = left)
// ======================================================================

// Catmull-Rom smoothing of a closed loop of control points -> dense polygon
function smoothClosed(pts, segs) {
  let out = [];
  let n = pts.length;
  for (let i = 0; i < n; i++) {
    let p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    for (let t = 0; t < 1; t += 1 / segs) {
      let t2 = t * t, t3 = t2 * t;
      let x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      let y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([x, y]);
    }
  }
  return out;
}

function ellipsePoly(cx, cy, rx, ry, n) {
  let out = [];
  for (let i = 0; i < n; i++) {
    let a = TWO_PI * i / n;
    out.push([cx + rx * cos(a), cy + ry * sin(a)]);
  }
  return out;
}

// ---- Lateral view ----
const LAT_CEREBRUM_CTRL = [[8, 36], [10, 24], [17, 14], [28, 7], [42, 3.5], [56, 3.5], [70, 7], [82, 14], [91, 24], [95, 35], [93, 45], [86, 51], [76, 56], [62, 60], [45, 60], [32, 57], [25.5, 52], [22.5, 47.5], [16, 46.5], [10, 43]];
const LAT_CEREBELLUM_CTRL = [[66, 58], [74, 55], [84, 52], [92, 53], [96, 58], [94, 65], [86, 70], [76, 71], [68, 68], [64, 63]];
const LAT_BRAINSTEM_CTRL = [[51, 57], [60, 57], [64, 61], [63, 68], [61, 75], [60.5, 82], [55.5, 82], [55, 75], [52, 68], [50, 62]];
const LAT_SPINAL = [[55.6, 80], [60.4, 80], [59.8, 94], [56.2, 94]];

// Sulcus / boundary polylines
const CENTRAL_SULCUS = [[54.5, 4.8], [52, 10], [49.5, 18], [47, 26], [44.5, 33], [42.5, 38.5]];
const LATERAL_SULCUS = [[22.5, 46.5], [30, 43], [40, 40.5], [50, 38], [60, 35], [64, 31.5]];
const PREFRONTAL_LINE = [[37, 3], [34, 20], [31, 42.7]];
const PARIETO_OCC_LINE = [[80, 8], [80, 30], [79, 40], [79, 54]];
const TEMPORO_PAR_LINE = [[64, 31.5], [72, 36], [79, 40]];

// Clip polygons: each lobe = cerebrum silhouette INSIDE its clip polygon
const CLIP_PREFRONTAL = [[-20, -20], [37, -20], [37, 3], [34, 20], [31, 42.7], [22.5, 46.5], [15, 49], [-20, 49]];
const CLIP_FRONTAL = [[37, -20], [57, -20], [55, 2.5], [52, 10], [49.5, 18], [47, 26], [44.5, 33], [42.5, 38.5], [41, 40.25], [40, 40.5], [31, 42.7], [34, 20], [37, 3]];
const CLIP_PARIETAL = [[57, -20], [80, -20], [80, 8], [80, 30], [79, 40], [72, 36], [64, 31.5], [60, 35], [50, 38], [41, 40.25], [42.5, 38.5], [44.5, 33], [47, 26], [49.5, 18], [52, 10], [55, 2.5]];
const CLIP_TEMPORAL = [[22.5, 46.5], [30, 43], [40, 40.5], [41, 40.25], [50, 38], [60, 35], [64, 31.5], [72, 36], [79, 40], [79, 54], [79, 100], [-20, 100], [-20, 49], [15, 49]];
const CLIP_OCCIPITAL = [[80, -20], [130, -20], [130, 100], [79, 100], [79, 54], [79, 40], [80, 30], [80, 8]];

// Decorative gyri (non-clickable) for realism
const LAT_FOLIA = [[[70, 60], [80, 57], [92, 57]], [[68, 64], [80, 62], [94, 62]], [[70, 68], [82, 67], [91, 66]]];
const LAT_GYRI = [
  [[18, 18], [24, 22], [30, 18]], [[14, 32], [21, 30], [27, 34]], [[60, 10], [64, 18], [70, 16]],
  [[62, 24], [68, 28], [74, 24]], [[84, 22], [88, 30], [86, 38]], [[34, 50], [44, 48], [55, 49], [66, 47]]
];

// ---- Midsagittal view ----
const MID_CEREBRUM_CTRL = [[8, 36], [10, 24], [17, 14], [28, 7], [42, 3.5], [56, 3.5], [70, 7], [82, 14], [91, 24], [95, 35], [93, 45], [86, 50], [74, 51], [64, 49], [60, 42], [50, 41], [44, 42], [38, 44], [28, 47], [18, 47], [11, 43]];
const MID_CC_CTRL = [[27, 33], [29, 26], [36, 21.5], [48, 19.5], [60, 20], [69, 22.5], [73.5, 28], [72.5, 32.5], [69.5, 32.5], [67, 28.5], [61, 24.3], [50, 23.6], [38, 25], [33, 29], [31.5, 33.5], [30, 36.5], [28, 36.5]];
const MID_HYPO_CTRL = [[41, 37.5], [46, 38], [47.5, 42], [45.5, 46], [41.5, 46], [39, 42]];
const MID_MIDBRAIN = [[48.5, 39.5], [60.5, 39.5], [61.2, 46], [49.5, 46.6]];
const MID_PONS_CTRL = [[49.5, 46.6], [61.2, 46], [62.2, 51], [60.2, 56], [52, 57.6], [47, 54.5], [47, 49]];
const MID_MEDULLA = [[52, 57.6], [60.2, 56], [59.6, 65], [54.2, 65.5]];
const MID_SPINAL = [[54.2, 65.5], [59.6, 65], [59.1, 92], [55.1, 92]];
const MID_V4 = [[61.6, 47.5], [67.5, 53], [60.8, 58.5]];
const MID_CEREBELLUM_CTRL = [[64, 50.5], [72, 51.5], [82, 51.5], [90, 53], [94, 59], [90, 66], [80, 70], [70, 69], [63, 64], [61.5, 59.5], [67.5, 53]];
const MID_GYRI = [
  [[16, 20], [24, 18], [30, 12]], [[40, 10], [50, 12], [58, 9]], [[66, 12], [74, 18], [80, 16]],
  [[84, 28], [88, 36], [84, 44]], [[14, 34], [20, 38], [24, 34]]
];
const ARBOR = [[[70, 59], [78, 56]], [[70, 59], [80, 61]], [[70, 59], [77, 66]], [[78, 56], [86, 55]], [[80, 61], [88, 60]], [[77, 66], [84, 66]]];

// Dense polygons, built in setup()
let geo = {};

function buildBrainShapes() {
  geo.latCerebrum = smoothClosed(LAT_CEREBRUM_CTRL, 8);
  geo.latCerebellum = smoothClosed(LAT_CEREBELLUM_CTRL, 8);
  geo.latBrainstem = smoothClosed(LAT_BRAINSTEM_CTRL, 8);
  geo.midCerebrum = smoothClosed(MID_CEREBRUM_CTRL, 8);
  geo.midCC = smoothClosed(MID_CC_CTRL, 8);
  geo.midThal = ellipsePoly(54, 34, 7.5, 4.6, 40);
  geo.midHypo = smoothClosed(MID_HYPO_CTRL, 8);
  geo.midPit = ellipsePoly(43.6, 51.2, 2.6, 2.0, 24);
  geo.midPons = smoothClosed(MID_PONS_CTRL, 8);
  geo.midCerebellum = smoothClosed(MID_CEREBELLUM_CTRL, 8);
}

// Region lists for each view. order = hit-test priority (first match wins)
// type: 'lobe' (silhouette clipped), 'poly', 'line'
function regionsFor(view) {
  if (view === 'lateral') {
    return [
      { id: 'centralSulcus', type: 'line', pts: CENTRAL_SULCUS, label: [66, -4], anchor: [53.5, 6], align: 'center' },
      { id: 'lateralSulcus', type: 'line', pts: LATERAL_SULCUS, label: [-1, 53], anchor: [24, 45.6], align: 'left' },
      { id: 'prefrontal', type: 'lobe', clip: CLIP_PREFRONTAL, color: 'lightsalmon', label: [19, 28], lines: ['Prefrontal', 'cortex'] },
      { id: 'frontal', type: 'lobe', clip: CLIP_FRONTAL, color: 'sandybrown', label: [41, 22], lines: ['Frontal', 'lobe'] },
      { id: 'parietal', type: 'lobe', clip: CLIP_PARIETAL, color: 'lightskyblue', label: [65, 20], lines: ['Parietal', 'lobe'] },
      { id: 'temporal', type: 'lobe', clip: CLIP_TEMPORAL, color: 'lightgreen', label: [55, 52], lines: ['Temporal lobe'] },
      { id: 'occipital', type: 'lobe', clip: CLIP_OCCIPITAL, color: 'plum', label: [87.5, 37], lines: ['Occipital', 'lobe'] },
      { id: 'cerebellum', type: 'poly', pts: geo.latCerebellum, color: 'khaki', label: [82, 63], lines: ['Cerebellum'] },
      { id: 'brainstem', type: 'poly', pts: geo.latBrainstem, color: 'burlywood', label: [26, 74], anchor: [55, 70], align: 'left', lines: ['Brainstem'] },
      { id: 'spinal', type: 'poly', pts: LAT_SPINAL, color: 'wheat', label: [26, 88], anchor: [56.5, 88], align: 'left', lines: ['Spinal cord'] }
    ];
  }
  return [
    { id: 'fourthVentricle', type: 'poly', pts: MID_V4, color: 'deepskyblue', label: [72, 82], anchor: [63.5, 53], align: 'left', lines: ['Fourth ventricle'] },
    { id: 'pituitary', type: 'poly', pts: geo.midPit, color: 'pink', label: [2, 62], anchor: [41.5, 51.5], align: 'left', lines: ['Pituitary gland'] },
    { id: 'hypothalamus', type: 'poly', pts: geo.midHypo, color: 'orchid', label: [2, 55], anchor: [40.5, 43], align: 'left', lines: ['Hypothalamus'] },
    { id: 'thalamus', type: 'poly', pts: geo.midThal, color: 'lightskyblue', label: [54, 34], lines: ['Thalamus'] },
    { id: 'corpusCallosum', type: 'poly', pts: geo.midCC, color: 'ghostwhite', label: [40, 13], anchor: [44, 20], align: 'center', lines: ['Corpus callosum'] },
    { id: 'midbrain', type: 'poly', pts: MID_MIDBRAIN, color: 'sandybrown', label: [2, 69], anchor: [50, 43], align: 'left', lines: ['Midbrain'] },
    { id: 'pons', type: 'poly', pts: geo.midPons, color: 'burlywood', label: [2, 76], anchor: [48.5, 52], align: 'left', lines: ['Pons'] },
    { id: 'medulla', type: 'poly', pts: MID_MEDULLA, color: 'tan', label: [2, 83], anchor: [54, 61], align: 'left', lines: ['Medulla'] },
    { id: 'spinal', type: 'poly', pts: MID_SPINAL, color: 'wheat', label: [2, 90], anchor: [55.5, 84], align: 'left', lines: ['Spinal cord'] },
    { id: 'cerebellum', type: 'poly', pts: geo.midCerebellum, color: 'khaki', label: [84, 63], lines: ['Cerebellum'] },
    { id: 'cerebrum', type: 'poly', pts: geo.midCerebrum, color: 'mistyrose', label: [84, 37], lines: ['Cerebrum'] }
  ];
}

// draw order (back to front) for each view
const LAT_DRAW = ['spinal', 'brainstem', 'cerebellum', 'prefrontal', 'frontal', 'parietal', 'temporal', 'occipital', 'centralSulcus', 'lateralSulcus'];
const MID_DRAW = ['spinal', 'cerebellum', 'cerebrum', 'corpusCallosum', 'thalamus', 'hypothalamus', 'pituitary', 'midbrain', 'pons', 'medulla', 'fourthVentricle'];

// ======================================================================
// SETUP
// ======================================================================
function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);
  buildBrainShapes();

  // Row 1: view select + labels checkbox
  viewSelect = createSelect();
  viewSelect.option('Lateral view (side)', 'lateral');
  viewSelect.option('Midsagittal view (cut down the middle)', 'midsagittal');
  viewSelect.selected('lateral');
  viewSelect.position(60, drawHeight + 8);
  viewSelect.changed(changeView);

  labelCheckbox = createCheckbox('Show labels', true);
  labelCheckbox.position(10, drawHeight + 48);

  // Row 2: quiz controls
  quizButton = createButton('Quiz me');
  quizButton.position(130, drawHeight + 45);
  quizButton.mousePressed(toggleQuiz);

  nextButton = createButton('Next question');
  nextButton.position(210, drawHeight + 45);
  nextButton.mousePressed(nextQuestion);
  nextButton.hide();

  describe('Clickable brain atlas. A stylized human brain is shown in a lateral (side) view or a midsagittal (cut down the middle) view. Hovering over a region highlights it; clicking shows the region name, its main jobs, what happens if it is damaged, and a Brain Bee fact. A quiz mode names a structure and checks whether the student clicks the correct region.');
}

// ======================================================================
// DRAW
// ======================================================================
function draw() {
  updateCanvasSize();

  // drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control region
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);

  computeLayout();

  // title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  textStyle(BOLD);
  text('Clickable Brain Atlas', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // instruction line
  textSize(15);
  fill('dimgray');
  noStroke();
  let instr = quizMode ? 'Quiz: click the structure named in the panel. Labels are hidden.'
                       : 'Hover to highlight. Click a region to learn its jobs.';
  text(instr, canvasWidth / 2, 38);

  // hover detection (only inside drawing area)
  hoveredId = null;
  if (mouseY >= 0 && mouseY < drawHeight && mouseX >= 0 && mouseX < canvasWidth) {
    let u = toUnits(mouseX, mouseY);
    hoveredId = hitTest(u[0], u[1]);
  }

  drawBrain();
  drawCompass();
  if (labelCheckbox.checked() && !quizMode) drawLabels();
  drawPanel();
  if (hoveredId && !quizMode) drawTooltip(INFO[hoveredId].name);

  // control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('View:', 10, drawHeight + 18);
  if (quizMode) {
    textSize(15);
    let nx = 210 + nextButton.elt.offsetWidth + 12;
    text('Score: ' + quizScore + ' / ' + (quizIndex + (quizAnswered ? 1 : 0)), nx, drawHeight + 57);
  }
  cursor(hoveredId ? HAND : ARROW);
}

function computeLayout() {
  let top = 62;
  if (canvasWidth >= 700) {
    let bw = canvasWidth * 0.6;
    setBox(10, top, bw - 20, drawHeight - top - 40);
    panel = { x: bw, y: top, w: canvasWidth - bw - 12, h: drawHeight - top - 12 };
  } else {
    let bh = canvasWidth >= 400 ? 262 : 236; // shorter brain area on phones leaves room for the info panel
    setBox(10, top, canvasWidth - 20, bh);
    panel = { x: 10, y: top + bh + 26, w: canvasWidth - 20, h: drawHeight - (top + bh + 26) - 8 };
  }
}

function setBox(x, y, w, h) {
  let s = min(w / (UNIT_X1 - UNIT_X0), h / (UNIT_Y1 - UNIT_Y0));
  let usedW = s * (UNIT_X1 - UNIT_X0);
  let usedH = s * (UNIT_Y1 - UNIT_Y0);
  box = { x: x, y: y, w: w, h: h, s: s, ox: x + (w - usedW) / 2 - UNIT_X0 * s, oy: y + (h - usedH) / 2 - UNIT_Y0 * s };
}

function toPx(ux, uy) { return [box.ox + ux * box.s, box.oy + uy * box.s]; }
function toUnits(px, py) { return [(px - box.ox) / box.s, (py - box.oy) / box.s]; }

// ---------- brain drawing ----------
function drawBrain() {
  let regs = regionsFor(currentView);
  let byId = {};
  for (let r of regs) byId[r.id] = r;
  let order = currentView === 'lateral' ? LAT_DRAW : MID_DRAW;
  let silhouette = currentView === 'lateral' ? geo.latCerebrum : null;

  for (let id of order) {
    let r = byId[id];
    if (r.type === 'line') continue; // lines drawn after fills
    let fc = regionFill(r);
    if (r.type === 'lobe') {
      drawingContext.save();
      clipTo(r.clip);
      fill(fc);
      stroke('dimgray');
      strokeWeight(1.5);
      drawPoly(silhouette);
      drawingContext.restore();
    } else {
      fill(fc);
      stroke('dimgray');
      strokeWeight(1.5);
      drawPoly(r.pts);
    }
    // midsagittal decorations right after the shape they decorate
    if (currentView === 'midsagittal' && id === 'cerebellum') drawLines(ARBOR, 'white', 2.5);
    if (currentView === 'lateral' && id === 'cerebellum') drawLines(LAT_FOLIA, 'darkkhaki', 1.5);
    if (currentView === 'midsagittal' && id === 'cerebrum') drawLines(MID_GYRI, 'rosybrown', 1.5);
    if (currentView === 'midsagittal' && id === 'pituitary') {
      stroke('dimgray'); strokeWeight(2);
      let a = toPx(43.3, 46), b = toPx(43.6, 49.3);
      line(a[0], a[1], b[0], b[1]);
    }
  }

  if (currentView === 'lateral') {
    // internal lobe boundaries that are not sulci (drawn dashed: they are imaginary lines)
    drawingContext.setLineDash([5, 4]);
    drawLines([PREFRONTAL_LINE, PARIETO_OCC_LINE, TEMPORO_PAR_LINE], 'gray', 1.5);
    drawingContext.setLineDash([]);
    drawLines(LAT_GYRI, 'gray', 1.2);
    // silhouette outline on top
    noFill(); stroke('dimgray'); strokeWeight(2);
    drawPoly(geo.latCerebrum);
    // sulci (clickable landmarks)
    for (let id of ['centralSulcus', 'lateralSulcus']) {
      let r = byId[id];
      let col = 'black';
      let w = 3.5;
      if (id === hoveredId && !quizMode) { col = 'darkorange'; w = 6; }
      if (id === selectedId && !quizMode) { col = 'darkorange'; w = 6; }
      if (quizMode && quizAnswered && id === quizOrder[quizIndex]) { col = 'darkorange'; w = 6; }
      if (quizMode && id === hoveredId && !quizAnswered) { w = 6; }
      drawOpenLine(r.pts, col, w);
    }
  }
}

function regionFill(r) {
  // quiz feedback colors take priority
  if (quizMode && quizAnswered) {
    let target = quizOrder[quizIndex];
    if (r.id === target) return 'gold';
    if (r.id === quizClickedId && !quizCorrectFlag) return 'lightgray';
    return r.color;
  }
  if (r.id === hoveredId) return 'gold';
  if (!quizMode && r.id === selectedId) return 'orange';
  return r.color;
}

function clipTo(poly) {
  drawingContext.beginPath();
  for (let i = 0; i < poly.length; i++) {
    let p = toPx(poly[i][0], poly[i][1]);
    if (i === 0) drawingContext.moveTo(p[0], p[1]); else drawingContext.lineTo(p[0], p[1]);
  }
  drawingContext.closePath();
  drawingContext.clip();
}

function drawPoly(pts) {
  beginShape();
  for (let p of pts) { let q = toPx(p[0], p[1]); vertex(q[0], q[1]); }
  endShape(CLOSE);
}

function drawOpenLine(pts, col, w) {
  noFill(); stroke(col); strokeWeight(w);
  beginShape();
  for (let p of pts) { let q = toPx(p[0], p[1]); curveVertex(q[0], q[1]); if (p === pts[0] || p === pts[pts.length - 1]) curveVertex(q[0], q[1]); }
  endShape();
}

function drawLines(list, col, w) {
  for (let pts of list) drawOpenLine(pts, col, w);
}

function drawCompass() {
  // Anatomical directions, drawn under the brain
  let y = box.y + box.h + 14;
  let cx = box.x + box.w / 2;
  fill('dimgray'); noStroke();
  textSize(14); textAlign(CENTER, CENTER);
  let t = currentView === 'lateral' ? 'Left side of the brain.  ← Anterior (front)    Posterior (back) →'
                                    : 'Right half, seen from the middle.  ← Anterior    Posterior →';
  if (canvasWidth < 520) t = '← Anterior (front)    Posterior (back) →';
  text(t, cx, y);
}

function drawLabels() {
  let regs = regionsFor(currentView);
  textSize(14);
  for (let r of regs) {
    if (!r.label) continue;
    let lines = r.lines || [INFO[r.id].name.replace(' (landmark)', '')];
    let p = toPx(r.label[0], r.label[1]);
    let align = r.align || 'center';
    let lh = 16;
    let wmax = 0;
    for (let s of lines) wmax = max(wmax, textWidth(s));
    let bx = align === 'left' ? p[0] - 3 : p[0] - wmax / 2 - 3;
    let by = p[1] - (lines.length * lh) / 2 - 1;
    if (r.anchor) {
      let a = toPx(r.anchor[0], r.anchor[1]);
      stroke('black'); strokeWeight(1);
      let lx = align === 'left' ? bx + wmax + 6 : p[0];
      let ly = align === 'left' ? p[1] : by + lines.length * lh + 2;
      if (r.id === 'centralSulcus' || r.id === 'corpusCallosum') ly = by + lines.length * lh + 2;
      line(lx, ly, a[0], a[1]);
      noStroke(); fill('black'); circle(a[0], a[1], 4);
    }
    noStroke();
    fill(255, 255, 255, 215);
    rect(bx, by, wmax + 6, lines.length * lh + 2, 4);
    fill('black');
    noStroke();
    textAlign(align === 'left' ? LEFT : CENTER, TOP);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], align === 'left' ? bx + 3 : p[0], by + 1 + i * lh);
    }
  }
}

function drawTooltip(s) {
  textSize(15);
  let w = textWidth(s) + 12;
  let x = constrain(mouseX + 14, 2, canvasWidth - w - 2);
  let y = constrain(mouseY - 30, 60, drawHeight - 26);
  fill('black'); noStroke();
  rect(x, y, w, 24, 5);
  fill('white'); noStroke();
  textAlign(LEFT, CENTER);
  text(s, x + 6, y + 12);
}

// ---------- info panel ----------
function drawPanel() {
  fill(255, 255, 255, 235);
  stroke('silver'); strokeWeight(1);
  rect(panel.x, panel.y, panel.w, panel.h, 10);
  let x = panel.x + 12, y = panel.y + 10, w = panel.w - 24;
  let bodySize = canvasWidth >= 700 ? 15 : 14;
  let lh = bodySize + 4;

  if (quizMode) {
    drawQuizPanel(x, y, w, bodySize, lh);
    return;
  }
  if (!selectedId) {
    fill('black'); noStroke(); textAlign(LEFT, TOP);
    textSize(18); textStyle(BOLD);
    text('Info panel', x, y);
    textStyle(NORMAL); textSize(bodySize);
    y += 28;
    y = wrapText('Click any colored region (or the black groove lines in the side view) to see its name, main jobs, what happens if it is damaged, and a Brain Bee fact.', x, y, w, lh);
    y += 8;
    y = wrapText('Use the View menu to switch between the side view and the midline cut. Press "Quiz me" to test yourself.', x, y, w, lh);
    return;
  }
  let info = INFO[selectedId];
  fill('black'); noStroke(); textAlign(LEFT, TOP);
  textSize(18); textStyle(BOLD);
  y = wrapText(info.name, x, y, w, 22);
  y += 6;
  textSize(bodySize);
  let fact = (selectedId === 'cerebellum' && currentView === 'midsagittal') ? CEREBELLUM_MID_FACT : info.fact;
  y = section('Main jobs: ', info.jobs, x, y, w, lh, 'black');
  y = section('If damaged: ', info.damage, x, y + 6, w, lh, 'firebrick');
  y = section('Brain Bee fact: ', fact, x, y + 6, w, lh, 'navy');
  panelTextBottom = y;
}

function section(head, body, x, y, w, lh, col) {
  noStroke();
  fill(col);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(head, x, y);
  let hw = textWidth(head);
  textStyle(NORMAL);
  fill('black');
  return wrapText(body, x, y, w, lh, hw);
}

// word-wraps text; firstIndent lets the first line start after a bold heading
function wrapText(str, x, y, w, lh, firstIndent) {
  firstIndent = firstIndent || 0;
  let words = str.split(' ');
  let line = '';
  let indent = firstIndent;
  noStroke();
  textAlign(LEFT, TOP);
  for (let i = 0; i < words.length; i++) {
    let test = line.length ? line + ' ' + words[i] : words[i];
    if (textWidth(test) > w - indent && line.length) {
      text(line, x + indent, y);
      y += lh;
      line = words[i];
      indent = 0;
    } else {
      line = test;
    }
  }
  if (line.length) { text(line, x + indent, y); y += lh; }
  return y;
}

function drawQuizPanel(x, y, w, bodySize, lh) {
  fill('black'); noStroke(); textAlign(LEFT, TOP);
  textSize(18); textStyle(BOLD);
  if (quizIndex >= quizOrder.length) {
    text('Quiz complete!', x, y);
    textStyle(NORMAL); textSize(bodySize);
    y += 28;
    wrapText('You got ' + quizScore + ' of ' + quizOrder.length + ' correct. Press "Quiz me" twice to try again, or switch views to quiz the other view.', x, y, w, lh);
    return;
  }
  text('Question ' + (quizIndex + 1) + ' of ' + quizOrder.length, x, y);
  textStyle(NORMAL);
  y += 30;
  textSize(bodySize);
  text('Click the:', x, y);
  y += lh + 2;
  textSize(20); textStyle(BOLD); fill('navy');
  y = wrapText(quizName(quizOrder[quizIndex]), x, y, w, 24);
  textStyle(NORMAL); textSize(bodySize);
  y += 10;
  if (quizAnswered) {
    fill(quizCorrectFlag ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    text(quizCorrectFlag ? 'Correct!' : 'Not quite.', x, y);
    textStyle(NORMAL);
    y += lh + 4;
    fill('black');
    y = wrapText(quizFeedback, x, y, w, lh);
    y += 6;
    fill('dimgray');
    wrapText('The correct structure is highlighted in gold. Press "Next question".', x, y, w, lh);
  } else {
    fill('dimgray');
    wrapText('You get one try per question. Hovering outlines a region but does not name it.', x, y, w, lh);
  }
}

function quizName(id) {
  if (id === 'frontal') return 'Frontal lobe';
  return INFO[id].name.replace(' (landmark)', '');
}

// ======================================================================
// HIT TESTING
// ======================================================================
function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function distToPolyline(x, y, pts) {
  let best = 1e9;
  for (let i = 0; i < pts.length - 1; i++) {
    let ax = pts[i][0], ay = pts[i][1], bx = pts[i + 1][0], by = pts[i + 1][1];
    let dx = bx - ax, dy = by - ay;
    let t = constrain(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
    let px = ax + t * dx, py = ay + t * dy;
    best = min(best, dist(x, y, px, py));
  }
  return best;
}

function hitTest(ux, uy) {
  let regs = regionsFor(currentView);
  for (let r of regs) {
    if (r.type === 'line') {
      // tolerance of about 6 pixels, converted to units
      if (distToPolyline(ux, uy, r.pts) * box.s < 6) return r.id;
    } else if (r.type === 'lobe') {
      if (pointInPoly(ux, uy, geo.latCerebrum) && pointInPoly(ux, uy, r.clip)) return r.id;
    } else {
      if (pointInPoly(ux, uy, r.pts)) return r.id;
    }
  }
  return null;
}

// ======================================================================
// INTERACTION
// ======================================================================
function mousePressed() {
  if (mouseY < 0 || mouseY >= drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  let u = toUnits(mouseX, mouseY);
  let id = hitTest(u[0], u[1]);
  if (!id) return;
  if (quizMode) {
    if (quizAnswered || quizIndex >= quizOrder.length) return;
    let target = quizOrder[quizIndex];
    quizClickedId = id;
    // the prefrontal cortex is part of the frontal lobe, so it counts for "Frontal lobe"
    quizCorrectFlag = (id === target) || (target === 'frontal' && id === 'prefrontal');
    if (quizCorrectFlag) {
      quizScore++;
      quizFeedback = (id === 'prefrontal' && target === 'frontal')
        ? 'The prefrontal cortex is the front part of the frontal lobe, so that counts. ' + INFO.frontal.jobs
        : INFO[target].name.replace(' (landmark)', '') + ': ' + INFO[target].jobs;
    } else {
      quizFeedback = 'You clicked the ' + INFO[id].name.replace(' (landmark)', '').toLowerCase() + '. ' + quizHint(target);
    }
    quizAnswered = true;
  } else {
    selectedId = id;
  }
}

// hint shown after a wrong answer: where the target actually is
const QUIZ_HINTS = {
  prefrontal: 'The prefrontal cortex is the very front of the frontal lobe, behind the forehead.',
  frontal: 'The frontal lobe is everything in front of the central sulcus and above the lateral sulcus.',
  parietal: 'The parietal lobe sits behind the central sulcus, on the top and side of the brain.',
  temporal: 'The temporal lobe lies below the lateral sulcus, near your ear.',
  occipital: 'The occipital lobe is at the very back of the cerebrum.',
  cerebellum: 'The cerebellum is the folded structure tucked under the back of the cerebrum.',
  brainstem: 'The brainstem is the stalk running down from under the cerebrum toward the spinal cord.',
  spinal: 'The spinal cord continues down from the bottom of the brainstem.',
  centralSulcus: 'The central sulcus is the groove running from the top of the brain down toward the lateral sulcus, between frontal and parietal lobes.',
  lateralSulcus: 'The lateral sulcus is the long groove that runs back from the front, above the temporal lobe.',
  cerebrum: 'The cerebrum is the large outer part of the brain in this midline cut.',
  corpusCallosum: 'The corpus callosum is the C-shaped white band arching above the thalamus.',
  thalamus: 'The thalamus is the oval structure just below the corpus callosum, in the middle of the brain.',
  hypothalamus: 'The hypothalamus is just below and in front of the thalamus, above the pituitary.',
  pituitary: 'The pituitary hangs on a stalk below the hypothalamus.',
  midbrain: 'The midbrain is the top section of the brainstem, just below the thalamus.',
  pons: 'The pons is the bulging middle section of the brainstem.',
  medulla: 'The medulla is the lowest section of the brainstem, just above the spinal cord.',
  fourthVentricle: 'The fourth ventricle is the small fluid space between the brainstem and the cerebellum.'
};
function quizHint(id) { return QUIZ_HINTS[id]; }

function changeView() {
  currentView = viewSelect.value();
  selectedId = null;
  if (quizMode) startQuiz();
}

function toggleQuiz() {
  quizMode = !quizMode;
  quizButton.html(quizMode ? 'Stop quiz' : 'Quiz me');
  if (quizMode) { startQuiz(); nextButton.show(); }
  else { nextButton.hide(); }
}

function startQuiz() {
  let ids = regionsFor(currentView).map(r => r.id);
  quizOrder = shuffle(ids);
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  quizClickedId = null;
  selectedId = null;
}

function nextQuestion() {
  if (!quizMode) return;
  if (!quizAnswered) return; // must answer first
  if (quizIndex < quizOrder.length) quizIndex++;
  quizAnswered = false;
  quizClickedId = null;
}

// ======================================================================
// RESPONSIVE (must stay at the end, per MicroSim standard)
// ======================================================================
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
