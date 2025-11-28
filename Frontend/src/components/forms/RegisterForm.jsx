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
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().oneOf(["user", "saller"], "Invalid role").required("Please select a role"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      await register({
        name: values.username,
        email: values.email,
        password: values.password,
        city: "",
        phone: "",
        address: "",
        role: values.role,
      });
      navigate("/account/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
        role: "user",
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
              Username <span className="text-red-500">*</span>
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your username"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

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
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
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

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Field
                  type="radio"
                  id="customer"
                  name="role"
                  value="user"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="customer"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I am a customer
                </label>
              </div>
              <div className="flex items-center">
                <Field
                  type="radio"
                  id="vendor"
                  name="role"
                  value="saller"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="vendor"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I am a vendor
                </label>
              </div>
            </div>
            <ErrorMessage
              name="role"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <p className="text-sm text-gray-600">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our{" "}
            <Link
              to="/privacy-policy"
              className="text-purple-600 hover:text-purple-700 transition underline"
            >
              privacy policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;

