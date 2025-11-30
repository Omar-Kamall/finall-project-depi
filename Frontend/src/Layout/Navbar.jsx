import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../Imgs/DEPIlogoProject.svg";
import { TextField, InputAdornment, Badge } from "@mui/material";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiChevronDown,
} from "react-icons/hi";
import { useCart } from "../context/CartContext";
import {
  getCategories,
  getAllProducts,
  getProductsByCategory,
} from "../api/Products";
import { logout } from "../api/auth";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, setUser } = useUser();
  const isAuthenticated = localStorage.getItem("token");
  const { cartItems } = useCart();
  const lengthCartItems = cartItems.length;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Get current category from URL if on category page
  const currentCategory = params.categoryName
    ? decodeURIComponent(params.categoryName)
    : null;

  const handleLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem("user")
    setShowDropdown(false);
    window.location.href = "/account/login";
  };

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results with query and category (if applicable)
      const searchParams = new URLSearchParams({ q: searchQuery.trim() });
      if (currentCategory) {
        searchParams.set("category", currentCategory);
      }
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [location.pathname]);

  // Debounced search suggestions
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setSearchLoading(true);

        // Fetch products based on category
        let allProducts = [];
        if (currentCategory) {
          allProducts = await getProductsByCategory(currentCategory);
        } else {
          allProducts = await getAllProducts();
        }

        // Filter products by search query (limit to 5 results)
        const searchTerm = searchQuery.toLowerCase().trim();
        const filtered = allProducts
          .filter((product) => {
            const titleMatch = product.title
              ?.toLowerCase()
              .includes(searchTerm);
            const descriptionMatch = product.description
              ?.toLowerCase()
              .includes(searchTerm);
            const categoryMatch = product.category
              ?.toLowerCase()
              .includes(searchTerm);
            return titleMatch || descriptionMatch || categoryMatch;
          })
          .slice(0, 5);

        setSearchSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        console.error("Failed to fetch search suggestions:", error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchSearchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentCategory]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 w-full sticky top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 gap-2 md:gap-4">
          {/* Left Section - Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-2.5 hover:opacity-80 transition-opacity shrink-0"
          >
            <img src={logo} alt="logo" className="w-8 h-8 md:w-9 md:h-9" />
            <div className="flex items-baseline">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                JinStore
              </h1>
              <span className="text-xs md:text-sm text-purple-600 ml-1 font-medium">
                .com
              </span>
            </div>
          </Link>

          {/* Middle Section - Search Bar */}
          <div className="flex-1 max-w-2xl relative min-w-0" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder={
                  currentCategory
                    ? `Search in ${formatCategoryName(currentCategory)}...`
                    : "Search products..."
                }
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f9fafb",
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9333ea",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "8px 12px",
                    fontSize: "14px",
                    "@media (min-width: 768px)": {
                      padding: "10px 14px",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="submit"
                        className="cursor-pointer hover:opacity-70 transition-opacity p-1"
                        aria-label="Search"
                      >
                        <HiOutlineSearch className="text-gray-600 h-5 w-5" />
                      </button>
                    </InputAdornment>
                  ),
                }}
              />
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto"
              >
                {searchLoading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <>
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="shrink-0 w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-600 font-medium truncate">
                            ${product.price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {searchQuery.trim() && (
                      <div className="p-3 border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSearch(e);
                          }}
                          className="w-full text-left text-sm text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">No products found</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Section - Account, Wishlist, Cart (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {/* Account/Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user?.name || "User"}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to="/account/profile"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/account"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HiOutlineUser className="text-xl text-gray-700" />
              </Link>
            )}

            {/* Wishlist */}
            {user?.role === "admin" || user?.role === "saller" ? (
              <Link
                to="/dashboard"
                className="relative p-2 rounded-lg text-bold bg-purple-600 text-white transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Badge badgeContent={0} color="error">
                    <HiOutlineHeart className="text-xl text-gray-700" />
                  </Badge>
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Badge badgeContent={lengthCartItems} color="error">
                    <HiOutlineShoppingCart className="text-xl text-gray-700" />
                  </Badge>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom Navigation Bar - Desktop Only */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-start gap-8 py-4">
              <Link
                to="/"
                className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
              >
                Home
              </Link>

              {/* Categories Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-1">
                  <Link
                    to="/category"
                    className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
                  >
                    Categories
                  </Link>
                  <button
                    onClick={() =>
                      setShowCategoriesDropdown(!showCategoriesDropdown)
                    }
                    className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
                  >
                    <HiChevronDown
                      className={`text-sm transition-transform duration-200 ${
                        showCategoriesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {showCategoriesDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                    <Link
                      to="/category"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      All Categories
                    </Link>
                    {categoriesLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category}
                          to={`/category/${encodeURIComponent(category)}`}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors capitalize"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          {formatCategoryName(category)}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/blog"
                className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
              >
                Blog
              </Link>

              <Link
                to="/contact"
                className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Separate from header */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center py-2">
          <Link
            to={isAuthenticated ? "/account/profile" : "/account"}
            className="flex flex-col items-center p-2 hover:opacity-70 transition-opacity"
          >
            <HiOutlineUser className="text-xl text-gray-700" />
            <span className="text-xs text-gray-600 mt-1">Account</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex flex-col items-center p-2 hover:opacity-70 transition-opacity"
          >
            <HiOutlineHeart className="text-xl text-gray-700" />
            <span className="text-xs text-gray-600 mt-1">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            className="flex flex-col items-center p-2 hover:opacity-70 transition-opacity relative"
          >
            <HiOutlineShoppingCart className="text-xl text-gray-700" />
            {lengthCartItems > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {lengthCartItems}
              </span>
            )}
            <span className="text-xs text-gray-600 mt-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
      {showCategoriesDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCategoriesDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;
