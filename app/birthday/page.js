'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function BirthdayPage() {
  const router = useRouter()

  const [windows, setWindows] = useState({
    welcome: true,
    archive: true,
    system: true,
    player: true,
    files: true,
  })

  const [eggFound, setEggFound] = useState(null)
  const [showEggPopup, setShowEggPopup] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bootTime, setBootTime] = useState(0)

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
      return
    }

    setBootTime(Date.now())

    const timer = setTimeout(() => {
      setBootTime(Date.now())
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  const sections = [
    {
      number: '01',
      title: 'MEMORIES',
      subtitle: 'photos / places / moments',
      icon: '📸',
      link: '/birthday/memories',
      colour: 'purple',
    },
    {
      number: '02',
      title: 'MESSAGES',
      subtitle: 'things people wanted you to know',
      icon: '💌',
      link: '/birthday/messages',
      colour: 'pink',
    },
    {
      number: '03',
      title: 'SOUNDTRACK',
      subtitle: 'songs that remind us of you',
      icon: '💿',
      link: '/birthday/playlist',
      colour: 'blue',
    },
    {
      number: '04',
      title: 'THE CHAOS',
      subtitle: 'shits / giggles / questionable decisions',
      icon: '☢',
      link: '/birthday/games',
      colour: 'green',
    },
    {
      number: '05',
      title: 'THE QUIZ',
      subtitle: 'let us see how well you actually know us',
      icon: '❔',
      link: '/birthday/quiz',
      colour: 'yellow',
    },
    {
      number: '06',
      title: 'THE JOURNEY',
      subtitle: 'everywhere somehow led to here',
      icon: '✈',
      link: '/birthday/journey',
      colour: 'red',
    },
  ]

  function toggleWindow(name) {
    setWindows((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  function logout() {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  function discoverEgg(number) {
    setEggFound(number)
    setShowEggPopup(true)
  }

  return (
    <main className="desktop">

      {/* =====================================================
          CRT / VHS BACKGROUND
      ===================================================== */}

      <div className="crt-noise" />
      <div className="scanlines" />
      <div className="vhs-bars" />

      <div className="background-grid" />

      {/* floating pixels */}
      <div className="pixel p1" />
      <div className="pixel p2" />
      <div className="pixel p3" />
      <div className="pixel p4" />

      {/* =====================================================
          TOP COMPUTER BAR
      ===================================================== */}

      <header className="computer-bar">

        <div className="computer-brand">
          <span className="brand-dot" />
          CLAR_OS
          <span className="version">v2.22</span>
        </div>

        <div className="computer-status">
          MEMORY ARCHIVE // ONLINE
        </div>

        <button
          className="exit-button"
          onClick={logout}
        >
          EXIT ↗
        </button>

      </header>


      {/* =====================================================
          MAIN DESKTOP
      ===================================================== */}

      <section className="desktop-area">

        {/* ===================================================
            WELCOME WINDOW
        =================================================== */}

        {windows.welcome && (
          <div className="window welcome-window">

            <WindowHeader
              title="WELCOME.TXT"
              colour="purple"
              onClose={() => toggleWindow('welcome')}
            />

            <div className="window-content">

              <div className="tiny-label">
                USER DETECTED
              </div>

              <h1 className="welcome-title glitch" data-text="WELCOME, CLAR">
                WELCOME, CLAR
              </h1>

              <p className="welcome-subtitle">
                SUBJECT: YOU
              </p>

              <div className="terminal-message">
                <span className="terminal-symbol">&gt;</span>

                <span>
                  congratulations.
                  <br />
                  you somehow made it into the archive.
                  <br />
                  please investigate responsibly.
                </span>

              </div>

              <div className="blink-line">
                █ SYSTEM READY █
              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            ARCHIVE WINDOW
        =================================================== */}

        {windows.archive && (
          <div className="window archive-window">

            <WindowHeader
              title="ARCHIVE.EXE"
              colour="pink"
              onClose={() => toggleWindow('archive')}
            />

            <div className="window-content">

              <div className="archive-heading">

                <div>
                  <span className="tiny-label">
                    PRIVATE ARCHIVE
                  </span>

                  <h2 className="archive-title glitch" data-text="THE CLAR FILES">
                    THE CLAR FILES
                  </h2>
                </div>

                <div className="archive-counter">
                  06 FILES
                </div>

              </div>


              <div className="section-grid">

                {sections.map((section) => (

                  <Link
                    href={section.link}
                    key={section.number}
                    className={`archive-file ${section.colour}`}
                  >

                    <div className="file-number">
                      {section.number}
                    </div>

                    <div className="file-icon">
                      {section.icon}
                    </div>

                    <div className="file-info">

                      <div className="file-name">
                        {section.title}
                      </div>

                      <div className="file-description">
                        {section.subtitle}
                      </div>

                    </div>

                    <div className="file-arrow">
                      ↗
                    </div>

                  </Link>

                ))}

              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            SYSTEM MONITOR
        =================================================== */}

        {windows.system && (
          <div className="window system-window">

            <WindowHeader
              title="SYSTEM_MONITOR"
              colour="green"
              onClose={() => toggleWindow('system')}
            />

            <div className="system-content">

              <div className="system-line">
                <span>ARCHIVE STATUS</span>
                <b>ONLINE</b>
              </div>

              <div className="system-line">
                <span>MEMORIES</span>
                <b>LOADED</b>
              </div>

              <div className="system-line">
                <span>CHAOS LEVEL</span>
                <b className="chaos">
                  ████████░░
                </b>
              </div>

              <div className="system-line">
                <span>SECRETS</span>
                <b className="danger">
                  02 DETECTED
                </b>
              </div>

              <div className="system-line">
                <span>USER</span>
                <b>CLAR</b>
              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            CD / MUSIC WINDOW
        =================================================== */}

        {windows.player && (
          <div className="window player-window">

            <WindowHeader
              title="CD_PLAYER.EXE"
              colour="blue"
              onClose={() => toggleWindow('player')}
            />

            <div className="player-content">

              <div className="cd-area">

                <div className="cd">
                  <div className="cd-shine" />
                  <div className="cd-hole" />
                  <div className="cd-label">
                    CLAR
                  </div>
                </div>

              </div>

              <div className="song-info">

                <span className="tiny-label">
                  NOW PLAYING
                </span>

                <div className="song-title">
                  birthday_archive.mp3
                </div>

                <div className="song-artist">
                  &lt; insert song here &gt;
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
                  <i />
                </div>

                <audio
                  id="archive-audio"
                  controls
                  className="audio-player"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source
                    src="/audio/main-song.mp3"
                    type="audio/mpeg"
                  />
                </audio>

              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            FILES WINDOW
        =================================================== */}

        {windows.files && (
          <div className="window files-window">

            <WindowHeader
              title="MY_FILES"
              colour="yellow"
              onClose={() => toggleWindow('files')}
            />

            <div className="files-content">

              <div className="mini-file">
                <span>📁</span>
                <small>FEETGANG</small>
              </div>

              <div className="mini-file">
                <span>📁</span>
                <small>EGGS</small>
              </div>

              <div className="mini-file">
                <span>📁</span>
                <small>GRADUATION</small>
              </div>

              <div className="mini-file">
                <span>📁</span>
                <small>DO_NOT_OPEN</small>
              </div>

              <div className="mini-file">
                <span>💾</span>
                <small>MEMORIES.DAT</small>
              </div>

              <div className="mini-file">
                <span>📼</span>
                <small>VIDEO_001</small>
              </div>

            </div>

          </div>
        )}


        {/* ===================================================
            HIDDEN EASTER EGG #1
        =================================================== */}

        <button
          className="hidden-secret secret-one"
          onClick={() => discoverEgg(1)}
          aria-label="Hidden Easter egg"
        >
          <span>→</span>
        </button>


        {/* ===================================================
            HIDDEN EASTER EGG #2
        =================================================== */}

        <button
          className="hidden-secret secret-two"
          onClick={() => discoverEgg(2)}
          aria-label="Hidden Easter egg"
        >
          <span>+</span>
        </button>


        {/* ===================================================
            FLOATING GLITCH TEXT
        =================================================== */}

        <div className="floating-text floating-one glitch">
          DO YOU REMEMBER?
        </div>

        <div className="floating-text floating-two">
          [ SEARCHING... ]
        </div>

        <div className="floating-text floating-three glitch">
          22 YEARS FOUND
        </div>

        <div className="floating-text floating-four">
          // FILE CORRUPTED //
        </div>


        {/* ===================================================
            DECORATIVE PHOTO POLAROIDS
        =================================================== */}

        <div className="polaroid polaroid-one">
          <div className="photo-placeholder">
            PHOTO_001
          </div>
          <span>???</span>
        </div>

        <div className="polaroid polaroid-two">
          <div className="photo-placeholder">
            PHOTO_002
          </div>
          <span>ARCHIVE</span>
        </div>


        {/* ===================================================
            BOTTOM STATUS
        =================================================== */}

        <div className="bottom-console">

          <span>
            MEMORY SYSTEM ONLINE
          </span>

          <span className="console-middle">
            ◉ ◉ ◉
          </span>

          <span>
            {isPlaying ? 'PLAYING AUDIO' : 'STANDBY'}
          </span>

        </div>

      </section>


      {/* =====================================================
          EASTER EGG POPUP
      ===================================================== */}

      {showEggPopup && (

        <div className="egg-overlay">

          <div className="egg-window">

            <div className="egg-header">
              SECRET_FILE.EXE

              <button
                onClick={() => setShowEggPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="egg-body">

              <div className="egg-icon">
                ★
              </div>

              <div className="egg-glitch">
                CONGRATS
              </div>

              <h2>
                YOU FOUND YOUR{' '}
                {eggFound === 1 ? 'FIRST' : 'SECOND'} EASTER EGG
              </h2>

              <p>
                Apparently you actually pay attention.
              </p>

              <div className="egg-divider" />

              <p className="play-question">
                Play audio?
              </p>

              <audio
                controls
                autoPlay
                className="egg-audio"
              >
                <source
                  src={
                    eggFound === 1
                      ? '/audio/easter-egg-1.mp3'
                      : '/audio/easter-egg-2.mp3'
                  }
                  type="audio/mpeg"
                />
              </audio>

              <button
                className="close-egg"
                onClick={() => setShowEggPopup(false)}
              >
                CLOSE FILE
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #09070d;
        }

        body {
          overflow-x: hidden;
        }


        /* ===================================================
           DESKTOP
        =================================================== */

        .desktop {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(110, 67, 180, .25),
              transparent 28%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(91, 43, 130, .25),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #110d19,
              #191426 45%,
              #0b0910
            );

          color: #eee7ff;
          position: relative;
          overflow: hidden;
          font-family:
            "Courier New",
            monospace;
        }


        /* ===================================================
           CRT
        =================================================== */

        .crt-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: .09;

          background-image:
            repeating-radial-gradient(
              circle at 0 0,
              rgba(255,255,255,.4) 0,
              rgba(255,255,255,.4) 1px,
              transparent 1px,
              transparent 3px
            );

          mix-blend-mode: screen;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 101;

          background:
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,.035) 0px,
              rgba(255,255,255,.035) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        .vhs-bars {
          position: fixed;
          left: 0;
          right: 0;
          top: 48%;
          height: 2px;
          background: #c76cff;
          opacity: .08;
          animation: vhsJump 5s infinite;
          pointer-events: none;
          z-index: 102;
        }

        @keyframes vhsJump {
          0% { transform: translateY(0); }
          20% { transform: translateY(-120px); }
          21% { transform: translateY(0); }
          65% { transform: translateY(90px); }
          66% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }


        /* ===================================================
           GRID
        =================================================== */

        .background-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .12;

          background-image:
            linear-gradient(
              rgba(180,120,255,.2) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(180,120,255,.2) 1px,
              transparent 1px
            );

          background-size: 45px 45px;
          transform: perspective(500px) rotateX(60deg)
            scale(1.5) translateY(180px);
          transform-origin: bottom;
        }


        /* ===================================================
           PIXELS
        =================================================== */

        .pixel {
          position: fixed;
          width: 7px;
          height: 7px;
          background: #bf6cff;
          box-shadow: 0 0 15px #bf6cff;
          animation: pixelFloat 4s infinite ease-in-out;
          pointer-events: none;
        }

        .p1 {
          top: 22%;
          left: 5%;
        }

        .p2 {
          top: 75%;
          right: 8%;
          animation-delay: 1s;
        }

        .p3 {
          top: 30%;
          right: 4%;
          animation-delay: 2s;
        }

        .p4 {
          bottom: 8%;
          left: 40%;
          animation-delay: 3s;
        }

        @keyframes pixelFloat {
          0%,100% {
            transform: translate(0,0);
            opacity: .25;
          }

          50% {
            transform: translate(10px,-20px);
            opacity: 1;
          }
        }


        /* ===================================================
           COMPUTER BAR
        =================================================== */

        .computer-bar {
          height: 52px;
          border-bottom: 1px solid rgba(183,111,255,.3);
          background: rgba(12,9,18,.85);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          position: relative;
          z-index: 20;
          box-shadow: 0 0 30px rgba(160,70,255,.15);
        }

        .computer-brand {
          color: #d18cff;
          font-size: 11px;
          letter-spacing: .2em;
          text-shadow: 0 0 10px #a94dff;
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          display: inline-block;
          background: #7dffbc;
          margin-right: 8px;
          border-radius: 50%;
          box-shadow: 0 0 12px #7dffbc;
        }

        .version {
          color: #696070;
          margin-left: 8px;
        }

        .computer-status {
          color: #70677b;
          font-size: 8px;
          letter-spacing: .2em;
        }

        .exit-button {
          border: 1px solid #45394f;
          color: #a99bad;
          background: transparent;
          padding: 7px 12px;
          font-family: inherit;
          font-size: 9px;
          cursor: pointer;
          transition: .2s;
        }

        .exit-button:hover {
          color: white;
          border-color: #bc70ff;
          box-shadow: 0 0 15px rgba(188,112,255,.4);
        }


        /* ===================================================
           DESKTOP AREA
        =================================================== */

        .desktop-area {
          position: relative;
          min-height: calc(100vh - 52px);
          padding: 25px;
          max-width: 1450px;
          margin: auto;
        }


        /* ===================================================
           WINDOWS
        =================================================== */

        .window {
          position: absolute;
          background: rgba(18,13,27,.94);
          border: 1px solid #593b69;
          box-shadow:
            0 0 0 1px rgba(0,0,0,.8),
            0 15px 40px rgba(0,0,0,.55),
            0 0 30px rgba(135,65,190,.12);

          backdrop-filter: blur(8px);
          overflow: hidden;
        }

        .window:hover {
          border-color: #9d5bd1;
        }

        .window::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(255,255,255,.015) 4px
            );
        }


        .window-header {
          height: 31px;
          background: #21182a;
          border-bottom: 1px solid #493550;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 9px;
          font-size: 8px;
          letter-spacing: .15em;
          color: #c7b8ce;
        }

        .window-controls {
          display: flex;
          gap: 5px;
        }

        .window-control {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .control-purple {
          background: #c579ff;
          box-shadow: 0 0 7px #c579ff;
        }

        .control-pink {
          background: #ff6fae;
          box-shadow: 0 0 7px #ff6fae;
        }

        .control-green {
          background: #6dffb1;
          box-shadow: 0 0 7px #6dffb1;
        }

        .control-blue {
          background: #65cfff;
          box-shadow: 0 0 7px #65cfff;
        }

        .control-yellow {
          background: #ffe26d;
          box-shadow: 0 0 7px #ffe26d;
        }

        .close-window {
          background: none;
          border: none;
          color: #8d7f94;
          cursor: pointer;
          font-family: inherit;
        }

        .close-window:hover {
          color: white;
        }


        /* ===================================================
           WINDOW POSITIONS
        =================================================== */

        .welcome-window {
          top: 35px;
          left: 35px;
          width: 390px;
          z-index: 5;
        }

        .archive-window {
          top: 190px;
          left: 310px;
          width: min(720px, calc(100% - 390px));
          z-index: 8;
        }

        .system-window {
          top: 70px;
          right: 45px;
          width: 245px;
          z-index: 4;
        }

        .player-window {
          right: 60px;
          top: 350px;
          width: 300px;
          z-index: 9;
        }

        .files-window {
          left: 40px;
          bottom: 70px;
          width: 330px;
          z-index: 10;
        }


        /* ===================================================
           WELCOME
        =================================================== */

        .window-content {
          padding: 22px;
        }

        .tiny-label {
          color: #786a84;
          font-size: 8px;
          letter-spacing: .25em;
        }

        .welcome-title {
          margin: 15px 0 5px;
          color: #e7cfff;
          font-family: "Courier New", monospace;
          font-size: 28px;
          letter-spacing: .08em;
          text-shadow:
            0 0 8px rgba(200,130,255,.7);
        }

        .welcome-subtitle {
          color: #ff77b9;
          font-size: 9px;
          letter-spacing: .2em;
        }

        .terminal-message {
          margin-top: 20px;
          display: flex;
          gap: 9px;
          color: #aaa0ae;
          font-size: 11px;
          line-height: 1.8;
        }

        .terminal-symbol {
          color: #72ffb5;
        }

        .blink-line {
          margin-top: 20px;
          color: #72ffb5;
          font-size: 9px;
          animation: blink 1.1s infinite;
        }

        @keyframes blink {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: .25; }
        }


        /* ===================================================
           ARCHIVE
        =================================================== */

        .archive-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 20px;
        }

        .archive-title {
          margin: 6px 0 0;
          font-size: 25px;
          letter-spacing: .1em;
          color: #eadcff;
        }

        .archive-counter {
          color: #66596c;
          font-size: 8px;
          letter-spacing: .15em;
        }

        .section-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .archive-file {
          min-height: 105px;
          position: relative;
          padding: 13px;
          border: 1px solid #352a3d;
          background: #151018;
          display: flex;
          align-items: center;
          gap: 12px;
          color: inherit;
          text-decoration: none;
          transition: .2s;
          overflow: hidden;
        }

        .archive-file:hover {
          transform: translateY(-3px);
          border-color: #a85dca;
          background: #21162b;
          box-shadow:
            0 0 20px rgba(190,90,255,.2);
        }

        .file-number {
          position: absolute;
          top: 5px;
          right: 7px;
          color: #413646;
          font-size: 7px;
        }

        .file-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #241a2b;
          border: 1px solid #453651;
          font-size: 20px;
          flex-shrink: 0;
        }

        .file-name {
          color: #ded0e6;
          font-size: 12px;
          letter-spacing: .1em;
        }

        .file-description {
          color: #716678;
          font-size: 8px;
          margin-top: 6px;
          line-height: 1.5;
        }

        .file-arrow {
          margin-left: auto;
          color: #624a6e;
          font-size: 16px;
        }

        .archive-file:hover .file-arrow {
          color: #db8cff;
          transform: translate(3px,-3px);
        }


        /* ===================================================
           SYSTEM
        =================================================== */

        .system-content {
          padding: 15px;
        }

        .system-line {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #342a38;
          padding: 8px 0;
          font-size: 8px;
          color: #756b7b;
        }

        .system-line b {
          color: #72ffb5;
          font-weight: normal;
        }

        .system-line .chaos {
          color: #ffcf6e;
        }

        .system-line .danger {
          color: #ff70a9;
        }


        /* ===================================================
           CD PLAYER
        =================================================== */

        .player-content {
          display: flex;
          padding: 18px;
          gap: 18px;
          align-items: center;
        }

        .cd-area {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cd {
          width: 85px;
          height: 85px;
          border-radius: 50%;

          background:
            conic-gradient(
              #26202b,
              #d3c6df,
              #493652,
              #bba7c9,
              #26202b
            );

          border: 2px solid #8f7b99;
          position: relative;

          animation: cdSpin 2.7s linear infinite;

          box-shadow:
            0 0 18px rgba(190,120,255,.25);
        }

        @keyframes cdSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .cd-hole {
          width: 18px;
          height: 18px;
          background: #17111d;
          border: 2px solid #a18ba9;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }

        .cd-label {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          color: #2a2030;
          font-size: 7px;
          font-weight: bold;
        }

        .song-info {
          flex: 1;
        }

        .song-title {
          color: #e1d4e7;
          margin-top: 8px;
          font-size: 11px;
        }

        .song-artist {
          color: #716578;
          font-size: 8px;
          margin-top: 4px;
        }

        .equalizer {
          display: flex;
          gap: 3px;
          height: 25px;
          align-items: end;
          margin: 15px 0;
        }

        .equalizer i {
          display: block;
          width: 3px;
          background: #a45bff;
          animation: equalize .7s infinite alternate;
        }

        .equalizer i:nth-child(1) { height: 30%; }
        .equalizer i:nth-child(2) { height: 70%; animation-delay: .1s; }
        .equalizer i:nth-child(3) { height: 45%; animation-delay: .2s; }
        .equalizer i:nth-child(4) { height: 90%; animation-delay: .3s; }
        .equalizer i:nth-child(5) { height: 60%; animation-delay: .15s; }
        .equalizer i:nth-child(6) { height: 85%; animation-delay: .25s; }
        .equalizer i:nth-child(7) { height: 40%; animation-delay: .35s; }
        .equalizer i:nth-child(8) { height: 75%; animation-delay: .2s; }
        .equalizer i:nth-child(9) { height: 50%; animation-delay: .1s; }
        .equalizer i:nth-child(10) { height: 80%; animation-delay: .3s; }

        @keyframes equalize {
          from { transform: scaleY(.35); }
          to { transform: scaleY(1); }
        }

        .audio-player {
          width: 100%;
          height: 30px;
          margin-top: 5px;
          filter: sepia(.4) hue-rotate(220deg) saturate(1.5);
        }


        /* ===================================================
           FILES
        =================================================== */

        .files-content {
          padding: 15px;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
        }

        .mini-file {
          text-align: center;
          cursor: pointer;
          transition: .2s;
        }

        .mini-file:hover {
          transform: translateY(-4px);
          filter: drop-shadow(0 0 8px #c16bff);
        }

        .mini-file span {
          display: block;
          font-size: 27px;
        }

        .mini-file small {
          display: block;
          color: #82778b;
          font-size: 6px;
          margin-top: 5px;
          word-break: break-word;
        }


        /* ===================================================
           GLITCH
        =================================================== */

        .glitch {
          position: relative;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glitch::before {
          color: #ff3b9d;
          transform: translate(-2px,0);
          clip-path: inset(0 0 55% 0);
          animation: glitchOne 3.5s infinite;
        }

        .glitch::after {
          color: #43d9ff;
          transform: translate(2px,0);
          clip-path: inset(55% 0 0 0);
          animation: glitchTwo 2.8s infinite;
        }

        @keyframes glitchOne {
          0%, 90%, 100% {
            transform: translate(0);
            opacity: 0;
          }

          91% {
            transform: translate(-4px,-2px);
            opacity: 1;
          }

          94% {
            transform: translate(3px,1px);
            opacity: 1;
          }

          97% {
            opacity: 0;
          }
        }

        @keyframes glitchTwo {
          0%, 85%, 100% {
            transform: translate(0);
            opacity: 0;
          }

          86% {
            transform: translate(4px,2px);
            opacity: 1;
          }

          89% {
            transform: translate(-3px,-1px);
            opacity: 1;
          }

          92% {
            opacity: 0;
          }
        }


        /* ===================================================
           FLOATING TEXT
        =================================================== */

        .floating-text {
          position: absolute;
          color: #5f5268;
          font-size: 7px;
          letter-spacing: .2em;
          pointer-events: none;
        }

        .floating-one {
          top: 5%;
          left: 48%;
        }

        .floating-two {
          bottom: 17%;
          right: 4%;
          animation: fadeText 3s infinite;
        }

        .floating-three {
          top: 65%;
          left: 4%;
          color: #6f5d78;
        }

        .floating-four {
          bottom: 5%;
          right: 40%;
          color: #4f4654;
        }

        @keyframes fadeText {
          0%,100% { opacity: .15; }
          50% { opacity: .8; }
        }


        /* ===================================================
           POLAROIDS
        =================================================== */

        .polaroid {
          position: absolute;
          padding: 7px 7px 13px;
          background: #d5c9d9;
          color: #201823;
          width: 115px;
          box-shadow: 0 12px 30px rgba(0,0,0,.5);
          font-size: 6px;
          text-align: center;
        }

        .photo-placeholder {
          height: 100px;
          background:
            linear-gradient(
              135deg,
              #31253b,
              #756183
            );
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d9c7e3;
          font-size: 7px;
        }

        .polaroid span {
          display: block;
          margin-top: 8px;
        }

        .polaroid-one {
          top: 45%;
          left: 5%;
          transform: rotate(-8deg);
        }

        .polaroid-two {
          bottom: 18%;
          right: 5%;
          transform: rotate(7deg);
        }


        /* ===================================================
           HIDDEN EASTER EGGS
        =================================================== */

        .hidden-secret {
          position: absolute;
          background: transparent;
          border: none;
          color: #8b4fa9;
          cursor: pointer;
          opacity: .12;
          transition: .4s;
          z-index: 30;
          animation: secretPulse 3s infinite;
        }

        .hidden-secret:hover {
          opacity: 1;
          color: #e7a1ff;
          text-shadow: 0 0 12px #d66cff;
        }

        .secret-one {
          top: 27%;
          right: 27%;
          font-size: 22px;
        }

        .secret-two {
          bottom: 23%;
          left: 26%;
          font-size: 17px;
        }

        @keyframes secretPulse {
          0%,100% {
            opacity: .06;
          }

          50% {
            opacity: .25;
          }
        }


        /* ===================================================
           EASTER EGG POPUP
        =================================================== */

        .egg-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .egg-window {
          width: min(470px, 100%);
          border: 1px solid #bb70ff;
          background: #100b17;
          box-shadow:
            0 0 20px rgba(190,90,255,.4),
            0 0 80px rgba(120,30,180,.2);
          animation: eggAppear .35s ease-out;
        }

        @keyframes eggAppear {
          from {
            opacity: 0;
            transform: scale(.92) translateY(10px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .egg-header {
          height: 34px;
          padding: 0 12px;
          background: #25172f;
          border-bottom: 1px solid #4e3760;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #d5c4df;
          font-size: 8px;
          letter-spacing: .2em;
        }

        .egg-header button {
          border: none;
          background: transparent;
          color: #a793ae;
          font-size: 17px;
          cursor: pointer;
        }

        .egg-body {
          padding: 30px;
          text-align: center;
        }

        .egg-icon {
          color: #e98cff;
          font-size: 30px;
          text-shadow: 0 0 20px #c655ff;
          animation: eggSpin 4s linear infinite;
        }

        @keyframes eggSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .egg-glitch {
          margin-top: 15px;
          color: #73ffb8;
          font-size: 10px;
          letter-spacing: .3em;
          animation: blink 1s infinite;
        }

        .egg-body h2 {
          color: #f0e5f6;
          font-size: 18px;
          line-height: 1.5;
          margin: 12px 0;
        }

        .egg-body p {
          color: #817487;
          font-size: 10px;
          line-height: 1.7;
        }

        .egg-divider {
          height: 1px;
          background: #392b43;
          margin: 22px 0;
        }

        .play-question {
          color: #dba5ff !important;
          letter-spacing: .1em;
        }

        .egg-audio {
          width: 100%;
          margin-top: 10px;
          filter: sepia(.4) hue-rotate(220deg);
        }

        .close-egg {
          margin-top: 20px;
          border: 1px solid #58396a;
          background: #1a1122;
          color: #b79fc2;
          padding: 9px 18px;
          font-family: inherit;
          font-size: 8px;
          letter-spacing: .15em;
          cursor: pointer;
        }

        .close-egg:hover {
          color: white;
          border-color: #c36cff;
          box-shadow: 0 0 15px rgba(195,108,255,.4);
        }


        /* ===================================================
           BOTTOM CONSOLE
        =================================================== */

        .bottom-console {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: 28px;
          background: rgba(8,6,11,.9);
          border-top: 1px solid #312737;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          color: #62596b;
          font-size: 7px;
          letter-spacing: .15em;
          z-index: 40;
        }

        .console-middle {
          color: #a45cff;
          animation: blink 2s infinite;
        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 800px) {

          .desktop {
            overflow-y: auto;
            min-height: 100vh;
          }

          .computer-status {
            display: none;
          }

          .desktop-area {
            min-height: 1100px;
            padding: 12px;
          }

          .window {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            width: 100% !important;
            margin-bottom: 14px;
          }

          .welcome-window {
            margin-top: 8px;
          }

          .archive-window {
            margin-top: 20px;
          }

          .section-grid {
            grid-template-columns: 1fr;
          }

          .system-window {
            width: 70% !important;
          }

          .player-window {
            width: 88% !important;
            margin-left: auto;
          }

          .files-window {
            width: 92% !important;
          }

          .polaroid {
            display: none;
          }

          .floating-text {
            display: none;
          }

          .secret-one {
            top: 70%;
            right: 8%;
          }

          .secret-two {
            bottom: 7%;
            left: 8%;
          }

          .bottom-console {
            position: fixed;
          }
        }

      `}</style>

    </main>
  )
}


/* ===========================================================
   WINDOW HEADER
=========================================================== */

function WindowHeader({
  title,
  colour = 'purple',
  onClose,
}) {
  return (
    <div className="window-header">

      <span>
        {title}
      </span>

      <div className="window-controls">

        <span className={`window-control control-${colour}`} />

        <span className="window-control control-green" />

        <button
          className="close-window"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          ×
        </button>

      </div>

    </div>
  )
}
