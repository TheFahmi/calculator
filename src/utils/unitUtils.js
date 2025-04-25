/**
 * Unit conversion types and their corresponding units
 */
export const unitTypes = [
  {
    type: 'length',
    label: 'Length',
    units: [
      { value: 'meters', label: 'Meters (m)' },
      { value: 'kilometers', label: 'Kilometers (km)' },
      { value: 'centimeters', label: 'Centimeters (cm)' },
      { value: 'millimeters', label: 'Millimeters (mm)' },
      { value: 'miles', label: 'Miles (mi)' },
      { value: 'yards', label: 'Yards (yd)' },
      { value: 'feet', label: 'Feet (ft)' },
      { value: 'inches', label: 'Inches (in)' }
    ]
  },
  {
    type: 'mass',
    label: 'Mass',
    units: [
      { value: 'kilograms', label: 'Kilograms (kg)' },
      { value: 'grams', label: 'Grams (g)' },
      { value: 'milligrams', label: 'Milligrams (mg)' },
      { value: 'pounds', label: 'Pounds (lb)' },
      { value: 'ounces', label: 'Ounces (oz)' },
      { value: 'tons', label: 'Tons (t)' }
    ]
  },
  {
    type: 'temperature',
    label: 'Temperature',
    units: [
      { value: 'celsius', label: 'Celsius (°C)' },
      { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
      { value: 'kelvin', label: 'Kelvin (K)' }
    ]
  },
  {
    type: 'time',
    label: 'Time',
    units: [
      { value: 'seconds', label: 'Seconds (s)' },
      { value: 'minutes', label: 'Minutes (min)' },
      { value: 'hours', label: 'Hours (h)' },
      { value: 'days', label: 'Days (d)' },
      { value: 'weeks', label: 'Weeks (wk)' },
      { value: 'months', label: 'Months (mo)' },
      { value: 'years', label: 'Years (yr)' }
    ]
  },
  {
    type: 'volume',
    label: 'Volume',
    units: [
      { value: 'liters', label: 'Liters (L)' },
      { value: 'milliliters', label: 'Milliliters (mL)' },
      { value: 'cubic_meters', label: 'Cubic Meters (m³)' },
      { value: 'gallons', label: 'Gallons (gal)' },
      { value: 'quarts', label: 'Quarts (qt)' },
      { value: 'pints', label: 'Pints (pt)' },
      { value: 'cups', label: 'Cups (cup)' },
      { value: 'fluid_ounces', label: 'Fluid Ounces (fl oz)' }
    ]
  },
  {
    type: 'area',
    label: 'Area',
    units: [
      { value: 'square_meters', label: 'Square Meters (m²)' },
      { value: 'square_kilometers', label: 'Square Kilometers (km²)' },
      { value: 'square_centimeters', label: 'Square Centimeters (cm²)' },
      { value: 'square_millimeters', label: 'Square Millimeters (mm²)' },
      { value: 'square_miles', label: 'Square Miles (mi²)' },
      { value: 'square_yards', label: 'Square Yards (yd²)' },
      { value: 'square_feet', label: 'Square Feet (ft²)' },
      { value: 'square_inches', label: 'Square Inches (in²)' },
      { value: 'hectares', label: 'Hectares (ha)' },
      { value: 'acres', label: 'Acres (ac)' }
    ]
  }
];

/**
 * Converts a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} The converted value
 */
export const convertUnit = (value, fromUnit, toUnit) => {
  // Define conversion factors to SI units
  const conversionFactors = {
    // Length
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
    
    // Mass
    kilograms: 1,
    grams: 0.001,
    milligrams: 0.000001,
    pounds: 0.453592,
    ounces: 0.0283495,
    tons: 1000,
    
    // Volume
    liters: 1,
    milliliters: 0.001,
    cubic_meters: 1000,
    gallons: 3.78541,
    quarts: 0.946353,
    pints: 0.473176,
    cups: 0.236588,
    fluid_ounces: 0.0295735,
    
    // Area
    square_meters: 1,
    square_kilometers: 1000000,
    square_centimeters: 0.0001,
    square_millimeters: 0.000001,
    square_miles: 2589988.11,
    square_yards: 0.836127,
    square_feet: 0.092903,
    square_inches: 0.00064516,
    hectares: 10000,
    acres: 4046.86,
    
    // Time
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000, // Approximation: 30 days
    years: 31536000, // Approximation: 365 days
  };
  
  // Special case for temperature
  if (fromUnit === 'celsius' || fromUnit === 'fahrenheit' || fromUnit === 'kelvin') {
    // Convert to Kelvin first
    let kelvinValue;
    if (fromUnit === 'celsius') {
      kelvinValue = value + 273.15;
    } else if (fromUnit === 'fahrenheit') {
      kelvinValue = (value + 459.67) * (5/9);
    } else { // kelvin
      kelvinValue = value;
    }
    
    // Convert from Kelvin to target unit
    if (toUnit === 'celsius') {
      return kelvinValue - 273.15;
    } else if (toUnit === 'fahrenheit') {
      return kelvinValue * (9/5) - 459.67;
    } else { // kelvin
      return kelvinValue;
    }
  }
  
  // For other units, use conversion factors
  // Convert from source unit to SI unit, then from SI unit to target unit
  const siValue = value * conversionFactors[fromUnit];
  return siValue / conversionFactors[toUnit];
};

/**
 * Gets the units for a specific unit type
 * @param {string} unitType - The type of unit (length, mass, etc.)
 * @returns {Array} An array of unit objects for the specified type
 */
export const getUnitsForType = (unitType) => {
  const typeObj = unitTypes.find(type => type.type === unitType);
  return typeObj ? typeObj.units : [];
};
