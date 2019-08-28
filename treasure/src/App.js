import React from "react";
import "./App.css";
import { axiosWithAuth } from "./utils";
import ButtonBar from "./components/button_bar/index";
import GameScreen from "./components/gameScreen";
import map from "./roomMap";
// import { mineCoins } from "./miner";

class App extends React.Component {
  state = {
    map: map,
    startingRoom: {},
    currentRoom: {},
    prevRoom: {},
    status: {
      gold: 0,
      name: "",
      cooldown: 0,
      encumbrance: 0, // How much are you carrying?
      strength: 0, // How much can you carry?
      speed: 0, // How fast do you travel?
      gold: 0,
      inventory: [],
      status: [],
      errors: [],
      messages: []
    }
  };
  componentDidMount() {
    this.initGame();
  }
  initStatus = async () => {
    console.log("test");
    const {
      data: { name, cooldown, encumbrance, strength, speed, gold, inventory }
    } = await this.getStatus();
    console.log(cooldown);
    this.setState({
      status: {
        ...this.state.status,
        name,
        cooldown,
        encumbrance,
        strength,
        speed,
        gold,
        inventory
      }
    });
  };
  initGame = async () => {
    const { data: startingRoom } = await this.initChar();
    this.setState({
      startingRoom,
      currentRoom: startingRoom,
      cooldown: startingRoom.cooldown
    });
  };
  pick = () => {
    console.log("Trying to pick up tiny treasure");
    return axiosWithAuth().post("take/", { name: "tiny treasure" });
  };
  getStatus = async () => {
    return await axiosWithAuth().post("status/");
  };
  initChar = async () => {
    return await axiosWithAuth().get("init/");
  };
  pickUp = items => {
    console.log(items);
    const {
      status: { cooldown }
    } = this.state;
    if (!items.length) {
      return;
    }
    const item = items.pop();
    console.log({ name: item });
    setTimeout(() => {
      return axiosWithAuth()
        .post("take/", { name: item }) // {name: "small treasure"}
        .then(status => {
          this.setState({
            status: { ...this.state.status, cooldown: status.data.cooldown }
          });
          console.log("picked up", item);
          return items;
        })
        .then(items => this.pickUp(items))
        .catch(err => console.log("err", err));
    }, cooldown * 1000);
  };

  sell = async item => {
    return axiosWithAuth().post("sell/", {
      name: "tiny treasure",
      confirm: "yes"
    });
  };

  changeName = async name => {
    return axiosWithAuth().post("change_name/", { name: `[${name}]` });
  };

  mine = async proof => {
    mineCoins();
    return axiosWithAuth().post("mine/", { proof: `[${proof}]` });
  };

  move = direction => {
    const {
      status: { cooldown, strength, encumbrance }
    } = this.state;
    if (!direction.length) {
      return;
    }
    const dir = direction.shift();
    setTimeout(() => {
      return axiosWithAuth()
        .post("move/", { direction: dir })
        .then(roomInfo => {
          console.log(roomInfo.data);
          if (roomInfo.data.items.length) {
            console.log("picking up");
            this.pickUp(roomInfo.data.items);
          }
          console.log("nothing here");
          this.setState({
            status: { ...this.state.status, cooldown: roomInfo.data.cooldown }
          });
        })
        .then(res => this.move(direction));
    }, cooldown * 1000);
  };
  goToShop = async () => {
    // find the shop
    const pathToShop = await this.bfs(250);
    // make sure we have enough items
    const {
      data: { strength, encumbrance }
    } = await this.getStatus();
    // When we can dash, should change to:
    // console.log(pathToShop)
    // To get the line of moves to dash with
    this.move(pathToShop);
    // if (strength === encumbrance) {
    //   this.move(pathToShop);
    // } else if (strength > encumbrance) {
    //   // pick a random room,
    //   const rng = Math.floor(Math.random() * 500);
    //   // get the path to that room
    //   const pathToRoom = await this.bfs(rng);
    //   console.log(pathToRoom, rng);
    //   // move there,
    //   this.move(pathToRoom)
    //     .then(res => console.log("finished moving"))
    //     .catch(err => console.log(err));
    //   // pick up items along the way
    // }
    console.log("really finished moving");
    // if we don't
    // pick up items
    // sell

    // const {
    //   encumbrance,
    //   strength,
    //   startingRoom: { cooldown }
    // } = this.state;
    // // as long as inventory is not full
    // const rng = Math.floor(Math.random() * 500) + 1;
    // while (encumbrance < strength) {
    //   // go to a random room
    //   const path = this.bfs(rng);
    //   console.log("path");
    //   // move
    //   for (let movement of path) {
    //     const { cooldown } = this.state;
    //     setTimeout(
    //       this.move(movement).then(room => {
    //         // pick up treasure along the way
    //         if (room.items.length) {
    //           this.pickUp();
    //         }
    //       }),
    //       cooldown * 1000
    //     );
    //   }
    // }

    // go back to shop
    // sell
    // return gold amount
  };
  findRy = () => {};

  bfs = async (roomId = null) => {
    const { startingRoom, map } = this.state;
    const found = false;
    // visited container
    const visited = new Set();
    // queue container (next to visit container)
    const unExplored = [{ room: startingRoom.room_id, path: [] }];
    // while queue isn't empty
    while (!found) {
      // dequeue first room
      const currentRoom = unExplored.shift();
      // if not visited
      for (let direction of Object.keys(map[currentRoom.room].exits)) {
        if (map[currentRoom.room].exits[direction] === roomId) {
          currentRoom.path.push(direction);

          return currentRoom.path;
        }
        if (!visited.has(map[currentRoom.room].exits[direction])) {
          visited.add(map[currentRoom.room].exits[direction]);
          const pathCopy = [...currentRoom.path];
          pathCopy.push(direction);
          unExplored.push({
            room: map[currentRoom.room].exits[direction],
            path: pathCopy
          });
        }
      }
    }
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
      }
    });
    currentRoom.exits.forEach(exit => {
      if (exit === reverseDirection[direction]) {
        exitsObj2[exit] = prevRoom.room_id;
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
        <button onClick={this.initStatus}>get status</button>
        <button onClick={this.goToShop}>go to shop</button>
        <button onClick={this.pick}>go to room</button>
        <button onClick={this.sell}>sell</button>
        {/* <button onClick={this.mine}>MINE</button> */}
      </div>
    );
  }
}

export default App;
