import axios from "axios";


//api is an AxiosInstance over here (reused)

const api = axios.create({
    baseURL: "http://localhost:8081",
    withCredentials: true
})

export default api