import React, { useState, useEffect } from 'react';
import getGreekMorph from './modules/javascript/greek';
import getLatinMorph from './modules/javascript/latin';
import Mult from './components/Mult';
import {Button} from '@material-ui/core';
import './App.css';

function App () {

  const [greek, setGreek] = useState (''); // the current value of the greek input string
  const [latin, setLatin] = useState (''); // the current value of the latin input string
  const [language, setLanguage] = useState(''); // the most recent language submitted by the user

  const [greekArr, setGreekArr] = useState([]); // array of words from the user's input in the Greek input form
  const [latinArr, setLatinArr] = useState([]); // array of words from the user's input in the Latin input form
  const [displayArr, setDisplayArr] = useState([]); // the final array of words to be displayed... will be either Greek or Latin
  const [morphList, setMorphList] = useState([]); // an array of morphs corresponding to each item in either greekArr or latinArr, depending on which the user submitted

  const [visible, setVisible] = useState(false); // determines whether or not a morph is visible on the screen during mouseEnter and before mouseLeave
  const [active, setActive] = useState(false);  // determines wheter or not a morph is visible after a click, remaining even after mouseLeave
  const [activeIndex, setActiveIndex] = useState(); // the index of the currently active morph (so in 'cogito ergo sum', if 'ergo' were active this value would be '1')

  const [loaded, setLoaded] = useState(false); // changes to true once the morphList for a given input phrase by the user has been properly returned

  useEffect(() => { // whenever the user updates the greek array by inputting some string of greek text, this function retrieves the morphology information for all words in the array.
    async function getGreekPhrase() {
    let arr = [];
    if (greekArr !== []) {
      for (let i = 0; i < greekArr.length; i++) {
        let word = await getGreekMorph (greekArr[i]);
        if (word === undefined) {
          arr.push('Error: Undefined Word');
        } else {arr.push(word)};
      } 
    setMorphList(arr);
    setLoaded(true);
    } else if (greekArr.length === 1) {
        let grekWord = await getGreekMorph(greekArr[0])
        if (grekWord === undefined) {
          setMorphList('Error: Undefined Word');
        } else {
          setMorphList(grekWord);
        }
        setLoaded(true);
      }
    }
    getGreekPhrase();
  }, [greekArr])

  useEffect(() => { // this works exactly the same as the getGreekPhrase function in the previous hook.
    async function getLatinPhrase() {
    let arr = [];
    if (latinArr !== []) {
      for (let i = 0; i < latinArr.length; i++) {
        let word = await getLatinMorph (latinArr[i]);
        if (word === undefined) {
          arr.push('Error: Undefined Word');
        } else {arr.push(word);}
        
      } 
    setMorphList(arr);
    setLoaded(true);
      
    } else if (latinArr.length === 1) {
        let latWord = await getLatinMorph(latinArr[0])
        if (latWord === undefined) {
          setMorphList('Error: Undefined Word');
        } else {setMorphList(latWord);}
        setLoaded(true);
      }
    }
    getLatinPhrase();
  }, [latinArr])

  useEffect(() => { // if the morphList change (the full list of morphology items for the user's input string), it sets the display array to be either Greek or Latin depending on what the user input.
    if (language === 'la') {setDisplayArr(latinArr)}
    if (language === 'gr') {setDisplayArr(greekArr)}
  }, [morphList])

  const displayMorph = (e, index) => { // this is what sets whether or not the morphs may display on the page. Only works when certain conditions are satisfied.
    if (index !== activeIndex && loaded === true) {
      setActiveIndex(index);
      setVisible(true);
      setActive(false);
    }
  }

  const setClicked = (e, index) => { // if any word is clicked, this sets the morph for that word to remain on the screen even after mouseLeave
    setActiveIndex(index);
    setVisible(true);
    setActive(true);
  }

  const stopDisplay = (e, index) => { // controls the removal of the display on mouseLeave from one of the words of the displayed string
    if (active !== true && loaded === true) {
      setVisible(false)
      setActiveIndex();
    }
  }

  const handleChange = (e, lang) => { // updates 'greek' or 'latin' in state as the user types in one of the input boxes
    if (lang === 'greek') {
      setGreek(e.target.value);
    }
    if (lang === 'latin') {
      setLatin(e.target.value);
    }
  }

  const handleLang = (e, lang) => { // handles user submission of either greek or latin forms
    if (lang === 'greek') {
      setLoaded(false);
      setVisible(false)
      setActiveIndex();
      setActive(false);
      setLanguage('gr');
      let trimmed = greek.trim();
      let cleaned = trimmed.replace(/,/g, '');
      let cleanedArr = cleaned.split(' ');
      for (let i = 0; i < cleanedArr.length; i++) {
        cleanedArr[i].trim();
      }
      setGreekArr(cleanedArr);
    }
    if (lang === 'latin') {
      setLoaded(false);
      setVisible(false)
      setActiveIndex();
      setActive(false);
      setLanguage('la');
      let trimmed = latin.trim();
      let cleaned = trimmed.replace(/,/g, '');
      let cleanedArr = cleaned.split(' ');
      for (let i = 0; i < cleanedArr.length; i++) {
        cleanedArr[i].trim()
      }
      setLatinArr(cleanedArr);
      //lat(latin)
    }
    e.preventDefault();
  }

    return (
      <div>
        <div id="form-container">
          <form 
            className="lang-form" 
            onSubmit={(e) => {handleLang(e, 'greek')}}>
              <input 
                className="lang-input" 
                type="text" value={greek} 
                onChange={(e) => {handleChange(e, 'greek')}} 
                name="gr" 
                placeholder="ἄνδρα"/>
              &nbsp;
              <Button 
                variant="outlined" 
                color="primary" 
                type="submit" 
                classes={{label: 'sub-button'}}
              >Submit Greek
              </Button>
          </form>
          <form 
            className="lang-form" 
            onSubmit={(e) => {handleLang(e, 'latin')}}>
              <input 
                className="lang-input" 
                type="text" 
                value={latin} 
                onChange={(e) => {handleChange(e, 'latin')}} 
                placeholder="aequitas"/>
              &nbsp;
              <Button 
                variant="outlined" 
                color="secondary" 
                type="submit" 
                classes={{label: 'sub-button'}}
                >Submit Latin
              </Button>
          </form>
        </div>
        <div className='phrase-container'>
          {displayArr.map((el, index) => (
            <div 
              className='phrase-word' 
              key={index} 
              onMouseDown={(e) => {setClicked(e, index)}} 
              onMouseEnter={(e) => {displayMorph(e, index)}} 
              onMouseLeave={(e) => {stopDisplay(e, index)}}>{el}
            </div>
          ))}
        </div>
        <br/>
          {language === 'gr' ? (visible ? 
            <div id='translation'>
              <Mult 
                input={morphList[activeIndex]} 
                provided={greekArr[activeIndex]} 
                lang={language}
              />
            </div> : '') : ''}
          {language === 'la' ? (visible ? 
            <div id='translation'>
              <Mult 
                input={morphList[activeIndex]} 
                provided={latinArr[activeIndex]} 
                lang={language}
              />
            </div> : '') : ''}
          <div id='greek'></div>
          <div id='latin'></div>
      </div>
    );
}

export default App;
