import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Rating } from "../components";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentProduct, fetchProduct, loading, error } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const { addToCart, loading: cartLoading } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return navigate("/login");
    }
    if (currentProduct.count_in_stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addToCart(currentProduct.id, 1);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

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

  if (!currentProduct) return null;

  const { name, image, description, price, category_name, count_in_stock } =
    currentProduct;
  const inStock = count_in_stock > 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <button className="btn btn-ghost mb-8" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="size-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="rounded-xl overflow-hidden shadow-lg bg-base-100">
          {image && (
            <img src={image} alt={name} className="size-full object-cover" />
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body space-y-5 text-base-content">
            <h2 className="card-title text-3xl font-bold">{name}</h2>

            <div className="badge badge-outline badge-lg capitalize py-4 px-5">
              Category: {category_name || "N/A"}
            </div>

            <div className="text-sm opacity-80">
              <strong className="mr-2">Status:</strong>{" "}
              <span className={`${inStock ? "text-success" : "text-error"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-base leading-relaxed">{description}</p>
            <Rating
              value={currentProduct.rating}
              numReviews={currentProduct.num_reviews}
            />
            <p className="text-2xl font-bold text-primary">${price}</p>

            {/* 미래 확장용 버튼 or 리뷰 영역 */}
            {/* <div><ReviewSection productId={id} /></div> */}

            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                disabled={
                  !user || cartLoading || currentProduct.count_in_stock === 0
                }
                className="btn btn-primary w-full"
              >
                {cartLoading ? (
                  <span className="loading loading-dots loading-sm" />
                ) : currentProduct.count_in_stock === 0 ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>

              {!user && (
                <p className="text-sm text-warning mt-2">
                  Please login to use the cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
