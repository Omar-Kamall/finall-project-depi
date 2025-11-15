import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategories } from "../api/Products";
import Loading from "./Loading";

const clampNumber = (val, min, max) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};

const CategoryFilter = ({ products = [], onApply }) => {
  const { categoryName } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Price bounds from current products
  const { minPriceBound, maxPriceBound } = useMemo(() => {
    if (!products?.length) return { minPriceBound: 0, maxPriceBound: 0 };
    const prices = products.map((p) => Number(p.price) || 0);
    return {
      minPriceBound: Math.floor(Math.min(...prices)),
      maxPriceBound: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [minPrice, setMinPrice] = useState(minPriceBound);
  const [maxPrice, setMaxPrice] = useState(maxPriceBound);

  useEffect(() => {
    setMinPrice(minPriceBound);
    setMaxPrice(maxPriceBound);
  }, [minPriceBound, maxPriceBound]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const list = await getCategories();
        if (mounted) setCategories(list);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onApply === "function") {
      const lo = clampNumber(minPrice, minPriceBound, maxPriceBound);
      const hi = clampNumber(maxPrice, minPriceBound, maxPriceBound);
      onApply({ minPrice: Math.min(lo, hi), maxPrice: Math.max(lo, hi) });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Loading message="Loading filters..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <aside className="w-full space-y-6">
      {/* Price Filter */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Widget price filter</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-gray-700">
              Min price
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </label>
            <label className="text-xs font-medium text-gray-700">
              Max price
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Price ${minPriceBound} — ${maxPriceBound}
            </span>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-300"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Product Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => {
            const active = decodeURIComponent(categoryName || "")?.toLowerCase() === cat.toLowerCase();
            return (
              <li key={cat} className="flex items-center justify-between">
                <Link
                  to={`/category/${encodeURIComponent(cat)}`}
                  className={`flex items-center gap-2 text-sm transition hover:text-purple-600 ${
                    active ? "font-semibold text-purple-600" : "text-gray-700"
                  }`}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white">
                    {active && (
                      <span className="block h-2 w-2 rounded-sm bg-purple-600" />
                    )}
                  </span>
                  {cat.replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
                <span className="text-gray-400">+</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default CategoryFilter;
