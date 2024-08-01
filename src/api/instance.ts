import axios from "axios";
// const baseURL = process.env.BaseURL;
const baseURL = "https://base-meta.onrender.com/";

// const accessToken = process.env.AccessToken;
let credentials = btoa(`abc_client:abc123`);
export const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {},
});
instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
