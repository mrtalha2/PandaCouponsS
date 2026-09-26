const fs = require('fs');
const path = require('path');

const nutritionPath = path.join(__dirname, '..', 'data', 'nutrition.json');
const nutrition = JSON.parse(fs.readFileSync(nutritionPath, 'utf8'));

// Exact values matching official Panda Express nutritional guidelines
const detailsMap = {
  'chow-mein': {
    servingSize: '9.4 oz (266g)',
    saturatedFat: 3.5,
    transFat: 0,
    cholesterol: 0,
    sodium: 860,
    dietaryFiber: 6,
    sugars: 9,
    allergens: ['Wheat', 'Soy', 'Sesame']
  },
  'fried-rice': {
    servingSize: '9.3 oz (264g)',
    saturatedFat: 3,
    transFat: 0,
    cholesterol: 120,
    sodium: 850,
    dietaryFiber: 1,
    sugars: 3,
    allergens: ['Wheat', 'Soy', 'Egg', 'Sesame']
  },
  'white-steamed-rice': {
    servingSize: '8.1 oz (230g)',
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    dietaryFiber: 1,
    sugars: 0,
    allergens: []
  },
  'super-greens': {
    servingSize: '7.0 oz (198g)',
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 260,
    dietaryFiber: 5,
    sugars: 4,
    allergens: ['Soy']
  },
  'orange-chicken': {
    servingSize: '5.7 oz (162g)',
    saturatedFat: 5,
    transFat: 0,
    cholesterol: 80,
    sodium: 820,
    dietaryFiber: 2,
    sugars: 19,
    allergens: ['Wheat', 'Soy', 'Egg', 'Milk', 'Sesame']
  },
  'beijing-beef': {
    servingSize: '5.6 oz (159g)',
    saturatedFat: 5,
    transFat: 0,
    cholesterol: 40,
    sodium: 660,
    dietaryFiber: 1,
    sugars: 24,
    allergens: ['Wheat', 'Soy', 'Sesame']
  },
  'kung-pao-chicken': {
    servingSize: '5.8 oz (164g)',
    saturatedFat: 3.5,
    transFat: 0,
    cholesterol: 60,
    sodium: 970,
    dietaryFiber: 2,
    sugars: 5,
    allergens: ['Peanuts', 'Wheat', 'Soy', 'Sesame']
  },
  'broccoli-beef': {
    servingSize: '5.4 oz (153g)',
    saturatedFat: 1.5,
    transFat: 0,
    cholesterol: 15,
    sodium: 520,
    dietaryFiber: 3,
    sugars: 7,
    allergens: ['Wheat', 'Soy', 'Sesame']
  },
  'grilled-teriyaki-chicken': {
    servingSize: '6.0 oz (170g)',
    saturatedFat: 4,
    transFat: 0,
    cholesterol: 170,
    sodium: 530,
    dietaryFiber: 1,
    sugars: 8,
    allergens: ['Wheat', 'Soy']
  },
  'honey-walnut-shrimp': {
    servingSize: '5.3 oz (150g)',
    saturatedFat: 3.5,
    transFat: 0,
    cholesterol: 100,
    sodium: 440,
    dietaryFiber: 2,
    sugars: 9,
    allergens: ['Shellfish', 'Tree Nuts', 'Wheat', 'Soy', 'Egg', 'Milk']
  }
};

nutrition.sides = nutrition.sides.map(s => ({
  ...s,
  ...(detailsMap[s.id] || {})
}));

nutrition.entrees = nutrition.entrees.map(e => ({
  ...e,
  ...(detailsMap[e.id] || {})
}));

fs.writeFileSync(nutritionPath, JSON.stringify(nutrition, null, 2), 'utf8');
console.log('✓ Successfully enriched data/nutrition.json with 12 complete nutritional metrics');
