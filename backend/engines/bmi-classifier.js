/**
 * Asian-Indian BMI Classification Engine (Backend Mirror)
 * Calibrated against WHO Western Pacific & ICMR-NIN Asian-Indian cutoffs
 */

const INDIAN_BMI_TIERS = {
  UNDERWEIGHT: {
    key: "underweight",
    label: "Underweight",
    range: "< 18.5",
    color: "#0284C7",
    clinicalRisk: "Increased risk of nutritional deficiency, weakened immunity, and sarcopenia."
  },
  NORMAL: {
    key: "normal",
    label: "Normal Weight",
    range: "18.5 - 22.9",
    color: "#10B981",
    clinicalRisk: "Healthy cardiometabolic baseline for Asian-Indian demographic."
  },
  OVERWEIGHT: {
    key: "overweight",
    label: "Overweight (Early Risk)",
    range: "23.0 - 24.9",
    color: "#F59E0B",
    clinicalRisk: "Elevated risk of insulin resistance, hypertriglyceridemia, and hypertension in South Asians."
  },
  OBESE: {
    key: "obese",
    label: "Obese (High Clinical Risk)",
    range: ">= 25.0",
    color: "#EF4444",
    clinicalRisk: "Severe risk of Type 2 Diabetes, Non-Alcoholic Fatty Liver Disease (NAFLD), and premature CAD."
  }
};

function calculateIndianBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, tier: null, message: "Invalid measurements." };
  }
  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let tier = INDIAN_BMI_TIERS.NORMAL;
  if (bmi < 18.5) tier = INDIAN_BMI_TIERS.UNDERWEIGHT;
  else if (bmi >= 25.0) tier = INDIAN_BMI_TIERS.OBESE;
  else if (bmi >= 23.0) tier = INDIAN_BMI_TIERS.OVERWEIGHT;

  return { bmi, tier };
}

module.exports = {
  INDIAN_BMI_TIERS,
  calculateIndianBMI
};
