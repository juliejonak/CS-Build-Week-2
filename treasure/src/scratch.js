const { performance } = require('perf_hooks');
const {sha256} = require('js-sha256');
const {axios} = require('axios')

const BCaxiosWithAuth = () => {
    return axios.create({
      baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/bc/",
      headers: {
        Authorization: `Token ${process.env.REACT_APP_API_KEY}`,
        "Content-Type": "application/json"
      }
    })
  }

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
    guess_hash = sha256(proof.toString()).substring(0, difficulty)
    // returns boolean value of if it matches expected output
    return guess_hash === answer
  }
  
  
  const mineCoins = async (proof, difficulty) => {
    // Fetches last proof object from server
    // const { data: last_proof } = await axiosWithAuth().get("last_proof/");
  
    // Finds a new valid proof
    new_proof = await proof_of_work(proof, difficulty)
    console.log("New_proof returned", new_proof)
  
    // Sends new proof to server
  
    // Time out for 30 seconds
    console.log("Waiting for cooldown to pass")
    setTimeout(()=>{
        mineCoins(123456, difficulty)
    }, 30000)
    // Do it again
    
  }
  
  mineCoins(123456, 5)

  // difficulty 4: .5 sec
  // difficulty 5: 1-5 sec
  // difficulty 6: 52 sec