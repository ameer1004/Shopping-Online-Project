const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET + "",
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
    });
    return;
  }
  res.status(401).send({ message: "No Token" });
};

module.exports = {
  isAuth,
  generateToken,
};
