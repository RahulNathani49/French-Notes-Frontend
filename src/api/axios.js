import axios from "axios";

const api = axios.create({
      baseURL: "https://french-notes-backend.onrender.com/api", // PRODUCTION
      //baseURL: "http://localhost:5000/api", // DEVELOPMENT

    withCredentials: true
});

export default api;
