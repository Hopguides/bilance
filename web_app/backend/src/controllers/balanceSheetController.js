const { BalanceSheet, AnnualReport } = require("../models"); // Adjust path as needed

// @desc    Get balance sheet for a specific annual report
// @route   GET /api/balance-sheets/annual-report/:reportId
// @access  Private
const getBalanceSheetByReportId = async (req, res, next) => {
  const { reportId } = req.params;
  try {
    const report = await AnnualReport.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: "Letno poročilo ni najdeno." });
    }

    // Authorization check
    if (report.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za dostop do tega poročila." });
    }

    const balanceSheet = await BalanceSheet.findOne({ where: { annual_report_id: reportId } });

    if (!balanceSheet) {
      // Should not happen if created with AnnualReport, but handle just in case
      return res.status(404).json({ message: "Bilanca stanja za to poročilo ni najdena." });
    }

    res.json(balanceSheet);
  } catch (error) {
    next(error);
  }
};

// @desc    Update balance sheet
// @route   PUT /api/balance-sheets/:id
// @access  Private
const updateBalanceSheet = async (req, res, next) => {
  const { id } = req.params; // This is the BalanceSheet ID
  const data = req.body;

  try {
    const balanceSheet = await BalanceSheet.findByPk(id, {
        include: { model: AnnualReport, attributes: ["company_id"] }
    });

    if (!balanceSheet) {
      return res.status(404).json({ message: "Bilanca stanja ni najdena." });
    }

    // Authorization check
    if (balanceSheet.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nimate dovoljenja za posodobitev te bilance stanja." });
    }

    // Update all fields provided in the body
    // Note: This is a basic update, no validation is performed here yet
    await balanceSheet.update(data);

    // Basic validation: Check if assets roughly equal liabilities + equity
    const assets = 
        (parseFloat(balanceSheet.intangible_assets) || 0) +
        (parseFloat(balanceSheet.tangible_assets) || 0) +
        (parseFloat(balanceSheet.investment_property) || 0) +
        (parseFloat(balanceSheet.long_term_financial_investments) || 0) +
        (parseFloat(balanceSheet.long_term_business_receivables) || 0) +
        (parseFloat(balanceSheet.deferred_tax_assets) || 0) +
        (parseFloat(balanceSheet.assets_for_sale) || 0) +
        (parseFloat(balanceSheet.inventory) || 0) +
        (parseFloat(balanceSheet.short_term_financial_investments) || 0) +
        (parseFloat(balanceSheet.short_term_business_receivables) || 0) +
        (parseFloat(balanceSheet.cash_and_cash_equivalents) || 0) +
        (parseFloat(balanceSheet.short_term_deferrals) || 0);

    const equityAndLiabilities = 
        (parseFloat(balanceSheet.called_up_capital) || 0) +
        (parseFloat(balanceSheet.capital_reserves) || 0) +
        (parseFloat(balanceSheet.reserves_from_profit) || 0) +
        (parseFloat(balanceSheet.revaluation_reserves) || 0) +
        (parseFloat(balanceSheet.fair_value_reserves) || 0) +
        (parseFloat(balanceSheet.retained_earnings) || 0) +
        (parseFloat(balanceSheet.net_profit_for_period) || 0) +
        (parseFloat(balanceSheet.provisions) || 0) +
        (parseFloat(balanceSheet.long_term_financial_liabilities) || 0) +
        (parseFloat(balanceSheet.long_term_business_liabilities) || 0) +
        (parseFloat(balanceSheet.deferred_tax_liabilities) || 0) +
        (parseFloat(balanceSheet.liabilities_for_sale) || 0) +
        (parseFloat(balanceSheet.short_term_financial_liabilities) || 0) +
        (parseFloat(balanceSheet.short_term_business_liabilities) || 0) +
        (parseFloat(balanceSheet.short_term_accruals) || 0);

    const difference = Math.abs(assets - equityAndLiabilities);
    const validation = {
        valid: difference < 0.01, // Allow for small floating point differences
        difference: difference,
        assets: assets,
        equityAndLiabilities: equityAndLiabilities,
        errors: difference >= 0.01 ? ["Vsota aktive se ne ujema z vsoto pasive."] : []
    };

    res.json({ balanceSheet, validation });

  } catch (error) {
    next(error);
  }
};

// Basic validation endpoint (can be expanded)
// @desc    Validate balance sheet
// @route   POST /api/balance-sheets/:id/validate
// @access  Private
const validateBalanceSheet = async (req, res, next) => {
    const { id } = req.params;
    try {
        const balanceSheet = await BalanceSheet.findByPk(id, {
            include: { model: AnnualReport, attributes: ["company_id"] }
        });

        if (!balanceSheet) {
            return res.status(404).json({ message: "Bilanca stanja ni najdena." });
        }

        // Authorization check
        if (balanceSheet.AnnualReport.company_id !== req.user.company_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Nimate dovoljenja za validacijo te bilance stanja." });
        }

        // Basic validation: Check if assets roughly equal liabilities + equity
        const assets = 
            (parseFloat(balanceSheet.intangible_assets) || 0) +
            (parseFloat(balanceSheet.tangible_assets) || 0) +
            (parseFloat(balanceSheet.investment_property) || 0) +
            (parseFloat(balanceSheet.long_term_financial_investments) || 0) +
            (parseFloat(balanceSheet.long_term_business_receivables) || 0) +
            (parseFloat(balanceSheet.deferred_tax_assets) || 0) +
            (parseFloat(balanceSheet.assets_for_sale) || 0) +
            (parseFloat(balanceSheet.inventory) || 0) +
            (parseFloat(balanceSheet.short_term_financial_investments) || 0) +
            (parseFloat(balanceSheet.short_term_business_receivables) || 0) +
            (parseFloat(balanceSheet.cash_and_cash_equivalents) || 0) +
            (parseFloat(balanceSheet.short_term_deferrals) || 0);

        const equityAndLiabilities = 
            (parseFloat(balanceSheet.called_up_capital) || 0) +
            (parseFloat(balanceSheet.capital_reserves) || 0) +
            (parseFloat(balanceSheet.reserves_from_profit) || 0) +
            (parseFloat(balanceSheet.revaluation_reserves) || 0) +
            (parseFloat(balanceSheet.fair_value_reserves) || 0) +
            (parseFloat(balanceSheet.retained_earnings) || 0) +
            (parseFloat(balanceSheet.net_profit_for_period) || 0) +
            (parseFloat(balanceSheet.provisions) || 0) +
            (parseFloat(balanceSheet.long_term_financial_liabilities) || 0) +
            (parseFloat(balanceSheet.long_term_business_liabilities) || 0) +
            (parseFloat(balanceSheet.deferred_tax_liabilities) || 0) +
            (parseFloat(balanceSheet.liabilities_for_sale) || 0) +
            (parseFloat(balanceSheet.short_term_financial_liabilities) || 0) +
            (parseFloat(balanceSheet.short_term_business_liabilities) || 0) +
            (parseFloat(balanceSheet.short_term_accruals) || 0);

        const difference = Math.abs(assets - equityAndLiabilities);
        const isValid = difference < 0.01; // Allow for small floating point differences
        const errors = isValid ? [] : ["Vsota aktive se ne ujema z vsoto pasive."];

        // Update AnnualReport status if valid
        if (isValid) {
            const report = await AnnualReport.findByPk(balanceSheet.annual_report_id);
            // Potentially update status based on all statements being valid
            // For now, just return validation result
        }

        res.json({ 
            valid: isValid, 
            errors: errors, 
            assets: assets.toFixed(2),
            equityAndLiabilities: equityAndLiabilities.toFixed(2),
            difference: difference.toFixed(2)
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
  getBalanceSheetByReportId,
  updateBalanceSheet,
  validateBalanceSheet,
};

