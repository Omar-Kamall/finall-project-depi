const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");

exports.getCartItems = async (req, res) => {
    try {
        const id = req.user?._id;
        const products = await cartModel.find({ createdBy: id });
        return res.status(201).json({ data: products, message: "Get Products Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}



exports.addProductToCart = async (req, res) => {
    try {
        const id = req.user?._id;
        const { productId , title , price , quantity } = req.body;

        const findProduct = await productModel.findById(req.body.productId);
        if (!findProduct || !productId || !title || !price || !quantity) {
            return res.status(400).json({ message: "Product not found" });
        }

        const checkProduct = await cartModel.findOne({
            productId: req.body.productId,
            createdBy: id
        });
        if (checkProduct) {
            return res.status(401).json({ message: "Product Alredey Exit" });
        }

        const newProduct = new cartModel({ ...req.body, createdBy: id });
        const product = await newProduct.save();

        return res.status(201).json({ data: product, message: "Post Product Succssesfuly" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}



exports.updateProductQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params.id;
        const { quantity } = req.body;

        const product = await cartModel.findOne({
            productId,
            createdBy: userId
        });
        if (!product) {
            const newProduct = new cartModel({ ...req.body, createdBy: userId });
            await newProduct.save();
            return res.status(201).json({data: newProduct , message: "Post Product Succssesfuly"})
        }



        const updateProduct = await cartModel.findOneAndUpdate({ productId, createdBy: userId }, { quantity }, { new: true });

        return res.status(200).json({ data: updateProduct, message: "Update Product Succssesfuly" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}




exports.removeProductFromCart = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?._id;

        const product = await cartModel.findOne({ productId: id });
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        const deleteProduct = await cartModel.findOneAndDelete({productId: id , createdBy: userId});

        return res.status(204).json({ data: deleteProduct, message: "Deleted Product Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}




exports.clearProductsFromCart = async (req, res) => {
    try {
        const deleteProducts = await cartModel.deleteMany();

        return res.status(204).json({ data: deleteProducts, message: "Deleted Products Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}