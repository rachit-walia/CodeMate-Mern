const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // attach decoded user info to request

    next();
  } catch (err) {
    console.error("❌ Token validation failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

module.exports = validateToken;
