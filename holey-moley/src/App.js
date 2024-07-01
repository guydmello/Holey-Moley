import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('', { path: '/api/socket' }); // Connect to the serverless function

const themes = {
  fruits: ["apple", "banana", "cherry", "date", "fig", "grape", "orange", "pear", "melon", "berry", "kiwi", "peach"],
  cars: ["sedan", "coupe", "convertible", "hatchback", "SUV", "truck", "van", "minivan", "jeep", "wagon", "roadster", "limousine"],
  animals: ["lion", "tiger", "bear", "elephant", "giraffe", "zebra", "kangaroo", "panda", "wolf", "fox", "rabbit", "deer"],
  countries: ["Canada", "Brazil", "France", "Germany", "Australia", "Japan", "India", "China", "Russia", "Italy", "Mexico", "Spain"],
  sports: ["soccer", "basketball", "baseball", "tennis", "cricket", "hockey", "golf", "boxing", "rugby", "swimming", "cycling", "skiing"],
  movies: ["Inception", "Titanic", "Avatar", "Gladiator", "Joker", "Interstellar", "Frozen", "Coco", "Up", "Braveheart", "Rocky", "Matrix"],
  colors: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray", "cyan"],
  cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"],
  music: ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Country", "Blues", "Reggae", "Metal", "Folk", "Disco", "Opera"],
  vegetables: ["carrot", "broccoli", "cauliflower", "spinach", "potato", "tomato", "onion", "lettuce", "pepper", "cucumber", "zucchini", "garlic"],
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Eris", "Haumea", "Makemake"],
  instruments: ["guitar", "piano", "violin", "drum", "flute", "trumpet", "saxophone", "cello", "clarinet", "trombone", "harp", "tuba"],
  elements: ["hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium"],
  flowers: ["rose", "tulip", "daisy", "sunflower", "orchid", "lily", "daffodil", "jasmine", "violet", "lavender", "peony", "chrysanthemum"],
  desserts: ["cake", "ice cream", "brownie", "pudding", "pie", "cookie", "donut", "muffin", "tart", "cheesecake", "eclair", "cupcake"],
  tools: ["hammer", "wrench", "screwdriver", "pliers", "drill", "saw", "chisel", "file", "level", "tape measure", "clamp"],
  furniture: ["chair", "table", "sofa", "bed", "dresser", "cabinet", "desk", "shelf", "stool", "bench", "wardrobe", "armchair"],
  beverages: ["coffee", "tea", "milk", "juice", "soda", "water", "wine", "beer", "smoothie", "lemonade", "cocktail", "champagne"],
  occupations: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  weather: ["rain", "snow", "sunny", "cloudy", "storm", "windy", "foggy", "hail", "thunder", "lightning", "tornado", "blizzard"],
  shapes: ["circle", "square", "triangle", "rectangle", "hexagon", "octagon", "oval", "star", "diamond", "pentagon", "heart", "crescent"],
  birds: ["sparrow", "eagle", "parrot", "pigeon", "owl", "flamingo", "peacock", "crow", "swan", "hawk", "penguin", "robin"],
  insects: ["butterfly", "ant", "bee", "beetle", "dragonfly", "mosquito", "spider", "ladybug", "grasshopper", "fly", "wasp", "caterpillar"],
  jewelry: ["necklace", "ring", "bracelet", "earring", "watch", "pendant", "brooch", "bangle", "anklet", "choker", "cufflink", "tiara"],
  trees: ["oak", "pine", "maple", "willow", "birch", "cedar", "spruce", "cherry", "apple", "walnut", "palm", "baobab"],
  historicalFigures: ["Einstein", "Cleopatra", "Gandhi", "Lincoln", "Napoleon", "Da Vinci", "Aristotle", "Shakespeare", "Newton", "Curie", "Columbus", "Mozart"],
  continents: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"],
  gemstones: ["diamond", "ruby", "sapphire", "emerald", "amethyst", "opal", "topaz", "turquoise", "garnet", "jade", "pearl", "aquamarine"],
  superheroes: ["Superman", "Batman", "Spiderman", "Ironman", "Wonder Woman", "Hulk", "Thor", "Captain America", "Flash", "Green Lantern", "Aquaman", "Black Panther"],
  mythicalCreatures: ["dragon", "unicorn", "phoenix", "griffin", "centaur", "mermaid", "vampire", "werewolf", "cyclops", "minotaur", "troll", "fairy"],
  hobbies: ["reading", "painting", "hiking", "knitting", "gardening", "fishing", "cooking", "cycling", "photography", "writing", "dancing", "drawing"],
  fairyTales: ["Cinderella", "Snow White", "Sleeping Beauty", "Little Red Riding Hood", "Hansel and Gretel", "Jack and the Beanstalk", "Beauty and the Beast", "Rapunzel", "The Little Mermaid", "Aladdin", "Pinocchio", "Peter Pan"],
  professions: ["doctor", "teacher", "engineer", "nurse", "artist", "chef", "pilot", "lawyer", "plumber", "firefighter", "police", "scientist"],
  kitchenAppliances: ["oven", "microwave", "blender", "toaster", "refrigerator", "dishwasher", "mixer", "grill", "freezer", "coffee maker", "stove", "kettle"],
  boardGames: ["Monopoly", "Chess", "Checkers", "Scrabble", "Clue", "Risk", "Catan", "Candy Land", "Sorry", "Life", "Battleship", "Jenga"],
  modesOfTransport: ["bicycle", "car", "bus", "train", "airplane", "boat", "scooter", "motorcycle", "tram", "subway", "helicopter", "ferry"],
  mythicalGods: ["Zeus", "Hera", "Odin", "Thor", "Poseidon", "Athena", "Ares", "Apollo", "Hades", "Loki", "Hermes", "Dionysus"],
  danceStyles: ["ballet", "jazz", "tap", "hip hop", "salsa", "tango", "waltz", "breakdance", "flamenco", "swing", "contemporary", "folk"],
  spaceObjects: ["star", "planet", "comet", "asteroid", "meteor", "nebula", "galaxy", "black hole", "moon", "quasar", "supernova", "pulsar"],
  seaCreatures: ["shark", "dolphin", "whale", "octopus", "jellyfish", "starfish", "seahorse", "crab", "lobster", "shrimp", "seal", "sea turtle"],
  materials: ["wood", "metal", "plastic", "glass", "ceramic", "cloth", "paper", "rubber", "leather", "stone", "concrete", "fabric"],
  famousLandmarks: ["Eiffel Tower", "Great Wall", "Statue of Liberty", "Colosseum", "Taj Mahal", "Machu Picchu", "Pyramids", "Big Ben", "Sydney Opera House", "Mount Rushmore", "Christ the Redeemer", "Stonehenge"]
};

function assignRoles(players) {
  const numMoles = Math.floor(Math.random() * 2) + 1; // Always between 1 and 2 moles
  const roles = Array(numMoles).fill("mole").concat(Array(players.length - numMoles).fill("detective"));
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
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(3);
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({});
  const [theme, setTheme] = useState("");
  const [themeWords, setThemeWords] = useState([]);
  const [board, setBoard] = useState([]);
  const [word, setWord] = useState("");
  const [scores, setScores] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [screen, setScreen] = useState("start"); // 'start', 'player-role', 'board', 'reveal', 'add-points'
  const [readyToProceed, setReadyToProceed] = useState(false);
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    socket.on('updateRoom', (room) => {
      setPlayers(room.players);
    });

    socket.on('gameStarted', (room) => {
      setGameStarted(true);
      setRoles(assignRoles(room.players));
      const [randomTheme, words] = Object.entries(themes)[Math.floor(Math.random() * Object.entries(themes).length)];
      setTheme(randomTheme);
      setThemeWords(words);
      setWord(words[Math.floor(Math.random() * words.length)]);
      setBoard(createBoard(words));
      setScores(room.players.reduce((acc, player) => {
        acc[player.name] = 0;
        return acc;
      }, {}));
      setScreen('player-role');
    });

    socket.on('roomNotFound', () => {
      alert('Room not found');
    });

    return () => {
      socket.off('updateRoom');
      socket.off('gameStarted');
      socket.off('roomNotFound');
    };
  }, []);

  const handleNextTurn = () => {
    if (!readyToProceed) {
      setReadyToProceed(true);
    } else {
      if (currentPlayerIndex + 1 >= players.length) {
        setScreen("board");
      } else {
        setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
        setReadyToProceed(false);
        setShowRole(false);
      }
    }
  };

  const handleRevealRole = () => {
    setShowRole(true);
  };

  const handleReveal = () => {
    setScreen("reveal");
  };

  const handleAddPoints = () => {
    setScreen("add-points");
  };

  const handleSkipPoints = () => {
    setScreen("player-role");
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
    setScreen("player-role");
    setReadyToProceed(false);
    setShowRole(false);
  };

  const handlePlayerCountChange = (event) => {
    setNumPlayers(event.target.value);
  };

  const handleStartGame = () => {
    socket.emit('startGame', roomCode);
  };

  const handleCreateRoom = () => {
    socket.emit('createRoom', roomCode, playerName);
    setScreen('waiting');
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomCode, playerName);
    setScreen('waiting');
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
    setScreen("start");
    setReadyToProceed(false);
    setShowRole(false);
  };

  return (
    <div className="App">
      {screen === "start" && (
        <div className="start-screen">
          <h1>Holey Moley</h1>
          <div>
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
            <button onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div>
      )}
      {screen === "waiting" && (
        <div className="waiting-screen">
          <h1>Waiting for other players...</h1>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
      {screen === "player-role" && (
        <div className="player-role-screen">
          <h1>{players[currentPlayerIndex]?.name}, are you ready for your turn?</h1>
          {readyToProceed && (
            <h2>
              {showRole ? (
                roles[players[currentPlayerIndex]?.name] === 'mole' ? 'You are the mole.' : `The word is '${word}'.`
              ) : (
                <button onClick={handleRevealRole}>Reveal Role</button>
              )}
            </h2>
          )}
          <button onClick={handleNextTurn}>Next</button>
        </div>
      )}
      {screen === "board" && (
        <div className="board-screen">
          <h1>Game Board for the theme '{theme}':</h1>
          <div className="board">
            {board.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((word, wordIndex) => (
                  <div className="board-cell" key={wordIndex}>
                    {word}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <button onClick={handleReveal}>Next</button>
        </div>
      )}
      {screen === "reveal" && (
        <div className="reveal-screen">
          <h1>The word was: {word}</h1>
          {Object.entries(roles).map(([player, role]) => (
            <div key={player}>
              {player} was a {role}
            </div>
          ))}
          <button onClick={handleAddPoints}>Next</button>
        </div>
      )}
      {screen === "add-points" && (
        <div className="score-screen">
          <h1>Scores</h1>
          {Object.entries(scores).map(([player, score]) => (
            <div className="score-item" key={player}>
              <span>{player}: {score}</span>
              <div>
                <button onClick={() => handleAddPoint(player)}>Add Point</button>
                <button onClick={() => handleDeductPoint(player)}>Deduct Point</button>
              </div>
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
      )}
    </div>
  );
}

export default App;