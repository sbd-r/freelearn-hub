"use strict";
/* FreeLearn Hub app only. The APK build adds this file (with a line `window.FL_BUILD=<number>;` before it).
   1) hides the website's "Get the app" block inside the app
   2) ⓘ about sheet with the version
   3) new-version notice (checks the latest GitHub release) */
(function () {
  var BUILD = typeof window.FL_BUILD === "number" ? window.FL_BUILD : null;
  var RELEASES = "https://api.github.com/repos/sbd-r/freelearn-hub/releases/latest";
  var APK = "https://github.com/sbd-r/freelearn-hub/releases/latest/download/freelearn-release.apk";
  var TXT = {
    bn: { about: "অ্যাপ সম্পর্কে", ver: "সংস্করণ", dev: "ডেভেলপার", web: "ওয়েবসাইট", pkg: "অ্যাপ আইডি", close: "বন্ধ করুন", upd: "নতুন সংস্করণ এসেছে", updP: "আপডেট করলে নতুন সুবিধা ও ঠিকঠাক কাজ পাবেন। পুরনো অ্যাপের ওপরেই বসবে।", updA: "আপডেট করুন", later: "পরে", desc: "বিশ্বের ফ্রি কোর্স, বই ও সফটওয়্যার এক জায়গায়।" },
    en: { about: "About the app", ver: "Version", dev: "Developer", web: "Website", pkg: "App ID", close: "Close", upd: "A new version is available", updP: "Update to get new features and smooth performance. It installs over the current app and keeps your data.", updA: "Update now", later: "Later", desc: "Free courses, books and software from around the world, in one place." },
    hi: { about: "ऐप के बारे में", ver: "संस्करण", dev: "डेवलपर", web: "वेबसाइट", pkg: "ऐप आईडी", close: "बंद करें", upd: "नया संस्करण उपलब्ध है", updP: "अपडेट करने पर नई सुविधाएँ और बेहतर काम मिलेगा। मौजूदा ऐप पर ही इंस्टॉल होगा।", updA: "अभी अपडेट करें", later: "बाद में", desc: "दुनिया भर के मुफ़्त कोर्स, किताबें और सॉफ़्टवेयर एक जगह।" },
    ur: { about: "ایپ کے بارے میں", ver: "ورژن", dev: "ڈویلپر", web: "ویب سائٹ", pkg: "ایپ آئی ڈی", close: "بند کریں", upd: "نیا ورژن دستیاب ہے", updP: "اپ ڈیٹ کرنے سے نئی سہولیات اور بہتر کارکردگی ملے گی۔ موجودہ ایپ پر ہی انسٹال ہوگی۔", updA: "ابھی اپ ڈیٹ کریں", later: "بعد میں", desc: "دنیا بھر کے مفت کورسز، کتابیں اور سافٹ ویئر ایک جگہ۔" }
  };
  function L() { var l = (document.documentElement.lang || "bn").slice(0, 2); return TXT[l] || TXT.bn; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* 1) the install block is pointless inside the app */
  var get = document.querySelector(".get");
  if (get) get.style.display = "none";

  /* styles for the two boxes added below */
  var st = document.createElement("style");
  st.textContent =
    ".fl-about-scrim,.fl-upd-scrim{position:fixed;inset:0;z-index:70;background:rgba(10,8,30,.45)}" +
    ".fl-about{position:fixed;left:0;right:0;bottom:0;z-index:71;max-width:560px;margin:0 auto;padding:20px 20px calc(20px + env(safe-area-inset-bottom));border-radius:22px 22px 0 0;background:var(--card,#fff);color:var(--ink,#1c1a33);box-shadow:0 -10px 40px rgba(0,0,0,.25)}" +
    ".fl-about .mk{width:56px;height:56px;border-radius:16px;background:linear-gradient(145deg,#8f84ff,#4a3fa0);display:grid;place-items:center;margin-bottom:12px}" +
    ".fl-about .mk svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}" +
    ".fl-about h2{margin:0 0 4px;font-size:20px}.fl-about p{margin:0 0 14px;color:var(--mut,#65617f);font-size:14px}" +
    ".fl-about dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 16px;font-size:14px}" +
    ".fl-about dt{color:var(--mut,#65617f)}.fl-about dd{margin:0;word-break:break-word}" +
    ".fl-about button,.fl-upd button{width:100%;min-height:46px;border:0;border-radius:14px;background:var(--ink,#1c1a33);color:var(--bg,#fff);font-weight:700;font-size:15px}" +
    ".fl-upd{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:71;max-width:560px;margin:0 auto;background:var(--card,#fff);color:var(--ink,#1c1a33);border:1px solid var(--line,#e3e0f0);border-radius:18px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,.3)}" +
    ".fl-upd b{display:block;margin-bottom:4px}.fl-upd span{display:block;color:var(--mut,#65617f);font-size:14px;margin-bottom:12px}" +
    ".fl-upd .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
    ".fl-upd .row a{display:flex;align-items:center;justify-content:center;min-height:46px;border-radius:14px;background:#f2a516;color:#2a1c00;font-weight:700;text-decoration:none}" +
    ".fl-upd .row button{background:transparent;color:var(--ink,#1c1a33);border:1px solid var(--line,#e3e0f0)}";
  document.head.appendChild(st);

  function close() { document.querySelectorAll(".fl-about,.fl-about-scrim,.fl-upd,.fl-upd-scrim").forEach(function (n) { n.remove(); }); }

  /* 2) ⓘ about button, placed next to the theme button */
  function openAbout() {
    close();
    var t = L();
    var ver = BUILD === null ? "dev" : "1.1." + BUILD;
    var scrim = document.createElement("div"); scrim.className = "fl-about-scrim";
    var sh = document.createElement("div"); sh.className = "fl-about"; sh.setAttribute("role", "dialog");
    sh.innerHTML =
      '<div class="mk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5C5.5 5 8.5 5 12 6.8 15.5 5 18.5 5 21 6.5V19c-2.5-1.5-5.5-1.5-9 .3-3.5-1.8-6.5-1.8-9-.3z"/><path d="M12 6.8V19.3"/></svg></div>' +
      "<h2>FreeLearn Hub</h2><p>" + esc(t.desc) + "</p>" +
      "<dl><dt>" + esc(t.ver) + "</dt><dd>" + esc(ver) + "</dd>" +
      "<dt>" + esc(t.dev) + "</dt><dd>Rakibul Islam</dd>" +
      "<dt>" + esc(t.web) + "</dt><dd>sbd-r.github.io/freelearnhub</dd>" +
      "<dt>" + esc(t.pkg) + "</dt><dd>com.freelearn.hub</dd></dl>" +
      '<button type="button">' + esc(t.close) + "</button>";
    scrim.addEventListener("click", close);
    sh.querySelector("button").addEventListener("click", close);
    document.body.appendChild(scrim); document.body.appendChild(sh);
  }
  var tb = document.getElementById("themeBtn");
  var info = document.createElement("button");
  info.type = "button"; info.className = "icon"; info.id = "flAboutBtn";
  info.setAttribute("aria-label", L().about); info.title = L().about;
  info.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5h.01" stroke-width="2.6"/></svg>';
  info.addEventListener("click", openAbout);
  if (tb && tb.parentNode) tb.parentNode.insertBefore(info, tb);
  else document.body.appendChild(info);

  /* 3) new-version notice: the release name ends with the build number ("FreeLearn Hub 123") */
  if (BUILD === null) return;
  setTimeout(function () {
    fetch(RELEASES).then(function (r) { return r.json(); }).then(function (j) {
      var m = /(\d+)\s*$/.exec((j && j.name) || "");
      if (!m) return;
      var latest = +m[1];
      if (latest <= BUILD) return;
      var seen = 0; try { seen = +localStorage.getItem("fl-upd-dismissed") || 0; } catch (e) {}
      if (seen >= latest) return;
      var t = L();
      var box = document.createElement("div"); box.className = "fl-upd"; box.setAttribute("role", "status");
      box.innerHTML = "<b>" + esc(t.upd) + "</b><span>" + esc(t.updP) + '</span><div class="row"><a href="' + APK + '" rel="noopener">' + esc(t.updA) + '</a><button type="button">' + esc(t.later) + "</button></div>";
      box.querySelector("button").addEventListener("click", function () {
        try { localStorage.setItem("fl-upd-dismissed", String(latest)); } catch (e) {}
        box.remove();
      });
      document.body.appendChild(box);
    }).catch(function () {});
  }, 2500);
})();
