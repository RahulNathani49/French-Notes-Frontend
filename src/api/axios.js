import axios from "axios";

const api = axios.create({
    baseURL: "https://french-notes-backend.onrender.com/api", // <-- make sure this matches your backend
    withCredentials: true
});

export default api;
