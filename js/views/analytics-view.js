/**
 * Analytics & Progress History Component: TransformNXT
 * Displays multi-day compliance trends, smart scale bio-impedance deltas,
 * and JSON data backup/restore capabilities.
 */

import { dbService } from "../storage/db.js";

export class AnalyticsView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-analytics");
  }

  async render() {
    const user = await dbService.getCurrentUser();
    const healthLogs = user ? await dbService.getHealthLogs(user.user_id) : [];
    const trackingLogs = user ? await dbService.getAllDailyTrackings(user.user_id) : [];

    this.container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="telemetry-badge badge-optimal">LONGITUDINAL TELEMETRY</span>
            <span class="brand-tag">PROGRESS ANALYTICS</span>
          </div>
          <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em;">Health Metrics & Compliance History</h1>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn-glass btn-sm" id="btn-export-backup">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Export Encrypted JSON
          </button>
          <label class="btn-glass btn-sm" style="cursor: pointer;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Import Backup
            <input type="file" id="file-import-backup" accept=".json" style="display: none;" />
          </label>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px;">
        
        <!-- Health Logs History -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF;">Smart Scale Time-Series</h2>
            <span class="telemetry-badge badge-cyan">${healthLogs.length} Records</span>
          </div>

          ${healthLogs.length === 0 ? `
            <div style="color: var(--text-secondary); font-size: 0.875rem; padding: 20px; text-align: center;">No health logs recorded yet.</div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto;">
              ${healthLogs.map(l => `
                <div style="background: rgba(14, 14, 14, 0.7); border: 1px solid var(--border-glass-default); border-radius: var(--radius-sm); padding: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="color: #FFFFFF; font-size: 0.9375rem;">${new Date(l.timestamp).toLocaleDateString()}</strong>
                    <span class="telemetry-badge badge-optimal">${l.bmi_calculated} BMI</span>
                  </div>
                  <div style="display: flex; gap: 14px; font-size: 0.8125rem; color: var(--text-secondary); font-family: var(--font-family-telemetry);">
                    <span>Weight: <strong style="color: #FFFFFF;">${l.weight_kg} kg</strong></span>
                    <span>Visceral Fat: <strong style="color: ${l.visceral_fat_rating > 13 ? 'var(--telemetry-crimson)' : 'var(--accent-laser-green)'};">${l.visceral_fat_rating}</strong></span>
                    <span>Muscle: <strong style="color: var(--accent-laser-green);">${l.muscle_mass_kg} kg</strong></span>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <!-- Daily Adherence History -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF;">Daily Plan Match Compliance</h2>
            <span class="telemetry-badge badge-optimal">${trackingLogs.length} Tracked Days</span>
          </div>

          ${trackingLogs.length === 0 ? `
            <div style="color: var(--text-secondary); font-size: 0.875rem; padding: 20px; text-align: center;">No daily logs recorded yet.</div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto;">
              ${trackingLogs.map(t => `
                <div style="background: rgba(14, 14, 14, 0.7); border: 1px solid var(--border-glass-default); border-radius: var(--radius-sm); padding: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="color: #FFFFFF; font-size: 0.9375rem;">${t.date}</strong>
                    <span class="telemetry-badge ${t.compliance_score_percent >= 80 ? 'badge-optimal' : 'badge-warning'}">
                      ${t.compliance_score_percent}% Match
                    </span>
                  </div>
                  <div style="display: flex; gap: 14px; font-size: 0.8125rem; color: var(--text-secondary); font-family: var(--font-family-telemetry);">
                    <span>Cals: <strong style="color: #FFFFFF;">${t.calories_consumed}</strong></span>
                    <span>Protein: <strong style="color: var(--accent-laser-green);">${t.protein_consumed}g</strong></span>
                    <span>Exercises: <strong style="color: var(--telemetry-cyan);">${t.exercises_completed ? t.exercises_completed.length : 0} done</strong></span>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Export Backup
    document.getElementById("btn-export-backup")?.addEventListener("click", async () => {
      const backupJson = await dbService.exportCompleteBackup();
      const blob = new Blob([backupJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TransformNXT_Backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.app.showNotification("Encrypted telemetry backup downloaded successfully!");
    });

    // Import Backup
    const fileInput = document.getElementById("file-import-backup");
    fileInput?.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await dbService.importBackup(event.target.result);
          this.app.showNotification("Backup imported! Reloading telemetry...");
          await this.render();
          this.app.updateHeaderUser();
        } catch (err) {
          alert("Invalid backup file: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}
