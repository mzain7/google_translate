const translate = require("@iamtraction/google-translate");
const express = require("express");
const app = express();
const router = express.Router();

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
    const srtData = convertSrtToJson(text);

    for (const entry of srtData) {
      const result = await translate(entry.text, {
        to: lang,
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
    ad_active: false,
    appOpen_adUnit: "ca-app-pub-3940256099942544/9257395921",
    appOpenAdmob: true,
    interstitial_adUnit: "ca-app-pub-3940256099942544/1033173712",
    interstritalAdmob: true,
    native_adUnit: "ca-app-pub-3940256099942544/2247696110",
    nativeAdmob: true,
    banner_adUnit: "ca-app-pub-3940256099942544/6300978111",
    bannerAdmob: true,
    videoAdUnit: "ca-app-pub-3940256099942544/5224354917",
    videoAdmob: true,
    reward_adUnit: "ca-app-pub-3940256099942544/5224354917",
    rewardAdmob: true,
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
