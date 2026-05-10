import { useEffect, useRef } from 'react'

export default function EndScreen({ onRestart }) {
  const goAudioRef = useRef(null)

  useEffect(() => {
    goAudioRef.current = new Audio('/assets/sound-effects/clicked-go-and-wedding-site.ogg')
    goAudioRef.current.volume = 0.7
  }, [])

  const playGo = () => {
    const audio = goAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  return (
    <div className="screen end-screen">
      <div className="end-content">
        <img
          src="/assets/end/lorena-and-johan-title.avif"
          alt="Lorena y Johan"
          className="end-title-image"
        />
        <img
          src="/assets/end/text.avif"
          alt="Invitacion a la boda"
          className="end-invite-image"
        />
        <p>Felicidades, lograste reunir a Lorena y Johan.</p>
        <p>Acompáñanos a celebrar nuestra boda.</p>
        <div className="buttons-row" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a
            href="https://withjoy.com/lorena-y-johan"
            className="wedding-site-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ir al sitio de la boda"
            onClick={playGo}
          ></a>
        </div>
      </div>
    </div>
  )
}
