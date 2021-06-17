import '../App.css';
import ShowMoreText from 'react-show-more-text';

const Translation = ({key, provided, head, type, inflections, short, long, expanded, executeOnClick}) => {

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
            <h2 className="title">{provided}</h2> 
            <div className="type">{type}</div><br/>
            <div className="head">{head}</div><br/>
            <div className="short">{short}</div><br/>
            <div>{(provided !== '') ? '––––––––––––––––––––' : ''}</div>
            <div>{inflections.map((item, i) => format(item, i))}</div>
            <div>{(provided !== '') ? '––––––––––––––––––––' : ''}</div><br/>
            <ShowMoreText 
                className="long"
                anchorClass='anchor-class'
                lines={3}
                more='Show more'
                less='Show less'
                onClick={executeOnClick}
                expanded={expanded}
            >
                {long}
            </ShowMoreText>
            <br/>
            <br/>
        </div>    
    )
}

export default Translation
