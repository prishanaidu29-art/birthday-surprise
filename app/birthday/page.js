'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bodoni_Moda, Space_Mono, Inter } from 'next/font/google'

export const dynamic = 'force-dynamic'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function BirthdayPage() {
  const router = useRouter()
  const [time, setTime] = useState('')

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const sections = [
    {
      number: '01',
      title: 'THE MEMORIES',
      description: 'photos / places / evidence',
      meta: 'FILE_001',
      link: '/birthday/memories',
    },
    {
      number: '02',
      title: 'THE MESSAGES',
      description: 'things people wanted you to know',
      meta: 'FILE_002',
      link: '/birthday/messages',
    },
    {
      number: '03',
      title: 'THE SOUNDTRACK',
      description: 'songs that somehow became us',
      meta: 'FILE_003',
      link: '/birthday/playlist',
    },
    {
      number: '04',
      title: 'THE CHAOS',
      description: 'shits / giggles / questionable decisions',
      meta: 'FILE_004',
      link: '/birthday/games',
    },
    {
      number: '05',
      title: 'THE QUIZ',
      description: 'prove you actually know us',
      meta: 'FILE_005',
      link: '/birthday/quiz',
    },
    {
      number: '06',
      title: 'THE JOURNEY',
      description: 'everywhere somehow led to here',
      meta: 'FILE_006',
      link: '/birthday/journey',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  return (
    <main
      className={`${bodoni.variable} ${spaceMono.variable} ${inter.variable} archive-page`}
    >

      {/* GRAIN */}
      <div className="grain" />

      {/* Y2K SCANLINES */}
      <div className="scanlines" />

      {/* TOP NAV */}
      <header className="topbar">

        <div className="system-id">
          <span className="status-dot" />
          PRIVATE ARCHIVE
          <span className="muted"> // 001</span>
        </div>

        <div className="top-right">

          <span className="clock">
            {time}
          </span>

          <span className="separator">|</span>

          <button
            onClick={handleLogout}
            className="exit-button"
          >
            EXIT ↗
          </button>

        </div>

      </header>

      {/* HERO */}
      <section className="hero">

        {/* SMALL ARCHIVE LABEL */}
        <div className="archive-label">
          <span className="red-line" />
          <span>ARCHIVE_001</span>
          <span className="label-divider">/</span>
          <span>CLASSIFIED</span>
        </div>

        <div className="hero-grid">

          {/* LEFT */}
          <div className="hero-copy">

            <div className="date-code">
              19 / 11 / 04
            </div>

            <h1>
              CLAR
            </h1>

            <div className="hero-subtitle">
              <span>AN UNNECESSARY ARCHIVE</span>
              <span>OF ONE VERY IMPORTANT PERSON.</span>
            </div>

            <div className="hero-description">
              You made it this far.
              <br />
              Unfortunately, there is no turning back now.
            </div>

            <div className="system-message">
              <span className="bracket">[</span>
              ACCESS GRANTED
              <span className="bracket">]</span>
              <span className="cursor">_</span>
            </div>

          </div>

          {/* PHOTO */}
          <div className="photo-wrapper">

            <div className="photo-frame">

              <div className="photo-inner">

                <div className="photo-cross">
                  <span />
                  <span />
                </div>

                <div className="photo-placeholder">
                  <span className="photo-number">IMG_001</span>

                  <div className="photo-icon">
                    ◉
                  </div>

                  <span>
                    PHOTO
                    <br />
                    PLACEHOLDER
                  </span>
                </div>

                <div className="flash">
                  FLASH
                </div>

              </div>

              <div className="photo-caption">
                FIG. 001 — CLAR / ORIGINAL FILE
              </div>

            </div>

            <div className="photo-note">
              <span>NO PHOTO YET</span>
              <span>↑ INSERT LATER</span>
            </div>

          </div>

        </div>

        {/* SCROLL */}
        <div className="scroll-indicator">

          <span>SCROLL TO ACCESS</span>

          <div className="scroll-line">
            <span />
          </div>

          <span>↓</span>

        </div>

      </section>

      {/* CLASSIFIED NOTE */}
      <section className="classified-section">

        <div className="classified-left">

          <div className="tiny-label">
            CLASSIFIED // FILE NOTE
          </div>

          <p className="classified-title">
            A collection of memories,
            <br />
            bad decisions & things
            <br />
            we probably shouldn't publish.
          </p>

        </div>

        <div className="classified-right">

          <div className="stamp">
            PRIVATE
            <br />
            PROPERTY
          </div>

          <span>
            DO NOT
            <br />
            DISTRIBUTE
          </span>

        </div>

      </section>

      {/* CONTENTS */}
      <section className="contents">

        <div className="contents-header">

          <div>
            <div className="tiny-label">
              DIRECTORY / 06 FILES
            </div>

            <h2>
              Open the archive.
            </h2>
          </div>

          <div className="directory-status">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>

        </div>

        <div className="file-list">

          {sections.map((section) => (

            <Link
              key={section.number}
              href={section.link}
              className="file-row"
            >

              <div className="file-number">
                {section.number}
              </div>

              <div className="file-main">

                <div className="file-meta">
                  {section.meta}
                </div>

                <h3>
                  {section.title}
                </h3>

                <p>
                  {section.description}
                </p>

              </div>

              <div className="file-arrow">
                ↗
              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* BIG QUOTE */}
      <section className="statement">

        <div className="statement-code">
          NOTE_19.11 // PERSONAL
        </div>

        <h2>
          SOME PEOPLE COME INTO
          <br />
          YOUR LIFE.
          <br />
          <em>
            OTHERS SOMEHOW TAKE OVER
            <br />
            THE ENTIRE CAMERA ROLL.
          </em>
        </h2>

        <div className="statement-bottom">

          <span>
            THIS WEBSITE IS AN
            <br />
            UNNECESSARILY ELABORATE
            <br />
            WAY OF SAYING:
          </span>

          <strong>
            YOU ARE LOVED.
          </strong>

        </div>

      </section>

      {/* FINAL MESSAGE */}
      <section className="final-card">

        <div className="final-number">
          001
        </div>

        <div>

          <div className="tiny-label">
            FINAL FILE / OPEN
          </div>

          <p>
            Happy birthday to the person who somehow managed to become such
            a massive part of my life.
          </p>

          <span className="final-small">
            There is considerably more nonsense inside.
            <br />
            Proceed at your own risk.
          </span>

        </div>

        <div className="heart">
          ♡
        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <span>
          DVA / CLAR
        </span>

        <span>
          19 • 11 • 04
        </span>

        <span>
          ARCHIVE CLOSED //
        </span>

      </footer>


      {/* STYLES */}
      <style jsx global>{`

        :root {
          --black: #0b0b0b;
          --dark: #111111;
          --panel: #151515;
          --line: #292929;
          --cream: #e7e1d5;
          --muted: #77736c;
          --faint: #46433f;
          --red: #8f2631;
          --bright-red: #a93643;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--black);
        }

        .archive-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(143, 38, 49, 0.06),
              transparent 30%
            ),
            var(--black);
          color: var(--cream);
          font-family: var(--font-inter), sans-serif;
          overflow-x: hidden;
        }

        /* GRAIN */

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.055;
          background-image:
            url("https://grainy-gradients.vercel.app/noise.svg");
          mix-blend-mode: screen;
        }

        /* SCANLINES */

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99;
          opacity: 0.025;
          background-image:
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 3px,
              rgba(255,255,255,0.3) 4px
            );
        }

        /* TOP BAR */

        .topbar {
          padding: 22px 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--line);
          font-family: var(--font-space), monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
        }

        .system-id {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #aaa59d;
        }

        .muted {
          color: #4d4a46;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          background: var(--red);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px rgba(143,38,49,0.8);
          animation: blink 2s infinite;
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--muted);
        }

        .exit-button {
          background: none;
          border: none;
          color: var(--muted);
          font-family: var(--font-space), monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .exit-button:hover {
          color: var(--cream);
        }

        .separator {
          color: #303030;
        }

        /* HERO */

        .hero {
          max-width: 1250px;
          margin: auto;
          padding: 90px 5vw 100px;
        }

        .archive-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-space), monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          color: var(--muted);
          margin-bottom: 65px;
        }

        .red-line {
          width: 35px;
          height: 1px;
          background: var(--red);
        }

        .label-divider {
          color: #3b3936;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 100px;
          align-items: end;
        }

        .date-code {
          font-family: var(--font-space), monospace;
          font-size: 10px;
          letter-spacing: 0.28em;
          color: var(--red);
          margin-bottom: 22px;
        }

        h1 {
          font-family: var(--font-bodoni), serif;
          font-size: clamp(6rem, 15vw, 13rem);
          line-height: 0.72;
          font-weight: 400;
          letter-spacing: -0.075em;
          margin: 0;
        }

        .hero-subtitle {
          display: flex;
          flex-direction: column;
          margin-top: 38px;
          font-family: var(--font-space), monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          line-height: 1.9;
          color: #8d8880;
        }

        .hero-description {
          margin-top: 35px;
          color: #716d67;
          font-size: 13px;
          line-height: 1.8;
          max-width: 400px;
        }

        .system-message {
          margin-top: 35px;
          display: inline-block;
          font-family: var(--font-space), monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          color: #aaa49b;
          border: 1px solid #292929;
          padding: 10px 14px;
          background: rgba(255,255,255,0.015);
        }

        .bracket {
          color: var(--red);
        }

        .cursor {
          color: var(--red);
          animation: cursorBlink 1s infinite;
        }

        /* PHOTO */

        .photo-wrapper {
          position: relative;
        }

        .photo-frame {
          background: #161616;
          border: 1px solid #343331;
          padding: 14px;
          transform: rotate(2.5deg);
          transition: transform 0.5s ease;
        }

        .photo-frame:hover {
          transform: rotate(0deg) translateY(-5px);
        }

        .photo-inner {
          position: relative;
          aspect-ratio: 4 / 5;
          background:
            linear-gradient(
              135deg,
              #262522,
              #171717 60%,
              #292723
            );
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(0,0,0,0.5)
            );
        }

        .photo-cross {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.12;
        }

        .photo-cross span:first-child {
          width: 100%;
          height: 1px;
          background: white;
        }

        .photo-cross span:last-child {
          position: absolute;
          width: 1px;
          height: 100%;
          background: white;
        }

        .photo-placeholder {
          position: relative;
          z-index: 2;
          text-align: center;
          font-family: var(--font-space), monospace;
          font-size: 8px;
          letter-spacing: 0.25em;
          line-height: 1.8;
          color: #66625c;
        }

        .photo-icon {
          font-family: var(--font-inter);
          font-size: 34px;
          color: #494641;
          margin: 10px 0;
        }

        .photo-number {
          display: block;
          color: var(--red);
          margin-bottom: 10px;
        }

        .flash {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 3;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.15em;
          color: #66625c;
        }

        .photo-caption {
          padding-top: 13px;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.18em;
          color: #66625c;
        }

        .photo-note {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.15em;
          color: #4c4945;
        }

        .photo-note span:last-child {
          color: var(--red);
        }

        /* SCROLL */

        .scroll-indicator {
          margin-top: 100px;
          display: flex;
          align-items: center;
          gap: 15px;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          color: #4d4a45;
        }

        .scroll-line {
          width: 70px;
          height: 1px;
          background: #292929;
          position: relative;
          overflow: hidden;
        }

        .scroll-line span {
          position: absolute;
          width: 25px;
          height: 1px;
          background: var(--red);
          animation: scrollLine 2s infinite;
        }

        /* CLASSIFIED */

        .classified-section {
          max-width: 1250px;
          margin: auto;
          padding: 50px 5vw;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 50px;
        }

        .tiny-label {
          font-family: var(--font-space), monospace;
          font-size: 8px;
          letter-spacing: 0.23em;
          color: var(--red);
          margin-bottom: 18px;
        }

        .classified-title {
          font-family: var(--font-bodoni), serif;
          font-style: italic;
          font-size: clamp(1.7rem, 3vw, 2.7rem);
          line-height: 1.15;
          margin: 0;
          color: #c9c3b8;
        }

        .classified-right {
          display: flex;
          align-items: center;
          gap: 20px;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          line-height: 1.7;
          letter-spacing: 0.16em;
          color: #55514c;
          text-align: right;
        }

        .stamp {
          border: 1px solid #633038;
          color: #74303a;
          padding: 10px;
          transform: rotate(-8deg);
          font-size: 8px;
        }

        /* CONTENTS */

        .contents {
          max-width: 1250px;
          margin: auto;
          padding: 110px 5vw;
        }

        .contents-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 40px;
        }

        .contents h2 {
          font-family: var(--font-bodoni), serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 400;
          letter-spacing: -0.04em;
          margin: 0;
        }

        .directory-status {
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.16em;
          color: #57534e;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-list {
          border-top: 1px solid #30302e;
        }

        .file-row {
          display: grid;
          grid-template-columns: 65px 1fr 40px;
          gap: 20px;
          align-items: center;
          padding: 28px 12px;
          border-bottom: 1px solid #292929;
          text-decoration: none;
          color: inherit;
          transition:
            background 0.35s ease,
            padding 0.35s ease;
        }

        .file-row:hover {
          background: #141414;
          padding-left: 25px;
          padding-right: 25px;
        }

        .file-number {
          font-family: var(--font-space), monospace;
          font-size: 9px;
          color: #55514c;
          letter-spacing: 0.12em;
        }

        .file-meta {
          font-family: var(--font-space), monospace;
          font-size: 7px;
          color: #55514c;
          letter-spacing: 0.2em;
          margin-bottom: 7px;
        }

        .file-main h3 {
          margin: 0;
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(1rem, 2vw, 1.45rem);
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: color 0.3s ease;
        }

        .file-row:hover h3 {
          color: var(--bright-red);
        }

        .file-main p {
          margin: 6px 0 0;
          font-size: 11px;
          color: #66625d;
        }

        .file-arrow {
          font-size: 18px;
          color: #4d4944;
          transition:
            color 0.3s ease,
            transform 0.3s ease;
        }

        .file-row:hover .file-arrow {
          color: var(--bright-red);
          transform: translate(3px, -3px);
        }

        /* STATEMENT */

        .statement {
          max-width: 1250px;
          margin: auto;
          padding: 70px 5vw 130px;
          border-top: 1px solid var(--line);
        }

        .statement-code {
          font-family: var(--font-space), monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          color: var(--red);
          margin-bottom: 35px;
        }

        .statement h2 {
          font-family: var(--font-bodoni), serif;
          font-size: clamp(3rem, 7vw, 7rem);
          line-height: 0.94;
          font-weight: 400;
          letter-spacing: -0.055em;
          margin: 0;
        }

        .statement h2 em {
          color: #706b64;
        }

        .statement-bottom {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
          font-family: var(--font-space), monospace;
          font-size: 8px;
          letter-spacing: 0.16em;
          line-height: 1.8;
          color: #59554f;
        }

        .statement-bottom strong {
          font-family: var(--font-bodoni), serif;
          font-size: 2.2rem;
          font-weight: 400;
          font-style: italic;
          color: var(--cream);
          letter-spacing: 0;
        }

        /* FINAL */

        .final-card {
          max-width: 1250px;
          margin: auto;
          padding: 55px 5vw;
          background: #141414;
          border-top: 1px solid #30302d;
          border-bottom: 1px solid #30302d;
          display: grid;
          grid-template-columns: 80px 1fr 100px;
          gap: 35px;
          align-items: start;
        }

        .final-number {
          font-family: var(--font-space), monospace;
          font-size: 10px;
          color: var(--red);
        }

        .final-card p {
          font-family: var(--font-bodoni), serif;
          font-size: clamp(1.7rem, 3.5vw, 3.3rem);
          line-height: 1.05;
          margin: 0;
          max-width: 850px;
        }

        .final-small {
          display: block;
          margin-top: 25px;
          font-family: var(--font-space), monospace;
          font-size: 8px;
          line-height: 1.8;
          letter-spacing: 0.12em;
          color: #5f5b55;
        }

        .heart {
          font-family: var(--font-bodoni), serif;
          font-size: 5rem;
          color: #4b2026;
          text-align: right;
        }

        /* FOOTER */

        footer {
          max-width: 1250px;
          margin: auto;
          padding: 25px 5vw 35px;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-space), monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          color: #45423e;
        }

        /* ANIMATIONS */

        @keyframes blink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }

        @keyframes cursorBlink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes scrollLine {
          0% {
            left: -30px;
          }
          100% {
            left: 70px;
          }
        }

        /* MOBILE */

        @media (max-width: 700px) {

          .topbar {
            padding: 18px 20px;
          }

          .clock,
          .separator {
            display: none;
          }

          .hero {
            padding: 65px 20px 70px;
          }

          .archive-label {
            margin-bottom: 45px;
          }

          .hero-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .hero-description {
            font-size: 12px;
          }

          .photo-wrapper {
            width: 72%;
            margin-left: auto;
            margin-right: 8%;
          }

          .scroll-indicator {
            margin-top: 70px;
          }

          .classified-section {
            padding: 40px 20px;
            align-items: flex-start;
            flex-direction: column;
          }

          .classified-right {
            width: 100%;
            justify-content: space-between;
            text-align: left;
          }

          .contents {
            padding: 80px 20px;
          }

          .contents-header {
            align-items: flex-start;
            gap: 20px;
            flex-direction: column;
          }

          .directory-status {
            display: none;
          }

          .file-row {
            grid-template-columns: 35px 1fr 25px;
            gap: 10px;
            padding: 25px 5px;
          }

          .file-row:hover {
            padding-left: 10px;
            padding-right: 10px;
          }

          .file-main p {
            font-size: 10px;
            line-height: 1.5;
          }

          .statement {
            padding: 65px 20px 90px;
          }

          .statement-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .final-card {
            grid-template-columns: 35px 1fr;
            gap: 15px;
            padding: 40px 20px;
          }

          .heart {
            display: none;
          }

          footer {
            padding-left: 20px;
            padding-right: 20px;
            gap: 15px;
          }

          footer span:nth-child(2) {
            display: none;
          }

        }

      `}</style>

    </main>
  )
}
