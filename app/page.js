'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

/*
  ============================================================
  CLAR'S BIRTHDAY — RETRO CRT ARCHIVE
  ============================================================

  PHOTO / VIDEO / AUDIO SETUP
  ---------------------------
  Put your files inside:

      /public/birthday/

  Example:

      /public/birthday/clar1.jpg
      /public/birthday/clar2.jpg
      /public/birthday/friend.mp3
      /public/birthday/song.mp3
      /public/birthday/background.mp4

  Then change the file names in the MEDIA section below.

  PASSWORD
  --------
  Change PASSWORD below to whatever you want.

  ============================================================
*/

const PASSWORD = 'clar'

const MEDIA = {
  photos: [
    '/birthday/clar1.jpg',
    '/birthday/clar2.jpg',
    '/birthday/clar3.jpg',
    '/birthday/clar4.jpg',
  ],

  song: '/birthday/song.mp3',

  voice: '/birthday/friend.mp3',

  video: '/birthday/background.mp4',
}

const MINI_FILES = [
  {
    name: 'FEETGANG',
    icon: '📁',
    colour: 'yellow',
    message: 'classified feetgang material.',
  },
  {
    name: 'EGGS',
    icon: '🥚',
    colour: 'green',
    message: 'do not ask why this exists.',
  },
  {
    name: 'GRADUATION',
    icon: '🎓',
    colour: 'blue',
    message: 'academic weapons archive.',
  },
  {
    name: 'MEMORIES',
    icon: '💿',
    colour: 'purple',
    message: 'way too many questionable memories.',
  },
  {
    name: 'EVIDENCE',
    icon: '📼',
    colour: 'red',
    message: 'you were not supposed to find this.',
  },
]

function GlitchText({ children, className = '' }) {
  return (
    <span className={`glitch ${className}`} data-text={children}>
      {children}
    </span>
  )
}

function Window({
  title,
  children,
  className = '',
  onClose,
  accent = 'blue',
}) {
  const accents = {
    blue: '#4de7ff',
    green: '#b7ff4a',
    yellow: '#ffe66d',
    purple: '#b79cff',
    red: '#ff6b6b',
  }

  return (
    <div
      className={`retro-window ${className}`}
      style={{ '--accent': accents[accent] || accents.blue }}
    >
      <div className="window-bar">
        <div className="window-title">
          <span className="window-dot" />
          <span>{title}</span>
        </div>

        <div className="window-buttons">
          <button type="button">_</button>
          <button type="button">□</button>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="window-content">{children}</div>
    </div>
  )
}

function FakeFolder({ file, onClick }) {
  return (
    <button
      type="button"
      className={`fake-folder folder-${file.colour}`}
      onClick={onClick}
    >
      <div className="folder-icon">
        <span>{file.icon}</span>
      </div>

      <div className="folder-name">{file.name}</div>

      <div className="folder-glow" />
    </button>
  )
}

function FloatingBits() {
  const bits = [
    ['01', '8%', '18%', 'green'],
    ['REC', '84%', '13%', 'red'],
    ['>>', '74%', '82%', 'blue'],
    ['001101', '12%', '78%', 'purple'],
    ['PLAY', '46%', '8%', 'yellow'],
    ['♥', '91%', '60%', 'red'],
    ['404', '4%', '47%', 'yellow'],
    ['CD', '88%', '38%', 'blue'],
    ['///', '38%', '91%', 'green'],
    ['NO SIGNAL', '65%', '4%', 'red'],
  ]

  return (
    <>
      {bits.map(([text, left, top, colour], index) => (
        <div
          key={`${text}-${index}`}
          className={`floating-bit bit-${colour}`}
          style={{
            left,
            top,
            animationDelay: `${index * 0.4}s`,
          }}
        >
          {text}
        </div>
      ))}
    </>
  )
}

export default function HomePage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [screen, setScreen] = useState('desktop')
  const [error, setError] = useState('')
  const [activeFile, setActiveFile] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voicePlaying, setVoicePlaying] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)
  const [bootPhoto, setBootPhoto] = useState(0)
  const [cursor, setCursor] = useState({ x: 50, y: 50 })
  const [secretClicks, setSecretClicks] = useState(0)

  const audioRef = useRef(null)
  const voiceRef = useRef(null)

  /*
    ------------------------------------------------------------
    BOOT / LOADING SCREEN
    ------------------------------------------------------------
  */

  useEffect(() => {
    if (screen !== 'loading') return

    let progress = 0

    const progressTimer = setInterval(() => {
      progress += Math.random() * 8 + 2

      if (progress >= 100) {
        progress = 100
        clearInterval(progressTimer)

        setTimeout(() => {
          sessionStorage.setItem('birthday_authenticated', 'true')
          router.push('/birthday')
        }, 900)
      }

      setBootProgress(Math.floor(progress))
    }, 180)

    const photoTimer = setInterval(() => {
      setBootPhoto((current) => {
        if (!MEDIA.photos.length) return 0
        return (current + 1) % MEDIA.photos.length
      })
    }, 550)

    return () => {
      clearInterval(progressTimer)
      clearInterval(photoTimer)
    }
  }, [screen, router])

  /*
    ------------------------------------------------------------
    CURSOR / TOUCH MOVEMENT
    ------------------------------------------------------------
  */

  useEffect(() => {
    const move = (event) => {
      const x = event.clientX ?? 0
      const y = event.clientY ?? 0

      setCursor({
        x: (x / window.innerWidth) * 100,
        y: (y / window.innerHeight) * 100,
      })
    }

    window.addEventListener('pointermove', move)

    return () => window.removeEventListener('pointermove', move)
  }, [])

  /*
    ------------------------------------------------------------
    MUSIC
    ------------------------------------------------------------
  */

  const toggleMusic = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleVoice = async () => {
    if (!voiceRef.current) return

    try {
      if (voicePlaying) {
        voiceRef.current.pause()
        setVoicePlaying(false)
      } else {
        await voiceRef.current.play()
        setVoicePlaying(true)
      }
    } catch {
      setVoicePlaying(false)
    }
  }

  /*
    ------------------------------------------------------------
    PASSWORD
    ------------------------------------------------------------
  */

  const submitPassword = (event) => {
    event.preventDefault()

    if (password.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      setError('')
      setScreen('loading')
      setBootProgress(0)
    } else {
      setError('ACCESS DENIED // TRY AGAIN')
      setPassword('')

      setTimeout(() => {
        setError('')
      }, 2500)
    }
  }

  /*
    ------------------------------------------------------------
    DESKTOP
    ------------------------------------------------------------
  */

  if (screen === 'desktop') {
    return (
      <main
        className="crt-desktop"
        onClick={() => setSecretClicks((value) => value + 1)}
      >
        <div className="screen-glow" />

        <div
          className="cursor-glow"
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
          }}
        />

        <div className="scanlines" />
        <div className="vhs-noise" />
        <div className="tracking-line" />
        <FloatingBits />

        {/* TOP STATUS BAR */}

        <div className="top-status">
          <span>CLAR_OS // PRIVATE BUILD</span>

          <span className="status-middle">
            SYSTEM ONLINE <i /> VHS MODE
          </span>

          <span>19.11.04</span>
        </div>

        {/* MAIN TITLE */}

        <div className="intro-copy">
          <div className="tiny-label">
            <span className="blinking-dot" />
            INCOMING TRANSMISSION
          </div>

          <h1>
            <GlitchText>HEY CLAR.</GlitchText>
          </h1>

          <p>
            yayyy happy birthday Clar ♡
            <br />
            if you see this it means the website is working
            <br />
            <strong>(thank god)</strong>
            <br />
            now you just need to enter the password to enter.
            <br />
            good luck !
          </p>

          <div className="intro-code">
            SYS.MSG // BIRTHDAY_ARCHIVE_001
          </div>
        </div>

        {/* PHOTO WINDOW */}

        <Window
          title="PHOTO_VIEWER.exe"
          className="window-photo"
          accent="purple"
        >
          <div className="photo-viewer">
            {MEDIA.photos[photoIndex] ? (
              <img
                src={MEDIA.photos[photoIndex]}
                alt="Birthday archive"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : null}

            <div className="photo-placeholder">
              <span>INSERT MEMORY</span>
              <small>PHOTO_{String(photoIndex + 1).padStart(2, '0')}.JPG</small>
            </div>

            <div className="photo-counter">
              {String(photoIndex + 1).padStart(2, '0')} /{' '}
              {String(Math.max(MEDIA.photos.length, 1)).padStart(2, '0')}
            </div>
          </div>

          <div className="photo-controls">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setPhotoIndex(
                  (photoIndex - 1 + MEDIA.photos.length) %
                    Math.max(MEDIA.photos.length, 1)
                )
              }}
            >
              ◀
            </button>

            <span>MEMORY BUFFER</span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setPhotoIndex(
                  (photoIndex + 1) % Math.max(MEDIA.photos.length, 1)
                )
              }}
            >
              ▶
            </button>
          </div>
        </Window>

        {/* MUSIC WINDOW */}

        <Window
          title="CD_PLAYER // DISC_01"
          className="window-music"
          accent="yellow"
        >
          <div className="cd-player">
            <div className={`cd ${isPlaying ? 'cd-playing' : ''}`}>
              <div className="cd-lines" />
              <div className="cd-hole" />
              <span>CLAR</span>
            </div>

            <div className="music-info">
              <div className="music-title">
                {isPlaying ? 'NOW PLAYING' : 'PRESS PLAY'}
              </div>

              <div className="music-track">
                birthday_archive_mix.mp3
              </div>

              <div className="equalizer">
                {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                  <i
                    key={bar}
                    className={isPlaying ? 'eq-active' : ''}
                    style={{ animationDelay: `${bar * 0.08}s` }}
                  />
                ))}
              </div>

              <button
                type="button"
                className="play-button"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleMusic()
                }}
              >
                {isPlaying ? '❚❚ STOP' : '▶ PLAY'}
              </button>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={MEDIA.song}
            loop
            onEnded={() => setIsPlaying(false)}
          />
        </Window>

        {/* VIDEO WINDOW */}

        <Window
          title="VHS_DECK // LIVE_FEED"
          className="window-video"
          accent="green"
        >
          <div className="video-box">
            <video
              src={MEDIA.video}
              autoPlay
              muted
              loop
              playsInline
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />

            <div className="video-placeholder">
              <div className="video-static">▓▒░ NO SIGNAL ░▒▓</div>
              <small>VIDEO_FEED.MOV</small>
            </div>

            <div className="video-rec">● REC</div>
            <div className="video-time">00:19:11</div>
          </div>
        </Window>

        {/* NOTES WINDOW */}

        <Window
          title="NOTES.txt"
          className="window-notes"
          accent="yellow"
        >
          <div className="scribbled-note">
            <div>things to remember:</div>
            <br />
            <span>☑ birthday girl</span>
            <span>☑ survived another year</span>
            <span>☑ somehow still tolerating us</span>
            <span>☐ become less chaotic</span>
            <span>☐ impossible</span>

            <div className="note-arrow">↳ probably don't open the archive</div>
          </div>
        </Window>

        {/* FILE WINDOW */}

        <Window
          title="C:\\BIRTHDAY\\FILES"
          className="window-files"
          accent="blue"
        >
          <div className="folder-grid">
            {MINI_FILES.map((file) => (
              <FakeFolder
                key={file.name}
                file={file}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveFile(file)
                }}
              />
            ))}
          </div>

          <div className="folder-status">
            {MINI_FILES.length} OBJECTS // 0 CORRUPTED
          </div>
        </Window>

        {/* RECORDING WINDOW */}

        <Window
          title="VOICE_MESSAGE.wav"
          className="window-recording"
          accent="red"
        >
          <div className="recording">
            <div className="record-icon">🎙</div>

            <div className="record-info">
              <div className="record-name">FROM: ONE OF THE IDIOTS</div>

              <div className="waveform">
                {Array.from({ length: 28 }).map((_, index) => (
                  <i
                    key={index}
                    className={voicePlaying ? 'wave-active' : ''}
                    style={{
                      height: `${10 + ((index * 17) % 25)}px`,
                      animationDelay: `${index * 0.04}s`,
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                className="voice-button"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleVoice()
                }}
              >
                {voicePlaying ? '❚❚ STOP VOICE' : '▶ PLAY VOICE'}
              </button>
            </div>
          </div>

          <audio
            ref={voiceRef}
            src={MEDIA.voice}
            onEnded={() => setVoicePlaying(false)}
          />
        </Window>

        {/* PASSWORD PANEL */}

        <div
          className="password-panel"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="password-top">
            <span>SECURITY_GATE</span>
            <span>LEVEL 01</span>
          </div>

          <div className="password-title">
            <GlitchText>ENTER PASSWORD</GlitchText>
          </div>

          <form onSubmit={submitPassword}>
            <div className="input-wrap">
              <span>&gt;_</span>

              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="PASSWORD..."
                type="password"
                autoComplete="off"
              />

              <span className="cursor-block" />
            </div>

            <button type="submit" className="enter-button">
              ENTER ARCHIVE <span>↗</span>
            </button>
          </form>

          {error && <div className="access-error">{error}</div>}

          <div className="password-footer">
            <span>AUTH_REQUIRED</span>
            <span>ENCRYPTION: VHS-64</span>
          </div>
        </div>

        {/* BOTTOM BAR */}

        <div className="bottom-status">
          <span>♥ MADE WITH QUESTIONABLE DECISIONS</span>
          <span>RAM 64KB</span>
          <span>TRACKING: OFF</span>
        </div>

        {/* FILE POPUP */}

        {activeFile && (
          <div
            className="file-popup-backdrop"
            onClick={(event) => {
              event.stopPropagation()
              setActiveFile(null)
            }}
          >
            <div
              className="file-popup"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="popup-header">
                <span>{activeFile.name}.TXT</span>

                <button
                  type="button"
                  onClick={() => setActiveFile(null)}
                >
                  ×
                </button>
              </div>

              <div className="popup-body">
                <div className="popup-icon">{activeFile.icon}</div>

                <GlitchText>{activeFile.name}</GlitchText>

                <p>{activeFile.message}</p>

                <div className="popup-bar">
                  FILE OPENED // SECRET STATUS
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECRET CLICK COUNTER */}

        {secretClicks > 12 && (
          <div className="secret-message">
            YOU FOUND NOTHING.
            <br />
            <span>OR DID YOU?</span>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500;600&family=Press+Start+2P&display=swap');

          :root {
            --lavender: #a8a0c8;
            --dust: #7d88a8;
            --blue: #4de7ff;
            --green: #b7ff4a;
            --yellow: #ffe66d;
            --purple: #b79cff;
            --red: #ff6b6b;
            --ink: #111725;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            background: #111725;
          }

          body {
            overflow-x: hidden;
          }

          button,
          input {
            font: inherit;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }

          .crt-desktop {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            color: #edf5ff;
            background:
              radial-gradient(circle at 18% 18%, rgba(112, 127, 190, 0.55), transparent 30%),
              radial-gradient(circle at 80% 70%, rgba(86, 170, 177, 0.22), transparent 28%),
              linear-gradient(135deg, #667296 0%, #817da6 38%, #596f8d 72%, #4e607c 100%);
            font-family: 'IBM Plex Mono', monospace;
            isolation: isolate;
          }

          .crt-desktop::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 100;
            pointer-events: none;
            background:
              repeating-linear-gradient(
                to bottom,
                rgba(255,255,255,0.035) 0px,
                rgba(255,255,255,0.035) 1px,
                transparent 2px,
                transparent 4px
              );
            mix-blend-mode: overlay;
          }

          .crt-desktop::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 101;
            pointer-events: none;
            box-shadow:
              inset 0 0 100px rgba(17, 23, 37, 0.45),
              inset 0 0 25px rgba(0, 0, 0, 0.35);
          }

          .screen-glow {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
              radial-gradient(
                circle at 50% 50%,
                rgba(190, 225, 255, 0.16),
                transparent 55%
              );
            animation: screenPulse 5s ease-in-out infinite;
          }

          .scanlines,
          .vhs-noise {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 99;
          }

          .scanlines {
            opacity: 0.13;
            background: repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(20, 30, 50, 0.5) 4px
            );
          }

          .vhs-noise {
            opacity: 0.07;
            background-image:
              repeating-radial-gradient(
                circle at 20% 30%,
                rgba(255,255,255,.5) 0 1px,
                transparent 1px 3px
              );
            animation: noiseMove .12s steps(2) infinite;
          }

          .tracking-line {
            position: absolute;
            left: 0;
            right: 0;
            top: -10%;
            height: 3px;
            background: rgba(255,255,255,.3);
            box-shadow:
              0 0 8px rgba(255,255,255,.8),
              0 0 20px rgba(77,231,255,.6);
            z-index: 102;
            pointer-events: none;
            animation: tracking 7s linear infinite;
          }

          .cursor-glow {
            position: absolute;
            width: 180px;
            height: 180px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(77,231,255,.08),
              transparent 70%
            );
            pointer-events: none;
            z-index: 1;
            transition: left .15s ease-out, top .15s ease-out;
          }

          .top-status,
          .bottom-status {
            position: absolute;
            left: 18px;
            right: 18px;
            z-index: 20;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            font-size: 8px;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: rgba(240,248,255,.72);
          }

          .top-status {
            top: 14px;
          }

          .bottom-status {
            bottom: 10px;
            color: rgba(230,242,255,.55);
          }

          .status-middle {
            color: var(--green);
          }

          .status-middle i,
          .blinking-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin: 0 5px;
            border-radius: 50%;
            background: var(--green);
            box-shadow: 0 0 8px var(--green);
            animation: blink .9s infinite;
          }

          .intro-copy {
            position: absolute;
            left: 4%;
            top: 12%;
            width: min(400px, 42vw);
            z-index: 8;
            transform: rotate(-1deg);
          }

          .tiny-label {
            font-size: 8px;
            letter-spacing: .2em;
            color: var(--green);
            margin-bottom: 10px;
          }

          .intro-copy h1 {
            margin: 0 0 13px;
            font-family: 'Press Start 2P', monospace;
            font-size: clamp(22px, 3vw, 42px);
            line-height: 1.3;
            color: #f6f4e9;
            text-shadow:
              3px 0 var(--red),
              -3px 0 var(--blue),
              0 0 18px rgba(255,255,255,.3);
          }

          .intro-copy p {
            margin: 0;
            font-size: 11px;
            line-height: 1.9;
            color: #e5e9f3;
            text-shadow: 1px 1px #49516c;
          }

          .intro-copy strong {
            color: var(--yellow);
          }

          .intro-code {
            display: inline-block;
            margin-top: 14px;
            padding: 5px 8px;
            background: rgba(17,23,37,.48);
            border: 1px solid rgba(183,156,255,.5);
            color: var(--purple);
            font-size: 7px;
            letter-spacing: .15em;
          }

          .glitch {
            position: relative;
            display: inline-block;
            animation: glitchText 4s infinite;
          }

          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .glitch::before {
            color: var(--blue);
            transform: translate(-2px, 0);
            clip-path: inset(0 0 65% 0);
            animation: glitchA 2.8s infinite steps(2);
          }

          .glitch::after {
            color: var(--red);
            transform: translate(2px, 0);
            clip-path: inset(65% 0 0 0);
            animation: glitchB 2.1s infinite steps(2);
          }

          .retro-window {
            position: absolute;
            z-index: 10;
            border: 2px solid rgba(20, 28, 46, .9);
            background: rgba(31, 42, 65, .88);
            box-shadow:
              5px 6px 0 rgba(31, 40, 62, .45),
              0 0 25px rgba(15,20,40,.2);
            backdrop-filter: blur(4px);
            transition:
              transform .25s ease,
              filter .25s ease;
          }

          .retro-window:hover {
            transform: translateY(-3px) rotate(.2deg);
            filter: brightness(1.1);
          }

          .window-bar {
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 6px 0 9px;
            background:
              linear-gradient(
                90deg,
                rgba(77,231,255,.32),
                rgba(183,156,255,.3),
                rgba(255,230,109,.24)
              );
            border-bottom: 1px solid rgba(255,255,255,.22);
            color: white;
            font-size: 8px;
            letter-spacing: .1em;
          }

          .window-title {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .window-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 7px var(--accent);
          }

          .window-buttons {
            display: flex;
            gap: 3px;
          }

          .window-buttons button {
            width: 19px;
            height: 17px;
            border: 1px solid rgba(255,255,255,.35);
            color: #fff;
            background: rgba(15,20,35,.4);
            font-size: 9px;
            line-height: 1;
          }

          .window-buttons button:hover {
            background: var(--accent);
            color: #101522;
          }

          .window-content {
            padding: 9px;
          }

          .window-photo {
            left: 42%;
            top: 8%;
            width: 250px;
            transform: rotate(1.5deg);
          }

          .window-music {
            right: 3%;
            top: 8%;
            width: 285px;
            transform: rotate(-1deg);
          }

          .window-video {
            right: 5%;
            top: 39%;
            width: 300px;
            transform: rotate(.7deg);
          }

          .window-notes {
            left: 4%;
            bottom: 10%;
            width: 260px;
            transform: rotate(-2deg);
          }

          .window-files {
            left: 29%;
            bottom: 6%;
            width: 340px;
            transform: rotate(.8deg);
          }

          .window-recording {
            right: 31%;
            bottom: 5%;
            width: 350px;
            transform: rotate(-.7deg);
          }

          .photo-viewer {
            position: relative;
            height: 175px;
            overflow: hidden;
            background:
              linear-gradient(135deg, #4b5573, #9387b4);
            border: 2px solid #1c2437;
          }

          .photo-viewer img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            inset: 0;
            z-index: 2;
          }

          .photo-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 9px;
            color: rgba(255,255,255,.7);
            font-family: 'Press Start 2P', monospace;
            font-size: 9px;
            text-align: center;
            background:
              repeating-linear-gradient(
                0deg,
                transparent 0 3px,
                rgba(255,255,255,.04) 4px
              );
          }

          .photo-placeholder small {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 7px;
            color: var(--yellow);
          }

          .photo-counter {
            position: absolute;
            z-index: 3;
            right: 5px;
            bottom: 4px;
            padding: 3px 5px;
            background: rgba(10,15,25,.7);
            color: var(--green);
            font-size: 7px;
          }

          .photo-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 7px;
            color: var(--purple);
            font-size: 7px;
          }

          .photo-controls button {
            border: 1px solid rgba(183,156,255,.6);
            background: #242d45;
            color: #fff;
            padding: 4px 8px;
            cursor: pointer;
          }

          .photo-controls button:hover {
            background: var(--purple);
            color: #111725;
          }

          .cd-player {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .cd {
            position: relative;
            flex: 0 0 auto;
            width: 95px;
            height: 95px;
            border-radius: 50%;
            background:
              repeating-conic-gradient(
                from 0deg,
                #d9e3ec 0deg 8deg,
                #8491a7 10deg 14deg,
                #f8fafc 17deg 20deg
              );
            box-shadow:
              0 0 15px rgba(255,230,109,.2),
              inset 0 0 15px rgba(0,0,0,.35);
          }

          .cd::after {
            content: '';
            position: absolute;
            inset: 25px;
            border-radius: 50%;
            background: #626d83;
            box-shadow: inset 0 0 0 5px #aeb9c9;
          }

          .cd-hole {
            position: absolute;
            z-index: 2;
            left: 50%;
            top: 50%;
            width: 7px;
            height: 7px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: #111725;
          }

          .cd span {
            position: absolute;
            z-index: 3;
            top: 42px;
            left: 30px;
            color: #111725;
            font-size: 7px;
            font-weight: bold;
          }

          .cd-playing {
            animation: cdSpin 2.5s linear infinite;
          }

          .music-info {
            min-width: 0;
          }

          .music-title {
            color: var(--yellow);
            font-size: 9px;
            margin-bottom: 5px;
          }

          .music-track {
            color: rgba(255,255,255,.55);
            font-size: 7px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .equalizer {
            height: 34px;
            display: flex;
            align-items: center;
            gap: 3px;
            margin: 7px 0;
          }

          .equalizer i {
            display: block;
            width: 3px;
            height: 5px;
            background: var(--yellow);
          }

          .equalizer .eq-active {
            animation: equalizer .4s ease-in-out infinite alternate;
          }

          .play-button,
          .voice-button {
            border: 1px solid var(--yellow);
            background: rgba(255,230,109,.08);
            color: var(--yellow);
            padding: 5px 8px;
            font-size: 7px;
            cursor: pointer;
          }

          .play-button:hover,
          .voice-button:hover {
            background: var(--yellow);
            color: #151b2b;
          }

          .video-box {
            position: relative;
            height: 150px;
            overflow: hidden;
            border: 2px solid #141c2c;
            background: #202a3d;
          }

          .video-box video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .video-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background:
              repeating-linear-gradient(
                0deg,
                #263149 0 2px,
                #20283c 2px 4px
              );
            color: var(--green);
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
          }

          .video-placeholder small {
            margin-top: 12px;
            font-family: 'IBM Plex Mono';
            font-size: 7px;
          }

          .video-rec,
          .video-time {
            position: absolute;
            z-index: 2;
            top: 6px;
            font-size: 7px;
            color: #fff;
            text-shadow: 1px 1px #000;
          }

          .video-rec {
            left: 7px;
            color: var(--red);
          }

          .video-time {
            right: 7px;
          }

          .scribbled-note {
            min-height: 125px;
            padding: 9px;
            color: #1c2538;
            background:
              repeating-linear-gradient(
                0deg,
                #ddd6a6 0px,
                #ddd6a6 21px,
                #c9c08e 22px
              );
            font-family: 'DM Mono', monospace;
            font-size: 10px;
            line-height: 21px;
            transform: rotate(.5deg);
          }

          .scribbled-note span {
            display: block;
          }

          .scribbled-note span:nth-child(3) {
            color: #9a3d3d;
          }

          .scribbled-note span:nth-child(4) {
            color: #306b61;
          }

          .note-arrow {
            margin-top: 8px;
            color: #5a557f;
            font-size: 8px;
          }

          .folder-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
          }

          .fake-folder {
            position: relative;
            border: 0;
            background: transparent;
            color: white;
            cursor: pointer;
            padding: 2px;
            min-width: 0;
          }

          .fake-folder:hover {
            transform: translateY(-4px);
          }

          .folder-icon {
            position: relative;
            width: 42px;
            height: 32px;
            margin: 0 auto 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #d4b65f;
            border: 2px solid #172033;
            box-shadow: 3px 3px 0 rgba(17,23,37,.45);
          }

          .folder-icon::before {
            content: '';
            position: absolute;
            left: 3px;
            top: -7px;
            width: 17px;
            height: 8px;
            background: inherit;
            border: 2px solid #172033;
            border-bottom: 0;
          }

          .folder-icon span {
            position: relative;
            z-index: 2;
            font-size: 15px;
          }

          .folder-name {
            font-size: 7px;
            line-height: 1.2;
            overflow-wrap: anywhere;
            color: #f4f6ff;
          }

          .folder-yellow .folder-icon {
            background: #d9ba58;
          }

          .folder-green .folder-icon {
            background: #7da75c;
          }

          .folder-blue .folder-icon {
            background: #668eb1;
          }

          .folder-purple .folder-icon {
            background: #8e78aa;
          }

          .folder-red .folder-icon {
            background: #b36a6a;
          }

          .folder-status {
            margin-top: 10px;
            border-top: 1px dashed rgba(255,255,255,.2);
            padding-top: 5px;
            font-size: 6px;
            color: var(--green);
          }

          .recording {
            display: flex;
            gap: 13px;
            align-items: center;
          }

          .record-icon {
            width: 55px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--red);
            background: rgba(255,107,107,.08);
            font-size: 23px;
          }

          .record-info {
            flex: 1;
          }

          .record-name {
            color: var(--red);
            font-size: 7px;
            margin-bottom: 7px;
          }

          .waveform {
            display: flex;
            align-items: center;
            gap: 2px;
            height: 30px;
          }

          .waveform i {
            display: block;
            width: 3px;
            background: #e9edf6;
            opacity: .6;
          }

          .waveform .wave-active {
            background: var(--red);
            animation: wave .4s ease-in-out infinite alternate;
          }

          .voice-button {
            margin-top: 6px;
            border-color: var(--red);
            color: var(--red);
          }

          .voice-button:hover {
            background: var(--red);
            color: white;
          }

          .password-panel {
            position: absolute;
            z-index: 30;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(390px, 84vw);
            padding: 15px;
            background: rgba(18,25,42,.92);
            border: 2px solid #1b263d;
            box-shadow:
              8px 8px 0 rgba(22,29,47,.35),
              0 0 30px rgba(77,231,255,.12);
          }

          .password-panel::before {
            content: '';
            position: absolute;
            inset: 4px;
            border: 1px solid rgba(77,231,255,.2);
            pointer-events: none;
          }

          .password-top,
          .password-footer {
            display: flex;
            justify-content: space-between;
            font-size: 7px;
            letter-spacing: .14em;
            color: rgba(255,255,255,.5);
          }

          .password-title {
            margin: 18px 0 13px;
            font-family: 'Press Start 2P', monospace;
            font-size: 14px;
            color: white;
          }

          .input-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            height: 43px;
            padding: 0 10px;
            border: 1px solid rgba(77,231,255,.5);
            background: #0d1321;
            color: var(--green);
          }

          .input-wrap input {
            width: 100%;
            min-width: 0;
            border: 0;
            outline: 0;
            background: transparent;
            color: white;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
          }

          .input-wrap input::placeholder {
            color: rgba(255,255,255,.28);
          }

          .cursor-block {
            width: 7px;
            height: 15px;
            background: var(--green);
            animation: blink .8s steps(1) infinite;
          }

          .enter-button {
            width: 100%;
            margin-top: 9px;
            padding: 12px;
            border: 1px solid var(--blue);
            background:
              linear-gradient(
                90deg,
                rgba(77,231,255,.16),
                rgba(183,156,255,.15)
              );
            color: white;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            cursor: pointer;
            transition: .2s;
          }

          .enter-button:hover {
            background: var(--blue);
            color: #101725;
            box-shadow: 0 0 18px rgba(77,231,255,.5);
          }

          .enter-button span {
            color: var(--yellow);
          }

          .access-error {
            margin-top: 8px;
            padding: 7px;
            border: 1px solid var(--red);
            color: var(--red);
            background: rgba(255,107,107,.08);
            font-size: 8px;
            text-align: center;
            animation: errorFlash .25s steps(2) 3;
          }

          .password-footer {
            margin-top: 12px;
          }

          .floating-bit {
            position: absolute;
            z-index: 3;
            font-family: 'Press Start 2P', monospace;
            font-size: 6px;
            opacity: .65;
            pointer-events: none;
            animation:
              floatBit 4s ease-in-out infinite,
              flicker 3s steps(2) infinite;
          }

          .bit-blue {
            color: var(--blue);
            text-shadow: 0 0 8px var(--blue);
          }

          .bit-green {
            color: var(--green);
            text-shadow: 0 0 8px var(--green);
          }

          .bit-yellow {
            color: var(--yellow);
            text-shadow: 0 0 8px var(--yellow);
          }

          .bit-purple {
            color: var(--purple);
            text-shadow: 0 0 8px var(--purple);
          }

          .bit-red {
            color: var(--red);
            text-shadow: 0 0 8px var(--red);
          }

          .file-popup-backdrop {
            position: fixed;
            z-index: 300;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(7,10,18,.6);
            backdrop-filter: blur(5px);
          }

          .file-popup {
            width: min(400px, 90vw);
            background: #202a40;
            border: 2px solid #111a2c;
            box-shadow: 10px 10px 0 rgba(0,0,0,.35);
            animation: popupIn .25s ease-out;
          }

          .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 10px;
            background: linear-gradient(90deg, #586d9c, #756a9e);
            color: white;
            font-size: 8px;
          }

          .popup-header button {
            border: 0;
            background: transparent;
            color: white;
            font-size: 16px;
            cursor: pointer;
          }

          .popup-body {
            padding: 28px;
            text-align: center;
          }

          .popup-icon {
            font-size: 45px;
            margin-bottom: 15px;
          }

          .popup-body .glitch {
            font-family: 'Press Start 2P', monospace;
            color: var(--yellow);
            font-size: 15px;
          }

          .popup-body p {
            margin: 15px 0;
            color: #dce4f1;
            font-size: 11px;
          }

          .popup-bar {
            padding: 7px;
            border: 1px dashed var(--green);
            color: var(--green);
            font-size: 7px;
          }

          .secret-message {
            position: fixed;
            z-index: 400;
            right: 20px;
            top: 50%;
            padding: 10px;
            color: var(--red);
            background: #111725;
            border: 1px solid var(--red);
            font-family: 'Press Start 2P', monospace;
            font-size: 7px;
            animation: secretAppear .4s steps(2);
          }

          .secret-message span {
            color: var(--blue);
          }

          /*
            LOADING SCREEN
          */

          .loading-screen {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(
                circle at 50% 45%,
                #657ba0,
                #313b58 48%,
                #151b2c 100%
              );
            color: white;
            font-family: 'IBM Plex Mono', monospace;
          }

          .loading-screen::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              repeating-linear-gradient(
                to bottom,
                rgba(255,255,255,.04) 0 1px,
                transparent 2px 5px
              );
            pointer-events: none;
          }

          .loading-noise {
            position: absolute;
            inset: 0;
            background:
              repeating-linear-gradient(
                90deg,
                transparent 0 5px,
                rgba(77,231,255,.03) 6px,
                transparent 8px
              );
            animation: noiseMove .15s steps(2) infinite;
          }

          .loading-shell {
            position: relative;
            z-index: 5;
            width: min(700px, 90vw);
            text-align: center;
          }

          .loading-kicker {
            font-size: 8px;
            letter-spacing: .35em;
            color: var(--green);
            margin-bottom: 15px;
          }

          .loading-title {
            font-family: 'Press Start 2P', monospace;
            font-size: clamp(17px, 3vw, 30px);
            line-height: 1.6;
            text-shadow:
              3px 0 var(--red),
              -3px 0 var(--blue);
          }

          .boot-photo {
            position: relative;
            width: min(330px, 72vw);
            height: 220px;
            margin: 25px auto;
            border: 4px solid #141b2b;
            background: #2a354e;
            box-shadow:
              10px 10px 0 rgba(0,0,0,.25),
              0 0 35px rgba(77,231,255,.15);
            overflow: hidden;
          }

          .boot-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: bootPhoto .55s steps(2);
          }

          .boot-photo::after {
            content: 'MEMORY RECOVERED';
            position: absolute;
            left: 8px;
            bottom: 8px;
            padding: 4px 6px;
            background: rgba(10,15,25,.75);
            color: var(--green);
            font-size: 7px;
          }

          .boot-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,.45);
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
          }

          .boot-terminal {
            margin: 15px auto;
            max-width: 500px;
            padding: 10px;
            border: 1px solid rgba(77,231,255,.35);
            background: rgba(8,13,24,.65);
            text-align: left;
            font-size: 8px;
            line-height: 1.8;
            color: #dfe8f4;
          }

          .terminal-green {
            color: var(--green);
          }

          .terminal-yellow {
            color: var(--yellow);
          }

          .progress-shell {
            height: 18px;
            border: 2px solid #111827;
            padding: 3px;
            background: #1a2337;
          }

          .progress-bar {
            height: 100%;
            background:
              repeating-linear-gradient(
                90deg,
                var(--blue) 0 12px,
                var(--purple) 12px 24px,
                var(--green) 24px 36px
              );
            box-shadow:
              0 0 10px rgba(77,231,255,.55);
            transition: width .15s linear;
          }

          .progress-number {
            margin-top: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            color: var(--yellow);
          }

          .loading-corners {
            position: fixed;
            inset: 15px;
            pointer-events: none;
            border: 1px solid rgba(255,255,255,.08);
          }

          .loading-corners::before,
          .loading-corners::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 40px;
            border-color: var(--blue);
            border-style: solid;
          }

          .loading-corners::before {
            left: -1px;
            top: -1px;
            border-width: 3px 0 0 3px;
          }

          .loading-corners::after {
            right: -1px;
            bottom: -1px;
            border-width: 0 3px 3px 0;
          }

          @keyframes glitchText {
            0%, 87%, 100% {
              transform: translate(0);
            }
            88% {
              transform: translate(-3px, 1px);
            }
            89% {
              transform: translate(4px, -1px);
            }
            90% {
              transform: translate(0);
            }
          }

          @keyframes glitchA {
            0%, 82%, 100% {
              transform: translate(-2px);
            }
            84% {
              transform: translate(-8px, 2px);
            }
            86% {
              transform: translate(5px, -2px);
            }
          }

          @keyframes glitchB {
            0%, 72%, 100% {
              transform: translate(2px);
            }
            74% {
              transform: translate(7px, -2px);
            }
            76% {
              transform: translate(-5px, 2px);
            }
          }

          @keyframes blink {
            0%, 45% { opacity: 1; }
            46%, 100% { opacity: 0; }
          }

          @keyframes screenPulse {
            0%, 100% { opacity: .7; }
            50% { opacity: 1; }
          }

          @keyframes noiseMove {
            0% { transform: translate(0); }
            25% { transform: translate(-2%, 1%); }
            50% { transform: translate(1%, -2%); }
            75% { transform: translate(2%, 1%); }
            100% { transform: translate(0); }
          }

          @keyframes tracking {
            0% { top: -5%; opacity: 0; }
            4% { opacity: .8; }
            12% { top: 105%; opacity: 0; }
            100% { top: 105%; opacity: 0; }
          }

          @keyframes floatBit {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-13px) rotate(3deg);
            }
          }

          @keyframes flicker {
            0%, 90%, 100% { opacity: .65; }
            91% { opacity: .15; }
            92% { opacity: .8; }
            94% { opacity: .25; }
          }

          @keyframes cdSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes equalizer {
            from { transform: scaleY(.4); }
            to { transform: scaleY(1.7); }
          }

          @keyframes wave {
            from { transform: scaleY(.35); }
            to { transform: scaleY(1.1); }
          }

          @keyframes errorFlash {
            from { transform: translateX(-4px); }
            to { transform: translateX(4px); }
          }

          @keyframes popupIn {
            from {
              opacity: 0;
              transform: scale(.9) rotate(-2deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }

          @keyframes secretAppear {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bootPhoto {
            0% {
              opacity: 0;
              transform: scale(1.15);
              filter: saturate(2) hue-rotate(30deg);
            }
            50% {
              opacity: .4;
              transform: scale(.98);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: saturate(1);
            }
          }

          @media (max-width: 900px) {
            .crt-desktop {
              min-height: 1200px;
            }

            .top-status .status-middle,
            .bottom-status span:nth-child(2),
            .bottom-status span:nth-child(3) {
              display: none;
            }

            .intro-copy {
              left: 5%;
              top: 9%;
              width: 55%;
            }

            .window-photo {
              left: 5%;
              top: 31%;
            }

            .window-music {
              right: 5%;
              top: 31%;
            }

            .window-video {
              right: 5%;
              top: 53%;
            }

            .window-notes {
              left: 5%;
              bottom: 22%;
            }

            .window-files {
              left: 5%;
              bottom: 5%;
              width: 46%;
            }

            .window-recording {
              right: 5%;
              bottom: 5%;
              width: 46%;
            }

            .password-panel {
              top: 20%;
            }
          }

          @media (max-width: 620px) {
            .crt-desktop {
              min-height: 1700px;
            }

            .top-status {
              font-size: 6px;
            }

            .intro-copy {
              width: 90%;
              top: 7%;
            }

            .intro-copy h1 {
              font-size: 20px;
            }

            .window-photo,
            .window-music,
            .window-video,
            .window-notes,
            .window-files,
            .window-recording {
              left: 5%;
              right: auto;
              width: 90%;
            }

            .window-photo {
              top: 26%;
            }

            .window-music {
              top: 43%;
            }

            .window-video {
              top: 59%;
            }

            .window-notes {
              top: 74%;
              bottom: auto;
            }

            .window-files {
              top: 86%;
              bottom: auto;
            }

            .window-recording {
              top: 101%;
              bottom: auto;
            }

            .password-panel {
              top: 17%;
            }

            .floating-bit {
              display: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
            }
          }
        `}</style>
      </main>
    )
  }

  /*
    ============================================================
    GRAPHICAL LOADING SCREEN
    ============================================================
  */

  return (
    <main className="loading-screen">
      <div className="loading-noise" />
      <div className="scanlines" />
      <div className="loading-corners" />

      <div className="loading-shell">
        <div className="loading-kicker">
          // ESTABLISHING CONNECTION //
        </div>

        <div className="loading-title">
          <GlitchText>OPENING CLAR'S ARCHIVE</GlitchText>
        </div>

        <div className="boot-photo">
          {MEDIA.photos[bootPhoto] ? (
            <img
              key={bootPhoto}
              src={MEDIA.photos[bootPhoto]}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="boot-placeholder">
              RECOVERING PHOTO...
            </div>
          )}
        </div>

        <div className="boot-terminal">
          <div>
            <span className="terminal-green">&gt;</span> PASSWORD ACCEPTED
          </div>
          <div>
            <span className="terminal-green">&gt;</span> DECRYPTING MEMORY FILES...
          </div>
          <div>
            <span className="terminal-yellow">&gt;</span> RECOVERING PHOTO_
            {String(bootPhoto + 1).padStart(2, '0')}
          </div>
          <div>
            <span className="terminal-green">&gt;</span> LOADING QUESTIONABLE
            DECISIONS...
          </div>
        </div>

        <div className="progress-shell">
          <div
            className="progress-bar"
            style={{ width: `${bootProgress}%` }}
          />
        </div>

        <div className="progress-number">
          {String(bootProgress).padStart(3, '0')}%
        </div>
      </div>
    </main>
  )
}
