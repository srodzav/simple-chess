import { useState } from "react";
import Home from "./Home";
import ChessGame from "./ChessGame";

export default function App() {
  const [room, setRoom] = useState(null);
  return room ? <ChessGame roomCode={room} /> : <Home onStart={setRoom} />;
}