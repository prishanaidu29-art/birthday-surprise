'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowUpRight,
  ChevronRight,
  Disc3,
  Gamepad2,
  LockKeyhole,
  Power,
  ScanLine,
  Terminal,
  Zap,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function BirthdayPage() {
  const router = useRouter()
  const [booted, setBooted] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
      return
    }

    const timer = setTimeout(() => setBooted(true), 500)

    return () => clearTimeout(timer)
  }, [router])

  const sections = [
    {
      number: '01',
      title: 'MEMORIES',
      subtitle: 'PHOTO DATABASE',
      description: 'photos, places & evidence',
      link: '/birthday/memories',
      icon: '◉',
    },
    {
      number: '02',
      title: 'MESSAGES',
      subtitle: 'INCOMING DATA',
      description: 'things people wanted you to know',
      link: '/birthday/messages',
      icon: '✦',
    },
    {
      number: '03',
      title: 'SOUNDTRACK',
      subtitle: 'AUDIO FILES',
      description: 'songs that became us',
      link: '/birthday/playlist',
      icon: '♫',
    },
    {
      number: '04',
      title: 'CHAOS',
      subtitle: 'UNSTABLE FILES',
      description: 'shit, giggles & questionable decisions',
      link: '/birthday/games',
      icon: '⚠',
    },
    {
      number: '05',
      title: 'THE QUIZ',
      subtitle: 'KNOWLEDGE TEST',
      description: 'prove you actually know us',
      link: '/birthday/quiz',
      icon: '?',
    },
    {
      number: '06',
      title: 'THE JOURNEY',
      subtitle: 'LOCATION DATA',
      description: 'everywhere somehow led here',
      link: '/birthday/journey',
      icon: '⌁',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  if (!booted) {
    return (
      <main className="min-h-screen bg-[#050609] text-[#e9faff] flex items-center justify-center overflow-hidden">
        <div className="scanlines" />

        <div className="boot-screen">
          <div className="boot-logo">DVA://CLAR</div>

          <div className="boot-line">
            <span>INITIALISING MEMORY CORE</span>
            <span>OK</span>
          </div>

          <div className="boot-line">
            <span>LOADING BIRTHDAY_DATA</span>
            <span>OK</span>
          </div>

          <div className="boot-line">
            <span>ACCESSING ARCHIVE_001</span>
            <span>OK</span>
          </div>

          <div className="boot-progress">
            <div />
          </div>

          <p className="blink">PRESSING START...</p>
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

          * {
            box-sizing: border-box;
          }

          .scanlines {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 20;
            opacity: 0.12;
            background: repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,0.08) 4px
            );
          }

          .boot-screen {
            width: min(520px, 90vw);
            font-family: 'IBM Plex Mono', monospace;
          }

          .boot-logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 64px;
            letter-spacing: 0.08em;
            color: #ff285c;
            text-shadow:
              3px 0 #00eaff,
              -3px 0 rgba(255, 0, 110, 0.5);
            margin-bottom: 40px;
          }

          .boot-line {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #73808c;
            font-size: 10px;
            letter-spacing: 0.12em;
          }

          .boot-line span:last-child {
            color: #00f0ff;
          }

          .boot-progress {
            margin-top: 25px;
            height: 3px;
            background: #141a20;
            overflow: hidden;
          }

          .boot-progress div {
            height: 100%;
            width: 100%;
            background: linear-gradient(
              90deg,
              #ff285c,
              #ff285c,
              #00eaff
            );
            animation: boot 0.5s ease-out;
          }

          .blink {
            margin-top: 30px;
            color: #ff285c;
            font-size: 10px;
            letter-spacing: 0.2em;
            animation: blink 0.7s infinite;
          }

          @keyframes boot {
            from { width: 0; }
            to { width: 100%; }
          }

          @keyframes blink {
            50% { opacity: 0; }
          }
        `}</style>
      </main>
    )
  }

  return (
    <main className="cyber-page">

      {/* CRT EFFECT */}
      <div className="scanlines" />
      <div className="noise" />

      {/* CYBER HUD */}
      <div className="hud-corner top-left" />
      <div className="hud-corner top-right" />
      <div className="hud-corner bottom-left" />
      <div className="hud-corner bottom-right" />

      {/* TOP SYSTEM BAR */}
      <header className="topbar">

        <div className="system-id">
          <span className="status-dot" />
          <span>ARCHIVE://001</span>
        </div>

        <div className="system-center">
          <span>PRIVATE NETWORK</span>
          <span className="separator">///</span>
          <span>CONNECTED</span>
        </div>

        <button
          onClick={handleLogout}
          className="exit-button"
        >
          <Power size={13} />
          DISCONNECT
        </button>

      </header>

      {/* HERO */}
      <section className="hero">

        <div className="hero-meta">

          <div className="meta-line">
            <span>SUBJECT</span>
            <span>CLAR</span>
          </div>

          <div className="meta-line">
            <span>DOB</span>
            <span>19.11.04</span>
          </div>

          <div className="meta-line">
            <span>STATUS</span>
            <span className="online">ONLINE</span>
          </div>

        </div>

        <div className="hero-main">

          <div className="hero-title-wrap">

            <div className="glitch-label">
              <Terminal size={12} />
              <span>USER PROFILE FOUND</span>
              <span className="red">[ACCESS GRANTED]</span>
            </div>

            <h1
              className="hero-title"
              data-text="CLAR"
            >
              CLAR
            </h1>

            <div className="hero-subtitle">
              <span>LEVEL 22</span>
              <span>//</span>
              <span>PLAYER ONE</span>
              <span>//</span>
              <span>EST. 2004</span>
            </div>

            <p className="hero-copy">
              You made it this far.
              <br />
              Unfortunately, there is no turning back now.
            </p>

          </div>

          {/* PHOTO / PROFILE FRAME */}
          <div className="profile-frame">

            <div className="profile-top">
              <span>CAM_001</span>
              <span>REC ●</span>
            </div>

            <div className="profile-photo">

              <div className="crosshair crosshair-one" />
              <div className="crosshair crosshair-two" />

              <div className="photo-placeholder">
                <ScanLine size={35} />
                <span>IMAGE DATA</span>
                <small>AWAITING UPLOAD</small>
              </div>

              <div className="photo-glitch" />

            </div>

            <div className="profile-bottom">
              <span>19:11:04</span>
              <span>ISO 800</span>
              <span>RAW</span>
            </div>

          </div>

        </div>

        {/* HERO FOOTER */}
        <div className="hero-footer">

          <div className="scroll-indicator">
            <span>SCROLL TO ACCESS ARCHIVE</span>
            <div className="scroll-line" />
          </div>

          <div className="coordinates">
            03.4821
            <br />
            101.7617
          </div>

        </div>

      </section>

      {/* DIVIDER */}
      <div className="cyber-divider">
        <span />
        <Zap size={13} />
        <span />
      </div>

      {/* INTRO */}
      <section className="intro">

        <div className="intro-tag">
          <LockKeyhole size={12} />
          CLASSIFIED DATA
        </div>

        <h2>
          A SMALL
          <br />
          <span>DIGITAL TIME CAPSULE.</span>
        </h2>

        <p>
          A collection of memories, questionable decisions,
          unnecessarily dramatic moments and people who
          somehow decided you were worth keeping around.
        </p>

        <div className="intro-warning">
          <span>⚠</span>
          SOME FILES MAY CONTAIN EMBARRASSING EVIDENCE
        </div>

      </section>

      {/* ARCHIVE */}
      <section className="archive">

        <div className="archive-header">

          <div>
            <div className="section-code">
              // DIRECTORY_001
            </div>

            <h2>SELECT FILE</h2>
          </div>

          <div className="archive-count">
            <span>FILES</span>
            <strong>06</strong>
          </div>

        </div>

        <div className="file-grid">

          {sections.map((section, index) => (

            <Link
              key={section.number}
              href={section.link}
              className={`file-card ${hovered === index ? 'active' : ''}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >

              <div className="card-glow" />

              <div className="file-card-top">
                <span>{section.number}</span>

                <span className="file-icon">
                  {section.icon}
                </span>
              </div>

              <div className="file-card-body">

                <div className="file-type">
                  {section.subtitle}
                </div>

                <h3>
                  {section.title}
                </h3>

                <p>
                  {section.description}
                </p>

              </div>

              <div className="file-card-bottom">

                <span>
                  FILE_{section.number}.DAT
                </span>

                <ChevronRight
                  size={17}
                  className="arrow"
                />

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* FINAL MESSAGE */}
      <section className="final-message">

        <div className="message-terminal">

          <div className="terminal-bar">
            <span>
              <span className="terminal-dot red-dot" />
              <span className="terminal-dot yellow-dot" />
              <span className="terminal-dot green-dot" />
            </span>

            <span>MESSAGE.exe</span>

            <span>●</span>
          </div>

          <div className="terminal-content">

            <div className="terminal-command">
              <span>root@birthday:~$</span>
              <span> cat /message/clar.txt</span>
            </div>

            <h2>
              HAPPY
              <br />
              BIRTHDAY,
              <br />
              <span>CLAR.</span>
            </h2>

            <p>
              Somehow you became a massive part of
              my life and now you have an entire website
              dedicated to you.
            </p>

            <p className="terminal-small">
              No refunds. No returns.
              <br />
              You're stuck with us.
            </p>

            <div className="cursor-line">
              <span>root@birthday:~$</span>
              <span className="cursor">█</span>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <div>
          DVA://CLAR
        </div>

        <div>
          <Disc3 size={12} className="spin" />
          ARCHIVE RUNNING
        </div>

        <div>
          19 • 11 • 04
        </div>

      </footer>

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --bg: #050609;
          --panel: #090c11;
          --panel2: #0d1117;
          --white: #eafaff;
          --muted: #6d7782;
          --cyan: #00eaff;
          --cyan-dim: #006c78;
          --red: #ff285c;
          --red-dark: #74152b;
          --line: rgba(0,234,255,0.18);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .cyber-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 75% 15%,
              rgba(255, 40, 92, 0.09),
              transparent 25%
            ),
            radial-gradient(
              circle at 15% 40%,
              rgba(0, 234, 255, 0.06),
              transparent 25%
            ),
            #050609;
          color: var(--white);
          overflow-x: hidden;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
        }

        /* CRT */

        .scanlines {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.025) 4px
          );
        }

        .noise {
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          mix-blend-mode: screen;
        }

        /* HUD */

        .hud-corner {
          position: fixed;
          width: 35px;
          height: 35px;
          z-index: 50;
          pointer-events: none;
          opacity: 0.5;
        }

        .top-left {
          top: 15px;
          left: 15px;
          border-top: 1px solid var(--cyan);
          border-left: 1px solid var(--cyan);
        }

        .top-right {
          top: 15px;
          right: 15px;
          border-top: 1px solid var(--cyan);
          border-right: 1px solid var(--cyan);
        }

        .bottom-left {
          bottom: 15px;
          left: 15px;
          border-bottom: 1px solid var(--cyan);
          border-left: 1px solid var(--cyan);
        }

        .bottom-right {
          bottom: 15px;
          right: 15px;
          border-bottom: 1px solid var(--cyan);
          border-right: 1px solid var(--cyan);
        }

        /* TOP BAR */

        .topbar {
          height: 60px;
          padding: 0 5vw;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          color: var(--muted);
        }

        .system-id,
        .system-center,
        .exit-button {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--cyan);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--cyan);
          animation: pulse 1.5s infinite;
        }

        .system-center {
          color: #414a54;
        }

        .separator {
          color: var(--red);
        }

        .exit-button {
          border: 0;
          background: none;
          color: #5e6872;
          cursor: pointer;
          font: inherit;
          transition: 0.2s;
        }

        .exit-button:hover {
          color: var(--red);
        }

        /* HERO */

        .hero {
          max-width: 1300px;
          margin: auto;
          padding: 80px 5vw 50px;
          min-height: 720px;
          position: relative;
        }

        .hero-meta {
          width: 180px;
          position: absolute;
          right: 5vw;
          top: 80px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: #56616b;
        }

        .meta-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .meta-line .online {
          color: var(--cyan);
        }

        .hero-main {
          display: grid;
          grid-template-columns: 1fr 310px;
          gap: 80px;
          align-items: center;
          padding-top: 70px;
        }

        .glitch-label {
          display: flex;
          gap: 9px;
          align-items: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: var(--cyan);
          margin-bottom: 20px;
        }

        .glitch-label .red {
          color: var(--red);
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px, 18vw, 270px);
          line-height: 0.7;
          letter-spacing: -0.02em;
          margin: 0;
          color: #e9faff;
          position: relative;
          text-shadow:
            5px 0 var(--red),
            -5px 0 var(--cyan);
          animation: titleGlitch 5s infinite;
        }

        .hero-subtitle {
          margin-top: 35px;
          display: flex;
          gap: 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #65717c;
          letter-spacing: 0.14em;
        }

        .hero-subtitle span:nth-child(1) {
          color: var(--red);
        }

        .hero-copy {
          margin-top: 35px;
          color: #89939d;
          line-height: 1.9;
          font-size: 14px;
          max-width: 440px;
        }

        /* PROFILE */

        .profile-frame {
          background: #080b10;
          border: 1px solid #27313a;
          padding: 10px;
          transform: rotate(2deg);
          box-shadow:
            12px 12px 0 rgba(255,40,92,0.12),
            -8px -8px 0 rgba(0,234,255,0.06);
        }

        .profile-top,
        .profile-bottom {
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          color: #63707b;
          padding: 5px 2px;
          letter-spacing: 0.12em;
        }

        .profile-top span:last-child {
          color: var(--red);
        }

        .profile-photo {
          aspect-ratio: 4 / 5;
          background:
            linear-gradient(
              135deg,
              #111820,
              #050609
            );
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-photo::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              120deg,
              transparent 30%,
              rgba(0,234,255,0.08),
              transparent 70%
            );
          animation: scan 4s linear infinite;
        }

        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #3d4b57;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
        }

        .photo-placeholder svg {
          color: var(--cyan);
          opacity: 0.5;
        }

        .photo-placeholder small {
          color: var(--red);
          font-size: 6px;
        }

        .crosshair {
          position: absolute;
          width: 25px;
          height: 25px;
          border-color: var(--cyan);
          opacity: 0.6;
        }

        .crosshair-one {
          top: 15px;
          left: 15px;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .crosshair-two {
          bottom: 15px;
          right: 15px;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }

        /* HERO FOOTER */

        .hero-footer {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-top: 70px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: #4f5963;
        }

        .scroll-indicator {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .scroll-line {
          width: 80px;
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--cyan),
            transparent
          );
        }

        .coordinates {
          text-align: right;
          line-height: 1.8;
          color: #303a43;
        }

        /* DIVIDER */

        .cyber-divider {
          max-width: 1300px;
          margin: auto;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--red);
        }

        .cyber-divider span {
          height: 1px;
          flex: 1;
          background: linear-gradient(
            90deg,
            transparent,
            var(--line)
          );
        }

        .cyber-divider span:last-child {
          background: linear-gradient(
            90deg,
            var(--line),
            transparent
          );
        }

        /* INTRO */

        .intro {
          max-width: 800px;
          margin: auto;
          padding: 130px 5vw 100px;
          text-align: center;
        }

        .intro-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--red);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          border: 1px solid rgba(255,40,92,0.3);
          padding: 8px 13px;
          background: rgba(255,40,92,0.04);
        }

        .intro h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(60px, 9vw, 105px);
          line-height: 0.85;
          letter-spacing: 0.01em;
          margin: 30px 0;
        }

        .intro h2 span {
          color: transparent;
          -webkit-text-stroke: 1px #64727d;
        }

        .intro p {
          max-width: 570px;
          margin: auto;
          color: #747f89;
          line-height: 1.8;
          font-size: 13px;
        }

        .intro-warning {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 35px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          color: #525d67;
          letter-spacing: 0.12em;
        }

        .intro-warning span {
          color: var(--red);
        }

        /* ARCHIVE */

        .archive {
          max-width: 1300px;
          margin: auto;
          padding: 0 5vw 130px;
        }

        .archive-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 35px;
        }

        .section-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: var(--cyan);
          letter-spacing: 0.15em;
          margin-bottom: 10px;
        }

        .archive-header h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 60px;
          line-height: 0.8;
          margin: 0;
        }

        .archive-count {
          display: flex;
          align-items: end;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
        }

        .archive-count span {
          color: #505b65;
          font-size: 7px;
        }

        .archive-count strong {
          color: var(--cyan);
          font-size: 20px;
          font-weight: 400;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: #1c252d;
          border: 1px solid #1c252d;
        }

        .file-card {
          min-height: 280px;
          background:
            linear-gradient(
              135deg,
              #090c11,
              #07090d
            );
          padding: 25px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition:
            transform 0.25s,
            background 0.25s;
        }

        .file-card:hover {
          background:
            linear-gradient(
              135deg,
              #0c141a,
              #090c11
            );
          transform: translate(-2px, -2px);
          z-index: 2;
        }

        .file-card-top,
        .file-card-bottom {
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: #4f5b65;
          letter-spacing: 0.1em;
        }

        .file-card:hover .file-card-top > span:first-child {
          color: var(--cyan);
        }

        .file-icon {
          color: var(--red);
          font-size: 17px;
        }

        .file-card-body {
          margin-top: 50px;
        }

        .file-type {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          letter-spacing: 0.16em;
          color: var(--cyan);
          margin-bottom: 10px;
        }

        .file-card h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 55px;
          line-height: 0.85;
          letter-spacing: 0.02em;
          margin: 0;
          color: #e9faff;
          transition: 0.2s;
        }

        .file-card:hover h3 {
          color: var(--red);
          text-shadow: 2px 0 var(--cyan);
        }

        .file-card p {
          margin-top: 16px;
          color: #68737e;
          font-size: 11px;
          line-height: 1.5;
          max-width: 300px;
        }

        .file-card-bottom {
          position: absolute;
          bottom: 20px;
          left: 25px;
          right: 25px;
        }

        .arrow {
          color: #56616c;
          transition: 0.2s;
        }

        .file-card:hover .arrow {
          color: var(--cyan);
          transform: translateX(5px);
        }

        .card-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          right: -100px;
          bottom: -100px;
          background: var(--cyan);
          filter: blur(100px);
          opacity: 0;
          transition: 0.3s;
        }

        .file-card:hover .card-glow {
          opacity: 0.08;
        }

        /* FINAL MESSAGE */

        .final-message {
          max-width: 900px;
          margin: auto;
          padding: 20px 5vw 150px;
        }

        .message-terminal {
          border: 1px solid #29333c;
          background: #07090d;
          box-shadow: 15px 15px 0 rgba(0,234,255,0.03);
        }

        .terminal-bar {
          height: 38px;
          border-bottom: 1px solid #202a32;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 14px;
          color: #56616b;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
        }

        .terminal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }

        .red-dot {
          background: var(--red);
        }

        .yellow-dot {
          background: #f2c94c;
        }

        .green-dot {
          background: #2fe88d;
        }

        .terminal-content {
          padding: 45px;
        }

        .terminal-command {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #596570;
          margin-bottom: 35px;
        }

        .terminal-command span:first-child {
          color: var(--cyan);
        }

        .terminal-content h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(70px, 11vw, 125px);
          line-height: 0.72;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .terminal-content h2 span {
          color: var(--red);
          text-shadow: 3px 0 var(--cyan);
        }

        .terminal-content p {
          margin-top: 35px;
          max-width: 530px;
          color: #75818b;
          line-height: 1.8;
          font-size: 13px;
        }

        .terminal-content .terminal-small {
          font-family: 'IBM Plex Mono', monospace;
          color: #4e5a65;
          font-size: 9px;
        }

        .cursor-line {
          margin-top: 50px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: var(--cyan);
        }

        .cursor {
          color: var(--red);
          animation: blink 0.8s infinite;
        }

        /* FOOTER */

        footer {
          border-top: 1px solid #182027;
          max-width: 1300px;
          margin: auto;
          padding: 25px 5vw 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #3d4852;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 7px;
          letter-spacing: 0.15em;
        }

        footer div:nth-child(2) {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #56616c;
        }

        .spin {
          color: var(--cyan);
          animation: spin 3s linear infinite;
        }

        /* ANIMATIONS */

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 10px var(--cyan);
          }
          50% {
            opacity: 0.4;
            box-shadow: 0 0 3px var(--cyan);
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @keyframes titleGlitch {
          0%, 93%, 100% {
            transform: translate(0);
          }
          94% {
            transform: translate(-4px, 1px);
          }
          95% {
            transform: translate(4px, -1px);
          }
          96% {
            transform: translate(-2px, 0);
          }
        }

        /* MOBILE */

        @media (max-width: 768px) {

          .topbar {
            padding: 0 20px;
          }

          .system-center {
            display: none;
          }

          .hero {
            padding: 55px 20px 40px;
          }

          .hero-meta {
            position: static;
            width: 100%;
            margin-bottom: 60px;
          }

          .hero-main {
            grid-template-columns: 1fr;
            gap: 55px;
            padding-top: 0;
          }

          .hero-title {
            font-size: 32vw;
          }

          .hero-subtitle {
            flex-wrap: wrap;
            gap: 8px;
          }

          .profile-frame {
            width: min(75vw, 300px);
            margin-left: auto;
          }

          .hero-footer {
            margin-top: 55px;
          }

          .intro {
            padding-top: 90px;
          }

          .file-grid {
            grid-template-columns: 1fr;
          }

          .file-card {
            min-height: 250px;
          }

          .archive-header h2 {
            font-size: 50px;
          }

          .terminal-content {
            padding: 30px 22px;
          }

          footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          footer div:nth-child(2) {
            display: none;
          }

        }

      `}</style>

    </main>
  )
}
