import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function ChessGame({ roomCode }) {
  const [fen, setFen] = useState("start");
  const API_URL = import.meta.env.VITE_API_URL;
  const gameRef = useRef(new Chess());

  // Polling: cada 2s trae estado del servidor
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`${API_URL}/game/${roomCode}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.fen && data.fen !== fen) {
        try {
          gameRef.current.load(data.fen);
          setFen(data.fen);
        } catch {}
      }
    }, 2000);
    return () => clearInterval(id);
  }, [roomCode, fen, API_URL]);

  const onDrop = async (from, to) => {
    const move = gameRef.current.move({ from, to, promotion: "q" });
    if (!move) return false;
    const newFen = gameRef.current.fen();
    setFen(newFen);
    await fetch(`${API_URL}/game/${roomCode}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen: newFen }),
    });
    return true;
  };

  return (
    <div style={{ textAlign: "center", padding: 16 }}>
      <h2>Partida: {roomCode}</h2>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
    </div>
  );
}