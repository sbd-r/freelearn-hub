/* Settings you can edit. Keep this file small. */
const CONFIG = {
  version: "1.1",

  developer: { name: "Rakibul Islam", email: "flashfacts360s@gmail.com" },

  /* The link people receive when they tap Share.
     After you publish on Google Play, replace it with the Play Store link. */
  shareUrl: "https://sbd-r.github.io/freelearn-hub/",

  ads: {
    testMode: true,   /* true = Google test ads (safe). Set false only for the public release.
                         Never tap real ads on your own app: Google can ban the account. */
    everyN: 1,        /* 1 = an ad before every opened link, 2 = before every second one */
    interstitialId: "ca-app-pub-5053693807902862/4181180242"
  },

  /* Partner organisations. One block per partner, separated by commas:
     { name: "Company name", url: "https://example.com", note: "One short line", logo: "https://example.com/logo.png" }
     "note" and "logo" are optional. */
  partners: [],

  /* Topics shown on the home screen, in this order. */
  topics: ["ai","bcs","adm","ssc","hist","prog","math","sci","lang","biz","exam","design","health","digital","skill","agri","elec","arts","sec","gen"],
  topicsShown: 8
};
