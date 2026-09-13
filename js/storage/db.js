/**
 * Local-First IndexedDB Storage Service: TransformNXT
 * Secure, offline-capable client-side database managing:
 * - users
 * - health_logs (time-series smart scale bio-impedance data)
 * - weekly_plans
 * - daily_tracking
 */

const DB_NAME = "TransformNXT_DB";
const DB_VERSION = 1;

class StorageService {
  constructor() {
    this.db = null;
    this.isReady = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store: Users
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "user_id" });
        }

        // Store: Health Logs (Time-series)
        if (!db.objectStoreNames.contains("health_logs")) {
          const logStore = db.createObjectStore("health_logs", { keyPath: "log_id" });
          logStore.createIndex("user_id", "user_id", { unique: false });
          logStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Store: Weekly Plans
        if (!db.objectStoreNames.contains("weekly_plans")) {
          const planStore = db.createObjectStore("weekly_plans", { keyPath: "plan_id" });
          planStore.createIndex("user_id", "user_id", { unique: false });
        }

        // Store: Daily Tracking
        if (!db.objectStoreNames.contains("daily_tracking")) {
          const trackStore = db.createObjectStore("daily_tracking", { keyPath: "track_id" });
          trackStore.createIndex("user_id", "user_id", { unique: false });
          trackStore.createIndex("date", "date", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  // --- GENERIC CRUD HELPERS ---
  async put(storeName, item) {
    await this.isReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve(item);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async get(storeName, key) {
    await this.isReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getAll(storeName) {
    await this.isReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async delete(storeName, key) {
    await this.isReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // --- APP-SPECIFIC METHODS ---

  async saveUser(user) {
    return this.put("users", user);
  }

  async getCurrentUser() {
    const users = await this.getAll("users");
    return users.length > 0 ? users[0] : null;
  }

  async addHealthLog(log) {
    return this.put("health_logs", log);
  }

  async getHealthLogs(userId) {
    const all = await this.getAll("health_logs");
    const filtered = userId ? all.filter(l => l.user_id === userId) : all;
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getLatestHealthLog(userId) {
    const logs = await this.getHealthLogs(userId);
    return logs.length > 0 ? logs[0] : null;
  }

  async saveWeeklyPlan(plan) {
    return this.put("weekly_plans", plan);
  }

  async getLatestWeeklyPlan(userId) {
    const all = await this.getAll("weekly_plans");
    const filtered = userId ? all.filter(p => p.user_id === userId) : all;
    return filtered.length > 0 ? filtered[filtered.length - 1] : null;
  }

  async saveDailyTracking(tracking) {
    return this.put("daily_tracking", tracking);
  }

  async getDailyTrackingForDate(userId, dateStr) {
    const all = await this.getAll("daily_tracking");
    return all.find(t => t.user_id === userId && t.date === dateStr) || null;
  }

  async getAllDailyTrackings(userId) {
    const all = await this.getAll("daily_tracking");
    const filtered = userId ? all.filter(t => t.user_id === userId) : all;
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // --- EXPORT & IMPORT ---
  async exportCompleteBackup() {
    const users = await this.getAll("users");
    const health_logs = await this.getAll("health_logs");
    const weekly_plans = await this.getAll("weekly_plans");
    const daily_tracking = await this.getAll("daily_tracking");

    return JSON.stringify({
      schema_version: "1.0",
      app: "TransformNXT",
      exported_at: new Date().toISOString(),
      data: {
        users,
        health_logs,
        weekly_plans,
        daily_tracking
      }
    }, null, 2);
  }

  async importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) throw new Error("Invalid backup format");

      for (const u of parsed.data.users || []) await this.put("users", u);
      for (const l of parsed.data.health_logs || []) await this.put("health_logs", l);
      for (const p of parsed.data.weekly_plans || []) await this.put("weekly_plans", p);
      for (const t of parsed.data.daily_tracking || []) await this.put("daily_tracking", t);

      return true;
    } catch (err) {
      console.error("Backup import failed:", err);
      throw err;
    }
  }

  // --- RENDER BACKEND SYNC ---
  async syncToBackend() {
    try {
      const backupJson = await this.exportCompleteBackup();
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: backupJson
      });
      if (res.ok) {
        const data = await res.json();
        console.log("[TransformNXT Backend] Telemetry synced to server:", data);
        return data;
      }
    } catch (err) {
      // Graceful silence if running on purely static local environment
      console.debug("[TransformNXT] Server sync offline/skipped:", err.message);
    }
    return null;
  }
}

export const dbService = new StorageService();
