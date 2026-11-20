import { DataTypes } from "sequelize";
import { sequelize } from "../services/db.js";

export const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Інше",
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    date: {
      type: DataTypes.STRING,
      defaultValue: () => new Date().toLocaleDateString("uk-UA"),
    },
  },
  {
    tableName: "transactions",
    timestamps: false,
  }
);