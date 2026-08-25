export function calculateLandValue(property) {
  const { landAreaAana, governmentRate, marketRate, distressedRate } = property;

  // PDF methodology:
  // Government = 10%
  // Market = 30%
  // Distressed = 60%

  const governmentWeight = 0.1;
  const marketWeight = 0.3;
  const distressedWeight = 0.6;

  const weightedRate =
    governmentRate * governmentWeight +
    marketRate * marketWeight +
    distressedRate * distressedWeight;

  /*
   * IMPORTANT:
   *
   * The PDF calculated approximately Rs. 15.74 lakh/aana
   * but adopted Rs. 15 lakh/aana.
   *
   * Therefore we keep the calculated value separate
   * from the adopted value.
   */

  const adoptedRate = property.adoptedLandRate ?? weightedRate;

  const landValue = landAreaAana * adoptedRate;

  return {
    inputs: {
      landAreaAana,
      governmentRate,
      marketRate,
      distressedRate,
    },

    weights: {
      government: governmentWeight,
      market: marketWeight,
      distressed: distressedWeight,
    },

    weightedRate,

    adoptedRate,

    landValue,
  };
}

export function calculateBuildingValue(property) {
  const { building, buildingAge = 0 } = property;

  if (
    !building ||
    !building.floors ||
    building.floors.length === 0 ||
    property.hasBuilding === false
  ) {
    return {
      totalFloorArea: 0,
      floors: [],
      civilCost: 0,
      sanitary: {
        rate: 0,
        cost: 0,
      },
      electrical: {
        rate: 0,
        cost: 0,
      },
      grossBuildingCost: 0,
      depreciation: {
        age: 0,
        usefulLife: 50,
        scrapValue: 0.1,
        annualRate: 0,
        amount: 0,
      },
      presentBuildingValue: 0,
    };
  }

  const totalFloorArea = building.floors.reduce(
    (total, floor) => total + floor.area,
    0,
  );

  let civilCost = 0;

  const floorCalculations = building.floors.map((floor) => {
    const rate = floor.ratePerSqft ?? building.defaultRatePerSqft;

    const cost = floor.area * rate;

    civilCost += cost;

    return {
      floor: floor.name,
      area: floor.area,
      ratePerSqft: rate,
      cost,
    };
  });

  const sanitaryRate = building.sanitaryRate ?? 0.1;

  const electricalRate = building.electricalRate ?? 0.08;

  const sanitaryCost = civilCost * sanitaryRate;

  const electricalCost = civilCost * electricalRate;

  const grossBuildingCost = civilCost + sanitaryCost + electricalCost;

  const usefulLife = building.usefulLife ?? 50;

  const scrapValue = building.scrapValue ?? 0.1;

  const depreciationRate = (1 - scrapValue) / usefulLife;

  const depreciation = grossBuildingCost * depreciationRate * buildingAge;

  const presentBuildingValue = Math.max(0, grossBuildingCost - depreciation);

  return {
    totalFloorArea,

    floors: floorCalculations,

    civilCost,

    sanitary: {
      rate: sanitaryRate,
      cost: sanitaryCost,
    },

    electrical: {
      rate: electricalRate,
      cost: electricalCost,
    },

    grossBuildingCost,

    depreciation: {
      age: buildingAge,
      usefulLife,
      scrapValue,
      annualRate: depreciationRate,
      amount: depreciation,
    },

    presentBuildingValue,
  };
}
export default function valuateProperty(property) {
  const land = calculateLandValue(property);

  const building = property.building
    ? calculateBuildingValue(property)
    : false;

  const finalValue =
    land.landValue + (building?.presentBuildingValue ?? 0);

  return {
    propertyId: property.propertyId,

    valuationMethod: {
      land: "Weighted Average Method",
      building: "Cost Approach with Straight-Line Depreciation",
    },

    land,

    building,

    finalValue,

    currency: "NPR",

    audit: {
      governmentWeight: 0.1,
      marketWeight: 0.3,
      distressedWeight: 0.6,

      sanitaryRate: 0.1,
      electricalRate: 0.08,

      depreciationMethod: "straight-line",
    },
  };
}