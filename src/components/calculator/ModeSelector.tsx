'use client';

interface ModeSelectorProps {
  currentMode: 'standard' | 'scientific' | 'unit' | 'advanced' | 'help';
  handleModeChange: (mode: 'standard' | 'scientific' | 'unit' | 'advanced' | 'help') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, handleModeChange }) => {
  return (
    <div className="calculator-mode">
      <button 
        id="standardMode" 
        className={`mode-button ${currentMode === 'standard' ? 'active' : ''}`}
        onClick={() => handleModeChange('standard')}
      >
        <i className="fas fa-calculator"></i>
        <span>Standard</span>
      </button>
      <button 
        id="scientificMode" 
        className={`mode-button ${currentMode === 'scientific' ? 'active' : ''}`}
        onClick={() => handleModeChange('scientific')}
      >
        <i className="fas fa-square-root-alt"></i>
        <span>Scientific</span>
      </button>
      <button 
        id="unitMode" 
        className={`mode-button ${currentMode === 'unit' ? 'active' : ''}`}
        onClick={() => handleModeChange('unit')}
      >
        <i className="fas fa-ruler-combined"></i>
        <span>Units</span>
      </button>
      <button 
        id="advancedMode" 
        className={`mode-button ${currentMode === 'advanced' ? 'active' : ''}`}
        onClick={() => handleModeChange('advanced')}
      >
        <i className="fas fa-brain"></i>
        <span>Advanced</span>
      </button>
      <button 
        id="helpMode" 
        className={`mode-button ${currentMode === 'help' ? 'active' : ''}`}
        onClick={() => handleModeChange('help')}
      >
        <i className="fas fa-question-circle"></i>
        <span>Help</span>
      </button>
    </div>
  );
};

export default ModeSelector;
