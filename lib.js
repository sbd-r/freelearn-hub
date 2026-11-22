"use strict";
/* Online library: live search of free public libraries (millions of books and notes).
   Loaded after theme.js. Needs internet. Nothing here is stored in the app. */
const LT_ALL = {
  bn: { tab: "লাইব্রেরি", title: "অনলাইন লাইব্রেরি", sub: "লক্ষ লক্ষ ফ্রি বই ও নোট", ph: "বই বা বিষয় লিখুন", more: "আরও দেখান", load: "খোঁজা হচ্ছে…", err: "লোড হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।", none: "কিছু পাওয়া যায়নি। অন্য শব্দে খুঁজুন।", hint: "বিষয়ের নাম লিখে খুঁজুন। ইংরেজি শব্দে সবচেয়ে বেশি ফল আসে।", card: "অনলাইন লাইব্রেরি", cardNote: "লক্ষ লক্ষ ফ্রি বই খুঁজুন", count: "{n}টি ফল" },
  en: { tab: "Library", title: "Online library", sub: "Millions of free books and notes", ph: "Type a book or subject", more: "Show more", load: "Searching…", err: "Could not load. Check your internet and try again.", none: "Nothing found. Try another word.", hint: "Type a subject and search. English words give the most results.", card: "Online library", cardNote: "Search millions of free books", count: "{n} results" },
  hi: { tab: "लाइब्रेरी", title: "ऑनलाइन लाइब्रेरी", sub: "लाखों मुफ़्त किताबें और नोट्स", ph: "किताब या विषय लिखें", more: "और दिखाएँ", load: "खोज रहे हैं…", err: "लोड नहीं हुआ। इंटरनेट जाँचकर फिर कोशिश करें।", none: "कुछ नहीं मिला। दूसरा शब्द आज़माएँ।", hint: "विषय लिखकर खोजें। अंग्रेज़ी शब्दों से सबसे ज़्यादा नतीजे मिलते हैं।", card: "ऑनलाइन लाइब्रेरी", cardNote: "लाखों मुफ़्त किताबें खोजें", count: "{n} नतीजे" },
  ur: { tab: "لائبریری", title: "آن لائن لائبریری", sub: "لاکھوں مفت کتابیں اور نوٹس", ph: "کتاب یا موضوع لکھیں", more: "مزید دکھائیں", load: "تلاش جاری ہے…", err: "لوڈ نہیں ہوا۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔", none: "کچھ نہیں ملا۔ کوئی اور لفظ آزمائیں۔", hint: "موضوع لکھ کر تلاش کریں۔ انگریزی الفاظ سے سب سے زیادہ نتائج ملتے ہیں۔", card: "آن لائن لائبریری", cardNote: "لاکھوں مفت کتابیں تلاش کریں", count: "{n} نتائج" }
};
const LT = () => LT_ALL[S.lang] || LT_ALL.en;
const LSRC = ["Project Gutenberg", "Open Library", "Internet Archive", "Wikibooks"];
const LIDEAS = ["physics", "mathematics", "history", "programming", "English grammar", "economics", "biology", "Bangla"];
PATH.lib = '<path d="M4 4h4v16H4zM9.5 4h4v16h-4zM15 6.2l3.8-1 3.1 14.6-3.8 1z"/>';

const LS = { src: 0, q: "", items: [], total: 0, page: 1, busy: false, err: false, token: 0 };

async function getJSON(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error("http " + r.status);
    return await r.json();
  } finally { clearTimeout(timer); }
}
const one = v => Array.isArray(v) ? v.join(", ") : (v || "");
const enc = encodeURIComponent;

const SOURCES = [
  async (q, p) => {
    const d = await getJSON(`https://gutendex.com/books/?search=${enc(q)}&page=${p}`);
    return { total: d.count || 0, items: (d.results || []).map(b => ({ t: b.title, m: (b.authors || []).map(a => a.name).join(", "), url: "https://www.gutenberg.org/ebooks/" + b.id })) };
  },
  async (q, p) => {
    const d = await getJSON(`https://openlibrary.org/search.json?q=${enc(q + " has_fulltext:true")}&page=${p}&limit=20&fields=key,title,author_name,first_publish_year`);
    return { total: d.numFound || 0, items: (d.docs || []).map(b => ({ t: b.title, m: [one(b.author_name && b.author_name.slice(0, 2)), b.first_publish_year].filter(Boolean).join(" · "), url: "https://openlibrary.org" + b.key })) };
  },
  async (q, p) => {
    const d = await getJSON(`https://archive.org/advancedsearch.php?q=${enc("(" + q + ") AND mediatype:(texts OR movies)")}&fl[]=identifier&fl[]=title&fl[]=creator&sort[]=downloads%20desc&rows=20&page=${p}&output=json`);
    const r = d.response || {};
    return { total: r.numFound || 0, items: (r.docs || []).map(b => ({ t: one(b.title) || b.identifier, m: one(b.creator), url: "https://archive.org/details/" + b.identifier })) };
  },
  async (q, p) => {
    const w = ["bn", "en", "hi", "ur"].includes(S.lang) ? S.lang : "en";
    const d = await getJSON(`https://${w}.wikibooks.org/w/api.php?action=query&list=search&srsearch=${enc(q)}&format=json&origin=*&srlimit=20&sroffset=${(p - 1) * 20}`);
    const qq = d.query || {};
    return { total: (qq.searchinfo && qq.searchinfo.totalhits) || 0, items: (qq.search || []).map(b => ({ t: b.title, m: w + ".wikibooks.org", url: `https://${w}.wikibooks.org/wiki/${enc(b.title.replace(/ /g, "_"))}` })) };
  }
];

async function libRun(reset) {
  if (!LS.q.trim()) return;
  if (reset) { LS.items = []; LS.total = 0; LS.page = 1; }
  const my = ++LS.token;
  LS.busy = true; LS.err = false; libPaint();
  try {
    const r = await SOURCES[LS.src](LS.q.trim(), LS.page);
    if (my !== LS.token) return;
    LS.items = LS.items.concat(r.items.filter(x => x.t && /^https:\/\//.test(x.url)));
    LS.total = r.total; LS.got = r.items.length;
  } catch (e) { if (my !== LS.token) return; LS.err = true; }
  LS.busy = false; libPaint();
}

function libBody() {
  const t = LT();
  if (!LS.q.trim()) return `<p class="fine">${esc(t.hint)}</p><div class="chips">${LIDEAS.map(w => `<button class="chip" data-lq="${esc(w)}">${esc(w)}</button>`).join("")}</div>`;
  let out = "";
  if (LS.items.length) {
    out += `<p class="fine">${esc(t.count.replace("{n}", fmt(LS.total)))}</p><ol class="sheet lbooks">${LS.items.map(x =>
      `<li><button class="row" data-ext="${esc(x.url)}"><span class="t">${esc(x.t)}</span><span class="m"><span class="host">${esc(x.m || host(x.url))}</span></span><span class="go">${ic("ext")}</span></button></li>`).join("")}</ol>`;
  }
  if (LS.busy) out += `<p class="fine">${esc(t.load)}</p>`;
  else if (LS.err) out += `<p class="fine">${esc(t.err)}</p>`;
  else if (!LS.items.length) out += `<p class="fine">${esc(t.none)}</p>`;
  else if (LS.got > 0 && LS.items.length < LS.total) out += `<button class="lnk" data-lmore="1">${esc(t.more)}</button>`;
  return out;
}
function libPaint() { const b = document.getElementById("lbody"); if (b) b.innerHTML = libBody(); }

function libView() {
  const t = LT();
  return head(t.title, t.sub) + `<form id="lf"><label class="field">${ic("search")}<input id="lq" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(t.ph)}" value="${esc(LS.q)}"></label></form>` +
    `<div class="tabs">${LSRC.map((n, i) => `<button data-lsrc="${i}" aria-current="${LS.src === i}">${esc(n)}</button>`).join("")}</div><div id="lbody">${libBody()}</div>`;
}
VIEWS.lib = libView;

/* dock with a fourth button */
const applyBase = applyLang;
applyLang = function () {
  applyBase();
  const root = { home: "home", list: "home", topic: "home", lib: "lib", saved: "saved", about: "about" }[S.view];
  $("#dock").innerHTML = [["home", "home"], ["lib", "lib"], ["saved", "bookmark"], ["about", "info"]].map(([v, i]) =>
    `<button data-go="${v}" aria-current="${root === v}"><span class="pill">${ic(i)}</span>${esc(v === "lib" ? LT().tab : tl(v))}</button>`).join("");
};

/* a card on the home screen */
const homeBase = homeBody;
homeBody = function () {
  const b = homeBase();
  if (S.q.trim()) return b;
  const t = LT();
  return `<button class="lcard" data-go="lib"><span class="e">📚</span><span class="gt"><b>${esc(t.card)}</b><small>${esc(t.cardNote)}</small></span></button>` + b;
};

document.addEventListener("submit", e => {
  if (e.target.id !== "lf") return;
  e.preventDefault();
  LS.q = document.getElementById("lq").value;
  document.getElementById("lq").blur();
  libRun(true);
});
document.addEventListener("click", e => {
  const el = e.target.closest("[data-ext],[data-lsrc],[data-lq],[data-lmore]");
  if (!el) return;
  const d = el.dataset;
  if (d.ext) { Native.open(d.ext); }
  else if (d.lsrc !== undefined) {
    LS.src = +d.lsrc;
    document.querySelectorAll("[data-lsrc]").forEach(b => b.setAttribute("aria-current", b === el));
    libRun(true);
  } else if (d.lq) { LS.q = d.lq; const i = document.getElementById("lq"); if (i) i.value = d.lq; libRun(true); }
  else if (d.lmore) { LS.page += 1; libRun(false); }
});

(function () {
  const st = document.createElement("style");
  st.textContent = ".dock{grid-template-columns:repeat(4,1fr)}body[data-view=lib] .page{background:#6DB6FF;color:#2E2A5E}#lf{margin-top:2px}.lbooks li{padding-inline-start:14px}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.chip{padding:9px 14px;border:0;border-radius:999px;background:var(--tile);color:var(--ink);font-weight:700}.lcard{display:flex;align-items:center;gap:12px;width:100%;margin:12px 0 0;padding:14px;border:0;border-radius:22px;background:var(--pink);color:#2E2A5E;text-align:start}.lcard .e{font-size:28px}.lcard b{display:block;font-weight:800;line-height:1.3}.lcard small{display:block;font-size:13px;opacity:.85}";
  document.head.appendChild(st);
})();
render(false);
