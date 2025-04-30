"use strict";

module.exports = (sequelize, DataTypes) => {
  const AnnualReport = sequelize.define(
    "AnnualReport",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Delete reports if company is deleted
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1990,
          max: new Date().getFullYear() + 1, // Allow current year + 1 for future planning
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "validated", "submitted", "error"),
        defaultValue: "draft",
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null if created automatically
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      // Add other relevant report details if needed
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      underscored: true, // Use snake_case for column names
      indexes: [
        {
          unique: true,
          fields: ["company_id", "year"], // Ensure only one report per company per year
        },
      ],
    }
  );

  AnnualReport.associate = (models) => {
    // Associations defined in models/index.js
  };

  return AnnualReport;
};

