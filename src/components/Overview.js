import React from "react";

class Overview extends React.Component {
    constructor (props) {
        super(props);
        this.state = {list: ''};
    }
    mult (info) {
        if(info.length === 1){
            return (info.map(function itemsIterator (item, i) {
                return (<li key={item.toString()}>{item} {i}</li>)
            }));
        // } else {
        //     let double = item => (<li key={item.toString()}>{item}</li>)
        //     let doubledArray = info.map ( subArr => subArr.map (double));
        // }
    }
}
    render() {
    
        return (
            <div>
                {/* <div>{this.props.title.map((item, i) => (<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>))}</div> */}
                <div>{this.props.title.map((item, i) => (!Array.isArray(this.props.title[0])) ? (<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>) : this.props.title.map((subarray, i) => subarray.map((<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>)))
            )}
                </div>



                {/* <div id="gr" name="grek">  
                    {this.props.title}          
                </div>     */}
{/*                             
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
                <div>Middle Liddell: {this.props.title[4]}</div> */}
            </div>
        );
    }

}

export default Overview;