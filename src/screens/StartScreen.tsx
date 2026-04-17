import { useGame, useGameDispatch } from '../context/GameContext';
import { ChamberDisplay } from '../components/ChamberDisplay';
import { audio } from '../lib/audio';

export function StartScreen() {
  const { settings } = useGame();
  const dispatch = useGameDispatch();

  const handleStart = () => {
    audio.unlock();
    dispatch({ type: 'GO_TO_SETUP' });
  };

  return (
    <div className="screen start-screen">
      <div className="start-hero">
        <ChamberDisplay chambers={6} bullets={1} size={160} />
        <h1 className="display-heading">Party Roulette</h1>
        <p className="subtitle">How lucky do you feel?</p>
      </div>

      <div className="start-actions">
        <button className="btn btn-primary btn-large" onClick={handleStart}>
          New Game
        </button>

        <div className="settings-row">
          <button
            className={`settings-toggle ${settings.sound ? 'on' : 'off'}`}
            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
            aria-label="Toggle sound"
          >
            <span className="settings-toggle-icon">{settings.sound ? '♪' : '✕'}</span>
            <span className="settings-toggle-label">Sound</span>
          </button>
          <button
            className={`settings-toggle ${settings.haptics ? 'on' : 'off'}`}
            onClick={() => dispatch({ type: 'TOGGLE_HAPTICS' })}
            aria-label="Toggle haptics"
          >
            <span className="settings-toggle-icon">{settings.haptics ? '≋' : '✕'}</span>
            <span className="settings-toggle-label">Haptics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
