import React from "react";

class Overview extends React.Component {
    constructor (props) {
        super(props);
        console.log(this.props.title);
        
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
                {/* <div>{this.props.title.map((item, i) => (!Array.isArray(this.props.title[0])) ? (<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>) : this.props.title.map((subarray, i) => subarray.map((<li key={item.toString()}>{"#" + (i + 1) + ": " + item}</li>)))
            )}</div> */}

            {/* <div>{Object.keys(this.props.title).map((key, i) => (<div key={i} value={key}>{key}: {this.props.title[key]}</div>))}</div> */}
            {/* <div>{Object.keys(this.props.title).map((key, i) => (console.log(Object.keys(this.props.title))))}</div> */}
            
            <div>{(Object.keys(this.props.title)[0] === 'headword' ) ? (Object.keys(this.props.title).map((key, i) => (<div key={i}><div key={i} value={key}>{key}: {this.props.title[key]} </div> <br/> </div>))) : (Object.keys(this.props.title).map((sub) => (Object.keys(this.props.title[sub]).map(((lower, i) => (<div key={i}> <div key={i} value={lower}>{lower}: {this.props.title[sub][lower]}</div> <br/> </div>))))))}</div>
            {/* <div>{Object.keys(this.props.title).map((key, i) => (Object.keys(this.props.title)[0] === 'headword' ) ? (<div key={i} value={key}>{key}: {this.props.title[key]}</div>) : (Object.keys(this.props.title).map((sub) => (Object.keys(this.props.title[sub])))))}</div> */}


                {/* <div>{Object.keys(this.props.title).map(function(key) {return <div>Key: {key}, Value: {this.props.title[key]}</div>;})}</div> */}
            </div>
        );
    }

}

export default Overview;