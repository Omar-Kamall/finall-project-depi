const productModel = require("../model/product.model");
const cloudinary = require("../utils/cloudinary.utils");

// ===== GET ALL PRODUCTS =====
exports.getAllProducts = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id;

    let products;
    if (!role) {
      products = await productModel.find();
      return res
        .status(200)
        .json({ data: products, message: "Get Products Successfully (Guest)" });
    }

    if (role === "user" || role === "admin") {
      products = await productModel.find();
    } else {
      products = await productModel.find({ createdBy: userId });
    }

    if (products.length === 0)
      return res.status(200).json({ data: [], message: "Products Not Found" });

    return res
      .status(200)
      .json({ data: products, message: "Get Products Successfully" });
  } catch (error) {
    console.error("getAllProducts Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== GET PRODUCT BY ID =====
exports.getProduct = async (req, res) => {
  try {
    const productId = req.params?.id;
    const product = await productModel.findById(productId);

    if (!product) return res.status(404).json({ message: "Product Not Found" });

    return res
      .status(200)
      .json({ data: product, message: "Get Product By ID Successfully" });
  } catch (error) {
    console.error("getProduct Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== POST PRODUCT =====
exports.postProduct = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id;

    if (role !== "admin" && role !== "saller") {
      return res
        .status(403)
        .json({ message: "Access Denied: Be Admin or Saller" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename || req.file.public_id;
    }

    const newProduct = new productModel({
      ...req.body,
      image: imageUrl,
      imagePublicId,
      createdBy: userId,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ data: newProduct, message: "Product Posted Successfully" });
  } catch (error) {
    console.error("postProduct Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== EDIT PRODUCT =====
exports.editProduct = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id;
    const productId = req.params?.id;

    if (!role)
      return res.status(401).json({ message: "Unauthorized: Login Required" });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    if (req.file) {
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename || req.file.public_id;

      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    if (role === "saller" && product.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Sellers can edit only their own products" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .json({ data: updatedProduct, message: "Product Updated Successfully" });
  } catch (error) {
    console.error("editProduct Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== DELETE PRODUCT =====
exports.deleteProduct = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id;
    const productId = req.params?.id;

    if (!role)
      return res.status(401).json({ message: "Unauthorized: Login Required" });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    if (role === "saller" && product.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Sellers can delete only their own products" });
    }

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (deletedProduct?.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(deletedProduct.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete error:", err.message);
      }
    }

    return res
      .status(200)
      .json({ data: deletedProduct, message: "Product Deleted Successfully" });
  } catch (error) {
    console.error("deleteProduct Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== GET DISTINCT CATEGORIES =====
exports.getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    return res
      .status(200)
      .json({ data: categories, message: "Get Categories Successfully" });
  } catch (error) {
    console.error("getCategories Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};

// ===== GET PRODUCTS BY CATEGORY =====
exports.getCategory = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?._id;
    const category = req.params?.category;

    let products;
    if (role === "admin" || role === "user") {
      products = await productModel.find({ category });
    } else if (role === "saller") {
      products = await productModel.find({ category, createdBy: userId });
    } else {
      products = await productModel.find({ category });
    }

    return res
      .status(200)
      .json({
        data: products,
        message: "Get Products By Category Successfully",
      });
  } catch (error) {
    console.error("getCategory Error:", error.message);
    return res.status(500).send({ message: error.message });
  }
};
