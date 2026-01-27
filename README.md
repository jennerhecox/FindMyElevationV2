# Find My Elevation

> Instantly see your current elevation using your phone — even with limited or no network connectivity. Fast, private, and optimized for mountain use.

![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen)
![Offline](https://img.shields.io/badge/Offline-Ready-blue)
![Privacy](https://img.shields.io/badge/Privacy-First-orange)

## Features

- **Offline-First**: Works completely offline after the first load
- **GPS-Based**: Uses device GPS altitude when available
- **Smart Caching**: Automatically caches elevation data using IndexedDB
- **Material Design 3**: Beautiful, outdoor-optimized UI with high contrast
- **Visual Gauge**: Animated SVG elevation gauge with dynamic scale
- **Landmark Comparison**: Compare your elevation to famous landmarks
- **Units Toggle**: Switch between meters and feet instantly
- **Privacy-Focused**: No accounts, no tracking, no stored location data
- **PWA Ready**: Installable on iOS and Android as a native-like app

## Architecture

### Elevation Detection Cascade

The app uses a smart priority system to get your elevation:

1. **GPS Altitude** (fastest, works offline) - Extracts altitude directly from device GPS
2. **IndexedDB Cache** (works offline) - Uses previously cached elevation data nearby
3. **Network API** (optional, Phase 6) - Falls back to network-based elevation APIs

### Tech Stack

- **Framework**: [Astro](https://astro.build) - Zero JS by default, islands architecture
- **Language**: TypeScript
- **Offline**: Service Worker via [@vite-pwa/astro](https://vite-pwa-org.netlify.app/)
- **Storage**: IndexedDB for elevation cache, localStorage for preferences
- **UI**: Material Design 3 with CSS Variables
- **Visualization**: SVG with CSS animations

## Project Structure

```text
myaltitude/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── icons/                     # PWA icons (need to be generated)
│   └── favicon.svg                # Favicon
├── src/
│   ├── components/
│   │   ├── ElevationGauge.astro      # SVG elevation gauge
│   │   ├── LandmarkComparison.astro  # Landmark display
│   │   └── OfflineIndicator.astro    # Network status indicator
│   ├── layouts/
│   │   └── Layout.astro              # Base layout with MD3
│   ├── lib/
│   │   ├── elevation/
│   │   │   ├── detector.ts           # Core detection cascade
│   │   │   ├── gps-altitude.ts       # GPS sensor extraction
│   │   │   └── cache-manager.ts      # IndexedDB cache ops
│   │   ├── storage/
│   │   │   ├── indexed-db.ts         # IndexedDB wrapper
│   │   │   └── preferences.ts        # localStorage settings
│   │   ├── landmarks/
│   │   │   ├── matcher.ts            # Elevation matching
│   │   │   └── data.ts               # Data management
│   │   └── utils/
│   │       ├── units.ts              # Unit conversions
│   │       └── format.ts             # Number formatting
│   ├── data/
│   │   └── landmarks.json            # Landmark database (29 landmarks)
│   ├── styles/
│   │   ├── global.css                # Global styles
│   │   ├── material-theme.css        # MD3 design tokens
│   │   └── components.css            # Component styles
│   └── pages/
│       └── index.astro               # Main page
├── astro.config.mjs                  # Astro + PWA config
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`

### Browser Requirements

- **Location Services**: The app requires access to your device's location
- **Modern Browser**: Chrome 90+, Safari 14+, Firefox 88+, or Edge 90+
- **HTTPS**: Required for Geolocation API and PWA features (except localhost)

## Usage

1. **Grant Location Permission**: On first visit, allow location access when prompted
2. **View Elevation**: Your elevation displays instantly (from GPS or cache)
3. **Toggle Units**: Switch between feet and meters using the toggle buttons
4. **See Landmark**: A comparable famous landmark appears below
5. **Install as App**: Add to home screen for offline access

### Offline Mode

After the first successful load:
- Works completely offline
- Uses cached elevation data from nearby locations
- All UI and assets are cached by the service worker
- Landmark data is embedded and works offline

## Development

### Key Files

- [src/lib/elevation/detector.ts](src/lib/elevation/detector.ts) - Core elevation detection logic
- [src/lib/storage/indexed-db.ts](src/lib/storage/indexed-db.ts) - Offline caching layer
- [src/components/ElevationGauge.astro](src/components/ElevationGauge.astro) - Visual gauge component
- [src/data/landmarks.json](src/data/landmarks.json) - Landmark database
- [astro.config.mjs](astro.config.mjs) - PWA and Workbox configuration

### Adding Landmarks

Edit `src/data/landmarks.json`:

```json
{
  "name": "Your Landmark",
  "type": "mountain|building|tower|monument",
  "elevation_meters": 1234,
  "icon_svg": "<svg>...</svg>"
}
```

### Customizing Theme

Edit `src/styles/material-theme.css` to change colors:

```css
:root {
  --md-sys-color-primary: #006C4C;
  --md-sys-color-surface: #FBFDF9;
  /* ... other tokens */
}
```

## Deployment

### Build

```bash
npm run build
```

Output is in `dist/` directory.

### Hosting Platforms

Compatible with any static host:

- **Cloudflare Pages** (Recommended)
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Requirements

- Must be served over HTTPS (required for Geolocation and PWA)
- Service worker must be served from root (`/sw.js`)
- Set proper cache headers for static assets

### Example: Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy
npx wrangler pages deploy dist
```

## PWA Installation

### iOS (Safari)

1. Open site in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)

1. Open site in Chrome
2. Tap menu (⋮)
3. Select "Add to Home Screen" or "Install App"
4. Tap "Install"

## Performance

- **Lighthouse Scores**: 95+ Performance, 100 PWA
- **Bundle Size**: ~37KB total (gzipped)
- **LCP**: < 1.5s (Largest Contentful Paint)
- **Battery Efficient**: Single GPS request, no continuous polling

## Privacy

- ✅ No user accounts
- ✅ No analytics or tracking
- ✅ No location data sent to servers
- ✅ All processing happens on device
- ✅ Cached data is local only (IndexedDB)

Location is only used to:
1. Get elevation from GPS
2. Cache for offline use

## Browser Support

| Browser | Version | GPS Altitude | PWA Support |
|---------|---------|--------------|-------------|
| Chrome  | 90+     | Limited*     | ✅ Full     |
| Safari  | 14+     | Limited*     | ✅ iOS 16.4+ |
| Firefox | 88+     | Limited*     | ✅ Android   |
| Edge    | 90+     | Limited*     | ✅ Full     |

*GPS altitude availability varies by device. Most mobile devices with dedicated GPS hardware provide altitude data.

## Troubleshooting

### "Location permission denied"

- Check browser settings to allow location access
- On iOS: Settings → Safari → Location → Allow
- On Android: Settings → Apps → Browser → Permissions → Location

### "Elevation data not available"

- Your device may not provide GPS altitude
- Try moving to an area with better GPS signal
- The app will fall back to cached data if available

### Service Worker not updating

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear site data and reload
- The app auto-updates service worker on page load

## Future Enhancements (Not Yet Implemented)

- [ ] Network API fallback (Phase 6 - Open-Meteo Elevation API)
- [ ] Barometric pressure display
- [ ] Elevation history tracking
- [ ] Share functionality
- [ ] Custom landmarks
- [ ] Dark mode manual toggle
- [ ] Elevation gain calculator

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## License

© 2026 Find My Elevation. All rights reserved.

---

Built with ❤️ using [Astro](https://astro.build)
