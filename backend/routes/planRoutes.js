import express from "express";
import { createPlan, getPlans, deletePlan, markPlanCompleted, getPlanStats } from "../controllers/planController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validatePlanCreate } from "../middleware/validators.js";

const router = express.Router();

// All these routes are protected (user must be logged in)
router.post("/", protect, validatePlanCreate, createPlan);
router.get("/", protect, getPlans);
router.delete("/:id", protect, deletePlan);
router.put("/complete/:id", protect, markPlanCompleted);
router.get("/stats", protect, getPlanStats); 

export default router;
