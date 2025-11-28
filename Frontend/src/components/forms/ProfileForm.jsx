import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { updateProfile } from "../../api/auth";
import { useUser } from "../../context/UserContext";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string(),
  city: Yup.string(),
  street: Yup.string(),
});

const ProfileForm = ({ user, onSuccess }) => {
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleLabel = {
  saller: "Vendor",
  admin: "Admin",
  user: "Customer",
};

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");
      
      const updatedData = {
        name: values.username,
        email: values.email,
        city: values.city || "",
        phone: values.phone || "",
        address: values.address || "",
      };

      await updateProfile(updatedData);
      setUser(updatedData);
      localStorage.setItem("user" , JSON.stringify(updatedData));
      setSuccess("Profile updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    username: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
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
                readOnly
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
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
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Street Address
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {roleLabel[user?.role] || "User"}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;

