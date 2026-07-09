const jwt = require("jsonwebtoken");

function jwtAuth(req, res, next) {
  // 1. Try x-admin-key fallback
  const adminKey = req.headers["x-admin-key"];
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    req.user = { username: "admin", role: "admin", method: "api-key" };
    return next();
  }

  // 2. Try JWT Authorization Bearer token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    if (adminKey) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin key"
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authorization token or Admin key is required"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "medpath_jwt_secret_123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired authorization token"
    });
  }
}

module.exports = jwtAuth;
