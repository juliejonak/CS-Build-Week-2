<<<<<<< HEAD
import React from 'react';
import './App.css';
import ButtonBar from './components/button_bar/index'

function App() {
  return (
    <div className="App">
      <h4>Lambda CS Build Week 2</h4>
      <ButtonBar/>
    </div>
  );
=======
import React from "react";
import "./App.css";
import axiosWithAuth from "./utils";

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
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.move}>move</button>
      </div>
    );
  }
>>>>>>> 32fb897b9d7963a457be9a61206056bd13d452ba
}

export default App;
