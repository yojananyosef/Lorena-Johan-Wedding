import React from 'react'

export default function EndScreen({ score, onRestart }) {
  return (
    <div className="screen end-screen">
      <div className="end-content">
        <h1 style={{ color: '#ff6b6b' }}>¡Reunidos!</h1>
        <p>Felicidades, lograste reunir a Lorena y Johan.</p>
        <p>Acompáñanos a celebrar nuestra boda en nuestro sitio web.</p>
        <div className="buttons-row" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a href="https://example.com" className="wedding-site-btn" target="_blank" rel="noopener noreferrer"></a>
          <button className="ok-btn" onClick={onRestart}></button>
        </div>
      </div>
    </div>
  )
}
