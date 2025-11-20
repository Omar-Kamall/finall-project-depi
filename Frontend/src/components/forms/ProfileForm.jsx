import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  firstName: Yup.string(),
  lastName: Yup.string(),
  phone: Yup.string(),
  city: Yup.string(),
  street: Yup.string(),
});

const ProfileForm = ({ user, onSuccess }) => {
  const { updateProfile } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");
      
      const updatedData = {
        username: values.username,
        email: values.email,
        name: {
          firstname: values.firstName || user?.name?.firstname || "",
          lastname: values.lastName || user?.name?.lastname || "",
        },
        phone: values.phone || user?.phone || "",
        address: {
          city: values.city || user?.address?.city || "",
          street: values.street || user?.address?.street || "",
          number: user?.address?.number || 0,
          zipcode: user?.address?.zipcode || "",
          geolocation: user?.address?.geolocation || {
            lat: "",
            long: "",
          },
        },
      };

      await updateProfile(updatedData);
      setSuccess("Profile updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.name?.firstname || "",
    lastName: user?.name?.lastname || "",
    phone: user?.phone || "",
    city: user?.address?.city || "",
    street: user?.address?.street || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City
              </label>
              <Field
                type="text"
                id="city"
                name="city"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street Address
              </label>
              <Field
                type="text"
                id="street"
                name="street"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {user?.role === "vendor" ? "Vendor" : "Customer"}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;

