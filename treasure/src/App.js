import React from "react";
import "./App.css";
import axiosWithAuth from "./utils";
import ButtonBar from './components/button_bar/index'

class App extends React.Component {
  initGame = () => {
    axiosWithAuth()
      .get("init/")
      .then(res => {
        console.log(res);
      });
  };
  move = () => {
    axiosWithAuth()
      .post("move/", { direction: "n" })
      .then(res => {
        console.log(res);
      });
  };
  buildMap = () => {};

  render() {
    return (
      <div className="App">
        <h4>Lambda CS Build Week 2</h4>
        <ButtonBar/>
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.move}>move</button>
      </div>
    );
  }
}

export default App;
