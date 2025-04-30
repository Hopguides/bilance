const express = require("express");
const {
  getBalanceSheetByReportId,
  updateBalanceSheet,
  validateBalanceSheet,
} = require("../controllers/balanceSheetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Get balance sheet associated with an annual report ID
router.get("/annual-report/:reportId", getBalanceSheetByReportId);

// Update balance sheet by its own ID
router.put("/:id", updateBalanceSheet);

// Validate balance sheet by its own ID
router.post("/:id/validate", validateBalanceSheet);

module.exports = router;

