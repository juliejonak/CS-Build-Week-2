import axios from "axios";
import { BCaxiosWithAuth } from "./utils";
import sha256 from 'sha256';

// Get last valid proof
// res.difficulty = Number of leading 0's required at the beginning of the hash

// Once proof is found, submit to mine

// {
//     "proof": 123456,
//     "difficulty": 8,
//     "cooldown": 1.0,
//     "messages": [],
//     "errors": []
// }

// If res is not successful, use 30 second timeout before sending new proof
const sendProof = async proof => {
  return await BCaxiosWithAuth().post("mine/", { proof });
};

const getLastProof = async () => {
  const { data: last_proof } = await BCaxiosWithAuth().get("last_proof/");
  return last_proof
};

const proof_of_work = (last_proof, difficulty) => {
  // Starts a timer
  const start = performance.now()
  console.log("Searching for next proof")

  // Randomize proof to be between -inf to 0, and 0 to inf if split between team members

  // Currently searches (-(2^53 - 1)) and (2^53 - 1). Could make smaller amounts for splitting between team members (averages 14-16 digit numbers)
  proof = (Math.random() * Number.MAX_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER

  // Sets what the valid proof leading characters needs to be
  valid = '0'.repeat(difficulty)
  console.log("Difficulty is ", difficulty, " so valid is ", valid)

  // While guess proof is not equal to valid proof, keep incrementing proof
  while (valid_proof(proof, valid, difficulty) == false) {
    proof += (Math.random() * 1000) + 10
  }

  // Ends timer
  const end = performance.now()
  const duration = end - start
  console.log("Proof found: ", proof, " in ", duration)
  return proof
  
}

const valid_proof = (proof, answer, difficulty) => {
  // guess_hash = first difficulty characters of the proof hashed
  guess_hash = sha256(proof).substring(0, difficulty)
  // returns boolean value of if it matches expected output
  return guess_hash === answer
}



export const mineCoins = async () => {
  // Fetches last proof object from server
  const { data: last_proof } = await axiosWithAuth().get("last_proof/");

  // Finds a new valid proof
  new_proof = await proof_of_work(last_proof.proof, last_proof.difficulty)
  console.log("New_proof returned", new_proof)

  // Sends new proof to server

  // Time out for 30 seconds
  // Do it again
  
}

