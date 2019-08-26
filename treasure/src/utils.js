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
  let map = world;
  if (!world) {
    map = {
      0: { n: "?", s: "?", e: "?", w: "?", title: startingRoom["title"] }
    };
  }
  let unExplored = [];
  unExplored.push(currentRoomId);
  let lastRoom = 0;
  // while (Object.keys(map).length < 500) {
  let direction = "";
  for (let key in map[currentRoomId]) {
    if (map[currentRoomId][key] === "?") {
      direction = key;
      break;
    }
  }
  if (direction) {
    let move = { direction };
  }
  // }
}
