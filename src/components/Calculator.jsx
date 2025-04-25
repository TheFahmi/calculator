'use client';

import { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
// Import Font Awesome properly for Next.js
import '@fortawesome/fontawesome-free/css/all.min.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [currentMode, setCurrentMode] = useState('standard');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRadianMode, setIsRadianMode] = useState(true);

  // Unit converter states
  const [currentUnitType, setCurrentUnitType] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [unitOptions, setUnitOptions] = useState([]);

  // Advanced calculator states
  const [currentAdvancedTab, setCurrentAdvancedTab] = useState('matrix');
  const [equationInput, setEquationInput] = useState('');
  const [matrixA, setMatrixA] = useState('');
  const [matrixB, setMatrixB] = useState('');
  const [polynomialCoeffs, setPolynomialCoeffs] = useState('');
  const [polynomialVariable, setPolynomialVariable] = useState('x');
  const [functionInput, setFunctionInput] = useState('x^2');
  const [integrationLimits, setIntegrationLimits] = useState({ lower: '0', upper: '1' });
  const [derivativePoint, setDerivativePoint] = useState('0');

  // Help section states
  const [currentHelpTab, setCurrentHelpTab] = useState('examples');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuizSolution, setShowQuizSolution] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);

  // Quiz questions data
  const quizQuestions = [
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
  const examples = [
    { name: "Basic Addition", value: "5+10" },
    { name: "With Decimals", value: "5.5+4.5" },
    { name: "Multiplication", value: "6*8" },
    { name: "Division", value: "20/4" },
    { name: "Mixed Operations", value: "5+10*2" },
    { name: "With Parentheses", value: "(5+10)*2" }
  ];

  const scientificExamples = [
    { name: "Sine", value: "sin" },
    { name: "Cosine", value: "cos" },
    { name: "Tangent", value: "tan" },
    { name: "Square Root", value: "sqrt" },
    { name: "Log10", value: "log" },
    { name: "Natural Log", value: "ln" },
    { name: "π Value", value: "pi" }
  ];

  // Handle number button clicks
  const handleNumberClick = (number) => {
    if (display === '0') {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  // Handle operator button clicks
  const handleOperatorClick = (operator) => {
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
  const handleDecimalClick = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  // Handle clear button
  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setErrorMessage('');
  };

  // Handle delete (backspace) button
  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Handle equals button click
  const handleCalculate = () => {
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
  const handlePercentage = () => {
    try {
      const result = math.evaluate(display) / 100;
      setDisplay(result.toString());
    } catch (error) {
      setErrorMessage('Error calculating percentage');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle mode change
  const handleModeChange = (mode) => {
    setCurrentMode(mode);

    // If switching to unit mode, set up unit options
    if (mode === 'unit') {
      setupUnitOptions(currentUnitType);
    }
  };

  // Scientific calculator functions
  const handleScientificFunction = (func) => {
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
          result = math.pi;
          break;
        case 'e':
          result = math.e;
          break;
        case 'exp':
          setExpression(display + 'e');
          setDisplay('0');
          return;
        default:
          result = value;
      }

      // Format to avoid unnecessary decimals
      if (typeof result === 'number') {
        const formattedResult = Math.round(result * 1000000) / 1000000;
        setDisplay(formattedResult.toString());
      } else {
        setDisplay(result.toString());
      }
    } catch (error) {
      setErrorMessage(`Error calculating ${func}`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Toggle between Radian and Degree mode
  const toggleAngleMode = (mode) => {
    setIsRadianMode(mode === 'rad');
  };

  // Handle brackets
  const handleBracket = (bracket) => {
    if (display === '0') {
      setExpression(expression + bracket);
    } else {
      if (bracket === '(') {
        setExpression(expression + display + '*' + bracket);
        setDisplay('0');
      } else {
        setExpression(expression + display + bracket);
        setDisplay('0');
      }
    }
  };

  // Unit converter functions
  const setupUnitOptions = (unitType) => {
    let options = [];

    switch (unitType) {
      case 'length':
        options = ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'];
        break;
      case 'weight':
        options = ['kg', 'g', 'mg', 'lb', 'oz', 'ton'];
        break;
      case 'temperature':
        options = ['celsius', 'fahrenheit', 'kelvin'];
        break;
      case 'area':
        options = ['m^2', 'km^2', 'cm^2', 'mm^2', 'ha', 'acre', 'ft^2', 'in^2'];
        break;
      default:
        options = ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'];
    }

    setUnitOptions(options);
    setFromUnit(options[0]);
    setToUnit(options[1]);
  };

  const handleUnitTypeChange = (unitType) => {
    setCurrentUnitType(unitType);
    setupUnitOptions(unitType);
  };

  const handleFromUnitChange = (e) => {
    setFromUnit(e.target.value);
  };

  const handleToUnitChange = (e) => {
    setToUnit(e.target.value);
  };

  const convertUnit = () => {
    try {
      // Use mathjs to convert the value
      const result = math.evaluate(`${display} ${fromUnit} to ${toUnit}`);

      // Check if result is a mathjs Unit object
      if (result && typeof result.toNumber === 'function') {
        // Format the result for display
        const formattedResult = Math.round(result.toNumber() * 1000000) / 1000000;
        setExpression(`${display} ${fromUnit} = ${formattedResult} ${toUnit}`);
        setDisplay(formattedResult.toString());
      } else {
        setDisplay(result.toString());
      }
    } catch (error) {
      setErrorMessage(`Error: Cannot convert ${fromUnit} to ${toUnit}`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Advanced calculator functions
  const handleAdvancedTabChange = (tab) => {
    setCurrentAdvancedTab(tab);
  };

  const handleEquationChange = (e) => {
    setEquationInput(e.target.value);
  };

  const handleMatrixAChange = (e) => {
    setMatrixA(e.target.value);
  };

  const handleMatrixBChange = (e) => {
    setMatrixB(e.target.value);
  };

  const handlePolynomialCoeffsChange = (e) => {
    setPolynomialCoeffs(e.target.value);
  };

  const handlePolynomialVariableChange = (e) => {
    setPolynomialVariable(e.target.value);
  };

  const handleFunctionInputChange = (e) => {
    setFunctionInput(e.target.value);
  };

  const handleIntegrationLowerChange = (e) => {
    setIntegrationLimits({ ...integrationLimits, lower: e.target.value });
  };

  const handleIntegrationUpperChange = (e) => {
    setIntegrationLimits({ ...integrationLimits, upper: e.target.value });
  };

  const handleDerivativePointChange = (e) => {
    setDerivativePoint(e.target.value);
  };

  const parseMatrix = (matrixStr) => {
    try {
      // Remove any unnecessary whitespace and formatting
      const cleanedStr = matrixStr.replace(/\s+/g, ' ').trim();

      // Check if the string is in the format [[a,b],[c,d]]
      if (cleanedStr.startsWith('[[') && cleanedStr.endsWith(']]')) {
        return math.evaluate(cleanedStr);
      }

      // If it's in the format "a,b;c,d"
      const rows = cleanedStr.split(';');
      const matrix = rows.map(row => row.split(',').map(Number));
      return matrix;
    } catch (error) {
      throw new Error('Invalid matrix format');
    }
  };

  const calculateAdvanced = () => {
    try {
      let result;

      switch (currentAdvancedTab) {
        case 'equation':
          // Solve equation
          result = math.evaluate(equationInput);
          break;

        case 'matrix':
          try {
            const matA = parseMatrix(matrixA);

            if (matrixB) {
              const matB = parseMatrix(matrixB);
              result = math.multiply(matA, matB);
            } else {
              // Just return determinant if only one matrix
              result = math.det(matA);
            }
          } catch (error) {
            throw new Error('Matrix calculation error: ' + error.message);
          }
          break;

        case 'polynomial':
          try {
            // Parse polynomial coefficients
            const coeffs = polynomialCoeffs.split(',').map(Number);

            // Build polynomial function
            let polyExpr = '';
            for (let i = 0; i < coeffs.length; i++) {
              const power = coeffs.length - 1 - i;
              if (coeffs[i] !== 0) {
                if (polyExpr && coeffs[i] > 0) polyExpr += '+';
                if (power === 0) {
                  polyExpr += coeffs[i];
                } else if (power === 1) {
                  polyExpr += `${coeffs[i]}*${polynomialVariable}`;
                } else {
                  polyExpr += `${coeffs[i]}*${polynomialVariable}^${power}`;
                }
              }
            }

            // Create and return function
            result = polyExpr;
          } catch (error) {
            throw new Error('Polynomial error: ' + error.message);
          }
          break;

        case 'integral':
          try {
            // Parse the function and limits
            const func = functionInput;
            const lowerLimit = parseFloat(integrationLimits.lower);
            const upperLimit = parseFloat(integrationLimits.upper);

            // Implement numerical integration using the trapezoidal rule
            const numIntervals = 1000; // Number of intervals for numerical integration
            const dx = (upperLimit - lowerLimit) / numIntervals;
            let sum = 0;

            // Create a function from the expression
            const f = math.compile(func);

            // Apply the trapezoidal rule
            for (let i = 0; i <= numIntervals; i++) {
              const x = lowerLimit + i * dx;
              const coefficient = (i === 0 || i === numIntervals) ? 0.5 : 1;
              sum += coefficient * f.evaluate({x: x});
            }

            result = sum * dx;
          } catch (error) {
            throw new Error('Integration error: ' + error.message);
          }
          break;

        case 'derivative':
          try {
            // Parse the function and point
            const func = functionInput;
            const point = parseFloat(derivativePoint);

            // Create the derivative function
            const expr = math.parse(func);
            const derivative = math.derivative(expr, 'x');

            // Evaluate at the given point
            result = derivative.evaluate({ x: point });
          } catch (error) {
            throw new Error('Derivative error: ' + error.message);
          }
          break;

        default:
          result = "Select a calculation type";
      }

      // Display result
      if (typeof result === 'number') {
        const formattedResult = Math.round(result * 1000000) / 1000000;
        setDisplay(formattedResult.toString());
      } else if (result && typeof result === 'object' && result.toString) {
        setDisplay(result.toString());
      } else {
        setDisplay(result);
      }

      setExpression(`Advanced: ${currentAdvancedTab}`);

    } catch (error) {
      setErrorMessage('Error: ' + error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Help mode functions
  const handleHelpTabChange = (tab) => {
    setCurrentHelpTab(tab);
  };

  const handleExampleClick = (exampleValue) => {
    if (exampleValue === 'sin' || exampleValue === 'cos' || exampleValue === 'tan' ||
        exampleValue === 'sqrt' || exampleValue === 'log' || exampleValue === 'ln' ||
        exampleValue === 'pi') {
      // For scientific functions
      setCurrentMode('scientific');
      handleScientificFunction(exampleValue);
    } else {
      // For regular expressions
      setDisplay(exampleValue);
      setCurrentMode('standard');
    }
  };

  const startQuiz = () => {
    setCurrentHelpTab('quiz');
    setCurrentQuizIndex(0);
    setQuizSelectedOption(null);
    setShowQuizSolution(false);
  };

  const handleQuizOptionSelect = (optionIndex) => {
    setQuizSelectedOption(optionIndex);

    // Check if answer is correct
    const currentQuiz = quizQuestions[currentQuizIndex];
    if (optionIndex === currentQuiz.answer) {
      // Correct answer logic
      setShowQuizSolution(true);
    } else {
      // Incorrect answer logic
      setShowQuizSolution(true);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setQuizSelectedOption(null);
      setShowQuizSolution(false);
    }
  };

  const prevQuizQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setQuizSelectedOption(null);
      setShowQuizSolution(false);
    }
  };

  // Initialize unit options when component mounts
  useEffect(() => {
    setupUnitOptions('length');
  }, []);

  // Render calculator based on current mode
  return (
    <div className="calculator">
      {/* Display */}
      <div className="calculator-display">
        <div id="error-message" className={`error-message ${errorMessage ? 'show' : ''}`}>
          {errorMessage}
        </div>
        <div id="expression">{expression}</div>
        <div id="display">{display}</div>
      </div>

      {/* Mode Buttons */}
      <div className="calculator-mode">
        <button
          id="standardMode"
          className={`mode-button ${currentMode === 'standard' ? 'active' : ''}`}
          onClick={() => handleModeChange('standard')}
        >
          Standard
        </button>
        <button
          id="scientificMode"
          className={`mode-button ${currentMode === 'scientific' ? 'active' : ''}`}
          onClick={() => handleModeChange('scientific')}
        >
          Scientific
        </button>
        <button
          id="unitMode"
          className={`mode-button ${currentMode === 'unit' ? 'active' : ''}`}
          onClick={() => handleModeChange('unit')}
        >
          Units
        </button>
        <button
          id="advancedMode"
          className={`mode-button ${currentMode === 'advanced' ? 'active' : ''}`}
          onClick={() => handleModeChange('advanced')}
        >
          Advanced
        </button>
        <button
          id="helpMode"
          className={`mode-button ${currentMode === 'help' ? 'active' : ''}`}
          onClick={() => handleModeChange('help')}
        >
          Help
        </button>
      </div>

      {/* Help Section - Only visible in help mode */}
      <div className={`help-keys ${currentMode === 'help' ? 'active' : ''}`}>
        <div className="help-tabs">
          <button
            className={`help-tab-btn ${currentHelpTab === 'examples' ? 'active' : ''}`}
            onClick={() => handleHelpTabChange('examples')}
          >
            Examples
          </button>
          <button
            className={`help-tab-btn ${currentHelpTab === 'quiz' ? 'active' : ''}`}
            onClick={() => startQuiz()}
          >
            Quiz
          </button>
        </div>

        <div className={`help-tab-content ${currentHelpTab === 'examples' ? 'active' : ''}`} id="examples-tab">
          <div className="examples-section">
            <h4>Standard Calculator Examples</h4>
            <div className="example-buttons">
              {examples.map((example, index) => (
                <button
                  key={index}
                  className="example-btn"
                  onClick={() => handleExampleClick(example.value)}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <div className="examples-section">
            <h4>Scientific Functions</h4>
            <div className="example-buttons">
              {scientificExamples.map((example, index) => (
                <button
                  key={index}
                  className="example-btn"
                  onClick={() => handleExampleClick(example.value)}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <div className="examples-section">
            <h4>Using Units</h4>
            <p>Go to the Units tab and select the type of unit you want to convert. Enter a value, select from and to units, then click Convert.</p>
          </div>

          <div className="examples-section">
            <h4>Advanced Calculations</h4>
            <p>The Advanced tab offers tools for matrix operations, polynomial functions, calculus, and more.</p>
          </div>
        </div>

        <div className={`help-tab-content ${currentHelpTab === 'quiz' ? 'active' : ''}`} id="quiz-tab">
          <div className="quiz-container">
            <div id="quiz-question">
              {quizQuestions[currentQuizIndex]?.question}
            </div>

            <div id="quiz-options">
              {quizQuestions[currentQuizIndex]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${
                    quizSelectedOption === index
                      ? (index === quizQuestions[currentQuizIndex].answer ? 'correct' : 'incorrect')
                      : ''
                  }`}
                  onClick={() => handleQuizOptionSelect(index)}
                >
                  {option}
                </div>
              ))}
            </div>

            <div className={`quiz-explanation ${showQuizSolution ? 'active' : ''}`}>
              {quizQuestions[currentQuizIndex]?.explanation}
            </div>

            <div className="quiz-navigation">
              <button
                className="quiz-nav-btn"
                onClick={prevQuizQuestion}
                disabled={currentQuizIndex === 0}
              >
                Previous
              </button>

              <span id="quiz-progress">
                {currentQuizIndex + 1} / {quizQuestions.length}
              </span>

              <button
                className="quiz-nav-btn"
                onClick={nextQuizQuestion}
                disabled={currentQuizIndex === quizQuestions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Calculator - Only visible in advanced mode */}
      <div className={`advanced-keys ${currentMode === 'advanced' ? 'active' : ''}`}>
        <div className="advanced-tabs">
          <button
            className={`advanced-tab-btn ${currentAdvancedTab === 'equation' ? 'active' : ''}`}
            data-tab="equation"
            onClick={() => handleAdvancedTabChange('equation')}
          >
            Equation
          </button>
          <button
            className={`advanced-tab-btn ${currentAdvancedTab === 'matrix' ? 'active' : ''}`}
            data-tab="matrix"
            onClick={() => handleAdvancedTabChange('matrix')}
          >
            Matrix
          </button>
          <button
            className={`advanced-tab-btn ${currentAdvancedTab === 'polynomial' ? 'active' : ''}`}
            data-tab="polynomial"
            onClick={() => handleAdvancedTabChange('polynomial')}
          >
            Polynomial
          </button>
          <button
            className={`advanced-tab-btn ${currentAdvancedTab === 'integral' ? 'active' : ''}`}
            data-tab="integral"
            onClick={() => handleAdvancedTabChange('integral')}
          >
            Integral
          </button>
          <button
            className={`advanced-tab-btn ${currentAdvancedTab === 'derivative' ? 'active' : ''}`}
            data-tab="derivative"
            onClick={() => handleAdvancedTabChange('derivative')}
          >
            Derivative
          </button>
        </div>

        {/* Equation Tab Content */}
        <div className={`advanced-tab-content ${currentAdvancedTab === 'equation' ? 'active' : ''}`} id="equation-tab">
          <div className="equation-input">
            <input
              type="text"
              placeholder="Enter equation (e.g., '2*x + 3 = 10')"
              value={equationInput}
              onChange={handleEquationChange}
            />
          </div>
        </div>

        {/* Matrix Tab Content */}
        <div className={`advanced-tab-content ${currentAdvancedTab === 'matrix' ? 'active' : ''}`} id="matrix-tab">
          <div className="equation-input">
            <textarea
              placeholder="Matrix A (e.g., '1,2;3,4' for a 2x2 matrix)"
              value={matrixA}
              onChange={handleMatrixAChange}
            ></textarea>
          </div>
          <div className="equation-input">
            <textarea
              placeholder="Matrix B (optional, for multiplication)"
              value={matrixB}
              onChange={handleMatrixBChange}
            ></textarea>
          </div>
        </div>

        {/* Polynomial Tab Content */}
        <div className={`advanced-tab-content ${currentAdvancedTab === 'polynomial' ? 'active' : ''}`} id="polynomial-tab">
          <div className="equation-input">
            <input
              type="text"
              placeholder="Coefficients (e.g., '1,2,3' for x²+2x+3)"
              value={polynomialCoeffs}
              onChange={handlePolynomialCoeffsChange}
            />
          </div>
          <div className="equation-input">
            <input
              type="text"
              placeholder="Variable (default: x)"
              value={polynomialVariable}
              onChange={handlePolynomialVariableChange}
            />
          </div>
        </div>

        {/* Integral Tab Content */}
        <div className={`advanced-tab-content ${currentAdvancedTab === 'integral' ? 'active' : ''}`} id="integral-tab">
          <div className="equation-input">
            <input
              type="text"
              placeholder="Function to integrate (e.g., 'x^2')"
              value={functionInput}
              onChange={handleFunctionInputChange}
            />
          </div>
          <div className="equation-input">
            <input
              type="text"
              placeholder="Lower limit"
              value={integrationLimits.lower}
              onChange={handleIntegrationLowerChange}
            />
          </div>
          <div className="equation-input">
            <input
              type="text"
              placeholder="Upper limit"
              value={integrationLimits.upper}
              onChange={handleIntegrationUpperChange}
            />
          </div>
        </div>

        {/* Derivative Tab Content */}
        <div className={`advanced-tab-content ${currentAdvancedTab === 'derivative' ? 'active' : ''}`} id="derivative-tab">
          <div className="equation-input">
            <input
              type="text"
              placeholder="Function to differentiate (e.g., 'x^2')"
              value={functionInput}
              onChange={handleFunctionInputChange}
            />
          </div>
          <div className="equation-input">
            <input
              type="text"
              placeholder="Point to evaluate at"
              value={derivativePoint}
              onChange={handleDerivativePointChange}
            />
          </div>
        </div>

        <button className="advanced-calc-btn" onClick={calculateAdvanced}>Calculate</button>
      </div>

      {/* Unit Converter - Only visible in unit mode */}
      <div className={`unit-keys ${currentMode === 'unit' ? 'active' : ''}`}>
        <div className="unit-type-selector">
          <button
            className={`unit-type-btn ${currentUnitType === 'length' ? 'active' : ''}`}
            data-unit-type="length"
            onClick={() => handleUnitTypeChange('length')}
          >
            Length
          </button>
          <button
            className={`unit-type-btn ${currentUnitType === 'weight' ? 'active' : ''}`}
            data-unit-type="weight"
            onClick={() => handleUnitTypeChange('weight')}
          >
            Weight
          </button>
          <button
            className={`unit-type-btn ${currentUnitType === 'temperature' ? 'active' : ''}`}
            data-unit-type="temperature"
            onClick={() => handleUnitTypeChange('temperature')}
          >
            Temp
          </button>
          <button
            className={`unit-type-btn ${currentUnitType === 'area' ? 'active' : ''}`}
            data-unit-type="area"
            onClick={() => handleUnitTypeChange('area')}
          >
            Area
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

        <button id="convertBtn" className="unit-convert-btn" onClick={convertUnit}>Convert</button>
      </div>

      {/* Scientific Calculator Keys - Only visible in scientific mode */}
      <div className={`scientific-keys ${currentMode === 'scientific' ? 'active' : ''}`}>
        <button className="sci-operator" data-action="sin" onClick={() => handleScientificFunction('sin')}>sin</button>
        <button className="sci-operator" data-action="cos" onClick={() => handleScientificFunction('cos')}>cos</button>
        <button className="sci-operator" data-action="tan" onClick={() => handleScientificFunction('tan')}>tan</button>
        <button className="sci-operator" data-action="pow" onClick={() => handleScientificFunction('pow')}><i className="fa fa-superscript"></i></button>
        <button className="sci-operator" data-action="sqrt" onClick={() => handleScientificFunction('sqrt')}><i className="fa fa-square-root-alt">√</i></button>
        <button className="sci-operator" data-action="log" onClick={() => handleScientificFunction('log')}>log</button>
        <button className="sci-operator" data-action="ln" onClick={() => handleScientificFunction('ln')}>ln</button>
        <button className="sci-operator" data-action="factorial" onClick={() => handleScientificFunction('factorial')}>x!</button>
        <button className="sci-operator" data-action="pi" onClick={() => handleScientificFunction('pi')}>π</button>
        <button className="sci-operator" data-action="e" onClick={() => handleScientificFunction('e')}>e</button>
        <button className={`sci-operator ${isRadianMode ? 'active' : ''}`} data-action="rad" onClick={() => toggleAngleMode('rad')}>Rad</button>
        <button className={`sci-operator ${!isRadianMode ? 'active' : ''}`} data-action="deg" onClick={() => toggleAngleMode('deg')}>Deg</button>
        <button className="sci-operator" data-action="open-bracket" onClick={() => handleBracket('(')}>(</button>
        <button className="sci-operator" data-action="close-bracket" onClick={() => handleBracket(')')}>)</button>
        <button className="sci-operator" data-action="exp" onClick={() => handleScientificFunction('exp')}>EXP</button>
        <button className="sci-operator" data-action="mod" onClick={() => handleOperatorClick('%')}>mod</button>
      </div>

      {/* Standard Calculator Keys - Always visible */}
      <div className="calculator-keys">
        <button className="operator" data-action="clear" onClick={handleClear}>AC</button>
        <button className="operator" data-action="delete" onClick={handleDelete}>
          <i className="fas fa-backspace"></i>
        </button>
        <button className="operator" data-action="percent" onClick={handlePercentage}>%</button>
        <button className="operator" data-action="divide" onClick={() => handleOperatorClick('/')}>/</button>
        
        <button className="number" onClick={() => handleNumberClick('7')}>7</button>
        <button className="number" onClick={() => handleNumberClick('8')}>8</button>
        <button className="number" onClick={() => handleNumberClick('9')}>9</button>
        <button className="operator" data-action="multiply" onClick={() => handleOperatorClick('*')}>*</button>
        
        <button className="number" onClick={() => handleNumberClick('4')}>4</button>
        <button className="number" onClick={() => handleNumberClick('5')}>5</button>
        <button className="number" onClick={() => handleNumberClick('6')}>6</button>
        <button className="operator" data-action="subtract" onClick={() => handleOperatorClick('-')}>-</button>
        
        <button className="number" onClick={() => handleNumberClick('1')}>1</button>
        <button className="number" onClick={() => handleNumberClick('2')}>2</button>
        <button className="number" onClick={() => handleNumberClick('3')}>3</button>
        <button className="operator" data-action="add" onClick={() => handleOperatorClick('+')}>+</button>
        
        <button className="number zero-btn" onClick={() => handleNumberClick('0')}>0</button>
        <button className="decimal" onClick={handleDecimalClick}>.</button>
        <button className="operator equals" data-action="calculate" onClick={handleCalculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;