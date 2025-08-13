
const state = {
  categories: {},
  currentCategory: null,
  word: '',
  revealed: new Set(),
  wrong: 0,
  maxWrong: 8,
  playing: false,
  muted: false,
  hueShift: 0
};

const el = {
  screenMenu: document.getElementById('screenMenu'),
  screenGame: document.getElementById('screenGame'),
  categoryList: document.getElementById('categoryList'),
  tplCategoryItem: document.getElementById('tplCategoryItem'),
  formCategoria: document.getElementById('formCategoria'),
  btnStart: document.getElementById('btnStart'),
  word: document.getElementById('word'),
  keyboard: document.getElementById('keyboard'),
  health: document.getElementById('health'),
  progress: document.getElementById('progressBar'),
  live: document.getElementById('liveStatus'),
  gameTitle: document.getElementById('gameTitle'),
  dialogPause: document.getElementById('dialogPause'),
  dialogResult: document.getElementById('dialogResult'),
  resultTitle: document.getElementById('resultTitle'),
  resultWord: document.getElementById('resultWord'),
  btnAgain: document.getElementById('btnAgain'),
  btnMenu: document.getElementById('btnMenu'),
  btnPause: document.getElementById('btnPause'),
  btnTheme: document.getElementById('btnTheme'),
  btnMute: document.getElementById('btnMute'),
  particlesCanvas: document.getElementById('bgParticles')
};


const rand = arr => arr[Math.floor(Math.random()*arr.length)];
const slug = s => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'-');

async function loadWords() {
  const res = await fetch('words.json');
  const data = await res.json();
  state.categories = data;
  renderCategories();
}

function renderCategories() {
  el.categoryList.innerHTML='';
  Object.keys(state.categories).forEach(cat => {
    const frag = el.tplCategoryItem.content.cloneNode(true);
    const input = frag.querySelector('input');
    const labelSpan = frag.querySelector('.label');
    input.value = cat;
    input.id = 'cat-'+slug(cat);
    input.addEventListener('change',()=>{
      state.currentCategory = cat;
      el.btnStart.disabled = !cat;
    });
    labelSpan.textContent = cat + ' ' + rand(['🌀','🚀','✨','🌈','🔥','🧠','🌍','⚡']);
    labelSpan.setAttribute('for', input.id);
    el.categoryList.appendChild(frag);
  });
}

function startGame() {
  state.playing = true;
  state.revealed.clear();
  state.wrong = 0;
  const list = state.categories[state.currentCategory];
  state.word = rand(list).toUpperCase();
  el.gameTitle.textContent = state.currentCategory;
  showScreen('game');
  buildHealth();
  buildWord();
  buildKeyboard();
  updateProgress();
  speak(`Categoria ${state.currentCategory}. Palavra com ${state.word.replace(/[^A-Z]/g,'').length} letras.`);
}

function showScreen(name) {
  if(name==='menu') {
    el.screenMenu.hidden=false; el.screenGame.hidden=true; el.screenMenu.classList.add('active'); el.screenGame.classList.remove('active');
  } else {
    el.screenMenu.hidden=true; el.screenGame.hidden=false; el.screenGame.classList.add('active'); el.screenMenu.classList.remove('active');
  }
}

function buildHealth() {
  el.health.innerHTML='';
  for(let i=0;i<state.maxWrong;i++) {
    const span = document.createElement('span');
    el.health.appendChild(span);
  }
}

function buildWord() {
  el.word.innerHTML='';
  [...state.word].forEach(ch=>{
    const div = document.createElement('div');
    div.className='letter';
    if(/[^A-Z]/.test(ch)) {div.classList.add('revealed'); div.textContent=ch;}
    el.word.appendChild(div);
  });
}

function buildKeyboard() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  el.keyboard.innerHTML='';
  [...letters].forEach(l=>{
    const b = document.createElement('button');
    b.type='button';
    b.className='key';
    b.dataset.letter=l;
    b.textContent=l;
    b.setAttribute('aria-label','Letra '+l);
    b.addEventListener('click',()=> handleGuess(l,b));
    el.keyboard.appendChild(b);
  });
}

function handleGuess(letter, elButton) {
  if(!state.playing) return;
  if(state.revealed.has(letter)) return;
  state.revealed.add(letter);
  const indexes=[];
  [...state.word].forEach((ch,i)=>{ if(ch===letter) indexes.push(i); });
  if(indexes.length) {
    indexes.forEach(i=> revealLetter(i));
    elButton?.classList.add('correct');
    playTone(660,0.08);
  } else {
    state.wrong++;
    updateHealth();
    elButton?.classList.add('wrong');
    playTone(140,0.35,'sawtooth');
  }
  elButton?.setAttribute('data-state','used');
  checkEnd();
  updateProgress();
}

function revealLetter(index) {
  const elLetter = el.word.children[index];
  elLetter.classList.add('revealed');
  elLetter.textContent = state.word[index];
}

function updateHealth() {
  [...el.health.children].forEach((span,i)=> span.classList.toggle('lost', i < state.wrong));
  const remaining = state.maxWrong - state.wrong;
  speak(`${remaining} tentativas restantes.`);
}

function updateProgress() {
  const totalLetters = state.word.replace(/[^A-Z]/g,'').length;
  const found = [...state.word].filter(ch=> state.revealed.has(ch)).length;
  const pct = (found/totalLetters)*100;
  el.progress.style.width = pct+'%';
}

function checkEnd() {
  const lettersOnly = state.word.replace(/[^A-Z]/g,'');
  const allRevealed = [...new Set(lettersOnly)].every(l=> state.revealed.has(l));
  if(allRevealed) {
    endGame(true);
  } else if(state.wrong >= state.maxWrong) {
    endGame(false);
  }
}

function endGame(win) {
  state.playing=false;
  el.resultTitle.textContent = win ? '🏆 Você Venceu!' : '💀 Você Perdeu';
  el.resultWord.textContent = `Palavra: ${state.word}`;
  if(!el.dialogResult.open) el.dialogResult.showModal();
  speak(win? 'Parabéns, venceu!':'Fim de jogo.');
  confettiBurst(win? 'win':'lose');
}


el.btnPause.addEventListener('click',()=> {
  if(!state.playing) return; el.dialogPause.showModal();
});

el.dialogPause.addEventListener('close',()=>{
  switch(el.dialogPause.returnValue) {
    case 'continuar': /* nada */ break;
    case 'categoria': showScreen('menu'); break;
    case 'sair': showScreen('menu'); break;
  }
});


el.btnAgain.addEventListener('click',()=> { el.dialogResult.close(); startGame(); });
el.btnMenu.addEventListener('click',()=> { el.dialogResult.close(); showScreen('menu'); });

// Form
el.formCategoria.addEventListener('submit', e=> {
  e.preventDefault();
  if(!state.currentCategory) return;
  startGame();
});


window.addEventListener('keydown', e=> {
  if(e.key === 'Escape') {
    if(el.dialogResult.open) { el.dialogResult.close(); }
    else if(el.dialogPause.open) { el.dialogPause.close(); }
    else if(state.playing) { el.dialogPause.showModal(); }
  }
  if(!state.playing) return;
  const letter = e.key.toUpperCase();
  if(letter.match(/^[A-Z]$/)) {
    const btn = el.keyboard.querySelector(`[data-letter="${letter}"]`);
    handleGuess(letter, btn);
  }
});


el.btnTheme.addEventListener('click',()=> {
  const toLight = !document.documentElement.hasAttribute('data-theme');
  if(toLight) {
    document.documentElement.setAttribute('data-theme','light');
    el.btnTheme.textContent='🌙';
    el.btnTheme.setAttribute('aria-label','Tema escuro');
  } else {
    document.documentElement.removeAttribute('data-theme');
    el.btnTheme.textContent='🌗';
    el.btnTheme.setAttribute('aria-label','Tema claro');
  }
  el.btnTheme.setAttribute('aria-pressed', toLight);
});

el.btnMute.addEventListener('click',()=> {
  state.muted = !state.muted;
  el.btnMute.textContent = state.muted ? '🔇' : '🔊';
  el.btnMute.setAttribute('aria-pressed', state.muted);
  if(state.muted && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});


let audioCtx; function ensureAudio(){ if(!audioCtx){ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }}
function playTone(freq=440,dur=0.15,type='square') { if(state.muted) return; ensureAudio(); const o=audioCtx.createOscillator(); const g=audioCtx.createGain(); o.type=type; o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination); const now=audioCtx.currentTime; g.gain.setValueAtTime(.001,now); g.gain.exponentialRampToValueAtTime(.5, now+.01); g.gain.exponentialRampToValueAtTime(.0001, now+dur); o.start(); o.stop(now+dur+0.02); }


function speak(text) {
  if(state.muted) { return; }
  el.live.textContent = text;
  if('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang='pt-BR';
    utter.rate=1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}


function setupParticles() {
  const canvas = el.particlesCanvas; const ctx = canvas.getContext('2d');
  let particles = [];
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  window.addEventListener('resize',resize); resize();
  for(let i=0;i<120;i++) {
    particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+0.4,dx:(Math.random()-.5)*0.3,dy:(Math.random()-.5)*0.3});
  }
  function loop(){ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle='rgba(99,102,241,.8)'; particles.forEach(p=>{ p.x+=p.dx; p.y+=p.dy; if(p.x<0||p.x>canvas.width) p.dx*=-1; if(p.y<0||p.y>canvas.height) p.dy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }); requestAnimationFrame(loop); }
  loop();
}


function confettiBurst(mode='win') {
  const colorsWin=['#6366f1','#8b5cf6','#ec4899','#10b981'];
  const colorsLose=['#ef4444','#991b1b','#4b5563'];
  const colors = mode==='win'? colorsWin: colorsLose;
  for(let i=0;i<50;i++) {
    const div = document.createElement('div');
    div.className='confetti';
    const size = Math.random()*8+6;
    Object.assign(div.style,{
      position:'fixed',
      top:'-10px',
      left: (Math.random()*100)+'%',
      width:size+'px',
      height:size*0.6+'px',
      background: colors[Math.floor(Math.random()*colors.length)],
      transform:`rotate(${Math.random()*360}deg)`,
      borderRadius:'2px',
      pointerEvents:'none',
      zIndex:9999,
      animation:`fall ${3+Math.random()*2}s linear forwards`
    });
    document.body.appendChild(div); setTimeout(()=>div.remove(),6000);
  }
}

const styleAnim = document.createElement('style');
styleAnim.textContent = `@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity:.2; } }`;
document.head.appendChild(styleAnim);


loadWords();
setupParticles();


setInterval(()=>{
  state.hueShift = (state.hueShift + 1) % 360;
  document.documentElement.style.setProperty('--dynamic-accent-hue', state.hueShift);
}, 150);


window.addEventListener('pointerdown', e=>{
  const pulse = document.createElement('div');
  pulse.className='pulse-particle';
  const color = `hsl(${(state.hueShift+ Math.random()*50)%360} 85% 60%)`;
  pulse.style.left = e.clientX+'px';
  pulse.style.top = e.clientY+'px';
  pulse.style.setProperty('--pulse-color', color);
  document.body.appendChild(pulse);
  setTimeout(()=> pulse.remove(), 800);
});


if(typeof HTMLDialogElement === 'undefined') {
  ['dialogPause','dialogResult'].forEach(id=>{ const d=el[id]; d.showModal=()=> d.removeAttribute('hidden'); d.close=()=> d.setAttribute('hidden',''); });
}
