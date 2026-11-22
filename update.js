"use strict";
/* Update notice. Shows a banner in the Android app when a newer APK is out.
   build.js exists only inside the APK, so website visitors see nothing here. */
(function () {
  if (typeof window.BUILD !== "number") return;

  const API = "https://api.github.com/repos/sbd-r/freelearn-hub/releases/latest";
  const APK = "https://github.com/sbd-r/freelearn-hub/releases/latest/download/freelearn-release.apk";
  const KEY = "fl-update-dismissed";
  const T = {
    bn: ["নতুন ভার্সন এসেছে", "আপডেট", "পরে"],
    en: ["A new version is out", "Update", "Later"],
    hi: ["नया वर्शन आ गया है", "अपडेट करें", "बाद में"],
    ur: ["نیا ورژن آ گیا ہے", "اپ ڈیٹ کریں", "بعد میں"]
  };
  const L = T[(document.documentElement.lang || "en").slice(0, 2)] || T.en;

  const style = document.createElement("style");
  style.textContent = ".upd{position:fixed;inset-inline:12px;bottom:calc(var(--dock,64px) + 14px + env(safe-area-inset-bottom));z-index:40;display:flex;align-items:center;gap:10px;max-width:616px;margin:0 auto;padding:12px 14px;border-radius:18px;background:#2E2A5E;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25)}.upd span{flex:1;font-weight:700;font-size:15px}.upd a{padding:9px 14px;border-radius:12px;background:#FFB800;color:#2E2A5E;font-weight:800;text-decoration:none;font-size:14px}.upd button{padding:9px 10px;border:0;background:none;color:#fff;opacity:.8;font-size:14px}";
  document.head.appendChild(style);

  function show(latest) {
    const box = document.createElement("div");
    box.className = "upd";
    box.innerHTML = '<span>' + L[0] + '</span><a href="' + APK + '" target="_blank" rel="noopener">' + L[1] + '</a><button type="button">' + L[2] + '</button>';
    box.querySelector("button").onclick = function () {
      try { localStorage.setItem(KEY, String(latest)); } catch (e) {}
      box.remove();
    };
    document.body.appendChild(box);
  }

  async function check() {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(function () { ctl.abort(); }, 8000);
      const r = await fetch(API, { signal: ctl.signal, headers: { Accept: "application/vnd.github+json" } });
      clearTimeout(timer);
      if (!r.ok) return;
      const j = await r.json();
      const m = /(\d+)\s*$/.exec(j.name || "");
      if (!m) return;
      const latest = +m[1];
      if (!(latest > window.BUILD)) return;
      try { if (+localStorage.getItem(KEY) >= latest) return; } catch (e) {}
      show(latest);
    } catch (e) { /* offline or blocked: stay silent */ }
  }

  setTimeout(check, 2500);
})();
