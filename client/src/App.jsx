import { useState, useEffect } from "react";
import getGreekMorph from "./javascript/greek";
import getLatinMorph from "./javascript/latin";
import Mult from "./components/Mult";
import { Button } from "@mui/material";
import "./App.css";
// import { useMediaQuery } from 'react-responsive';

function App() {
  const [greek, setGreek] = useState(""); // the current value of the greek input string
  const [latin, setLatin] = useState(""); // the current value of the latin input string
  const [language, setLanguage] = useState(""); // the most recent language submitted by the user

  const [greekArr, setGreekArr] = useState([]); // array of words from the user's input in the Greek input form
  const [latinArr, setLatinArr] = useState([]); // array of words from the user's input in the Latin input form
  const [displayArr, setDisplayArr] = useState([]); // the final array of words to be displayed... will be either Greek or Latin
  const [morphList, setMorphList] = useState([]); // an array of morphs corresponding to each item in either greekArr or latinArr, depending on which the user submitted

  const [visible, setVisible] = useState(false); // determines whether or not a morph is visible on the screen during mouseEnter and before mouseLeave
  const [loaded, setLoaded] = useState(false); // changes to true once the morphList for a given input phrase by the user has been properly returned
  const [loadingBar, setLoadingBar] = useState(false); // the status of whether or not the loading bar is visible... only appears when a phrase is loading
  const [expanded, setExpanded] = useState(false); // whether or not the dictionary entry is in its expanded form

  const [activeIndex, setActiveIndex] = useState(); // the index of the currently active morph (so in 'cogito ergo sum', if 'ergo' were active this value would be '1')

  // const isMobile = useMediaQuery({ query: '(max-device-width:  800px)' }) // media query to determine if the user is on a mobile device, mainly to prevent issues when clicking on the "Show more" tab in the dictionary entries

  useEffect(() => {
    // whenever the user updates the greek array by inputting some string of greek text, this function retrieves the morphology information for all words in the array.
    if (greekArr.length > 0) {
      getGreekPhrase();
    }
  }, [greekArr]);

  useEffect(() => {
    // this works exactly the same as the getGreekPhrase function in the previous hook.
    if (latinArr.length > 0) {
      getLatinPhrase();
    }
  }, [latinArr]);

  useEffect(() => {
    // if the morphList changes (the full list of morphology items for the user's input string), it sets the display array to be either Greek or Latin depending on what the user input.
    console.log("morphlist: ", morphList);
    if (morphList.length > 0) {
      setLoadingBar(false);
    }
    if (language === "la") {
      setDisplayArr(latinArr);
    }
    if (language === "gr") {
      setDisplayArr(greekArr);
    }
  }, [morphList]);

  useEffect(() => {
    if (loaded === true) {
      setActiveIndex(0);
      setVisible(true);
    }
  }, [loaded]);

  const getGreekPhrase = async () => {
    console.log("getting greek");
    let arr = [];
    if (greekArr.length > 0) {
      for (let i = 0; i < greekArr.length; i++) {
        let word = await getGreekMorph(greekArr[i]);
        if (word === undefined) {
          arr.push("Error: Undefined Word");
        } else {
          arr.push(word);
        }
      }
      console.log(arr);
      setMorphList(arr);
      setLoaded(true);
    } else if (greekArr.length === 1) {
      let grekWord = await getGreekMorph(greekArr[0]);
      if (grekWord === undefined) {
        setMorphList("Error: Undefined Word");
      } else {
        setMorphList(grekWord);
      }
      setLoaded(true);
    }
  };

  const getLatinPhrase = async () => {
    console.log("getting latin");
    let arr = [];
    console.log(latinArr);
    if (latinArr.length > 0) {
      console.log(latinArr);

      for (let i = 0; i < latinArr.length; i++) {
        let word = await getLatinMorph(latinArr[i]);
        console.log(word);
        if (word === undefined) {
          arr.push("Error: Undefined Word");
        } else {
          arr.push(word);
        }
      }
      setMorphList(arr);
      setLoaded(true);
    } else if (latinArr.length === 1) {
      let latWord = await getLatinMorph(latinArr[0]);
      console.log(latWord);
      if (latWord === undefined) {
        setMorphList("Error: Undefined Word");
      } else {
        setMorphList(latWord);
      }
      setLoaded(true);
    }
  };

  const displayMorph = (e, index) => {
    // this is what sets whether or not the morphs may display on the page. Only works when certain conditions are satisfied.
    if (loaded === true) {
      setExpanded(false);
      setActiveIndex(index);
      setVisible(true);
    }
  };

  const handleChange = (e, lang) => {
    // updates 'greek' or 'latin' in state as the user types in one of the input boxes
    if (lang === "greek") {
      setGreek(e.target.value);
    }
    if (lang === "latin") {
      setLatin(e.target.value);
    }
  };

  const handleLang = async (e, lang) => {
    // handles user submission of either greek or latin forms
    setLoaded(false);
    setVisible(false);
    setActiveIndex(0);
    let inputPhrase;
    if (lang === "greek") {
      setLanguage("gr");
      inputPhrase = greek.trim();
    }
    if (lang === "latin") {
      setLanguage("la");
      inputPhrase = latin.trim();
    }
    let cleanedInput = inputPhrase.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // cleaning of the input string, to remove any punctuation that would mess up morph retrieval
    let cleanedInputArr = cleanedInput.split(" ");
    for (let i = 0; i < cleanedInputArr.length; i++) {
      cleanedInputArr[i].trim();
    }
    console.log(cleanedInputArr);
    setMorphList([]);
    if (lang === "latin") {
      console.log("latin");
      setLoadingBar(true);
      setGreekArr([]);
      setLatinArr(cleanedInputArr);
    } else {
      console.log("greek");
      setLoadingBar(true);
      setLatinArr([]);
      setGreekArr(cleanedInputArr);
    }
    e.preventDefault();
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="page-title">Akhos</div>
        <div className="page-subtitle">A Classical Studies Morphology Tool</div>
        <a
          href="https://www.buymeacoffee.com/andrewbertin"
          target="_blank"
          className="coffee-button"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
            alt="Buy Me A Coffee"
            style={{ height: 50, width: 217 * (5 / 6) }}
          />
        </a>
      </div>
      <div id="form-container">
        <form
          className="lang-form"
          onSubmit={(e) => {
            handleLang(e, "greek");
          }}
        >
          <input
            className="lang-input"
            type="text"
            value={greek}
            onChange={(e) => {
              handleChange(e, "greek");
            }}
            name="gr"
            placeholder="ἄνδρα μοι ἔννεπε μοῦσα"
          />
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            classes={{ label: "sub-button" }}
          >
            Submit Greek
          </Button>
        </form>
        <form
          className="lang-form"
          onSubmit={(e) => {
            handleLang(e, "latin");
          }}
        >
          <input
            className="lang-input"
            type="text"
            value={latin}
            onChange={(e) => {
              handleChange(e, "latin");
            }}
            placeholder="arma virumque cano"
          />
          <Button
            className="button"
            variant="outlined"
            color="secondary"
            type="submit"
            classes={{ label: "sub-button" }}
          >
            Submit Latin
          </Button>
        </form>
      </div>
      <div className="phrase-container">
        {displayArr.map((el, index) => (
          <div
            className="phrase-word"
            key={index}
            style={
              index === activeIndex
                ? language === "gr"
                  ? { color: "rgb(20, 85, 73)" }
                  : { color: "rgb(152, 19, 46)" }
                : { color: "black" }
            }
            onMouseEnter={(e) => {
              displayMorph(e, index);
            }}
            onMouseDown={(e) => {
              displayMorph(e, index);
            }}
          >
            {el}
          </div>
        ))}
      </div>
      <div
        className="loading"
        style={loadingBar ? { height: "50px" } : { height: "0" }}
      >
        {loadingBar ? "Loading..." : ""}
      </div>
      {language === "gr" ? (
        visible ? (
          <div id="translation">
            <Mult
              input={morphList[activeIndex]}
              provided={greekArr[activeIndex]}
              lang={language}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      {language === "la" ? (
        visible ? (
          <div id="translation">
            <Mult
              input={morphList[activeIndex]}
              provided={latinArr[activeIndex]}
              lang={language}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <div id="greek"></div>
      <div id="latin"></div>
    </div>
  );
}

export default App;
