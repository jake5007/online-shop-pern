import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axiosInstance.get("/api/csrf-token");
      localStorage.setItem("csrfToken", data.csrfToken);

      const res = await axiosInstance.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const { user } = res.data;
      set({ user });
      toast.success("User registered successfully");
    } catch (err) {
      set({ error: err.response?.data?.message || "Register failed" });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axiosInstance.get("/api/csrf-token");
      localStorage.setItem("csrfToken", data.csrfToken);

      const res = await axiosInstance.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user } = res.data;
      set({ user });
      toast.success("User logged in successfully");
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed" });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post(`${BASE_URL}/api/auth/logout`);
      set({ user: null });
      localStorage.removeItem("csrfToken");
      toast.success("User logged out successfully");
    } catch (err) {
      console.error("Logout error: ", err);
      toast.error("Something went wrong");
    }
  },
  // for recovering user data after page refresh
  fetchUser: async () => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/api/auth/me`);
      set({ user: res.data.user });
    } catch (err) {
      console.error("Fetch user error: ", err);
      set({ user: null });
    }
  },
}));
