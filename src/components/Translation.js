import '../App.css';
import ShowMoreText from 'react-show-more-text';

const Translation = (props) => {
    const executeOnClick = (isExpanded) => {
        console.log(isExpanded);
    }

    const format = (item, i) => { // maps through the inflection array and returns a div containing each inflection 

            return(
                <div className="infl">
                <h4 className="possibility">Possibility {i + 1}</h4>
                {Object.keys(item).map((val, i) => {
                    return (
                        <div className='inflect' key={i}>
                        <div>{val.charAt(0).toUpperCase() + val.slice(1)}: {item[val]}</div>
                        <br/>
                        </div>)
                        })}
                </div>
            )
    }
    return (
        <div className='trans-container'>
            <h2 className="title">{props.provided}</h2> 
            <div className="type">{props.type}</div><br/>
            <div className="head">{props.head}</div><br/>
            <div className="short">{props.short}</div><br/>
            <div>{(props.provided !== '') ? '––––––––––––––––––––' : ''}</div>
            <div>{props.inflections.map((item, i) => format(item, i))}</div>
            <div>{(props.provided !== '') ? '––––––––––––––––––––' : ''}</div><br/>
            <ShowMoreText 
                className="long"
                anchorClass='anchor-class'
                lines={3}
                more='Show more'
                less='Show less'
                onClick={executeOnClick}
                expanded={false}
            >
                {props.long}
            </ShowMoreText>
            <br/>
            <br/>
        </div>    
    )
}

export default Translation
