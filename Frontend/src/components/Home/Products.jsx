import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProductsSortedByRating,
  getCategories,
  getProductsByCategory,
} from "../../api/Products";
import Card from "../Card";
import Loading from "../Loading";

const Products = () => {
  const [topRated, setTopRated] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Fetch top rated products
        const topRatedData = await getProductsSortedByRating("desc", 4);

        // Fetch categories
        const categoriesData = await getCategories();

        // Fetch products for each category
        const categoryProducts = {};
        for (const category of categoriesData) {
          const products = await getProductsByCategory(category);
          categoryProducts[category] = products;
        }

        if (isMounted) {
          setTopRated(topRatedData);
          setCategories(categoriesData);
          setProductsByCategory(categoryProducts);
        }
      } catch (e) {
        if (isMounted) setError(e.message || "Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <section className="py-10">
        <Loading message="Loading products..." />
      </section>
    );
  if (error)
    return (
      <section className="py-10 text-center text-sm text-rose-600">
        {error}
      </section>
    );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Rated Section */}
      <h2 className="font-bold text-2xl mb-6">Top Rated:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
        {topRated.map((p) => (
          <Card
            key={p.id}
            imageSrc={p.image}
            title={p.title}
            oldPrice={p.price}
            price={((100 - p.id) / 100) * p.price}
            rating={p.rating?.rate}
            reviewCount={p.rating?.count}
            discountPercent={p.id}
          />
        ))}
      </div>

      {/* Products by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl capitalize">{category}:</h2>
            <Link
              to={`/category/${encodeURIComponent(category)}`}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition flex items-center gap-1"
            >
              View All
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
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsByCategory[category]
              ?.map((p) => (
                <Card
                  key={p.id}
                  imageSrc={p.image}
                  title={p.title}
                  price={p.price}
                  rating={p.rating?.rate}
                  reviewCount={p.rating?.count}
                />
              ))
              .slice(0, 4)}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Products;
