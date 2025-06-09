import './grid.css';

export default function OpponentGrid({ statusGrid }) {
  return (
    <div className="grid opponent-grid">
      {statusGrid.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((status, colIndex) => {
            const delay = colIndex * 300 * 1.5; // flip delay per cell
            return (
              <div
                key={colIndex}
                className={`cell ${status ? "flip " + status : ""}`}
                style={{
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
