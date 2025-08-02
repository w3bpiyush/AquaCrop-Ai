const GrowthStage = [
    'Seedling',
    'Adult',
    'Elderly'
];

const cropTypes = [
  'barley',
  'wheat',
  'maize',
  'millet',
  'sorghum',
  'rice',
  'potato',
  'groundnut',
  'soybeans',
  'cotton',
  'sunflower',
  'sesame',
  'beansgreen',
  'pulses',
  'cabbage',
  'tomato',
  'cucumber',
  'eggplant',
  'sugar cane',
  'banana'
];

const cropData = {
  'barley':     { 'Seedling': 0.35, 'Adult': 1.15, 'Elderly': 0.45, 'RootingDepth': 1.0 },
  'wheat':      { 'Seedling': 0.35, 'Adult': 1.15, 'Elderly': 0.45, 'RootingDepth': 1.0 },
  'maize':      { 'Seedling': 0.40, 'Adult': 1.15, 'Elderly': 0.70, 'RootingDepth': 0.9 },
  'millet':     { 'Seedling': 0.35, 'Adult': 1.10, 'Elderly': 0.65, 'RootingDepth': 1.0 },
  'sorghum':    { 'Seedling': 0.35, 'Adult': 1.10, 'Elderly': 0.65, 'RootingDepth': 1.0 },
  'rice':       { 'Seedling': 1.00, 'Adult': 1.15, 'Elderly': 0.70, 'RootingDepth': 0.5 },
  'potato':     { 'Seedling': 0.45, 'Adult': 1.15, 'Elderly': 0.85, 'RootingDepth': 0.4 },
  'groundnut':  { 'Seedling': 0.45, 'Adult': 1.05, 'Elderly': 0.70, 'RootingDepth': 0.5 },
  'soybeans':   { 'Seedling': 0.35, 'Adult': 1.10, 'Elderly': 0.60, 'RootingDepth': 0.6 },
  'cotton':     { 'Seedling': 0.45, 'Adult': 1.15, 'Elderly': 0.75, 'RootingDepth': 1.0 },
  'sunflower':  { 'Seedling': 0.35, 'Adult': 1.15, 'Elderly': 0.55, 'RootingDepth': 0.8 },
  'sesame':     { 'Seedling': 1.10, 'Adult': 0.25, 'Elderly': 1.00, 'RootingDepth': 1.0 },
  'beansgreen':{ 'Seedling': 0.35, 'Adult': 1.10, 'Elderly': 0.90, 'RootingDepth': 0.6 },
  'pulses':     { 'Seedling': 0.45, 'Adult': 1.10, 'Elderly': 0.50, 'RootingDepth': 0.6 },
  'cabbage':    { 'Seedling': 0.45, 'Adult': 1.05, 'Elderly': 0.90, 'RootingDepth': 0.8 },
  'tomato':     { 'Seedling': 0.45, 'Adult': 1.15, 'Elderly': 0.80, 'RootingDepth': 0.9 },
  'cucumber':   { 'Seedling': 0.45, 'Adult': 0.90, 'Elderly': 0.75, 'RootingDepth': 0.8 },
  'eggplant':   { 'Seedling': 0.45, 'Adult': 1.15, 'Elderly': 0.80, 'RootingDepth': 0.9 },
  'sugar cane': { 'Seedling': 0.15, 'Adult': 1.20, 'Elderly': 0.70, 'RootingDepth': 1.2 },
  'banana':     { 'Seedling': 0.15, 'Adult': 1.10, 'Elderly': 0.90, 'RootingDepth': 1.0 }
};

module.exports = { GrowthStage, cropTypes, cropData };
