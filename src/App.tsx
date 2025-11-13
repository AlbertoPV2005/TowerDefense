import Map from './components/Map';
import GameUI from './components/GameUI';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="game-container">
      <Map />
      <GameUI />
    </div>
  );
};

export default App;
