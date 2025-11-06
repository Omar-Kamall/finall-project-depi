import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../Imgs/DEPIlogoProject.svg";
import { TextField, InputAdornment, Badge } from "@mui/material";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineMenu,
} from "react-icons/hi";

const Navbar = () => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="p-2! bg-white shadow-md w-full sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-around p-4">
        {/* Left Section - Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10 inline-block" />
          <div className="flex items-baseline">
            <h1 className="text-2xl font-bold inline-block">JinStore</h1>
            <span className="text-sm text-purple-600 ml-1">.com</span>
          </div>
        </Link>

        {/* Middle Section - Search Bar */}
        <div className={`${!isSmall ? "flex-1 max-w-2xl" : "w-50%"}`}>
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

        {!isSmall ? (
          <>
            {/* Right Section - Account, Wishlist, Cart */}
            <div className="flex items-center gap-6">
              {/* Account/Sign In */}
              <Link
                to="/account"
                className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-opacity"
              >
                <HiOutlineUser className="text-xl text-black" />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative cursor-pointer hover:opacity-70 transition-opacity"
              >
                {/* the count will be implemented later */}
                <Badge badgeContent={0} color="error" showZero>
                  <HiOutlineHeart className="text-xl text-black" />
                </Badge>
              </Link>

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative cursor-pointer hover:opacity-70 transition-opacity"
              >
                {/* the count will be implemented later */}
                <Badge badgeContent={0} color="error" showZero>
                  <HiOutlineShoppingCart className="text-xl text-black" />
                </Badge>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Mobile View - Bottom Navigation */}
            <div className="flex bg-white w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] justify-around p-2! items-center gap-6 fixed bottom-0 left-0 right-0">
              <Link
                to="/account"
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
                <HiOutlineShoppingCart className="text-xl text-black" />
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
