import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useCartStore } from "./useCartStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  formData: {
    shipping: {
      recipient: "",
      zipcode: "",
      address1: "",
      address2: "",
    },
    paymentMethod: "card",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () =>
    set({
      formData: {
        shipping: {
          recipient: "",
          zipcode: "",
          address1: "",
          address2: "",
        },
        paymentMethod: "card",
      },
    }),

  createOrder: async () => {
    set({ loading: true, error: null });
    try {
      const { formData } = get();
      const { shipping, paymentMethod } = formData;

      const { data: csrf } = await axiosInstance.get("/api/csrf-token");
      localStorage.setItem("csrfToken", csrf.csrfToken);

      const { data } = await axiosInstance.post("/api/orders", {
        shippingAddress: shipping,
        paymentMethod,
      });

      get().resetForm();
      toast.success("Order placed successfully");
      await useCartStore.getState().fetchCart();

      return data.orderId;
    } catch (err) {
      console.error("Error creating order: ", err);
      toast.error("Failed to place an order");
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/api/csrf-token");
      localStorage.setItem("csrfToken", data.csrfToken);

      const res = await axiosInstance.get("/api/orders");
      set({ orders: res.data.data, error: null });
    } catch (err) {
      console.error("Error fetching orders: ", err);
      set({ orders: [], error: "Failed to fetch orders" });
      toast.error("Something went wrong. Failed to fetch orders.");
    } finally {
      set({ loading: false });
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/api/csrf-token");
      localStorage.setItem("csrfToken", data.csrfToken);

      const res = await axiosInstance.get(`/api/orders/${id}`);
      set({ currentOrder: res.data.data, error: null });
    } catch (err) {
      console.error("Error fetching order: ", err);
      set({ currentOrder: null, error: "Failed to fetch an order" });
      toast.error("Something went wrong. Failed to fetch an order.");
    } finally {
      set({ loading: false });
    }
  },
}));
