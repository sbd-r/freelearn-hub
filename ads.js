"use strict";
/* Android-only helpers: AdMob interstitial, system share sheet, opening links. */
const Native = {
  opens: 0,
  ready: false,

  plugin(name) {
    const C = window.Capacitor;
    if (!C || !C.isNativePlatform || !C.isNativePlatform()) return null;
    return (C.Plugins && C.Plugins[name]) || (C.registerPlugin ? C.registerPlugin(name) : null);
  },

  /* Resolves true once an ad was shown and closed, false if it could not be shown. Never throws. */
  async interstitial() {
    const P = Native.plugin("AdMob");
    if (!P) return false;
    try {
      if (!Native.ready) { await P.initialize({}); Native.ready = true; }
      return await new Promise(async resolve => {
        const hs = [];
        let done = false, timer = null;
        const finish = ok => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          hs.forEach(h => { try { h && h.remove && h.remove(); } catch (e) {} });
          resolve(ok);
        };
        timer = setTimeout(() => finish(false), 15000);
        hs.push(await P.addListener("interstitialAdLoaded", () => clearTimeout(timer)));
        hs.push(await P.addListener("interstitialAdDismissed", () => finish(true)));
        hs.push(await P.addListener("interstitialAdFailedToLoad", () => finish(false)));
        hs.push(await P.addListener("interstitialAdFailedToShow", () => finish(false)));
        try {
          await P.prepareInterstitial({ adId: CONFIG.ads.interstitialId, isTesting: CONFIG.ads.testMode });
          await P.showInterstitial();
        } catch (e) { finish(false); }
      });
    } catch (e) { return false; }
  },

  go(url) {
    const w = window.open(url, "_blank", "noopener");
    if (!w) location.href = url;
  },

  /* Ad first (Android app only), then the link. */
  async open(url) {
    Native.opens++;
    if (Native.plugin("AdMob") && Native.opens % CONFIG.ads.everyN === 0) await Native.interstitial();
    Native.go(url);
  },

  /* Returns "shared", "copied" or "cancel". */
  async share(text, url, title) {
    const P = Native.plugin("Share");
    if (P) {
      try { await P.share({ title, text, url, dialogTitle: title }); return "shared"; }
      catch (e) { return "cancel"; }
    }
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return "shared"; }
      catch (e) { return "cancel"; }
    }
    try { await navigator.clipboard.writeText(text + " " + url); return "copied"; } catch (e) {}
    window.prompt(title, text + " " + url);
    return "cancel";
  }
};
