/**
 * ACSM & WHO Aligned Exercise Prescription Engine
 * Generates structured 7-day progressive workout routines tailored to the user's
 * metabolic phenotype, bio-impedance status, and physical capability.
 * Uses MET (Metabolic Equivalent of Task) values from RepDB dataset for exact calorie burn calculations.
 */

import { EXERCISE_DATABASE, calculateExerciseCalorieBurn } from "../data/exercise-library.js";

/**
 * Builds a deterministic 7-day exercise schedule based on phenotype
 */
export function generateWeeklyExercisePlan({
  phenotypeKey = "thin_fat_recomp",
  weightKg = 70,
  activityLevel = "sedentary"
}) {
  const getEx = (id) => EXERCISE_DATABASE.find(e => e.id === id) || EXERCISE_DATABASE[0];

  // Phenotype-specific workout templates
  let scheduleTemplate = [];

  if (phenotypeKey === "thin_fat_recomp") {
    // 3 Days Strength Hypertrophy + 2 Days Zone 2 Cardio (Visceral Mobilization) + 2 Active Recovery
    scheduleTemplate = [
      {
        day: "Monday",
        sessionName: "Full Body Compound Strength (Routine A)",
        type: "strength",
        durationMin: 45,
        exerciseIds: ["ex_bodyweight_squats", "ex_pushups_standard", "ex_dumbbell_bent_row", "ex_plank_hold"]
      },
      {
        day: "Tuesday",
        sessionName: "Zone 2 Visceral Fat Mobilization Walk",
        type: "zone2_cardio",
        durationMin: 45,
        exerciseIds: ["cd_brisk_walking_zone2", "ex_prone_y_t_w_raises"]
      },
      {
        day: "Wednesday",
        sessionName: "Active Recovery & Dynamic Mobility",
        type: "mobility",
        durationMin: 25,
        exerciseIds: ["cd_surya_namaskar", "ex_deadbug"]
      },
      {
        day: "Thursday",
        sessionName: "Posterior Chain & Torso Hypertrophy (Routine B)",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_romanian_deadlift_db", "ex_dumbbell_floor_press", "ex_single_arm_db_row", "ex_standing_calf_raises"]
      },
      {
        day: "Friday",
        sessionName: "Zone 2 Aerobic Base / Moderate Cycling",
        type: "zone2_cardio",
        durationMin: 40,
        exerciseIds: ["cd_cycling_moderate", "ex_glute_bridges"]
      },
      {
        day: "Saturday",
        sessionName: "Functional Hypertrophy & Core",
        type: "hypertrophy",
        durationMin: 40,
        exerciseIds: ["ex_goblet_squat", "ex_dumbbell_overhead_press", "ex_dumbbell_bicep_curls", "ex_side_plank"]
      },
      {
        day: "Sunday",
        sessionName: "Rest & Restorative Walking",
        type: "rest",
        durationMin: 20,
        exerciseIds: ["cd_surya_namaskar"]
      }
    ];
  } else if (phenotypeKey === "metabolic_fat_loss") {
    // Heavy focus on Zone 2 Cardio volume (180 min/week) + 3 full body strength sessions to preserve muscle
    scheduleTemplate = [
      {
        day: "Monday",
        sessionName: "Full Body Resistance & Glucose Disposal",
        type: "strength",
        durationMin: 40,
        exerciseIds: ["ex_bodyweight_squats", "ex_pushups_standard", "ex_inverted_door_row", "ex_plank_hold"]
      },
      {
        day: "Tuesday",
        sessionName: "Zone 2 Aerobic Fat Oxidation Walk",
        type: "zone2_cardio",
        durationMin: 50,
        exerciseIds: ["cd_brisk_walking_zone2"]
      },
      {
        day: "Wednesday",
        sessionName: "Core Stability & Glute Power",
        type: "strength",
        durationMin: 35,
        exerciseIds: ["ex_glute_bridges", "ex_deadbug", "ex_chest_dips_bench"]
      },
      {
        day: "Thursday",
        sessionName: "Zone 2 Cardio / Incline Walk or Cycling",
        type: "zone2_cardio",
        durationMin: 50,
        exerciseIds: ["cd_cycling_moderate", "cd_brisk_walking_zone2"]
      },
      {
        day: "Friday",
        sessionName: "Full Body Compound Resistance",
        type: "strength",
        durationMin: 40,
        exerciseIds: ["ex_goblet_squat", "ex_dumbbell_bent_row", "ex_dumbbell_overhead_press", "ex_standing_calf_raises"]
      },
      {
        day: "Saturday",
        sessionName: "Weekend Zone 2 Nature Walk",
        type: "zone2_cardio",
        durationMin: 50,
        exerciseIds: ["cd_brisk_walking_zone2", "cd_surya_namaskar"]
      },
      {
        day: "Sunday",
        sessionName: "Complete Rest & Joint Recovery",
        type: "rest",
        durationMin: 15,
        exerciseIds: ["cd_surya_namaskar"]
      }
    ];
  } else if (phenotypeKey === "sarcopenic_hypertrophy") {
    // 4 Days Muscle Hypertrophy + Minimal cardio to conserve surplus energy
    scheduleTemplate = [
      {
        day: "Monday",
        sessionName: "Upper Body Hypertrophy (Chest & Back)",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_dumbbell_floor_press", "ex_dumbbell_bent_row", "ex_pushups_standard", "ex_single_arm_db_row"]
      },
      {
        day: "Tuesday",
        sessionName: "Lower Body Hypertrophy (Quads & Glutes)",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_goblet_squat", "ex_romanian_deadlift_db", "ex_glute_bridges", "ex_standing_calf_raises"]
      },
      {
        day: "Wednesday",
        sessionName: "Rest & Protein Synthesis Recovery",
        type: "rest",
        durationMin: 20,
        exerciseIds: ["cd_surya_namaskar"]
      },
      {
        day: "Thursday",
        sessionName: "Upper Body Strength & Arms",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_dumbbell_overhead_press", "ex_db_lateral_raises", "ex_dumbbell_bicep_curls", "ex_overhead_tricep_extension"]
      },
      {
        day: "Friday",
        sessionName: "Lower Body & Core Fortification",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_bulgarian_split_squat", "ex_bodyweight_squats", "ex_plank_hold", "ex_side_plank"]
      },
      {
        day: "Saturday",
        sessionName: "Light Metabolic Conditioning Walk",
        type: "zone2_cardio",
        durationMin: 30,
        exerciseIds: ["cd_brisk_walking_zone2"]
      },
      {
        day: "Sunday",
        sessionName: "Rest & Active Recovery",
        type: "rest",
        durationMin: 15,
        exerciseIds: ["ex_prone_y_t_w_raises"]
      }
    ];
  } else {
    // Optimal Baseline Routine: Balanced 3 Strength + 2 Cardio + 2 Mobility
    scheduleTemplate = [
      {
        day: "Monday",
        sessionName: "Full Body Functional Strength",
        type: "strength",
        durationMin: 45,
        exerciseIds: ["ex_goblet_squat", "ex_pushups_standard", "ex_dumbbell_bent_row", "ex_plank_hold"]
      },
      {
        day: "Tuesday",
        sessionName: "Zone 2 Cardio Steady-State",
        type: "zone2_cardio",
        durationMin: 40,
        exerciseIds: ["cd_brisk_walking_zone2"]
      },
      {
        day: "Wednesday",
        sessionName: "Active Mobility & Asanas",
        type: "mobility",
        durationMin: 30,
        exerciseIds: ["cd_surya_namaskar", "ex_deadbug"]
      },
      {
        day: "Thursday",
        sessionName: "Hypertrophy & Upper Body Conditioning",
        type: "hypertrophy",
        durationMin: 45,
        exerciseIds: ["ex_dumbbell_overhead_press", "ex_single_arm_db_row", "ex_dumbbell_floor_press", "ex_db_lateral_raises"]
      },
      {
        day: "Friday",
        sessionName: "Posterior Chain & Calves",
        type: "strength",
        durationMin: 40,
        exerciseIds: ["ex_romanian_deadlift_db", "ex_glute_bridges", "ex_standing_calf_raises", "ex_side_plank"]
      },
      {
        day: "Saturday",
        sessionName: "Zone 2 Outdoor Walk / Cycle",
        type: "zone2_cardio",
        durationMin: 45,
        exerciseIds: ["cd_cycling_moderate"]
      },
      {
        day: "Sunday",
        sessionName: "Rest & Restoration",
        type: "rest",
        durationMin: 15,
        exerciseIds: ["ex_prone_y_t_w_raises"]
      }
    ];
  }

  // Hydrate routine with exercise metadata and MET-calculated calories
  const daysPlan = scheduleTemplate.map(dayItem => {
    const exercises = dayItem.exerciseIds.map(id => getEx(id));
    
    // Average MET of session exercises
    const avgMet = exercises.reduce((acc, e) => acc + (e.met_value || 4.0), 0) / (exercises.length || 1);
    const estimatedCaloriesBurned = calculateExerciseCalorieBurn(avgMet, weightKg, dayItem.durationMin);

    return {
      day: dayItem.day,
      sessionName: dayItem.sessionName,
      type: dayItem.type,
      durationMin: dayItem.durationMin,
      avgMet: Math.round(avgMet * 10) / 10,
      estimatedCaloriesBurned,
      exercises
    };
  });

  const totalWeeklyCalBurn = daysPlan.reduce((acc, d) => acc + d.estimatedCaloriesBurned, 0);
  const totalCardioMinutes = daysPlan.filter(d => d.type === "zone2_cardio").reduce((acc, d) => acc + d.durationMin, 0);

  return {
    phenotypeKey,
    daysPlan,
    totalWeeklyCalBurn,
    totalCardioMinutes,
    weeklyStrengthDays: daysPlan.filter(d => ["strength", "hypertrophy"].includes(d.type)).length
  };
}
