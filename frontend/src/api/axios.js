import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ IMPORTANT: allow browser to set multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default api;
