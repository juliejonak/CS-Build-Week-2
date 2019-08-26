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
    const printWords = ["Welcome to the Lambda Treasure Hunt. \n", "Click a button to move through the maze. \n", "Find treasure you can sell at Pirate Ry's for gold. \n", "When you have 1000 gold, buy a pick-axe to mine Lambda Coins. \n", "Good luck Explorer! \n"];
    return (
      <div className="App">
        <ButtonBar/>
        <GameScreen messages={printWords}/>
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.move}>move</button>
      </div>
    );
  }
}

export default App;
