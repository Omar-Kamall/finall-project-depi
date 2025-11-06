import React from "react";
import { useEffect, useState } from "react";
import {
  getProductsSortedByRating,
  getCategories,
  getProductsByCategory,
} from "../../api/Products";
import Card from "../../components/Card";

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
      <section className="py-10 text-center text-sm text-gray-500">
        Loading products...
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
            price={p.price}
            rating={p.rating?.rate}
            reviewCount={p.rating?.count}
          />
        ))}
      </div>

      {/* Products by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="font-bold text-2xl mb-6 capitalize">{category}:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsByCategory[category]?.map((p) => (
              <Card
                key={p.id}
                imageSrc={p.image}
                title={p.title}
                price={p.price}
                rating={p.rating?.rate}
                reviewCount={p.rating?.count}
              />
            )).slice(0, 4)}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Products;
