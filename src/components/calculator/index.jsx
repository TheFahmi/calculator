'use client';

import { useState, useEffect } from 'react';
import * as math from 'mathjs';
import Display from './Display';
import ModeSelector from './ModeSelector';
import KeyPad from './KeyPad';
import ScientificKeyPad from './ScientificKeyPad';
import UnitConverter from './UnitConverter';
import AdvancedCalculator from './AdvancedCalculator';
import HelpSection from './HelpSection';
import ThemeToggle from './ThemeToggle';
import AdvancedKeypad from './AdvancedKeypad';
import History from './History';

// Import utilities
import {
  evaluateExpression,
  calculateScientificFunction,
  formatNumber,
  isValidExpression,
  parseVoiceTranscript,
  operationPatterns,
  indonesianNumbers,
  unitTypes,
  convertUnit,
  getUnitsForType
} from '../../utils';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [currentMode, setCurrentMode] = useState('standard');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRadianMode, setIsRadianMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

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

  // Advanced keypad state
  const [showAdvancedKeypad, setShowAdvancedKeypad] = useState(false);

  // History state
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
      // Prepare the complete expression
      const completeExpression = expression.length > 0 ? expression + display : display;

      // Use the utility function to evaluate the expression
      const result = evaluateExpression(completeExpression);

      // Format the result for display
      const formattedResult = formatNumber(result);

      // Update the UI
      setExpression(expression + display + '=');
      setDisplay(formattedResult);

      // Add to history (limit to 50 items)
      const historyItem = {
        expression: expression + display,
        result: formattedResult,
        timestamp: new Date().toISOString()
      };

      console.log('Adding to history:', historyItem);

      // Only add to history if it's a valid calculation (not just a number)
      if (expression.length > 0) {
        setHistory(prevHistory => {
          const newHistory = [historyItem, ...prevHistory];
          // Limit history to 50 items to prevent excessive storage
          return newHistory.slice(0, 50);
        });
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
    console.log('Changing mode to:', mode);
    setCurrentMode(mode);

    // If switching to unit mode, set up unit options
    if (mode === 'unit') {
      setupUnitOptions(currentUnitType);
    }

    // Hide advanced keypad when changing modes
    setShowAdvancedKeypad(false);
  };

  // Toggle advanced keypad
  const toggleAdvancedKeypad = () => {
    setShowAdvancedKeypad(!showAdvancedKeypad);
  };

  // Toggle history panel
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Handle history item click
  const handleHistoryItemClick = (item) => {
    setExpression(item.expression + '=');
    setDisplay(item.result);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calculatorHistory');
    }
  };

  // Handle advanced keypad button click
  const handleAdvancedButtonClick = (value) => {
    try {
      console.log('Advanced button clicked:', value);

      // Handle different types of advanced buttons
      switch (value) {
        // Constants
        case 'pi':
          setDisplay(math.pi.toString());
          return;
        case 'e':
          setDisplay(math.e.toString());
          return;

        // Variables and brackets
        case 'x':
          if (display === '0') {
            setDisplay('x');
          } else {
            setDisplay(display + 'x');
          }
          return;
        case '(':
        case ')':
          if (display === '0') {
            setDisplay(value);
          } else {
            setDisplay(display + value);
          }
          return;

        // Powers
        case '^2':
          try {
            const result = math.evaluate(`${display}^2`);
            setExpression(`${display}^2 =`);
            setDisplay(result.toString());

            // Add to history
            const historyItem = {
              expression: `${display}^2`,
              result: result.toString(),
              timestamp: new Date().toISOString()
            };
            setHistory(prevHistory => {
              const newHistory = [historyItem, ...prevHistory];
              return newHistory.slice(0, 50);
            });
          } catch (error) {
            setErrorMessage('Error calculating square');
            setTimeout(() => setErrorMessage(''), 3000);
          }
          return;
        case '^3':
          try {
            const result = math.evaluate(`${display}^3`);
            setExpression(`${display}^3 =`);
            setDisplay(result.toString());

            // Add to history
            const historyItem = {
              expression: `${display}^3`,
              result: result.toString(),
              timestamp: new Date().toISOString()
            };
            setHistory(prevHistory => {
              const newHistory = [historyItem, ...prevHistory];
              return newHistory.slice(0, 50);
            });
          } catch (error) {
            setErrorMessage('Error calculating cube');
            setTimeout(() => setErrorMessage(''), 3000);
          }
          return;
        case '^':
          setExpression(display + '^');
          setDisplay('0');
          return;

        // Functions that need parentheses
        case 'sqrt':
        case 'cbrt':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log10':
        case 'log':
        case 'abs':
        case 'exp':
        case 'factorial':
          handleScientificFunction(value);
          return;

        // Operators
        case '%':
          if (display !== '0') {
            setExpression(expression + display + '%');
            setDisplay('0');
          }
          return;
        case '1/':
          try {
            const result = math.evaluate(`1/${display}`);
            setExpression(`1/${display} =`);
            setDisplay(result.toString());

            // Add to history
            const historyItem = {
              expression: `1/${display}`,
              result: result.toString(),
              timestamp: new Date().toISOString()
            };
            setHistory(prevHistory => {
              const newHistory = [historyItem, ...prevHistory];
              return newHistory.slice(0, 50);
            });
          } catch (error) {
            setErrorMessage('Error calculating reciprocal');
            setTimeout(() => setErrorMessage(''), 3000);
          }
          return;

        default:
          console.log('Unhandled advanced button:', value);
      }
    } catch (error) {
      console.error('Error handling advanced button:', error);
      setErrorMessage('Error with advanced function');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Scientific calculator functions
  const handleScientificFunction = (func) => {
    try {
      // Special case for power function
      if (func === 'pow') {
        setExpression(display + '^');
        setDisplay('0');
        return;
      }

      const value = parseFloat(display);

      // Use the utility function to calculate the result
      const result = calculateScientificFunction(func, value, isRadianMode);

      // Display the formatted result
      const formattedResult = formatNumber(result);
      setDisplay(formattedResult);

      // Add to history
      const historyItem = {
        expression: `${func}(${display})`,
        result: formattedResult,
        timestamp: new Date().toISOString()
      };
      setHistory(prevHistory => {
        const newHistory = [historyItem, ...prevHistory];
        return newHistory.slice(0, 50);
      });
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
    // Use the utility function to get units for the specified type
    const units = getUnitsForType(unitType);

    // Extract just the values for the dropdown
    const options = units.map(unit => unit.value);

    // Update state
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

  const handleUnitConversion = () => {
    try {
      console.log(`Converting ${display} ${fromUnit} to ${toUnit}`);

      // Get the value to convert
      const value = parseFloat(display);
      if (isNaN(value)) {
        throw new Error('Please enter a valid number');
      }

      // Use the utility function to convert the unit
      const result = convertUnit(value, fromUnit, toUnit);

      // Format the result for display
      const formattedResult = formatNumber(result);
      const expressionText = `${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
      setExpression(expressionText);
      setDisplay(formattedResult);

      // Add to history
      const historyItem = {
        expression: `${value} ${fromUnit} → ${toUnit}`,
        result: formattedResult,
        timestamp: new Date().toISOString()
      };
      setHistory(prevHistory => {
        const newHistory = [historyItem, ...prevHistory];
        return newHistory.slice(0, 50);
      });
    } catch (error) {
      console.error('Conversion error:', error);
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

  // Voice recognition setup
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'id-ID'; // Set to Indonesian language

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        handleVoiceInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'not-allowed') {
          setErrorMessage('Izin mikrofon ditolak. Silakan izinkan akses mikrofon di browser Anda.');
          setTimeout(() => setErrorMessage(''), 5000);
        }

        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognition) {
      setErrorMessage('Maaf, browser Anda tidak mendukung fitur pengenalan suara.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setErrorMessage('Terjadi kesalahan saat memulai pengenalan suara. Silakan coba lagi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  // Voice input handler
  const handleVoiceInput = (transcript) => {
    console.log('Processing voice input:', transcript);

    try {
      // Use the utility function to parse the voice transcript
      const result = parseVoiceTranscript(transcript);

      // Handle different types of voice commands based on the parsing result
      switch (result.type) {
        case 'command':
          if (result.command === 'clear') {
            handleClear();
          } else if (result.command === 'calculate') {
            handleCalculate();
          }
          break;

        case 'mode':
          handleModeChange(result.mode);
          break;

        case 'expression':
          if (result.valid) {
            try {
              // Evaluate the expression
              const calculationResult = evaluateExpression(result.expression);

              // Format and display the result
              setExpression(result.expression + '=');
              setDisplay(formatNumber(calculationResult));
            } catch (error) {
              console.error('Error evaluating expression:', error);
              setErrorMessage('Error: Could not evaluate the expression');
              setTimeout(() => setErrorMessage(''), 3000);
            }
          }
          break;

        case 'operation':
          handleOperatorClick(result.operation);
          break;

        case 'number':
          setDisplay(result.value);
          break;

        case 'unknown':
        default:
          // Try to extract numbers (fallback)
          const numberMatch = transcript.match(/\d+(\.\d+)?/g);
          if (numberMatch) {
            setDisplay(numberMatch[0]);
          }
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      setErrorMessage('Error processing voice input');
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

  // Load history from localStorage when component mounts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('calculatorHistory');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Error loading history from localStorage:', error);
        }
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.log('Saving history to localStorage:', history);
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    }
  }, [history]);

  // Initialize unit options when component mounts
  useEffect(() => {
    setupUnitOptions('length');
  }, []);

  return (
    <div className="calculator">
      <button
        className={`history-toggle-btn ${showHistory ? 'active' : ''}`}
        onClick={toggleHistory}
        title="Riwayat Perhitungan"
      >
        <i className="fas fa-history"></i>
      </button>

      <div className={`history-container ${showHistory ? 'show' : ''}`}>
        <History
          history={history}
          handleHistoryItemClick={handleHistoryItemClick}
          clearHistory={clearHistory}
        />
      </div>

      <div className="utility-section">
        <div className="utility-controls">
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title="Tekan untuk input suara"
          >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
          <button
            className={`advanced-toggle-btn ${showAdvancedKeypad ? 'active' : ''}`}
            onClick={toggleAdvancedKeypad}
            title="Advanced Keypad"
          >
            <i className="fas fa-calculator"></i>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <Display
        display={display}
        expression={expression}
        errorMessage={errorMessage}
        handleVoiceInput={handleVoiceInput}
      />

      {showAdvancedKeypad && (
        <AdvancedKeypad handleAdvancedButtonClick={handleAdvancedButtonClick} />
      )}

      <ModeSelector
        currentMode={currentMode}
        handleModeChange={handleModeChange}
      />

      <div className="mode-content">
        <div style={{ display: currentMode === 'help' ? 'block' : 'none' }}>
          <HelpSection
            currentHelpTab={currentHelpTab}
            handleHelpTabChange={handleHelpTabChange}
            examples={examples}
            scientificExamples={scientificExamples}
            handleExampleClick={handleExampleClick}
            quizQuestions={quizQuestions}
            currentQuizIndex={currentQuizIndex}
            quizSelectedOption={quizSelectedOption}
            showQuizSolution={showQuizSolution}
            handleQuizOptionSelect={handleQuizOptionSelect}
            prevQuizQuestion={prevQuizQuestion}
            nextQuizQuestion={nextQuizQuestion}
            startQuiz={startQuiz}
          />
        </div>

        <div style={{ display: currentMode === 'advanced' ? 'block' : 'none' }}>
          <AdvancedCalculator
            currentAdvancedTab={currentAdvancedTab}
            handleAdvancedTabChange={handleAdvancedTabChange}
            equationInput={equationInput}
            handleEquationChange={handleEquationChange}
            matrixA={matrixA}
            handleMatrixAChange={handleMatrixAChange}
            matrixB={matrixB}
            handleMatrixBChange={handleMatrixBChange}
            polynomialCoeffs={polynomialCoeffs}
            handlePolynomialCoeffsChange={handlePolynomialCoeffsChange}
            polynomialVariable={polynomialVariable}
            handlePolynomialVariableChange={handlePolynomialVariableChange}
            functionInput={functionInput}
            handleFunctionInputChange={handleFunctionInputChange}
            integrationLimits={integrationLimits}
            handleIntegrationLowerChange={handleIntegrationLowerChange}
            handleIntegrationUpperChange={handleIntegrationUpperChange}
            derivativePoint={derivativePoint}
            handleDerivativePointChange={handleDerivativePointChange}
            calculateAdvanced={calculateAdvanced}
          />
        </div>

        <div style={{ display: currentMode === 'unit' ? 'block' : 'none' }}>
          <UnitConverter
            currentUnitType={currentUnitType}
            handleUnitTypeChange={handleUnitTypeChange}
            fromUnit={fromUnit}
            toUnit={toUnit}
            handleFromUnitChange={handleFromUnitChange}
            handleToUnitChange={handleToUnitChange}
            unitOptions={unitOptions}
            convertUnit={handleUnitConversion}
          />
        </div>

        <div style={{ display: currentMode === 'scientific' ? 'block' : 'none' }}>
          <ScientificKeyPad
            handleScientificFunction={handleScientificFunction}
            toggleAngleMode={toggleAngleMode}
            handleBracket={handleBracket}
            isRadianMode={isRadianMode}
            handleOperatorClick={handleOperatorClick}
          />
        </div>
      </div>

      <KeyPad
        handleNumberClick={handleNumberClick}
        handleOperatorClick={handleOperatorClick}
        handleDecimalClick={handleDecimalClick}
        handleClear={handleClear}
        handleDelete={handleDelete}
        handleCalculate={handleCalculate}
        handlePercentage={handlePercentage}
      />
    </div>
  );
};

export default Calculator;
