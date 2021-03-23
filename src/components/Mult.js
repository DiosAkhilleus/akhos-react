import Translation from './Translation';

const Mult = (props) => { 
    // maps through the input array and provides a Translation component from the information inside input
    return (
        <>
        {/* {console.log(props.input, props.provided, props.lang)} */}
        {props.input.map((item) => {return ( 
            <Translation key={Math.random()}
          provided={props.provided}
          head={`From: ${item.headword}`} 
          type={item.type.charAt(0).toUpperCase() + item.type.slice(1)} 
          inflections={item.inflections} 
          short={`Wiki Definition: ${item.shortDef}`} 
          long={(props.lang === 'la') ? `Lewis & Short Entry: ${item.longDef}` : `Liddell Scott Entry: ${item.longDef}`} />
         )})}
        </>
    )
}

export default Mult
