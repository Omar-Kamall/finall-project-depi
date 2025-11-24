import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const validationSchema = Yup.object({
  username: Yup.string().required("Username or email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      await login(values);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        rememberMe: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username or email address <span className="text-red-500">*</span>
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your username or email"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Field
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/account/lost-password"
              className="text-sm text-purple-600 hover:text-purple-700 transition"
            >
              Lost your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;

