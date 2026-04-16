import { useGame } from './context/GameContext';
import { StartScreen } from './screens/StartScreen';
import { SetupScreen } from './screens/SetupScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';

export function App() {
  const { screen } = useGame();

  switch (screen) {
    case 'start':
      return <StartScreen />;
    case 'setup':
      return <SetupScreen />;
    case 'game':
      return <GameScreen />;
    case 'gameover':
      return <GameOverScreen />;
  }
}
