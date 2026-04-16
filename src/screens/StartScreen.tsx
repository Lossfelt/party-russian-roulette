import { useGameDispatch } from '../context/GameContext';
import { ChamberDisplay } from '../components/ChamberDisplay';

export function StartScreen() {
  const dispatch = useGameDispatch();

  return (
    <div className="screen start-screen">
      <div className="start-hero">
        <ChamberDisplay chambers={6} bullets={1} size={140} />
        <h1>Party Roulette</h1>
        <p className="subtitle">How lucky do you feel?</p>
      </div>
      <button
        className="btn btn-primary btn-large"
        onClick={() => dispatch({ type: 'GO_TO_SETUP' })}
      >
        New Game
      </button>
    </div>
  );
}
