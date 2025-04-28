import { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { FilterIcon } from "lucide-react";

function Filter() {
  const { setFilters, fetchProducts, fetchCategories, categories } =
    useProductStore();
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const applyFilters = () => {
    setFilters({ category_id: category, minPrice, maxPrice });
    fetchProducts();
    setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      {/* Filter Button */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FilterIcon className="size-5" />
      </button>

      {/* Filter Option */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center sm:static sm:bg-transparent sm:inset-auto sm:z-auto"
        >
          <div
            className="bg-base-200 bg-opacity-90 backdrop-blur 
              p-6 rounded-lg shadow-lg w-11/12 max-w-lg 
              sm:absolute sm:top-16 sm:right-0 sm:w-[28rem] sm:max-w-none
              transform transition-all duration-300 scale-95 opacity-0
              animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              {/* Select Category */}
              <div>
                <label className="label">Category</label>
                <select
                  className="select select-bordered w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Input */}
              <div>
                <label className="label">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    value={minPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                        setMinPrice(value);
                      }
                    }}
                    placeholder="Min"
                  />
                  <span className="text-lg">~</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    value={maxPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                        setMaxPrice(value);
                      }
                    }}
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Filter Apply*/}
              <button className="btn btn-primary mt-4" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Filter;
