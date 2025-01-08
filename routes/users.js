const express = require("express");
const {
  registerUser,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/users");
const router = express.Router();

router.post("/register", registerUser);
router.get("/profile/:identifier", getProfile);
router.put("/profile/:identifier", updateProfile);
router.delete("/profile/:identifier", deleteProfile);

module.exports = router;
