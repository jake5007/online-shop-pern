import { useEffect, useRef } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  ChevronsUpIcon,
  PackageIcon,
  PlusCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { ProductCard, AddProductModal, Filter, SearchBar } from "../components";

const HomePage = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    totalCount,
    hasMore,
    showScrollTop,
    setShowScrollTop,
  } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const observer = useRef();

  const lastProductElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts();
      }
    });

    if (node) observer.current.observe(node);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchProducts();

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchProducts, setShowScrollTop]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        {user?.is_admin && (
          <button
            className="btn btn-primary rounded-full"
            onClick={() =>
              document.getElementById("add_product_modal").showModal()
            }
          >
            <PlusCircleIcon className="size-5 mr-2" />
            Add Product
          </button>
        )}

        <div className="flex items-center space-x-4 ml-auto">
          <SearchBar />
          <Filter />
          <button className="btn btn-ghost btn-circle" onClick={fetchProducts}>
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
      </div>

      <AddProductModal />

      {error && <div className="alert alert-error mb-8"> {error}</div>}

      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No Products Found</h3>
            {user?.is_admin && (
              <p className="text-gray-500 max-w-sm">
                Get started by adding your first product. Click the button above
                to add a new product to your store.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-dots loading-lg" />
        </div>
      )}

      {
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const isLast = idx === products.length - 1;
            return (
              <ProductCard
                key={product.id}
                ref={isLast ? lastProductElementRef : null}
                product={product}
                isAdmin={user?.is_admin}
              />
            );
          })}
        </div>
      }

      {/* Current count of products */}
      {!loading && (
        <div className="text-center text-gray-500 mt-4">
          {products.length} / {totalCount} items loaded
        </div>
      )}
      {/* No more products message */}
      {!loading && !hasMore && (
        <div className="text-center font-semibold mt-6">
          🎉 No more products to load!
        </div>
      )}

      {/* To the top btn */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-circle btn-primary fixed bottom-8 right-8 shadow-xl opacity-60 hover:opacity-100 transition-opacity duration-300"
        >
          <ChevronsUpIcon className="size-8" />
        </button>
      )}
    </main>
  );
};
export default HomePage;
