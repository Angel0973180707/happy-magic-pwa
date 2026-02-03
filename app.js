'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  const DEFAULT_MAGIC_A = [
    "自動吃一口青菜",
    "自動收一樣東西回原位",
    "自動分享一件今天的心事",
    "自動講一個笑話/小故事",
    "自動說一句甜心話"
  ]; // 大人願望池：希望寶貝做到

  const DEFAULT_MAGIC_B = [
    "自動講話溫柔一點",
    "自動聽我說完",
    "自動給我一個抱抱",
    "自動講一個睡前故事",
    "自動陪我笑一下"
  ]; // 寶貝願望池：希望大人做到

  const KEY = "happyMagic_v5";

  const initial = {
    mode: "parent",
    scoreA: 0,
    scoreB: 0,
    wishesA: [], // 大人願望池（希望寶貝自動）
    wishesB: [], // 寶貝願望池（希望大人自動）
    lastShare: "",
    lastMagic: ""
  };

  let s;
  try {
    s = JSON.parse(localStorage.getItem(KEY)) || initial;
  } catch (e) {
    s = initial;
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => (t.style.display = "none"), 1300);
  }

  function names() {
    if (s.mode === "sibling") {
      return { A: "哥哥", B: "妹妹" };
    }
    return { A: "大人", B: "寶貝" };
  }

  function setText() {
    const n = names();
    // score labels
    $("aName").textContent = n.A;
    $("bName").textContent = n.B;
    $("aName2").textContent = n.A;
    $("bName2").textContent = n.B;
    $("aName3").textContent = n.A;
    $("bName3").textContent = n.B;
    $("aName4").textContent = n.A;
    $("bName4").textContent = n.B;
    $("aName5").textContent = n.A;
    $("bName5").textContent = n.B;
    $("aName6").textContent = n.A;
    $("bName6").textContent = n.B;
    $("aName7").textContent = n.A;
    $("bName7").textContent = n.B;
    $("aName8").textContent = n.A;
    $("bName8").textContent = n.B;
    $("aName9").textContent = n.A;
    $("bName9").textContent = n.B;
    $("aName10").textContent = n.A;
    $("bName10").textContent = n.B;

    $("aScore").textContent = String(s.scoreA);
    $("bScore").textContent = String(s.scoreB);

    $("magicResult").textContent = s.lastMagic || "按上面任一顆，抽一件「讓對方自動完成」的事。";
    $("lastShare").textContent = s.lastShare || "今天先一件一點，就很好。";

    // mode button styles
    $("modeParent").classList.toggle("active", s.mode === "parent");
    $("modeSibling").classList.toggle("active", s.mode === "sibling");
  }

  function renderLists() {
    const n = names();
    const listA = $("listA");
    const listB = $("listB");

    const wishesA = (s.wishesA && s.wishesA.length ? s.wishesA : DEFAULT_MAGIC_A).slice();
    const wishesB = (s.wishesB && s.wishesB.length ? s.wishesB : DEFAULT_MAGIC_B).slice();

    listA.innerHTML = wishesA.map((w, idx) => {
      // only show delete for user-added wishes (not defaults)
      const deletable = s.wishesA && idx < s.wishesA.length;
      return `<div class="item"><div class="t">${w}</div>${deletable ? `<button data-del="A" data-i="${idx}">刪</button>` : ""}</div>`;
    }).join("");

    listB.innerHTML = wishesB.map((w, idx) => {
      const deletable = s.wishesB && idx < s.wishesB.length;
      return `<div class="item"><div class="t">${w}</div>${deletable ? `<button data-del="B" data-i="${idx}">刪</button>` : ""}</div>`;
    }).join("");

    // event delegation for deletes
    [listA, listB].forEach(list => {
      list.onclick = (e) => {
        const btn = e.target.closest("button[data-del]");
        if (!btn) return;
        const pool = btn.getAttribute("data-del");
        const i = Number(btn.getAttribute("data-i"));
        if (pool === "A") {
          s.wishesA.splice(i, 1);
          save(); renderAll(); toast(`${n.A}願望刪除`);
        } else {
          s.wishesB.splice(i, 1);
          save(); renderAll(); toast(`${n.B}願望刪除`);
        }
      };
    });
  }

  function pickFrom(poolArr) {
    return poolArr[Math.floor(Math.random() * poolArr.length)];
  }

  function poolA() {
    return (s.wishesA && s.wishesA.length ? s.wishesA : DEFAULT_MAGIC_A);
  }
  function poolB() {
    return (s.wishesB && s.wishesB.length ? s.wishesB : DEFAULT_MAGIC_B);
  }

  function renderAll() {
    setText();
    renderLists();
  }

  // Mode switching
  $("modeParent").onclick = () => {
    s.mode = "parent";
    save(); renderAll(); toast("切到親子模式");
  };
  $("modeSibling").onclick = () => {
    s.mode = "sibling";
    save(); renderAll(); toast("切到兄弟姊妹模式");
  };

  // Magic draw: 抽給B => 用A願望池（希望B自動）
  $("drawForB").onclick = () => {
    const n = names();
    const task = pickFrom(poolA());
    s.lastMagic = `給${n.B}：${task}`;
    save(); renderAll(); toast("抽好了 ✨");
  };
  // Magic draw: 抽給A => 用B願望池（希望A自動）
  $("drawForA").onclick = () => {
    const n = names();
    const task = pickFrom(poolB());
    s.lastMagic = `給${n.A}：${task}`;
    save(); renderAll(); toast("抽好了 ✨");
  };

  // Completion scoring
  $("bDid").onclick = () => {
    const n = names();
    s.scoreA += 1; // B做得好 => A+1
    save(); renderAll(); toast(`${n.A} +1`);
  };
  $("aDid").onclick = () => {
    const n = names();
    s.scoreB += 1; // A做得好 => B+1
    save(); renderAll(); toast(`${n.B} +1`);
  };

  // Magnet share scoring + optional note
  $("shareB").onclick = () => {
    const n = names();
    const note = $("shareInput").value.trim();
    s.lastShare = note ? `✨ ${n.B}分享：${note}` : `✨ ${n.B}分享了一件快樂`;
    $("shareInput").value = "";
    s.scoreA += 1; // B分享 => A+1
    save(); renderAll(); toast(`${n.A} +1`);
  };
  $("shareA").onclick = () => {
    const n = names();
    const note = $("shareInput").value.trim();
    s.lastShare = note ? `✨ ${n.A}分享：${note}` : `✨ ${n.A}分享了一件快樂`;
    $("shareInput").value = "";
    s.scoreB += 1; // A分享 => B+1
    save(); renderAll(); toast(`${n.B} +1`);
  };

  // Add wishes
  function addWish(which) {
    const n = names();
    const v = $("wishInput").value.trim();
    if (!v) return toast("先輸入一個願望");
    if (which === "A") {
      s.wishesA = s.wishesA || [];
      s.wishesA.unshift(v);
      toast(`加入${n.A}願望池`);
    } else {
      s.wishesB = s.wishesB || [];
      s.wishesB.unshift(v);
      toast(`加入${n.B}願望池`);
    }
    $("wishInput").value = "";
    save(); renderAll();
  }
  $("addToA").onclick = () => addWish("A");
  $("addToB").onclick = () => addWish("B");

  // Initial render
  renderAll();

  // Safety: show error if any uncaught runtime error
  window.addEventListener("error", (ev) => {
    // do not spam; show once
    if (window.__shown_err) return;
    window.__shown_err = true;
    toast("⚠️ 有一個小錯誤，請重新整理一次");
    console.error(ev.error || ev.message);
  });
});
