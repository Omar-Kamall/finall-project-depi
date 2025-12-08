import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../api/auth";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .required("Username is required"),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string()
    .oneOf(["user", "seller"], "Invalid role")
    .required("Please select a role"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the privacy policy"
  ),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setErrorType("");

      const res = await register({
        name: values.username,
        email: values.email,
        password: values.password,
        city: "",
        phone: "",
        address: "",
        role: values.role,
      });

      if (!res || !res.user) {
        setError("Invalid response from server. Please try again.");
        setErrorType("server");
        setSubmitting(false);
        return;
      }

      navigate("/account/login");
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.status === 409) {
        setError("Email address already registered. Please use a different email or log in.");
        setErrorType("auth");
      } else if (err.response?.status === 422) {
        setError("Invalid input format. Please check all fields and try again.");
        setErrorType("format");
      } else if (!err.response) {
        setError("Network error. Please check your connection and try again.");
        setErrorType("network");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Registration failed. Please try again."
        );
        setErrorType("server");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        agreeTerms: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values }) => (
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
                    {errorType === "network"
                      ? "Connection Error"
                      : errorType === "auth"
                      ? "Registration Failed"
                      : "Error"}
                  </p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Field
                type="text"
                id="username"
                name="username"
                className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                  errors.username && touched.username
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="johndoe"
              />
              {errors.username && touched.username && (
                <span className="absolute right-3 top-3 text-red-500 text-lg">
                  ⚠️
                </span>
              )}
            </div>
            <ErrorMessage
              name="username"
              component="div"
              className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              3-20 characters. Letters, numbers, hyphens, and underscores only.
            </p>
          </div>

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
                <span className="absolute right-3 top-3 text-red-500 text-lg">
                  ⚠️
                </span>
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
                placeholder="Enter a strong password"
              />
              {errors.password && touched.password && (
                <span className="absolute right-3 top-3 text-red-500 text-lg">
                  ⚠️
                </span>
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

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : values.confirmPassword &&
                      values.password === values.confirmPassword
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="absolute right-3 top-3 text-red-500 text-lg">
                  ⚠️
                </span>
              )}
              {values.confirmPassword &&
                values.password === values.confirmPassword &&
                !errors.confirmPassword && (
                  <span className="absolute right-3 top-3 text-green-500 text-lg">
                    ✓
                  </span>
                )}
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200"
            />
          </div>

          {/* Account Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center p-3 border border-gray-300 rounded-md hover:border-purple-500 transition cursor-pointer">
                <Field
                  type="radio"
                  id="customer"
                  name="role"
                  value="user"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="customer"
                  className="ml-3 block text-sm text-gray-700 cursor-pointer flex-1"
                >
                  <span className="font-semibold">I am a customer</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Browse and purchase products
                  </p>
                </label>
              </div>
              <div className="flex items-center p-3 border border-gray-300 rounded-md hover:border-purple-500 transition cursor-pointer">
                <Field
                  type="radio"
                  id="vendor"
                  name="role"
                  value="seller"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="vendor"
                  className="ml-3 block text-sm text-gray-700 cursor-pointer flex-1"
                >
                  <span className="font-semibold">I am a vendor</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Sell your products to customers
                  </p>
                </label>
              </div>
            </div>
            <ErrorMessage
              name="role"
              component="div"
              className="mt-2 text-sm text-red-600 font-medium"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <Field
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer mt-1"
            />
            <label htmlFor="agreeTerms" className="ml-3 block text-sm text-gray-700">
              I agree to the{" "}
              <Link
                to="/privacy-policy"
                className="text-purple-600 hover:text-purple-700 transition underline font-medium"
              >
                privacy policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms-of-service"
                className="text-purple-600 hover:text-purple-700 transition underline font-medium"
              >
                terms of service
              </Link>
              <span className="text-red-500">*</span>
            </label>
          </div>
          <ErrorMessage
            name="agreeTerms"
            component="div"
            className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/account/login"
              className="text-purple-600 hover:text-purple-700 transition font-semibold"
            >
              Login here
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;

