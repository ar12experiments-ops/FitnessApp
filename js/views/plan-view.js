/**
 * Weekly Plan View Component: TransformNXT
 * Displays the evidence-based 7-day Indian meal plan and progressive workout routine.
 */

import { dbService } from "../storage/db.js";

export class PlanView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-plan");
    this.selectedDayIndex = 0; // Monday default
  }

  async render() {
    const user = await dbService.getCurrentUser();
    const plan = user ? await dbService.getLatestWeeklyPlan(user.user_id) : null;

    if (!user || !plan) {
      this.container.innerHTML = `
        <div class="glass-card" style="text-align: center; max-width: 600px; margin: 40px auto; padding: 40px;">
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">No Active Weekly Plan</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">Please complete your profile to generate your evidence-based plan.</p>
          <button class="btn-laser" id="btn-goto-profile">Create Profile</button>
        </div>
      `;
      document.getElementById("btn-goto-profile")?.addEventListener("click", () => this.app.navigateTo("profile"));
      return;
    }

    const mealSchedule = plan.meal_plan_template.weeklySchedule || [];
    const workoutSchedule = plan.exercise_routine.daysPlan || [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const currentMealDay = mealSchedule[this.selectedDayIndex] || mealSchedule[0];
    const currentWorkoutDay = workoutSchedule[this.selectedDayIndex] || workoutSchedule[0];

    this.container.innerHTML = `
      <!-- Top Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="telemetry-badge badge-optimal">ICMR-NIN 2024 & ACSM GROUNDED</span>
            <span class="brand-tag">PHENOTYPE: ${(plan.phenotype_tag || "RECOMP").toUpperCase()}</span>
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em;">Weekly Strategy & Prescriptions</h1>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Regional: <strong style="color: #FFFFFF; text-transform: capitalize;">${user.region_cuisine} Indian</strong> | 
            Diet: <strong style="color: #FFFFFF; text-transform: capitalize;">${user.dietary_preference.replace("_", " ")}</strong> | 
            Calorie Target: <strong style="color: var(--accent-laser-green);">${plan.target_daily_calories} kcal</strong> | 
            Protein Floor: <strong style="color: var(--accent-laser-green);">${plan.target_protein_g}g</strong>
          </p>
        </div>

        <button class="btn-glass btn-sm" id="btn-log-day-plan">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Log Today's Intake
        </button>
      </div>

      <!-- Day Switcher Tabs -->
      <div class="hud-tabs" style="margin-bottom: 24px;">
        ${days.map((d, idx) => `
          <button class="hud-tab-btn ${idx === this.selectedDayIndex ? 'active' : ''}" data-day-index="${idx}">
            ${d}
          </button>
        `).join("")}
      </div>

      <!-- Main Plan Content (Split: Diet Schedule vs Workout Routine) -->
      <div class="plan-grid">
        
        <!-- Left: Diet Prescription for Selected Day -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <span class="form-label">INDIAN MEAL SCHEDULE</span>
              <h2 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF;">${days[this.selectedDayIndex]} Nutrition Strategy</h2>
            </div>
            <span class="telemetry-badge badge-optimal">~${currentMealDay ? currentMealDay.dayCalories : 0} kcal</span>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary); font-family: var(--font-family-telemetry);">
            <span>Est. Protein: <strong style="color: var(--accent-laser-green);">${currentMealDay ? currentMealDay.dayProteinG : 0}g</strong></span>
            <span>&bull;</span>
            <span>Est. Fiber: <strong style="color: var(--telemetry-cyan);">${currentMealDay ? currentMealDay.dayFiberG : 0}g</strong></span>
          </div>

          <!-- Meal Slots -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${(currentMealDay ? currentMealDay.mealSlots : []).map(slot => `
              <div style="background: rgba(14, 14, 14, 0.6); border: 1px solid var(--border-glass-default); border-radius: var(--radius-sm); padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                  <h3 style="font-size: 0.9375rem; font-weight: 700; color: #FFFFFF;">${slot.mealSlot}</h3>
                  <span style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-family-telemetry);">${slot.time}</span>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${slot.items.map(it => `
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8125rem; padding: 4px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                      <div>
                        <strong style="color: #FFFFFF;">${it.name}</strong>
                        <span style="color: var(--text-secondary); margin-left: 6px;">(${it.portion})</span>
                      </div>
                      <div style="color: var(--accent-laser-green); font-family: var(--font-family-telemetry);">
                        ${it.cals} kcal &bull; ${it.protein}g P
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Exercise Routine for Selected Day -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <span class="form-label">ACSM EXERCISE PRESCRIPTION</span>
              <h2 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF;">${days[this.selectedDayIndex]} Training</h2>
            </div>
            <span class="telemetry-badge ${currentWorkoutDay && currentWorkoutDay.type === 'zone2_cardio' ? 'badge-cyan' : 'badge-optimal'}">
              ${currentWorkoutDay ? currentWorkoutDay.type.toUpperCase().replace("_", " ") : "REST"}
            </span>
          </div>

          <div style="background: rgba(0, 255, 102, 0.06); border: 1px solid var(--border-glass-laser); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: #FFFFFF; font-size: 0.9375rem;">${currentWorkoutDay ? currentWorkoutDay.sessionName : "Rest Day"}</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">Duration: ${currentWorkoutDay ? currentWorkoutDay.durationMin : 0} min</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">MET CALORIE BURN</span>
                <div style="font-size: 1.125rem; font-weight: 800; color: var(--accent-laser-green); font-family: var(--font-family-telemetry);">
                  ~${currentWorkoutDay ? currentWorkoutDay.estimatedCaloriesBurned : 0} kcal
                </div>
              </div>
            </div>
          </div>

          <!-- Exercises List -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${(currentWorkoutDay ? currentWorkoutDay.exercises : []).map(ex => `
              <div class="workout-item-card">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <div>
                    <strong style="color: #FFFFFF; font-size: 0.9375rem;">${ex.name}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                      Target: <span style="color: var(--accent-laser-green);">${ex.target_muscle}</span> (${ex.movement_type})
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <span class="telemetry-badge badge-cyan" style="font-size: 0.6875rem;">${ex.default_sets} sets &bull; ${ex.default_reps}</span>
                  </div>
                </div>

                <div style="font-size: 0.75rem; color: #8E8E93; line-height: 1.35; margin-top: 4px;">
                  ${ex.instructions}
                </div>

                <div style="font-size: 0.6875rem; color: var(--telemetry-amber); margin-top: 2px;">
                  Home alternative: ${ex.home_alternative}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll(".hud-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedDayIndex = parseInt(btn.dataset.dayIndex, 10);
        this.render();
      });
    });

    document.getElementById("btn-log-day-plan")?.addEventListener("click", () => {
      this.app.navigateTo("tracking");
    });
  }
}
