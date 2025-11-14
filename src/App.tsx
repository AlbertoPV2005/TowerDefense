import React from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="game-container">
      <GameBoard />
    </div>
  );
};

export default App;