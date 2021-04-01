import React, { useState } from 'react';
import getGreek from './modules/javascript/greek';
import getLatin from './modules/javascript/latin';
import Mult from './components/Mult';
import {Button} from '@material-ui/core';
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
    setProvided(greek);
    setLemm (grekWord);
    setLang('gr');
}
  const lat = async (lemma) => { // same as above grek

    const latWord = await getLatin(lemma);
    setProvided(latin);
    setLemm(latWord);
    setLang('la');
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
    grek(greek);
  }
  const handleLatin = (e) => { // same as handleGreek but for Latin
    setRet(true);
    e.preventDefault();
    lat(latin);
  }

    return (
      <div>
        <div id="form-container">
          <form className="lang-form" onSubmit={handleGreek}>
            <input className="lang-input" type="text" value={greek} onChange={handleChangeGreek} name="gr" placeholder="ἄνδρα"/>
            &nbsp;
            <Button variant="outlined" color="primary" type="submit" classes={{label: 'sub-button'}}>Submit Greek</Button>
          </form>
          <form className="lang-form" onSubmit={handleLatin}>
                <input className="lang-input" type="text" value={latin} onChange={handleChangeLatin} placeholder="aequitas"/>
                &nbsp;
              <Button variant="outlined" color="secondary" type="submit" classes={{label: 'sub-button'}}>Submit Latin</Button>
            </form>
        </div>
        <br/>
          <div id="translation">{(ret) ? (<Mult input={lemm} provided={provided} lang={lang}/>) : ''}</div>
        <div id='greek'></div>
        <div id='latin'></div>
      </div>
    );
}

export default App;
