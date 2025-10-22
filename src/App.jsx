import { lazy, useEffect, useState } from "react";
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

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
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
    }, 3000);
    return () => clearTimeout(timeOut);
  }, []);

  // Routes Page
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route />
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
