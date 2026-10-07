'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [booting, setBooting] = useState(false)
  const [bootLine, setBootLine] = useState(0)
  const [time, setTime] = useState('')
  const [showError, setShowError] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  const [showCd, setShowCd] = useState(true)
  const [showVhs, setShowVhs] = useState(true)
  const [glitch, setGlitch] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)

  // CHANGE THIS
  const CORRECT_PASSWORD = 'clar'

  const bootMessages = [
    'BIOS MEMORY CHECK ........ OK',
    'LOADING CLAR_ARCHIVE.EXE',
    'SEARCHING FOR MEMORIES...',
    'FOUND 847 FILES',
    'MOUNTING FEETGANG/',
    'MOUNTING EGGS/',
    'MOUNTING GRADUATION/',
    'LOADING AUDIO DEVICE...',
    'LOADING QUESTIONABLE DECISIONS...',
    'RESTORING LOST FILES...',
    'SYSTEM READY.',
  ]

  const folders = [
    { name: 'FEETGANG', icon: '📁', x: '7%', y: '14%' },
    { name: 'EGGS', icon: '📁', x: '18%', y: '34%' },
    { name: 'GRADUATION', icon: '📁', x: '8%', y: '61%' },
    { name: 'DUMP_001', icon: '📁', x: '24%', y: '72%' },
    { name: 'CAMERA', icon: '📁', x: '82%', y: '14%' },
    { name: 'DO_NOT_OPEN', icon: '📁', x: '88%', y: '35%' },
    { name: 'CLAR.EXE', icon: '💾', x: '76%', y: '69%' },
    { name: '???', icon: '📁', x: '91%', y: '67%' },
  ]

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()

      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateClock()

    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)
  }, [])

  // Random CRT glitch
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)

      setTimeout(() => {
        setGlitch(false)
      }, 120 + Math.random() * 250)
    }, 2200 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [])

  // Random fake popup
  useEffect(() => {
    const interval = setInterval(() => {
      setShowError(Math.random() > 0.35)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  // Boot sequence
  useEffect(() => {
    if (!booting) return

    let index = 0

    const interval = setInterval(() => {
      setBootLine(index)

      index++

      if (index >= bootMessages.length) {
        clearInterval(interval)

        setTimeout(() => {
          sessionStorage.setItem('birthday_authenticated', 'true')
          router.push('/birthday')
        }, 1200)
      }
    }, 420)

    return () => clearInterval(interval)
  }, [booting, router])

  const submitPassword = (e) => {
    e.preventDefault()

    if (password.toLowerCase().trim() === CORRECT_PASSWORD) {
      setError('')
      setBooting(true)
      return
    }

    setError('ACCESS DENIED // WRONG PASSWORD')
    setPassword('')

    setTimeout(() => {
      setError('')
    }, 2500)
  }

  const handleFolder = (folder) => {
    setSelectedFolder(folder)

    setTimeout(() => {
      setSelectedFolder(null)
    }, 2500)
  }

  if (booting) {
    return (
      <main className="boot-screen">
        <div className="boot-noise" />

        <div className="boot-content">
          <div className="boot-logo">
            <span>CLAR</span>
            <span className="boot-logo-small">ARCHIVE SYSTEM</span>
          </div>

          <div className="boot-box">
            <div className="boot-title">
              SYSTEM INITIALIZATION
            </div>

            <div className="boot-progress">
              <div
                className="boot-progress-fill"
                style={{
                  width: `${((bootLine + 1) / bootMessages.length) * 100}%`,
                }}
              />
            </div>

            <div className="boot-percentage">
              {Math.min(
                100,
                Math.round(((bootLine + 1) / bootMessages.length) * 100)
              )}
              %
            </div>

            <div className="boot-terminal">
              {bootMessages.slice(0, bootLine + 1).map((message, i) => (
                <div
                  key={message}
                  className={i === bootLine ? 'current-boot-line' : ''}
                >
                  <span>&gt;</span> {message}
                </div>
              ))}
            </div>
          </div>

          <div className="boot-footer">
            PLEASE DO NOT TURN OFF THE COMPUTER
          </div>
        </div>

        <div className="scanlines" />
      </main>
    )
  }

  return (
    <main className={`desktop ${glitch ? 'glitch-active' : ''}`}>

      {/* CRT layers */}
      <div className="crt-curvature" />
      <div className="scanlines" />
      <div className="screen-noise" />

      {/* top system bar */}
      <div className="system-bar">
        <div>
          <span className="status-light" />
          CLAR_OS v1.9.11
        </div>

        <div className="system-center">
          <span className="rec-dot">●</span> REC
        </div>

        <div>
          {time}
        </div>
      </div>

      {/* fake desktop title */}
      <div className="desktop-title">
        <span className="glitch-text" data-text="PRIVATE COMPUTER">
          PRIVATE COMPUTER
        </span>
        <span className="tiny-text">USER: CLAR // GUEST ACCESS</span>
      </div>

      {/* folders */}
      {folders.map((folder) => (
        <button
          key={folder.name}
          onClick={() => handleFolder(folder)}
          className="desktop-folder"
          style={{
            left: folder.x,
            top: folder.y,
          }}
        >
          <span className="folder-icon">{folder.icon}</span>

          <span className="folder-name">
            {folder.name}
          </span>
        </button>
      ))}

      {/* floating tiny graphics */}
      <div className="pixel-star star-1">✦</div>
      <div className="pixel-star star-2">+</div>
      <div className="pixel-star star-3">✧</div>
      <div className="pixel-star star-4">×</div>

      <div className="floating-code code-1">
        01101001<br />
        11000101<br />
        00110110
      </div>

      <div className="floating-code code-2">
        MEMORY_001<br />
        MEMORY_002<br />
        MEMORY_003
      </div>

      {/* VHS monitor */}
      {showVhs && (
        <div className="window vhs-window">
          <div className="window-bar">
            <span>VHS_PLAYER.EXE</span>

            <button onClick={() => setShowVhs(false)}>
              ×
            </button>
          </div>

          <div className="vhs-screen">
            <div className="vhs-static" />

            <div className="vhs-face">
              NO SIGNAL
            </div>

            <div className="vhs-timestamp">
              PLAY &nbsp; SP &nbsp; 00:19:04
            </div>

            <div className="vhs-tracking">
              TRACKING ▰▰▰▰▱
            </div>
          </div>

          <div className="vhs-controls">
            ◀◀ &nbsp; ▶ &nbsp; ▮▮ &nbsp; ■ &nbsp; ▶▶
          </div>
        </div>
      )}

      {/* CD PLAYER */}
      {showCd && (
        <div className="window cd-window">
          <div className="window-bar">
            <span>CD_PLAYER</span>

            <button onClick={() => setShowCd(false)}>
              ×
            </button>
          </div>

          <div className="cd-body">
            <div className="cd-disc">
              <div className="cd-hole" />
            </div>

            <div className="cd-info">
              <div className="cd-track">
                TRACK 04
              </div>

              <div className="cd-title">
                BIRTHDAY.EXE
              </div>

              <div className="equalizer">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="cd-time">
                02:47 / 04:19
              </div>
            </div>
          </div>

          <div className="cd-buttons">
            ◀◀ &nbsp;&nbsp; ▶ &nbsp;&nbsp; ■ &nbsp;&nbsp; ▶▶
          </div>
        </div>
      )}

      {/* terminal */}
      {showTerminal && (
        <div className="window terminal-window">
          <div className="window-bar terminal-bar">
            <span>TERMINAL // MEMORIES</span>

            <button onClick={() => setShowTerminal(false)}>
              ×
            </button>
          </div>

          <div className="terminal-content">
            <div>CLAR@PRIVATE-PC:~$ ./birthday.sh</div>
            <div>initialising...</div>
            <div>checking files...</div>
            <div className="terminal-green">
              847 memories found
            </div>
            <div className="terminal-yellow">
              12 questionable decisions found
            </div>
            <div className="terminal-red">
              1 birthday girl detected
            </div>

            <div className="terminal-cursor">
              _
            </div>
          </div>
        </div>
      )}

      {/* fake error popup */}
      {showError && (
        <div className="window error-window">
          <div className="window-bar">
            <span>ERROR</span>

            <button onClick={() => setShowError(false)}>
              ×
            </button>
          </div>

          <div className="error-content">
            <div className="error-icon">
              !
            </div>

            <div>
              <strong>CLAR.EXE</strong>

              <p>
                has encountered an unexpected
                amount of birthday behaviour.
              </p>
            </div>
          </div>

          <div className="error-buttons">
            <button onClick={() => setShowError(false)}>
              OK
            </button>

            <button onClick={() => setShowError(false)}>
              IGNORE
            </button>
          </div>
        </div>
      )}

      {/* SYSTEM STATS */}
      <div className="stats-window">
        <div>MEMORY&nbsp;&nbsp; 63%</div>
        <div>CPU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 27%</div>
        <div>DISK&nbsp;&nbsp;&nbsp;&nbsp; 91%</div>
        <div>SIGNAL&nbsp;&nbsp; 72%</div>

        <div className="mini-bars">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* BIG PASSWORD WINDOW */}
      <div className="password-window">

        <div className="window-bar password-titlebar">
          <div>
            <span className="window-dot" />
            <span className="window-dot" />
            <span className="window-dot" />
          </div>

          <span>
            SECURITY_SYSTEM.EXE
          </span>

          <span>
            v2.004
          </span>
        </div>

        <div className="password-inner">

          <div className="security-header">
            <div className="security-symbol">
              ◈
            </div>

            <div>
              <div className="security-small">
                RESTRICTED ACCESS
              </div>

              <h1
                className="glitch-text"
                data-text="CLAR ARCHIVE"
              >
                CLAR ARCHIVE
              </h1>
            </div>
          </div>

          <div className="security-divider" />

          <p className="password-copy">
            This computer contains highly classified
            birthday material.
          </p>

          <p className="password-warning">
            UNAUTHORISED USERS WILL BE JUDGED.
          </p>

          <form onSubmit={submitPassword}>
            <label>
              ENTER PASSWORD
            </label>

            <div className="password-row">
              <span className="prompt">
                &gt;_
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="off"
                placeholder="PASSWORD"
              />

              <button type="submit">
                ENTER
              </button>
            </div>

            {error && (
              <div className="password-error">
                {error}
              </div>
            )}
          </form>

          <div className="password-bottom">
            <span>
              ENCRYPTION: ████████
            </span>

            <span>
              STATUS: LOCKED
            </span>
          </div>

        </div>
      </div>

      {/* bottom desktop bar */}
      <div className="taskbar">

        <div className="start-button">
          ◉ START
        </div>

        <div className="task-item">
          📀 BIRTHDAY.EXE
        </div>

        <div className="task-item">
          📼 VHS_PLAYER
        </div>

        <div className="task-item">
          💾 CLAR_ARCHIVE
        </div>

        <div className="taskbar-right">
          <span>🔊</span>
          <span>▣</span>
          <span>{time}</span>
        </div>

      </div>

      {/* folder popup */}
      {selectedFolder && (
        <div className="folder-popup">
          <div className="folder-popup-icon">
            {selectedFolder.icon}
          </div>

          <div>
            <strong>
              {selectedFolder.name}
            </strong>

            <p>
              FILE DIRECTORY FOUND
            </p>
          </div>

          <div className="popup-loading">
            ACCESSING...
          </div>
        </div>
      )}

      {/* mouse-ish cursor decoration */}
      <div className="fake-cursor">
        ◢
      </div>

    </main>
  )
}
<style jsx global>{`

@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Space+Mono:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #747b9a;
}

/* =========================================================
   DESKTOP
========================================================= */

.desktop {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 40%,
      rgba(201, 203, 232, .45),
      transparent 38%
    ),
    linear-gradient(
      135deg,
      #737b9c,
      #8b89a7 45%,
      #646c8b
    );

  color: #17192a;

  font-family: 'VT323', monospace;
}

/* CRT curvature */

.crt-curvature {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;

  box-shadow:
    inset 0 0 100px rgba(0,0,0,.25),
    inset 0 0 25px rgba(255,255,255,.08);

  border-radius: 3%;
}

/* scanlines */

.scanlines {
  position: fixed;
  inset: 0;
  z-index: 90;
  pointer-events: none;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,.08) 0px,
      rgba(0,0,0,.08) 1px,
      transparent 2px,
      transparent 4px
    );

  opacity: .6;
}

/* noise */

.screen-noise,
.boot-noise {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;

  opacity: .09;

  background-image:
    repeating-radial-gradient(
      circle at 0 0,
      rgba(255,255,255,.4) 0,
      rgba(255,255,255,.4) 1px,
      transparent 1px,
      transparent 3px
    );

  animation: noiseMove .15s steps(2) infinite;
}

@keyframes noiseMove {
  0% { transform: translate(0,0); }
  25% { transform: translate(-2px,1px); }
  50% { transform: translate(1px,-2px); }
  75% { transform: translate(2px,2px); }
  100% { transform: translate(0,0); }
}

/* =========================================================
   SYSTEM BAR
========================================================= */

.system-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  height: 31px;

  background: #c1c5d6;
  border-bottom: 2px solid #4e536c;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 12px;

  font-family: 'Space Mono', monospace;
  font-size: 9px;

  z-index: 40;
}

.status-light {
  display: inline-block;
  width: 7px;
  height: 7px;

  margin-right: 7px;

  border-radius: 50%;
  background: #8e2430;

  box-shadow: 0 0 7px #c63849;

  animation: blink 1.2s infinite;
}

@keyframes blink {
  50% {
    opacity: .25;
  }
}

.rec-dot {
  color: #a62635;
  animation: blink .8s infinite;
}

/* =========================================================
   DESKTOP TEXT
========================================================= */

.desktop-title {
  position: absolute;

  left: 50%;
  top: 45px;

  transform: translateX(-50%);

  text-align: center;

  z-index: 5;
}

.desktop-title .glitch-text {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(15px, 2vw, 28px);

  color: #25273c;

  letter-spacing: 3px;
}

.tiny-text {
  display: block;

  margin-top: 8px;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  letter-spacing: 3px;

  opacity: .6;
}

/* =========================================================
   GLITCH TEXT
========================================================= */

.glitch-text {
  position: relative;
  display: inline-block;

  animation:
    glitchFlicker 4s infinite steps(1);
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);

  position: absolute;
  left: 0;
  top: 0;

  width: 100%;

  pointer-events: none;
}

.glitch-text::before {
  color: #6b355e;

  animation:
    glitchOne 2.8s infinite steps(2);
}

.glitch-text::after {
  color: #354c71;

  animation:
    glitchTwo 3.4s infinite steps(2);
}

@keyframes glitchFlicker {
  0%, 82%, 86%, 100% {
    opacity: 1;
  }

  83% {
    opacity: .05;
  }

  84% {
    opacity: .8;
  }

  85% {
    opacity: .2;
  }
}

@keyframes glitchOne {
  0%, 70%, 100% {
    clip-path: inset(0 0 100% 0);
    transform: translate(0);
  }

  71% {
    clip-path: inset(10% 0 75% 0);
    transform: translate(-4px, -1px);
  }

  72% {
    clip-path: inset(60% 0 20% 0);
    transform: translate(5px, 2px);
  }

  73% {
    clip-path: inset(0 0 100% 0);
  }
}

@keyframes glitchTwo {
  0%, 60%, 100% {
    clip-path: inset(100% 0 0 0);
    transform: translate(0);
  }

  61% {
    clip-path: inset(70% 0 5% 0);
    transform: translate(4px, 2px);
  }

  62% {
    clip-path: inset(20% 0 55% 0);
    transform: translate(-5px, -1px);
  }

  63% {
    clip-path: inset(100% 0 0 0);
  }
}

.glitch-active {
  animation: wholeScreenGlitch .12s steps(2);
}

@keyframes wholeScreenGlitch {
  0% {
    transform: translate(0);
  }

  30% {
    transform: translate(-3px, 1px);
  }

  60% {
    transform: translate(3px, -1px);
  }

  100% {
    transform: translate(0);
  }
}

/* =========================================================
   FOLDERS
========================================================= */

.desktop-folder {
  position: absolute;

  width: 90px;

  border: 0;
  background: transparent;

  color: #24263a;

  cursor: pointer;

  z-index: 7;

  text-align: center;

  transition:
    transform .15s,
    filter .15s;
}

.desktop-folder:hover {
  transform:
    translateY(-4px)
    rotate(-2deg)
    scale(1.08);

  filter:
    drop-shadow(0 0 5px rgba(255,255,255,.7));
}

.folder-icon {
  display: block;

  font-size: 34px;

  filter:
    drop-shadow(2px 2px 0 rgba(40,42,60,.25));
}

.folder-name {
  display: block;

  margin-top: 3px;

  padding: 2px 4px;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  background: rgba(214,216,229,.55);

  border: 1px solid rgba(50,53,74,.35);
}

/* =========================================================
   WINDOWS
========================================================= */

.window {
  position: absolute;

  background: #c6cad8;

  border: 2px solid #3e435a;

  box-shadow:
    5px 6px 0 rgba(28,30,47,.25),
    inset 1px 1px 0 #f3f4fa;

  z-index: 15;

  animation: windowAppear .5s ease-out;
}

@keyframes windowAppear {
  from {
    opacity: 0;
    transform: scale(.85);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.window-bar {
  height: 23px;

  padding: 0 7px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    linear-gradient(
      90deg,
      #363b59,
      #626887
    );

  color: #f1f1f4;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  letter-spacing: 1px;
}

.window-bar button {
  border: 0;

  background: #b8bdcf;

  color: #24283e;

  width: 16px;
  height: 15px;

  cursor: pointer;

  font-weight: bold;
}

.window-bar button:hover {
  background: #e1e3ed;
}

/* =========================================================
   VHS
========================================================= */

.vhs-window {
  width: 250px;

  left: 36%;
  top: 12%;

  transform: rotate(-2deg);
}

.vhs-screen {
  height: 145px;

  position: relative;

  overflow: hidden;

  background:
    repeating-linear-gradient(
      0deg,
      #262638,
      #262638 2px,
      #747a98 3px,
      #747a98 4px
    );

  color: #d4d6e5;
}

.vhs-static {
  position: absolute;
  inset: 0;

  opacity: .5;

  background:
    repeating-linear-gradient(
      90deg,
      transparent 0 2px,
      rgba(255,255,255,.15) 3px
    );

  animation: staticMove .12s infinite;
}

@keyframes staticMove {
  0% { transform: translateX(0); }
  50% { transform: translateX(-8px); }
  100% { transform: translateX(5px); }
}

.vhs-face {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Press Start 2P', monospace;

  font-size: 12px;

  text-shadow:
    2px 0 #8d3d65,
    -2px 0 #405b80;

  animation: vhsText 1.8s infinite;
}

@keyframes vhsText {
  0%, 80% {
    opacity: 1;
  }

  81% {
    opacity: .1;
  }

  82% {
    opacity: .8;
  }

  83% {
    opacity: .15;
  }

  84% {
    opacity: 1;
  }
}

.vhs-timestamp {
  position: absolute;

  left: 7px;
  top: 7px;

  font-size: 8px;

  font-family: 'Space Mono', monospace;
}

.vhs-tracking {
  position: absolute;

  bottom: 7px;
  right: 7px;

  font-size: 7px;

  font-family: 'Space Mono', monospace;
}

.vhs-controls {
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;

  color: #373b54;
}

/* =========================================================
   CD PLAYER
========================================================= */

.cd-window {
  width: 280px;

  right: 7%;
  top: 13%;

  transform: rotate(1deg);
}

.cd-body {
  display: flex;

  padding: 16px;

  gap: 15px;
}

.cd-disc {
  width: 105px;
  height: 105px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    conic-gradient(
      #b7bad0,
      #e3e4ec,
      #777d9b,
      #d7d9e4,
      #858aa4,
      #e7e8ef,
      #b7bad0
    );

  border: 2px solid #4e536d;

  position: relative;

  animation: cdSpin 5s linear infinite;

  box-shadow:
    0 0 8px rgba(31,34,55,.3);
}

@keyframes cdSpin {
  to {
    transform: rotate(360deg);
  }
}

.cd-hole {
  position: absolute;

  width: 18px;
  height: 18px;

  border-radius: 50%;

  left: 50%;
  top: 50%;

  transform: translate(-50%,-50%);

  background: #777d9a;

  border: 3px solid #4c526b;
}

.cd-info {
  padding-top: 5px;
}

.cd-track {
  font-family: 'Space Mono', monospace;

  font-size: 7px;

  color: #555a75;
}

.cd-title {
  margin-top: 10px;

  font-family: 'Press Start 2P', monospace;

  font-size: 8px;

  line-height: 1.7;

  color: #272a40;
}

.equalizer {
  height: 30px;

  margin-top: 12px;

  display: flex;
  align-items: end;

  gap: 2px;
}

.equalizer i {
  display: block;

  width: 4px;

  background: #555b7b;

  animation: eq .7s ease-in-out infinite alternate;
}

.equalizer i:nth-child(1) { height: 8px; }
.equalizer i:nth-child(2) { height: 21px; animation-delay: .1s; }
.equalizer i:nth-child(3) { height: 13px; animation-delay: .2s; }
.equalizer i:nth-child(4) { height: 25px; animation-delay: .3s; }
.equalizer i:nth-child(5) { height: 11px; animation-delay: .4s; }
.equalizer i:nth-child(6) { height: 28px; animation-delay: .5s; }
.equalizer i:nth-child(7) { height: 17px; animation-delay: .2s; }
.equalizer i:nth-child(8) { height: 24px; animation-delay: .1s; }
.equalizer i:nth-child(9) { height: 10px; }

@keyframes eq {
  to {
    height: 4px;
  }
}

.cd-time {
  margin-top: 8px;

  font-size: 9px;

  font-family: 'Space Mono', monospace;
}

.cd-buttons {
  border-top: 1px solid #85899e;

  text-align: center;

  padding: 8px;

  font-size: 12px;
}

/* =========================================================
   TERMINAL
========================================================= */

.terminal-window {
  width: 290px;

  left: 4%;
  bottom: 16%;

  background: #202338;

  color: #bfc5db;

  transform: rotate(1deg);
}

.terminal-bar {
  background: #363a57;
}

.terminal-content {
  min-height: 145px;

  padding: 13px;

  font-family: 'VT323', monospace;

  font-size: 13px;

  line-height: 1.45;
}

.terminal-green {
  color: #a5c9a6;
}

.terminal-yellow {
  color: #d4c28a;
}

.terminal-red {
  color: #c88d99;
}

.terminal-cursor {
  display: inline-block;

  animation: cursorBlink .8s infinite;
}

@keyframes cursorBlink {
  50% {
    opacity: 0;
  }
}

/* =========================================================
   ERROR WINDOW
========================================================= */

.error-window {
  width: 250px;

  right: 18%;
  bottom: 18%;

  transform: rotate(-1deg);

  z-index: 25;
}

.error-content {
  display: flex;

  gap: 12px;

  padding: 17px;

  font-family: 'Space Mono', monospace;

  font-size: 8px;

  line-height: 1.7;
}

.error-icon {
  width: 29px;
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #62677f;

  color: #fff;

  font-size: 20px;

  font-family: Arial;
}

.error-content p {
  margin: 5px 0 0;
}

.error-buttons {
  padding: 0 15px 13px;

  display: flex;
  justify-content: end;

  gap: 6px;
}

.error-buttons button {
  min-width: 58px;

  border: 1px solid #575c73;

  background: #d5d8e2;

  padding: 4px;

  font-family: 'Space Mono', monospace;

  font-size: 7px;
}

/* =========================================================
   STATS
========================================================= */

.stats-window {
  position: absolute;

  right: 3%;
  bottom: 14%;

  width: 125px;

  padding: 9px;

  background: rgba(196,200,216,.8);

  border: 1px solid #555b72;

  box-shadow: 3px 4px rgba(30,32,49,.2);

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  line-height: 1.8;

  z-index: 10;
}

.mini-bars {
  display: flex;

  gap: 2px;

  height: 22px;

  align-items: end;
}

.mini-bars span {
  width: 8px;

  background: #535975;

  animation: stats 1s infinite alternate;
}

.mini-bars span:nth-child(1) { height: 7px; }
.mini-bars span:nth-child(2) { height: 17px; animation-delay: .1s; }
.mini-bars span:nth-child(3) { height: 11px; animation-delay: .2s; }
.mini-bars span:nth-child(4) { height: 20px; animation-delay: .3s; }
.mini-bars span:nth-child(5) { height: 8px; animation-delay: .4s; }
.mini-bars span:nth-child(6) { height: 15px; animation-delay: .5s; }
.mini-bars span:nth-child(7) { height: 19px; animation-delay: .6s; }
.mini-bars span:nth-child(8) { height: 12px; animation-delay: .7s; }

@keyframes stats {
  to {
    transform: scaleY(.45);
  }
}

/* =========================================================
   PASSWORD WINDOW
========================================================= */

.password-window {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  width: min(500px, 85vw);

  background: #c5c9d8;

  border: 3px solid #3f445c;

  box-shadow:
    8px 10px 0 rgba(27,29,45,.25),
    inset 2px 2px white;

  z-index: 35;

  animation: passwordFloat 5s ease-in-out infinite;
}

@keyframes passwordFloat {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  50% {
    transform: translate(-50%, calc(-50% - 3px)) rotate(.25deg);
  }
}

.password-titlebar {
  height: 28px;

  font-size: 7px;
}

.window-dot {
  display: inline-block;

  width: 7px;
  height: 7px;

  margin-right: 3px;

  border: 1px solid #41455d;

  background: #a9afc4;
}

.password-inner {
  padding: 25px;
}

.security-header {
  display: flex;

  align-items: center;

  gap: 15px;
}

.security-symbol {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #454b67;

  color: #dfe1eb;

  font-size: 25px;

  box-shadow:
    inset 2px 2px rgba(255,255,255,.25);
}

.security-small {
  font-family: 'Space Mono', monospace;

  font-size: 7px;

  letter-spacing: 2px;

  color: #626780;
}

.security-header h1 {
  margin: 4px 0 0;

  font-family: 'Press Start 2P', monospace;

  font-size: clamp(13px, 2.5vw, 20px);

  line-height: 1.4;

  color: #292d46;
}

.security-divider {
  height: 1px;

  background: #777d94;

  margin: 20px 0;
}

.password-copy {
  margin: 0;

  font-family: 'VT323', monospace;

  font-size: 19px;

  color: #34384f;
}

.password-warning {
  font-family: 'Space Mono', monospace;

  font-size: 7px;

  color: #873642;

  margin-top: 8px;
}

.password-window form {
  margin-top: 20px;
}

.password-window label {
  display: block;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  margin-bottom: 6px;

  letter-spacing: 2px;
}

.password-row {
  display: flex;

  border: 2px solid #525871;

  background: #e2e4eb;
}

.prompt {
  padding: 10px;

  font-family: 'VT323', monospace;

  font-size: 18px;

  color: #535a77;
}

.password-row input {
  min-width: 0;
  flex: 1;

  border: 0;
  outline: 0;

  background: transparent;

  font-family: 'VT323', monospace;

  font-size: 18px;

  color: #242840;
}

.password-row input::placeholder {
  color: #898da0;
}

.password-row button {
  border: 0;

  border-left: 2px solid #525871;

  background: #555b79;

  color: white;

  padding: 0 14px;

  font-family: 'Press Start 2P', monospace;

  font-size: 7px;

  cursor: pointer;
}

.password-row button:hover {
  background: #383e5c;
}

.password-error {
  margin-top: 8px;

  color: #8d2837;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  animation: errorFlash .3s infinite;
}

@keyframes errorFlash {
  50% {
    opacity: .35;
  }
}

.password-bottom {
  display: flex;

  justify-content: space-between;

  margin-top: 20px;

  padding-top: 10px;

  border-top: 1px dashed #777d94;

  font-family: 'Space Mono', monospace;

  font-size: 6px;

  color: #666b82;
}

/* =========================================================
   FLOATING GRAPHICS
========================================================= */

.pixel-star {
  position: absolute;

  color: #353b59;

  font-family: 'VT323', monospace;

  font-size: 25px;

  animation: floatPixel 3s ease-in-out infinite;

  z-index: 5;
}

.star-1 {
  top: 24%;
  left: 44%;
}

.star-2 {
  top: 70%;
  left: 46%;

  animation-delay: .8s;
}

.star-3 {
  right: 31%;
  top: 45%;

  animation-delay: 1.4s;
}

.star-4 {
  right: 42%;
  bottom: 8%;

  animation-delay: 2s;
}

@keyframes floatPixel {
  0%,100% {
    transform: translateY(0) rotate(0deg);
    opacity: .35;
  }

  50% {
    transform: translateY(-10px) rotate(90deg);
    opacity: .9;
  }
}

.floating-code {
  position: absolute;

  font-family: 'Space Mono', monospace;

  font-size: 6px;

  line-height: 1.6;

  color: #454b69;

  opacity: .5;

  z-index: 3;

  animation: codeFlicker 4s infinite;
}

.code-1 {
  right: 37%;
  bottom: 13%;
}

.code-2 {
  left: 36%;
  top: 19%;
}

@keyframes codeFlicker {
  0%, 90% {
    opacity: .5;
  }

  91% {
    opacity: 0;
  }

  93% {
    opacity: .7;
  }

  95% {
    opacity: .1;
  }

  97% {
    opacity: .5;
  }
}

/* =========================================================
   FOLDER POPUP
========================================================= */

.folder-popup {
  position: fixed;

  left: 50%;
  top: 22%;

  transform: translateX(-50%);

  width: 230px;

  padding: 13px;

  display: flex;

  gap: 10px;

  background: #c8ccda;

  border: 2px solid #4b516a;

  box-shadow: 5px 6px rgba(20,22,37,.25);

  z-index: 60;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  animation: popup .2s steps(2);
}

@keyframes popup {
  from {
    transform: translateX(-50%) scale(.8);
  }

  to {
    transform: translateX(-50%) scale(1);
  }
}

.folder-popup-icon {
  font-size: 25px;
}

.folder-popup p {
  margin: 4px 0;

  color: #626780;
}

.popup-loading {
  position: absolute;

  left: 13px;
  right: 13px;
  bottom: 5px;

  color: #7d3040;
}

/* =========================================================
   TASKBAR
========================================================= */

.taskbar {
  position: fixed;

  bottom: 0;
  left: 0;
  right: 0;

  height: 32px;

  display: flex;
  align-items: center;

  gap: 4px;

  padding: 3px;

  background: #bfc3d2;

  border-top: 2px solid #e8e9ef;

  z-index: 70;

  font-family: 'Space Mono', monospace;

  font-size: 7px;
}

.start-button,
.task-item {
  height: 25px;

  display: flex;
  align-items: center;

  padding: 0 9px;

  background: #d1d4df;

  border: 1px solid #6b7084;

  box-shadow:
    inset 1px 1px #f4f5f8;

  color: #30344b;
}

.start-button {
  font-weight: bold;
}

.task-item {
  min-width: 110px;
}

.taskbar-right {
  margin-left: auto;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 8px;
}

/* =========================================================
   FAKE CURSOR
========================================================= */

.fake-cursor {
  position: fixed;

  right: 43%;
  bottom: 28%;

  font-size: 25px;

  color: #262a43;

  z-index: 75;

  animation: cursorMove 4s ease-in-out infinite;
}

@keyframes cursorMove {
  0%,100% {
    transform: translate(0,0);
  }

  50% {
    transform: translate(15px,-8px);
  }
}

/* =========================================================
   BOOT SCREEN
========================================================= */

.boot-screen {
  min-height: 100vh;

  background:
    radial-gradient(
      circle,
      #727993,
      #202334 70%
    );

  color: #cbd0df;

  font-family: 'VT323', monospace;

  display: flex;

  align-items: center;
  justify-content: center;

  position: relative;

  overflow: hidden;
}

.boot-content {
  width: min(650px, 88vw);

  position: relative;

  z-index: 10;
}

.boot-logo {
  text-align: center;

  font-family: 'Press Start 2P', monospace;

  font-size: clamp(20px, 5vw, 40px);

  letter-spacing: 5px;

  margin-bottom: 35px;

  animation: bootLogo 1s infinite alternate;
}

.boot-logo-small {
  display: block;

  margin-top: 10px;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  letter-spacing: 4px;

  opacity: .6;
}

@keyframes bootLogo {
  to {
    text-shadow:
      3px 0 #75415f,
      -3px 0 #465d7b;
  }
}

.boot-box {
  border: 2px solid #8990a8;

  padding: 25px;

  background: rgba(19,21,35,.72);

  box-shadow:
    0 0 40px rgba(0,0,0,.4);
}

.boot-title {
  font-family: 'Space Mono', monospace;

  font-size: 8px;

  letter-spacing: 3px;

  margin-bottom: 14px;
}

.boot-progress {
  height: 7px;

  border: 1px solid #727991;

  margin-bottom: 8px;
}

.boot-progress-fill {
  height: 100%;

  background: #a7acc0;

  transition: width .35s linear;

  box-shadow:
    0 0 10px rgba(200,205,225,.5);
}

.boot-percentage {
  text-align: right;

  font-family: 'Space Mono', monospace;

  font-size: 7px;
}

.boot-terminal {
  margin-top: 25px;

  min-height: 180px;

  font-size: 16px;

  line-height: 1.35;

  color: #adb3c8;
}

.current-boot-line {
  color: #eeeef3;

  text-shadow:
    0 0 8px rgba(220,225,240,.5);
}

.boot-footer {
  margin-top: 18px;

  text-align: center;

  font-family: 'Space Mono', monospace;

  font-size: 7px;

  letter-spacing: 2px;

  opacity: .5;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .desktop {
    min-height: 100svh;
  }

  .vhs-window {
    width: 180px;
    left: 3%;
    top: 10%;
  }

  .vhs-screen {
    height: 100px;
  }

  .cd-window {
    width: 190px;
    right: 2%;
    top: 11%;
  }

  .cd-disc {
    width: 65px;
    height: 65px;
  }

  .cd-info {
    transform: scale(.8);
    transform-origin: left top;
  }

  .terminal-window {
    width: 190px;
    left: 3%;
    bottom: 12%;
  }

  .error-window {
    display: none;
  }

  .stats-window {
    display: none;
  }

  .desktop-folder {
    transform: scale(.75);
  }

  .password-window {
    width: 88vw;
  }

  .password-inner {
    padding: 18px;
  }

  .password-bottom {
    font-size: 5px;
  }

  .task-item {
    display: none;
  }

  .fake-cursor {
    display: none;
  }

  .folder-name {
    font-size: 6px;
  }

  .desktop-title {
    top: 55px;
  }
}

`}</style>
