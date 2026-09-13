/**
 * Onboarding Gate View Component: TransformNXT
 * Compulsory onboarding wizard that collects demographic and smart-scale data
 * before granting access to personalized telemetry, plans, and tracker.
 */

import { dbService } from "../storage/db.js";
import { calculateIndianBMI } from "../engines/bmi-engine.js";
import { calculateEnergyAndMacros, generateIndianWeeklyMealPlan } from "../engines/diet-engine.js";
import { generateWeeklyExercisePlan } from "../engines/workout-engine.js";

export class OnboardingView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-onboarding");
    this.currentStep = 1;
    this.formData = {
      name: "",
      age: 28,
      gender: "male",
      dietary_preference: "vegetarian",
      region_cuisine: "north",
      activity_level: "sedentary",
      weight_kg: 72.0,
      height_cm: 172.0,
      visceral_fat_rating: 11,
      muscle_mass_kg: 28.5,
      body_fat_percent: 24.5,
      subcutaneous_fat_percent: 19.5,
      body_water_percent: 53.0
    };
  }

  async render() {
    this.container.innerHTML = `
      <div style="max-width: 720px; margin: 40px auto;">
        
        <!-- Welcome Brand Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: var(--accent-green-subtle); border: 2px solid var(--accent-green); border-radius: var(--radius-md); color: var(--accent-green); margin-bottom: 16px; box-shadow: 0 4px 16px var(--accent-green-glow);">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary);">
            Welcome to Transform<span style="color: var(--accent-orange);">NXT</span>
          </h1>
          <p style="color: var(--text-secondary); font-size: 1rem; max-width: 520px; margin: 8px auto 0;">
            Personalized, evidence-based fitness and nutrition telemetry engineered strictly for the Indian demographic.
          </p>
        </div>

        <!-- Progress Steps Indicator -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; position: relative;">
          <div style="position: absolute; top: 18px; left: 15%; right: 15%; height: 2px; background: #E2E8F0; z-index: 0;"></div>
          
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1;">
            <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; ${this.currentStep >= 1 ? 'background: var(--accent-green); color: #FFFFFF;' : 'background: #E2E8F0; color: var(--text-muted);'}">
              1
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; color: ${this.currentStep === 1 ? 'var(--text-primary)' : 'var(--text-muted)'};">Profile</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1;">
            <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; ${this.currentStep >= 2 ? 'background: var(--accent-green); color: #FFFFFF;' : 'background: #E2E8F0; color: var(--text-muted);'}">
              2
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; color: ${this.currentStep === 2 ? 'var(--text-primary)' : 'var(--text-muted)'};">Diet & Region</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1;">
            <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; ${this.currentStep >= 3 ? 'background: var(--accent-orange); color: #FFFFFF;' : 'background: #E2E8F0; color: var(--text-muted);'}">
              3
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; color: ${this.currentStep === 3 ? 'var(--text-primary)' : 'var(--text-muted)'};">Smart Scale</span>
          </div>
        </div>

        <!-- Wizard Card -->
        <div class="glass-card" style="padding: 32px;">
          <form id="onboarding-form">
            ${this.renderStepContent()}
          </form>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderStepContent() {
    if (this.currentStep === 1) {
      return `
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">Step 1: Your Personal Profile</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 20px;">
            Let's establish your biological baseline to calculate calibrated Asian-Indian health metrics.
          </p>

          <div class="form-group">
            <label class="form-label" for="ob-name">What should we call you?</label>
            <input type="text" class="form-input" id="ob-name" placeholder="Enter your full name" value="${this.formData.name}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label" for="ob-age">Age (Years)</label>
              <input type="number" class="form-input" id="ob-age" min="15" max="95" value="${this.formData.age}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-gender">Biological Sex</label>
              <select class="form-select" id="ob-gender">
                <option value="male" ${this.formData.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${this.formData.gender === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
            <button type="button" class="btn-green" id="btn-ob-next-1">
              Next: Diet & Lifestyle
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 2) {
      return `
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">Step 2: Dietary & Cultural Preferences</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 20px;">
            TransformNXT customizes meal plans using regional Indian staple ingredients without alien Western fads.
          </p>

          <div class="form-group">
            <label class="form-label" for="ob-diet">Dietary Pattern</label>
            <select class="form-select" id="ob-diet">
              <option value="vegetarian" ${this.formData.dietary_preference === 'vegetarian' ? 'selected' : ''}>Lacto-Vegetarian (Dairy, Legumes, Grains, Vegetables)</option>
              <option value="eggetarian" ${this.formData.dietary_preference === 'eggetarian' ? 'selected' : ''}>Eggetarian (Includes Eggs, Dairy, Plant foods)</option>
              <option value="non_vegetarian" ${this.formData.dietary_preference === 'non_vegetarian' ? 'selected' : ''}>Non-Vegetarian (Poultry, Fish, Eggs, Plant foods)</option>
              <option value="vegan" ${this.formData.dietary_preference === 'vegan' ? 'selected' : ''}>Vegan (100% Plant-Based)</option>
              <option value="jain" ${this.formData.dietary_preference === 'jain' ? 'selected' : ''}>Jain Vegetarian (Strictly no onion, garlic, or root vegetables)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-region">Regional Cuisine Archetype</label>
            <select class="form-select" id="ob-region">
              <option value="north" ${this.formData.region_cuisine === 'north' ? 'selected' : ''}>North Indian (Roti/Phulka, Toor/Rajma/Chhole, Paneer, Sabzis)</option>
              <option value="south" ${this.formData.region_cuisine === 'south' ? 'selected' : ''}>South Indian (Idli/Dosa, Sambar, Ragi, Fish Curry, Sundal)</option>
              <option value="west" ${this.formData.region_cuisine === 'west' ? 'selected' : ''}>West Indian (Jowar/Bajra Bhakri, Sprouts, Poha, Peanuts)</option>
              <option value="east" ${this.formData.region_cuisine === 'east' ? 'selected' : ''}>East Indian (Rice, Sattu, Fish, Leafy Greens/Shak)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ob-activity">Daily Physical Activity Level</label>
            <select class="form-select" id="ob-activity">
              <option value="sedentary" ${this.formData.activity_level === 'sedentary' ? 'selected' : ''}>Sedentary (Desk Job, &lt; 4,000 daily steps)</option>
              <option value="light" ${this.formData.activity_level === 'light' ? 'selected' : ''}>Lightly Active (Occasional walks, 5,000 - 7,000 steps)</option>
              <option value="moderate" ${this.formData.activity_level === 'moderate' ? 'selected' : ''}>Moderately Active (Structured exercise 3-4 days/week)</option>
              <option value="heavy" ${this.formData.activity_level === 'heavy' ? 'selected' : ''}>Very Active (Daily intense physical training)</option>
            </select>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 24px;">
            <button type="button" class="btn-glass" id="btn-ob-back-1">Back</button>
            <button type="button" class="btn-green" id="btn-ob-next-2">
              Next: Smart Scale Data
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    } else {
      return `
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">Step 3: Smart Weight Scale (BIA) Biomarkers</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 20px;">
            Input measurements provided by your smart body impedance scale. If you don't have all metrics, estimates will be derived.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label" for="ob-weight">Weight (kg)*</label>
              <input type="number" class="form-input" id="ob-weight" step="0.1" value="${this.formData.weight_kg}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-height">Height (cm)*</label>
              <input type="number" class="form-input" id="ob-height" step="0.5" value="${this.formData.height_cm}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 8px;">
            <div class="form-group">
              <label class="form-label" for="ob-vfr">Visceral Fat Level (1-59)*</label>
              <input type="number" class="form-input" id="ob-vfr" min="1" max="59" value="${this.formData.visceral_fat_rating}" required />
              <span style="font-size: 0.6875rem; color: var(--text-muted);">Normal: 1-9 | High: &gt;13</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-muscle">Skeletal Muscle (kg)</label>
              <input type="number" class="form-input" id="ob-muscle" step="0.1" value="${this.formData.muscle_mass_kg}" />
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-bodyfat">Body Fat %</label>
              <input type="number" class="form-input" id="ob-bodyfat" step="0.1" value="${this.formData.body_fat_percent}" />
            </div>
          </div>

          <div class="clinical-notice" style="margin-top: 16px;">
            <strong>Zero-Hallucination Assurance:</strong> All data stays stored in your browser's IndexedDB. Your telemetry is evaluated against the WHO Asian-Indian BMI cutoff (Overweight $\ge 23\text{ kg/m}^2$) and ICMR-NIN dietary guidelines.
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 24px;">
            <button type="button" class="btn-glass" id="btn-ob-back-2">Back</button>
            <button type="submit" class="btn-orange" style="padding: 14px 28px;">
              Unlock My Telemetry & Plan
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>
        </div>
      `;
    }
  }

  attachEvents() {
    // Step 1 Next
    document.getElementById("btn-ob-next-1")?.addEventListener("click", () => {
      const name = document.getElementById("ob-name").value.trim();
      const age = parseInt(document.getElementById("ob-age").value, 10);
      const gender = document.getElementById("ob-gender").value;

      if (!name) {
        alert("Please enter your name to proceed.");
        return;
      }

      this.formData.name = name;
      this.formData.age = age;
      this.formData.gender = gender;
      this.currentStep = 2;
      this.render();
    });

    // Step 2 Back & Next
    document.getElementById("btn-ob-back-1")?.addEventListener("click", () => {
      this.currentStep = 1;
      this.render();
    });

    document.getElementById("btn-ob-next-2")?.addEventListener("click", () => {
      this.formData.dietary_preference = document.getElementById("ob-diet").value;
      this.formData.region_cuisine = document.getElementById("ob-region").value;
      this.formData.activity_level = document.getElementById("ob-activity").value;
      this.currentStep = 3;
      this.render();
    });

    // Step 3 Back & Final Submit
    document.getElementById("btn-ob-back-2")?.addEventListener("click", () => {
      this.currentStep = 2;
      this.render();
    });

    const form = document.getElementById("onboarding-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const weight_kg = parseFloat(document.getElementById("ob-weight").value);
        const height_cm = parseFloat(document.getElementById("ob-height").value);
        const visceral_fat_rating = parseInt(document.getElementById("ob-vfr").value, 10);
        const muscle_mass_kg = parseFloat(document.getElementById("ob-muscle").value) || (weight_kg * 0.4);
        const body_fat_percent = parseFloat(document.getElementById("ob-bodyfat").value) || 24;

        this.formData.weight_kg = weight_kg;
        this.formData.height_cm = height_cm;
        this.formData.visceral_fat_rating = visceral_fat_rating;
        this.formData.muscle_mass_kg = muscle_mass_kg;
        this.formData.body_fat_percent = body_fat_percent;

        const userId = "usr_" + Date.now();
        const user = {
          user_id: userId,
          name: this.formData.name,
          age: this.formData.age,
          gender: this.formData.gender,
          dietary_preference: this.formData.dietary_preference,
          region_cuisine: this.formData.region_cuisine,
          activity_level: this.formData.activity_level,
          created_at: new Date().toISOString()
        };
        await dbService.saveUser(user);

        // BMI & Health Log
        const bmiCalc = calculateIndianBMI(weight_kg, height_cm);
        const logId = "hl_" + Date.now();
        const healthLog = {
          log_id: logId,
          user_id: userId,
          timestamp: new Date().toISOString(),
          weight_kg,
          height_cm,
          bmi_calculated: bmiCalc.bmi,
          visceral_fat_rating,
          subcutaneous_fat_percent: this.formData.subcutaneous_fat_percent,
          muscle_mass_kg,
          body_fat_percent,
          body_water_percent: this.formData.body_water_percent
        };
        await dbService.addHealthLog(healthLog);

        // Energy & Macros
        const energyData = calculateEnergyAndMacros({
          weightKg: weight_kg,
          heightCm: height_cm,
          age: this.formData.age,
          gender: this.formData.gender,
          activityLevel: this.formData.activity_level,
          bodyFatPercent: body_fat_percent,
          visceralFatRating: visceral_fat_rating,
          muscleMassKg: muscle_mass_kg
        });

        // Weekly Plans
        const mealPlan = generateIndianWeeklyMealPlan({
          regionalPreference: this.formData.region_cuisine,
          dietaryPreference: this.formData.dietary_preference,
          targetCalories: energyData.targetDailyCalories,
          targetProteinG: energyData.targetProteinG
        });

        const exercisePlan = generateWeeklyExercisePlan({
          phenotypeKey: energyData.phenotypeResult.phenotype.key,
          weightKg: weight_kg,
          activityLevel: this.formData.activity_level
        });

        const weeklyPlan = {
          plan_id: "wp_" + Date.now(),
          user_id: userId,
          created_at: new Date().toISOString(),
          phenotype_tag: energyData.phenotypeResult.phenotype.key,
          target_daily_calories: energyData.targetDailyCalories,
          target_protein_g: energyData.targetProteinG,
          target_carbs_g: energyData.targetCarbsG,
          target_fats_g: energyData.targetFatsG,
          target_fiber_g: energyData.targetFiberG,
          tdee: energyData.tdee,
          bmr: energyData.bmr,
          meal_plan_template: mealPlan,
          exercise_routine: exercisePlan
        };
        await dbService.saveWeeklyPlan(weeklyPlan);

        // Notify and unlock Dashboard
        this.app.showNotification(`Welcome, ${user.name}! Your Asian-Indian telemetry is unlocked.`);
        await this.app.updateHeaderUser();
        this.app.navigateTo("dashboard");
      });
    }
  }
}
