const jwt = require("jsonwebtoken");

async function adminLogin(req, res) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "MedPath@123";

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET || "medpath_jwt_secret_123",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  adminLogin
};
