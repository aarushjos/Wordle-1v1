import { useRef, useState, useEffect } from "react";
import Grid from "./grid";
import OpponentGrid from "./OpponentGrid";
import Keyboard from "./keyboard";
import { validWords } from "../../word_set_maker/validWords";
import './game.css';

export default function Game({ yourName, opponentName, targetWord, wsRef, isRandom, opponentWord }) {
  const emptyRow = () => Array(5).fill("");
  const emptyGrid = () => Array(6).fill(null).map(() => emptyRow());
  const emptyStatusGrid = () => Array(6).fill(null).map(() => emptyRow());

  const [grid, setGrid] = useState(emptyGrid());
  const [statusGrid, setStatusGrid] = useState(emptyStatusGrid());
  const [opponentStatusGrid, setOpponentStatusGrid] = useState(emptyStatusGrid());
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const gridRef = useRef(grid);
  const currentRowRef = useRef(0);
  const currentColRef = useRef(0);


  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "opponent-status") {
        setOpponentStatusGrid((prev) => {
          const newStatus = prev.map((row) => [...row]);
          newStatus[data.row] = data.status;
          return newStatus;
        });
      } else if (data.type === "opponent-win") {
        setMessage(`Opponent Won!\nWord was: ${targetWord.toUpperCase()}`);
        setGameOver(true);
      }
    };
  }, [wsRef, targetWord]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const validateWord = (word) => {
    const result = Array(5).fill("absent");
    const letterCount = {};

    for (let letter of targetWord) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
      if (word[i] === targetWord[i]) {
        result[i] = "correct";
        letterCount[word[i]]--;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      if (targetWord.includes(word[i]) && letterCount[word[i]] > 0) {
        result[i] = "present";
        letterCount[word[i]]--;
      }
    }

    return result;
  };

  const getLetterStatuses = () => {
    const letterStatus = {};

    for (let rowIndex = 0; rowIndex < statusGrid.length; rowIndex++) {
      for (let colIndex = 0; colIndex < statusGrid[rowIndex].length; colIndex++) {
        const status = statusGrid[rowIndex][colIndex];
        const letter = grid[rowIndex][colIndex];
        if (!letter) continue;

        if (status === "correct") {
          letterStatus[letter] = "correct";
        } else if (status === "present") {
          if (letterStatus[letter] !== "correct") {
            letterStatus[letter] = "present";
          }
        } else if (status === "absent") {
          if (!letterStatus[letter]) {
            letterStatus[letter] = "absent";
          }
        }
      }
    }
    return letterStatus;
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    const row = currentRowRef.current;
    const col = currentColRef.current;

    console.log(`Key pressed: ${key} | Row: ${row}, Col: ${col}`);

    if (key === "BACKSPACE") {
      if (col > 0) {
        currentColRef.current -= 1;
        const newGrid = gridRef.current.map((r) => [...r]);
        newGrid[row][col - 1] = "";
        gridRef.current = newGrid;
        setGrid(newGrid);
      }
    } else if (key === "ENTER") {
      if (col === 5 && row < 6) {
        const word = gridRef.current[row].join("").toLowerCase();
        console.log(`Guess word on ENTER: ${word}`);

        if (!validWords.has(word)) {
          showMessage("Not a valid word");
          return;
        }
        const result = validateWord(word);

        setStatusGrid((prev) => {
          const newStatus = prev.map((row) => [...row]);
          newStatus[row] = result;
          return newStatus;
        });

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "opponent-status",
            row,
            status: result,
          }));
        }

        const allCorrect = result.every((val) => val === "correct");
        if (allCorrect) {
          setMessage("You won!");
          setGameOver(true);
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "player-win" }));
          }
          return;
        }

        if (currentRowRef.current === 5) {
          setMessage("No more guesses");
          setGameOver(true);
          return;
        }

        currentRowRef.current++;
        currentColRef.current = 0;
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (col < 5) {
        const newGrid = gridRef.current.map((row) => [...row]);
        newGrid[row][col] = key;
        gridRef.current = newGrid;
        setGrid(newGrid);
        currentColRef.current++;
      }
    }
  };

  const handleRematch = () => {
    console.log("Rematch clicked");
    window.location.reload();
  };

  return (
    <div className="game">
      {message && <div className="invalid-message">{message}</div>}
      <div className="grids">
        <div className="grid-layout">
          <h1 className="name">{yourName}</h1>
          <Grid grid={grid} statusGrid={statusGrid} />
        </div>
        <div className="grid-layout opponent">
          <h1 className="name">{isRandom ? `Word: ${opponentWord.toUpperCase()}` : opponentName}</h1>
          <OpponentGrid statusGrid={opponentStatusGrid} />
        </div>
      </div>
      <Keyboard onKeyPress={handleKeyPress} letterStatus={getLetterStatuses()} />
      {gameOver && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleRematch} style={{ padding: "1rem 2rem", fontSize: "1rem", cursor: "pointer" }}>
            Rematch
          </button>
        </div>
      )}
    </div>
  );
}
