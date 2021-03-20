import React from 'react';
import Overview from './components/Overview';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
    event.preventDefault();
  }
  handleSubmit(event) {
    const item = this.state.value;
    const conc = this.state.list.concat(item);
    this.setState({ list: conc });
    event.preventDefault();
    this.setState({value: ''});
  }
  
  render () {
    return (
      <div>
        <form onSubmit = {this.handleSubmit}>
          <label>
            Input:
            <input type="text" value = {this.state.value} onChange = {this.handleChange} name="name" required/>
          </label>
          <input type="submit" value="Submit" />
        </form>
        <br />
        <Overview items={this.state.list} />
      </div>
    );
  } 
}

export default App;
