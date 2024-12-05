// household emissions
export const calculateHouseholdEmissions = (answers) => {
  const electricityEmissions = {
      'Below Average (<667 kWh)': 0.41,
      'Average (667 - 1,000 kWh)': 0.61,
      'Above Average (>1,000 kWh)': 1.22,
  }[answers.electricity] || 0;

  const naturalGasEmissions = {
      'Below Average (<42 Therms)': 3.5,
      'Average (42 - 75 Therms)': 6.0,
      'Above Average (>75 Therms)': 8.5,
  }[answers.naturalGas] || 0;

  const fuelOilEmissions = {
      'Below Average (<33 Gallons)': 5.0,
      'Average (33 - 67 Gallons)': 10.1,
      'Above Average (>67 Gallons)': 15.0,
  }[answers.fuelOil] || 0;

  const propaneEmissions = {
      'Below Average (<25 Gallons)': 3.0,
      'Average (25 - 83 Gallons)': 5.8,
      'Above Average (>83 Gallons)': 8.0,
  }[answers.Propane] || 0;

  const waterEmissions = {
      'Below Average (<8,000 Gallons)': 2.0,
      'Average (8,000 - 12,000 Gallons)': 3.6,
      'Above Average (>12,000 Gallons)': 4.5,
  }[answers.water] || 0;

  const trashEmissions = (parseInt(answers.trash) || 0) * 0.1;

  const recyclingOffsets = {
      Plastic: -0.2,
      Paper: -0.1,
      Glass: -0.1,
      Metal: -0.1,
  };
  const recycleOffset = (answers.recycle || []).reduce(
      (acc, item) => acc + (recyclingOffsets[item] || 0),
      0
  );

  let totalEmissions =
      electricityEmissions + 
      naturalGasEmissions + 
      fuelOilEmissions + 
      propaneEmissions + 
      waterEmissions + 
      trashEmissions - 
      recycleOffset;

  const householdSize = parseInt(answers.householdSize) || 1;
  let perPersonEmissions;

  if (householdSize > 4) {
      const basePerPersonEmissions = totalEmissions / householdSize;
      const scalingFactor = 1 + (householdSize - 4) * 0.06;
      perPersonEmissions = basePerPersonEmissions * scalingFactor;
  } else {
    perPersonEmissions = totalEmissions / householdSize;
  }

  perPersonEmissions = Math.max(perPersonEmissions, 0); // so answer isnt negative hypothetically bc of recycleoffsets

  return perPersonEmissions;
};

// transportation emissions
export const calculateTransportationEmissions = (answers) => {
  const vehicleEmissions = {
      0: 0,
      1: 4.6,
      2: 9.2,
      3: 13.8,
      4: 18.4,
      '5+': 23.0, 
  }[answers.vehicles] || 0;

  const publicTransportEmissions = {
      Daily: 1.3,
      Weekly: 0.3,
      Rarely: 0.1,
      Never: 0,
  }[answers.publicTransport] || 0;

  const shortFlightEmissions = {
      'Below Average (0-2 Short Flights)': 0.3,
      'Average (3-6 Short Flights)': 0.9,
      'Above Average (7+ Short Flights)': 1.5,
  }[answers.shortFlights] || 0;

  const longFlightEmissions = {
      'Below Average (0-1 Long Flights)': 0.9,
      'Average (2-4 Long Flights)': 3.6,
      'Above Average (5+ Long Flights)': 7.0,
  }[answers.longFlights] || 0;

  return vehicleEmissions + publicTransportEmissions + shortFlightEmissions + longFlightEmissions;
};

// food and diet emissions
export const calculateFoodAndDietEmissions = (answers) => {
  const dietEmissions = {
      Vegan: 1.5,
      Vegetarian: 1.8,
      Pescatarian: 2.0,
      Omnivore: 2.6,
      "High Meat": 3.5,
  }[answers.diet] || 0;

  const groceryValues = {
      'Retail Stores': 0.5,
      Supermarkets: 0.7,
      'Local Farmers Markets': 0.3,
      'Organic Stores': 0.4,
      'Convenience Stores': 0.8,
      'Warehouse Clubs': 0.7,
  };
  const groceryEmissions = (answers.groceries || []).reduce(
      (acc, item) => acc + (groceryValues[item] || 0),
      0
  );

  const eatingOutEmissions = {
      'Below Average (0-1 Meals)': 0.2,
      'Average (2-4 Meals)': 0.5,
      'Above Average (5+ Meals)': 1.0,
  }[answers.eatOut] || 0;

  return dietEmissions + groceryEmissions + eatingOutEmissions;
};

// lifestyle emissions
export const calculateLifestyleEmissions = (answers) => {
  const clothesEmissions = {
      Daily: 1.2,
      Weekly: 0.6,
      Monthly: 0.3,
      Quarterly: 0.15,
      Yearly: 0.05,
      Rarely: 0.01,
      Never: 0,
  }[answers.clothes] || 0;

  const electronicsEmissions = {
      Daily: 1.5,
      Weekly: 0.8,
      Monthly: 0.4,
      Quarterly: 0.2,
      Yearly: 0.1,
      Rarely: 0.05,
      Never: 0,
  }[answers.electronics] || 0;

  const homeGoodsEmissions = {
      Daily: 1.0,
      Weekly: 0.5,
      Monthly: 0.25,
      Quarterly: 0.12,
      Yearly: 0.05,
      Rarely: 0.01,
      Never: 0,
  }[answers.homeGoods] || 0;

  const secondhandOffset = {
      Daily: -0.4,
      Weekly: -0.2,
      Monthly: -0.1,
      Quarterly: -0.05,
      Yearly: -0.02,
      Rarely: 0,
      Never: 0,
  }[answers.secondHand] || 0;

  const gymEmissions = {
      'Below Average (0-1 Times)': 0.000071,
      'Average (2-3 Times)': 0.000178,
      'Above Average (4+ Times)': 0.000248,
  }[answers.gym] || 0;

  const carbonOffset = {
      Yes: -5,
      No: 0,
      Sometimes: -2,
  }[answers.carbonOffset] || 0;

  const renewableEnergyOffset = {
      Yes: -6,
      No: 0,
      Sometimes: -3,
  }[answers.renewableEnergy] || 0;

  return (
      clothesEmissions +
      electronicsEmissions +
      homeGoodsEmissions +
      secondhandOffset +
      gymEmissions +
      carbonOffset +
      renewableEnergyOffset
  );
};
