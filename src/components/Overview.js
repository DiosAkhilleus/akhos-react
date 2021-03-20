import React from "react";

class Overview extends React.Component {
    constructor (props) {
        super(props);
        this.state = {list: ''};
    }
    render() {
        return (
            <div>
                {/* <div>{this.props.items.map(
                function itemsIterator (item, i) {
                    return (<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>)
                }
            )}
                </div> */}
                <div>{this.props.name}</div>
                <br />
                <div>From: {this.props.title[0]}</div>
                <br />
                <div>Type: {this.props.title[1]}</div>
                <br />
                <div>Inflection Possibilities: {this.props.title[2]}</div>
                <br />
                <div>Short Dict. Entry: {this.props.title[3]}</div>
                <br />
                <div>Middle Liddell: {this.props.title[4]}</div>
            </div>
        );
    }

}

export default Overview;