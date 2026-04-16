export type GameMode = 'classic' | 'escalating' | 'knockout' | 'punishment';
export type Screen = 'start' | 'setup' | 'game' | 'gameover';

export interface Player {
  id: string;
  name: string;
  color: string;
  isEliminated: boolean;
  hits: number;
  survivals: number;
}

export interface GameState {
  screen: Screen;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  chambers: number;
  bullets: number;
  lastBulletCount: number;
  round: number;
  lastResult: 'safe' | 'hit' | null;
  punishmentCard: string | null;
}

export type GameAction =
  | { type: 'GO_TO_SETUP' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'RENAME_PLAYER'; id: string; name: string }
  | { type: 'START_GAME' }
  | { type: 'PULL_TRIGGER' }
  | { type: 'NEXT_TURN' }
  | { type: 'END_GAME' }
  | { type: 'RESET' };
