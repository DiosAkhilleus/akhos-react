import "../App.css";
import ShowMoreText from "react-show-more-text";

const Translation = ({
  provided,
  head,
  type,
  inflections,
  short,
  long,
  expanded,
  executeOnClick,
}) => {
  const format = (item, index) => {
    // maps through the inflection array and returns a div containing each inflection

    return (
      <div className="infl" key={index}>
        <h4 className="possibility">Possibility {index + 1}</h4>
        {Object.keys(item).map((val, index) => {
          return (
            <div className="inflect" key={index}>
              <div>
                {val.charAt(0).toUpperCase() + val.slice(1)}: {item[val]}
              </div>
              <br />
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="trans-container">
      <h2 className="title">{provided}</h2>
      <div className="type">{type}</div>
      <br />
      <div className="head">{head}</div>
      <br />
      <div className="short">{short}</div>
      <br />
      <div>{provided !== "" ? "––––––––––––––––––––" : ""}</div>
      <div>{inflections.map((item, index) => format(item, index))}</div>
      <div>{provided !== "" ? "––––––––––––––––––––" : ""}</div>
      <br />
      <ShowMoreText
        className="long"
        anchorClass="anchor-class"
        lines={3}
        more="Show more"
        less="Show less"
        onClick={executeOnClick}
        expanded={expanded}
      >
        {long}
      </ShowMoreText>
      <br />
      <br />
    </div>
  );
};

export default Translation;
