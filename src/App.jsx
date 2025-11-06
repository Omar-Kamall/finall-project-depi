import { lazy, useEffect, useState, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from "react-router";
import { RouterProvider } from "react-router-dom";

// Import Components
const Navbar = lazy(() => import("./Layout/Navbar"));
const Footer = lazy(() => import("./Layout/Footer"));
const Home = lazy(() => import("./pages/Home/Home"));
const CategoriesList = lazy(() => import("./pages/Category/CategoriesList"));
const CategoryPage = lazy(() => import("./pages/Category/CategoryPage"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const Layout = () => {
  return (
    <>
      <Navbar />
      {/* Suspense is for each page can show a loader */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-red-600 text-4xl">
            loading...
          </div>
        }
      >
        <Outlet />
      </Suspense>
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
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen text-red-600 text-4xl">
          loading...
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
};

export default App;
