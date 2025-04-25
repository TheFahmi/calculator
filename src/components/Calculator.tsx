'use client';

import { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
// Import Font Awesome properly for Next.js
import '@fortawesome/fontawesome-free/css/all.min.css';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface Example {
  name: string;
  value: string;
}

interface IntegrationLimits {
  lower: string;
  upper: string;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<'standard' | 'scientific' | 'unit' | 'advanced' | 'help'>('standard');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRadianMode, setIsRadianMode] = useState<boolean>(true);

  // Unit converter states
  const [currentUnitType, setCurrentUnitType] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [unitOptions, setUnitOptions] = useState<string[]>([]);

  // Advanced calculator states
  const [currentAdvancedTab, setCurrentAdvancedTab] = useState<string>('matrix');
  const [equationInput, setEquationInput] = useState<string>('');
  const [matrixA, setMatrixA] = useState<string>('');
  const [matrixB, setMatrixB] = useState<string>('');
  const [polynomialCoeffs, setPolynomialCoeffs] = useState<string>('');
  const [polynomialVariable, setPolynomialVariable] = useState<string>('x');
  const [functionInput, setFunctionInput] = useState<string>('x^2');
  const [integrationLimits, setIntegrationLimits] = useState<IntegrationLimits>({ lower: '0', upper: '1' });
  const [derivativePoint, setDerivativePoint] = useState<string>('0');

  // Help section states
  const [currentHelpTab, setCurrentHelpTab] = useState<string>('examples');
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [showQuizSolution, setShowQuizSolution] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  // Quiz questions data
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the derivative of x²?",
      options: ["x", "2x", "2x²", "x²/2"],
      answer: 1,
      explanation: "The derivative of x² is 2x. Using the power rule: d/dx(x^n) = n*x^(n-1)"
    },
    {
      question: "Convert 100 cm to meters",
      options: ["0.1 m", "1 m", "10 m", "1000 m"],
      answer: 1,
      explanation: "100 cm = 1 m because there are 100 centimeters in 1 meter."
    },
    {
      question: "Calculate the value of sin(π/2) in radian mode",
      options: ["0", "1", "-1", "undefined"],
      answer: 1,
      explanation: "sin(π/2) = 1. This is a special angle in trigonometry."
    }
  ];

  // Examples data for help section
  const examples: Example[] = [
    { name: "Basic Addition", value: "5+10" },
    { name: "With Decimals", value: "5.5+4.5" },
    { name: "Multiplication", value: "6*8" },
    { name: "Division", value: "20/4" },
    { name: "Mixed Operations", value: "5+10*2" },
    { name: "With Parentheses", value: "(5+10)*2" }
  ];

  const scientificExamples: Example[] = [
    { name: "Sine", value: "sin" },
    { name: "Cosine", value: "cos" },
    { name: "Tangent", value: "tan" },
    { name: "Square Root", value: "sqrt" },
    { name: "Log10", value: "log" },
    { name: "Natural Log", value: "ln" },
    { name: "π Value", value: "pi" }
  ];

  // Handle number button clicks
  const handleNumberClick = (number: string): void => {
    if (display === '0') {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  // Handle operator button clicks
  const handleOperatorClick = (operator: string): void => {
    if (display !== '0') {
      setExpression(expression + display + operator);
      setDisplay('0');
    } else if (expression.length > 0) {
      // Replace the last operator if another one is clicked
      const newExpression = expression.slice(0, -1) + operator;
      setExpression(newExpression);
    }
  };

  // Handle decimal point click
  const handleDecimalClick = (): void => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  // Handle clear button
  const handleClear = (): void => {
    setDisplay('0');
    setExpression('');
    setErrorMessage('');
  };

  // Handle delete (backspace) button
  const handleDelete = (): void => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Handle equals button click
  const handleCalculate = (): void => {
    try {
      let result;
      if (expression.length > 0) {
        result = math.evaluate(expression + display);
      } else {
        result = math.evaluate(display);
      }

      if (typeof result === 'number') {
        // Format the result to avoid unnecessary decimal places
        const formattedResult = Math.round(result * 1000000) / 1000000;
        setExpression(expression + display + '=');
        setDisplay(formattedResult.toString());
      } else {
        setDisplay(result.toString());
      }
    } catch (error) {
      setErrorMessage('Error: Invalid expression');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle percentage calculation
  const handlePercentage = (): void => {
    try {
      const result = math.evaluate(display) / 100;
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage('Error calculating percentage');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle mode change
  const handleModeChange = (mode: 'standard' | 'scientific' | 'unit' | 'advanced' | 'help'): void => {
    setCurrentMode(mode);

    // If switching to unit mode, set up unit options
    if (mode === 'unit') {
      setupUnitOptions(currentUnitType);
    }
  };

  // Scientific calculator functions
  const handleScientificFunction = (func: string): void => {
    try {
      let result;
      const value = parseFloat(display);

      switch (func) {
        case 'sin':
          result = isRadianMode ? math.sin(value) : math.sin(math.unit(value, 'deg'));
          break;
        case 'cos':
          result = isRadianMode ? math.cos(value) : math.cos(math.unit(value, 'deg'));
          break;
        case 'tan':
          result = isRadianMode ? math.tan(value) : math.tan(math.unit(value, 'deg'));
          break;
        case 'sqrt':
          result = math.sqrt(value);
          break;
        case 'log':
          result = math.log10(value);
          break;
        case 'ln':
          result = math.log(value);
          break;
        case 'factorial':
          result = math.factorial(value);
          break;
        case 'pow':
          setExpression(display + '^');
          setDisplay('0');
          return;
        case 'pi':
          setDisplay(math.pi.toString());
          return;
        case 'e':
          setDisplay(math.e.toString());
          return;
        default:
          return;
      }

      // Format and display the result
      const formattedResult = Math.round(result * 1000000) / 1000000;
      setDisplay(formattedResult.toString());
    } catch (error) {
      setErrorMessage(`Error in ${func} calculation`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Toggle between radian and degree mode
  const toggleAngleMode = (): void => {
    setIsRadianMode(!isRadianMode);
  };

  // Setup unit conversion options based on type
  const setupUnitOptions = (type: string): void => {
    let options: string[] = [];
    
    switch (type) {
      case 'length':
        options = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
        break;
      case 'mass':
        options = ['mg', 'g', 'kg', 'oz', 'lb', 'ton'];
        break;
      case 'temperature':
        options = ['C', 'F', 'K'];
        break;
      case 'time':
        options = ['ms', 's', 'min', 'h', 'day', 'week', 'month', 'year'];
        break;
      case 'volume':
        options = ['ml', 'l', 'gal', 'pt', 'qt', 'cup', 'tbsp', 'tsp'];
        break;
      default:
        options = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
    }
    
    setUnitOptions(options);
    setFromUnit(options[0]);
    setToUnit(options[1]);
  };

  // Handle unit type change
  const handleUnitTypeChange = (type: string): void => {
    setCurrentUnitType(type);
    setupUnitOptions(type);
  };

  // Handle unit conversion
  const handleUnitConversion = (): void => {
    try {
      if (display === '0') return;
      
      const value = parseFloat(display);
      const convertedValue = math.evaluate(`${value} ${fromUnit} to ${toUnit}`);
      
      // Extract the numeric value from the result
      const numericValue = typeof convertedValue === 'object' ? 
        convertedValue.toNumber() : 
        convertedValue;
      
      // Format and display the result
      const formattedResult = Math.round(numericValue * 1000000) / 1000000;
      setDisplay(formattedResult.toString());
    } catch (error) {
      setErrorMessage('Error in unit conversion');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Advanced calculator functions
  const handleAdvancedTabChange = (tab: string): void => {
    setCurrentAdvancedTab(tab);
  };

  // Solve equation
  const solveEquation = (): void => {
    try {
      if (!equationInput) return;
      
      // Use mathjs to solve the equation
      const result = math.evaluate(`solve(${equationInput}, x)`);
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage('Error solving equation');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Matrix operations
  const performMatrixOperation = (operation: string): void => {
    try {
      if (!matrixA) return;
      
      let result;
      const mA = math.matrix(JSON.parse(matrixA));
      
      switch (operation) {
        case 'det':
          result = math.det(mA);
          break;
        case 'inv':
          result = math.inv(mA);
          break;
        case 'trans':
          result = math.transpose(mA);
          break;
        case 'multiply':
          if (!matrixB) {
            setErrorMessage('Matrix B is required for multiplication');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
          }
          const mB = math.matrix(JSON.parse(matrixB));
          result = math.multiply(mA, mB);
          break;
        default:
          return;
      }
      
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage(`Error in matrix ${operation}`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Polynomial operations
  const evaluatePolynomial = (): void => {
    try {
      if (!polynomialCoeffs) return;
      
      const coeffs = polynomialCoeffs.split(',').map(Number);
      const x = parseFloat(display);
      
      let result = 0;
      for (let i = 0; i < coeffs.length; i++) {
        result += coeffs[i] * Math.pow(x, coeffs.length - 1 - i);
      }
      
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage('Error evaluating polynomial');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Calculus operations
  const performCalculusOperation = (operation: string): void => {
    try {
      if (!functionInput) return;
      
      let result;
      const expr = functionInput;
      
      switch (operation) {
        case 'integrate':
          const { lower, upper } = integrationLimits;
          result = math.integrate(expr, polynomialVariable, { from: parseFloat(lower), to: parseFloat(upper) });
          break;
        case 'derivative':
          const x = parseFloat(derivativePoint);
          result = math.derivative(expr, polynomialVariable).evaluate({ [polynomialVariable]: x });
          break;
        default:
          return;
      }
      
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage(`Error in ${operation}`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Help section functions
  const handleHelpTabChange = (tab: string): void => {
    setCurrentHelpTab(tab);
  };

  const handleExampleClick = (example: Example): void => {
    if (example.value === 'sin' || example.value === 'cos' || example.value === 'tan' ||
        example.value === 'sqrt' || example.value === 'log' || example.value === 'ln' ||
        example.value === 'pi') {
      handleModeChange('scientific');
      handleScientificFunction(example.value);
    } else {
      setDisplay(example.value);
      handleModeChange('standard');
    }
  };

  const handleQuizOptionSelect = (optionIndex: number): void => {
    setQuizSelectedOption(optionIndex);
  };

  const checkQuizAnswer = (): void => {
    setShowQuizSolution(true);
  };

  const nextQuizQuestion = (): void => {
    setCurrentQuizIndex((prev) => (prev + 1) % quizQuestions.length);
    setShowQuizSolution(false);
    setQuizSelectedOption(null);
  };

  // Render the calculator UI based on current mode
  const renderCalculator = (): JSX.Element => {
    switch (currentMode) {
      case 'standard':
        return (
          <div className="calculator-container">
            {/* Display */}
            <div className="calculator-display">
              <div className="expression">{expression}</div>
              <div className="current-value">{display}</div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            
            {/* Keypad */}
            <div className="calculator-keypad">
              <div className="keypad-row">
                <button onClick={() => handleClear()} className="key function-key">C</button>
                <button onClick={() => handleDelete()} className="key function-key">⌫</button>
                <button onClick={() => handlePercentage()} className="key function-key">%</button>
                <button onClick={() => handleOperatorClick('/')} className="key operator-key">÷</button>
              </div>
              <div className="keypad-row">
                <button onClick={() => handleNumberClick('7')} className="key">7</button>
                <button onClick={() => handleNumberClick('8')} className="key">8</button>
                <button onClick={() => handleNumberClick('9')} className="key">9</button>
                <button onClick={() => handleOperatorClick('*')} className="key operator-key">×</button>
              </div>
              <div className="keypad-row">
                <button onClick={() => handleNumberClick('4')} className="key">4</button>
                <button onClick={() => handleNumberClick('5')} className="key">5</button>
                <button onClick={() => handleNumberClick('6')} className="key">6</button>
                <button onClick={() => handleOperatorClick('-')} className="key operator-key">−</button>
              </div>
              <div className="keypad-row">
                <button onClick={() => handleNumberClick('1')} className="key">1</button>
                <button onClick={() => handleNumberClick('2')} className="key">2</button>
                <button onClick={() => handleNumberClick('3')} className="key">3</button>
                <button onClick={() => handleOperatorClick('+')} className="key operator-key">+</button>
              </div>
              <div className="keypad-row">
                <button onClick={() => handleNumberClick('0')} className="key zero-key">0</button>
                <button onClick={() => handleDecimalClick()} className="key">.</button>
                <button onClick={() => handleCalculate()} className="key equals-key">=</button>
              </div>
            </div>
          </div>
        );
      
      // Other mode renderings would go here
      default:
        return (
          <div className="calculator-container">
            <div className="calculator-display">
              <div className="current-value">{display}</div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            <div className="calculator-keypad">
              <div className="keypad-row">
                <button onClick={() => handleModeChange('standard')} className="key function-key">
                  Back to Standard
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  // Mode selector component
  const renderModeSelector = (): JSX.Element => {
    return (
      <div className="mode-selector">
        <button 
          className={`mode-button ${currentMode === 'standard' ? 'active' : ''}`}
          onClick={() => handleModeChange('standard')}
        >
          <i className="fas fa-calculator"></i>
          <span>Standard</span>
        </button>
        <button 
          className={`mode-button ${currentMode === 'scientific' ? 'active' : ''}`}
          onClick={() => handleModeChange('scientific')}
        >
          <i className="fas fa-square-root-alt"></i>
          <span>Scientific</span>
        </button>
        <button 
          className={`mode-button ${currentMode === 'unit' ? 'active' : ''}`}
          onClick={() => handleModeChange('unit')}
        >
          <i className="fas fa-exchange-alt"></i>
          <span>Unit Converter</span>
        </button>
        <button 
          className={`mode-button ${currentMode === 'advanced' ? 'active' : ''}`}
          onClick={() => handleModeChange('advanced')}
        >
          <i className="fas fa-chart-line"></i>
          <span>Advanced</span>
        </button>
        <button 
          className={`mode-button ${currentMode === 'help' ? 'active' : ''}`}
          onClick={() => handleModeChange('help')}
        >
          <i className="fas fa-question-circle"></i>
          <span>Help</span>
        </button>
      </div>
    );
  };

  return (
    <div className="calculator-app">
      {renderModeSelector()}
      {renderCalculator()}
    </div>
  );
};

export default Calculator;
