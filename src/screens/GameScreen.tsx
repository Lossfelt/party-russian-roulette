import { useState } from 'react';
import { useGame, useGameDispatch } from '../context/GameContext';
import { ChamberDisplay } from '../components/ChamberDisplay';

type TurnPhase = 'ready' | 'spinning' | 'result';

export function GameScreen() {
  const state = useGame();
  const dispatch = useGameDispatch();
  const [phase, setPhase] = useState<TurnPhase>('ready');

  const currentPlayer = state.players[state.currentPlayerIndex];
  const activePlayers = state.players.filter(p => !p.isEliminated);
  const isGameEnding = state.mode === 'knockout' && state.lastResult === 'hit' && activePlayers.length <= 1;

  const handlePull = () => {
    setPhase('spinning');
    setTimeout(() => {
      dispatch({ type: 'PULL_TRIGGER' });
      setPhase('result');
    }, 800);
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT_TURN' });
    setPhase('ready');
  };

  const isHit = state.lastResult === 'hit';

  let resultMessage = '';
  if (phase === 'result') {
    if (isHit) {
      switch (state.mode) {
        case 'classic':
          resultMessage = 'Take a sip!';
          break;
        case 'escalating':
          resultMessage = state.lastBulletCount === 1
            ? 'Take a sip!'
            : `Take ${state.lastBulletCount} sips!`;
          break;
        case 'knockout':
          resultMessage = "You're out!";
          break;
        case 'punishment':
          resultMessage = state.punishmentCard ?? 'Take a sip!';
          break;
      }
    } else {
      resultMessage = 'You live... for now.';
    }
  }

  const eliminated = state.players.filter(p => p.isEliminated);

  return (
    <div className={`screen game-screen ${phase === 'result' ? (isHit ? 'hit-bg' : 'safe-bg') : ''}`}>
      <div className="game-header">
        <span className="round-badge">Round {state.round}</span>
        <button className="btn btn-small btn-ghost" onClick={() => dispatch({ type: 'END_GAME' })}>
          End Game
        </button>
      </div>

      <div className="game-body">
        <div className="current-player" style={{ color: currentPlayer.color }}>
          {currentPlayer.name}
        </div>

        <ChamberDisplay
          chambers={state.chambers}
          bullets={state.bullets}
          size={150}
          spinning={phase === 'spinning'}
        />

        {state.mode === 'escalating' && phase === 'ready' && (
          <div className="bullet-count">
            {state.bullets} / {state.chambers} loaded
          </div>
        )}

        {phase === 'ready' && (
          <button className="trigger-btn" onClick={handlePull}>
            PULL<br />TRIGGER
          </button>
        )}

        {phase === 'spinning' && (
          <div className="spinning-text">. . .</div>
        )}

        {phase === 'result' && (
          <div className={`result ${isHit ? 'result-hit' : 'result-safe'}`}>
            <div className="result-label">{isHit ? 'BANG!' : 'CLICK'}</div>
            <div className="result-message">{resultMessage}</div>
            <button className="btn btn-primary btn-large" onClick={handleNext}>
              {isGameEnding ? 'See Results' : 'Next'}
            </button>
          </div>
        )}
      </div>

      {state.mode === 'knockout' && eliminated.length > 0 && (
        <div className="eliminated-bar">
          <span className="eliminated-label">Out: </span>
          {eliminated.map(p => (
            <span key={p.id} className="eliminated-name" style={{ color: p.color }}>
              {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
