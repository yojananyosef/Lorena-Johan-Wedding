import { useState, useEffect } from 'react'

export default function SelectScreen({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="screen select-screen">
      <img src="/assets/choose-your-player.png" alt="Choose your player" className="choose-title-img" />
      <div className="players-container">
        <div 
          className={`player-card ${selected === 'lorena' ? 'selected' : ''}`}
          onClick={() => setSelected('lorena')}
        >
          {selected === 'lorena' && <img src="/assets/click-highlight.png" className="click-highlight" alt="" />}
          <div className="player-bg lorena-bg">
            <div className="player-sprite" style={{
              backgroundImage: 'url(/assets/lorena-spritesheet.png)',
              backgroundPosition: `-${frame * 180}px 0px`,
              backgroundSize: '720px 274px',
            }}></div>
            {selected === 'lorena' && <img src="/assets/sparkle.gif" className="sparkle" alt="sparkle" />}
          </div>
        </div>

        <div 
          className={`player-card ${selected === 'johan' ? 'selected' : ''}`}
          onClick={() => setSelected('johan')}
        >
          {selected === 'johan' && <img src="/assets/click-highlight.png" className="click-highlight" alt="" />}
          <div className="player-bg johan-bg">
            <div className="player-sprite" style={{
              backgroundImage: 'url(/assets/johan-spritesheet.png)',
              backgroundPosition: `-${frame * 180}px 0px`,
              backgroundSize: '720px 274px',
            }}></div>
            {selected === 'johan' && <img src="/assets/sparkle.gif" className="sparkle" alt="sparkle" />}
          </div>
        </div>
      </div>
      
      <button 
        type="button"
        className="go-btn" 
        onClick={() => selected && onSelect(selected)} 
        disabled={!selected}
        aria-label={selected ? `Jugar como ${selected}` : 'Selecciona un personaje'}
        style={{ visibility: selected ? 'visible' : 'hidden' }}
      ></button>

      <div className="skip-btn-container">
         <button type="button" className="skip-btn" onClick={onSkip} aria-label="Omitir selección"></button>
      </div>
    </div>
  )
}
