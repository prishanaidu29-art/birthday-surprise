'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Orbitron, Space_Mono, Press_Start_2P } from 'next/font/google'

export const dynamic = 'force-dynamic'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
})

const sections = [
  {
    number: '01',
    code: 'MEM_01',
    title: 'THE MEMORIES',
    subtitle: 'PHOTOS / PLACES / RANDOM SHIT',
    description: 'the evidence archive',
    icon: '◉',
    type: 'VHS',
    href: '/birthday/memories',
  },
  {
    number: '02',
    code: 'MSG_02',
    title: 'THE MESSAGES',
    subtitle: 'THINGS PEOPLE WANTED YOU TO KNOW',
    description: 'incoming transmissions',
    icon: '✉',
    type: 'TXT',
    href: '/birthday/messages',
  },
  {
    number: '03',
    code: 'SND_03',
    title: 'THE SOUNDTRACK',
    subtitle: 'SONGS ABOUT YOU',
    description: 'insert disc / press play',
    icon: '♫',
    type: 'CD',
    href: '/birthday/playlist',
  },
  {
    number: '04',
    code: 'CHA_04',
    title: 'THE CHAOS',
    subtitle: 'SHITS & GIGGLES',
    description: 'do not open at work',
    icon: '⚠',
    type: 'ERR',
    href: '/birthday/games',
  },
  {
    number: '05',
    code: 'QUI_05',
    title: 'THE QUIZ',
    subtitle: 'HOW WELL DO YOU ACTUALLY KNOW US?',
    description: 'test your memory',
    icon: '?',
    type: 'GAME',
    href: '/birthday/quiz',
  },
  {
    number: '06',
    code: 'JRN_06',
    title: 'THE JOURNEY',
    subtitle: 'EVERYWHERE, SOMEHOW',
    description: 'save file: 2004 → now',
    icon: '⌁',
    type: 'MAP',
    href: '/birthday/journey',
  },
]

export default function BirthdayPage() {
  const router = useRouter()

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

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
        ${pressStart.variable}
        birthday-page
      `}
    >
      {/* CRT overlay */}
      <div className="crt-overlay" />
      <div className="scanlines" />

      {/* background grid */}
      <div className="grid-bg" />

      {/* TOP STATUS BAR */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="rec-dot" />
          <span>REC</span>
          <span className="separator">/</span>
          <span>CLAR_ARCHIVE</span>
        </div>

        <div className="topbar-center">
          2004 — 2026
        </div>

        <button onClick={logout} className="logout">
          EJECT ×
        </button>
      </header>

      <div className="page-shell">

        {/* HERO */}
        <section className="hero">

          <div className="hero-meta">
            <span>ARCHIVE_DISC // 001</span>
            <span>FORMAT: VHS-CDROM</span>
          </div>

          <div className="hero-main">

            <div className="hero-title-wrap">

              <div className="tiny-label">
                <span className="blink">●</span> SYSTEM ONLINE
              </div>

              <h1 className="glitch-title" data-text="CLAR">
                CLAR
              </h1>

              <div className="exe-line">
                <span>CLAR.EXE</span>
                <span>v.22.0</span>
              </div>

            </div>

            {/* CD graphic */}
            <div className="cd-wrap">
              <div className="cd">
                <div className="cd-label">
                  <span>DVA</span>
                  <small>ARCHIVE</small>
                </div>
                <div className="cd-hole" />
                <div className="cd-shine" />
              </div>

              <div className="cd-caption">
                DISC 01<br />
                <span>DO NOT SCRATCH</span>
              </div>
            </div>

          </div>

          {/* VHS PLAYER */}
          <div className="vhs-player">

            <div className="vhs-left">
              <div className="vhs-label">
                BIRTHDAY TAPE
              </div>

              <div className="vhs-stripes">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="vhs-screen">
              <div className="screen-noise" />

              <div className="timestamp">
                <span>PLAY</span>
                <span>00:22:04</span>
              </div>

              <div className="screen-text">
                HAPPY BIRTHDAY
              </div>

              <div className="screen-sub">
                PRESS ENTER TO CONTINUE_
              </div>
            </div>

            <div className="vhs-controls">
              <span>◀◀</span>
              <span>▶</span>
              <span>▶▶</span>
              <span>■</span>
              <span>●</span>
            </div>

          </div>

          {/* INTRO */}
          <div className="intro-grid">
            <div className="intro-number">
              22
            </div>

            <div className="intro-copy">
              <p className="label">PLAYER // CLAR</p>

              <p>
                A small collection of things that somehow
                became your life.
              </p>

              <p className="muted">
                photos / messages / songs / chaos / memories
              </p>
            </div>

            <div className="date-stamp">
              <div>DATE RECORDED</div>
              <strong>29·05·04</strong>
              <span>KL / MY</span>
            </div>
          </div>

        </section>

        {/* MENU */}
        <section className="archive-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                DIRECTORY
              </span>

              <h2>
                SELECT FILE<span className="cursor">_</span>
              </h2>
            </div>

            <div className="directory-status">
              <span>06 FILES</span>
              <span>STATUS: OK</span>
            </div>

          </div>

          <div className="file-grid">

            {sections.map((section) => (
              <Link
                href={section.href}
                key={section.number}
                className={`file-card type-${section.type.toLowerCase()}`}
              >

                <div className="card-top">

                  <span className="file-number">
                    {section.number}
                  </span>

                  <span className="file-code">
                    {section.code}
                  </span>

                  <span className="file-type">
                    [{section.type}]
                  </span>

                </div>

                <div className="card-middle">

                  <div className="file-icon">
                    {section.icon}
                  </div>

                  <div>
                    <h3>
                      {section.title}
                    </h3>

                    <p>
                      {section.subtitle}
                    </p>
                  </div>

                </div>

                <div className="card-bottom">

                  <span>
                    {section.description}
                  </span>

                  <span className="open">
                    OPEN →
                  </span>

                </div>

                <div className="hover-line" />

              </Link>
            ))}

          </div>

        </section>

        {/* BOTTOM MEDIA AREA */}
        <section className="media-deck">

          <div className="cassette">

            <div className="cassette-label">
              <span>MIXTAPE</span>
              <strong>CLAR // 22</strong>
            </div>

            <div className="cassette-window">
              <div className="reel left">
                <span />
              </div>

              <div className="tape-line" />

              <div className="reel right">
                <span />
              </div>
            </div>

            <div className="cassette-bottom">
              SIDE A
              <span>────────</span>
              SIDE B
            </div>

          </div>

          <div className="terminal">

            <div className="terminal-header">
              <span>CLAR_TERMINAL</span>
              <span>—</span>
              <span>×</span>
            </div>

            <div className="terminal-body">

              <p>
                <span>&gt;</span> loading birthday_archive...
              </p>

              <p>
                <span>&gt;</span> finding memories...
                <b> OK</b>
              </p>

              <p>
                <span>&gt;</span> locating embarrassing photos...
                <b> OK</b>
              </p>

              <p>
                <span>&gt;</span> emotional damage...
                <b> 100%</b>
              </p>

              <p className="terminal-final">
                <span>&gt;</span> archive ready
                <i>_</i>
              </p>

            </div>

          </div>

        </section>

        {/* FOOTER */}
        <footer>

          <div className="footer-left">
            <span>© DVA</span>
            <span>CLAR_ARCHIVE</span>
          </div>

          <div className="footer-center">
            PLEASE REWIND AFTER USE
          </div>

          <div className="footer-right">
            TRACK 01 / 06
          </div>

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
          background: #171717;
        }

        body {
          font-family: var(--font-space-mono), monospace;
        }

        .birthday-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 10%,
              rgba(165,184,92,.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 70%,
              rgba(179,75,67,.07),
              transparent 30%
            ),
            #171717;
          color: #d8d5c8;
          position: relative;
          overflow-x: hidden;
        }

        /* -------------------------
           CRT
        ------------------------- */

        .crt-overlay {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 50;
          background:
            radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(0,0,0,.42) 100%
            );
          mix-blend-mode: multiply;
        }

        .scanlines {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 49;
          opacity: .11;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,.08) 4px
            );
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .08;
          background-image:
            linear-gradient(#d8d5c8 1px, transparent 1px),
            linear-gradient(90deg, #d8d5c8 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 80%
          );
        }

        /* -------------------------
           TOP BAR
        ------------------------- */

        .topbar {
          height: 42px;
          border-bottom: 1px solid #55524b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-size: 10px;
          letter-spacing: .15em;
          position: relative;
          z-index: 5;
          background: rgba(23,23,23,.9);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rec-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #b34b43;
          box-shadow: 0 0 8px rgba(179,75,67,.6);
          animation: blink 1.2s infinite;
        }

        .separator {
          color: #66625a;
        }

        .topbar-center {
          color: #77736a;
          font-size: 9px;
        }

        .logout {
          background: transparent;
          color: #aaa69b;
          border: 0;
          font-family: inherit;
          font-size: 9px;
          letter-spacing: .12em;
          cursor: pointer;
        }

        .logout:hover {
          color: #d8d5c8;
        }

        /* -------------------------
           SHELL
        ------------------------- */

        .page-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* -------------------------
           HERO
        ------------------------- */

        .hero {
          padding: 48px 0 70px;
        }

        .hero-meta {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          letter-spacing: .18em;
          color: #77736a;
          margin-bottom: 28px;
        }

        .hero-main {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 50px;
          align-items: center;
        }

        .tiny-label {
          font-family: var(--font-pixel);
          font-size: 9px;
          color: #a5b85c;
          margin-bottom: 18px;
          letter-spacing: .05em;
        }

        .blink {
          animation: blink 1s infinite;
        }

        .glitch-title {
          font-family: var(--font-orbitron);
          font-weight: 900;
          font-size: clamp(90px, 18vw, 230px);
          line-height: .72;
          letter-spacing: -.08em;
          margin: 0;
          color: #d8d5c8;
          position: relative;
          text-shadow:
            4px 0 #b34b43,
            -3px 0 #77736a;
          animation: titleJitter 5s infinite;
        }

        .glitch-title::before,
        .glitch-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }

        .glitch-title::before {
          color: #a5b85c;
          transform: translate(3px, -2px);
          clip-path: inset(20% 0 62% 0);
          animation: glitchA 4s infinite;
        }

        .glitch-title::after {
          color: #b34b43;
          transform: translate(-3px, 2px);
          clip-path: inset(65% 0 12% 0);
          animation: glitchB 3.5s infinite;
        }

        .exe-line {
          margin-top: 28px;
          display: flex;
          gap: 24px;
          font-family: var(--font-pixel);
          font-size: 8px;
          color: #77736a;
        }

        .exe-line span:first-child {
          color: #a5b85c;
        }

        /* -------------------------
           CD
        ------------------------- */

        .cd-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .cd {
          width: 270px;
          height: 270px;
          border-radius: 50%;
          position: relative;
          background:
            conic-gradient(
              from 20deg,
              #5d5c58,
              #b8b5aa,
              #686762,
              #d5d1c4,
              #77756d,
              #c7c3b7,
              #5d5c58
            );
          box-shadow:
            0 0 0 1px #aaa69b,
            0 25px 50px rgba(0,0,0,.45);
          animation: spin 18s linear infinite;
        }

        .cd::before {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.5);
        }

        .cd::after {
          content: "";
          position: absolute;
          inset: 35px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,.25);
        }

        .cd-label {
          position: absolute;
          inset: 50%;
          transform: translate(-50%, -50%);
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background: #b34b43;
          color: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 2;
          font-family: var(--font-pixel);
          font-size: 10px;
        }

        .cd-label small {
          font-family: var(--font-space-mono);
          font-size: 7px;
          margin-top: 7px;
        }

        .cd-hole {
          position: absolute;
          z-index: 3;
          width: 14px;
          height: 14px;
          background: #171717;
          border: 2px solid #aaa69b;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .cd-shine {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,.5) 48%,
            transparent 58%
          );
          opacity: .45;
        }

        .cd-caption {
          font-family: var(--font-pixel);
          font-size: 7px;
          text-align: center;
          color: #77736a;
          line-height: 1.8;
        }

        .cd-caption span {
          color: #b34b43;
        }

        /* -------------------------
           VHS PLAYER
        ------------------------- */

        .vhs-player {
          margin-top: 55px;
          border: 1px solid #55524b;
          background: #252525;
          min-height: 145px;
          display: grid;
          grid-template-columns: 170px 1fr 180px;
          box-shadow: 8px 8px 0 rgba(0,0,0,.25);
        }

        .vhs-left {
          padding: 22px;
          border-right: 1px solid #55524b;
        }

        .vhs-label {
          font-family: var(--font-pixel);
          font-size: 8px;
          color: #171717;
          background: #d8d5c8;
          padding: 10px 8px;
          transform: rotate(-2deg);
        }

        .vhs-stripes {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vhs-stripes span {
          height: 5px;
          background: #55524b;
        }

        .vhs-stripes span:nth-child(2) {
          width: 70%;
          background: #a5b85c;
        }

        .vhs-stripes span:nth-child(3) {
          width: 85%;
          background: #b34b43;
        }

        .vhs-stripes span:nth-child(4) {
          width: 50%;
        }

        .vhs-screen {
          position: relative;
          min-height: 145px;
          overflow: hidden;
          background:
            linear-gradient(
              rgba(165,184,92,.08),
              rgba(165,184,92,.02)
            ),
            #101410;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .screen-noise {
          position: absolute;
          inset: 0;
          opacity: .18;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #a5b85c 3px
            );
          animation: tracking 2s infinite;
        }

        .timestamp {
          position: absolute;
          top: 12px;
          left: 15px;
          right: 15px;
          display: flex;
          justify-content: space-between;
          color: #a5b85c;
          font-size: 9px;
        }

        .screen-text {
          font-family: var(--font-pixel);
          font-size: clamp(10px, 1.8vw, 18px);
          color: #a5b85c;
          text-shadow: 0 0 7px rgba(165,184,92,.4);
          animation: screenFlicker 4s infinite;
          z-index: 2;
        }

        .screen-sub {
          margin-top: 18px;
          font-size: 9px;
          color: #77736a;
          z-index: 2;
        }

        .vhs-controls {
          border-left: 1px solid #55524b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          color: #77736a;
          font-size: 11px;
        }

        .vhs-controls span:nth-child(2) {
          color: #b34b43;
        }

        /* -------------------------
           INTRO
        ------------------------- */

        .intro-grid {
          margin-top: 55px;
          display: grid;
          grid-template-columns: 130px 1fr 180px;
          border-top: 1px solid #55524b;
          border-bottom: 1px solid #55524b;
        }

        .intro-number {
          font-family: var(--font-orbitron);
          font-size: 72px;
          font-weight: 800;
          color: #a5b85c;
          padding: 24px 20px;
          border-right: 1px solid #55524b;
        }

        .intro-copy {
          padding: 25px 30px;
        }

        .intro-copy p {
          margin: 0 0 10px;
          font-size: 13px;
          line-height: 1.6;
          max-width: 550px;
        }

        .intro-copy .label {
          font-family: var(--font-pixel);
          color: #b34b43;
          font-size: 8px;
          margin-bottom: 16px;
        }

        .intro-copy .muted {
          color: #77736a;
          font-size: 10px;
        }

        .date-stamp {
          padding: 25px 20px;
          border-left: 1px solid #55524b;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 8px;
          color: #77736a;
          gap: 8px;
        }

        .date-stamp strong {
          font-family: var(--font-pixel);
          font-size: 10px;
          color: #d8d5c8;
        }

        /* -------------------------
           DIRECTORY
        ------------------------- */

        .archive-section {
          padding: 35px 0 80px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-label {
          font-family: var(--font-pixel);
          color: #77736a;
          font-size: 7px;
        }

        .section-heading h2 {
          font-family: var(--font-orbitron);
          font-size: clamp(24px, 4vw, 42px);
          margin: 10px 0 0;
          letter-spacing: -.04em;
        }

        .cursor {
          color: #a5b85c;
          animation: blink .8s infinite;
        }

        .directory-status {
          display: flex;
          gap: 18px;
          font-size: 8px;
          color: #77736a;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .file-card {
          min-height: 205px;
          padding: 17px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: #d8d5c8;
          background: #252525;
          border: 1px solid #55524b;
          transition:
            transform .15s ease,
            border-color .15s ease,
            background .15s ease;
        }

        .file-card:hover {
          transform: translate(-3px, -3px);
          border-color: #a5b85c;
          background: #292929;
          box-shadow: 7px 7px 0 #111;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 8px;
          color: #77736a;
        }

        .file-number {
          font-family: var(--font-pixel);
          color: #d8d5c8;
        }

        .file-type {
          color: #a5b85c;
        }

        .card-middle {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .file-icon {
          width: 56px;
          height: 56px;
          border: 1px solid #77736a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          color: #a5b85c;
          font-family: var(--font-orbitron);
        }

        .card-middle h3 {
          font-family: var(--font-orbitron);
          font-size: 19px;
          margin: 0 0 8px;
          letter-spacing: -.02em;
        }

        .card-middle p {
          font-size: 8px;
          color: #77736a;
          margin: 0;
          letter-spacing: .04em;
          line-height: 1.5;
        }

        .card-bottom {
          position: absolute;
          bottom: 15px;
          left: 17px;
          right: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8px;
          color: #77736a;
        }

        .open {
          color: #d8d5c8;
        }

        .hover-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background: #a5b85c;
          transition: width .3s ease;
        }

        .file-card:hover .hover-line {
          width: 100%;
        }

        .type-err .file-icon {
          color: #b34b43;
          border-color: #b34b43;
        }

        .type-cd .file-icon {
          color: #d8d5c8;
        }

        .type-game .file-icon {
          color: #a5b85c;
        }

        /* -------------------------
           MEDIA DECK
        ------------------------- */

        .media-deck {
          display: grid;
          grid-template-columns: 330px 1fr;
          gap: 25px;
          padding-bottom: 80px;
        }

        .cassette {
          background: #77736a;
          padding: 20px;
          min-height: 220px;
          transform: rotate(-1deg);
          box-shadow: 8px 8px 0 #101010;
        }

        .cassette-label {
          background: #d8d5c8;
          color: #171717;
          padding: 13px;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-pixel);
          font-size: 7px;
        }

        .cassette-label strong {
          color: #b34b43;
        }

        .cassette-window {
          height: 72px;
          background: #171717;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: relative;
          overflow: hidden;
        }

        .reel {
          width: 45px;
          height: 45px;
          border: 4px dotted #77736a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reel span {
          width: 12px;
          height: 12px;
          background: #77736a;
          border-radius: 50%;
        }

        .tape-line {
          position: absolute;
          height: 8px;
          left: 45px;
          right: 45px;
          background: #55524b;
        }

        .cassette-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 8px;
          color: #171717;
        }

        .terminal {
          background: #101410;
          border: 1px solid #55524b;
          min-height: 220px;
          box-shadow: 8px 8px 0 #101010;
        }

        .terminal-header {
          height: 30px;
          border-bottom: 1px solid #55524b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          color: #77736a;
          font-size: 8px;
        }

        .terminal-body {
          padding: 22px;
          color: #a5b85c;
          font-size: 10px;
          line-height: 2;
        }

        .terminal-body p {
          margin: 0;
        }

        .terminal-body b {
          color: #d8d5c8;
          font-weight: 400;
        }

        .terminal-final {
          margin-top: 12px !important;
          color: #d8d5c8;
        }

        .terminal-final i {
          color: #a5b85c;
          font-style: normal;
          animation: blink .8s infinite;
        }

        /* -------------------------
           FOOTER
        ------------------------- */

        footer {
          border-top: 1px solid #55524b;
          padding: 25px 0 35px;
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          color: #77736a;
        }

        .footer-left {
          display: flex;
          gap: 20px;
        }

        .footer-center {
          font-family: var(--font-pixel);
          font-size: 6px;
        }

        /* -------------------------
           ANIMATIONS
        ------------------------- */

        @keyframes blink {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: .25; }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes titleJitter {
          0%, 94%, 100% {
            transform: translate(0);
          }
          95% {
            transform: translate(-2px, 1px);
          }
          96% {
            transform: translate(3px, -1px);
          }
          97% {
            transform: translate(0);
          }
        }

        @keyframes glitchA {
          0%, 88%, 100% {
            opacity: 0;
          }
          89% {
            opacity: .7;
            clip-path: inset(20% 0 62% 0);
          }
          91% {
            opacity: 0;
          }
        }

        @keyframes glitchB {
          0%, 78%, 100% {
            opacity: 0;
          }
          79% {
            opacity: .6;
            clip-path: inset(65% 0 12% 0);
          }
          81% {
            opacity: 0;
          }
        }

        @keyframes tracking {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          82% {
            transform: translateY(7px);
          }
          84% {
            transform: translateY(-4px);
          }
        }

        @keyframes screenFlicker {
          0%, 96%, 100% {
            opacity: 1;
          }
          97% {
            opacity: .3;
          }
          98% {
            opacity: .9;
          }
        }

        /* -------------------------
           MOBILE
        ------------------------- */

        @media (max-width: 800px) {

          .topbar {
            padding: 0 14px;
          }

          .topbar-center {
            display: none;
          }

          .page-shell {
            width: min(100% - 24px, 600px);
          }

          .hero {
            padding-top: 35px;
          }

          .hero-meta {
            font-size: 7px;
          }

          .hero-main {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .glitch-title {
            font-size: clamp(82px, 26vw, 150px);
          }

          .cd {
            width: 210px;
            height: 210px;
          }

          .cd-label {
            width: 82px;
            height: 82px;
          }

          .vhs-player {
            grid-template-columns: 1fr;
          }

          .vhs-left {
            display: none;
          }

          .vhs-controls {
            border-left: 0;
            border-top: 1px solid #55524b;
            padding: 12px;
          }

          .intro-grid {
            grid-template-columns: 80px 1fr;
          }

          .intro-number {
            font-size: 45px;
            padding: 20px 12px;
          }

          .intro-copy {
            padding: 20px;
          }

          .date-stamp {
            grid-column: 1 / -1;
            border-left: 0;
            border-top: 1px solid #55524b;
            padding: 15px;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .directory-status {
            font-size: 7px;
          }

          .file-grid {
            grid-template-columns: 1fr;
          }

          .file-card {
            min-height: 190px;
          }

          .media-deck {
            grid-template-columns: 1fr;
          }

          footer {
            flex-wrap: wrap;
            gap: 20px;
          }

          .footer-center {
            order: 3;
            width: 100%;
          }
        }

      `}</style>
    </main>
  )
}
