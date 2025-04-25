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

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: string;
}

interface Example {
  name: string;
  value: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
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
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

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

  // Advanced keypad state
  const [showAdvancedKeypad, setShowAdvancedKeypad] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

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
      const historyItem: HistoryItem = {
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

      // Use the utility function for scientific calculations
      result = calculateScientificFunction(func, value, isRadianMode);

      // Format and display the result
      setDisplay(formatNumber(result));
    } catch (error) {
      setErrorMessage(`Error in ${func} calculation`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Toggle between radian and degree mode
  const toggleAngleMode = (mode: string): void => {
    setIsRadianMode(mode === 'rad');
  };

  // Handle bracket input
  const handleBracket = (bracket: string): void => {
    if (display === '0') {
      setDisplay(bracket);
    } else {
      setDisplay(display + bracket);
    }
  };

  // Setup unit conversion options based on type
  const setupUnitOptions = (type: string): void => {
    const options = getUnitsForType(type).map(unit => unit.value);
    setUnitOptions(options);
    
    if (options.length > 0) {
      setFromUnit(options[0]);
      setToUnit(options.length > 1 ? options[1] : options[0]);
    }
  };

  // Handle unit type change
  const handleUnitTypeChange = (type: string): void => {
    setCurrentUnitType(type);
    setupUnitOptions(type);
  };

  // Handle from unit change
  const handleFromUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFromUnit(e.target.value);
  };

  // Handle to unit change
  const handleToUnitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setToUnit(e.target.value);
  };

  // Handle unit conversion
  const handleUnitConversion = (): void => {
    try {
      if (display === '0') return;
      
      const value = parseFloat(display);
      const result = convertUnit(value, fromUnit, toUnit);
      
      // Format and display the result
      setDisplay(formatNumber(result));
    } catch (error) {
      setErrorMessage('Error in unit conversion');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Advanced calculator functions
  const handleAdvancedTabChange = (tab: string): void => {
    setCurrentAdvancedTab(tab);
  };

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEquationInput(e.target.value);
  };

  const handleMatrixAChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMatrixA(e.target.value);
  };

  const handleMatrixBChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMatrixB(e.target.value);
  };

  const handlePolynomialCoeffsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPolynomialCoeffs(e.target.value);
  };

  const handlePolynomialVariableChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPolynomialVariable(e.target.value);
  };

  const handleFunctionInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFunctionInput(e.target.value);
  };

  const handleIntegrationLowerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIntegrationLimits(prev => ({ ...prev, lower: e.target.value }));
  };

  const handleIntegrationUpperChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIntegrationLimits(prev => ({ ...prev, upper: e.target.value }));
  };

  const handleDerivativePointChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDerivativePoint(e.target.value);
  };

  // Calculate advanced operations
  const calculateAdvanced = (): void => {
    try {
      let result;
      
      switch (currentAdvancedTab) {
        case 'equation':
          // Solve equation
          if (!equationInput) return;
          result = math.evaluate(`solve(${equationInput}, x)`);
          break;
          
        case 'matrix':
          // Matrix operations
          if (!matrixA) return;
          const mA = math.matrix(JSON.parse(matrixA.replace(/;/g, '],[')));
          
          // Determine operation based on input
          if (matrixB) {
            // If matrix B is provided, perform multiplication
            const mB = math.matrix(JSON.parse(matrixB.replace(/;/g, '],[')));
            result = math.multiply(mA, mB);
          } else {
            // Otherwise, calculate determinant
            result = math.det(mA);
          }
          break;
          
        case 'polynomial':
          // Evaluate polynomial
          if (!polynomialCoeffs) return;
          
          const coeffs = polynomialCoeffs.split(',').map(Number);
          const x = parseFloat(display);
          
          let polyResult = 0;
          for (let i = 0; i < coeffs.length; i++) {
            polyResult += coeffs[i] * Math.pow(x, coeffs.length - 1 - i);
          }
          
          result = polyResult;
          break;
          
        case 'integral':
          // Calculate definite integral
          if (!functionInput) return;
          
          const { lower, upper } = integrationLimits;
          result = math.integrate(functionInput, polynomialVariable, {
            from: parseFloat(lower),
            to: parseFloat(upper)
          });
          break;
          
        case 'derivative':
          // Calculate derivative
          if (!functionInput) return;
          
          const x = parseFloat(derivativePoint);
          result = math.derivative(functionInput, polynomialVariable).evaluate({ [polynomialVariable]: x });
          break;
          
        default:
          return;
      }
      
      // Format and display the result
      setDisplay(formatNumber(result));
    } catch (error) {
      setErrorMessage(`Error in ${currentAdvancedTab} calculation`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Advanced keypad functions
  const handleAdvancedButtonClick = (value: string): void => {
    // Handle different types of advanced buttons
    if (value === 'pi' || value === 'e') {
      // Constants
      setDisplay(value === 'pi' ? math.pi.toString() : math.e.toString());
    } else if (value.startsWith('^')) {
      // Powers
      setDisplay(display + value);
    } else if (['sin', 'cos', 'tan', 'log10', 'log', 'sqrt', 'cbrt', 'abs', 'exp', 'factorial'].includes(value)) {
      // Functions
      handleScientificFunction(value);
    } else {
      // Other values (operators, variables)
      setDisplay(display === '0' ? value : display + value);
    }
  };

  // Toggle advanced keypad
  const toggleAdvancedKeypad = (): void => {
    setShowAdvancedKeypad(!showAdvancedKeypad);
  };

  // Help section functions
  const handleHelpTabChange = (tab: string): void => {
    setCurrentHelpTab(tab);
  };

  const handleExampleClick = (value: string): void => {
    if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'pi'].includes(value)) {
      handleModeChange('scientific');
      handleScientificFunction(value);
    } else {
      setDisplay(value);
      handleModeChange('standard');
    }
  };

  const handleQuizOptionSelect = (optionIndex: number): void => {
    setQuizSelectedOption(optionIndex);
    setShowQuizSolution(true);
  };

  const prevQuizQuestion = (): void => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowQuizSolution(false);
      setQuizSelectedOption(null);
    }
  };

  const nextQuizQuestion = (): void => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowQuizSolution(false);
      setQuizSelectedOption(null);
    }
  };

  const startQuiz = (): void => {
    setCurrentHelpTab('quiz');
    setCurrentQuizIndex(0);
    setShowQuizSolution(false);
    setQuizSelectedOption(null);
  };

  // History functions
  const toggleHistory = (): void => {
    setShowHistory(!showHistory);
  };

  const handleHistoryItemClick = (item: HistoryItem): void => {
    setDisplay(item.result);
    setExpression(item.expression);
  };

  const clearHistory = (): void => {
    setHistory([]);
  };

  // Voice input functions
  const handleVoiceInput = (transcript: string): void => {
    const parsedInput = parseVoiceTranscript(transcript);
    
    switch (parsedInput.type) {
      case 'command':
        if (parsedInput.command === 'clear') {
          handleClear();
        } else if (parsedInput.command === 'calculate') {
          handleCalculate();
        }
        break;
        
      case 'mode':
        if (parsedInput.mode) {
          handleModeChange(parsedInput.mode as 'standard' | 'scientific' | 'unit' | 'advanced' | 'help');
        }
        break;
        
      case 'number':
        if (parsedInput.value) {
          handleNumberClick(parsedInput.value);
        }
        break;
        
      case 'operation':
        if (parsedInput.operation) {
          handleOperatorClick(parsedInput.operation);
        }
        break;
        
      case 'expression':
        if (parsedInput.expression && parsedInput.valid) {
          setDisplay(parsedInput.expression);
          handleCalculate();
        }
        break;
        
      default:
        setErrorMessage('Could not understand voice input');
        setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
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

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  // Initialize unit options on component mount
  useEffect(() => {
    setupUnitOptions(currentUnitType);
  }, []);

  // Start/stop voice recognition
  const toggleVoiceRecognition = (): void => {
    if (!recognition) {
      setErrorMessage('Speech recognition not supported in this browser');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Next.js Calculator</h1>
        <ThemeToggle />
      </div>
      
      <div className="calculator-body">
        <ModeSelector currentMode={currentMode} handleModeChange={handleModeChange} />
        
        <div className="calculator-main">
          <Display 
            display={display} 
            expression={expression} 
            errorMessage={errorMessage}
            handleVoiceInput={handleVoiceInput}
          />
          
          {currentMode === 'standard' && (
            <KeyPad 
              handleNumberClick={handleNumberClick}
              handleOperatorClick={handleOperatorClick}
              handleDecimalClick={handleDecimalClick}
              handleClear={handleClear}
              handleDelete={handleDelete}
              handleCalculate={handleCalculate}
              handlePercentage={handlePercentage}
            />
          )}
          
          {currentMode === 'scientific' && (
            <>
              <ScientificKeyPad 
                handleScientificFunction={handleScientificFunction}
                toggleAngleMode={toggleAngleMode}
                handleBracket={handleBracket}
                isRadianMode={isRadianMode}
                handleOperatorClick={handleOperatorClick}
              />
              <KeyPad 
                handleNumberClick={handleNumberClick}
                handleOperatorClick={handleOperatorClick}
                handleDecimalClick={handleDecimalClick}
                handleClear={handleClear}
                handleDelete={handleDelete}
                handleCalculate={handleCalculate}
                handlePercentage={handlePercentage}
              />
            </>
          )}
          
          {currentMode === 'unit' && (
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
          )}
          
          {currentMode === 'advanced' && (
            <>
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
              
              {showAdvancedKeypad && (
                <AdvancedKeypad handleAdvancedButtonClick={handleAdvancedButtonClick} />
              )}
              
              <button className="toggle-keypad-btn" onClick={toggleAdvancedKeypad}>
                {showAdvancedKeypad ? 'Hide Keypad' : 'Show Keypad'}
              </button>
            </>
          )}
          
          {currentMode === 'help' && (
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
          )}
        </div>
        
        <div className="calculator-sidebar">
          <button className="history-toggle-btn" onClick={toggleHistory}>
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          
          {showHistory && (
            <History 
              history={history}
              handleHistoryItemClick={handleHistoryItemClick}
              clearHistory={clearHistory}
            />
          )}
        </div>
      </div>
      
      <div className="calculator-footer">
        <button 
          className={`voice-input-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleVoiceRecognition}
          title="Voice Input"
        >
          <i className={`fas ${isListening ? 'fa-microphone-alt' : 'fa-microphone'}`}></i>
        </button>
        
        <div className="calculator-info">
          <p>© 2025 Calculator App | Built with Next.js</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
