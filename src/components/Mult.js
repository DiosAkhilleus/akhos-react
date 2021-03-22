import Translation from './Translation';

const Mult = (props) => {
    return (
        <div>
        {console.log(props.input, props.provided, props.lang)}
        {props.input.map((item) => {return ( 
            <Translation key={Math.random()}
          provided={props.provided}
          head={`From: ${item.headword}`} 
          type={`Word Type: ${item.type}`} 
          inflections={item.inflections} 
          short={`Wiki Definition: ${item.shortDef}`} 
          long={(props.lang === 'la') ? `Lewis & Short Entry: ${item.longDef}` : `Liddell Scott Entry: ${item.longDef}`} />
         )})}
        </div>
    )
}

export default Mult
