import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOrderStore } from "../store/useOrderStore";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchOrder, currentOrder, loading, error } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="loading loading-dots loading-xl" />
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="text-center py-20">
        <p className="text-error">{error || "Failed to load order."}</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const { total_price, shipping_address, order_items } = currentOrder;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-success">
        🥳 Order Placed Successfully!
      </h2>

      <div className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
        <p>{shipping_address.recipient}</p>
        <p>{shipping_address.address1}</p>
        <p>{shipping_address.address2}</p>
        <p>{shipping_address.zipcode}</p>
      </div>

      <div className="bg-base-100 p-4 rounded-xl shadow space-y-2">
        <h3 className="font-semibold text-lg mb-2">Order Items</h3>
        {order_items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm opacity-60">Qty: {item.quantity}</p>
            </div>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="text-right text-lg font-bold">
        Total: ${Number(total_price).toFixed(2)}
      </div>

      <button
        className="btn btn-primary w-full sm:w-auto"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};
export default OrderSuccessPage;
