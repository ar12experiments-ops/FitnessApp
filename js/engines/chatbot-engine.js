/**
 * Evidence-Based Fitness & Indian Nutrition Chatbot Engine: TransformNXT
 * Grounded in ICMR-NIN 2024 Dietary Guidelines, WHO Asia-Pacific Anthropometrics,
 * and ACSM Exercise Science Biomechanics. Zero hallucination.
 */

export const CHATBOT_KNOWLEDGE_BASE = [
  {
    keywords: ["protein", "vegetarian", "veg", "dal", "paneer", "sattu", "soya"],
    title: "High-Protein Indian Vegetarian Strategies (ICMR-NIN)",
    reply: `**Evidence-Based Protein for Indian Vegetarians:**
According to ICMR-NIN surveys, traditional Indian diets are often carbohydrate-heavy (>65% energy) with low protein density (<0.6 g/kg). Here is how to achieve 1.2–1.5 g/kg protein sustainably:

1. **Soya Chunks (Meal Maker):** Contains ~52g protein per 100g dry weight with a complete PDCAAS amino acid score of 1.0. A single 40g serving provides **~21g pure protein**.
2. **Low-Fat Cow Paneer / Tofu:** 100g of low-fat paneer delivers **~19g protein**, rich in slow-digesting casein. Tofu provides **~11.5g protein** with zero cholesterol.
3. **Cereal-Pulse Mutual Supplementation:** Lentils (dals) are deficient in methionine, while wheat/rice are deficient in lysine. Consuming **dal with roti/rice in a 1:2 or 1:3 ratio** creates a complete amino acid profile.
4. **Roasted Chana Sattu:** A glass of savory sattu drink (40g powder in water with jeera and lemon) yields **~10g protein** with high satiety.
5. **Sprouted Moong & Kala Chana:** Sprouting increases vitamin C and enhances protein bioavailability by breaking down phytates.`
  },
  {
    keywords: ["visceral", "visceral fat", "belly", "stomach", "organ fat", "vfr"],
    title: "Understanding & Reducing Visceral Fat in Indians",
    reply: `**The Science of Visceral Fat in South Asians:**
Visceral fat wraps around vital internal organs (liver, pancreas, intestines) and secretes pro-inflammatory cytokines, directly causing insulin resistance and premature CAD, even in people with normal body weight.

*   **Optimal Smart Scale Rating:** 1 – 9.
*   **Elevated / Pre-Risk:** 10 – 13.
*   **Hazardous Threshold:** $\ge 14$.

**Evidence-Based Reduction Protocol:**
1. **Zone 2 Aerobic Cardio (150–180 min/week):** Moderate-intensity steady-state walking (brisk walk at conversational pace) oxidizes fatty acids from visceral depots more effectively than high-intensity intervals that rely purely on glycogen.
2. **High Dietary Fiber ($\ge 35 - 40\text{g/day}$):** Soluble viscous fiber (oats, methi, sabja seeds, legumes) blunts post-prandial glycemic spikes.
3. **Eliminate Liquid Sugars & Refined Carbs:** Replace fruit juices, sweetened chai, and maida with whole millets (jowar, bajra, ragi) and whole pulses.`
  },
  {
    keywords: ["thin fat", "skinny fat", "phenotype", "skinny", "fat"],
    title: "The 'Thin-Fat' Indian Phenotype Explained",
    reply: `**What is the 'Thin-Fat' (Metabolically Obese Normal Weight) Phenotype?**
Due to evolutionary and genetic factors, South Asians frequently have a lower baseline skeletal muscle mass and higher body fat percentage at a BMI that Western charts label as "normal" (<25 kg/m²).

*   **Signs:** Normal or low scale weight, slim arms and legs, but significant visceral fat around the abdomen, accompanied by low stamina.
*   **The Big Mistake:** Doing extreme crash dieting or excessive endless cardio, which burns off remaining muscle and worsens metabolic rate.
*   **The Recomposition Solution:**
    *   Eat at **isocaloric maintenance** or a very mild deficit (150–200 kcal).
    *   Prioritize protein at **1.3 – 1.5 g/kg**.
    *   Perform **progressive resistance training 3–4 days/week** (squats, push-ups, rows, presses) to signal muscle protein synthesis.`
  },
  {
    keywords: ["bmi", "asian", "indian bmi", "cutoff", "weight"],
    title: "Asian-Indian Specific BMI Standards",
    reply: `**Why International BMI Doesn't Work for Indians:**
The standard international WHO classification sets the overweight threshold at $25\text{ kg/m}^2$. However, extensive clinical data from ICMR and the Asian-Pacific Consensus demonstrates that Indians manifest type 2 diabetes and hypertension at a BMI as low as $23.0\text{ kg/m}^2$.

*   **Underweight:** $< 18.5\text{ kg/m}^2$
*   **Normal (Healthy):** $18.5 - 22.9\text{ kg/m}^2$
*   **Overweight (Early Warning):** $23.0 - 24.9\text{ kg/m}^2$
*   **Obese:** $\ge 25.0\text{ kg/m}^2$

TransformNXT strictly monitors your telemetry against this calibrated Asian-Indian scale to detect metabolic risks before they manifest clinically.`
  },
  {
    keywords: ["roti", "rice", "carb", "carbohydrates", "white rice", "brown rice", "dalia"],
    title: "Roti vs. Rice: Navigating Indian Carbohydrate Staples",
    reply: `**Roti vs. Rice: The Scientific Comparison:**
Neither is inherently 'bad'—the deciding factors are portion size, fiber content, and glycemic index.

*   **1 Whole Wheat Phulka (~30g):** ~75 kcal, 2.7g protein, 2.3g fiber. Slower gastric emptying.
*   **1 Katori Cooked White Rice (~150g):** ~195 kcal, 3.8g protein, 0.6g fiber. High glycemic index.
*   **1 Katori Cooked Brown Rice (~150g):** ~168 kcal, 4.0g protein, 3.2g fiber. Lower glycemic response.
*   **Millets (Bajra, Jowar, Ragi):** Excellent for blood sugar management due to complex polyphenols and rich micronutrients (Ragi has 340mg calcium/100g).

**Pro-Tip:** Always pair rice or roti with an equal or greater portion of dal/paneer/chicken and raw salad to reduce the overall glycemic impact of the meal.`
  },
  {
    keywords: ["cardio", "strength", "weights", "workout", "exercise", "beginner"],
    title: "Balancing Strength vs. Cardio for Indian Beginners",
    reply: `**How to Structure Your Weekly Training:**
The American College of Sports Medicine (ACSM) recommends combining resistance training with cardiorespiratory conditioning:

1. **Resistance Training (3 Days/Week):**
   * Focus on fundamental compound multi-joint movements: Squats, Push-Ups, Bent Rows, Overhead Presses, Glute Bridges.
   * Promotes glucose uptake directly into muscle tissue without relying on insulin.
2. **Zone 2 Cardio (150 minutes/week):**
   * 30–45 minutes of brisk walking or cycling at a heart rate where you can talk but not sing.
   * Maximizes mitochondrial density and mobilizes visceral organ fat stores.
3. **Daily Step Target:** Aim for 7,000 to 10,000 steps daily to keep Non-Exercise Activity Thermogenesis (NEAT) high.`
  },
  {
    keywords: ["oil", "ghee", "fat", "cooking oil", "mustard oil", "saturated"],
    title: "Cooking Oils & Desi Ghee in Indian Cooking",
    reply: `**Evidence-Based Oil Guidelines (ICMR-NIN 2024):**
*   **Daily Recommended Limit:** Total visible fat should not exceed **20–25 grams (4–5 teaspoons)** per person per day.
*   **Desi Ghee:** Safe in moderation (1–2 tsp/day). Rich in butyric acid which nourishes gut lining, but high in saturated fat; should not be consumed in excess.
*   **Best Oils:** Cold-pressed Mustard Oil (ideal omega-3 to omega-6 ratio), Groundnut Oil, and Sesame Oil.
*   **The Trap:** Deep frying puris, bhaturas, and oily tadkas can easily turn a healthy 150 kcal dal into a 400 kcal fat bomb.`
  },
  {
    keywords: ["soreness", "doms", "muscle pain", "stiffness", "recovery"],
    title: "Post-Workout Muscle Soreness (DOMS)",
    reply: `**Managing Delayed Onset Muscle Soreness (DOMS):**
Soreness 24–48 hours after starting resistance training is a normal biological response to microscopic muscle fiber remodeling, not injury.

*   **Hydration & Electrolytes:** Drink water and spiced buttermilk (chaas) to replenish lost salts.
*   **Adequate Protein:** Ensure 1.2–1.5 g/kg protein to supply amino acids for muscle repair.
*   **Active Recovery:** Light walking and Surya Namaskar increase blood flow and flush metabolic waste.
*   **Sleep:** 7–8 hours of quality sleep is when the body secretes growth hormone for tissue recovery.`
  }
];

export function getChatbotResponse(userInput) {
  if (!userInput || !userInput.trim()) {
    return "Please ask a question regarding your Indian diet, smart scale metrics, or workout strategy.";
  }

  const query = userInput.toLowerCase();

  // Search knowledge base by matching keywords
  for (const item of CHATBOT_KNOWLEDGE_BASE) {
    for (const kw of item.keywords) {
      if (query.includes(kw)) {
        return item.reply;
      }
    }
  }

  // Fallback answer grounded in general ICMR & ACSM principles
  return `**Evidence-Based Clinical Guidance:**
Regarding your query, here are the core validated guidelines:

*   **For Diet:** Adhere to ICMR-NIN recommendations: Aim for 1.1–1.4 g/kg protein, restrict cooking oils to $\le 25\text{g/day}$, and consume $\ge 35\text{g}$ of dietary fiber from whole grains, dals, and vegetables.
*   **For Exercise:** Combine 150 minutes of Zone 2 steady-state walking with 3 full-body compound resistance sessions per week.
*   **For Body Composition:** Focus on reducing visceral fat (<9) and increasing skeletal muscle mass rather than looking solely at scale weight.

*Try asking about: "High protein vegetarian sources", "How to reduce visceral fat", "Thin-fat phenotype", or "Roti vs rice".*`;
}
