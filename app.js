/* 幸福魔法師 v2.0（互動強化｜橘色版）
   - 今日任務（完成就給對方+1）
   - 抽卡＋一鍵複製
   - 互相得分（今日）＋分享卡
   - 小煙火特效（無聲，最保守）
*/

const L = {
  attraction: [
    "我看到你的貼心，謝謝你。",
    "你願意替別人想，這就是幸福靠近的方式。",
    "小小善意，也很亮。",
    "我收到你的心意了。",
    "你剛剛那一下，真的很加分。"
  ],
  harmony: [
    "小仙女一揮～各就各位！謝謝你們配合。",
    "我們用魔法整理：不用吵，只要一起。",
    "你看～變清爽了！我們好厲害。",
    "你願意配合，我就更想溫柔。",
    "今天我們用歡喜心，把家變得更像家。"
  ],
  missions: [
    "對家人說一句：『我有看到你。』",
    "幫忙一個小小歸位（外套/水壺/書包）。",
    "給對方一個「感謝抱抱」或輕拍一下。",
    "用幽默講一句：『我想施個魔法～』",
    "問孩子：『你今天最棒的一件事是什麼？』",
    "把一句抱怨換成一句請求（更簡單的那種）。",
    "一起做 10 秒深呼吸，然後說：『OK，繼續。』"
  ]
};

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// --- DOM ---
const $ = (id) => document.getElementById(id);

const missionText = $("mission-text");
const missionHint = $("mission-hint");

const quoteA = $("quote-attraction");
const quoteH = $("quote-harmony");

const parentNum = $("score-parent");
const childNum = $("score-child");
const summary = $("summary");

const modal = $("modal");
const sharePreview = $("share-preview");

// --- Storage (today) ---
const KEY = "happyMagic.today.v2";
const todayKey = new Date().toISOString().slice(0,10);

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return { date: todayKey, parent:0, child:0, mission:"", missionDone:false };
    const data = JSON.parse(raw);
    if(data.date !== todayKey) return { date: todayKey, parent:0, child:0, mission:"", missionDone:false };
    return {
      date: todayKey,
      parent: Number(data.parent||0),
      child: Number(data.child||0),
      mission: String(data.mission||""),
      missionDone: Boolean(data.missionDone||false)
    };
  }catch(e){
    return { date: todayKey, parent:0, child:0, mission:"", missionDone:false };
  }
}
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

let state = load();

// --- Render helpers ---
function setQuoteTargets(){
  if(!quoteA.textContent) quoteA.textContent = pick(L.attraction);
  if(!quoteH.textContent) quoteH.textContent = pick(L.harmony);
}
function ensureMission(){
  if(!state.mission) state.mission = pick(L.missions);
}
function render(){
  ensureMission();
  missionText.textContent = state.mission;
  missionHint.textContent = state.missionDone ? "已完成 ✅ 今天先到這裡就好。" : "完成後按『我完成了』，會送對方 +1。";
  parentNum.textContent = String(state.parent);
  childNum.textContent = String(state.child);
  summary.textContent = `今日：家長 ${state.parent}｜孩子 ${state.child}`;
  save(state);
}
setQuoteTargets();
render();

// --- Mission actions ---
$("btn-new-mission").addEventListener("click", () => {
  state.mission = pick(L.missions);
  state.missionDone = false;
  render();
});

$("done-mission").addEventListener("click", () => {
  if(state.missionDone){
    missionHint.textContent = "今天已領過 ✅ 明天再來。";
    fireworks();
    return;
  }
  // 完成任務：互相+1（更有同樂感）
  state.parent += 1;
  state.child += 1;
  state.missionDone = true;
  render();
  missionHint.textContent = "完成 ✅ 親子同樂各 +1！";
  fireworks();
});

$("skip-mission").addEventListener("click", () => {
  state.missionDone = false;
  missionHint.textContent = "OK～不勉強。我們改天再玩。";
});

// --- Card pick ---
$("btn-attraction").addEventListener("click", () => {
  quoteA.textContent = pick(L.attraction);
  fireworks(14);
});
$("btn-harmony").addEventListener("click", () => {
  quoteH.textContent = pick(L.harmony);
  fireworks(14);
});

// --- Copy helpers ---
async function copyText(text, toastTarget){
  try{
    await navigator.clipboard.writeText(text);
    toastTarget.textContent = "已複製 ✅";
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toastTarget.textContent = "已複製 ✅（備援）";
  }
  setTimeout(()=> toastTarget.textContent = "", 1200);
}

$("copy-attraction").addEventListener("click", () => copyText(quoteA.textContent, missionHint));
$("copy-harmony").addEventListener("click", () => copyText(quoteH.textContent, missionHint));

// quick +1 buttons inside cards
$("parent-plus-from-child").addEventListener("click", () => { state.parent += 1; render(); fireworks(); });
$("child-plus-from-parent").addEventListener("click", () => { state.child += 1; render(); fireworks(); });

// --- Score buttons ---
$("add-parent").addEventListener("click", () => { state.parent += 1; render(); fireworks(); });
$("add-child").addEventListener("click", () => { state.child += 1; render(); fireworks(); });

$("reset-today").addEventListener("click", () => {
  state = { date: todayKey, parent:0, child:0, mission:"", missionDone:false };
  render();
  missionHint.textContent = "已重設 🧹";
});

$("copy-summary").addEventListener("click", () => {
  const text = `幸福魔法師｜今日同樂：家長 ${state.parent}｜孩子 ${state.child}。`;
  copyText(text, summary);
});

// --- Share card modal ---
function openModal(){
  const txt = `✨ 幸福魔法師｜今日同樂卡
家長：${state.parent} 分
孩子：${state.child} 分
#親子同樂 #幸福魔法師`;
  sharePreview.textContent = txt;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}
$("share-card").addEventListener("click", () => { openModal(); fireworks(18); });
$("close-modal").addEventListener("click", closeModal);
$("close-modal-2").addEventListener("click", closeModal);
$("copy-share").addEventListener("click", () => copyText(sharePreview.textContent, sharePreview));

// --- Quick actions top chips ---
$("btn-mission").addEventListener("click", () => window.scrollTo({top: 90, behavior:"smooth"}));
$("btn-dice").addEventListener("click", () => { quoteA.textContent = pick(L.attraction); quoteH.textContent = pick(L.harmony); fireworks(22); });
$("btn-wow").addEventListener("click", () => fireworks(40));

// --- Fireworks effect (canvas confetti) ---
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let particles = [];
function resize(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

function fireworks(count=24){
  const w = canvas.width, h = canvas.height;
  const cx = (window.innerWidth * 0.5) * devicePixelRatio;
  const cy = (window.innerHeight * 0.25) * devicePixelRatio;
  for(let i=0;i<count;i++){
    const a = Math.random()*Math.PI*2;
    const sp = 6 + Math.random()*10;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a)*sp,
      vy: Math.sin(a)*sp,
      g: 0.35 + Math.random()*0.35,
      life: 45 + Math.floor(Math.random()*25),
      r: 2 + Math.random()*3
    });
  }
  requestAnimationFrame(tick);
}

let ticking = false;
function tick(){
  if(ticking) return;
  ticking = true;
  (function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p => p.life > 0);
    for(const p of particles){
      p.life -= 1;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,159,67,.9)";
      ctx.fill();
    }
    if(particles.length){
      requestAnimationFrame(loop);
    }else{
      ticking = false;
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  })();
}
