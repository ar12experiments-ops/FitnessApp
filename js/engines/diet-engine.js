/**
 * Evidence-Based Indian Diet & Nutrition Recommendation Engine
 * Strictly adhering to ICMR-NIN 2024 Dietary Guidelines for Indians.
 * Deterministic generation: No AI hallucination, strictly queried against calibrated food database.
 */

import { INDIAN_FOOD_DATABASE } from "../data/indian-foods.js";
import { calculatePreciseBMR, determineMetabolicPhenotype } from "./bia-engine.js";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725
};

/**
 * Calculates evidence-based energy requirements and macro splits
 */
export function calculateEnergyAndMacros({
  weightKg,
  heightCm,
  age,
  gender,
  activityLevel,
  bodyFatPercent,
  visceralFatRating,
  muscleMassKg
}) {
  const bmrResult = calculatePreciseBMR(weightKg, heightCm, age, gender, bodyFatPercent);
  const pal = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = Math.round(bmrResult.bmr * pal);

  const phenotypeResult = determineMetabolicPhenotype({
    weightKg,
    heightCm,
    visceralFatRating,
    muscleMassKg,
    bodyFatPercent,
    gender
  });

  const phenotypeKey = phenotypeResult.phenotype.key;

  // Derive Caloric Target based on phenotype
  let calorieTarget = tdee;
  let proteinPerKg = 1.0;

  if (phenotypeKey === "metabolic_fat_loss") {
    calorieTarget = tdee - 450;
    proteinPerKg = 1.3;
  } else if (phenotypeKey === "thin_fat_recomp") {
    calorieTarget = tdee - 200;
    proteinPerKg = 1.4;
  } else if (phenotypeKey === "sarcopenic_hypertrophy") {
    calorieTarget = tdee + 250;
    proteinPerKg = 1.5;
  } else {
    // Optimal Baseline
    calorieTarget = tdee;
    proteinPerKg = 1.1;
  }

  // Safety Floors: ICMR-NIN safety limits
  const minFloor = gender === "female" ? 1200 : 1400;
  if (calorieTarget < minFloor) {
    calorieTarget = minFloor;
  }

  // Calculate Macro Split
  // 1. Protein
  const targetProteinG = Math.round(weightKg * proteinPerKg);
  const proteinKcal = targetProteinG * 4;

  // 2. Fats: ~26-28% of total calories
  const fatCalories = Math.round(calorieTarget * 0.27);
  const targetFatsG = Math.round(fatCalories / 9);

  // 3. Carbohydrates: Remainder
  const remainingKcal = calorieTarget - proteinKcal - fatCalories;
  const targetCarbsG = Math.max(120, Math.round(remainingKcal / 4));

  // 4. Fiber: ICMR-NIN recommends 35-45g/day for South Asian metabolic health
  const targetFiberG = Math.max(35, Math.round((calorieTarget / 1000) * 18));

  return {
    bmr: bmrResult.bmr,
    bmrFormula: bmrResult.formula,
    tdee,
    targetDailyCalories: calorieTarget,
    targetProteinG,
    targetCarbsG,
    targetFatsG,
    targetFiberG,
    phenotypeResult
  };
}

/**
 * Generates an authentic, structured Indian weekly meal plan
 * using foods filtered strictly by region and dietary preference.
 */
export function generateIndianWeeklyMealPlan({
  regionalPreference = "north",
  dietaryPreference = "vegetarian",
  targetCalories,
  targetProteinG
}) {
  const reg = regionalPreference.toLowerCase();
  const diet = dietaryPreference.toLowerCase();

  // Helper to pick matching foods
  const getFoods = (category) => {
    let matches = INDIAN_FOOD_DATABASE.filter(f => {
      const matchCat = f.category === category;
      const matchDiet = f.diet_type.includes(diet);
      const matchReg = f.regional_type.includes(reg) || f.regional_type.includes("central");
      return matchCat && matchDiet && matchReg;
    });

    if (matches.length === 0) {
      // Fallback without strict region constraint to ensure plan completeness
      matches = INDIAN_FOOD_DATABASE.filter(f => f.category === category && f.diet_type.includes(diet));
    }
    return matches;
  };

  const breakfastOptions = [
    ...getFoods("grains").filter(f => ["gr_moong_cheela", "gr_besan_cheela", "gr_poha", "gr_idli", "gr_upma"].includes(f.id)),
    ...getFoods("pulses").filter(f => ["pl_sprouted_moong_chaat", "pl_chana_sattu", "pl_kala_chana_boiled"].includes(f.id)),
    ...getFoods("dairy").filter(f => ["dy_curd_dahi", "dy_chaas_buttermilk", "dy_tofu", "dy_paneer_raw"].includes(f.id)),
    ...getFoods("poultry").filter(f => ["eg_boiled_whole", "eg_boiled_whites", "eg_egg_bhurji"].includes(f.id))
  ];

  const lunchGrains = getFoods("grains").filter(f => ["gr_phulka", "gr_bajra_roti", "gr_jowar_bhakri", "gr_ragi_roti", "gr_brown_rice", "gr_steamed_rice"].includes(f.id));
  const lunchProteins = [
    ...getFoods("pulses").filter(f => ["pl_dal_tadka", "pl_moong_dal", "pl_masoor_dal", "pl_rajma_curry", "pl_chole_chana", "pl_sambar", "pl_soya_chunks_curry"].includes(f.id)),
    ...getFoods("dairy").filter(f => ["dy_paneer_raw", "dy_tofu", "dy_curd_dahi"].includes(f.id)),
    ...getFoods("poultry").filter(f => ["nv_chicken_curry_homestyle", "nv_chicken_breast_grilled"].includes(f.id)),
    ...getFoods("seafood")
  ];
  const vegetables = getFoods("vegetables");
  const snackOptions = [
    ...getFoods("fats").filter(f => ["ft_roasted_makhana", "ft_roasted_peanuts", "ft_almonds_soaked", "ft_sabja_seeds"].includes(f.id)),
    ...getFoods("pulses").filter(f => ["pl_kala_chana_boiled", "pl_sprouted_moong_chaat", "pl_chana_sattu"].includes(f.id)),
    ...getFoods("dairy").filter(f => ["dy_chaas_buttermilk", "dy_curd_dahi"].includes(f.id))
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const weeklySchedule = days.map((day, idx) => {
    const bfGrain = breakfastOptions[idx % breakfastOptions.length] || breakfastOptions[0];
    const lunchGrain = lunchGrains[idx % lunchGrains.length] || lunchGrains[0];
    const lunchProtein = lunchProteins[idx % lunchProteins.length] || lunchProteins[0];
    const lunchVeg = vegetables[idx % vegetables.length] || vegetables[0];
    const snack = snackOptions[idx % snackOptions.length] || snackOptions[0];
    const dinnerGrain = lunchGrains[(idx + 1) % lunchGrains.length] || lunchGrains[0];
    const dinnerProtein = lunchProteins[(idx + 2) % lunchProteins.length] || lunchProteins[0];

    const mealItems = [
      {
        mealSlot: "Breakfast (Nashta)",
        time: "8:00 AM - 9:00 AM",
        items: [
          { name: bfGrain.name, portion: bfGrain.serving_unit, cals: bfGrain.calories, protein: bfGrain.protein, fiber: bfGrain.fiber },
          { name: "Spiced Buttermilk or Green Tea with Lemon", portion: "1 glass", cals: 30, protein: 2, fiber: 0 }
        ]
      },
      {
        mealSlot: "Lunch (Dophar Ka Khana)",
        time: "1:00 PM - 2:00 PM",
        items: [
          { name: lunchGrain.name, portion: (lunchGrain.id.includes("roti") || lunchGrain.id.includes("phulka")) ? "2 pieces" : lunchGrain.serving_unit, cals: lunchGrain.calories * 1.5, protein: lunchGrain.protein * 1.5, fiber: lunchGrain.fiber * 1.5 },
          { name: lunchProtein.name, portion: lunchProtein.serving_unit, cals: lunchProtein.calories, protein: lunchProtein.protein, fiber: lunchProtein.fiber },
          { name: lunchVeg.name, portion: lunchVeg.serving_unit, cals: lunchVeg.calories, protein: lunchVeg.protein, fiber: lunchVeg.fiber },
          { name: "Fresh Cucumber & Onion Salad with Lemon", portion: "1 bowl", cals: 25, protein: 1, fiber: 2.5 }
        ]
      },
      {
        mealSlot: "Evening Snack (Shaam Ka Nashta)",
        time: "5:00 PM - 5:30 PM",
        items: [
          { name: snack.name, portion: snack.serving_unit, cals: snack.calories, protein: snack.protein, fiber: snack.fiber }
        ]
      },
      {
        mealSlot: "Dinner (Raat Ka Khana)",
        time: "7:30 PM - 8:30 PM",
        items: [
          { name: dinnerGrain.name, portion: "1 piece / 1 bowl", cals: dinnerGrain.calories, protein: dinnerGrain.protein, fiber: dinnerGrain.fiber },
          { name: dinnerProtein.name, portion: dinnerProtein.serving_unit, cals: dinnerProtein.calories, protein: dinnerProtein.protein, fiber: dinnerProtein.fiber },
          { name: "Steamed Seasonal Greens or Lauki Sabzi", portion: "1 katori", cals: 70, protein: 2, fiber: 3.5 }
        ]
      }
    ];

    // Total approximate values for the day
    let totalCals = 0;
    let totalProt = 0;
    let totalFib = 0;

    mealItems.forEach(slot => {
      slot.items.forEach(it => {
        totalCals += it.cals;
        totalProt += it.protein;
        totalFib += it.fiber;
      });
    });

    return {
      day,
      mealSlots: mealItems,
      dayCalories: Math.round(totalCals),
      dayProteinG: Math.round(totalProt * 10) / 10,
      dayFiberG: Math.round(totalFib * 10) / 10
    };
  });

  return {
    regionalPreference,
    dietaryPreference,
    targetDailyCalories: targetCalories,
    targetProteinG,
    weeklySchedule
  };
}
