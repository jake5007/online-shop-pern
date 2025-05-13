import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";

const ProductEditPage = () => {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
    categories,
    fetchCategories,
  } = useProductStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
    fetchCategories();
  }, [fetchProduct, id, fetchCategories]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-dots loading-xl" />
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="btn btn-ghost mb-8" onClick={() => navigate("/")}>
        <ArrowLeftIcon className="size-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 self-center">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="size-full object-cover"
          />
        </div>

        {/* PRODUCT FORM */}
        <div className="card bg-base-100 shadow-lg md:max-h-[500px] md:overflow-y-auto">
          <div className="card-body space-y-6">
            <h2 className="card-title text-2xl">Edit Product</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(id);
              }}
              className="space-y-6"
            >
              {/* PRODUCT NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Product Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT PRICE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Price
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT IMAGE URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Image URL
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/* CATEGORY */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  <option disabled value="">
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* COUNT IN STOCK */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Count In Stock</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={formData.count_in_stock}
                  min="0"
                  step="1"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      count_in_stock: e.target.value,
                    })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  rows={4}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Product
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.price ||
                    !formData.image ||
                    !formData.category_id
                  }
                >
                  {loading ? (
                    <span className="loading loading-dots loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductEditPage;
