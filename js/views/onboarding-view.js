/**
 * Parameters & Health Baseline Intake View: TransformNXT
 * Payrix-Inspired Liquid Glass Guided Form
 * 
 * Collects:
 * 1. Name & Demographics (Name, Age, Gender)
 * 2. Health & Smart Scale Parameters (Weight, Height, Visceral Fat, Body Fat %, Muscle Mass, Body Water %)
 * 3. Food & Nutrition Preferences (Dietary pattern, Regional Indian cuisine, Activity level)
 * 
 * Once submitted, generates personalized ICMR-NIN & ACSM plans,
 * unlocks the full navigation bar, and loads the rest of the dashboard, chatbot, tracker, etc.
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

  async initData() {
    const existing = await dbService.getCurrentUser();
    if (existing) {
      this.formData.name = existing.name || "";
      this.formData.age = existing.age || 28;
      this.formData.gender = existing.gender || "male";
      this.formData.dietary_preference = existing.dietary_preference || "vegetarian";
      this.formData.region_cuisine = existing.region_cuisine || "north";
      this.formData.activity_level = existing.activity_level || "sedentary";

      const latestLog = await dbService.getLatestHealthLog();
      if (latestLog) {
        this.formData.weight_kg = latestLog.weight_kg || 72.0;
        this.formData.height_cm = latestLog.height_cm || 172.0;
        this.formData.visceral_fat_rating = latestLog.visceral_fat_rating || 11;
        this.formData.muscle_mass_kg = latestLog.muscle_mass_kg || 28.5;
        this.formData.body_fat_percent = latestLog.body_fat_percent || 24.5;
        this.formData.body_water_percent = latestLog.body_water_percent || 53.0;
      }
    }
  }

  async render() {
    await this.initData();

    this.container.innerHTML = `
      <div style="max-width: 760px; margin: 30px auto 60px;">
        
        <!-- Header Breadcrumb & Mission -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span class="telemetry-badge badge-optimal">
              <span class="beacon-dot optimal"></span> CALIBRATION WIZARD
            </span>
            <span class="telemetry-badge badge-orange">ZERO-HALLUCINATION PROTOCOL</span>
          </div>
          <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.025em; color: var(--text-primary);">
            Your Biological Parameters
          </h1>
          <p style="color: var(--text-secondary); font-size: 0.9375rem; max-width: 520px; margin: 6px auto 0; line-height: 1.5;">
            Please enter your health parameters, body measurements, and dietary preferences to generate your personalized clinical fitness & nutrition deck.
          </p>
        </div>

        <!-- Progress Steps (Payrix Liquid Glass Style) -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; position: relative; padding: 0 20px;">
          <div style="position: absolute; top: 18px; left: 18%; right: 18%; height: 2px; background: rgba(15,23,42,0.08); z-index: 0;"></div>
          
          <!-- Step 1 Indicator -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1; cursor: pointer;" id="step-nav-1">
            <div style="width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem; transition: all 0.2s ease; ${this.currentStep === 1 ? 'background: var(--accent-blue-gradient); color: #FFF; box-shadow: 0 4px 14px var(--accent-blue-glow);' : this.currentStep > 1 ? 'background: rgba(2,132,199,0.12); color: var(--accent-blue); border: 1px solid var(--accent-blue);' : 'background: rgba(255,255,255,0.8); color: var(--text-muted); border: 1px solid rgba(15,23,42,0.1);'}">
              ${this.currentStep > 1 ? '✓' : '1'}
            </div>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${this.currentStep === 1 ? 'var(--text-primary)' : 'var(--text-muted)'};">1. Profile</span>
          </div>

          <!-- Step 2 Indicator -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1; cursor: pointer;" id="step-nav-2">
            <div style="width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem; transition: all 0.2s ease; ${this.currentStep === 2 ? 'background: var(--accent-blue-gradient); color: #FFF; box-shadow: 0 4px 14px var(--accent-blue-glow);' : this.currentStep > 2 ? 'background: rgba(2,132,199,0.12); color: var(--accent-blue); border: 1px solid var(--accent-blue);' : 'background: rgba(255,255,255,0.8); color: var(--text-muted); border: 1px solid rgba(15,23,42,0.1);'}">
              ${this.currentStep > 2 ? '✓' : '2'}
            </div>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${this.currentStep === 2 ? 'var(--text-primary)' : 'var(--text-muted)'};">2. Health Metrics</span>
          </div>

          <!-- Step 3 Indicator -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1; cursor: pointer;" id="step-nav-3">
            <div style="width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem; transition: all 0.2s ease; ${this.currentStep === 3 ? 'background: var(--accent-orange-gradient); color: #FFF; box-shadow: 0 4px 14px var(--accent-orange-glow);' : 'background: rgba(255,255,255,0.8); color: var(--text-muted); border: 1px solid rgba(15,23,42,0.1);'}">
              3
            </div>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${this.currentStep === 3 ? 'var(--text-primary)' : 'var(--text-muted)'};">3. Food & Diet</span>
          </div>
        </div>

        <!-- Main Form Glass Card -->
        <div class="glass-card" style="padding: 36px 32px;">
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
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="brand-tag">STEP 1 OF 3 &bull; IDENTITY</span>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">Personal Baseline</h2>
            </div>
            <span class="telemetry-badge badge-optimal">CALIBRATION</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
            Tell us your name and basic demographics so we can calibrate basal energy expenditure and sex-specific skeletal muscle baselines.
          </p>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" for="ob-name">Full Name or Preferred Handle</label>
            <input 
              type="text" 
              class="form-input" 
              id="ob-name" 
              placeholder="e.g., Arjun Sharma" 
              value="${this.formData.name}" 
              required 
              autofocus 
            />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div class="form-group">
              <label class="form-label" for="ob-age">Age (Years)</label>
              <input 
                type="number" 
                class="form-input" 
                id="ob-age" 
                min="14" 
                max="95" 
                value="${this.formData.age}" 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label">Biological Sex</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" class="btn-glass ob-sex-toggle ${this.formData.gender === 'male' ? 'active-sex' : ''}" data-sex="male" style="padding: 10px; font-weight: 700;">
                  ♂ Male
                </button>
                <button type="button" class="btn-glass ob-sex-toggle ${this.formData.gender === 'female' ? 'active-sex' : ''}" data-sex="female" style="padding: 10px; font-weight: 700;">
                  ♀ Female
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
            <button type="button" class="btn-blue" id="btn-ob-next-1" style="padding: 12px 28px; font-size: 0.9375rem;">
              Next: Health Parameters
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 2) {
      const initialBmi = calculateIndianBMI(this.formData.weight_kg, this.formData.height_cm);

      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="brand-tag">STEP 2 OF 3 &bull; CLINICAL MEASUREMENTS</span>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">Health & Smart Scale Parameters</h2>
            </div>
            <span class="telemetry-badge badge-cyan">BIA MULTI-FREQUENCY</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
            Input your measurements from any smart weight scale or home tape. We automatically evaluate Asian-Indian BMI and visceral adiposity.
          </p>

          <!-- Height & Weight Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div class="form-group">
              <label class="form-label" for="ob-height">Height (cm)</label>
              <input 
                type="number" 
                step="0.5" 
                class="form-input" 
                id="ob-height" 
                value="${this.formData.height_cm}" 
                min="120" 
                max="230" 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-weight">Body Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                class="form-input" 
                id="ob-weight" 
                value="${this.formData.weight_kg}" 
                min="30" 
                max="220" 
                required 
              />
            </div>
          </div>

          <!-- Live Asian-Indian BMI Preview Pill -->
          <div style="background: rgba(255,255,255,0.75); border: 1px solid rgba(15,23,42,0.08); border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 14px rgba(15,55,90,0.04);">
            <div>
              <span style="font-size: 0.6875rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">ASIAN-INDIAN BMI (WHO CUTOFF)</span>
              <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 2px;">
                <span id="preview-bmi-num" style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-family-data); color: var(--text-primary);">
                  ${initialBmi.bmi}
                </span>
                <span style="font-size: 0.8125rem; color: var(--text-secondary);">kg/m²</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span id="preview-bmi-badge" class="telemetry-badge ${initialBmi.tier.badgeClass}">
                ${initialBmi.tier.label}
              </span>
              <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 4px;">
                Standard Indian Normal: 18.5 - 22.9 kg/m²
              </div>
            </div>
          </div>

          <!-- Smart Scale Bio-impedance Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div class="form-group">
              <div style="display: flex; justify-content: space-between;">
                <label class="form-label" for="ob-vfr">Visceral Fat Index (1 - 30)</label>
                <span id="vfr-rating-tag" style="font-size: 0.6875rem; font-weight: 700; color: ${this.formData.visceral_fat_rating >= 14 ? 'var(--telemetry-crimson)' : this.formData.visceral_fat_rating >= 10 ? 'var(--telemetry-amber)' : 'var(--accent-green)'};">
                  ${this.formData.visceral_fat_rating >= 14 ? 'High Risk' : this.formData.visceral_fat_rating >= 10 ? 'High' : 'Normal'}
                </span>
              </div>
              <input 
                type="number" 
                class="form-input" 
                id="ob-vfr" 
                min="1" 
                max="30" 
                value="${this.formData.visceral_fat_rating}" 
                required 
              />
              <span style="font-size: 0.6875rem; color: var(--text-muted);">Scale: 1-9 Normal, 10-13 Elevated, 14+ Excessive</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-bodyfat">Body Fat (%)</label>
              <input 
                type="number" 
                step="0.1" 
                class="form-input" 
                id="ob-bodyfat" 
                value="${this.formData.body_fat_percent}" 
                min="5" 
                max="60" 
                required 
              />
              <span style="font-size: 0.6875rem; color: var(--text-muted);">Smart scale estimation (e.g. 22.5%)</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-muscle">Skeletal Muscle Mass (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                class="form-input" 
                id="ob-muscle" 
                value="${this.formData.muscle_mass_kg}" 
                min="15" 
                max="80" 
                required 
              />
              <span style="font-size: 0.6875rem; color: var(--text-muted);">Key marker for Thin-Fat recomposition</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-water">Body Water (%)</label>
              <input 
                type="number" 
                step="0.1" 
                class="form-input" 
                id="ob-water" 
                value="${this.formData.body_water_percent}" 
                min="30" 
                max="75" 
              />
              <span style="font-size: 0.6875rem; color: var(--text-muted);">Hydration baseline (typically 50-60%)</span>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div style="display: flex; justify-content: space-between; margin-top: 32px;">
            <button type="button" class="btn-glass" id="btn-ob-back-1" style="padding: 12px 24px;">
              ← Back
            </button>
            <button type="button" class="btn-blue" id="btn-ob-next-2" style="padding: 12px 28px; font-size: 0.9375rem;">
              Next: Food Preferences →
            </button>
          </div>
        </div>
      `;
    } else if (this.currentStep === 3) {
      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="brand-tag">STEP 3 OF 3 &bull; NUTRITION & LIFESTYLE</span>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">Food Preferences & Activity</h2>
            </div>
            <span class="telemetry-badge badge-orange">ICMR-NIN 2024</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
            Select your daily dietary pattern and native cuisine. TransformNXT builds macro-balanced menus using authentic Indian staple groceries.
          </p>

          <!-- Dietary Pattern Cards -->
          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label">Dietary Preference</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 6px;">
              
              <div class="diet-card-pill ${this.formData.dietary_preference === 'vegetarian' ? 'active-diet' : ''}" data-diet="vegetarian">
                <span style="font-size: 1.25rem;">🌱</span>
                <strong style="font-size: 0.8125rem;">Vegetarian</strong>
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">Dairy, pulses, sabzi</span>
              </div>

              <div class="diet-card-pill ${this.formData.dietary_preference === 'eggetarian' ? 'active-diet' : ''}" data-diet="eggetarian">
                <span style="font-size: 1.25rem;">🥚</span>
                <strong style="font-size: 0.8125rem;">Eggetarian</strong>
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">Eggs, dairy & plants</span>
              </div>

              <div class="diet-card-pill ${this.formData.dietary_preference === 'non_vegetarian' ? 'active-diet' : ''}" data-diet="non_vegetarian">
                <span style="font-size: 1.25rem;">🍗</span>
                <strong style="font-size: 0.8125rem;">Non-Veg</strong>
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">Poultry, fish & meat</span>
              </div>

              <div class="diet-card-pill ${this.formData.dietary_preference === 'vegan' ? 'active-diet' : ''}" data-diet="vegan">
                <span style="font-size: 1.25rem;">🌿</span>
                <strong style="font-size: 0.8125rem;">Vegan</strong>
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">100% Plant-based</span>
              </div>

              <div class="diet-card-pill ${this.formData.dietary_preference === 'jain' ? 'active-diet' : ''}" data-diet="jain">
                <span style="font-size: 1.25rem;">🕊️</span>
                <strong style="font-size: 0.8125rem;">Jain</strong>
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">No root vegetables</span>
              </div>

            </div>
          </div>

          <!-- Regional Cuisine Selector -->
          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label" for="ob-region">Regional Cuisine Archetype</label>
            <select class="form-select" id="ob-region">
              <option value="north" ${this.formData.region_cuisine === 'north' ? 'selected' : ''}>🌾 North Indian (Wheat, Roti/Phulka, Dals, Paneer, Curd)</option>
              <option value="south" ${this.formData.region_cuisine === 'south' ? 'selected' : ''}>🥥 South Indian (Rice, Millets, Sambhar, Idli, Fish)</option>
              <option value="east" ${this.formData.region_cuisine === 'east' ? 'selected' : ''}>🐟 East Indian (Rice, Freshwater Fish, Leafy Greens, Dal)</option>
              <option value="west" ${this.formData.region_cuisine === 'west' ? 'selected' : ''}>🫓 West Indian (Jowar, Bajra Rotla, Besan, Kadhi, Thepla)</option>
            </select>
          </div>

          <!-- Activity Level -->
          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label" for="ob-activity">Physical Activity Level</label>
            <select class="form-select" id="ob-activity">
              <option value="sedentary" ${this.formData.activity_level === 'sedentary' ? 'selected' : ''}>Desk Job / Minimal Daily Movement (< 5,000 steps)</option>
              <option value="light" ${this.formData.activity_level === 'light' ? 'selected' : ''}>Light Activity (Walking, light tasks, 1-2 workouts/wk)</option>
              <option value="moderate" ${this.formData.activity_level === 'moderate' ? 'selected' : ''}>Moderately Active (Regular exercise 3-5 days/wk)</option>
              <option value="heavy" ${this.formData.activity_level === 'heavy' ? 'selected' : ''}>Very Active (Hard daily training / Physical occupation)</option>
            </select>
          </div>

          <!-- Navigation Buttons & Final Submission -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 36px;">
            <button type="button" class="btn-glass" id="btn-ob-back-2" style="padding: 12px 24px;">
              ← Back
            </button>
            <button type="submit" class="btn-orange" id="btn-submit-onboarding" style="padding: 14px 34px; font-size: 1rem; font-weight: 800;">
              Generate Plan & Unlock Dashboard
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>
        </div>
      `;
    }
  }

  attachEvents() {
    // Step navigation click
    document.getElementById("step-nav-1")?.addEventListener("click", () => { this.currentStep = 1; this.render(); });
    document.getElementById("step-nav-2")?.addEventListener("click", () => { 
      if (this.formData.name) { this.currentStep = 2; this.render(); }
    });

    // Step 1: Sex Toggle
    this.container.querySelectorAll(".ob-sex-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        this.container.querySelectorAll(".ob-sex-toggle").forEach(b => b.classList.remove("active-sex"));
        btn.classList.add("active-sex");
        this.formData.gender = btn.dataset.sex;
      });
    });

    // Step 1 -> 2
    document.getElementById("btn-ob-next-1")?.addEventListener("click", () => {
      const nameInput = document.getElementById("ob-name");
      if (!nameInput || !nameInput.value.trim()) {
        nameInput.focus();
        this.app.showNotification("Please enter your name to proceed.");
        return;
      }
      this.formData.name = nameInput.value.trim();
      this.formData.age = parseInt(document.getElementById("ob-age").value, 10) || 28;
      this.currentStep = 2;
      this.render();
    });

    // Step 2: Live BMI calculation & VFR preview
    const weightEl = document.getElementById("ob-weight");
    const heightEl = document.getElementById("ob-height");
    const vfrEl = document.getElementById("ob-vfr");

    const updateLiveBmi = () => {
      if (!weightEl || !heightEl) return;
      const w = parseFloat(weightEl.value);
      const h = parseFloat(heightEl.value);
      if (w > 0 && h > 0) {
        const bmiRes = calculateIndianBMI(w, h);
        const bmiNum = document.getElementById("preview-bmi-num");
        const bmiBadge = document.getElementById("preview-bmi-badge");
        if (bmiNum) bmiNum.textContent = bmiRes.bmi;
        if (bmiBadge) {
          bmiBadge.className = `telemetry-badge ${bmiRes.tier.badgeClass}`;
          bmiBadge.textContent = bmiRes.tier.label;
        }
      }
    };

    weightEl?.addEventListener("input", updateLiveBmi);
    heightEl?.addEventListener("input", updateLiveBmi);

    vfrEl?.addEventListener("input", () => {
      const v = parseInt(vfrEl.value, 10);
      const tag = document.getElementById("vfr-rating-tag");
      if (tag) {
        if (v >= 14) {
          tag.style.color = "var(--telemetry-crimson)";
          tag.textContent = "High Risk";
        } else if (v >= 10) {
          tag.style.color = "var(--telemetry-amber)";
          tag.textContent = "High";
        } else {
          tag.style.color = "var(--accent-green)";
          tag.textContent = "Normal";
        }
      }
    });

    // Step 2 Back & Next
    document.getElementById("btn-ob-back-1")?.addEventListener("click", () => {
      this.currentStep = 1;
      this.render();
    });

    document.getElementById("btn-ob-next-2")?.addEventListener("click", () => {
      this.formData.height_cm = parseFloat(document.getElementById("ob-height").value) || 172;
      this.formData.weight_kg = parseFloat(document.getElementById("ob-weight").value) || 70;
      this.formData.visceral_fat_rating = parseInt(document.getElementById("ob-vfr").value, 10) || 10;
      this.formData.body_fat_percent = parseFloat(document.getElementById("ob-bodyfat").value) || 24;
      this.formData.muscle_mass_kg = parseFloat(document.getElementById("ob-muscle").value) || 28;
      this.formData.body_water_percent = parseFloat(document.getElementById("ob-water").value) || 53;
      this.currentStep = 3;
      this.render();
    });

    // Step 3: Diet preference card selection
    this.container.querySelectorAll(".diet-card-pill").forEach(card => {
      card.addEventListener("click", () => {
        this.container.querySelectorAll(".diet-card-pill").forEach(c => c.classList.remove("active-diet"));
        card.classList.add("active-diet");
        this.formData.dietary_preference = card.dataset.diet;
      });
    });

    document.getElementById("btn-ob-back-2")?.addEventListener("click", () => {
      this.currentStep = 2;
      this.render();
    });

    // Step 3 Final Form Submit
    const form = document.getElementById("onboarding-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Collect final inputs
        this.formData.region_cuisine = document.getElementById("ob-region").value;
        this.formData.activity_level = document.getElementById("ob-activity").value;

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

        // Calculate and save initial health log
        const bmiCalc = calculateIndianBMI(this.formData.weight_kg, this.formData.height_cm);
        const logId = "hl_" + Date.now();
        const healthLog = {
          log_id: logId,
          user_id: userId,
          timestamp: new Date().toISOString(),
          weight_kg: this.formData.weight_kg,
          height_cm: this.formData.height_cm,
          bmi_calculated: bmiCalc.bmi,
          visceral_fat_rating: this.formData.visceral_fat_rating,
          subcutaneous_fat_percent: this.formData.subcutaneous_fat_percent,
          muscle_mass_kg: this.formData.muscle_mass_kg,
          body_fat_percent: this.formData.body_fat_percent,
          body_water_percent: this.formData.body_water_percent
        };
        await dbService.addHealthLog(healthLog);

        // Calculate TDEE, BMR, Phenotype & Macros
        const energyData = calculateEnergyAndMacros({
          weightKg: this.formData.weight_kg,
          heightCm: this.formData.height_cm,
          age: this.formData.age,
          gender: this.formData.gender,
          activityLevel: this.formData.activity_level,
          bodyFatPercent: this.formData.body_fat_percent,
          visceralFatRating: this.formData.visceral_fat_rating,
          muscleMassKg: this.formData.muscle_mass_kg
        });

        // Generate ICMR-NIN Indian Meal Plan & ACSM Progressive Workout Routine
        const mealPlan = generateIndianWeeklyMealPlan({
          regionalPreference: this.formData.region_cuisine,
          dietaryPreference: this.formData.dietary_preference,
          targetCalories: energyData.targetDailyCalories,
          targetProteinG: energyData.targetProteinG
        });

        const exercisePlan = generateWeeklyExercisePlan({
          phenotypeKey: energyData.phenotypeResult.phenotype.key,
          weightKg: this.formData.weight_kg,
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
        dbService.syncToBackend();

        // Unlock Dashboard, Chatbot, Tracker and Navigate
        this.app.showNotification(`Parameters saved! Welcome to TransformNXT, ${user.name}.`);
        await this.app.updateHeaderUser();
        this.app.lockNavigationForOnboarding(false);
        this.app.navigateTo("dashboard");
      });
    }
  }
}
