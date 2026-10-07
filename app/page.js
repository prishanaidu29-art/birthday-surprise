'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VT323, Silkscreen, Orbitron } from 'next/font/google'

export const dynamic = 'force-dynamic'

const vt = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt',
})

const silk = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-silk',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-orbitron',
})

const PASSWORD = 'royal cliff'

const PHOTO_SLOTS = [
  '/photos/clar-01.jpg',
  '/photos/clar-02.jpg',
  '/photos/clar-03.jpg',
  '/photos/clar-04.jpg',
  '/photos/clar-05.jpg',
  '/photos/clar-06.jpg',
  '/photos/clar-07.jpg',
  '/photos/clar-08.jpg',
]

const LOADING_PHOTOS = [
  '/photos/clar-01.jpg',
  '/photos/clar-02.jpg',
  '/photos/clar-03.jpg',
  '/photos/clar-04.jpg',
  '/photos/clar-05.jpg',
  '/photos/clar-06.jpg',
  '/photos/clar-07.jpg',
  '/photos/clar-08.jpg',
]

function FakeImage({ src, alt, className = '', label = 'PHOTO' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`fake-image ${className}`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="image-placeholder">
          <div className="placeholder-cross">+</div>
          <span>{label}</span>
          <small>INSERT MEDIA</small>
        </div>
      )}
    </div>
  )
}

function Window({
  title,
  children,
  className = '',
  style = {},
  zIndex = 10,
  onFocus,
  accent = 'purple',
}) {
  return (
    <section
      className={`retro-window ${className}`}
      style={{
        ...style,
        zIndex,
        '--window-accent':
          accent === 'cyan'
            ? '#5cf2ff'
            : accent === 'pink'
              ? '#ff4fd8'
              : accent === 'green'
                ? '#d7ff5c'
                : '#9d6cff',
      }}
      onPointerDown={onFocus}
    >
      <div className="window-titlebar">
        <div className="window-title-left">
          <span className="window-dot" />
          <span className="window-title">{title}</span>
        </div>

        <div className="window-buttons">
          <button type="button">_</button>
          <button type="button">□</button>
          <button type="button">×</button>
        </div>
      </div>

      <div className="window-content">{children}</div>
    </section>
  )
}

export default function Home() {
  const router = useRouter()

  const [phase, setPhase] = useState('login')
  const [password, setPassword] = useState('')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [hint, setHint] = useState('')
  const [hintOpen, setHintOpen] = useState(false)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingPhoto, setLoadingPhoto] = useState(0)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [recordingPlaying, setRecordingPlaying] = useState(false)
  const [cdSpinning, setCdSpinning] = useState(true)

  const [focusedWindow, setFocusedWindow] = useState('notes')

  const audioRef = useRef(null)
  const recordingRef = useRef(null)

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return

    setLoadingProgress(0)
    setLoadingPhoto(0)

    let progress = 0

    const progressTimer = setInterval(() => {
      progress += Math.random() * 4 + 2

      if (progress >= 100) {
        progress = 100
        clearInterval(progressTimer)
      }

      setLoadingProgress(Math.floor(progress))
    }, 120)

    const photoTimer = setInterval(() => {
      setLoadingPhoto((current) => {
        if (current >= LOADING_PHOTOS.length - 1) {
          return 0
        }

        return current + 1
      })
    }, 1050)

    const finishTimer = setTimeout(() => {
      sessionStorage.setItem('birthday_authenticated', 'true')
      router.push('/birthday')
    }, 6200)

    return () => {
      clearInterval(progressTimer)
      clearInterval(photoTimer)
      clearTimeout(finishTimer)
    }
  }, [phase, router])

  const focus = (name) => {
    setFocusedWindow(name)
  }

  const submitPassword = async (event) => {
    event.preventDefault()

    if (password.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem('birthday_authenticated', 'true')

      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setMusicPlaying(true)
        } catch {
          setMusicPlaying(false)
        }
      }

      setPhase('loading')
      return
    }

    const newCount = wrongAttempts + 1
    setWrongAttempts(newCount)

    setPassword('')

    if (newCount <= 3) {
      setHint(
        'hint it’s a nickname I gave you after learning a funny meaning of your name'
      )
      setHintOpen(true)
    } else if (newCount === 5) {
      setHint('it has something to do with a cliff')
      setHintOpen(true)
    }
  }

  const toggleMusic = async () => {
    if (!audioRef.current) return

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setMusicPlaying(true)
      } catch {
        setMusicPlaying(false)
      }
    }
  }

  const toggleRecording = async () => {
    if (!recordingRef.current) return

    if (recordingPlaying) {
      recordingRef.current.pause()
      setRecordingPlaying(false)
    } else {
      try {
        await recordingRef.current.play()
        setRecordingPlaying(true)
      } catch {
        setRecordingPlaying(false)
      }
    }
  }

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  if (phase === 'loading') {
    return (
      <main
        className={`${vt.variable} ${silk.variable} ${orbitron.variable} loading-screen`}
      >
        <div className="loading-stars" />

        <div className="loading-scanlines" />

        <div className="loading-noise" />

        <div className="loading-corner top-left">
          SYS.ARCHIVE // 22
        </div>

        <div className="loading-corner top-right">
          ACCESS // GRANTED
        </div>

        <div className="loading-corner bottom-left">
          PLEASE WAIT...
        </div>

        <div className="loading-corner bottom-right">
          199X—2026
        </div>

        <div className="loading-center">
          <div className="loading-eyebrow">
            <span>◈</span>
            PERSONAL ARCHIVE SYSTEM
            <span>◈</span>
          </div>

          <div className="loading-main-title">
            <span className="glitch-word" data-text="LOADING">
              LOADING
            </span>
            <span className="loading-slash">/</span>
            <span>CLAR</span>
          </div>

          <div className="loading-subtitle">
            RECONSTRUCTING 22 YEARS OF DATA
          </div>

          <div className="loading-photo-stage">
            <div className="photo-stage-corner tl">REC ●</div>
            <div className="photo-stage-corner tr">ARCHIVE_0{loadingPhoto + 1}</div>
            <div className="photo-stage-corner bl">NO SIGNAL? LOL</div>
            <div className="photo-stage-corner br">JPG / MEMORY</div>

            <div className="loading-photo-glow" />

            <FakeImage
              src={LOADING_PHOTOS[loadingPhoto]}
              alt={`Archive memory ${loadingPhoto + 1}`}
              className="loading-photo"
              label={`MEMORY 0${loadingPhoto + 1}`}
            />

            <div className="photo-counter">
              <span>FRAME</span>
              <strong>
                {String(loadingPhoto + 1).padStart(2, '0')}
              </strong>
              <span>/ {String(LOADING_PHOTOS.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="loading-progress-area">
            <div className="loading-progress-labels">
              <span>PLEASE WAIT</span>
              <span>{loadingProgress}%</span>
            </div>

            <div className="loading-bar">
              <div
                className="loading-bar-fill"
                style={{ width: `${loadingProgress}%` }}
              />

              <div className="loading-bar-scan" />
            </div>

            <div className="loading-status">
              <span>LOADING MEMORIES...</span>
              <span>
                {loadingProgress < 35
                  ? 'MOUNTING ARCHIVE'
                  : loadingProgress < 70
                    ? 'INDEXING FILES'
                    : loadingProgress < 95
                      ? 'OPENING SECRET STUFF'
                      : 'WELCOME'}
              </span>
            </div>
          </div>
        </div>

        <div className="loading-floating-symbol symbol-one">✦</div>
        <div className="loading-floating-symbol symbol-two">+</div>
        <div className="loading-floating-symbol symbol-three">◆</div>
        <div className="loading-floating-symbol symbol-four">♡</div>

        <div className="loading-ring ring-one" />
        <div className="loading-ring ring-two" />
      </main>
    )
  }

  return (
    <main
      className={`${vt.variable} ${silk.variable} ${orbitron.variable} computer-page`}
    >
      <audio
        ref={audioRef}
        src="/audio/birthday-song.mp3"
        loop
        onEnded={() => setMusicPlaying(false)}
      />

      <audio
        ref={recordingRef}
        src="/audio/friend-message.mp3"
        onEnded={() => setRecordingPlaying(false)}
      />

      <div className="background-grid" />
      <div className="background-glow glow-a" />
      <div className="background-glow glow-b" />

      <div className="floating-particles">
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>

      {/* ACTUAL COMPUTER FRAME */}

      <div className="computer-shell">
        <div className="computer-top">
          <div className="computer-brand">
            <span className="brand-mark">◈</span>
            <span>MEMORY//SYSTEM</span>
          </div>

          <div className="computer-model">
            MODEL: CLAR-22
          </div>

          <div className="computer-status">
            <span className="status-light" />
            ONLINE
          </div>
        </div>

        <div className="monitor-bezel">
          <div className="monitor-inner">
            <div className="screen-reflection" />

            <div className="desktop">
              <div className="desktop-topbar">
                <div className="desktop-logo">
                  <span>◆</span> CLAR.EXE
                </div>

                <div className="desktop-center-status">
                  PERSONAL MEMORY ARCHIVE
                </div>

                <div className="desktop-clock">
                  {formattedTime}
                </div>
              </div>

              {/* NOTES */}

              <Window
                title="notes.txt"
                className="notes-window"
                style={{
                  left: '4%',
                  top: '8%',
                  width: '34%',
                  minWidth: '310px',
                }}
                zIndex={focusedWindow === 'notes' ? 50 : 12}
                onFocus={() => focus('notes')}
                accent="green"
              >
                <div className="notes-paper">
                  <div className="paper-holes">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="note-heading">
                    READ BEFORE PROCEEDING
                  </div>

                  <div className="note-text">
                    Hi Clar , this is sort of an archive for you to look back
                    on your past 22 years
                    <br />
                    <br />
                    as much as it is a memory book for you , don’t think I
                    didn’t add a liiittlee bit of hidden stuff in here HAHAHAH
                    I took a heck of a long time to make sure you spend a long
                    time on this so good LUCCCKKK:)
                  </div>

                  <div className="note-doodle doodle-star">✦</div>
                  <div className="note-doodle doodle-heart">♡</div>
                  <div className="note-doodle doodle-arrow">↘</div>
                </div>
              </Window>

              {/* MUSIC */}

              <Window
                title="MUSIC_PLAYER.exe"
                className="music-window"
                style={{
                  right: '4%',
                  top: '8%',
                  width: '27%',
                  minWidth: '270px',
                }}
                zIndex={focusedWindow === 'music' ? 50 : 15}
                onFocus={() => focus('music')}
                accent="cyan"
              >
                <div className="music-player">
                  <div className="cd-area">
                    <div
                      className={`cd ${cdSpinning && musicPlaying ? 'spinning' : ''}`}
                    >
                      <div className="cd-grooves" />
                      <div className="cd-label">
                        CLAR
                        <small>22</small>
                      </div>
                      <div className="cd-hole" />
                    </div>

                    <button
                      className="cd-toggle"
                      onClick={() => setCdSpinning(!cdSpinning)}
                      type="button"
                    >
                      {cdSpinning ? 'ROTATE' : 'STOP'}
                    </button>
                  </div>

                  <div className="music-info">
                    <div className="music-label">NOW PLAYING</div>
                    <div className="music-title">
                      birthday_archive.mp3
                    </div>

                    <div className="equalizer">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className={musicPlaying ? 'bar-active' : ''}
                          style={{ '--bar': (i % 6) + 2 }}
                        />
                      ))}
                    </div>

                    <button
                      className="pixel-button play-button"
                      onClick={toggleMusic}
                      type="button"
                    >
                      {musicPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
                    </button>
                  </div>
                </div>
              </Window>

              {/* VIDEO */}

              <Window
                title="VIDEO_FEED.mov"
                className="video-window"
                style={{
                  left: '5%',
                  bottom: '7%',
                  width: '30%',
                  minWidth: '280px',
                }}
                zIndex={focusedWindow === 'video' ? 50 : 10}
                onFocus={() => focus('video')}
                accent="pink"
              >
                <div className="video-frame">
                  <video
                    src="/video/background.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />

                  <div className="video-overlay">
                    <span>● REC</span>
                    <span>CAM_01</span>
                  </div>

                  <div className="video-missing">
                    <span>VIDEO_FEED</span>
                    <small>ADD /video/background.mp4</small>
                  </div>
                </div>
              </Window>

              {/* PHOTO APP */}

              <Window
                title="PHOTOS.exe"
                className="photos-window"
                style={{
                  left: '38%',
                  top: '31%',
                  width: '31%',
                  minWidth: '330px',
                }}
                zIndex={focusedWindow === 'photos' ? 50 : 30}
                onFocus={() => focus('photos')}
                accent="purple"
              >
                <div className="photo-collage">
                  <div className="polaroid p1">
                    <FakeImage
                      src={PHOTO_SLOTS[0]}
                      alt="Clar memory 1"
                      label="01"
                    />
                    <span>this one ♡</span>
                  </div>

                  <div className="polaroid p2">
                    <FakeImage
                      src={PHOTO_SLOTS[1]}
                      alt="Clar memory 2"
                      label="02"
                    />
                    <span>HAHAHA</span>
                  </div>

                  <div className="polaroid p3">
                    <FakeImage
                      src={PHOTO_SLOTS[2]}
                      alt="Clar memory 3"
                      label="03"
                    />
                    <span>CORE MEMORY</span>
                  </div>

                  <div className="photo-sticker">♡</div>
                  <div className="photo-sticker two">★</div>
                </div>
              </Window>

              {/* FILES */}

              <Window
                title="MY_FILES"
                className="files-window"
                style={{
                  right: '4%',
                  bottom: '7%',
                  width: '27%',
                  minWidth: '280px',
                }}
                zIndex={focusedWindow === 'files' ? 50 : 25}
                onFocus={() => focus('files')}
                accent="green"
              >
                <div className="file-grid">
                  {[
                    ['FEETGANG', '01'],
                    ['EGGS', '02'],
                    ['GRADUATION', '03'],
                    ['CHAOS', '04'],
                    ['MEMORIES', '05'],
                    ['DO_NOT_OPEN', '???'],
                  ].map(([name, number]) => (
                    <button
                      className="mini-file"
                      key={name}
                      type="button"
                    >
                      <div className="folder-icon">
                        <span />
                      </div>

                      <strong>{name}</strong>
                      <small>{number}</small>
                    </button>
                  ))}
                </div>
              </Window>

              {/* RECORDING */}

              <Window
                title="VOICE_NOTE.wav"
                className="recording-window"
                style={{
                  left: '31%',
                  bottom: '5%',
                  width: '25%',
                  minWidth: '270px',
                }}
                zIndex={focusedWindow === 'recording' ? 50 : 35}
                onFocus={() => focus('recording')}
                accent="cyan"
              >
                <div className="recording-app">
                  <div className="cassette">
                    <div className="cassette-label">
                      FOR CLAR ONLY
                    </div>

                    <div className="cassette-reels">
                      <span />
                      <span />
                    </div>
                  </div>

                  <div className="recording-details">
                    <div className="recording-title">
                      friend_message_01.wav
                    </div>

                    <div className="waveform">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <span
                          key={i}
                          style={{ '--wave': ((i * 7) % 8) + 2 }}
                          className={recordingPlaying ? 'wave-active' : ''}
                        />
                      ))}
                    </div>

                    <button
                      className="pixel-button"
                      type="button"
                      onClick={toggleRecording}
                    >
                      {recordingPlaying
                        ? '❚❚ STOP MESSAGE'
                        : '▶ PLAY MESSAGE'}
                    </button>
                  </div>
                </div>
              </Window>

              <div className="desktop-icon trash-icon">
                <div>▣</div>
                <span>TRASH</span>
              </div>

              <div className="desktop-icon secret-icon">
                <div>?</div>
                <span>???</span>
              </div>

              <div className="system-toast">
                <span className="toast-dot" />
                <span>WELCOME, CLAR</span>
                <small>6 WINDOWS OPEN</small>
              </div>
            </div>

            <div className="crt-scanlines" />
            <div className="crt-vignette" />
            <div className="crt-flicker" />
          </div>
        </div>

        <div className="monitor-bottom">
          <div className="monitor-controls">
            <span className="control-light" />
            <span className="control-light purple" />
            <span className="control-light cyan" />
          </div>

          <div className="monitor-logo">MEMORY//SYSTEM™</div>

          <div className="monitor-buttons">
            <span>◉</span>
            <span>◉</span>
            <span>◉</span>
          </div>
        </div>

        <div className="computer-neck" />

        <div className="computer-base">
          <div className="base-slot" />
          <div className="base-logo">
            CLAR-22
          </div>
        </div>
      </div>

      {/* PASSWORD OVERLAY */}

      <div className="password-panel">
        <div className="password-panel-top">
          <span>SECURE ACCESS</span>
          <span>LOCKED</span>
        </div>

        <div className="password-panel-body">
          <div className="tiny-warning">⚠ PRIVATE ARCHIVE</div>

          <div className="intro-copy">
            yayyy happy birthday Clar , if you see this it means the website is
            working (thank god) ,now you just need to enter the password to
            enter. Good luck !
          </div>

          <form onSubmit={submitPassword}>
            <label htmlFor="password">PASSWORD</label>

            <div className="password-input-wrap">
              <span>&gt;_</span>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="off"
                spellCheck="false"
                placeholder="ENTER PASSWORD"
              />
            </div>

            <button type="submit" className="access-button">
              ENTER ARCHIVE
              <span>↗</span>
            </button>
          </form>

          <div className="attempt-counter">
            ATTEMPTS: {wrongAttempts}
          </div>
        </div>
      </div>

      {hintOpen && (
        <div className="hint-overlay">
          <div className="hint-window">
            <div className="hint-titlebar">
              <span>WARNING.exe</span>
              <button
                type="button"
                onClick={() => setHintOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="hint-body">
              <div className="warning-icon">!</div>

              <div>
                <div className="hint-label">PASSWORD INCORRECT</div>

                <p>{hint}</p>
              </div>
            </div>

            <button
              className="hint-ok"
              type="button"
              onClick={() => setHintOpen(false)}
            >
              OKAY FINE
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: #05030c;
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

        /* =========================
           COMPUTER DESKTOP
        ========================= */

        .computer-page {
          min-height: 100vh;
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(115, 66, 200, 0.2),
              transparent 35%
            ),
            #05030c;
          color: #eee8ff;
          font-family: var(--font-vt), monospace;
        }

        .background-grid {
          position: fixed;
          inset: 0;
          opacity: 0.35;
          background-image:
            linear-gradient(
              rgba(157, 108, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(157, 108, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          transform: perspective(700px) rotateX(55deg) scale(1.8);
          transform-origin: bottom center;
          pointer-events: none;
        }

        .background-glow {
          position: fixed;
          width: 35vw;
          height: 35vw;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.22;
        }

        .glow-a {
          background: #743cff;
          top: 5%;
          left: 5%;
        }

        .glow-b {
          background: #35cfff;
          right: 5%;
          bottom: 5%;
        }

        .floating-particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-particles span {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #cdbaff;
          left: calc((var(--i) * 17) % 100 * 1%);
          top: calc((var(--i) * 31) % 100 * 1%);
          opacity: 0.45;
          animation:
            particle-float 5s infinite ease-in-out,
            particle-blink 1.7s infinite steps(2);
          animation-delay: calc(var(--i) * -0.22s);
        }

        @keyframes particle-float {
          50% {
            transform: translate(15px, -25px);
          }
        }

        @keyframes particle-blink {
          50% {
            opacity: 0.1;
          }
        }

        /* =========================
           PHYSICAL COMPUTER
        ========================= */

        .computer-shell {
          position: relative;
          z-index: 5;
          width: min(1450px, 96vw);
          margin: 2vh auto;
          filter: drop-shadow(0 40px 70px rgba(0, 0, 0, 0.75));
        }

        .computer-top {
          height: 46px;
          background:
            linear-gradient(#30294a, #171325);
          border: 2px solid #6f648e;
          border-bottom: 0;
          border-radius: 18px 18px 0 0;
          box-shadow:
            inset 0 2px rgba(255, 255, 255, 0.12),
            inset 0 -2px rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
          color: #c7b9ed;
          font-family: var(--font-silk), monospace;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .computer-brand,
        .computer-status {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .brand-mark {
          color: #a875ff;
          text-shadow: 0 0 12px #8e4fff;
        }

        .status-light {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d7ff5c;
          box-shadow: 0 0 10px #d7ff5c;
        }

        .monitor-bezel {
          padding: 22px;
          background:
            linear-gradient(135deg, #3c3554, #171323 40%, #29233c);
          border: 2px solid #6f648e;
          box-shadow:
            inset 0 0 0 2px rgba(0, 0, 0, 0.6),
            inset 0 0 30px rgba(0, 0, 0, 0.45);
        }

        .monitor-inner {
          position: relative;
          overflow: hidden;
          border: 8px solid #0c0913;
          border-radius: 16px;
          box-shadow:
            inset 0 0 50px rgba(0, 0, 0, 0.9),
            0 0 0 2px #655b7d;
          background: #080610;
        }

        .desktop {
          position: relative;
          height: min(760px, 76vh);
          min-height: 620px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(99, 48, 183, 0.28),
              transparent 38%
            ),
            linear-gradient(
              145deg,
              #0b0714,
              #120a21 45%,
              #08070e
            );
        }

        .desktop-topbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 34px;
          z-index: 100;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          padding: 0 12px;
          border-bottom: 1px solid rgba(184, 152, 255, 0.3);
          background: rgba(12, 7, 24, 0.85);
          backdrop-filter: blur(6px);
          font-family: var(--font-silk), monospace;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .desktop-logo {
          color: #d7ff5c;
        }

        .desktop-logo span {
          color: #ff4fd8;
        }

        .desktop-center-status {
          text-align: center;
          color: #8e84a8;
        }

        .desktop-clock {
          text-align: right;
          color: #5cf2ff;
        }

        /* =========================
           WINDOWS
        ========================= */

        .retro-window {
          position: absolute;
          border: 1px solid var(--window-accent);
          background: rgba(13, 9, 23, 0.96);
          box-shadow:
            0 18px 35px rgba(0, 0, 0, 0.55),
            0 0 20px color-mix(
              in srgb,
              var(--window-accent) 18%,
              transparent
            );
          backdrop-filter: blur(9px);
          animation: window-arrive 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)
            backwards;
          touch-action: manipulation;
        }

        @keyframes window-arrive {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .window-titlebar {
          height: 29px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 6px 0 9px;
          background:
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--window-accent) 22%, #100b1b),
              #100b1b
            );
          border-bottom: 1px solid var(--window-accent);
          font-family: var(--font-silk), monospace;
          font-size: 8px;
          letter-spacing: 0.8px;
          color: #eee8ff;
        }

        .window-title-left {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .window-dot {
          width: 7px;
          height: 7px;
          background: var(--window-accent);
          box-shadow: 0 0 9px var(--window-accent);
        }

        .window-buttons {
          display: flex;
          gap: 3px;
        }

        .window-buttons button {
          width: 19px;
          height: 18px;
          border: 1px solid #655b7d;
          background: #211a30;
          color: #c8bde0;
          cursor: pointer;
          font-size: 10px;
          line-height: 1;
        }

        .window-buttons button:last-child:hover {
          background: #ff4f6d;
          color: white;
        }

        .window-content {
          position: relative;
          min-height: 100px;
        }

        /* =========================
           NOTES
        ========================= */

        .notes-paper {
          position: relative;
          min-height: 300px;
          padding: 27px 28px 25px 42px;
          color: #21182d;
          background:
            repeating-linear-gradient(
              transparent 0,
              transparent 24px,
              rgba(100, 74, 140, 0.16) 25px
            ),
            #eee5d1;
          overflow: hidden;
        }

        .paper-holes {
          position: absolute;
          left: 12px;
          top: 25px;
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .paper-holes span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #100d17;
          box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2);
        }

        .note-heading {
          font-family: var(--font-silk), monospace;
          font-size: clamp(12px, 1.2vw, 17px);
          color: #30184f;
          margin-bottom: 17px;
          transform: rotate(-1deg);
          text-decoration: underline;
          text-decoration-style: wavy;
        }

        .note-text {
          font-family: 'Comic Sans MS', 'Trebuchet MS', cursive;
          font-size: clamp(14px, 1.35vw, 18px);
          line-height: 1.55;
          transform: rotate(-0.6deg);
        }

        .note-doodle {
          position: absolute;
          color: #7d32bb;
          font-family: cursive;
          font-size: 30px;
        }

        .doodle-star {
          top: 8px;
          right: 20px;
          transform: rotate(14deg);
        }

        .doodle-heart {
          bottom: 12px;
          right: 25px;
          color: #d5288e;
          transform: rotate(-12deg);
        }

        .doodle-arrow {
          bottom: 40px;
          left: 30px;
        }

        /* =========================
           MUSIC
        ========================= */

        .music-player {
          padding: 18px;
          display: flex;
          gap: 16px;
          min-height: 245px;
        }

        .cd-area {
          width: 46%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
        }

        .cd {
          width: clamp(100px, 9vw, 145px);
          aspect-ratio: 1;
          border-radius: 50%;
          position: relative;
          background:
            conic-gradient(
              from 0deg,
              #f6efff,
              #7f5aff,
              #d9ceff,
              #56ddff,
              #f6efff,
              #ff5cc8,
              #f6efff
            );
          box-shadow:
            0 0 20px rgba(145, 101, 255, 0.5),
            inset 0 0 20px rgba(0, 0, 0, 0.35);
        }

        .cd.spinning {
          animation: spin-cd 2s linear infinite;
        }

        @keyframes spin-cd {
          to {
            transform: rotate(360deg);
          }
        }

        .cd-grooves {
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            inset 0 0 0 6px rgba(255, 255, 255, 0.08),
            inset 0 0 0 12px rgba(255, 255, 255, 0.08),
            inset 0 0 0 20px rgba(255, 255, 255, 0.07);
        }

        .cd-label {
          position: absolute;
          inset: 31%;
          border-radius: 50%;
          background: #25123f;
          color: #e9dfff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          font-family: var(--font-orbitron), sans-serif;
          font-size: 11px;
          border: 1px solid #9d6cff;
          box-shadow: 0 0 12px rgba(157, 108, 255, 0.6);
        }

        .cd-label small {
          font-size: 7px;
          color: #d7ff5c;
        }

        .cd-hole {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #08060e;
          left: calc(50% - 4.5px);
          top: calc(50% - 4.5px);
        }

        .cd-toggle {
          border: 1px solid #5cf2ff;
          color: #5cf2ff;
          background: transparent;
          padding: 4px 8px;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          cursor: pointer;
        }

        .music-info {
          flex: 1;
          padding-top: 12px;
        }

        .music-label {
          color: #5cf2ff;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .music-title {
          margin-top: 8px;
          font-family: var(--font-orbitron), sans-serif;
          font-size: 10px;
          line-height: 1.5;
          color: #f1eaff;
          word-break: break-word;
        }

        .equalizer {
          height: 70px;
          margin: 15px 0;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .equalizer span {
          flex: 1;
          height: calc(var(--bar) * 8px);
          max-height: 52px;
          background: #5cf2ff;
          opacity: 0.4;
        }

        .equalizer .bar-active {
          animation: equalize 0.5s infinite alternate ease-in-out;
          animation-delay: calc(var(--bar) * -0.08s);
          opacity: 1;
          box-shadow: 0 0 8px #5cf2ff;
        }

        @keyframes equalize {
          to {
            height: 8px;
          }
        }

        .pixel-button {
          border: 1px solid #9d6cff;
          background: #191127;
          color: #eee8ff;
          padding: 9px 11px;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          cursor: pointer;
          box-shadow: 3px 3px 0 #48277c;
          transition: 0.15s;
        }

        .pixel-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 #48277c;
          background: #291640;
        }

        .play-button {
          border-color: #d7ff5c;
          color: #d7ff5c;
        }

        /* =========================
           VIDEO
        ========================= */

        .video-frame {
          position: relative;
          height: 225px;
          overflow: hidden;
          background: #07050c;
        }

        .video-frame video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.75;
        }

        .video-overlay {
          position: absolute;
          top: 9px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          text-shadow: 0 0 5px #000;
          pointer-events: none;
        }

        .video-missing {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: rgba(7, 4, 12, 0.3);
          pointer-events: none;
          color: rgba(255, 255, 255, 0.65);
          font-family: var(--font-silk), monospace;
          font-size: 9px;
        }

        .video-missing small {
          margin-top: 8px;
          font-size: 6px;
          color: #ff4fd8;
        }

        /* =========================
           PHOTOS
        ========================= */

        .photo-collage {
          position: relative;
          height: 310px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 30% 30%,
              rgba(157, 108, 255, 0.25),
              transparent 35%
            ),
            #0b0811;
        }

        .polaroid {
          position: absolute;
          width: 43%;
          padding: 7px 7px 22px;
          background: #f4eddd;
          color: #33263b;
          box-shadow: 7px 9px 18px rgba(0, 0, 0, 0.55);
          font-family: 'Comic Sans MS', cursive;
          font-size: 10px;
        }

        .polaroid .fake-image {
          width: 100%;
          aspect-ratio: 1 / 0.82;
          background: #d8d0c4;
        }

        .polaroid span {
          display: block;
          padding: 5px 2px 0;
          text-align: center;
        }

        .p1 {
          left: 6%;
          top: 13%;
          transform: rotate(-8deg);
        }

        .p2 {
          left: 30%;
          top: 8%;
          transform: rotate(5deg);
        }

        .p3 {
          right: 5%;
          top: 17%;
          transform: rotate(-4deg);
        }

        .photo-sticker {
          position: absolute;
          left: 7%;
          bottom: 15px;
          color: #ff4fd8;
          font-size: 25px;
          transform: rotate(-20deg);
          text-shadow: 0 0 10px #ff4fd8;
        }

        .photo-sticker.two {
          right: 8%;
          bottom: 20px;
          color: #d7ff5c;
          transform: rotate(18deg);
        }

        /* =========================
           FILES
        ========================= */

        .file-grid {
          padding: 17px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          min-height: 245px;
        }

        .mini-file {
          border: 0;
          background: transparent;
          color: #e8e1f6;
          cursor: pointer;
          font-family: var(--font-silk), monospace;
          padding: 4px;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .mini-file:hover .folder-icon {
          transform: translateY(-4px) rotate(-2deg);
          filter: drop-shadow(0 0 9px #d7ff5c);
        }

        .mini-file strong {
          font-size: 6px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mini-file small {
          font-size: 6px;
          color: #7e7590;
        }

        .folder-icon {
          width: 43px;
          height: 32px;
          background: #9d6cff;
          position: relative;
          border: 1px solid #d0b9ff;
          box-shadow: 4px 4px 0 rgba(45, 25, 73, 0.9);
          transition: 0.2s;
        }

        .folder-icon::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 3px;
          width: 17px;
          height: 7px;
          background: #9d6cff;
          border: 1px solid #d0b9ff;
          border-bottom: 0;
        }

        .folder-icon span {
          position: absolute;
          inset: 7px;
          border: 1px dashed rgba(255, 255, 255, 0.4);
        }

        /* =========================
           RECORDING
        ========================= */

        .recording-app {
          min-height: 225px;
          padding: 15px;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .cassette {
          width: 115px;
          height: 82px;
          flex-shrink: 0;
          background: #c9c0d6;
          border: 2px solid #756883;
          border-radius: 5px;
          padding: 10px;
          box-shadow: 5px 5px 0 #271b32;
          transform: rotate(-4deg);
        }

        .cassette-label {
          background: #eee6d6;
          color: #322737;
          font-family: var(--font-silk), monospace;
          font-size: 5px;
          text-align: center;
          padding: 4px 2px;
        }

        .cassette-reels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }

        .cassette-reels span {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 4px dotted #40384b;
          background: #b4aabe;
        }

        .recording-details {
          min-width: 0;
          flex: 1;
        }

        .recording-title {
          color: #eee8ff;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          word-break: break-word;
        }

        .waveform {
          height: 45px;
          margin: 12px 0;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .waveform span {
          width: 3px;
          height: calc(var(--wave) * 4px);
          background: #5cf2ff;
          opacity: 0.45;
        }

        .waveform .wave-active {
          animation: wave 0.45s infinite alternate;
          animation-delay: calc(var(--wave) * -0.05s);
          opacity: 1;
          box-shadow: 0 0 7px #5cf2ff;
        }

        @keyframes wave {
          to {
            transform: scaleY(0.25);
          }
        }

        /* =========================
           DESKTOP ICONS / TOAST
        ========================= */

        .desktop-icon {
          position: absolute;
          z-index: 4;
          color: #bdb1d6;
          text-align: center;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          opacity: 0.7;
        }

        .desktop-icon div {
          width: 34px;
          height: 34px;
          margin: 0 auto 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #75698d;
          background: rgba(22, 14, 35, 0.7);
          font-size: 17px;
        }

        .trash-icon {
          right: 1.5%;
          top: 43%;
        }

        .secret-icon {
          left: 1.5%;
          top: 46%;
          color: #ff4fd8;
        }

        .secret-icon div {
          border-color: #ff4fd8;
          box-shadow: 0 0 15px rgba(255, 79, 216, 0.25);
        }

        .system-toast {
          position: absolute;
          right: 18px;
          top: 48px;
          z-index: 101;
          padding: 7px 9px;
          border: 1px solid rgba(215, 255, 92, 0.5);
          background: rgba(10, 8, 15, 0.85);
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .system-toast small {
          color: #777084;
          margin-left: 3px;
        }

        .toast-dot {
          width: 5px;
          height: 5px;
          background: #d7ff5c;
          box-shadow: 0 0 8px #d7ff5c;
        }

        /* =========================
           IMAGE PLACEHOLDERS
        ========================= */

        .fake-image {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              #23183a,
              #6c42a5 45%,
              #101827
            );
        }

        .fake-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .image-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: rgba(255, 255, 255, 0.72);
          font-family: var(--font-silk), monospace;
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.12),
              transparent 55%
            );
        }

        .placeholder-cross {
          font-size: 35px;
          line-height: 1;
          color: #d7ff5c;
          text-shadow: 0 0 12px #d7ff5c;
        }

        .image-placeholder span {
          font-size: 8px;
          letter-spacing: 1px;
        }

        .image-placeholder small {
          margin-top: 4px;
          font-size: 5px;
          color: #c2b8d1;
        }

        /* =========================
           CRT
        ========================= */

        .screen-reflection {
          position: absolute;
          inset: 0;
          z-index: 1000;
          pointer-events: none;
          background:
            linear-gradient(
              110deg,
              rgba(255, 255, 255, 0.07),
              transparent 17%,
              transparent 80%,
              rgba(255, 255, 255, 0.025)
            );
        }

        .crt-scanlines {
          position: absolute;
          inset: 0;
          z-index: 999;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.035) 0,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px,
              transparent 4px
            );
          mix-blend-mode: overlay;
        }

        .crt-vignette {
          position: absolute;
          inset: 0;
          z-index: 998;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(0, 0, 0, 0.6) 100%
            );
        }

        .crt-flicker {
          position: absolute;
          inset: 0;
          z-index: 997;
          pointer-events: none;
          background: rgba(140, 100, 255, 0.02);
          animation: flicker 0.15s infinite;
        }

        @keyframes flicker {
          50% {
            opacity: 0.55;
          }
        }

        .monitor-bottom {
          height: 42px;
          background:
            linear-gradient(#29233a, #15111f);
          border: 2px solid #6f648e;
          border-top: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          color: #716985;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
        }

        .monitor-controls,
        .monitor-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .control-light {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d7ff5c;
          box-shadow: 0 0 7px #d7ff5c;
        }

        .control-light.purple {
          background: #a875ff;
          box-shadow: 0 0 7px #a875ff;
        }

        .control-light.cyan {
          background: #5cf2ff;
          box-shadow: 0 0 7px #5cf2ff;
        }

        .monitor-logo {
          color: #9085a8;
          letter-spacing: 2px;
        }

        .computer-neck {
          width: 190px;
          height: 55px;
          margin: 0 auto;
          background: linear-gradient(
            90deg,
            #211b2d,
            #403650,
            #211b2d
          );
          border: 2px solid #675c7c;
          border-top: 0;
        }

        .computer-base {
          height: 54px;
          background:
            linear-gradient(#302a40, #171321);
          border: 2px solid #6f648e;
          border-radius: 0 0 20px 20px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .base-slot {
          position: absolute;
          left: 30px;
          width: 110px;
          height: 7px;
          background: #0a0810;
          border: 1px solid #5d536d;
          border-radius: 2px;
        }

        .base-logo {
          color: #8c829e;
          font-family: var(--font-orbitron), sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
        }

        /* =========================
           PASSWORD PANEL
        ========================= */

        .password-panel {
          position: fixed;
          right: 2.8vw;
          bottom: 2.8vh;
          z-index: 500;
          width: min(360px, 88vw);
          border: 1px solid #9d6cff;
          background: rgba(10, 7, 17, 0.97);
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.75),
            0 0 30px rgba(126, 72, 255, 0.22);
        }

        .password-panel-top {
          height: 27px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 9px;
          background: #201432;
          border-bottom: 1px solid #9d6cff;
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .password-panel-body {
          padding: 16px;
        }

        .tiny-warning {
          color: #ff4fd8;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          margin-bottom: 10px;
        }

        .intro-copy {
          color: #d8d0e7;
          font-family: var(--font-vt), monospace;
          font-size: 18px;
          line-height: 1.18;
          margin-bottom: 15px;
        }

        .password-panel label {
          display: block;
          color: #8e84a8;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          margin-bottom: 5px;
        }

        .password-input-wrap {
          height: 39px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          border: 1px solid #4c3b69;
          background: #08060d;
        }

        .password-input-wrap > span {
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 9px;
        }

        .password-input-wrap input {
          min-width: 0;
          flex: 1;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #eee8ff;
          font-family: var(--font-silk), monospace;
          font-size: 9px;
        }

        .password-input-wrap input::placeholder {
          color: #50475e;
        }

        .access-button {
          width: 100%;
          margin-top: 9px;
          height: 37px;
          border: 1px solid #d7ff5c;
          background: #1d2710;
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 12px;
          transition: 0.15s;
        }

        .access-button:hover {
          background: #2b3916;
          box-shadow: 0 0 20px rgba(215, 255, 92, 0.2);
        }

        .attempt-counter {
          margin-top: 8px;
          color: #5f566d;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
          text-align: right;
        }

        /* =========================
           HINT
        ========================= */

        .hint-overlay {
          position: fixed;
          inset: 0;
          z-index: 900;
          pointer-events: none;
        }

        .hint-window {
          position: absolute;
          right: 4vw;
          bottom: 24vh;
          width: min(360px, 88vw);
          background: #100b17;
          border: 1px solid #ff4fd8;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(255, 79, 216, 0.2);
          pointer-events: auto;
          animation: hint-pop 0.25s ease-out;
        }

        @keyframes hint-pop {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .hint-titlebar {
          height: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 9px;
          background: #311329;
          border-bottom: 1px solid #ff4fd8;
          color: #ffb9ef;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
        }

        .hint-titlebar button {
          width: 20px;
          height: 18px;
          border: 1px solid #9c426f;
          background: #21101b;
          color: #ffb9ef;
          cursor: pointer;
        }

        .hint-body {
          display: flex;
          gap: 14px;
          padding: 18px;
        }

        .warning-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ff4fd8;
          color: #180914;
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 800;
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
          padding-top: 8px;
        }

        .hint-label {
          color: #ff4fd8;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          margin-bottom: 8px;
        }

        .hint-body p {
          margin: 0;
          color: #eee8ff;
          font-family: var(--font-vt), monospace;
          font-size: 19px;
          line-height: 1.15;
        }

        .hint-ok {
          margin: 0 18px 18px auto;
          display: block;
          border: 1px solid #ff4fd8;
          background: #1e1020;
          color: #ffb9ef;
          padding: 7px 10px;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
          cursor: pointer;
        }

        /* =========================
           LOADING SCREEN
        ========================= */

        .loading-screen {
          min-height: 100vh;
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              rgba(101, 45, 190, 0.3),
              transparent 42%
            ),
            #05030c;
          color: #eee8ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, #cbb8ff 1px, transparent 1px),
            radial-gradient(circle, #5cf2ff 1px, transparent 1px);
          background-size: 97px 97px, 151px 151px;
          background-position: 10px 20px, 40px 70px;
          opacity: 0.4;
          animation: stars-drift 15s linear infinite;
        }

        @keyframes stars-drift {
          to {
            background-position: 120px 80px, 180px 20px;
          }
        }

        .loading-scanlines {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 3px,
              rgba(255, 255, 255, 0.035) 4px
            );
        }

        .loading-noise {
          position: absolute;
          inset: 0;
          z-index: 19;
          opacity: 0.09;
          pointer-events: none;
          background-image:
            repeating-radial-gradient(
              circle at 0 0,
              #fff 0,
              #fff 1px,
              transparent 1px,
              transparent 3px
            );
          background-size: 6px 6px;
          animation: noise-shift 0.2s steps(2) infinite;
        }

        @keyframes noise-shift {
          50% {
            transform: translate(2px, -2px);
          }
        }

        .loading-center {
          position: relative;
          z-index: 10;
          width: min(820px, 90vw);
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .loading-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #5cf2ff;
          font-family: var(--font-silk), monospace;
          font-size: 8px;
          letter-spacing: 2px;
          margin-bottom: 15px;
          text-shadow: 0 0 12px rgba(92, 242, 255, 0.7);
        }

        .loading-eyebrow span {
          color: #ff4fd8;
          animation: blink 0.7s steps(2) infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .loading-main-title {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: var(--font-orbitron), sans-serif;
          font-size: clamp(30px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: 4px;
          color: #f0eaff;
          text-shadow:
            3px 0 #ff4fd8,
            -3px 0 #5cf2ff,
            0 0 25px rgba(157, 108, 255, 0.7);
          animation: title-jitter 2.3s infinite steps(2);
        }

        @keyframes title-jitter {
          0%,
          89%,
          100% {
            transform: translate(0);
          }

          90% {
            transform: translate(3px, -1px);
          }

          92% {
            transform: translate(-3px, 1px);
          }
        }

        .loading-slash {
          color: #d7ff5c;
          text-shadow: 0 0 15px #d7ff5c;
        }

        .glitch-word {
          position: relative;
        }

        .glitch-word::before,
        .glitch-word::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
        }

        .glitch-word::before {
          color: #ff4fd8;
          clip-path: inset(10% 0 65% 0);
          transform: translate(-3px, 0);
          animation: glitch-a 1.7s infinite steps(2);
        }

        .glitch-word::after {
          color: #5cf2ff;
          clip-path: inset(60% 0 10% 0);
          transform: translate(3px, 0);
          animation: glitch-b 1.1s infinite steps(2);
        }

        @keyframes glitch-a {
          50% {
            clip-path: inset(40% 0 35% 0);
          }
          72% {
            clip-path: inset(75% 0 5% 0);
          }
        }

        @keyframes glitch-b {
          40% {
            clip-path: inset(5% 0 70% 0);
          }
          80% {
            clip-path: inset(65% 0 15% 0);
          }
        }

        .loading-subtitle {
          margin-top: 8px;
          color: #827795;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .loading-photo-stage {
          position: relative;
          width: min(610px, 78vw);
          height: min(410px, 50vh);
          min-height: 310px;
          margin-top: 28px;
          padding: 15px;
          border: 1px solid #8b62db;
          background: rgba(13, 7, 24, 0.72);
          box-shadow:
            0 0 0 5px rgba(82, 46, 135, 0.15),
            0 0 55px rgba(127, 70, 255, 0.25),
            inset 0 0 40px rgba(0, 0, 0, 0.6);
        }

        .loading-photo-glow {
          position: absolute;
          inset: 15%;
          background: #7138ff;
          filter: blur(60px);
          opacity: 0.2;
          pointer-events: none;
        }

        .loading-photo {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: #171021;
        }

        .loading-photo img {
          object-fit: cover;
        }

        .loading-photo-stage::before {
          content: '';
          position: absolute;
          inset: 7px;
          border: 1px dashed rgba(215, 255, 92, 0.4);
          pointer-events: none;
          z-index: 3;
        }

        .photo-stage-corner {
          position: absolute;
          z-index: 5;
          color: #d7ff5c;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          text-shadow: 0 0 7px #000;
        }

        .photo-stage-corner.tl {
          left: 26px;
          top: 25px;
        }

        .photo-stage-corner.tr {
          right: 26px;
          top: 25px;
        }

        .photo-stage-corner.bl {
          left: 26px;
          bottom: 25px;
        }

        .photo-stage-corner.br {
          right: 26px;
          bottom: 25px;
        }

        .photo-counter {
          position: absolute;
          z-index: 5;
          bottom: 17px;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px 10px;
          background: rgba(5, 3, 10, 0.78);
          border: 1px solid rgba(92, 242, 255, 0.45);
          color: #5cf2ff;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .photo-counter strong {
          color: #fff;
          font-size: 9px;
        }

        .loading-progress-area {
          width: min(610px, 78vw);
          margin-top: 21px;
        }

        .loading-progress-labels {
          display: flex;
          justify-content: space-between;
          color: #d8d0e7;
          font-family: var(--font-silk), monospace;
          font-size: 7px;
          margin-bottom: 6px;
        }

        .loading-progress-labels span:last-child {
          color: #d7ff5c;
        }

        .loading-bar {
          position: relative;
          width: 100%;
          height: 14px;
          padding: 2px;
          border: 1px solid #7452a9;
          background: #0a0710;
          overflow: hidden;
        }

        .loading-bar-fill {
          height: 100%;
          position: relative;
          background:
            repeating-linear-gradient(
              90deg,
              #9d6cff 0,
              #9d6cff 12px,
              #d7ff5c 12px,
              #d7ff5c 18px,
              #5cf2ff 18px,
              #5cf2ff 27px
            );
          box-shadow:
            0 0 15px rgba(157, 108, 255, 0.7);
          transition: width 0.12s linear;
        }

        .loading-bar-scan {
          position: absolute;
          inset: 0;
          width: 70px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          animation: bar-shine 1.2s linear infinite;
        }

        @keyframes bar-shine {
          from {
            transform: translateX(-100px);
          }

          to {
            transform: translateX(700px);
          }
        }

        .loading-status {
          margin-top: 7px;
          display: flex;
          justify-content: space-between;
          color: #645a75;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
        }

        .loading-status span:last-child {
          color: #9d6cff;
        }

        .loading-corner {
          position: absolute;
          z-index: 30;
          color: #5e546d;
          font-family: var(--font-silk), monospace;
          font-size: 6px;
          letter-spacing: 1px;
        }

        .loading-corner.top-left {
          top: 22px;
          left: 25px;
        }

        .loading-corner.top-right {
          top: 22px;
          right: 25px;
          color: #d7ff5c;
        }

        .loading-corner.bottom-left {
          bottom: 22px;
          left: 25px;
        }

        .loading-corner.bottom-right {
          bottom: 22px;
          right: 25px;
        }

        .loading-floating-symbol {
          position: absolute;
          z-index: 5;
          color: #9d6cff;
          font-family: var(--font-orbitron), sans-serif;
          font-size: 25px;
          text-shadow: 0 0 18px #9d6cff;
          animation: float-symbol 4s infinite ease-in-out;
        }

        .symbol-one {
          left: 11%;
          top: 27%;
        }

        .symbol-two {
          right: 14%;
          top: 22%;
          color: #5cf2ff;
          animation-delay: -1s;
        }

        .symbol-three {
          left: 16%;
          bottom: 22%;
          color: #d7ff5c;
          animation-delay: -2s;
        }

        .symbol-four {
          right: 11%;
          bottom: 27%;
          color: #ff4fd8;
          animation-delay: -3s;
        }

        @keyframes float-symbol {
          50% {
            transform: translateY(-22px) rotate(12deg);
          }
        }

        .loading-ring {
          position: absolute;
          border: 1px solid rgba(157, 108, 255, 0.25);
          border-radius: 50%;
          pointer-events: none;
          animation: ring-pulse 4s infinite ease-in-out;
        }

        .ring-one {
          width: 48vw;
          height: 48vw;
          max-width: 700px;
          max-height: 700px;
        }

        .ring-two {
          width: 62vw;
          height: 62vw;
          max-width: 900px;
          max-height: 900px;
          border-color: rgba(92, 242, 255, 0.12);
          animation-delay: -2s;
        }

        @keyframes ring-pulse {
          50% {
            transform: scale(1.08);
            opacity: 0.3;
          }
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1100px) {
          .computer-shell {
            width: 99vw;
            margin: 0.5vh auto;
          }

          .computer-top {
            border-radius: 10px 10px 0 0;
          }

          .monitor-bezel {
            padding: 10px;
          }

          .desktop {
            min-height: 650px;
            height: 76vh;
          }

          .password-panel {
            right: 14px;
            bottom: 14px;
          }

          .retro-window {
            transform: scale(0.9);
            transform-origin: top left;
          }
        }

        @media (max-width: 800px) {
          .computer-top {
            padding: 0 10px;
            font-size: 6px;
          }

          .computer-model {
            display: none;
          }

          .monitor-bezel {
            padding: 5px;
          }

          .desktop {
            min-height: 680px;
            height: 84vh;
            overflow: hidden;
          }

          .retro-window {
            min-width: 0 !important;
          }

          .notes-window {
            width: 46% !important;
            left: 2% !important;
          }

          .music-window {
            width: 43% !important;
            right: 2% !important;
          }

          .video-window {
            width: 43% !important;
            left: 2% !important;
          }

          .photos-window {
            width: 48% !important;
            left: 27% !important;
            top: 34% !important;
          }

          .files-window {
            width: 43% !important;
            right: 2% !important;
          }

          .recording-window {
            width: 43% !important;
            left: 3% !important;
          }

          .note-text {
            font-size: 14px;
          }

          .music-player,
          .recording-app {
            flex-direction: column;
          }

          .cd-area {
            width: 100%;
          }

          .cd {
            width: 85px;
          }

          .music-player {
            min-height: 260px;
          }

          .video-frame {
            height: 180px;
          }

          .photo-collage {
            height: 235px;
          }

          .file-grid {
            gap: 7px;
            padding: 10px;
          }

          .folder-icon {
            width: 31px;
            height: 24px;
          }

          .system-toast {
            display: none;
          }

          .desktop-topbar {
            grid-template-columns: 1fr auto;
          }

          .desktop-center-status {
            display: none;
          }

          .password-panel {
            width: min(390px, calc(100vw - 20px));
            left: 10px;
            right: 10px;
            bottom: 10px;
          }

          .hint-window {
            right: 10px;
            bottom: 30vh;
            width: calc(100vw - 20px);
          }

          .loading-photo-stage {
            width: 88vw;
            height: 48vh;
            min-height: 280px;
          }

          .loading-progress-area {
            width: 88vw;
          }

          .loading-main-title {
            font-size: clamp(26px, 8vw, 46px);
          }

          .loading-subtitle {
            text-align: center;
            font-size: 6px;
          }

          .loading-corner {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .computer-shell {
            width: 100vw;
            margin: 0;
          }

          .computer-top {
            height: 32px;
          }

          .monitor-bezel {
            padding: 3px;
          }

          .monitor-inner {
            border-width: 4px;
            border-radius: 8px;
          }

          .desktop {
            min-height: 630px;
            height: 82vh;
          }

          .retro-window {
            font-size: 0.85em;
          }

          .notes-window {
            width: 56% !important;
            top: 7% !important;
          }

          .music-window {
            width: 42% !important;
            top: 7% !important;
          }

          .video-window {
            width: 49% !important;
            bottom: 4% !important;
          }

          .photos-window {
            width: 51% !important;
            left: 25% !important;
            top: 35% !important;
          }

          .files-window {
            width: 43% !important;
            right: 2% !important;
            bottom: 5% !important;
          }

          .recording-window {
            width: 48% !important;
            left: 2% !important;
            bottom: 4% !important;
          }

          .notes-paper {
            min-height: 250px;
            padding: 18px 15px 18px 30px;
          }

          .note-heading {
            font-size: 8px;
          }

          .note-text {
            font-size: 11px;
            line-height: 1.4;
          }

          .window-titlebar {
            height: 24px;
            font-size: 6px;
          }

          .window-buttons {
            display: none;
          }

          .music-player {
            padding: 10px;
            min-height: 220px;
            gap: 5px;
          }

          .music-title {
            font-size: 7px;
          }

          .equalizer {
            height: 40px;
          }

          .cd {
            width: 65px;
          }

          .video-frame {
            height: 125px;
          }

          .photo-collage {
            height: 190px;
          }

          .polaroid {
            padding: 4px 4px 13px;
            font-size: 6px;
          }

          .file-grid {
            grid-template-columns: repeat(2, 1fr);
            min-height: 210px;
          }

          .mini-file strong {
            font-size: 5px;
          }

          .folder-icon {
            width: 25px;
            height: 19px;
          }

          .recording-app {
            min-height: 190px;
            padding: 8px;
          }

          .cassette {
            width: 80px;
            height: 57px;
          }

          .cassette-label {
            font-size: 4px;
          }

          .cassette-reels span {
            width: 15px;
            height: 15px;
          }

          .recording-title {
            font-size: 5px;
          }

          .waveform {
            height: 30px;
          }

          .pixel-button {
            padding: 6px;
            font-size: 5px;
          }

          .password-panel {
            position: fixed;
            width: calc(100vw - 16px);
            left: 8px;
            right: 8px;
            bottom: 8px;
          }

          .intro-copy {
            font-size: 16px;
          }

          .loading-main-title {
            gap: 7px;
            letter-spacing: 1px;
          }

          .loading-eyebrow {
            font-size: 6px;
          }

          .loading-photo-stage {
            width: 91vw;
            height: 43vh;
            min-height: 270px;
            margin-top: 20px;
          }

          .loading-progress-area {
            width: 91vw;
          }

          .loading-photo-stage .photo-stage-corner {
            font-size: 5px;
          }

          .loading-status {
            font-size: 5px;
          }
        }
      `}</style>
    </main>
  )
}
