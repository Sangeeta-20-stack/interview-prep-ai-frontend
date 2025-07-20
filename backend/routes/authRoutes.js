const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ✅ Import multer middleware

const router = express.Router();

// ✅ Register with image upload
router.post("/register", upload.single("profileImage"), registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Get profile (protected route)
router.get("/profile", protect, getUserProfile);

// ✅ Optional: separate upload-only route (for editor/image uploads, etc.)
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
