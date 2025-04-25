'use client';

interface IntegrationLimits {
  lower: string;
  upper: string;
}

interface AdvancedCalculatorProps {
  currentAdvancedTab: string;
  handleAdvancedTabChange: (tab: string) => void;
  equationInput: string;
  handleEquationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  matrixA: string;
  handleMatrixAChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  matrixB: string;
  handleMatrixBChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  polynomialCoeffs: string;
  handlePolynomialCoeffsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  polynomialVariable: string;
  handlePolynomialVariableChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  functionInput: string;
  handleFunctionInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  integrationLimits: IntegrationLimits;
  handleIntegrationLowerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIntegrationUpperChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  derivativePoint: string;
  handleDerivativePointChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  calculateAdvanced: () => void;
}

const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({
  currentAdvancedTab,
  handleAdvancedTabChange,
  equationInput,
  handleEquationChange,
  matrixA,
  handleMatrixAChange,
  matrixB,
  handleMatrixBChange,
  polynomialCoeffs,
  handlePolynomialCoeffsChange,
  polynomialVariable,
  handlePolynomialVariableChange,
  functionInput,
  handleFunctionInputChange,
  integrationLimits,
  handleIntegrationLowerChange,
  handleIntegrationUpperChange,
  derivativePoint,
  handleDerivativePointChange,
  calculateAdvanced
}) => {
  return (
    <div className="advanced-keys">
      <div className="advanced-tabs">
        <button
          className={`advanced-tab-btn ${currentAdvancedTab === 'equation' ? 'active' : ''}`}
          data-tab="equation"
          onClick={() => handleAdvancedTabChange('equation')}
        >
          <i className="fas fa-equals"></i>
          <span className="tab-text">Equation</span>
        </button>
        <button
          className={`advanced-tab-btn ${currentAdvancedTab === 'matrix' ? 'active' : ''}`}
          data-tab="matrix"
          onClick={() => handleAdvancedTabChange('matrix')}
        >
          <i className="fas fa-th"></i>
          <span className="tab-text">Matrix</span>
        </button>
        <button
          className={`advanced-tab-btn ${currentAdvancedTab === 'polynomial' ? 'active' : ''}`}
          data-tab="polynomial"
          onClick={() => handleAdvancedTabChange('polynomial')}
        >
          <i className="fas fa-superscript"></i>
          <span className="tab-text">Poly</span>
        </button>
        <button
          className={`advanced-tab-btn ${currentAdvancedTab === 'integral' ? 'active' : ''}`}
          data-tab="integral"
          onClick={() => handleAdvancedTabChange('integral')}
        >
          <i className="fas fa-calculator"></i>
          <span className="tab-text">Integral</span>
        </button>
        <button
          className={`advanced-tab-btn ${currentAdvancedTab === 'derivative' ? 'active' : ''}`}
          data-tab="derivative"
          onClick={() => handleAdvancedTabChange('derivative')}
        >
          <i className="fas fa-chart-line"></i>
          <span className="tab-text">Deriv</span>
        </button>
      </div>

      {/* Equation Tab Content */}
      {currentAdvancedTab === 'equation' && (
        <div className="advanced-tab-content active" id="equation-tab">
          <div className="equation-input">
            <input
              type="text"
              placeholder="Enter equation (e.g., '2*x + 3 = 10')"
              value={equationInput}
              onChange={handleEquationChange}
            />
          </div>
        </div>
      )}

      {/* Matrix Tab Content */}
      {currentAdvancedTab === 'matrix' && (
        <div className="advanced-tab-content active" id="matrix-tab">
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
      )}

      {/* Polynomial Tab Content */}
      {currentAdvancedTab === 'polynomial' && (
        <div className="advanced-tab-content active" id="polynomial-tab">
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
      )}

      {/* Integral Tab Content */}
      {currentAdvancedTab === 'integral' && (
        <div className="advanced-tab-content active" id="integral-tab">
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
      )}

      {/* Derivative Tab Content */}
      {currentAdvancedTab === 'derivative' && (
        <div className="advanced-tab-content active" id="derivative-tab">
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
      )}

      <button className="advanced-calc-btn" onClick={calculateAdvanced}>
        <i className="fas fa-calculator"></i> Calculate
      </button>
    </div>
  );
};

export default AdvancedCalculator;
