import React, { useState } from 'react';
import getGreek from './modules/javascript/greek';
import getLatin from './modules/javascript/latin';
import Mult from './components/Mult';
import './App.css';

function App () {

  const [greek, setGreek] = useState ('');
  const [latin, setLatin] = useState ('');
  const [ret, setRet] = useState(false);
  const [lang, setLang] = useState('');
  const [provided, setProvided] = useState('');
  const [lemm, setLemm] = useState([]);

  const grek = async (lemma) => {
    
  const grekWord = await getGreek(lemma);
  
    setLemm (grekWord);
  
}
  const lat = async (lemma) => {

    const latWord = await getLatin(lemma);

    console.log(latWord);
    setLemm(latWord);
  }
  const handleChangeGreek = (event) => {
    
    setGreek (event.target.value);
  }
  const handleChangeLatin = (event) => {
    setLatin (event.target.value);
  }

  const handleGreek = (e) => {
    setRet(true);
    e.preventDefault();
    setProvided(greek);
    setLang('gr');
    
    grek(greek);

    //setGreek('');
  }
  const handleLatin = (e) => {
    setRet(true);
    setProvided(latin);
    e.preventDefault();
    setLang('la');
    
    lat(latin);
    //setLatin('');
  }

    return (
      <div>
        <form onSubmit={handleGreek}>
          <label>
            Greek: 
            <input type="text" value={greek} onChange={handleChangeGreek} placeholder="μῆνις"/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <br/>
        <form onSubmit={handleLatin}>
          <label>
            Latin:
            <input type="text" value={latin} onChange={handleChangeLatin} placeholder="cogito"/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <br/>
          <div>{(ret) ? (<Mult input={lemm} provided={provided} lang={lang}/>) : ''}</div>
          {/* <Translation 
          provided={provided}
          head={(ret) ? `From: ${headWord}` : headWord } 
          type={(ret) ? `Word Type: ${type}` : type} 
          inflections={(ret) ? inflections: inflections} 
          short={(ret) ? `Wiki Definition: ${shorterDef}` : shorterDef} 
          long={(ret) ? ((lang === 'la') ? `Lewis & Short Entry: ${longerDef}` : `Liddell Scott Entry: ${longerDef}`) : longerDef} /> */}
        <div id='greek'></div>
        <div id='latin'></div>
      </div>
    );
}

export default App;
