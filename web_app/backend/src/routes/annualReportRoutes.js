const express = require("express");
const {
  getAnnualReports,
  getAnnualReportById,
  createAnnualReport,
  updateAnnualReport,
  deleteAnnualReport,
} = require("../controllers/annualReportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route("/")
  .get(getAnnualReports)
  .post(createAnnualReport);

router.route("/:id")
  .get(getAnnualReportById)
  .put(updateAnnualReport)
  .delete(deleteAnnualReport);

module.exports = router;

