import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData, createOrder, loading, error } =
    useOrderStore();

  const handleShippingChange = (e) => {
    setFormData({
      ...formData,
      shipping: {
        ...formData.shipping,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderId = await createOrder();
    if (orderId) {
      navigate(`/order/${orderId}`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="recipient"
          placeholder="Recipient"
          className="input input-bordered w-full"
          value={formData.shipping.recipient}
          onChange={handleShippingChange}
          required
        />
        <input
          name="zipcode"
          placeholder="Zip Code"
          className="input input-bordered w-full"
          value={formData.shipping.zipcode}
          onChange={handleShippingChange}
          required
        />
        <input
          name="address1"
          placeholder="Address 1"
          className="input input-bordered w-full"
          value={formData.shipping.address1}
          onChange={handleShippingChange}
          required
        />
        <input
          name="address2"
          placeholder="Address 2"
          className="input input-bordered w-full"
          value={formData.shipping.address2}
          onChange={handleShippingChange}
        />

        <select
          className="select select-bordered w-full"
          value={formData.paymentMethod}
          onChange={handlePaymentChange}
          required
        >
          <option value="card">Card</option>
          <option value="paypal">PayPal</option>
          <option value="kakaopay">KakaoPay</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};
export default CheckoutPage;
