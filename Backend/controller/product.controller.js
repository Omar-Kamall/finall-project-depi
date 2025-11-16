const productModel = require("../model/product.model");

exports.getAllProducts = async (req, res) => {
  try {
    // Get All Products
    const products = await productModel.find();

    // check products
    if (products.length === 0)
      return res.status(200).json({ data: [], message: "Products Not Found" });

    return res
      .status(200)
      .json({ data: products, message: "Get Products Succssesfuly" });
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

    // check role
    if (role === "admin" || role === "saller") {
      // new product model and save database
      const newProduct = new productModel(req.body);
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
    const role = req.user.role;

    if (role === "admin" || role === "saller") {
      // select product id
      const productId = req.params.id;

      // Update Product
      const updateProduct = await productModel.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      // check product founded
      if (!updateProduct)
        return res.status(404).send({ message: "Product Not Found" });

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
    const role = req.user.role;

    if (role === "admin" || role === "saller") {
      // select product id
      const productId = req.params.id;

      // Delete product with id
      const deleteProduct = await productModel.findByIdAndDelete(productId);

      // check product founded
      if (!deleteProduct)
        return res.status(404).send({ message: "Product Not Found" });

      // status true founded product
      return res
        .status(200)
        .json({ data: deleteProduct, message: "Deleted Product Succssesfuly" });
    } else
      return res
        .status(403)
        .send({ message: "Accsses Post Product Be Admin or Saller" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
