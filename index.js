const translate = require("@iamtraction/google-translate");
const express = require("express");
const app = express();
const router = express.Router();
const languages = require("./lang.json");

app.use(express.json());

function convertSrtToJson(srtData) {
  return srtData
    .split("\n\n")
    .map((subtitle) => {
      const lines = subtitle.split("\n");
      const index = lines[0];
      const time = lines[1];
      const text = lines.slice(2).join("\n");
      return { index, time, text };
    })
    .filter((subtitle) => subtitle.index && subtitle.time && subtitle.text);
}

function convertJsonToSrt(jsonSubtitle) {
  return jsonSubtitle
    .map((subtitle) => `${subtitle.index}\n${subtitle.time}\n${subtitle.text}`)
    .join("\n\n");
}

router.post("/translate", async (req, res) => {
  try {
    const { text, lang } = req.body;
    if (!text || !lang) {
      throw new Error("text and lang are required");
    }
    if (!languages.includes(lang)) {
      throw new Error("invalid language");
    }
    const language = languages.find(
      (language) => language["language"] === lang
    )["code"];

    const srtData = convertSrtToJson(text);

    for (const entry of srtData) {
      const result = await translate(entry.text, {
        to: language,
        from: "en",
      });
      entry.text = result.text;
    }
    res.json(convertJsonToSrt(srtData)).status(200);
  } catch (err) {
    console.log(err);
    res.json(err).status(500);
  }
});

router.get("/ad_settings", (req, res) => {
  res.status(200).json({
    in_review: false,
    shareURL:
      "https://play.google.com/store/apps/details?id=com.sofascore.results",
    ad_active: false,
    appOpen_adUnit: "ca-app-pub-3940256099942544/9257395921",
    appOpenAdmob: true,
    interstitial_adUnit2: "94d6dc8b915a0c3e",
    interstritalAdmob2: false,
    interstitial_adUnit: "ca-app-pub-3940256099942544/1033173712",
    interstritalAdmob: true,
    native_adUnit: "ca-app-pub-3940256099942544/2247696110",
    nativeAdmob: true,
    native_adUnit2: "ca-app-pub-3940256099942544/2247696110",
    nativeAdmob2: false,
    banner_adUnit: "668fa7d7ef8a8246",
    bannerAdmob: false,
    video_adUnit: "668fa7d7ef8a8246",
    videoAdmob: false,
    appLoving_sdk:
      "LRdnAx9i1tNKQP7inqTDV9b8IP4nqn0NTCOeB60amlwoTNWh36dwFvbJNSqi3llWvHWtCR1BQ1AOzGM5ruTUHT",
    screen1: false,
    screen2: false,
    screen3: false,
    videoAdmob: true,
    videoAdUnit: "ca-app-pub-3940256099942544/5224354917",
    redirect: false,
  });
});

router.get("/testing", (req, res) => {
  res.status(200).json({
    test: "testing!",
  });
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
