function adminAuth(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    return res.status(401).json({
      success: false,
      message: "Admin key is required"
    });
  }

  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid admin key"
    });
  }

  next();
}

module.exports = adminAuth;
