import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/auth";
import { useUser } from "../../context/UserContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email format (example: user@domain.com)")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const LoginForm = () => {
  // Custom Hook Save User Login
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setErrorType("");

      const res = await login({
        email: values.email,
        password: values.password,
      });

      // Validate response
      if (!res || !res.user || !res.token) {
        setError("Invalid response from server. Please try again.");
        setErrorType("server");
        setSubmitting(false);
        return;
      }

      // Save User In Context UserContext
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      // Fixed typo: "saller" → "seller"
      const role = res.user.role;
      if (role === "admin" || role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password. Please check and try again.");
        setErrorType("auth");
      } else if (err.response?.status === 404) {
        setError("User account not found. Please sign up first.");
        setErrorType("auth");
      } else if (err.response?.status === 422) {
        setError("Invalid email or password format.");
        setErrorType("format");
      } else if (!err.response) {
        setError("Network error. Please check your connection.");
        setErrorType("network");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
        setErrorType("server");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        rememberMe: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {/* Server Error Alert */}
          {error && (
            <div
              className={`rounded-md p-4 text-sm font-medium border ${
                errorType === "network"
                  ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                  : errorType === "auth"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-orange-50 text-orange-800 border-orange-200"
              }`}
              role="alert"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {errorType === "network" ? "⚠️" : "❌"}
                </span>
                <div>
                  <p className="font-semibold mb-1">
                    {errorType === "network" ? "Connection Error" : "Login Failed"}
                  </p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Field
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                  errors.email && touched.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="example@domain.com"
              />
              {errors.email && touched.email && (
                <span className="absolute right-3 top-3 text-red-500 text-lg">⚠️</span>
              )}
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              Format: yourname@example.com
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Field
                type="password"
                id="password"
                name="password"
                className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                  errors.password && touched.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && touched.password && (
                <span className="absolute right-3 top-3 text-red-500 text-lg">⚠️</span>
              )}
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200"
            />
            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
              <p className="font-semibold mb-1">✓ Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 6 characters</li>
                <li>At least 1 uppercase letter (A-Z)</li>
                <li>At least 1 lowercase letter (a-z)</li>
                <li>At least 1 number (0-9)</li>
              </ul>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Field
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/account/lost-password"
              className="text-sm text-purple-600 hover:text-purple-700 transition font-medium"
            >
              Lost your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
