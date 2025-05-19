import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { Trash2Icon } from "lucide-react";

const CartPage = () => {
  const user = useAuthStore((state) => state.user);
  const {
    items,
    totalQuantity,
    totalPrice,
    fetchCart,
    updateItem,
    removeItem,
    clearCart,
    loading,
    error,
  } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      fetchCart();
    }
  }, [user, fetchCart, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <img
          src="/images/empty_cart.svg"
          alt="Empty Cart"
          className="w-40 mx-auto"
        />
        <h2 className="text-3xl font-bold">Your cart is empty</h2>
        <p className="text-base-content opacity-70">
          Start adding products to checkout
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-base-100 shadow-md rounded-xl p-4 flex gap-4 items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm opacity-70 mb-2">
                ${Number(item.price).toFixed(2)}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="input input-sm input-bordered w-20"
                  onChange={(e) =>
                    updateItem(item.id, parseInt(e.target.value) || 1)
                  }
                />
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-base-200 rounded-xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-lg font-medium">
            Total ({totalQuantity} items):{" "}
            <span className="text-primary font-bold">
              ${Number(totalPrice).toFixed(2)}
            </span>
          </div>
          <button
            className="btn btn-primary btn-lg w-full sm:w-auto"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>

        <div className="text-left">
          <button
            className="btn btn-outline btn-error btn-sm w-full sm:w-auto"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to remove all items from your cart?"
                )
              )
                clearCart();
            }}
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
