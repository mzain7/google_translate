const translate = require("@iamtraction/google-translate");
const express = require("express");
const { parse, stringify } = require("srt-to-json");

const app = express();
const router = express.Router();

app.use(express.json());

router.post("/translate", async (req, res) => {
  try {
    const { text, lang } = req.body;
    const srtData = parse(text);
    for (const entry of srtData) {
      const result = await translate(entry.text, {
        to: lang,
        from: "en",
      });
      entry.text = result.text;
    }
    res.json(stringify(srtData)).status(200);
  } catch (err) {
    res.json(err).status(500);
  }
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
