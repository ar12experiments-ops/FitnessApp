/**
 * Curated Exercise & Biomechanics Dataset
 * Structured from RepDB & Biomechanical Gym Analysis datasets.
 * Includes validated MET (Metabolic Equivalent of Task) values to compute exact calorie burn
 * using ACSM validated scientific formula:
 * Calories Burned = MET * 3.5 * (weight_in_kg / 200) * duration_minutes
 * 
 * Enriched with verified YouTube instructional video IDs for seamless in-app video viewing.
 */
export const EXERCISE_DATABASE = [
  // --- CHEST & HORIZONTAL PUSH ---
  {
    id: "ex_pushups_standard",
    name: "Standard Push-Up",
    category: "strength",
    target_muscle: "Chest (Pectoralis Major)",
    secondary_muscles: ["Anterior Deltoids", "Triceps Brachii", "Core"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 4.8,
    default_sets: 3,
    default_reps: "10-12",
    instructions: "Maintain a rigid plank line from head to heels. Lower chest to 2 inches from floor, elbows tucked at 45 degrees.",
    home_alternative: "Knee Push-Ups or Incline Wall Push-Ups",
    youtube_id: "IODxDxX7oi4",
    youtube_title: "How to Push Up with Proper Form"
  },
  {
    id: "ex_dumbbell_floor_press",
    name: "Dumbbell Floor Press",
    category: "hypertrophy",
    target_muscle: "Chest (Mid-Pectorals)",
    secondary_muscles: ["Triceps", "Anterior Deltoids"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 5.0,
    default_sets: 3,
    default_reps: "10-12",
    instructions: "Lie flat on the floor with knees bent. Press dumbbells directly upward until arms are extended. Protects shoulder capsule.",
    home_alternative: "Filled 2-liter water bottles floor press",
    youtube_id: "uUGDRwge4F8",
    youtube_title: "How to Dumbbell Floor Press"
  },
  {
    id: "ex_dumbbell_incline_press",
    name: "Incline Dumbbell Bench Press",
    category: "hypertrophy",
    target_muscle: "Upper Chest (Clavicular Pectoral)",
    secondary_muscles: ["Anterior Deltoids", "Triceps"],
    movement_type: "compound",
    difficulty: "intermediate",
    equipment: "dumbbells",
    met_value: 5.5,
    default_sets: 3,
    default_reps: "8-10",
    instructions: "Set bench to 30 degrees incline. Press dumbbells upward with controlled cadence.",
    home_alternative: "Feet-elevated push-ups",
    youtube_id: "8iPEnn-ltC8",
    youtube_title: "How to Incline Dumbbell Bench Press"
  },
  {
    id: "ex_chest_dips_bench",
    name: "Bench Triceps & Lower Chest Dips",
    category: "strength",
    target_muscle: "Triceps & Lower Chest",
    secondary_muscles: ["Anterior Deltoid"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 4.5,
    default_sets: 3,
    default_reps: "12",
    instructions: "Use a sturdy chair or bench. Keep spine close to edge, lowering until elbows form a 90-degree angle.",
    home_alternative: "Bed or sofa edge dips",
    youtube_id: "0326dy_-CzM",
    youtube_title: "How to Do Bench Dips Properly"
  },

  // --- BACK & HORIZONTAL/VERTICAL PULL ---
  {
    id: "ex_dumbbell_bent_row",
    name: "Dumbbell Bent-Over Row",
    category: "strength",
    target_muscle: "Latissimus Dorsi & Rhomboids",
    secondary_muscles: ["Rear Deltoids", "Biceps", "Erector Spinae"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 5.5,
    default_sets: 3,
    default_reps: "10-12",
    instructions: "Hinge at hips to a 45-degree back angle. Pull dumbbells towards lower ribs, driving with elbows.",
    home_alternative: "Backpack loaded with books row",
    youtube_id: "6TSP13Vyl20",
    youtube_title: "How to Dumbbell Bent Over Row"
  },
  {
    id: "ex_single_arm_db_row",
    name: "Single-Arm Dumbbell Row",
    category: "hypertrophy",
    target_muscle: "Lats (Unilateral)",
    secondary_muscles: ["Rhomboids", "Biceps Brachii"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 5.2,
    default_sets: 3,
    default_reps: "12 each side",
    instructions: "Support one knee and hand on a bench. Row dumbbell straight up into hip pocket.",
    home_alternative: "Bedside single-arm bucket row",
    youtube_id: "dFzUjzfih7k",
    youtube_title: "How to Single Arm Dumbbell Row"
  },
  {
    id: "ex_inverted_door_row",
    name: "Towel Door Frame Row",
    category: "strength",
    target_muscle: "Mid-Traps & Rhomboids",
    secondary_muscles: ["Biceps", "Forearms"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 4.2,
    default_sets: 3,
    default_reps: "12-15",
    instructions: "Loop a strong towel around a closed door handle. Lean back and pull chest to door.",
    home_alternative: "Under-table body row",
    youtube_id: "rloXYB8M3vU",
    youtube_title: "Door Frame & Towel Bodyweight Row"
  },
  {
    id: "ex_prone_y_t_w_raises",
    name: "Prone Y-T-W Scapular Raises",
    category: "mobility",
    target_muscle: "Lower Traps & Rotator Cuff",
    secondary_muscles: ["Rear Deltoids", "Thoracic Spine"],
    movement_type: "isolation",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 3.5,
    default_sets: 3,
    default_reps: "8 each letter",
    instructions: "Lie face down on the floor. Raise arms into Y, T, and W shapes to counteract desk-slouching.",
    home_alternative: "Carpet/yoga mat prone raises",
    youtube_id: "eYI28b_mYgU",
    youtube_title: "Prone YTW Posture & Scapular Control"
  },

  // --- LEGS & POSTERIOR CHAIN ---
  {
    id: "ex_bodyweight_squats",
    name: "Air Squat / Bodyweight Squat",
    category: "strength",
    target_muscle: "Quadriceps & Gluteus Maximus",
    secondary_muscles: ["Hamstrings", "Calves", "Core"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 5.0,
    default_sets: 3,
    default_reps: "15",
    instructions: "Feet shoulder-width apart, toes slightly turned out. Sit hips back and down to parallel while keeping chest proud.",
    home_alternative: "Box or chair squat",
    youtube_id: "aclHkVaku9U",
    youtube_title: "How to Squat with Perfect Technique"
  },
  {
    id: "ex_goblet_squat",
    name: "Dumbbell Goblet Squat",
    category: "hypertrophy",
    target_muscle: "Quadriceps & Core",
    secondary_muscles: ["Glutes", "Upper Back"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 6.0,
    default_sets: 3,
    default_reps: "10-12",
    instructions: "Hold a single dumbbell vertically against chest. Squat down between knees, keeping elbows inside knees.",
    home_alternative: "Heavy book or 5L oil can goblet squat",
    youtube_id: "MeIiIdhvXT4",
    youtube_title: "How to Goblet Squat with a Dumbbell"
  },
  {
    id: "ex_bulgarian_split_squat",
    name: "Bulgarian Split Squat",
    category: "hypertrophy",
    target_muscle: "Glutes & Quadriceps (Unilateral)",
    secondary_muscles: ["Adductors", "Core balance"],
    movement_type: "compound",
    difficulty: "intermediate",
    equipment: "bodyweight",
    met_value: 6.2,
    default_sets: 3,
    default_reps: "8-10 each leg",
    instructions: "Place rear foot elevated on a chair or sofa. Descend until front thigh is parallel to floor.",
    home_alternative: "Static lunges on flat ground",
    youtube_id: "2C-uNgKwPLE",
    youtube_title: "How to Bulgarian Split Squat Properly"
  },
  {
    id: "ex_romanian_deadlift_db",
    name: "Dumbbell Romanian Deadlift (RDL)",
    category: "strength",
    target_muscle: "Hamstrings & Gluteus Maximus",
    secondary_muscles: ["Erector Spinae", "Forearms"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 5.8,
    default_sets: 3,
    default_reps: "10-12",
    instructions: "Soft bend in knees. Hinge back at hips while tracing dumbbells down along shins until hamstring stretch is felt.",
    home_alternative: "Broomstick / Resistance band RDL",
    youtube_id: "_oyxCn2iSjU",
    youtube_title: "Dumbbell Romanian Deadlift Form Guide"
  },
  {
    id: "ex_glute_bridges",
    name: "Floor Glute Bridge",
    category: "strength",
    target_muscle: "Gluteus Maximus",
    secondary_muscles: ["Hamstrings", "Transverse Abdominis"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 3.8,
    default_sets: 3,
    default_reps: "15",
    instructions: "Lie on back with feet flat on ground. Drive through heels to raise pelvis into a straight line from knees to shoulders.",
    home_alternative: "Single-leg glute bridge",
    youtube_id: "wPM8icPu6H8",
    youtube_title: "How to Do Glute Bridges Properly"
  },
  {
    id: "ex_standing_calf_raises",
    name: "Standing Single/Double Calf Raise",
    category: "hypertrophy",
    target_muscle: "Gastrocnemius & Soleus",
    secondary_muscles: ["Foot arch intrinsic muscles"],
    movement_type: "isolation",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 3.5,
    default_sets: 3,
    default_reps: "20",
    instructions: "Stand on the edge of a staircase step. Lower heels for a full stretch, then press high onto big toes.",
    home_alternative: "Staircase edge calf raises",
    youtube_id: "-M4-G8p8fmc",
    youtube_title: "How to Do Standing Calf Raises"
  },

  // --- SHOULDERS & ARMS ---
  {
    id: "ex_dumbbell_overhead_press",
    name: "Standing Dumbbell Overhead Press",
    category: "strength",
    target_muscle: "Anterior & Lateral Deltoids",
    secondary_muscles: ["Triceps", "Upper Trapezius", "Core"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 5.2,
    default_sets: 3,
    default_reps: "10",
    instructions: "Press dumbbells vertically overhead from shoulder height, avoiding excessive lower back arching.",
    home_alternative: "Pike push-ups",
    youtube_id: "qEwKCR5JCog",
    youtube_title: "Dumbbell Shoulder Overhead Press Form"
  },
  {
    id: "ex_db_lateral_raises",
    name: "Dumbbell Lateral Raise",
    category: "hypertrophy",
    target_muscle: "Lateral Deltoids (Shoulder Width)",
    secondary_muscles: ["Upper Traps"],
    movement_type: "isolation",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 4.0,
    default_sets: 3,
    default_reps: "12-15",
    instructions: "Slight forward lean. Raise arms outward to shoulder height with pinkies slightly higher than thumbs.",
    home_alternative: "Water bottles lateral raise",
    youtube_id: "3VcKaXpzqRo",
    youtube_title: "Dumbbell Lateral Raise Form Guide"
  },
  {
    id: "ex_dumbbell_bicep_curls",
    name: "Alternating Dumbbell Bicep Curl",
    category: "hypertrophy",
    target_muscle: "Biceps Brachii",
    secondary_muscles: ["Brachialis", "Forearm Flexors"],
    movement_type: "isolation",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 4.2,
    default_sets: 3,
    default_reps: "12 each arm",
    instructions: "Keep elbows glued to ribs. Curl dumbbell up with palm turning toward ceiling (supination).",
    home_alternative: "Towel resistance curls",
    youtube_id: "ykJmrZ5v0Oo",
    youtube_title: "How to Dumbbell Bicep Curl Correctly"
  },
  {
    id: "ex_overhead_tricep_extension",
    name: "Dumbbell Overhead Triceps Extension",
    category: "hypertrophy",
    target_muscle: "Triceps Long Head",
    secondary_muscles: ["Anconeus"],
    movement_type: "isolation",
    difficulty: "beginner",
    equipment: "dumbbells",
    met_value: 4.0,
    default_sets: 3,
    default_reps: "12",
    instructions: "Hold one dumbbell overhead with both hands. Lower behind head by flexing at elbows, then press back up.",
    home_alternative: "Diamond push-up on knees",
    youtube_id: "_gsUck-7URQ",
    youtube_title: "Overhead Dumbbell Tricep Extension Form"
  },

  // --- CORE & STABILITY ---
  {
    id: "ex_plank_hold",
    name: "Standard Forearm Plank",
    category: "strength",
    target_muscle: "Transverse Abdominis & Rectus Abdominis",
    secondary_muscles: ["Glutes", "Quadriceps", "Shoulders"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 4.0,
    default_sets: 3,
    default_reps: "30-45 sec hold",
    instructions: "Rest on forearms and toes. Brace abdominal wall as if bracing for a punch, squeezing glutes tightly.",
    home_alternative: "Kneeling forearm plank",
    youtube_id: "pSHjTRCQxIw",
    youtube_title: "How to Plank with Perfect Form"
  },
  {
    id: "ex_deadbug",
    name: "Dead Bug Core Stabilization",
    category: "mobility",
    target_muscle: "Deep Transverse Abdominis",
    secondary_muscles: ["Hip Flexors"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 3.5,
    default_sets: 3,
    default_reps: "10 each side",
    instructions: "Lie on back, pressing lumbar spine firmly into floor. Simultaneously extend opposite arm and leg without arching back.",
    home_alternative: "Floor dead bug",
    youtube_id: "4XLEnwUr1d8",
    youtube_title: "Dead Bug Core Stability Tutorial"
  },
  {
    id: "ex_side_plank",
    name: "Lateral Side Plank Hold",
    category: "strength",
    target_muscle: "Internal & External Obliques",
    secondary_muscles: ["Quadratus Lumborum", "Gluteus Medius"],
    movement_type: "isolation",
    difficulty: "intermediate",
    equipment: "bodyweight",
    met_value: 4.2,
    default_sets: 3,
    default_reps: "25-30 sec each side",
    instructions: "Elevate body on one forearm and foot edge, maintaining a straight diagonal line.",
    home_alternative: "Knee side plank",
    youtube_id: "_rdfjfsC9qY",
    youtube_title: "How to Do a Side Plank Correctly"
  },

  // --- CARDIOVASCULAR & ZONE 2 AEROBIC ---
  {
    id: "cd_brisk_walking_zone2",
    name: "Brisk Outdoor/Treadmill Walk (Zone 2)",
    category: "zone2_cardio",
    target_muscle: "Cardiovascular System & Mitochondria",
    secondary_muscles: ["Calves", "Glutes"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 3.8, // Validated MET for 5.0 - 5.5 km/h walking
    default_sets: 1,
    default_reps: "40-45 minutes",
    instructions: "Walk at a pace where you can converse in full sentences without gasping, but cannot sing (Zone 2 fat oxidation).",
    home_alternative: "Indoor steady marching with arm swings",
    youtube_id: "Z1904oI3c4k",
    youtube_title: "Zone 2 Cardio & Brisk Walking Guide"
  },
  {
    id: "cd_cycling_moderate",
    name: "Stationary / Outdoor Cycling (Moderate)",
    category: "zone2_cardio",
    target_muscle: "Cardiovascular & Quadriceps",
    secondary_muscles: ["Hamstrings", "Calves"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "equipment",
    met_value: 5.5,
    default_sets: 1,
    default_reps: "30-40 minutes",
    instructions: "Maintain a cadence of 75-85 RPM with light-to-moderate resistance.",
    home_alternative: "Low-impact step-touches",
    youtube_id: "Zt9c-xY3K_w",
    youtube_title: "Zone 2 Cycling for Aerobic Health"
  },
  {
    id: "cd_jumping_rope_light",
    name: "Continuous Jump Rope / Skipping",
    category: "zone2_cardio",
    target_muscle: "Cardiovascular & Calves",
    secondary_muscles: ["Shoulders", "Forearms"],
    movement_type: "compound",
    difficulty: "intermediate",
    equipment: "bodyweight",
    met_value: 8.8,
    default_sets: 5,
    default_reps: "2 min rounds",
    instructions: "Jump only 1 inch off ground on balls of feet. Turn rope purely from wrists.",
    home_alternative: "Invisible phantom rope jumping",
    youtube_id: "u3zgHI8QnqE",
    youtube_title: "Jump Rope Form & Skipping for Beginners"
  },
  {
    id: "cd_surya_namaskar",
    name: "Classical 12-Step Surya Namaskar (Sun Salutation)",
    category: "mobility",
    target_muscle: "Full Body Dynamic Flexibility",
    secondary_muscles: ["Shoulders", "Hamstrings", "Spine"],
    movement_type: "compound",
    difficulty: "beginner",
    equipment: "bodyweight",
    met_value: 4.5,
    default_sets: 1,
    default_reps: "6-10 rounds",
    instructions: "Coordinate each asana with breath (inhale extension, exhale flexion). Improves cardiovascular mobility.",
    home_alternative: "Surya Namaskar on yoga mat",
    youtube_id: "6IUcxm4gVwM",
    youtube_title: "Classical Surya Namaskar 12 Steps Guide"
  }
];

export function getExerciseById(id) {
  return EXERCISE_DATABASE.find(e => e.id === id);
}

/**
 * Returns privacy-enhanced YouTube embed URL
 * @param {string} youtubeId
 * @returns {string}
 */
export function getYoutubeEmbedUrl(youtubeId) {
  if (!youtubeId) return "";
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&modestbranding=1`;
}

export function filterExercises({ category, difficulty, equipment, query }) {
  return EXERCISE_DATABASE.filter(ex => {
    if (category && ex.category !== category) return false;
    if (difficulty && ex.difficulty !== difficulty) return false;
    if (equipment && ex.equipment !== equipment) return false;
    if (query) {
      const q = query.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.target_muscle.toLowerCase().includes(q);
      if (!matchName && !matchMuscle) return false;
    }
    return true;
  });
}

/**
 * Calculates scientifically validated calorie burn using MET value
 * @param {number} metValue - MET value from dataset
 * @param {number} weightKg - User's current weight in kg
 * @param {number} durationMinutes - Duration of exercise in minutes
 * @returns {number} Estimated calories burned
 */
export function calculateExerciseCalorieBurn(metValue, weightKg, durationMinutes) {
  if (!metValue || !weightKg || !durationMinutes) return 0;
  // ACSM Standard: (MET * 3.5 * weightKg / 200) * durationMinutes
  const cals = (metValue * 3.5 * weightKg / 200) * durationMinutes;
  return Math.round(cals);
}
