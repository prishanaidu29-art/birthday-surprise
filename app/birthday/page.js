'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Orbitron,
  Space_Mono,
  Press_Start_2P,
} from 'next/font/google'

export const dynamic = 'force-dynamic'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
})

const pixel = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
})

const sections = [
  {
    no: '01',
    title: 'MEMORIES',
    subtitle: 'photos / places / evidence',
    code: 'IMG_ARCHIVE',
    icon: '◉',
    href: '/birthday/memories',
    className: 'memory-window',
  },
  {
    no: '02',
    title: 'MESSAGES',
    subtitle: 'things people wanted to say',
    code: 'TXT_ARCHIVE',
    icon: '✉',
    href: '/birthday/messages',
    className: 'message-window',
  },
  {
    no: '03',
    title: 'SOUNDTRACK',
    subtitle: 'songs about you',
    code: 'AUDIO_DISC',
    icon: '♫',
    href: '/birthday/playlist',
    className: 'music-window',
  },
  {
    no: '04',
    title: 'CHAOS',
    subtitle: 'shits & giggles',
    code: 'ERROR_LOG',
    icon: '!',
    href: '/birthday/games',
    className: 'chaos-window',
  },
  {
    no: '05',
    title: 'QUIZ',
    subtitle: 'prove you actually know us',
    code: 'GAME.EXE',
    icon: '?',
    href: '/birthday/quiz',
    className: 'quiz-window',
  },
  {
    no: '06',
    title: 'JOURNEY',
    subtitle: 'everywhere somehow led here',
    code: 'SAVE_FILE',
    icon: '⌁',
    href: '/birthday/journey',
    className: 'journey-window',
  },
]

export default function BirthdayPage() {
  const router = useRouter()

  useEffect(() => {
    const authenticated = sessionStorage.getItem(
      'birthday_authenticated'
    )

    if (authenticated !== 'true') {
      router.replace('/')
    }
  }, [router])

  const logout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  return (
    <main
      className={`
        ${orbitron.variable}
        ${spaceMono.variable}
        ${pixel.variable}
        birthday-page
      `}
    >

      {/* GLOBAL GLITCH / CRT LAYERS */}
      <div className="noise" />
      <div className="scanlines" />
      <div className="screen-vignette" />

      {/* TOP COMPUTER BAR */}

      <div className="system-bar">

        <div className="system-left">
          <span className="windows-logo">
            ◈
          </span>

          <span>
            CLAR_OS
          </span>

          <span className="system-divider">
            /
          </span>

          <span className="glitch-text small-glitch">
            CONNECTED
          </span>
        </div>

        <div className="system-right">
          <span>
            29.05.2004
          </span>

          <span className="system-divider">
            |
          </span>

          <button
            onClick={logout}
            className="eject-button"
          >
            EJECT
          </button>
        </div>

      </div>

      <div className="desktop">

        {/* BACKGROUND METADATA */}

        <div className="coordinates">
          <div>
            // FILE: CLAR_22
          </div>
          <div>
            // STATUS: OPEN
          </div>
          <div>
            // FORMAT: CD-ROM
          </div>
        </div>

        <div className="barcode">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <small>
            2205290401
          </small>
        </div>


        {/* MAIN HERO WINDOW */}

        <section className="hero-window">

          <div className="window-titlebar">

            <div className="window-title">
              <span className="window-icon">
                ★
              </span>

              untitled - CLAR.exe
            </div>

            <div className="window-controls">
              <span>_</span>
              <span>□</span>
              <span>×</span>
            </div>

          </div>

          <div className="hero-content">

            <div className="hero-copy">

              <div className="micro-copy">
                // PERSONAL ARCHIVE
              </div>

              <div className="hero-name-wrap">

                <span className="hero-prefix">
                  HAPPY BIRTHDAY,
                </span>

                <h1
                  className="glitch-name"
                  data-text="CLAR"
                >
                  CLAR
                </h1>

              </div>

              <p className="hero-description">
                a badly organised digital archive
                of a person who has somehow made it
                this far
              </p>

              <div className="hero-buttons">

                <span className="fake-button">
                  ▶ PLAY
                </span>

                <span className="fake-button secondary">
                  OPEN FILE
                </span>

              </div>

            </div>


            {/* FAKE IMAGE WINDOW */}

            <div className="paint-window">

              <div className="paint-titlebar">
                <span>
                  untitled - Paint
                </span>

                <span>
                  _ □ ×
                </span>
              </div>

              <div className="paint-toolbar">

                <span>✎</span>
                <span>▣</span>
                <span>⌕</span>
                <span>◯</span>
                <span>╱</span>

              </div>

              <div className="fake-image">

                <div className="fake-sun">
                  ☼
                </div>

                <div className="fake-orbit">
                  ◯
                </div>

                <div className="fake-star">
                  ✦
                </div>

                <div className="fake-image-text">
                  <span>
                    ARCHIVE
                  </span>

                  <strong>
                    22
                  </strong>
                </div>

              </div>

              <div className="paint-palette">
                {Array.from({ length: 18 }).map(
                  (_, i) => (
                    <span key={i} />
                  )
                )}
              </div>

            </div>

          </div>

        </section>


        {/* CD */}

        <div className="floating-cd">

          <div className="cd-disc">

            <div className="cd-rainbow" />

            <div className="cd-centre">
              <span>
                CLAR
              </span>
              <small>
                MIX 01
              </small>
            </div>

          </div>

          <div className="cd-label">
            TRACK 01 / 06
          </div>

        </div>


        {/* MINI MEDIA PLAYER */}

        <div className="music-player">

          <div className="player-header">
            <span>
              ◉ CD PLAYER
            </span>

            <span>
              _ □ ×
            </span>
          </div>

          <div className="player-body">

            <div className="album-placeholder">
              <span>
                ♪
              </span>
            </div>

            <div className="track-info">

              <span className="player-label">
                NOW PLAYING
              </span>

              <strong className="glitch-text">
                BIRTHDAY.EXE
              </strong>

              <span>
                CLAR / TRACK 01
              </span>

            </div>

          </div>

          <div className="player-progress">
            <span />
          </div>

          <div className="player-controls">
            <span>◀◀</span>
            <span>▶</span>
            <span>▶▶</span>
            <span>↻</span>
          </div>

        </div>


        {/* MESSAGE POPUP */}

        <div className="message-popup">

          <div className="popup-titlebar">
            <span>
              System Message
            </span>

            <span>
              ×
            </span>
          </div>

          <div className="popup-body">

            <div className="popup-warning">
              !
            </div>

            <div>
              <p>
                Dear Player,
              </p>

              <p>
                Are you sure you want
                to continue being 22?
              </p>

              <div className="popup-buttons">
                <button>
                  OK
                </button>

                <button>
                  CANCEL
                </button>
              </div>
            </div>

          </div>

        </div>


        {/* MAIN DIRECTORY */}

        <section className="directory">

          <div className="directory-heading">

            <div>

              <span className="directory-kicker">
                MY COMPUTER / CLAR_ARCHIVE
              </span>

              <h2 className="glitch-text">
                FILES
              </h2>

            </div>

            <div className="directory-meta">
              6 OBJECTS
              <br />
              1.42 GB
            </div>

          </div>


          <div className="file-layout">

            {sections.map((section, index) => (

              <Link
                key={section.no}
                href={section.href}
                className={`desktop-window ${section.className}`}
              >

                <div className="window-titlebar">

                  <div className="window-title">

                    <span className="window-icon">
                      {section.icon}
                    </span>

                    {section.code}

                  </div>

                  <div className="window-controls">
                    <span>_</span>
                    <span>□</span>
                    <span>×</span>
                  </div>

                </div>


                <div className="file-content">

                  <div className="file-number">
                    {section.no}
                  </div>

                  <div className="file-symbol">
                    {section.icon}
                  </div>

                  <div className="file-text">

                    <h3
                      className={
                        index === 2 || index === 4
                          ? 'glitch-text'
                          : ''
                      }
                    >
                      {section.title}
                    </h3>

                    <p>
                      {section.subtitle}
                    </p>

                  </div>

                  <span className="file-arrow">
                    ↗
                  </span>

                </div>

                <div className="window-footer">
                  double click to open
                </div>

              </Link>

            ))}

          </div>

        </section>


        {/* BOTTOM COLLAGE */}

        <section className="bottom-collage">

          {/* CASSETTE */}

          <div className="cassette">

            <div className="cassette-top">
              MIXTAPE
            </div>

            <div className="cassette-window">

              <div className="cassette-reel">
                <span />
              </div>

              <div className="cassette-tape" />

              <div className="cassette-reel">
                <span />
              </div>

            </div>

            <div className="cassette-text">
              CLAR // SIDE A
            </div>

          </div>


          {/* LOADING WINDOW */}

          <div className="loading-window">

            <div className="window-titlebar">

              <span>
                Processing...
              </span>

              <span>
                ×
              </span>

            </div>

            <div className="loading-body">

              <p>
                Loading birthday memories...
              </p>

              <div className="loading-bar">
                <span />
              </div>

              <small>
                Please wait...
              </small>

            </div>

          </div>


          {/* RANDOM STICKERS */}

          <div className="sticker sticker-one">
            555
          </div>

          <div className="sticker sticker-two">
            ✦
          </div>

          <div className="sticker sticker-three">
            ERROR
          </div>

        </section>


        {/* FOOTER */}

        <footer>

          <span>
            CLAR_ARCHIVE © 2004—2026
          </span>

          <span>
            MADE WITH QUESTIONABLE DECISIONS
          </span>

          <span>
            [ SYSTEM READY ]
          </span>

        </footer>

      </div>


      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #242329;
        }

        body {
          font-family: var(--font-space), monospace;
        }

        a {
          color: inherit;
        }


        /* =========================
           BASE
        ========================= */

        .birthday-page {
          min-height: 100vh;
          color: #eee9df;
          background:
            radial-gradient(
              circle at 18% 15%,
              rgba(133,119,190,.17),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 60%,
              rgba(82,103,150,.13),
              transparent 30%
            ),
            #242329;
          overflow-x: hidden;
          position: relative;
        }


        /* =========================
           CRT
        ========================= */

        .noise {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          opacity: .06;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
        }

        .scanlines {
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          opacity: .08;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,.16) 4px
            );
        }

        .screen-vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 98;
          background:
            radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(0,0,0,.4)
            );
        }


        /* =========================
           SYSTEM BAR
        ========================= */

        .system-bar {
          height: 34px;
          background: #55545c;
          border-bottom: 2px solid #17171a;
          color: #eee9df;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          font-size: 9px;
          position: relative;
          z-index: 20;
          box-shadow: 0 2px 0 rgba(255,255,255,.1);
        }

        .system-left,
        .system-right {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .windows-logo {
          width: 17px;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #8e82bd;
          color: #242329;
          font-weight: bold;
        }

        .system-divider {
          opacity: .4;
        }

        .small-glitch {
          color: #c3d17c;
        }

        .eject-button {
          border: 0;
          background: transparent;
          color: #eee9df;
          font-family: inherit;
          font-size: 9px;
          cursor: pointer;
        }

        .eject-button:hover {
          color: #c7b8ef;
        }


        /* =========================
           DESKTOP
        ========================= */

        .desktop {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          min-height: calc(100vh - 34px);
          position: relative;
          padding: 45px 0 30px;
        }


        .coordinates {
          position: absolute;
          top: 50px;
          left: -20px;
          color: #88858d;
          font-family: var(--font-pixel);
          font-size: 6px;
          line-height: 2.1;
          transform: rotate(-2deg);
          opacity: .7;
        }

        .barcode {
          position: absolute;
          top: 52px;
          right: 15px;
          width: 110px;
          height: 30px;
          display: flex;
          align-items: stretch;
          gap: 2px;
        }

        .barcode span {
          background: #d9d4ca;
          width: 2px;
        }

        .barcode span:nth-child(2) {
          width: 5px;
        }

        .barcode span:nth-child(4) {
          width: 3px;
        }

        .barcode span:nth-child(6) {
          width: 5px;
        }

        .barcode small {
          position: absolute;
          top: 34px;
          left: 0;
          font-size: 6px;
          color: #77747d;
          letter-spacing: .1em;
        }


        /* =========================
           WINDOWS
        ========================= */

        .hero-window,
        .desktop-window,
        .loading-window,
        .message-popup,
        .music-player {
          border: 1px solid #17171a;
          background: #d2d0d1;
          color: #18181c;
          box-shadow:
            5px 6px 0 rgba(0,0,0,.32),
            inset 1px 1px rgba(255,255,255,.7);
        }

        .window-titlebar,
        .paint-titlebar,
        .player-header,
        .popup-titlebar {
          height: 29px;
          background:
            linear-gradient(
              90deg,
              #4f4d88,
              #71679d 65%,
              #5b5886
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7px;
          font-size: 9px;
          font-family: var(--font-space);
          border-bottom: 2px solid #33324c;
        }

        .window-title {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }

        .window-icon {
          width: 14px;
          height: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eee9df;
          color: #504b82;
          font-size: 8px;
          flex-shrink: 0;
        }

        .window-controls {
          display: flex;
          gap: 3px;
          font-weight: bold;
        }

        .window-controls span {
          width: 15px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #d0cfd1;
          color: #26252a;
          border: 1px solid #37363c;
          font-size: 8px;
        }


        /* =========================
           HERO
        ========================= */

        .hero-window {
          width: 82%;
          margin: 45px auto 0;
          position: relative;
          transform: rotate(-.5deg);
        }

        .hero-content {
          min-height: 420px;
          padding: 30px;
          display: grid;
          grid-template-columns: 1fr 410px;
          gap: 30px;
          background:
            linear-gradient(
              135deg,
              #29282e,
              #35323c
            );
          color: #eee9df;
          position: relative;
          overflow: hidden;
        }

        .hero-content::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 25px 25px;
          pointer-events: none;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
          padding: 25px 10px;
        }

        .micro-copy {
          font-family: var(--font-pixel);
          font-size: 7px;
          color: #a5a1aa;
          margin-bottom: 30px;
        }

        .hero-prefix {
          display: block;
          font-family: var(--font-pixel);
          font-size: 8px;
          color: #aaa4c8;
          margin-bottom: 12px;
          letter-spacing: .12em;
        }

        .hero-name-wrap {
          position: relative;
        }

        .glitch-name {
          position: relative;
          width: max-content;
          max-width: 100%;
          font-family: var(--font-orbitron);
          font-size: clamp(55px, 8vw, 100px);
          font-weight: 800;
          letter-spacing: -.07em;
          line-height: .9;
          margin: 0;
          color: #ddd8ee;
          text-shadow:
            3px 0 #8275ad,
            -2px 0 #9b4c55;
          animation: disappearGlitch 5.2s infinite;
        }

        .glitch-name::before,
        .glitch-name::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glitch-name::before {
          color: #b8a7ee;
          animation: glitchSliceOne 4.1s infinite;
        }

        .glitch-name::after {
          color: #d2767d;
          animation: glitchSliceTwo 3.3s infinite;
        }

        .hero-description {
          width: min(330px, 100%);
          margin-top: 28px;
          color: #aaa7ad;
          font-size: 11px;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          gap: 8px;
          margin-top: 28px;
        }

        .fake-button {
          background: #d7d3d0;
          color: #27262a;
          border: 2px outset #eee;
          padding: 8px 13px;
          font-family: var(--font-space);
          font-size: 8px;
        }

        .fake-button.secondary {
          background: #85809a;
          color: white;
        }


        /* =========================
           PAINT
        ========================= */

        .paint-window {
          align-self: center;
          background: #c8c7c9;
          color: #16161a;
          border: 2px outset #e8e8e8;
          transform: rotate(1.5deg);
          box-shadow: 7px 9px 0 rgba(0,0,0,.35);
          position: relative;
          z-index: 3;
        }

        .paint-toolbar {
          width: 45px;
          position: absolute;
          top: 29px;
          bottom: 27px;
          left: 0;
          background: #d4d3d5;
          border-right: 1px solid #777;
          display: grid;
          grid-template-columns: 1fr;
          padding: 5px;
          gap: 4px;
          z-index: 2;
        }

        .paint-toolbar span {
          width: 28px;
          height: 28px;
          border: 1px solid #777;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          background: #e0dfe1;
        }

        .fake-image {
          height: 300px;
          margin-left: 45px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 70% 30%,
              rgba(218,193,243,.9),
              transparent 17%
            ),
            radial-gradient(
              circle at 30% 70%,
              rgba(115,130,184,.8),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #534e7d,
              #8b7ca8,
              #525e88
            );
        }

        .fake-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,.04) 9px
            );
        }

        .fake-sun {
          position: absolute;
          font-size: 100px;
          color: #e1d6ef;
          left: 30px;
          bottom: 25px;
          opacity: .7;
        }

        .fake-orbit {
          position: absolute;
          font-size: 170px;
          right: -25px;
          top: -20px;
          color: rgba(220,202,242,.35);
        }

        .fake-star {
          position: absolute;
          top: 50px;
          right: 70px;
          color: #eee6ff;
          font-size: 35px;
          animation: starFlicker 3s infinite;
        }

        .fake-image-text {
          position: absolute;
          left: 30px;
          top: 25px;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: white;
          font-family: var(--font-pixel);
        }

        .fake-image-text span {
          font-size: 7px;
        }

        .fake-image-text strong {
          font-family: var(--font-orbitron);
          font-size: 60px;
          opacity: .8;
        }

        .paint-palette {
          margin-left: 45px;
          height: 27px;
          display: flex;
          gap: 2px;
          padding: 5px;
          background: #d5d4d6;
        }

        .paint-palette span {
          width: 17px;
          height: 15px;
          background: #71659d;
          border: 1px solid #777;
        }

        .paint-palette span:nth-child(2n) {
          background: #8d86b9;
        }

        .paint-palette span:nth-child(3n) {
          background: #c6a8d9;
        }


        /* =========================
           CD
        ========================= */

        .floating-cd {
          position: absolute;
          right: 2%;
          top: 430px;
          z-index: 8;
          transform: rotate(14deg);
        }

        .cd-disc {
          width: 185px;
          height: 185px;
          border-radius: 50%;
          position: relative;
          background:
            conic-gradient(
              #9c93c5,
              #d9c9e7,
              #6c7da8,
              #bda5d1,
              #8478ae,
              #e3d4e9,
              #9c93c5
            );
          box-shadow: 4px 8px 20px rgba(0,0,0,.4);
        }

        .cd-disc::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.5);
        }

        .cd-disc::after {
          content: "";
          position: absolute;
          inset: 45%;
          border-radius: 50%;
          background: #28272d;
          border: 2px solid #bbb5bd;
        }

        .cd-rainbow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            linear-gradient(
              130deg,
              transparent 35%,
              rgba(255,255,255,.5) 46%,
              transparent 55%
            );
        }

        .cd-centre {
          position: absolute;
          inset: 50%;
          transform: translate(-50%, -50%);
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #74669d;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
          font-family: var(--font-pixel);
          font-size: 7px;
        }

        .cd-centre small {
          margin-top: 8px;
          font-family: var(--font-space);
        }

        .cd-label {
          margin-top: 8px;
          font-family: var(--font-pixel);
          font-size: 6px;
          color: #aaa5ad;
          text-align: center;
        }


        /* =========================
           MUSIC PLAYER
        ========================= */

        .music-player {
          position: absolute;
          left: -15px;
          top: 620px;
          width: 300px;
          z-index: 10;
          transform: rotate(-2deg);
        }

        .player-body {
          padding: 13px;
          display: flex;
          gap: 12px;
          background: #c9c8ca;
        }

        .album-placeholder {
          width: 70px;
          height: 70px;
          background:
            linear-gradient(
              135deg,
              #7067a0,
              #c4a7d2
            );
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          border: 1px solid #777;
        }

        .track-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          min-width: 0;
        }

        .player-label {
          font-size: 6px;
          color: #6e6a71;
          font-family: var(--font-pixel);
        }

        .track-info strong {
          font-size: 12px;
          font-family: var(--font-orbitron);
        }

        .track-info span:last-child {
          font-size: 7px;
          color: #66636b;
        }

        .player-progress {
          margin: 0 13px;
          height: 7px;
          background: #77747c;
          border: 1px inset white;
        }

        .player-progress span {
          display: block;
          width: 48%;
          height: 100%;
          background: #62598e;
        }

        .player-controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 11px;
          font-size: 10px;
        }


        /* =========================
           POPUP
        ========================= */

        .message-popup {
          position: absolute;
          right: 0;
          top: 730px;
          width: 320px;
          z-index: 12;
          transform: rotate(1.2deg);
        }

        .popup-body {
          padding: 20px;
          display: flex;
          gap: 15px;
          font-size: 10px;
          line-height: 1.5;
        }

        .popup-warning {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #a5a0b8;
          font-family: var(--font-pixel);
          font-size: 17px;
        }

        .popup-body p {
          margin: 0 0 8px;
        }

        .popup-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
        }

        .popup-buttons button {
          min-width: 65px;
          padding: 5px 10px;
          background: #d5d4d6;
          border: 2px outset #eee;
          font-family: inherit;
          font-size: 8px;
        }


        /* =========================
           DIRECTORY
        ========================= */

        .directory {
          margin-top: 100px;
          padding-top: 35px;
        }

        .directory-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #55525f;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        .directory-kicker {
          font-family: var(--font-pixel);
          font-size: 7px;
          color: #97919f;
        }

        .directory-heading h2 {
          font-family: var(--font-orbitron);
          font-size: clamp(30px, 5vw, 60px);
          line-height: .9;
          margin: 10px 0 0;
          letter-spacing: -.08em;
          color: #d6d0e3;
        }

        .directory-meta {
          font-size: 8px;
          color: #817d87;
          line-height: 1.8;
          text-align: right;
        }

        .file-layout {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px 25px;
        }

        .desktop-window {
          text-decoration: none;
          transition:
            transform .18s ease,
            filter .18s ease;
        }

        .desktop-window:nth-child(2) {
          transform: rotate(1deg);
        }

        .desktop-window:nth-child(3) {
          transform: rotate(-.7deg);
        }

        .desktop-window:nth-child(4) {
          transform: rotate(1.4deg);
        }

        .desktop-window:nth-child(5) {
          transform: rotate(-1deg);
        }

        .desktop-window:nth-child(6) {
          transform: rotate(.7deg);
        }

        .desktop-window:hover {
          transform:
            translateY(-8px)
            rotate(0deg)
            scale(1.015);
          filter: brightness(1.08);
          z-index: 5;
        }

        .file-content {
          min-height: 170px;
          padding: 20px;
          display: grid;
          grid-template-columns: 35px 55px 1fr 25px;
          gap: 15px;
          align-items: center;
          position: relative;
          background: #d0ced0;
        }

        .file-number {
          align-self: start;
          font-family: var(--font-pixel);
          font-size: 7px;
          color: #79757b;
        }

        .file-symbol {
          width: 55px;
          height: 55px;
          border: 1px solid #67636c;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #aaa6b5;
          color: #4d4675;
          font-size: 22px;
        }

        .file-text h3 {
          margin: 0 0 8px;
          font-family: var(--font-orbitron);
          font-size: 18px;
          letter-spacing: -.04em;
          color: #34313a;
        }

        .file-text p {
          margin: 0;
          color: #68636d;
          font-size: 8px;
          line-height: 1.5;
        }

        .file-arrow {
          font-size: 20px;
          color: #5e577f;
        }

        .window-footer {
          background: #b8b6ba;
          border-top: 1px solid #777;
          padding: 7px 10px;
          font-size: 6px;
          color: #68636d;
          text-transform: uppercase;
        }


        /* =========================
           BOTTOM
        ========================= */

        .bottom-collage {
          min-height: 300px;
          margin-top: 90px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cassette {
          width: 290px;
          height: 170px;
          padding: 16px;
          background: #76727c;
          border: 2px solid #39373d;
          box-shadow: 8px 10px 0 rgba(0,0,0,.35);
          transform: rotate(-5deg);
          position: absolute;
          left: 12%;
        }

        .cassette-top {
          background: #e0d7cc;
          color: #403b45;
          padding: 9px;
          font-family: var(--font-pixel);
          font-size: 7px;
        }

        .cassette-window {
          height: 65px;
          margin-top: 14px;
          background: #27262a;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .cassette-reel {
          width: 43px;
          height: 43px;
          border: 5px dotted #aaa4ad;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cassette-reel span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #aaa4ad;
        }

        .cassette-tape {
          width: 80px;
          height: 7px;
          background: #77727f;
        }

        .cassette-text {
          margin-top: 9px;
          font-size: 7px;
          color: #302e34;
        }

        .loading-window {
          width: 350px;
          transform: rotate(2deg);
          z-index: 2;
        }

        .loading-body {
          padding: 25px;
          font-size: 9px;
        }

        .loading-bar {
          height: 20px;
          margin: 18px 0 10px;
          border: 2px inset #eee;
          background: #aaa8aa;
          padding: 2px;
        }

        .loading-bar span {
          display: block;
          height: 100%;
          width: 67%;
          background:
            repeating-linear-gradient(
              90deg,
              #57517f 0 12px,
              #8b81b1 12px 15px
            );
        }

        .loading-body small {
          font-size: 7px;
          color: #66636a;
        }

        .sticker {
          position: absolute;
          font-family: var(--font-orbitron);
          font-weight: 900;
          z-index: 5;
        }

        .sticker-one {
          right: 15%;
          top: 20px;
          font-size: 42px;
          color: #8c82b5;
          transform: rotate(-9deg);
        }

        .sticker-two {
          right: 5%;
          bottom: 30px;
          font-size: 70px;
          color: #c3a8d7;
          transform: rotate(15deg);
        }

        .sticker-three {
          left: 4%;
          bottom: 20px;
          color: #b65d64;
          font-size: 11px;
          border: 1px solid #b65d64;
          padding: 8px;
          transform: rotate(-8deg);
        }


        /* =========================
           FOOTER
        ========================= */

        footer {
          margin-top: 60px;
          padding: 20px 0 30px;
          border-top: 1px solid #55525f;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #77737e;
          font-size: 7px;
          font-family: var(--font-pixel);
        }


        /* =========================
           GLITCH
        ========================= */

        .glitch-text {
          position: relative;
          animation: disappearGlitch 5.7s infinite;
        }

        @keyframes disappearGlitch {

          0%,
          74%,
          100% {
            opacity: 1;
            transform: translate(0);
            filter: none;
          }

          75% {
            opacity: .15;
          }

          76% {
            opacity: 0;
            transform: translate(-5px, 2px);
          }

          77% {
            opacity: 1;
            transform: translate(4px, -1px);
            filter: blur(.5px);
          }

          78% {
            opacity: .35;
            transform: translate(-2px, 0);
          }

          79% {
            opacity: 1;
            transform: translate(0);
            filter: none;
          }
        }

        @keyframes glitchSliceOne {

          0%,
          79%,
          100% {
            opacity: 0;
            clip-path: inset(0 0 100% 0);
          }

          80% {
            opacity: .8;
            clip-path: inset(15% 0 60% 0);
            transform: translate(-5px);
          }

          82% {
            opacity: 0;
          }
        }

        @keyframes glitchSliceTwo {

          0%,
          68%,
          100% {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
          }

          69% {
            opacity: .8;
            clip-path: inset(65% 0 15% 0);
            transform: translate(5px);
          }

          71% {
            opacity: 0;
          }
        }

        @keyframes starFlicker {

          0%,
          80%,
          100% {
            opacity: 1;
          }

          81% {
            opacity: 0;
          }

          82% {
            opacity: .2;
          }

          83% {
            opacity: 1;
          }
        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 800px) {

          .system-bar {
            font-size: 7px;
          }

          .system-left span:nth-child(3),
          .system-left span:nth-child(4) {
            display: none;
          }

          .desktop {
            width: calc(100% - 20px);
            padding-top: 25px;
          }

          .coordinates,
          .barcode {
            display: none;
          }

          .hero-window {
            width: 100%;
            margin-top: 30px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 20px;
          }

          .hero-copy {
            padding: 15px 5px;
          }

          .glitch-name {
            font-size: clamp(55px, 18vw, 90px);
          }

          .paint-window {
            width: 90%;
            margin: 0 auto;
          }

          .fake-image {
            height: 230px;
          }

          .floating-cd {
            position: relative;
            top: auto;
            right: auto;
            width: max-content;
            margin: -20px 20px 0 auto;
            transform: rotate(12deg) scale(.75);
          }

          .music-player {
            position: relative;
            top: auto;
            left: auto;
            width: 85%;
            margin: 30px 0 0;
          }

          .message-popup {
            position: relative;
            top: auto;
            right: auto;
            width: 90%;
            margin: 30px auto 0;
          }

          .directory {
            margin-top: 70px;
          }

          .directory-heading {
            align-items: flex-start;
          }

          .file-layout {
            grid-template-columns: 1fr;
          }

          .desktop-window:nth-child(n) {
            transform: none;
          }

          .desktop-window:hover {
            transform: translateY(-5px);
          }

          .file-content {
            min-height: 150px;
          }

          .bottom-collage {
            min-height: 420px;
          }

          .cassette {
            left: 0;
            top: 20px;
          }

          .loading-window {
            width: 90%;
            margin-top: 80px;
          }

          .sticker-one {
            right: 0;
            top: 10px;
          }

          .sticker-two {
            right: 0;
            bottom: 30px;
          }

          footer {
            flex-direction: column;
          }

        }

      `}</style>

    </main>
  )
}
