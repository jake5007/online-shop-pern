import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";
import dayjs from "dayjs";

const MyOrdersPage = () => {
  const { orders, fetchOrders, loading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-xl font-bold">You haven't placed any orders yet.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-base-100 rounded-xl shadow hover:bg-base-200 transition cursor-pointer"
            onClick={() => navigate(`/my-orders/${order.id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm opacity-70">
                  {dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  ${Number(order.total_price).toFixed(2)}
                </p>
                <p className="text-sm badge badge-outline mt-1">
                  {order.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full sm:w-auto mt-8"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};
export default MyOrdersPage;
