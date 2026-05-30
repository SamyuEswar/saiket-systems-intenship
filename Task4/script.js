// =========================================
// TASK 4 — Quiz Application
// Saiket Systems | JavaScript DOM
// =========================================

// ── QUESTION POOL (10 questions) ──────────
const questionPool = [
  {
    question: "Which HTML tag is used to define the structure of a web page's main navigation links?",
    options: ["<section>", "<nav>", "<aside>", "<div>"],
    answer: 1,
    hint: "Think semantics — which tag is specifically for navigation?"
  },
  {
    question: "Which CSS property is used to create space INSIDE an element's border?",
    options: ["margin", "border-spacing", "padding", "gap"],
    answer: 2,
    hint: "It pushes content away from the border on the inside."
  },
  {
    question: "Which JavaScript method adds a new element to the END of an array?",
    options: ["unshift()", "pop()", "shift()", "push()"],
    answer: 3,
    hint: "You 'push' something onto a stack."
  },
  {
    question: "What does CSS Grid's 'grid-template-columns: repeat(3, 1fr)' create?",
    options: [
      "3 rows of equal height",
      "3 columns of equal width",
      "A 3x3 grid",
      "3 columns where the first is fixed"
    ],
    answer: 1,
    hint: "1fr means one fraction of the available space."
  },
  {
    question: "Which JavaScript event fires when a user clicks on an HTML element?",
    options: ["onhover", "onchange", "onclick", "onload"],
    answer: 2,
    hint: "It's the most common event in interactive web apps."
  },
  {
    question: "What does 'DOM' stand for in web development?",
    options: [
      "Data Object Model",
      "Document Object Model",
      "Dynamic Output Module",
      "Display Object Manager"
    ],
    answer: 1,
    hint: "It represents the page as a tree of objects."
  },
  {
    question: "Which CSS unit is relative to the font size of the root element?",
    options: ["em", "px", "rem", "vh"],
    answer: 2,
    hint: "It stands for 'root em'."
  },
  {
    question: "Which HTML attribute makes an input field required before form submission?",
    options: ["validate", "mandatory", "required", "checked"],
    answer: 2,
    hint: "It is a boolean attribute — just add it to the input tag."
  },
  {
    question: "Which JavaScript method selects an element by its ID?",
    options: [
      "document.querySelector()",
      "document.getElementsByClass()",
      "document.findById()",
      "document.getElementById()"
    ],
    answer: 3,
    hint: "The method name tells you exactly what it does!"
  },
  {
    question: "Which CSS property controls the stacking order of overlapping elements?",
    options: ["position", "z-index", "display", "overflow"],
    answer: 1,
    hint: "Think of layers — higher number = on top."
  }
];

// ── SHUFFLE HELPER ────────────────────────
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── ESCAPE HTML HELPER (fixes option text bug) ──
// Prevents angle brackets in options like "<nav>" from being parsed as HTML tags
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── CONSTANTS ─────────────────────────────
const QUESTIONS_PER_QUIZ = 6;

// ── STATE ──────────────────────────────────
let questions    = [];
let currentIndex = 0;
let score        = 0;
let answered     = false;

// ── DOM REFS ──────────────────────────────
const quizScreen     = document.getElementById('quiz-screen');
const scoreScreen    = document.getElementById('score-screen');
const questionNumber = document.getElementById('question-number');
const questionText   = document.getElementById('question-text');
const optionsList    = document.getElementById('options-list');
const errorMsg       = document.getElementById('error-msg');
const progressFill   = document.getElementById('progress-fill');
const progressLabel  = document.getElementById('progress-label');
const nextBtn        = document.getElementById('next-btn');
const hintText       = document.getElementById('hint-text');

// Score screen refs
const scoreNumber    = document.getElementById('score-number');
const scoreTotal     = document.getElementById('score-total');
const scoreTitle     = document.getElementById('score-title');
const scoreSubtitle  = document.getElementById('score-subtitle');
const scoreTrophy    = document.getElementById('score-trophy');
const badgeCorrect   = document.getElementById('badge-correct');
const badgeWrong     = document.getElementById('badge-wrong');
const badgePct       = document.getElementById('badge-pct');
const ringFill       = document.getElementById('ring-fill');

// ── INIT ──────────────────────────────────
function init() {
  // Pick 6 random questions from pool of 10 each time
  questions    = shuffleArray(questionPool).slice(0, QUESTIONS_PER_QUIZ);
  currentIndex = 0;
  score        = 0;
  answered     = false;
  loadQuestion();
}

// ── LOAD QUESTION ─────────────────────────
function loadQuestion() {
  answered = false;
  errorMsg.classList.remove('visible');

  const q     = questions[currentIndex];
  const total = questions.length;

  // Progress bar
  const pct = (currentIndex / total) * 100;
  progressFill.style.width  = pct + '%';
  progressLabel.textContent = `Question ${currentIndex + 1} of ${total}`;

  // Question text
  questionNumber.textContent = `Question ${currentIndex + 1}`;
  questionText.textContent   = q.question;
  hintText.textContent       = '💡 ' + q.hint;

  // Next button label
  nextBtn.innerHTML = currentIndex === total - 1
    ? 'See Results <span>🏆</span>'
    : 'Next Question <span>→</span>';

  // Build options using escapeHTML() so angle brackets render as text, not HTML
  optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.className = 'option-item';

    const id = `opt-${i}`;
    li.innerHTML = `
      <input type="radio" name="quiz-option" id="${id}" value="${i}" />
      <label class="option-label" for="${id}">
        <span class="option-marker"></span>
        <span class="option-text">${escapeHTML(opt)}</span>
      </label>
    `;
    optionsList.appendChild(li);
  });

  // Animate card in
  const card = document.querySelector('.quiz-card');
  card.style.animation = 'none';
  void card.offsetWidth; // force reflow to restart animation
  card.style.animation = 'slideUp .35s cubic-bezier(0.4,0,0.2,1) both';
}

// ── NEXT BUTTON ───────────────────────────
nextBtn.addEventListener('click', () => {
  const selected = document.querySelector('input[name="quiz-option"]:checked');

  // ── VALIDATION: must select an answer before proceeding ──
  if (!selected) {
    errorMsg.classList.remove('visible');
    void errorMsg.offsetWidth; // restart shake animation
    errorMsg.classList.add('visible');
    return;
  }

  if (answered) return; // prevent double-click after reveal

  // ── CHECK ANSWER ────────────────────────
  answered = true;
  const chosen  = parseInt(selected.value);
  const correct = questions[currentIndex].answer;

  // Style all options to show correct/wrong feedback
  const labels = document.querySelectorAll('.option-label');
  labels.forEach((label, i) => {
    if (i === correct) {
      label.classList.add('correct');
    } else if (i === chosen && chosen !== correct) {
      label.classList.add('wrong');
    } else {
      label.classList.add('disabled');
    }
  });

  if (chosen === correct) score++;

  // Brief pause, then advance
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < questions.length) {
      loadQuestion();
    } else {
      showScore();
    }
  }, 900);
});

// ── SHOW SCORE ────────────────────────────
function showScore() {
  quizScreen.classList.add('hidden');
  scoreScreen.classList.add('visible');

  const total = questions.length;
  const wrong = total - score;
  const pct   = Math.round((score / total) * 100);

  progressFill.style.width  = '100%';
  progressLabel.textContent = `Completed — ${total} of ${total}`;

  // Animate SVG ring
  const circumference = 339.3;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 100);

  // Populate score details
  scoreNumber.textContent  = score;
  scoreTotal.textContent   = `/ ${total}`;
  badgeCorrect.textContent = `✅ ${score} Correct`;
  badgeWrong.textContent   = `❌ ${wrong} Wrong`;
  badgePct.textContent     = `📊 ${pct}%`;

  // Dynamic result message based on percentage
  if (pct === 100) {
    scoreTrophy.textContent   = '🏆';
    scoreTitle.textContent    = 'Perfect Score!';
    scoreSubtitle.textContent = `Amazing! You nailed all ${total} questions. True web dev expert! 🚀`;
  } else if (pct >= 70) {
    scoreTrophy.textContent   = '🎉';
    scoreTitle.textContent    = 'Great Job!';
    scoreSubtitle.textContent = `You scored ${score} out of ${total}. Solid work — keep it up!`;
  } else if (pct >= 40) {
    scoreTrophy.textContent   = '💪';
    scoreTitle.textContent    = 'Good Effort!';
    scoreSubtitle.textContent = `You scored ${score} out of ${total}. Review the topics and try again!`;
  } else {
    scoreTrophy.textContent   = '📚';
    scoreTitle.textContent    = 'Keep Learning!';
    scoreSubtitle.textContent = `You scored ${score} out of ${total}. Every expert started at zero!`;
  }
}

// ── RESTART ───────────────────────────────
function restartQuiz() {
  scoreScreen.classList.remove('visible');
  quizScreen.classList.remove('hidden');
  ringFill.style.strokeDashoffset = 339.3;
  init();
}

// ── START ─────────────────────────────────
init();
