import React, { useState, useEffect } from 'react';
import './App.css';

const themes = {
  fruits: ["apple", "banana", "cherry", "date", "fig", "grape", "orange", "pear", "melon", "berry", "kiwi", "peach"],
  cars: ["sedan", "coupe", "convertible", "hatchback", "SUV", "truck", "van", "minivan", "jeep", "wagon", "roadster", "limousine"],
  animals: ["lion", "tiger", "bear", "elephant", "giraffe", "zebra", "kangaroo", "panda", "wolf", "fox", "rabbit", "deer"],
  countries: ["Canada", "Brazil", "France", "Germany", "Australia", "Japan", "India", "China", "Russia", "Italy", "Mexico", "Spain"],
  sports: ["soccer", "basketball", "baseball", "tennis", "cricket", "hockey", "golf", "boxing", "rugby", "swimming", "cycling", "skiing"],
  movies: ["Inception", "Titanic", "Avatar", "Gladiator", "Joker", "Interstellar", "Frozen", "Coco", "Up", "Braveheart", "Rocky", "Matrix"],
  books: ["1984", "MobyDick", "Hamlet", "PrideAndPrejudice", "Ulysses", "Frankenstein", "Dracula", "JaneEyre", "Macbeth", "Odyssey", "Inferno", "DonQuixote"],
  colors: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray", "cyan"],
  cities: ["NewYork", "LosAngeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "SanAntonio", "SanDiego", "Dallas", "SanJose", "Austin", "Jacksonville"],
  music: ["Rock", "Pop", "Jazz", "Classical", "HipHop", "Country", "Blues", "Reggae", "Metal", "Folk", "Disco", "Opera"],
  vegetables: ["carrot", "broccoli", "cauliflower", "spinach", "potato", "tomato", "onion", "lettuce", "pepper", "cucumber", "zucchini", "garlic"],
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Haumea", "Makemake"],
  instruments: ["guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "cello", "clarinet", "trombone", "harp", "tuba"],
  elements: ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium"],
  flowers: ["rose", "tulip", "daisy", "sunflower", "orchid", "lily", "daffodil", "jasmine", "violet", "lavender", "peony", "chrysanthemum"],
  desserts: ["cake", "icecream", "brownie", "pudding", "pie", "cookie", "donut", "muffin", "tart", "cheesecake", "eclair", "cupcake"],
  tools: ["hammer", "wrench", "screwdriver", "pliers", "drill", "saw", "chisel", "file", "level", "tape", "measure", "clamp"],
  furniture: ["chair", "table", "sofa", "bed", "dresser", "cabinet", "desk", "shelf", "stool", "bench", "wardrobe", "armchair"],
  beverages: ["coffee", "tea", "milk", "juice", "soda", "water", "wine", "beer", "smoothie", "lemonade", "cocktail", "champagne"]
};

function assignRoles(players) {
  const numMoles = Math.floor(Math.random() * 4);
  const roles = Array(numMoles).fill("mole").concat(Array(players.length - numMoles).fill("word_knower"));
  return roles.sort(() => Math.random() - 0.5).reduce((acc, role, index) => {
    acc[players[index]] = role;
    return acc;
  }, {});
}

function createBoard(themeWords) {
  const shuffledWords = themeWords.sort(() => Math.random() - 0.5);
  return Array.from({ length: 4 }, (_, rowIndex) => shuffledWords.slice(rowIndex * 4, (rowIndex + 1) * 4));
}

function App() {
  const [numPlayers, setNumPlayers] = useState(localStorage.getItem('numPlayers') || 3);
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({});
  const [theme, setTheme] = useState("");
  const [themeWords, setThemeWords] = useState([]);
  const [board, setBoard] = useState([]);
  const [word, setWord] = useState("");
  const [scores, setScores] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [showRevealScreen, setShowRevealScreen] = useState(false);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const initialPlayers = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);
      setPlayers(initialPlayers);
      setRoles(assignRoles(initialPlayers));
      const [randomTheme, words] = Object.entries(themes)[Math.floor(Math.random() * Object.entries(themes).length)];
      setTheme(randomTheme);
      setThemeWords(words);
      setWord(words[Math.floor(Math.random() * words.length)]);
      setBoard(createBoard(words));
      setScores(initialPlayers.reduce((acc, player) => {
        acc[player] = 0;
        return acc;
      }, {}));
    }
  }, [numPlayers, gameStarted]);

  const handleNextTurn = () => {
    if (!readyToProceed) {
      setReadyToProceed(true);
    } else {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
      setReadyToProceed(false);
      if (currentPlayerIndex + 1 >= players.length) {
        setShowBoard(true);
      }
    }
  };

  const handleReveal = () => {
    setShowBoard(false);
    setShowRevealScreen(true);
  };

  const handleAddPoints = () => {
    setShowRevealScreen(false);
    setShowAddPoints(true);
  };

  const handleSkipPoints = () => {
    setShowAddPoints(false);
    resetGame();
  };

  const handleAddPoint = (player) => {
    setScores((prevScores) => ({
      ...prevScores,
      [player]: prevScores[player] + 1
    }));
  };

  const handleDeductPoint = (player) => {
    setScores((prevScores) => ({
      ...prevScores,
      [player]: Math.max(prevScores[player] - 1, 0)
    }));
  };

  const resetGame = () => {
    const [randomTheme, words] = Object.entries(themes)[Math.floor(Math.random() * Object.entries(themes).length)];
    setTheme(randomTheme);
    setThemeWords(words);
    setWord(words[Math.floor(Math.random() * words.length)]);
    setBoard(createBoard(words));
    setRoles(assignRoles(players));
    setCurrentPlayerIndex(0);
    setShowBoard(false);
    setReadyToProceed(false);
    setShowRevealScreen(false);
    setShowAddPoints(false);
  };

  const handlePlayerCountChange = (event) => {
    setNumPlayers(event.target.value);
  };

  const handleStartGame = () => {
    localStorage.setItem('numPlayers', numPlayers);
    setGameStarted(true);
  };

  const handleResetPlayers = () => {
    localStorage.removeItem('numPlayers');
    setNumPlayers(3);
    setPlayers([]);
    setRoles({});
    setTheme("");
    setThemeWords([]);
    setBoard([]);
    setWord("");
    setScores({});
    setCurrentPlayerIndex(0);
    setShowBoard(false);
    setReadyToProceed(false);
    setShowRevealScreen(false);
    setShowAddPoints(false);
    setGameStarted(false);
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>Holey Moley</h1>
          <div className="player-slider">
            <label>
              Number of Players: {numPlayers}
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={numPlayers} 
                onChange={handlePlayerCountChange} 
              />
            </label>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      ) : (
        <>
          {showAddPoints ? (
            <div>
              <h1>Scores</h1>
              {Object.entries(scores).map(([player, score]) => (
                <div key={player}>
                  {player}: {score}
                  <button onClick={() => handleAddPoint(player)}>Add Point</button>
                  <button onClick={() => handleDeductPoint(player)}>Deduct Point</button>
                </div>
              ))}
              <button onClick={handleSkipPoints}>Skip</button>
              <button onClick={resetGame}>Next</button>
              <button
                onClick={handleResetPlayers}
                style={{ position: 'absolute', bottom: '10px', right: '10px' }}
              >
                Reset Players and Game
              </button>
            </div>
          ) : showRevealScreen ? (
            <div>
              <h1>The word was: {word}</h1>
              {Object.entries(roles).map(([player, role]) => (
                <div key={player}>
                  {player} was a {role}
                </div>
              ))}
              <button onClick={handleAddPoints}>Next</button>
            </div>
          ) : (
            <div>
              {showBoard ? (
                <div>
                  <h1>Game Board for the theme '{theme}':</h1>
                  <div className="board">
                    {board.map((row, rowIndex) => (
                      <div className="board-row" key={rowIndex}>
                        {row.map((word, wordIndex) => (
                          <div className="board-cell" key={wordIndex}>
                            {word}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <button onClick={handleReveal}>Next</button>
                </div>
              ) : (
                <div>
                  <h1>{players[currentPlayerIndex]}, are you ready for your turn?</h1>
                  {readyToProceed && (
                    <h2>{roles[players[currentPlayerIndex]] === 'mole' ? 'You are the mole.' : `The word is '${word}'.`}</h2>
                  )}
                  <button onClick={handleNextTurn}>Next</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
