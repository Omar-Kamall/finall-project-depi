const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const fullToken = await req.headers.authorization;
    const token = fullToken?.split(" ")[1];
    if (!token) return res.status(403).send("Accsses Denied");
    const deCodeToken = jwt.verify(token, "secretKey");
    req.user = deCodeToken;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};
