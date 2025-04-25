import * as math from 'mathjs';

/**
 * Evaluates a mathematical expression
 * @param {string} expression - The expression to evaluate
 * @returns {number} The result of the evaluation
 */
export const evaluateExpression = (expression) => {
  try {
    // Clean up the expression to ensure it's valid
    const cleanExpression = expression.replace(/[^0-9+\-*/().^xπe√∛sincostalogexpabspi]/g, '');
    return math.evaluate(cleanExpression);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    throw new Error('Invalid expression');
  }
};

/**
 * Performs a scientific calculation based on the function and value
 * @param {string} func - The function to apply (sin, cos, tan, etc.)
 * @param {number} value - The value to apply the function to
 * @param {boolean} isRadianMode - Whether to use radian mode for trigonometric functions
 * @returns {number} The result of the calculation
 */
export const calculateScientificFunction = (func, value, isRadianMode = true) => {
  try {
    let result;

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
      case 'cbrt':
        result = math.cbrt(value);
        break;
      case 'log10':
        result = math.log10(value);
        break;
      case 'log':
        result = math.log(value);
        break;
      case 'factorial':
        result = math.factorial(value);
        break;
      case 'abs':
        result = math.abs(value);
        break;
      case 'exp':
        result = math.exp(value);
        break;
      case 'pi':
        result = math.pi;
        break;
      case 'e':
        result = math.e;
        break;
      default:
        result = value;
    }

    // Format the result to avoid floating point issues
    return Math.round(result * 1000000) / 1000000;
  } catch (error) {
    console.error('Error calculating scientific function:', error);
    throw new Error(`Error calculating ${func}`);
  }
};

/**
 * Formats a number for display
 * @param {number} number - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (number) => {
  // Handle special cases
  if (number === Infinity || number === -Infinity) {
    return number === Infinity ? '∞' : '-∞';
  }
  
  if (isNaN(number)) {
    return 'Error';
  }
  
  // Format the number
  const formatted = Math.round(number * 1000000) / 1000000;
  return formatted.toString();
};

/**
 * Checks if a string is a valid mathematical expression
 * @param {string} expression - The expression to check
 * @returns {boolean} Whether the expression is valid
 */
export const isValidExpression = (expression) => {
  try {
    // Try to evaluate the expression
    math.evaluate(expression);
    return true;
  } catch (error) {
    return false;
  }
};
