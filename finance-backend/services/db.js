import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Якщо підключаємось до хмарного Render, потрібен SSL
const isProduction = process.env.DATABASE_URL?.includes("render.com");

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // sync() автоматично створить таблицю Transactions у PostgreSQL, якщо її ще немає
    await sequelize.sync();
    console.log("PostgreSQL connected & synchronized successfully");
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};