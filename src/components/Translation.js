

const Translation = (props) => {

    const format = (item, i) => { // maps through the inflection array and returns a div containing each inflection 

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
            <div>{(props.provided !== '') ? '–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–_–' : ''}</div>
            <br/><br/>
        </div>    
    )
}

export default Translation
