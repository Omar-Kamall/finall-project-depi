import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/Products";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useUser } from "../../context/UserContext";

const Hero = () => {
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const isAuthenticated = localStorage.getItem("token");
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        const res = await getAllProducts();
        const products = res.data;
        if (products && products.length > 0 && products.filter(product => product.oldPrice > product.price).length > 0) {
          const randomIndex = Math.floor(Math.random() * products.filter(product => product.oldPrice > product.price).length);
          setProduct(products[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchRandomProduct();
  }, []);

  const handleAddToCart = async (productData) => {
    if (!product || adding) return;
    //protected route
    if (!isAuthenticated) {
      showError("Please login to add items to cart");
      navigate("/account/login");
      return;
    }

    if (user?.role !== "user") return showError("User Only Can Add To Cart");

    productData = {
      productId: product._id,
      price: product.price,
      oldPrice: product.oldPrice,
      title: product.title,
      image: product.image,
      quantity: 1,
    };
    setAdding(true);
    try {
      await addToCart(productData);
      success(`${product.title} added to cart!`);
    } catch {
      showError("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return null;
  }

  const reviewCount = product.count || 0;

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Mobile: Image with overlay content */}
          <div className="lg:hidden relative rounded-2xl overflow-hidden shadow-xl">
            <Link to={`/product/${product._id}`} className="block group">
              <div className="relative bg-linear-to-br from-gray-50 to-gray-100 aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  onLoad={() => setImageLoaded(true)}
                  className={`h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-110 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  </div>
                )}
              </div>
            </Link>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit">
                Featured Product
              </span>
              <h1 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                <Link to={`/product/${product._id}`} className="hover:text-purple-600 transition-colors">
                  {product.title}
                </Link>
              </h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-purple-200">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/product/${product._id}`}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-1.5 h-4 w-4"
                  >
                    <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                  {adding ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Left Section - Product Details */}
          <div className="hidden lg:block">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              Featured Product
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
              <Link to={`/product/${product._id}`} className="hover:text-purple-800 transition-colors">
                {product.title}
              </Link>
            </h1>
            <p className="text-gray-600 text-lg mb-6 line-clamp-2">
              {product.description ||
                "Discover this amazing product with exceptional quality and great value."}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">
                <span className="text-gray-400">({reviewCount} reviews)</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-purple-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to={`/product/${product._id}`}
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-5 w-5"
                >
                  <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Desktop: Right Section - Product Image */}
          <div className="hidden lg:block">
            <Link to={`/product/${product._id}`} className="block group">
              <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl p-8 lg:p-12">
                <div className="relative aspect-square w-90 h-90 max-w-md mx-auto">
                  <img
                    src={product.image}
                    alt={product.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-110 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
