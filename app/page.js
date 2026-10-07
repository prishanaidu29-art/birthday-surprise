'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const [phase, setPhase] = useState('login')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [bootLine, setBootLine] = useState(0)
  const [clock, setClock] = useState('')
  const [cdSpin, setCdSpin] = useState(true)
  const audioRef = useRef(null)

  /*
    ============================================================
    CHANGE THESE
    ============================================================
  */

  const CORRECT_PASSWORD = 'clar'

  // Put your song inside:
  // public/music/birthday-song.mp3
  //
  // Then leave this as-is.
  const SONG = '/music/birthday-song.mp3'

  /*
    ============================================================
    CLOCK
    ============================================================
  */

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()

      setClock(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateClock()

    const timer = setInterval(updateClock, 1000)

    return () => clearInterval(timer)
  }, [])

  /*
    ============================================================
    BOOT / LOADING
    ============================================================
  */

  useEffect(() => {
    if (phase !== 'loading') return

    const messages = [
      'INITIALIZING ARCHIVE...',
      'SEARCHING MEMORY SECTOR...',
      'MOUNTING PERSONAL FILES...',
      'LOADING IMAGE CACHE...',
      'REWINDING VHS TAPE...',
      'CHECKING CD-ROM...',
      'RECOVERING QUESTIONABLE DECISIONS...',
      'ARCHIVE ACCESS GRANTED.',
    ]

    let current = 0

    const interval = setInterval(() => {
      current++

      if (current < messages.length) {
        setBootLine(current)
      } else {
        clearInterval(interval)

        setTimeout(() => {
          sessionStorage.setItem('birthday_authenticated', 'true')
          router.push('/birthday')
        }, 900)
      }
    }, 480)

    return () => clearInterval(interval)
  }, [phase, router])

  /*
    ============================================================
    PASSWORD
    ============================================================
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password.trim().toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      setError('')
      setPhase('loading')

      // Try to start music after user interaction.
      if (audioRef.current) {
        audioRef.current.volume = 0.45

        audioRef.current.play().catch(() => {})
      }
    } else {
      setError('ACCESS DENIED // TRY AGAIN')

      setTimeout(() => {
        setError('')
      }, 2200)
    }
  }

  /*
    ============================================================
    LOGIN SCREEN
    ============================================================
  */

  if (phase === 'login') {
    return (
      <main className="retro-desktop">

        {/* MUSIC */}
        <audio
          ref={audioRef}
          src={SONG}
          loop
          preload="auto"
        />

        {/* CRT EFFECTS */}
        <div className="crt-lines" />
        <div className="crt-vignette" />
        <div className="noise" />

        {/* TOP SYSTEM BAR */}
        <div className="system-bar">

          <div className="system-left">
            <span className="system-dot" />
            <span>CLAR_OS</span>
            <span className="system-divider">///</span>
            <span>PERSONAL TERMINAL</span>
          </div>

          <div className="system-right">
            <span>MEM: 64MB</span>
            <span>•</span>
            <span>{clock}</span>
          </div>

        </div>

        {/* VHS TOP TEXT */}
        <div className="vhs-counter">
          <span>PLAY</span>
          <span>CH 03</span>
          <span>SP</span>
          <span>00:19:11</span>
        </div>

        {/* GLITCH HEADER */}
        <div className="giant-glitch">
          <span className="glitch-main" data-text="CLAR_OS">
            CLAR_OS
          </span>

          <span className="glitch-copy">
            CLAR_OS
          </span>

          <span className="glitch-copy two">
            CLAR_OS
          </span>
        </div>

        <div className="subtitle-glitch">
          PERSONAL MEMORY TERMINAL
        </div>

        {/* RANDOM FLOATING SYMBOLS */}
        <div className="floating-symbol symbol-1">✦</div>
        <div className="floating-symbol symbol-2">+</div>
        <div className="floating-symbol symbol-3">◈</div>
        <div className="floating-symbol symbol-4">×</div>
        <div className="floating-symbol symbol-5">✧</div>
        <div className="floating-symbol symbol-6">01</div>
        <div className="floating-symbol symbol-7">404</div>
        <div className="floating-symbol symbol-8">♡</div>

        {/* DESKTOP GRID */}
        <div className="desktop-grid" />

        {/* LEFT FOLDER COLUMN */}
        <div className="folder-column">

          <FakeFolder
            icon="📁"
            title="FEETGANG"
            sub="DIR_001"
            rotation="-2deg"
          />

          <FakeFolder
            icon="📁"
            title="EGGS"
            sub="DIR_002"
            rotation="1deg"
          />

          <FakeFolder
            icon="📁"
            title="GRADUATION"
            sub="DIR_003"
            rotation="-1deg"
          />

          <FakeFolder
            icon="📁"
            title="DO_NOT_OPEN"
            sub="???"
            rotation="2deg"
          />

        </div>

        {/* RIGHT SIDE MINI WINDOWS */}
        <div className="mini-window window-one">

          <WindowBar title="MEMORY.EXE" />

          <div className="window-content">

            <div className="pixel-photo">
              <img
                src="/images/clar-main.jpg"
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              <div className="photo-placeholder">
                IMAGE
                <br />
                MISSING
              </div>
            </div>

            <div className="tiny-text">
              FILE: CLAR_MAIN.JPG
              <br />
              SIZE: 2.4MB
              <br />
              STATUS: ????
            </div>

          </div>

        </div>

        <div className="mini-window window-two">

          <WindowBar title="SYSTEM.LOG" />

          <div className="terminal-lines">
            <p>&gt; hello clar</p>
            <p>&gt; birthday_mode: ON</p>
            <p>&gt; chaos_level: HIGH</p>
            <p>&gt; dignity: 404</p>
            <p className="blink">
              &gt; waiting...
            </p>
          </div>

        </div>

        {/* CD PLAYER */}
        <div className="cd-player">

          <div className="cd-header">
            <span>CD PLAYER</span>
            <span>◉</span>
          </div>

          <div className={`cd ${cdSpin ? 'spinning' : ''}`}>

            <div className="cd-hole" />

            <div className="cd-label">
              CLAR
            </div>

          </div>

          <div className="cd-controls">

            <button onClick={() => setCdSpin(!cdSpin)}>
              {cdSpin ? 'Ⅱ' : '▶'}
            </button>

            <div className="equalizer">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

          </div>

          <div className="track-info">
            TRACK 01
            <br />
            HAPPY BIRTHDAY.EXE
          </div>

        </div>

        {/* VHS TAPE */}
        <div className="vhs-tape">

          <div className="vhs-label">
            <span>VHS</span>
            <strong>CLAR 2004–∞</strong>
          </div>

          <div className="vhs-reel reel-one" />
          <div className="vhs-reel reel-two" />

        </div>

        {/* BOTTOM RIGHT PASSWORD TERMINAL */}
        <div className="password-terminal">

          <div className="terminal-header">

            <span>
              SECURE ARCHIVE
            </span>

            <span className="red-light">
              ● REC
            </span>

          </div>

          <div className="terminal-body">

            <div className="access-title">
              ENTER ACCESS CODE
            </div>

            <div className="access-sub">
              PRIVATE FILE // SUBJECT: CLAR
            </div>

            <form onSubmit={handleSubmit}>

              <div className="input-wrapper">

                <span className="prompt">
                  &gt;
                </span>

                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  autoComplete="off"
                />

                <span className="cursor">
                  █
                </span>

              </div>

              <button className="enter-button">
                [ ENTER ARCHIVE ]
              </button>

            </form>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </div>

        </div>

        {/* BOTTOM DESKTOP BAR */}
        <div className="bottom-bar">

          <div>
            © DVA_ARCHIVE
          </div>

          <div className="marquee">
            ★ THIS COMPUTER CONTAINS CLASSIFIED MATERIAL ★
            &nbsp;&nbsp;&nbsp;
            PLEASE DO NOT LEAK ★
            &nbsp;&nbsp;&nbsp;
            HAPPY BIRTHDAY CLAR ★
          </div>

          <div>
            19.11.04
          </div>

        </div>

        {/* CORNER COORDINATES */}
        <div className="coordinates">
          03°11'04"
          <br />
          101°41'21"
        </div>

        {/* LOADING OVERLAY WHEN PASSWORD IS CORRECT */}
        {phase === 'loading' && (
          <LoadingScreen bootLine={bootLine} />
        )}

      </main>
    )
  }

  /*
    ============================================================
    THIS IS THE LOADING SCREEN
    ============================================================
  */

  return (
    <LoadingScreen bootLine={bootLine} />
  )
}


/*
================================================================
FAKE FOLDER
================================================================
*/

function FakeFolder({
  icon,
  title,
  sub,
  rotation,
}) {
  return (
    <div
      className="fake-folder"
      style={{
        transform: `rotate(${rotation})`,
      }}
    >

      <div className="folder-icon">
        {icon}
      </div>

      <div className="folder-name">
        {title}
      </div>

      <div className="folder-sub">
        {sub}
      </div>

    </div>
  )
}


/*
================================================================
WINDOW BAR
================================================================
*/

function WindowBar({ title }) {
  return (
    <div className="window-bar">

      <span>
        {title}
      </span>

      <div className="window-buttons">
        <span>_</span>
        <span>□</span>
        <span>×</span>
      </div>

    </div>
  )
}


/*
================================================================
LOADING SCREEN
================================================================
*/

function LoadingScreen({ bootLine }) {

  const messages = [
    'INITIALIZING ARCHIVE...',
    'SEARCHING MEMORY SECTOR...',
    'MOUNTING PERSONAL FILES...',
    'LOADING IMAGE CACHE...',
    'REWINDING VHS TAPE...',
    'CHECKING CD-ROM...',
    'RECOVERING QUESTIONABLE DECISIONS...',
    'ARCHIVE ACCESS GRANTED.',
  ]

  const progress =
    Math.min(
      ((bootLine + 1) / messages.length) * 100,
      100
    )

  return (
    <main className="loading-screen">

      <div className="crt-lines" />
      <div className="crt-vignette" />
      <div className="noise" />

      <div className="loading-content">

        <div className="loading-top">
          DVA_SYSTEM // BOOT_SEQUENCE
        </div>

        <div className="loading-logo">

          <span className="load-glitch">
            CLAR
          </span>

        </div>

        <div className="loading-subtitle">
          PERSONAL MEMORY ARCHIVE
        </div>

        {/* CD */}

        <div className="loading-cd">

          <div className="loading-cd-inner">

            <div className="loading-cd-label">
              C
            </div>

          </div>

        </div>

        {/* TERMINAL */}

        <div className="boot-terminal">

          <div className="boot-title">
            SYSTEM BOOT
          </div>

          <div className="boot-lines">

            {messages.slice(0, bootLine + 1).map(
              (message, index) => (
                <div
                  key={message}
                  className={
                    index === bootLine
                      ? 'active-boot-line'
                      : ''
                  }
                >
                  <span>
                    [{String(index).padStart(2, '0')}]
                  </span>

                  {message}
                </div>
              )
            )}

          </div>

        </div>

        {/* PROGRESS */}

        <div className="progress-area">

          <div className="progress-label">

            <span>
              ACCESSING MEMORY
            </span>

            <span>
              {Math.floor(progress)}%
            </span>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="loading-warning">

          PLEASE DO NOT TURN OFF THE COMPUTER

          <br />

          <span>
            SOME MEMORIES MAY BE UNSTABLE
          </span>

        </div>

      </div>

    </main>
  )
}


/*
================================================================
STYLES
================================================================
*/

const styles = `
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #7984a8;
}

body {
  overflow-x: hidden;
}

button,
input {
  font: inherit;
}


/* ============================================================
   MAIN DESKTOP
============================================================ */

.retro-desktop {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: #252a3b;
  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(221, 220, 240, .85),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #8994b7 0%,
      #a6a5c1 38%,
      #7d89ae 72%,
      #626d92 100%
    );

  font-family:
    "Courier New",
    monospace;
}


/* ============================================================
   CRT
============================================================ */

.crt-lines {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,.035) 0px,
      rgba(255,255,255,.035) 1px,
      rgba(0,0,0,.06) 2px,
      rgba(0,0,0,.06) 4px
    );

  mix-blend-mode: multiply;
}

.crt-vignette {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;

  box-shadow:
    inset 0 0 160px rgba(24,28,48,.55);
}

.noise {
  position: fixed;
  inset: 0;
  z-index: 998;
  pointer-events: none;

  opacity: .12;

  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");

  animation: noiseMove .18s steps(2) infinite;
}

@keyframes noiseMove {
  0% { transform: translate(0,0); }
  25% { transform: translate(2px,-1px); }
  50% { transform: translate(-1px,2px); }
  75% { transform: translate(1px,1px); }
  100% { transform: translate(0,0); }
}


/* ============================================================
   SYSTEM BAR
============================================================ */

.system-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  height: 34px;

  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(36,42,67,.82);
  color: #dfe4ff;

  font-size: 9px;
  letter-spacing: .16em;

  border-bottom: 1px solid rgba(255,255,255,.15);

  z-index: 30;
}

.system-left,
.system-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.system-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;

  background: #c6ff65;

  box-shadow:
    0 0 8px #c6ff65;

  animation: blinkLight 1.5s infinite;
}

@keyframes blinkLight {
  0%, 45% { opacity: 1; }
  50%, 65% { opacity: .25; }
  70%, 100% { opacity: 1; }
}

.system-divider {
  opacity: .35;
}


/* ============================================================
   VHS
============================================================ */

.vhs-counter {
  position: absolute;
  top: 52px;
  right: 24px;

  display: flex;
  gap: 13px;

  font-size: 9px;
  letter-spacing: .15em;

  color: rgba(240,243,255,.8);

  z-index: 20;

  animation: vhsJitter 2.8s infinite;
}

@keyframes vhsJitter {
  0%, 93%, 100% {
    transform: translate(0);
  }

  94% {
    transform: translate(-5px,1px);
  }

  95% {
    transform: translate(4px,-1px);
  }

  96% {
    transform: translate(-2px,0);
  }
}


/* ============================================================
   DESKTOP GRID
============================================================ */

.desktop-grid {
  position: absolute;
  inset: 35px 0 30px;

  opacity: .17;

  background-image:
    linear-gradient(
      rgba(255,255,255,.2) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.2) 1px,
      transparent 1px
    );

  background-size: 44px 44px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 82%
    );
}


/* ============================================================
   BIG GLITCH TEXT
============================================================ */

.giant-glitch {
  position: absolute;

  top: 78px;
  left: 50%;

  transform: translateX(-50%);

  width: 100%;
  text-align: center;

  z-index: 10;

  pointer-events: none;
}

.glitch-main,
.glitch-copy {
  font-family:
    Impact,
    "Arial Black",
    sans-serif;

  font-size:
    clamp(58px, 12vw, 150px);

  line-height: .8;

  letter-spacing: -.06em;

  color: #343b5d;

  text-shadow:
    3px 0 rgba(225,86,151,.55),
    -3px 0 rgba(96,244,238,.5);

  animation:
    textGlitch 4s infinite steps(1);
}

.glitch-copy {
  position: absolute;
  left: 0;
  top: 0;

  color: rgba(232,239,255,.8);

  clip-path:
    inset(0 0 65% 0);

  animation:
    glitchSlice 2.3s infinite steps(1);
}

.glitch-copy.two {
  color: rgba(228,90,153,.6);

  clip-path:
    inset(62% 0 15% 0);

  animation-delay: .4s;
}

@keyframes textGlitch {

  0%, 72%, 100% {
    opacity: 1;
    transform: translate(0);
  }

  73% {
    opacity: .2;
    transform: translate(-5px,2px);
  }

  74% {
    opacity: 1;
    transform: translate(7px,-1px);
  }

  75% {
    opacity: .35;
    transform: translate(-2px,0);
  }

  76% {
    opacity: 1;
  }

  91% {
    opacity: .85;
  }

  92% {
    opacity: .05;
  }

  93% {
    opacity: 1;
  }
}

@keyframes glitchSlice {

  0%, 20%, 100% {
    transform: translate(0);
  }

  21% {
    transform: translate(12px,-2px);
  }

  22% {
    transform: translate(-10px,2px);
  }

  23% {
    transform: translate(4px,0);
  }

  24% {
    transform: translate(0);
  }
}

.subtitle-glitch {
  position: absolute;

  top: 196px;
  left: 50%;

  transform: translateX(-50%);

  font-size: 9px;

  letter-spacing: .45em;

  color: #4b5271;

  animation: disappearText 5s infinite steps(1);

  z-index: 11;
}

@keyframes disappearText {
  0%, 68%, 100% {
    opacity: 1;
  }

  69% {
    opacity: 0;
  }

  70% {
    opacity: .2;
  }

  71% {
    opacity: 0;
  }

  72% {
    opacity: 1;
  }
}


/* ============================================================
   FLOATING SYMBOLS
============================================================ */

.floating-symbol {
  position: absolute;

  font-family: monospace;

  color: rgba(236,240,255,.65);

  font-size: 18px;

  z-index: 8;

  animation:
    floatAround 6s ease-in-out infinite;
}

.symbol-1 {
  top: 27%;
  left: 8%;
}

.symbol-2 {
  top: 44%;
  left: 22%;
  animation-delay: 1s;
}

.symbol-3 {
  top: 24%;
  right: 11%;
  animation-delay: 2s;
}

.symbol-4 {
  bottom: 28%;
  right: 25%;
  animation-delay: .5s;
}

.symbol-5 {
  bottom: 19%;
  left: 36%;
  animation-delay: 1.7s;
}

.symbol-6 {
  top: 32%;
  right: 31%;
  font-size: 10px;
}

.symbol-7 {
  bottom: 20%;
  right: 8%;
  font-size: 9px;
}

.symbol-8 {
  top: 48%;
  left: 5%;
}

@keyframes floatAround {

  0%,100% {
    transform: translate(0,0) rotate(0);
    opacity: .35;
  }

  50% {
    transform: translate(8px,-15px) rotate(10deg);
    opacity: .9;
  }
}


/* ============================================================
   FOLDERS
============================================================ */

.folder-column {
  position: absolute;

  left: 7%;

  top: 285px;

  display: flex;
  flex-direction: column;

  gap: 15px;

  z-index: 20;
}

.fake-folder {
  width: 145px;

  padding: 8px;

  cursor: default;

  transition:
    transform .25s,
    filter .25s;

  animation:
    folderFloat 5s ease-in-out infinite;
}

.fake-folder:nth-child(2) {
  animation-delay: .7s;
}

.fake-folder:nth-child(3) {
  animation-delay: 1.4s;
}

.fake-folder:nth-child(4) {
  animation-delay: 2s;
}

.fake-folder:hover {
  filter:
    drop-shadow(0 0 10px rgba(225,240,255,.5));

  transform:
    rotate(0deg)
    translateX(8px)
    scale(1.05) !important;
}

.folder-icon {
  font-size: 38px;

  filter:
    drop-shadow(2px 2px 0 rgba(40,45,65,.35));
}

.folder-name {
  margin-top: -3px;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: 11px;

  letter-spacing: .08em;

  color: #303650;

  text-shadow:
    1px 1px rgba(255,255,255,.35);
}

.folder-sub {
  margin-top: 2px;

  font-size: 7px;

  letter-spacing: .2em;

  color: #59617f;
}

@keyframes folderFloat {

  0%,100% {
    margin-top: 0;
  }

  50% {
    margin-top: -4px;
  }
}


/* ============================================================
   MINI WINDOWS
============================================================ */

.mini-window {
  position: absolute;

  background: rgba(219,223,237,.88);

  border:
    1px solid #454d6a;

  box-shadow:
    7px 8px 0 rgba(41,46,67,.18),
    0 0 20px rgba(255,255,255,.15);

  z-index: 22;

  backdrop-filter: blur(3px);

  animation: windowFloat 7s ease-in-out infinite;
}

.window-one {
  top: 282px;
  right: 8%;
  width: 190px;
  transform: rotate(2deg);
}

.window-two {
  top: 455px;
  left: 27%;
  width: 220px;
  transform: rotate(-1deg);

  animation-delay: 1.3s;
}

@keyframes windowFloat {
  0%,100% {
    margin-top: 0;
  }

  50% {
    margin-top: -7px;
  }
}

.window-bar {
  height: 22px;

  padding: 0 7px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    linear-gradient(
      90deg,
      #515b82,
      #697394
    );

  color: white;

  font-size: 8px;

  letter-spacing: .08em;
}

.window-buttons {
  display: flex;
  gap: 3px;
}

.window-buttons span {
  width: 13px;
  height: 13px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #c8cddd;

  color: #30364f;

  font-size: 8px;
}

.window-content {
  padding: 9px;
}

.pixel-photo {
  height: 100px;

  background:
    repeating-linear-gradient(
      0deg,
      #858da9 0 3px,
      #717a9b 3px 6px
    );

  border:
    1px solid #565e79;

  position: relative;

  overflow: hidden;
}

.pixel-photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  filter:
    saturate(.65)
    contrast(1.1);
}

.photo-placeholder {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;

  font-size: 9px;

  line-height: 1.5;

  color: rgba(255,255,255,.5);

  letter-spacing: .18em;
}

.tiny-text {
  margin-top: 7px;

  font-size: 7px;

  line-height: 1.7;

  color: #505873;
}


/* ============================================================
   TERMINAL
============================================================ */

.terminal-lines {
  padding: 10px;

  min-height: 110px;

  background: #272c43;

  color: #b9ffce;

  font-size: 8px;

  line-height: 1.8;
}

.terminal-lines p {
  margin: 0;
}

.terminal-lines p:nth-child(2) {
  color: #8ee8ff;
}

.terminal-lines p:nth-child(3) {
  color: #ffb2d8;
}

.blink {
  animation: terminalBlink 1s infinite;
}

@keyframes terminalBlink {
  50% {
    opacity: 0;
  }
}


/* ============================================================
   CD PLAYER
============================================================ */

.cd-player {
  position: absolute;

  bottom: 78px;
  left: 50%;

  transform: translateX(-50%) rotate(-2deg);

  width: 190px;

  padding: 12px;

  background:
    linear-gradient(
      135deg,
      rgba(214,218,235,.94),
      rgba(165,173,201,.94)
    );

  border:
    1px solid #59627e;

  box-shadow:
    10px 12px 0 rgba(38,43,64,.18),
    inset 0 0 20px rgba(255,255,255,.35);

  z-index: 25;
}

.cd-header {
  display: flex;
  justify-content: space-between;

  font-size: 8px;

  letter-spacing: .15em;

  color: #3c4562;

  margin-bottom: 10px;
}

.cd {
  width: 105px;
  height: 105px;

  margin: auto;

  border-radius: 50%;

  position: relative;

  background:
    repeating-conic-gradient(
      from 0deg,
      #b8c0d5 0deg 8deg,
      #e2e4ee 8deg 16deg
    );

  box-shadow:
    inset 0 0 0 5px rgba(76,84,112,.15),
    inset 0 0 20px rgba(40,45,60,.3),
    0 5px 12px rgba(34,39,59,.25);

  transition: animation .3s;
}

.cd.spinning {
  animation:
    cdSpin 2.8s linear infinite;
}

@keyframes cdSpin {
  to {
    transform: rotate(360deg);
  }
}

.cd::before {
  content: '';

  position: absolute;

  inset: 19px;

  border-radius: 50%;

  background:
    conic-gradient(
      #8bd8ff,
      #e7a5ff,
      #9cffe2,
      #ffd9a8,
      #8bd8ff
    );

  opacity: .6;

  mix-blend-mode: multiply;
}

.cd-hole {
  position: absolute;

  width: 22px;
  height: 22px;

  left: 50%;
  top: 50%;

  transform: translate(-50%,-50%);

  border-radius: 50%;

  background: #737c99;

  border: 6px solid #d8dbe7;

  z-index: 3;
}

.cd-label {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%,-50%);

  font-size: 8px;

  letter-spacing: .15em;

  z-index: 4;

  color: #343c58;
}

.cd-controls {
  margin-top: 10px;

  display: flex;

  align-items: center;

  gap: 10px;
}

.cd-controls button {
  border: 0;

  background: #4e5777;

  color: white;

  width: 30px;
  height: 24px;

  cursor: pointer;

  font-size: 10px;
}

.equalizer {
  flex: 1;

  height: 24px;

  display: flex;

  align-items: end;

  gap: 2px;
}

.equalizer i {
  flex: 1;

  background: #525b7b;

  animation:
    eq .8s ease-in-out infinite alternate;
}

.equalizer i:nth-child(1) { height: 30%; }
.equalizer i:nth-child(2) { height: 70%; animation-delay:.1s; }
.equalizer i:nth-child(3) { height: 45%; animation-delay:.2s; }
.equalizer i:nth-child(4) { height: 90%; animation-delay:.3s; }
.equalizer i:nth-child(5) { height: 60%; animation-delay:.4s; }
.equalizer i:nth-child(6) { height: 80%; animation-delay:.5s; }
.equalizer i:nth-child(7) { height: 40%; animation-delay:.6s; }
.equalizer i:nth-child(8) { height: 65%; animation-delay:.7s; }

@keyframes eq {
  from {
    transform: scaleY(.35);
  }

  to {
    transform: scaleY(1);
  }
}

.track-info {
  margin-top: 9px;

  font-size: 7px;

  line-height: 1.6;

  letter-spacing: .1em;

  color: #4e5773;
}


/* ============================================================
   VHS TAPE
============================================================ */

.vhs-tape {
  position: absolute;

  bottom: 90px;
  right: 8%;

  width: 180px;
  height: 105px;

  transform: rotate(4deg);

  background:
    linear-gradient(
      145deg,
      #242a3c,
      #343b53
    );

  border-radius: 5px;

  box-shadow:
    8px 10px 0 rgba(38,43,64,.22);

  z-index: 23;

  animation:
    tapeFloat 6s ease-in-out infinite;
}

@keyframes tapeFloat {
  0%,100% {
    transform: rotate(4deg) translateY(0);
  }

  50% {
    transform: rotate(3deg) translateY(-7px);
  }
}

.vhs-label {
  position: absolute;

  left: 13px;
  right: 13px;
  top: 25px;

  height: 48px;

  background: #c8c9d5;

  padding: 8px;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  font-size: 7px;

  color: #343b51;

  transform: skewX(-3deg);
}

.vhs-label span {
  font-family: Impact, sans-serif;

  font-size: 16px;
}

.vhs-label strong {
  font-size: 7px;

  letter-spacing: .1em;
}

.vhs-reel {
  position: absolute;

  top: 36px;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  background:
    repeating-conic-gradient(
      #d6d9e2 0 15deg,
      #7a829c 15deg 30deg
    );

  border: 5px solid #596178;
}

.reel-one {
  left: 25px;
}

.reel-two {
  right: 25px;
}


/* ============================================================
   PASSWORD TERMINAL
============================================================ */

.password-terminal {
  position: absolute;

  right: 5%;
  bottom: 210px;

  width: min(350px, 42vw);

  background: rgba(39,45,67,.94);

  border:
    1px solid rgba(214,221,255,.4);

  box-shadow:
    10px 10px 0 rgba(35,40,59,.2),
    0 0 30px rgba(48,56,90,.3);

  z-index: 35;

  animation:
    terminalFloat 5s ease-in-out infinite;
}

@keyframes terminalFloat {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.terminal-header {
  height: 27px;

  padding: 0 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #525d82;

  color: #f2f4ff;

  font-size: 8px;

  letter-spacing: .12em;
}

.red-light {
  color: #ff92ad;

  animation: blinkLight 1.2s infinite;
}

.terminal-body {
  padding: 18px;
}

.access-title {
  font-family:
    "Arial Black",
    sans-serif;

  font-size: 15px;

  color: #e4e8ff;

  letter-spacing: .08em;
}

.access-sub {
  margin-top: 5px;

  font-size: 7px;

  color: #929bb9;

  letter-spacing: .18em;
}

.input-wrapper {
  margin-top: 18px;

  height: 38px;

  border:
    1px solid #707b9d;

  background: #20263b;

  display: flex;

  align-items: center;

  padding: 0 10px;

  color: #b9ffcf;
}

.prompt {
  margin-right: 8px;
}

.input-wrapper input {
  flex: 1;

  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: #d7ffe3;

  font-size: 11px;

  letter-spacing: .2em;
}

.input-wrapper input::placeholder {
  color: #65708f;
}

.cursor {
  animation: cursorBlink .9s infinite;
}

@keyframes cursorBlink {
  50% {
    opacity: 0;
  }
}

.enter-button {
  margin-top: 10px;

  width: 100%;

  height: 32px;

  border:
    1px solid #7883a6;

  background: #59647f;

  color: white;

  font-size: 8px;

  letter-spacing: .18em;

  cursor: pointer;

  transition: all .2s;
}

.enter-button:hover {
  background: #707b9b;

  box-shadow:
    0 0 15px rgba(200,215,255,.25);
}

.error-message {
  margin-top: 9px;

  color: #ff8ba7;

  font-size: 8px;

  letter-spacing: .15em;

  animation:
    errorGlitch .15s infinite;
}

@keyframes errorGlitch {
  0% { transform: translateX(0); }
  50% { transform: translateX(2px); }
  100% { transform: translateX(-2px); }
}


/* ============================================================
   BOTTOM BAR
============================================================ */

.bottom-bar {
  position: absolute;

  bottom: 0;
  left: 0;
  right: 0;

  height: 30px;

  display: grid;

  grid-template-columns:
    150px
    1fr
    120px;

  align-items: center;

  gap: 15px;

  padding: 0 15px;

  background: rgba(38,44,66,.9);

  color: #c5cbe1;

  font-size: 7px;

  letter-spacing: .13em;

  z-index: 40;

  overflow: hidden;
}

.marquee {
  white-space: nowrap;

  animation:
    marquee 18s linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(15%);
  }

  to {
    transform: translateX(-15%);
  }
}

.coordinates {
  position: absolute;

  left: 25px;
  bottom: 50px;

  font-size: 7px;

  line-height: 1.7;

  color: rgba(45,52,77,.65);

  z-index: 10;
}


/* ============================================================
   LOADING SCREEN
============================================================ */

.loading-screen {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at center,
      #a2a7c3 0%,
      #6c7698 45%,
      #3e465f 100%
    );

  position: relative;

  overflow: hidden;

  display: flex;

  justify-content: center;
  align-items: center;

  color: #e8ebff;

  font-family:
    "Courier New",
    monospace;
}

.loading-content {
  position: relative;

  z-index: 20;

  width:
    min(700px, 90vw);

  text-align: center;
}

.loading-top {
  font-size: 8px;

  letter-spacing: .35em;

  opacity: .65;

  margin-bottom: 20px;
}

.loading-logo {
  position: relative;

  height: 90px;
}

.load-glitch {
  font-family:
    Impact,
    "Arial Black",
    sans-serif;

  font-size:
    clamp(65px, 13vw, 120px);

  line-height: .8;

  letter-spacing: -.05em;

  color: #e9ebff;

  text-shadow:
    4px 0 #d47aa8,
    -4px 0 #77e0dd;

  animation:
    loadingGlitch 1.5s infinite steps(1);
}

@keyframes loadingGlitch {
  0%, 65%, 100% {
    opacity: 1;
  }

  66% {
    opacity: .1;
    transform: translateX(-8px);
  }

  67% {
    opacity: 1;
    transform: translateX(5px);
  }

  68% {
    transform: translateX(0);
  }
}

.loading-subtitle {
  margin-top: 15px;

  font-size: 9px;

  letter-spacing: .45em;

  opacity: .65;
}

.loading-cd {
  margin:
    35px auto 25px;

  width: 115px;
  height: 115px;

  border-radius: 50%;

  background:
    repeating-conic-gradient(
      #ccd1e1 0 8deg,
      #858da9 8deg 16deg
    );

  box-shadow:
    0 0 35px rgba(226,231,255,.3),
    inset 0 0 25px rgba(44,49,70,.4);

  animation:
    cdSpin 2s linear infinite;
}

.loading-cd-inner {
  width: 100%;
  height: 100%;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;
}

.loading-cd-label {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #707994;

  border: 7px solid #d4d8e5;

  font-family: Impact, sans-serif;

  color: #303750;
}

.boot-terminal {
  margin: 0 auto;

  text-align: left;

  width: min(500px, 100%);

  min-height: 185px;

  background: rgba(26,31,48,.9);

  border:
    1px solid rgba(219,226,255,.3);

  box-shadow:
    0 10px 30px rgba(20,24,40,.25);

  padding: 14px;
}

.boot-title {
  color: #9da8cb;

  font-size: 8px;

  letter-spacing: .2em;

  padding-bottom: 9px;

  border-bottom:
    1px solid rgba(220,225,255,.12);

  margin-bottom: 10px;
}

.boot-lines {
  font-size: 8px;

  line-height: 1.8;

  color: #9da7c4;
}

.boot-lines span {
  color: #687491;

  margin-right: 9px;
}

.active-boot-line {
  color: #c9ffd7;

  animation:
    bootFlicker .5s infinite;
}

@keyframes bootFlicker {
  50% {
    opacity: .55;
  }
}

.progress-area {
  width: min(500px, 100%);

  margin: 18px auto 0;
}

.progress-label {
  display: flex;

  justify-content: space-between;

  font-size: 7px;

  letter-spacing: .15em;

  margin-bottom: 6px;

  opacity: .75;
}

.progress-track {
  width: 100%;

  height: 7px;

  background: rgba(30,35,54,.5);

  border:
    1px solid rgba(230,235,255,.25);

  padding: 1px;
}

.progress-fill {
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #9cf0db,
      #a8c9ff,
      #ef9fc8
    );

  transition:
    width .35s ease;

  box-shadow:
    0 0 12px rgba(177,221,255,.45);
}

.loading-warning {
  margin-top: 20px;

  font-size: 7px;

  line-height: 1.8;

  letter-spacing: .2em;

  opacity: .55;
}

.loading-warning span {
  color: #ffadc9;
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 700px) {

  .system-right span:nth-child(1),
  .system-right span:nth-child(2) {
    display: none;
  }

  .system-bar {
    font-size: 7px;
  }

  .giant-glitch {
    top: 90px;
  }

  .subtitle-glitch {
    top: 180px;

    font-size: 7px;

    letter-spacing: .25em;
  }

  .folder-column {
    top: 235px;
    left: 5%;

    gap: 7px;
  }

  .fake-folder {
    width: 115px;
  }

  .folder-icon {
    font-size: 30px;
  }

  .folder-name {
    font-size: 8px;
  }

  .folder-sub {
    font-size: 6px;
  }

  .mini-window.window-one {
    top: 245px;
    right: 4%;
    width: 145px;
  }

  .mini-window.window-two {
    display: none;
  }

  .pixel-photo {
    height: 70px;
  }

  .password-terminal {
    left: 50%;
    right: auto;
    bottom: 70px;

    transform: translateX(-50%);

    width: 90vw;

    animation: none;
  }

  .password-terminal:hover {
    transform: translateX(-50%);
  }

  .cd-player {
    left: 8%;
    bottom: 68px;

    transform:
      scale(.7)
      rotate(-3deg);

    transform-origin: bottom left;
  }

  .vhs-tape {
    right: 2%;
    bottom: 65px;

    transform:
      scale(.65)
      rotate(4deg);

    transform-origin: bottom right;
  }

  .coordinates {
    display: none;
  }

  .bottom-bar {
    grid-template-columns: 1fr 1fr;

    font-size: 6px;
  }

  .bottom-bar .marquee {
    display: none;
  }

  .bottom-bar div:last-child {
    text-align: right;
  }

  .floating-symbol {
    display: none;
  }
}
`

/*
  Inject all CSS into this page.
*/
if (typeof document !== 'undefined') {
  const styleId = 'clar-retro-page-styles'

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.innerHTML = styles
    document.head.appendChild(style)
  }
}
