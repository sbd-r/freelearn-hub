"use strict";
/* Colourful home screen. Loaded after main.js and replaces the home body. */
const TOPIC_ICON = { ai: "🤖", bcs: "🏛️", adm: "🎓", ssc: "📝", hist: "🏺", prog: "💻", math: "📐", sci: "🔬", lang: "🗣️", biz: "💼", exam: "📚", design: "🎨", health: "❤️", digital: "📱", skill: "🛠️", agri: "🌾", elec: "⚡", arts: "🎭", sec: "🔒", gen: "🌍" };
const TYPE_ICON = { c: "🎬", b: "📖", y: "▶️", t: "🏫", a: "📱", s: "💿" };
const TONES = ["#FF8AC0", "#FFB800", "#6DB6FF", "#A99BFF"];

/* "Get the Android app" card: shown on the website only, never inside the app. */
const APK_URL = "https://github.com/sbd-r/freelearn-hub/releases/latest/download/freelearn-release.apk";
const GET = {
  bn: ["অ্যান্ড্রয়েড অ্যাপ নামান", "ফোনে ইনস্টল করে সরাসরি ব্যবহার করুন।", "APK ডাউনলোড"],
  en: ["Get the Android app", "Install it on your phone.", "Download APK"],
  hi: ["एंड्रॉइड ऐप पाएं", "अपने फ़ोन पर इंस्टॉल करें।", "APK डाउनलोड"],
  ur: ["اینڈرائیڈ ایپ حاصل کریں", "اپنے فون پر انسٹال کریں۔", "APK ڈاؤن لوڈ"]
};
const inApp = () => !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
function getCard() {
  if (inApp() || isIOS()) return "";
  const g = GET[S.lang] || GET.en;
  return `<a class="get" href="${APK_URL}" download><span class="e">📲</span><span class="gt"><b>${esc(g[0])}</b><small>${esc(g[1])}</small></span><span class="gb">${esc(g[2])}</span></a>`;
}
(function () {
  const st = document.createElement("style");
  st.textContent = ".get{display:flex;align-items:center;gap:12px;margin:18px 0 0;padding:14px;border-radius:22px;background:var(--yellow);color:#2E2A5E;text-decoration:none}.get .e{font-size:28px}.get .gt{flex:1;min-width:0}.get b{display:block;font-weight:800;line-height:1.3}.get small{display:block;font-size:13px;opacity:.85}.get .gb{flex:none;padding:9px 14px;border-radius:12px;background:#2E2A5E;color:#fff;font-weight:700;font-size:14px}";
  document.head.appendChild(st);
})();

homeBody = function () {
  if (S.q.trim()) {
    const res = ALL.filter(x => hit(x, S.q));
    return res.length ? `<p class="fine">${esc(tl("results").replace("{n}", fmt(res.length)))}</p>${groups(res, true)}` : `<p class="fine">${esc(tl("none"))}</p>`;
  }
  const all = CONFIG.topics.filter(k => nCat[k]);
  const shown = S.allTopics ? all : all.slice(0, CONFIG.topicsShown);
  const tiles = shown.map((k, i) => `<li><button class="tile" data-go="topic:${k}"><span class="ico" style="--c:${TONES[i % TONES.length]}">${TOPIC_ICON[k] || "📚"}</span><span><b>${esc(catName(k))}</b><small>${esc(fmt(nCat[k]))}</small></span></button></li>`).join("");
  const strip = TYPES.map(t => `<button class="st" data-go="type:${t}"><span class="e">${TYPE_ICON[t]}</span><span><b>${esc(tl("types")[t])}</b><small>${esc(fmt(nType[t] || 0))}</small></span></button>`).join("");
  return `${getCard()}<h2 class="sec">${esc(tl("byTopic"))}</h2><ul class="tiles">${tiles}</ul>
${all.length > shown.length || S.allTopics ? `<button class="lnk" data-act="topics">${esc(tl(S.allTopics ? "fewer" : "allTopics"))}</button>` : ""}
<h2 class="sec">${esc(tl("byType"))}</h2><div class="strip">${strip}</div>
${partnersBlock()}
<div class="foot"><button class="lnk" data-go="about">${esc(tl("developer"))}: ${esc(CONFIG.developer.name)}</button></div>`;
};

const renderBase = render;
render = function (top) {
  document.body.dataset.view = S.view;
  renderBase(top);
};
render(false);
