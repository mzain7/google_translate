
const translate = require('@iamtraction/google-translate');
const express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());

router.post("/translate", async (req, res) => {
  const { text, lang } = req.body;
  console.log(text, lang);
  const result = await translate(text, {
    to: lang,
    from: "en",
  });
  res.json(result.text).status(200);
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
