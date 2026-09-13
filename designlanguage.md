# UI/UX Design Language Specification: TransformNXT

> **Design Theme**: Cyber-Clinical Glass  
> **Brand Identity**: High-End Biomedical Telemetry meets Futuristic Glassmorphism  
> **Color Profile**: Infinite Space Black (`#000000`) with Cyber Laser Green (`#00FF66`)  
> **Operating Mode**: Dark Mode Only (Zero Light Mode)

---

## 1. Design Philosophy & Aesthetic Core

**TransformNXT** delivers a high-performance clinical intelligence interface designed to make personal biometrics, smart scale diagnostics, and Indian nutritional planning feel like piloting a next-generation human telemetry deck.

*   **Cyber-Clinical Authority**: Clean, data-dense, razor-sharp medical data representation without clutter or gimmicks.
*   **Deep Space Immersion**: Pure black infinite canvasing (`#000000` / `#080808`) that eliminates visual distraction and creates high contrast against glowing clinical indicators.
*   **Translucent Layering (Floating Glass)**: Multilayered frosted glass panels (`backdrop-filter: blur(16px)`) with hairline neon borders simulating aerospace head-up display (HUD) elements.
*   **Laser Precision Feedback**: Kinetic micro-animations, neon pulse indicators, and instant telemetry recalculation for real-time plan compliance feedback.

---

## 2. Master Color System & Design Tokens

```css
:root {
  /* Canvas & Base Layers */
  --bg-void: #000000;              /* Pure black base canvas */
  --bg-space: #080808;             /* Elevated background */
  --bg-surface-glass: rgba(20, 20, 20, 0.55);     /* Standard glass layer */
  --bg-surface-glass-hover: rgba(26, 26, 26, 0.7);/* Active/hover glass layer */
  --bg-surface-elevated: rgba(30, 30, 30, 0.8);   /* Modals and popovers */

  /* Cyber Brand & Accent Palette */
  --accent-laser-green: #00FF66;    /* Primary brand signature (Laser glow) */
  --accent-laser-green-glow: rgba(0, 255, 102, 0.35); /* Ambient neon drop shadow */
  --accent-laser-green-subtle: rgba(0, 255, 102, 0.12); /* Hairline borders & tags */
  
  /* Telemetry Status Spectrum */
  --telemetry-optimal: #00FF66;     /* Optimal health / goal achieved */
  --telemetry-cyan: #00F0FF;        /* Hydration / Bio-impedance water % / Aerobic Zone */
  --telemetry-amber: #FFB800;       /* Caution / Pre-risk / Asian-Indian Overweight */
  --telemetry-crimson: #FF2D55;     /* High Risk / High Visceral Fat (VFR > 13) / Missed Target */
  --telemetry-purple: #BF5AF2;      /* Muscle hypertrophy / Strength load */

  /* Text & Data Contrast Hierarchy */
  --text-primary: #FFFFFF;          /* Pure White: Primary headings and critical telemetry */
  --text-secondary: #8E8E93;        /* Muted Grey: Units, labels, timestamps, meta */
  --text-tertiary: #48484A;         /* Deep Slate: Inactive states, disabled controls */
  --text-laser: #00FF66;            /* Highlighted data readouts */

  /* Structural Glass Hairlines */
  --border-glass-default: rgba(255, 255, 255, 0.08); /* Subtle neutral glass perimeter */
  --border-glass-laser: rgba(0, 255, 102, 0.22);    /* Active / Focused laser perimeter */
  --border-glass-risk: rgba(255, 45, 85, 0.35);      /* Critical risk perimeter */

  /* Elevation & Shadows */
  --shadow-glass-depth: 0 8px 32px 0 rgba(0, 0, 0, 0.55);
  --shadow-laser-glow: 0 0 20px rgba(0, 255, 102, 0.25);
  --shadow-laser-glow-lg: 0 0 35px rgba(0, 255, 102, 0.45);
  --shadow-risk-glow: 0 0 20px rgba(255, 45, 85, 0.3);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Blur Matrix */
  --glass-blur-default: blur(16px);
  --glass-blur-heavy: blur(24px);
}
```

---

## 3. Typography & Numerical Telemetry Hierarchy

The typography pairs a clean geometric Grotesque typeface for UI labels with high-precision tabular numerals for clinical data.

*   **Primary Display & UI Font**: `Plus Jakarta Sans`, `Inter`, or system `-apple-system, BlinkMacSystemFont, 'Segoe UI'`
*   **Numerical Telemetry Font**: `Space Grotesk`, `JetBrains Mono`, or tabular lining numerals (`font-feature-settings: "tnum" 1, "zero" 1`)

| Style | Size | Weight | Tracking | Purpose / Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Telemetry** | `3.25rem` (52px) | 800 ExtraBold | `-0.03em` | Primary Adherence Score (e.g., `94.2%`), Daily Calorie Counter |
| **Section Header (HUD)** | `1.75rem` (28px) | 700 Bold | `-0.02em` | Page & Category Titles (e.g., `BIO-IMPEDANCE METRICS`) |
| **Card Header** | `1.15rem` (18px) | 600 SemiBold | `-0.01em` | Glass card titles, workout day markers |
| **Metric Value** | `1.5rem` (24px) | 700 Bold | `0` (Tabular) | Smart scale metrics (`25.8 BMI`, `14 VFR`, `29.8 kg SMM`) |
| **Body / Description** | `0.9375rem` (15px) | 400 Regular | `0` | Guidance notes, exercise descriptions, meal ingredients |
| **Telemetry Pill / Label** | `0.75rem` (12px) | 600 SemiBold | `+0.05em` | All-caps badges (`THIN-FAT RECOMP`, `HIGH VISCERAL`) |

---

## 4. Glassmorphism Architecture & Utility Classes

To achieve genuine depth without visual muddying, components must be constructed using exact CSS glass formulations:

### 4.1 Master Glass Card (`.glass-card`)
```css
.glass-card {
  background: var(--bg-surface-glass);
  backdrop-filter: var(--glass-blur-default);
  -webkit-backdrop-filter: var(--glass-blur-default);
  border: 1px solid var(--border-glass-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-glass-depth);
  transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  background: var(--bg-surface-glass-hover);
  border-color: var(--border-glass-laser);
  box-shadow: var(--shadow-glass-depth), var(--shadow-laser-glow);
  transform: translateY(-2px);
}
```

### 4.2 Interactive Laser Card (`.glass-card-interactive`)
Designed for selectable diet plans, workout checkoffs, and metric cards:
```css
.glass-card-interactive {
  position: relative;
  overflow: hidden;
}

.glass-card-interactive::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: transparent;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.glass-card-interactive.active::before,
.glass-card-interactive:hover::before {
  background: var(--accent-laser-green);
  box-shadow: 0 0 10px var(--accent-laser-green);
}
```

### 4.3 Telemetry Badges (`.telemetry-badge`)
```css
.telemetry-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.telemetry-badge.optimal {
  background: rgba(0, 255, 102, 0.1);
  color: var(--telemetry-optimal);
  border: 1px solid rgba(0, 255, 102, 0.3);
}

.telemetry-badge.warning {
  background: rgba(255, 184, 0, 0.1);
  color: var(--telemetry-amber);
  border: 1px solid rgba(255, 184, 0, 0.3);
}

.telemetry-badge.risk {
  background: rgba(255, 45, 85, 0.1);
  color: var(--telemetry-crimson);
  border: 1px solid rgba(255, 45, 85, 0.3);
  box-shadow: 0 0 8px rgba(255, 45, 85, 0.2);
}
```

---

## 5. Signature Component Specifications

### 5.1 Plan Adherence Gauge (Circular Laser Ring)
*   **Visual Structure**: Double concentric SVG circle.
*   **Track Layer**: `stroke: rgba(255, 255, 255, 0.06); stroke-width: 8px`.
*   **Progress Layer**: `stroke: var(--accent-laser-green); stroke-width: 8px; stroke-linecap: round; filter: drop-shadow(0 0 8px rgba(0, 255, 102, 0.6))`.
*   **Center Readout**: Bold percentage number with tiny subtext: `COMPLIANCE`.

### 5.2 Asian-Indian BMI Spectrum Bar
*   **Multi-segment gauge** marking:
    *   `12.0 - 18.4`: Underweight (Cyan/Blue)
    *   `18.5 - 22.9`: Normal (Laser Green `#00FF66`)
    *   `23.0 - 24.9`: Overweight (Amber `#FFB800`) - *Clinical Indian Threshold highlighted*
    *   `>= 25.0`: Obese (Crimson `#FF2D55`)
*   Floating needle indicator with current BMI and dynamic category pill badge.

### 5.3 Smart Scale Biomarker Matrix
Grid of compact glass tiles displaying:
1.  **Visceral Fat Level**: Number with 1–9 (Normal), 10–13 (Elevated), 14+ (Hazard alert with pulsating crimson beacon).
2.  **Skeletal Muscle Mass (SMM %)**: Color-coded against sex/age baseline.
3.  **Subcutaneous Fat %**: Differential calculation vs. visceral fat.
4.  **Basal Metabolic Rate (BMR)**: Exact kcal floor derived via Katch-McArdle lean mass.

### 5.4 Indian Nutrition & Macro HUD
*   **Macro Energy Breakdown Bar**: 3-segment segmented linear bar (Carbs: Cyan, Protein: Laser Green, Fats: Amber).
*   **Portion Unit Badges**: Specific Indian measurement toggles (`Phulka (x2)`, `Katori (150g)`, `Scoop`, `Grams`).
*   **Meal Cards**: Collapsible glass cards for *Subah Ka Nashta (Breakfast)*, *Dophar Ka Khana (Lunch)*, *Shaam Ki Chai/Snack*, and *Raat Ka Khana (Dinner)* with verified ICMR-NIN IFCT macro stamps.

### 5.5 Workout Execution Checklist
*   Checkable exercise cards with interactive sets/reps counter.
*   Upon checking all sets: Border transitions to full neon laser green with a subtle micro-pulse animation (`scale(1.01)` $\rightarrow$ `scale(1)`).

---

## 6. Motion & Micro-Interactions

*   **Easing Curves**:
    *   Standard Smooth: `cubic-bezier(0.16, 1, 0.3, 1)` (Snappy spring-like response).
    *   Laser Scanline / Shimmer: `linear` continuous loops for telemetry updates.
*   **Pulse Beacon**:
```css
@keyframes laser-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 102, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 255, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 102, 0);
  }
}

.beacon-active {
  width: 8px;
  height: 8px;
  background: var(--accent-laser-green);
  border-radius: 50%;
  animation: laser-pulse 2s infinite;
}
```

---

## 7. Form Controls & Data Input Fields

*   **Input Shells**:
    *   Background: `rgba(12, 12, 12, 0.65)`
    *   Border: `1px solid rgba(255, 255, 255, 0.12)`
    *   Focus State: `border-color: var(--accent-laser-green); box-shadow: 0 0 12px rgba(0, 255, 102, 0.25)`
    *   Color: `#FFFFFF` with placeholder `#55555A`
*   **Slider / Range Controls**:
    *   Custom styled track (`rgba(255, 255, 255, 0.08)`) with glowing green thumb (`18px` circle with `box-shadow: 0 0 10px #00FF66`).

---

## 8. Mobile & Responsive Layout Rules

1.  **Mobile Viewport (<768px)**:
    *   Sticky Bottom Glass Navigation Bar with floating blur effect.
    *   Single-column telemetry stack with swipeable macro dials.
    *   Touch target minimum of `48px x 48px` for all interactive logging buttons.
2.  **Desktop Viewport (>=1024px)**:
    *   Multi-column dashboard with persistent telemetry sidebar and live compliance ring.
    *   Side-by-side view for Diet Plan and Workout Progression.
