const { WebSocketServer } = require("ws");
const PORT = process.env.PORT || 8080; // Use Render's port or fallback to 8080

const wss = new WebSocketServer({ port: Number(PORT) });

console.log(`WebSocket server started on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("A player connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "intro") {
      ws.name = data.name; // Could be null in Random mode
      ws.word = data.word;

      const waitingPlayer = [...wss.clients].find(
        (client) =>
          client !== ws && client.readyState === client.OPEN && !client.opponent
      );

      if (waitingPlayer) {
        // Pair both players
        ws.opponent = waitingPlayer;
        waitingPlayer.opponent = ws;

        // Send pairing info to each player
        ws.send(
          JSON.stringify({
            type: "pair",
            opponentName: waitingPlayer.name || waitingPlayer.word,
            opponentWord: waitingPlayer.word,
          })
        );

        waitingPlayer.send(
          JSON.stringify({
            type: "pair",
            opponentName: ws.name || ws.word,
            opponentWord: ws.word,
          })
        );
      }
    }

    if (data.type === "opponent-status" && ws.opponent) {
      ws.opponent.send(JSON.stringify(data));
    }

    if (data.type === "player-win" && ws.opponent) {
      ws.opponent.send(JSON.stringify({ type: "opponent-win" }));
    }
  });

  ws.on("close", () => {
    console.log("Player disconnected");
    if (ws.opponent) {
      ws.opponent.opponent = null;
    }
  });
});
