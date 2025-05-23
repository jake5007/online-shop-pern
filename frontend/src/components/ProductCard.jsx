import { forwardRef } from "react";
import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { Rating } from ".";

const ProductCard = forwardRef(({ product, isAdmin }, ref) => {
  const { deleteProduct } = useProductStore();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
    }
  };

  return (
    <div
      ref={ref}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        {/* Product Info */}
        <Link
          to={`/product/${product.id}`}
          className="card-title text-lg font-semibold cursor-pointer hover:underline"
        >
          {product.name}
        </Link>
        {/* Product Rating */}
        <Rating value={product.rating} numReviews={product.num_reviews} />
        <p className="text-2xl font-bold text-primary">
          ${Number(product.price).toFixed(2)}
        </p>
        {/* CARD ACTIONS */}
        {isAdmin && (
          <div className="card-actions justify-end items-center mt-4">
            <Link
              to={`/product/${product.id}/edit`}
              className="btn btn-sm btn-info btn-outline"
            >
              <EditIcon className="size-4" />
            </Link>

            <button
              className="btn btn-sm btn-error btn-outline"
              onClick={handleDelete}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
export default ProductCard;
