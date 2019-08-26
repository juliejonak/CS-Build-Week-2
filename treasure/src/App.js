import React from "react";
import "./App.css";
import axiosWithAuth from "./utils";
import ButtonBar from './components/button_bar/index'
import GameScreen from "./components/gameScreen";


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
    const printWords = ["Welcome to the Lambda Treasure Hunt. \n", "To play, click a button to move through the maze.", "Try to find treasure that you can sell at Pirate Ry's for gold.", "When you have 1000 gold, you can become an official Lambda Miner with the power to mine Lambda Coins.", "Good luck Explorer!"];
    return (
      <div className="App">
        <h4>Lambda CS Build Week 2</h4>
        <GameScreen messages={printWords}/>
        <ButtonBar/>
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.move}>move</button>
      </div>
    );
  }
}

export default App;
