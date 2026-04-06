#!/usr/bin/env node
// Validates merchants.json structure and content
// Run: node validate.js

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'merchants.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (err) {
  console.error('FAIL: Cannot parse merchants.json:', err.message);
  process.exit(1);
}

const VALID_CATEGORIES = ['fuel', 'retail', 'food', 'community', 'other'];
const LON_MIN = 16, LON_MAX = 33, LAT_MIN = -35, LAT_MAX = -22;
const HTML_PATTERN = /<[^>]*>/;

let errors = 0;
const categoryCounts = {};

if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
  console.error('FAIL: Not a valid GeoJSON FeatureCollection');
  process.exit(1);
}

data.features.forEach((f, i) => {
  const label = `Feature[${i}]`;
  const props = f.properties || {};
  const coords = f.geometry && f.geometry.coordinates;

  // Required fields
  if (!props.name || typeof props.name !== 'string' || !props.name.trim()) {
    console.error(`${label}: missing or empty "name"`);
    errors++;
  }
  if (!props.address || typeof props.address !== 'string' || !props.address.trim()) {
    console.error(`${label}: missing or empty "address"`);
    errors++;
  }
  if (!props.category || !VALID_CATEGORIES.includes(props.category)) {
    console.error(`${label}: invalid category "${props.category}" (expected: ${VALID_CATEGORIES.join(', ')})`);
    errors++;
  }

  // Coordinates in South Africa bounds
  if (!coords || coords.length < 2) {
    console.error(`${label}: missing coordinates`);
    errors++;
  } else {
    const [lon, lat] = coords;
    if (lon < LON_MIN || lon > LON_MAX || lat < LAT_MIN || lat > LAT_MAX) {
      console.error(`${label}: coordinates [${lon}, ${lat}] outside South Africa bounds`);
      errors++;
    }
  }

  // XSS check: no HTML tags in text fields
  if (props.name && HTML_PATTERN.test(props.name)) {
    console.error(`${label}: HTML detected in name "${props.name}"`);
    errors++;
  }
  if (props.address && HTML_PATTERN.test(props.address)) {
    console.error(`${label}: HTML detected in address "${props.address}"`);
    errors++;
  }

  // Image URL validation (if present)
  if (props.image && props.image.trim()) {
    if (!/^(https?:\/\/|\/)/.test(props.image)) {
      console.error(`${label}: invalid image URL "${props.image}"`);
      errors++;
    }
  }

  // Count categories
  const cat = props.category || 'unknown';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

// Summary
console.log('\n=== Merchant Data Validation ===');
console.log(`Total features: ${data.features.length}`);
console.log('Categories:');
for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count} (${(count / data.features.length * 100).toFixed(1)}%)`);
}

if (errors === 0) {
  console.log('\nPASS: All features valid');
} else {
  console.log(`\nFAIL: ${errors} error(s) found`);
  process.exit(1);
}
