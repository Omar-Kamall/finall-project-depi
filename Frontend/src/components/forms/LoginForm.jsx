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
    .required("Password is required"),
});

const LoginForm = () => {
  // Custom Hook Save User Login
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");

      const res = await login({
        email: values.email,
        password: values.password,
      });

      // Save User In Context UserContext
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      // Redirect based on role
      const role = res.user.role;
      if (role === "admin" || role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
          {/* Error Alert */}
          {error && (
            <div className="rounded-md p-4 text-sm font-medium bg-red-50 text-red-800 border border-red-200" role="alert">
              <div className="flex items-start gap-3">
                <span className="text-lg">❌</span>
                <div>
                  <p className="font-semibold mb-1">Login Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address <span className="text-red-500">*</span>
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-300"
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className={`w-full px-4 py-2 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                errors.password && touched.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="mt-1 text-sm text-red-600 font-medium"
            />
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
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
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
