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

/* Cross-link to the জনদূত app (same developer). Android and in-app: direct APK; iPhone and others: the website. */
const JD_APK = "https://github.com/sbd-r/jonodut-app/releases/latest/download/jonodut-release.apk";
const JD_SITE = "https://sbd-r.github.io/jonodut/";
const JD = {
  bn: ["জনদূত: অভিযোগ ও দরখাস্ত", "ঘুষ-দুর্নীতি, মাদক, চাঁদাবাজি, জমি দখল, নারী ও শিশু নির্যাতন, সাইবার প্রতারণাসহ ৩০টিরও বেশি সমস্যায় অধিকার জানুন, দরখাস্ত লিখুন এবং সঠিক দপ্তরে পাঠান: থানার ওসি, পুলিশ সুপার (এসপি), উপজেলা নির্বাহী কর্মকর্তা (ইউএনও), জেলা প্রশাসক (ডিসি), দুদক ও অন্যান্য দপ্তর। একই ডেভেলপারের ফ্রি অ্যাপ।", "জনদূত অ্যাপ নামান", "জনদূত খুলুন"],
  en: ["Jonodut: complaints & petitions", "Corruption, drugs, extortion, land grabbing, violence against women and children, cyber fraud and 30+ other problems: know your rights, write a petition and send it to the right office: police station (OC), Superintendent of Police (SP), Upazila Nirbahi Officer (UNO), Deputy Commissioner (DC), ACC and more. A free app by the same developer.", "Get Jonodut app", "Open Jonodut"],
  hi: ["जनदूत: शिकायत व आवेदन", "रिश्वत-भ्रष्टाचार, नशा, रंगदारी, ज़मीन कब्ज़ा, महिला-बाल उत्पीड़न, साइबर ठगी समेत 30+ समस्याओं में अधिकार जानें, आवेदन लिखें और सही दफ़्तर को भेजें: थाना (ओसी), पुलिस अधीक्षक (एसपी), उपज़िला निर्वाही अधिकारी (यूएनओ), ज़िलाधिकारी (डीसी), ACC आदि। उसी डेवलपर का मुफ़्त ऐप।", "जनदूत ऐप पाएं", "जनदूत खोलें"],
  ur: ["جن دوت: شکایات اور درخواستیں", "رشوت و بدعنوانی، منشیات، بھتہ، زمین پر قبضہ، خواتین و بچوں پر تشدد، سائبر فراڈ سمیت 30 سے زیادہ مسائل میں حقوق جانیں، درخواست لکھیں اور صحیح دفتر کو بھیجیں: تھانہ (او سی)، پولیس سپرنٹنڈنٹ (ایس پی)، اپزلا نربہی افسر (یو این او)، ڈپٹی کمشنر (ڈی سی)، اے سی سی وغیرہ۔ اسی ڈیولپر کی مفت ایپ۔", "جن دوت ایپ حاصل کریں", "جن دوت کھولیں"]
};
function jdCard() {
  const g = JD[S.lang] || JD.en;
  const apk = inApp() || !isIOS();
  return `<a class="jdc" href="${apk ? JD_APK : JD_SITE}" ${apk ? "" : 'target="_blank" rel="noopener"'}><svg width="40" height="44" viewBox="0 0 72 80" aria-hidden="true"><path d="M36 3 66 14v24c0 19-12 33-30 39C18 71 6 57 6 38V14z" fill="#0b6b4a" stroke="#e8a317" stroke-width="4"/><rect x="22" y="20" width="28" height="34" rx="3" fill="#fff"/><path d="M27 29h18M27 35h18M27 41h11" stroke="#0b6b4a" stroke-width="2.5" stroke-linecap="round"/><circle cx="46" cy="50" r="11" fill="#e8a317"/><path d="m40.5 50 4 4 7-8" fill="none" stroke="#0d1814" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="gt"><b>${esc(g[0])}</b><small>${esc(g[1])}</small></span><span class="gb">${esc(apk ? g[2] : g[3])}</span></a>`;
}
(function () {
  const st = document.createElement("style");
  st.textContent = ".jdc{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:18px 0 0;padding:14px;border-radius:22px;background:#0b6b4a;color:#fff;text-decoration:none}.jdc svg{flex:none}.jdc .gt{flex:1;min-width:0}.jdc b{display:block;font-weight:800;line-height:1.3}.jdc small{display:block;font-size:13px;line-height:1.4;opacity:.92}.jdc .gb{flex:1 1 100%;box-sizing:border-box;text-align:center;padding:11px 14px;border-radius:12px;background:#e8a317;color:#0d1814;font-weight:700;font-size:14px}";
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
${jdCard()}
${partnersBlock()}
<div class="foot"><button class="lnk" data-go="about">${esc(tl("developer"))}: ${esc(CONFIG.developer.name)}</button></div>`;
};

const renderBase = render;
render = function (top) {
  document.body.dataset.view = S.view;
  renderBase(top);
};
render(false);

/* Theme picker: five looks, remembered on this phone. */
(function () {
  const KEY = "fl-theme";
  const ORDER = ["default", "ocean", "forest", "sunset", "midnight"];
  const NAMES = {
    bn: { default: "ডিফল্ট", ocean: "সমুদ্র", forest: "বন", sunset: "সূর্যাস্ত", midnight: "মধ্যরাত" },
    en: { default: "Default", ocean: "Ocean", forest: "Forest", sunset: "Sunset", midnight: "Midnight" },
    hi: { default: "डिफ़ॉल्ट", ocean: "सागर", forest: "वन", sunset: "सूर्यास्त", midnight: "मध्यरात्रि" },
    ur: { default: "ڈیفالٹ", ocean: "سمندر", forest: "جنگل", sunset: "غروب آفتاب", midnight: "آدھی رات" }
  };
  const TITLE = { bn: "থিম", en: "Theme", hi: "थीम", ur: "تھیم" };
  const lang = (document.documentElement.lang || "en").slice(0, 2);
  const N = NAMES[lang] || NAMES.en;
  const T = TITLE[lang] || TITLE.en;

  const get = () => { try { return localStorage.getItem(KEY) || "default"; } catch (e) { return "default"; } };
  const apply = t => {
    if (!ORDER.includes(t) || t === "default") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  };
  apply(get());

  const langBtn = document.getElementById("langBtn");
  const btn = document.createElement("button");
  btn.className = "ibtn";
  btn.id = "themeBtn";
  btn.setAttribute("aria-label", T);
  btn.innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.9 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-7-9-7z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/></svg>';
  langBtn.parentNode.insertBefore(btn, langBtn);

  const close = () => { document.querySelectorAll(".tscrim,.tsheet").forEach(n => n.remove()); };
  const open = () => {
    close();
    const cur = get();
    const scrim = document.createElement("div");
    scrim.className = "scrim tscrim";
    const sheet = document.createElement("div");
    sheet.className = "lsheet tsheet";
    sheet.innerHTML = "<h2>" + T + "</h2>" + ORDER.map(k =>
      '<button type="button" data-tv="' + k + '" aria-current="' + (cur === k) + '">' + N[k] + "<span>" + (cur === k ? "✓" : "") + "</span></button>").join("");
    sheet.addEventListener("click", e => {
      const b = e.target.closest("[data-tv]");
      if (!b) return;
      try { localStorage.setItem(KEY, b.dataset.tv); } catch (err) {}
      apply(b.dataset.tv);
      close();
    });
    scrim.addEventListener("click", close);
    document.body.append(scrim, sheet);
  };
  btn.addEventListener("click", open);
})();
 
