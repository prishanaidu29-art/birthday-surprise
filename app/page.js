'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PASSWORD = 'royal cliff'

const PHOTOS = [
  '/images/clar-01.jpg',
  '/images/clar-02.jpg',
  '/images/clar-03.jpg',
  '/images/clar-04.jpg',
  '/images/clar-05.jpg',
  '/images/clar-06.jpg',
]

const SECTIONS = [
  {
    number: '01',
    title: 'THE MEMORIES',
    description: 'photos & places',
    link: '/birthday/memories',
    icon: '▣',
  },
  {
    number: '02',
    title: 'THE MESSAGES',
    description: 'things people wanted you to know',
    link: '/birthday/messages',
    icon: '✉',
  },
  {
    number: '03',
    title: 'THE SOUNDTRACK',
    description: 'songs about you',
    link: '/birthday/playlist',
    icon: '♫',
  },
  {
    number: '04',
    title: 'THE CHAOS',
    description: 'shits and giggles',
    link: '/birthday/games',
    icon: '☠',
  },
  {
    number: '05',
    title: 'THE QUIZ',
    description: "let's see how well you actually know us",
    link: '/birthday/quiz',
    icon: '?',
  },
  {
    number: '06',
    title: 'THE JOURNEY',
    description: 'everywhere, somehow, led to here',
    link: '/birthday/journey',
    icon: '→',
  },
]

export default function HomePage() {
  const router = useRouter()

  const [screen, setScreen] = useState('boot')
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintType, setHintType] = useState(1)
  const [error, setError] = useState(false)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingPhoto, setLoadingPhoto] = useState(0)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [recordingPlaying, setRecordingPlaying] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const [activeWindow, setActiveWindow] = useState('notes')
  const [terminalText, setTerminalText] = useState('SYSTEM READY')

  const audioRef = useRef(null)
  const recordingRef = useRef(null)
  const musicStartedRef = useRef(false)

  /* ---------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'loading') return

    setLoadingProgress(0)
    setLoadingPhoto(0)

    const progressTimer = setInterval(() => {
      setLoadingProgress((previous) => {
        const next = previous + Math.random() * 2.5

        if (next >= 100) {
          return 100
        }

        return next
      })
    }, 120)

    const photoTimer = setInterval(() => {
      setLoadingPhoto((previous) => {
        return (previous + 1) % PHOTOS.length
      })
    }, 850)

    const transitionTimer = setTimeout(() => {
      router.push('/birthday')
    }, 6800)

    return () => {
      clearInterval(progressTimer)
      clearInterval(photoTimer)
      clearTimeout(transitionTimer)
    }
  }, [screen, router])

  /* ---------------------------------------------------------
     PHOTO APP SLIDESHOW
  --------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'boot') return

    const timer = setInterval(() => {
      setPhotoIndex((previous) => (previous + 1) % PHOTOS.length)
    }, 2600)

    return () => clearInterval(timer)
  }, [screen])

  /* ---------------------------------------------------------
     MUSIC
  --------------------------------------------------------- */

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    if (musicPlaying) {
      audio.play()
        .then(() => { musicStartedRef.current = true })
        .catch(() => { setMusicPlaying(false) })
    } else {
      audio.pause()
    }
  }, [musicPlaying])

  /* ---------------------------------------------------------
     TRY TO AUTOPLAY MUSIC WHEN THE PAGE OPENS
     Browsers may require a tap before allowing sound.
  --------------------------------------------------------- */

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.play()
      .then(() => {
        musicStartedRef.current = true
        setMusicPlaying(true)
      })
      .catch(() => {
        // Keep the existing PLAY button available if autoplay is blocked.
        setMusicPlaying(false)
      })
  }, [])

  /* ---------------------------------------------------------
     FIRST-TAP MUSIC FALLBACK FOR SAFARI / MOBILE BROWSERS
  --------------------------------------------------------- */

  useEffect(() => {
    if (screen !== 'boot' || musicPlaying || musicStartedRef.current) return

    function startMusicOnInteraction(event) {
      // Let the existing CD button control music without double-toggling.
      if (event.target?.closest?.('.music-button')) return

      const audio = audioRef.current
      if (!audio || musicStartedRef.current) return

      // play() must be called synchronously inside the user gesture.
      audio.play()
        .then(() => {
          musicStartedRef.current = true
          setMusicPlaying(true)
        })
        .catch(() => {
          // If the browser refuses, keep listening for another gesture.
        })
    }

    document.addEventListener('pointerdown', startMusicOnInteraction, true)
    document.addEventListener('keydown', startMusicOnInteraction, true)

    return () => {
      document.removeEventListener('pointerdown', startMusicOnInteraction, true)
      document.removeEventListener('keydown', startMusicOnInteraction, true)
    }
  }, [screen, musicPlaying])

  /* ---------------------------------------------------------
     RECORDING
  --------------------------------------------------------- */

  useEffect(() => {
    const recording = recordingRef.current

    if (!recording) return

    if (recordingPlaying) {
      recording.play().catch(() => {
        setRecordingPlaying(false)
      })
    } else {
      recording.pause()
    }
  }, [recordingPlaying])

  /* ---------------------------------------------------------
     PASSWORD
  --------------------------------------------------------- */

  function handlePasswordSubmit(event) {
    event.preventDefault()

    const entered = password.trim().toLowerCase()

    if (entered === PASSWORD) {
      setError(false)
      setShowHint(false)

      try {
        sessionStorage.setItem('birthday_authenticated', 'true')
      } catch {}

      /*
        Attempt to start the music immediately after the user's
        password-submit gesture.
      */
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setMusicPlaying(true)
          })
          .catch(() => {
            setMusicPlaying(false)
          })
      }

      setScreen('loading')
      return
    }

    const newAttempts = attempts + 1

    setAttempts(newAttempts)
    setError(true)
    setPassword('')

    if (newAttempts <= 3) {
      setHintType(1)
      setShowHint(true)
    }

    if (newAttempts === 5) {
      setHintType(2)
      setShowHint(true)
    }
  }

  function closeHint() {
    setShowHint(false)
  }

  function focusWindow(name) {
    setActiveWindow(name)
  }

  function runSystemScan() {
    setTerminalText('SCANNING ARCHIVE...')

    setTimeout(() => {
      setTerminalText('22 YEARS FOUND')

      setTimeout(() => {
        setTerminalText('MEMORY FILES: 100%')

        setTimeout(() => {
          setTerminalText('GOOD LUCK, CLAR.')
        }, 1200)
      }, 1000)
    }, 900)
  }

  /* =========================================================
     BOOT / CRT DESKTOP
  ========================================================= */

  if (screen === 'boot') {
    return (
      <main className="birthday-shell">
        <div className="background-grid" />
        <div className="floating-pixel pixel-one" />
        <div className="floating-pixel pixel-two" />
        <div className="floating-pixel pixel-three" />

        <section className="computer-wrapper">

          {/* ================= CRT ================= */}

          <div className="crt-computer">

            <div className="crt-top-label">
              <span>CLAR-22 PERSONAL ARCHIVE SYSTEM</span>
              <span className="top-light">● ONLINE</span>
            </div>

            <div className="monitor-bezel">

              <div className="monitor-inner">

                <div className="desktop">

                  {/* CRT overlays */}

                  <div className="scanlines" />
                  <div className="screen-noise" />
                  <div className="screen-vignette" />

                  {/* ================= DESKTOP HEADER ================= */}

                  <div className="desktop-header">
                    <div className="desktop-logo">
                      <span className="logo-symbol">✦</span>
                      CLAR_ARCHIVE.exe
                    </div>

                    <div className="desktop-status">
                      MEMORY CORE: ONLINE
                    </div>

                    <div className="desktop-clock">
                      22:00:04
                    </div>
                  </div>

                  <div className="desktop-doodle" aria-hidden="true">clar's computer ♡<small>22 YEARS OF CHAOS</small></div>
                  <div className="desktop-sticker sticker-a" aria-hidden="true">✿</div>
                  <div className="desktop-sticker sticker-b" aria-hidden="true">♡</div>

                  {/* =================================================
                      NOTES WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window notes-window ${
                      activeWindow === 'notes' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('notes')}
                  >
                    <WindowBar
                      title="notes.txt"
                      icon="▤"
                      active={activeWindow === 'notes'}
                    />

                    <div className="notes-paper">
                      <div className="paper-hole hole-one" />
                      <div className="paper-hole hole-two" />
                      <div className="paper-hole hole-three" />

                      <div className="handwriting">

                        <div className="note-heading">
                          READ BEFORE PROCEEDING
                        </div>

                        <p>
                          Hi Clar,
                        </p>

                        <p>
                          this is sort of an archive for you to look
                          back on your past 22 years as much as it is
                          a memory book for you,
                        </p>

                        <p>
                          don’t think I didn’t add a liiittlee bit of
                          hidden stuff in here HAHAHAH
                        </p>

                        <p>
                          I took a heck of a long time to make sure
                          you spend a long time on this so good
                          LUCCCKKK :)
                        </p>

                        <div className="scribble">
                          — your extremely normal friend
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      FILES WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window files-window ${
                      activeWindow === 'files' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('files')}
                  >
                    <WindowBar
                      title="ARCHIVE / FILES"
                      icon="▦"
                      active={activeWindow === 'files'}
                    />

                    <div className="file-grid">

                      <FakeFile
                        icon="🥚"
                        name="EGGS"
                      />

                      <FakeFile
                        icon="🦶"
                        name="FEETGANG"
                      />

                      <FakeFile
                        icon="🎓"
                        name="GRADUATION"
                      />

                      <FakeFile
                        icon="📸"
                        name="MEMORIES"
                      />

                      <FakeFile
                        icon="💌"
                        name="MESSAGES"
                      />

                      <FakeFile
                        icon="☠"
                        name="DO_NOT_OPEN"
                      />

                    </div>

                    <div className="files-footer">
                      6 OBJECTS / UNKNOWN CONTENT
                    </div>
                  </div>

                  {/* =================================================
                      CD PLAYER
                  ================================================= */}

                  <div
                    className={`desktop-window cd-window ${
                      activeWindow === 'cd' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('cd')}
                  >
                    <WindowBar
                      title="CD PLAYER.exe"
                      icon="◉"
                      active={activeWindow === 'cd'}
                    />

                    <div className="cd-player-body">

                      {/* THIS CD ACTUALLY SPINS CONTINUOUSLY */}
                      <div className="cd-spin-container">
                        <div className="cd-disc">
                          <div className="cd-reflection" />
                          <div className="cd-ring ring-one" />
                          <div className="cd-ring ring-two" />
                          <div className="cd-label">
                            <span>CLAR</span>
                            <small>22</small>
                          </div>
                          <div className="cd-hole" />
                        </div>
                      </div>

                      <div className="cd-information">
                        <div className="cd-track">
                          TRACK 01
                        </div>

                        <div className="cd-title">
                          happy birthday.mp3
                        </div>

                        <div className="cd-wave">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>

                        <button
                          className="music-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setMusicPlaying((value) => !value)
                          }}
                        >
                          {musicPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
                        </button>
                      </div>

                    </div>

                    <audio
                      ref={audioRef}
                      src="/media/intro.mp3"
                      loop
                      preload="auto"
                    />
                  </div>

                  {/* =================================================
                      PHOTO WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window photos-window ${
                      activeWindow === 'photos' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('photos')}
                  >
                    <WindowBar
                      title="PHOTOS / IMG_VIEWER"
                      icon="▣"
                      active={activeWindow === 'photos'}
                    />

                    <div className="photo-viewer">

                      <div className="photo-main">
                        <img
                          src={PHOTOS[photoIndex]}
                          alt={`Clar memory ${photoIndex + 1}`}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                            event.currentTarget.parentElement.classList.add(
                              'photo-missing'
                            )
                          }}
                        />

                        <div className="photo-placeholder">
                          <div className="placeholder-camera">
                            ◉
                          </div>
                          <div>
                            PHOTO SLOT {String(photoIndex + 1).padStart(2, '0')}
                          </div>
                          <small>
                            add image to /public/images/
                          </small>
                        </div>

                        <div className="photo-counter">
                          {String(photoIndex + 1).padStart(2, '0')} / 06
                        </div>
                      </div>

                      <div className="photo-thumbnails">
                        {PHOTOS.map((_, index) => (
                          <button
                            key={index}
                            className={
                              index === photoIndex
                                ? 'thumbnail selected'
                                : 'thumbnail'
                            }
                            onClick={(event) => {
                              event.stopPropagation()
                              setPhotoIndex(index)
                            }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* =================================================
                      RECORDING WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window recording-window ${
                      activeWindow === 'recording' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('recording')}
                  >
                    <WindowBar
                      title="VOICE_NOTE.wav"
                      icon="♫"
                      active={activeWindow === 'recording'}
                    />

                    <div className="recording-body">

                      <div className="cassette">
                        <div className="cassette-label">
                          FOR CLAR
                        </div>

                        <div className="cassette-reels">
                          <span className="cassette-reel" />
                          <span className="cassette-reel" />
                        </div>

                        <div className="cassette-line" />
                      </div>

                      <div className="recording-info">
                        <div className="recording-title">
                          someone_left_a_message.wav
                        </div>

                        <div className="recording-wave">
                          ▂▅▃▆▇▃▅▂▇▆▃▅▂▆▇▃
                        </div>

                        <button
                          className="recording-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setRecordingPlaying((value) => !value)
                          }}
                        >
                          {recordingPlaying
                            ? '❚❚ STOP RECORDING'
                            : '▶ PLAY RECORDING'}
                        </button>
                      </div>

                    </div>

                    <audio
                      ref={recordingRef}
                      src="/media/friend-voice.mp3"
                      preload="metadata"
                      onEnded={() => setRecordingPlaying(false)}
                    />
                  </div>

                  {/* =================================================
                      TERMINAL WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window terminal-window ${
                      activeWindow === 'terminal' ? 'window-active' : ''
                    }`}
                    onClick={() => focusWindow('terminal')}
                  >
                    <WindowBar
                      title="SYSTEM_TERMINAL"
                      icon=">"
                      active={activeWindow === 'terminal'}
                    />

                    <div className="terminal-body">

                      <div>
                        C:\\CLAR\\ARCHIVE&gt; boot_memory.exe
                      </div>

                      <div>
                        INITIALISING MEMORY CORE...
                      </div>

                      <div className="terminal-success">
                        ✓ CONNECTION ESTABLISHED
                      </div>

                      <div className="terminal-output">
                        {terminalText}
                      </div>

                      <button
                        className="terminal-button"
                        onClick={(event) => {
                          event.stopPropagation()
                          runSystemScan()
                        }}
                      >
                        [ RUN SCAN ]
                      </button>

                    </div>
                  </div>

                  {/* =================================================
                      PASSWORD PANEL — INSIDE CRT
                  ================================================= */}

                  <div className="password-panel">

                    <div className="password-topline">
                      <span>SECURITY LEVEL 04</span>
                      <span>ACCESS REQUIRED</span>
                    </div>

                    <div className="password-title">
                      <span className="glitch" data-text="ARCHIVE LOCKED">
                        ARCHIVE LOCKED
                      </span>
                    </div>

                    <div className="password-intro">
                      yayyy happy birthday Clar,
                      if you see this it means the website is working
                      (thank god)
                    </div>

                    <div className="password-subtext">
                      now you just need to enter the password to enter.
                      Good luck !
                    </div>

                    <form
                      className="password-form"
                      onSubmit={handlePasswordSubmit}
                    >

                      <div className="password-input-wrap">

                        <span className="input-prefix">
                          &gt;_
                        </span>

                        <input
                          type="password"
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value)
                            setError(false)
                          }}
                          placeholder="ENTER PASSWORD"
                          autoComplete="off"
                          spellCheck="false"
                        />

                        <span className="cursor-block">
                          █
                        </span>

                      </div>

                      <button
                        type="submit"
                        className="enter-button"
                      >
                        ENTER ARCHIVE
                      </button>

                    </form>

                    <div
                      className={
                        error
                          ? 'password-status status-error'
                          : 'password-status'
                      }
                    >
                      {error
                        ? `ACCESS DENIED // ATTEMPT ${attempts}`
                        : 'WAITING FOR USER INPUT...'}
                    </div>

                  </div>

                  <div className="retro-taskbar" aria-hidden="true">
                    <span className="retro-start">✦ START</span>
                    <span className="retro-tab">▤ notes.txt</span>
                    <span className="retro-tab">◉ CD PLAYER.exe</span>
                    <span className="retro-tab selected">🔒 ACCESS REQUIRED</span>
                    <span className="retro-clock">CLAR_OS 22:04</span>
                  </div>

                  {/* =================================================
                      HINT POPUP — ALSO INSIDE CRT
                  ================================================= */}

                  {showHint && (
                    <div className="hint-window">

                      <div className="hint-titlebar">
                        <span>
                          ⚠ SYSTEM MESSAGE
                        </span>

                        <button
                          onClick={closeHint}
                          aria-label="Close hint"
                        >
                          ×
                        </button>
                      </div>

                      <div className="hint-content">

                        <div className="hint-icon">
                          !
                        </div>

                        <div>
                          {hintType === 1 ? (
                            <>
                              <strong>
                                okay okay calm down 😭
                              </strong>

                              <p>
                                hint it’s a nickname I gave you after
                                learning a funny meaning of your name
                              </p>
                            </>
                          ) : (
                            <>
                              <strong>
                                FINE. ANOTHER HINT.
                              </strong>

                              <p>
                                it has something to do with a cliff
                              </p>
                            </>
                          )}
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              <div className="monitor-bottom">

                <div className="monitor-brand">
                  MEMORIES™
                </div>

                <div className="monitor-controls">
                  <span />
                  <span />
                  <span />
                </div>

              </div>

            </div>

            {/* ================= COMPUTER BASE ================= */}

            <div className="computer-base">

              <div className="base-slot" />

              <div className="keyboard">

                {Array.from({ length: 42 }).map((_, index) => (
                  <div
                    key={index}
                    className="key"
                  />
                ))}

              </div>

            </div>

          </div>

          <div className="computer-shadow" />

        </section>

        <div className="bottom-decoration">
          <span>EST. 2004</span>
          <span>•</span>
          <span>MEMORY ARCHIVE SYSTEM</span>
          <span>•</span>
          <span>ACCESS: RESTRICTED</span>
        </div>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  /* =========================================================
     REAL LOADING STATE
  ========================================================= */

  if (screen === 'loading') {
    return (
      <main className="loading-screen">

        <div className="loading-bg-grid" />
        <div className="loading-scanlines" />
        <div className="loading-vignette" />

        <div className="loading-glitch glitch-one">
          SYSTEM MEMORY
        </div>

        <div className="loading-glitch glitch-two">
          22 YEARS
        </div>

        <div className="loading-orbit orbit-one" />
        <div className="loading-orbit orbit-two" />
        <div className="loading-orbit orbit-three" />

        <section className="loading-terminal">

          <div className="loading-topbar">

            <span>
              CLAR_ARCHIVE.exe
            </span>

            <span>
              BUILD 22.0.2004
            </span>

            <span className="loading-live">
              ● LIVE
            </span>

          </div>

          <div className="loading-content">

            <div className="loading-heading">

              <div className="loading-small">
                PLEASE WAIT // ACCESSING MEMORY CORE
              </div>

              <h1
                className="loading-glitch-title"
                data-text="LOADING YOUR ARCHIVE"
              >
                LOADING YOUR ARCHIVE
              </h1>

              <div className="loading-subtitle">
                compiling 22 years of questionable decisions...
              </div>

            </div>

            <div className="loading-photo-frame">

              <div className="loading-photo-glow" />

              <div className="loading-photo">

                <img
                  src={PHOTOS[loadingPhoto]}
                  alt={`Loading memory ${loadingPhoto + 1}`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                    event.currentTarget.parentElement.classList.add(
                      'loading-photo-missing'
                    )
                  }}
                />

                <div className="loading-placeholder">

                  <div className="loading-camera">
                    ◉
                  </div>

                  <div>
                    MEMORY SLOT {String(loadingPhoto + 1).padStart(2, '0')}
                  </div>

                  <small>
                    insert /images/clar-{String(
                      loadingPhoto + 1
                    ).padStart(2, '0')}.jpg
                  </small>

                </div>

                <div className="loading-photo-label">
                  MEMORY_{String(loadingPhoto + 1).padStart(2, '0')}
                </div>

                <div className="loading-photo-number">
                  {String(loadingPhoto + 1).padStart(2, '0')} / 06
                </div>

              </div>

            </div>

            <div className="loading-data">

              <div className="loading-status-row">
                <span>
                  STATUS
                </span>

                <span className="loading-status-text">
                  {loadingProgress < 25
                    ? 'SEARCHING MEMORY'
                    : loadingProgress < 50
                    ? 'UNPACKING PHOTOS'
                    : loadingProgress < 75
                    ? 'RESTORING CHAOS'
                    : loadingProgress < 95
                    ? 'PREPARING ARCHIVE'
                    : 'ALMOST THERE...'}
                </span>

                <span>
                  {Math.floor(loadingProgress)}%
                </span>
              </div>

              <div className="loading-bar">
                <div
                  className="loading-bar-fill"
                  style={{
                    width: `${loadingProgress}%`,
                  }}
                />

                <div className="loading-bar-scan" />
              </div>

              <div className="loading-code">

                <span>
                  &gt; memory_core.init()
                </span>

                <span>
                  [OK]
                </span>

                <span>
                  &gt; locating_clar.exe
                </span>

                <span>
                  [FOUND]
                </span>

                <span>
                  &gt; loading_birthday_protocol
                </span>

                <span className="blink">
                  [...]
                </span>

              </div>

            </div>

            <div className="loading-footer">

              <span>
                DO NOT CLOSE THIS WINDOW
              </span>

              <span className="loading-heart">
                ♥
              </span>

              <span>
                SOMETHING SPECIAL IS WAITING
              </span>

            </div>

          </div>

        </section>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  return null
}


/* =============================================================
   WINDOW COMPONENT
============================================================= */

function WindowBar({ title, icon, active }) {
  return (
    <div
      className={
        active
          ? 'window-titlebar window-titlebar-active'
          : 'window-titlebar'
      }
    >

      <div className="window-title-left">
        <span className="window-icon">
          {icon}
        </span>

        <span>
          {title}
        </span>
      </div>

      <div className="window-controls">
        <span>—</span>
        <span>□</span>
        <span>×</span>
      </div>

    </div>
  )
}


/* =============================================================
   FILE COMPONENT
============================================================= */

function FakeFile({ icon, name }) {
  return (
    <button
      className="fake-file"
      onClick={(event) => event.stopPropagation()}
    >

      <div className="fake-file-icon">
        {icon}
      </div>

      <div className="fake-file-name">
        {name}
      </div>

    </button>
  )
}


/* =============================================================
   CSS
============================================================= */

const styles = `

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #05030a;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}


/* =========================================================
   MAIN BACKGROUND
========================================================= */

.birthday-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 30%,
      rgba(125, 45, 255, 0.18),
      transparent 34%
    ),
    radial-gradient(
      circle at 10% 90%,
      rgba(255, 42, 164, 0.12),
      transparent 28%
    ),
    #05030a;

  color: #f4efff;

  font-family:
    "Trebuchet MS",
    "Arial Black",
    Arial,
    sans-serif;

  padding: 26px 18px 18px;
}

.background-grid {
  position: fixed;
  inset: 0;

  background-image:
    linear-gradient(
      rgba(156, 82, 255, 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(156, 82, 255, 0.08) 1px,
      transparent 1px
    );

  background-size: 42px 42px;

  transform:
    perspective(700px)
    rotateX(62deg)
    scale(1.5);

  transform-origin: bottom center;

  opacity: 0.4;

  pointer-events: none;
}

.floating-pixel {
  position: fixed;
  width: 7px;
  height: 7px;
  background: #35f5ff;
  box-shadow: 0 0 18px #35f5ff;
  animation: floatPixel 5s ease-in-out infinite;
  pointer-events: none;
}

.pixel-one {
  left: 8%;
  top: 20%;
}

.pixel-two {
  right: 12%;
  top: 34%;
  background: #ff3cac;
  box-shadow: 0 0 18px #ff3cac;
  animation-delay: 1s;
}

.pixel-three {
  left: 18%;
  bottom: 14%;
  background: #b7ff4a;
  box-shadow: 0 0 18px #b7ff4a;
  animation-delay: 2s;
}


/* =========================================================
   COMPUTER
========================================================= */

.computer-wrapper {
  position: relative;

  width: min(1420px, 100%);
  margin: 0 auto;

  z-index: 2;
}

.crt-computer {
  position: relative;
  width: 100%;
}

.crt-top-label {
  width: 88%;
  margin: 0 auto 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #9b8aaf;

  font-family:
    "Courier New",
    monospace;

  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.top-light {
  color: #b7ff4a;
  text-shadow: 0 0 12px #b7ff4a;
}


/* =========================================================
   MONITOR BEZEL
========================================================= */

.monitor-bezel {
  position: relative;

  width: 100%;

  padding:
    clamp(14px, 2vw, 28px)
    clamp(14px, 2vw, 30px)
    20px;

  background:
    linear-gradient(
      145deg,
      #3b3944,
      #1a1920 42%,
      #292730
    );

  border:
    3px solid #09080c;

  border-radius: 30px 30px 25px 25px;

  box-shadow:
    inset 0 2px 0 rgba(255,255,255,0.18),
    inset 0 -8px 18px rgba(0,0,0,0.65),
    0 30px 60px rgba(0,0,0,0.75),
    0 0 90px rgba(112, 55, 255, 0.12);
}

.monitor-inner {
  position: relative;

  background: #020305;

  border:
    7px solid #08080b;

  border-radius: 23px;

  box-shadow:
    inset 0 0 35px rgba(0,0,0,0.95),
    0 0 0 2px #4b4850;

  overflow: hidden;
}

.desktop {
  position: relative;

  width: 100%;
  min-height: 760px;

  background:
    radial-gradient(
      ellipse at 50% 35%,
      rgba(82, 37, 157, 0.42),
      transparent 46%
    ),
    radial-gradient(
      ellipse at 80% 90%,
      rgba(255, 36, 164, 0.18),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #10091d,
      #08050e 50%,
      #11091d
    );

  overflow: hidden;
}


/* =========================================================
   CRT EFFECTS
========================================================= */

.scanlines {
  position: absolute;
  inset: 0;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.035) 0px,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 4px
    );

  z-index: 200;
  pointer-events: none;
  opacity: 0.7;
}

.screen-noise {
  position: absolute;
  inset: -30%;

  background:
    repeating-radial-gradient(
      circle at 30% 20%,
      rgba(255,255,255,0.025) 0,
      rgba(255,255,255,0.025) 1px,
      transparent 2px,
      transparent 5px
    );

  animation: noiseMove 0.15s steps(2) infinite;

  z-index: 201;
  pointer-events: none;
  opacity: 0.45;
}

.screen-vignette {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      ellipse at center,
      transparent 48%,
      rgba(0,0,0,0.38) 100%
    );

  z-index: 202;
  pointer-events: none;
}

@keyframes noiseMove {
  0% {
    transform: translate(0,0);
  }

  25% {
    transform: translate(-2%,1%);
  }

  50% {
    transform: translate(1%,-2%);
  }

  75% {
    transform: translate(2%,2%);
  }

  100% {
    transform: translate(-1%,-1%);
  }
}


/* =========================================================
   DESKTOP HEADER
========================================================= */

.desktop-header {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 13px;

  height: 27px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  padding: 0 8px;

  border-bottom:
    1px solid rgba(202, 152, 255, 0.28);

  color: #bca9d8;

  font-family:
    "Courier New",
    monospace;

  font-size: 8px;
  letter-spacing: 1.3px;

  z-index: 10;
}

.desktop-logo {
  color: #d9c9f2;
}

.logo-symbol {
  color: #ff3cac;
  margin-right: 5px;
  text-shadow: 0 0 10px #ff3cac;
}

.desktop-status {
  color: #b7ff4a;
}

.desktop-clock {
  text-align: right;
}


/* =========================================================
   WINDOWS
========================================================= */

.desktop-window {
  position: absolute;

  border:
    1px solid rgba(217, 195, 255, 0.5);

  background:
    rgba(12, 7, 22, 0.92);

  box-shadow:
    0 12px 35px rgba(0,0,0,0.45),
    0 0 22px rgba(139, 70, 255, 0.13);

  backdrop-filter: blur(4px);

  z-index: 5;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.desktop-window:hover {
  transform: translateY(-2px);
}

.window-active {
  z-index: 30;
  box-shadow:
    0 14px 38px rgba(0,0,0,0.55),
    0 0 28px rgba(167, 78, 255, 0.3);
}

.window-titlebar {
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 7px;

  background:
    linear-gradient(
      90deg,
      #30203e,
      #20152d
    );

  border-bottom:
    1px solid rgba(214, 190, 255, 0.3);

  color: #bba6d2;

  font-family:
    "Courier New",
    monospace;

  font-size: 8px;
  letter-spacing: 1px;
}

.window-titlebar-active {
  background:
    linear-gradient(
      90deg,
      #6329a7,
      #371d68
    );

  color: white;
}

.window-title-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.window-icon {
  color: #ff55bd;
}

.window-controls {
  display: flex;
  gap: 5px;
  color: #8e799f;
}

.window-controls span {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 11px;
  height: 11px;

  border: 1px solid rgba(255,255,255,0.18);

  font-size: 7px;
}


/* =========================================================
   WINDOW POSITIONS
========================================================= */

.notes-window {
  left: 2.5%;
  top: 7%;
  width: 27%;
  height: 29%;
}

.files-window {
  right: 2.5%;
  top: 7%;
  width: 25%;
  height: 31%;
}

.cd-window {
  left: 34%;
  top: 7%;
  width: 31%;
  height: 31%;
}

.photos-window {
  left: 2.5%;
  top: 44%;
  width: 31%;
  height: 45%;
}

.recording-window {
  right: 2.5%;
  top: 46%;
  width: 26%;
  height: 25%;
}

.terminal-window {
  left: 36%;
  top: 66%;
  width: 28%;
  height: 22%;
}


/* =========================================================
   NOTES
========================================================= */

.notes-paper {
  position: relative;

  height: calc(100% - 25px);

  overflow: hidden;

  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,0.7),
      rgba(244,236,255,0.96)
    );

  color: #26182e;

  padding: 18px 18px 14px 35px;

  font-family:
    "Comic Sans MS",
    "Trebuchet MS",
    cursive;

  transform: rotate(-0.25deg);
}

.paper-hole {
  position: absolute;

  left: 10px;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #170f1e;

  box-shadow:
    inset 0 1px 3px rgba(0,0,0,0.6);
}

.hole-one {
  top: 20px;
}

.hole-two {
  top: 50%;
}

.hole-three {
  bottom: 20px;
}

.handwriting {
  font-size: clamp(8px, 0.72vw, 12px);
  line-height: 1.38;
}

.note-heading {
  display: inline-block;

  margin-bottom: 7px;

  color: #d51579;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: clamp(9px, 0.8vw, 13px);

  transform: rotate(-1deg);

  text-decoration: underline;
}

.handwriting p {
  margin: 6px 0;
}

.scribble {
  margin-top: 8px;

  color: #6933a7;

  transform: rotate(-2deg);
}


/* =========================================================
   FILES
========================================================= */

.file-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 8px;

  padding: 13px 10px;
}

.fake-file {
  border: 0;
  background: transparent;

  color: #cfc0df;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  padding: 5px;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;
}

.fake-file:hover {
  background: rgba(182, 121, 255, 0.13);
}

.fake-file-icon {
  width: 32px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid rgba(255,255,255,0.3);

  background:
    linear-gradient(
      135deg,
      #513273,
      #24152f
    );

  box-shadow:
    0 0 10px rgba(151,72,255,0.15);

  font-size: 15px;
}

.fake-file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  max-width: 75px;
}

.files-footer {
  position: absolute;

  left: 8px;
  right: 8px;
  bottom: 7px;

  color: #736280;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;

  border-top:
    1px solid rgba(255,255,255,0.1);

  padding-top: 5px;
}


/* =========================================================
   CD PLAYER
========================================================= */

.cd-player-body {
  height: calc(100% - 25px);

  display: flex;
  align-items: center;
  justify-content: center;

  gap: clamp(12px, 2vw, 28px);

  padding: 12px;
}

.cd-spin-container {
  position: relative;

  width: min(135px, 40%);
  aspect-ratio: 1;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

/*
  IMPORTANT:
  This is the actual continuous spinning CD.
*/
.cd-disc {
  position: relative;

  width: 100%;
  height: 100%;

  border-radius: 50%;

  background:
    conic-gradient(
      from 0deg,
      #eee,
      #6f52ff,
      #f7a4dd,
      #35f5ff,
      #eee,
      #a978ff,
      #ff3cac,
      #eee
    );

  border:
    2px solid rgba(255,255,255,0.8);

  box-shadow:
    0 0 18px rgba(176, 97, 255, 0.4),
    inset 0 0 22px rgba(255,255,255,0.5);

  animation:
    cdSpin 2s linear infinite;

  transform-origin: center center;
}

@keyframes cdSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.cd-disc::after {
  content: "";

  position: absolute;
  inset: 9%;

  border-radius: 50%;

  border:
    1px solid rgba(255,255,255,0.4);
}

.cd-reflection {
  position: absolute;

  left: 15%;
  top: 10%;

  width: 35%;
  height: 9%;

  border-radius: 50%;

  background: rgba(255,255,255,0.65);

  filter: blur(3px);

  transform: rotate(-20deg);
}

.cd-ring {
  position: absolute;

  border-radius: 50%;

  border:
    1px solid rgba(255,255,255,0.3);

  inset: 24%;
}

.ring-two {
  inset: 32%;
}

.cd-label {
  position: absolute;

  inset: 38%;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      #ff65c2,
      #8b3bc6
    );

  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: 8px;

  box-shadow:
    0 0 12px rgba(255, 62, 192, 0.5);
}

.cd-label small {
  font-size: 5px;
}

.cd-hole {
  position: absolute;

  left: 47%;
  top: 47%;

  width: 6%;
  height: 6%;

  border-radius: 50%;

  background: #0a0710;

  border:
    1px solid #aaa;
}

.cd-information {
  flex: 1;
  min-width: 0;
}

.cd-track {
  color: #35f5ff;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;
  letter-spacing: 2px;
}

.cd-title {
  margin-top: 5px;

  color: #f7edff;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: clamp(9px, 0.9vw, 14px);

  line-height: 1.1;
}

.cd-wave {
  margin: 13px 0;

  color: #ff3cac;

  font-family:
    "Courier New",
    monospace;

  font-size: 10px;

  letter-spacing: -1px;

  white-space: nowrap;
  overflow: hidden;
}

.music-button {
  border:
    1px solid #c35cff;

  background:
    rgba(118, 36, 177, 0.25);

  color: #e9cfff;

  padding: 6px 10px;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;

  box-shadow:
    0 0 10px rgba(184, 74, 255, 0.2);
}

.music-button:hover {
  background: #8a35b8;
  color: white;
}


/* =========================================================
   PHOTO VIEWER
========================================================= */

.photo-viewer {
  height: calc(100% - 25px);

  display: flex;
  flex-direction: column;

  padding: 8px;
}

.photo-main {
  position: relative;

  flex: 1;

  min-height: 0;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #171021,
      #07050a
    );

  border:
    1px solid rgba(255,255,255,0.17);

  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-main img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  filter:
    saturate(0.76)
    sepia(0.16)
    contrast(1.09)
    brightness(0.96);
}

.photo-placeholder {
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 5px;

  color: #7f6d91;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;

  pointer-events: none;
}

.photo-main:not(.photo-missing) .photo-placeholder {
  opacity: 0;
}

.photo-main.photo-missing .photo-placeholder {
  opacity: 1;
}

.placeholder-camera {
  font-size: 28px;

  color: #8d4cff;

  text-shadow:
    0 0 18px #8d4cff;
}

.photo-placeholder small {
  color: #574a62;
}

.photo-counter {
  position: absolute;

  bottom: 6px;
  right: 6px;

  padding: 3px 5px;

  background: rgba(0,0,0,0.7);

  color: #b7ff4a;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;
}

.photo-thumbnails {
  display: flex;

  justify-content: center;

  gap: 5px;

  padding-top: 7px;
}

.thumbnail {
  width: 25px;
  height: 18px;

  border:
    1px solid #483755;

  background: #110b18;

  color: #806d8d;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;
}

.thumbnail.selected {
  border-color: #ff3cac;

  color: #ffb2dc;

  box-shadow:
    0 0 8px rgba(255,60,172,0.5);
}


/* =========================================================
   RECORDING
========================================================= */

.recording-body {
  height: calc(100% - 25px);

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 10px;
}

.cassette {
  width: 75px;
  height: 52px;

  flex-shrink: 0;

  border-radius: 4px;

  background:
    linear-gradient(
      145deg,
      #ddd,
      #8d8d8d
    );

  border:
    2px solid #444;

  padding: 7px;

  box-shadow:
    0 5px 12px rgba(0,0,0,0.4);
}

.cassette-label {
  background: #ff5bbd;

  color: #240d20;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: 6px;

  text-align: center;

  padding: 2px;
}

.cassette-reels {
  display: flex;
  justify-content: space-between;

  margin: 5px 8px;
}

.cassette-reel {
  width: 13px;
  height: 13px;

  border-radius: 50%;

  background:
    repeating-conic-gradient(
      #333 0deg 15deg,
      #aaa 15deg 30deg
    );

  border: 2px solid #333;

  animation:
    cassetteSpin 1.5s linear infinite;
}

@keyframes cassetteSpin {
  to {
    transform: rotate(360deg);
  }
}

.cassette-line {
  height: 3px;
  background: #333;
}

.recording-info {
  min-width: 0;
}

.recording-title {
  color: #d8c5e8;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recording-wave {
  color: #35f5ff;

  font-size: 8px;

  margin: 7px 0;

  animation:
    waveform 0.8s ease-in-out infinite alternate;
}

@keyframes waveform {
  from {
    transform: scaleY(0.65);
  }

  to {
    transform: scaleY(1.25);
  }
}

.recording-button {
  border:
    1px solid #ff3cac;

  background:
    rgba(255,60,172,0.1);

  color: #ff8acb;

  padding: 5px 7px;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;
}

.recording-button:hover {
  background: #a52a73;
  color: white;
}


/* =========================================================
   TERMINAL
========================================================= */

.terminal-body {
  height: calc(100% - 25px);

  padding: 9px;

  color: #8dffbd;

  font-family:
    "Courier New",
    monospace;

  font-size: 6.5px;

  line-height: 1.45;

  overflow: hidden;

  background:
    rgba(0,0,0,0.32);
}

.terminal-success {
  color: #b7ff4a;
}

.terminal-output {
  color: #35f5ff;

  margin: 3px 0;
}

.terminal-button {
  border: 1px solid #35f5ff;

  background: rgba(53,245,255,0.06);

  color: #35f5ff;

  padding: 3px 7px;

  font-size: 6px;
}

.terminal-button:hover {
  background: rgba(53,245,255,0.2);
}


/* =========================================================
   PASSWORD PANEL — INSIDE CRT
========================================================= */

.password-panel {
  position: absolute;

  left: 50%;
  top: 41%;

  transform: translateX(-50%);

  width: 30%;

  min-width: 270px;

  padding: 13px 15px;

  background:
    linear-gradient(
      145deg,
      rgba(17, 8, 29, 0.97),
      rgba(8, 5, 14, 0.97)
    );

  border:
    1px solid #a75cff;

  box-shadow:
    0 0 22px rgba(157, 77, 255, 0.3),
    inset 0 0 22px rgba(112, 47, 173, 0.12);

  z-index: 80;

  animation:
    passwordPulse 3s ease-in-out infinite;
}

@keyframes passwordPulse {
  0%,
  100% {
    box-shadow:
      0 0 22px rgba(157,77,255,0.3),
      inset 0 0 22px rgba(112,47,173,0.12);
  }

  50% {
    box-shadow:
      0 0 35px rgba(157,77,255,0.5),
      inset 0 0 30px rgba(112,47,173,0.18);
  }
}

.password-topline {
  display: flex;
  justify-content: space-between;

  color: #75637f;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;

  letter-spacing: 1px;

  margin-bottom: 8px;
}

.password-title {
  color: #f3ddff;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: clamp(12px, 1.2vw, 18px);

  letter-spacing: 1px;

  margin-bottom: 6px;
}

.glitch {
  position: relative;
  display: inline-block;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);

  position: absolute;

  left: 0;
  top: 0;

  width: 100%;

  overflow: hidden;

  opacity: 0.8;
}

.glitch::before {
  color: #35f5ff;

  transform: translate(1px,0);

  clip-path:
    inset(10% 0 72% 0);

  animation:
    glitchOne 2.5s infinite linear alternate-reverse;
}

.glitch::after {
  color: #ff3cac;

  transform: translate(-1px,0);

  clip-path:
    inset(65% 0 15% 0);

  animation:
    glitchTwo 2s infinite linear alternate-reverse;
}

@keyframes glitchOne {
  0%,
  85% {
    transform: translate(1px,0);
  }

  86% {
    transform: translate(-5px,1px);
  }

  90% {
    transform: translate(4px,-1px);
  }

  94% {
    transform: translate(-1px,0);
  }

  100% {
    transform: translate(1px,0);
  }
}

@keyframes glitchTwo {
  0%,
  80% {
    transform: translate(-1px,0);
  }

  82% {
    transform: translate(5px,-1px);
  }

  87% {
    transform: translate(-4px,1px);
  }

  93% {
    transform: translate(2px,0);
  }

  100% {
    transform: translate(-1px,0);
  }
}

.password-intro {
  color: #ddd0e8;

  font-size: 8px;

  line-height: 1.35;

  margin-bottom: 4px;
}

.password-subtext {
  color: #8c7798;

  font-family:
    "Courier New",
    monospace;

  font-size: 6.5px;

  margin-bottom: 10px;
}

.password-form {
  display: flex;

  gap: 7px;
}

.password-input-wrap {
  flex: 1;

  min-width: 0;

  display: flex;
  align-items: center;

  border:
    1px solid #5c3a74;

  background: #050307;

  height: 28px;

  padding: 0 7px;

  box-shadow:
    inset 0 0 10px rgba(0,0,0,0.8);
}

.input-prefix {
  color: #b7ff4a;

  font-family:
    "Courier New",
    monospace;

  font-size: 9px;

  margin-right: 5px;
}

.password-input-wrap input {
  width: 100%;

  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;

  color: #f7edff;

  font-family:
    "Courier New",
    monospace;

  font-size: 9px;

  letter-spacing: 2px;
}

.password-input-wrap input::placeholder {
  color: #514359;
}

.cursor-block {
  color: #a956ff;

  animation:
    cursorBlink 0.9s steps(1) infinite;
}

@keyframes cursorBlink {
  50% {
    opacity: 0;
  }
}

.enter-button {
  flex-shrink: 0;

  height: 28px;

  padding: 0 10px;

  border:
    1px solid #ff3cac;

  background:
    linear-gradient(
      135deg,
      #7b2cbf,
      #bb267f
    );

  color: white;

  font-family:
    "Arial Black",
    sans-serif;

  font-size: 7px;

  box-shadow:
    0 0 12px rgba(255,60,172,0.25);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.enter-button:hover {
  transform: translateY(-1px);

  box-shadow:
    0 0 20px rgba(255,60,172,0.55);
}

.password-status {
  margin-top: 7px;

  color: #63536e;

  font-family:
    "Courier New",
    monospace;

  font-size: 6px;

  letter-spacing: 0.5px;
}

.status-error {
  color: #ff5d9f;

  animation:
    statusShake 0.25s linear;
}

@keyframes statusShake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  50% {
    transform: translateX(3px);
  }

  75% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0);
  }
}


/* =========================================================
   HINT
========================================================= */

.hint-window {
  position: absolute;

  right: 30%;
  top: 47%;

  width: 255px;

  background:
    #130b1c;

  border:
    1px solid #ff3cac;

  box-shadow:
    0 0 25px rgba(255,60,172,0.35);

  z-index: 100;

  animation:
    hintAppear 0.2s ease-out;
}

@keyframes hintAppear {
  from {
    opacity: 0;
    transform: scale(0.92);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hint-titlebar {
  height: 23px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 7px;

  background:
    linear-gradient(
      90deg,
      #8d2470,
      #4d1d63
    );

  color: white;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;
}

.hint-titlebar button {
  border: 0;

  background: transparent;

  color: white;

  font-size: 15px;

  line-height: 1;
}

.hint-content {
  display: flex;

  gap: 10px;

  padding: 13px;

  color: #ded1e9;

  font-size: 8px;

  line-height: 1.45;
}

.hint-icon {
  flex-shrink: 0;

  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ff3cac;

  color: #210817;

  font-family:
    "Arial Black",
    sans-serif;
}

.hint-content p {
  margin: 6px 0 0;

  color: #9d88a8;
}


/* =========================================================
   MONITOR BOTTOM
========================================================= */

.monitor-bottom {
  display: flex;

  justify-content: space-between;
  align-items: center;

  height: 32px;

  padding: 0 18px;

  color: #67636e;
}

.monitor-brand {
  font-family:
    "Arial Black",
    sans-serif;

  font-size: 8px;

  letter-spacing: 2px;
}

.monitor-controls {
  display: flex;
  gap: 7px;
}

.monitor-controls span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #17151a;

  border: 1px solid #666;
}


/* =========================================================
   COMPUTER BASE
========================================================= */

.computer-base {
  width: 87%;

  margin: 0 auto;

  padding: 12px 30px 20px;

  background:
    linear-gradient(
      180deg,
      #393740,
      #1c1a21
    );

  border:
    3px solid #09080b;

  border-top: 0;

  border-radius:
    0 0 25px 25px;

  box-shadow:
    inset 0 4px 8px rgba(255,255,255,0.07),
    0 20px 40px rgba(0,0,0,0.65);
}

.base-slot {
  width: 55%;

  height: 6px;

  margin: 0 auto 11px;

  background: #0d0c10;

  border-radius: 10px;

  box-shadow:
    inset 0 1px 3px black;
}

.keyboard {
  width: 65%;
  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(14, 1fr);

  gap: 3px;

  transform:
    perspective(300px)
    rotateX(10deg);
}

.key {
  height: 7px;

  background:
    linear-gradient(
      145deg,
      #64616b,
      #29272e
    );

  border-radius: 2px;

  border:
    1px solid #18171c;

  box-shadow:
    0 2px 1px #111;
}

.computer-shadow {
  width: 90%;
  height: 40px;

  margin: -5px auto 0;

  background:
    radial-gradient(
      ellipse,
      rgba(0,0,0,0.8),
      transparent 70%
    );

  filter: blur(5px);
}

.bottom-decoration {
  position: relative;

  z-index: 3;

  display: flex;

  justify-content: center;
  align-items: center;

  gap: 10px;

  margin-top: 10px;

  color: #665772;

  font-family:
    "Courier New",
    monospace;

  font-size: 7px;

  letter-spacing: 1.5px;
}


/* =========================================================
   LOADING SCREEN
========================================================= */

.loading-screen {
  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(120, 40, 255, 0.23),
      transparent 40%
    ),
    radial-gradient(
      circle at 10% 80%,
      rgba(255, 40, 170, 0.18),
      transparent 30%
    ),
    #05020a;

  color: white;

  font-family:
    "Courier New",
    monospace;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 30px 18px;
}

.loading-bg-grid {
  position: absolute;
  inset: -50%;

  background-image:
    linear-gradient(
      rgba(255,60,172,0.07) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(53,245,255,0.07) 1px,
      transparent 1px
    );

  background-size: 35px 35px;

  transform:
    perspective(500px)
    rotateX(65deg);

  animation:
    loadingGrid 5s linear infinite;
}

@keyframes loadingGrid {
  from {
    transform:
      perspective(500px)
      rotateX(65deg)
      translateY(0);
  }

  to {
    transform:
      perspective(500px)
      rotateX(65deg)
      translateY(35px);
  }
}

.loading-scanlines {
  position: absolute;
  inset: 0;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.045) 0,
      rgba(255,255,255,0.045) 1px,
      transparent 1px,
      transparent 5px
    );

  pointer-events: none;

  z-index: 20;
}

.loading-vignette {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      ellipse at center,
      transparent 35%,
      rgba(0,0,0,0.7) 100%
    );

  pointer-events: none;

  z-index: 21;
}

.loading-terminal {
  position: relative;

  z-index: 10;

  width: min(900px, 96vw);

  border:
    1px solid #9d55ff;

  background:
    rgba(7,3,13,0.9);

  box-shadow:
    0 0 50px rgba(129,49,255,0.25),
    inset 0 0 40px rgba(95,37,145,0.12);

  backdrop-filter: blur(7px);
}

.loading-topbar {
  height: 34px;

  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  padding: 0 12px;

  background:
    linear-gradient(
      90deg,
      #3d185d,
      #241033,
      #3d185d
    );

  border-bottom:
    1px solid #7039a1;

  color: #d4b6eb;

  font-size: 8px;

  letter-spacing: 1px;
}

.loading-live {
  text-align: right;

  color: #b7ff4a;

  text-shadow:
    0 0 10px #b7ff4a;
}

.loading-content {
  padding: clamp(20px, 4vw, 40px);
}

.loading-heading {
  text-align: center;

  margin-bottom: 24px;
}

.loading-small {
  color: #35f5ff;

  font-size: 8px;

  letter-spacing: 3px;

  margin-bottom: 8px;
}

.loading-glitch-title {
  position: relative;

  margin: 0;

  color: #f8eaff;

  font-family:
    "Arial Black",
    "Trebuchet MS",
    sans-serif;

  font-size: clamp(24px, 5vw, 55px);

  line-height: 0.95;

  letter-spacing: -1px;

  text-shadow:
    0 0 20px rgba(196,94,255,0.4);
}

.loading-glitch-title::before,
.loading-glitch-title::after {
  content: attr(data-text);

  position: absolute;

  left: 0;
  top: 0;

  width: 100%;

  opacity: 0.8;

  pointer-events: none;
}

.loading-glitch-title::before {
  color: #35f5ff;

  clip-path:
    inset(5% 0 75% 0);

  animation:
    loadGlitchA 2.2s infinite;
}

.loading-glitch-title::after {
  color: #ff3cac;

  clip-path:
    inset(65% 0 10% 0);

  animation:
    loadGlitchB 1.8s infinite;
}

@keyframes loadGlitchA {
  0%,
  90% {
    transform: translate(0);
  }

  92% {
    transform: translate(-7px, 1px);
  }

  95% {
    transform: translate(5px, -1px);
  }

  100% {
    transform: translate(0);
  }
}

@keyframes loadGlitchB {
  0%,
  84% {
    transform: translate(0);
  }

  86% {
    transform: translate(7px, -1px);
  }

  90% {
    transform: translate(-4px, 2px);
  }

  100% {
    transform: translate(0);
  }
}

.loading-subtitle {
  margin-top: 9px;

  color: #806c8d;

  font-size: 8px;

  letter-spacing: 1px;
}


/* =========================================================
   LOADING PHOTO
========================================================= */

.loading-photo-frame {
  position: relative;

  width: min(670px, 100%);

  margin: 0 auto;

  padding: 8px;

  border:
    1px solid rgba(206, 137, 255, 0.65);

  background:
    rgba(20, 9, 32, 0.75);

  box-shadow:
    0 0 30px rgba(164,71,255,0.25);
}

.loading-photo {
  position: relative;

  width: 100%;

  aspect-ratio: 16 / 8.7;

  overflow: hidden;

  background:
    radial-gradient(
      circle,
      #3b1d55,
      #0b0610
    );

  border:
    1px solid rgba(255,255,255,0.16);
}

.loading-photo img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  filter:
    saturate(0.76)
    sepia(0.16)
    contrast(1.09)
    brightness(0.96);

  animation:
    photoAppear 0.35s ease-out;
}

@keyframes photoAppear {
  from {
    opacity: 0;
    transform: scale(1.05);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-placeholder {
  position: absolute;

  inset: 0;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 6px;

  color: #79658a;

  font-size: 8px;

  pointer-events: none;
}

.loading-photo:not(.loading-photo-missing) .loading-placeholder {
  opacity: 0;
}

.loading-photo-missing .loading-placeholder {
  opacity: 1;
}

.loading-camera {
  font-size: 45px;

  color: #9c52ff;

  text-shadow:
    0 0 20px #9c52ff;
}

.loading-placeholder small {
  color: #57475f;
}

.loading-photo-label {
  position: absolute;

  left: 10px;
  bottom: 8px;

  padding: 4px 6px;

  background: rgba(0,0,0,0.75);

  color: #ff75c8;

  font-size: 7px;
}

.loading-photo-number {
  position: absolute;

  right: 10px;
  bottom: 8px;

  padding: 4px 6px;

  background: rgba(0,0,0,0.75);

  color: #b7ff4a;

  font-size: 7px;
}


/* =========================================================
   LOADING DATA
========================================================= */

.loading-data {
  width: min(670px, 100%);

  margin: 16px auto 0;
}

.loading-status-row {
  display: grid;

  grid-template-columns:
    auto 1fr auto;

  gap: 12px;

  align-items: center;

  color: #6e5d7a;

  font-size: 7px;
}

.loading-status-text {
  color: #d9c2e8;

  text-align: center;

  letter-spacing: 1px;
}

.loading-bar {
  position: relative;

  width: 100%;

  height: 13px;

  margin-top: 7px;

  overflow: hidden;

  border:
    1px solid #67417f;

  background: #08040d;

  box-shadow:
    inset 0 0 8px rgba(0,0,0,0.8);
}

.loading-bar-fill {
  position: absolute;

  left: 0;
  top: 0;
  bottom: 0;

  background:
    linear-gradient(
      90deg,
      #7d2cff,
      #d23cff,
      #ff3cac,
      #35f5ff
    );

  box-shadow:
    0 0 18px rgba(255,60,172,0.5);

  transition:
    width 0.12s linear;
}

.loading-bar-scan {
  position: absolute;

  top: 0;
  bottom: 0;

  width: 55px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.65),
      transparent
    );

  filter: blur(2px);

  animation:
    barScan 1.2s linear infinite;
}

@keyframes barScan {
  from {
    left: -70px;
  }

  to {
    left: 110%;
  }
}

.loading-code {
  display: grid;

  grid-template-columns: 1fr auto;

  gap: 2px 20px;

  margin-top: 10px;

  color: #5c4c65;

  font-size: 6px;
}

.loading-code span:nth-child(even) {
  color: #b7ff4a;

  text-align: right;
}

.blink {
  animation:
    cursorBlink 0.7s steps(1) infinite;
}

.loading-footer {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 12px;

  margin-top: 20px;

  color: #574a60;

  font-size: 6px;

  letter-spacing: 1px;

  text-align: center;
}

.loading-heart {
  color: #ff3cac;

  text-shadow:
    0 0 10px #ff3cac;

  animation:
    heartPulse 0.8s ease-in-out infinite alternate;
}

@keyframes heartPulse {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.3);
  }
}


/* =========================================================
   ORBITS
========================================================= */

.loading-orbit {
  position: absolute;

  border-radius: 50%;

  border:
    1px solid rgba(166,80,255,0.3);

  pointer-events: none;
}

.orbit-one {
  width: 650px;
  height: 650px;

  left: 50%;
  top: 50%;

  margin:
    -325px
    0
    0
    -325px;

  animation:
    orbitSpin 18s linear infinite;
}

.orbit-two {
  width: 850px;
  height: 300px;

  left: 50%;
  top: 50%;

  margin:
    -150px
    0
    0
    -425px;

  transform: rotate(35deg);

  animation:
    orbitSpin 12s linear infinite reverse;
}

.orbit-three {
  width: 420px;
  height: 900px;

  left: 50%;
  top: 50%;

  margin:
    -450px
    0
    0
    -210px;

  transform: rotate(-35deg);

  animation:
    orbitSpin 15s linear infinite;
}

@keyframes orbitSpin {
  to {
    transform:
      rotate(360deg);
  }
}

.loading-glitch {
  position: absolute;

  z-index: 5;

  color: rgba(255,60,172,0.15);

  font-family:
    "Arial Black",
    sans-serif;

  font-size: clamp(50px, 12vw, 160px);

  pointer-events: none;

  user-select: none;
}

.glitch-one {
  left: -2%;
  top: 7%;

  transform: rotate(-8deg);
}

.glitch-two {
  right: -3%;
  bottom: 5%;

  transform: rotate(7deg);

  color: rgba(53,245,255,0.1);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {

  .desktop {
    min-height: 650px;
  }

  .notes-window {
    width: 29%;
  }

  .files-window {
    width: 28%;
  }

  .cd-window {
    width: 32%;
    left: 34%;
  }

  .password-panel {
    width: 34%;
  }

  .photos-window {
    width: 32%;
  }

  .terminal-window {
    width: 30%;
  }

}

@media (max-width: 760px) {

  .birthday-shell {
    padding:
      12px 6px 12px;
  }

  .crt-top-label {
    width: 94%;
    font-size: 7px;
  }

  .monitor-bezel {
    padding:
      8px
      7px
      12px;

    border-radius: 18px;
  }

  .monitor-inner {
    border-width: 4px;
    border-radius: 14px;
  }

  .desktop {
    min-height: 920px;
  }

  /*
    On smaller screens the windows become smaller
    but still remain inside the CRT.
  */

  .notes-window {
    left: 3%;
    top: 5%;
    width: 45%;
    height: 22%;
  }

  .files-window {
    right: 3%;
    top: 5%;
    width: 45%;
    height: 22%;
  }

  .cd-window {
    left: 25%;
    top: 29%;
    width: 50%;
    height: 23%;
  }

  .photos-window {
    left: 3%;
    top: 55%;
    width: 45%;
    height: 29%;
  }

  .recording-window {
    right: 3%;
    top: 55%;
    width: 45%;
    height: 17%;
  }

  .terminal-window {
    left: 25%;
    top: 73%;
    width: 50%;
    height: 14%;
  }

  .password-panel {
    left: 50%;
    top: 52%;

    width: 62%;
    min-width: 0;

    padding: 10px;
  }

  .password-intro {
    font-size: 6px;
  }

  .password-subtext {
    font-size: 5px;
  }

  .password-form {
    flex-direction: column;
  }

  .enter-button {
    width: 100%;
  }

  .hint-window {
    right: 7%;
    top: 42%;

    width: 48%;

    font-size: 7px;
  }

  .keyboard {
    width: 90%;
  }

  .computer-base {
    width: 94%;
    padding-left: 10px;
    padding-right: 10px;
  }

  .bottom-decoration {
    font-size: 5px;
    gap: 5px;
  }

  .loading-terminal {
    width: 97vw;
  }

  .loading-content {
    padding:
      18px 12px 20px;
  }

  .loading-topbar {
    grid-template-columns: 1fr auto;
  }

  .loading-topbar span:nth-child(2) {
    display: none;
  }

  .loading-glitch-title {
    font-size: 25px;
  }

  .loading-photo {
    aspect-ratio: 16 / 10;
  }

}

@media (max-width: 480px) {

  .desktop {
    min-height: 840px;
  }

  .notes-window {
    height: 21%;
  }

  .files-window {
    height: 21%;
  }

  .cd-window {
    top: 28%;
    height: 22%;
  }

  .photos-window {
    top: 54%;
    height: 27%;
  }

  .recording-window {
    top: 54%;
    height: 15%;
  }

  .terminal-window {
    top: 70%;
    height: 12%;
  }

  .password-panel {
    top: 49%;
    width: 68%;
  }

  .handwriting {
    font-size: 6px;
  }

  .note-heading {
    font-size: 7px;
  }

  .fake-file-icon {
    width: 24px;
    height: 21px;
    font-size: 11px;
  }

  .fake-file {
    font-size: 5px;
  }

  .cd-spin-container {
    width: 70px;
  }

  .cd-title {
    font-size: 7px;
  }

  .music-button {
    font-size: 5px;
    padding: 4px 6px;
  }

  .loading-heading {
    margin-bottom: 15px;
  }

  .loading-small {
    font-size: 6px;
    letter-spacing: 1px;
  }

  .loading-glitch-title {
    font-size: 21px;
  }

  .loading-subtitle {
    font-size: 6px;
  }

  .loading-status-row {
    grid-template-columns:
      1fr auto;
  }

  .loading-status-text {
    display: none;
  }

}


/* =========================================================
   VINTAGE DIGICAM PHOTO TREATMENT
   Applies to the CRT viewer and loading slideshow only.
   Original images remain unchanged.
========================================================= */

.photo-main::after,
.loading-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.24;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(15, 6, 18, 0.18) 0px,
      rgba(15, 6, 18, 0.18) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-radial-gradient(
      circle at 17% 39%,
      rgba(255, 245, 220, 0.25) 0px,
      rgba(255, 245, 220, 0.25) 0.65px,
      transparent 0.9px,
      transparent 3px
    );
  mix-blend-mode: screen;
}

.photo-main::before,
.loading-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 12% 8%, rgba(255, 190, 105, 0.15), transparent 55%),
    radial-gradient(ellipse at center, transparent 45%, rgba(20, 8, 24, 0.38) 100%);
}

/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes floatPixel {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(0deg);
    opacity: 0.3;
  }

  50% {
    transform:
      translateY(-30px)
      rotate(180deg);
    opacity: 1;
  }
}


/* Password-entry desktop redesign only; the loading state stays unchanged. */
.birthday-shell {background:radial-gradient(ellipse at 50% 32%,#46215c55,transparent 60%),#090713;}
.birthday-shell .computer-wrapper {width:min(1510px,100%);}
.birthday-shell .monitor-bezel {
  background:linear-gradient(145deg,#afa5b3,#5c5363 16%,#2c2732 50%,#726878);
  box-shadow:inset 0 2px #ffffff55,inset 0 -10px 20px #0008,0 35px 80px #000b;
}
.birthday-shell .desktop {
  min-height:850px;
  background:radial-gradient(ellipse at 18% 80%,#dd468a22,transparent 40%),
    radial-gradient(ellipse at 80% 20%,#50a9cd22,transparent 45%),
    repeating-linear-gradient(0deg,#ffffff03 0 1px,transparent 1px 4px),
    linear-gradient(135deg,#26152e,#0f0a1b 50%,#26132e);
}
.birthday-shell .desktop::before {
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(#eab4ff33 .8px,transparent .8px);
  background-size:22px 22px;
}
.birthday-shell .desktop-header {
  left:0;right:0;top:0;height:36px;padding:0 16px;
  background:linear-gradient(90deg,#752e85,#3b2053 65%,#2b2a59);
  border-bottom:2px solid #25112d;color:#fff0fa;font-size:10px;z-index:40;
}
.birthday-shell .desktop-status {color:#a8ffda;}
.birthday-shell .desktop-window {
  border:2px solid #d7a9e5;
  background:#140b20f7;
  box-shadow:5px 6px 0 #07030b99,0 15px 36px #0008;
  transition:box-shadow .18s,filter .18s;
}
.birthday-shell .desktop-window:hover {transform:none;filter:brightness(1.06);}
.birthday-shell .window-active {z-index:35;box-shadow:7px 8px 0 #07030b88,0 0 25px #b65fff55;}
.birthday-shell .window-titlebar {
  height:30px;padding:0 10px;font-size:11px;color:#fff0fa;
  background:linear-gradient(90deg,#7d337e,#4b2b6b 75%,#292047);
}
.birthday-shell .window-titlebar-active {background:linear-gradient(90deg,#bd459a,#7a368c 60%,#4a2a73);}
.birthday-shell .window-controls span {width:14px;height:14px;font-size:9px;border-color:#ffffff77;}

/* Scattered Windows 2000 layout with a clear password area */
.birthday-shell .notes-window {left:3%;top:11%;width:29%;height:34%;rotate:-1deg;z-index:7;}
.birthday-shell .recording-window {right:36%;top:12%;width:25%;height:20%;rotate:1deg;z-index:8;}
.birthday-shell .cd-window {left:auto;right:3%;top:10%;width:32%;height:30%;rotate:1deg;z-index:9;}
.birthday-shell .photos-window {left:3.5%;top:53%;width:29%;height:35%;rotate:1deg;z-index:7;}
.birthday-shell .files-window {left:auto;right:3%;top:54%;width:32%;height:34%;rotate:-.7deg;z-index:9;}
.birthday-shell .terminal-window {left:37%;top:73%;width:25%;height:15%;rotate:1deg;z-index:7;}
.birthday-shell .password-panel {
  left:50%;top:39%;width:32%;min-width:0;padding:17px 19px;
  background:linear-gradient(150deg,#291535,#130b22 75%);
  border:2px solid #ed8cda;z-index:80;
  box-shadow:6px 7px 0 #0008,0 0 30px #ff6bca44;
}
.birthday-shell .password-panel::before {
  content:'✦  password_required.exe';display:block;
  margin:-17px -19px 13px;padding:8px 12px;
  color:#fff0fa;background:linear-gradient(90deg,#b43d88,#5e2b86);
  font:bold 11px 'Courier New',monospace;
}
.birthday-shell .password-title {font-size:clamp(18px,1.8vw,28px);margin:9px 0 10px;}
.birthday-shell .password-intro {font-size:clamp(11px,.95vw,14px);line-height:1.4;}
.birthday-shell .password-subtext {font-size:clamp(10px,.8vw,12px);line-height:1.4;}
.birthday-shell .password-topline {font-size:9px;}
.birthday-shell .password-form {margin-top:13px;gap:8px;}
.birthday-shell .password-input-wrap {height:38px;}
.birthday-shell .password-input-wrap input {font-size:12px;letter-spacing:1px;}
.birthday-shell .enter-button {height:38px;font-size:10px;padding:0 11px;}
.birthday-shell .password-status {font-size:10px;margin-top:10px;}
.birthday-shell .notes-paper {background:linear-gradient(115deg,#f9eaf3,#fff7eb);overflow-y:auto;padding:17px 17px 14px 30px;}
.birthday-shell .handwriting {font-size:clamp(11px,.95vw,14px);line-height:1.4;}
.birthday-shell .note-heading {font-size:clamp(11px,1vw,15px);}
.birthday-shell .hint-window {right:15%;top:48%;width:min(290px,33%);}
.birthday-shell .hint-content {font-size:12px;}
.birthday-shell .hint-titlebar {font-size:10px;}
.birthday-shell .desktop-doodle {
  position:absolute;top:36%;left:36%;rotate:-6deg;
  font:18px 'Comic Sans MS',cursive;color:#ed99d9a0;pointer-events:none;
}
.birthday-shell .desktop-doodle small {display:block;font:10px 'Courier New',monospace;color:#af94bc;}
.birthday-shell .desktop-sticker {position:absolute;pointer-events:none;z-index:3;font:42px Georgia,serif;text-shadow:0 0 12px currentColor;}
.birthday-shell .sticker-a {left:32%;top:9%;color:#f49cce;rotate:-20deg;}
.birthday-shell .sticker-b {right:34%;top:55%;color:#ffa3d5;rotate:15deg;}
.birthday-shell .retro-taskbar {
  position:absolute;left:0;right:0;bottom:0;height:38px;z-index:60;
  display:flex;align-items:center;gap:5px;padding:4px 9px;
  background:linear-gradient(#633d75,#312041);border-top:2px solid #bc8ec7;
  color:#f8e1ff;font:10px 'Courier New',monospace;
}
.birthday-shell .retro-start {padding:6px 11px;font-weight:bold;background:linear-gradient(135deg,#e062a6,#8542b2);border:1px outset #ffb4e2;}
.birthday-shell .retro-tab {padding:6px 10px;border:1px solid #9b71b2;background:#24152f;white-space:nowrap;}
.birthday-shell .retro-tab.selected {background:#793b81;border-color:#ffabd7;}
.birthday-shell .retro-clock {margin-left:auto;white-space:nowrap;color:#efb9dc;}
@media (min-width:761px) and (max-width:1150px) {
  .birthday-shell .desktop {min-height:910px;}
  .birthday-shell .notes-window {left:2%;width:31%;top:9%;}
  .birthday-shell .recording-window {right:34%;width:30%;top:9%;}
  .birthday-shell .cd-window {right:2%;width:31%;top:9%;}
  .birthday-shell .password-panel {top:39%;width:37%;}
  .birthday-shell .photos-window {left:2%;width:32%;top:56%;height:32%;}
  .birthday-shell .files-window {right:2%;width:32%;top:56%;height:32%;}
  .birthday-shell .terminal-window {left:36%;width:28%;top:74%;height:14%;}
  .birthday-shell .handwriting {font-size:11px;}
  .birthday-shell .password-form {flex-wrap:wrap;}
  .birthday-shell .enter-button {flex:1;}
  .birthday-shell .desktop-doodle {display:none;}
}
@media (max-width:760px) {
  .birthday-shell .desktop {min-height:0;padding:54px 12px 58px;display:flex;flex-direction:column;gap:16px;overflow:visible;}
  .birthday-shell .desktop-header {height:36px;font-size:8px;}
  .birthday-shell .desktop-status {display:none;}
  .birthday-shell .desktop-window,.birthday-shell .password-panel {
    position:relative;top:auto;bottom:auto;left:auto;right:auto;
    width:100%;min-width:0;height:auto;rotate:none;transform:none;flex:none;margin:0;
  }
  .birthday-shell .password-panel {order:0;padding:16px;}
  .birthday-shell .password-panel::before {margin:-16px -16px 12px;}
  .birthday-shell .notes-window {order:1;height:300px;}
  .birthday-shell .cd-window {order:2;min-height:225px;}
  .birthday-shell .photos-window {order:3;height:320px;}
  .birthday-shell .files-window {order:4;min-height:245px;}
  .birthday-shell .recording-window {order:5;min-height:160px;}
  .birthday-shell .terminal-window {order:6;min-height:145px;}
  .birthday-shell .handwriting {font-size:12px;}
  .birthday-shell .desktop-sticker,.birthday-shell .desktop-doodle {display:none;}
  .birthday-shell .retro-taskbar {height:35px;}
  .birthday-shell .retro-tab {display:none;}
  .birthday-shell .hint-window {position:fixed;width:min(320px,calc(100vw - 32px));top:30%;right:16px;z-index:150;}
  .birthday-shell .password-form {flex-wrap:wrap;}
  .birthday-shell .enter-button {flex:1;}
}

`;
