import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { postOrder } from "../../api/order";
import { useUser } from "../../context/UserContext";

const CheckoutPage = () => {
  const { user } = useUser();
  const { cartItems, totalPrice , clearCartItems } = useCart();
  const isAuthenticated = localStorage.getItem("token");
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    streetAddress: "",
    apartment: "",
    city: "",
    phone: "",
    orderNotes: "",
  });

  const [shippingMethod, setShippingMethod] = useState("flat_rate");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = shippingMethod === "flat_rate" ? 15.0 : 0;
  const subtotal = totalPrice();
  const total = subtotal + shippingCost;

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/account/login");
    }
  }, [isAuthenticated, cartItems.length, navigate]);

  // Pre-fill form with user data if available
  // useEffect(() => {
  //   if (user) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       email: user.email || "",
  //       firstName: user.username?.split(" ")[0] || "",
  //       lastName: user.username?.split(" ").slice(1).join(" ") || "",
  //     }));
  //   }
  // }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const orderPayload = {
    fname: formData.firstName,
    lname: formData.lastName,
    country: formData.country,
    city: formData.city,
    address: {
      street: formData.streetAddress,
      apartment: formData.apartment,
    },
    email: formData.email || user.email ,
    phone: formData.phone,
    notes: formData.orderNotes,
    products: cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      price: item.price ,
    })),
    totalPrice: totalPrice() || 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      showError("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate order processing
      await postOrder(orderPayload);

      // Clear cart after successful order
      await clearCartItems();
      success("Order placed successfully!");
      navigate("/");
    } catch {
      showError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
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
              <span className="text-gray-900 font-medium">Checkout</span>
            </li>
          </ol>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Billing Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Billing details
              </h1>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Country/Region */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country / Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Select a country / region</option>
                    <option value="Egypt">Egypt</option>
                    <option value="United States (US)">
                      United States (US)
                    </option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label
                    htmlFor="streetAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Street address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-2"
                    placeholder="House number and street name"
                  />
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>

                {/* Order Notes */}
                <div>
                  <label
                    htmlFor="orderNotes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Order notes
                  </label>
                  <textarea
                    id="orderNotes"
                    name="orderNotes"
                    rows={4}
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                  />
                </div>

                {/* Shipping */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Shipping
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value="flat_rate"
                        checked={shippingMethod === "flat_rate"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">
                        Flat rate:{" "}
                        <span className="font-semibold">
                          ${shippingCost.toFixed(2)}
                        </span>
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value="local_pickup"
                        checked={shippingMethod === "local_pickup"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Local pickup</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Policy */}
                <p className="text-xs text-gray-600">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link
                    to="/privacy"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    privacy policy
                  </Link>
                  .
                </p>

                {/* Terms and Conditions */}
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the website{" "}
                    <Link
                      to="/terms"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      terms and conditions
                    </Link>
                  </span>
                </label>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeToTerms}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Processing..." : "Place order"}
                </button>
              </div>
            </div>

            {/* Right Section - Order Details */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Your order
                </h2>

                {/* Products List */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="text-sm font-semibold text-gray-700 pb-2">
                          Product
                        </th>
                        <th className="text-sm font-semibold text-gray-700 pb-2 text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.productId} className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">
                            {item.title}{" "}
                            <span className="text-gray-500">
                              × {item.quantity || 1}
                            </span>
                          </td>
                          <td className="py-3 text-gray-900 text-right">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${Number(subtotal).toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingMethod === "flat_rate"
                        ? `$${shippingCost.toFixed(2) || 0}`
                        : "Free"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-purple-600">
                        ${Number(total).toFixed(2) || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Payment method
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={true}
                        readOnly
                        className="mr-3 w-4 h-4 text-purple-600"
                      />
                      <span className="text-gray-900 font-medium">
                        Cash On Delivery
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 ml-7">
                      Pay with cash upon delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
