const { AnnualReport, Company, BalanceSheet, IncomeStatement, CashFlowStatement, EquityStatement } = require("../models"); // Adjust path as needed

// @desc    Get all annual reports for the logged-in user's company
// @route   GET /api/annual-reports
// @access  Private
const getAnnualReports = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware
    if (!req.user.company_id) {
      return res.status(400).json({ message: "Uporabnik ni povezan s podjetjem." });
    }

    const reports = await AnnualReport.findAll({
      where: { company_id: req.user.company_id },
      order: [["year", "DESC"]], // Order by year descending
      include: [
        { model: Company, attributes: ["name"] }, // Include company name
        // Optionally include basic status of related statements
      ],
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific annual report by ID
// @route   GET /api/annual-reports/:id
// @access  Private
const getAnnualReportById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const report = await AnnualReport.findByPk(id, {
      include: [
        { model: Company },
        { model: BalanceSheet },
        { model: IncomeStatement },
        { model: CashFlowStatement },
        { model: EquityStatement },
        // Add Export and Submission models if needed
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Letno poročilo ni najdeno." });
    }

    // Authorization check: Ensure the report belongs to the user's company
    if (report.company_id !== req.user.company_id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Nimate dovoljenja za dostop do tega poročila." });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new annual report
// @route   POST /api/annual-reports
// @access  Private
const createAnnualReport = async (req, res, next) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).json({ message: "Leto je obvezno polje." });
  }

  if (!req.user.company_id) {
    return res.status(400).json({ message: "Uporabnik ni povezan s podjetjem." });
  }

  const transaction = await AnnualReport.sequelize.transaction();

  try {
    // Check if report for this year already exists
    const existingReport = await AnnualReport.findOne({
      where: { company_id: req.user.company_id, year: year },
    });

    if (existingReport) {
      await transaction.rollback();
      return res.status(400).json({ message: `Letno poročilo za leto ${year} že obstaja.` });
    }

    // Create the annual report
    const newReport = await AnnualReport.create({
      company_id: req.user.company_id,
      year: year,
      status: "draft",
      updated_by: req.user.id,
    }, { transaction });

    // Create associated empty financial statements
    await BalanceSheet.create({ annual_report_id: newReport.id }, { transaction });
    await IncomeStatement.create({ annual_report_id: newReport.id }, { transaction });
    await CashFlowStatement.create({ annual_report_id: newReport.id }, { transaction });
    await EquityStatement.create({ annual_report_id: newReport.id }, { transaction });

    await transaction.commit();

    // Fetch the created report with associations to return
    const createdReport = await AnnualReport.findByPk(newReport.id, {
        include: [Company]
    });

    res.status(201).json(createdReport);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// @desc    Update annual report status (or other fields)
// @route   PUT /api/annual-reports/:id
// @access  Private
const updateAnnualReport = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // Only allow updating status for now, add other fields if needed

  try {
    const report = await AnnualReport.findByPk(id);

    if (!report) {
      return res.status(404).json({ message: "Letno poročilo ni najdeno." });
    }

    // Authorization check
    if (report.company_id !== req.user.company_id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Nimate dovoljenja za posodobitev tega poročila." });
    }

    // Update status if provided
    if (status && ["draft", "validated", "submitted", "error"].includes(status)) {
      report.status = status;
      if (status === 'submitted') {
          report.submission_date = new Date(); // Set submission date when status changes to submitted
      }
    }
    report.updated_by = req.user.id;

    await report.save();

    res.json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an annual report
// @route   DELETE /api/annual-reports/:id
// @access  Private (Potentially restricted)
const deleteAnnualReport = async (req, res, next) => {
    const { id } = req.params;
    try {
        const report = await AnnualReport.findByPk(id);

        if (!report) {
            return res.status(404).json({ message: "Letno poročilo ni najdeno." });
        }

        // Authorization check
        if (report.company_id !== req.user.company_id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Nimate dovoljenja za brisanje tega poročila." });
        }

        // Prevent deletion of submitted reports?
        // if (report.status === 'submitted') {
        //     return res.status(400).json({ message: "Oddanih poročil ni mogoče brisati." });
        // }

        await report.destroy(); // This will also delete associated statements due to CASCADE

        res.json({ message: "Letno poročilo uspešno izbrisano." });
    } catch (error) {
        next(error);
    }
};


module.exports = {
  getAnnualReports,
  getAnnualReportById,
  createAnnualReport,
  updateAnnualReport,
  deleteAnnualReport,
};

