"use strict";

module.exports = (sequelize, DataTypes) => {
  const EquityStatement = sequelize.define(
    "EquityStatement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annual_report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure one equity statement per annual report
        references: {
          model: "AnnualReports",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Equity Statement Fields (based on SRS 23)
      // Columns for Beginning Balance
      beginning_called_up_capital: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_capital_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_reserves_from_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_revaluation_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_fair_value_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_retained_earnings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      beginning_net_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Usually 0, but included for completeness
      
      // Columns for Changes during the year
      changes_called_up_capital: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      changes_capital_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      changes_reserves_from_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      changes_revaluation_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      changes_fair_value_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      changes_retained_earnings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      net_profit_for_period: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // The main change driver
      
      // Columns for Ending Balance
      ending_called_up_capital: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_capital_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_reserves_from_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_revaluation_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_fair_value_reserves: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_retained_earnings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
      ending_net_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Should match net_profit_for_period if not distributed
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  EquityStatement.associate = (models) => {
    // Associations defined in models/index.js
  };

  return EquityStatement;
};

