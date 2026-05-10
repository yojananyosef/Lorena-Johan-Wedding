import { useEffect, useRef } from 'react'

export default function IntroScreen({ onNext, onSkip }) {
  const clickAudioRef = useRef(null)

  useEffect(() => {
    clickAudioRef.current = new Audio('/assets/sound-effects/clicked-ok-and-skip-and-player.ogg')
    clickAudioRef.current.volume = 0.6
  }, [])

  const playClick = () => {
    const audio = clickAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  return (
    <div className="screen intro-screen">
      <div className="intro-content">
        <img src="/assets/intro.png" alt="Couple" className="intro-image" />
        <img src="/assets/how-to-play/how-to-play.png" alt="How to Play" className="intro-howto" />
        <img src="/assets/how-to-play/text.png" alt="Instructions" className="intro-instructions" />
        <button type="button" className="ok-btn" onClick={() => { playClick(); onNext() }} aria-label="Continuar"></button>
      </div>
      <div className="skip-btn-container">
         <button type="button" className="skip-btn" onClick={() => { playClick(); onSkip() }} aria-label="Saltar introducción"></button>
      </div>
    </div>
  )
}
