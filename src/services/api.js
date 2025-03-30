import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Cambia con l'URL del backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercettore per inserire il token di autenticazione (Firebase)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Recupera il token dal localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
