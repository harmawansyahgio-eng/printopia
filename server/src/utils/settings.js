const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../config/settings.json');

const DEFAULT_SETTINGS = {
  paper: {
    A4: { label: 'A4 (Standard)', basePrice: 500 },
    F4: { label: 'F4 (Folio)', basePrice: 600 },
    A3: { label: 'A3 (Large)', basePrice: 1000 }
  },
  color: {
    bw: { label: 'Hitam Putih', multiplier: 1 },
    color: { label: 'Warna', multiplier: 3 }
  },
  delivery: {
    pickup: { label: 'Pickup', price: 0 },
    delivery: { label: 'Delivery', price: 10000 }
  }
};

// Initialize settings file if not exists
if (!fs.existsSync(path.dirname(SETTINGS_FILE))) {
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
}
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
}

const getSettings = () => {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

const updateSettings = (newSettings) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
  return newSettings;
};

module.exports = {
  getSettings,
  updateSettings,
  DEFAULT_SETTINGS
};
