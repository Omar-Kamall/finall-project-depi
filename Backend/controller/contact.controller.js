const contactModel = require("../model/contact.model");
const transporter = require("../service/mailer.service");

exports.getContacts = async (req, res) => {
  try {
    // get role with jwt middleware
    const role = req.user?.role;

    if (role !== "admin")
      return res.status(400).send("Access Denied: Must be Admin");

    // find data in contact modale
    const contactData = await contactModel.find();

    // check data conatct
    if (!contactData) return res.status(403).send("Contact Is Empty Data");

    return res
      .status(200)
      .json({ data: contactData, message: "Get Data Succssesfuly" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.postContacts = async (req, res) => {
  try {
    const newContact = new contactModel(req?.body);
    const dataContact = await newContact.save();

    // Send Contact to mail
    await transporter.sendMail({
      from: `My Website <omarkamall.dev@gmail.com>`,
      replyTo: `${req.body.name} <${req.body.email}>`,
      to: "omarkamall.dev@gmail.com",
      subject: `${req.body.subject}`,
      html: `<b>${req.body.message}</b>`,
    });

    return res
      .status(201)
      .json({ data: dataContact, message: "Send Data Succssesfuly" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
