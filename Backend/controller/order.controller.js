const orderModel = require("../model/order.model");
const productModel = require("../model/product.model");
const userModel = require("../model/user.model");
const transporter = require("../service/mailer.service");

exports.getOrder = async (req, res) => {
  try {
    // get user id with jwt middleware
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId) return res.status(403).send("Login Required");
    let order;

    if(role !== "admin") {
      order = await orderModel.find({ createdBy: userId });
    }

    order = await orderModel.find();

    // check list order
    if (!order) return res.status(403).send("Product Not Found");

    return res
      .status(201)
      .json({ data: order, message: "Get Data Succssesfuly" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.postOrder = async (req, res) => {
  try {
    // get user id with jwt middleware
    const userId = req.user?._id;
    const { fname, lname, email, address, phone, country, city, products } = req.body;
    const { street, apartment } = address || {};

    if (!fname || !lname || !email || !phone || !street || !apartment)
      return res
        .status(400)
        .json({ message: "All user info fields are required" });

    if (!req.user) {
      return res.status(401).json({ message: "Login Required" });
    }

    // check products
    if (!products || products.length === 0)
      return res.status(400).json({ message: "Products are required" });

    let orderProducts = [];
    let grandTotal = 0;
    const sellerEmails = [];

    // loop in products
    for (const item of products) {
      const product = await productModel.findById(item.productId);

      const sellerId = product.createdBy;
      const sellerUser = await userModel.findById(sellerId);
      if (sellerUser && sellerUser.email) {
        sellerEmails.push(sellerUser.email);
      }



      if (!product)
        return res.status(400).json({ message: `Product not found` });

      if (product.stock < item.quantity)
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });

      // reduce stock
      product.stock -= item.quantity;
      await product.save();

      const total = product.price * item.quantity;
      grandTotal += total;

      orderProducts.push({
        productId: product._id,
        title: product.title,
        image: product.image,
        quantity: item.quantity,
        price: product.price,
        total,
      });
    }

    const newOrder = new orderModel({
      fname,
      lname,
      country,
      city,
      email,
      address: {
        street,
        apartment
      },
      phone,
      products: orderProducts,
      totalPrice: grandTotal,
      createdBy: userId,
    });
    const order = await newOrder.save();

    // Send Order Details to mail
    let productsHtml = orderProducts
      .map(
        (p, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${p.productId}</td>
        <td>${p.title}</td>
        <td><img src=${p.image} alt=${p.title}/></td>
        <td>${p.quantity}</td>
        <td>$${p.price}</td>
        <td>$${p.total}</td>
      </tr>
    `
      )
      .join("");

    const htmlMessage = `
  <h2>New Order Received</h2>
  <p><strong>Name:</strong> ${fname} ${lname}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Address:</strong> ${street}, ${apartment}</p>
  <h3>Order Details:</h3>
  <table border="1" cellpadding="5" cellspacing="0">
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Title</th>
        <th>Image</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${productsHtml}
    </tbody>
  </table>
  <h3>Grand Total: $${grandTotal}</h3>
`;

    // Send Order To Email Admin
    await transporter.sendMail({
      from: `My Website <omarkamall.dev@gmail.com>`,
      replyTo: `${fname} ${lname} <${email}>`,
      to: "omarkamall.dev@gmail.com",
      subject: `New Order from ${fname} ${lname}`,
      html: htmlMessage,
    });

    // Send customer Order
    await transporter.sendMail({
      from: `My Website <omarkamall.dev@gmail.com>`,
      to: email,
      subject: "Order Confirmation",
      html: `
    <h2>Thank you for your order, ${fname}!</h2>
    <p>Your order has been received successfully. Here are your details:</p>
    ${htmlMessage}
  `,
    });

    // Send Order To Email Saller
    await Promise.all(
      sellerEmails.map(async (item) => {
        await transporter.sendMail({
          from: `My Website <omarkamall.dev@gmail.com>`,
          to: item,
          subject: "New Order Notification",
          html: `
      <p>Your order has been received successfully. Here are your details:</p>
      ${htmlMessage}
    `,
        })
      }))

    return res
      .status(201)
      .json({ data: order, message: "Send Data Succssesfuly" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
