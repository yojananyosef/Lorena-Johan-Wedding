import { useState, useEffect, useRef } from 'react'

export default function SelectScreen({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null)
  const [frame, setFrame] = useState(0)
  const clickAudioRef = useRef(null)
  const goAudioRef = useRef(null)

  useEffect(() => {
    clickAudioRef.current = new Audio('/assets/sound-effects/clicked-ok-and-skip-and-player.ogg')
    clickAudioRef.current.volume = 0.6
    goAudioRef.current = new Audio('/assets/sound-effects/clicked-go-and-wedding-site.ogg')
    goAudioRef.current.volume = 0.7

    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const playClick = () => {
    const audio = clickAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const playGo = () => {
    const audio = goAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const handleSelect = (value) => {
    playClick()
    setSelected(value)
  }

  return (
    <div className="screen select-screen">
      <img src="/assets/choose-your-player.avif" alt="Choose your player" className="choose-title-img" />
      <div className="players-container">
        <div 
          className={`player-card ${selected === 'lorena' ? 'selected' : ''}`}
          onClick={() => handleSelect('lorena')}
        >
          {selected === 'lorena' && <img src="/assets/click-highlight.avif" className="click-highlight" alt="" />}
          <div className="player-bg lorena-bg">
            <div className="player-sprite" style={{
              backgroundImage: 'url(/assets/lorena-spritesheet.avif)',
              backgroundPosition: `${(frame * 100) / 3}% 0%`,
              backgroundSize: '400% 100%',
            }}></div>
            <span className="sparkle sparkle-top" aria-hidden="true"></span>
            <span className="sparkle sparkle-bottom" aria-hidden="true"></span>
          </div>
        </div>

        <div 
          className={`player-card ${selected === 'johan' ? 'selected' : ''}`}
          onClick={() => handleSelect('johan')}
        >
          {selected === 'johan' && <img src="/assets/click-highlight.avif" className="click-highlight" alt="" />}
          <div className="player-bg johan-bg">
            <div className="player-sprite" style={{
              backgroundImage: 'url(/assets/johan-spritesheet.avif)',
              backgroundPosition: `${(frame * 100) / 3}% 0%`,
              backgroundSize: '400% 100%',
            }}></div>
            <span className="sparkle sparkle-top" aria-hidden="true"></span>
            <span className="sparkle sparkle-bottom" aria-hidden="true"></span>
          </div>
        </div>
      </div>
      
      <button 
        type="button"
        className="go-btn" 
        onClick={() => {
          if (!selected) return
          playGo()
          onSelect(selected)
        }} 
        disabled={!selected}
        aria-label={selected ? `Jugar como ${selected}` : 'Selecciona un personaje'}
        style={{ visibility: selected ? 'visible' : 'hidden' }}
      ></button>

      <div className="skip-btn-container">
         <button type="button" className="skip-btn" onClick={() => { playClick(); onSkip() }} aria-label="Omitir selección"></button>
      </div>
    </div>
  )
}
