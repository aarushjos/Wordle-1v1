import './lobby.css';
import { useState } from 'react';
import { guessWords } from '../../word_set_maker/guessWords';
import { validWords } from '../../word_set_maker/validWords';

export default function Lobby({ onStart }) {
  const [name, setName] = useState("");
  const [word, setWord] = useState("");

  const handleRandom = () => {
    const filteredWords = Array.from(guessWords).filter((w) => w.length === 5 && validWords.has(w.toLowerCase()));
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
    setWord(randomWord);
    onStart(null, randomWord, true); // no name needed
  };

  const handleStartClick = () => {
    if (word.length !== 5) {
      alert("Please enter a 5-letter word.");
      return;
    }
    if (!validWords.has(word.toLowerCase())) {
      alert("Word not in allowed list. Please enter a valid word.");
      return;
    }
    
    const displayName = name.toLowerCase() === "rochelle" ? "Cutie (but kinda stoopid)" : name;
    onStart(displayName || null, word);
  };


  return (
    <div className="lobby">
      <div className="inputs">
        <div>
          <h3>Your name:</h3>
          <input
            autoFocus
            placeholder="Enter your display name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <h3>Opponent's word:</h3>
          <input
            placeholder="Enter word to be guessed by opponent"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
          />
        </div>
      </div>
      <div className="choice-buttons">
        <button onClick={handleStartClick}>
          Start
        </button>
        <button onClick={handleRandom}>Random</button>
      </div>
    </div>
  );
}
