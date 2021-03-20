import React from "react";

class Overview extends React.Component {
    constructor (props) {
        super(props);
        this.state = {list: ''};
    }
    render() {
        return (
            <div>{this.props.items.map(
                function itemsIterator (item, i) {
                    return (<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>)
                }
            )}
            </div>
        );
    }

}

export default Overview;