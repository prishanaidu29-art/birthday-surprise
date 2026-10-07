'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

/*
===========================================================
  CLAR BIRTHDAY ARCHIVE
  app/page.js

  EVERYTHING FOR THE FRONT PAGE + PASSWORD + LOADING SCREEN
  LIVES IN THIS ONE FILE.

  PUT YOUR REAL FILES IN:

  /public/birthday/

  Example:
  /public/birthday/clar1.jpg
  /public/birthday/clar2.jpg
  /public/birthday/song.mp3
  /public/birthday/background.mp4
  /public/birthday/friend1.mp3
===========================================================
*/


/* =========================================================
   📸 ADD YOUR PHOTOS HERE
   ========================================================= */

const PHOTOS = [
  '/birthday/clar1.jpg',
  '/birthday/clar2.jpg',
  '/birthday/clar3.jpg',
  '/birthday/clar4.jpg',
  '/birthday/clar5.jpg',
]

/* =========================================================
   🎵 ADD YOUR MUSIC HERE
   ========================================================= */

const MUSIC_FILE = '/birthday/song.mp3'

/* =========================================================
   🎬 ADD YOUR VIDEO HERE
   ========================================================= */

const VIDEO_FILE = '/birthday/background.mp4'

/* =========================================================
   🎙️ ADD FRIEND RECORDINGS HERE
   ========================================================= */

const RECORDINGS = {
  friend1: '/birthday/friend1.mp3',
  friend2: '/birthday/friend2.mp3',
}

/* =========================================================
   🔐 CHANGE PASSWORD HERE
   ========================================================= */

const PASSWORD = 'clar'

/* =========================================================
   LOADING MESSAGES
   ========================================================= */

const LOADING_MESSAGES = [
  'BOOTING CLAR_ARCHIVE...',
  'LOCATING QUESTIONABLE MEMORIES...',
  'LOADING FEETGANG.EXE...',
  'SEARCHING FOR EVIDENCE...',
  'RECOVERING LOST FILES...',
  'CHECKING THE EGGS...',
  'LOADING FRIENDS...',
  'RECONSTRUCTING CHAOS...',
  'ACCESSING BIRTHDAY DATA...',
  'ALMOST THERE...',
  'ARCHIVE READY.',
]


export default function HomePage() {

  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [stage, setStage] = useState('desktop')
  // desktop → loading → done

  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(
    LOADING_MESSAGES[0]
  )

  const [photoIndex, setPhotoIndex] = useState(0)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [recordingPlaying, setRecordingPlaying] = useState(false)

  const [audioElement, setAudioElement] = useState(null)
  const [recordingElement, setRecordingElement] = useState(null)

  const [bootTime] = useState(() => Date.now())


  /* =========================================================
     CURRENT PHOTO
     ========================================================= */

  const currentPhoto = useMemo(() => {
    if (!PHOTOS.length) return null
    return PHOTOS[photoIndex % PHOTOS.length]
  }, [photoIndex])


  /* =========================================================
     PHOTO SLIDESHOW DURING LOADING
     ========================================================= */

  useEffect(() => {

    if (stage !== 'loading') return

    const interval = setInterval(() => {

      setPhotoIndex((previous) => {

        if (!PHOTOS.length) return 0

        return (previous + 1) % PHOTOS.length

      })

    }, 650)

    return () => clearInterval(interval)

  }, [stage])


  /* =========================================================
     LOADING PROGRESS
     ========================================================= */

  useEffect(() => {

    if (stage !== 'loading') return

    setProgress(0)

    let value = 0

    const interval = setInterval(() => {

      value += Math.floor(Math.random() * 7) + 2

      if (value >= 100) {
        value = 100
        clearInterval(interval)

        setTimeout(() => {
          setStage('done')

          sessionStorage.setItem(
            'birthday_authenticated',
            'true'
          )

          router.push('/birthday')

        }, 700)
      }

      setProgress(value)

      const messageIndex = Math.min(
        LOADING_MESSAGES.length - 1,
        Math.floor(value / 10)
      )

      setLoadingMessage(
        LOADING_MESSAGES[messageIndex]
      )

    }, 120)

    return () => clearInterval(interval)

  }, [stage, router])


  /* =========================================================
     MUSIC
     ========================================================= */

  const toggleMusic = () => {

    if (!MUSIC_FILE) return

    if (!audioElement) {

      const audio = new Audio(MUSIC_FILE)

      audio.loop = true
      audio.volume = 0.55

      audio.play()
        .then(() => {
          setAudioElement(audio)
          setMusicPlaying(true)
        })
        .catch(() => {
          setMusicPlaying(false)
        })

      return
    }

    if (musicPlaying) {

      audioElement.pause()
      setMusicPlaying(false)

    } else {

      audioElement.play()
        .then(() => setMusicPlaying(true))
        .catch(() => {})

    }
  }


  /* =========================================================
     FRIEND RECORDING
     ========================================================= */

  const toggleRecording = () => {

    const file = RECORDINGS.friend1

    if (!file) return

    if (!recordingElement) {

      const audio = new Audio(file)

      audio.volume = 1

      audio.onended = () => {
        setRecordingPlaying(false)
      }

      audio.play()
        .then(() => {
          setRecordingElement(audio)
          setRecordingPlaying(true)
        })
        .catch(() => {
          setRecordingPlaying(false)
        })

      return
    }

    if (recordingPlaying) {

      recordingElement.pause()
      setRecordingPlaying(false)

    } else {

      recordingElement.play()
        .then(() => setRecordingPlaying(true))
        .catch(() => {})

    }
  }


  /* =========================================================
     PASSWORD
     ========================================================= */

  const handlePassword = (event) => {

    event.preventDefault()

    if (
      password.trim().toLowerCase() ===
      PASSWORD.toLowerCase()
    ) {

      setError('')
      setStage('loading')

    } else {

      setError('WRONG PASSWORD. NICE TRY THOUGH.')

      setPassword('')

    }
  }


  /* =========================================================
     LOADING SCREEN
     ========================================================= */

  if (stage === 'loading') {

    return (

      <main className="loading-screen">

        <div className="crt-noise" />
        <div className="scanlines" />

        <div className="loading-grid" />

        {/* floating decorations */}

        <div className="floating-star star-one">✦</div>
        <div className="floating-star star-two">✧</div>
        <div className="floating-star star-three">★</div>

        <div className="loading-top">

          <span>CLAR_OS</span>

          <span>
            SYSTEM TIME // {new Date().toLocaleTimeString()}
          </span>

        </div>


        <section className="loading-window">

          <div className="window-bar">

            <div className="window-title">
              <span className="window-icon">◈</span>
              CLAR_BIRTHDAY_ARCHIVE.EXE
            </div>

            <div className="window-controls">
              <span>—</span>
              <span>□</span>
              <span>×</span>
            </div>

          </div>


          <div className="loading-content">

            <div className="loading-left">

              <div className="boot-label">
                SYSTEM BOOT
              </div>

              <h1
                className="glitch"
                data-text="ACCESSING"
              >
                ACCESSING
              </h1>

              <h2>
                CLAR'S ARCHIVE
              </h2>

              <div className="terminal">

                <div>
                  &gt; {loadingMessage}
                </div>

                <div>
                  &gt; MEMORY_INDEX:
                  {' '}
                  {String(
                    Math.min(
                      99,
                      Math.floor(progress * 0.99)
                    )
                  ).padStart(2, '0')}
                </div>

                <div>
                  &gt; STATUS:
                  {' '}
                  <span className="lime">
                    {progress >= 100
                      ? 'COMPLETE'
                      : 'READING'}
                  </span>
                </div>

                <div className="terminal-cursor">
                  █
                </div>

              </div>


              {/* progress */}

              <div className="progress-wrapper">

                <div className="progress-header">

                  <span>
                    LOADING FILES
                  </span>

                  <span>
                    {progress}%
                  </span>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`
                    }}
                  />

                </div>

              </div>


              {/* fake file activity */}

              <div className="file-activity">

                <div>
                  <span className="dot pink" />
                  PHOTO_DATABASE
                  <span>OK</span>
                </div>

                <div>
                  <span className="dot blue" />
                  CHAOS_FILES
                  <span>OK</span>
                </div>

                <div>
                  <span className="dot yellow" />
                  FRIEND_RECORDINGS
                  <span>OK</span>
                </div>

                <div>
                  <span className="dot lime" />
                  BIRTHDAY_PROTOCOL
                  <span>OK</span>
                </div>

              </div>

            </div>


            {/* PHOTO REEL */}

            <div className="loading-right">

              <div className="photo-reel-label">
                MEMORY BUFFER
              </div>

              <div className="photo-reel">

                {currentPhoto ? (

                  <img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt="Loading memory"
                    className="loading-photo"
                  />

                ) : (

                  <div className="photo-placeholder">
                    NO PHOTO
                  </div>

                )}

                <div className="photo-overlay">
                  REC
                </div>

                <div className="photo-counter">
                  IMG_
                  {String(photoIndex + 1).padStart(3, '0')}
                </div>

              </div>


              <div className="mini-film">

                {[0, 1, 2, 3, 4].map((item) => {

                  const image =
                    PHOTOS[
                      (photoIndex + item) %
                      PHOTOS.length
                    ]

                  return (

                    <div
                      key={item}
                      className="film-frame"
                    >

                      {image ? (

                        <img
                          src={image}
                          alt=""
                        />

                      ) : (

                        <span>
                          ?
                        </span>

                      )}

                    </div>

                  )

                })}

              </div>

            </div>

          </div>


          <div className="loading-footer">

            <span>
              © DVA SYSTEMS
            </span>

            <span>
              DO NOT PANIC
            </span>

            <span>
              PLEASE WAIT...
            </span>

          </div>

        </section>


        {/* spinning CD */}

        <div className="loading-cd">

          <div className="cd-inner">
            CLAR
          </div>

        </div>


        <div className="loading-status">
          PLEASE WAIT
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </div>

      </main>

    )
  }


  /* =========================================================
     MAIN STARTING DESKTOP
     ========================================================= */

  return (

    <main className="desktop">

      <div className="crt-noise" />
      <div className="scanlines" />

      {/* =====================================================
          TOP SYSTEM BAR
          ===================================================== */}

      <div className="system-bar">

        <div>
          CLAR_OS
        </div>

        <div className="system-center">
          BIRTHDAY_ARCHIVE // 2004—2026
        </div>

        <div>
          <span className="online-dot" />
          ONLINE
        </div>

      </div>


      {/* =====================================================
          BACKGROUND VIDEO
          ===================================================== */}

      {VIDEO_FILE && (

        <video
          className="background-video"
          src={VIDEO_FILE}
          autoPlay
          muted
          loop
          playsInline
        />

      )}


      {/* =====================================================
          BACKGROUND GRAPHICS
          ===================================================== */}

      <div className="background-shapes">

        <div className="shape shape-one" />
        <div className="shape shape-two" />
        <div className="shape shape-three" />

      </div>


      {/* =====================================================
          FLOATING PIXELS
          ===================================================== */}

      <div className="pixel pixel-1">✦</div>
      <div className="pixel pixel-2">✧</div>
      <div className="pixel pixel-3">★</div>
      <div className="pixel pixel-4">+</div>
      <div className="pixel pixel-5">×</div>
      <div className="pixel pixel-6">◆</div>


      {/* =====================================================
          MAIN DESKTOP
          ===================================================== */}

      <div className="desktop-area">


        {/* ===================================================
            NOTES WINDOW
            =================================================== */}

        <section className="window notes-window">

          <div className="window-bar yellow-bar">

            <div>
              📝 NOTES.EXE
            </div>

            <div className="window-controls">
              — □ ×
            </div>

          </div>

          <div className="notes-paper">

            <div className="scribble">
              YAYYYY
            </div>

            <p>
              happy birthday Clar !!!
            </p>

            <p>
              if you're seeing this,
              <br />
              it means the website
              <br />
              is actually working
            </p>

            <p className="small-scribble">
              (thank god)
            </p>

            <div className="arrow">
              ↓↓↓
            </div>

            <p className="highlight">
              now enter the password
            </p>

            <p>
              good luck lol
            </p>

          </div>

        </section>


        {/* ===================================================
            MUSIC PLAYER
            =================================================== */}

        <section className="window music-window">

          <div className="window-bar pink-bar">

            <div>
              💿 MUSIC PLAYER
            </div>

            <div>
              ×
            </div>

          </div>

          <div className="music-content">

            <div
              className={`cd ${musicPlaying ? 'spinning' : ''}`}
              onClick={toggleMusic}
            >

              <div className="cd-label">
                CLAR
              </div>

            </div>

            <div className="music-info">

              <div className="now-playing">
                NOW PLAYING
              </div>

              <strong>
                birthday mixtape.mp3
              </strong>

              <span>
                selected with questionable taste
              </span>

              <button
                onClick={toggleMusic}
                className="play-button"
              >
                {musicPlaying
                  ? '❚❚ PAUSE'
                  : '▶ PLAY'}
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            PHOTO WINDOW
            =================================================== */}

        <section className="window photo-window">

          <div className="window-bar blue-bar">

            <div>
              🖼️ PHOTO_VIEWER
            </div>

            <div>
              ×
            </div>

          </div>

          <div className="photo-viewer">

            {currentPhoto ? (

              <img
                src={currentPhoto}
                alt="Clar memory"
              />

            ) : (

              <div className="image-missing">
                ADD PHOTOS
              </div>

            )}

            <div className="photo-stamp">
              MEMORIES_001
            </div>

          </div>

          <div className="photo-controls">

            <button
              onClick={() =>
                setPhotoIndex(
                  (photoIndex - 1 + PHOTOS.length) %
                  PHOTOS.length
                )
              }
            >
              ◀
            </button>

            <span>
              {photoIndex + 1} / {PHOTOS.length}
            </span>

            <button
              onClick={() =>
                setPhotoIndex(
                  (photoIndex + 1) %
                  PHOTOS.length
                )
              }
            >
              ▶
            </button>

          </div>

        </section>


        {/* ===================================================
            FILES WINDOW
            =================================================== */}

        <section className="window files-window">

          <div className="window-bar purple-bar">

            <div>
              📁 MY FILES
            </div>

            <div>
              ×
            </div>

          </div>

          <div className="file-grid">

            <div className="file">
              <div className="folder">📂</div>
              <span>FEETGANG</span>
              <small>?? files</small>
            </div>

            <div className="file">
              <div className="folder">📂</div>
              <span>EGGS</span>
              <small>classified</small>
            </div>

            <div className="file">
              <div className="folder">📂</div>
              <span>GRADUATION</span>
              <small>memories</small>
            </div>

            <div className="file">
              <div className="folder">📂</div>
              <span>CHAOS</span>
              <small>danger</small>
            </div>

            <div className="file">
              <div className="folder">📂</div>
              <span>PHOTOS</span>
              <small>{PHOTOS.length} files</small>
            </div>

            <div className="file">
              <div className="folder">📂</div>
              <span>???</span>
              <small>locked</small>
            </div>

          </div>

        </section>


        {/* ===================================================
            FRIEND RECORDING
            =================================================== */}

        <section className="window recording-window">

          <div className="window-bar lime-bar">

            <div>
              🎙️ VOICE_MESSAGE.wav
            </div>

            <div>
              ×
            </div>

          </div>

          <div className="recording-content">

            <div className="cassette">

              <div className="cassette-hole">
                ●
              </div>

              <div className="cassette-label">
                FOR CLAR
              </div>

              <div className="cassette-hole">
                ●
              </div>

            </div>

            <div className="recording-info">

              <span>
                INCOMING MESSAGE
              </span>

              <strong>
                from: one of your idiots
              </strong>

              <div className="waveform">

                {Array.from({
                  length: 24
                }).map((_, index) => (

                  <i
                    key={index}
                    style={{
                      height:
                        `${20 +
                          Math.random() * 55}%`
                    }}
                  />

                ))}

              </div>

              <button
                onClick={toggleRecording}
                className="record-button"
              >
                {recordingPlaying
                  ? '❚❚ STOP MESSAGE'
                  : '▶ PLAY MESSAGE'}
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            PASSWORD WINDOW
            =================================================== */}

        <section className="password-window">

          <div className="password-header">

            <span>
              🔐
            </span>

            <div>

              <small>
                RESTRICTED ACCESS
              </small>

              <strong>
                CLAR_ARCHIVE
              </strong>

            </div>

            <span>
              01
            </span>

          </div>


          <div className="password-body">

            <p className="password-intro">
              yayyy happy birthday Clar !!!
            </p>

            <p className="password-sub">
              if you see this it means the website
              is working (thank god)
            </p>

            <p className="password-sub">
              now you just need to enter the password
              to enter. Good luck !
            </p>


            <form
              onSubmit={handlePassword}
              className="password-form"
            >

              <label>
                ENTER PASSWORD
              </label>

              <div className="password-row">

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="off"
                />

                <button type="submit">
                  ENTER →
                </button>

              </div>

              {error && (

                <div className="password-error">
                  ⚠ {error}
                </div>

              )}

            </form>

          </div>

        </section>


        {/* ===================================================
            VHS WINDOW
            =================================================== */}

        <div className="vhs-overlay">

          <div>
            PLAY
          </div>

          <div>
            SP
          </div>

          <div>
            00:19:11
          </div>

        </div>


        {/* ===================================================
            SMALL SYSTEM WINDOWS
            =================================================== */}

        <div className="mini-window mini-one">

          <div className="mini-title">
            SYSTEM
          </div>

          <div>
            MEMORY: 99%
          </div>

          <div>
            CHAOS: HIGH
          </div>

        </div>


        <div className="mini-window mini-two">

          <div className="mini-title">
            WARNING
          </div>

          <div className="warning-text">
            TOO MUCH LOVE
          </div>

        </div>


      </div>


      {/* =====================================================
          BOTTOM DOCK
          ===================================================== */}

      <div className="bottom-dock">

        <span>
          ◉ CLAR_OS
        </span>

        <span>
          📁
        </span>

        <span>
          💿
        </span>

        <span>
          🎞️
        </span>

        <span>
          ♡
        </span>

        <span className="dock-time">
          19:11:04
        </span>

      </div>


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
          background: #8f8bd8;
        }

        body {
          overflow-x: hidden;
        }

        button,
        input {
          font: inherit;
        }


        /* =====================================================
           DESKTOP
           ===================================================== */

        .desktop {
          min-height: 100vh;
          position: relative;
          overflow: hidden;

          color: #17152b;

          background:
            radial-gradient(
              circle at 15% 20%,
              #b9f5ff 0%,
              transparent 24%
            ),
            radial-gradient(
              circle at 85% 15%,
              #ff83cf 0%,
              transparent 22%
            ),
            radial-gradient(
              circle at 70% 80%,
              #b7ff88 0%,
              transparent 22%
            ),
            linear-gradient(
              135deg,
              #8c89dc,
              #aaa5ee 40%,
              #77c9df 100%
            );
        }


        /* =====================================================
           CRT EFFECT
           ===================================================== */

        .crt-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: .13;

          background-image:
            repeating-radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,.5) 0,
              rgba(255,255,255,.5) 1px,
              transparent 1px,
              transparent 3px
            );

          mix-blend-mode: overlay;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 101;

          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 3px,
              rgba(20,10,50,.09) 4px
            );

          opacity: .55;
        }


        /* =====================================================
           SYSTEM BAR
           ===================================================== */

        .system-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 34px;

          z-index: 80;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 14px;

          background: #17152b;
          color: #eaffff;

          font-family:
            "Courier New",
            monospace;

          font-size: 10px;
          letter-spacing: .16em;

          border-bottom: 2px solid #ff4ecb;
        }

        .system-center {
          color: #75f7ff;
        }

        .online-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 5px;

          border-radius: 50%;

          background: #baff36;

          box-shadow:
            0 0 8px #baff36;
        }


        /* =====================================================
           VIDEO
           ===================================================== */

        .background-video {
          position: fixed;
          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: cover;

          opacity: .16;

          mix-blend-mode: multiply;

          pointer-events: none;
        }


        /* =====================================================
           BACKGROUND GRAPHICS
           ===================================================== */

        .background-shapes {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;

          border: 2px solid rgba(255,255,255,.35);

          animation:
            floatShape
            8s
            ease-in-out
            infinite;
        }

        .shape-one {
          width: 170px;
          height: 170px;

          top: 13%;
          right: 8%;

          border-radius: 50%;

          border-color: #ff4ecb;
        }

        .shape-two {
          width: 120px;
          height: 120px;

          bottom: 13%;
          left: 5%;

          transform: rotate(45deg);

          border-color: #baff36;
        }

        .shape-three {
          width: 80px;
          height: 80px;

          top: 45%;
          left: 48%;

          border-color: #75f7ff;

          animation-delay: -3s;
        }

        @keyframes floatShape {

          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-25px)
              rotate(25deg);
          }

        }


        /* =====================================================
           DESKTOP AREA
           ===================================================== */

        .desktop-area {
          position: relative;

          min-height: 100vh;

          padding:
            58px
            20px
            70px;

          max-width: 1500px;

          margin: auto;
        }


        /* =====================================================
           WINDOWS
           ===================================================== */

        .window {
          position: absolute;

          background: rgba(238,242,255,.92);

          border:
            2px solid
            #17152b;

          box-shadow:
            7px 8px 0
            rgba(27,20,55,.35),

            0 0 30px
            rgba(255,255,255,.25);

          backdrop-filter: blur(5px);

          overflow: hidden;

          animation:
            windowFloat
            7s
            ease-in-out
            infinite;
        }

        @keyframes windowFloat {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-5px);
          }

        }


        .window-bar {
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 9px;

          font-family:
            "Courier New",
            monospace;

          font-size: 10px;
          font-weight: bold;

          letter-spacing: .08em;

          border-bottom:
            2px solid
            #17152b;
        }

        .yellow-bar {
          background: #ffe85b;
        }

        .pink-bar {
          background: #ff69c7;
        }

        .blue-bar {
          background: #67e9ff;
        }

        .purple-bar {
          background: #b899ff;
        }

        .lime-bar {
          background: #baff36;
        }

        .window-controls {
          letter-spacing: 4px;
        }


        /* =====================================================
           NOTES
           ===================================================== */

        .notes-window {

          width: 280px;

          top: 90px;
          left: 4%;

          transform:
            rotate(-2deg);

          z-index: 12;
        }

        .notes-paper {

          padding: 20px;

          min-height: 280px;

          background:
            repeating-linear-gradient(
              to bottom,
              #fffbd6 0,
              #fffbd6 23px,
              #cdd9e8 24px
            );

          font-family:
            "Comic Sans MS",
            cursive;

          color: #282042;

          font-size: 15px;

          line-height: 23px;
        }

        .scribble {

          color: #ff3eb5;

          font-size: 30px;

          font-weight: bold;

          transform:
            rotate(-4deg);

          text-shadow:
            2px 2px #75f7ff;
        }

        .small-scribble {

          color: #7e6aa8;

          transform:
            rotate(2deg);
        }

        .arrow {

          color: #ff4ecb;

          font-size: 25px;
        }

        .highlight {

          display: inline;

          background:
            #baff36;

          padding: 2px 5px;

          transform:
            rotate(-1deg);
        }


        /* =====================================================
           MUSIC
           ===================================================== */

        .music-window {

          width: 340px;

          top: 75px;
          right: 7%;

          z-index: 15;

          transform:
            rotate(2deg);

          animation-delay:
            -2s;
        }

        .music-content {

          padding: 20px;

          display: flex;

          align-items: center;

          gap: 18px;

          background:
            linear-gradient(
              135deg,
              #f5eaff,
              #d7faff
            );
        }

        .cd {

          width: 105px;
          height: 105px;

          flex-shrink: 0;

          border-radius: 50%;

          cursor: pointer;

          background:
            conic-gradient(
              #ff4ecb,
              #75f7ff,
              #baff36,
              #ffed4f,
              #ff4ecb
            );

          border:
            4px solid
            #fff;

          box-shadow:
            0 0 20px
            rgba(255,78,203,.7);

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cd::before {

          content: "";

          position: absolute;

          width: 34px;
          height: 34px;

          border-radius: 50%;

          background:
            #e8e5ff;

          border:
            2px solid
            #17152b;
        }

        .cd-label {

          z-index: 2;

          font-size: 9px;

          font-weight: bold;

          font-family:
            monospace;

          color: #17152b;
        }

        .spinning {

          animation:
            spinCD
            2s
            linear
            infinite;
        }

        @keyframes spinCD {

          to {
            transform:
              rotate(360deg);
          }

        }

        .music-info {

          display: flex;

          flex-direction: column;

          gap: 5px;

          font-family:
            "Courier New",
            monospace;
        }

        .now-playing {

          color:
            #ff2caf;

          font-size:
            9px;

          letter-spacing:
            .15em;
        }

        .music-info strong {

          font-size:
            13px;
        }

        .music-info span {

          font-size:
            9px;

          color:
            #69627f;
        }

        .play-button {

          margin-top:
            8px;

          padding:
            7px 12px;

          border:
            2px solid
            #17152b;

          background:
            #baff36;

          cursor:
            pointer;

          font-size:
            10px;

          font-weight:
            bold;

          box-shadow:
            3px 3px 0
            #17152b;
        }

        .play-button:active {

          transform:
            translate(
              2px,
              2px
            );

          box-shadow:
            1px 1px 0
            #17152b;
        }


        /* =====================================================
           PHOTO
           ===================================================== */

        .photo-window {

          width: 310px;

          top: 330px;
          left: 9%;

          z-index: 11;

          transform:
            rotate(1.5deg);
        }

        .photo-viewer {

          height: 215px;

          padding: 12px;

          position: relative;

          background:
            #242039;

          overflow: hidden;
        }

        .photo-viewer img {

          width: 100%;
          height: 100%;

          object-fit: cover;

          filter:
            saturate(1.3)
            contrast(1.08);

          transition:
            .4s;
        }

        .photo-viewer img:hover {

          transform:
            scale(1.05);

        }

        .image-missing {

          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          color:
            #75f7ff;

          font-family:
            monospace;

          background:
            repeating-linear-gradient(
              45deg,
              #30284d,
              #30284d 10px,
              #211b39 10px,
              #211b39 20px
            );
        }

        .photo-stamp {

          position: absolute;

          bottom: 15px;
          right: 15px;

          padding:
            4px 7px;

          background:
            #ff4ecb;

          color:
            white;

          font:
            bold 9px monospace;

          transform:
            rotate(-4deg);
        }

        .photo-controls {

          display: flex;

          justify-content:
            space-between;

          align-items:
            center;

          padding:
            8px 12px;

          background:
            #b899ff;

          font:
            bold 10px monospace;
        }

        .photo-controls button {

          border:
            1px solid
            #17152b;

          background:
            #75f7ff;

          cursor:
            pointer;

          padding:
            3px 9px;
        }


        /* =====================================================
           FILES
           ===================================================== */

        .files-window {

          width: 420px;

          bottom: 105px;
          right: 7%;

          z-index: 13;

          transform:
            rotate(-1deg);
        }

        .file-grid {

          display:
            grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap:
            12px;

          padding:
            18px;

          background:
            #f3efff;
        }

        .file {

          text-align:
            center;

          cursor:
            pointer;

          padding:
            8px 4px;

          border:
            1px dashed
            transparent;

          transition:
            .2s;
        }

        .file:hover {

          background:
            #d9fbff;

          border-color:
            #ff4ecb;

          transform:
            translateY(-4px)
            rotate(-2deg);
        }

        .folder {

          font-size:
            34px;

          filter:
            drop-shadow(
              2px 2px 0
              #ff4ecb
            );
        }

        .file span {

          display:
            block;

          font:
            bold 9px monospace;

          color:
            #282042;
        }

        .file small {

          display:
            block;

          margin-top:
            3px;

          font:
            7px monospace;

          color:
            #756e91;
        }


        /* =====================================================
           RECORDING
           ===================================================== */

        .recording-window {

          width:
            440px;

          bottom:
            105px;

          left:
            50%;

          transform:
            translateX(-50%)
            rotate(.5deg);

          z-index:
            20;

          background:
            #efffe2;
        }

        .recording-content {

          display:
            flex;

          gap:
            20px;

          padding:
            17px;

          align-items:
            center;
        }

        .cassette {

          width:
            150px;

          height:
            80px;

          flex-shrink:
            0;

          background:
            #27233b;

          border:
            3px solid
            #151225;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-around;

          color:
            #baff36;

          box-shadow:
            inset 0 0 0 5px
            #4a4461;
        }

        .cassette-hole {

          width:
            27px;

          height:
            27px;

          border-radius:
            50%;

          background:
            #ddd9ec;

          border:
            5px solid
            #151225;

          color:
            #151225;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }

        .cassette-label {

          font:
            bold 9px monospace;

          color:
            #ff5acb;
        }

        .recording-info {

          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;

          font-family:
            monospace;
        }

        .recording-info > span {

          font-size:
            8px;

          color:
            #7a35d8;
        }

        .recording-info strong {

          font-size:
            10px;
        }

        .waveform {

          height:
            32px;

          display:
            flex;

          align-items:
            center;

          gap:
            2px;
        }

        .waveform i {

          display:
            block;

          width:
            3px;

          background:
            #ff4ecb;

          animation:
            wave
            .7s
            ease-in-out
            infinite
            alternate;
        }

        .waveform i:nth-child(2n) {
          background:
            #75f7ff;
        }

        .waveform i:nth-child(3n) {
          background:
            #8d5cff;
        }

        @keyframes wave {

          from {
            transform:
              scaleY(.5);
          }

          to {
            transform:
              scaleY(1.2);
          }

        }

        .record-button {

          border:
            2px solid
            #17152b;

          background:
            #ff4ecb;

          color:
            white;

          padding:
            7px 10px;

          font:
            bold 9px monospace;

          cursor:
            pointer;

          box-shadow:
            3px 3px 0
            #17152b;
        }


        /* =====================================================
           PASSWORD
           ===================================================== */

        .password-window {

          position:
            absolute;

          width:
            min(520px, 90vw);

          top:
            47%;

          left:
            50%;

          transform:
            translate(-50%, -50%)
            rotate(-.7deg);

          z-index:
            40;

          background:
            #19162d;

          color:
            #fff;

          border:
            3px solid
            #75f7ff;

          box-shadow:
            10px 10px 0
            #ff4ecb,

            -8px -8px 0
            #baff36,

            0 0 50px
            rgba(117,247,255,.4);
        }

        .password-header {

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            12px 15px;

          background:
            linear-gradient(
              90deg,
              #7549ff,
              #ff3eb5
            );

          border-bottom:
            2px solid
            #75f7ff;

          font-family:
            monospace;
        }

        .password-header > span {

          font-size:
            20px;
        }

        .password-header div {

          flex:
            1;

          margin-left:
            12px;
        }

        .password-header small {

          display:
            block;

          font-size:
            7px;

          color:
            #baffff;

          letter-spacing:
            .2em;
        }

        .password-header strong {

          display:
            block;

          font-size:
            15px;

          letter-spacing:
            .1em;
        }

        .password-body {

          padding:
            25px;
        }

        .password-intro {

          margin:
            0 0 8px;

          font-family:
            "Comic Sans MS",
            cursive;

          font-size:
            22px;

          color:
            #ffe95b;

          transform:
            rotate(-1deg);
        }

        .password-sub {

          margin:
            4px 0;

          color:
            #c8c2df;

          font:
            11px/1.5
            "Courier New",
            monospace;
        }

        .password-form {

          margin-top:
            22px;
        }

        .password-form label {

          display:
            block;

          margin-bottom:
            7px;

          color:
            #75f7ff;

          font:
            bold 9px monospace;

          letter-spacing:
            .18em;
        }

        .password-row {

          display:
            flex;

          gap:
            8px;
        }

        .password-row input {

          min-width:
            0;

          flex:
            1;

          border:
            2px solid
            #7e67d8;

          background:
            #0d0b19;

          color:
            #baff36;

          outline:
            none;

          padding:
            12px;

          font:
            bold 13px monospace;

          box-shadow:
            inset 0 0 15px
            rgba(117,247,255,.08);
        }

        .password-row input:focus {

          border-color:
            #ff4ecb;

          box-shadow:
            0 0 12px
            rgba(255,78,203,.5);
        }

        .password-row button {

          border:
            2px solid
            #17152b;

          background:
            #baff36;

          color:
            #17152b;

          padding:
            0 17px;

          cursor:
            pointer;

          font:
            bold 11px monospace;

          box-shadow:
            4px 4px 0
            #ff4ecb;
        }

        .password-row button:hover {

          background:
            #75f7ff;

          transform:
            translate(
              -2px,
              -2px
            );
        }

        .password-error {

          margin-top:
            10px;

          color:
            #ff6b6b;

          font:
            bold 9px monospace;

          animation:
            glitchText
            .25s
            infinite;
        }


        /* =====================================================
           VHS
           ===================================================== */

        .vhs-overlay {

          position:
            fixed;

          right:
            18px;

          bottom:
            48px;

          z-index:
            70;

          display:
            flex;

          gap:
            18px;

          color:
            white;

          font:
            9px monospace;

          text-shadow:
            2px 0 #ff4ecb,
            -2px 0 #75f7ff;
        }


        /* =====================================================
           MINI WINDOWS
           ===================================================== */

        .mini-window {

          position:
            absolute;

          z-index:
            8;

          padding:
            9px;

          width:
            145px;

          background:
            #ffffe7;

          border:
            2px solid
            #17152b;

          box-shadow:
            4px 4px 0
            #ff4ecb;

          font:
            8px/1.7 monospace;
        }

        .mini-title {

          margin:
            -9px -9px 7px;

          padding:
            4px 7px;

          background:
            #75f7ff;

          border-bottom:
            2px solid
            #17152b;

          font-weight:
            bold;
        }

        .mini-one {

          top:
            270px;

          right:
            25%;
        }

        .mini-two {

          bottom:
            200px;

          left:
            27%;
        }

        .warning-text {

          color:
            #ff2faf;

          font-weight:
            bold;

          animation:
            blink
            1s
            steps(2)
            infinite;
        }


        /* =====================================================
           BOTTOM DOCK
           ===================================================== */

        .bottom-dock {

          position:
            fixed;

          bottom:
            0;

          left:
            0;

          right:
            0;

          height:
            32px;

          z-index:
            90;

          background:
            #17152b;

          border-top:
            2px solid
            #75f7ff;

          color:
            white;

          display:
            flex;

          align-items:
            center;

          gap:
            20px;

          padding:
            0 14px;

          font:
            9px monospace;
        }

        .dock-time {

          margin-left:
            auto;

          color:
            #baff36;
        }


        /* =====================================================
           PIXELS
           ===================================================== */

        .pixel {

          position:
            fixed;

          z-index:
            5;

          font-size:
            24px;

          pointer-events:
            none;

          animation:
            glitchFloat
            4s
            ease-in-out
            infinite;
        }

        .pixel-1 {
          top: 20%;
          left: 48%;
          color: #ff4ecb;
        }

        .pixel-2 {
          top: 70%;
          left: 4%;
          color: #75f7ff;
        }

        .pixel-3 {
          top: 35%;
          right: 4%;
          color: #baff36;
        }

        .pixel-4 {
          bottom: 18%;
          left: 44%;
          color: #ffe85b;
        }

        .pixel-5 {
          top: 80%;
          right: 30%;
          color: #ff4ecb;
        }

        .pixel-6 {
          top: 11%;
          left: 33%;
          color: #75f7ff;
        }

        @keyframes glitchFloat {

          0%,
          100% {
            transform:
              translate(0,0)
              rotate(0deg);
          }

          30% {
            transform:
              translate(5px,-8px)
              rotate(10deg);
          }

          55% {
            transform:
              translate(-7px,5px)
              rotate(-7deg);
          }

        }


        /* =====================================================
           LOADING SCREEN
           ===================================================== */

        .loading-screen {

          min-height:
            100vh;

          position:
            relative;

          overflow:
            hidden;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          background:
            radial-gradient(
              circle at 20% 20%,
              #ff4ecb 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at 80% 70%,
              #75f7ff 0%,
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #19152f,
              #302263,
              #162c55
            );

          color:
            white;

          font-family:
            "Courier New",
            monospace;
        }

        .loading-grid {

          position:
            absolute;

          inset:
            0;

          background-image:
            linear-gradient(
              rgba(117,247,255,.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(117,247,255,.12) 1px,
              transparent 1px
            );

          background-size:
            35px 35px;

          transform:
            perspective(400px)
            rotateX(55deg)
            scale(2);

          transform-origin:
            bottom;

          opacity:
            .5;
        }

        .loading-top {

          position:
            absolute;

          top:
            25px;

          left:
            30px;

          right:
            30px;

          display:
            flex;

          justify-content:
            space-between;

          color:
            #75f7ff;

          font-size:
            9px;

          letter-spacing:
            .16em;
        }

        .loading-window {

          width:
            min(1000px, 92vw);

          position:
            relative;

          z-index:
            10;

          border:
            3px solid
            #75f7ff;

          background:
            rgba(16,12,35,.94);

          box-shadow:
            12px 12px 0
            #ff4ecb,

            -7px -7px 0
            #baff36,

            0 0 70px
            rgba(117,247,255,.35);
        }

        .loading-content {

          display:
            grid;

          grid-template-columns:
            1.2fr .8fr;

          min-height:
            510px;
        }

        .loading-left {

          padding:
            40px;

          border-right:
            2px solid
            #4f467a;
        }

        .boot-label {

          display:
            inline-block;

          padding:
            5px 9px;

          background:
            #ff4ecb;

          color:
            white;

          font-size:
            8px;

          font-weight:
            bold;

          margin-bottom:
            20px;
        }

        .loading-left h1 {

          margin:
            0;

          font-size:
            clamp(48px, 8vw, 90px);

          line-height:
            .8;

          letter-spacing:
            -.07em;

          color:
            #75f7ff;
        }

        .loading-left h2 {

          margin:
            10px 0 30px;

          font-size:
            clamp(18px, 3vw, 30px);

          color:
            #ffe85b;

          text-shadow:
            4px 0 #ff4ecb;
        }

        .glitch {

          position:
            relative;

          animation:
            glitchText
            2s
            infinite;
        }

        @keyframes glitchText {

          0%,
          90%,
          100% {
            transform:
              translate(0);
          }

          92% {
            transform:
              translate(-4px, 2px);

            text-shadow:
              4px 0 #ff4ecb,
              -4px 0 #75f7ff;
          }

          94% {
            transform:
              translate(5px,-2px);

            text-shadow:
              -5px 0 #ff4ecb,
              5px 0 #baff36;
          }

          96% {
            transform:
              translate(-2px,0);
          }

        }

        .terminal {

          padding:
            16px;

          background:
            #08070e;

          border:
            1px solid
            #594e88;

          color:
            #a7a0c9;

          font-size:
            10px;

          line-height:
            2;

          box-shadow:
            inset 0 0 30px
            rgba(117,247,255,.05);
        }

        .lime {
          color:
            #baff36;
        }

        .terminal-cursor {

          color:
            #75f7ff;

          animation:
            blink
            .7s
            steps(2)
            infinite;
        }

        @keyframes blink {

          50% {
            opacity:
              0;
          }

        }

        .progress-wrapper {

          margin-top:
            25px;
        }

        .progress-header {

          display:
            flex;

          justify-content:
            space-between;

          margin-bottom:
            7px;

          font-size:
            9px;

          color:
            #75f7ff;
        }

        .progress-track {

          height:
            15px;

          border:
            2px solid
            #75f7ff;

          background:
            #090812;

          padding:
            2px;
        }

        .progress-fill {

          height:
            100%;

          background:
            linear-gradient(
              90deg,
              #ff4ecb,
              #b899ff,
              #75f7ff,
              #baff36
            );

          box-shadow:
            0 0 15px
            #75f7ff;

          transition:
            width .1s linear;
        }

        .file-activity {

          margin-top:
            25px;

          display:
            grid;

          gap:
            7px;

          font-size:
            8px;

          color:
            #827aa4;
        }

        .file-activity div {

          display:
            flex;

          align-items:
            center;

          gap:
            8px;
        }

        .file-activity div span:last-child {

          margin-left:
            auto;

          color:
            #baff36;
        }

        .dot {

          width:
            6px;

          height:
            6px;

          border-radius:
            50%;
        }

        .pink {
          background:
            #ff4ecb;
        }

        .blue {
          background:
            #75f7ff;
        }

        .yellow {
          background:
            #ffe85b;
        }

        .lime {
          background:
            #baff36;
        }

        .loading-right {

          padding:
            30px;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            center;
        }

        .photo-reel-label {

          color:
            #ff4ecb;

          font-size:
            9px;

          margin-bottom:
            10px;
        }

        .photo-reel {

          height:
            310px;

          position:
            relative;

          padding:
            10px;

          background:
            #05050a;

          border:
            3px solid
            #baff36;

          overflow:
            hidden;

          box-shadow:
            0 0 25px
            rgba(186,255,54,.25);
        }

        .loading-photo {

          width:
            100%;

          height:
            100%;

          object-fit:
            cover;

          animation:
            photoFlash
            .65s
            steps(2)
            infinite;

          filter:
            saturate(1.5)
            contrast(1.15);
        }

        @keyframes photoFlash {

          0% {
            opacity:
              1;
          }

          92% {
            opacity:
              1;
          }

          95% {
            opacity:
              .3;
          }

          98% {
            opacity:
              1;
          }

        }

        .photo-placeholder {

          height:
            100%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #ff4ecb;

          font-size:
            20px;
        }

        .photo-overlay {

          position:
            absolute;

          top:
            18px;

          left:
            18px;

          background:
            #ff3355;

          color:
            white;

          padding:
            4px 7px;

          font-size:
            8px;

          animation:
            blink
            1s
            steps(2)
            infinite;
        }

        .photo-counter {

          position:
            absolute;

          right:
            18px;

          bottom:
            18px;

          padding:
            4px 7px;

          background:
            #17152b;

          color:
            #75f7ff;

          font-size:
            8px;
        }

        .mini-film {

          display:
            flex;

          gap:
            5px;

          margin-top:
            8px;

          overflow:
            hidden;
        }

        .film-frame {

          width:
            20%;

          height:
            55px;

          background:
            #111;

          border:
            1px solid
            #ff4ecb;

          overflow:
            hidden;
        }

        .film-frame img {

          width:
            100%;

          height:
            100%;

          object-fit:
            cover;
        }

        .film-frame span {

          display:
            flex;

          height:
            100%;

          align-items:
            center;

          justify-content:
            center;

          color:
            #75f7ff;
        }

        .loading-footer {

          height:
            32px;

          display:
            flex;

          justify-content:
            space-between;

          align-items:
            center;

          padding:
            0 15px;

          background:
            #0b0916;

          border-top:
            2px solid
            #423a66;

          color:
            #696182;

          font-size:
            8px;
        }

        .loading-cd {

          position:
            absolute;

          right:
            8%;

          top:
            8%;

          width:
            100px;

          height:
            100px;

          border-radius:
            50%;

          background:
            conic-gradient(
              #ff4ecb,
              #75f7ff,
              #baff36,
              #ffe85b,
              #ff4ecb
            );

          border:
            4px solid
            white;

          animation:
            spinCD
            3s
            linear
            infinite;
        }

        .cd-inner {

          position:
            absolute;

          inset:
            34px;

          border-radius:
            50%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          background:
            #19152f;

          color:
            #75f7ff;

          font:
            bold 8px monospace;
        }

        .loading-status {

          position:
            absolute;

          bottom:
            30px;

          color:
            #75f7ff;

          font-size:
            9px;

          letter-spacing:
            .3em;
        }

        .loading-status span {

          margin-left:
            6px;

          animation:
            blink
            1s
            steps(2)
            infinite;
        }

        .loading-status span:nth-child(2) {
          animation-delay:
            .2s;
        }

        .loading-status span:nth-child(3) {
          animation-delay:
            .4s;
        }


        /* =====================================================
           LOADING FLOATERS
           ===================================================== */

        .floating-star {

          position:
            absolute;

          color:
            #baff36;

          font-size:
            35px;

          animation:
            glitchFloat
            4s
            ease-in-out
            infinite;
        }

        .star-one {
          top:
            25%;
          left:
            5%;
        }

        .star-two {
          bottom:
            20%;
          right:
            5%;
          color:
            #ff4ecb;
        }

        .star-three {
          top:
            65%;
          left:
            12%;
          color:
            #75f7ff;
        }


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 800px) {

          .desktop-area {
            min-height:
              1250px;

            padding-top:
              55px;
          }

          .window {
            position:
              absolute;
          }

          .notes-window {
            width:
              190px;

            top:
              75px;

            left:
              4%;
          }

          .notes-paper {
            min-height:
              220px;

            padding:
              13px;

            font-size:
              11px;

            line-height:
              18px;
          }

          .scribble {
            font-size:
              20px;
          }

          .music-window {
            width:
              200px;

            top:
              80px;

            right:
              3%;
          }

          .music-content {
            padding:
              10px;

            flex-direction:
              column;
          }

          .cd {
            width:
              70px;

            height:
              70px;
          }

          .photo-window {
            width:
              220px;

            top:
              320px;

            left:
              3%;
          }

          .photo-viewer {
            height:
              150px;
          }

          .files-window {
            width:
              250px;

            bottom:
              120px;

            right:
              3%;
          }

          .file-grid {
            gap:
              5px;

            padding:
              8px;
          }

          .folder {
            font-size:
              25px;
          }

          .recording-window {
            width:
              340px;

            bottom:
              390px;
          }

          .recording-content {
            padding:
              10px;

            gap:
              10px;
          }

          .cassette {
            width:
              90px;

            height:
              55px;
          }

          .cassette-hole {
            width:
              18px;

            height:
              18px;

            border-width:
              3px;
          }

          .cassette-label {
            font-size:
              6px;
          }

          .password-window {
            top:
              650px;

            width:
              92vw;

            transform:
              translateX(-50%)
              rotate(-.7deg);
          }

          .password-body {
            padding:
              17px;
          }

          .password-intro {
            font-size:
              18px;
          }

          .password-row {
            flex-direction:
              column;
          }

          .password-row button {
            padding:
              11px;
          }

          .mini-one {
            display:
              none;
          }

          .mini-two {
            display:
              none;
          }

          .loading-content {
            grid-template-columns:
              1fr;
          }

          .loading-left {
            border-right:
              none;

            border-bottom:
              2px solid
              #4f467a;

            padding:
              25px;
          }

          .loading-right {
            padding:
              20px;
          }

          .photo-reel {
            height:
              230px;
          }

          .loading-cd {
            width:
              60px;

            height:
              60px;

            top:
              5%;

            right:
              4%;
          }

          .cd-inner {
            inset:
              20px;
          }

        }

      `}</style>

    </main>
  )
}
