interface IndonesianNumbers {
  [key: string]: number;
}

interface OperationPattern {
  words: string[];
  symbol: string;
}

interface VoiceParseResult {
  type: 'command' | 'mode' | 'expression' | 'operation' | 'number' | 'unknown';
  command?: string;
  mode?: string;
  expression?: string;
  operation?: string;
  value?: string;
  valid?: boolean;
}

interface ParsedExpression {
  expression: string;
  valid: boolean;
}

/**
 * Indonesian number words to digits mapping
 */
export const indonesianNumbers: IndonesianNumbers = {
  'nol': 0, 'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4,
  'lima': 5, 'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9,
  'sepuluh': 10, 'sebelas': 11, 'duabelas': 12, 'dua belas': 12, 'tigabelas': 13, 'tiga belas': 13,
  'empatbelas': 14, 'empat belas': 14, 'limabelas': 15, 'lima belas': 15, 
  'enambelas': 16, 'enam belas': 16, 'tujuhbelas': 17, 'tujuh belas': 17,
  'delapanbelas': 18, 'delapan belas': 18, 'sembilanbelas': 19, 'sembilan belas': 19, 
  'duapuluh': 20, 'dua puluh': 20, 'tigapuluh': 30, 'tiga puluh': 30, 
  'empatpuluh': 40, 'empat puluh': 40, 'limapuluh': 50, 'lima puluh': 50,
  'enampuluh': 60, 'enam puluh': 60, 'tujuhpuluh': 70, 'tujuh puluh': 70, 
  'delapanpuluh': 80, 'delapan puluh': 80, 'sembilanpuluh': 90, 'sembilan puluh': 90,
  'seratus': 100, 'seribu': 1000
};

/**
 * Operation patterns for voice recognition
 */
export const operationPatterns: OperationPattern[] = [
  { words: ['tambah', 'plus', 'ditambah'], symbol: '+' },
  { words: ['kurang', 'minus', 'dikurang'], symbol: '-' },
  { words: ['kali', 'dikali', 'times'], symbol: '*' },
  { words: ['bagi', 'dibagi', 'divide'], symbol: '/' },
  { words: ['pangkat', 'dipangkatkan', 'power', 'kuadrat'], symbol: '^' },
  { words: ['akar', 'akar kuadrat', 'square root'], symbol: 'sqrt' },
  { words: ['sinus', 'sin'], symbol: 'sin' },
  { words: ['cosinus', 'cos'], symbol: 'cos' },
  { words: ['tangen', 'tan'], symbol: 'tan' },
  { words: ['logaritma', 'log'], symbol: 'log' },
  { words: ['kurung buka', 'open bracket', 'buka kurung'], symbol: '(' },
  { words: ['kurung tutup', 'close bracket', 'tutup kurung'], symbol: ')' },
  { words: ['pi', 'phi'], symbol: 'pi' },
  { words: ['variabel x', 'x'], symbol: 'x' },
];

/**
 * Parses a voice transcript into a mathematical expression
 * @param {string} transcript - The voice transcript to parse
 * @returns {object} An object containing the parsed expression and whether it's valid
 */
export const parseVoiceTranscript = (transcript: string): VoiceParseResult => {
  const lowerTranscript = transcript.toLowerCase();
  
  // Check for clear/reset commands
  if (lowerTranscript.includes('hapus') || lowerTranscript.includes('clear') || 
      lowerTranscript.includes('bersihkan') || lowerTranscript.includes('reset')) {
    return { type: 'command', command: 'clear' };
  }
  
  // Check for mode commands
  if (lowerTranscript.includes('mode standar') || lowerTranscript.includes('standar')) {
    return { type: 'mode', mode: 'standard' };
  } else if (lowerTranscript.includes('mode scientific') || lowerTranscript.includes('scientific')) {
    return { type: 'mode', mode: 'scientific' };
  } else if (lowerTranscript.includes('mode unit') || lowerTranscript.includes('unit')) {
    return { type: 'mode', mode: 'unit' };
  } else if (lowerTranscript.includes('mode advanced') || lowerTranscript.includes('advanced')) {
    return { type: 'mode', mode: 'advanced' };
  } else if (lowerTranscript.includes('mode help') || lowerTranscript.includes('bantuan')) {
    return { type: 'mode', mode: 'help' };
  }
  
  // Check for equals command
  const hasEquals = lowerTranscript.includes('sama dengan') || lowerTranscript.includes('samadengan') || 
                    lowerTranscript.includes('hasil') || lowerTranscript.includes('hitung') || 
                    lowerTranscript.includes('equals') || lowerTranscript.includes('equal');
  
  // Check for operations
  const hasOperation = operationPatterns.some(op => op.words.some(word => lowerTranscript.includes(word)));
  
  // If it's a complete expression with operation and equals
  if (hasOperation && hasEquals) {
    try {
      const parsedExpression = parseCompleteExpression(lowerTranscript);
      return { 
        type: 'expression', 
        expression: parsedExpression.expression,
        valid: parsedExpression.valid
      };
    } catch (error) {
      console.error('Error parsing complete expression:', error);
    }
  }
  
  // Check for individual operations
  for (const op of operationPatterns) {
    if (op.words.some(word => lowerTranscript.includes(word))) {
      return { type: 'operation', operation: op.symbol };
    }
  }
  
  // Check for equals only
  if (hasEquals) {
    return { type: 'command', command: 'calculate' };
  }
  
  // Check for individual numbers
  for (const [word, value] of Object.entries(indonesianNumbers)) {
    if (lowerTranscript.includes(word)) {
      return { type: 'number', value: value.toString() };
    }
  }
  
  // Try to extract direct numbers
  const numberMatch = transcript.match(/\d+(\.\d+)?/g);
  if (numberMatch) {
    return { type: 'number', value: numberMatch[0] };
  }
  
  // If nothing matched
  return { type: 'unknown' };
};

/**
 * Parses a complete expression from a voice transcript
 * @param {string} transcript - The voice transcript to parse
 * @returns {object} An object containing the parsed expression and whether it's valid
 */
const parseCompleteExpression = (transcript: string): ParsedExpression => {
  const lowerTranscript = transcript.toLowerCase();
  let mathExpression = '';
  let currentNumber = '';
  let foundOperation = false;
  
  // Split the transcript into words
  const words = lowerTranscript.split(/\s+/);
  
  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Check if it's a number word
    if (indonesianNumbers[word] !== undefined) {
      // It's a number word
      if (currentNumber === '') {
        currentNumber = indonesianNumbers[word].toString();
      } else {
        // Handle compound numbers like "dua puluh satu"
        if (word === 'puluh') {
          // Skip, already handled with the previous number
        } else if (word === 'belas') {
          // Skip, already handled with the previous number
        } else if (word === 'ratus' || word === 'seratus') {
          currentNumber = (parseInt(currentNumber) * 100).toString();
        } else if (word === 'ribu' || word === 'seribu') {
          currentNumber = (parseInt(currentNumber) * 1000).toString();
        } else {
          // For compound numbers like "dua puluh satu"
          if (words[i-1] === 'puluh') {
            currentNumber = (parseInt(currentNumber) + indonesianNumbers[word]).toString();
          } else {
            // If we encounter a new number, add the previous one to the expression
            if (currentNumber !== '') {
              mathExpression += currentNumber;
              currentNumber = indonesianNumbers[word].toString();
            }
          }
        }
      }
    } 
    // Check if it's a compound number like "dua puluh"
    else if (word === 'puluh' && i > 0 && indonesianNumbers[words[i-1]] !== undefined) {
      currentNumber = (indonesianNumbers[words[i-1]] * 10).toString();
    }
    // Check if it's an operation
    else {
      // First add any pending number to the expression
      if (currentNumber !== '') {
        mathExpression += currentNumber;
        currentNumber = '';
      }
      
      // Check for operations
      for (const op of operationPatterns) {
        if (op.words.includes(word)) {
          // Handle special functions like sqrt, sin, cos, etc.
          if (op.symbol === 'sqrt') {
            mathExpression += 'sqrt(';
            foundOperation = true;
            break;
          } else if (op.symbol === 'sin' || op.symbol === 'cos' || op.symbol === 'tan' || op.symbol === 'log') {
            mathExpression += op.symbol + '(';
            foundOperation = true;
            break;
          } else if (op.symbol === 'pi') {
            mathExpression += 'pi';
            foundOperation = true;
            break;
          } else {
            mathExpression += op.symbol;
            foundOperation = true;
            break;
          }
        }
      }
    }
    
    // Check for direct numbers (digits)
    const digitMatch = word.match(/\d+/);
    if (digitMatch) {
      if (currentNumber === '') {
        currentNumber = digitMatch[0];
      } else {
        // If we encounter a new number, add the previous one to the expression
        mathExpression += currentNumber;
        currentNumber = digitMatch[0];
      }
    }
  }
  
  // Add any remaining number to the expression
  if (currentNumber !== '') {
    mathExpression += currentNumber;
  }
  
  // Check if the expression is valid
  const valid = foundOperation && mathExpression.length > 0;
  
  return { expression: mathExpression, valid };
};
