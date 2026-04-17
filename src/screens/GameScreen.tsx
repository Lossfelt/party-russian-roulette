import { useEffect, useRef, useState } from 'react';
import { useGame, useGameDispatch } from '../context/GameContext';
import { ChamberDisplay } from '../components/ChamberDisplay';
import { audio } from '../lib/audio';
import { haptic } from '../lib/haptic';
import { useWakeLock } from '../hooks/useWakeLock';

type TurnPhase = 'ready' | 'spinning' | 'result';

const SPIN_DURATION_MS = 1000;

export function GameScreen() {
  const state = useGame();
  const dispatch = useGameDispatch();
  const [phase, setPhase] = useState<TurnPhase>('ready');
  const prevResultRef = useRef<typeof state.lastResult>(null);

  useWakeLock(true);

  const currentPlayer = state.players[state.currentPlayerIndex];
  const activePlayers = state.players.filter(p => !p.isEliminated);
  const isGameEnding =
    state.mode === 'knockout' &&
    state.lastResult === 'hit' &&
    activePlayers.length <= 1;

  useEffect(() => {
    if (state.lastResult && state.lastResult !== prevResultRef.current) {
      if (state.lastResult === 'hit') {
        audio.playBang();
        haptic.heavy();
      } else {
        audio.playClick();
        haptic.light();
      }
    }
    prevResultRef.current = state.lastResult;
  }, [state.lastResult]);

  const handlePull = () => {
    audio.unlock();
    setPhase('spinning');
    audio.playSpin(SPIN_DURATION_MS);
    haptic.medium();
    setTimeout(() => {
      dispatch({ type: 'PULL_TRIGGER' });
      setPhase('result');
    }, SPIN_DURATION_MS);
  };

  const handleNext = () => {
    haptic.tick();
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
          resultMessage =
            state.lastBulletCount === 1
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
  const bgClass = phase === 'result' ? (isHit ? 'hit-bg' : 'safe-bg') : '';

  return (
    <div className={`screen game-screen ${bgClass}`}>
      <div className="game-header">
        <span className="round-badge">Round {state.round}</span>
        <button
          className="btn btn-small btn-ghost"
          onClick={() => dispatch({ type: 'END_GAME' })}
        >
          End Game
        </button>
      </div>

      <div className="game-body">
        {phase !== 'result' && (
          <div className="current-player" style={{ color: currentPlayer.color }}>
            {currentPlayer.name}
          </div>
        )}

        <ChamberDisplay
          chambers={state.chambers}
          bullets={state.bullets}
          size={170}
          spinning={phase === 'spinning'}
        />

        {state.mode === 'escalating' && phase === 'ready' && (
          <div className="tension-meter">
            <div className="tension-label">
              {state.bullets} / {state.chambers} loaded
            </div>
            <div className="tension-bar">
              <div
                className="tension-fill"
                style={{ width: `${(state.bullets / state.chambers) * 100}%` }}
              />
            </div>
          </div>
        )}

        {phase === 'ready' && (
          <button className="trigger-btn" onClick={handlePull}>
            <span className="trigger-btn-inner">
              PULL
              <br />
              TRIGGER
            </span>
          </button>
        )}

        {phase === 'spinning' && (
          <div className="spinning-label" style={{ color: currentPlayer.color }}>
            {currentPlayer.name}
          </div>
        )}

        {phase === 'result' && (
          <div className={`result ${isHit ? 'result-hit' : 'result-safe'}`}>
            <div className="result-label">{isHit ? 'BANG!' : 'CLICK'}</div>
            <div className="result-player" style={{ color: currentPlayer.color }}>
              {currentPlayer.name}
            </div>
            <div className="result-message">{resultMessage}</div>
            <button className="btn btn-primary btn-large" onClick={handleNext}>
              {isGameEnding ? 'See Results' : 'Next Player'}
            </button>
          </div>
        )}
      </div>

      {state.mode === 'knockout' && eliminated.length > 0 && (
        <div className="eliminated-bar">
          <span className="eliminated-label">Out:</span>
          {eliminated.map(p => (
            <span
              key={p.id}
              className="eliminated-name"
              style={{ color: p.color }}
            >
              {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
