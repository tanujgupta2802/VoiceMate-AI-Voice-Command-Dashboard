const admin = require("../config/firebaseAdmin");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // ✅ Token verify karo aur real user nikalo
    const decodedToken = await admin.auth().verifyIdToken(token);

    // ✅ Real user set karo
    req.user = {
      _id: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
