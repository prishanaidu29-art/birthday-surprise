'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

/*
========================================================
  CLAR // SECRET ARCHIVE
  Y2K / CYBER / VHS / MYSTERY GAME START SCREEN

  FLOW:
  PASSWORD
      ↓
  LOADING
      ↓
  /birthday

  MEDIA:
  Put files inside:

  /public/birthday/
      photo1.jpg
      photo2.jpg
      photo3.jpg
      intro.mp3
      voice.mp3
      background.mp4

  Then change the filenames in MEDIA below.
========================================================
*/

const MEDIA = {
  photos: [
    '/birthday/photo1.jpg',
    '/birthday/photo2.jpg',
    '/birthday/photo3.jpg',
    '/birthday/photo4.jpg',
    '/birthday/photo5.jpg',
  ],

  music: '/birthday/intro.mp3',

  voice: '/birthday/voice.mp3',

  video: '/birthday/background.mp4',
}

const PASSWORD = 'clar'

const loadingMessages = [
  'INITIALISING ARCHIVE',
  'SEARCHING MEMORY FILES',
  'RECONSTRUCTING TIMELINE',
  'LOADING QUESTIONABLE DECISIONS',
  'RECOVERING LOST MEDIA',
  'ACCESSING CLAR_DATABASE',
  'ARCHIVE READY',
]

function GlitchText({ children, className = '' }) {
  return (
    <span className={`glitch ${className}`} data-text={children}>
      {children}
    </span>
  )
}

function Window({
  title,
  children,
  className = '',
  style = {},
  onClose,
  accent = 'purple',
}) {
  return (
    <div
      className={`retro-window ${accent} ${className}`}
      style={style}
    >
      <div className="window-bar">
        <div className="window-title">
          <span className="window-dot" />
          {title}
        </div>

        <div className="window-buttons">
          <span>_</span>
          <span>□</span>

          {onClose && (
            <button onClick={onClose}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="window-content">
        {children}
      </div>
    </div>
  )
}

function Photo({ src, index, className = '' }) {
  return (
    <div
      className={`photo-card ${className}`}
      style={{ '--photo-delay': `${index * 0.15}s` }}
    >
      <img
        src={src}
        alt={`memory ${index + 1}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />

      <div className="photo-fallback">
        <span>PHOTO_{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="photo-glare" />
    </div>
  )
}

function CDPlayer({ playing, setPlaying }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current
        .play()
        .catch(() => {
          // Browser may block autoplay.
          // User can press PLAY manually.
        })
    } else {
      audioRef.current.pause()
    }
  }, [playing])

  return (
    <div className="cd-player">
      <audio ref={audioRef} src={MEDIA.music} loop />

      <div className={`cd-disc ${playing ? 'spinning' : ''}`}>
        <div className="cd-ring ring-one" />
        <div className="cd-ring ring-two" />
        <div className="cd-ring ring-three" />

        <div className="cd-label">
          <span>CLAR</span>
          <small>ARCHIVE 001</small>
        </div>

        <div className="cd-hole" />
      </div>

      <div className="player-info">
        <div className="equalizer">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="track-name">
          NOW PLAYING
          <strong>birthday.exe</strong>
        </div>

        <button
          className="play-button"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? 'Ⅱ PAUSE' : '▶ PLAY'}
        </button>
      </div>
    </div>
  )
}

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [currentPhoto, setCurrentPhoto] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 5200

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const percentage = Math.min(
        100,
        Math.round((elapsed / duration) * 100)
      )

      setProgress(percentage)

      setMessageIndex(
        Math.min(
          loadingMessages.length - 1,
          Math.floor(percentage / 16)
        )
      )

      if (percentage >= 100) {
        clearInterval(timer)

        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    const photoTimer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % MEDIA.photos.length)
    }, 700)

    return () => clearInterval(photoTimer)
  }, [])

  return (
    <div className="loading-screen">

      {/* CRT scanlines */}
      <div className="scanlines" />

      {/* noise */}
      <div className="noise" />

      {/* background grid */}
      <div className="cyber-grid" />

      <div className="loading-top">
        <span>SYS://ARCHIVE_BOOT</span>
        <span>NO. 001</span>
      </div>

      <div className="loading-main">

        <div className="loading-side-code">
          <span>01001001</span>
          <span>10110110</span>
          <span>00101101</span>
          <span>11001001</span>
          <span>01101100</span>
          <span>10101010</span>
        </div>

        <div className="loading-photo-stack">
          {MEDIA.photos.map((photo, index) => (
            <Photo
              key={photo}
              src={photo}
              index={index}
              className={
                index === currentPhoto
                  ? 'active-loading-photo'
                  : ''
              }
            />
          ))}

          <div className="loading-photo-label">
            MEMORY
            <br />
            RECOVERY
          </div>
        </div>

        <div className="loading-center">

          <div className="loading-orb">
            <div className="orb-ring one" />
            <div className="orb-ring two" />
            <div className="orb-ring three" />

            <div className="orb-core">
              <span>CLAR</span>
              <small>SYS</small>
            </div>
          </div>

          <div className="loading-title">
            <GlitchText>ACCESSING</GlitchText>
            <br />
            <GlitchText>MEMORY ARCHIVE</GlitchText>
          </div>

          <div className="loading-status">
            <span>{loadingMessages[messageIndex]}</span>

            <div className="progress-shell">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-numbers">
              <span>DATA RECOVERY</span>
              <strong>{progress}%</strong>
            </div>
          </div>

        </div>

        <div className="loading-right-panel">

          <div className="terminal">
            <div>&gt; booting birthday.exe</div>
            <div>&gt; locating memories...</div>
            <div>&gt; photos found: {MEDIA.photos.length}</div>
            <div>&gt; emotional damage: HIGH</div>
            <div>&gt; friendship.exe: ACTIVE</div>
            <div className="terminal-blink">
              &gt; _
            </div>
          </div>

          <div className="loading-warning">
            <span>!</span>
            DO NOT INTERRUPT
          </div>

        </div>

      </div>

      <div className="loading-bottom">
        <div>
          CONNECTION
          <span className="signal-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>

        <GlitchText>
          PLEASE WAIT...
        </GlitchText>

        <div>
          {new Date().getFullYear()} // DVA
        </div>
      </div>

    </div>
  )
}

export default function HomePage() {
  const router = useRouter()

  const [screen, setScreen] = useState('password')
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [showMusic, setShowMusic] = useState(true)
  const [showPhotos, setShowPhotos] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [showFiles, setShowFiles] = useState(true)
  const [showRecorder, setShowRecorder] = useState(true)
  const [showVideo, setShowVideo] = useState(true)

  const [touchGlow, setTouchGlow] = useState({
    x: 50,
    y: 50,
  })

  const [bootText, setBootText] = useState('SYSTEM READY')

  const passwordInput = useRef(null)

  const photoSet = useMemo(
    () => MEDIA.photos.slice(0, 5),
    []
  )

  useEffect(() => {
    if (screen !== 'password') return

    passwordInput.current?.focus()
  }, [screen])

  useEffect(() => {
    if (screen !== 'desktop') return

    sessionStorage.setItem(
      'birthday_authenticated',
      'true'
    )
  }, [screen])

  const handlePassword = (e) => {
    e.preventDefault()

    if (
      password
        .trim()
        .toLowerCase() === PASSWORD.toLowerCase()
    ) {
      setWrongPassword(false)
      setScreen('loading')
    } else {
      setWrongPassword(true)

      setBootText('ACCESS DENIED')

      setTimeout(() => {
        setBootText('SYSTEM READY')
      }, 1800)
    }
  }

  const finishLoading = () => {
    setScreen('desktop')
  }

  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const clientX =
      e.touches?.[0]?.clientX ??
      e.clientX

    const clientY =
      e.touches?.[0]?.clientY ??
      e.clientY

    setTouchGlow({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    })
  }

  /*
  ======================================================
  LOADING SCREEN
  ======================================================
  */

  if (screen === 'loading') {
    return (
      <>
        <LoadingScreen
          onComplete={finishLoading}
        />

        <style jsx global>{styles}</style>
      </>
    )
  }

  /*
  ======================================================
  PASSWORD SCREEN
  ======================================================
  */

  if (screen === 'password') {
    return (
      <main
        className="password-screen"
        onMouseMove={handleTouch}
        onTouchMove={handleTouch}
        style={{
          '--mouse-x': `${touchGlow.x}%`,
          '--mouse-y': `${touchGlow.y}%`,
        }}
      >

        <div className="scanlines" />
        <div className="noise" />

        <div className="background-orb orb-a" />
        <div className="background-orb orb-b" />
        <div className="background-orb orb-c" />

        {/* tiny system header */}

        <div className="system-header">
          <div>
            <span className="status-light" />
            SYSTEM ONLINE
          </div>

          <div>
            VHS-2004
          </div>

          <div>
            MEMORY UNIT 001
          </div>
        </div>

        {/* floating fake desktop windows */}

        <Window
          title="NOTES.TXT"
          className="notes-window"
          style={{
            '--rotate': '-3deg',
          }}
          onClose={() => setShowNotes(false)}
        >
          {showNotes && (
            <div className="handwritten">
              <p>things to remember:</p>
              <p>— don't forget the birthday</p>
              <p>— don't expose us</p>
              <p>— too late</p>
              <p>— she's going to find this</p>

              <span className="scribble">
                !!! CLASSIFIED !!!
              </span>
            </div>
          )}
        </Window>

        <Window
          title="PHOTO_VIEWER.exe"
          className="photos-window"
          style={{
            '--rotate': '2deg',
          }}
          onClose={() => setShowPhotos(false)}
        >
          {showPhotos && (
            <div className="photo-collage">
              {photoSet.slice(0, 4).map(
                (photo, index) => (
                  <Photo
                    key={photo}
                    src={photo}
                    index={index}
                  />
                )
              )}

              <div className="collage-sticker">
                MEMORIES
              </div>
            </div>
          )}
        </Window>

        <Window
          title="FILESYSTEM"
          className="files-window"
          style={{
            '--rotate': '-1deg',
          }}
          onClose={() => setShowFiles(false)}
        >
          {showFiles && (
            <div className="mini-files">

              {[
                ['01', 'FEETGANG'],
                ['02', 'EGGS'],
                ['03', 'GRADUATION'],
                ['04', 'MEMORIES'],
                ['05', 'MESSAGES'],
              ].map(([num, name]) => (
                <button
                  key={name}
                  className="mini-folder"
                  onClick={() => {
                    setBootText(`${name}.DAT`)
                  }}
                >
                  <div className="folder-icon">
                    📁
                  </div>

                  <span>
                    {name}
                  </span>

                  <small>
                    FILE_{num}
                  </small>
                </button>
              ))}

            </div>
          )}
        </Window>

        <Window
          title="VIDEO_CAPTURE.avi"
          className="video-window"
          style={{
            '--rotate': '1.5deg',
          }}
          onClose={() => setShowVideo(false)}
        >
          {showVideo && (
            <div className="video-container">

              <video
                src={MEDIA.video}
                autoPlay
                muted
                loop
                playsInline
              />

              <div className="video-overlay">
                REC ●
              </div>

              <div className="video-time">
                00:19:11:04
              </div>

            </div>
          )}
        </Window>

        <Window
          title="VOICE_MEMO.wav"
          className="recorder-window"
          style={{
            '--rotate': '-2deg',
          }}
          onClose={() => setShowRecorder(false)}
        >
          {showRecorder && (
            <div className="recorder">

              <div className="waveform">
                {Array.from({
                  length: 32,
                }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      height:
                        `${15 + Math.random() * 65}%`,
                    }}
                  />
                ))}
              </div>

              <div className="recording-meta">
                <span>
                  FRIEND_01
                </span>

                <span>
                  00:27
                </span>
              </div>

              <audio
                controls
                src={MEDIA.voice}
              />

            </div>
          )}
        </Window>

        {/* CD */}

        <div className="floating-cd">
          <CDPlayer
            playing={playing}
            setPlaying={setPlaying}
          />
        </div>

        {/* main access terminal */}

        <div className="access-terminal">

          <div className="terminal-top">

            <div className="terminal-logo">
              <span className="logo-glow">
                ◆
              </span>

              <span>
                DVA_ARCHIVE
              </span>
            </div>

            <div className="terminal-code">
              19 / 11 / 04
            </div>

          </div>

          <div className="terminal-body">

            <div className="tiny-warning">
              <span>
                UNAUTHORIZED PERSONNEL
              </span>

              <span>
                [CLASSIFIED]
              </span>
            </div>

            <div className="intro-message">
              <GlitchText>
                yayyy happy birthday Clar
              </GlitchText>

              <p>
                if you see this it means the website
                is working
                <span className="red-text">
                  {' '}(thank god)
                </span>
              </p>

              <p>
                now you just need to enter the password
                to enter.
              </p>

              <p className="good-luck">
                good luck !
              </p>
            </div>

            <div className="password-label">
              ENTER ACCESS CODE
            </div>

            <form
              onSubmit={handlePassword}
              className="password-form"
            >

              <div className="input-wrap">

                <span className="input-prefix">
                  &gt;_
                </span>

                <input
                  ref={passwordInput}
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="PASSWORD"
                  autoComplete="off"
                />

                <span className="cursor-block">
                  █
                </span>

              </div>

              <button
                type="submit"
                className="enter-button"
              >
                ENTER
              </button>

            </form>

            <div className="system-message">
              <span className={
                wrongPassword
                  ? 'danger'
                  : ''
              }>
                {bootText}
              </span>

              <span className="blinking">
                _
              </span>
            </div>

          </div>

          <div className="terminal-bottom">

            <span>
              CONNECTION: SECURE
            </span>

            <span>
              PORT 1999
            </span>

            <span>
              ● ● ●
            </span>

          </div>

        </div>

        {/* wrong password hint */}

        {wrongPassword && (
          <div className="hint-window">

            <div className="hint-bar">
              <span>
                SYSTEM_MESSAGE
              </span>

              <button
                onClick={() =>
                  setWrongPassword(false)
                }
              >
                ×
              </button>
            </div>

            <div className="hint-content">

              <div className="warning-symbol">
                !
              </div>

              <div>
                <strong>
                  ACCESS DENIED
                </strong>

                <p>
                  okay fine...
                  <br />
                  here's a hint:
                </p>

                <div className="hint-answer">
                  “it’s your nickname”
                </div>
              </div>

            </div>

          </div>
        )}

        {/* bottom HUD */}

        <div className="bottom-hud">

          <span>
            VHS://1999
          </span>

          <div className="hud-line" />

          <span>
            DO NOT DISTRIBUTE
          </span>

          <span>
            MEMORY 001
          </span>

        </div>

        <style jsx global>
          {styles}
        </style>

      </main>
    )
  }

  /*
  ======================================================
  DESKTOP FALLBACK
  ======================================================

  The actual birthday archive remains your existing
  /birthday page.

  We route there once authentication/loading finishes.
  ======================================================
  */

  router.push('/birthday')

  return null
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Space+Mono:wght@400;700&display=swap');

/* =====================================================
   ROOT
===================================================== */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #080611;
}

button,
input {
  font: inherit;
}

body {
  overflow-x: hidden;
}

/* =====================================================
   GLOBAL CRT
===================================================== */

.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.025) 0px,
      rgba(255,255,255,0.025) 1px,
      transparent 1px,
      transparent 4px
    );

  mix-blend-mode: overlay;
}

.noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;

  opacity: .11;

  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");

  animation: noiseMove .15s steps(2) infinite;
}

@keyframes noiseMove {
  0% { transform: translate(0,0); }
  25% { transform: translate(2px,-1px); }
  50% { transform: translate(-1px,2px); }
  75% { transform: translate(1px,1px); }
  100% { transform: translate(0,0); }
}

/* =====================================================
   PASSWORD SCREEN
===================================================== */

.password-screen {
  min-height: 100svh;
  position: relative;
  overflow: hidden;

  color: #e9e2ff;

  background:
    radial-gradient(
      circle at var(--mouse-x) var(--mouse-y),
      rgba(164,126,255,.25),
      transparent 30%
    ),
    radial-gradient(
      circle at 70% 20%,
      rgba(91,64,180,.28),
      transparent 32%
    ),
    radial-gradient(
      circle at 15% 80%,
      rgba(65,29,120,.45),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #090614,
      #161027 48%,
      #090711
    );

  font-family: 'Share Tech Mono', monospace;
}

.password-screen::before {
  content: '';

  position: fixed;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      transparent 49.8%,
      rgba(165,124,255,.08) 50%,
      transparent 50.2%
    ),
    linear-gradient(
      transparent 49.8%,
      rgba(165,124,255,.06) 50%,
      transparent 50.2%
    );

  background-size: 80px 80px;

  pointer-events: none;
}

/* =====================================================
   BACKGROUND ORBS
===================================================== */

.background-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(4px);
  pointer-events: none;
}

.orb-a {
  width: 280px;
  height: 280px;
  left: -100px;
  top: 25%;
  background: rgba(119,73,255,.22);
  animation: orbFloat 7s ease-in-out infinite;
}

.orb-b {
  width: 220px;
  height: 220px;
  right: 4%;
  bottom: -60px;
  background: rgba(192,71,255,.16);
  animation: orbFloat 9s ease-in-out infinite reverse;
}

.orb-c {
  width: 100px;
  height: 100px;
  right: 30%;
  top: 10%;
  background: rgba(76,208,255,.1);
  animation: orbFloat 5s ease-in-out infinite;
}

@keyframes orbFloat {
  0%,100% {
    transform: translate(0,0);
  }

  50% {
    transform: translate(20px,-30px);
  }
}

/* =====================================================
   SYSTEM HEADER
===================================================== */

.system-header {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 14px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #756d9d;

  font-size: 9px;
  letter-spacing: .2em;

  z-index: 30;
}

.status-light {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 7px;

  border-radius: 50%;

  background: #9cffc3;

  box-shadow:
    0 0 8px #9cffc3;

  animation: blinkLight 1.2s infinite;
}

@keyframes blinkLight {
  50% {
    opacity: .25;
  }
}

/* =====================================================
   RETRO WINDOWS
===================================================== */

.retro-window {
  position: absolute;

  background:
    linear-gradient(
      145deg,
      rgba(31,24,53,.96),
      rgba(14,11,26,.96)
    );

  border: 1px solid rgba(169,135,255,.45);

  box-shadow:
    0 0 0 1px rgba(0,0,0,.5),
    0 15px 50px rgba(0,0,0,.5),
    0 0 30px rgba(117,79,255,.12);

  backdrop-filter: blur(8px);

  transform: rotate(var(--rotate));

  z-index: 5;

  animation:
    windowAppear .7s ease backwards,
    windowFloat 6s ease-in-out infinite;
}

@keyframes windowAppear {
  from {
    opacity: 0;
    transform:
      scale(.8)
      rotate(var(--rotate));
  }

  to {
    opacity: 1;
    transform:
      scale(1)
      rotate(var(--rotate));
  }
}

@keyframes windowFloat {
  0%,100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -7px;
  }
}

.window-bar {
  height: 26px;

  padding: 0 7px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background:
    linear-gradient(
      90deg,
      #39246d,
      #24173f
    );

  border-bottom: 1px solid rgba(189,157,255,.3);

  font-size: 9px;
  letter-spacing: .12em;
}

.window-title {
  display: flex;
  gap: 6px;
  align-items: center;

  color: #d8cfff;
}

.window-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #b892ff;

  box-shadow:
    0 0 8px #a76cff;
}

.window-buttons {
  display: flex;
  gap: 4px;

  color: #80769d;
}

.window-buttons span,
.window-buttons button {
  width: 15px;
  height: 15px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(255,255,255,.12);

  background: rgba(0,0,0,.3);

  color: inherit;

  font-size: 8px;
}

.window-buttons button {
  cursor: pointer;
}

.window-content {
  padding: 9px;
}

/* =====================================================
   WINDOW POSITIONS
===================================================== */

.notes-window {
  width: 225px;
  left: 4%;
  top: 12%;
}

.photos-window {
  width: 330px;
  left: 5%;
  bottom: 9%;
}

.files-window {
  width: 245px;
  right: 4%;
  top: 13%;
}

.video-window {
  width: 280px;
  right: 7%;
  bottom: 12%;
}

.recorder-window {
  width: 260px;
  left: 29%;
  bottom: 5%;
}

/* =====================================================
   NOTES
===================================================== */

.handwritten {
  position: relative;

  min-height: 140px;

  padding: 10px;

  background:
    repeating-linear-gradient(
      transparent 0,
      transparent 22px,
      rgba(143,117,191,.12) 23px
    );

  color: #c7b6e8;

  font-family: 'VT323', monospace;

  font-size: 17px;

  transform: rotate(-1deg);
}

.handwritten p {
  margin: 0 0 5px;
}

.scribble {
  display: block;

  margin-top: 10px;

  color: #d875ff;

  font-size: 15px;

  transform: rotate(-5deg);
}

/* =====================================================
   PHOTOS
===================================================== */

.photo-collage {
  height: 205px;

  position: relative;
}

.photo-card {
  position: relative;

  overflow: hidden;

  background: #15111e;

  border: 4px solid #eee8ff;

  box-shadow:
    0 8px 18px rgba(0,0,0,.5);

  width: 88px;
  height: 100px;

  animation:
    photoFloat 4s ease-in-out infinite;

  animation-delay: var(--photo-delay);
}

.photo-card img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  filter:
    saturate(.85)
    contrast(1.08);
}

.photo-fallback {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  background:
    linear-gradient(
      135deg,
      #2b1e45,
      #111
    );

  color: #746a91;

  font-size: 8px;
  letter-spacing: .1em;
}

.photo-card:nth-child(1) {
  position: absolute;
  left: 5px;
  top: 10px;
  transform: rotate(-8deg);
}

.photo-card:nth-child(2) {
  position: absolute;
  left: 65px;
  top: 35px;
  transform: rotate(5deg);
}

.photo-card:nth-child(3) {
  position: absolute;
  left: 135px;
  top: 3px;
  transform: rotate(-3deg);
}

.photo-card:nth-child(4) {
  position: absolute;
  left: 195px;
  top: 40px;
  transform: rotate(8deg);
}

.photo-glare {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      115deg,
      transparent 35%,
      rgba(255,255,255,.3) 50%,
      transparent 65%
    );

  transform: translateX(-120%);

  animation: photoGlare 5s infinite;
}

@keyframes photoGlare {
  0%,70% {
    transform: translateX(-120%);
  }

  85%,100% {
    transform: translateX(120%);
  }
}

@keyframes photoFloat {
  0%,100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -4px;
  }
}

.collage-sticker {
  position: absolute;

  right: 15px;
  bottom: 0;

  padding: 5px 8px;

  background: #a873ff;

  color: #0b0713;

  font-size: 8px;

  transform: rotate(-7deg);

  box-shadow:
    0 0 12px rgba(168,115,255,.6);
}

/* =====================================================
   FILES
===================================================== */

.mini-files {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;
}

.mini-folder {
  border: 0;

  background: transparent;

  color: #a99cbe;

  cursor: pointer;

  text-align: center;

  padding: 4px;

  transition:
    transform .2s,
    color .2s;
}

.mini-folder:hover,
.mini-folder:active {
  transform: translateY(-5px) rotate(-2deg);

  color: #e1d6ff;
}

.folder-icon {
  font-size: 27px;

  filter:
    drop-shadow(
      0 0 8px
      rgba(177,123,255,.4)
    );
}

.mini-folder span {
  display: block;

  font-size: 8px;

  letter-spacing: .04em;
}

.mini-folder small {
  display: block;

  margin-top: 3px;

  color: #5f5675;

  font-size: 6px;
}

/* =====================================================
   VIDEO
===================================================== */

.video-container {
  position: relative;

  height: 145px;

  background: #000;

  overflow: hidden;
}

.video-container video {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: .75;

  filter:
    saturate(.65)
    contrast(1.2);
}

.video-overlay {
  position: absolute;

  top: 7px;
  left: 7px;

  color: #ff6b8b;

  font-size: 8px;

  text-shadow:
    0 0 8px #ff416c;

  animation: recordBlink 1s infinite;
}

@keyframes recordBlink {
  50% {
    opacity: .3;
  }
}

.video-time {
  position: absolute;

  right: 7px;
  bottom: 6px;

  color: white;

  font-size: 7px;
}

/* =====================================================
   RECORDER
===================================================== */

.recorder {
  padding: 6px;
}

.waveform {
  height: 65px;

  display: flex;
  align-items: center;
  gap: 3px;

  padding: 5px;

  background: #08060d;

  border: 1px solid #35274e;
}

.waveform span {
  flex: 1;

  background:
    linear-gradient(
      to top,
      #8b5cff,
      #e68aff
    );

  box-shadow:
    0 0 5px rgba(151,95,255,.6);

  animation:
    wave 1s ease-in-out infinite alternate;
}

.waveform span:nth-child(2n) {
  animation-delay: .2s;
}

.waveform span:nth-child(3n) {
  animation-delay: .4s;
}

@keyframes wave {
  from {
    transform: scaleY(.45);
  }

  to {
    transform: scaleY(1.15);
  }
}

.recording-meta {
  display: flex;
  justify-content: space-between;

  margin: 8px 0;

  color: #827693;

  font-size: 8px;
}

/* =====================================================
   ACCESS TERMINAL
===================================================== */

.access-terminal {
  position: absolute;

  z-index: 20;

  width: min(510px, 82vw);

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  background:
    linear-gradient(
      145deg,
      rgba(21,15,37,.97),
      rgba(8,6,15,.98)
    );

  border: 1px solid #8c68c7;

  box-shadow:
    0 0 0 1px #251c37,
    0 0 30px rgba(145,91,255,.25),
    0 30px 100px rgba(0,0,0,.7);

  animation:
    terminalIn .8s cubic-bezier(.2,.8,.2,1);
}

@keyframes terminalIn {
  from {
    opacity: 0;
    transform:
      translate(-50%,-47%)
      scale(.9);
  }

  to {
    opacity: 1;
    transform:
      translate(-50%,-50%)
      scale(1);
  }
}

.terminal-top,
.terminal-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 13px;

  color: #75698e;

  font-size: 8px;

  letter-spacing: .12em;
}

.terminal-top {
  border-bottom: 1px solid #302641;
}

.terminal-bottom {
  border-top: 1px solid #302641;
}

.terminal-logo {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #bda5ed;
}

.logo-glow {
  color: #c07bff;

  text-shadow:
    0 0 10px #b65dff;
}

.terminal-body {
  padding: 26px;
}

.tiny-warning {
  display: flex;
  justify-content: space-between;

  margin-bottom: 20px;

  color: #625871;

  font-size: 7px;

  letter-spacing: .16em;
}

.intro-message {
  color: #c8bfd7;

  font-family: 'VT323', monospace;

  font-size: 23px;

  line-height: 1.1;
}

.intro-message p {
  margin: 5px 0;

  color: #9489a5;

  font-size: 17px;
}

.red-text {
  color: #ff739b;
}

.good-luck {
  margin-top: 13px !important;

  color: #c993ff !important;

  text-shadow:
    0 0 8px rgba(201,147,255,.5);
}

.password-label {
  margin-top: 27px;
  margin-bottom: 7px;

  color: #756b87;

  font-size: 8px;

  letter-spacing: .2em;
}

.password-form {
  display: flex;

  gap: 8px;
}

.input-wrap {
  flex: 1;

  display: flex;
  align-items: center;

  padding: 0 10px;

  height: 44px;

  background: #08060d;

  border: 1px solid #403355;

  box-shadow:
    inset 0 0 15px rgba(113,67,187,.08);

  transition:
    border .2s,
    box-shadow .2s;
}

.input-wrap:focus-within {
  border-color: #ad7aff;

  box-shadow:
    0 0 18px rgba(159,101,255,.2),
    inset 0 0 15px rgba(113,67,187,.12);
}

.input-prefix {
  color: #a776ff;

  margin-right: 8px;
}

.input-wrap input {
  width: 100%;

  border: 0;
  outline: 0;

  background: transparent;

  color: #eee5ff;

  font-family: 'Share Tech Mono', monospace;

  letter-spacing: .15em;

  font-size: 13px;
}

.input-wrap input::placeholder {
  color: #494158;
}

.cursor-block {
  color: #ae76ff;

  animation:
    cursorBlink .8s infinite;
}

@keyframes cursorBlink {
  50% {
    opacity: 0;
  }
}

.enter-button {
  width: 90px;

  border: 1px solid #a471ff;

  background:
    linear-gradient(
      135deg,
      #7444c7,
      #a75cf0
    );

  color: white;

  cursor: pointer;

  font-size: 9px;

  letter-spacing: .1em;

  box-shadow:
    0 0 15px rgba(157,87,255,.3);

  transition:
    transform .15s,
    box-shadow .15s;
}

.enter-button:hover,
.enter-button:active {
  transform: translateY(-2px);

  box-shadow:
    0 0 25px rgba(172,104,255,.55);
}

.system-message {
  margin-top: 10px;

  color: #4f4760;

  font-size: 8px;

  letter-spacing: .1em;
}

.system-message .danger {
  color: #ff668d;

  text-shadow:
    0 0 8px rgba(255,75,120,.5);
}

.blinking {
  animation:
    cursorBlink .7s infinite;
}

/* =====================================================
   HINT
===================================================== */

.hint-window {
  position: fixed;

  z-index: 100;

  left: 50%;
  top: 50%;

  width: 260px;

  transform:
    translate(-50%, -50%)
    rotate(1deg);

  background:
    #130e1f;

  border:
    1px solid #ff6e9a;

  box-shadow:
    0 0 30px rgba(255,62,128,.3),
    0 20px 60px rgba(0,0,0,.7);

  animation:
    hintPop .25s ease-out;
}

@keyframes hintPop {
  from {
    opacity: 0;
    transform:
      translate(-50%,-50%)
      scale(.8)
      rotate(5deg);
  }

  to {
    opacity: 1;
    transform:
      translate(-50%,-50%)
      scale(1)
      rotate(1deg);
  }
}

.hint-bar {
  display: flex;
  justify-content: space-between;

  padding: 8px 10px;

  background:
    #4c2140;

  color: #ffc1d5;

  font-size: 8px;
}

.hint-bar button {
  border: 0;
  background: transparent;

  color: #ffc1d5;

  cursor: pointer;

  font-size: 15px;
}

.hint-content {
  display: flex;

  gap: 14px;

  padding: 18px;

  color: #c6b9d5;

  font-size: 10px;
}

.warning-symbol {
  width: 32px;
  height: 32px;

  flex: 0 0 auto;

  display: grid;
  place-items: center;

  background: #ff668e;

  color: #180712;

  font-size: 20px;
  font-weight: bold;

  box-shadow:
    0 0 15px rgba(255,82,133,.45);
}

.hint-content strong {
  color: #ff9cb8;

  font-size: 11px;
}

.hint-content p {
  color: #766b80;
}

.hint-answer {
  margin-top: 8px;

  color: #d3a2ff;

  font-family: 'VT323', monospace;

  font-size: 18px;
}

/* =====================================================
   CD PLAYER
===================================================== */

.floating-cd {
  position: absolute;

  right: 24%;
  top: 8%;

  z-index: 8;
}

.cd-player {
  display: flex;
  align-items: center;

  gap: 13px;
}

.cd-disc {
  width: 125px;
  height: 125px;

  position: relative;

  border-radius: 50%;

  background:
    conic-gradient(
      #26212f,
      #8b7f9d,
      #30283c,
      #c6b4dd,
      #27212f,
      #8d78aa,
      #26212f
    );

  border: 2px solid rgba(255,255,255,.15);

  box-shadow:
    0 0 20px rgba(155,99,255,.22),
    inset 0 0 15px rgba(255,255,255,.15);
}

.cd-disc.spinning {
  animation:
    cdSpin 2.2s linear infinite;
}

@keyframes cdSpin {
  to {
    transform: rotate(360deg);
  }
}

.cd-ring {
  position: absolute;

  inset: 12px;

  border-radius: 50%;

  border: 1px solid rgba(255,255,255,.25);
}

.ring-two {
  inset: 26px;
}

.ring-three {
  inset: 42px;
}

.cd-label {
  position: absolute;

  inset: 44px;

  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle,
      #a47aff,
      #4e327f
    );

  color: white;

  font-family: 'VT323', monospace;

  text-align: center;

  font-size: 13px;

  box-shadow:
    0 0 15px rgba(170,110,255,.4);
}

.cd-label small {
  font-size: 6px;
}

.cd-hole {
  position: absolute;

  width: 7px;
  height: 7px;

  left: 50%;
  top: 50%;

  transform: translate(-50%,-50%);

  border-radius: 50%;

  background: #080611;

  border: 1px solid #d9caff;
}

.player-info {
  width: 110px;
}

.equalizer {
  display: flex;

  align-items: flex-end;

  height: 28px;

  gap: 3px;

  margin-bottom: 7px;
}

.equalizer i {
  width: 4px;

  background: #a976ff;

  animation:
    equalizer 1s ease-in-out infinite alternate;
}

.equalizer i:nth-child(1) { height: 40%; }
.equalizer i:nth-child(2) { height: 80%; animation-delay: .1s; }
.equalizer i:nth-child(3) { height: 60%; animation-delay: .2s; }
.equalizer i:nth-child(4) { height: 100%; animation-delay: .3s; }
.equalizer i:nth-child(5) { height: 50%; animation-delay: .4s; }
.equalizer i:nth-child(6) { height: 85%; animation-delay: .5s; }
.equalizer i:nth-child(7) { height: 30%; animation-delay: .6s; }

@keyframes equalizer {
  to {
    transform: scaleY(.25);
  }
}

.track-name {
  color: #675d78;

  font-size: 7px;
  letter-spacing: .1em;
}

.track-name strong {
  display: block;

  margin-top: 3px;

  color: #c4b0e8;

  font-size: 10px;
}

.play-button {
  margin-top: 9px;

  border: 1px solid #60458e;

  padding: 5px 8px;

  background: #160f24;

  color: #b89bdf;

  cursor: pointer;

  font-size: 7px;

  letter-spacing: .1em;
}

/* =====================================================
   GLITCH TEXT
===================================================== */

.glitch {
  position: relative;

  display: inline-block;

  color: #e8dcff;

  text-shadow:
    2px 0 #ff4f91,
    -2px 0 #52dfff;

  animation:
    glitchFlicker 3.7s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);

  position: absolute;

  left: 0;
  top: 0;

  width: 100%;

  overflow: hidden;

  opacity: 0;

  pointer-events: none;
}

.glitch::before {
  color: #ff3d86;

  animation:
    glitchTop 4s infinite;
}

.glitch::after {
  color: #44e6ff;

  animation:
    glitchBottom 4s infinite;
}

@keyframes glitchFlicker {
  0%,88%,100% {
    opacity: 1;
  }

  89% {
    opacity: .4;
  }

  90% {
    opacity: 1;
  }

  92% {
    opacity: .2;
  }

  93% {
    opacity: 1;
  }
}

@keyframes glitchTop {
  0%,90%,100% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    transform: translateX(0);
  }

  91% {
    opacity: 1;
    clip-path: inset(10% 0 70% 0);
    transform: translateX(-5px);
  }

  92% {
    opacity: 1;
    clip-path: inset(30% 0 45% 0);
    transform: translateX(4px);
  }

  93% {
    opacity: 0;
  }
}

@keyframes glitchBottom {
  0%,93%,100% {
    opacity: 0;
    clip-path: inset(100% 0 0 0);
    transform: translateX(0);
  }

  94% {
    opacity: 1;
    clip-path: inset(55% 0 20% 0);
    transform: translateX(5px);
  }

  95% {
    opacity: 1;
    clip-path: inset(70% 0 5% 0);
    transform: translateX(-4px);
  }

  96% {
    opacity: 0;
  }
}

/* =====================================================
   BOTTOM HUD
===================================================== */

.bottom-hud {
  position: absolute;

  left: 20px;
  right: 20px;
  bottom: 12px;

  z-index: 30;

  display: flex;
  align-items: center;

  gap: 12px;

  color: #5c526f;

  font-size: 7px;

  letter-spacing: .15em;
}

.hud-line {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      #332a43,
      transparent
    );
}

/* =====================================================
   LOADING SCREEN
===================================================== */

.loading-screen {
  min-height: 100svh;

  position: relative;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  color: #e8dcff;

  background:
    radial-gradient(
      circle at 50% 50%,
      #25164b 0%,
      #0e0a1c 40%,
      #05040b 100%
    );

  font-family: 'Share Tech Mono', monospace;
}

.cyber-grid {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      rgba(138,92,255,.08) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(138,92,255,.08) 1px,
      transparent 1px
    );

  background-size: 45px 45px;

  transform:
    perspective(400px)
    rotateX(58deg)
    scale(1.8);

  transform-origin:
    center bottom;

  animation:
    gridMove 4s linear infinite;
}

@keyframes gridMove {
  from {
    background-position:
      0 0,
      0 0;
  }

  to {
    background-position:
      0 45px,
      45px 0;
  }
}

.loading-top,
.loading-bottom {
  position: relative;

  z-index: 10;

  display: flex;
  justify-content: space-between;

  padding: 15px 20px;

  color: #766a91;

  font-size: 8px;

  letter-spacing: .18em;
}

.loading-main {
  flex: 1;

  position: relative;

  z-index: 5;

  display: grid;

  grid-template-columns:
    120px
    1fr
    190px;

  align-items: center;

  gap: 30px;

  width: min(1100px, 92vw);

  margin: auto;
}

.loading-side-code {
  display: flex;
  flex-direction: column;

  gap: 13px;

  color: #4f426a;

  font-size: 8px;

  line-height: 1;
}

.loading-photo-stack {
  position: relative;

  width: 105px;
  height: 135px;
}

.loading-photo-stack .photo-card {
  position: absolute;

  left: 0 !important;
  top: 0 !important;

  width: 105px;
  height: 135px;

  opacity: 0;

  transform:
    rotate(
      calc(
        (var(--photo-delay) * 30deg)
      )
    )
    scale(.8);

  transition:
    opacity .25s,
    transform .25s;
}

.loading-photo-stack
.photo-card.active-loading-photo {
  opacity: 1;

  transform:
    rotate(-4deg)
    scale(1.04);

  z-index: 5;
}

.loading-photo-label {
  position: absolute;

  right: -60px;
  bottom: -15px;

  padding: 7px;

  background: #9e68ff;

  color: #100817;

  font-size: 7px;

  line-height: 1.3;

  transform: rotate(-8deg);

  box-shadow:
    0 0 18px rgba(164,102,255,.5);
}

.loading-center {
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;
}

.loading-orb {
  position: relative;

  width: 150px;
  height: 150px;

  margin-bottom: 30px;
}

.orb-ring {
  position: absolute;

  inset: 0;

  border-radius: 50%;

  border: 1px solid rgba(181,130,255,.4);

  box-shadow:
    0 0 20px rgba(148,87,255,.2);
}

.orb-ring.one {
  animation:
    orbSpin 4s linear infinite;
}

.orb-ring.two {
  inset: 15px;

  border-style: dashed;

  animation:
    orbSpin 7s linear infinite reverse;
}

.orb-ring.three {
  inset: 30px;

  border-color: #c873ff;

  animation:
    orbSpin 3s linear infinite;
}

@keyframes orbSpin {
  to {
    transform: rotate(360deg);
  }
}

.orb-core {
  position: absolute;

  inset: 47px;

  border-radius: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle,
      #b777ff,
      #5d2a9a
    );

  color: white;

  box-shadow:
    0 0 35px rgba(177,96,255,.7);

  animation:
    corePulse 1.8s ease-in-out infinite;
}

@keyframes corePulse {
  50% {
    transform: scale(1.12);

    box-shadow:
      0 0 60px rgba(177,96,255,.9);
  }
}

.orb-core span {
  font-family: 'VT323', monospace;

  font-size: 14px;
}

.orb-core small {
  font-size: 5px;
}

.loading-title {
  font-family: 'VT323', monospace;

  font-size: clamp(30px, 5vw, 55px);

  line-height: .8;

  letter-spacing: .04em;
}

.loading-status {
  width: min(460px, 90vw);

  margin-top: 30px;
}

.loading-status > span {
  display: block;

  margin-bottom: 8px;

  color: #a98bc8;

  font-size: 8px;

  letter-spacing: .2em;
}

.progress-shell {
  height: 8px;

  padding: 1px;

  border: 1px solid #55406e;

  background: #0a0710;
}

.progress-fill {
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #7141d5,
      #c56cff,
      #55e9ff
    );

  box-shadow:
    0 0 15px rgba(178,101,255,.7);

  transition:
    width .05s linear;
}

.progress-numbers {
  display: flex;
  justify-content: space-between;

  margin-top: 6px;

  color: #5e536e;

  font-size: 7px;
}

.progress-numbers strong {
  color: #bc91ff;
}

.loading-right-panel {
  display: flex;
  flex-direction: column;

  gap: 15px;
}

.terminal {
  padding: 12px;

  border: 1px solid #302440;

  background:
    rgba(5,4,9,.75);

  color: #6f6382;

  font-size: 7px;

  line-height: 1.9;

  box-shadow:
    inset 0 0 20px rgba(128,77,210,.06);
}

.terminal div:nth-child(3),
.terminal div:nth-child(5) {
  color: #a078d0;
}

.terminal-blink {
  color: #c78dff !important;

  animation:
    cursorBlink .7s infinite;
}

.loading-warning {
  padding: 10px;

  border: 1px solid #6b3557;

  color: #d67ca0;

  font-size: 7px;

  letter-spacing: .12em;

  animation:
    warningPulse 1.5s infinite;
}

.loading-warning span {
  display: inline-grid;

  place-items: center;

  width: 14px;
  height: 14px;

  margin-right: 5px;

  background: #d85d8d;

  color: #190811;
}

@keyframes warningPulse {
  50% {
    opacity: .5;
  }
}

.signal-bars {
  display: inline-flex;

  align-items: flex-end;

  gap: 2px;

  margin-left: 5px;
}

.signal-bars i {
  display: block;

  width: 3px;

  background: #8d6aff;
}

.signal-bars i:nth-child(1) { height: 4px; }
.signal-bars i:nth-child(2) { height: 7px; }
.signal-bars i:nth-child(3) { height: 10px; }
.signal-bars i:nth-child(4) { height: 13px; }
.signal-bars i:nth-child(5) { height: 16px; }

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 850px) {

  .retro-window {
    transform:
      scale(.82)
      rotate(var(--rotate));

    transform-origin: center;
  }

  .notes-window {
    left: -25px;
    top: 8%;
  }

  .photos-window {
    left: -35px;
    bottom: 8%;
  }

  .files-window {
    right: -35px;
    top: 10%;
  }

  .video-window {
    right: -40px;
    bottom: 10%;
  }

  .recorder-window {
    left: 50%;
    transform:
      translateX(-50%)
      scale(.82)
      rotate(var(--rotate));
  }

  .floating-cd {
    right: 4%;
    top: 4%;
    transform: scale(.7);
    transform-origin: top right;
  }

  .access-terminal {
    width: 88vw;
  }

  .terminal-body {
    padding: 20px;
  }

  .intro-message {
    font-size: 20px;
  }

  .intro-message p {
    font-size: 15px;
  }

  .loading-main {
    grid-template-columns: 1fr;

    justify-items: center;

    gap: 15px;
  }

  .loading-side-code,
  .loading-right-panel {
    display: none;
  }

  .loading-photo-stack {
    display: block;

    width: 90px;
    height: 105px;

    transform: scale(.7);
  }

  .loading-orb {
    width: 115px;
    height: 115px;

    margin-bottom: 15px;
  }

  .orb-core {
    inset: 35px;
  }

  .loading-title {
    font-size: 32px;
  }

  .loading-status {
    margin-top: 20px;
  }

  .system-header div:nth-child(2) {
    display: none;
  }

  .bottom-hud span:nth-child(2) {
    display: none;
  }
}

@media (max-width: 520px) {

  .system-header {
    font-size: 7px;
  }

  .access-terminal {
    width: 91vw;
  }

  .terminal-body {
    padding: 17px;
  }

  .tiny-warning {
    font-size: 6px;
  }

  .password-form {
    flex-direction: column;
  }

  .enter-button {
    width: 100%;
    height: 40px;
  }

  .floating-cd {
    opacity: .7;

    transform:
      scale(.55);

    transform-origin:
      top right;
  }

  .notes-window {
    opacity: .75;
  }

  .video-window {
    opacity: .7;
  }

  .recorder-window {
    opacity: .65;
  }

  .photos-window {
    opacity: .75;
  }

  .files-window {
    opacity: .8;
  }

  .bottom-hud {
    font-size: 6px;
  }
}

/* =====================================================
   REDUCED MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`
