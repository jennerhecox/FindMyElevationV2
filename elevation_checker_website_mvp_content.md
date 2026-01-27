# Find My Elevation

**Instantly see your current elevation using your phone — even with limited or no network connectivity.**  
Fast, private, and optimized for mountain use.

---

## 🌍 Your Current Elevation

> Elevation is calculated locally using your device’s sensors first. Network data is only used if available — never blocking the result.

- **Feet:** _Loading…_
- **Meters:** _Loading…_

📍 Works offline once loaded. Accuracy improves with GPS-enabled devices.

---

## ⚡ Built for Limited Connectivity

This site is designed for environments where signal is weak or unavailable.

**Priority order:**
1. **Device GPS & sensors (offline)**
2. Cached elevation data (offline)
3. Network-based elevation APIs (online fallback)

If the network is slow or unavailable, elevation still loads immediately.

---

## 📊 Elevation Display

Your elevation is shown using a **modern Material Design–style visual control**, optimized for readability outdoors:

- Large numeric readout
- Smooth animated scale / gauge
- Subtle motion only after elevation is resolved

UI rendering never blocks elevation calculation.

---

## 🏔 Elevation Comparison

Once your elevation is displayed, the site optionally loads a **well-known landmark** with a similar height:

> *“You are as high as the Empire State Building.”*

- Landmark name
- Elevation reference
- Simple icon or image

This content:
- Loads **after** elevation is shown
- Is skipped entirely if the network is unavailable
- Never delays the main result

---

## 🔍 How It Works

1. Browser requests location permission
2. Elevation is calculated locally when possible
3. Result is displayed immediately
4. Enhancements (UI animations, landmarks) load asynchronously

---

## 📱 Supported Devices

- iPhone & Android smartphones
- Tablets
- Laptops with location services

Best accuracy comes from devices with dedicated GPS hardware.

---

## 📏 Elevation vs Altitude

- **Elevation:** Height of land above sea level
- **Altitude:** Height of an object in the air

This site measures **ground elevation**.

---

## 🔒 Privacy First

- No accounts
- No analytics trackers
- No stored location data

Everything happens on your device.

---

## 🧭 Common Uses

- Hiking & mountaineering
- Off-road navigation
- Weather & pressure reference
- Quick elevation checks in the field

---

## 📌 Tip

Add this site to your home screen so it works like an app — even offline.

---

---

## 🛠 Recommended Technology Stack

This site is designed as an **offline-first, mobile-optimized web app** using modern, lightweight technologies.

### 🌐 Core Platform

- **Framework:** Vanilla TypeScript or **Astro**  
  - Minimal JavaScript by default
  - Excellent performance on mobile
  - Easy static output

---

### 📡 Location & Elevation

- **Browser Geolocation API**  
  - Primary source for latitude & longitude
  - Works offline once permission is granted

- **Device Sensors (where available)**  
  - GPS-based altitude from mobile hardware

- **Offline Elevation Data (Fallback)**  
  - Cached elevation results stored in `IndexedDB`
  - Optional embedded low-resolution elevation grid

Network-based elevation APIs are **never blocking** and used only as enhancement.

---

### 📦 Offline Support

- **Service Worker (Workbox)**
  - Cache-first strategy for HTML, CSS, JS
  - Offline-first behavior after initial load

- **Storage:**
  - `IndexedDB` for elevation cache
  - `localStorage` for user preferences (units, low-data mode)

---

### 🎨 UI & Material Design

- **UI System:** Material Design 3 (Material You principles)
  - Large typography
  - High contrast for outdoor visibility

- **Styling:**
  - CSS Variables + modern CSS (no heavy framework)
  - Optional **Material Web Components** (`@material/web`)

- **Elevation Display Control:**
  - SVG-based vertical elevation gauge
  - CSS-driven animations (no JS animation libraries)
  - Animations triggered *after* elevation resolves

---

### 📊 Visualization & Controls

- **Rendering:**
  - SVG for gauges and scales (battery efficient)
  - Canvas only if advanced graphs are added later

- **Units Toggle:**
  - Feet ↔ Meters (instant, client-side)

---

### 🏔 Landmark Comparison Objects

Landmarks are loaded **after elevation is shown** and never block the UI.

**Data Source:**
- Embedded JSON file shipped with the app

**Each landmark object includes:**
- `name`
- `type` (tower, mountain, building)
- `elevation_meters`
- `icon_svg` (inline, lightweight)

**Example Objects:**
- Empire State Building (~381 m)
- Eiffel Tower (~330 m)
- Half Dome (~2,694 m)
- Mount Hood (~3,429 m)
- Burj Khalifa (~828 m)

Optional network images are lazy-loaded only when available.

---

### 🔒 Privacy & Performance

- No analytics or trackers
- No stored location history
- No third-party scripts on critical path

Everything runs locally whenever possible.

---

© 2026 Find My Elevation. All rights reserved.

