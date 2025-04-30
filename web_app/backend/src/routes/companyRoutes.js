const express = require("express");
const {
  getMyCompany,
  updateCompany,
} = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get the company associated with the logged-in user
router.get("/mine", protect, getMyCompany);

// Update company details (assuming ID is the company ID)
// The protect middleware ensures req.user is available
router.put("/:id", protect, updateCompany);

module.exports = router;

