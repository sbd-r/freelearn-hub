"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };
const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

const TYPES = ["c", "b", "y", "t", "a", "s"];
const LANGS = [["bn", "বাংলা", "বাং"], ["en", "English", "EN"], ["hi", "हिन्दी", "हिं"], ["ur", "اردو", "اردو"]];
const DIGITS = { bn: "bn-BD", en: "en", hi: "hi-IN", ur: "ur-PK" };
const PATH = {
  home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
  bookmark: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  share: '<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="m8 11 8-4M8 13l8 4"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  ext: '<path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  flag: '<path d="M6 21V4M6 5h11l-2 4 2 4H6"/>'
};
const ic = (n, c = "") => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${PATH[n]}</svg>`;

/* ---------- state ---------- */
const S = { lang: "bn", view: "home", type: "c", cat: "all", topic: "", q: "", shown: 60, allTopics: false, n: 0 };
let saved = [];
const ALL = ITEMS.map((it, i) => ({ i, type: it[0], cat: it[1], name: it[2], url: it[3], host: host(it[3]),
  hay: (it[2] + " " + host(it[3]) + " " + Object.values(CAT[it[1]] || {}).join(" ")).toLowerCase() }));
const nType = {}, nCat = {};
ALL.forEach(x => { nType[x.type] = (nType[x.type] || 0) + 1; nCat[x.cat] = (nCat[x.cat] || 0) + 1; });

const tl = k => I18N[S.lang][k];
const catName = k => (CAT[k] || {})[S.lang] || k;
const fmt = n => { try { return new Intl.NumberFormat(DIGITS[S.lang]).format(n); } catch (e) { return String(n); } };
const hit = (x, q) => q.trim().toLowerCase().split(/\s+/).every(w => x.hay.includes(w));

/* ---------- pieces ---------- */
function meta(x) {
  if (x.host !== "youtube.com") return x.host;
  const p = new URL(x.url).pathname;
  return p.startsWith("/@") ? decodeURIComponent(p.slice(1)) : p.startsWith("/playlist") ? tl("ytList") : tl("ytSearch");
}
function rowHTML(x, showCat) {
  const on = saved.includes(x.url);
  return `<li><button class="mark" data-save="${x.i}" aria-pressed="${on}" aria-label="${esc(tl("save"))}">${ic("bookmark")}</button>
<button class="row" data-open="${x.i}"><span class="t">${esc(x.name)}</span>
<span class="m"><span class="host">${esc(meta(x))}</span>${showCat ? `<span class="cat">${esc(catName(x.cat))}</span>` : ""}</span>
<span class="go">${ic("ext")}</span></button></li>`;
}
function groups(list, showCat) {
  let budget = S.shown, out = "", more = false;
  for (const t of TYPES) {
    const part = list.filter(x => x.type === t);
    if (!part.length) continue;
    if (budget <= 0) { more = true; break; }
    const take = part.slice(0, budget);
    if (take.length < part.length) more = true;
    budget -= take.length;
    out += `<h2 class="grp">${esc(tl("types")[t])}<small>${fmt(part.length)}</small></h2><ol class="sheet">${take.map(x => rowHTML(x, showCat)).join("")}</ol>`;
  }
  return out + (more ? `<button class="lnk" data-act="more">${esc(tl("more"))}</button>` : "");
}
const head = (title, sub) => `<div class="page"><button class="ibtn" data-act="back" aria-label="${esc(tl("back"))}">${ic("back", "flip")}</button>
<div><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div></div>`;
const field = () => `<label class="field">${ic("search")}<input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(tl("ph"))}" value="${esc(S.q)}"></label>`;
const countText = n => tl("count").replace("{n}", fmt(n));
const mailto = subject => `mailto:${CONFIG.developer.email}?subject=${encodeURIComponent(subject)}`;

function tocRow(go, label, n) {
  return `<li><button class="tocrow" data-go="${go}"><span>${esc(label)}</span><span class="dots"></span><span class="num">${fmt(n)}</span></button></li>`;
}
function partnersBlock() {
  const ps = CONFIG.partners;
  const list = ps.length ? `<ul class="partners">${ps.map((p, i) => `<li><button class="prt" data-partner="${i}">${p.logo ? `<img class="mono" src="${esc(p.logo)}" alt="">` : `<span class="mono">${esc((p.name || "?").trim().charAt(0).toUpperCase())}</span>`}<span><b>${esc(p.name)}</b>${p.note ? `<small>${esc(p.note)}</small>` : ""}</span></button></li>`).join("")}</ul>` : "";
  return `<h2 class="sec">${esc(tl("partners"))}</h2>${list}<div class="cta">${ps.length ? "" : `<p>${esc(tl("partnersEmpty"))}</p>`}<a class="lnk" href="${mailto(tl("partnerSubject"))}">${esc(tl("becomePartner"))}</a></div>`;
}

/* ---------- views ---------- */
function homeBody() {
  if (S.q.trim()) {
    const res = ALL.filter(x => hit(x, S.q));
    return res.length ? `<p class="fine">${esc(tl("results").replace("{n}", fmt(res.length)))}</p>${groups(res, true)}` : `<p class="fine">${esc(tl("none"))}</p>`;
  }
  const all = CONFIG.topics.filter(k => nCat[k]);
  const shown = S.allTopics ? all : all.slice(0, CONFIG.topicsShown);
  return `<h2 class="sec">${esc(tl("byTopic"))}</h2><ul class="toc">${shown.map(k => tocRow("topic:" + k, catName(k), nCat[k])).join("")}</ul>
${all.length > shown.length || S.allTopics ? `<button class="lnk" data-act="topics">${esc(tl(S.allTopics ? "fewer" : "allTopics"))}</button>` : ""}
<h2 class="sec">${esc(tl("byType"))}</h2><ul class="toc">${TYPES.map(t => tocRow("type:" + t, tl("types")[t], nType[t] || 0)).join("")}</ul>
${partnersBlock()}
<div class="foot"><button class="lnk" data-go="about">${esc(tl("developer"))}: ${esc(CONFIG.developer.name)}</button></div>`;
}
const home = () => `<section class="ask"><h1>${esc(tl("ask"))}</h1>${field()}</section><div id="body">${homeBody()}</div>`;

function listBody() {
  const res = ALL.filter(x => x.type === S.type && (S.cat === "all" || x.cat === S.cat) && hit(x, S.q));
  if (!res.length) return `<p class="fine">${esc(tl("none"))}</p>`;
  return `<ol class="sheet">${res.slice(0, S.shown).map(x => rowHTML(x, S.cat === "all")).join("")}</ol>` +
    (res.length > S.shown ? `<button class="lnk" data-act="more">${esc(tl("more"))}</button>` : "");
}
function list() {
  const cats = [...new Set(ALL.filter(x => x.type === S.type).map(x => x.cat))];
  const tabs = ["all", ...cats].map(c => `<button data-cat="${c}" aria-current="${S.cat === c}">${esc(c === "all" ? tl("all") : catName(c))}</button>`).join("");
  return head(tl("types")[S.type], countText(nType[S.type] || 0)) + field() + `<div class="tabs">${tabs}</div><div id="body">${listBody()}</div>`;
}
const topic = () => head(catName(S.topic), countText(nCat[S.topic] || 0)) + groups(ALL.filter(x => x.cat === S.topic), false);
function savedView() {
  const res = ALL.filter(x => saved.includes(x.url));
  return head(tl("saved"), res.length ? countText(res.length) : "") + (res.length ? groups(res, true) : `<p class="fine">${esc(tl("savedEmpty"))}</p>`);
}
function about() {
  const d = CONFIG.developer;
  return head(tl("about"), "") + `<section class="who"><small>${esc(tl("developer"))}</small><div class="name">${esc(d.name)}</div><a class="lnk" href="mailto:${esc(d.email)}">${esc(d.email)}</a></section>
<div class="btns"><button class="btn" data-act="share">${ic("share")}${esc(tl("share"))}</button><a class="btn alt" href="${mailto(tl("reportSubject"))}">${ic("flag")}${esc(tl("report"))}</a></div>
${partnersBlock()}<p class="fine">${esc(tl("disclaimer"))}</p><p class="fine">${esc(tl("version"))} ${esc(CONFIG.version)}</p>`;
}
const VIEWS = { home, list, topic, saved: savedView, about };

/* ---------- shell ---------- */
function applyLang() {
  const L = LANGS.find(l => l[0] === S.lang);
  document.documentElement.lang = S.lang;
  document.documentElement.dir = S.lang === "ur" ? "rtl" : "ltr";
  document.title = tl("brand");
  $("#brandName").textContent = tl("brand");
  $("#shareBtn").setAttribute("aria-label", tl("share"));
  $("#langBtn").textContent = L[2];
  $("#langBtn").setAttribute("aria-label", tl("lang"));
  const root = { home: "home", list: "home", topic: "home", saved: "saved", about: "about" }[S.view];
  $("#dock").innerHTML = [["home", "home"], ["saved", "bookmark"], ["about", "info"]].map(([v, i]) =>
    `<button data-go="${v}" aria-current="${root === v}"><span class="pill">${ic(i)}</span>${esc(tl(v))}</button>`).join("");
}
function render(top) {
  applyLang();
  $("#view").innerHTML = VIEWS[S.view]();
  const q = $("#q");
  if (q) q.addEventListener("input", () => { S.q = q.value; S.shown = 60; refresh(); });
  if (top) window.scrollTo(0, 0);
}
const refresh = () => { $("#body").innerHTML = S.view === "home" ? homeBody() : listBody(); };
const snap = () => ({ view: S.view, type: S.type, cat: S.cat, topic: S.topic, n: S.n });

function nav(view, o = {}, replace = false) {
  Object.assign(S, { view, type: o.type || S.type, cat: "all", topic: o.topic || "", q: "", shown: 60 });
  S.n = replace ? S.n : S.n + 1;
  history[replace ? "replaceState" : "pushState"](snap(), "");
  render(true);
}
window.addEventListener("popstate", e => {
  if (e.state) Object.assign(S, e.state, { q: "", shown: 60 }); else Object.assign(S, { view: "home", n: 0, q: "" });
  render(true);
});

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  $("#layer").appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
const closeLayer = () => { $("#layer").innerHTML = ""; };
function langSheet() {
  $("#layer").innerHTML = `<div class="scrim" data-act="close"></div><div class="lsheet" role="dialog" aria-label="${esc(tl("langTitle"))}"><h2>${esc(tl("langTitle"))}</h2>` +
    LANGS.map(([k, name]) => `<button data-lang="${k}" aria-current="${S.lang === k}"><span>${name}</span>${S.lang === k ? ic("check") : ""}</button>`).join("") + "</div>";
}

document.addEventListener("click", async e => {
  const el = e.target.closest("[data-go],[data-open],[data-save],[data-cat],[data-act],[data-lang],[data-partner]");
  if (!el) return;
  const d = el.dataset;
  if (d.go) {
    const [v, a] = d.go.split(":");
    closeLayer();
    if (v === "topic") nav("topic", { topic: a }); else if (v === "type") nav("list", { type: a }); else nav(v);
  } else if (d.open) {
    Native.open(ALL[+d.open].url);
  } else if (d.partner) {
    Native.go(CONFIG.partners[+d.partner].url);
  } else if (d.save) {
    const u = ALL[+d.save].url;
    saved = saved.includes(u) ? saved.filter(s => s !== u) : saved.concat(u);
    store("saved", JSON.stringify(saved));
    if (S.view === "saved") render(false); else el.setAttribute("aria-pressed", saved.includes(u));
  } else if (d.cat) {
    S.cat = d.cat; S.shown = 60;
    history.replaceState(snap(), "");
    document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-current", b === el));
    refresh();
  } else if (d.lang) {
    S.lang = d.lang; store("lang", S.lang); closeLayer(); render(false);
  } else if (d.act === "back") {
    if (S.n > 0) history.back(); else nav("home", {}, true);
  } else if (d.act === "share") {
    const r = await Native.share(tl("shareText"), CONFIG.shareUrl, tl("brand"));
    if (r === "copied") toast(tl("copied"));
  } else if (d.act === "lang") { langSheet();
  } else if (d.act === "close") { closeLayer();
  } else if (d.act === "more") { S.shown += 60; if (S.view === "home" || S.view === "list") refresh(); else render(false);
  } else if (d.act === "topics") { S.allTopics = !S.allTopics; refresh(); }
});

(function init() {
  const guess = (navigator.language || "bn").slice(0, 2);
  S.lang = store("lang") || (I18N[guess] ? guess : "bn");
  try { saved = JSON.parse(store("saved") || "[]"); } catch (e) { saved = []; }
  if (history.state && history.state.view) Object.assign(S, history.state);
  else history.replaceState(snap(), "");
  render(false);
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
