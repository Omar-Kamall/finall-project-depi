const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    // check user in database
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (checkUser)
      return res.status(400).send({ message: "User already exists" });

    // create new user
    const newUser = new userModel(req.body);

    // hashpassword
    const hashPassword = await bcrypt.hash(req.body.password, 11);
    newUser.password = hashPassword;

    // save new user in database
    await newUser.save();
    return res.status(201).json({ user: newUser , message: "Registered Succssesfuly"});
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user => email
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).send({ message: "Invalid Email or Password" });

    // compare password
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(400).send({ message: "Invalid Email or Password" });

    // create json web token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      "secretKey"
    );

    // return data user and token
    return res.status(200).json({ user: user, token: token , message: "Logined Succssesfuly" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    const userEmail = req.params?.email;

    // check user email
    const user = await userModel.findOne({ email: userEmail });
    if (!user) return res.status(404).send({ message: "User not found" });

    // check user email
    const existEmail = await userModel.findOne({ email });
    if (existEmail && existEmail._id.toString() !== user._id.toString())
      return res.status(400).send({ message: "Email already exists" });

    // update email
    updates.email = email;

    // checked hashpassword or hash
    if (updates.password) {
      const hashPassword = await bcrypt.hash(updates.password, 11);
      updates.password = hashPassword;
    }

    // update new data
    const newUserData = await userModel
      .findOneAndUpdate({ email: userEmail }, updates, { new: true })
      .select("-password");
    return res.status(200).json({ user: newUserData , message: "User Update Succssesfuly"});
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.deleteAcounct = async (req, res) => {
  try {
    const email = req.params.email;

    // check user => email
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).send({ message: "User Not Found" });

    // delete acount
    await userModel.findByIdAndDelete(user._id);

    // return data user and token
    return res.status(200).json({ user: user , message: "User Delete Succssesfuly" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
