'use client';

interface KeyPadProps {
  handleNumberClick: (number: string) => void;
  handleOperatorClick: (operator: string) => void;
  handleDecimalClick: () => void;
  handleClear: () => void;
  handleDelete: () => void;
  handleCalculate: () => void;
  handlePercentage: () => void;
}

const KeyPad: React.FC<KeyPadProps> = ({ 
  handleNumberClick, 
  handleOperatorClick, 
  handleDecimalClick, 
  handleClear, 
  handleDelete, 
  handleCalculate,
  handlePercentage
}) => {
  return (
    <div className="calculator-keys">
      <button className="operator" data-action="clear" onClick={handleClear}>
        <span>AC</span>
      </button>
      <button className="operator" data-action="delete" onClick={handleDelete}>
        <i className="fas fa-backspace"></i>
      </button>
      <button className="operator" data-action="percent" onClick={handlePercentage}>
        <i className="fas fa-percentage"></i>
      </button>
      <button className="operator" data-action="divide" onClick={() => handleOperatorClick('/')}>
        <i className="fas fa-divide"></i>
      </button>
      
      <button className="number" onClick={() => handleNumberClick('7')}>7</button>
      <button className="number" onClick={() => handleNumberClick('8')}>8</button>
      <button className="number" onClick={() => handleNumberClick('9')}>9</button>
      <button className="operator" data-action="multiply" onClick={() => handleOperatorClick('*')}>
        <i className="fas fa-times"></i>
      </button>
      
      <button className="number" onClick={() => handleNumberClick('4')}>4</button>
      <button className="number" onClick={() => handleNumberClick('5')}>5</button>
      <button className="number" onClick={() => handleNumberClick('6')}>6</button>
      <button className="operator" data-action="subtract" onClick={() => handleOperatorClick('-')}>
        <i className="fas fa-minus"></i>
      </button>
      
      <button className="number" onClick={() => handleNumberClick('1')}>1</button>
      <button className="number" onClick={() => handleNumberClick('2')}>2</button>
      <button className="number" onClick={() => handleNumberClick('3')}>3</button>
      <button className="operator" data-action="add" onClick={() => handleOperatorClick('+')}>
        <i className="fas fa-plus"></i>
      </button>
      
      <button className="number zero-btn" onClick={() => handleNumberClick('0')}>0</button>
      <button className="decimal" onClick={handleDecimalClick}>.</button>
      <button className="operator equals" data-action="calculate" onClick={handleCalculate}>
        <i className="fas fa-equals"></i>
      </button>
    </div>
  );
};

export default KeyPad;
