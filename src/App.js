import React, { useState, useEffect } from 'react';
import getGreekMorph from './modules/javascript/greek';
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
  const [phraseArr, setPhraseArr] = useState([]);
  const [morphList, setMorphList] = useState([]);
  const [phrase, setPhrase] = useState('');




 useEffect(() => {
   async function getGreekPhrase() {
    let arr = [];
    if (phraseArr !== []) {
      for (let i = 0; i < phraseArr.length; i++) {
        let word = await getGreekMorph (phraseArr[i]);
        arr.push(word);
      } 
    setMorphList(arr);

    } else if (phraseArr.length === 1) {
        let grekWord = await getGreekMorph(phraseArr[0])
        setMorphList(grekWord); 
      }
    }
    

    // setMorphList([])
    // for (let i = 0; i < phraseArr.length; i++) {
    //   const grekWord = await getGreekMorph(phraseArr[i]);
    //   setMorphList(morphList.concat(grekWord));
    // }
    getGreekPhrase();
 }, [phraseArr])

  useEffect(() => {
    console.log(morphList);
  }, [morphList]);
  
//   const grek = async (lemma) => { // retrieves a Mult component with multiple nested Translation components, depending on if the input word has multiple root headwords
    
//     const grekWord = await getGreek(lemma);
//     setProvided(greek);
//     setLemm (grekWord);
//     setLang('gr');
// }
//   const lat = async (lemma) => { // same as above grek

//     const latWord = await getLatin(lemma);
//     setProvided(latin);
//     setLemm(latWord);
//     setLang('la');
//   }

const displayMorph = (e, index) => {
  console.log(index);
}
  
  const handleChange = (e, lang) => {
    if (lang === 'greek') {
      setGreek(e.target.value);
    }
    if (lang === 'latin') {
      setLatin(e.target.value);
    }
  }

  const handleLang = (e, lang) => {
    if (lang === 'greek') {
      setRet(true);
      setPhrase(greek);
      setPhraseArr(greek.split(' '));
      
      //grek(greek);
    }
    if (lang === 'latin') {
      setRet(true);
      setPhrase(latin);
      setPhraseArr(latin.split(' '));
      //lat(latin)
    }
    e.preventDefault();
  }

    return (
      <div>
        <div id="form-container">
          <form className="lang-form" onSubmit={(e) => {handleLang(e, 'greek')}}>
            <input className="lang-input" type="text" value={greek} onChange={(e) => {handleChange(e, 'greek')}} name="gr" placeholder="ἄνδρα"/>
            &nbsp;
            <Button 
              variant="outlined" 
              color="primary" 
              type="submit" 
              classes={{label: 'sub-button'}}
            >
                Submit Greek
            </Button>
          </form>
          <form className="lang-form" onSubmit={(e) => {handleLang(e, 'latin')}}>
                <input className="lang-input" type="text" value={latin} onChange={(e) => {handleChange(e, 'latin')}} placeholder="aequitas"/>
                &nbsp;
                <Button variant="outlined" color="secondary" type="submit" classes={{label: 'sub-button'}}>Submit Latin</Button>
          </form>
        </div>
        <div className='phrase-container'>
          {phraseArr.map((el, index) => (
            <div key={index} onMouseOver={(e) => {displayMorph(e, index)}}>{el}</div>
          ))}
        </div>
        <br/>
          <div id="translation">{(ret) ? (<Mult input={lemm} provided={provided} lang={lang}/>) : ''}</div>
          <div id='greek'></div>
          <div id='latin'></div>
      </div>
    );
}

export default App;
