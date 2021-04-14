
const convert = require('xml-js');

const getLatin = async (lemma) => {
    
    let lemmaArr = lemma.split(' ');
    
    if(lemmaArr.length === 1){
        const morph = await getLatinMorph(lemmaArr[0]);
        return morph; 
    } else {
        let allMorph = [];
        for(let i = 0; i < lemmaArr.length; i++){
            const subMorph = await getLatinMorph(lemmaArr[i]);
            allMorph.push(subMorph);
        }
        return allMorph;
    }
};

const getLatinMorph = async (lemma) => { //returns a full array of relevant information relating to the morphology, including the headword, part of speech, inflection possibilities, Wiktionary Def, and Lewis & Short entry
    const latinData = await fetch(`http://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${lemma}`, {mode: 'cors'})
    const dataOut = await latinData.json();
    const body = dataOut.RDF.Annotation.Body;

    if (body === undefined) {
        console.log('undefined');
    }
    console.log(dataOut);
    if(Array.isArray(body)) {
        let retArr = [];
        for(let i = 0; i < body.length; i++){
            const inflectArr = body[i].rest.entry.infl;
            let headWord = body[i].rest.entry.dict.hdwd.$;
            let fixedHead = headWord.replace(/[1-9]/g, '');
            const type = body[i].rest.entry.dict.pofs.$;
            const inflect = getLatininflectArr(inflectArr, type);
            const shortDict = await getWikiLatin(fixedHead);
            const longDict = await getPerseusLatin(fixedHead);
            let subObj = {};
            let check = false; 
            
            if(inflect === undefined){ // if word is not inflected, returns array without inflectArr (numerals, particles, etc.)
                subObj = {
                    headword: fixedHead, 
                    type: type, 
                    inflections: [
                        {
                            inflections: "uninflected"
                        }
                    ], 
                    shortDef: shortDict,
                    longDef: longDict
                };
            } else {
                subObj = {
                    headword: fixedHead, 
                    type: type, 
                    inflections: inflect,
                    shortDef: shortDict,
                    longDef: longDict
                };
            }
            
            //console.log(setArr);
            
            for(let i = 0; i < retArr.length; i++) {
                    if(JSON.stringify(subObj) === JSON.stringify(retArr[i])){
                        check = true;
                    }
            }
            if(check === false) {
                
                retArr[i] = (subObj);
            }
        }
        

    return retArr;
    } else {
        const inflectArr = body.rest.entry.infl;
        let headWord = body.rest.entry.dict.hdwd.$;
        let fixedHead = headWord.replace(/[1-9]/g, '');
        //console.log(fixedHead);
        const type = body.rest.entry.dict.pofs.$;
        const inflect = getLatininflectArr(inflectArr, type);
        const shortDict = await getWikiLatin(fixedHead);
        const longDict = await getPerseusLatin(fixedHead);
        console.log(inflect);
        if(inflect === undefined){ // as before, if word is not inflected, returns array without inflectArr (numerals, particles, etc.)
            //console.log("UND");
            return [{
                    headword: fixedHead, 
                    type: type, 
                    inflections: [
                        {
                            inflection: 'uninflected'
                        }
                    ], 
                    shortDef: shortDict,
                    longDef: longDict
            }];
        } else {
            return [{   
                headword: fixedHead,
                type: type,
                inflections: inflect,
                shortDef: shortDict,
                longDef: longDict
            }];
        }  
    }
};

const getLatininflectArr = (inflectArr, type) => {
    console.log(inflectArr, type); 
    let returnArr = [];
    if(type === 'verb') {
        if(Array.isArray(inflectArr)){
            for(let i = 0; i < inflectArr.length; i++){
                if(inflectArr[i].mood.$ === 'participle'){
                    let gender = inflectArr[i].gend.$;
                    let latCase = inflectArr[i].case.$;
                    let number = inflectArr[i].num.$;
                    let latTense = inflectArr[i].tense.$;
                    let latMood = inflectArr[i].mood.$;
                    let subObj = {
                        inflection: `${gender} ${latCase} ${number} ${latTense} ${latMood}`
                    }
                    returnArr[i] = subObj
                } else if(inflectArr[i].mood.$ === 'infinitive'){
                    let latTense = inflectArr[i].tense.$;
                    let latVoice = inflectArr[i].voice.$;
                    let latMood = inflectArr[i].mood.$;
                    let subObj = {
                        inflection: `${latTense} ${latVoice} ${latMood}`
                    }
                    returnArr[i] = (subObj);
                } else {
                    let person = inflectArr[i].pers.$;
                    let number = inflectArr[i].num.$;
                    let latTense = inflectArr[i].tense.$;
                    let latVoice = inflectArr[i].voice.$;
                    let latMood = inflectArr[i].mood.$;
                    let subObj = {
                        inflection: `${person} person ${number} ${latTense} ${latVoice} ${latMood}`
                    }
                    returnArr[i] = (subObj);
                }
            }   
            return returnArr;
        } else {
            if(inflectArr.mood.$ === 'infinitive') {
                let latTense = inflectArr.tense.$;
                let latVoice = inflectArr.voice.$;
                let latMood = inflectArr.mood.$;

                return [{
                    inflection: `${latTense} ${latVoice} ${latMood}`
                }];
            } else if (inflectArr.mood.$ === 'participle') {
                let gender = inflectArr.gend.$;
                let latCase = inflectArr.case.$;
                let number = inflectArr.num.$;
                let latTense = inflectArr.tense.$;
                let latMood = inflectArr.mood.$;
                return [{
                    inflection: `${gender} ${latCase} ${number} ${latTense} ${latMood}`
                }]
            }
            
            else {
                let person = inflectArr.pers.$;
                let number = inflectArr.num.$;
                let latTense = inflectArr.tense.$;
                let latVoice = inflectArr.voice.$;
                let latMood = inflectArr.mood.$;

                return [{
                    inflection: `${person} person ${number} ${latTense} ${latVoice} ${latMood}`
                }];
            }
        }
    } else if(type === 'verb participle') {
        if(Array.isArray(inflectArr)){
            let combinedArr = [];
                for(let i = 0; i < inflectArr.length; i++){
                    let gender = inflectArr[i].gend.$;
                    let number = inflectArr[i].num.$;
                    let tense = inflectArr[i].tense.$;
                    let voice = inflectArr[i].voice.$;
                    let mood = inflectArr[i].mood.$;
                    if(inflectArr[i].dial){
                        let dialect = inflectArr[i].dial.$;
                        combinedArr[i] = {
                            dialect: dialect, 
                            inflection: `${gender} ${number} ${tense} ${voice} ${mood}`
                        };
                    } else {
                        combinedArr[i] = {
                            dialect: 'Attic',
                            inflection: `${gender} ${number} ${tense} ${voice} ${mood}`
                        };
                    }
                }
            return combinedArr;
        } else {
            let gender = inflectArr.gend.$;
            let number = inflectArr.num.$;
            let tense = inflectArr.tense.$;
            let voice = inflectArr.voice.$;
            let mood = inflectArr.mood.$;
            if(inflectArr.dial){
                let dialect = inflectArr.dial.$;
                return [{
                    dialect: dialect, 
                    inflection: `${gender} ${number} ${tense} ${voice} ${mood}`
                }];
            } else {
                return [{
                    dialect: 'Attic',
                    inflection: `${gender} ${number} ${tense} ${voice} ${mood}`
                }];
            }
        }
    } else if(type === 'noun') {
        if(Array.isArray(inflectArr)){
            for(let i = 0; i < inflectArr.length; i++){
                let gender = inflectArr[i].gend.$;
                let latCase = inflectArr[i].case.$;
                let number = inflectArr[i].num.$;
                let declension = inflectArr[i].decl.$;
                let conj = {
                    declension: declension,
                    inflection: `${gender} ${latCase} ${number}`
                }
            
                returnArr[i] = (conj);
            }   
            return returnArr;
        } else {
            let gender = inflectArr.gend.$;
            let latCase = inflectArr.case.$;
            let number = inflectArr.num.$;
            let declension = inflectArr.decl.$;
            
            return [{
                declension: declension,
                inflection: `${gender} ${latCase} ${number}`
            }];
        }
    } else if(type === 'adjective') {
        if(Array.isArray(inflectArr)) {
            for(let i = 0; i < inflectArr.length; i++) {
                if(inflectArr[i].gend.$ === 'adverbial') {
                    let declension = inflectArr[i].decl.$;
                    let gender = inflectArr[i].gend.$;
                    let conj = {
                        declension: declension,
                        inflection: gender
                    }

                    returnArr[i] = (conj);
                } else {
                    let gender = inflectArr[i].gend.$;
                    let latCase = inflectArr[i].case.$;
                    let number = inflectArr[i].num.$;
                    let declension = inflectArr[i].decl.$;
                    let conj = {
                        declension: declension,
                        inflection: `${gender} ${latCase} ${number}`
                    }
                    returnArr[i] = (conj);
                }
            }   
            return returnArr;
        } else {
            if(inflectArr.gend.$ === 'adverbial') {
                let declension = inflectArr.decl.$;
                let gender = inflectArr.gend.$;
                return [{
                    declension: declension,
                    inflection: gender
                }];
            } else {
                let gender = inflectArr.gend.$;
                let latCase = inflectArr.case.$;
                let number = inflectArr.num.$;
                let declension = inflectArr.decl.$;
                returnArr = [`${declension} declension`, `${gender} ${latCase} ${number}`];
                return [{
                    declension: declension,
                    inflection: `${gender} ${latCase} ${number}`
                }];
            }
        } 
    } else if(type === 'pronoun') {
        if(Array.isArray(inflectArr)){
            for(let i = 0; i < inflectArr.length; i++){
                let gender = inflectArr[i].gend.$;
                let latCase = inflectArr[i].case.$;
                let number = inflectArr[i].num.$;
                let conj = {
                    inflection: `${gender} ${latCase} ${number}`
                }
            
                returnArr[i] = (conj);
            }   
            return returnArr;
        } else {
            let gender = inflectArr.gend.$;
            let latCase = inflectArr.case.$;
            let number = inflectArr.num.$;
            
            return [{
                inflection: `${gender} ${latCase} ${number}`
            }];
        }
    }
};

const getWikiLatin = async (lemma) => {
    const latinDef = await fetch (`https://en.wiktionary.org/api/rest_v1/page/definition/${lemma}?redirect=true`);
    const defOut = await latinDef.json();
    const defOut_Latin = defOut.la[0];
    
    let defHTML = defOut_Latin.definitions[0].definition;

    document.getElementById('latin').innerHTML = defHTML;
    let titles = document.querySelectorAll('#latin a');
    let sumDef = `${titles[0].textContent}`;
    for(let i = 1; i < titles.length; i++){
        sumDef = sumDef + `, ${titles[i].textContent}`;
    }

    return sumDef;
};

const getPerseusLatin = async (lemma) => {
    let dataAsJson = {};
    const data = await fetch(`http://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus%3Atext%3A1999.04.0060%3Aentry%3D${lemma}`);
    const textData = await data.text();

    if (textData.indexOf('An Error Occurred') > -1){
        const data1 = await fetch(`http://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus%3Atext%3A1999.04.0060%3Aentry%3D${lemma}1`);
        const textData1 = await data1.text();
        if (textData1.indexOf('An Error Occurred') > -1){
            return "Can't Find Entry";
        } else {
            dataAsJson = JSON.parse(convert.xml2json(textData1));
            //console.log(dataAsJson);
            return "Elementary Lewis Dict. Definition";
        }
    } else {
        dataAsJson = JSON.parse(convert.xml2json(textData));
        //console.log(dataAsJson);
        //need to do some pretty serious parsing here. This could take a while.
        return "Elementary Lewis Dict. Definition";
    }

};


export default getLatin