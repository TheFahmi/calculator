'use client';

interface ScientificKeyPadProps {
  handleScientificFunction: (func: string) => void;
  toggleAngleMode: (mode: string) => void;
  handleBracket: (bracket: string) => void;
  isRadianMode: boolean;
  handleOperatorClick: (operator: string) => void;
}

const ScientificKeyPad: React.FC<ScientificKeyPadProps> = ({
  handleScientificFunction,
  toggleAngleMode,
  handleBracket,
  isRadianMode,
  handleOperatorClick
}) => {
  return (
    <div className="scientific-keys">
      <button className="sci-operator" data-action="sin" onClick={() => handleScientificFunction('sin')}>sin</button>
      <button className="sci-operator" data-action="cos" onClick={() => handleScientificFunction('cos')}>cos</button>
      <button className="sci-operator" data-action="tan" onClick={() => handleScientificFunction('tan')}>tan</button>
      <button className="sci-operator" data-action="pow" onClick={() => handleScientificFunction('pow')}>
        <i className="fas fa-superscript"></i>
      </button>

      <button className="sci-operator" data-action="sqrt" onClick={() => handleScientificFunction('sqrt')}>
        <i className="fas fa-square-root-alt">√</i>
      </button>
      <button className="sci-operator" data-action="log" onClick={() => handleScientificFunction('log')}>log</button>
      <button className="sci-operator" data-action="ln" onClick={() => handleScientificFunction('ln')}>ln</button>
      <button className="sci-operator" data-action="factorial" onClick={() => handleScientificFunction('factorial')}>x!</button>

      <button className="sci-operator" data-action="pi" onClick={() => handleScientificFunction('pi')}>π</button>
      <button className="sci-operator" data-action="e" onClick={() => handleScientificFunction('e')}>e</button>
      <button
        className={`sci-operator ${isRadianMode ? 'active' : ''}`}
        data-action="rad"
        onClick={() => toggleAngleMode('rad')}
      >
        Rad
      </button>
      <button
        className={`sci-operator ${!isRadianMode ? 'active' : ''}`}
        data-action="deg"
        onClick={() => toggleAngleMode('deg')}
      >
        Deg
      </button>

      <button className="sci-operator" data-action="open-bracket" onClick={() => handleBracket('(')}>(</button>
      <button className="sci-operator" data-action="close-bracket" onClick={() => handleBracket(')')}>)</button>
      <button className="sci-operator" data-action="exp" onClick={() => handleScientificFunction('exp')}>EXP</button>
      <button className="sci-operator" data-action="mod" onClick={() => handleOperatorClick('%')}>mod</button>
    </div>
  );
};

export default ScientificKeyPad;
