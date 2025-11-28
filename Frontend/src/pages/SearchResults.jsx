import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllProducts, getProductsByCategory } from "../api/Products";
import Card from "../components/Card";
import Loading from "../components/Loading";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || null;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAndSearch = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch products based on category
        let allProducts = [];
        if (category) {
          // Search within specific category
          const res = await getProductsByCategory(category)
          allProducts = res.data;
        } else {
          // Search all products
          const res= await getAllProducts();
          allProducts = res.data;
        }

        if (isMounted) {
          setProducts(allProducts);

          // Filter products by search query
          if (query.trim()) {
            const searchTerm = query.toLowerCase().trim();
            const filtered = allProducts.filter((product) => {
              const titleMatch = product.title?.toLowerCase().includes(searchTerm);
              const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
              const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
              return titleMatch || descriptionMatch || categoryMatch;
            });
            setFilteredProducts(filtered);
          } else {
            setFilteredProducts(allProducts);
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message || "Failed to load products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAndSearch();

    return () => {
      isMounted = false;
    };
  }, [query, category]);

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return <Loading message="Searching products..." fullScreen />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-rose-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="h-4 w-4"
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
              <span className="text-gray-900 font-medium">
                Search Results
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {category ? (
                <>
                  Searching for "<span className="font-semibold">{query}</span>" in{" "}
                  <span className="font-semibold text-purple-600">
                    {formatCategoryName(category)}
                  </span>
                </>
              ) : (
                <>
                  Searching for "<span className="font-semibold">{query}</span>" in all
                  products
                </>
              )}
            </p>
          )}
          {!query && category && (
            <p className="text-gray-600">
              Showing all products in{" "}
              <span className="font-semibold text-purple-600">
                {formatCategoryName(category)}
              </span>
            </p>
          )}
          {!query && !category && (
            <p className="text-gray-600">Showing all products</p>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-purple-600">{filteredProducts.length}</span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              {query
                ? `No products match your search "${query}". Try different keywords.`
                : "No products available."}
            </p>
            <Link
              to="/category"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                id={product._id}
                imageSrc={product.image}
                title={product.title}
                price={product.price}
                reviewCount={product.count}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;

