import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { GameState, GameAction, Player } from '../types';
import { getRandomPunishment } from '../data/punishments';

const PLAYER_COLORS = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#e91e63',
  '#00bcd4',
  '#8bc34a',
];

function createPlayer(index: number): Player {
  return {
    id: crypto.randomUUID(),
    name: `Player ${index + 1}`,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    isEliminated: false,
    hits: 0,
    survivals: 0,
  };
}

const initialState: GameState = {
  screen: 'start',
  mode: 'classic',
  players: [],
  currentPlayerIndex: 0,
  chambers: 6,
  bullets: 1,
  lastBulletCount: 1,
  round: 1,
  lastResult: null,
  punishmentCard: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_TO_SETUP':
      return {
        ...initialState,
        screen: 'setup',
        players: [createPlayer(0), createPlayer(1)],
      };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_PLAYER_COUNT': {
      const count = Math.max(2, Math.min(10, action.count));
      const current = state.players;
      if (count > current.length) {
        const newPlayers = [...current];
        for (let i = current.length; i < count; i++) {
          newPlayers.push(createPlayer(i));
        }
        return { ...state, players: newPlayers };
      }
      return { ...state, players: current.slice(0, count) };
    }

    case 'RENAME_PLAYER':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };

    case 'START_GAME':
      return {
        ...state,
        screen: 'game',
        currentPlayerIndex: 0,
        bullets: 1,
        lastBulletCount: 1,
        round: 1,
        lastResult: null,
        punishmentCard: null,
        players: state.players.map(p => ({
          ...p,
          isEliminated: false,
          hits: 0,
          survivals: 0,
        })),
      };

    case 'PULL_TRIGGER': {
      const lastBulletCount = state.bullets;
      const isHit = Math.random() < state.bullets / state.chambers;
      const currentPlayer = state.players[state.currentPlayerIndex];

      let newBullets = state.bullets;
      let punishmentCard: string | null = null;

      const newPlayers = state.players.map(p => {
        if (p.id !== currentPlayer.id) return p;
        if (isHit) {
          return {
            ...p,
            hits: p.hits + 1,
            isEliminated: state.mode === 'knockout',
          };
        }
        return { ...p, survivals: p.survivals + 1 };
      });

      if (isHit) {
        if (state.mode === 'escalating') newBullets = 1;
        if (state.mode === 'punishment') punishmentCard = getRandomPunishment();
      } else {
        if (state.mode === 'escalating') {
          newBullets = Math.min(state.bullets + 1, state.chambers - 1);
        }
      }

      return {
        ...state,
        players: newPlayers,
        bullets: newBullets,
        lastBulletCount,
        lastResult: isHit ? 'hit' : 'safe',
        punishmentCard,
      };
    }

    case 'NEXT_TURN': {
      const activePlayers = state.players.filter(p => !p.isEliminated);
      if (state.mode === 'knockout' && activePlayers.length <= 1) {
        return { ...state, screen: 'gameover', lastResult: null, punishmentCard: null };
      }

      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (state.players[nextIndex].isEliminated) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }

      const newRound = nextIndex <= state.currentPlayerIndex
        ? state.round + 1
        : state.round;

      return {
        ...state,
        currentPlayerIndex: nextIndex,
        round: newRound,
        lastResult: null,
        punishmentCard: null,
      };
    }

    case 'END_GAME':
      return { ...state, screen: 'gameover', lastResult: null, punishmentCard: null };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext<GameState>(initialState);
const GameDispatchContext = createContext<Dispatch<GameAction>>(() => {});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
