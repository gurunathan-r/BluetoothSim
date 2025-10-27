import React, { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, Shield } from 'lucide-react';
import './EthicsQuiz.css';

interface EthicsQuizProps {
  onPassed: () => void;
  onFailed: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const EthicsQuiz: React.FC<EthicsQuizProps> = ({ onPassed, onFailed }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary purpose of this Bluetooth simulation tool?",
      options: [
        "To attack real Bluetooth devices",
        "To learn about Bluetooth security concepts safely",
        "To hack into corporate networks",
        "To steal personal data from phones"
      ],
      correctAnswer: 1,
      explanation: "This tool is designed exclusively for educational purposes to help users understand Bluetooth security concepts in a safe, simulated environment."
    },
    {
      id: 2,
      question: "Can the simulated commands in this tool affect real Bluetooth devices?",
      options: [
        "Yes, they can modify real hardware",
        "No, they are purely visual demonstrations",
        "Only if you have special permissions",
        "Depends on your device settings"
      ],
      correctAnswer: 1,
      explanation: "All commands are completely simulated and have no real-world effects. No actual Bluetooth hardware is accessed or modified."
    },
    {
      id: 3,
      question: "What should you do if you discover a real Bluetooth vulnerability?",
      options: [
        "Exploit it immediately for personal gain",
        "Report it responsibly through proper channels",
        "Share it publicly on social media",
        "Ignore it and move on"
      ],
      correctAnswer: 1,
      explanation: "Responsible disclosure through proper channels (like vendor security teams or bug bounty programs) is the ethical approach to handling security vulnerabilities."
    },
    {
      id: 4,
      question: "Is it ethical to use this simulation tool to prepare for unauthorized access to real devices?",
      options: [
        "Yes, if you're learning cybersecurity",
        "No, this tool should only be used for legitimate educational purposes",
        "It depends on your intentions",
        "Only if you're a security researcher"
      ],
      correctAnswer: 1,
      explanation: "This tool should only be used for legitimate educational and training purposes. Using it to prepare for unauthorized access to real devices is unethical."
    },
    {
      id: 5,
      question: "What is the most important principle when learning about cybersecurity vulnerabilities?",
      options: [
        "Learning how to exploit them quickly",
        "Understanding them to better defend against them",
        "Keeping knowledge secret from others",
        "Using knowledge for personal advantage"
      ],
      correctAnswer: 1,
      explanation: "The primary goal of learning about vulnerabilities should be to understand how to defend against them and improve overall security."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const isPassingScore = score >= Math.ceil(questions.length * 0.8); // 80% required to pass

  if (showResults) {
    return (
      <div className="ethics-quiz">
        <div className="quiz-content">
          <div className="quiz-header">
            <h1>Ethics Quiz Results</h1>
          </div>

          <div className="results-section">
            <div className={`score-display ${isPassingScore ? 'pass' : 'fail'}`}>
              <div className="score-icon">
                {isPassingScore ? <CheckCircle size={64} /> : <XCircle size={64} />}
              </div>
              <div className="score-text">
                <h2>{isPassingScore ? 'Congratulations!' : 'Please Review'}</h2>
                <p className="score-number">
                  {score} / {questions.length} Correct
                </p>
                <p className="score-percentage">
                  {Math.round((score / questions.length) * 100)}%
                </p>
              </div>
            </div>

            <div className="detailed-results">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-header">
                      <span className="question-number">Question {index + 1}</span>
                      <span className={`result-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      </span>
                    </div>
                    <p className="question-text">{question.question}</p>
                    <div className="answer-details">
                      <p className="user-answer">
                        <strong>Your answer:</strong> {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="correct-answer">
                          <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="explanation">{question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="quiz-actions">
              {isPassingScore ? (
                <button 
                  className="continue-button"
                  onClick={onPassed}
                >
                  Continue to Advanced Features
                </button>
              ) : (
                <button 
                  className="retake-button"
                  onClick={handleRetakeQuiz}
                >
                  Retake Quiz
                </button>
              )}
              <button 
                className="back-button"
                onClick={onFailed}
              >
                Return to Basic Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className="ethics-quiz">
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="header-icons">
            <BookOpen size={32} />
            <Shield size={32} />
          </div>
          <h1>Ethics & Safety Quiz</h1>
          <p className="quiz-description">
            Complete this quiz to access advanced simulation features. 
            You must score 80% or higher to pass.
          </p>
        </div>

        <div className="quiz-body">
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="question-section">
            <h2 className="question-title">{currentQ.question}</h2>
            
            <div className="options-container">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index}
                  className={`option-label ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button 
              className="nav-button prev-button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={handleNextQuestion}
              disabled={!hasAnswered}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicsQuiz;
