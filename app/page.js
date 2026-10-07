'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const router = useRouter()
  const audioRef = useRef(null)

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [glitch, setGlitch] = useState(false)
  const [isBooting, setIsBooting] = useState(false)
  const [time, setTime] = useState('00:00:00')

  /*
    CHANGE THIS
    --------------------------------
    Put the password you want here.
  */
  const CORRECT_PASSWORD = 'clar'

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()

      setTime(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
        })
      )
    }

    updateClock()

    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)
  }, [])

  /*
    Random glitch effect
  */
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true)

      setTimeout(() => {
        setGlitch(false)
      }, 180)
    }, 4200)

    return () => clearInterval(glitchInterval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.toLowerCase().trim() !== CORRECT_PASSWORD) {
      setError('ACCESS DENIED')

      setGlitch(true)

      setTimeout(() => {
        setGlitch(false)
      }, 500)

      return
    }

    setError('')
    setIsBooting(true)

    /*
      Music starts after the user's interaction.
      This avoids browser autoplay restrictions.
    */
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0
        await audioRef.current.play()
      } catch (err) {
        console.log('Audio could not autoplay:', err)
      }
    }

    sessionStorage.setItem('birthday_authenticated', 'true')

    setTimeout(() => {
      router.push('/birthday')
    }, 1800)
  }

  return (
    <main className="retro-desktop">

      {/* =====================================================
          MUSIC
      ====================================================== */}

      <audio
        ref={audioRef}
        src="/music/birthday-song.mp3"
        loop
        preload="auto"
      />

      {/* =====================================================
          CRT / VHS OVERLAYS
      ====================================================== */}

      <div className="scanlines" />
      <div className="noise" />
      <div className="screen-vignette" />

      {/* =====================================================
          TOP SYSTEM BAR
      ====================================================== */}

      <header className="system-bar">

        <div className="system-left">
          <span className="system-dot red" />
          <span className="system-dot yellow" />
          <span className="system-dot green" />

          <span className="system-title">
            CLAR_OS
          </span>
        </div>

        <div className="system-right">
          <span>REC ●</span>
          <span>{time}</span>
          <span>V.19.11.04</span>
        </div>

      </header>

      {/* =====================================================
          VHS LABEL
      ====================================================== */}

      <div className="vhs-label">
        <span>VHS-001</span>
        <span>PRIVATE</span>
        <span>DO NOT DUPLICATE</span>
      </div>

      {/* =====================================================
          DECORATIVE CD
      ====================================================== */}

      <div className="cd cd-one">
        <div className="cd-hole" />
        <div className="cd-label">
          CLAR
        </div>
      </div>

      <div className="cd cd-two">
        <div className="cd-hole" />
      </div>

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <section className="desktop">

        {/* ---------------------------------------------------
            FOLDER 01
        ---------------------------------------------------- */}

        <button
          className="folder folder-one"
          onClick={() => setGlitch(true)}
        >
          <div className="folder-icon">
            📁
          </div>

          <div className="folder-name">
            FEETGANG
          </div>
        </button>

        {/* ---------------------------------------------------
            FOLDER 02
        ---------------------------------------------------- */}

        <button
          className="folder folder-two"
          onClick={() => setGlitch(true)}
        >
          <div className="folder-icon">
            📁
          </div>

          <div className="folder-name">
            EGGS
          </div>
        </button>

        {/* ---------------------------------------------------
            FOLDER 03
        ---------------------------------------------------- */}

        <button
          className="folder folder-three"
          onClick={() => setGlitch(true)}
        >
          <div className="folder-icon">
            📁
          </div>

          <div className="folder-name">
            GRADUATION
          </div>
        </button>

        {/* ---------------------------------------------------
            FOLDER 04
        ---------------------------------------------------- */}

        <button
          className="folder folder-four"
          onClick={() => setGlitch(true)}
        >
          <div className="folder-icon">
            📁
          </div>

          <div className="folder-name">
            CHAOS
          </div>
        </button>

        {/* ---------------------------------------------------
            FOLDER 05
        ---------------------------------------------------- */}

        <button
          className="folder folder-five"
          onClick={() => setGlitch(true)}
        >
          <div className="folder-icon">
            📁
          </div>

          <div className="folder-name">
            2004_∞
          </div>
        </button>

        {/* ---------------------------------------------------
            PHOTO WINDOW
        ---------------------------------------------------- */}

        <div className="photo-window photo-one">

          <div className="window-header">
            <span>
              IMG_0001.JPG
            </span>

            <span>
              ×
            </span>
          </div>

          <div className="photo-frame">
            <img
              src="/photos/photo1.jpg"
              alt="Memory"
            />
          </div>

          <div className="window-footer">
            JPEG // 04.11.2004
          </div>

        </div>

        {/* ---------------------------------------------------
            SECOND PHOTO
        ---------------------------------------------------- */}

        <div className="photo-window photo-two">

          <div className="window-header">
            <span>
              IMG_019.JPG
            </span>

            <span>
              ×
            </span>
          </div>

          <div className="photo-frame">
            <img
              src="/photos/photo2.jpg"
              alt="Memory"
            />
          </div>

        </div>

        {/* =================================================
            CENTRAL LOGIN WINDOW
        ================================================== */}

        <div
          className={`login-window ${
            glitch ? 'glitch-active' : ''
          }`}
        >

          <div className="window-title">

            <span>
              SYSTEM MESSAGE
            </span>

            <div className="window-controls">
              − □ ×
            </div>

          </div>

          <div className="login-content">

            <div className="boot-text">

              <span className="tiny-label">
                PRIVATE ARCHIVE
              </span>

              <h1
                className={`glitch-title ${
                  glitch ? 'glitching' : ''
                }`}
                data-text="CLAR"
              >
                CLAR
              </h1>

              <p className="subtitle">
                BIRTHDAY ARCHIVE // 19.11
              </p>

            </div>

            <div className="divider" />

            {!isBooting ? (

              <form onSubmit={handleSubmit}>

                <label>
                  ENTER ACCESS CODE
                </label>

                <div className="password-row">

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                  />

                  <button type="submit">
                    ENTER
                  </button>

                </div>

                <div className="status-line">

                  <span>
                    {error || 'SYSTEM READY'}
                  </span>

                  <span>
                    ● ONLINE
                  </span>

                </div>

              </form>

            ) : (

              <div className="booting">

                <div className="boot-message">
                  ACCESS GRANTED
                </div>

                <div className="loading-bar">
                  <div />
                </div>

                <div className="boot-small">
                  LOADING MEMORIES...
                </div>

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            MINI VHS WINDOW
        ================================================== */}

        <div className="vhs-window">

          <div className="vhs-header">
            VHS PLAYER
          </div>

          <div className="vhs-screen">

            <div className="tracking-lines" />

            <span>
              PLAY ▶
            </span>

            <strong>
              00:19:11
            </strong>

          </div>

          <div className="vhs-buttons">
            ◀◀　▶　▶▶　■
          </div>

        </div>

        {/* =================================================
            CD PLAYER WINDOW
        ================================================== */}

        <div className="cd-player">

          <div className="cd-player-header">
            CD PLAYER
          </div>

          <div className="cd-player-body">

            <div className="mini-cd">
              <div />
            </div>

            <div>

              <div className="song-title">
                HAPPY BIRTHDAY.EXE
              </div>

              <div className="song-artist">
                CLAR // ARCHIVE 001
              </div>

              <div className="equalizer">
                ▂▅▂▇▃▆▂▇▅
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SMALL SYSTEM TEXT
        ================================================== */}

        <div className="system-note">
          <span>USER: DVA</span>
          <span>FILE: CLAR_BDAY</span>
          <span>STATUS: LOCKED</span>
        </div>

      </section>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <footer className="bottom-bar">

        <div>
          START ◉
        </div>

        <div className="bottom-center">
          © 2004–2026 // PERSONAL ARCHIVE
        </div>

        <div>
          MEMORY 64MB
        </div>

      </footer>

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Orbitron:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #c9c7c1;
        }

        button,
        input {
          font: inherit;
        }

        .retro-desktop {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 30% 20%,
              rgba(184, 170, 221, .55),
              transparent 28%
            ),
            radial-gradient(
              circle at 80% 75%,
              rgba(126, 154, 177, .4),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #d8d6d0,
              #aaa9a4
            );

          color: #202124;
          overflow: hidden;
          position: relative;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* ================================================
           CRT EFFECT
        ================================================= */

        .scanlines {
          position: fixed;
          inset: 0;
          z-index: 90;
          pointer-events: none;

          background:
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,.035) 0px,
              rgba(0,0,0,.035) 1px,
              transparent 1px,
              transparent 4px
            );

          mix-blend-mode: multiply;
        }

        .noise {
          position: fixed;
          inset: 0;
          z-index: 91;
          pointer-events: none;
          opacity: .09;

          background-image:
            url("https://grainy-gradients.vercel.app/noise.svg");
        }

        .screen-vignette {
          position: fixed;
          inset: 0;
          z-index: 89;
          pointer-events: none;

          box-shadow:
            inset 0 0 180px rgba(0,0,0,.22);
        }

        /* ================================================
           SYSTEM BAR
        ================================================= */

        .system-bar {
          position: relative;
          z-index: 10;

          height: 46px;
          padding: 0 18px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: rgba(225,223,218,.88);

          border-bottom: 2px solid #676660;

          font-family: 'DM Mono', monospace;
          font-size: 10px;

          box-shadow:
            0 2px 0 rgba(255,255,255,.7);
        }

        .system-left,
        .system-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .system-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid #555;
        }

        .red {
          background: #a75d63;
        }

        .yellow {
          background: #b2a069;
        }

        .green {
          background: #718c7a;
        }

        .system-title {
          margin-left: 4px;
          letter-spacing: .16em;
        }

        .system-right {
          color: #66645e;
          letter-spacing: .08em;
        }

        /* ================================================
           VHS LABEL
        ================================================= */

        .vhs-label {
          position: absolute;
          top: 76px;
          right: 35px;

          display: flex;
          flex-direction: column;

          font-family: 'DM Mono', monospace;
          font-size: 8px;

          letter-spacing: .18em;

          color: #57534e;

          transform: rotate(3deg);
        }

        /* ================================================
           DESKTOP
        ================================================= */

        .desktop {
          position: relative;
          min-height: calc(100vh - 86px);
          width: 100%;
        }

        /* ================================================
           FOLDERS
        ================================================= */

        .folder {
          position: absolute;

          width: 92px;

          border: 0;
          background: transparent;

          color: #272727;

          cursor: pointer;

          text-align: center;

          transition:
            transform .2s ease,
            filter .2s ease;
        }

        .folder:hover {
          transform: translateY(-5px) rotate(-2deg);
          filter: drop-shadow(0 8px 5px rgba(0,0,0,.18));
        }

        .folder-icon {
          font-size: 48px;
          line-height: 1;
          filter:
            drop-shadow(1px 1px 0 white)
            drop-shadow(2px 2px 0 rgba(0,0,0,.2));
        }

        .folder-name {
          margin-top: 5px;

          font-family: 'DM Mono', monospace;
          font-size: 9px;

          background: rgba(238,237,232,.72);
          border: 1px solid rgba(70,70,70,.3);

          padding: 3px 4px;

          letter-spacing: .04em;
        }

        .folder-one {
          left: 7%;
          top: 10%;
          transform: rotate(-5deg);
        }

        .folder-two {
          left: 17%;
          top: 31%;
          transform: rotate(3deg);
        }

        .folder-three {
          right: 12%;
          top: 17%;
          transform: rotate(-4deg);
        }

        .folder-four {
          right: 5%;
          bottom: 23%;
          transform: rotate(5deg);
        }

        .folder-five {
          left: 7%;
          bottom: 15%;
          transform: rotate(-3deg);
        }

        /* ================================================
           LOGIN WINDOW
        ================================================= */

        .login-window {
          position: absolute;

          left: 50%;
          top: 48%;

          transform: translate(-50%, -50%);

          width: min(520px, 88vw);

          background: #dddcd7;

          border:
            2px solid #4d4c49;

          box-shadow:
            10px 12px 0 rgba(44,43,40,.22),
            inset 1px 1px 0 white;

          z-index: 20;
        }

        .window-title,
        .window-header,
        .vhs-header,
        .cd-player-header {
          height: 30px;

          padding: 0 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background:
            linear-gradient(
              90deg,
              #6b647e,
              #8d82a4 60%,
              #5f5c69
            );

          color: white;

          font-family: 'DM Mono', monospace;
          font-size: 10px;

          letter-spacing: .05em;

          border-bottom: 2px solid #4c4a52;
        }

        .window-controls {
          letter-spacing: 4px;
          font-size: 12px;
        }

        .login-content {
          padding: 34px 34px 27px;
        }

        .tiny-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .3em;
          color: #77736d;
        }

        .glitch-title {
          position: relative;

          font-family: 'Orbitron', sans-serif;

          font-size: clamp(42px, 9vw, 76px);

          font-weight: 500;

          letter-spacing: .13em;

          margin: 7px 0 3px;

          color: #292733;

          width: fit-content;
        }

        .glitch-title.glitching {
          animation:
            glitch-main .16s infinite;
        }

        .glitch-title.glitching::before,
        .glitch-title.glitching::after {
          content: attr(data-text);

          position: absolute;

          left: 0;
          top: 0;

          width: 100%;

          overflow: hidden;

          pointer-events: none;
        }

        .glitch-title.glitching::before {
          color: #7467a2;
          transform: translate(4px, -2px);
          clip-path: inset(0 0 55% 0);
        }

        .glitch-title.glitching::after {
          color: #9a555e;
          transform: translate(-4px, 2px);
          clip-path: inset(55% 0 0 0);
        }

        .subtitle {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .2em;
          color: #77736f;
        }

        .divider {
          height: 1px;
          background: #aaa7a0;
          margin: 25px 0;
        }

        form label {
          display: block;

          font-family: 'DM Mono', monospace;
          font-size: 9px;

          letter-spacing: .15em;

          margin-bottom: 8px;

          color: #5f5c57;
        }

        .password-row {
          display: flex;
          gap: 6px;
        }

        .password-row input {
          flex: 1;

          min-width: 0;

          height: 42px;

          border:
            2px inset #aaa8a2;

          background: #efeee9;

          outline: none;

          padding: 0 12px;

          font-family: 'DM Mono', monospace;

          font-size: 14px;

          letter-spacing: .16em;

          color: #28272a;
        }

        .password-row input:focus {
          box-shadow:
            0 0 0 2px rgba(117,103,162,.25);
        }

        .password-row button {
          width: 92px;

          border:
            2px outset #d4d2cd;

          background: #c6c3bd;

          cursor: pointer;

          font-family: 'DM Mono', monospace;

          font-size: 10px;

          letter-spacing: .1em;
        }

        .password-row button:active {
          border-style: inset;
        }

        .status-line {
          display: flex;
          justify-content: space-between;

          margin-top: 9px;

          font-family: 'DM Mono', monospace;

          font-size: 8px;

          color: #77736e;

          letter-spacing: .08em;
        }

        /* ================================================
           BOOTING
        ================================================= */

        .booting {
          font-family: 'DM Mono', monospace;
        }

        .boot-message {
          font-size: 13px;
          letter-spacing: .15em;
          margin-bottom: 15px;

          animation:
            text-flicker 1s infinite;
        }

        .loading-bar {
          height: 15px;
          border: 2px inset #aaa8a2;
          background: #ecebe7;
          padding: 2px;
        }

        .loading-bar div {
          height: 100%;
          width: 0%;
          background:
            repeating-linear-gradient(
              90deg,
              #71679b 0px,
              #71679b 12px,
              #a69bc9 12px,
              #a69bc9 16px
            );

          animation:
            loading 1.6s steps(8) forwards;
        }

        .boot-small {
          margin-top: 8px;
          font-size: 8px;
          color: #77736d;
        }

        /* ================================================
           PHOTO WINDOWS
        ================================================= */

        .photo-window {
          position: absolute;

          width: 150px;

          background: #d5d4cf;

          border: 2px solid #55534f;

          box-shadow:
            7px 8px 0 rgba(0,0,0,.18);

          z-index: 7;
        }

        .photo-frame {
          padding: 5px;
          background: #232323;
        }

        .photo-frame img {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;

          filter:
            saturate(.75)
            contrast(1.08);
        }

        .window-footer {
          padding: 5px;

          font-family: 'DM Mono', monospace;
          font-size: 7px;
          color: #666;
        }

        .photo-one {
          right: 26%;
          bottom: 9%;
          transform: rotate(4deg);
        }

        .photo-two {
          left: 28%;
          top: 9%;
          transform: rotate(-4deg);
        }

        /* ================================================
           VHS PLAYER
        ================================================= */

        .vhs-window {
          position: absolute;

          right: 4%;
          bottom: 8%;

          width: 175px;

          background: #bbb9b3;

          border: 2px solid #55534f;

          box-shadow:
            7px 8px 0 rgba(0,0,0,.17);

          z-index: 8;
        }

        .vhs-screen {
          height: 80px;

          background:
            repeating-linear-gradient(
              0deg,
              #272733 0px,
              #272733 2px,
              #333341 2px,
              #333341 4px
            );

          color: #c4bddf;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          font-family: 'DM Mono', monospace;

          font-size: 9px;

          position: relative;

          overflow: hidden;
        }

        .vhs-screen strong {
          font-size: 17px;
          margin-top: 7px;
        }

        .tracking-lines {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;

          height: 3px;

          background: white;

          opacity: .25;

          animation:
            tracking 2s linear infinite;
        }

        .vhs-buttons {
          padding: 7px;

          text-align: center;

          font-family: 'DM Mono', monospace;

          font-size: 10px;
        }

        /* ================================================
           CD PLAYER
        ================================================= */

        .cd-player {
          position: absolute;

          left: 3%;
          bottom: 5%;

          width: 225px;

          background: #d8d6d1;

          border: 2px solid #575550;

          box-shadow:
            7px 8px 0 rgba(0,0,0,.15);

          z-index: 9;
        }

        .cd-player-body {
          display: flex;
          align-items: center;

          gap: 12px;

          padding: 12px;
        }

        .mini-cd {
          width: 54px;
          height: 54px;

          border-radius: 50%;

          background:
            conic-gradient(
              #9b8ab9,
              #d7d0df,
              #75849e,
              #b19dc9,
              #d9d8d1,
              #9b8ab9
            );

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.7);
        }

        .mini-cd div {
          width: 12px;
          height: 12px;

          border-radius: 50%;

          background: #d5d3ce;

          border: 1px solid #777;
        }

        .song-title {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .05em;
        }

        .song-artist {
          font-family: 'DM Mono', monospace;
          font-size: 7px;
          color: #77736d;
          margin-top: 5px;
        }

        .equalizer {
          color: #75699a;
          font-size: 12px;
          margin-top: 7px;
          letter-spacing: -2px;
        }

        /* ================================================
           CD DECORATION
        ================================================= */

        .cd {
          position: absolute;

          width: 155px;
          height: 155px;

          border-radius: 50%;

          background:
            conic-gradient(
              from 30deg,
              #a6a3b9,
              #dedbd0,
              #8b9aad,
              #c4abc8,
              #dad6c8,
              #7f8da1,
              #a6a3b9
            );

          opacity: .72;

          box-shadow:
            inset 0 0 0 2px rgba(255,255,255,.6),
            0 12px 25px rgba(0,0,0,.15);

          z-index: 1;
        }

        .cd::before {
          content: '';

          position: absolute;

          inset: 15px;

          border-radius: 50%;

          border:
            1px solid rgba(255,255,255,.65);
        }

        .cd::after {
          content: '';

          position: absolute;

          inset: 35px;

          border-radius: 50%;

          border:
            1px solid rgba(255,255,255,.55);
        }

        .cd-hole {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 17px;
          height: 17px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          background: #aaa9a3;

          border: 2px solid #777;
        }

        .cd-label {
          position: absolute;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          font-family: 'Orbitron', sans-serif;

          font-size: 12px;

          color: #5e536d;

          letter-spacing: .1em;
        }

        .cd-one {
          left: -45px;
          top: 17%;
          transform: rotate(-18deg);
        }

        .cd-two {
          right: -35px;
          top: 45%;
          transform: rotate(25deg);
        }

        /* ================================================
           SYSTEM NOTE
        ================================================= */

        .system-note {
          position: absolute;

          left: 50%;
          bottom: 3%;

          transform: translateX(-50%);

          display: flex;
          gap: 25px;

          font-family: 'DM Mono', monospace;

          font-size: 7px;

          color: #696661;

          letter-spacing: .1em;

          white-space: nowrap;
        }

        /* ================================================
           BOTTOM BAR
        ================================================= */

        .bottom-bar {
          position: fixed;

          bottom: 0;
          left: 0;
          right: 0;

          height: 40px;

          background: rgba(211,209,204,.95);

          border-top: 2px solid #696762;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 15px;

          z-index: 30;

          font-family: 'DM Mono', monospace;

          font-size: 8px;

          color: #5e5b56;

          letter-spacing: .08em;
        }

        .bottom-center {
          opacity: .7;
        }

        /* ================================================
           GLITCH
        ================================================= */

        @keyframes glitch-main {

          0% {
            transform: translate(0);
            opacity: 1;
          }

          20% {
            transform: translate(-3px, 1px);
            opacity: .7;
          }

          40% {
            transform: translate(3px, -1px);
            opacity: 1;
          }

          60% {
            transform: translate(-1px, 2px);
            opacity: .35;
          }

          80% {
            transform: translate(2px, 0);
            opacity: 1;
          }

          100% {
            transform: translate(0);
            opacity: 1;
          }
        }

        @keyframes text-flicker {

          0%, 100% {
            opacity: 1;
          }

          10% {
            opacity: .2;
          }

          12% {
            opacity: 1;
          }

          55% {
            opacity: .5;
          }

          57% {
            opacity: 1;
          }
        }

        @keyframes loading {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @keyframes tracking {

          0% {
            transform: translateY(-50px);
          }

          100% {
            transform: translateY(80px);
          }

        }

        /* ================================================
           MOBILE
        ================================================= */

        @media (max-width: 700px) {

          .system-right span:nth-child(2) {
            display: none;
          }

          .system-right {
            gap: 5px;
            font-size: 7px;
          }

          .folder {
            transform: scale(.78);
          }

          .folder-one {
            left: 2%;
            top: 7%;
          }

          .folder-two {
            left: 2%;
            top: 29%;
          }

          .folder-three {
            right: 0%;
            top: 7%;
          }

          .folder-four {
            right: 0%;
            bottom: 20%;
          }

          .folder-five {
            left: 2%;
            bottom: 11%;
          }

          .photo-one {
            display: none;
          }

          .photo-two {
            display: none;
          }

          .cd-player {
            left: 2%;
            bottom: 7%;
            transform: scale(.78);
            transform-origin: bottom left;
          }

          .vhs-window {
            right: 2%;
            bottom: 7%;
            transform: scale(.72);
            transform-origin: bottom right;
          }

          .login-window {
            top: 47%;
          }

          .login-content {
            padding: 25px 22px;
          }

          .system-note {
            display: none;
          }

          .bottom-center {
            display: none;
          }

          .bottom-bar {
            font-size: 7px;
          }

          .vhs-label {
            right: 15px;
            top: 65px;
          }

        }

      `}</style>

    </main>
  )
}
