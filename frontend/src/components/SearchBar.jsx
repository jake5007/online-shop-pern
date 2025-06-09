import { SearchIcon, XIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useUIStore } from "../store/useUIStore";
import { debounce } from "lodash";

const SearchBar = () => {
  const { setFilters, filters, fetchProducts } = useProductStore();
  const { showSearch, toggleSearch } = useUIStore();

  const clearKeyword = () => {
    setFilters({ keyword: "" });
    fetchProducts();
  };

  const debouncedFetch = debounce(() => {
    fetchProducts();
  }, 300);

  const handleChange = (e) => {
    setFilters({ keyword: e.target.value });
    debouncedFetch();
  };

  return (
    <div className="relative">
      <button className="btn btn-ghost btn-circle" onClick={toggleSearch}>
        <SearchIcon className="size-5" />
      </button>

      {showSearch && (
        <div className="absolute right-0 top-12 z-50 w-64">
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search products..."
              className="input input-bordered w-full pr-10"
            />
            {filters.keyword && (
              <button
                onClick={clearKeyword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-error"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchBar;
