const convert = require('xml-js');

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

const parseSingleMorph = (morph) => {
    console.log("Single-Morph");
    console.log(morph);
} 

const parseMultiMorph = (multiMorph) => {
    console.log("Multi-Morph");
    console.log(multiMorph);
}
  
  export { arraysEqual, parseSingleMorph, parseMultiMorph }