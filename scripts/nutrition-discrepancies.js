const fs = require('fs');
const path = require('path');

const nutritionPath = path.join(__dirname, '../data/nutrition.json');
const menuFullPath = path.join(__dirname, '../data/menu_full.json');
const dishesPath = path.join(__dirname, '../data/dishes.json');

const nutrition = fs.existsSync(nutritionPath) ? JSON.parse(fs.readFileSync(nutritionPath, 'utf8')) : null;
const menuFull = fs.existsSync(menuFullPath) ? JSON.parse(fs.readFileSync(menuFullPath, 'utf8')) : null;
const dishes = fs.existsSync(dishesPath) ? JSON.parse(fs.readFileSync(dishesPath, 'utf8')) : null;

console.log('📊 Comparing nutrition data across data/nutrition.json, data/menu_full.json, and data/dishes.json...\n');

const nutritionItems = nutrition ? [...(nutrition.sides || []), ...(nutrition.entrees || [])] : [];
const menuItems = menuFull ? (menuFull.items || menuFull) : [];
const dishItems = dishes || [];

// Map by normalized slug/id
const idMap = new Map();

nutritionItems.forEach(item => {
  const id = item.id;
  if (!idMap.has(id)) idMap.set(id, {});
  idMap.get(id).nutritionJson = item;
  idMap.get(id).name = item.name || id;
});

menuItems.forEach(item => {
  const id = item.id;
  if (!idMap.has(id)) idMap.set(id, {});
  idMap.get(id).menuFullJson = item;
  idMap.get(id).name = item.name || idMap.get(id).name || id;
});

dishItems.forEach(dish => {
  const id = dish.slug || dish.id;
  if (!idMap.has(id)) idMap.set(id, {});
  idMap.get(id).dishesJson = dish.nutrition || dish;
  idMap.get(id).name = dish.name || idMap.get(id).name || id;
});

const discrepancies = [];

for (const [id, sources] of idMap.entries()) {
  const n = sources.nutritionJson || {};
  const m = sources.menuFullJson || {};
  const d = sources.dishesJson || {};

  const fields = [
    { key: 'calories', label: 'Calories' },
    { key: 'fat', altKeys: ['totalFat'], label: 'Total Fat (g)' },
    { key: 'carbs', altKeys: ['totalCarbs'], label: 'Total Carbs (g)' },
    { key: 'protein', label: 'Protein (g)' },
    { key: 'sodium', label: 'Sodium (mg)' },
    { key: 'sugar', altKeys: ['sugars'], label: 'Sugars (g)' },
    { key: 'servingSize', label: 'Serving Size' }
  ];

  fields.forEach(f => {
    const valN = n[f.key] !== undefined ? n[f.key] : (f.altKeys ? f.altKeys.map(k => n[k]).find(v => v !== undefined) : undefined);
    const valM = m[f.key] !== undefined ? m[f.key] : (f.altKeys ? f.altKeys.map(k => m[k]).find(v => v !== undefined) : undefined);
    const valD = d[f.key] !== undefined ? d[f.key] : (f.altKeys ? f.altKeys.map(k => d[k]).find(v => v !== undefined) : undefined);

    const values = [valN, valM, valD].filter(v => v !== undefined);
    const uniqueValues = new Set(values.map(v => String(v).trim()));

    if (uniqueValues.size > 1) {
      discrepancies.push({
        id,
        name: sources.name,
        field: f.label,
        nutritionJson: valN !== undefined ? valN : '—',
        menuFullJson: valM !== undefined ? valM : '—',
        dishesJson: valD !== undefined ? valD : '—'
      });
    }
  });
}

if (discrepancies.length === 0) {
  console.log('✅ No discrepancies found across all nutrition files.');
} else {
  console.log(`⚠️ Found ${discrepancies.length} discrepancies:\n`);
  console.log('| Item Name | Nutrient / Metric | data/nutrition.json | data/menu_full.json | data/dishes.json |');
  console.log('| :--- | :--- | :--- | :--- | :--- |');
  discrepancies.forEach(d => {
    console.log(`| **${d.name}** (\`${d.id}\`) | ${d.field} | ${d.nutritionJson} | ${d.menuFullJson} | ${d.dishesJson} |`);
  });
  console.log('\n');
}
