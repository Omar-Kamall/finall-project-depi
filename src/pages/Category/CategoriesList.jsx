import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getProductsByCategory } from "../../api/Products";
import Loading from "../../components/Loading";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all categories
        const categoriesData = await getCategories();

        // Fetch product counts for each category
        const counts = {};
        await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const products = await getProductsByCategory(category);
              counts[category] = products.length;
            } catch {
              counts[category] = 0;
            }
          })
        );

        if (isMounted) {
          setCategories(categoriesData);
          setCategoryCounts(counts);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message || "Failed to load categories");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Loading state
  if (loading) {
    return <Loading message="Loading categories..." fullScreen />;
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-rose-600">{error}</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
              <span className="text-gray-900 font-medium">Categories</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            All Categories
          </h1>
          <p className="text-gray-600">
            Browse our {categories.length} product categories
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-purple-300"
              >
                {/* Category Icon/Decoration */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 capitalize group-hover:text-purple-600 transition">
                  {formatCategoryName(category)}
                </h3>

                {/* Product Count */}
                <p className="text-sm text-gray-500">
                  {categoryCounts[category] || 0}{" "}
                  {categoryCounts[category] === 1 ? "product" : "products"}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition">
                  View Products
                  <svg
                    className="ml-2 h-4 w-4"
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesList;
