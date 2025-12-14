import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import EmptyCart from "../../Imgs/EmptyCart.svg";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error: showError } = useToast();

  const handleRemove = (productId, productTitle) => {
    removeFromWishlist(productId);
    success(`${productTitle} removed from wishlist`);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product.productId,
        price: product.price,
        title: product.title,
        image: product.image,
        quantity: 1,
      });
      success(`${product.title} added to cart!`);
    } catch {
      showError("Failed to add item to cart. Please try again.");
    }
  };

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
              <span className="text-gray-900 font-medium">Wishlist</span>
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {/* Empty Wishlist State */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="rounded-lg p-12 text-center">
              <img
                src={EmptyCart}
                alt="Empty Wishlist"
                className="w-16 h-16 mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-red-600 mb-6 uppercase">
                YOUR WISHLIST IS CURRENTLY EMPTY.
              </h2>
              <Link
                to="/"
                className="inline-block mt-6 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-md transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.productId}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Remove from Wishlist Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId, item.title)}
                  className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-rose-600 shadow-lg transition-all hover:bg-rose-50 hover:scale-110"
                  aria-label="Remove from wishlist"
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

                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-2">
                  {/* Title */}
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 min-h-7">
                    <Link
                      to={`/product/${item.productId}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-purple-600">
                      {typeof item.price === "number"
                        ? `$${item.price.toFixed(2)}`
                        : "$0.00"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M2.25 3.75h2.386c.7 0 1.311.48 1.468 1.163l.23 1.011m0 0l1.204 5.3A2.25 2.25 0 009.733 12h7.286a2.25 2.25 0 002.192-1.684l1.006-4.019A1.125 1.125 0 0019.131 4.5H6.334m0 0l-.23-1.011A2.25 2.25 0 003.636 2.25H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;

