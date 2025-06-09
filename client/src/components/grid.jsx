import './grid.css';

export default function Grid({ grid, statusGrid }) {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((letter, colIndex) => {
            const status = statusGrid[rowIndex]?.[colIndex] || "";
            const delay = colIndex * 300*1.5; // flip delay per cell

            return (
              <div
                key={colIndex}
                className={`cell ${status ? "flip " + status : ""}`}
                style={{
                  animationDelay: `${delay}ms`,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

