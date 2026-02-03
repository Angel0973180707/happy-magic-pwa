const Q1 = [
  "我有看到你的貼心，謝謝你。",
  "你剛剛那個小小善意，讓幸福回頭看了。",
  "你願意替別人想，這就是幸福的吸引力。",
  "貼心不大聲，但很有力量。",
  "我收到你的心意了，我也想抱抱你。"
];

const Q2 = [
  "小仙女一揮～東西都各就各位！謝謝你們讓我心想事成。",
  "我們用魔法整理：不用吵，只要一起。",
  "你看～空間變清爽，心也一起亮起來。",
  "你願意配合，我就更想溫柔。",
  "今天我們用歡喜心，把家變得更像家。"
];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

const quoteAttraction = document.getElementById("quote-attraction");
const quoteHarmony = document.getElementById("quote-harmony");

document.getElementById("btn-attraction").addEventListener("click", () => {
  quoteAttraction.textContent = pick(Q1);
});

document.getElementById("btn-harmony").addEventListener("click", () => {
  quoteHarmony.textContent = pick(Q2);
});

// --- Score (today) ---
const KEY = "happyMagic.today.v1";
const todayKey = new Date().toISOString().slice(0,10);

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return { date: todayKey, parent:0, child:0 };
    const data = JSON.parse(raw);
    if(data.date !== todayKey) return { date: todayKey, parent:0, child:0 };
    return { date: todayKey, parent: Number(data.parent||0), child: Number(data.child||0) };
  }catch(e){
    return { date: todayKey, parent:0, child:0 };
  }
}

function save(state){
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = load();

const parentNum = document.getElementById("score-parent");
const childNum = document.getElementById("score-child");
const summary = document.getElementById("summary");

function render(){
  parentNum.textContent = String(state.parent);
  childNum.textContent = String(state.child);
  summary.textContent = `今天：家長得分 ${state.parent}｜孩子得分 ${state.child}。`;
}
render();

document.getElementById("add-parent").addEventListener("click", () => {
  state.parent += 1;
  save(state);
  render();
});

document.getElementById("add-child").addEventListener("click", () => {
  state.child += 1;
  save(state);
  render();
});

document.getElementById("reset-today").addEventListener("click", () => {
  state = { date: todayKey, parent:0, child:0 };
  save(state);
  render();
});

document.getElementById("copy-summary").addEventListener("click", async () => {
  const text = `幸福魔法師｜今日一句話：我看見了彼此的好。家長得分 ${state.parent}，孩子得分 ${state.child}。`;
  try{
    await navigator.clipboard.writeText(text);
    summary.textContent = "已複製 ✅ 你可以貼給家人/社群。";
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    summary.textContent = "已複製 ✅（備援模式）";
  }
});
