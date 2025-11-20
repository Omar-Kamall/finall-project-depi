import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../Imgs/DEPIlogoProject.svg";
import { TextField, InputAdornment, Badge } from "@mui/material";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/account/login");
  };

  return (
    <>
      <header className="p-2! bg-white shadow-md w-full sticky top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-around p-4 gap-5">
          {/* Left Section - Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 h-10 inline-block" />
            <div className="flex items-baseline">
              <h1 className="md:text-2xl font-bold inline-block">JinStore</h1>
              <span className="text-sm text-purple-600 ml-1">.com</span>
            </div>
          </Link>

          {/* Middle Section - Search Bar */}
          <div className="flex-1 max-w-2xl w-100%">
            <TextField
              fullWidth
              placeholder="Search for products, categories or brands..."
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "8px 12px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <HiOutlineSearch className="text-black cursor-pointer" />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="hidden md:flex">
            {/* Right Section - Account, Wishlist, Cart */}
            <div className="flex items-center gap-6">
              {/* Account/Sign In */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-black hidden lg:block">
                      {user?.username || "User"}
                    </span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/account/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
              <Link
                to="/account"
                className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-110"
              >
                <HiOutlineUser className="text-xl text-black" />
              </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-110"
              >
                {/* the count will be implemented later */}
                <Badge badgeContent={0} color="error" showZero>
                  <HiOutlineHeart className="text-xl text-black" />
                </Badge>
              </Link>

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-110"
              >
                <Badge badgeContent={getTotalItems()} color="error" showZero>
                  <HiOutlineShoppingCart className="text-xl text-black" />
                </Badge>
              </Link>
            </div>
          </div>

          <div className="flex md:hidden">
            {/* Mobile View - Bottom Navigation */}
            <div className="flex bg-white w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] justify-around p-2! items-center gap-6 fixed bottom-0 left-0 right-0">
              <Link
                to={isAuthenticated ? "/account/profile" : "/account"}
                className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-opacity"
              >
                <HiOutlineUser className="text-xl text-black" />
              </Link>
              <Link
                to="/wishlist"
                className="relative cursor-pointer hover:opacity-70 transition-opacity"
              >
                <HiOutlineHeart className="text-xl text-black" />
              </Link>
              <Link
                to="/cart"
                className="relative cursor-pointer hover:opacity-70 transition-opacity"
              >
                <div className="relative">
                  <HiOutlineShoppingCart className="text-xl text-black" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;
