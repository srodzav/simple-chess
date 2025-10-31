import { useState } from "react";

export default function Home({ onStart }) {
  const [joinCode, setJoinCode] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // usar var de entorno

  const createGame = async () => {
    const res = await fetch(`${API_URL}/create`, { method: "POST" });
    const data = await res.json();
    onStart(data.room);
  };

  const joinGame = () => {
    if (joinCode.trim()) onStart(joinCode.trim().toUpperCase());
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>♟️ Simple Chess 1vs1</h1>
      <button onClick={createGame}>Crear partida</button>
      <div style={{ marginTop: 24 }}>
        <input
          placeholder="Código de partida"
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={joinGame} style={{ marginLeft: 8 }}>
          Unirse
        </button>
      </div>
    </div>
  );
}