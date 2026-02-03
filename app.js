const cards=[
"對家人說一句謝謝",
"幫忙一個小整理",
"給一個抱抱或拍拍",
"用笑臉回應一次"
];

const KEY="happy-v3";
let s=JSON.parse(localStorage.getItem(KEY)||"{\"p\":0,\"c\":0}");

const p=document.getElementById("p");
const c=document.getElementById("c");
const card=document.getElementById("card");
const toast=document.getElementById("toast");

function save(){localStorage.setItem(KEY,JSON.stringify(s))}
function show(msg){
 toast.textContent=msg;
 toast.style.display="block";
 setTimeout(()=>toast.style.display="none",1200);
}
function render(){p.textContent=s.p;c.textContent=s.c}
render();

draw.onclick=()=>{
 card.textContent=cards[Math.floor(Math.random()*cards.length)];
 show("抽好了！");
}

childGood.onclick=()=>{s.p++;save();render();show("家長 +1")}
parentGood.onclick=()=>{s.c++;save();render();show("孩子 +1")}
reset.onclick=()=>{s={p:0,c:0};save();render();show("明天再來")}
