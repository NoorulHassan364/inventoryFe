import axios from "axios";

const api = axios.create({
  baseURL: "http://3.80.212.98:5000/api/v1",
  // baseURL: "http://127.0.0.1:5000/api/v1",
  // baseURL: "https://inventorysysbe.herokuapp.com/api/v1",
});

export default api;
