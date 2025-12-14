import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import ProfileForm from "../../components/forms/ProfileForm";
import { logout } from "../../api/auth";
import { useUser } from "../../context/UserContext";

const ProfilePage = () => {
  const { user , setUser} = useUser();
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();

  const roleLabel = {
  saller: "Vendor",
  admin: "Admin",
  user: "Customer",
};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/account/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/account/login");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-purple-600 transition-colors"
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
              <span className="text-gray-900 font-medium">My account</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-purple-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* User Info Summary */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-6 p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.name || "User"}
                </h2>
                {user?.email && (
                  <p className="text-gray-600 mb-2">{user.email}</p>
                )}
                <span className="inline-block px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-full shadow-md">
                  {roleLabel[user?.role] || "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="px-8 pb-8">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

