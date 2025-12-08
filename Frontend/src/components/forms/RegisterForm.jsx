import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../api/auth";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Please enter a valid email format (example: user@domain.com)")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string()
    .oneOf(["user", "saller"], "Invalid role")
    .required("Please select a role"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the privacy policy"
  ),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");

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
        setSubmitting(false);
        return;
      }

      navigate("/account/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
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
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-6">
          {/* Server Error Alert */}
          {error && (
            <div
              className="rounded-md p-4 text-sm font-medium bg-red-50 text-red-800 border border-red-200"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">❌</span>
                <div>
                  <p className="font-semibold mb-1">Registration Failed</p>
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
            <ErrorMessage
              name="username"
              component="div"
              className="mt-1 text-sm text-red-600 font-medium"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address <span className="text-red-500">*</span>
            </label>
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
            <ErrorMessage
              name="email"
              component="div"
              className="mt-1 text-sm text-red-600 font-medium"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
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
            <ErrorMessage
              name="password"
              component="div"
              className="mt-1 text-sm text-red-600 font-medium"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                errors.confirmPassword && touched.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Re-enter your password"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="mt-1 text-sm text-red-600 font-medium"
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
                  value="saller"
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
            className="text-sm text-red-600 font-medium"
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

