import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add a request interceptor to include the CSRF token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
