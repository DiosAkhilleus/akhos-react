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

  const grek = async (lemma) => { // retrieves a Mult component with multiple nested Translation components, depending on if the input word has multiple root headwords
    
  const grekWord = await getGreek(lemma);
  
    setLemm (grekWord);
  
}
  const lat = async (lemma) => { // same as above grek

    const latWord = await getLatin(lemma);

    setLemm(latWord);
  }
  const handleChangeGreek = (event) => { // as input is typed into greek form, it updates the state with the current value
    
    setGreek (event.target.value);
  }

  const handleChangeLatin = (event) => { // same as handleChangeGreek but for Latin
    setLatin (event.target.value);
  }

  const handleGreek = (e) => { // handles the submission of the Greek input form
    setRet(true);
    e.preventDefault();
    setProvided(greek);
    setLang('gr');
    
    grek(greek);

    //setGreek('');
  }
  const handleLatin = (e) => { // same as handleGreek but for Latin
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
        <div id='greek'></div>
        <div id='latin'></div>
      </div>
    );
}

export default App;
