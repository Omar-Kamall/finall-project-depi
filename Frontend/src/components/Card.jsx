import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Card = ({
  imageSrc,
  title,
  price,
  oldPrice,
  discountPercent,
  rating,
  reviewCount,
  inStock = true,
  id,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasDiscount =
    typeof discountPercent === "number" && discountPercent > 0;
  const hasOldPrice = typeof oldPrice === "number" && oldPrice > price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id || !inStock) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      showError("Please login to add items to cart");
      navigate("/account/login");
      return;
    }
    
    setAdding(true);
    try {
      await addToCart({ id, price, title, image: imageSrc }, 1);
      success(`${title} added to cart!`);
    } catch {
      showError("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-linear-to-r from-rose-500 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist icon */}
      <button
        type="button"
        aria-label="Add to wishlist"
        className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-gray-600 shadow-lg transition-all hover:text-rose-600 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M11.645 20.91l-.007-.003-.023-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.593 2.25 9.318 2.25 6.75 4.3 4.5 6.9 4.5c1.54 0 3.04.74 4.1 1.924C12.06 5.24 13.56 4.5 15.1 4.5c2.6 0 4.65 2.25 4.65 4.818 0 3.275-2.438 6.043-4.738 8.19a25.232 25.232 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.023.012-.007.003-.003.002a.75.75 0 01-.694 0l-.003-.002z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
        {imageSrc ? (
          <Link to={id ? `/product/${id}` : "#"}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
              </div>
            )}
            <img
              src={imageSrc}
              alt={title || "product image"}
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 min-h-10">
          {id ? (
            <Link to={`/product/${id}`} className="hover:text-purple-600 transition-colors">
              {title || "Product name goes here"}
            </Link>
          ) : (
            title || "Product name goes here"
          )}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 ${
                  i < Math.round(rating || 0) ? "opacity-100" : "opacity-30"
                }`}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {typeof reviewCount === "number" && (
            <span className="text-xs text-gray-500">{reviewCount}</span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-purple-600">
            {typeof price === "number" ? `$${price.toFixed(2)}` : "$0.00"}
          </span>
          {hasOldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${oldPrice?.toFixed ? oldPrice.toFixed(2) : oldPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
            {adding ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default Card;
