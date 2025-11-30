import { lazy, useEffect, useState, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from "react-router";
import { RouterProvider, ScrollRestoration } from "react-router-dom";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";

// Import Components
const Navbar = lazy(() => import("./Layout/Navbar"));
const Footer = lazy(() => import("./Layout/Footer"));
const Home = lazy(() => import("./pages/Home"));
const CategoriesList = lazy(() => import("./pages/Category/CategoriesList"));
const CategoryPage = lazy(() => import("./pages/Category/CategoryPage"));
const ProductDetails = lazy(() => import("./pages/Product/ProductDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AccountPage = lazy(() => import("./pages/Auth/AccountPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/Auth/ProfilePage"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const BlogPage = lazy(() => import("./pages/Blog/Blog"));
const BlogDetail = lazy(() => import("./pages/Blog/BlogDetail"));
const ContactPage = lazy(() => import("./pages/Contact"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

const Layout = () => {
  return (
    <>
      <Navbar />
      {/* Suspense is for each page can show a loader */}
      <Suspense fallback={<Loading message="Loading page..." fullScreen />}>
        <Outlet />
      </Suspense>
      {/* Reset scroll to top on path changes */}
      <ScrollRestoration getKey={({ pathname }) => pathname} />
      <ScrollToTop />
      <Footer />
    </>
  );
};

const App = () => {
  // State Loading Page
  const [loading, setLoading] = useState(true);

  // Effect Start Loading
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timeOut);
  }, []);

  // Routes Page
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<CategoriesList />} />
        <Route path="category/:categoryName" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="account/login" element={<LoginPage />} />
        <Route path="account/register" element={<RegisterPage />} />
        <Route path="account/profile" element={<ProfilePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <>
      {loading ? (
        <Loading message="Initializing..." fullScreen />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
};

export default App;
