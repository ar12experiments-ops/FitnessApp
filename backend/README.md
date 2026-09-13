# TransformNXT Backend & Render Deployment Architecture

This directory houses the backend server logic, data storage copies, and engine specifications for deployment on [Render](https://render.com).

## Overview

TransformNXT employs a hybrid architecture:
1. **Client-Side Progressive Web App**: Deterministic execution adhering strictly to ICMR-NIN 2024 and WHO Asian-Indian clinical cutoffs.
2. **Node.js Web Service on Render (`server.js`)**:
   - Serves high-performance static assets with caching headers.
   - Provides REST API endpoints for telemetry sync, live backups, health checks, and reference nutrition datasets.
   - Dual runtime mode: Uses **Express** and **CORS** in production, with an automated fallback to native Node `http` if packages are not yet installed.

---

## Backend REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service liveness probe returning uptime, environment, and status for Render |
| `GET` | `/api/sync` | Retrieves the latest telemetry snapshot stored on the server |
| `POST` | `/api/sync` | Synchronizes user profile, BIA health logs, weekly meal plan, and daily compliance to the server |
| `GET` | `/api/foods` | Serves the ICMR-NIN Indian Food Composition Tables (IFCT) dataset |
| `GET` | `/api/exercises` | Serves the ACSM-calibrated exercise and MET biomechanical dataset |

---

## Render Deployment Options

### Option A: Render Blueprint (One-Click Auto-Deploy)
The repository contains `render.yaml`. When you create a new Blueprint on Render and link this repository:
- Service Type: `web`
- Environment: `node` (Node 20)
- Build Command: `npm install`
- Start Command: `node server.js`
- Health Check Path: `/api/health`

### Option B: Manual Web Service Setup
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository: `https://github.com/ar12experiments-ops/FitnessApp`.
4. Configure settings:
   - **Name**: `transformnxt-fitness`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
5. Click **Create Web Service**.

### Option C: Static Site (Alternative)
If you only desire CDN static hosting without the Node backend:
- Click **New +** $\rightarrow$ **Static Site**
- **Publish Directory**: `.`
- **Build Command**: *(leave empty)*
