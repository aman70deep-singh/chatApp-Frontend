import axios from "axios";

const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    withCredentials: true
});

export default axiosPublic;
