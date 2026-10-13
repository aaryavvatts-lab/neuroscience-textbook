// Aphasia Sorter MicroSim (Chapter 12: Language, Attention, and Decision-Making)
// CANVAS_HEIGHT = 645  (drawHeight 560 + controlHeight 85); iframe height = 647
// The learner reads an original speech sample plus a one-line clue about
// comprehension or repetition, then sorts it into Broca's aphasia, Wernicke's
// aphasia, conduction aphasia, or normal speech. Feedback explains the clue.
// All speech samples are original, written for From Neuron to Bedside.
// Width-responsive; all text wraps to the current canvas width.

// ---- layout globals (template structure) ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 560;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

// ---- controls ----
let categoryButtons = [];
let nextButton;
let restartButton;

// ---- category definitions ----
const CATEGORIES = [
  { key: 'broca', label: "Broca's" },
  { key: 'wernicke', label: "Wernicke's" },
  { key: 'conduction', label: 'Conduction' },
  { key: 'normal', label: 'Normal' }
];

const CATEGORY_NAMES = {
  broca: "Broca's aphasia",
  wernicke: "Wernicke's aphasia",
  conduction: 'Conduction aphasia',
  normal: 'Normal speech'
};

// ---- item bank: 10 original items ----
const ITEMS = [
  {
    sample: '"Weekend... son... drive. Lake. Fish... big fish. Good... good."',
    clue: 'Clue: Follows a three-step spoken command correctly. Speaks with great effort and looks frustrated.',
    answer: 'broca',
    why: 'Short, effortful, telegraphic speech (small words like "the" and "a" are missing) with good comprehension and awareness of the problem is the pattern of Broca\'s (nonfluent) aphasia.'
  },
  {
    sample: '(Describing a picture of a park) "Dog... run. Ball... man... throw. Tree."',
    clue: 'Clue: Points to the right picture when asked "Which one is the umbrella?" His right hand is weak.',
    answer: 'broca',
    why: 'Nonfluent, telegraphic speech with relatively good comprehension, plus right-sided weakness, points to the left frontal lobe and Broca\'s aphasia.'
  },
  {
    sample: '(Asked about her old job) "Teach... school. Thirty... year. Kids... math. Love... it."',
    clue: 'Clue: Answers yes-or-no questions about simple sentences correctly. Repeating a sentence is also slow and broken.',
    answer: 'broca',
    why: 'Slow, broken speech with good comprehension is Broca\'s aphasia. Repetition is poor too, but the nonfluent speech is the key difference from conduction aphasia.'
  },
  {
    sample: '"Well I was going to the flimber this morning and the tarvy was all over the, you know, the thing, so I told them we would sort it out later on."',
    clue: 'Clue: Cannot follow "Point to the door." Seems unaware that anything is wrong.',
    answer: 'wernicke',
    why: 'Fluent speech with normal rhythm but made-up words (neologisms like "flimber"), poor comprehension, and no awareness of errors is Wernicke\'s (fluent) aphasia.'
  },
  {
    sample: '(Describing a picture of a park) "Oh yes, that\'s the doggle with the, the spoon running over, he\'s chasing his blenkets and the man is going to telephone it back to him."',
    clue: 'Clue: Says "yes" to "Is your name Robert?" and also "yes" to "Are you a horse?"',
    answer: 'wernicke',
    why: 'Smooth, fluent speech full of word errors ("spoon," "telephone") and made-up words, with poor understanding of simple questions, points to Wernicke\'s aphasia in the left temporal lobe.'
  },
  {
    sample: '(Asked about her old job) "I worked at the, the place where they keep the plinders, a long time, and my sister was very happy about the train so we did it every Tuesday."',
    clue: 'Clue: Understands very little of what is said or written to her. Repeats sentences poorly.',
    answer: 'wernicke',
    why: 'Long, fluent sentences that drift away from the question, with a made-up word and poor comprehension of both speech and writing, fit Wernicke\'s aphasia.'
  },
  {
    sample: '(Asked to repeat "The pencil is on the table") "The pen... the pentil... the pencil is at the... on the tabel, the table."',
    clue: 'Clue: Everyday speech is mostly fluent. Follows spoken commands well. Repetition is clearly his weakest skill.',
    answer: 'conduction',
    why: 'Fluent speech and good comprehension, but very poor repetition with sound errors he keeps trying to fix, is the classic pattern of conduction aphasia.'
  },
  {
    sample: '"I need to get the... the kreys, the keys, from the car before we leave." (Asked to repeat "No ifs, ands, or buts": "No if... and if... no... buts.")',
    clue: 'Clue: Understands conversation well and notices her own mistakes.',
    answer: 'conduction',
    why: 'Fluent speech with sound errors ("kreys" for "keys") that she notices and corrects, good comprehension, and a repetition task that falls apart point to conduction aphasia.'
  },
  {
    sample: '"On Saturday I drove up to the lake with my son, and we caught a couple of fish, but the big one got away."',
    clue: 'Clue: Follows commands and repeats sentences without any trouble.',
    answer: 'normal',
    why: 'Fluent, meaningful sentences with normal grammar, good comprehension, and normal repetition. This is normal speech.'
  },
  {
    sample: '(Describing a picture of a park) "Um, I think the dog is chasing a ball, and the man by the tree is, uh, about to throw another one."',
    clue: 'Clue: Comprehension and repetition are normal.',
    answer: 'normal',
    why: 'Healthy speakers say "um" and pause all the time. The sentences are fluent, grammatical, and make sense, with normal comprehension, so this is normal speech.'
  }
];

const MASTERY = 8;

// ---- state ----
let order = [];
let current = 0;
let answered = false;
let chosen = null;
let score = 0;
let numAnswered = 0;
let finished = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const b = createButton(c.label);
    b.parent(document.querySelector('main'));
    styleButton(b);
    b.mousePressed(() => chooseCategory(c.key));
    categoryButtons.push(b);
  }
  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  styleButton(nextButton);
  nextButton.mousePressed(nextItem);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  styleButton(restartButton);
  restartButton.mousePressed(restartGame);

  restartGame();
  layoutControls();

  describe('Aphasia Sorter: a classification game. Each round shows a short original speech sample and a clue about comprehension or repetition. The learner sorts it as Broca\'s aphasia, Wernicke\'s aphasia, conduction aphasia, or normal speech, then sees feedback and a running score out of 10 items.');
}

function styleButton(b) {
  b.style('font-size', '15px');
  b.style('padding', '5px 10px');
  b.style('margin', '0px');
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

  const w = canvasWidth - 2 * margin;
  let y = 12;

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(22);
  text('Aphasia Sorter', canvasWidth / 2, y);
  y += 32;

  // instruction line
  textStyle(NORMAL);
  textSize(15);
  textAlign(LEFT, TOP);
  y = drawWrapped('Read the speech sample and the clue, then choose: Broca\'s, Wernicke\'s, Conduction, or Normal.', margin, y, w, 20, 'dimgray');
  y += 6;

  if (finished) {
    drawSummary(y, w);
    return;
  }

  // progress and score
  textSize(16);
  textStyle(BOLD);
  noStroke();
  fill('midnightblue');
  text('Item ' + (current + 1) + ' of ' + ITEMS.length + '     Score: ' + score + ' / ' + numAnswered, margin, y);
  textStyle(NORMAL);
  y += 28;

  // Pick the largest body text size (16, 15, or 14 px) that fits the drawing area.
  const sizes = [[16, 22], [15, 20], [14, 18]];
  let chosenSize = sizes[sizes.length - 1];
  for (const sz of sizes) {
    if (drawItem(y, w, sz[0], sz[1], false) <= drawHeight - 6) {
      chosenSize = sz;
      break;
    }
  }
  drawItem(y, w, chosenSize[0], chosenSize[1], true);
}

// Lays out (and, if doDraw is true, draws) the current item.
// Returns the y position just below the last line, so the caller can check fit.
function drawItem(y, w, fs, lh, doDraw) {
  const item = ITEMS[order[current]];

  // speech sample panel
  textSize(fs);
  textStyle(ITALIC);
  const sampleLines = wrapLines(item.sample, w - 24);
  const sampleH = 28 + sampleLines.length * lh + 10;
  if (doDraw) {
    drawPanel(margin, y, w, sampleH, 'white', 'steelblue');
    noStroke();
    fill('steelblue');
    textStyle(BOLD);
    textSize(14);
    text('SPEECH SAMPLE', margin + 12, y + 8);
    textSize(fs);
    textStyle(ITALIC);
    fill('black');
    drawLines(sampleLines, margin + 12, y + 30, lh);
  }
  textStyle(NORMAL);
  y += sampleH + 10;

  // clue panel
  textSize(fs);
  const clueLines = wrapLines(item.clue, w - 24);
  const clueH = clueLines.length * lh + 16;
  if (doDraw) {
    drawPanel(margin, y, w, clueH, 'lightyellow', 'goldenrod');
    noStroke();
    fill('black');
    drawLines(clueLines, margin + 12, y + 8, lh);
  }
  y += clueH + 10;

  // feedback panel (after an answer) or a reminder of the three questions
  let footer;
  if (answered) {
    const correct = (chosen === item.answer);
    const headline = correct
      ? 'Correct! ' + CATEGORY_NAMES[item.answer] + '.'
      : 'Not quite. You chose ' + CATEGORY_NAMES[chosen] + '; the answer is ' + CATEGORY_NAMES[item.answer] + '.';
    textSize(fs);
    textStyle(BOLD);
    const headLines = wrapLines(headline, w - 24);
    textStyle(NORMAL);
    const whyLines = wrapLines(item.why, w - 24);
    const fbH = headLines.length * lh + whyLines.length * lh + 22;
    if (doDraw) {
      drawPanel(margin, y, w, fbH, correct ? 'honeydew' : 'mistyrose', correct ? 'seagreen' : 'firebrick');
      noStroke();
      fill(correct ? 'darkgreen' : 'darkred');
      textStyle(BOLD);
      drawLines(headLines, margin + 12, y + 8, lh);
      textStyle(NORMAL);
      fill('black');
      drawLines(whyLines, margin + 12, y + 12 + headLines.length * lh, lh);
    }
    y += fbH + 8;
    footer = (current < ITEMS.length - 1) ? 'Press Next for the next sample.' : 'Press Next to see your final score.';
  } else {
    footer = 'Ask yourself: Is the speech fluent? Does the person understand? Can they repeat?';
  }
  textSize(Math.min(fs, 15));
  textStyle(NORMAL);
  const footLines = wrapLines(footer, w);
  if (doDraw) {
    noStroke();
    fill('dimgray');
    drawLines(footLines, margin, y, lh - 2);
  }
  y += footLines.length * (lh - 2);
  return y;
}

function drawSummary(y, w) {
  y += 10;
  const mastered = score >= MASTERY;
  textSize(16);
  const msg = mastered
    ? 'Great work! You reached the mastery mark of ' + MASTERY + ' out of 10. You used fluency, comprehension, and repetition the way a clinician does.'
    : 'You need ' + MASTERY + ' out of 10 for mastery. Review the three questions (fluent? understands? repeats?) in Section 12.4 and press Restart to try a new shuffled round.';
  const lines = wrapLines(msg, w - 24);
  const h = 70 + lines.length * 22 + 12;
  drawPanel(margin, y, w, h, mastered ? 'honeydew' : 'lavenderblush', mastered ? 'seagreen' : 'slateblue');
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(24);
  text('Final score: ' + score + ' / ' + ITEMS.length, margin + w / 2, y + 16);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(16);
  drawLines(lines, margin + 12, y + 62, 22);
  y += h + 16;

  const recap = [
    "Broca's: nonfluent, telegraphic; comprehension relatively good; aware of errors.",
    "Wernicke's: fluent but meaningless; poor comprehension; often unaware.",
    'Conduction: fluent; good comprehension; very poor repetition.',
    'Normal: fluent, meaningful; "um" and pauses are normal.'
  ];
  textSize(15);
  for (const r of recap) {
    y = drawWrapped('- ' + r, margin, y, w, 20, 'black');
    y += 4;
  }
}

// ---- text helpers ----
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line.length ? line + ' ' + word : word;
    if (textWidth(test) > maxW && line.length) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

function drawLines(lines, x, y, lh) {
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    noStroke();
    text(lines[i], x, y + i * lh);
  }
}

function drawWrapped(str, x, y, w, lh, col) {
  const lines = wrapLines(str, w);
  noStroke();
  fill(col);
  drawLines(lines, x, y, lh);
  return y + lines.length * lh;
}

function drawPanel(x, y, w, h, bg, border) {
  stroke(border);
  strokeWeight(2);
  fill(bg);
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
}

// ---- game logic ----
function chooseCategory(key) {
  if (answered || finished) return;
  chosen = key;
  answered = true;
  numAnswered++;
  if (key === ITEMS[order[current]].answer) score++;
  updateButtonStates();
}

function nextItem() {
  if (finished || !answered) return;
  if (current < ITEMS.length - 1) {
    current++;
    answered = false;
    chosen = null;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function restartGame() {
  order = shuffle([...Array(ITEMS.length).keys()]);
  current = 0;
  answered = false;
  chosen = null;
  score = 0;
  numAnswered = 0;
  finished = false;
  updateButtonStates();
}

function updateButtonStates() {
  for (const b of categoryButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (nextButton) {
    if (answered && !finished) nextButton.removeAttribute('disabled');
    else nextButton.attribute('disabled', '');
  }
}

// Flow buttons left to right in the control area (two rows of 38 px).
// Wide screens: the four category buttons on row 1, Next and Restart on row 2.
// Narrow screens: category buttons wrap, and Next/Restart follow on row 2
// after a wider gap so they never overlap a category button.
function layoutControls() {
  const gap = 8;
  const rowStep = 38;
  const row1 = drawHeight + 8;
  let x = 10;
  let y = row1;
  for (const b of categoryButtons) {
    const bw = b.elt.offsetWidth || 90;
    if (x + bw > canvasWidth - 6 && x > 10) {
      x = 10;
      y += rowStep;
    }
    b.position(x, y);
    x += bw + gap;
  }
  if (y === row1) {
    // all categories fit on row 1: actions start a fresh row
    x = 10;
    y = row1 + rowStep;
  } else {
    // categories wrapped: leave a wider gap before the action buttons
    x += 16;
  }
  const nw = nextButton.elt.offsetWidth || 60;
  const rw = restartButton.elt.offsetWidth || 75;
  if (x + nw + gap + rw > canvasWidth - 6) {
    x = 10;
    y += rowStep;
  }
  nextButton.position(x, y);
  restartButton.position(x + nw + gap, y);
}

// These two functions must be present for width-responsive MicroSims
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  layoutControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
