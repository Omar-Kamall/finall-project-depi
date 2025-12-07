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
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Title <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.title ? "border-rose-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
        )}
      </div>

      {/* Price and Old Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Main Price / Price After Discount<span className="text-rose-600">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.price ? "border-rose-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-rose-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="oldPrice"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Price Before Discount (optional)
          </label>
          <input
            type="number"
            id="oldPrice"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.oldPrice ? "border-rose-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="0.00"
          />
          {errors.oldPrice && (
            <p className="mt-1 text-sm text-rose-600">{errors.oldPrice}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category <span className="text-rose-600">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.category ? "border-rose-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <span className="my-1 flex items-center justify-center text-gray-500">OR</span>
        <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.oldPrice ? "border-rose-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="New Category"
          />
        {errors.category && (
          <p className="mt-1 text-sm text-rose-600">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.description ? "border-rose-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-rose-600">{errors.description}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-2"
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
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.image ? "border-rose-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer`}
          />
        </div>

        {errors.image && (
          <p className="mt-1 text-sm text-rose-600">{errors.image}</p>
        )}

        {/* Image Preview */}
        {(imagePreview || formData.image) && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <div className="relative inline-block">
              <img
                src={imagePreview || formData.image}
                alt="Product preview"
                className="h-48 w-48 object-contain border border-gray-200 rounded-lg bg-gray-50"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {imageFile && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  New
                </div>
              )}
            </div>
            {imageFile && (
              <p className="mt-2 text-xs text-gray-500">
                File: {imageFile.name} (
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {!imagePreview && !formData.image && (
          <p className="mt-2 text-sm text-gray-500">
            Accepted formats: JPG, PNG, GIF, WebP (Max size: 10MB)
          </p>
        )}
      </div>

      {/* Stock Count */}
      <div>
        <label
          htmlFor="count"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.count ? "border-rose-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder="0"
        />
        {errors.count && (
          <p className="mt-1 text-sm text-rose-600">{errors.count}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Product"
            : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
