import { Link } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm";

const RegisterPage = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
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
          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b border-gray-200">
            <Link
              to="/account/login"
              className="text-lg font-semibold text-gray-600 hover:text-purple-600 transition pb-3"
            >
              Login
            </Link>
            <Link
              to="/account/register"
              className="text-lg font-semibold text-purple-600 border-b-2 border-purple-600 pb-3 -mb-px"
            >
              Register
            </Link>
          </div>

          {/* Instruction Text */}
          <p className="text-gray-600 mb-6">
            There are many advantages to creating an account; the payment
            process is faster, shipment tracking is possible and much more.
          </p>

          {/* Register Form */}
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;

