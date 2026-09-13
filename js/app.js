/**
 * TransformNXT: Application Coordinator & SPA Router
 * Payrix-Inspired Liquid Glass Theme — Welcome Landing → Parameters → Full Dashboard Flow
 */

import { dbService } from "./storage/db.js";

import { LandingView } from "./views/landing-view.js";
import { OnboardingView } from "./views/onboarding-view.js";
import { ProfileView } from "./views/profile-view.js";
import { DashboardView } from "./views/dashboard-view.js";
import { PlanView } from "./views/plan-view.js";
import { TrackingView } from "./views/tracking-view.js";
import { ChatbotView } from "./views/chatbot-view.js";
import { AnalyticsView } from "./views/analytics-view.js";

class TransformNXTApp {
  constructor() {
    this.currentView = "landing";
    this.appShell = document.getElementById("app-shell");

    this.views = {
      landing: new LandingView(this),
      onboarding: new OnboardingView(this),
      dashboard: new DashboardView(this),
      plan: new PlanView(this),
      tracking: new TrackingView(this),
      chatbot: new ChatbotView(this),
      analytics: new AnalyticsView(this),
      profile: new ProfileView(this)
    };
  }

  async init() {
    // Setup Navigation and Header Listeners
    this.setupNavigation();

    // The landing page upon opening the link should always be the welcome page with "Let's Transform"
    this.showLanding();
  }

  /** Show the full-screen landing welcome page, hide app shell */
  showLanding() {
    this.currentView = "landing";
    this.appShell.style.display = "none";
    const mobileNav = document.getElementById("mobile-navbar");
    if (mobileNav) mobileNav.style.display = "none";

    // Hide any other active view sections
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const landingSec = document.getElementById("view-landing");
    if (landingSec) {
      landingSec.classList.add("active");
      landingSec.style.display = "block";
    }

    this.views.landing.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Transition from landing to parameters intake page */
  startOnboarding() {
    const landingSec = document.getElementById("view-landing");
    if (landingSec) {
      landingSec.style.display = "none";
      landingSec.classList.remove("active");
    }

    this.showAppShell();
    this.lockNavigationForOnboarding(true);
    this.navigateTo("onboarding");
  }

  /** Show the main app shell (header + nav + views) */
  showAppShell() {
    this.appShell.style.display = "flex";
  }

  lockNavigationForOnboarding(isLocked) {
    const desktopNav = document.getElementById("desktop-navbar");
    const mobileNav = document.getElementById("mobile-navbar");
    const userBtn = document.getElementById("header-user-btn");

    if (isLocked) {
      if (desktopNav) desktopNav.style.display = "none";
      if (mobileNav) mobileNav.style.display = "none";
      if (userBtn) userBtn.style.display = "none";
    } else {
      if (desktopNav) desktopNav.style.display = "flex";
      if (mobileNav) mobileNav.style.display = "";
      if (userBtn) userBtn.style.display = "flex";
    }
  }

  setupNavigation() {
    // Brand header click -> Return to Landing Welcome page
    document.getElementById("main-header-brand")?.addEventListener("click", () => {
      this.showLanding();
    });

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
    if (user) {
      this.lockNavigationForOnboarding(false);
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
