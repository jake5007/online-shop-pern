import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import getAndStoreCsrfToken from "../utils/csrf";

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
    category_id: "",
    count_in_stock: 0,
    description: "",
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
    keyword: "",
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
  resetForm: () =>
    set({
      formData: {
        name: "",
        price: "",
        image: "",
        category_id: "",
        count_in_stock: 0,
        description: "",
      },
    }),
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();

      await getAndStoreCsrfToken();

      await axiosInstance.post("/api/products", formData);

      set({ offset: 0, products: [], hasMore: true });
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
    const { category_id, minPrice, maxPrice, keyword } = filters;

    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        params: {
          limit,
          offset,
          category_id,
          minPrice,
          maxPrice,
          keyword,
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
      await getAndStoreCsrfToken();

      await axiosInstance.delete(`/api/products/${id}`);
      // set((prev) => ({
      //   products: prev.products.filter((product) => product.id !== id),
      //   error: null,
      // }));
      set({ offset: 0, products: [], hasMore: true });
      await get().fetchProducts();
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

      await getAndStoreCsrfToken();

      const res = await axiosInstance.put(`/api/products/${id}`, formData);
      set({
        currentProduct: res.data.data,
        offset: 0,
        products: [],
        hasMore: true,
      });
      await get().fetchProducts();
      toast.success("Product updated successfully");
    } catch (err) {
      console.log("Error updating product: ", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // after adding review, to update it partially
  updateProductInList: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    })),
  // add: reviews
  createReview: async (id, { rating, comment }) => {
    try {
      await getAndStoreCsrfToken();

      await axiosInstance.post(`/api/products/${id}/reviews`, {
        rating,
        comment,
      });

      await get().fetchProduct(id);
      const updated = get().currentProduct;
      get().updateProductInList(updated);
      toast.success("Review submitted successfully");
    } catch (err) {
      console.log("Error submitting review: ", err);
      toast.error("Failed to submit review");
    }
  },
  deleteReview: async (productId) => {
    try {
      await getAndStoreCsrfToken();

      await axiosInstance.delete(`/api/products/${productId}/reviews`);
      await get().fetchProduct(productId);
      toast.success("Review deleted successfully");
    } catch (err) {
      console.log("Error deleting review: ", err);
      toast.error("Failed to delete review");
    }
  },
}));
