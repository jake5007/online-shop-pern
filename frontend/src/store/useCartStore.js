import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/api/carts");
      const { cart, totalQuantity, totalPrice } = res.data;
      set({
        items: cart,
        totalQuantity,
        totalPrice,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
      set({
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        error: "Something went wrong",
      });
      toast.error("Something went wrong while fetching the cart");
    } finally {
      set({ loading: false });
    }
  },
  resetCart: () => {
    set({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      loading: false,
      error: null,
    });
  },
  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/api/carts/items", {
        productId,
        quantity,
      });
      await useCartStore.getState().fetchCart();
      toast.success("Item added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
      set({ error: "Something went wrong" });
      toast.error("Something went wrong while adding to cart");
    } finally {
      set({ loading: false });
    }
  },
  updateItem: async (itemId, quantity) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.put(`/api/carts/items/${itemId}`, { quantity });
      await useCartStore.getState().fetchCart();
      toast.success("Cart item updated successfully");
    } catch (err) {
      console.error("Error updating cart item:", err);
      set({ error: "Something went wrong" });
      toast.error("Something went wrong while updating the cart item");
    } finally {
      set({ loading: false });
    }
  },
  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/carts/items/${itemId}`);
      await useCartStore.getState().fetchCart();
      toast.success("Cart item removed successfully");
    } catch (err) {
      console.error("Error removing cart item:", err);
      set({ error: "Something went wrong" });
      toast.error("Something went wrong while removing the cart item");
    } finally {
      set({ loading: false });
    }
  },
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete("/api/carts");
      set({
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
      await useCartStore.getState().fetchCart();
      toast.success("Cart cleared successfully");
    } catch (err) {
      console.error("Error clearing cart:", err);
      set({ error: "Something went wrong" });
      toast.error("Something went wrong while clearing the cart");
    } finally {
      set({ loading: false });
    }
  },
}));
