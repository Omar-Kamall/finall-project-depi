import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory, getCategories } from "../../api/Products";
import Card from "../../components/Card";
import Loading from "../../components/Loading";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isValidCategory, setIsValidCategory] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // First, verify the category exists
        const categories = await getCategories();
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
        const categoryProducts = await getProductsByCategory(decodedCategoryName);

        if (isMounted) {
          setProducts(categoryProducts);
          setIsValidCategory(true);
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 capitalize mb-2">
            {formatCategoryName(categoryName)}
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              imageSrc={product.image}
              title={product.title}
              price={product.price}
              rating={product.rating?.rate}
              reviewCount={product.rating?.count}
              inStock={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
