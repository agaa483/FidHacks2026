// =================================
// HerFinance - Main JavaScript
// Sidebar layout, 5 tabs
// =================================

// ---- LANGUAGE ----
let appLanguage = 'en';

const landingText = {
  en: {
    headline:   'Build Credit.<br>Build Confidence.<br><em>Build Your Future.</em>',
    typePrefix: 'She deserves to understand her',
    story1:     'In many immigrant households, financial knowledge is passed down selectively or not at all. She watched her family work harder than anyone and still had no one to explain what a credit score was, what APR meant, or whether that job offer was actually good.',
    story2:     'She figured it out <strong>alone</strong>. HerFinance exists so she never has to again.',
    langLabel:  'Choose your language',
    btnLabel:   'Get started',
    note:       'Free, takes about 2 minutes',
  },
  es: {
    headline:   'Construye Credito.<br>Construye Confianza.<br><em>Construye Tu Futuro.</em>',
    typePrefix: 'Ella merece entender su',
    story1:     'En muchos hogares de inmigrantes, el conocimiento financiero se transmite de forma selectiva o simplemente no se transmite. Ella vio a su familia trabajar mas duro que nadie y aun asi no tuvo a nadie que le explicara que es un puntaje de credito.',
    story2:     'Lo descubrio <strong>sola</strong>. HerFinance existe para que nunca mas tenga que hacerlo.',
    langLabel:  'Elige tu idioma',
    btnLabel:   'Comenzar',
    note:       'Gratis, toma unos 2 minutos',
  }
};

function setLanguage(code) {
  appLanguage = code;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === code));
  const txt = landingText[code];
  document.getElementById('landing-headline').innerHTML       = txt.headline;
  document.getElementById('landing-type-prefix').textContent  = txt.typePrefix;
  document.getElementById('landing-story-1').innerHTML        = txt.story1;
  document.getElementById('landing-story-2').innerHTML        = txt.story2;
  document.getElementById('landing-lang-label').textContent   = txt.langLabel;
  document.getElementById('landing-btn').textContent          = txt.btnLabel;
  document.getElementById('landing-note').textContent         = txt.note;
}


// ---- TYPEWRITER ----
const words = ['credit score','APR','credit limit','interest rate','credit history','utilization rate','secured card','credit report','FICO score','payment history'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('tw');

function runTypewriter() {
  const current = words[wordIndex];
  if (!isDeleting) {
    charIndex++;
    typeEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor"></span>';
    if (charIndex === current.length) { isDeleting = true; setTimeout(runTypewriter, 2000); return; }
  } else {
    charIndex--;
    typeEl.innerHTML = current.slice(0, charIndex) + '<span class="cursor"></span>';
    if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(runTypewriter, 380); return; }
  }
  setTimeout(runTypewriter, isDeleting ? 45 : 80);
}
setTimeout(runTypewriter, 1000);


// ---- APP ENTRY ----
function enterApp() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  showTab('tab1');
}


// ---- SIDEBAR NAVIGATION ----
function showTab(tabId) {
  // Hide all tab panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Deactivate all step buttons
  document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));

  // Show selected panel
  document.getElementById(tabId).classList.add('active');
  // Activate sidebar step
  document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');

  window.scrollTo(0, 0);
}

function markDone(tabId) {
  const btn = document.querySelector('[data-tab="' + tabId + '"]');
  if (btn) btn.classList.add('done');
}


// ---- QUIZ ----
const questions = [
  { id:'name',       type:'input',   placeholder:'e.g. Sofia',                    q:'What should we call you?',                  hint:'Just your first name.' },
  { id:'age',        type:'options', opts:['Under 18','18 to 20','21 to 24','25 to 29','30+'], q:'How old are you?', hint:'Helps us match you to the right resources.' },
  { id:'country',    type:'input',   placeholder:'e.g. Honduras, Philippines',    q:'What is your home country or heritage?',     hint:'Used for context only. Never shared.' },
  { id:'language',   type:'options', opts:['English','Spanish','Tagalog','Hindi / Urdu','Mandarin','Portuguese','Other'], q:'What language are you most comfortable in?', hint:'We will respond in that language.' },
  { id:'credit',     type:'options', opts:['Yes, I know it','I have a rough idea','No idea','I do not think I have one yet'], q:'Do you know your credit score?', hint:'No judgment. Most people do not when they start.' },
  { id:'debt',       type:'options', opts:['No debt','Student loans only','Credit card debt','Both','Other'], q:'Do you have any debt right now?',              hint:'Student loans, credit cards, anything counts.' },
  { id:'employment', type:'options', opts:['Full-time student, no job','Part-time while in school','Full-time job','Internship or co-op','Self-employed'], q:'What is your current employment status?', hint:'This affects which cards you may qualify for.' },
  { id:'supporting', type:'options', opts:['No, just myself','Yes, sending money home','Yes, supporting family here','Yes, both'], q:'Are you financially supporting anyone?', hint:'Family back home, siblings, anyone.' },
  { id:'goal',       type:'options', opts:['Build credit from zero','Understand my credit score','Find the right credit card','Pay off debt','Learn to budget','Support my family and save'], q:'What is your biggest financial goal right now?', hint:'Everything we show you will point here.' },
];

const answers = {};
let currentQ = 0;

function renderQuestion() {
  const q = questions[currentQ];
  const total = questions.length;
  const pct = Math.round(((currentQ + 1) / total) * 100);

  document.getElementById('q-label').textContent = 'Question ' + (currentQ + 1) + ' of ' + total;
  document.getElementById('q-pct').textContent   = pct + '%';
  document.getElementById('prog').style.width    = pct + '%';

  const back = document.getElementById('btn-back');
  back.style.opacity       = currentQ === 0 ? '0.3' : '1';
  back.style.pointerEvents = currentQ === 0 ? 'none' : 'all';

  let html = '<div class="quiz-q">' + q.q + '</div><p class="quiz-hint">' + q.hint + '</p>';

  if (q.type === 'options') {
    html += '<div class="quiz-options">';
    q.opts.forEach(opt => {
      const sel = answers[q.id] === opt ? 'sel' : '';
      html += '<button class="quiz-opt ' + sel + '" onclick="selectOpt(this,\'' + q.id + '\',\'' + opt.replace(/'/g,'') + '\')">' + opt + '</button>';
    });
    html += '</div>';
  } else {
    const saved = answers[q.id] || '';
    html += '<input class="quiz-input" type="text" id="txt-input" placeholder="' + q.placeholder + '" value="' + saved + '" oninput="answers[\'' + q.id + '\']=this.value">';
  }

  document.getElementById('quiz-body').innerHTML = html;
}

function selectOpt(el, id, val) {
  answers[id] = val;
  document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
}

function nextQ() {
  const inp = document.getElementById('txt-input');
  if (inp) answers[questions[currentQ].id] = inp.value;

  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    // Quiz done — show HerGuide
    if (answers.language === 'Spanish') appLanguage = 'es';
    buildGuide();
    document.getElementById('quiz-wrap').style.display   = 'none';
    document.getElementById('guide-section').classList.add('visible');
    markDone('tab2');
    // Update sidebar name
    if (answers.name) document.getElementById('sidebar-name').innerHTML = 'Hi, <strong>' + answers.name + '</strong>';
  }
}

function prevQ() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}


// ---- HERGUIDE ----
const labels = {
  en: {
    chatGreeting: 'Hi! I am HerGuide. Ask me anything about credit and I will keep it simple.',
    typingLabel:  'HerGuide is thinking...',
    explainLabel: 'Explain this to my family',
    explainSub:   'Generates a simpler version they can read',
  },
  es: {
    chatGreeting: 'Hola! Soy HerGuide. Preguntame cualquier cosa sobre credito, te lo explico simple.',
    typingLabel:  'HerGuide esta pensando...',
    explainLabel: 'Explicar a mi familia',
    explainSub:   'Genera una version mas simple para compartir',
  }
};
function lt(key) { return (labels[appLanguage] || labels.en)[key]; }

// ---- BACKEND API ----
// Calls our own /api/chat which proxies OpenAI server-side so the key is never exposed.

const API_BASE = ''; // same origin
const chatHistory = []; // running conversation context

function getProfile() {
  return {
    name:       answers.name,
    age:        answers.age,
    country:    answers.country,
    language:   answers.language,
    credit:     answers.credit,
    debt:       answers.debt,
    employment: answers.employment,
    supporting: answers.supporting,
    goal:       answers.goal,
  };
}

async function callChatAPI(userMessage) {
  try {
    const res = await fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: getProfile(),
        history: chatHistory,
        message: userMessage,
      }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return data.reply || getHardcodedAnswer(userMessage);
  } catch (err) {
    console.error('Chat API error:', err);
    return getHardcodedAnswer(userMessage);
  }
}

// Fallback answers if no API key is configured
function getHardcodedAnswer(message) {
  const msg  = message.toLowerCase();
  const pool = creditAnswers[appLanguage] || creditAnswers.en;
  for (const key in pool) {
    if (key !== 'default' && msg.includes(key)) return pool[key];
  }
  return pool['default'];
}

const creditAnswers = {
  en: {
    'where do i start':   'The best first step is a secured credit card. Put down a $200 deposit, use it for one small purchase a month, pay it off in full, and your score starts building within 6 months.',
    'secured card':       'A secured card is perfect with no credit history. Your deposit is your limit so the bank takes very little risk. Discover It Student and Capital One Quicksilver Student are both great with no annual fee.',
    'credit score':       'Your credit score is a number from 300 to 850. Above 670 is good. It is built from payment history (35%), how much of your limit you use (30%), length of history (15%), types of credit (10%), and new applications (10%).',
    'avoid interest':     'Pay your full balance before the due date every month. If you only pay the minimum the rest carries over and interest adds up fast.',
    'sending money home': 'Sending money home does not directly hurt your score. But if it causes a missed payment that will hurt. Always pay on time even when money is tight.',
    'apartment':          'Most landlords want a score of at least 620 to 650. A cosigner or larger deposit can help if yours is lower.',
    'utilization':        'Credit utilization is how much of your limit you are using. Keep it under 30 percent. If your limit is $500, keep your balance under $150.',
    'default':            'Great question. The most important habits are: pay on time every month, keep your balance under 30 percent of your limit, and do not apply for too many cards at once.',
  },
  es: {
    'donde empiezo':  'El mejor primer paso es una tarjeta asegurada. Depositas $200, usala para una compra pequena al mes y pagala completamente. En 6 meses tendras historial.',
    'puntaje':        'Tu puntaje va de 300 a 850. Arriba de 670 es bueno. Se basa en pagos a tiempo (35%) y cuanto de tu limite usas (30%).',
    'interes':        'Paga tu balance completo antes de la fecha limite cada mes. Si solo pagas el minimo el resto genera intereses.',
    'default':        'Buena pregunta. Lo mas importante: paga a tiempo siempre, manten tu balance bajo el 30% de tu limite, y no apliques para muchas tarjetas a la vez.',
  }
};

function buildSummary() {
  const name    = answers.name       || '';
  const age     = answers.age        || '';
  const country = answers.country    || 'your home country';
  const employ  = answers.employment || '';
  const support = answers.supporting || '';
  const goal    = answers.goal       || '';
  let s = '';
  if (appLanguage === 'es') {
    s = 'Hola' + (name ? ' ' + name : '') + '. Eres una estudiante de primera generacion de ' + country;
    if (age)    s += ', de ' + age + ' anos';
    if (employ) s += ', ' + employ.toLowerCase();
    if (support && support !== 'No, just myself') s += ', y estas apoyando a tu familia';
    s += '. Tu meta principal es ' + (goal || 'construir credito').toLowerCase() + '. Esto es lo que preparamos para ti.';
  } else {
    s = 'Hi' + (name ? ' ' + name : '') + '. You are a first-gen student from ' + country;
    if (age)    s += ', ' + age;
    if (employ) s += ', ' + employ.toLowerCase();
    if (support && support !== 'No, just myself') s += ', also supporting your family';
    s += '. Your main goal is to ' + (goal || 'build credit').toLowerCase() + '. Here is what we built for you.';
  }
  return s;
}

function buildChips() {
  const chips    = [];
  const noCredit = !answers.credit || answers.credit.includes('No') || answers.credit.includes('idea');
  const sends    = answers.supporting && answers.supporting !== 'No, just myself';
  if (appLanguage === 'es') {
    if (noCredit) chips.push('Por donde empiezo con el credito?');
    if (sends)    chips.push('Enviar dinero afecta mi credito?');
    chips.push('Como evito pagar intereses?');
  } else {
    if (noCredit) chips.push('Where do I start with credit?');
    if (sends)    chips.push('Does sending money home affect my credit?');
    chips.push('How do I avoid paying interest?');
  }
  return chips.slice(0, 3);
}

function buildGuide() {
  document.getElementById('ai-summary-text').textContent = buildSummary();
  const chips = buildChips();
  document.getElementById('guide-chips').innerHTML = chips
    .map(c => '<button class="chip" onclick="sendChip(`' + c + '`)">' + c + '</button>')
    .join('');
  document.getElementById('chat-messages').innerHTML = '';
  chatHistory.length = 0;
  addAIBubble(lt('chatGreeting'));
  document.getElementById('explain-btn-title').textContent = lt('explainLabel');
  document.getElementById('explain-btn-sub').textContent   = lt('explainSub');
}

function addAIBubble(text, isTyping) {
  const messages = document.getElementById('chat-messages');
  const wrap     = document.createElement('div');
  wrap.className = 'chat-bubble-wrap';
  wrap.innerHTML = '<div class="chat-avatar ai">HG</div><div class="chat-bubble ai' + (isTyping ? ' typing' : '') + '">' + text + '</div>';
  if (isTyping) wrap.id = 'typing-wrap';
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

function addUserBubble(text) {
  const messages = document.getElementById('chat-messages');
  const wrap     = document.createElement('div');
  wrap.className = 'chat-bubble-wrap user';
  wrap.innerHTML = '<div class="chat-avatar user">U</div><div class="chat-bubble user">' + text + '</div>';
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

function sendChip(text) { sendMessage(text); }

async function sendMessage(text) {
  const input   = document.getElementById('chat-input');
  const message = text || (input ? input.value.trim() : '');
  if (!message) return;
  addUserBubble(message);
  if (input) input.value = '';
  addAIBubble(lt('typingLabel'), true);

  const reply = await callChatAPI(message);

  const t = document.getElementById('typing-wrap');
  if (t) t.remove();
  addAIBubble(reply);

  chatHistory.push({ role: 'user', content: message });
  chatHistory.push({ role: 'assistant', content: reply });
  if (chatHistory.length > 20) chatHistory.splice(0, chatHistory.length - 20);
}

function chatKeydown(e) { if (e.key === 'Enter') sendMessage(); }

function explainToFamily() {
  const bubbles = document.querySelectorAll('.chat-bubble.ai:not(.typing)');
  if (!bubbles.length) return;
  const last   = bubbles[bubbles.length - 1].textContent;
  const prefix = appLanguage === 'es' ? 'Para tu familia: ' : 'For your family: ';
  addAIBubble(prefix + last);
}


// ---- PDF SCANNER ----
const fakeResult = {
  apr:     '24.99%',
  intro:   '0% for 12 months',
  fee:     '$0',
  late:    '$41',
  penalty: '29.99%',
  flags: [
    'Penalty APR of 29.99% activates after just one missed payment',
    'Late fee of $41 is high for a student card',
    'Foreign transaction fee of 3% applies to international purchases'
  ],
  summary: {
    en: 'This card has a <strong>0% intro APR for 12 months</strong> which is helpful if you plan a large purchase. After that the rate jumps to <strong>24.99%</strong> so always pay your full balance each month. The penalty APR of nearly 30% is the biggest red flag. No annual fee is a positive.',
    es: 'Esta tarjeta tiene <strong>0% de APR introductorio por 12 meses</strong>. Despues sube a <strong>24.99%</strong>, asi que siempre paga tu balance completo. El APR de penalizacion de casi 30% es la mayor advertencia. Sin cuota anual es positivo.'
  }
};

function handleFileUpload(input) {
  if (!input.files.length) return;
  document.getElementById('upload-zone').style.display    = 'none';
  document.getElementById('scanner-loading').style.display = 'block';
  document.getElementById('scanner-results').style.display = 'none';
  setTimeout(showScanResults, 2400);
}

function showScanResults() {
  const r = fakeResult;
  document.getElementById('r-apr').textContent     = r.apr;
  document.getElementById('r-intro').textContent   = r.intro;
  document.getElementById('r-fee').textContent      = r.fee;
  document.getElementById('r-late').textContent     = r.late;
  document.getElementById('r-penalty').textContent  = r.penalty;
  document.getElementById('r-flags').innerHTML      = r.flags.map(f => '<div class="red-flag-item">' + f + '</div>').join('');
  document.getElementById('r-summary').innerHTML    = r.summary[appLanguage] || r.summary.en;
  document.getElementById('scanner-loading').style.display = 'none';
  document.getElementById('scanner-results').style.display = 'block';
  markDone('tab4');
}

function resetScanner() {
  document.getElementById('upload-zone').style.display    = 'block';
  document.getElementById('scanner-loading').style.display = 'none';
  document.getElementById('scanner-results').style.display = 'none';
  document.getElementById('file-input').value = '';
}


// ---- VIDEO CALL ----
// Left box: live camera. Right box: pre-recorded video-call.mp4

let studentStream = null;

// Shows the call section with the connect button
function startCall() {
  document.getElementById('apply-options-wrap').style.display = 'none';
  document.getElementById('call-section').classList.add('visible');
  document.getElementById('call-waiting').style.display   = 'block';
  document.getElementById('call-connected').style.display = 'none';
}

// Called when user clicks the Connect button
function connectCall() {
  document.getElementById('call-waiting').style.display   = 'none';
  document.getElementById('call-connected').style.display = 'block';

  // Start live camera on left
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      studentStream = stream;
      const studentVideo = document.getElementById('student-video');
      studentVideo.srcObject = stream;
      studentVideo.play().catch(e => console.warn('Camera play error:', e));
    })
    .catch(err => {
      console.warn('Camera not available:', err);
    });

  // Play pre-recorded advisor video on right
  const advisorVideo = document.getElementById('advisor-video');
  advisorVideo.currentTime = 0;
  advisorVideo.play().catch(e => console.warn('Advisor video play error:', e));
}

function endCall() {
  if (studentStream) {
    studentStream.getTracks().forEach(t => t.stop());
    studentStream = null;
  }

  const advisorVideo = document.getElementById('advisor-video');
  advisorVideo.pause();
  advisorVideo.currentTime = 0;

  const studentVideo = document.getElementById('student-video');
  studentVideo.srcObject = null;

  document.getElementById('call-section').classList.remove('visible');
  document.getElementById('apply-options-wrap').style.display = 'block';
  markDone('tab3');
}


// ---- INIT ----
// Start quiz on tab 2
renderQuestion();
