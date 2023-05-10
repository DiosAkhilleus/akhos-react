const express = require("express");
const fs = require("node:fs");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8006;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/dict/:lang/", async (req, res) => {
  const { lang } = req.params;
  const headwordList = req.body.data.headwordList;
  console.log(headwordList);
  // const regexFilter = new RegExp(`^${lemma}\\d?$`, "i");

  if (lang === "latin") {
    try {
      let lewisShort = JSON.parse(
        fs.readFileSync("./assets/lewis-short.json", "utf8")
      );
      const keyList = Object.keys(lewisShort);
      let matchedKeys = [];
      let finalDictionaryList = [];
      for (let wordOptionList in headwordList) {
        let subMatchArray = [];
        for (let word in headwordList[wordOptionList]) {
          const regexFilter = new RegExp(
            `^${headwordList[wordOptionList][word]}\\d?$`,
            "i"
          );
          matchedKeys.push(
            keyList.filter((val) => {
              return val.match(regexFilter);
            })
          );
        }
        // matchedKeys.push(subMatchArray);
      }
      for (let wordKeySet in matchedKeys) {
        let subDictionaryList = [];
        for (let wordKey in matchedKeys[wordKeySet]) {
          let word = matchedKeys[wordKeySet][wordKey];
          subDictionaryList.push(lewisShort[word]);
        }
        finalDictionaryList.push(subDictionaryList);
      }
      res.json(finalDictionaryList);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
  if (lang === "greek") {
    try {
      let lsj = JSON.parse(fs.readFileSync("./assets/lsj.json", "utf8"));

      const keyList = Object.keys(lsj);
      let matchedKeys = [];
      let finalDictionaryList = [];
      for (let wordOptionList in headwordList) {
        let subMatchArray = [];
        for (let word in headwordList[wordOptionList]) {
          const regexFilter = new RegExp(
            `^${headwordList[wordOptionList][word]}\\d?$`,
            "i"
          );
          subMatchArray.push(
            keyList.filter((val) => {
              return val.match(regexFilter);
            })
          );
        }
        matchedKeys.push(subMatchArray);
      }

      for (let wordKeySet in matchedKeys) {
        let subDictionaryList = [];
        for (let wordKey in matchedKeys[wordKeySet]) {
          let word = matchedKeys[wordKeySet][wordKey];
          subDictionaryList.push(lsj[word]);
        }
        finalDictionaryList.push(subDictionaryList);
      }
      res.json(finalDictionaryList);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.listen(port, () => {
  console.log(`Akhos Server running on port ${port}`);
});
