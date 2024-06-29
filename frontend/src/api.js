import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    //import environment variable 
    baseURL: process.env.REACT_APP_API_URL
  })


//interceptor that intercepts requests and directly adds the access token to the request being sent to the backend
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api
