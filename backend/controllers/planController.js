import YogaPlan from "../models/Plan.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSMS } from "../utils/sendSMS.js";

export const createPlan = async (req, res) => {
  try {
    const {
      planName,
      yogaType,
      meditationTime,
      durationWeeks,
      dailySchedule,
      notes,
    } = req.body;

    const plan = new YogaPlan({
      user: req.user.id,
      planName,
      yogaType,
      meditationTime,
      durationWeeks,
      dailySchedule,
      notes,
    });

    await plan.save();

    // ✅ Send Email (make sure req.user.email and req.user.name exist)
    if (req.user.email) {
      try {
        await sendEmail(
          req.user.email,
          "🧘 Yoga Plan Created Successfully",
          `Hi ${req.user.name || "User"},\n\nYour yoga plan "${
            plan.planName
          }" has been created successfully!\nKeep practicing and stay consistent.\n\n- Yoga Planner App`
        );
      } catch (emailError) {
        console.error("Failed to send plan creation email:", emailError);
      }
    }

    // ✅ Send SMS (make sure req.user.phone exists)
    if (req.user.phone) {
      try {
        await sendSMS(
          req.user.phone,
          `Hi ${req.user.name || "User"}, your yoga plan "${
            plan.planName
          }" is ready! Stay consistent 🧘‍♂️`
        );
      } catch (smsError) {
        console.error("Failed to send plan creation SMS:", smsError);
      }
    }

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res
      .status(500)
      .json({ message: "Error creating plan", error: err.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    // Validate user ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only return plans belonging to the authenticated user
    const plans = await YogaPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    console.error("User object:", req.user);
    res
      .status(500)
      .json({ message: "Error fetching plans", error: err.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await YogaPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Authorization check: Ensure user owns the plan
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "Unauthorized: You can only delete your own plans" 
      });
    }

    await YogaPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting plan:", err);
    res
      .status(500)
      .json({ message: "Error deleting plan", error: err.message });
  }
};

// mark as completed
export const markPlanCompleted = async (req, res) => {
  try {
    const plan = await YogaPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Authorization check: Ensure user owns the plan
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "Unauthorized: You can only modify your own plans" 
      });
    }

    plan.completed = true;
    await plan.save();

    // sending mail notification for completion
    if (req.user.email) {
      try {
        await sendEmail(
          req.user.email,
          "🎉 Yoga Plan Completed",
          `Hi ${req.user.name || "User"},\n\nCongratulations! You have completed your yoga plan "${
            plan.planName
          }"!\n\nKeep up the great work and stay consistent.\n\n- Yoga Planner App`
        );
      } catch (emailError) {
        console.error("Failed to send completion email:", emailError);
      }
    }

    res.json({ message: "Plan marked as completed", plan });
  } catch (err) {
    console.error("❌ Error marking plan as completed:", err);
    res
      .status(500)
      .json({ message: "Error marking plan as completed", error: err.message });
  }
};


// Get plan statistics
export const getPlanStats = async (req, res) => {
  try {
    // Validate user ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only count plans belonging to the authenticated user
    const totalPlans = await YogaPlan.countDocuments({ user: req.user.id });
    const completedPlans = await YogaPlan.countDocuments({ 
      user: req.user.id, 
      completed: true 
    });
    const pendingPlans = totalPlans - completedPlans;
    const completionRate = totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;

    res.json({
      totalPlans,
      completedPlans,
      pendingPlans,
      completionRate: Math.round(completionRate * 100) / 100 // Round to 2 decimal places
    });
  } catch (err) {
    console.error("❌ Error fetching plan statistics:", err);
    console.error("User object:", req.user);
    res.status(500).json({ 
      message: "Error fetching plan statistics", 
      error: err.message 
    });
  }
};