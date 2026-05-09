import { useEffect, useRef, useState } from 'react'
import { WINNING_SCORE, PLAYER_RENDER_WIDTH, JUMP_VELOCITY, GRAVITY, BACKGROUND_SPEED, GROUND_SPEED, BACKGROUND_LOOP, PAUSE_OVERLAY_ALPHA } from '../game/constants.js'
import { loadImage } from '../game/utils.js'
import { loadPlayerSprite, loadWaitingSprite, loadRockSprites, loadHudImages } from '../game/resources.js'

export default function GameScreen({ player, onEnd, onRetry }) {
  const [gameState, setGameState] = useState('playing') 
  const gameStateRef = useRef('playing')
  const [showContinue, setShowContinue] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const canvasRef = useRef(null)
  const jumpRef = useRef(() => {})
  const audioRef = useRef(null)
  const pauseRef = useRef(false)
  const soundOnRef = useRef(true)

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const handleCanvasClick = () => {
    if (gameStateRef.current !== 'playing' || pauseRef.current) return
    jumpRef.current()
    if (soundOnRef.current) audioRef.current?.play().catch(() => {})
  }

  const togglePause = () => {
    if (gameState !== 'playing') return
    pauseRef.current = !pauseRef.current
    setIsPaused(pauseRef.current)
  }

  const toggleSound = () => {
    const nextSound = !soundOnRef.current
    soundOnRef.current = nextSound
    setSoundOn(nextSound)
    if (audioRef.current) {
      if (nextSound) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Dynamic resize
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    let animationId
    let isJumping = false
    let velocityY = 0
    let bgOffset = 0
    let groundOffset = 0

    let rocks = []
    let berries = []
    let rings = []
    let frameCount = 0
    let hitTimer = 0
    
    let playerWalkX = 0; // How far the player has walked right during win scene
    let winTransitionAlpha = 0; // Romantic overlay fade-in
    let hasShownContinue = false;
    
    let currentScore = 0;
    let localGameState = 'playing';
    let localGameOverReason = '';

    const bgImg = loadImage('/assets/background/clouds.png')
    const groundImg = loadImage('/assets/background/ground.png')
    
    const playerImg = loadPlayerSprite(player)
    
    // Waiting sprite: static image of partner standing with puppy
    const waitingImg = loadWaitingSprite(player)
    
    const rockImgs = loadRockSprites()
    
    const berryImg = loadImage('/assets/berry.png')
    
    const ringImg = loadImage('/assets/point-tracker/ring-collected.png')

    // HUD Images
    const { hudCollect, hudBerryShadow, hudBerryCol, hudRingShadow } = loadHudImages()

    const soundtrack = new Audio('/assets/soundtrack.mp3')
    soundtrack.loop = true
    soundtrack.volume = 0.5
    soundtrack.preload = 'auto'
    audioRef.current = soundtrack
    soundtrack.play().catch(() => {})

    const tryPlayAudio = () => {
      audioRef.current?.play().catch(() => {})
    }

    // Dynamic coordinates based on height
    const getGroundY = () => canvas.height - 160;
    const getPlayerBaseY = () => canvas.height - 380;
    let playerY = getPlayerBaseY()

    const jump = () => {
      if (!isJumping && localGameState === 'playing') {
        isJumping = true
        velocityY = JUMP_VELOCITY
      }
    }

    jumpRef.current = jump

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (!pauseRef.current) {
          tryPlayAudio()
          jump()
        }
      }

      if (e.code === 'KeyP' && gameStateRef.current === 'playing') {
        pauseRef.current = !pauseRef.current
        setIsPaused(pauseRef.current)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameCount++
      if (hitTimer > 0) hitTimer--;

      const groundY = getGroundY();
      const baseY = getPlayerBaseY();

      if (localGameState !== 'won' && localGameState !== 'gameover' && !pauseRef.current) {
        bgOffset -= BACKGROUND_SPEED
        groundOffset -= GROUND_SPEED
      }
      if (bgOffset <= -BACKGROUND_LOOP) bgOffset = 0
      if (groundOffset <= -BACKGROUND_LOOP) groundOffset = 0
      
      ctx.drawImage(bgImg, bgOffset, groundY - 150, 3000, 300)
      ctx.drawImage(bgImg, bgOffset + 3000, groundY - 150, 3000, 300)

      ctx.drawImage(groundImg, groundOffset, groundY, 3000, 180)
      ctx.drawImage(groundImg, groundOffset + 3000, groundY, 3000, 180)

      if (localGameState !== 'won' && localGameState !== 'gameover' && !pauseRef.current) {
        playerY += velocityY
        velocityY += GRAVITY
      } else if (localGameState === 'won') {
        if (playerY < baseY) {
            playerY += velocityY
            velocityY += GRAVITY
        } else {
            playerY = baseY
            isJumping = false
        }
      }

      if (playerY >= baseY) {
        playerY = baseY
        isJumping = false
        velocityY = 0
      }

      let isReunited = false;

      // Render size for the player
      const renderW = PLAYER_RENDER_WIDTH;
      // Player height for collision (spritesheet aspect ratio ~1.686:1)
      const playerH = renderW * 1.686;

      if (playerImg.width > 0) {
        // Calculate frame dimensions from actual image
        const numFrames = 16;
        const fw = playerImg.width / numFrames;
        const fh = playerImg.height;
        const renderH = renderW * (fh / fw);
        
        let currentFrame;
        let playerDrawX = 100; // Default left position
        
        if (localGameState === 'won') {
            // Fade in the romantic overlay
            if (winTransitionAlpha < 0.45) {
                winTransitionAlpha += 0.005;
            }
            
            // Player walks RIGHT towards the partner
            playerWalkX += 3;
            playerDrawX = 100 + playerWalkX;
            
            // Partner waits at right side of screen
            const partnerWaitX = canvas.width * 0.6;
            const meetPoint = partnerWaitX - renderW - 20;
            
            if (playerDrawX >= meetPoint) {
                playerDrawX = meetPoint;
                isReunited = true;
            }
            
            // Player animation: walking with ring towards partner
            if (isReunited) {
                currentFrame = 12; // Ring pose - presenting the ring
            } else {
                // Run towards partner
                currentFrame = Math.floor(frameCount / 8) % 6;
            }
            
            // Partner ALWAYS shows the waiting sprite (they're waiting for the ring)
            if (waitingImg.width > 0) {
                const waitRatio = waitingImg.width / waitingImg.height;
                const waitH = renderH;
                const waitW = waitH * waitRatio;
                ctx.drawImage(waitingImg, partnerWaitX, baseY, waitW, waitH);
            }
            
            if (isReunited) {
                ctx.fillStyle = '#ff6b6b'
                ctx.font = 'bold 36px "Press Start 2P", Arial'
                ctx.textAlign = 'center'
                ctx.fillText(`¡REUNIDOS!`, (playerDrawX + canvas.width * 0.6) / 2 + renderW / 2, baseY - 30)
                ctx.textAlign = 'left'
                if (!hasShownContinue) {
                    setShowContinue(true);
                    hasShownContinue = true;
                }
            }
        } else if (isJumping) {
            currentFrame = 1; // Mid-stride for jump
        } else {
            // 6-frame run cycle: frames 0,1,2,3,4,5
            currentFrame = Math.floor(frameCount / 8) % 6;
        }

        if (hitTimer % 10 < 5 && hitTimer > 0) {
           ctx.filter = 'sepia(100%) saturate(200%) brightness(70%) hue-rotate(-60deg)';
        }
        
        ctx.drawImage(playerImg, Math.round(currentFrame * fw), 0, Math.round(fw), fh, playerDrawX, playerY, renderW, renderH);
        
        ctx.filter = 'none';
      }

      // --- ROMANTIC OVERLAY (drawn over everything during win) ---
      if (localGameState === 'won' && winTransitionAlpha > 0) {
          ctx.save();
          // Soft pink/rose radial vignette from center
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const gradient = ctx.createRadialGradient(cx, cy, canvas.height * 0.2, cx, cy, canvas.height * 0.9);
          gradient.addColorStop(0, `rgba(255, 200, 210, 0)`);
          gradient.addColorStop(0.5, `rgba(255, 150, 170, ${winTransitionAlpha * 0.3})`);
          gradient.addColorStop(1, `rgba(255, 100, 130, ${winTransitionAlpha * 0.6})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Floating hearts effect
          const heartCount = 8;
          for (let i = 0; i < heartCount; i++) {
              const hx = (canvas.width * (i + 0.5) / heartCount) + Math.sin(frameCount * 0.02 + i * 1.5) * 40;
              const hy = canvas.height * 0.3 + Math.sin(frameCount * 0.015 + i * 2) * 60 - (frameCount * 0.3 % canvas.height) * 0.15;
              const hSize = 12 + Math.sin(frameCount * 0.03 + i) * 4;
              const alpha = winTransitionAlpha * (0.3 + Math.sin(frameCount * 0.025 + i) * 0.15);
              
              ctx.fillStyle = `rgba(255, 100, 120, ${alpha})`;
              ctx.font = `${hSize}px Arial`;
              ctx.fillText('♥', hx, hy);
          }
          ctx.restore();
      }

      if (localGameState === 'playing' && !pauseRef.current) {
        if (frameCount % 120 === 0) {
            const randomRock = rockImgs[Math.floor(Math.random() * rockImgs.length)]
            // Rocks sit IN the grass, partially embedded
            rocks.push({ x: canvas.width, y: groundY + 70, width: 90, height: 90, img: randomRock })
        }
        
        if (frameCount % 80 === 0) {
            if (currentScore < WINNING_SCORE) {
                if (Math.random() > 0.3) {
                    berries.push({ x: canvas.width, y: baseY - 150 + Math.random() * 150, width: 60, height: 60 })
                }
            } else if (rings.length === 0) {
                rings.push({ x: canvas.width, y: baseY - 100, width: 80, height: 80 })
            }
        }
      }

      // Only draw/collide obstacles during playing state
      if (localGameState === 'playing' && !pauseRef.current) {
        rocks.forEach((rock, index) => {
          rock.x -= 6
          if (rock.img.width > 0) ctx.drawImage(rock.img, rock.x, rock.y, rock.width, rock.height)

          if (
            hitTimer === 0 &&
            100 < rock.x + rock.width - 30 &&
            100 + 120 > rock.x + 30 &&
            playerY + playerH > rock.y + 20
          ) {
            hitTimer = 30; // invincibility
            rocks[index].ouch = true;
            if (currentScore > 0) {
                currentScore--;
            } else {
                pauseRef.current = false
                localGameState = 'gameover'
                setGameState('gameover')
                localGameOverReason = '¡La roca te tumbó sin bayas!'
                rocks = []
                berries = []
                rings = []
              }
          }
          
          if (rock.ouch) {
              ctx.fillStyle = 'red';
              ctx.font = 'bold 20px "Press Start 2P", Arial';
              ctx.fillText("OUCH!", rock.x, rock.y - 10);
          }
        })
        rocks = rocks.filter(rock => rock.x + rock.width > -100)

        berries.forEach((berry, index) => {
          berry.x -= 4
          if (berryImg.width > 0) ctx.drawImage(berryImg, berry.x, berry.y, berry.width, berry.height)

          if (
            100 < berry.x + berry.width &&
            100 + 120 > berry.x &&
            playerY < berry.y + berry.height &&
            playerY + playerH > berry.y
          ) {
            berries.splice(index, 1)
            currentScore += 1
          }
        })
        berries = berries.filter(berry => berry.x + berry.width > -100)
      }
      
      rings.forEach((ring, index) => {
        if (localGameState !== 'won') ring.x -= 4
        
        // Draw the actual ring-collected asset
        if (localGameState === 'playing' && ringImg.width > 0) {
          ctx.drawImage(ringImg, ring.x, ring.y, ring.width, ring.height);
        }

        if (
          localGameState === 'playing' &&
          100 < ring.x + ring.width &&
          100 + 120 > ring.x &&
          playerY < ring.y + ring.height &&
          playerY + playerH > ring.y
        ) {
          rings.splice(index, 1)
          localGameState = 'won'
          setGameState('won')
          // Clear all obstacles for the romantic walk
          rocks = [];
          berries = [];
          rings = [];
        }
      })
      rings = rings.filter(ring => ring.x + ring.width > -100)

      // --- DRAW HUD ---
      if (hudCollect.width > 0) {
        ctx.drawImage(hudCollect, 40, 40, 150, 45);
        
        let startX = 210;
        // Draw 7 berries
        for (let i = 0; i < WINNING_SCORE; i++) {
          if (currentScore > i && hudBerryCol.width > 0) {
            ctx.drawImage(hudBerryCol, startX + i * 45, 45, 40, 40);
          } else if (hudBerryShadow.width > 0) {
            ctx.drawImage(hudBerryShadow, startX + i * 45, 45, 40, 40);
          }
        }
        
        // Draw ring at the end
        if (hudRingShadow.width > 0) {
          const ringHudX = startX + WINNING_SCORE * 45;
          if (localGameState === 'won' && ringImg.width > 0) {
            // Show the beautiful hand-drawn collected ring
            ctx.drawImage(ringImg, ringHudX, 38, 50, 50);
          } else {
            ctx.drawImage(hudRingShadow, ringHudX, 45, 40, 40);
          }
        }
      }

      if (pauseRef.current) {
        ctx.save()
        ctx.fillStyle = `rgba(0, 0, 0, ${PAUSE_OVERLAY_ALPHA})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 42px "Press Start 2P", Arial'
        ctx.textAlign = 'center'
        ctx.fillText('PAUSA', canvas.width / 2, canvas.height / 2 - 10)
        ctx.font = '18px Arial'
        ctx.fillText('Pulsa P o usa el botón para continuar', canvas.width / 2, canvas.height / 2 + 30)
        ctx.restore()
      }

      if (localGameState === 'gameover') {
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffd700'
        ctx.font = 'bold 42px "Press Start 2P", Arial'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillStyle = '#ffffff'
        ctx.font = '18px Arial'
        ctx.fillText(localGameOverReason || 'Has perdido.', canvas.width / 2, canvas.height / 2 + 20)
        ctx.restore()
      }

      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      soundtrack.pause()
    }
  }, [player])

  return (
    <div className="screen game-screen">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        onClick={handleCanvasClick}
        role="img"
        aria-label="Área de juego. Haz clic o presiona espacio para saltar"
        tabIndex={0}
        style={{ cursor: 'pointer', background: 'transparent' }}
      >
        Tu navegador no soporta canvas. Por favor usa un navegador moderno.
      </canvas>
      <div className="game-controls game-controls-right">
        <button type="button" className="control-btn" onClick={togglePause} aria-label={isPaused ? 'Reanudar juego' : 'Pausar juego'}>
          {isPaused ? 'Reanudar' : 'Pausa'}
        </button>
        <button type="button" className="control-btn" onClick={toggleSound} aria-label={soundOn ? 'Silenciar sonido' : 'Activar sonido'}>
          {soundOn ? 'Sonido ON' : 'Sonido OFF'}
        </button>
      </div>
      {(showContinue || gameState === 'gameover') && (
        <div className="game-over-overlay" style={{ top: '80%', padding: '20px' }}>
          {gameState === 'gameover' ? (
            <p style={{ color: '#2c3e50', margin: '0 0 12px', fontSize: '14px' }}>
              Vuelve a intentar
            </p>
          ) : null}
          <button
            type="button"
            className="ok-btn"
            onClick={() => (gameState === 'gameover' ? onRetry() : onEnd())}
            aria-label={gameState === 'gameover' ? 'Reintentar' : 'Continuar'}
          ></button>
        </div>
      )}
    </div>
  )
}
