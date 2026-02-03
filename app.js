const magicDefault=[
"說一句甜心話",
"給一個擁抱",
"分享一件心事",
"幫忙一個歸位",
"講一個笑話"
];

let s=JSON.parse(localStorage.getItem("hm-full")||'{"mode":"parent","a":0,"b":0,"wishes":[]}');
const $=id=>document.getElementById(id);

function save(){localStorage.setItem("hm-full",JSON.stringify(s))}
function toast(t){const el=$("toast");el.textContent=t;el.style.display="block";setTimeout(()=>el.style.display="none",1200)}

function render(){
 $("aScore").textContent=s.a;
 $("bScore").textContent=s.b;
 $("aLabel").textContent=s.mode==="parent"?"大人":"哥哥";
 $("bLabel").textContent=s.mode==="parent"?"寶貝":"妹妹";
 $("wishList").innerHTML=s.wishes.map(w=>`<div>${w}</div>`).join("");
}
render();

$("modeParent").onclick=()=>{s.mode="parent";save();render();toast("親子模式")}
$("modeSibling").onclick=()=>{s.mode="sibling";save();render();toast("兄弟姊妹模式")}

$("drawMagic").onclick=()=>{
 const pool=[...magicDefault,...s.wishes];
 const pick=pool[Math.floor(Math.random()*pool.length)];
 $("magicText").textContent=pick;
 s.a++; save(); render(); toast("魔法成立 ✨");
}

$("shareHappy").onclick=()=>{
 $("shareText").textContent="已分享一件快樂 💛";
 s.b++; save(); render(); toast("貼心吸過來 +1");
}

$("addWish").onclick=()=>{
 const v=$("wishInput").value.trim();
 if(!v)return;
 s.wishes.push(v);
 $("wishInput").value="";
 save(); render(); toast("願望加入 ✨");
}
