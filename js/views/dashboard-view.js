/**
 * Dashboard View Component: TransformNXT
 * Displays the Health Dashboard: Asian-Indian BMI spectrum,
 * Smart scale biomarker matrix, phenotype diagnostic, and adherence ring.
 */

import { dbService } from "../storage/db.js";
import { calculateIndianBMI } from "../engines/bmi-engine.js";
import { determineMetabolicPhenotype, evaluateVisceralFat, evaluateMuscleMass } from "../engines/bia-engine.js";
import { calculateDailyCompliance } from "../engines/compliance-engine.js";

export class DashboardView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-dashboard");
  }

  async render() {
    let user = await dbService.getCurrentUser();
    let latestLog = user ? await dbService.getLatestHealthLog(user.user_id) : null;
    let plan = user ? await dbService.getLatestWeeklyPlan(user.user_id) : null;

    if (!user || !latestLog) {
      this.app.navigateTo("onboarding");
      return;
    }

    const bmiData = calculateIndianBMI(latestLog.weight_kg, latestLog.height_cm);
    const phenotypeData = determineMetabolicPhenotype({
      weightKg: latestLog.weight_kg,
      heightCm: latestLog.height_cm,
      visceralFatRating: latestLog.visceral_fat_rating,
      muscleMassKg: latestLog.muscle_mass_kg,
      bodyFatPercent: latestLog.body_fat_percent,
      gender: user.gender
    });

    const vfrEval = evaluateVisceralFat(latestLog.visceral_fat_rating);
    const muscleEval = evaluateMuscleMass(phenotypeData.musclePercent, user.gender);

    // Today's tracking adherence
    const todayStr = new Date().toISOString().split("T")[0];
    const todayTrack = await dbService.getDailyTrackingForDate(user.user_id, todayStr);

    const compliance = calculateDailyCompliance({
      targetCalories: plan ? plan.target_daily_calories : 1800,
      consumedCalories: todayTrack ? todayTrack.calories_consumed : 0,
      targetProteinG: plan ? plan.target_protein_g : 100,
      consumedProteinG: todayTrack ? todayTrack.protein_consumed : 0,
      targetFiberG: plan ? plan.target_fiber_g : 35,
      consumedFiberG: todayTrack ? todayTrack.fiber_consumed : 0,
      prescribedExercisesCount: 4,
      completedExercisesCount: todayTrack && todayTrack.exercises_completed ? todayTrack.exercises_completed.length : 0
    });

    // Ring stroke calculation: circle perimeter = 2 * PI * 60 = 377
    const strokeDash = 377 - (377 * (compliance.overallScore / 100));

    this.container.innerHTML = `
      <!-- Top HUD Banner -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="telemetry-badge badge-optimal"><span class="beacon-dot optimal"></span> LIVE METRICS</span>
            <span class="brand-tag">${user.name.toUpperCase()} (${user.age}Y, ${user.gender.toUpperCase()})</span>
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary);">Health Dashboard</h1>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-glass btn-sm" id="btn-relog-scale">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            Update Scale Data
          </button>
          <button class="btn-green btn-sm" id="btn-quick-track">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Log Today's Intake / Workout
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Column 1: Clinical Diagnostics & Smart Scale Metrics -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Asian-Indian BMI Card -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span class="form-label">ANTHROPOMETRIC CLASSIFICATION</span>
                <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 4px;">
                  <span style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-family-data); color: var(--text-primary);">
                    ${bmiData.bmi} <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 500;">kg/m²</span>
                  </span>
                  <span class="telemetry-badge ${bmiData.tier.badgeClass}">${bmiData.tier.label}</span>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-family-data);">IDEAL ASIAN-INDIAN WEIGHT</span>
                <div style="font-size: 0.9375rem; font-weight: 700; color: var(--accent-green);">
                  ${bmiData.idealWeightRange.minKg} - ${bmiData.idealWeightRange.maxKg} kg
                </div>
              </div>
            </div>

            <!-- Spectrum Bar with Pointer -->
            <div class="bmi-spectrum-container">
              <div class="bmi-track">
                <div class="bmi-pointer" style="left: ${bmiData.spectrumPercent}%;"></div>
              </div>
              <div class="bmi-labels">
                <span>Underweight<br><strong>&lt; 18.5</strong></span>
                <span>Normal<br><strong style="color: var(--accent-green);">18.5 - 22.9</strong></span>
                <span>Overweight<br><strong style="color: var(--telemetry-amber);">23.0 - 24.9</strong></span>
                <span>Obese<br><strong style="color: var(--telemetry-crimson);">&ge; 25.0</strong></span>
              </div>
            </div>

            <div style="margin-top: 14px; font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.45;">
              <strong>Clinical Context:</strong> ${bmiData.tier.clinicalRisk}
            </div>
          </div>

          <!-- Metabolic Phenotype Card -->
          <div class="glass-card" style="border-left: 4px solid ${phenotypeData.phenotype.color};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="form-label">METABOLIC PHENOTYPE DIAGNOSTIC</span>
              <span class="telemetry-badge badge-optimal">${phenotypeData.phenotype.badge}</span>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
              ${phenotypeData.phenotype.title}
            </h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.45;">
              ${phenotypeData.phenotype.description}
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass-default); padding: 14px 18px; border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--text-primary); line-height: 1.45;">
              <strong style="color: var(--accent-green-hover);">Recommended Protocol:</strong> ${phenotypeData.phenotype.strategy}
            </div>
          </div>

          <!-- Smart Scale Biomarker Grid -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <div>
                <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary);">Smart Scale Bio-impedance Matrix</h3>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Calibrated against age/gender norms</span>
              </div>
              <span class="telemetry-badge badge-cyan">BIA SYNCED</span>
            </div>

            <div class="biomarker-grid">
              <!-- Tile 1: Visceral Fat -->
              <div class="biomarker-card ${vfrEval.status === 'risk' ? 'hazard' : ''}">
                <div class="biomarker-title">
                  <span>Visceral Fat (VFR)</span>
                  <span class="beacon-dot ${vfrEval.status}"></span>
                </div>
                <div class="biomarker-val" style="color: ${vfrEval.color};">
                  ${latestLog.visceral_fat_rating}
                  <span class="biomarker-unit">/ 59</span>
                </div>
                <div class="biomarker-desc">${vfrEval.summary}</div>
              </div>

              <!-- Tile 2: Muscle Mass % -->
              <div class="biomarker-card">
                <div class="biomarker-title">
                  <span>Skeletal Muscle</span>
                  <span class="beacon-dot ${muscleEval.status}"></span>
                </div>
                <div class="biomarker-val" style="color: ${muscleEval.color};">
                  ${phenotypeData.musclePercent}
                  <span class="biomarker-unit">%</span>
                </div>
                <div class="biomarker-desc">${muscleEval.summary}</div>
              </div>

              <!-- Tile 3: Subcutaneous Fat % -->
              <div class="biomarker-card">
                <div class="biomarker-title">
                  <span>Subcutaneous Fat</span>
                </div>
                <div class="biomarker-val">
                  ${latestLog.subcutaneous_fat_percent || 20.5}
                  <span class="biomarker-unit">%</span>
                </div>
                <div class="biomarker-desc">Peripheral subcutaneous layer fat stores.</div>
              </div>

              <!-- Tile 4: BMR -->
              <div class="biomarker-card">
                <div class="biomarker-title">
                  <span>Metabolic Rate (BMR)</span>
                </div>
                <div class="biomarker-val" style="color: var(--accent-orange);">
                  ${plan ? plan.bmr : 1580}
                  <span class="biomarker-unit">kcal</span>
                </div>
                <div class="biomarker-desc">Katch-McArdle formula calibrated via Lean Body Mass.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Today's Compliance & Plan Status -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Compliance Adherence Ring Card -->
          <div class="glass-card" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <span class="form-label" style="align-self: flex-start;">TODAY'S PLAN MATCH SCORE</span>
            
            <div class="compliance-ring-container" style="margin: 20px 0;">
              <svg class="compliance-svg" viewBox="0 0 140 140">
                <circle class="compliance-bg" cx="70" cy="70" r="60" />
                <circle class="compliance-bar" cx="70" cy="70" r="60" style="stroke-dashoffset: ${strokeDash}; stroke: ${compliance.statusColor};" />
              </svg>
              <div class="compliance-content">
                <span class="compliance-val" style="color: ${compliance.statusColor};">${compliance.overallScore}%</span>
                <span class="compliance-sub">MATCH</span>
              </div>
            </div>

            <span class="telemetry-badge" style="background: var(--accent-green-subtle); color: ${compliance.statusColor}; border: 1px solid ${compliance.statusColor};">
              ${compliance.statusBadge}
            </span>

            <!-- Breakdown Factors -->
            <div style="width: 100%; margin-top: 20px; display: flex; flex-direction: column; gap: 8px; text-align: left;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
                <span style="color: var(--text-secondary);">Calories Target (35% wt):</span>
                <span style="font-weight: 700; font-family: var(--font-family-data); color: var(--text-primary);">${compliance.factors.calorieMatch}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
                <span style="color: var(--text-secondary);">Protein Floor (35% wt):</span>
                <span style="font-weight: 700; font-family: var(--font-family-data); color: var(--accent-green);">${compliance.factors.proteinMatch}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
                <span style="color: var(--text-secondary);">Workout Completion (20% wt):</span>
                <span style="font-weight: 700; font-family: var(--font-family-data); color: var(--accent-orange);">${compliance.factors.workoutMatch}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
                <span style="color: var(--text-secondary);">Fiber Floor (10% wt):</span>
                <span style="font-weight: 700; font-family: var(--font-family-data); color: var(--text-primary);">${compliance.factors.fiberMatch}%</span>
              </div>
            </div>

            <div style="width: 100%; margin-top: 16px; border-top: 1px solid var(--border-glass-default); padding-top: 12px; font-size: 0.75rem; color: var(--text-secondary); text-align: left;">
              ${compliance.recommendations[0] || "Follow your personalized recommendations to reach target recomposition."}
            </div>
          </div>

          <!-- Weekly Plan Summary Quick Card -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="form-label">PRESCRIBED DAILY TARGETS</span>
              <button class="btn-glass btn-sm" id="btn-view-full-plan" style="padding: 4px 10px; font-size: 0.75rem;">View Plan</button>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 14px;">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">CALORIE BUDGET</span>
                <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-family-data); color: var(--text-primary);">
                  ${plan ? plan.target_daily_calories : 1850} <span style="font-size: 0.75rem; color: var(--text-secondary);">kcal</span>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.75rem; color: var(--text-secondary);">PROTEIN FLOOR</span>
                <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-family-data); color: var(--accent-green);">
                  ${plan ? plan.target_protein_g : 115} <span style="font-size: 0.75rem; color: var(--text-secondary);">g</span>
                </div>
              </div>
            </div>

            <div class="macro-hud">
              <div class="macro-bar-wrap">
                <div class="macro-seg-carbs" style="width: 50%;"></div>
                <div class="macro-seg-protein" style="width: 25%;"></div>
                <div class="macro-seg-fats" style="width: 25%;"></div>
              </div>
              <div class="macro-legend">
                <div class="macro-pill"><span class="macro-dot" style="background: var(--telemetry-cyan);"></span> Carbs: ${plan ? plan.target_carbs_g : 210}g</div>
                <div class="macro-pill"><span class="macro-dot" style="background: var(--accent-green);"></span> Protein: ${plan ? plan.target_protein_g : 115}g</div>
                <div class="macro-pill"><span class="macro-dot" style="background: var(--accent-orange);"></span> Fats: ${plan ? plan.target_fats_g : 58}g</div>
              </div>
            </div>

            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-glass-default); display: flex; justify-content: space-between; font-size: 0.8125rem;">
              <span style="color: var(--text-secondary);">Daily Dietary Fiber Goal:</span>
              <strong style="color: var(--text-primary);">&ge; ${plan ? plan.target_fiber_g : 38} g / day</strong>
            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById("btn-relog-scale")?.addEventListener("click", () => {
      this.app.navigateTo("profile");
    });

    document.getElementById("btn-quick-track")?.addEventListener("click", () => {
      this.app.navigateTo("tracking");
    });

    document.getElementById("btn-view-full-plan")?.addEventListener("click", () => {
      this.app.navigateTo("plan");
    });
  }
}
