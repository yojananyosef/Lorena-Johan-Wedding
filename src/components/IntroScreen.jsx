export default function IntroScreen({ onNext, onSkip }) {
  return (
    <div className="screen intro-screen">
      <div className="intro-content">
        <img src="/assets/intro.png" alt="Couple" className="intro-image" />
        <img src="/assets/how-to-play/how-to-play.png" alt="How to Play" style={{ width: '300px', marginTop: '20px' }} />
        <img src="/assets/how-to-play/text.png" alt="Instructions" style={{ width: '400px', margin: '20px 0' }} />
        <button type="button" className="ok-btn" onClick={onNext} aria-label="Continuar"></button>
      </div>
      <div className="skip-btn-container">
         <button type="button" className="skip-btn" onClick={onSkip} aria-label="Saltar introducción"></button>
      </div>
    </div>
  )
}
