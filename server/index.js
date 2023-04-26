const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const gcs = require("@google-cloud/storage");
const fs = require("node:fs");
const app = express();
const bodyParser = require("body-parser");
const port = 8004;
dotenv.config();

// const storage = new Storage({
//   projectId: process.env.GCP_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GCP_CLIENT_EMAIL,
//     private_key: process.env.GCP_PRIVATE_KEY,
//   },
// });
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/dict/:lang/", async (req, res) => {
  const { lang } = req.params;
  const headwordList = req.body.headwordList;
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

      let wordList = [];

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
  console.log(`Example app listening on port ${port}`);
});

//! This is the original way I retrieved the dictionaries, until I realized there was a simpler solution
// try {
//   const url = `${process.env.BASE_URL}/${process.env.BUCKET_NAME}/${process.env.LATIN_DICT}`;
//   const response = await axios.get(url);
//   let wordList = [];

//   const keyList = Object.keys(response.data);
//   const matchedKeys = keyList.filter((val) => {
//     return val.match(regexFilter);
//   });
//   console.log(matchedKeys);
//   for (let key in matchedKeys) {
//     let word = matchedKeys[key];
//     console.log(response.data[word]);
//     wordList.push(response.data[word]);
//   }
//   res.json(wordList);
// } catch (err) {
//   console.error(err.data);
//   res.status(500).send("Internal Server Error");
// }
// try {
//   const url = `${process.env.BASE_URL}/${process.env.BUCKET_NAME}/${process.env.GREEK_DICT}`;
//   const response = await axios.get(url);
//   let wordList = [];

//   const keyList = Object.keys(response.data);
//   const matchedKeys = keyList.filter((val) => {
//     return val.match(regexFilter);
//   });
//   console.log(matchedKeys);
//   for (let key in matchedKeys) {
//     let word = matchedKeys[key];
//     wordList.push(response.data[word]);
//   }
//   res.json(wordList);
// } catch (err) {
//   console.error(err.data);
//   res.status(500).send("Internal Server Error");
// }
