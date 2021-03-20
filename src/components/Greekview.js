import React from 'react';
// import ReactDOM from 'react-dom';
import Overview from './Overview';
import getGreek from '../modules/javascript/greek';


class GreekView extends React.Component {


constructor(props) {
    super(props);
    this.state = {
      list: [],
      value: '',
      information: [],
      item: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
    event.preventDefault();
  }
  async handleSubmit(event) {
    event.preventDefault();
    const item = this.state.value;
    const conc = this.state.list.concat(item);
    const info = await getGreek(item);
    
    this.setState({information: info})
    this.setState({ list: conc });
    this.setState({value: ''});
    this.setState({item: item});
    //console.log(this.state.information);
  }
  
  render () {
    return (
      <div>
        <form onSubmit = {this.handleSubmit}>
          <label>
            Greek:
            <input type="text" value = {this.state.value} onChange = {this.handleChange} name="name" required/>
          </label>
          <input type="submit" value="Submit" />
        </form>
        <br />
        <Overview items={this.state.list} title={this.state.information} name={this.state.item} />
        <br />
        {/* <div>{this.state.information}</div> */}
        <div id='greek' style={{display:'none'}}></div>
        
      </div>
    );
  } 
}

export default GreekView