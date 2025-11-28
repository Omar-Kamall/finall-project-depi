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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
              <span className="text-gray-900 font-medium">My account</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
            >
              Logout
            </button>
          </div>

          {/* User Info Summary */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name || "User"}
                </h2>
                {/* <p className="text-gray-600">{user.email}</p> */}
                <span className="inline-block mt-1 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  {roleLabel[user?.role] || "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <ProfileForm user={user} />
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;

