/**
 * Profile View Component: TransformNXT (Light Minimalist Glass)
 * Handles user demographics and smart weight machine bio-impedance data entry.
 */

import { dbService } from "../storage/db.js";
import { calculateIndianBMI } from "../engines/bmi-engine.js";
import { calculateEnergyAndMacros, generateIndianWeeklyMealPlan } from "../engines/diet-engine.js";
import { generateWeeklyExercisePlan } from "../engines/workout-engine.js";

export class ProfileView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-profile");
  }

  async render() {
    const user = await dbService.getCurrentUser();
    const latestLog = user ? await dbService.getLatestHealthLog(user.user_id) : null;

    const name = user ? user.name : "Arjun Sharma";
    const age = user ? user.age : 32;
    const gender = user ? user.gender : "male";
    const diet = user ? user.dietary_preference : "vegetarian";
    const region = user ? user.region_cuisine : "north";
    const activity = user ? user.activity_level : "sedentary";

    const weight = latestLog ? latestLog.weight_kg : 74.0;
    const height = latestLog ? latestLog.height_cm : 175;
    const vfr = latestLog ? latestLog.visceral_fat_rating : 11;
    const bodyFat = latestLog ? latestLog.body_fat_percent : 25.5;
    const muscle = latestLog ? latestLog.muscle_mass_kg : 28.8;
    const subFat = latestLog ? latestLog.subcutaneous_fat_percent : 20.0;
    const water = latestLog ? latestLog.body_water_percent : 53.0;

    this.container.innerHTML = `
      <div style="max-width: 880px; margin: 0 auto;">
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <span class="telemetry-badge badge-optimal">YOUR PROFILE</span>
              <span class="brand-tag">ASIAN-INDIAN STANDARDS</span>
            </div>
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary);">Your Profile & Body Metrics</h1>
          </div>
          <button class="btn-orange btn-sm" id="btn-reset-onboarding">
            Rerun Onboarding Wizard
          </button>
        </div>

        <form id="profile-form">
          <!-- Step 1: Demographics & Lifestyle -->
          <div class="glass-card" style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">1. Demographics & Dietary Background</h2>
              <span class="telemetry-badge badge-cyan">CULTURAL CALIBRATION</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="prof-name">Full Name</label>
                <input class="form-input" type="text" id="prof-name" value="${name}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-age">Age (Years)</label>
                <input class="form-input" type="number" id="prof-age" min="15" max="100" value="${age}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-gender">Biological Sex</label>
                <select class="form-select" id="prof-gender">
                  <option value="male" ${gender === "male" ? "selected" : ""}>Male</option>
                  <option value="female" ${gender === "female" ? "selected" : ""}>Female</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 10px;">
              <div class="form-group">
                <label class="form-label" for="prof-diet">Dietary Preference</label>
                <select class="form-select" id="prof-diet">
                  <option value="vegetarian" ${diet === "vegetarian" ? "selected" : ""}>Vegetarian (Lacto-Veg)</option>
                  <option value="eggetarian" ${diet === "eggetarian" ? "selected" : ""}>Eggetarian (Includes Eggs)</option>
                  <option value="non_vegetarian" ${diet === "non_vegetarian" ? "selected" : ""}>Non-Vegetarian (Poultry & Fish)</option>
                  <option value="vegan" ${diet === "vegan" ? "selected" : ""}>Vegan (100% Plant-Based)</option>
                  <option value="jain" ${diet === "jain" ? "selected" : ""}>Jain (No Root Veg / Onion / Garlic)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="prof-region">Regional Cuisine Style</label>
                <select class="form-select" id="prof-region">
                  <option value="north" ${region === "north" ? "selected" : ""}>North Indian Cuisine (Wheat-based, Legumes, Dairy)</option>
                  <option value="south" ${region === "south" ? "selected" : ""}>South Indian Cuisine (Rice-based, Millets, Lentils)</option>
                  <option value="west" ${region === "west" ? "selected" : ""}>West Indian Cuisine (Millet-based, Sprouts, Peanuts)</option>
                  <option value="east" ${region === "east" ? "selected" : ""}>East Indian Cuisine (Rice-based, Fish, Leafy Greens)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="prof-activity">Daily Physical Activity</label>
                <select class="form-select" id="prof-activity">
                  <option value="sedentary" ${activity === "sedentary" ? "selected" : ""}>Sedentary (Desk Job, <4000 steps)</option>
                  <option value="light" ${activity === "light" ? "selected" : ""}>Lightly Active (Walking 5k-7k steps)</option>
                  <option value="moderate" ${activity === "moderate" ? "selected" : ""}>Moderately Active (Workout 3-4x/wk)</option>
                  <option value="heavy" ${activity === "heavy" ? "selected" : ""}>Very Active (Daily Heavy Training)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2: Smart Scale (BIA) Biomarkers -->
          <div class="glass-card" style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div>
                <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">2. Smart Weight Machine Biomarkers (BIA)</h2>
                <span style="font-size: 0.8125rem; color: var(--text-secondary);">Direct input from your Bluetooth / Smart Body Scale</span>
              </div>
              <span class="telemetry-badge badge-optimal"><span class="beacon-dot optimal"></span> MULTI-FREQUENCY BIA</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="prof-weight">Weight (kg)*</label>
                <input class="form-input" type="number" id="prof-weight" step="0.1" value="${weight}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-height">Height (cm)*</label>
                <input class="form-input" type="number" id="prof-height" step="0.5" value="${height}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-vfr">Visceral Fat Level (1-59)*</label>
                <input class="form-input" type="number" id="prof-vfr" min="1" max="59" value="${vfr}" required />
                <span style="font-size: 0.6875rem; color: var(--text-muted);">Optimal: 1-9 | Hazard: >13</span>
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-bodyfat">Body Fat %</label>
                <input class="form-input" type="number" id="prof-bodyfat" step="0.1" value="${bodyFat}" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 10px;">
              <div class="form-group">
                <label class="form-label" for="prof-muscle">Muscle Mass (kg)</label>
                <input class="form-input" type="number" id="prof-muscle" step="0.1" value="${muscle}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-subfat">Subcutaneous Fat %</label>
                <input class="form-input" type="number" id="prof-subfat" step="0.1" value="${subFat}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-water">Body Water %</label>
                <input class="form-input" type="number" id="prof-water" step="0.1" value="${water}" />
              </div>
            </div>

            <div class="clinical-notice" style="margin-top: 20px;">
              <strong>Evidence-Based Assurance:</strong> All calculations are processed locally. Your data is tested against the WHO Asian-Indian BMI classification (normal threshold 18.5 - 22.9 kg/m²) and ICMR-NIN energy expenditure guidelines.
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="submit" class="btn-blue" style="padding: 14px 32px; font-size: 1rem;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              Recalculate & Update Plan
            </button>
          </div>
        </form>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById("btn-reset-onboarding")?.addEventListener("click", () => {
      this.app.lockNavigationForOnboarding(true);
      this.app.navigateTo("onboarding");
    });

    const form = document.getElementById("profile-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("prof-name").value.trim();
      const age = parseInt(document.getElementById("prof-age").value, 10);
      const gender = document.getElementById("prof-gender").value;
      const dietary_preference = document.getElementById("prof-diet").value;
      const region_cuisine = document.getElementById("prof-region").value;
      const activity_level = document.getElementById("prof-activity").value;

      const weight_kg = parseFloat(document.getElementById("prof-weight").value);
      const height_cm = parseFloat(document.getElementById("prof-height").value);
      const visceral_fat_rating = parseInt(document.getElementById("prof-vfr").value, 10);
      const body_fat_percent = parseFloat(document.getElementById("prof-bodyfat").value) || 25;
      const muscle_mass_kg = parseFloat(document.getElementById("prof-muscle").value) || (weight_kg * 0.4);
      const subcutaneous_fat_percent = parseFloat(document.getElementById("prof-subfat").value) || 20;
      const body_water_percent = parseFloat(document.getElementById("prof-water").value) || 52;

      let user = await dbService.getCurrentUser();
      const userId = user ? user.user_id : ("usr_" + Date.now());
      user = {
        user_id: userId,
        name,
        age,
        gender,
        dietary_preference,
        region_cuisine,
        activity_level,
        updated_at: new Date().toISOString()
      };
      await dbService.saveUser(user);

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
        subcutaneous_fat_percent,
        muscle_mass_kg,
        body_fat_percent,
        body_water_percent
      };
      await dbService.addHealthLog(healthLog);

      const energyData = calculateEnergyAndMacros({
        weightKg: weight_kg,
        heightCm: height_cm,
        age,
        gender,
        activityLevel: activity_level,
        bodyFatPercent: body_fat_percent,
        visceralFatRating: visceral_fat_rating,
        muscleMassKg: muscle_mass_kg
      });

      const mealPlan = generateIndianWeeklyMealPlan({
        regionalPreference: region_cuisine,
        dietaryPreference: dietary_preference,
        targetCalories: energyData.targetDailyCalories,
        targetProteinG: energyData.targetProteinG
      });

      const exercisePlan = generateWeeklyExercisePlan({
        phenotypeKey: energyData.phenotypeResult.phenotype.key,
        weightKg: weight_kg,
        activityLevel: activity_level
      });

      const planId = "wp_" + Date.now();
      const weeklyPlan = {
        plan_id: planId,
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

      this.app.showNotification("Profile updated & new plan generated!");
      await this.app.updateHeaderUser();
      this.app.navigateTo("dashboard");
    });
  }
}
