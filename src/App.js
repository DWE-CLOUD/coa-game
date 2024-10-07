import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Monitor, Wifi, Usb, PlusCircle, Server, Database } from 'lucide-react';

const unitData = [
  {
    name: 'CPU',
    icon: Cpu,
    description: 'The Central Processing Unit (CPU) is the brain of the computer. It performs calculations, executes instructions, and controls other components.',
    funFact: 'Modern CPUs can perform billions of calculations per second!',
  },
  {
    name: 'Memory',
    icon: Server,
    description: 'Memory (RAM) temporarily stores data and instructions for quick access by the CPU. Its volatile, meaning data is lost when power is off.',
    funFact: 'RAM is much faster than storage devices, but also more expensive per gigabyte.',
  },
  {
    name: 'Storage',
    icon: HardDrive,
    description: 'Storage devices (like hard drives or SSDs) permanently store data, programs, and the operating system, even when the power is off.',
    funFact: 'The first hard drive, introduced by IBM in 1956, could store about 3.75 MB of data.',
  },
  {
    name: 'I/O',
    icon: Monitor,
    description: 'Input/Output (I/O) units handle communication between the computer and external devices or the user, such as keyboards, mice, and displays.',
    funFact: 'The first computer mouse was made of wood and had only one button!',
  },
  {
    name: 'Motherboard',
    icon: Database,
    description: 'The motherboard is the main circuit board that connects all the components of a computer system.',
    funFact: 'Motherboards have a small battery to keep the CMOS memory powered and maintain system settings.',
  },
  {
    name: 'Network Interface',
    icon: Wifi,
    description: 'The network interface allows the computer to communicate with other devices on a network or the internet.',
    funFact: 'Wi-Fi stands for "Wireless Fidelity" and can transmit data at speeds over 1 Gbps in modern standards.',
  },
  {
    name: 'USB Controller',
    icon: Usb,
    description: 'The USB controller manages connections with Universal Serial Bus (USB) devices like keyboards, mice, and external drives.',
    funFact: 'USB 4.0 can transfer data at up to 40 Gbps, which is fast enough to transfer a full-length 4K movie in about 30 seconds!',
  },
  {
    name: 'Expansion Slots',
    icon: PlusCircle,
    description: 'Expansion slots allow for additional hardware components to be added to the computer, such as graphics cards or sound cards.',
    funFact: 'Modern PCIe 5.0 x16 slots can transfer data at up to 128 GB/s, which is over 1000 times faster than the original PCI standard!',
  },
];

const levels = [
  { name: 'Novice', requiredScore: 0, color: 'bg-green-500' },
  { name: 'Apprentice', requiredScore: 5, color: 'bg-blue-500' },
  { name: 'Technician', requiredScore: 10, color: 'bg-purple-500' },
  { name: 'Engineer', requiredScore: 15, color: 'bg-yellow-500' },
  { name: 'Master', requiredScore: 20, color: 'bg-red-500' },
];

const achievements = [
  { name: 'First Correct Answer', description: 'You got your first answer right!', requiredScore: 1 },
  { name: 'Perfect Round', description: 'You answered 5 questions correctly in a row!', requiredScore: 5 },
  { name: 'Hardware Expert', description: 'You reached a score of 20!', requiredScore: 20 },
];

const ComputerUnitsGame = () => {
  const [currentUnit, setCurrentUnit] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [streak, setStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'explanation', 'gameOver'
  const [fadeOut, setFadeOut] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    const newLevel = levels.find(level => score >= level.requiredScore);
    if (newLevel && newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel);
      setFeedback(`Congratulations! You've reached the ${newLevel.name} level!`);
    }

    const newAchievements = achievements.filter(
        achievement => score >= achievement.requiredScore && !unlockedAchievements.includes(achievement.name)
    );
    if (newAchievements.length > 0) {
      setUnlockedAchievements([...unlockedAchievements, ...newAchievements.map(a => a.name)]);
      setFeedback(`Achievement unlocked: ${newAchievements[0].name}!`);
    }

    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, currentLevel, unlockedAchievements, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setStreak(0);
    setShowExplanation(false);
    setQuestionNumber(1);
    setGameState('playing');
    nextUnit();
  };

  const nextUnit = () => {
    setFadeOut(true);
    setTimeout(() => {
      const randomUnit = unitData[Math.floor(Math.random() * unitData.length)];
      setCurrentUnit(randomUnit);
      setFeedback('');
      setShowExplanation(false);
      setFadeOut(false);
      setGameState('playing');
    }, 500);
  };

  const handleGuess = (guessedName) => {
    if (guessedName === currentUnit.name) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback(`Correct! ${currentUnit.name} identified.`);
      if (streak + 1 === 5) {
        setFeedback(prevFeedback => `${prevFeedback} You've got a 5 streak bonus! +2 points!`);
        setScore(score + 3);
      }
    } else {
      setFeedback(`Incorrect. This is the ${currentUnit.name}.`);
      setStreak(0);
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }
    setShowExplanation(true);
    setGameState('explanation');
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(questionNumber + 1);
      nextUnit();
    } else {
      setGameOver(true);
      setGameState('gameOver');
    }
  };

  const progressPercentage = (score / levels[levels.length - 1].requiredScore) * 100;

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className={`w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-xl rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 animate-pulse">Computer Functional Units Game</h1>
            <p className="text-center text-gray-600 mb-6">
              Guess the functional unit based on the icon and level up your computer knowledge!
            </p>
            <div className="flex justify-between items-center mb-4">
            <span className={`${currentLevel.color} text-white px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-110`}>
              Level: {currentLevel.name}
            </span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">High Score: {highScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                  className={`${currentLevel.color} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {gameState === 'playing' && currentUnit && (
                <div className="flex flex-col items-center">
                  <div className={`bg-gray-200 p-8 rounded-full mb-6 transition-all duration-300 ease-in-out transform hover:rotate-12 ${shakeWrong ? 'animate-shake' : ''}`}>
                    <currentUnit.icon size={120} className="text-blue-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {unitData.map((unit) => (
                        <button
                            key={unit.name}
                            onClick={() => handleGuess(unit.name)}
                            className="w-full py-3 text-lg bg-blue-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700"
                        >
                          {unit.name}
                        </button>
                    ))}
                  </div>
                </div>
            )}
            {gameState === 'explanation' && (
                <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded transition-all duration-500 ease-in-out">
                  <p className="font-bold">Feedback</p>
                  <p>{feedback}</p>
                  <div className="mt-2">
                    <p>{currentUnit.description}</p>
                    <p className="mt-2 font-semibold">Fun Fact: {currentUnit.funFact}</p>
                  </div>
                  <button
                      onClick={handleNextQuestion}
                      className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Next Question
                  </button>
                </div>
            )}
            {gameState === 'start' && (
                <button
                    onClick={startGame}
                    className="w-full py-4 text-xl bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 active:bg-green-700"
                >
                  Start Game
                </button>
            )}
            {gameState === 'gameOver' && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                  <p className="text-xl mb-2">Your Final Score: {score}</p>
                  <p className="text-lg mb-4">Highest Level Reached: {currentLevel.name}</p>
                  <button
                      onClick={startGame}
                      className="w-full py-4 text-xl bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 active:bg-green-700"
                  >
                    Play Again
                  </button>
                </div>
            )}
          </div>
          <div className="bg-gray-100 p-6">
            <p className="text-2xl font-semibold mb-2 text-gray-800 text-center">Score: {score}</p>
            <p className="text-xl font-semibold mb-2 text-gray-600 text-center">Question: {questionNumber} / {totalQuestions}</p>
            {unlockedAchievements.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Achievements:</h3>
                  <div className="flex flex-wrap gap-2">
                    {unlockedAchievements.map((achievement) => (
                        <span key={achievement} className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded transition-all duration-300 ease-in-out transform hover:scale-110">
                    {achievement}
                  </span>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ComputerUnitsGame;