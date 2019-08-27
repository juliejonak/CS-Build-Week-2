import React from "react";
import "./App.css";
import { axiosWithAuth } from "./utils";
import ButtonBar from "./components/button_bar/index";
import GameScreen from "./components/gameScreen";

class App extends React.Component {
  state = {
    map: {},
    startingRoom: {},
    currentRoom: {},
    prevRoom: {}
  };
  componentDidMount() {
    this.initGame();
  }
  initGame = async () => {
    console.log(process.env.REACT_APP_API_KEY)
    const { data: startingRoom } = await axiosWithAuth().get("init/");
    this.setState(
      { startingRoom, currentRoom: startingRoom },
      this.getCurrentRoom
    );
  };

  explore = async () => {
    const {
      startingRoom: { cooldown }
    } = this.state;
    let currentMap = JSON.parse(localStorage.getItem("map"));
    let { currentRoom } = this.state;
    let rng = Math.floor(Math.random() * currentRoom.exits.length);
    let direction = currentRoom.exits[rng];
    if (Object.keys(currentMap).length === 500) {
      return;
    }
    setTimeout(() => {
      this.move(direction).then(({ data: nextRoom }) => {
        this.updateMap(currentRoom, nextRoom, direction);
        currentRoom = nextRoom;
        this.setState({ currentRoom, startingRoom: nextRoom });
        return this.explore();
      });
    }, cooldown * 1000);
  };
  updateMap = (prevRoom, currentRoom, direction) => {
    let currentMap = JSON.parse(localStorage.getItem("map"));
    let exitsObj = {};
    let exitsObj2 = {};
    let reverseDirection = {
      n: "s",
      e: "w",
      w: "e",
      s: "n"
    };
    prevRoom.exits.forEach(exit => {
      if (exit === direction) {
        exitsObj[exit] = currentRoom.room_id;
      } else {
        exitsObj[exit] = "?";
      }
    });
    currentRoom.exits.forEach(exit => {
      if (exit === reverseDirection[direction]) {
        exitsObj2[exit] = prevRoom.room_id;
      } else {
        exitsObj2[exit] = "?";
      }
    });
    currentMap[prevRoom.room_id] = {
      exits: exitsObj,
      items: prevRoom.items,
      title: prevRoom.title,
      messages: prevRoom.messages
    };
    currentMap[currentRoom.room_id] = {
      exits: exitsObj2,
      items: currentRoom.items,
      title: currentRoom.title,
      messages: currentRoom.messages
    };
    localStorage.setItem("map", JSON.stringify(currentMap));
  };
  move = async direction => {
    return await axiosWithAuth().post("move/", { direction });
  };
  getCurrentRoom = () => {
    const { title, exits, items, room_id, messages } = this.state.startingRoom;
    let exitsObj = {};
    exits.forEach(exit => {
      exitsObj[exit] = "?";
    });
    let map = {
      ...JSON.parse(localStorage.getItem("map")),
      [room_id]: {
        exits: exitsObj,
        title,
        items,
        messages
      }
    };
    this.setState({ map }, localStorage.setItem("map", JSON.stringify(map)));
  };

  render() {
    const printWords = [
      "Welcome to the Lambda Treasure Hunt. \n",
      "Click a button to move through the maze. \n",
      "Find treasure you can sell at Pirate Ry's for gold. \n",
      "When you have 1000 gold, buy a pick-axe to mine Lambda Coins. \n",
      "Good luck Explorer! \n"
    ];
    return (
      <div
        className="App"
        style={{
          backgroundColor: "#FDF5DE",
          height: "100vh",
          marginTop: "-3%"
        }}
      >
        <ButtonBar />
        {/* <GameScreen messages={printWords} /> */}
        <button onClick={this.initGame}>initial</button>
        <button onClick={this.explore}>explore</button>
      </div>
    );
  }
}

export default App;
