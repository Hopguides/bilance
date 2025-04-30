"use strict";

module.exports = (sequelize, DataTypes) => {
  const BalanceSheet = sequelize.define(
    "BalanceSheet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annual_report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure one balance sheet per annual report
        references: {
          model: "AnnualReports",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Assets (Aktiva)
      // A. Long-term assets
      intangible_assets: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      tangible_assets: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      investment_property: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      long_term_financial_investments: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      long_term_business_receivables: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      deferred_tax_assets: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      assets_for_sale: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Dolgoročna sredstva namenjena prodaji
      // B. Short-term assets
      inventory: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      short_term_financial_investments: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      short_term_business_receivables: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      cash_and_cash_equivalents: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      short_term_deferrals: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Kratkoročne aktivne časovne razmejitve
      
      // Liabilities and Equity (Pasiva)
      // A. Equity
      called_up_capital: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      capital_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      reserves_from_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      revaluation_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      fair_value_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      retained_earnings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      net_profit_for_period: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      // B. Provisions and long-term accruals
      provisions: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      // C. Long-term liabilities
      long_term_financial_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      long_term_business_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      deferred_tax_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      liabilities_for_sale: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Obveznosti iz sredstev za prodajo
      // D. Short-term liabilities
      short_term_financial_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      short_term_business_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      short_term_accruals: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Kratkoročne pasivne časovne razmejitve
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  BalanceSheet.associate = (models) => {
    // Associations defined in models/index.js
  };

  return BalanceSheet;
};

