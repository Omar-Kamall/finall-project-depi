import { lazy, useEffect, useState, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from "react-router";
import { RouterProvider, ScrollRestoration } from "react-router-dom";
import Loading from "./components/Loading";

// Import Components
const Navbar = lazy(() => import("./Layout/Navbar"));
const Footer = lazy(() => import("./Layout/Footer"));
const Home = lazy(() => import("./pages/Home"));
const CategoriesList = lazy(() => import("./pages/Category/CategoriesList"));
const CategoryPage = lazy(() => import("./pages/Category/CategoryPage"));
const ProductDetails = lazy(() => import("./pages/Product/ProductDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
