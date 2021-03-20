import React from 'react';
// import { getGreekMorph } from './modules/greek';
// import { getLatinMorph } from './modules/latin';
// import { parseSingleMorph, parseMultiMorph } from './modules/helpers';
import GreekView from './components/Greekview';

class App extends React.Component {
  render () {
    return (
      <GreekView />
    );
  } 
}

export default App;
