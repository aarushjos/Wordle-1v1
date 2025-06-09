import { useEffect, useRef, useState } from 'react';
import Lobby from './lobby';
import Game from './game';

export default function Multiplayer() {
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentWord,setOpponentWord]=useState("");
  const [targetWord, setTargetWord] = useState("");
  const wsRef = useRef(null);

  const [isRandom, setIsRandom] = useState(false);

  const handleStart = (name, word, random = false) => {
    setPlayerName(name);
    setOpponentWord(word);
    setIsRandom(random); // new
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({
        type: "intro",
        name,
        word,
        random
      }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "pair") {
        setOpponentName(data.opponentName);
        setTargetWord(data.opponentWord); // Set opponent's word as your target
        setStarted(true);
      }
    };
  };


  return (
    <>
      {started ? (
        <Game yourName={playerName} opponentName={opponentName} targetWord={targetWord.toLowerCase()} wsRef={wsRef} isRandom={isRandom} opponentWord={opponentWord} />
      ) : (
        <Lobby onStart={handleStart} />
      )}
    </>
  );
}
