// --------------------------------
// HerFinance - Main JavaScript
// Handles typewriter, page flow, quiz
// --------------------------------


// ---- TYPEWRITER EFFECT ----

// Words that cycle in the hero headline
const words = [
  'credit score',
  'credit card',
  'FAFSA award',
  'offer letter',
  'APR',
  'financial future',
  '401k',
  'pay stub',
  'first card'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEl = document.getElementById('tw');

function runTypewriter() {
  const current = words[wordIndex];

  if (!isDeleting) {
    // Type one character
    charIndex++;
    typeEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor"></span>';

    if (charIndex === current.length) {
      // Finished typing, pause then start deleting
      isDeleting = true;
      setTimeout(runTypewriter, 1900);
      return;
    }
  } else {
    // Delete one character
    charIndex--;
    typeEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor"></span>';

    if (charIndex === 0) {
      // Finished deleting, move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(runTypewriter, 350);
      return;
    }
  }

  // Speed: deleting is faster than typing
  setTimeout(runTypewriter, isDeleting ? 48 : 82);
}

// Start typewriter after a short delay
setTimeout(runTypewriter, 1000);


// ---- PAGE NAVIGATION ----

// Fade out current page, fade in next
function goTo(pageId) {
  const current = document.querySelector('.page.active');

  if (current) {
    current.classList.remove('visible');
    setTimeout(() => {
      current.classList.remove('active');
      showPage(pageId);
    }, 350);
  } else {
    showPage(pageId);
  }
}

// Show a page and fade it in
function showPage(pageId) {
  const page = document.getElementById(pageId);
  page.classList.add('active');

  // Double rAF ensures transition fires after display:flex kicks in
  requestAnimationFrame(() => requestAnimationFrame(() => {
    page.classList.add('visible');
  }));

  window.scrollTo(0, 0);
}


// ---- QUIZ DATA ----

// Each question has an id, type (options or input), and content
const questions = [
  {
    id: 'name',
    type: 'input',
    placeholder: 'e.g. Sofia',
    q: 'What should we call you?',
    hint: 'Just your first name is fine.'
  },
  {
    id: 'age',
    type: 'options',
    q: 'How old are you?',
    hint: 'This helps us recommend the right credit products.',
    opts: ['Under 18', '18 to 20', '21 to 24', '25 to 29', '30+']
  },
  {
    id: 'credit_known',
    type: 'options',
    q: 'Do you know your credit score?',
    hint: 'No judgment. Most people do not when they start.',
    opts: [
      'Yes, I know it',
      'I have a rough idea',
      'No idea at all',
      'I do not think I have one yet'
    ]
  },
  {
    id: 'location',
    type: 'options',
    q: 'Where are you located?',
    hint: 'Credit rules vary by state. This helps us give accurate info.',
    opts: [
      'Northeast US',
      'Southeast US',
      'Midwest US',
      'Southwest US',
      'West Coast US',
      'Outside the US'
    ]
  },
  {
    id: 'home_country',
    type: 'input',
    placeholder: 'e.g. Mexico, Philippines, India',
    q: 'What is your home country or heritage?',
    hint: 'We use this to tailor context. Never shared with anyone.'
  },
  {
    id: 'language',
    type: 'options',
    q: 'What language are you most comfortable in?',
    hint: 'We can translate explanations for you or your family.',
    opts: [
      'English',
      'Spanish',
      'Tagalog / Filipino',
      'Hindi / Urdu',
      'Mandarin / Cantonese',
      'Portuguese',
      'Other'
    ]
  },
  {
    id: 'debt',
    type: 'options',
    q: 'Do you currently have any debt?',
    hint: 'Student loans, credit cards, anything counts.',
    opts: [
      'No debt at all',
      'Student loans only',
      'Credit card debt',
      'Both student loans and credit card',
      'Other types of debt'
    ]
  },
  {
    id: 'employment',
    type: 'options',
    q: 'What is your current employment status?',
    hint: 'This affects which credit cards you are eligible for.',
    opts: [
      'Full-time student (no job)',
      'Part-time job while in school',
      'Full-time job',
      'Internship or co-op',
      'Self-employed or freelance'
    ]
  },
  {
    id: 'supporting',
    type: 'options',
    q: 'Are you financially supporting anyone?',
    hint: 'Family back home, a sibling, a parent. It all affects your budget.',
    opts: [
      'No, just myself',
      'Yes, sending money home',
      'Yes, supporting family here',
      'Yes, both'
    ]
  },
  {
    id: 'goal',
    type: 'options',
    q: 'What is your biggest financial goal right now?',
    hint: 'Everything we show you will point toward this.',
    opts: [
      'Build credit from zero',
      'Understand my credit score',
      'Find the right credit card',
      'Pay off existing debt',
      'Learn how to budget',
      'Support my family and save'
    ]
  }
];

// Stores the user's answers as they go
const answers = {};

// Tracks which question we are on
let currentQ = 0;


// ---- QUIZ FUNCTIONS ----

// Called when user clicks "Build my profile" on explanation page
function startQuiz() {
  currentQ = 0;
  goTo('page-quiz');
  renderQuestion();
}

// Draws the current question onto the page
function renderQuestion() {
  const q = questions[currentQ];
  const total = questions.length;
  const pct = Math.round(((currentQ + 1) / total) * 100);

  // Update progress bar
  document.getElementById('q-label').textContent = 'Question ' + (currentQ + 1) + ' of ' + total;
  document.getElementById('q-pct').textContent = pct + '%';
  document.getElementById('prog').style.width = pct + '%';

  // Dim back button on first question
  const backBtn = document.getElementById('btn-back');
  backBtn.style.opacity = currentQ === 0 ? '0.3' : '1';
  backBtn.style.pointerEvents = currentQ === 0 ? 'none' : 'all';

  // Build the question HTML
  let html = '<div class="quiz-q">' + q.q + '</div>';
  html += '<p class="quiz-hint">' + q.hint + '</p>';

  if (q.type === 'options') {
    html += '<div class="quiz-options">';
    q.opts.forEach(opt => {
      const selected = answers[q.id] === opt ? 'sel' : '';
      html += '<button class="quiz-opt ' + selected + '" onclick="selectOption(this, \'' + q.id + '\', \'' + opt + '\')">' + opt + '</button>';
    });
    html += '</div>';
  } else {
    // Text input question
    const saved = answers[q.id] || '';
    html += '<input class="quiz-input" type="text" id="txt-input" placeholder="' + q.placeholder + '" value="' + saved + '" oninput="answers[\'' + q.id + '\']=this.value">';
  }

  document.getElementById('quiz-body').innerHTML = html;
}

// Called when user clicks a multiple choice option
function selectOption(el, id, val) {
  answers[id] = val;
  // Clear all selected, then mark the clicked one
  document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
}

// Move to next question or finish quiz
function nextQ() {
  // Save text input answer if on a text question
  const textInput = document.getElementById('txt-input');
  if (textInput) answers[questions[currentQ].id] = textInput.value;

  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    // Quiz done, build the dashboard and go there
    buildDashboard();
    goTo('page-dash');
  }
}

// Go back one question
function prevQ() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  } else {
    goTo('page-explain');
  }
}


// ---- DASHBOARD ----

// Fills in the dashboard with the user's answers
function buildDashboard() {
  const name = answers['name'] || 'her';
  document.getElementById('dash-name').textContent = name;

  // Build profile pills from selected answers
  const pillData = [
    answers['age']         && { label: 'Age',        val: answers['age'] },
    answers['location']    && { label: 'Location',   val: answers['location'] },
    answers['home_country']&& { label: 'Heritage',   val: answers['home_country'] },
    answers['employment']  && { label: 'Status',     val: answers['employment'] },
    answers['goal']        && { label: 'Goal',       val: answers['goal'] }
  ].filter(Boolean);

  document.getElementById('dash-pills').innerHTML = pillData
    .map(p => '<div class="profile-pill">' + p.label + ': <span>' + p.val + '</span></div>')
    .join('');
}


// ---- INIT ----

// Show the landing page when the script loads
showPage('page-landing');
