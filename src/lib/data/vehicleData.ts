/* eslint-disable */
// @ts-nocheck
const rawData = `
2 Wheeler | Ampere | Magnus | 2015 | 2026 | Magnus Standard | Electric | Active
2 Wheeler | Ampere | Magnus | 2015 | 2026 | Magnus Disc | Electric | Active
2 Wheeler | Ampere | Magnus | 2015 | 2026 | Magnus ABS | Electric | Active
2 Wheeler | Ampere | Magnus Pro | 2019 | 2026 | Magnus Pro Standard | Electric | Active
2 Wheeler | Ampere | Magnus Pro | 2019 | 2026 | Magnus Pro Disc | Electric | Active
2 Wheeler | Ampere | Magnus Pro | 2019 | 2026 | Magnus Pro ABS | Electric | Active
2 Wheeler | Ather Energy | 450 | 2018 | 2021 | 450 Standard | Electric | Discontinued
2 Wheeler | Ather Energy | 450 | 2018 | 2021 | 450 Disc | Electric | Discontinued
`;

const processData = (data) => {
  const db = { "2 Wheeler": { brands: [] }, "4 Wheeler": { brands: [] } };
  const lines = data.trim().split('\n');
  lines.forEach(line => {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 8) return;
    const [category, brand, model, startYear, endYear, variant, fuel, status] = parts;
    if (!db[category]) return;
    if (!db[category].brands.includes(brand)) {
      db[category].brands.push(brand);
      db[category][brand] = [];
    }
    const existingModel = db[category][brand].find(m => m.name === model);
    if (!existingModel) {
      db[category][brand].push({
        name: model,
        years: `${startYear}-${endYear}`,
        status: status,
        fuel: fuel,
        variants: [variant]
      });
    } else {
      if (!existingModel.variants.includes(variant)) {
        existingModel.variants.push(variant);
      }
    }
  });
  return db;
};

export const vehicleDatabase = processData(rawData);