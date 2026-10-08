'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function BirthdayPage() {
  const router = useRouter()

  const [eggOpen, setEggOpen] = useState(null)
  const [notesOpen, setNotesOpen] = useState(true)
  const [musicOpen, setMusicOpen] = useState(true)
  const [filesOpen, setFilesOpen] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(true)
  const [videoOpen, setVideoOpen] = useState(false)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [time, setTime] = useState(new Date())

  const audioRef = useRef(null)

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const sections = [
    {
      number: '01',
      title: 'MEMORIES',
      sub: 'photos / places / moments',
      link: '/birthday/memories',
      icon: '📁',
      colour: 'purple',
    },
    {
      number: '02',
      title: 'MESSAGES',
      sub: 'things people wanted you to know',
      link: '/birthday/messages',
      icon: '💌',
      colour: 'pink',
    },
    {
      number: '03',
      title: 'SOUNDTRACK',
      sub: 'songs about you',
      link: '/birthday/playlist',
      icon: '💿',
      colour: 'blue',
    },
    {
      number: '04',
      title: 'CHAOS',
      sub: 'shits / giggles / questionable decisions',
      link: '/birthday/games',
      icon: '🎮',
      colour: 'yellow',
    },
    {
      number: '05',
      title: 'QUIZ',
      sub: 'how well do you actually know us?',
      link: '/birthday/quiz',
      icon: '❓',
      colour: 'green',
    },
    {
      number: '06',
      title: 'JOURNEY',
      sub: 'everywhere somehow led to here',
      link: '/birthday/journey',
      icon: '🗺️',
      colour: 'red',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  const playMusic = () => {
    if (!audioRef.current) return

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          console.log('Tap the CD player to start music if autoplay is blocked')
        })
    }
  }

  const openEgg = (egg) => {
    setEggOpen(egg)
  }

  return (
    <main className="archive-screen">

      {/* =========================================================
          AUDIO
      ========================================================= */}

      <audio
        ref={audioRef}
        src="/media/intro.mp3"
        loop
      />

      {/* =========================================================
          CRT / VHS EFFECTS
      ========================================================= */}

      <div className="crt-lines" />
      <div className="vhs-noise" />
      <div className="screen-flicker" />

      {/* =========================================================
          BACKGROUND FLOATING GRAPHICS
      ========================================================= */}

      <div className="floating-symbol symbol-1">✦</div>
      <div className="floating-symbol symbol-2">+</div>
      <div className="floating-symbol symbol-3">✧</div>
      <div className="floating-symbol symbol-4">×</div>
      <div className="floating-symbol symbol-5">◆</div>
      <div className="floating-symbol symbol-6">◇</div>

      <div className="scan-bar" />

      {/* =========================================================
          TOP COMPUTER BAR
      ========================================================= */}

      <header className="computer-bar">

        <div className="system-name">
          <span className="green-dot" />
          CLAR_OS
          <span className="version">v2.2.06</span>
        </div>

        <div className="system-center">
          PRIVATE MEMORY ARCHIVE
        </div>

        <div className="system-right">
          <span>SYS.OK</span>
          <span>{time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</span>

          <button
            onClick={handleLogout}
            className="exit-button"
          >
            EXIT ×
          </button>
        </div>

      </header>

      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <section className="desktop">
        <div className="desktop-wallpaper-title" aria-hidden="true">CLAR'S COMPUTER <span>♡</span><small>PRIVATE ARCHIVE · 2004—2026</small></div>
        <div className="desktop-hint" aria-hidden="true">double-click energy, single-click controls ✦</div>

        {/* =====================================================
            DESKTOP ICONS
        ===================================================== */}

        <div className="desktop-icons">
          <button type="button" className="desktop-icon" onClick={() => setFilesOpen(true)} title="Open archive folders">
            <span className="icon-box purple">📁</span><span>MEMORY</span>
          </button>
          <button type="button" className="desktop-icon" onClick={() => setMusicOpen(true)} title="Open CD player">
            <span className="icon-box pink">💿</span><span>SOUND</span>
          </button>
          <button type="button" className="desktop-icon" onClick={() => setVideoOpen(true)} title="Open video player">
            <span className="icon-box blue">📼</span><span>VIDEO</span>
          </button>
          <button type="button" className="desktop-icon" onClick={() => setNotesOpen(true)} title="Open notes">
            <span className="icon-box yellow">📝</span><span>NOTES</span>
          </button>
        </div>

        {/* =====================================================
            WELCOME WINDOW
        ===================================================== */}

        <div className="window welcome-window">

          <div className="window-title purple-title">
            <span>WELCOME.EXE</span>

            <div className="window-buttons">
              <span>−</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>

          <div className="welcome-content">

            <div className="mini-status">
              <span className="blink-dot" />
              CONNECTION ESTABLISHED
            </div>

            <div className="glitch-title">
              WELCOME
              <span>CLAR</span>
            </div>

            <p className="welcome-copy">
              you've entered the archive.
              <br />
              please explore responsibly.
              <br />
              <span>...or don't.</span>
            </p>

            <div className="terminal-line">
              <span>&gt;</span>
              SYSTEM HAS BEEN WAITING FOR YOU
              <span className="cursor">_</span>
            </div>

          </div>

        </div>

        {/* =====================================================
            NOTES WINDOW
        ===================================================== */}

        {notesOpen && (
          <div className="window notes-window">

            <div className="window-title yellow-title">
              <span>notes.txt</span>

              <button onClick={() => setNotesOpen(false)}>
                ×
              </button>
            </div>

            <div className="notes-paper">

              <div className="paper-tape" />

              <p className="scribble big">
                READ BEFORE
                <br />
                PROCEEDING
              </p>

              <p className="scribble">
                Hi Clar,
              </p>

              <p className="scribble">
                this is sort of an archive for you
                to look back on your past 22 years.
              </p>

              <p className="scribble">
                as much as it is a memory book for you,
                don't think I didn't add a liiittlee bit
                of hidden stuff in here HAHAHAH
              </p>

              <p className="scribble">
                I took a heck of a long time to make
                sure you spend a long time on this
                so good LUCCCKKK :)
              </p>

              <div className="scribble-arrow">
                ↓↓↓
              </div>

              <div className="tiny-warning">
                <span>WARNING:</span>
                hidden objects detected
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            MUSIC WINDOW
        ===================================================== */}

        {musicOpen && (
          <div className="window music-window">

            <div className="window-title pink-title">

              <span>CD_PLAYER.EXE</span>

              <button onClick={() => setMusicOpen(false)}>
                ×
              </button>

            </div>

            <div className="music-body">

              <div className={`cd ${musicPlaying ? 'spinning' : ''}`}>
                <div className="cd-shine" />
                <div className="cd-hole" />
                <div className="cd-label">
                  CLAR
                </div>
              </div>

              <div className="music-info">
                <span className="track-number">
                  TRACK 01 / 22
                </span>

                <strong>
                  birthday.exe
                </strong>

                <small>
                  something chosen specifically for you
                </small>

                <div className="music-progress">
                  <span />
                </div>

                <button
                  onClick={playMusic}
                  className="play-button"
                >
                  {musicPlaying ? 'Ⅱ PAUSE' : '▶ PLAY'}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            PHOTO WINDOW
        ===================================================== */}

        {photoOpen && (
          <div className="window photo-window">

            <div className="window-title blue-title">

              <span>PHOTOS / RANDOM</span>

              <button onClick={() => setPhotoOpen(false)}>
                ×
              </button>

            </div>

            <div className="photo-collage">

              <div className="photo-placeholder photo-a">
                <img src="/images/clar-01.jpg" alt="Memory photo one" loading="lazy" />
                <span className="photo-stamp">IMG_0001.JPG</span>
              </div>

              <div className="photo-placeholder photo-b">
                <img src="/images/clar-03.jpg" alt="Memory photo two" loading="lazy" />
                <span className="photo-stamp">IMG_0003.JPG</span>
              </div>

              <div className="photo-placeholder photo-c">
                <img src="/images/clar-06.jpg" alt="Memory photo three" loading="lazy" />
                <span className="photo-stamp">IMG_0006.JPG</span>
              </div>

              <div className="photo-caption">
                DCIM / CLAR'S CAMERA ROLL — DO NOT DELETE ♡
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            VIDEO WINDOW
        ===================================================== */}

        {videoOpen && (
          <div className="window video-window">

            <div className="window-title purple-title">

              <span>VIDEO_001.MOV</span>

              <button onClick={() => setVideoOpen(false)}>
                ×
              </button>

            </div>

            <div className="video-placeholder">

              <div className="play-circle">
                ▶
              </div>

              <span>
                ADD VIDEO
              </span>

              <small>
                /public/media/video.mp4
              </small>

            </div>

          </div>
        )}

        {/* =====================================================
            FILES WINDOW
        ===================================================== */}

        {filesOpen && (
          <div className="window files-window">

            <div className="window-title green-title">

              <span>ARCHIVE / FILES</span>

              <button onClick={() => setFilesOpen(false)}>
                ×
              </button>

            </div>

            <div className="file-grid">

              {sections.map((section) => (
                <Link
                  key={section.number}
                  href={section.link}
                  className="mini-file"
                >

                  <div className={`folder folder-${section.colour}`}>
                    <span>{section.icon}</span>
                  </div>

                  <div className="file-number">
                    {section.number}
                  </div>

                  <div className="file-name">
                    {section.title}
                  </div>

                </Link>
              ))}

            </div>

          </div>
        )}

        {/* =====================================================
            SYSTEM TERMINAL
        ===================================================== */}

        {terminalOpen && (
          <div className="window terminal-window">

            <div className="window-title green-title">

              <span>TERMINAL</span>

              <button onClick={() => setTerminalOpen(false)}>
                ×
              </button>

            </div>

            <div className="terminal">

              <p>&gt; booting CLAR_OS...</p>
              <p>&gt; memories found: 22</p>
              <p>&gt; secrets found: ???</p>
              <p>&gt; birthday detected.</p>
              <p>&gt; good luck.</p>
              <p className="terminal-green">
                &gt; _
              </p>

            </div>

          </div>
        )}

        {/* =====================================================
            APP DOCK
        ===================================================== */}

        <div className="dock">

          <button
            onClick={() => setNotesOpen(true)}
            title="Notes"
          >
            📝
          </button>

          <button
            onClick={() => setMusicOpen(true)}
            title="Music"
          >
            💿
          </button>

          <button
            onClick={() => setPhotoOpen(true)}
            title="Photos"
          >
            📸
          </button>

          <button
            onClick={() => setVideoOpen(true)}
            title="Video"
          >
            📼
          </button>

          <button
            onClick={() => setFilesOpen(true)}
            title="Files"
          >
            📁
          </button>

          <button
            onClick={() => setTerminalOpen(true)}
            title="Terminal"
          >
            &gt;_
          </button>

        </div>

        {/* =====================================================
            EASTER EGG #1
            VERY NOTICEABLE BUT STILL HIDDEN
        ===================================================== */}

        <button
          className="egg-hotspot egg-one"
          onClick={() => openEgg('one')}
          aria-label="Hidden archive object"
        >
          <span className="egg-glow" />
          <span className="egg-arrow">↗</span>
        </button>

        {/* =====================================================
            EASTER EGG #2
        ===================================================== */}

        <button
          className="egg-hotspot egg-two"
          onClick={() => openEgg('two')}
          aria-label="Hidden archive object"
        >
          <span className="egg-glow" />
          <span className="egg-arrow">←</span>
        </button>

        {/* =====================================================
            LITTLE BACKGROUND GAME OBJECTS
        ===================================================== */}

        <div className="game-object obj-one">
          <span>★</span>
        </div>

        <div className="game-object obj-two">
          <span>?</span>
        </div>

        <div className="game-object obj-three">
          <span>+</span>
        </div>

        <div className="game-object obj-four">
          <span>◇</span>
        </div>

        {/* =====================================================
            BOTTOM STATUS BAR
        ===================================================== */}

        <div className="bottom-status">

          <span>
            <i className="status-green" />
            ONLINE
          </span>

          <span>
            ARCHIVE 001
          </span>

          <span>
            MEMORY SPACE: 87%
          </span>

          <span>
            [ TOUCH / CLICK TO EXPLORE ]
          </span>

        </div>

      </section>

      {/* =========================================================
          EASTER EGG MODAL
      ========================================================= */}

      {eggOpen && (
        <div className="egg-overlay">

          <div className="egg-window">

            <div className="egg-header">
              <span>
                SECRET_MESSAGE.EXE
              </span>

              <button
                onClick={() => setEggOpen(null)}
              >
                ×
              </button>
            </div>

            <div className="egg-content">

              <div className="egg-warning">
                ✦ SECRET OBJECT FOUND ✦
              </div>

              <h2>
                CONGRATS
                <br />
                YOU FOUND YOUR
                <br />
                {eggOpen === 'one'
                  ? 'FIRST'
                  : 'SECOND'}
                {' '}
                EASTER EGG
              </h2>

              <div className="egg-divider">
                ─────────
              </div>

              <p>
                apparently you actually looked around.
              </p>

              <p className="egg-small">
                most people would have just clicked
                the obvious stuff.
              </p>

              <div className="audio-card">

                <div className="audio-icon">
                  🎙
                </div>

                <div>
                  <strong>
                    SECRET VOICE MESSAGE
                  </strong>

                  <small>
                    from someone who knows you
                  </small>
                </div>

              </div>

              <audio
                controls
                className="secret-audio"
                src={
                  eggOpen === 'one'
                    ? '/audio/easter-egg-1.mp3'
                    : '/audio/easter-egg-2.mp3'
                }
              />

              <p className="audio-help">
                Replace the audio files in
                <br />
                <code>/public/audio/</code>
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          GLOBAL STYLES
      ========================================================= */}

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap');

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #09050f;
        }

        body {
          overflow-x: hidden;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* ======================================================
           MAIN SCREEN
        ====================================================== */

        .archive-screen {
          min-height: 100vh;
          color: #eee8ff;
          background:
            radial-gradient(circle at 15% 20%, rgba(108, 59, 180, .25), transparent 30%),
            radial-gradient(circle at 85% 70%, rgba(204, 46, 137, .16), transparent 30%),
            linear-gradient(135deg, #110a1b 0%, #171022 42%, #09070f 100%);
          font-family: 'Chakra Petch', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ======================================================
           CRT
        ====================================================== */

        .crt-lines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,.025) 0px,
            rgba(255,255,255,.025) 1px,
            transparent 2px,
            transparent 5px
          );
          mix-blend-mode: screen;
        }

        .vhs-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 998;
          opacity: .09;
          background-image:
            repeating-radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,.5) 0px,
              transparent 1px,
              transparent 3px
            );
          animation: noiseMove .18s steps(2) infinite;
        }

        .screen-flicker {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 997;
          background: rgba(120, 70, 255, .025);
          animation: flicker .12s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: .15; }
          45% { opacity: .03; }
          48% { opacity: .12; }
          50% { opacity: .04; }
          80% { opacity: .08; }
        }

        @keyframes noiseMove {
          0% { transform: translate(0,0); }
          25% { transform: translate(2%, -1%); }
          50% { transform: translate(-1%, 2%); }
          75% { transform: translate(1%, 1%); }
          100% { transform: translate(-2%, -1%); }
        }

        /* ======================================================
           TOP BAR
        ====================================================== */

        .computer-bar {
          height: 46px;
          border-bottom: 1px solid rgba(205, 171, 255, .2);
          background: rgba(13, 8, 22, .85);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          letter-spacing: .08em;
          position: relative;
          z-index: 50;
          box-shadow: 0 0 25px rgba(130, 75, 255, .1);
        }

        .system-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d7b9ff;
        }

        .version {
          color: #6f647c;
          font-size: 13px;
        }

        .green-dot,
        .blink-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8cffd1;
          box-shadow: 0 0 10px #8cffd1;
          display: inline-block;
          animation: blink 1.2s infinite;
        }

        .system-center {
          color: #70647c;
          font-size: 14px;
        }

        .system-right {
          display: flex;
          gap: 18px;
          align-items: center;
          color: #81758f;
        }

        .exit-button {
          background: transparent;
          border: 1px solid #3b2d4b;
          color: #8c789b;
          padding: 4px 9px;
          font-family: inherit;
          cursor: pointer;
        }

        .exit-button:hover {
          color: #fff;
          border-color: #bd63ff;
          box-shadow: 0 0 12px rgba(189,99,255,.4);
        }

        /* ======================================================
           DESKTOP
        ====================================================== */

        .desktop {
          min-height: calc(100vh - 46px);
          position: relative;
          overflow: hidden;
          padding: 35px;
        }

        /* ======================================================
           DESKTOP ICONS
        ====================================================== */

        .desktop-icons {
          position: absolute;
          left: 18px;
          top: 25px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 4;
        }

        .desktop-icon {
          width: 68px;
          text-align: center;
          color: #9c8daa;
          font-family: 'VT323', monospace;
          font-size: 14px;
          cursor: pointer;
          transition: transform .2s;
        }

        .desktop-icon:hover {
          transform: translateY(-4px);
          color: white;
        }

        .icon-box {
          width: 45px;
          height: 38px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.15);
          margin-bottom: 3px;
          font-size: 22px;
          background: rgba(30,20,42,.7);
          box-shadow: inset 0 0 12px rgba(255,255,255,.06);
        }

        .icon-box.purple { box-shadow: 0 0 14px rgba(173,93,255,.3); }
        .icon-box.pink { box-shadow: 0 0 14px rgba(255,71,184,.3); }
        .icon-box.blue { box-shadow: 0 0 14px rgba(91,189,255,.3); }
        .icon-box.yellow { box-shadow: 0 0 14px rgba(255,213,85,.3); }

        /* ======================================================
           WINDOWS
        ====================================================== */

        .window {
          position: absolute;
          background: rgba(19, 12, 28, .94);
          border: 1px solid rgba(194, 143, 255, .32);
          box-shadow:
            0 15px 50px rgba(0,0,0,.45),
            0 0 30px rgba(141, 65, 255, .08);
          backdrop-filter: blur(4px);
          overflow: hidden;
          animation: windowAppear .6s ease-out both;
        }

        @keyframes windowAppear {
          from {
            opacity: 0;
            transform: scale(.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .window-title {
          height: 29px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px 0 10px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          letter-spacing: .06em;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .window-title button {
          background: transparent;
          border: 0;
          color: inherit;
          font-size: 19px;
          cursor: pointer;
          font-family: inherit;
        }

        .purple-title {
          background: linear-gradient(90deg, #563083, #271639);
          color: #eadbff;
        }

        .pink-title {
          background: linear-gradient(90deg, #84355f, #33152d);
          color: #ffd9ef;
        }

        .blue-title {
          background: linear-gradient(90deg, #275c81, #152e42);
          color: #d7f3ff;
        }

        .yellow-title {
          background: linear-gradient(90deg, #80662b, #352c18);
          color: #fff0b1;
        }

        .green-title {
          background: linear-gradient(90deg, #246454, #102d27);
          color: #caffed;
        }

        /* ======================================================
           WELCOME
        ====================================================== */

        .welcome-window {
          width: 390px;
          left: 13%;
          top: 12%;
          z-index: 7;
        }

        .welcome-content {
          padding: 22px;
          min-height: 205px;
        }

        .mini-status {
          font-family: 'VT323', monospace;
          color: #8cffd1;
          font-size: 15px;
          letter-spacing: .12em;
          margin-bottom: 16px;
        }

        .glitch-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 26px;
          line-height: 1.45;
          color: #eee0ff;
          position: relative;
          text-shadow:
            3px 0 #ff3b9d,
            -3px 0 #53d8ff;
          animation: textGlitch 4s infinite;
        }

        .glitch-title span {
          display: block;
          color: #c58cff;
        }

        @keyframes textGlitch {
          0%, 88%, 100% {
            transform: translate(0);
            opacity: 1;
          }
          89% {
            transform: translate(-3px, 1px);
            opacity: .7;
          }
          90% {
            transform: translate(4px, -1px);
            opacity: .4;
          }
          91% {
            transform: translate(0);
            opacity: 1;
          }
        }

        .welcome-copy {
          font-family: 'VT323', monospace;
          font-size: 19px;
          line-height: 1.15;
          color: #9e91aa;
          margin: 17px 0;
        }

        .welcome-copy span {
          color: #e184ff;
        }

        .terminal-line {
          font-family: 'VT323', monospace;
          font-size: 15px;
          color: #71677d;
          border-top: 1px dashed #3a2d44;
          padding-top: 10px;
        }

        .terminal-line span:first-child {
          color: #8cffd1;
        }

        .cursor {
          animation: cursorBlink .7s infinite;
          color: #fff;
        }

        @keyframes cursorBlink {
          50% { opacity: 0; }
        }

        /* ======================================================
           NOTES
        ====================================================== */

        .notes-window {
          width: 330px;
          left: 5%;
          bottom: 16%;
          transform: rotate(-2deg);
          z-index: 8;
        }

        .notes-paper {
          background:
            linear-gradient(rgba(255,255,255,.95), rgba(235,226,202,.96)),
            #f2ecd9;
          color: #27202a;
          min-height: 285px;
          padding: 24px 22px;
          position: relative;
          overflow: hidden;
        }

        .paper-tape {
          position: absolute;
          top: 7px;
          left: 42%;
          width: 65px;
          height: 16px;
          background: rgba(209,183,128,.55);
          transform: rotate(-3deg);
        }

        .scribble {
          font-family: 'VT323', monospace;
          font-size: 17px;
          line-height: 1.05;
          margin: 0 0 11px;
          transform: rotate(-.5deg);
        }

        .scribble.big {
          font-size: 24px;
          color: #5e214f;
          font-weight: bold;
        }

        .scribble-arrow {
          font-family: monospace;
          color: #aa376b;
          font-size: 21px;
          animation: arrowBounce 1.2s infinite;
        }

        @keyframes arrowBounce {
          50% { transform: translateY(5px); }
        }

        .tiny-warning {
          font-family: 'VT323', monospace;
          font-size: 14px;
          margin-top: 8px;
          color: #69435f;
        }

        .tiny-warning span {
          color: #b43766;
        }

        /* ======================================================
           MUSIC
        ====================================================== */

        .music-window {
          width: 365px;
          right: 8%;
          top: 8%;
          z-index: 10;
        }

        .music-body {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 22px;
        }

        .cd {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background:
            conic-gradient(
              #e9e3f2,
              #6c5f82,
              #d9d0e7,
              #514364,
              #e8d9ff,
              #756584,
              #e9e3f2
            );
          position: relative;
          flex-shrink: 0;
          box-shadow:
            0 0 20px rgba(211,155,255,.3),
            inset 0 0 15px rgba(0,0,0,.4);
        }

        .cd.spinning {
          animation: cdSpin 1.8s linear infinite;
        }

        @keyframes cdSpin {
          to { transform: rotate(360deg); }
        }

        .cd-shine {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: linear-gradient(
            120deg,
            transparent 25%,
            rgba(255,255,255,.5) 40%,
            transparent 53%
          );
        }

        .cd-hole {
          position: absolute;
          width: 23px;
          height: 23px;
          background: #1a1122;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #c8bad4;
        }

        .cd-label {
          position: absolute;
          left: 50%;
          top: 32%;
          transform: translateX(-50%);
          font-family: 'VT323', monospace;
          font-size: 11px;
          color: #3d274c;
        }

        .music-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .track-number {
          font-family: 'VT323', monospace;
          color: #d679b0;
          font-size: 14px;
        }

        .music-info strong {
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
          line-height: 1.5;
          color: #f0e7ff;
        }

        .music-info small {
          font-family: 'VT323', monospace;
          color: #8b7e96;
          font-size: 15px;
        }

        .music-progress {
          width: 100%;
          height: 4px;
          background: #32253d;
          margin: 5px 0;
        }

        .music-progress span {
          display: block;
          width: 62%;
          height: 100%;
          background: linear-gradient(90deg, #b25cff, #ff5cb6);
          animation: progressPulse 2s infinite alternate;
        }

        @keyframes progressPulse {
          to { width: 82%; }
        }

        .play-button {
          width: max-content;
          border: 1px solid #a95dff;
          color: #dfc7ff;
          background: rgba(114,45,163,.2);
          padding: 6px 10px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          cursor: pointer;
        }

        .play-button:hover {
          background: #9c4bdb;
          color: white;
          box-shadow: 0 0 15px rgba(183,77,255,.5);
        }

        /* ======================================================
           PHOTOS
        ====================================================== */

        .photo-window {
          right: 7%;
          top: 39%;
          width: 320px;
          z-index: 6;
        }

        .photo-collage {
          min-height: 245px;
          position: relative;
          background: #17101d;
          padding: 16px;
        }

        .photo-placeholder {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-family: 'VT323', monospace;
          font-size: 17px;
          color: #93859e;
          border: 3px solid #ddd4e5;
          background:
            linear-gradient(135deg, #433650, #21192b);
          box-shadow: 4px 5px 0 rgba(0,0,0,.35);
        }

        .photo-a {
          width: 145px;
          height: 105px;
          left: 20px;
          top: 20px;
          transform: rotate(-5deg);
        }

        .photo-b {
          width: 125px;
          height: 95px;
          right: 17px;
          top: 30px;
          transform: rotate(7deg);
        }

        .photo-c {
          width: 135px;
          height: 95px;
          left: 78px;
          bottom: 25px;
          transform: rotate(2deg);
        }

        .photo-caption {
          position: absolute;
          bottom: 7px;
          left: 12px;
          right: 12px;
          font-family: 'VT323', monospace;
          font-size: 11px;
          color: #655a6c;
        }

        /* ======================================================
           VIDEO
        ====================================================== */

        .video-window {
          width: 300px;
          right: 34%;
          bottom: 12%;
          z-index: 12;
        }

        .video-placeholder {
          height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background:
            radial-gradient(circle, #3e2d4f 0%, #120c18 70%);
          color: #87758e;
          font-family: 'VT323', monospace;
        }

        .play-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid #bf73ff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #d59bff;
          box-shadow: 0 0 22px rgba(194,104,255,.35);
          animation: videoPulse 2s infinite;
        }

        @keyframes videoPulse {
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 35px rgba(194,104,255,.6);
          }
        }

        .video-placeholder small {
          font-size: 12px;
          color: #51475a;
        }

        /* ======================================================
           FILES
        ====================================================== */

        .files-window {
          width: 420px;
          left: 37%;
          bottom: 7%;
          z-index: 15;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          padding: 17px;
        }

        .mini-file {
          text-decoration: none;
          color: #b6a9bf;
          padding: 7px;
          transition: .2s;
          position: relative;
        }

        .mini-file:hover {
          background: rgba(174,95,255,.08);
          color: white;
          transform: translateY(-4px);
        }

        .folder {
          height: 52px;
          position: relative;
          border: 1px solid rgba(255,255,255,.12);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          margin-bottom: 5px;
        }

        .folder::before {
          content: '';
          position: absolute;
          left: 0;
          top: -7px;
          width: 23px;
          height: 8px;
          background: inherit;
          border: inherit;
          border-bottom: 0;
        }

        .folder-purple { background: #342050; }
        .folder-pink { background: #50213e; }
        .folder-blue { background: #1d3d55; }
        .folder-yellow { background: #51411f; }
        .folder-green { background: #1e483b; }
        .folder-red { background: #51242e; }

        .file-number {
          position: absolute;
          right: 5px;
          top: 4px;
          font-family: 'VT323', monospace;
          color: #6e6079;
          font-size: 12px;
        }

        .file-name {
          font-family: 'VT323', monospace;
          font-size: 15px;
          text-align: center;
          letter-spacing: .04em;
        }

        /* ======================================================
           TERMINAL
        ====================================================== */

        .terminal-window {
          width: 310px;
          right: 15%;
          bottom: 20%;
          z-index: 20;
        }

        .terminal {
          min-height: 180px;
          padding: 16px;
          background: #070c0b;
          color: #63e7b2;
          font-family: 'VT323', monospace;
          font-size: 18px;
          line-height: 1.25;
        }

        .terminal-green {
          color: #a4ffdb;
          animation: cursorBlink .8s infinite;
        }

        /* ======================================================
           DOCK
        ====================================================== */

        .dock {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          gap: 7px;
          padding: 8px 11px;
          background: rgba(13,8,19,.88);
          border: 1px solid #40304e;
          box-shadow: 0 0 30px rgba(111,52,180,.25);
          z-index: 60;
        }

        .dock button {
          width: 42px;
          height: 37px;
          border: 1px solid #372842;
          background: #1b1124;
          color: #c7b1d4;
          font-family: 'VT323', monospace;
          font-size: 19px;
          cursor: pointer;
          transition: .2s;
        }

        .dock button:hover {
          transform: translateY(-5px);
          background: #35204b;
          color: white;
          box-shadow: 0 0 15px rgba(191,88,255,.4);
        }

        /* ======================================================
           EASTER EGGS
        ====================================================== */

        .egg-hotspot {
          position: absolute;
          border: 0;
          background: transparent;
          cursor: pointer;
          z-index: 40;
          width: 42px;
          height: 42px;
        }

        /*
          EASTER EGG #1 LOCATION:
          lower-right edge of the welcome window area.
          It looks like a tiny corrupted arrow.
        */

        .egg-one {
          left: 35%;
          top: 30%;
        }

        /*
          EASTER EGG #2 LOCATION:
          beside the photo window, slightly underneath it.
        */

        .egg-two {
          right: 25%;
          top: 63%;
        }

        .egg-glow {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #d15cff;
          filter: blur(8px);
          opacity: .18;
          animation: eggGlow 2s ease-in-out infinite;
        }

        .egg-arrow {
          position: relative;
          color: #d68aff;
          font-family: 'VT323', monospace;
          font-size: 26px;
          text-shadow:
            0 0 5px #c451ff,
            0 0 12px #c451ff;
          animation: eggFlicker 2.8s infinite;
        }

        @keyframes eggGlow {
          0%, 100% {
            opacity: .08;
            transform: scale(.7);
          }
          50% {
            opacity: .5;
            transform: scale(1.2);
          }
        }

        @keyframes eggFlicker {
          0%, 80%, 100% {
            opacity: .15;
          }
          82% {
            opacity: 1;
          }
          84% {
            opacity: .1;
          }
          86% {
            opacity: .9;
          }
        }

        .egg-hotspot:hover .egg-arrow {
          opacity: 1;
          transform: scale(1.3);
        }

        /* ======================================================
           BACKGROUND GAME OBJECTS
        ====================================================== */

        .game-object {
          position: absolute;
          font-family: 'VT323', monospace;
          pointer-events: none;
          color: #755987;
          opacity: .35;
          animation: objectFloat 4s ease-in-out infinite;
        }

        .obj-one {
          top: 14%;
          right: 30%;
          font-size: 25px;
        }

        .obj-two {
          bottom: 30%;
          right: 5%;
          font-size: 28px;
          color: #ca5aff;
        }

        .obj-three {
          top: 45%;
          left: 46%;
          font-size: 20px;
        }

        .obj-four {
          bottom: 9%;
          left: 28%;
          font-size: 30px;
        }

        @keyframes objectFloat {
          0%,100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-10px) rotate(10deg);
          }
        }

        /* ======================================================
           FLOATING SYMBOLS
        ====================================================== */

        .floating-symbol {
          position: fixed;
          color: #a866c7;
          opacity: .18;
          pointer-events: none;
          font-family: 'VT323', monospace;
          z-index: 1;
          animation: floatSymbol 7s ease-in-out infinite;
        }

        .symbol-1 {
          left: 20%;
          top: 20%;
          font-size: 25px;
        }

        .symbol-2 {
          right: 22%;
          top: 25%;
          font-size: 18px;
          animation-delay: 1s;
        }

        .symbol-3 {
          left: 50%;
          top: 10%;
          font-size: 30px;
          animation-delay: 2s;
        }

        .symbol-4 {
          right: 12%;
          bottom: 25%;
          font-size: 20px;
          animation-delay: 3s;
        }

        .symbol-5 {
          left: 8%;
          bottom: 30%;
          font-size: 18px;
          animation-delay: 4s;
        }

        .symbol-6 {
          right: 45%;
          bottom: 8%;
          font-size: 24px;
          animation-delay: 1.5s;
        }

        @keyframes floatSymbol {
          0%,100% {
            transform: translate(0,0) rotate(0);
          }
          50% {
            transform: translate(12px,-20px) rotate(180deg);
          }
        }

        /* ======================================================
           SCAN BAR
        ====================================================== */

        .scan-bar {
          position: fixed;
          left: 0;
          right: 0;
          top: -10%;
          height: 2px;
          background: rgba(213,153,255,.35);
          box-shadow: 0 0 20px rgba(213,153,255,.8);
          z-index: 1000;
          pointer-events: none;
          animation: scan 5s linear infinite;
        }

        @keyframes scan {
          from {
            top: -5%;
          }
          to {
            top: 105%;
          }
        }

        /* ======================================================
           STATUS
        ====================================================== */

        .bottom-status {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 26px;
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(9,5,14,.9);
          border-top: 1px solid #302339;
          color: #65596c;
          font-family: 'VT323', monospace;
          font-size: 13px;
          letter-spacing: .05em;
          z-index: 55;
        }

        .bottom-status span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-green {
          width: 5px;
          height: 5px;
          background: #72ffbd;
          box-shadow: 0 0 7px #72ffbd;
          border-radius: 50%;
        }

        /* ======================================================
           EASTER EGG MODAL
        ====================================================== */

        .egg-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(4,2,8,.72);
          backdrop-filter: blur(7px);
        }

        .egg-window {
          width: 450px;
          max-width: 100%;
          background: #10091a;
          border: 1px solid #c45cff;
          box-shadow:
            0 0 25px rgba(196,92,255,.5),
            0 0 100px rgba(138,51,255,.2);
          animation: eggOpen .35s ease-out;
        }

        @keyframes eggOpen {
          from {
            opacity: 0;
            transform: scale(.88) rotate(-1deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        .egg-header {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          background: linear-gradient(90deg,#71319b,#281335);
          font-family: 'VT323', monospace;
          font-size: 17px;
          color: #f1dfff;
        }

        .egg-header button {
          border: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 20px;
          cursor: pointer;
        }

        .egg-content {
          padding: 30px;
          text-align: center;
        }

        .egg-warning {
          color: #e88cff;
          font-family: 'VT323', monospace;
          font-size: 16px;
          letter-spacing: .14em;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          50% { opacity: .35; }
        }

        .egg-content h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 18px;
          line-height: 1.7;
          color: #f1e6ff;
          text-shadow:
            2px 0 #ff48a9,
            -2px 0 #4ddcff;
          margin: 20px 0;
          animation: glitchSmall 3s infinite;
        }

        @keyframes glitchSmall {
          0%,90%,100% {
            transform: translateX(0);
          }
          92% {
            transform: translateX(-3px);
          }
          94% {
            transform: translateX(3px);
          }
        }

        .egg-divider {
          color: #684477;
          margin: 14px 0;
        }

        .egg-content p {
          font-family: 'VT323', monospace;
          color: #b5a5bf;
          font-size: 19px;
          line-height: 1.1;
        }

        .egg-small {
          color: #71627b !important;
          font-size: 15px !important;
        }

        .audio-card {
          margin: 20px 0 12px;
          border: 1px solid #392348;
          background: #170e21;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .audio-icon {
          width: 43px;
          height: 43px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #38204d;
          border: 1px solid #9856be;
          font-size: 21px;
        }

        .audio-card strong {
          display: block;
          font-family: 'VT323', monospace;
          color: #e7d3f1;
          font-size: 18px;
        }

        .audio-card small {
          font-family: 'VT323', monospace;
          color: #71617b;
          font-size: 14px;
        }

        .secret-audio {
          width: 100%;
          height: 36px;
        }

        .audio-help {
          font-size: 13px !important;
          color: #5f5268 !important;
          margin-top: 14px;
        }

        code {
          color: #c67cff;
        }

        /* ======================================================
           MOBILE
        ====================================================== */

        @media (max-width: 850px) {

          .computer-bar {
            height: 40px;
            padding: 0 9px;
            font-size: 13px;
          }

          .system-center {
            display: none;
          }

          .system-right span:first-child {
            display: none;
          }

          .desktop {
            min-height: calc(100vh - 40px);
            padding: 12px;
            overflow-y: auto;
            height: calc(100vh - 40px);
          }

          .desktop-icons {
            display: none;
          }

          .window {
            position: relative;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            bottom: auto !important;
            width: min(100%, 430px);
            margin: 20px auto;
            transform: none !important;
          }

          .welcome-window {
            margin-top: 12px;
          }

          .music-window,
          .photo-window,
          .notes-window,
          .files-window,
          .video-window,
          .terminal-window {
            display: block;
          }

          .notes-window {
            order: 2;
          }

          .welcome-window {
            order: 1;
          }

          .music-window {
            order: 3;
          }

          .photo-window {
            order: 4;
          }

          .files-window {
            order: 5;
          }

          .video-window {
            order: 6;
          }

          .terminal-window {
            order: 7;
          }

          .dock {
            position: fixed;
            bottom: 30px;
          }

          .bottom-status {
            position: fixed;
            bottom: 0;
            font-size: 10px;
          }

          .bottom-status span:nth-child(2),
          .bottom-status span:nth-child(3) {
            display: none;
          }

          .egg-one {
            left: 75%;
            top: 175px;
          }

          .egg-two {
            right: 4%;
            top: 640px;
          }

          .floating-symbol {
            display: none;
          }

        }

        @media (max-width: 480px) {

          .desktop {
            padding-bottom: 75px;
          }

          .glitch-title {
            font-size: 20px;
          }

          .music-body {
            gap: 12px;
          }

          .cd {
            width: 95px;
            height: 95px;
          }

          .file-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .egg-content {
            padding: 20px;
          }

          .egg-content h2 {
            font-size: 14px;
          }

        }


        /* ======================================================
           CLAR'S MESSY 2000s DESKTOP — DESKTOP / LAPTOP / IPAD
           Deliberately staggered, but important content stays readable.
        ====================================================== */

        .archive-screen {
          background:
            radial-gradient(ellipse at 17% 78%, rgba(133, 47, 134, .27), transparent 48%),
            radial-gradient(ellipse at 81% 17%, rgba(59, 112, 153, .15), transparent 43%),
            repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.012) 3px 4px),
            linear-gradient(132deg, #140a21, #20102e 52%, #100918);
        }

        .desktop {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(350px, 1.13fr) minmax(300px, .95fr);
          grid-template-rows: auto auto;
          align-content: center;
          align-items: start;
          gap: 20px 22px;
          padding: 88px 30px 110px 112px;
          min-height: max(calc(100vh - 46px), 790px);
          overflow: visible;
          isolation: isolate;
        }

        .desktop::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(214, 166, 255, .14) .7px, transparent .7px);
          background-size: 24px 24px;
          opacity: .23;
          z-index: -1;
        }

        .desktop-wallpaper-title {
          position: absolute;
          top: 13px;
          left: 116px;
          font-family: 'VT323', monospace;
          font-size: 32px;
          line-height: 1;
          letter-spacing: .055em;
          color: rgba(232, 208, 255, .65);
          text-shadow: 2px 2px rgba(255, 80, 179, .4);
          pointer-events: none;
        }
        .desktop-wallpaper-title span { color: #fca1cf; }
        .desktop-wallpaper-title small {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          letter-spacing: .22em;
          color: #8c7b9f;
        }
        .desktop-hint {
          position: absolute;
          right: 35px;
          top: 27px;
          color: #a889b7;
          font: 15px 'VT323', monospace;
          letter-spacing: .1em;
        }

        .desktop-icons { top: 110px; left: 18px; gap: 17px; }
        .desktop-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          border: 1px solid transparent;
          border-radius: 3px;
          background: transparent;
          padding: 7px 3px;
          font: 15px 'VT323', monospace;
        }
        .desktop-icon:hover, .desktop-icon:focus-visible {
          border-color: rgba(210, 170, 255, .45);
          background: rgba(146, 87, 220, .2);
          outline: none;
        }

        .desktop .window {
          position: relative;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          width: 100%;
          margin: 0;
          min-width: 0;
          border: 1px solid rgba(223, 183, 255, .55);
          box-shadow: 5px 6px 0 rgba(7, 4, 12, .45), 0 18px 42px rgba(0,0,0,.38);
          backdrop-filter: blur(8px);
        }
        .desktop .window-title {
          height: 32px;
          padding-inline: 12px;
          border-bottom: 1px solid rgba(255,255,255,.16);
          text-shadow: 1px 1px rgba(0,0,0,.4);
        }

        .desktop .welcome-window {
          grid-column: 1 / 3;
          grid-row: 1;
          max-width: 500px;
          justify-self: center;
          z-index: 6;
          translate: 14px 4px;
        }
        .desktop .notes-window {
          grid-column: 1;
          grid-row: 2;
          max-width: 360px;
          justify-self: center;
          z-index: 9;
          translate: -4px -20px;
          rotate: -1deg;
        }
        .desktop .music-window {
          grid-column: 3;
          grid-row: 1;
          z-index: 7;
          translate: -8px 16px;
          rotate: .6deg;
        }
        .desktop .files-window {
          grid-column: 2;
          grid-row: 2;
          z-index: 10;
          translate: 2px 10px;
          rotate: .5deg;
        }
        .desktop .photo-window {
          grid-column: 3;
          grid-row: 2;
          z-index: 8;
          translate: -12px -12px;
          rotate: -1deg;
        }
        .desktop .terminal-window {
          grid-column: 2;
          grid-row: 1;
          z-index: 15;
          translate: 30px 100px;
        }
        .desktop .video-window {
          grid-column: 2;
          grid-row: 1;
          z-index: 16;
          translate: 50px 130px;
        }
        .desktop .notes-paper { min-height: 290px; }
        .desktop .music-body { padding: 17px; gap: 15px; }
        .desktop .cd { width: clamp(90px, 8vw, 120px); height: clamp(90px, 8vw, 120px); }
        .desktop .file-grid { gap: 7px; padding: 12px; }
        .desktop .mini-file { text-align: center; padding: 7px 3px; }
        .desktop .file-name { overflow-wrap: anywhere; }

        .desktop .photo-collage { min-height: 270px; overflow: hidden; }
        .desktop .photo-placeholder {
          overflow: hidden;
          background: #1a1221;
          border: 5px solid #ede2eb;
          border-bottom-width: 17px;
          box-shadow: 4px 7px 0 rgba(0,0,0,.35);
        }
        .desktop .photo-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: sepia(.17) saturate(.7) contrast(1.12);
        }
        .desktop .photo-placeholder::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,.055) 2px 3px);
        }
        .desktop .photo-stamp {
          position: absolute;
          left: 2px;
          bottom: -15px;
          font: 11px 'VT323', monospace;
          color: #5a4264;
          white-space: nowrap;
        }

        @media (min-width: 1500px) {
          .desktop { max-width: 1680px; margin: 0 auto; }
        }

        @media (min-width: 851px) and (max-width: 1199px) {
          .desktop {
            grid-template-columns: minmax(280px, 1fr) minmax(300px, 1fr);
            grid-template-rows: auto auto auto;
            padding: 75px 28px 105px 90px;
            align-content: start;
            min-height: 980px;
          }
          .desktop .welcome-window { grid-column: 1; grid-row: 1; translate: 0 0; }
          .desktop .music-window { grid-column: 2; grid-row: 1; translate: 0 8px; }
          .desktop .notes-window { grid-column: 1; grid-row: 2; translate: 0 -8px; }
          .desktop .files-window { grid-column: 2; grid-row: 2; translate: 0 0; }
          .desktop .photo-window { grid-column: 1; grid-row: 3; translate: 0 0; max-width: 370px; justify-self: center; }
          .desktop .terminal-window, .desktop .video-window { grid-column: 2; grid-row: 3; translate: 0 0; }
          .desktop-wallpaper-title { left: 90px; }
          .desktop-icons { left: 10px; }
        }

        @media (max-width: 850px) {
          .desktop {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 16px;
            padding: 72px 16px 110px;
            height: auto;
            min-height: calc(100svh - 40px);
            overflow: visible;
          }
          .desktop-wallpaper-title { left: 18px; top: 14px; font-size: 28px; }
          .desktop-hint { display: none; }
          .desktop .window {
            position: relative;
            width: min(100%, 560px);
            max-width: 560px;
            margin: 0 auto;
            transform: none !important;
            translate: none;
            rotate: none;
          }
          .desktop .welcome-window { order: 1; }
          .desktop .notes-window { order: 2; }
          .desktop .music-window { order: 3; }
          .desktop .photo-window { order: 4; }
          .desktop .files-window { order: 5; }
          .desktop .terminal-window, .desktop .video-window { order: 6; }
          .dock { position: fixed; bottom: 28px; }
          .bottom-status { position: fixed; bottom: 0; }
        }

        @media (max-width: 480px) {
          .desktop { padding-inline: 12px; }
          .desktop .file-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .desktop .music-body { flex-wrap: wrap; }
          .desktop .photo-collage { min-height: 260px; }
        }

      `}</style>

    </main>
  )
}
