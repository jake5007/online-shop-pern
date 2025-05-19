import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components";
import {
  HomePage,
  ProductPage,
  ProductEditPage,
  LoginPage,
  RegisterPage,
  CartPage,
  CheckoutPage,
  OrderDetailPage,
  OrderSuccessPage,
  MyOrdersPage,
} from "./pages";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useThemeStore();
  const { user, fetchUser } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme={theme}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/:id/edit" element={<ProductEditPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderSuccessPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/my-orders/:id" element={<OrderDetailPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
