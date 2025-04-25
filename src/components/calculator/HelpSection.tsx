'use client';

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

interface HelpSectionProps {
  currentHelpTab: string;
  handleHelpTabChange: (tab: string) => void;
  examples: Example[];
  scientificExamples: Example[];
  handleExampleClick: (value: string) => void;
  quizQuestions: QuizQuestion[];
  currentQuizIndex: number;
  quizSelectedOption: number | null;
  showQuizSolution: boolean;
  handleQuizOptionSelect: (index: number) => void;
  prevQuizQuestion: () => void;
  nextQuizQuestion: () => void;
  startQuiz: () => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({
  currentHelpTab,
  handleHelpTabChange,
  examples,
  scientificExamples,
  handleExampleClick,
  quizQuestions,
  currentQuizIndex,
  quizSelectedOption,
  showQuizSolution,
  handleQuizOptionSelect,
  prevQuizQuestion,
  nextQuizQuestion,
  startQuiz
}) => {
  return (
    <div className="help-keys">
      <div className="help-tabs">
        <button
          className={`help-tab-btn ${currentHelpTab === 'examples' ? 'active' : ''}`}
          onClick={() => handleHelpTabChange('examples')}
        >
          <i className="fas fa-list"></i> Examples
        </button>
        <button
          className={`help-tab-btn ${currentHelpTab === 'quiz' ? 'active' : ''}`}
          onClick={() => startQuiz()}
        >
          <i className="fas fa-question-circle"></i> Quiz
        </button>
      </div>

      {currentHelpTab === 'examples' && (
        <div className="help-tab-content active" id="examples-tab">
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

          <div className="examples-section">
            <h4>Voice Input</h4>
            <p>Tekan tombol mikrofon di sebelah kanan display untuk menggunakan input suara. Anda dapat mengucapkan:</p>
            <ul className="voice-commands-list">
              <li><strong>Angka:</strong> "lima", "sepuluh", "dua puluh tiga"</li>
              <li><strong>Operasi:</strong> "tambah", "kurang", "kali", "bagi", "sama dengan"</li>
              <li><strong>Mode:</strong> "mode standar", "mode scientific", "mode unit", "mode advanced"</li>
              <li><strong>Perintah lain:</strong> "hapus", "bersihkan"</li>
            </ul>
            <div className="voice-permission-note">
              <p><strong>Catatan:</strong> Browser Anda akan meminta izin untuk mengakses mikrofon saat pertama kali menggunakan fitur ini. Jika Anda menolak izin, Anda perlu mengizinkannya di pengaturan browser:</p>
              <ol>
                <li>Klik ikon kunci/info di address bar browser</li>
                <li>Cari pengaturan mikrofon</li>
                <li>Ubah izin menjadi "Allow"</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {currentHelpTab === 'quiz' && (
        <div className="help-tab-content active" id="quiz-tab">
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

            {showQuizSolution && (
              <div className="quiz-explanation active">
                {quizQuestions[currentQuizIndex]?.explanation}
              </div>
            )}

            <div className="quiz-navigation">
              <button
                className="quiz-nav-btn"
                onClick={prevQuizQuestion}
                disabled={currentQuizIndex === 0}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>

              <span id="quiz-progress">
                {currentQuizIndex + 1} / {quizQuestions.length}
              </span>

              <button
                className="quiz-nav-btn"
                onClick={nextQuizQuestion}
                disabled={currentQuizIndex === quizQuestions.length - 1}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSection;
