import axios from "axios";

//api is an AxiosInstance over here (reused)

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

// Add auth header dynamically
// This adds the Authorization header automatically to every request that needs it, but only if a token exists.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api