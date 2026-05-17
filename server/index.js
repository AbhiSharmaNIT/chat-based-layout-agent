import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import layoutRoutes from "./routes/layoutRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/layout", layoutRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});