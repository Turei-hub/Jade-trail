import { useState } from 'react'
import HomeScreen from './components/screens/HomeScreen'
import KidModeScreen from './components/screens/KidModeScreen'
import AdultModeScreen from './components/screens/AdultModeScreen'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activePlanet, setActivePlanet] = useState('mars')

  const navigate = (to, opts = {}) => {
    if (opts.planet) setActivePlanet(opts.planet)
    setScreen(to)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: '#e8eaf0' }}>
      {screen === 'home' && <HomeScreen onNavigate={navigate} />}
      {screen === 'kid-mode' && <KidModeScreen planetId={activePlanet} onNavigate={navigate} />}
      {screen === 'adult-mode' && <AdultModeScreen planetId={activePlanet} onNavigate={navigate} />}
    </div>
  )
}
