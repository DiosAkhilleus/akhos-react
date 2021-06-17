const convert = require('xml-js'); // preiously converted XML from perseus into JSON, probably unnecessary now
const flatten = require('flat'); // previously flattened terrible JSON into only halfway-terrible JSON
const latindict = require('./json/lewis-short.json');

const getLatinMorph = async (lemma) => { //returns a full array of relevant information relating to the morphology, including the headword, part of speech, inflection possibilities, Wiktionary Def, and Lewis & Short entry
    try {
        const latinData = await fetch(`https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${lemma}`, {mode: 'cors'})
        const dataOut = await latinData.json();
        const body = dataOut.RDF.Annotation.Body;
    
        if (body === undefined) {
            throw new Error ('New Exception');
        }
        //console.log(dataOut);
        if(Array.isArray(body)) {
            let retArr = [];
            for(let i = 0; i < body.length; i++){
                const inflectArr = body[i].rest.entry.infl;
                let headWord = body[i].rest.entry.dict.hdwd.$;
                let fixedHead = headWord.replace(/[1-9]/g, '');
                const type = body[i].rest.entry.dict.pofs.$;
                const inflect = getLatininflectArr(inflectArr, type);
                const shortDict = await getWikiLatin(fixedHead);
                const longDict = getLocalDict(fixedHead);
                // const longDict = await getPerseusLatin(fixedHead);
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
            const longDict = getLocalDict(fixedHead);
            // const longDict = await getPerseusLatin(fixedHead);
            //console.log(inflect);
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
    } catch {
        console.error ('Word Not Found');
        return [{   
            headword: 'Not Found',
            type: 'Not Found',
            inflections: [['Not Found']],
            shortDef: 'Not Found',
            longDef: 'Not Found'
        }]
    }
    
};

const getLatininflectArr = (inflectArr, type) => { // returns an array of all possible inflections depending on the type of word given
    //console.log(inflectArr, type); 
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

const getWikiLatin = async (lemma) => { // probably should refactor this... retrieves wiktionary definition for the latin headword.
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

// Deprecated function retrieving dictionary information from perseus.tufts.edu 
// const getPerseusLatin = async (lemma) => {
//     let dataAsJson = {};
//     const data = await fetch(`https://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus%3Atext%3A1999.04.0060%3Aentry%3D${lemma}`);
//     const textData = await data.text();
    

//     if (textData.indexOf('An Error Occurred') > -1){
//         const data1 = await fetch(`https://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus%3Atext%3A1999.04.0060%3Aentry%3D${lemma}1`);
//         const textData1 = await data1.text();
//         if (textData1.indexOf('An Error Occurred') > -1){
//             return "Can't Find Entry";
//         } else {
//             dataAsJson = JSON.parse(convert.xml2json(textData1, {compact: true, spaces: 4}));
//             const lower = dataAsJson["TEI.2"].text.body.div0.entry.sense;
//             let defArray = [];
//             for(let i = 0; i < lower.length; i++){
//                 const flatter = flatten(lower[i]);
//                 //console.log(flatter);
//                 let regex1 = /^_text.0/;
//                 let regex2 = /_text$/
//                 let regex3 = /^foreign./;
//                 let regex4 = /^usg./;

//                 const asArray = Object.entries(flatter);
//                 const allowedArr = asArray.filter(([key, value]) => (((regex1.test(key) || regex2.test(key)) && (!regex3.test(key) && !regex4.test(key)) && (value !== ", " && value !== "; " && value !== ":"))));
//                 const allowedObj = Object.fromEntries(allowedArr);
        
//                 for (const [key, value] of Object.entries(allowedObj)) {
//                     allowedObj[key] = value.replace(/^\s/g, '');
//                     allowedObj[key] = value.replace(/,\s$/, ':');
//                 }
        
//                 defArray.push(allowedObj);
//             }
        
//             let joined = '';
//             for(let i = 0; i < defArray.length; i++) {
//                 let subArr = Object.entries(defArray[i]);
//                 const endArr = subArr.map(([key, value]) => (value) )
//                 const endStr = endArr.join(', ');
                
//                 joined += endStr;
//             }
//             return joined;
//         }
//     } else {
//         dataAsJson = JSON.parse(convert.xml2json(textData, {compact: true, spaces: 4}));
        
//         const lower = dataAsJson["TEI.2"].text.body.div0.entry.sense;
//         //console.log(lower);
//         let defArray = [];
//         let joined = '';
//         if(Array.isArray(lower)){
//             for(let i = 0; i < lower.length; i++){
            
//                 const flatter = flatten(lower[i]);
                
//                 //console.log(flatter);
//                 let regex1 = /^_text.0/;
//                 let regex2 = /_text$/
//                 let regex3 = /^foreign./;
//                 let regex4 = /^usg./;
    
//                 const asArray = Object.entries(flatter);
                
//                 const allowedArr = asArray.filter(([key, value]) => (((regex1.test(key) || regex2.test(key)) && (!regex3.test(key) && !regex4.test(key) && value !== ", " && value !== ":"))));
//                 // (    && value !== "; ") 
                
//                 const allowedObj = Object.fromEntries(allowedArr);
                
//                 for (const [key, value] of Object.entries(allowedObj)) {
//                     allowedObj[key] = value.replace(/^\s/g, '');
//                     allowedObj[key] = value.replace(/,\s$/, ':');
//                 }
        
//                 defArray.push(allowedObj);
//             }
            
            
//             for(let i = 0; i < defArray.length; i++) {
//                 let subArr = Object.entries(defArray[i]);
//                 const endArr = subArr.map(([key, value]) => (value) )
//                 const endStr = endArr.join(', ');
                
//                 joined += endStr;
//             }
//         } else {
//             const flatter = flatten(lower);
//             //console.log(flatter);
//             let regex1 = /^_text.0/;
//             let regex2 = /_text$/
//             let regex3 = /^foreign./;
//             let regex4 = /^usg./;

//             const asArray = Object.entries(flatter);
//             const allowedArr = asArray.filter(([key, value]) => (((regex1.test(key) || regex2.test(key)) && (!regex3.test(key) && !regex4.test(key) && value !== ", " && value !== ":"))));
//                 // (    && value !== "; ") 
                
//             const allowedObj = Object.fromEntries(allowedArr);
            
//             for (const [key, value] of Object.entries(allowedObj)) {
//                 allowedObj[key] = value.replace(/^\s/g, '');
//                 allowedObj[key] = value.replace(/,\s$/, ':');
//             }
//             // console.log(allowedObj);
//             let subArr = Object.entries(allowedObj);
//             const endArr = subArr.map(([key, value]) => (value) )
//             const endStr = endArr.join(', ');
            
//             joined = endStr;
//         }
        
//         // console.log(joined);
//         return joined;
//         //console.log(dataAsJson);
//         //need to do some pretty serious parsing here. This could take a while.
        
//     }

// };

const getLocalDict = (lemma) => { // retrieves the correct dictionary entry from the local Latin lexicon file
    if (!latindict[lemma]) { 
        if (latindict[`${lemma}1`]) {
            let combined = [];
                let dictSense = latindict[`${lemma}1`].senses;
                if (dictSense.length !== undefined && dictSense.length > 0) {
                    for (let i = 0; i < dictSense.length; i++) {
                        let newArr = combined.concat(dictSense[i]);
                        combined = newArr;
                    }
                }
            let dictString = combined.join(' ');
            return dictString;
        } else {
            return "Definition Not Found";
        }
    } else {
        let dictObj = latindict[lemma];
        let dictSense = dictObj.senses;
        let combined = [];
        if (dictSense.length !== undefined && dictSense.length > 0) {
            for (let i = 0; i < dictSense.length; i++) {
                let newArr = combined.concat(dictSense[i]);
                combined = newArr;
            }
        }
        let dictString = combined.join(' ');
    
        return dictString;
    }
};

export default getLatinMorph