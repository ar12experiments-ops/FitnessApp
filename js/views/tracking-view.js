/**
 * Daily Tracking & Adherence Matching Component: TransformNXT (Light Minimalist Glass)
 * Allows users to log Indian food items with authentic portions,
 * check off prescribed exercises, and observe their real-time Plan Match Score.
 */

import { dbService } from "../storage/db.js";
import { INDIAN_FOOD_DATABASE, filterFoods } from "../data/indian-foods.js";
import { calculateDailyCompliance } from "../engines/compliance-engine.js";

export class TrackingView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-tracking");
    this.todayStr = new Date().toISOString().split("T")[0];
    this.activeFoodSearch = "";
    this.selectedFoodCategory = "";
    this.currentTrackData = {
      meals: [],
      exercises: [],
      totalCals: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0
    };
  }

  async render() {
    const user = await dbService.getCurrentUser();
    const plan = user ? await dbService.getLatestWeeklyPlan(user.user_id) : null;

    if (!user || !plan) {
      this.app.navigateTo("onboarding");
      return;
    }

    // Fetch existing tracking for today if already present
    const existingLog = await dbService.getDailyTrackingForDate(user.user_id, this.todayStr);
    if (existingLog && (!this.currentTrackData.meals.length && !this.currentTrackData.exercises.length)) {
      this.currentTrackData.meals = existingLog.meals_logged || [];
      this.currentTrackData.exercises = existingLog.exercises_completed || [];
      this.recalcTotals();
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDayName = dayNames[new Date().getDay()];
    const workoutDays = plan.exercise_routine ? plan.exercise_routine.daysPlan : [];
    const todayWorkout = workoutDays.find(d => d.day === todayDayName) || workoutDays[0];

    // Compute Live Adherence Score
    const compliance = calculateDailyCompliance({
      targetCalories: plan.target_daily_calories,
      consumedCalories: this.currentTrackData.totalCals,
      targetProteinG: plan.target_protein_g,
      consumedProteinG: this.currentTrackData.totalProtein,
      targetFiberG: plan.target_fiber_g,
      consumedFiberG: this.currentTrackData.totalFiber,
      prescribedExercisesCount: todayWorkout && todayWorkout.exercises ? todayWorkout.exercises.length : 4,
      completedExercisesCount: this.currentTrackData.exercises.length
    });

    const strokeDash = 377 - (377 * (compliance.overallScore / 100));

    // Filtered food catalog
    const filteredFoods = filterFoods({
      category: this.selectedFoodCategory,
      query: this.activeFoodSearch
    }).slice(0, 8);

    this.container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="telemetry-badge badge-optimal"><span class="beacon-dot optimal"></span> LIVE TRACKING</span>
            <span class="brand-tag">DATE: ${this.todayStr} (${todayDayName.toUpperCase()})</span>
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary);">Daily Intake & Workout Logger</h1>
        </div>

        <button class="btn-blue" id="btn-save-log-progress" style="padding: 10px 20px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          Save & Sync Daily Progress
        </button>
      </div>

      <!-- Live Adherence Ribbon (Light Theme) -->
      <div class="glass-card" style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div class="compliance-ring-container" style="width: 90px; height: 90px;">
            <svg viewBox="0 0 140 140" style="width: 90px; height: 90px; transform: rotate(-90deg);">
              <circle class="compliance-bg" cx="70" cy="70" r="60" />
              <circle class="compliance-bar" cx="70" cy="70" r="60" style="stroke-dashoffset: ${strokeDash}; stroke: ${compliance.statusColor};" />
            </svg>
            <div class="compliance-content">
              <span style="font-size: 1.35rem; font-weight: 800; font-family: var(--font-family-data); color: ${compliance.statusColor};">
                ${compliance.overallScore}%
              </span>
            </div>
          </div>

          <div>
            <span class="form-label">CURRENT PLAN MATCH ADHERENCE</span>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">
              ${compliance.statusBadge}
            </h2>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 2px;">
              Target: ${plan.target_daily_calories} kcal &bull; Consumed: <strong style="color: var(--text-primary);">${this.currentTrackData.totalCals} kcal</strong>
            </div>
          </div>
        </div>

        <!-- Real-time Macro Counters -->
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">PROTEIN FLOOR</span>
            <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-family-data); color: var(--accent-green);">
              ${Math.round(this.currentTrackData.totalProtein * 10) / 10} / ${plan.target_protein_g}g
            </div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">CARBS</span>
            <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-family-data); color: var(--telemetry-cyan);">
              ${Math.round(this.currentTrackData.totalCarbs * 10) / 10} / ${plan.target_carbs_g}g
            </div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">FATS</span>
            <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-family-data); color: var(--accent-orange);">
              ${Math.round(this.currentTrackData.totalFats * 10) / 10} / ${plan.target_fats_g}g
            </div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">DIETARY FIBER</span>
            <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-family-data); color: var(--text-primary);">
              ${Math.round(this.currentTrackData.totalFiber * 10) / 10} / ${plan.target_fiber_g}g
            </div>
          </div>
        </div>
      </div>

      <div class="tracking-grid">
        
        <!-- Section 1: Food Logger -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <span class="form-label">INDIAN NUTRITION TRACKER</span>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Log Meal Items</h3>
            </div>
            <span class="telemetry-badge badge-optimal">ICMR-NIN IFCT CALIBRATED</span>
          </div>

          <!-- Food Search & Filters -->
          <div style="display: flex; gap: 10px; margin-bottom: 14px;">
            <input 
              class="form-input" 
              type="text" 
              id="input-food-search" 
              placeholder="Search foods (e.g., Dal, Paneer, Chicken, Rice, Eggs)..." 
              value="${this.activeFoodSearch}" 
            />
            <select class="form-select" id="select-food-category" style="max-width: 150px;">
              <option value="">All Types</option>
              <option value="grains" ${this.selectedFoodCategory === 'grains' ? 'selected' : ''}>Grains / Flatbreads</option>
              <option value="pulses" ${this.selectedFoodCategory === 'pulses' ? 'selected' : ''}>Lentils / Pulses</option>
              <option value="dairy" ${this.selectedFoodCategory === 'dairy' ? 'selected' : ''}>Dairy/Tofu</option>
              <option value="poultry" ${this.selectedFoodCategory === 'poultry' ? 'selected' : ''}>Poultry/Eggs</option>
              <option value="vegetables" ${this.selectedFoodCategory === 'vegetables' ? 'selected' : ''}>Vegetables</option>
              <option value="fats" ${this.selectedFoodCategory === 'fats' ? 'selected' : ''}>Nuts/Fats</option>
            </select>
          </div>

          <!-- Quick Food Results Grid -->
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; max-height: 260px; overflow-y: auto; margin-bottom: 20px; padding-right: 4px;">
            ${filteredFoods.map(f => `
              <div class="food-card">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.9375rem;">${f.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                    Portion: ${f.serving_unit} &bull; <span style="color: var(--accent-green); font-weight: 600;">${f.calories} kcal</span> (${f.protein}g Protein)
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="number" class="form-input food-qty-input" data-food-id="${f.id}" min="0.5" max="10" step="0.5" value="1" style="width: 60px; padding: 6px; text-align: center;" />
                  <button class="btn-blue btn-sm btn-add-food" data-food-id="${f.id}">
                    + Add
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Logged Meals Today -->
          <div style="border-top: 1px solid var(--border-glass-default); padding-top: 16px;">
            <span class="form-label" style="display: block; margin-bottom: 8px;">LOGGED ITEMS TODAY (${this.currentTrackData.meals.length})</span>
            
            ${this.currentTrackData.meals.length === 0 ? `
              <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 0.8125rem;">
                No meals logged today yet. Use the search above to add your breakfast, lunch, snacks, or dinner.
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${this.currentTrackData.meals.map((m, idx) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass-default); border-radius: var(--radius-xs); font-size: 0.8125rem;">
                    <div>
                      <strong style="color: var(--text-primary);">${m.name}</strong>
                      <span style="color: var(--text-secondary); margin-left: 6px;">x${m.quantity} (${Math.round(m.calories)} kcal)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: var(--accent-green); font-family: var(--font-family-data); font-weight: 600;">${Math.round(m.protein * 10) / 10}g P</span>
                      <button class="btn-glass btn-remove-meal" data-meal-index="${idx}" style="padding: 2px 8px; font-size: 0.75rem; color: var(--telemetry-crimson);">✕</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            `}
          </div>
        </div>

        <!-- Section 2: Workout Checklist -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <span class="form-label">TODAY'S EXERCISE EXECUTION</span>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${todayWorkout ? todayWorkout.sessionName : "Workout"}</h3>
            </div>
            <span class="telemetry-badge badge-orange">${todayWorkout ? todayWorkout.type.toUpperCase() : "ACTIVE"}</span>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 16px;">
            Check off exercises as you complete them to automatically increase your daily workout adherence factor.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${(todayWorkout && todayWorkout.exercises ? todayWorkout.exercises : []).map(ex => {
              const isChecked = this.currentTrackData.exercises.includes(ex.id);
              return `
                <div class="workout-item-card ${isChecked ? 'completed' : ''}" style="cursor: pointer;" data-ex-id="${ex.id}">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <input type="checkbox" class="ex-checkbox" data-ex-id="${ex.id}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-green); cursor: pointer;" />
                      <div>
                        <strong style="color: var(--text-primary); font-size: 0.9375rem;">${ex.name}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">
                          ${ex.default_sets} sets &bull; ${ex.default_reps} &bull; <span style="color: var(--accent-green); font-weight: 600;">${ex.target_muscle}</span>
                        </div>
                      </div>
                    </div>
                    <span class="telemetry-badge ${isChecked ? 'badge-optimal' : 'badge-cyan'}" style="font-size: 0.6875rem;">
                      ${isChecked ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div style="margin-top: 20px; background: var(--accent-orange-subtle); border: 1px solid rgba(249, 115, 22, 0.25); border-radius: var(--radius-sm); padding: 14px; font-size: 0.8125rem; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Estimated Session Burn:</strong> ~${todayWorkout ? todayWorkout.estimatedCaloriesBurned : 0} kcal based on MET formulas.
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  recalcTotals() {
    let cals = 0;
    let prot = 0;
    let carb = 0;
    let fat = 0;
    let fib = 0;

    this.currentTrackData.meals.forEach(m => {
      cals += m.calories;
      prot += m.protein;
      carb += m.carbs;
      fat += m.fats;
      fib += m.fiber;
    });

    this.currentTrackData.totalCals = Math.round(cals);
    this.currentTrackData.totalProtein = Math.round(prot * 10) / 10;
    this.currentTrackData.totalCarbs = Math.round(carb * 10) / 10;
    this.currentTrackData.totalFats = Math.round(fat * 10) / 10;
    this.currentTrackData.totalFiber = Math.round(fib * 10) / 10;
  }

  attachEvents() {
    const searchInput = document.getElementById("input-food-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.activeFoodSearch = e.target.value;
        this.render();
      });
    }

    const catSelect = document.getElementById("select-food-category");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.selectedFoodCategory = e.target.value;
        this.render();
      });
    }

    this.container.querySelectorAll(".btn-add-food").forEach(btn => {
      btn.addEventListener("click", () => {
        const foodId = btn.dataset.foodId;
        const food = INDIAN_FOOD_DATABASE.find(f => f.id === foodId);
        if (!food) return;

        const qtyInput = this.container.querySelector(`.food-qty-input[data-food-id="${foodId}"]`);
        const qty = parseFloat(qtyInput ? qtyInput.value : "1") || 1;

        this.currentTrackData.meals.push({
          item_id: food.id,
          name: food.name,
          quantity: qty,
          serving_unit: food.serving_unit,
          calories: food.calories * qty,
          protein: food.protein * qty,
          carbs: food.carbs * qty,
          fats: food.fat * qty,
          fiber: food.fiber * qty
        });

        this.recalcTotals();
        this.render();
      });
    });

    this.container.querySelectorAll(".btn-remove-meal").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.mealIndex, 10);
        this.currentTrackData.meals.splice(idx, 1);
        this.recalcTotals();
        this.render();
      });
    });

    this.container.querySelectorAll(".ex-checkbox").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const exId = e.target.dataset.exId;
        if (e.target.checked) {
          if (!this.currentTrackData.exercises.includes(exId)) {
            this.currentTrackData.exercises.push(exId);
          }
        } else {
          this.currentTrackData.exercises = this.currentTrackData.exercises.filter(id => id !== exId);
        }
        this.render();
      });
    });

    document.getElementById("btn-save-log-progress")?.addEventListener("click", async () => {
      const user = await dbService.getCurrentUser();
      const plan = user ? await dbService.getLatestWeeklyPlan(user.user_id) : null;
      if (!user || !plan) return;

      const compliance = calculateDailyCompliance({
        targetCalories: plan.target_daily_calories,
        consumedCalories: this.currentTrackData.totalCals,
        targetProteinG: plan.target_protein_g,
        consumedProteinG: this.currentTrackData.totalProtein,
        targetFiberG: plan.target_fiber_g,
        consumedFiberG: this.currentTrackData.totalFiber,
        prescribedExercisesCount: 4,
        completedExercisesCount: this.currentTrackData.exercises.length
      });

      const trackRecord = {
        track_id: `dt_${user.user_id}_${this.todayStr}`,
        user_id: user.user_id,
        plan_id: plan.plan_id,
        date: this.todayStr,
        calories_consumed: this.currentTrackData.totalCals,
        protein_consumed: this.currentTrackData.totalProtein,
        carbs_consumed: this.currentTrackData.totalCarbs,
        fats_consumed: this.currentTrackData.totalFats,
        fiber_consumed: this.currentTrackData.totalFiber,
        meals_logged: this.currentTrackData.meals,
        exercises_completed: this.currentTrackData.exercises,
        compliance_score_percent: compliance.overallScore
      };

      await dbService.saveDailyTracking(trackRecord);
      this.app.showNotification(`Synced! Daily Plan Match: ${compliance.overallScore}%`);
    });
  }
}
