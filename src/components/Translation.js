import React, {useState} from 'react';

const Translation = (props) => {
    
// const [head, setHead] = useState('');
// const [type, setType] = useState('');
// const [inflect, setInflect] = useState([]);
// const [short, setShort] = useState('');
// const [long, setLong] = useState('');

// const setInfo = () => {
//     setHead(`From: ${props.head}`);
//     setType(`Word Type: ${props.type}`);
//     setInflect(props.inflections);
//     setShort(`Wiki Translation: ${props.short}`);
//     setLong(`Full Entry: ${props.long}`);
//     console.log(head, type, short, long);
// }

const format = (arr) => {
    console.log(arr);

    for(const item of arr) {
        console.log(item);
        return (Object.keys(item).map((val, i) => {return (<div key={i}><br/><div>{val.charAt(0).toUpperCase() + val.slice(1)}: {item[val]}</div></div>)})
        )}
}
    return (
        <div>
            <br/>
            <div>{props.head}</div> <br/>
            <div>{props.type}</div>
            <div>{format(props.inflections)}</div><br/>
            <div>{props.short}</div> <br/>
            <div>{props.long}</div>
        </div>    
    )
}

export default Translation
