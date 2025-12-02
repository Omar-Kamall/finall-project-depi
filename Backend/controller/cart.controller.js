const cartModel = require("../model/cart.model");
const productModel = require("../model/product.model");

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user?._id;
        const cartItems = await cartModel
            .find({ createdBy: userId })
            .populate({
                path: "productId",
                select: "title image price"
            });
        return res.status(201).json({ data: cartItems, message: "Get Products Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


exports.addProductToCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role;
        const { productId, quantity } = req.body;

        if (role !== "user") {
            return res.status(403).json({ message: "Can't Add To Cart" });
        }

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const findProduct = await productModel.findById(productId);
        if (!findProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingCartItem = await cartModel.findOne({ productId, createdBy: userId });
        if (existingCartItem) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        const newCartItem = new cartModel({
            productId,
            quantity,
            createdBy: userId
        });

        const savedItem = await newCartItem.save();
        return res.status(201).json({ data: savedItem, message: "Product added to cart successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




exports.updateProductQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params?.id;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        const cartItem = await cartModel.findOne({ productId, createdBy: userId });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({ data: cartItem, message: "Product quantity updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};





exports.removeProductFromCart = async (req, res) => {
    try {
        const productId = req.params?.id;
        const userId = req.user?._id;

        const product = await cartModel.findOne({ productId , createdBy: userId});
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        const deleteProduct = await cartModel.findOneAndDelete({ productId, createdBy: userId });

        return res.status(204).json({ data: deleteProduct, message: "Deleted Product Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}




exports.clearProductsFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const deleteProducts = await cartModel.deleteMany({ createdBy: userId });

        return res.status(204).json({ data: deleteProducts, message: "Deleted Products Succssesfuly" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}