/**
 * TransformNXT: Application Coordinator & SPA Router
 */

import { dbService } from "./storage/db.js";
import { calculateIndianBMI } from "./engines/bmi-engine.js";
import { calculateEnergyAndMacros, generateIndianWeeklyMealPlan } from "./engines/diet-engine.js";
import { generateWeeklyExercisePlan } from "./engines/workout-engine.js";

import { ProfileView } from "./views/profile-view.js";
import { DashboardView } from "./views/dashboard-view.js";
import { PlanView } from "./views/plan-view.js";
import { TrackingView } from "./views/tracking-view.js";
import { AnalyticsView } from "./views/analytics-view.js";

class TransformNXTApp {
  constructor() {
    this.currentView = "dashboard";
    this.views = {
      dashboard: new DashboardView(this),
      plan: new PlanView(this),
      tracking: new TrackingView(this),
      analytics: new AnalyticsView(this),
      profile: new ProfileView(this)
    };
  }

  async init() {
    // Seed initial demo data if database is empty
    await this.seedInitialDataIfEmpty();

    // Setup Navigation Listeners
    this.setupNavigation();

    // Initial View Render
    await this.updateHeaderUser();
    await this.navigateTo("dashboard");
  }

  async seedInitialDataIfEmpty() {
    const existingUser = await dbService.getCurrentUser();
    if (existingUser) return;

    // Authentic Indian User with "Thin-Fat" Phenotype baseline:
    // Normal/Borderline BMI (24.2), Elevated Visceral Fat (12), Low/Moderate Muscle Mass (28.5 kg)
    const seedUserId = "usr_arjun_01";
    const seedUser = {
      user_id: seedUserId,
      name: "Arjun Sharma",
      age: 32,
      gender: "male",
      dietary_preference: "vegetarian",
      region_cuisine: "north",
      activity_level: "sedentary",
      created_at: new Date().toISOString()
    };
    await dbService.saveUser(seedUser);

    const seedWeight = 74.0;
    const seedHeight = 175.0;
    const bmiData = calculateIndianBMI(seedWeight, seedHeight);

    const seedHealthLog = {
      log_id: "hl_seed_01",
      user_id: seedUserId,
      timestamp: new Date().toISOString(),
      weight_kg: seedWeight,
      height_cm: seedHeight,
      bmi_calculated: bmiData.bmi,
      visceral_fat_rating: 12, // Elevated (>9)
      subcutaneous_fat_percent: 21.5,
      muscle_mass_kg: 28.8,
      body_fat_percent: 25.5,
      body_water_percent: 53.0
    };
    await dbService.addHealthLog(seedHealthLog);

    // Energy & Macro target calculations
    const energyData = calculateEnergyAndMacros({
      weightKg: seedWeight,
      heightCm: seedHeight,
      age: 32,
      gender: "male",
      activityLevel: "sedentary",
      bodyFatPercent: 25.5,
      visceralFatRating: 12,
      muscleMassKg: 28.8
    });

    // Meal Plan
    const mealPlan = generateIndianWeeklyMealPlan({
      regionalPreference: "north",
      dietaryPreference: "vegetarian",
      targetCalories: energyData.targetDailyCalories,
      targetProteinG: energyData.targetProteinG
    });

    // Exercise Plan
    const exercisePlan = generateWeeklyExercisePlan({
      phenotypeKey: energyData.phenotypeResult.phenotype.key,
      weightKg: seedWeight,
      activityLevel: "sedentary"
    });

    // Weekly Plan record
    const weeklyPlan = {
      plan_id: "wp_seed_01",
      user_id: seedUserId,
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

    // Seed sample tracking for today
    const todayStr = new Date().toISOString().split("T")[0];
    const seedTrack = {
      track_id: `dt_${seedUserId}_${todayStr}`,
      user_id: seedUserId,
      plan_id: weeklyPlan.plan_id,
      date: todayStr,
      calories_consumed: 1480,
      protein_consumed: 92,
      carbs_consumed: 165,
      fats_consumed: 48,
      fiber_consumed: 31,
      meals_logged: [
        { name: "Moong Dal Cheela (Pesarattu)", quantity: 2, calories: 270, protein: 17, carbs: 35, fats: 6.4, fiber: 9.6 },
        { name: "Yellow Toor Dal Tadka (Cumin & Garlic)", quantity: 1.5, calories: 247, protein: 12.3, carbs: 31.5, fats: 7.2, fiber: 8.1 },
        { name: "Phulka / Roti (Whole Wheat)", quantity: 3, calories: 225, protein: 8.1, carbs: 46.5, fats: 1.2, fiber: 6.9 },
        { name: "Palak Paneer (Light Olive/Mustard Base)", quantity: 1, calories: 195, protein: 11.5, carbs: 6.5, fats: 13.5, fiber: 4.8 },
        { name: "Fresh Low-Fat Cow Paneer", quantity: 1, calories: 190, protein: 19.5, carbs: 3.5, fats: 10.5, fiber: 0 },
        { name: "Roasted Chana Sattu Drink (Savory)", quantity: 1, calories: 165, protein: 10.2, carbs: 25, fats: 2.2, fiber: 6.8 },
        { name: "Lightly Roasted Foxnuts (Makhana)", quantity: 1, calories: 105, protein: 3, carbs: 21, fats: 0.5, fiber: 2.4 }
      ],
      exercises_completed: [
        "ex_bodyweight_squats",
        "ex_pushups_standard",
        "cd_brisk_walking_zone2"
      ],
      compliance_score_percent: 88.5
    };
    await dbService.saveDailyTracking(seedTrack);
  }

  setupNavigation() {
    // Desktop navigation links
    document.querySelectorAll(".desktop-nav .nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.navigateTo(view);
      });
    });

    // Mobile navigation buttons
    document.querySelectorAll(".mobile-nav .mobile-nav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        this.navigateTo(view);
      });
    });

    // Header user profile button
    document.getElementById("header-user-btn")?.addEventListener("click", () => {
      this.navigateTo("profile");
    });
  }

  async updateHeaderUser() {
    const user = await dbService.getCurrentUser();
    const nameEl = document.getElementById("header-user-name");
    if (nameEl) {
      nameEl.textContent = user ? user.name : "Setup Profile";
    }
  }

  async navigateTo(viewName) {
    if (!this.views[viewName]) return;
    this.currentView = viewName;

    // Toggle active view sections
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    // Toggle navigation states
    document.querySelectorAll(".desktop-nav .nav-link").forEach(l => {
      l.classList.toggle("active", l.dataset.view === viewName);
    });

    document.querySelectorAll(".mobile-nav .mobile-nav-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.view === viewName);
    });

    // Render View
    await this.views[viewName].render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showNotification(msg) {
    const toast = document.getElementById("app-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.display = "none";
    }, 3200);
  }
}

// Bootstrap on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  const app = new TransformNXTApp();
  app.init();
});
