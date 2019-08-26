import React from "react";
import "./App.css";
import { axiosWithAuth, makeMap } from "./utils";

class App extends React.Component {
  initGame = async () => {
    const { data: startingRoom } = await axiosWithAuth().get("init/");
    console.log(startingRoom);
    makeMap(startingRoom);
  };
  move = async () => {
    const { data: currentRoom } = await axiosWithAuth().post("move/", {
      direction: "s"
    });
    console.log(currentRoom);
  };
  buildMap = async () => {
    makeMap();
  };

  render() {
    return (
      <div className="App">
        <h4>Lambda CS Build Week 2</h4>
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.move}>move</button>
      </div>
    );
  }
}

export default App;
