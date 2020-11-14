import React from './react/packages/react';
import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }\ 
class App extends React.Component {
  // render() {
  //   return (
  //     <div>123</div>
  //   )
  // }
  state = {
    number: 0
  }

  buttonRef = React.createRef();

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({
        number: 1
      })
    }, 500);
    setTimeout(() => {
      
      console.log(this.buttonRef.current) 
      if (this.buttonRef.current) {
        this.buttonRef.current.click()
      }
    }, 502);
  }
  add = () => {
    this.setState({
      number: this.state.number + 1
    })
  }
 
  render() {
    let BLOCKDIVNUMBER = 100000;    
    let temp = [];   
      while (BLOCKDIVNUMBER) {      
        temp.push(<div style={{ 
          display: "inline-block", 
          borderRadius: "1px solid black",
          height: 200, 
          width: 200,
          backgroundColor: "blue",
          color: "#ffffff" }} > 
          {this.state.number}</div>
          );
          BLOCKDIVNUMBER--;
      }    
      return (
        <div className="app">
          <button ref={this.buttonRef} onClick={this.add}>add
          </button>
          {temp}</div>
        );  
  }  
}

export default App;
