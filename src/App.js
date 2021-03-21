import React, { useState } from 'react';
import getGreek from './modules/javascript/greek';
import getLatin from './modules/javascript/latin';
import Translation from './components/Translation';
import './App.css';

function App () {

  const [headWord, setHeadWord] = useState('');
  const [type, setType] = useState('');
  const [inflections, setInflections] = useState([]);
  const [shorterDef, setShorterDef] = useState ('');
  const [longerDef, setLongerDef] = useState ('');
  const [greek, setGreek] = useState ('');
  const [latin, setLatin] = useState ('');
  const [ret, setRet] = useState(false);
  const [lang, setLang] = useState('');

  const grek = async (lemma) => {
    
  const grekWord = await getGreek(lemma);
  
  if(Object.keys(grekWord)[0] === 'headword'){
    setRet(false);
    const head = await grekWord.headword;
    const part = await grekWord.type;
    const infl = await grekWord.inflections;
    const short = await grekWord.shortDef;
    const long = await grekWord.longDef;
    
  
    setHeadWord (head);
    setType (part);
    setInflections (infl);
    setShorterDef (short);
    setLongerDef (long);
    console.log(Object.keys(grekWord).length);
    setRet(true);
    setLang('gr');
  } else {
    console.log("More than 1 def");
  }
}
  const lat = async (lemma) => {
    const latWord = await getLatin(lemma);
    if(Object.keys(latWord)[0] === 'headword'){
      setRet(false);
      const head = await latWord.headword;
      const part = await latWord.type;
      const infl = await latWord.inflections;
      const short = await latWord.shortDef;
      const long = await latWord.longDef;
    
      setHeadWord (head);
      setType (part);
      setInflections (infl);
      setShorterDef (short);
      setLongerDef (long);
      console.log(head, part, infl, short, long);
      console.log(Object.keys(latWord).length);
      setRet(true);
      setLang('la');
  } else {
    console.log("More than 1 def");
  }
    console.log(lemma);
  }
  const handleChangeGreek = (event) => {
    
    setGreek (event.target.value);
  }
  const handleChangeLatin = (event) => {
    setLatin (event.target.value);
  }

  const handleGreek = (e) => {
    e.preventDefault();
    grek(greek);
    //setGreek('');
  }
  const handleLatin = (e) => {
    e.preventDefault();
    lat(latin);
    //setLatin('');
  }

    return (
      <div>
        <form onSubmit={handleGreek}>
          <label>
            Greek: 
            <input type="text" value={greek} onChange={handleChangeGreek}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <br/>
        <form onSubmit={handleLatin}>
          <label>
            Latin:
            <input type="text" value={latin} onChange={handleChangeLatin}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <br/>
          <Translation 
          head={(ret) ? `From: ${headWord}` : headWord } 
          type={(ret) ? `Word Type: ${type}` : type} 
          inflections={(ret) ? inflections: inflections} 
          short={(ret) ? `Wiki Definition: ${shorterDef}` : shorterDef} 
          long={(ret) ? ((lang === 'la') ? `Lewis & Short Entry: ${longerDef}` : `Liddell Scott Entry: ${longerDef}`) : longerDef} />
        <div id='greek'></div>
        <div id='latin'></div>
      </div>
    );
}

export default App;
