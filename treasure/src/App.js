import React from "react";
import "./App.css";
import { axiosWithAuth, makeMap } from "./utils";
import ButtonBar from "./components/button_bar/index";

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
    if (Object.keys(currentMap) === 25) {
      return;
    }
    setTimeout(() => {
      this.move(direction).then(({ data: nextRoom }) => {
        this.updateMap(currentRoom, nextRoom, direction);
        currentRoom = nextRoom;
        this.setState({ currentRoom, startingRoom: nextRoom });
      });
      return this.explore();
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
    return (
      <div className="App">
        <h4>Lambda CS Build Week 2</h4>
        <ButtonBar />
        <button onClick={this.explore}>explore</button>
      </div>
    );
  }
}

export default App;
