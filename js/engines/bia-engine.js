/**
 * Smart Scale Bio-impedance Analysis (BIA) & Metabolic Phenotype Engine
 * Ingests multi-frequency smart scale biomarkers:
 * - Visceral Fat Rating (1 - 59 scale; >13 is high cardiometabolic hazard)
 * - Skeletal Muscle Mass (kg and %)
 * - Subcutaneous Fat %
 * - Body Fat % & Lean Body Mass
 * - BMR (Katch-McArdle using smart scale LBM)
 */

import { calculateIndianBMI } from "./bmi-engine.js";

export const PHENOTYPE_PROFILES = {
  THIN_FAT_RECOMP: {
    key: "thin_fat_recomp",
    title: "Thin-Fat Phenotype (Metabolically Obese Normal Weight)",
    badge: "Body Recomposition Required",
    description: "Common in South Asians: Normal or borderline BMI combined with elevated visceral fat and lower skeletal muscle mass.",
    strategy: "Mild deficit or isocaloric intake with elevated protein (1.3 - 1.5 g/kg). Pair 3-4 days of progressive resistance training with 150 min Zone 2 cardio to mobilize visceral stores while building lean muscle.",
    color: "#00FF66"
  },
  METABOLIC_FAT_LOSS: {
    key: "metabolic_fat_loss",
    title: "Metabolic Fat Loss Protocol",
    badge: "Insulin Sensitivity & Deficit Focus",
    description: "Elevated BMI (>= 23.0) and high visceral fat rating (>= 10), presenting elevated risk for insulin resistance.",
    strategy: "Structured moderate caloric deficit (350 - 500 kcal). Prioritize high fiber (>= 38g/day), 150-180 min Zone 2 cardio for visceral fat oxidation, and full-body compound resistance training to prevent muscle loss.",
    color: "#FF2D55"
  },
  SARCOPENIC_HYPERTROPHY: {
    key: "sarcopenic_hypertrophy",
    title: "Skeletal Muscle Hypertrophy Protocol",
    badge: "Muscle Mass Accretion",
    description: "Low skeletal muscle mass with normal visceral fat levels, presenting future frailty and low metabolic rate risk.",
    strategy: "Slight caloric surplus (+200 to +300 kcal) with high protein intake (1.4 - 1.6 g/kg). Progressive overload resistance training focusing on compound mechanical tension.",
    color: "#00F0FF"
  },
  OPTIMAL_BASELINE: {
    key: "optimal_baseline",
    title: "Cardiometabolic Optimization Baseline",
    badge: "Performance & Longevity",
    description: "Healthy Asian-Indian BMI (18.5 - 22.9), visceral fat within normal range (<= 9), and robust skeletal muscle mass.",
    strategy: "Isocaloric maintenance. Balanced ICMR-NIN macro split (50% Carbs, 20% Protein, 30% Healthy Fats) with 150 min aerobic work and 3 resistance sessions per week.",
    color: "#00FF66"
  }
};

/**
 * Evaluates Visceral Fat Rating (VFR)
 * @param {number} vfr - Visceral Fat Rating (1 to 59 scale)
 */
export function evaluateVisceralFat(vfr) {
  const rating = Number(vfr) || 0;
  if (rating <= 9) {
    return {
      rating,
      tier: "Normal",
      status: "optimal",
      color: "#00FF66",
      summary: "Within safe biological threshold. Minimal abdominal organ adiposity."
    };
  } else if (rating <= 13) {
    return {
      rating,
      tier: "Elevated / Pre-Risk",
      status: "warning",
      color: "#FFB800",
      summary: "Borderline visceral adiposity. Action recommended to avoid insulin desensitization."
    };
  } else {
    return {
      rating,
      tier: "High Cardiometabolic Hazard",
      status: "risk",
      color: "#FF2D55",
      summary: "Critical abdominal organ fat accumulation. High correlation with fatty liver and atherosclerosis in South Asians."
    };
  }
}

/**
 * Evaluates Skeletal Muscle Mass Percentage against sex/age norms
 * @param {number} musclePercent - Skeletal Muscle % from smart scale
 * @param {string} gender - 'male' or 'female'
 */
export function evaluateMuscleMass(musclePercent, gender) {
  const smm = Number(musclePercent) || 0;
  const isMale = gender === "male";

  const lowCutoff = isMale ? 32 : 25;
  const highCutoff = isMale ? 38 : 31;

  if (smm < lowCutoff) {
    return {
      smm,
      tier: "Low / Sarcopenic Risk",
      status: "warning",
      color: "#FFB800",
      summary: `Below typical benchmark (${lowCutoff}%). Sarcopenia risk; priority on resistance training and protein.`
    };
  } else if (smm <= highCutoff) {
    return {
      smm,
      tier: "Standard / Healthy",
      status: "optimal",
      color: "#00FF66",
      summary: `Within healthy reference range (${lowCutoff}% - ${highCutoff}%).`
    };
  } else {
    return {
      smm,
      tier: "High / Athletic",
      status: "optimal",
      color: "#00FF66",
      summary: `Above average muscular development (> ${highCutoff}%). High metabolic resilience.`
    };
  }
}

/**
 * Calculates BMR using Katch-McArdle if Lean Body Mass is known, with Mifflin-St Jeor fallback
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {string} gender
 * @param {number} bodyFatPercent
 */
export function calculatePreciseBMR(weightKg, heightCm, age, gender, bodyFatPercent) {
  // If smart scale provides valid body fat %, use Katch-McArdle (most accurate for body composition)
  if (bodyFatPercent && bodyFatPercent > 5 && bodyFatPercent < 60) {
    const lbmKg = weightKg * (1 - bodyFatPercent / 100);
    const bmr = 370 + 21.6 * lbmKg;
    return {
      bmr: Math.round(bmr),
      formula: "Katch-McArdle (Lean Body Mass)",
      lbmKg: Math.round(lbmKg * 10) / 10
    };
  }

  // Fallback: Mifflin-St Jeor
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === "female" ? bmr - 161 : bmr + 5;

  return {
    bmr: Math.round(bmr),
    formula: "Mifflin-St Jeor Formula",
    lbmKg: null
  };
}

/**
 * Classifies holistic metabolic phenotype from combined smart scale telemetry
 */
export function determineMetabolicPhenotype({
  weightKg,
  heightCm,
  visceralFatRating,
  muscleMassKg,
  bodyFatPercent,
  gender
}) {
  const bmiData = calculateIndianBMI(weightKg, heightCm);
  const bmi = bmiData.bmi;
  const vfr = Number(visceralFatRating) || 8;

  // Calculate muscle percentage if not direct
  let musclePercent = 0;
  if (muscleMassKg && weightKg > 0) {
    musclePercent = (muscleMassKg / weightKg) * 100;
  }
  const muscleEval = evaluateMuscleMass(musclePercent, gender);
  const vfrEval = evaluateVisceralFat(vfr);

  let phenotype = PHENOTYPE_PROFILES.OPTIMAL_BASELINE;

  if (vfr >= 10 && bmi >= 23.0) {
    phenotype = PHENOTYPE_PROFILES.METABOLIC_FAT_LOSS;
  } else if (vfr >= 10 && bmi < 23.0) {
    phenotype = PHENOTYPE_PROFILES.THIN_FAT_RECOMP;
  } else if (vfr <= 9 && muscleEval.status === "warning") {
    phenotype = PHENOTYPE_PROFILES.SARCOPENIC_HYPERTROPHY;
  } else if (bmi >= 23.0) {
    phenotype = PHENOTYPE_PROFILES.METABOLIC_FAT_LOSS;
  }

  return {
    phenotype,
    bmiData,
    vfrEval,
    muscleEval,
    musclePercent: Math.round(musclePercent * 10) / 10
  };
}
