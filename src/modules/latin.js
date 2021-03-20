import { setUndefined } from "./dom";
const convert = require('xml-js');

async function getLatinMorph (lemma) {
    const latinData = await fetch(`http://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${lemma}`, {mode: 'cors'})
    const dataOut = await latinData.json();
    const body = dataOut.RDF.Annotation.Body;

    if (body === undefined) {
        setUndefined();
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
            let subArr = [];
            let check = false; 

            if(inflect === undefined){ // if word is not inflected, returns array without inflections (numerals, particles, etc.)
                subArr = [fixedHead, type, shortDict, longDict];
            } else {
                subArr = [fixedHead, type, inflect, shortDict, longDict];
            }
            
            //console.log(setArr);
            
            for(let i = 0; i < retArr.length; i++) {
                    if(JSON.stringify(subArr) === JSON.stringify(retArr[i])){
                        check = true;
                    }
            }
            if(check === false) {
                
                retArr.push(subArr);
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
            return [fixedHead, type, shortDict, longDict];
        } else {
            return [fixedHead, type, inflect, shortDict, longDict];
        }  
    }
}
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
                let conj = [`${declension} declension`, `${gender} ${latCase} ${number}`];
                returnArr.push(conj);
            }   
            return returnArr;
        } else {
            let gender = inflections.gend.$;
            let latCase = inflections.case.$;
            let number = inflections.num.$;
            let declension = inflections.decl.$;
            returnArr = [`${declension} declension`, `${gender} ${latCase} ${number}`];
            return returnArr;
        }
    } else if(type === 'verb') {
        if(Array.isArray(inflections)){
            for(let i = 0; i < inflections.length; i++){
                if(inflections[i].mood.$ === 'infinitive'){
                    let latTense = inflections[i].tense.$;
                    let latVoice = inflections[i].voice.$;
                    let latMood = inflections[i].mood.$;
                    let subArr = [`${latTense} ${latVoice} ${latMood}`];
                    returnArr.push(subArr);
                } else {
                    let person = inflections[i].pers.$;
                    let number = inflections[i].num.$;
                    let latTense = inflections[i].tense.$;
                    let latVoice = inflections[i].voice.$;
                    let latMood = inflections[i].mood.$;
                    let subArr = [`${person} person ${number} ${latTense} ${latVoice} ${latMood}`];
                    returnArr.push(subArr);
                }
                
            }   
            return returnArr;
        } else {
            if(inflections.mood.$ === 'infinitive'){
                let latTense = inflections.tense.$;
                let latVoice = inflections.voice.$;
                let latMood = inflections.mood.$;
                returnArr = [`${latTense} ${latVoice} ${latMood}`];
                return returnArr;
            } else {
                let person = inflections.pers.$;
                let number = inflections.num.$;
                let latTense = inflections.tense.$;
                let latVoice = inflections.voice.$;
                let latMood = inflections.mood.$;
                returnArr = [`${person} person ${number} ${latTense} ${latVoice} ${latMood}`];
                return returnArr;
            }
        }
    } else if(type === 'adjective') {
        if(Array.isArray(inflections)) {
            for(let i = 0; i < inflections.length; i++) {
                if(inflections[i].gend.$ === 'adverbial') {
                    let declension = inflections[i].decl.$;
                    let gender = inflections[i].gend.$;
                    let conj = [`${declension} declension`, `${gender}`];
                    returnArr.push(conj);
                } else {
                    let gender = inflections[i].gend.$;
                    let latCase = inflections[i].case.$;
                    let number = inflections[i].num.$;
                    let declension = inflections[i].decl.$;
                    let conj = [`${declension} declension`, `${gender} ${latCase} ${number}`];
                    returnArr.push(conj);
                }
                
            }   
            return returnArr;
        } else {
            if(inflections.gend.$ === 'adverbial') {
                let declension = inflections.decl.$;
                let gender = inflections.gend.$;
                returnArr = [`${declension}`, `${gender}`];
                return returnArr;
            } else {
                let gender = inflections.gend.$;
                let latCase = inflections.case.$;
                let number = inflections.num.$;
                let declension = inflections.decl.$;
                returnArr = [`${declension} declension`, `${gender} ${latCase} ${number}`];
                return returnArr;
            }
        } 
    }
}
async function getWikiLatin (lemma) {
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
}
async function getPerseusLatin(lemma) {
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

}

export {  getLatinMorph  }