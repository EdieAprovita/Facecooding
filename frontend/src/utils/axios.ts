import axios from "axios";

// Crear una instancia de axios en lugar de modificar la global
const axiosInstance = axios.create({
  baseURL: "/api",
});

// Interceptor para agregar automáticamente el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
