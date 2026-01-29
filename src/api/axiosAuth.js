import axios from 'axios';
import axiosPublic from '../api/axiosPublic.js'

const axiosAuth = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    withCredentials: true
})

axiosAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
axiosAuth.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axiosPublic.post("/auth/refresh-token", {}, { withCredentials: true });

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("token", newAccessToken);
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;
                return axiosAuth(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
    }
)

export default axiosAuth;