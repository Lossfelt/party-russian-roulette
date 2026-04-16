import { useState } from 'react';
import { useGame, useGameDispatch } from '../context/GameContext';
import type { GameMode } from '../types';

const MODE_INFO: Record<GameMode, { label: string; description: string }> = {
  classic: {
    label: 'Classic',
    description: '1 in 6 chance. Get hit, take a sip.',
  },
  escalating: {
    label: 'Escalating',
    description: 'Bullets increase each miss. Higher stakes every turn.',
  },
  knockout: {
    label: 'Knockout',
    description: "Get hit and you're out. Last one standing wins.",
  },
  punishment: {
    label: 'Punishment',
    description: 'Get hit and draw a card. Dares, rules, and chaos.',
  },
};

export function SetupScreen() {
  const { mode, players } = useGame();
  const dispatch = useGameDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const finishEditing = () => {
    if (editingId && editName.trim()) {
      dispatch({ type: 'RENAME_PLAYER', id: editingId, name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="screen setup-screen">
      <h2>Game Setup</h2>

      <section className="setup-section">
        <h3>Mode</h3>
        <div className="mode-grid">
          {(Object.keys(MODE_INFO) as GameMode[]).map(m => (
            <button
              key={m}
              className={`mode-card ${mode === m ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_MODE', mode: m })}
            >
              <strong>{MODE_INFO[m].label}</strong>
              <span>{MODE_INFO[m].description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h3>Players</h3>
        <div className="player-count-row">
          <button
            className="btn btn-icon"
            onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: players.length - 1 })}
            disabled={players.length <= 2}
          >
            &minus;
          </button>
          <span className="player-count">{players.length}</span>
          <button
            className="btn btn-icon"
            onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: players.length + 1 })}
            disabled={players.length >= 10}
          >
            +
          </button>
        </div>
        <div className="player-list">
          {players.map(p => (
            <div key={p.id} className="player-chip" style={{ borderColor: p.color }}>
              {editingId === p.id ? (
                <input
                  className="player-name-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={finishEditing}
                  onKeyDown={e => e.key === 'Enter' && finishEditing()}
                  autoFocus
                  maxLength={20}
                />
              ) : (
                <span
                  className="player-name"
                  onClick={() => startEditing(p.id, p.name)}
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="hint">Tap a name to edit it</p>
      </section>

      <button
        className="btn btn-primary btn-large"
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        Start Game
      </button>
    </div>
  );
}
