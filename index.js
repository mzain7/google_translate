import { translate } from "@vitalets/google-translate-api";
import { HttpProxyAgent } from "http-proxy-agent";

const agent = new HttpProxyAgent("http://162.223.94.164:80");
import express from "express";
const app = express();
const router = express.Router();

app.use(express.json());

router.get("/translate", async (req, res) => {
  const { text, to, from } = req.query;
  // console.log(text, to, from);
  const result = await translate(text, {
    to,
    from: "en",
    fetchOptions: { agent },
  });
  res.send(result.text);
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
