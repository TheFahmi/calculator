'use client';

const UnitConverter = ({
  currentUnitType,
  handleUnitTypeChange,
  fromUnit,
  toUnit,
  handleFromUnitChange,
  handleToUnitChange,
  unitOptions,
  convertUnit
}) => {
  return (
    <div className="unit-keys">
      <div className="unit-type-selector">
        <button 
          className={`unit-type-btn ${currentUnitType === 'length' ? 'active' : ''}`} 
          data-unit-type="length"
          onClick={() => handleUnitTypeChange('length')}
        >
          <i className="fas fa-ruler"></i>
          <span>Length</span>
        </button>
        <button 
          className={`unit-type-btn ${currentUnitType === 'weight' ? 'active' : ''}`} 
          data-unit-type="weight"
          onClick={() => handleUnitTypeChange('weight')}
        >
          <i className="fas fa-weight-hanging"></i>
          <span>Weight</span>
        </button>
        <button 
          className={`unit-type-btn ${currentUnitType === 'temperature' ? 'active' : ''}`} 
          data-unit-type="temperature"
          onClick={() => handleUnitTypeChange('temperature')}
        >
          <i className="fas fa-thermometer-half"></i>
          <span>Temp</span>
        </button>
        <button 
          className={`unit-type-btn ${currentUnitType === 'area' ? 'active' : ''}`} 
          data-unit-type="area"
          onClick={() => handleUnitTypeChange('area')}
        >
          <i className="fas fa-vector-square"></i>
          <span>Area</span>
        </button>
      </div>
      
      <div className="unit-row">
        <span className="unit-label">From:</span>
        <select id="fromUnit" className="unit-select" value={fromUnit} onChange={handleFromUnitChange}>
          {unitOptions.map((unit) => (
            <option key={`from-${unit}`} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      
      <div className="unit-row">
        <span className="unit-label">To:</span>
        <select id="toUnit" className="unit-select" value={toUnit} onChange={handleToUnitChange}>
          {unitOptions.map((unit) => (
            <option key={`to-${unit}`} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      
      <button id="convertBtn" className="unit-convert-btn" onClick={convertUnit}>
        <i className="fas fa-exchange-alt"></i> Convert
      </button>
    </div>
  );
};

export default UnitConverter;
