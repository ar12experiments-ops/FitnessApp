/**
 * Landing View Component: TransformNXT
 * Payrix-Inspired Liquid Glass Welcome Experience
 * 
 * Shows brand link, evidence-based value highlights, and the clickable
 * "Let's Transform" button that guides users directly to parameter intake.
 */

import { dbService } from "../storage/db.js";

export class LandingView {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById("view-landing");
  }

  async render() {
    // Check if an existing profile is already in local DB
    const existingUser = await dbService.getCurrentUser();

    this.container.innerHTML = `
      <div class="landing-container">
        <!-- Ambient floating liquid glass orbs -->
        <div class="landing-orb landing-orb--1"></div>
        <div class="landing-orb landing-orb--2"></div>
        <div class="landing-orb landing-orb--3"></div>

        <!-- Central Floating Liquid Glass Hero Card -->
        <div class="landing-hero-card">
          
          <!-- Brand Link & Glowing Icon -->
          <a class="landing-brand-link" id="landing-brand-home" href="#welcome" title="TransformNXT — Evidence-Based Fitness">
            <div class="landing-logo-icon">
              <svg width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <div class="landing-brand-name">Transform<span>NXT</span></div>
              <div class="landing-brand-sub">EVIDENCE-BASED HEALTH TELEMETRY</div>
            </div>
          </a>

          <!-- Pill Tagline -->
          <div class="landing-pill-tag">
            <span class="pill-dot"></span>
            ZERO HALLUCINATION &bull; ICMR-NIN & ACSM GROUNDED
          </div>

          <!-- Hero Headline -->
          <h1 class="landing-title">
            Transform Your Health with <span class="highlight-blue">Clinical Precision</span>
          </h1>

          <!-- Subtitle -->
          <p class="landing-subtitle">
            The first evidence-based telemetry deck engineered for South Asian physiology.
            Translate smart scale bio-impedance into hyper-personalized Indian meal plans
            and progressive exercise protocols.
          </p>

          <!-- Core Capability Pills -->
          <div class="landing-pills-row">
            <div class="feature-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Asian-Indian Specific BMI
            </div>
            <div class="feature-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Thin-Fat Recomposition
            </div>
            <div class="feature-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
              ICMR-NIN Regional Diets
            </div>
            <div class="feature-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              AI Health Companion
            </div>
            <div class="feature-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              100% Offline & Private
            </div>
          </div>

          <!-- Actions: "Let's Transform" Button -->
          <div class="landing-actions">
            <button class="landing-cta" id="btn-lets-transform">
              Let's Transform
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>

            ${existingUser ? `
              <button class="landing-resume-btn" id="btn-resume-dashboard">
                <span>Welcome back, <strong>${existingUser.name}</strong></span>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            ` : ''}

            <p class="landing-notice">
              <strong>Zero cloud data leak.</strong> All computations and telemetry run locally
              in your browser. No registration required.
            </p>
          </div>

        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // "Let's Transform" CTA button
    document.getElementById("btn-lets-transform")?.addEventListener("click", () => {
      this.app.startOnboarding();
    });

    // Brand link click returns to welcome page
    document.getElementById("landing-brand-home")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.render();
    });

    // Resume button for returning users
    document.getElementById("btn-resume-dashboard")?.addEventListener("click", async () => {
      this.app.showAppShell();
      await this.app.updateHeaderUser();
      this.app.navigateTo("dashboard");
    });
  }
}
