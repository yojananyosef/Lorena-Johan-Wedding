export default function EndScreen({ onRestart }) {
  return (
    <div className="screen end-screen">
      <div className="end-content">
        <img
          src="/assets/end/lorena-and-johan-title.png"
          alt="Lorena y Johan"
          className="end-title-image"
        />
        <img
          src="/assets/end/text.png"
          alt="Invitacion a la boda"
          className="end-invite-image"
        />
        <p>Felicidades, lograste reunir a Lorena y Johan.</p>
        <p>Acompáñanos a celebrar nuestra boda.</p>
        <div className="buttons-row" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a
            href="https://example.com"
            className="wedding-site-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ir al sitio de la boda"
          ></a>
        </div>
      </div>
    </div>
  )
}
