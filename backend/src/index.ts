import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./config/db";
import app from "./app";
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
  })
  .catch((err) => console.error("DB init error:", err));
