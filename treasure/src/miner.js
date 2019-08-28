// import { BCaxiosWithAuth } from "./utils";
const utf8 = require("utf8");
const axios = require("axios");
const sha256 = require("js-sha256");
const BCaxiosWithAuth = () => {
  return axios.create({
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/bc/",
    headers: {
      Authorization: `Token 4803e413f603a45d599b1b30b573ad193a72249b`,
      "Content-Type": "application/json"
    }
  });
};
const sendProof = async proof => {
  try {
    console.log("it worked!!!!!");
    return await BCaxiosWithAuth().post("mine/", { proof });
  } catch (err) {
    console.log("err", err);
  }
};
const getLastProof = async () => {
  const { data: last_proof } = await BCaxiosWithAuth().get("last_proof/");
  return last_proof;
};

const proof_of_work = (last_proof, difficulty) => {
  // Starts a timer
  // const start = performance.now();
  console.log("Searching for next proof");

  // Randomize proof to be between -inf to 0, and 0 to inf if split between team members

  // Currently searches (-(2^53 - 1)) and (2^53 - 1). Could make smaller amounts for splitting between team members (averages 14-16 digit numbers)
  let proof = -1000000000;

  // Sets what the valid proof leading characters needs to be
  const valid = "0".repeat(difficulty);
  console.log("Difficulty is ", difficulty, " so valid is ", valid);

  // While guess proof is not equal to valid proof, keep incrementing proof
  while (valid_proof(proof, valid, difficulty, last_proof) == false) {
    proof += 1;
    if (proof % 1000000 === 0) {
      console.log(proof);
    }
  }

  // Ends timer
  // const end = performance.now();
  // const duration = end - start;
  console.log("Proof found: ", proof, " in ");
  return proof;
};

const valid_proof = (proof, answer, difficulty, last_proof) => {
  // guess_hash = first difficulty characters of the proof hashed
  // sha256(utf8(lastproof+proof))
  let guessStr = `${last_proof}${proof}`;
  let guess = utf8.encode(guessStr);
  let guess_hash = sha256
    .create()
    .update(guess)
    .hex()
    .slice(0, difficulty);

  // returns boolean value of if it matches expected output
  return guess_hash === answer;
};

const mineCoins = async () => {
  console.log("Start of mineCoins");
  //Fetches last proof object from server
  const { data: last_proof } = await BCaxiosWithAuth().get("last_proof/");
  console.log(
    "Last proof: ",
    last_proof.proof,
    "Difficulty: ",
    last_proof.difficulty
  );

  // Finds a new valid proof
  const proof = await proof_of_work(last_proof.proof, last_proof.difficulty);
  console.log("New_proof returned", proof);

  // Sends new proof to server
  const proof_response = sendProof(proof);
  // If successful, we'll get a coin (keep count?)
  // If not, 30 sec cooldown

  return proof_response.data;
  // Time out for 30 seconds & do it again
  // console.log("Waiting for cooldown to pass")
  // setTimeout(()=>{
  //     mineCoins(123456, last_proof.difficulty)
  // }, 30000)

  // Currently doesn't stop mining -- endless loop
};
mineCoins();
