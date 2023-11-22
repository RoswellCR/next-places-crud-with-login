import axios from "axios";

const postApi = axios.create({
  baseURL: "https://visit-place-api.onrender.com/api",
});
export default postApi;
