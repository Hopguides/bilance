"use strict";

module.exports = (sequelize, DataTypes) => {
  const CashFlowStatement = sequelize.define(
    "CashFlowStatement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annual_report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure one cash flow statement per annual report
        references: {
          model: "AnnualReports",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // Cash Flow Statement Fields (based on SRS 22 and common practice)
      beginning_balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Začetno stanje denarnih sredstev
      
      // A. Operating Activities
      operating_inflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Prejemki iz poslovanja
      operating_outflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Izdatki iz poslovanja
      
      // B. Investing Activities
      investing_inflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Prejemki iz nalaganja
      investing_outflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Izdatki iz nalaganja
      
      // C. Financing Activities
      financing_inflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Prejemki iz financiranja
      financing_outflows: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Izdatki iz financiranja
      
      // Ending Balance
      end_balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 }, // Končno stanje denarnih sredstev
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
    }
  );

  CashFlowStatement.associate = (models) => {
    // Associations defined in models/index.js
  };

  return CashFlowStatement;
};

