import axios from "axios";

class Queue {
  constructor() {
    this.queue = [];
  }
  enqueue(value) {
    this.queue.push(value);
  }
  dequeue() {
    if (this.queue.length) {
      this.queue.shift();
    }
    return this.queue;
  }
}

export function axiosWithAuth() {
  console.log(process.env.REACT_APP_API_KEY)
  return axios.create({
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/adv/",
    headers: {
      Authorization: `Token ${process.env.REACT_APP_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
}

export function makeMap(startingRoom, world = null) {
  let currentRoomId = startingRoom["room_id"];
  let map = JSON.parse(world);
  let unExplored = [currentRoomId];
  let prevRoomId = 0;
  // while (Object.keys(map).length < 5) {
  let direction = "";
  for (let key in map[currentRoomId]) {
    if (map[currentRoomId][key] === "?") {
      direction = key;
      break;
    }
  }
  // if (Object.keys(map).length === 5) {
  // break;
  // }
  if (direction) {
    console.log(direction);
    // axiosWithAuth()
    //   .post("move/", { direction })
    //   .then(({ data: { room_id, exits, title } }) => {
    //     map[currentRoomId][direction] = room_id;
    //     prevRoomId = currentRoomId;
    //     currentRoomId = room_id;

    //     if (!map[currentRoomId]) {
    //       map[currentRoomId] = {
    //         n: null,
    //         s: null,
    //         w: null,
    //         e: null,
    //         title
    //       };
    //       for (let exit of exits) {
    //         map[currentRoomId][exit] = "?";
    //       }
    //     }
    //     console.log(prevRoomId, direction);
    //     switch (direction) {
    //       case "n":
    //         map[currentRoomId]["s"] = prevRoomId;
    //         break;
    //       case "s":
    //         map[currentRoomId]["n"] = prevRoomId;
    //         break;
    //       case "e":
    //         map[currentRoomId]["w"] = prevRoomId;
    //         break;
    //       case "w":
    //         map[currentRoomId]["e"] = prevRoomId;
    //         break;
    //     }
    //   });
  }
  // }
  console.log(map);
  return map;
}
