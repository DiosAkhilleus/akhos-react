import React, { useState, useEffect } from 'react';
import getGreekMorph from './modules/javascript/greek';
import getLatinMorph from './modules/javascript/latin';
import Mult from './components/Mult';
import {Button} from '@material-ui/core';
import './App.css';

function App () {

  const [greek, setGreek] = useState ('');
  const [latin, setLatin] = useState ('');
  const [language, setLanguage] = useState('');

  const [greekArr, setGreekArr] = useState([]);
  const [latinArr, setLatinArr] = useState([]);
  const [displayArr, setDisplayArr] = useState([]);
  const [morphList, setMorphList] = useState([]);

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const [loaded, setLoaded] = useState(false);

useEffect(() => {
  async function getGreekPhrase() {
  let arr = [];
  if (greekArr !== []) {
    for (let i = 0; i < greekArr.length; i++) {
      let word = await getGreekMorph (greekArr[i]);
      arr.push(word);
    } 
  setMorphList(arr);
  setLoaded(true);
  } else if (greekArr.length === 1) {
      let grekWord = await getGreekMorph(greekArr[0])
      setMorphList(grekWord); 
      setLoaded(true);
    }
  }
  getGreekPhrase();
}, [greekArr])

useEffect(() => {
  async function getLatinPhrase() {
   let arr = [];
   if (latinArr !== []) {
     for (let i = 0; i < latinArr.length; i++) {
       let word = await getLatinMorph (latinArr[i]);
       arr.push(word);
     } 
   setMorphList(arr);
   setLoaded(true);
     
   } else if (latinArr.length === 1) {
       let latWord = await getLatinMorph(latinArr[0])
       setMorphList(latWord); 
       setLoaded(true);
     }
   }
   getLatinPhrase();
}, [latinArr])

useEffect(() => {
  console.log(morphList);
}, [morphList]);
  
useEffect(() => {
  console.log(activeIndex);
  
}, [activeIndex])

useEffect(() => {
  if (language === 'la') {setDisplayArr(latinArr)}
  if (language === 'gr') {setDisplayArr(greekArr)}
}, [morphList])

const displayMorph = (e, index) => {
  if (index !== activeIndex && loaded === true) {
    setActiveIndex(index);
    setVisible(true);
    setActive(false);
  }
}

const setClicked = (e, index) => {
  setActiveIndex(index);
  setVisible(true);
  setActive(true);
}

const stopDisplay = (e, index) => {
  
  if (active !== true && displayArr !== []) {
    setVisible(false)
    setActiveIndex();
  }

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
      setLoaded(false);
      setMorphList([]);
      setDisplayArr([]);
      setVisible(false)
      setActiveIndex();
      setActive(false);
      setLanguage('gr');
      setGreekArr(greek.split(' '));
      
      //grek(greek);
    }
    if (lang === 'latin') {
      setLoaded(false);
      setMorphList([]);
      setDisplayArr([]);
      setVisible(false)
      setActiveIndex();
      setActive(false);
      setLanguage('la');
      setLatinArr(latin.split(' '));
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

        {displayArr.map((el, index) => (<div className='phrase-word' key={index} onMouseDown={(e) => {setClicked(e, index)}} onMouseEnter={(e) => {displayMorph(e, index)}} onMouseLeave={(e) => {stopDisplay(e, index)}}>{el}</div>))}

          {/* {language === 'gr' ? displayArr.map((el, index) => (
            <div className='phrase-word' key={index} onMouseDown={(e) => {setClicked(e, index)}} onMouseEnter={(e) => {displayMorph(e, index)}} onMouseLeave={(e) => {stopDisplay(e, index)}}>{el}</div>
          )) : latinArr.map((el, index) => (
            <div className='phrase-word' key={index} onMouseDown={(e) => {setClicked(e, index)}} onMouseEnter={(e) => {displayMorph(e, index)}} onMouseLeave={(e) => {stopDisplay(e, index)}}>{el}</div>
          ))} */}
        </div>
        <br/>
          {language === 'gr' ? (visible ? <div id='translation'><Mult input={morphList[activeIndex]} provided={greekArr[activeIndex]} lang={language}/></div> : '') : ''}
          {language === 'la' ? (visible ? <div id='translation'><Mult input={morphList[activeIndex]} provided={latinArr[activeIndex]} lang={language}/></div> : '') : ''}
          <div id='greek'></div>
          <div id='latin'></div>
      </div>
    );
}

export default App;
