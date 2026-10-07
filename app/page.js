'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [booting, setBooting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingPhoto, setLoadingPhoto] = useState(0)
  const [time, setTime] = useState('')

  const audioRef = useRef(null)
  const voiceRef = useRef(null)

  /*
  ============================================================
  EASY CUSTOMIZATION AREA
  ============================================================
  */

  // CHANGE THIS
  const CORRECT_PASSWORD = 'clar'

  // ADD YOUR PHOTOS HERE
  //
  // Put your files inside:
  //
  // public/photos/
  //
  // Example:
  // public/photos/clar1.jpg
  //
  const loadingPhotos = [
    '/photos/clar1.jpg',
    '/photos/clar2.jpg',
    '/photos/clar3.jpg',
    '/photos/clar4.jpg',
    '/photos/clar5.jpg',
  ]

  // MUSIC
  //
  // Put your song inside:
  //
  // public/audio/song.mp3
  //
  const SONG = '/audio/song.mp3'

  // FRIEND'S VOICE
  //
  // Put the recording inside:
  //
  // public/audio/friend-message.mp3
  //
  const FRIEND_VOICE = '/audio/friend-message.mp3'

  // OPTIONAL VIDEO
  //
  // Put video inside:
  //
  // public/video/background.mp4
  //
  const BACKGROUND_VIDEO = '/video/background.mp4'

  /*
  ============================================================
  CLOCK
  ============================================================
  */

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()

      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateClock()

    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)
  }, [])

  /*
  ============================================================
  PASSWORD / BOOT SEQUENCE
  ============================================================
  */

  const enterArchive = () => {
    if (password.toLowerCase().trim() !== CORRECT_PASSWORD) {
      setError('WRONG PASSWORD // TRY AGAIN')

      setTimeout(() => {
        setError('')
      }, 1800)

      return
    }

    setError('')
    setBooting(true)
    setProgress(0)
    setLoadingPhoto(0)

    let currentProgress = 0

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 3

      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
      }

      setProgress(Math.floor(currentProgress))
    }, 180)

    let photoIndex = 0

    const photoInterval = setInterval(() => {
      photoIndex++

      if (photoIndex >= loadingPhotos.length) {
        photoIndex = 0
      }

      setLoadingPhoto(photoIndex)
    }, 650)

    setTimeout(() => {
      clearInterval(progressInterval)
      clearInterval(photoInterval)

      sessionStorage.setItem('birthday_authenticated', 'true')

      router.push('/birthday')
    }, 5200)
  }

  /*
  ============================================================
  AUDIO
  ============================================================
  */

  const playSong = () => {
    if (!audioRef.current) return

    audioRef.current
      .play()
      .catch(() => {
        console.log('Browser blocked autoplay.')
      })
  }

  const playVoice = () => {
    if (!voiceRef.current) return

    voiceRef.current.currentTime = 0

    voiceRef.current
      .play()
      .catch(() => {
        console.log('Voice playback blocked.')
      })
  }

  /*
  ============================================================
  LOADING SCREEN
  ============================================================
  */

  if (booting) {
    return (
      <main className="boot-screen">

        <div className="boot-scanlines" />

        <div className="boot-noise" />

        <div className="boot-content">

          <div className="boot-top">
            SYSTEM // CLAR_ARCHIVE
          </div>

          <div className="boot-title glitch">
            LOADING MEMORY
          </div>

          <div className="boot-photo">

            {loadingPhotos[loadingPhoto] ? (
              <img
                src={loadingPhotos[loadingPhoto]}
                alt=""
              />
            ) : (
              <div className="photo-placeholder">
                PHOTO
              </div>
            )}

            <div className="photo-overlay">
              ARCHIVE FRAME {String(loadingPhoto + 1).padStart(2, '0')}
            </div>

          </div>

          <div className="boot-status">
            <span>INITIALISING MEMORY BANK...</span>
            <span>{progress}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="boot-log">

            <div>› loading photographs...</div>
            <div>› locating embarrassing memories...</div>
            <div>› recovering deleted files...</div>
            <div>› contacting witnesses...</div>
            <div>› preparing birthday archive...</div>

          </div>

        </div>

        <div className="boot-footer">
          PLEASE WAIT // DO NOT TURN OFF THE COMPUTER
        </div>

      </main>
    )
  }

  /*
  ============================================================
  MAIN DESKTOP
  ============================================================
  */

  return (
    <main className="desktop">

      {/* BACKGROUND VIDEO */}

      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={BACKGROUND_VIDEO}
          type="video/mp4"
        />
      </video>

      {/* CRT EFFECTS */}

      <div className="crt" />
      <div className="scanlines" />
      <div className="noise" />

      {/* AUDIO */}

      <audio
        ref={audioRef}
        src={SONG}
        loop
      />

      <audio
        ref={voiceRef}
        src={FRIEND_VOICE}
      />

      {/* DESKTOP TOP BAR */}

      <div className="desktop-top">

        <span>
          CLAR'S COMPUTER
        </span>

        <span>
          PRIVATE // DO NOT TOUCH
        </span>

      </div>

      {/* RANDOM DESKTOP ICONS */}

      <div className="desktop-icons">

        <div className="desktop-icon">
          <div className="icon-image">💾</div>
          <span>MY COMPUTER</span>
        </div>

        <div className="desktop-icon">
          <div className="icon-image">📼</div>
          <span>VHS PLAYER</span>
        </div>

        <div className="desktop-icon">
          <div className="icon-image">💿</div>
          <span>CD_ROM</span>
        </div>

        <div className="desktop-icon">
          <div className="icon-image">🗑️</div>
          <span>TRASH</span>
        </div>

      </div>

      {/* ======================================================
          NOTES WINDOW
      ====================================================== */}

      <section className="window notes-window">

        <div className="window-bar">

          <span>
            📄 notes.txt
          </span>

          <div className="window-buttons">
            − □ ×
          </div>

        </div>

        <div className="notes-content">

          <div className="handwriting">
            things to remember:
          </div>

          <div className="scribble">
            ♡ CLAR'S BIRTHDAY ♡
          </div>

          <div className="scribble small">
            don't forget the embarrassing photos
          </div>

          <div className="scribble">
            ask about the eggs.
          </div>

          <div className="scribble small">
            seriously. THE EGGS.
          </div>

          <div className="red-note">
            IMPORTANT!!!
          </div>

          <div className="scribble">
            password is probably obvious lol
          </div>

        </div>

      </section>

      {/* ======================================================
          PHOTO WINDOW
      ====================================================== */}

      <section className="window photo-window">

        <div className="window-bar">

          <span>
            🖼️ PHOTO_VIEWER.EXE
          </span>

          <div className="window-buttons">
            − □ ×
          </div>

        </div>

        <div className="photo-grid">

          <div className="mini-photo">
            {loadingPhotos[0] ? (
              <img
                src={loadingPhotos[0]}
                alt=""
              />
            ) : (
              <span>PHOTO 01</span>
            )}
          </div>

          <div className="mini-photo tilted">
            {loadingPhotos[1] ? (
              <img
                src={loadingPhotos[1]}
                alt=""
              />
            ) : (
              <span>PHOTO 02</span>
            )}
          </div>

          <div className="mini-photo">
            {loadingPhotos[2] ? (
              <img
                src={loadingPhotos[2]}
                alt=""
              />
            ) : (
              <span>PHOTO 03</span>
            )}
          </div>

          <div className="mini-photo tilted">
            {loadingPhotos[3] ? (
              <img
                src={loadingPhotos[3]}
                alt=""
              />
            ) : (
              <span>PHOTO 04</span>
            )}
          </div>

        </div>

        <div className="photo-status">
          4 FILES // 0% ORGANISATION
        </div>

      </section>

      {/* ======================================================
          MUSIC PLAYER
      ====================================================== */}

      <section className="window music-window">

        <div className="window-bar">

          <span>
            💿 WINAMP_2004
          </span>

          <div className="window-buttons">
            − □ ×
          </div>

        </div>

        <div className="music-body">

          <div className="cd">

            <div className="cd-hole" />

          </div>

          <div className="song-info">

            <div className="music-title glitch">
              BIRTHDAY MIX
            </div>

            <div className="music-artist">
              for clar ♡
            </div>

            <div className="equalizer">

              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />

            </div>

          </div>

          <button
            className="play-button"
            onClick={playSong}
          >
            ▶ PLAY
          </button>

        </div>

      </section>

      {/* ======================================================
          FILES WINDOW
      ====================================================== */}

      <section className="window files-window">

        <div className="window-bar">

          <span>
            📁 FILES
          </span>

          <div className="window-buttons">
            − □ ×
          </div>

        </div>

        <div className="files-content">

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>FEETGANG</span>
          </div>

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>EGGS</span>
          </div>

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>GRADUATION</span>
          </div>

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>DO_NOT_OPEN</span>
          </div>

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>???</span>
          </div>

          <div className="folder">
            <div className="folder-icon">📁</div>
            <span>FINAL_FINAL2</span>
          </div>

        </div>

      </section>

      {/* ======================================================
          RECORDING APP
      ====================================================== */}

      <section className="window recording-window">

        <div className="window-bar">

          <span>
            🎙️ VOICE_MEMO.EXE
          </span>

          <div className="window-buttons">
            − □ ×
          </div>

        </div>

        <div className="recording-body">

          <div className="recording-label">
            MESSAGE_001.WAV
          </div>

          <div className="waveform">

            {Array.from({ length: 30 }).map((_, index) => (
              <span
                key={index}
                style={{
                  height: `${15 + Math.random() * 35}px`,
                }}
              />
            ))}

          </div>

          <div className="recording-time">
            00:00:19
          </div>

          <button
            className="record-button"
            onClick={playVoice}
          >
            ● PLAY RECORDING
          </button>

        </div>

      </section>

      {/* ======================================================
          PASSWORD TERMINAL
      ====================================================== */}

      <section className="password-window">

        <div className="terminal-header">

          <span>
            SYSTEM_ACCESS
          </span>

          <span>
            [SECURE]
          </span>

        </div>

        <div className="terminal-body">

          <div className="terminal-glitch">
            █ CLAR_ARCHIVE.exe
          </div>

          <p>
            yayyy happy birthday Clar !
          </p>

          <p>
            if you see this it means the website is working
          </p>

          <p>
            (thank god)
          </p>

          <p>
            now you just need to enter the password to enter.
          </p>

          <p className="good-luck">
            Good luck !
          </p>

          <div className="password-line">

            <span>
              PASSWORD:
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  enterArchive()
                }
              }}
              autoComplete="off"
              autoFocus
            />

            <span className="cursor">
              █
            </span>

          </div>

          {error && (
            <div className="password-error glitch">
              {error}
            </div>
          )}

          <button
            onClick={enterArchive}
            className="enter-button"
          >
            [ ENTER ARCHIVE ]
          </button>

        </div>

      </section>

      {/* ======================================================
          CD PLAYER
      ====================================================== */}

      <div className="floating-cd">

        <div className="big-cd">

          <div className="cd-label">
            CLAR
          </div>

          <div className="cd-hole" />

        </div>

        <div className="cd-text">
          SIDE A
        </div>

      </div>

      {/* ======================================================
          VHS OVERLAY
      ====================================================== */}

      <div className="vhs">

        <span>
          PLAY ▶
        </span>

        <span>
          SP
        </span>

        <span>
          00:19:04
        </span>

      </div>

      {/* ======================================================
          RANDOM GLITCH TEXT
      ====================================================== */}

      <div className="glitch-text glitch-one">
        HAPPY BIRTHDAY
      </div>

      <div className="glitch-text glitch-two">
        YOU SHOULDN'T BE HERE
      </div>

      <div className="glitch-text glitch-three">
        19 // 11 // 04
      </div>

      {/* ======================================================
          TASKBAR
      ====================================================== */}

      <div className="taskbar">

        <button className="start-button">
          ◉ START
        </button>

        <div className="task-item">
          📄 notes.txt
        </div>

        <div className="task-item">
          💿 music
        </div>

        <div className="task-item">
          📁 files
        </div>

        <div className="task-clock">
          {time}
        </div>

      </div>

      {/* ======================================================
          STYLES
      ====================================================== */}

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Share+Tech+Mono&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #7784a7;
          overflow-x: hidden;
        }

        button,
        input {
          font-family: inherit;
        }

        /* ==================================================
           DESKTOP
        ================================================== */

        .desktop {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 25% 20%,
              rgba(190, 190, 225, .65),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(85, 96, 140, .4),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #8793b8,
              #6e789c 45%,
              #8992b1
            );

          color: #171a25;

          font-family:
            'Share Tech Mono',
            monospace;

          min-height: 100vh;
        }

        .background-video {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .16;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 0;
        }

        /* ==================================================
           CRT
        ================================================== */

        .crt {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;

          background:
            radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(0,0,0,.35)
            );

          box-shadow:
            inset 0 0 120px rgba(0,0,0,.4);

          animation: crtFlicker .08s infinite;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 101;

          background:
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,.035) 0px,
              rgba(255,255,255,.035) 1px,
              rgba(0,0,0,.08) 2px,
              rgba(0,0,0,.08) 4px
            );
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 102;

          opacity: .12;

          background-image:
            url("https://grainy-gradients.vercel.app/noise.svg");

          mix-blend-mode: overlay;
        }

        @keyframes crtFlicker {

          0% {
            opacity: .96;
          }

          50% {
            opacity: .98;
          }

          100% {
            opacity: .94;
          }

        }

        /* ==================================================
           TOP
        ================================================== */

        .desktop-top {
          position: absolute;
          top: 8px;
          left: 12px;
          right: 12px;

          display: flex;
          justify-content: space-between;

          font-family:
            'VT323',
            monospace;

          font-size: 15px;

          color: #d9def3;

          text-shadow:
            2px 0 #7b416b,
            -2px 0 #405a86;

          z-index: 10;
        }

        /* ==================================================
           DESKTOP ICONS
        ================================================== */

        .desktop-icons {
          position: absolute;
          top: 42px;
          left: 18px;

          display: flex;
          flex-direction: column;
          gap: 16px;

          z-index: 5;
        }

        .desktop-icon {
          width: 75px;

          text-align: center;

          color: #f0f2ff;

          font-family:
            'VT323',
            monospace;

          font-size: 13px;

          text-shadow:
            1px 1px #30344b;

          animation:
            iconFloat 5s ease-in-out infinite;
        }

        .desktop-icon:nth-child(2) {
          animation-delay: .8s;
        }

        .desktop-icon:nth-child(3) {
          animation-delay: 1.4s;
        }

        .desktop-icon:nth-child(4) {
          animation-delay: 2s;
        }

        .icon-image {
          font-size: 30px;
          margin-bottom: 3px;

          filter:
            drop-shadow(
              2px 2px 0 #454b68
            );
        }

        @keyframes iconFloat {

          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }

        }

        /* ==================================================
           WINDOWS
        ================================================== */

        .window {
          position: absolute;

          background:
            rgba(199, 204, 224, .88);

          border:
            2px solid #252b42;

          box-shadow:
            6px 6px 0 rgba(35,38,57,.55),
            inset 1px 1px white;

          backdrop-filter:
            blur(3px);

          z-index: 6;
        }

        .window-bar {
          height: 27px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7px;

          background:
            linear-gradient(
              90deg,
              #3d4c77,
              #59648e,
              #414d73
            );

          color: #fff;

          font-family:
            'VT323',
            monospace;

          font-size: 16px;

          border-bottom:
            2px solid #242a40;
        }

        .window-buttons {
          letter-spacing: 3px;
        }

        /* ==================================================
           NOTES
        ================================================== */

        .notes-window {
          width: 290px;
          height: 330px;

          top: 90px;
          left: 14%;

          transform:
            rotate(-2deg);
        }

        .notes-content {
          padding: 22px;

          height: calc(100% - 27px);

          background:
            repeating-linear-gradient(
              transparent,
              transparent 28px,
              rgba(91,102,132,.25) 29px
            );

          background-color: #d7d9e5;

          font-family:
            'VT323',
            monospace;
        }

        .handwriting {
          font-size: 21px;
          color: #30364e;
          transform: rotate(-2deg);
        }

        .scribble {
          margin-top: 18px;
          font-size: 19px;
          color: #39415e;

          transform: rotate(
            var(--rotation, -1deg)
          );
        }

        .scribble.small {
          font-size: 15px;
          color: #626a83;
        }

        .red-note {
          display: inline-block;

          margin-top: 15px;

          padding: 4px 8px;

          background: #b45f6f;

          color: #fff;

          transform:
            rotate(-4deg);

          font-family:
            'Press Start 2P',
            monospace;

          font-size: 7px;
        }

        /* ==================================================
           PHOTO WINDOW
        ================================================== */

        .photo-window {
          width: 340px;

          top: 75px;
          right: 10%;

          transform:
            rotate(1.5deg);
        }

        .photo-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          padding: 12px;
        }

        .mini-photo {
          aspect-ratio: 1;

          background:
            linear-gradient(
              135deg,
              #777f9e,
              #b7bad0
            );

          border:
            4px solid #ececf4;

          box-shadow:
            2px 2px 0 #515772;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;

          color: #414760;

          font-family:
            'VT323';

          font-size: 18px;
        }

        .mini-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tilted {
          transform: rotate(3deg);
        }

        .photo-status {
          padding: 5px 10px;

          border-top:
            1px solid #777d98;

          font-size: 10px;

          color: #4b526d;
        }

        /* ==================================================
           MUSIC
        ================================================== */

        .music-window {
          width: 360px;

          left: 8%;
          bottom: 145px;

          transform:
            rotate(1deg);
        }

        .music-body {
          padding: 14px;

          display: grid;

          grid-template-columns:
            90px 1fr;

          gap: 15px;
        }

        .cd {
          width: 82px;
          height: 82px;

          border-radius: 50%;

          background:
            conic-gradient(
              #6e79a8,
              #c5c9dc,
              #606b98,
              #dadbea,
              #6d78a3,
              #c4c9df,
              #69739d
            );

          border:
            3px solid #3b425e;

          position: relative;

          animation:
            cdSpin 8s linear infinite;
        }

        .cd-hole {
          position: absolute;

          width: 18px;
          height: 18px;

          border-radius: 50%;

          background: #aeb4cc;

          border:
            2px solid #3c425b;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%);
        }

        @keyframes cdSpin {

          from {
            transform: rotate(0);
          }

          to {
            transform: rotate(360deg);
          }

        }

        .music-title {
          font-family:
            'Press Start 2P';

          font-size: 10px;

          color: #303854;

          margin-bottom: 7px;
        }

        .music-artist {
          font-family:
            'VT323';

          font-size: 18px;

          color: #69718d;
        }

        .equalizer {
          height: 40px;

          display: flex;

          align-items: end;

          gap: 3px;

          margin-top: 8px;
        }

        .equalizer span {
          width: 5px;

          background:
            #4f608e;

          animation:
            equalize .8s ease-in-out infinite alternate;
        }

        .equalizer span:nth-child(2) {
          animation-delay: .1s;
        }

        .equalizer span:nth-child(3) {
          animation-delay: .2s;
        }

        .equalizer span:nth-child(4) {
          animation-delay: .3s;
        }

        .equalizer span:nth-child(5) {
          animation-delay: .4s;
        }

        @keyframes equalize {

          from {
            height: 8px;
          }

          to {
            height: 34px;
          }

        }

        .play-button {
          grid-column: 1 / -1;

          border:
            2px solid #3b4565;

          background:
            #65739e;

          color: #fff;

          padding: 7px;

          cursor: pointer;

          font-family:
            'VT323';

          font-size: 17px;

          box-shadow:
            3px 3px #3a425d;
        }

        .play-button:active {
          transform:
            translate(2px,2px);

          box-shadow:
            1px 1px #3a425d;
        }

        /* ==================================================
           FILES
        ================================================== */

        .files-window {
          width: 350px;

          right: 7%;

          bottom: 100px;

          transform:
            rotate(-1deg);
        }

        .files-content {
          padding: 18px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .folder {
          text-align: center;

          font-family:
            'VT323';

          font-size: 15px;

          color: #343b56;

          cursor: pointer;

          transition:
            transform .15s;
        }

        .folder:hover {
          transform:
            translateY(-5px)
            rotate(-3deg);
        }

        .folder-icon {
          font-size: 34px;

          filter:
            drop-shadow(
              2px 2px 0 #737993
            );
        }

        /* ==================================================
           RECORDING
        ================================================== */

        .recording-window {
          width: 300px;

          top: 310px;
          right: 25%;

          transform:
            rotate(2deg);
        }

        .recording-body {
          padding: 14px;

          background:
            #bdc2d7;
        }

        .recording-label {
          font-family:
            'VT323';

          font-size: 18px;

          color: #343b56;
        }

        .waveform {
          height: 55px;

          margin:
            10px 0;

          display: flex;

          align-items: center;

          gap: 3px;

          overflow: hidden;
        }

        .waveform span {
          width: 3px;

          background:
            #58688f;

          animation:
            wave .6s ease-in-out infinite alternate;
        }

        .waveform span:nth-child(odd) {
          animation-delay: .2s;
        }

        @keyframes wave {

          from {
            transform:
              scaleY(.3);
          }

          to {
            transform:
              scaleY(1);
          }

        }

        .recording-time {
          font-family:
            'VT323';

          font-size: 17px;

          margin-bottom: 8px;
        }

        .record-button {
          width: 100%;

          border:
            2px solid #39425e;

          background:
            #596a96;

          color: white;

          padding: 7px;

          cursor: pointer;

          font-family:
            'VT323';

          font-size: 17px;
        }

        /* ==================================================
           PASSWORD
        ================================================== */

        .password-window {
          position: absolute;

          z-index: 20;

          width:
            min(510px, 90vw);

          left: 50%;
          bottom: 75px;

          transform:
            translateX(-50%);

          background:
            rgba(25,30,48,.94);

          border:
            2px solid #a9b3d2;

          box-shadow:
            8px 8px 0 rgba(30,34,53,.6),
            0 0 30px rgba(160,174,220,.15);

          color:
            #cdd4ec;

          font-family:
            'Share Tech Mono',
            monospace;
        }

        .terminal-header {
          display: flex;

          justify-content: space-between;

          padding:
            7px 10px;

          background:
            #69779f;

          color: white;

          font-family:
            'VT323';

          font-size: 17px;
        }

        .terminal-body {
          padding: 18px;
        }

        .terminal-glitch {
          color: #e2e5f4;

          font-family:
            'Press Start 2P';

          font-size: 11px;

          margin-bottom: 18px;
        }

        .terminal-body p {
          margin:
            5px 0;

          font-size: 13px;

          color: #b8c0dc;
        }

        .good-luck {
          color:
            #e89aaf !important;

          margin-top:
            12px !important;
        }

        .password-line {
          margin-top: 18px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 13px;

          flex-wrap: wrap;
        }

        .password-line input {
          flex: 1;

          min-width: 120px;

          background:
            #0c1020;

          border:
            1px solid #65739d;

          color:
            #e6eaff;

          outline: none;

          padding:
            8px;

          font-family:
            'Share Tech Mono';
        }

        .cursor {
          animation:
            blink .7s infinite;
        }

        @keyframes blink {

          0%,49% {
            opacity: 1;
          }

          50%,100% {
            opacity: 0;
          }

        }

        .enter-button {
          margin-top: 15px;

          width: 100%;

          padding: 10px;

          background:
            #69789f;

          border:
            2px solid #c5cbe0;

          color: white;

          font-family:
            'Press Start 2P';

          font-size: 9px;

          cursor: pointer;

          transition:
            all .15s;
        }

        .enter-button:hover {
          background:
            #8996bb;

          letter-spacing:
            1px;
        }

        .password-error {
          margin-top: 12px;

          color:
            #f08b9e;

          font-family:
            'VT323';

          font-size: 19px;
        }

        /* ==================================================
           FLOATING CD
        ================================================== */

        .floating-cd {
          position: absolute;

          top: 180px;
          left: 48%;

          z-index: 4;

          transform:
            rotate(-8deg);
        }

        .big-cd {
          width: 110px;
          height: 110px;

          border-radius: 50%;

          background:
            conic-gradient(
              #6978a6,
              #d1d5e4,
              #8996ba,
              #b9bed2,
              #5d6d9a,
              #d8dbea
            );

          border:
            3px solid #3e4662;

          display: flex;

          align-items: center;
          justify-content: center;

          animation:
            cdSpin 12s linear infinite;
        }

        .cd-label {
          position: absolute;

          width: 45px;
          height: 45px;

          border-radius: 50%;

          background:
            #7b506f;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #fff;

          font-family:
            'VT323';

          font-size: 17px;
        }

        .cd-text {
          text-align: center;

          margin-top: 5px;

          font-family:
            'VT323';

          color:
            #e5e8f4;

          text-shadow:
            1px 1px #414963;
        }

        /* ==================================================
           VHS
        ================================================== */

        .vhs {
          position: fixed;

          bottom: 55px;
          left: 15px;
          right: 15px;

          display: flex;

          justify-content: space-between;

          color:
            rgba(255,255,255,.65);

          font-family:
            'VT323';

          font-size: 17px;

          z-index: 103;

          pointer-events: none;
        }

        /* ==================================================
           GLITCH TEXT
        ================================================== */

        .glitch {
          animation:
            glitchText 2.8s infinite;
        }

        @keyframes glitchText {

          0%,85%,100% {
            opacity: 1;
            transform:
              translate(0);
          }

          86% {
            opacity: 0;
            transform:
              translate(-5px);
          }

          87% {
            opacity: 1;
            transform:
              translate(4px);
          }

          88% {
            opacity: .2;
            transform:
              translate(-2px);
          }

          89% {
            opacity: 1;
            transform:
              translate(0);
          }

        }

        .glitch-text {
          position: absolute;

          z-index: 3;

          color:
            rgba(230,234,250,.4);

          font-family:
            'Press Start 2P';

          font-size:
            clamp(7px, 1vw, 12px);

          pointer-events: none;

          animation:
            disappear 4s infinite;
        }

        .glitch-one {
          top: 35%;
          left: 4%;
        }

        .glitch-two {
          top: 22%;
          right: 4%;
        }

        .glitch-three {
          top: 54%;
          left: 55%;
        }

        @keyframes disappear {

          0%,70%,100% {
            opacity: .45;
            clip-path: inset(0 0 0 0);
          }

          71% {
            opacity: 0;
          }

          73% {
            opacity: .7;
            clip-path:
              inset(30% 0 40% 0);
            transform:
              translateX(8px);
          }

          74% {
            opacity: 0;
          }

          76% {
            opacity: .4;
            clip-path:
              inset(0);
          }

        }

        /* ==================================================
           TASKBAR
        ================================================== */

        .taskbar {
          position: fixed;

          bottom: 0;
          left: 0;
          right: 0;

          height: 38px;

          background:
            linear-gradient(
              #737fa3,
              #4d597d
            );

          border-top:
            2px solid #c8cee1;

          z-index: 110;

          display: flex;

          align-items: center;

          gap: 5px;

          padding:
            3px 5px;

          font-family:
            'VT323';

          color: white;
        }

        .start-button {
          height: 30px;

          padding:
            0 15px;

          background:
            #65749d;

          border:
            2px solid #d0d5e5;

          color: white;

          font-family:
            'VT323';

          font-size: 18px;
        }

        .task-item {
          height: 29px;

          padding:
            4px 10px;

          min-width: 90px;

          background:
            rgba(37,44,69,.6);

          border:
            1px solid #aab2cd;

          font-size: 16px;
        }

        .task-clock {
          margin-left: auto;

          padding:
            4px 12px;

          border-left:
            1px solid #b7bed3;

          font-size: 17px;
        }

        /* ==================================================
           BOOT SCREEN
        ================================================== */

        .boot-screen {
          min-height: 100vh;

          position: relative;

          overflow: hidden;

          background:
            #151a2a;

          color:
            #cdd5ed;

          display: flex;

          align-items: center;
          justify-content: center;

          font-family:
            'Share Tech Mono';
        }

        .boot-scanlines {
          position: fixed;
          inset: 0;

          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(255,255,255,.035) 4px
            );

          pointer-events: none;
        }

        .boot-noise {
          position: fixed;
          inset: 0;

          opacity: .1;

          background-image:
            url("https://grainy-gradients.vercel.app/noise.svg");
        }

        .boot-content {
          width:
            min(650px, 90vw);

          text-align: center;

          z-index: 2;
        }

        .boot-top {
          font-family:
            'VT323';

          color:
            #8997c1;

          font-size:
            19px;

          letter-spacing:
            3px;

          margin-bottom:
            30px;
        }

        .boot-title {
          font-family:
            'Press Start 2P';

          font-size:
            clamp(18px, 4vw, 32px);

          color:
            #dce1f4;

          margin-bottom:
            25px;
        }

        .boot-photo {
          width:
            min(390px, 80vw);

          height:
            260px;

          margin:
            auto;

          border:
            3px solid #7c88ac;

          background:
            #252b42;

          position: relative;

          overflow: hidden;

          box-shadow:
            0 0 30px rgba(130,145,195,.2);
        }

        .boot-photo img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          filter:
            saturate(.75)
            contrast(1.05);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          color:
            #727c9e;

          font-family:
            'VT323';

          font-size:
            30px;
        }

        .photo-overlay {
          position: absolute;

          bottom: 8px;
          left: 10px;

          color:
            white;

          font-family:
            'VT323';

          font-size:
            17px;

          text-shadow:
            1px 1px black;
        }

        .boot-status {
          margin-top:
            20px;

          display: flex;

          justify-content: space-between;

          font-family:
            'VT323';

          font-size:
            18px;
        }

        .progress-track {
          margin-top:
            7px;

          height:
            14px;

          border:
            2px solid #68779e;

          background:
            #0c1020;
        }

        .progress-bar {
          height: 100%;

          background:
            repeating-linear-gradient(
              90deg,
              #7384b0 0px,
              #7384b0 8px,
              #a0abc9 9px,
              #a0abc9 12px
            );

          transition:
            width .2s;
        }

        .boot-log {
          margin-top:
            22px;

          text-align:
            left;

          font-family:
            'VT323';

          font-size:
            17px;

          color:
            #8f9abd;

          line-height:
            1.4;
        }

        .boot-footer {
          position: fixed;

          bottom: 15px;
          left: 0;
          right: 0;

          text-align: center;

          font-family:
            'VT323';

          color:
            #5d6684;

          font-size:
            16px;
        }

        /* ==================================================
           MOBILE
        ================================================== */

        @media(max-width: 700px) {

          .window {
            transform:
              scale(.78);

            transform-origin:
              top left;
          }

          .notes-window {
            left: 4%;
            top: 80px;
          }

          .photo-window {
            right: -120px;
            top: 80px;
          }

          .music-window {
            left: 2%;
            bottom: 190px;
          }

          .files-window {
            right: -50px;
            bottom: 100px;
          }

          .recording-window {
            right: -30px;
            top: 350px;
          }

          .floating-cd {
            display: none;
          }

          .password-window {
            bottom:
              55px;
          }

          .desktop-icons {
            transform:
              scale(.8);

            transform-origin:
              top left;
          }

        }

      `}</style>

    </main>
  )
}
