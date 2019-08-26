import axios from "axios";

function axiosWithAuth() {
  return axios.create({
    baseURL: "https://lambda-treasure-hunt.herokuapp.com/api/adv/",
    headers: {
      Authorization: `Token ${process.env.REACT_APP_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
}
export default axiosWithAuth;
