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

const format = (item, i) => {
   
    
        return(
            
            <div>
            ––––––––––––––––––––<br/>
            <h4>Possibility {i + 1}</h4>
            {Object.keys(item).map((val, i) => {return (<div key={Math.random()}><div>{val.charAt(0).toUpperCase() + val.slice(1)}: {item[val]}</div><br/></div>)})}
            </div>
        )
    
}
    return (
        <div>
            <h2>{props.provided}</h2> 
            <div>{props.head}</div> <br/>
            <div>{props.type}</div>
            <div>{props.inflections.map((item, i) => format(item, i))}</div>
            <div>{(props.provided !== '') ? '––––––––––––––––––––' : ''}</div><br/>
            
            <div>{props.short}</div> <br/>
            <div>{props.long}</div>
        </div>    
    )
}

export default Translation
