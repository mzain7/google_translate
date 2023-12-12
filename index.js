const translate = require("@iamtraction/google-translate");
const express = require("express");
const app = express();
const router = express.Router();

app.use(express.json());


function convertSrtToJson(srtData) {
  return srtData
    .split('\n\n')
    .map((subtitle) => {
      const lines = subtitle.split('\n');
      const index = lines[0];
      const time = lines[1];
      const text = lines.slice(2).join('\n');
      return { index, time, text };
    })
    .filter((subtitle) => subtitle.index && subtitle.time && subtitle.text);
}

function convertJsonToSrt(jsonSubtitle) {
  return jsonSubtitle
    .map((subtitle) => `${subtitle.index}\n${subtitle.time}\n${subtitle.text}`)
    .join('\n\n');
}

router.post("/translate", async (req, res) => {
  try {
    const { text, lang } = req.body;
    const srtData =  convertSrtToJson(text);
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

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
