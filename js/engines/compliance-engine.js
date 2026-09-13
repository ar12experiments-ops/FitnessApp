/**
 * Daily Plan Match & Adherence Compliance Engine
 * Calculates an objective, multi-factor compliance score (0 to 100%)
 * comparing a user's actual daily intake and physical activity against their weekly prescribed targets.
 * 
 * Formula:
 * Adherence Score = 0.35 * C_cal + 0.35 * C_protein + 0.20 * C_workout + 0.10 * C_fiber
 */

export function calculateDailyCompliance({
  targetCalories = 1800,
  consumedCalories = 0,
  targetProteinG = 110,
  consumedProteinG = 0,
  targetFiberG = 35,
  consumedFiberG = 0,
  prescribedExercisesCount = 4,
  completedExercisesCount = 0,
  prescribedWorkoutMinutes = 45,
  completedWorkoutMinutes = 0
}) {
  // 1. Caloric Accuracy Match (35% weight)
  // Penalizes deviation (both severe under-eating and over-eating)
  let calorieMatch = 0;
  if (targetCalories > 0 && consumedCalories > 0) {
    const diff = Math.abs(consumedCalories - targetCalories);
    const deviationPercent = (diff / targetCalories) * 100;
    calorieMatch = Math.max(0, 100 - deviationPercent);
  }

  // 2. Protein Floor Match (35% weight)
  // Hitting or exceeding protein floor is celebrated; capped at 100%
  let proteinMatch = 0;
  if (targetProteinG > 0) {
    proteinMatch = Math.min(100, (consumedProteinG / targetProteinG) * 100);
  }

  // 3. Workout Volume Match (20% weight)
  let workoutMatch = 0;
  if (prescribedExercisesCount > 0) {
    const exRatio = (completedExercisesCount / prescribedExercisesCount) * 100;
    const timeRatio = prescribedWorkoutMinutes > 0 ? (completedWorkoutMinutes / prescribedWorkoutMinutes) * 100 : exRatio;
    workoutMatch = Math.min(100, Math.max(exRatio, timeRatio));
  } else {
    // Rest day
    workoutMatch = 100;
  }

  // 4. Fiber Floor Match (10% weight)
  let fiberMatch = 0;
  if (targetFiberG > 0) {
    fiberMatch = Math.min(100, (consumedFiberG / targetFiberG) * 100);
  }

  // Calculate Weighted Total Score
  const rawScore = 0.35 * calorieMatch + 0.35 * proteinMatch + 0.20 * workoutMatch + 0.10 * fiberMatch;
  const overallScore = Math.round(Math.min(100, Math.max(0, rawScore)) * 10) / 10;

  let statusTier = "in_progress";
  let statusBadge = "Needs Alignment";
  let statusColor = "#FF2D55";

  if (overallScore >= 85) {
    statusTier = "optimal";
    statusBadge = "High Compliance";
    statusColor = "#00FF66";
  } else if (overallScore >= 65) {
    statusTier = "moderate";
    statusBadge = "Moderate Alignment";
    statusColor = "#FFB800";
  }

  return {
    overallScore,
    statusTier,
    statusBadge,
    statusColor,
    factors: {
      calorieMatch: Math.round(calorieMatch * 10) / 10,
      proteinMatch: Math.round(proteinMatch * 10) / 10,
      workoutMatch: Math.round(workoutMatch * 10) / 10,
      fiberMatch: Math.round(fiberMatch * 10) / 10
    },
    recommendations: generateComplianceFeedback({
      calorieMatch,
      proteinMatch,
      workoutMatch,
      fiberMatch,
      consumedProteinG,
      targetProteinG,
      consumedCalories,
      targetCalories
    })
  };
}

function generateComplianceFeedback({
  proteinMatch,
  consumedProteinG,
  targetProteinG,
  consumedCalories,
  targetCalories
}) {
  const notes = [];

  if (proteinMatch < 75) {
    const deficitG = Math.round(targetProteinG - consumedProteinG);
    notes.push(`Protein intake is ${deficitG}g below floor. Consider adding sprouted moong, 100g paneer/tofu, or 2 boiled eggs to hit your target.`);
  }

  if (consumedCalories < targetCalories - 300) {
    notes.push("Total calories are lower than prescribed. Severe deficits risk muscle catabolism and metabolic slowdown.");
  } else if (consumedCalories > targetCalories + 300) {
    notes.push("Total calories exceeded target. Watch hidden cooking oils in curries and sabzis.");
  }

  if (notes.length === 0) {
    notes.push("Telemetry matches your prescribed Indian metabolic plan. Excellent adherence!");
  }

  return notes;
}
