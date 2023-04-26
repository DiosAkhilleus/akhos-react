// import {  greekToBetaCode  } from 'beta-code-js'; // previously used in getPerseusGreek() for Perseus's awful beta-code Greek entry
// const convert = require('xml-js'); // previously used to convert XML from Perseus into poorly-formatted JSON
// const flatten = require('flat'); // previously used to clean the poorly-formatted JSON from Perseus into slightly better formatted JSON, but still bad

let greekdict;

fetch("/json/lsj.json")
  .then((res) => {
    greekdict = res;
  })
  .catch((err) => {
    console.error(err);
  });

const getGreekMorph = async (lemma) => {
  //returns a full array of relevant information relating to the morphology, including the headword, part of speech, inflection possibilities, Wiktionary Def, and LSJ Def
  // console.log(greekdict.λύω);
  // console.log(typeof(greekdict.λύω));
  // fetches the given greek string from the morphology service
  try {
    const greekData = await fetch(
      `https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=grc&engine=morpheusgrc&word=${lemma}`,
      { mode: "cors" }
    );
    const dataOut = await greekData.json();
    const body = dataOut.RDF.Annotation.Body;
    //console.log(dataOut);
    if (body === undefined) {
      throw new Error("New Exception");
    }
    let type;
    let returnArr = [];
    if (Array.isArray(body)) {
      // if multiple possible definitions, returns morphology array for each
      let subObj = {};
      for (let i = 0; i < body.length; i++) {
        if (dataOut.RDF.Annotation.Body[i].rest.entry.infl[0] !== undefined) {
          type = dataOut.RDF.Annotation.Body[i].rest.entry.infl[0].pofs.$;
        } else {
          type = dataOut.RDF.Annotation.Body[i].rest.entry.infl.pofs.$;
        }
        const inflections = dataOut.RDF.Annotation.Body[i].rest.entry.infl;
        let headWord = dataOut.RDF.Annotation.Body[i].rest.entry.dict.hdwd.$;
        let fixedHead = headWord.replace(/[1-9]/g, "");
        const inflect = getGreekInflections(inflections, type);
        const shortDict = await getWikiGreek(fixedHead);
        const longDict = getLocalDict(fixedHead);
        //const longDict = await getPerseusGreek(fixedHead);

        //console.log(shortDict);

        if (inflect === undefined) {
          // iff word is not inflected, returns array without inflections (numerals, particles, etc.)
          subObj = {
            headword: fixedHead,
            type: type,
            inflections: [
              {
                dialect: "n/a",
                inflections: "uninflected",
              },
            ],
            shortDef: shortDict,
            longDef: longDict,
          };
        } else {
          subObj = {
            headword: fixedHead,
            type: type,
            inflections: inflect,
            shortDef: shortDict,
            longDef: longDict,
          };
        }
        returnArr[i] = subObj;
      }

      return returnArr; //full array of word possibilities based on each possible root headword from input word
    } else {
      //if there is only one root headword possible

      if (dataOut.RDF.Annotation.Body.rest.entry.infl[0] !== undefined) {
        type = dataOut.RDF.Annotation.Body.rest.entry.infl[0].pofs.$;
      } else {
        type = dataOut.RDF.Annotation.Body.rest.entry.infl.pofs.$;
      }

      const inflections = dataOut.RDF.Annotation.Body.rest.entry.infl;
      let headWord = dataOut.RDF.Annotation.Body.rest.entry.dict.hdwd.$;
      let fixedHead = headWord.replace(/[1-9]/g, "");
      const inflect = getGreekInflections(inflections, type);
      const shortDict = await getWikiGreek(fixedHead);
      const longDict = getLocalDict(fixedHead);
      //const longDict = await getPerseusGreek(fixedHead);

      if (inflect === undefined) {
        // as before, if word is not inflected, returns array without inflections (numerals, particles, etc.)
        return [
          {
            headword: fixedHead,
            type: type,
            inflections: [
              {
                dialect: "n/a",
                inflection: "uninflected",
              },
            ],
            shortDef: shortDict,
            longDef: longDict,
          },
        ];
      } else {
        return [
          {
            headword: fixedHead,
            type: type,
            inflections: inflect,
            shortDef: shortDict,
            longDef: longDict,
          },
        ];
      }
    }
  } catch {
    console.error("Word Not Found");
    return [
      {
        headword: "Not Found",
        type: "Not Found",
        inflections: [["Not Found"]],
        shortDef: "Not Found",
        longDef: "Not Found",
      },
    ];
  }
  //console.log(dataOut);
};

const getGreekInflections = (inflectArr, type) => {
  // returns an array in which each element is an object of the dialect type and inflection pattern

  if (type === "verb") {
    //all other if statements contain similar code that will change what is returned in the object, depending on word type.
    if (Array.isArray(inflectArr)) {
      // if multiple inflection possibilities, returns array of all possible inflections.
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        if (inflectArr[i].mood.$ === "infinitive") {
          let tense = inflectArr[i].tense.$;
          let voice = inflectArr[i].voice.$;
          let mood = inflectArr[i].mood.$;
          if (inflectArr[i].dial) {
            let dialect = inflectArr[i].dial.$;
            combinedArr[i] = {
              dialect: dialect,
              inflection: `${tense} ${voice} ${mood}`,
            };
          } else {
            combinedArr[i] = {
              dialect: "Attic",
              inflection: `${tense} ${voice} ${mood}`,
            };
          }
        } else {
          let person = inflectArr[i].pers.$;
          let number = inflectArr[i].num.$;
          let tense = inflectArr[i].tense.$;
          let voice = inflectArr[i].voice.$;
          let mood = inflectArr[i].mood.$;
          if (inflectArr[i].dial) {
            let dialect = inflectArr[i].dial.$;
            combinedArr[i] = {
              dialect: dialect,
              inflection: `${person} person ${number} ${tense} ${voice} ${mood}`,
            };
          } else {
            combinedArr[i] = {
              dialect: "Attic",
              inflection: `${person} person ${number} ${tense} ${voice} ${mood}`,
            };
          }
        }
      }
      return combinedArr;
    } else {
      if (inflectArr.mood.$ === "infinitive") {
        let tense = inflectArr.tense.$;
        let voice = inflectArr.voice.$;
        let mood = inflectArr.mood.$;
        if (inflectArr.dial) {
          let dialect = inflectArr.dial.$;
          return [
            {
              dialect: dialect,
              inflection: `${tense} ${voice} ${mood}`,
            },
          ];
        } else {
          return [
            {
              dialect: "Attic",
              inflection: `${tense} ${voice} ${mood}`,
            },
          ];
        }
      } else {
        let person = inflectArr.pers.$;
        let number = inflectArr.num.$;
        let tense = inflectArr.tense.$;
        let voice = inflectArr.voice.$;
        let mood = inflectArr.mood.$;
        if (inflectArr.dial) {
          let dialect = inflectArr.dial.$;
          return [
            {
              dialect: dialect,
              inflection: `${person} person ${number} ${tense} ${voice} ${mood}`,
            },
          ];
        } else {
          return [
            {
              dialect: "Attic",
              inflection: `${person} person ${number} ${tense} ${voice} ${mood}`,
            },
          ];
        }
      }
    }
  } else if (type === "verb participle") {
    if (Array.isArray(inflectArr)) {
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        let gender = inflectArr[i].gend.$;
        let grekCase = inflectArr[i].case.$;
        let number = inflectArr[i].num.$;
        let tense = inflectArr[i].tense.$;
        let voice = inflectArr[i].voice.$;
        let mood = inflectArr[i].mood.$;
        if (inflectArr[i].dial) {
          let dialect = inflectArr[i].dial.$;
          combinedArr[i] = {
            dialect: dialect,
            inflection: `${gender} ${grekCase} ${number} ${tense} ${voice} ${mood}`,
          };
        } else {
          combinedArr[i] = {
            dialect: "Attic",
            inflection: `${gender} ${grekCase} ${number} ${tense} ${voice} ${mood}`,
          };
        }
      }
      return combinedArr;
    } else {
      let gender = inflectArr.gend.$;
      let grekCase = inflectArr.case.$;
      let number = inflectArr.num.$;
      let tense = inflectArr.tense.$;
      let voice = inflectArr.voice.$;
      let mood = inflectArr.mood.$;
      if (inflectArr.dial) {
        let dialect = inflectArr.dial.$;
        return [
          {
            dialect: dialect,
            inflection: `${gender} ${grekCase} ${number} ${tense} ${voice} ${mood}`,
          },
        ];
      } else {
        return [
          {
            dialect: "Attic",
            inflection: `${gender} ${grekCase} ${number} ${tense} ${voice} ${mood}`,
          },
        ];
      }
    }
  } else if (type === "noun") {
    if (Array.isArray(inflectArr)) {
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        let gender = inflectArr[i].gend.$;
        let nCase = inflectArr[i].case.$;
        let number = inflectArr[i].num.$;
        let declension = inflectArr[i].decl.$;
        if (inflectArr[i].dial) {
          let dialect = inflectArr[i].dial.$;
          combinedArr[i] = {
            dialect: dialect,
            declension: declension,
            inflection: `${gender} ${nCase} ${number}`,
          };
        } else {
          combinedArr[i] = {
            dialect: "Attic",
            declension: declension,
            inflection: `${gender} ${nCase} ${number}`,
          };
        }
      }
      return combinedArr;
    }
    let gender = inflectArr.gend.$;
    let nCase = inflectArr.case.$;
    let number = inflectArr.num.$;
    let declension = inflectArr.decl.$;
    if (inflectArr.dial) {
      let dialect = inflectArr.dial.$;
      return [
        {
          dialect: dialect,
          declension: declension,
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    } else {
      return [
        {
          dialect: "Attic",
          declension: declension,
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    }
  } else if (type === "adjective") {
    if (Array.isArray(inflectArr)) {
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        let gender = inflectArr[i].gend.$;
        let nCase = inflectArr[i].case.$;
        let number = inflectArr[i].num.$;
        let declension = inflectArr[i].decl.$;
        if (inflectArr[i].dial) {
          let dialect = inflectArr[i].dial.$;
          combinedArr[i] = {
            dialect: dialect,
            declension: declension,
            inflection: `${gender} ${nCase} ${number}`,
          };
        } else {
          combinedArr[i] = {
            dialect: "Attic",
            declension: declension,
            inflection: `${gender} ${nCase} ${number}`,
          };
        }
      }
      return combinedArr;
    }
    let gender = inflectArr.gend.$;
    let nCase = inflectArr.case.$;
    let number = inflectArr.num.$;
    let declension = inflectArr.decl.$;
    if (inflectArr.dial) {
      let dialect = inflectArr.dial.$;
      return [
        {
          dialect: dialect,
          declension: declension,
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    } else {
      return [
        {
          dialect: "Attic",
          declension: declension,
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    }
  } else if (type === "pronoun") {
    if (Array.isArray(inflectArr)) {
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        if (inflectArr[i].pers !== undefined) {
          let person = inflectArr[i].pers.$;
          let gender = inflectArr[i].gend.$;
          let nCase = inflectArr[i].case.$;
          let number = inflectArr[i].num.$;

          combinedArr[i] = {
            inflection: `${person} person ${gender} ${nCase} ${number}`,
          };
        } else {
          let gender = inflectArr[i].gend.$;
          let nCase = inflectArr[i].case.$;
          let number = inflectArr[i].num.$;

          combinedArr[i] = {
            inflection: `${gender} ${nCase} ${number}`,
          };
        }
      }
      return combinedArr;
    } else {
      let person = inflectArr.pers.$;
      let gender = inflectArr.gend.$;
      let nCase = inflectArr.case.$;
      let number = inflectArr.num.$;
      return [
        {
          inflection: `${person} person ${gender} ${nCase} ${number}`,
        },
      ];
    }
  } else if (type === "article") {
    if (Array.isArray(inflectArr)) {
      let combinedArr = [];
      for (let i = 0; i < inflectArr.length; i++) {
        let gender = inflectArr[i].gend.$;
        let nCase = inflectArr[i].case.$;
        let number = inflectArr[i].num.$;
        if (inflectArr[i].dial) {
          let dialect = inflectArr[i].dial.$;
          combinedArr[i] = {
            dialect: dialect,
            inflection: `${gender} ${nCase} ${number}`,
          };
        } else {
          combinedArr[i] = {
            dialect: "Attic",
            inflection: `${gender} ${nCase} ${number}`,
          };
        }
      }
      return combinedArr;
    }
    let gender = inflectArr.gend.$;
    let nCase = inflectArr.case.$;
    let number = inflectArr.num.$;
    if (inflectArr.dial) {
      let dialect = inflectArr.dial.$;
      return [
        {
          dialect: dialect,
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    } else {
      return [
        {
          dialect: "Attic",
          inflection: `${gender} ${nCase} ${number}`,
        },
      ];
    }
  }

  //Fix Relative Pronouns, numerals, etc...
};

const getWikiGreek = async (lemma) => {
  // fetches the wiktionary definition for the input word
  const dictEntry = await fetch(
    `https://en.wiktionary.org/api/rest_v1/page/definition/${lemma}`,
    { mode: "cors" }
  );
  const entryOut = await dictEntry.json();
  //console.log(entryOut.other)

  if (entryOut.other === undefined) {
    return "Not Found";
  } else {
    let def;
    let defArr = entryOut.other[0].definitions;

    if (entryOut.other[0].definitions.length === 1) {
      def = entryOut.other[0].definitions[0].definition;
    } else {
      for (let i = 0; i < defArr.length; i++) {
        def = def + defArr[i].definition;
      }
    }
    let fixedDef = def.replace(/<(.*?)>/g, " ");
    let betterDef = fixedDef.replace(/undefined/g, "");

    return betterDef;
  }
};

const getLocalDict = (lemma) => {
  // retrieves dictionary information from the local Greek lexicon file
  let dictForm = greekdict[lemma];
  let cleaned = dictForm.replace(/<(.*?)>/g, "").replace(/&nbsp;/g, " ");

  return cleaned;
};

export default getGreekMorph;
