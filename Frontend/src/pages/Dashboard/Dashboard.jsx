// Main dashboard page
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../../components/Dashboard/ProductList";
import ProductForm from "../../components/Dashboard/ProductForm";
import { useToast } from "../../context/ToastContext";
import {
  deleteProduct,
  getAllProducts,
  postProduct,
  updateProduct,
} from "../../api/Products";

const Dashboard = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/account/login");
    }
  }, [navigate]);

  // Load products
  useEffect(() => {
    loadProducts();
  },[]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAllProducts();
      const products = res.data;
      setProducts(products);
    } catch (error) {
      showError("Failed to load products");
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (product) => {
    setIsSubmitting(true);

    if (!product) {
      showError("No product data provided");
      return;
    }

    const formDataToSend = new FormData();
    if (editingProduct && product._id) {
      formDataToSend.append("_id", product._id);
    }
    formDataToSend.append("title", product?.title || "");
    formDataToSend.append("price", Number(product?.price || 0));
    formDataToSend.append(
      "oldPrice",
      product?.oldPrice ? Number(product.oldPrice || 0) : ""
    );
    formDataToSend.append("description", product?.description || "");
    formDataToSend.append("category", product?.category || "");
    formDataToSend.append("count", Number(product?.count || 0));

    if (product?.imageFile) {
      formDataToSend.append("image", product?.imageFile || "");
    } else {
      formDataToSend.append("image", product?.image || "");
    }
    try {
      if (editingProduct) {
        // Call API
        await updateProduct(formDataToSend);
        if (formDataToSend) {
          success("Product updated successfully!");
          setShowForm(false);
          setEditingProduct(null);
          loadProducts();
          window.location.href = "/dashboard";
        } else {
          showError("Failed to update product");
        }
      } else {
        // Create new product
        await postProduct(formDataToSend);
        success("Product added successfully!");
        setShowForm(false);
        loadProducts();
      }
    } catch (error) {
      showError("Failed to save product. Please try again.");
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (product) => {
    setShowDeleteConfirm(product);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;

    try {
      const deleted = await deleteProduct(showDeleteConfirm._id);
      if (deleted) {
        success("Product deleted successfully!");
        setShowDeleteConfirm(null);
        loadProducts();
      } else {
        showError("Failed to delete product");
      }
    } catch (error) {
      showError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your products and track your inventory
              </p>
            </div>
            {!showForm && (
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add New Product
              </button>
            )}
          </div>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmitProduct}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Products Grid */}
        {!showForm && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                My Products ({products.length})
              </h2>
            </div>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{showDeleteConfirm.title}"?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
