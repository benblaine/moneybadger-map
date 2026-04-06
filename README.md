# MoneyBadger Merchant Map

A fast, open-source, zero-cost interactive map showing merchants that accept Bitcoin via MoneyBadger Lightning in South Africa.

Built with **MapLibre GL JS** (open-source Mapbox fork) + **CARTO Dark Matter** tiles (free, no API key).

## Quick Start

1. **Open locally**: Just open `index.html` in your browser. The map loads from CDN, tiles are free.
2. **Host it**: Upload the entire folder to any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, or your own server. No build step, no server-side code.

## File Structure

```
map/
├── index.html          # The map (self-contained HTML/CSS/JS)
├── merchants.json      # Your merchant data (GeoJSON)
├── assets/
│   ├── moneybadger-logo-on-black.svg
│   └── moneybadger-logo-on-white.svg
└── README.md
```

## Adding / Editing Merchants

Edit `merchants.json`. Each merchant is a GeoJSON Feature:

```json
{
  "type": "Feature",
  "properties": {
    "name": "Shell Stellenbosch",
    "address": "R44, Stellenbosch, Western Cape",
    "category": "fuel",
    "image": "https://example.com/photo.jpg",
    "logo": "https://example.com/logo.png"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [18.8602, -33.9321]
  }
}
```

### Fields

| Field       | Required | Description |
|-------------|----------|-------------|
| `name`      | Yes      | Merchant display name |
| `address`   | Yes      | Street address |
| `category`  | Yes      | One of: `fuel`, `retail`, `food`, `community`, or any custom string |
| `image`     | No       | URL to a photo (shows in popup header) |
| `logo`      | No       | URL to merchant logo (not yet wired up — easy to add) |

### Coordinates

GeoJSON uses `[longitude, latitude]` (NOT lat,lng). For South Africa:
- Longitude: roughly 16 to 33
- Latitude: roughly -22 to -35

**Tip**: Right-click any point in Google Maps → "What's here?" to get coordinates.

## Categories & Colours

Built-in categories with colours:

| Category    | Colour  |
|-------------|---------|
| `fuel`      | #4FC3F7 (blue) |
| `retail`    | #81C784 (green) |
| `food`      | #FF8A65 (orange) |
| `community` | #CE93D8 (purple) |
| _anything else_ | #F5A623 (amber) |

To add a new category:
1. Add the colour to `CATEGORY_COLORS` in `index.html`
2. Add a filter button in the HTML
3. Add the colour to the `'circle-color'` match expression in the `pins` layer

## Features

- **Clustering**: Markers group at low zoom, expand as you zoom in
- **Category filtering**: Filter by fuel, retail, food, community
- **Search**: Live text search across name and address
- **Responsive**: Works on mobile with bottom filter bar
- **Dark theme**: MoneyBadger branded, matches the website
- **Zero cost**: No API keys, no server, no database

## Hosting Options (all free tier)

| Host              | Deploy Method |
|-------------------|---------------|
| **GitHub Pages**  | Push to repo, enable Pages |
| **Netlify**       | Drag & drop the folder |
| **Cloudflare Pages** | Connect repo or direct upload |
| **Vercel**        | `vercel` CLI or connect repo |

## Importing from Google My Maps

1. Open your Google My Maps
2. Click the 3 dots menu → Export to KML/KMZ
3. Convert KML to GeoJSON using https://mapbox.github.io/togeojson/ or `ogr2ogr`
4. Clean up the properties to match the schema above
5. Drop the features into `merchants.json`

## Performance

MapLibre GL handles **50,000+ markers** with clustering enabled. You won't hit a wall like Google My Maps does at ~2,000.
