'use client';

interface AdvancedButton {
  label: string;
  value: string;
  className: string;
}

interface AdvancedKeypadProps {
  handleAdvancedButtonClick: (value: string) => void;
}

const AdvancedKeypad: React.FC<AdvancedKeypadProps> = ({ handleAdvancedButtonClick }) => {
  // Define advanced buttons in groups
  const advancedButtons: AdvancedButton[][] = [
    // Row 1: Brackets, Memory, Constants
    [
      { label: '(', value: '(', className: 'adv-operator' },
      { label: ')', value: ')', className: 'adv-operator' },
      { label: 'x', value: 'x', className: 'adv-variable' },
      { label: 'π', value: 'pi', className: 'adv-constant' },
      { label: 'e', value: 'e', className: 'adv-constant' },
    ],
    // Row 2: Powers and roots
    [
      { label: 'x²', value: '^2', className: 'adv-operator' },
      { label: 'x³', value: '^3', className: 'adv-operator' },
      { label: 'xʸ', value: '^', className: 'adv-operator' },
      { label: '√', value: 'sqrt', className: 'adv-function' },
      { label: '∛', value: 'cbrt', className: 'adv-function' },
    ],
    // Row 3: Trigonometric functions
    [
      { label: 'sin', value: 'sin', className: 'adv-function' },
      { label: 'cos', value: 'cos', className: 'adv-function' },
      { label: 'tan', value: 'tan', className: 'adv-function' },
      { label: 'log', value: 'log10', className: 'adv-function' },
      { label: 'ln', value: 'log', className: 'adv-function' },
    ],
    // Row 4: Additional functions
    [
      { label: '|x|', value: 'abs', className: 'adv-function' },
      { label: 'exp', value: 'exp', className: 'adv-function' },
      { label: 'mod', value: '%', className: 'adv-operator' },
      { label: 'n!', value: 'factorial', className: 'adv-function' },
      { label: '1/x', value: '1/', className: 'adv-operator' },
    ],
  ];

  return (
    <div className="advanced-keypad">
      {advancedButtons.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="advanced-keypad-row">
          {row.map((button) => (
            <button
              key={button.value}
              className={`advanced-btn ${button.className}`}
              onClick={() => handleAdvancedButtonClick(button.value)}
            >
              {button.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdvancedKeypad;
