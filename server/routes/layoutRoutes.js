import express from "express";
import { updateLayout } from "../controllers/layoutController.js";

const router = express.Router();

router.post("/update", updateLayout);

export default router;