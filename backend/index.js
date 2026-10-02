import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/router/authRoutes.js";
import dashboardRoutes from "./src/router/dashboardRoutes.js";
import storeRoutes from "./src/router/storeRoutes.js";
import ratingRoutes from "./src/router/ratingRoutes.js";
import { createUsersTable } from "./src/models/userModel.js";
import { createStoresTable } from "./src/models/storeModel.js";
import { createRatingsTable } from "./src/models/ratingModel.js";

const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("JWT_SECRET and DATABASE_URL must be set in .env");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

createUsersTable()
  .then(createStoresTable)
  .then(createRatingsTable)
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to the database:", err.message);
    process.exit(1);
  });
