// Form for adding and editing products
import { useEffect, useState } from "react";
import { getCategories } from "../../api/Products";

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    description: "",
    category: "",
    image: "",
    count: "",
  });

  const [imageFile, setImageFile] = useState(null); // File object for upload
  const [imagePreview, setImagePreview] = useState(null); // Preview URL
  const [errors, setErrors] = useState({});
  const [ categories , setCategories ] = useState([]);
  const isEditMode = !!product;

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  fetchCategories();
  },[])

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price?.toString() || "",
        oldPrice: product.oldPrice?.toString() || "",
        description: product.description || "",
        category: product.category || "",
        image: product.image || "",
        count: product.count?.toString() || "",
      });
      // Set preview for existing image
      if (product.image) {
        setImagePreview(product.image);
      }
    } else {
      // Reset form for new product
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product]);

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 10MB",
        }));
        return;
      }

      // Set file for upload
      setImageFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clear error
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (
      formData.oldPrice &&
      Number(formData.oldPrice) <= Number(formData.price)
    ) {
      newErrors.oldPrice = "Old price must be greater than current price";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // For new products, require file upload
    // For editing, require either file upload or existing image
    if (!imageFile && !formData.image) {
      newErrors.image = "Image is required. Please upload an image file.";
    }

    if (!formData.count || Number(formData.count) < 0) {
      newErrors.count = "Valid stock count is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (validate()) {
        onSubmit({
          ...formData,
          price: Number(formData.price),
          oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
          count: Number(formData.count),
          imageFile: imageFile, // Include file object for upload (you'll handle Cloudinary upload later)
          image: imageFile ? null : formData.image, // Use existing image URL if no new file
        });
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Product Title <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            errors.title ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {errors.title}
          </p>
        )}
      </div>

      {/* Price and Old Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Main Price / Price After Discount<span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all ${
                errors.price ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="oldPrice"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Price Before Discount <span className="text-gray-500 text-xs font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              id="oldPrice"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all ${
                errors.oldPrice ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="0.00"
            />
          </div>
          {errors.oldPrice && (
            <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {errors.oldPrice}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Category <span className="text-rose-600">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            errors.category ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <div className="my-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-medium text-gray-500 uppercase">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <input
          type="text"
          id="categoryText"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            errors.category ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder="Enter new category name"
        />
        {errors.category && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {errors.category}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Description <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            errors.description ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
          placeholder="Enter detailed product description..."
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {errors.description}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Product Image <span className="text-rose-600">*</span>
        </label>

        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              errors.image ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer`}
          />
        </div>

        {errors.image && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {errors.image}
          </p>
        )}

        {/* Image Preview */}
        {(imagePreview || formData.image) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Image Preview:</p>
            <div className="relative inline-block">
              <img
                src={imagePreview || formData.image}
                alt="Product preview"
                className="h-56 w-56 object-contain border-2 border-gray-200 rounded-xl bg-white shadow-sm"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {imageFile && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  New
                </div>
              )}
            </div>
            {imageFile && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700">
                  <span className="font-semibold">File:</span> {imageFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        )}

        {!imagePreview && !formData.image && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Accepted formats:</span> JPG, PNG, GIF, WebP
            </p>
            <p className="text-xs text-blue-600 mt-1">
              <span className="font-semibold">Max size:</span> 10MB
            </p>
          </div>
        )}
      </div>

      {/* Stock Count */}
      <div>
        <label
          htmlFor="count"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Stock Count <span className="text-rose-600">*</span>
        </label>
        <input
          type="number"
          id="count"
          name="count"
          value={formData.count}
          onChange={handleChange}
          min="0"
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            errors.count ? "border-rose-500 bg-rose-50" : "border-gray-300 bg-white"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder="0"
        />
        {errors.count && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {errors.count}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : isEditMode ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Update Product
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Product
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
