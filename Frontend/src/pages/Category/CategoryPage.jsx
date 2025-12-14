import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory, getCategories } from "../../api/Products";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import CategoryFilter from "../../components/CategoryFilter";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isValidCategory, setIsValidCategory] = useState(true);
  const [filters, setFilters] = useState({ minPrice: null, maxPrice: null });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // First, verify the category exists
        const response = await getCategories();
        const categories = response.data;
        const decodedCategoryName = decodeURIComponent(categoryName || "");
        const categoryExists = categories.some(
          (cat) => cat.toLowerCase() === decodedCategoryName.toLowerCase()
        );

        if (!categoryExists) {
          if (isMounted) {
            setIsValidCategory(false);
            setLoading(false);
          }
          return;
        }

        // Fetch products for the category
        const res = await getProductsByCategory(decodedCategoryName);
        const categoryProducts = res.data;

        if (isMounted) {
          setProducts(categoryProducts);
          setIsValidCategory(true);
          // reset filters when category changes
          setFilters({ minPrice: null, maxPrice: null });
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message || "Failed to load products");
          setIsValidCategory(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return "";
    return decodeURIComponent(name)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Apply price filters to products
  const displayedProducts = products.filter((p) => {
    const price = Number(p.price) || 0;
    const withinMin =
      filters.minPrice == null ? true : price >= Number(filters.minPrice);
    const withinMax =
      filters.maxPrice == null ? true : price <= Number(filters.maxPrice);
    return withinMin && withinMax;
  });

  // Loading state
  if (loading) {
    return <Loading message="Loading products..." fullScreen />;
  }

  // Error or invalid category state
  if (error || !isValidCategory) {
    return (
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Category Not Found
            </h1>
            <p className="mb-6 text-gray-600">
              {error || `The category "${formatCategoryName(categoryName)}" does not exist.`}
            </p>
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Empty products state
  if (products.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 capitalize">
            {formatCategoryName(categoryName)}
          </h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        </div>
      </section>
    );
  }

  // Main content with products
  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium capitalize">
                {formatCategoryName(categoryName)}
              </span>
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 capitalize mb-1">
              {formatCategoryName(categoryName)}
            </h1>
            <p className="text-gray-600">
              {displayedProducts.length}{" "}
              {displayedProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-2 h-5 w-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.75 5.25h16.5m-13.5 6h10.5m-7.5 6h4.5" />
            </svg>
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="hidden lg:block">
              <CategoryFilter
                products={products}
                onApply={(vals) => setFilters(vals)}
              />
            </div>

            {/* Mobile drawer */}
            {showFilters && (
              <div className="lg:hidden">
                <div
                  className="fixed inset-0 z-40 bg-black/40"
                  onClick={() => setShowFilters(false)}
                />
                <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                      onClick={() => setShowFilters(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <CategoryFilter
                    products={products}
                    onApply={(vals) => {
                      setFilters(vals);
                      setShowFilters(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {displayedProducts.map((product) => (
                <Card
                  key={product._id}
                  productId={product._id}
                  imageSrc={product.image}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  reviewCount={product.count}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
