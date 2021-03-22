
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
    //console.log(dataOut);
    if(Array.isArray(body)) {
        let retArr = [];
        for(let i = 0; i < body.length; i++){
            const inflections = body[i].rest.entry.infl;
            let headWord = body[i].rest.entry.dict.hdwd.$;
            let fixedHead = headWord.replace(/[1-9]/g, '');
            const type = body[i].rest.entry.dict.pofs.$;
            const inflect = getLatinInflections(inflections, type);
            const shortDict = await getWikiLatin(fixedHead);
            const longDict = await getPerseusLatin(fixedHead);
            let subObj = {};
            let check = false; 
            
            if(inflect === undefined){ // if word is not inflected, returns array without inflections (numerals, particles, etc.)
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
        const inflections = body.rest.entry.infl;
        let headWord = body.rest.entry.dict.hdwd.$;
        let fixedHead = headWord.replace(/[1-9]/g, '');
        //console.log(fixedHead);
        const type = body.rest.entry.dict.pofs.$;
        const inflect = getLatinInflections(inflections, type);
        const shortDict = await getWikiLatin(fixedHead);
        const longDict = await getPerseusLatin(fixedHead);
        
        if(inflect === undefined){ // as before, if word is not inflected, returns array without inflections (numerals, particles, etc.)
            console.log("UND");
            return {
                headword: fixedHead, 
                type: type, 
                inflections: [
                    {
                        inflection: 'uninflected'
                    }
                ], 
                shortDef: shortDict,
                longDef: longDict
            };
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

const getLatinInflections = (inflections, type) => {
    //console.log(inflections, type);
    let returnArr = [];
    if(type === 'noun') {
        if(Array.isArray(inflections)){
            for(let i = 0; i < inflections.length; i++){
                let gender = inflections[i].gend.$;
                let latCase = inflections[i].case.$;
                let number = inflections[i].num.$;
                let declension = inflections[i].decl.$;
                let conj = {
                    declension: declension,
                    inflection: `${gender} ${latCase} ${number}`
                }
            
                returnArr[i] = (conj);
            }   
            return returnArr;
        } else {
            let gender = inflections.gend.$;
            let latCase = inflections.case.$;
            let number = inflections.num.$;
            let declension = inflections.decl.$;
            
            return [{
                declension: declension,
                inflection: `${gender} ${latCase} ${number}`
            }];
        }
    } else if(type === 'verb') {
        if(Array.isArray(inflections)){
            for(let i = 0; i < inflections.length; i++){
                if(inflections[i].mood.$ === 'infinitive'){
                    let latTense = inflections[i].tense.$;
                    let latVoice = inflections[i].voice.$;
                    let latMood = inflections[i].mood.$;
                    let subObj = {
                        inflection: `${latTense} ${latVoice} ${latMood}`
                    }
                    returnArr[i] = (subObj);
                } else {
                    let person = inflections[i].pers.$;
                    let number = inflections[i].num.$;
                    let latTense = inflections[i].tense.$;
                    let latVoice = inflections[i].voice.$;
                    let latMood = inflections[i].mood.$;
                    let subObj = {
                        inflection: `${person} person ${number} ${latTense} ${latVoice} ${latMood}`
                    }
                    returnArr[i] = (subObj);
                }
            }   
            return returnArr;
        } else {
            if(inflections.mood.$ === 'infinitive'){
                let latTense = inflections.tense.$;
                let latVoice = inflections.voice.$;
                let latMood = inflections.mood.$;

                return [{
                    inflection: `${latTense} ${latVoice} ${latMood}`
                }];
            } else {
                let person = inflections.pers.$;
                let number = inflections.num.$;
                let latTense = inflections.tense.$;
                let latVoice = inflections.voice.$;
                let latMood = inflections.mood.$;

                return [{
                    inflection: `${person} person ${number} ${latTense} ${latVoice} ${latMood}`
                }];
            }
        }
    } else if(type === 'adjective') {
        if(Array.isArray(inflections)) {
            for(let i = 0; i < inflections.length; i++) {
                if(inflections[i].gend.$ === 'adverbial') {
                    let declension = inflections[i].decl.$;
                    let gender = inflections[i].gend.$;
                    let conj = {
                        declension: declension,
                        inflection: gender
                    }

                    returnArr[i] = (conj);
                } else {
                    let gender = inflections[i].gend.$;
                    let latCase = inflections[i].case.$;
                    let number = inflections[i].num.$;
                    let declension = inflections[i].decl.$;
                    let conj = {
                        declension: declension,
                        inflection: `${gender} ${latCase} ${number}`
                    }
                    returnArr[i] = (conj);
                }
            }   
            return returnArr;
        } else {
            if(inflections.gend.$ === 'adverbial') {
                let declension = inflections.decl.$;
                let gender = inflections.gend.$;
                return [{
                    declension: declension,
                    inflection: gender
                }];
            } else {
                let gender = inflections.gend.$;
                let latCase = inflections.case.$;
                let number = inflections.num.$;
                let declension = inflections.decl.$;
                returnArr = [`${declension} declension`, `${gender} ${latCase} ${number}`];
                return [{
                    declension: declension,
                    inflection: `${gender} ${latCase} ${number}`
                }];
            }
        } 
    } else if(type === 'verb participle') {
        console.log('verb participle');
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