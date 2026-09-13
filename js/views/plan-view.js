/**
 * Weekly Plan View Component: TransformNXT (Light Liquid Glass Theme)
 * Displays the evidence-based 7-day Indian meal plan and progressive workout routine.
 * Features YouTube instructional video links with an inbuilt in-app video viewer.
 */

import { dbService } from "../storage/db.js";
import { getExerciseById, getYoutubeEmbedUrl } from "../data/exercise-library.js";

export class PlanView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-plan");
    this.selectedDayIndex = 0; // Monday default
    this.activeInlineVideoId = null;
    this.boundKeyDownHandler = null;
  }

  async render() {
    const user = await dbService.getCurrentUser();
    const plan = user ? await dbService.getLatestWeeklyPlan(user.user_id) : null;

    if (!user || !plan) {
      this.app.navigateTo("onboarding");
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
          <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary);">Weekly Strategy & Prescriptions</h1>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Regional: <strong style="color: var(--text-primary); text-transform: capitalize;">${user.region_cuisine} Indian</strong> | 
            Diet: <strong style="color: var(--text-primary); text-transform: capitalize;">${user.dietary_preference.replace("_", " ")}</strong> | 
            Calorie Target: <strong style="color: var(--accent-orange);">${plan.target_daily_calories} kcal</strong> | 
            Protein Floor: <strong style="color: var(--accent-green);">${plan.target_protein_g}g</strong>
          </p>
        </div>

        <button class="btn-blue btn-sm" id="btn-log-day-plan">
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
              <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${days[this.selectedDayIndex]} Nutrition Strategy</h2>
            </div>
            <span class="telemetry-badge badge-orange">~${currentMealDay ? currentMealDay.dayCalories : 0} kcal</span>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary); font-family: var(--font-family-data);">
            <span>Est. Protein: <strong style="color: var(--accent-green);">${currentMealDay ? currentMealDay.dayProteinG : 0}g</strong></span>
            <span>&bull;</span>
            <span>Est. Fiber: <strong style="color: var(--telemetry-cyan);">${currentMealDay ? currentMealDay.dayFiberG : 0}g</strong></span>
          </div>

          <!-- Meal Slots -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${(currentMealDay ? currentMealDay.mealSlots : []).map(slot => `
              <div style="background: #FFFFFF; border: 1px solid var(--border-glass-default); border-radius: var(--radius-sm); padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                  <h3 style="font-size: 0.9375rem; font-weight: 700; color: var(--text-primary);">${slot.mealSlot}</h3>
                  <span style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-family-data);">${slot.time}</span>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${slot.items.map(it => `
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8125rem; padding: 4px 0; border-bottom: 1px solid #F1F5F9;">
                      <div>
                        <strong style="color: var(--text-primary);">${it.name}</strong>
                        <span style="color: var(--text-secondary); margin-left: 6px;">(${it.portion})</span>
                      </div>
                      <div style="color: var(--accent-green); font-family: var(--font-family-data); font-weight: 600;">
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
              <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${days[this.selectedDayIndex]} Training</h2>
            </div>
            <span class="telemetry-badge ${currentWorkoutDay && currentWorkoutDay.type === 'zone2_cardio' ? 'badge-orange' : 'badge-optimal'}">
              ${currentWorkoutDay ? currentWorkoutDay.type.toUpperCase().replace("_", " ") : "REST"}
            </span>
          </div>

          <div style="background: var(--accent-green-subtle); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.9375rem;">${currentWorkoutDay ? currentWorkoutDay.sessionName : "Rest Day"}</strong>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">Duration: ${currentWorkoutDay ? currentWorkoutDay.durationMin : 0} min</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.6875rem; color: var(--text-secondary);">MET CALORIE BURN</span>
                <div style="font-size: 1.125rem; font-weight: 800; color: var(--accent-green-hover); font-family: var(--font-family-data);">
                  ~${currentWorkoutDay ? currentWorkoutDay.estimatedCaloriesBurned : 0} kcal
                </div>
              </div>
            </div>
          </div>

          <!-- Exercises List with Inbuilt YouTube Video Player -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${(currentWorkoutDay ? currentWorkoutDay.exercises : []).map(ex => {
              const fullEx = getExerciseById(ex.id) || ex;
              const ytId = ex.youtube_id || fullEx.youtube_id || "IODxDxX7oi4";
              const ytTitle = ex.youtube_title || fullEx.youtube_title || `${ex.name} Tutorial`;
              const setsReps = `${ex.default_sets || 3} sets &bull; ${ex.default_reps || "10-12"}`;
              const muscle = ex.target_muscle || "Full Body";
              const movement = ex.movement_type || "compound";
              const category = (ex.category || "strength").toUpperCase();

              return `
                <div class="workout-item-card" id="ex-card-${ex.id}">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div>
                      <strong style="color: var(--text-primary); font-size: 0.9375rem;">${ex.name}</strong>
                      <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                        Target: <span style="color: var(--accent-blue); font-weight: 600;">${muscle}</span> (${movement})
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <span class="telemetry-badge badge-cyan" style="font-size: 0.6875rem;">${setsReps}</span>
                    </div>
                  </div>

                  <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin-top: 6px;">
                    ${ex.instructions}
                  </div>

                  <div style="font-size: 0.6875rem; color: var(--accent-orange-hover); margin-top: 4px;">
                    💡 Home alternative: ${ex.home_alternative || "Bodyweight modification"}
                  </div>

                  <!-- Exercise Video Actions & YouTube Link Bar -->
                  <div class="exercise-video-bar">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <!-- Primary Action: Inbuilt Modal Viewer (No redirect) -->
                      <button class="btn-video-watch btn-open-video-modal"
                        data-exercise-name="${ex.name}"
                        data-youtube-id="${ytId}"
                        data-title="${ytTitle}"
                        data-category="${category}"
                        data-prescription="${setsReps}"
                        data-muscle="${muscle}"
                        data-instructions="${encodeURIComponent(ex.instructions || '')}"
                        title="Watch form video inside inbuilt player">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Watch Video
                      </button>

                      <!-- Secondary Action: Inline Accordion Toggle -->
                      <button class="btn-video-inline-toggle btn-toggle-inline-video"
                        data-exercise-id="${ex.id}"
                        data-youtube-id="${ytId}"
                        title="Toggle inline video player">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                        Inline
                      </button>
                    </div>

                    <!-- External Link (Accessible option) -->
                    <a href="https://www.youtube.com/watch?v=${ytId}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style="font-size: 0.6875rem; color: #DC2626; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 3px;"
                      title="Open video on YouTube in a new tab">
                      YouTube ↗
                    </a>
                  </div>

                  <!-- Inline Collapsible Video Container -->
                  <div class="inline-video-collapse" id="inline-video-${ex.id}"></div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Day switcher tabs
    this.container.querySelectorAll(".hud-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedDayIndex = parseInt(btn.dataset.dayIndex, 10);
        this.render();
      });
    });

    // Log day plan button
    document.getElementById("btn-log-day-plan")?.addEventListener("click", () => {
      this.app.navigateTo("tracking");
    });

    // 1. Inbuilt Video Modal Trigger
    this.container.querySelectorAll(".btn-open-video-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const ytId = btn.dataset.youtubeId;
        const exName = btn.dataset.exerciseName;
        const title = btn.dataset.title;
        const category = btn.dataset.category;
        const prescription = btn.dataset.prescription;
        const muscle = btn.dataset.muscle;
        const instructions = decodeURIComponent(btn.dataset.instructions || "");

        this.openVideoModal({
          youtubeId: ytId,
          name: exName,
          title: title,
          category: category,
          prescription: prescription,
          muscle: muscle,
          instructions: instructions
        });
      });
    });

    // 2. Inline Accordion Video Toggle
    this.container.querySelectorAll(".btn-toggle-inline-video").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const exId = btn.dataset.exerciseId;
        const ytId = btn.dataset.youtubeId;
        this.toggleInlineVideo(exId, ytId, btn);
      });
    });

    // 3. Modal Close Handlers
    this.setupModalControls();
  }

  /**
   * Opens the in-app video modal and begins playback
   */
  openVideoModal({ youtubeId, name, title, category, prescription, muscle, instructions }) {
    const modal = document.getElementById("inbuilt-video-modal");
    const iframe = document.getElementById("video-modal-iframe");
    const titleEl = document.getElementById("video-modal-title");
    const badgeEl = document.getElementById("video-modal-badge");
    const prescriptionEl = document.getElementById("video-modal-prescription");
    const cuesEl = document.getElementById("video-modal-cues");
    const ytLink = document.getElementById("video-modal-yt-link");

    if (!modal || !iframe) return;

    // Update metadata
    if (titleEl) titleEl.textContent = title || `${name} Tutorial`;
    if (badgeEl) badgeEl.textContent = `${category || "STRENGTH"} • ${muscle || "TARGET"}`;
    if (prescriptionEl) prescriptionEl.innerHTML = prescription || "3 sets • 10-12 reps";
    if (cuesEl) cuesEl.innerHTML = `<strong>Form Guidance:</strong> ${instructions || "Maintain strict posture, control tempo, and focus on full range of motion."}`;
    if (ytLink) ytLink.href = `https://www.youtube.com/watch?v=${youtubeId}`;

    // Set YouTube Embed with Autoplay
    iframe.src = getYoutubeEmbedUrl(youtubeId);

    // Display modal
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  /**
   * Closes the in-app video modal and halts video/audio playback
   */
  closeVideoModal() {
    const modal = document.getElementById("inbuilt-video-modal");
    const iframe = document.getElementById("video-modal-iframe");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Clear iframe src immediately to stop audio/video
    if (iframe) {
      iframe.src = "";
    }
  }

  /**
   * Toggles collapsible inline video inside the exercise card
   */
  toggleInlineVideo(exerciseId, youtubeId, btn) {
    const container = document.getElementById(`inline-video-${exerciseId}`);
    if (!container) return;

    const isActive = container.classList.contains("active");

    if (isActive) {
      // Close inline video
      container.classList.remove("active");
      container.innerHTML = "";
      btn.innerHTML = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg> Inline`;
      btn.style.background = "#F8FAFC";
      btn.style.color = "var(--text-secondary)";
    } else {
      // Open inline video
      container.classList.add("active");
      container.innerHTML = `<iframe src="${getYoutubeEmbedUrl(youtubeId)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      btn.innerHTML = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg> Close`;
      btn.style.background = "var(--accent-blue-subtle)";
      btn.style.color = "var(--accent-blue)";
    }
  }

  setupModalControls() {
    const modal = document.getElementById("inbuilt-video-modal");
    const closeBtn = document.getElementById("btn-close-video-modal");

    // Close on '✕' click
    closeBtn?.addEventListener("click", () => {
      this.closeVideoModal();
    });

    // Close on backdrop click outside the card
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeVideoModal();
      }
    });

    // Close on ESC keydown
    if (this.boundKeyDownHandler) {
      window.removeEventListener("keydown", this.boundKeyDownHandler);
    }
    this.boundKeyDownHandler = (e) => {
      if (e.key === "Escape") {
        this.closeVideoModal();
      }
    };
    window.addEventListener("keydown", this.boundKeyDownHandler);
  }
}
