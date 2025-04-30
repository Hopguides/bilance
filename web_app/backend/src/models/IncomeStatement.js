"use strict";

module.exports = (sequelize, DataTypes) => {
  const IncomeStatement = sequelize.define(
    "IncomeStatement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annual_report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure one income statement per annual report
        references: {
          model: "AnnualReports",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Revenues
      net_sales_revenue: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      change_in_inventory_value: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      capitalized_own_products: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      other_operating_revenue: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_revenue_from_shares: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_revenue_from_loans: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_revenue_from_receivables: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      other_revenue: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Drugi finančni prihodki
      
      // Expenses
      costs_of_goods_materials_services: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      labor_costs: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      write_offs: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Amortizacija in drugi odpisi
      other_operating_expenses: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_expenses_from_impairment: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_expenses_from_liabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      financial_expenses_from_payables: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      other_expenses: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Drugi finančni odhodki
      income_tax: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      deferred_tax: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      
      // Net Profit
      net_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Čisti poslovni izid poslovnega leta
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  IncomeStatement.associate = (models) => {
    // Associations defined in models/index.js
  };

  return IncomeStatement;
};

