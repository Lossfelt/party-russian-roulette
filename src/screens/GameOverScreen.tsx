import { useGame, useGameDispatch } from '../context/GameContext';

export function GameOverScreen() {
  const { players, mode, round } = useGame();
  const dispatch = useGameDispatch();

  const sortedPlayers = [...players].sort((a, b) => {
    if (mode === 'knockout') {
      if (a.isEliminated !== b.isEliminated) return a.isEliminated ? 1 : -1;
      return b.survivals - a.survivals;
    }
    return b.hits - a.hits;
  });

  const winner = mode === 'knockout'
    ? players.find(p => !p.isEliminated)
    : null;

  const mostUnlucky = [...players].sort((a, b) => b.hits - a.hits)[0];
  const longestStreak = [...players].sort((a, b) => b.survivals - a.survivals)[0];

  return (
    <div className="screen gameover-screen">
      <h2>Game Over</h2>

      {winner && (
        <div className="winner-banner" style={{ color: winner.color }}>
          {winner.name} wins!
        </div>
      )}

      <div className="stats-info">{round} rounds played</div>

      {mode !== 'knockout' && (
        <div className="highlights">
          {mostUnlucky && mostUnlucky.hits > 0 && (
            <div className="highlight-card">
              <span className="highlight-label">Most unlucky</span>
              <span className="highlight-value" style={{ color: mostUnlucky.color }}>
                {mostUnlucky.name}
              </span>
              <span className="highlight-detail">Hit {mostUnlucky.hits}x</span>
            </div>
          )}
          {longestStreak && longestStreak.survivals > 0 && (
            <div className="highlight-card">
              <span className="highlight-label">Luckiest</span>
              <span className="highlight-value" style={{ color: longestStreak.color }}>
                {longestStreak.name}
              </span>
              <span className="highlight-detail">Survived {longestStreak.survivals}x</span>
            </div>
          )}
        </div>
      )}

      <div className="stats-list">
        {sortedPlayers.map((p, i) => (
          <div
            key={p.id}
            className={`stats-card ${p.isEliminated ? 'eliminated' : ''}`}
            style={{ borderColor: p.color }}
          >
            <div className="stats-rank">#{i + 1}</div>
            <div className="stats-name" style={{ color: p.color }}>{p.name}</div>
            <div className="stats-details">
              <span>Hit {p.hits}x</span>
              <span>Survived {p.survivals}x</span>
            </div>
          </div>
        ))}
      </div>

      <div className="gameover-actions">
        <button
          className="btn btn-primary btn-large"
          onClick={() => dispatch({ type: 'GO_TO_SETUP' })}
        >
          Play Again
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
