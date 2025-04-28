import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  // offset, totalCount, and hasMore state
  offset: 0,
  totalCount: 0,
  hasMore: true,
  limit: 6,

  //filter
  filters: {
    category_id: "",
    minPrice: "",
    maxPrice: "",
  },

  showScrollTop: false,

  setOffset: (offset) => set({ offset }),
  setTotalCount: (totalCount) => set({ totalCount }),
  setHasMore: (hasMore) => set({ hasMore }),
  setShowScrollTop: (showScrollTop) => set({ showScrollTop }),
  setFilters: (filters) =>
    set({
      filters: { ...get().filters, ...filters },
      offset: 0,
      products: [],
      hasMore: true,
    }),

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (err) {
      console.log("Error adding product: ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      set({ categories: res.data.data, error: null });
    } catch (err) {
      console.log("Error fetching categories: ", err);
      set({ categories: [], error: "Something went wrong" });
    }
  },
  fetchProducts: async () => {
    set({ loading: true });
    const { limit, offset, products, filters } = get();
    const { category_id, minPrice, maxPrice } = filters;

    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        params: {
          limit,
          offset,
          category_id,
          minPrice,
          maxPrice,
        },
      });
      const { data: newProducts, totalCount } = res.data;
      set({
        products: [...products, ...newProducts],
        offset: offset + limit,
        hasMore: newProducts.length < limit ? false : true,
        totalCount,
        error: null,
      });
    } catch (err) {
      if (err.status == 429)
        set({
          products: [],
          error: "Too many requests. Please try again later.",
        });
      else
        set({
          products: [],
          error: "An error occurred while fetching products.",
        });
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
        error: null,
      }));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.log("Error deleting product: ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: res.data.data,
        formData: res.data.data,
        error: null,
      });
    } catch (err) {
      console.log("Error fetching product: ", err);
      set({ currentProduct: null, error: "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const res = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      set({ currentProduct: res.data.data });
      toast.success("Product updated successfully");
    } catch (err) {
      console.log("Error updating product: ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
