import { useState } from 'react'
import './App.css'
import IntroScreen from './components/IntroScreen'
import SelectScreen from './components/SelectScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'

function App() {
  const [gameState, setGameState] = useState('intro') // intro, select, game, end
  const [player, setPlayer] = useState(null) // 'lorena' | 'johan'

  return (
    <div className="app-container">
      {gameState === 'intro' && (
        <IntroScreen onNext={() => setGameState('select')} onSkip={() => setGameState('end')} />
      )}
      {gameState === 'select' && (
        <SelectScreen 
          onSelect={(selected) => {
            setPlayer(selected)
            setGameState('game')
          }} 
          onSkip={() => setGameState('end')}
        />
      )}
      {gameState === 'game' && (
        <GameScreen 
          player={player} 
          onEnd={() => setGameState('end')} 
        />
      )}
      {gameState === 'end' && (
        <EndScreen
          onRestart={() => {
            setPlayer(null)
            setGameState('intro')
          }}
        />
      )}
    </div>
  )
}

export default App
