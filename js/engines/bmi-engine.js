/**
 * Asian-Indian BMI Classification Engine
 * Based on the Consensus Guidelines for Asian Indians (WHO Western Pacific / ICMR-NIN).
 * Normal weight cut-off is strictly 18.5 - 22.9 kg/m2, with overweight beginning at 23.0 kg/m2.
 */

export const INDIAN_BMI_TIERS = {
  UNDERWEIGHT: {
    key: "underweight",
    label: "Underweight",
    range: "< 18.5",
    color: "#00F0FF", // Cyan
    badgeClass: "badge-cyan",
    clinicalRisk: "Increased risk of nutritional deficiency, weakened immunity, and sarcopenia."
  },
  NORMAL: {
    key: "normal",
    label: "Normal Weight",
    range: "18.5 - 22.9",
    color: "#00FF66", // Cyber Laser Green
    badgeClass: "badge-optimal",
    clinicalRisk: "Healthy cardiometabolic baseline for Asian-Indian demographic."
  },
  OVERWEIGHT: {
    key: "overweight",
    label: "Overweight (Early Risk)",
    range: "23.0 - 24.9",
    color: "#FFB800", // Amber
    badgeClass: "badge-warning",
    clinicalRisk: "Elevated risk of insulin resistance, hypertriglyceridemia, and hypertension in South Asians."
  },
  OBESE: {
    key: "obese",
    label: "Obese (High Clinical Risk)",
    range: ">= 25.0",
    color: "#FF2D55", // Neon Crimson
    badgeClass: "badge-risk",
    clinicalRisk: "Severe risk of Type 2 Diabetes, Non-Alcoholic Fatty Liver Disease (NAFLD), and premature CAD."
  }
};

/**
 * Calculates BMI and classifies against Asian-Indian consensus boundaries
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {object} Calculated BMI and classification metadata
 */
export function calculateIndianBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      tier: null,
      message: "Please enter valid height and weight measurements."
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let tier = INDIAN_BMI_TIERS.OBESE;
  if (bmi < 18.5) {
    tier = INDIAN_BMI_TIERS.UNDERWEIGHT;
  } else if (bmi <= 22.9) {
    tier = INDIAN_BMI_TIERS.NORMAL;
  } else if (bmi <= 24.9) {
    tier = INDIAN_BMI_TIERS.OVERWEIGHT;
  }

  // Calculate position percentage across standard clinical display spectrum (12 to 36)
  const spectrumMin = 14;
  const spectrumMax = 32;
  const clampedBMI = Math.max(spectrumMin, Math.min(spectrumMax, bmi));
  const spectrumPercent = Math.round(((clampedBMI - spectrumMin) / (spectrumMax - spectrumMin)) * 100);

  return {
    bmi,
    tier,
    spectrumPercent,
    idealWeightRange: {
      minKg: Math.round(18.5 * heightM * heightM * 10) / 10,
      maxKg: Math.round(22.9 * heightM * heightM * 10) / 10
    }
  };
}
