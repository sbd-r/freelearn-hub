"use strict";
/* Colourful home screen. Loaded after main.js and replaces the home body. */
const TOPIC_ICON = { ai: "🤖", bcs: "🏛️", adm: "🎓", ssc: "📝", hist: "🏺", prog: "💻", math: "📐", sci: "🔬", lang: "🗣️", biz: "💼", exam: "📚", design: "🎨", health: "❤️", digital: "📱", skill: "🛠️", agri: "🌾", elec: "⚡", arts: "🎭", sec: "🔒", gen: "🌍" };
const TYPE_ICON = { c: "🎬", b: "📖", y: "▶️", t: "🏫", a: "📱", s: "💿" };
const TONES = ["#FF8AC0", "#FFB800", "#6DB6FF", "#A99BFF"];

homeBody = function () {
  if (S.q.trim()) {
    const res = ALL.filter(x => hit(x, S.q));
    return res.length ? `<p class="fine">${esc(tl("results").replace("{n}", fmt(res.length)))}</p>${groups(res, true)}` : `<p class="fine">${esc(tl("none"))}</p>`;
  }
  const all = CONFIG.topics.filter(k => nCat[k]);
  const shown = S.allTopics ? all : all.slice(0, CONFIG.topicsShown);
  const tiles = shown.map((k, i) => `<li><button class="tile" data-go="topic:${k}"><span class="ico" style="--c:${TONES[i % TONES.length]}">${TOPIC_ICON[k] || "📚"}</span><span><b>${esc(catName(k))}</b><small>${esc(fmt(nCat[k]))}</small></span></button></li>`).join("");
  const strip = TYPES.map(t => `<button class="st" data-go="type:${t}"><span class="e">${TYPE_ICON[t]}</span><span><b>${esc(tl("types")[t])}</b><small>${esc(fmt(nType[t] || 0))}</small></span></button>`).join("");
  return `<h2 class="sec">${esc(tl("byTopic"))}</h2><ul class="tiles">${tiles}</ul>
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
