import Translation from './Translation';

const Mult = ({ input, provided, lang }) => { 
    // maps through the input array and provides a Translation component from the information inside input
    return (
        <>
            {input.map((el, index) => {return ( 
                <Translation 
                    key={index}
                    provided={provided}
                    head={`From: ${el.headword}`} 
                    type={el.type.charAt(0).toUpperCase() + el.type.slice(1)} 
                    inflections={el.inflections} 
                    short={`Wiki Definition: ${el.shortDef}`} 
                    long={(el.lang === 'la') ? `Lewis & Short Entry: ${el.longDef}` : `Liddell Scott Entry: ${el.longDef}`} 
                />
            )})}
        </>
    )
}

export default Mult
