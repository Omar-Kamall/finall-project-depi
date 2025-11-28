const productModel = require("../model/product.model");
const cloudinary = require("../utils/cloudinary.utils");

exports.getAllProducts = async (req, res) => {
  try {
    // get role with jwt middleware
    const role = req.user?.role;
    const userId = req.user?._id;

    // Get All Products
    let products;

    if (!role) {
      products = await productModel.find();
      return res.status(200).json({
        data: products,
        message: "Get Products Successfully (Guest)",
      });
    }

    if (role === "user" || role === "admin")
      products = await productModel.find();
    else products = await productModel.find({ createdBy: userId });

    // check products
    if (products.length === 0)
      return res.status(200).json({ data: [], message: "Products Not Found" });

    return res.status(200).json({
      data: products,
      message: "Get Products Succssesfuly",
    });
  } catch (error) {
    return res.status(500).send({ messaga: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // find produvt with id
    const product = await productModel.findOne({ _id: productId });

    // check products
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    return res
      .status(200)
      .json({ data: product, message: "Get Product By Id Succssesfuly" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.postProduct = async (req, res) => {
  try {
    // get role with jwt middleware
    const role = req.user.role;
    const userId = req.user._id; // user id with jwt middleware

    // check role
    if (role === "admin" || role === "saller") {
      let imageUrl = "";
      let imagePublicId = "";

      if (req.file) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename || req.file.public_id;
      }
      // new product model and save database
      const newProduct = new productModel({
        ...req.body,
        image: imageUrl,
        imagePublicId,
        createdBy: userId,
      });
      await newProduct.save();
      return res
        .status(201)
        .json({ data: newProduct, message: "Post Product Succssesfuly" });
    } else
      return res
        .status(403)
        .send({ message: "Accsses Post Product Be Admin or Saller" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    // select role with jwt middleware
    const role = req.user?.role; // user id with jwt middleware
    const userId = req.user?._id;

    // select product id
    const productId = req.params.id;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized: Login Required" });
    }

    let product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (req.file) {
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename || req.file.public_id;

      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
    }

    if (role === "admin") {
      // Update Product
      const updateProduct = await productModel.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      // status true founded product
      return res
        .status(200)
        .json({ data: updateProduct, message: "Post Product Succssesfuly" });
    } else if (role === "saller") {
      if (product.createdBy.toString() !== userId)
        return res.status(403).json({
          message: "Access Denied: Sellers can delete only their own products",
        });

      // Update Product
      const updateProduct = await productModel.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      // status true founded product
      return res
        .status(200)
        .json({ data: updateProduct, message: "Post Product Succssesfuly" });
    } else
      return res
        .status(403)
        .send({ message: "Accsses Post Product Be Admin or Saller" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // select role with jwt middleware
    const role = req.user?.role;
    const userId = req.user?._id;

    // select product id
    const productId = req.params.id;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized: Login Required" });
    }

    let product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (role === "admin") {
      // Delete product with id
      const deleteProduct = await productModel.findByIdAndDelete(productId);

      // check product founded
      if (!deleteProduct)
        return res.status(404).send({ message: "Product Not Found" });

      // Delete Photo With Cloudnairy
      if (deleteProduct.imagePublicId) {
        await cloudinary.uploader.destroy(deleteProduct.imagePublicId);
      }

      // status true founded product
      return res
        .status(200)
        .json({ data: deleteProduct, message: "Deleted Product Succssesfuly" });
    } else if (role === "saller") {
      // check createdById
      if (product.createdBy.toString() !== userId)
        return res.status(403).json({
          message: "Access Denied: Sellers can delete only their own products",
        });

      // Delete product with id
      const deleteProduct = await productModel.findByIdAndDelete(productId);

      // check product founded
      if (!deleteProduct)
        return res.status(404).send({ message: "Product Not Found" });

      // Delete Photo With Cloudnairy
      if (deleteProduct.imagePublicId) {
        await cloudinary.uploader.destroy(deleteProduct.imagePublicId);
      }

      // status true founded product
      return res
        .status(200)
        .json({ data: product, message: "Deleted Product Succssesfuly" });
    } else
      return res
        .status(403)
        .send({ message: "Accsses Post Product Be Admin or Saller" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


exports.getCategories = async (req , res) => {
  try {
    const findCategories = await productModel.distinct("category")
    return res.status(200).json({data: findCategories , message: "Get Categorys Succssesfuly"})
  } catch (error) {
    return res.status().send({message: error.messgae});
  }
}


exports.getCategory = async (req , res) => {
  try {
    const Category = req.params.category;
    const findByCategory = await productModel.find({category: Category})
    return res.status(200).json({data: findByCategory , message: "Get Category Succssesfuly"})
  } catch (error) {
    return res.status().send({message: error.messgae});
  }
}