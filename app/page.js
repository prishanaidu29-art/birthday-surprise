'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [booted, setBooted] = useState(false)
  const [error, setError] = useState('')
  const [glitch, setGlitch] = useState(false)
  const [time, setTime] = useState('')

  const CORRECT_PASSWORD = '191104'

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setBooted(true)
    }, 1400)

    const glitchTimer = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 140)
    }, 4200)

    const clockTimer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }, 1000)

    return () => {
      clearTimeout(bootTimer)
      clearInterval(glitchTimer)
      clearInterval(clockTimer)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('birthday_authenticated', 'true')
      router.push('/birthday')
    } else {
      setError('ACCESS DENIED // TRY AGAIN')

      setTimeout(() => {
        setError('')
      }, 1800)
    }
  }

  if (!booted) {
    return (
      <main className="boot-screen">
        <div className="boot-content">
          <div className="boot-logo">CLAR_OS</div>

          <div className="boot-line">
            PERSONAL ARCHIVE SYSTEM
          </div>

          <div className="boot-line">
            MEMORY CHECK ............ OK
          </div>

          <div className="boot-line">
            VHS DRIVER .............. OK
          </div>

          <div className="boot-line">
            CD-ROM .................. OK
          </div>

          <div className="boot-line">
            USER MEMORY ............. FOUND
          </div>

          <div className="boot-progress">
            <span />
          </div>

          <div className="boot-warning">
            PLEASE WAIT...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="desktop">

      {/* CRT EFFECTS */}
      <div className="crt" />
      <div className="scanlines" />
      <div className="vignette" />

      {/* VHS TIMESTAMP */}
      <div className="vhs-time">
        REC&nbsp;&nbsp; 19.11.04
        <span className="rec-dot">●</span>
      </div>

      <div className="vhs-counter">
        SP&nbsp; 00:19:04:22
      </div>

      {/* TOP SYSTEM BAR */}
      <div className="system-bar">
        <div>
          CLAR_OS // PERSONAL COMPUTER
        </div>

        <div>
          SYSTEM&nbsp; {time || '00:00:00'}
        </div>
      </div>

      {/* DESKTOP ICONS */}
      <div className="desktop-icons">

        <DesktopIcon
          icon="📁"
          label="FEETGANG"
          onClick={() => {}}
        />

        <DesktopIcon
          icon="📁"
          label="EGGS"
          onClick={() => {}}
        />

        <DesktopIcon
          icon="📁"
          label="GRADUATION"
          onClick={() => {}}
        />

        <DesktopIcon
          icon="📁"
          label="LORE"
          onClick={() => {}}
        />

        <DesktopIcon
          icon="💿"
          label="CLAR_CD"
          onClick={() => {}}
        />

        <DesktopIcon
          icon="📼"
          label="VHS_2004"
          onClick={() => {}}
        />

      </div>

      {/* RANDOM BACKGROUND WINDOW */}
      <FakeWindow
        title="untitled.txt"
        className="window-notes"
      >
        <div className="notes">
          <div>things that should probably stay offline</div>
          <div>-----------------------------------</div>
          <div>01 // embarrassing photos</div>
          <div>02 // feetgang evidence</div>
          <div>03 // eggs</div>
          <div>04 // classified lore</div>
          <div>05 // absolutely nothing incriminating</div>
        </div>
      </FakeWindow>

      {/* PHOTO WINDOW */}
      <FakeWindow
        title="IMG_0194.JPG"
        className="window-photo"
      >
        <div className="photo-placeholder">
          <div className="photo-noise">
            IMAGE FILE
          </div>

          <div className="photo-caption">
            MEMORY_001.JPG
          </div>
        </div>
      </FakeWindow>

      {/* CD PLAYER */}
      <div className="cd-player">
        <div className="window-title">
          <span>CD PLAYER</span>
          <span>_ □ ×</span>
        </div>

        <div className="cd-body">

          <div className="cd-disc">
            <div className="cd-hole" />
            <div className="cd-label">
              CLAR
            </div>
          </div>

          <div className="cd-info">
            <div className="track-title">
              TRACK 01
            </div>

            <div className="track-name">
              SOMEHOW WE GOT HERE
            </div>

            <div className="progress">
              <span />
            </div>

            <div className="player-time">
              02:14&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;04:19
            </div>

            <div className="player-buttons">
              <button>◀</button>
              <button>▶</button>
              <button>▮▮</button>
              <button>■</button>
            </div>
          </div>

        </div>
      </div>

      {/* CENTRAL PASSWORD WINDOW */}
      <div className={`access-window ${glitch ? 'glitch-active' : ''}`}>

        <div className="window-title main-title">
          <span>CLAR_OS.EXE</span>

          <span className="window-controls">
            _
            □
            ×
          </span>
        </div>

        <div className="access-content">

          <div className="system-mark">
            CLAR_OS
          </div>

          <div className="corrupted">
            PERSONAL ARCHIVE
          </div>

          <div className="access-title">
            ACCESS REQUIRED
          </div>

          <div className="access-subtitle">
            MEMORY SYSTEM // CLASSIFIED
          </div>

          <form onSubmit={handleSubmit}>

            <div className="password-label">
              ENTER PASSWORD
            </div>

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
                spellCheck="false"
              />

              <button type="submit">
                ENTER
              </button>

            </div>

          </form>

          <div className={`error-message ${error ? 'visible' : ''}`}>
            {error || ' '}
          </div>

          <div className="access-footer">
            USER: UNKNOWN
            <span />
            STATUS: LOCKED
          </div>

        </div>

      </div>

      {/* SMALL SYSTEM POPUP */}
      <div className="system-popup">
        <div className="window-title">
          <span>SYSTEM</span>
          <span>×</span>
        </div>

        <div className="popup-content">
          <span className="warning-symbol">!</span>

          <span>
            this computer contains
            <br />
            questionable memories.
          </span>
        </div>
      </div>

      {/* BOTTOM TASKBAR */}
      <div className="taskbar">

        <button className="start-button">
          ◈ START
        </button>

        <div className="task">
          CLAR_OS.EXE
        </div>

        <div className="task">
          CD PLAYER
        </div>

        <div className="taskbar-spacer" />

        <div className="task-clock">
          {time || '00:00'}
        </div>

      </div>

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Silkscreen:wght@400;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #727b98;
          overflow-x: hidden;
        }

        body {
          font-family: 'Share Tech Mono', monospace;
        }

        button,
        input {
          font-family: inherit;
        }

        /* =========================
           BOOT
        ========================= */

        .boot-screen {
          width: 100vw;
          height: 100vh;
          background: #11141b;
          color: #b9c7dd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'VT323', monospace;
          letter-spacing: .08em;
        }

        .boot-content {
          width: min(600px, 85vw);
          font-size: 18px;
        }

        .boot-logo {
          font-family: 'Silkscreen', monospace;
          font-size: clamp(22px, 4vw, 38px);
          margin-bottom: 28px;
          color: #d2d9ea;
        }

        .boot-line {
          margin: 7px 0;
          opacity: .8;
        }

        .boot-progress {
          margin-top: 30px;
          height: 10px;
          border: 1px solid #77829c;
        }

        .boot-progress span {
          display: block;
          width: 100%;
          height: 100%;
          background: #aebbd2;
          animation: bootProgress 1.3s linear;
        }

        .boot-warning {
          margin-top: 20px;
          animation: blink 700ms steps(2) infinite;
        }

        /* =========================
           DESKTOP
        ========================= */

        .desktop {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          overflow: hidden;

          background:
            radial-gradient(
              ellipse at 50% 45%,
              rgba(193, 196, 221, .45),
              transparent 65%
            ),
            linear-gradient(
              135deg,
              #697895,
              #8d91b0 45%,
              #737f9d
            );

          color: #202536;
        }

        /* subtle old monitor texture */

        .crt {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;

          background:
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,.025) 0px,
              rgba(255,255,255,.025) 1px,
              rgba(0,0,0,.04) 2px,
              rgba(0,0,0,.04) 4px
            );

          mix-blend-mode: overlay;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 101;

          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 3px,
              rgba(20,20,30,.13) 4px
            );

          opacity: .55;
        }

        .vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 102;

          box-shadow:
            inset 0 0 150px rgba(20,24,40,.4);
        }

        /* =========================
           VHS
        ========================= */

        .vhs-time {
          position: fixed;
          top: 55px;
          left: 30px;
          z-index: 20;

          font-family: 'VT323', monospace;
          font-size: 21px;
          color: rgba(237,240,247,.7);
          text-shadow: 1px 0 #8b5463;
        }

        .rec-dot {
          color: #b34d58;
          margin-left: 7px;
          animation: blink 1s steps(2) infinite;
        }

        .vhs-counter {
          position: fixed;
          right: 30px;
          top: 55px;
          z-index: 20;

          font-family: 'VT323', monospace;
          font-size: 19px;
          color: rgba(236,239,247,.55);
        }

        /* =========================
           SYSTEM BAR
        ========================= */

        .system-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 0 12px;

          background: rgba(38,43,59,.65);
          border-bottom: 1px solid rgba(220,225,240,.25);

          color: #d7dbea;
          font-family: 'VT323', monospace;
          font-size: 15px;

          z-index: 30;
        }

        /* =========================
           ICONS
        ========================= */

        .desktop-icons {
          position: absolute;
          top: 90px;
          left: 25px;

          display: flex;
          flex-direction: column;
          gap: 20px;

          z-index: 5;
        }

        .desktop-icon {
          width: 85px;
          text-align: center;
          color: #e3e6ee;

          font-family: 'VT323', monospace;
          font-size: 16px;

          text-shadow:
            1px 1px rgba(30,35,50,.8);
        }

        .desktop-icon .icon {
          font-size: 33px;
          display: block;
          margin-bottom: 3px;

          filter:
            grayscale(.15)
            drop-shadow(2px 2px rgba(35,40,55,.35));
        }

        .desktop-icon button {
          all: unset;
          cursor: pointer;
        }

        .desktop-icon:hover {
          filter: brightness(1.3);
          transform: translateX(2px);
        }

        /* =========================
           WINDOWS
        ========================= */

        .fake-window,
        .cd-player,
        .access-window,
        .system-popup {

          position: absolute;

          background:
            linear-gradient(
              135deg,
              rgba(207,213,228,.94),
              rgba(165,173,198,.94)
            );

          border:
            2px solid #454d64;

          box-shadow:
            4px 5px 0 rgba(36,40,57,.25),
            inset 1px 1px rgba(255,255,255,.7);

          z-index: 8;
        }

        .window-title {
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7px;

          background:
            linear-gradient(
              90deg,
              #343b53,
              #68728e,
              #454d67
            );

          color: #eef1f7;

          font-family: 'VT323', monospace;
          font-size: 16px;

          border-bottom: 1px solid #343b4d;
        }

        .window-notes {
          top: 110px;
          right: 7%;
          width: 280px;
          transform: rotate(-2deg);
          opacity: .8;
        }

        .notes {
          padding: 18px;
          min-height: 180px;

          background: #c5c4b9;
          color: #363846;

          font-family: 'VT323', monospace;
          font-size: 16px;
          line-height: 1.5;
        }

        .window-photo {
          bottom: 100px;
          left: 7%;
          width: 245px;
          transform: rotate(3deg);
          opacity: .82;
        }

        .photo-placeholder {
          height: 210px;

          background:
            radial-gradient(
              circle at 45% 40%,
              #b9b7ac,
              #767a88
            );

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          color: #333849;
          position: relative;
        }

        .photo-noise {
          font-family: 'VT323', monospace;
          font-size: 22px;
          opacity: .7;
        }

        .photo-caption {
          position: absolute;
          bottom: 8px;
          left: 10px;

          font-family: 'VT323', monospace;
          font-size: 14px;
        }

        /* =========================
           CD PLAYER
        ========================= */

        .cd-player {
          right: 5%;
          bottom: 120px;
          width: 340px;

          transform: rotate(1deg);
        }

        .cd-body {
          padding: 18px;

          display: flex;
          gap: 18px;
        }

        .cd-disc {
          width: 115px;
          height: 115px;
          flex-shrink: 0;

          border-radius: 50%;

          background:
            conic-gradient(
              #bfc5d5,
              #777f9a,
              #d7d8df,
              #858ca2,
              #c7ccd8,
              #737c96,
              #c5cad7
            );

          border: 1px solid #555d73;

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow:
            inset 0 0 20px rgba(255,255,255,.5),
            2px 2px 5px rgba(20,25,40,.25);

          animation: discSpin 8s linear infinite;
        }

        .cd-hole {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #788098;
          border: 3px solid #b7bccb;
        }

        .cd-label {
          position: absolute;

          width: 42px;
          height: 42px;

          border-radius: 50%;

          background: #8e7895;

          display: flex;
          align-items: center;
          justify-content: center;

          font-family: 'Silkscreen', monospace;
          font-size: 6px;

          color: #e2e0e7;
        }

        .cd-info {
          flex: 1;
          font-family: 'VT323', monospace;
        }

        .track-title {
          font-size: 14px;
          color: #555d70;
        }

        .track-name {
          font-size: 18px;
          margin: 4px 0 15px;
        }

        .progress {
          height: 5px;
          background: #777f92;
          margin-bottom: 7px;
        }

        .progress span {
          display: block;
          width: 52%;
          height: 100%;
          background: #3f475e;
        }

        .player-time {
          font-size: 14px;
          color: #565d70;
        }

        .player-buttons {
          display: flex;
          gap: 4px;
          margin-top: 12px;
        }

        .player-buttons button {
          width: 27px;
          height: 23px;

          border: 1px solid #596177;
          background: #b9bfd0;
          color: #3e4559;

          cursor: pointer;
        }

        /* =========================
           MAIN ACCESS WINDOW
        ========================= */

        .access-window {
          top: 50%;
          left: 50%;

          width: min(520px, 82vw);

          transform:
            translate(-50%, -50%)
            rotate(-.5deg);

          z-index: 15;
        }

        .access-window.glitch-active {
          animation: glitchWindow .14s steps(2);
        }

        .main-title {
          height: 29px;
          font-size: 17px;
        }

        .window-controls {
          letter-spacing: 5px;
        }

        .access-content {
          padding: 35px 38px 28px;

          background:
            linear-gradient(
              135deg,
              rgba(195,200,215,.96),
              rgba(173,181,204,.96)
            );
        }

        .system-mark {
          font-family: 'Silkscreen', monospace;
          font-size: clamp(18px, 4vw, 30px);

          color: #30374b;

          letter-spacing: .05em;

          margin-bottom: 5px;

          position: relative;
        }

        .corrupted {
          font-family: 'VT323', monospace;
          font-size: 17px;
          color: #697188;
          letter-spacing: .15em;
          margin-bottom: 28px;
        }

        .access-title {
          font-family: 'Silkscreen', monospace;
          font-size: clamp(15px, 3vw, 23px);

          color: #282f43;

          letter-spacing: .06em;

          margin-bottom: 7px;
        }

        .access-subtitle {
          font-family: 'VT323', monospace;
          color: #687086;
          font-size: 16px;

          margin-bottom: 30px;
        }

        .password-label {
          font-family: 'VT323', monospace;
          color: #454d62;
          font-size: 16px;
          margin-bottom: 6px;
        }

        .password-row {
          display: flex;
          align-items: center;

          border:
            1px solid #596278;

          background: rgba(225,227,234,.5);

          height: 43px;
        }

        .prompt {
          padding-left: 10px;
          font-family: 'VT323', monospace;
          color: #4a5266;
          font-size: 21px;
        }

        .password-row input {
          flex: 1;
          min-width: 0;

          border: 0;
          outline: 0;

          background: transparent;

          padding: 0 9px;

          color: #2d3345;

          font-family: 'VT323', monospace;
          font-size: 21px;

          letter-spacing: .15em;
        }

        .password-row button {
          height: 100%;
          padding: 0 16px;

          border: 0;
          border-left: 1px solid #596278;

          background: #59627b;
          color: #e7e9ef;

          font-family: 'VT323', monospace;
          font-size: 16px;

          cursor: pointer;
        }

        .password-row button:hover {
          background: #444c63;
        }

        .error-message {
          height: 24px;

          margin-top: 8px;

          font-family: 'VT323', monospace;
          font-size: 17px;

          color: #863f4d;

          opacity: 0;
        }

        .error-message.visible {
          opacity: 1;
          animation: errorGlitch .18s steps(2) infinite;
        }

        .access-footer {
          margin-top: 18px;

          display: flex;
          justify-content: space-between;

          font-family: 'VT323', monospace;
          font-size: 13px;

          color: #697187;
        }

        .access-footer span {
          flex: 1;
        }

        /* =========================
           POPUP
        ========================= */

        .system-popup {
          left: 30%;
          bottom: 120px;
          width: 245px;

          transform: rotate(-2deg);

          opacity: .72;
          z-index: 7;
        }

        .popup-content {
          padding: 15px;

          display: flex;
          gap: 13px;
          align-items: center;

          font-family: 'VT323', monospace;
          font-size: 16px;

          color: #3d4457;
        }

        .warning-symbol {
          width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #737c94;
          color: #e7e9ef;

          font-family: 'Silkscreen', monospace;
        }

        /* =========================
           TASKBAR
        ========================= */

        .taskbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;

          height: 38px;

          display: flex;
          align-items: center;
          gap: 4px;

          padding: 4px;

          background: #454d65;
          border-top: 1px solid #aeb5c8;

          z-index: 40;
        }

        .start-button,
        .task {
          height: 29px;

          border:
            1px solid #22293b;

          background:
            linear-gradient(
              #737c94,
              #555e76
            );

          color: #e4e7ee;

          font-family: 'VT323', monospace;
          font-size: 15px;

          padding: 0 12px;

          box-shadow:
            inset 1px 1px rgba(255,255,255,.25);
        }

        .start-button {
          font-family: 'Silkscreen', monospace;
          font-size: 9px;
          cursor: pointer;
        }

        .taskbar-spacer {
          flex: 1;
        }

        .task-clock {
          padding: 0 12px;

          color: #dfe3ed;

          font-family: 'VT323', monospace;
          font-size: 16px;
        }

        /* =========================
           GLITCH
        ========================= */

        @keyframes glitchWindow {

          0% {
            transform:
              translate(-50%, -50%)
              rotate(-.5deg);
          }

          25% {
            transform:
              translate(calc(-50% + 5px), -50%)
              skewX(4deg);
            filter:
              hue-rotate(25deg)
              contrast(1.3);
          }

          50% {
            transform:
              translate(calc(-50% - 4px), -50%)
              skewX(-3deg);
            filter:
              hue-rotate(-30deg)
              contrast(1.5);
          }

          75% {
            opacity: .55;
          }

          100% {
            transform:
              translate(-50%, -50%)
              rotate(-.5deg);
            opacity: 1;
            filter: none;
          }
        }

        @keyframes errorGlitch {
          0% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(3px);
          }

          100% {
            transform: translateX(-2px);
          }
        }

        @keyframes blink {
          0%, 45% {
            opacity: 1;
          }

          46%, 100% {
            opacity: 0;
          }
        }

        @keyframes bootProgress {
          from {
            width: 0;
          }

          to {
            width: 100%;
          }
        }

        @keyframes discSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 700px) {

          .desktop-icons {
            top: 60px;
            left: 10px;

            display: grid;
            grid-template-columns: repeat(3, 70px);
            gap: 10px;
          }

          .desktop-icon {
            width: 70px;
            font-size: 13px;
          }

          .desktop-icon .icon {
            font-size: 27px;
          }

          .window-notes {
            display: none;
          }

          .window-photo {
            left: -30px;
            bottom: 90px;
            opacity: .45;
            transform: scale(.75) rotate(3deg);
          }

          .cd-player {
            right: -45px;
            bottom: 80px;
            transform: scale(.7) rotate(1deg);
            transform-origin: right bottom;
            opacity: .7;
          }

          .system-popup {
            display: none;
          }

          .access-window {
            width: 88vw;
          }

          .access-content {
            padding: 25px 20px 20px;
          }

          .vhs-time {
            top: 125px;
            left: 10px;
          }

          .vhs-counter {
            top: 125px;
            right: 10px;
          }

          .task {
            display: none;
          }
        }

      `}</style>
    </main>
  )
}

function DesktopIcon({ icon, label }) {
  return (
    <div className="desktop-icon">
      <button type="button">
        <span className="icon">{icon}</span>
        <span>{label}</span>
      </button>
    </div>
  )
}

function FakeWindow({ title, className, children }) {
  return (
    <div className={`fake-window ${className}`}>
      <div className="window-title">
        <span>{title}</span>
        <span>_ □ ×</span>
      </div>

      {children}
    </div>
  )
}
