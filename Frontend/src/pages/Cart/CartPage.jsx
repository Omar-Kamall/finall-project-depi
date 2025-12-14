import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../api/Products";
import { useToast } from "../../context/ToastContext";
import EmptyCart from "../../Imgs/EmptyCart.svg";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const isAuthenticated = localStorage.getItem("token");
  const { success } = useToast();
  const navigate = useNavigate();
  const [productCounts, setProductCounts] = useState({}); // Store productId -> count mapping

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/account/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch product counts for all cart items on mount and when cartItems change
  useEffect(() => {
    const fetchProductCounts = async () => {
      const counts = {};
      const promises = cartItems.map(async (item) => {
        try {
          const res = await getProductById(item.productId);
          counts[item.productId] = res.data.count;
        } catch (err) {
          console.error(`Error fetching count for product ${item.productId}:`, err);
          counts[item.productId] = Infinity; // Default to unlimited if fetch fails
        }
      });
      await Promise.all(promises);
      setProductCounts(counts);
    };

    if (cartItems.length > 0) {
      fetchProductCounts();
    }
  }, [cartItems]);

  // Don't render anything while checking auth or if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleRemove = async (productId, productTitle) => {
    await removeFromCart(productId);
    success(`${productTitle} removed from cart`);
  };

  const handleQuantityChange = async (product) => {
    await updateQuantity(product);
    success(`Updated Quantity Item`);
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
              <span className="text-gray-900 font-medium">Cart</span>
            </li>
          </ol>
        </nav>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="rounded-lg p-12 text-center">
              <img
                src={EmptyCart}
                alt="Empty Cart"
                className="w-16 h-16 mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-red-600 mb-6 uppercase">
                YOUR CART IS CURRENTLY EMPTY.
              </h2>
              <Link
                to="/"
                className="inline-block mt-6 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-md transition"
              >
                Return to shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Shopping Cart
              </h1>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="p-6 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-center gap-4">
                      <div className="flex justify-between">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition"
                        >
                          {item.title}
                        </Link>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              item.cartProductId || item.productId,
                              item.title
                            )
                          }
                          className="cursor-pointer mr-2 shrink-0 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-110 active:scale-95"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-700">Qty:</label>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange({
                                  ...item,
                                  quantity: Math.max(
                                    1,
                                    (item.quantity || 1) - 1
                                  ),
                                })
                              }
<<<<<<< HEAD
                              disabled={(item.quantity || 1) <= 1}
                              className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-all duration-200 active:bg-gray-200 active:scale-95"
=======
                              className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-all duration-200 active:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
>>>>>>> 2ba228b642089c3bfa701453720f66559cc67880
                              aria-label="Decrease quantity"
                              disabled={(item.quantity || 1) <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-gray-900 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const maxCount = productCounts[item.productId] ?? Infinity;
                                const newQuantity = Math.min(
                                  maxCount,
                                  (item.quantity || 1) + 1
                                );
                                handleQuantityChange({
                                  ...item,
<<<<<<< HEAD
                                  quantity: (item.quantity || 1) + 1,
                                })
                              }
                              disabled={(item.quantity || 1) >= item.count}
                              className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-all duration-200 active:bg-gray-200 active:scale-95"
=======
                                  quantity: newQuantity,
                                });
                              }}
                              disabled={
                                productCounts[item.productId] !== undefined &&
                                item.quantity >= productCounts[item.productId]
                              }
                              className="cursor-pointer px-3 py-1 text-gray-600 hover:bg-gray-100 transition-all duration-200 active:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 2ba228b642089c3bfa701453720f66559cc67880
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-rose-600">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${(item.price || 0).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">${totalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-rose-600">${totalPrice()}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block mt-4 text-center text-purple-600 hover:text-purple-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
