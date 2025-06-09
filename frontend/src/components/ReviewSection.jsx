import { useState } from "react";
import { StarIcon, Trash2Icon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import dayjs from "dayjs";

const ReviewSection = ({ productId, user }) => {
  const { currentProduct, createReview, deleteReview, fetchProducts } =
    useProductStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const hasUserReviewed = currentProduct.reviews?.some(
    (r) => r.user_id === user?.id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReview(productId, { rating, comment });
    setRating(5);
    setComment("");
    fetchProducts();
  };

  return (
    <div className="mt-16 space-y-8">
      <h3 className="text-xl font-bold">Customer Reviews</h3>

      {/* CREATE */}
      {user && !hasUserReviewed && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-xl p-4 space-y-3"
        >
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Rating</span>
            </div>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="select select-bordered"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} -{" "}
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][val]}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Comment</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="textarea textarea-bordered"
              rows={3}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary w-full md:w-auto">
            Submit
          </button>
        </form>
      )}

      {/* LIST */}
      {currentProduct.reviews?.length > 0 ? (
        <div className="space-y-4">
          {currentProduct.reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-base-100 shadow flex flex-col gap-1 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.user_name}</span>
                <span className="text-xs text-base-content/60">
                  {dayjs(r.created_at).format("YYYY-MM-DD")}
                </span>
              </div>

              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                {[...Array(r.rating)].map((_, i) => (
                  <StarIcon key={i} className="size-4 fill-yellow-400" />
                ))}
              </div>

              <p className="text-sm">{r.comment}</p>

              {user?.id === r.user_id && (
                <button
                  className="absolute top-2 right-2 text-error hover:text-error/80"
                  onClick={() => deleteReview(productId, r.id)}
                >
                  <Trash2Icon className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-70">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewSection;
