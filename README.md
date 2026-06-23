# Green Apple | جرين ابل — Luxury E-Commerce & Admin Panel

A premium, highly responsive smartphone e-commerce storefront and admin console built for **Green Apple (جرين ابل)**, a specialized iPhone and accessory store based in Sana'a, Yemen (Al Qasr Street, in front of the Chinese Embassy).

Built from scratch using pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (no frameworks), featuring a luxury Apple-inspired glassmorphism theme, bilingual Arabic (RTL) / English (LTR) transitions, a WhatsApp ordering system, and a persistent serverless backend using **Netlify Functions** and **Netlify Blobs**.

---

## 🌟 Key Features

- **Apple-inspired UI/UX**: Premium dark/light themes cached in `localStorage`, CSS grid, transitions, and slide animations.
- **Bilingual Adaptability**: Instant toggle between Arabic (RTL, Cairo font) and English (LTR, Outfit font).
- **Dynamic Catalog**: Category selector chips, price range slider, real-time live search filter, and multi-parameter sorting.
- **WhatsApp Checkout**: Auto-creates formatted messages containing name, description, SKU, pricing, and exact item URL.
- **Campaign Promos**: Active banners, embedded review video cards, and synchronized JavaScript countdown clocks.
- **Physical Coordinates**: Interactive Google Map pointing directly to Al Qasr Street (in front of the Chinese Embassy).
- **Admin HUD CRUD**: Fully functional dashboard (Categories, Products, Offers, Videos) with file upload image readers.
- **Local Fallback Mode**: If server endpoints are offline, scripts automatically read/write to browser `localStorage` with pre-seeded mockup items.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5 (Semantic Structure), CSS3 (Logical properties & CSS Grid), Vanilla JavaScript (no dependencies).
- **Backend API**: Node.js Netlify Serverless Functions (`functions/api.js`).
- **Database**: Netlify Blobs (`@netlify/blobs`) for persistent production storage.
- **Fonts & Icons**: Google Fonts (Cairo & Outfit), Font Awesome v6 icons.

---

## 🔐 Default Admin Credentials

To log into the administration panel:
1. Navigate to `/admin/login.html` (or click **لوحة التحكم / Admin Dashboard** in the footer).
2. Enter the default credentials:
   - **Username**: `admin`
   - **Password**: `greenapple2026`
3. Check *Remember Login* if you wish to persist the session in `localStorage`.

---

## 🚀 Getting Started

### Method 1: Zero Setup (Local Static Preview)
Simply double-click `index.html` in your browser (or use VS Code Live Server). 
- Because the frontend has a **smart connection checker**, if it detects the serverless backend is offline, it will automatically clone the default iPhone catalog into your browser's `localStorage`!
- You can add, edit, and delete products, categories, or banners from `/admin/dashboard.html` and see them update on the storefront immediately!

### Method 2: Running Serverless Locally (Netlify Dev)
To test the serverless Node.js endpoints locally:
1. Ensure you have Node.js installed.
2. Install Netlify CLI globally if you haven't:
   ```bash
   npm install -g netlify-cli
   ```
3. Install package dependencies:
   ```bash
   npm install
   ```
4. Start the Netlify local development server:
   ```bash
   netlify dev
   ```
   This will boot up the local functions emulator at `http://localhost:8888` and route `/api/*` requests to the function handler in `functions/api.js`.

---

## ☁️ Production Deployment (Netlify)

This project is pre-configured for direct Git integration on Netlify:
1. Connect this repository to your Netlify dashboard.
2. The `netlify.toml` file will automatically define:
   - Functions build directory (`functions/`)
   - API redirects routing (`/api/*` points to `/.netlify/functions/api`)
3. **Netlify Blobs Store**: Netlify Blobs will automatically activate once deployed. All created products, categories, active banners, and videos will persist permanently in Netlify's distributed store, remaining secure and accessible after browser refreshes.
4. Customize your site metadata in the header tags for search engine optimization.
