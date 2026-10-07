"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

/* =========================================================
   ✦✦✦ CHANGE YOUR FILES HERE ✦✦✦
   Put your files inside /public/media/
   ========================================================= */

const BIRTHDAY_PASSWORD = "clar";

const MEDIA = {
  song: "/media/birthday-song.mp3",
  video: "/media/background-video.mp4",
  friendVoice: "/media/friend-voice.mp3",

  photos: [
    "/media/photos/01.jpg",
    "/media/photos/02.jpg",
    "/media/photos/03.jpg",
    "/media/photos/04.jpg",
    "/media/photos/05.jpg",
    "/media/photos/06.jpg",
  ],
};

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function Home() {
  const router = useRouter();

  const [phase, setPhase] = useState("desktop");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhoto, setLoadingPhoto] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [clock, setClock] = useState("");

  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const videoRef = useRef(null);

  /* ---------------- CLOCK ---------------- */

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- PHOTO ROTATION ---------------- */

  useEffect(() => {
    if (MEDIA.photos.length <= 1) return;

    const interval = setInterval(() => {
      setPhotoIndex((current) => (current + 1) % MEDIA.photos.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     PASSWORD → LOADING SCREEN
     ===================================================== */

  const enterArchive = async (event) => {
    event.preventDefault();

    setPasswordError("");

    if (password.trim().toLowerCase() !== BIRTHDAY_PASSWORD.toLowerCase()) {
      setPasswordError("incorrect password... try again 👀");
      return;
    }

    /*
      IMPORTANT:
      This happens inside the button click / form submit.
      That means browsers are much more likely to allow
      audio playback here.
    */

    try {
      if (musicRef.current) {
        musicRef.current.volume = 0.35;
        await musicRef.current.play();
        setMusicPlaying(true);
      }
    } catch {
      // Browser may block audio. User can still press play manually.
    }

    try {
      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch {
      // Ignore video autoplay errors.
    }

    sessionStorage.setItem("birthday_authenticated", "true");

    /* THIS is the important part */
    setPhase("loading");
    setLoadingProgress(0);
    setLoadingPhoto(0);
  };

  /* =====================================================
     GRAPHICAL LOADING SCREEN
     ===================================================== */

  useEffect(() => {
    if (phase !== "loading") return;

    let progress = 0;

    const progressTimer = setInterval(() => {
      progress += 1.6;

      setLoadingProgress(Math.min(progress, 100));

      if (Math.floor(progress) % 17 === 0) {
        setLoadingPhoto((current) => (current + 1) % 6);
      }

      if (progress >= 100) {
        clearInterval(progressTimer);

        setTimeout(() => {
          router.push("/birthday");
        }, 1000);
      }
    }, 55);

    const photoTimer = setInterval(() => {
      setLoadingPhoto((current) => (current + 1) % 6);
    }, 800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(photoTimer);
    };
  }, [phase, router]);

  /* =====================================================
     MUSIC
     ===================================================== */

  const toggleMusic = async () => {
    if (!musicRef.current) return;

    if (musicPlaying) {
      musicRef.current.pause();
      setMusicPlaying(false);
    } else {
      try {
        await musicRef.current.play();
        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    }
  };

  /* =====================================================
     FRIEND VOICE
     ===================================================== */

  const toggleVoice = async () => {
    if (!voiceRef.current) return;

    if (voicePlaying) {
      voiceRef.current.pause();
      setVoicePlaying(false);
    } else {
      try {
        await voiceRef.current.play();
        setVoicePlaying(true);
      } catch {
        setVoicePlaying(false);
      }
    }
  };

  /* =====================================================
     LOADING SCREEN
     ===================================================== */

  if (phase === "loading") {
    return (
      <>
        <div className="loading-screen">

          {/* BACKGROUND GRID */}
          <div className="loading-grid" />

          {/* CRT EFFECTS */}
          <div className="loading-scanlines" />
          <div className="loading-noise" />

          {/* CORNER LABELS */}
          <div className="load-corner load-top-left">
            CLAR_OS // BOOT SEQUENCE
          </div>

          <div className="load-corner load-top-right">
            ARCHIVE 001
          </div>

          <div className="load-corner load-bottom-left">
            DO NOT TURN OFF COMPUTER
          </div>

          <div className="load-corner load-bottom-right">
            1999—∞
          </div>

          {/* MAIN LOADING WINDOW */}

          <div className="loading-window">

            <div className="loading-window-bar">
              <span>CLAR_ARCHIVE.EXE</span>

              <div className="window-buttons">
                <span>—</span>
                <span>□</span>
                <span>×</span>
              </div>
            </div>

            <div className="loading-content">

              {/* TOP STATUS */}

              <div className="loading-status">
                <span className="status-dot" />
                CONNECTION ESTABLISHED
              </div>

              <div className="loading-title">
                <span className="title-small">WELCOME TO</span>
                <span className="title-big">CLAR'S</span>
                <span className="title-big outline">ARCHIVE</span>
              </div>

              {/* PHOTO STACK */}

              <div className="loading-photo-zone">

                <div className="photo-shadow-card" />

                <div className="loading-photo-card card-back">
                  <div className="fake-photo">
                    <div className="fake-sun" />
                    <div className="fake-person" />
                    <div className="fake-ground" />
                  </div>
                </div>

                <div className="loading-photo-card">

                  {MEDIA.photos[loadingPhoto] ? (
                    <img
                      src={MEDIA.photos[loadingPhoto]}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.classList.add(
                          "photo-fallback"
                        );
                      }}
                    />
                  ) : (
                    <div className="fake-photo">
                      <div className="fake-sun" />
                      <div className="fake-person" />
                      <div className="fake-ground" />
                    </div>
                  )}

                  <div className="photo-fallback-content">
                    <span>PHOTO</span>
                    <strong>
                      {String(loadingPhoto + 1).padStart(2, "0")}
                    </strong>
                  </div>

                  <div className="photo-caption">
                    FOUND IN MEMORY CACHE
                  </div>
                </div>

                <div className="photo-number">
                  {String(loadingPhoto + 1).padStart(2, "0")} / 06
                </div>

              </div>

              {/* RANDOM LITTLE NOTES */}

              <div className="loading-note note-one">
                ♡ precious memories detected
              </div>

              <div className="loading-note note-two">
                !! questionable files detected
              </div>

              <div className="loading-note note-three">
                [ DO NOT DELETE ]
              </div>

              {/* TERMINAL */}

              <div className="loading-terminal">

                <div>
                  <span className="terminal-green">OK</span>
                  &nbsp; locating birthday archive...
                </div>

                <div>
                  <span className="terminal-green">OK</span>
                  &nbsp; checking memories...
                </div>

                <div>
                  <span className="terminal-green">OK</span>
                  &nbsp; checking embarrassing photos...
                </div>

                <div>
                  <span className="terminal-yellow">!!</span>
                  &nbsp; excessive nonsense detected
                </div>

                <div>
                  <span className="terminal-green">OK</span>
                  &nbsp; continuing anyway...
                </div>

              </div>

              {/* PROGRESS */}

              <div className="progress-area">

                <div className="progress-label">
                  <span>LOADING ARCHIVE</span>
                  <strong>
                    {Math.floor(loadingProgress)
                      .toString()
                      .padStart(3, "0")}
                    %
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${loadingProgress}%`,
                    }}
                  />

                  <div className="progress-shine" />
                </div>

                <div className="progress-blocks">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        loadingProgress >
                        (index / 24) * 100
                          ? "active"
                          : ""
                      }
                    />
                  ))}
                </div>

              </div>

              <div className="loading-bottom-text">
                <span>PLEASE WAIT</span>

                <span className="loading-dots">
                  <i>.</i>
                  <i>.</i>
                  <i>.</i>
                </span>
              </div>

            </div>
          </div>

          {/* FLOATING OBJECTS */}

          <div className="floating-disc">
            <div className="disc-hole" />
            <div className="disc-label">CLAR</div>
          </div>

          <div className="floating-star star-one">✦</div>
          <div className="floating-star star-two">✧</div>
          <div className="floating-star star-three">★</div>

          <div className="floating-label label-one">
            MEMORY
          </div>

          <div className="floating-label label-two">
            BIRTHDAY!
          </div>

        </div>

        <style jsx global>{loadingStyles}</style>
      </>
    );
  }

  /* =====================================================
     MAIN DESKTOP
     ===================================================== */

  return (
    <main className="desktop">

      {/* AUDIO */}

      <audio
        ref={musicRef}
        src={MEDIA.song}
        loop
        preload="metadata"
        onEnded={() => setMusicPlaying(false)}
      />

      <audio
        ref={voiceRef}
        src={MEDIA.friendVoice}
        preload="metadata"
        onEnded={() => setVoicePlaying(false)}
      />

      {/* BACKGROUND VIDEO */}

      <video
        ref={videoRef}
        className="background-video"
        src={MEDIA.video}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="desktop-overlay" />
      <div className="scanlines" />

      {/* TOP COMPUTER BAR */}

      <header className="topbar">

        <div className="computer-name">
          <span className="computer-dot" />
          CLAR'S COMPUTER
        </div>

        <div className="topbar-center">
          <span>PRIVATE SYSTEM</span>
          <span>•</span>
          <span>USER: CLAR</span>
        </div>

        <div className="clock">
          {clock || "12:00 PM"}
        </div>

      </header>

      {/* DESKTOP CONTENT */}

      <section className="desktop-stage">

        {/* FLOATING DECOR */}

        <div className="desktop-sticker sticker-a">
          ♡
        </div>

        <div className="desktop-sticker sticker-b">
          ★
        </div>

        <div className="desktop-sticker sticker-c">
          !!
        </div>

        <div className="desktop-label label-a">
          PRIVATE :)
        </div>

        <div className="desktop-label label-b">
          DO NOT TOUCH
        </div>

        {/* INTRO */}

        <div className="intro-text">

          <div className="tiny-system">
            SYSTEM MESSAGE // 001
          </div>

          <h1>
            yayyy happy birthday
            <br />
            <span>Clar ♡</span>
          </h1>

          <p>
            if you see this it means the website is working
            <br />
            (thank god)
            <br />
            now you just need to enter the password to enter.
            <br />
            Good luck !
          </p>

        </div>

        {/* FILES */}

        <div className="files-window window">

          <div className="window-header">
            <span>FILE EXPLORER</span>
            <div>— □ ×</div>
          </div>

          <div className="files-content">

            <FileItem icon="📁" name="FEETGANG" />
            <FileItem icon="📁" name="EGGS" />
            <FileItem icon="📁" name="GRADUATION" />
            <FileItem icon="📁" name="MEMORIES" />
            <FileItem icon="📁" name="MESSAGES" />
            <FileItem icon="📁" name="CHAOS" />

          </div>

          <div className="window-status">
            6 objects
          </div>

        </div>

        {/* NOTES */}

        <div className="notes-window window">

          <div className="window-header note-header">
            <span>notes.txt</span>
            <div>×</div>
          </div>

          <div className="notes-paper">

            <div className="handwriting">
              okay so...
            </div>

            <div className="handwriting large">
              HAPPY
              <br />
              BIRTHDAY
              <br />
              CLAR!!!
            </div>

            <div className="handwriting">
              ♡ this took way too long
            </div>

            <div className="scribble">
              ~ ~ ~ ~ ~
            </div>

            <div className="tiny-note">
              p.s. don't click
              <br />
              everything :)
            </div>

          </div>

        </div>

        {/* PHOTO APP */}

        <div className="photo-window window">

          <div className="window-header">
            <span>PHOTO_VIEWER</span>
            <div>— □ ×</div>
          </div>

          <div className="photo-viewer">

            <div className="photo-main">

              {MEDIA.photos[photoIndex] ? (
                <img
                  src={MEDIA.photos[photoIndex]}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add(
                      "photo-empty"
                    );
                  }}
                />
              ) : (
                <div className="photo-placeholder">
                  YOUR PHOTO
                </div>
              )}

              <div className="photo-overlay-text">
                IMG_
                {String(photoIndex + 1).padStart(2, "0")}
              </div>

            </div>

            <div className="photo-controls">

              <button
                onClick={() =>
                  setPhotoIndex(
                    (photoIndex - 1 + MEDIA.photos.length) %
                      MEDIA.photos.length
                  )
                }
              >
                ◀
              </button>

              <span>
                {photoIndex + 1} / {MEDIA.photos.length}
              </span>

              <button
                onClick={() =>
                  setPhotoIndex(
                    (photoIndex + 1) % MEDIA.photos.length
                  )
                }
              >
                ▶
              </button>

            </div>

          </div>

        </div>

        {/* MUSIC PLAYER */}

        <div className="music-window window">

          <div className="window-header">
            <span>CD PLAYER</span>
            <div>— □ ×</div>
          </div>

          <div className="music-content">

            <div
              className={`cd ${musicPlaying ? "spinning" : ""}`}
              onClick={toggleMusic}
            >
              <div className="cd-center">
                ♡
              </div>
            </div>

            <div className="music-info">

              <div className="music-now">
                NOW PLAYING
              </div>

              <strong>
                birthday soundtrack.mp3
              </strong>

              <div className="music-bars">
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
                className="retro-button"
                onClick={toggleMusic}
              >
                {musicPlaying ? "Ⅱ PAUSE" : "▶ PLAY"}
              </button>

            </div>

          </div>

        </div>

        {/* VIDEO */}

        <div className="video-window window">

          <div className="window-header">
            <span>VIDEO_PLAYER.mov</span>
            <div>×</div>
          </div>

          <div className="video-content">

            <video
              src={MEDIA.video}
              autoPlay
              loop
              muted
              playsInline
            />

            <div className="video-rec">
              ● REC
            </div>

            <div className="video-time">
              00:00:{String(photoIndex).padStart(2, "0")}
            </div>

          </div>

        </div>

        {/* VOICE RECORDER */}

        <div className="recorder-window window">

          <div className="window-header">
            <span>VOICE_RECORDER</span>
            <div>×</div>
          </div>

          <div className="recorder-content">

            <div className="recorder-mic">
              🎙
            </div>

            <div className="recording-title">
              A MESSAGE FOR CLAR
            </div>

            <div className="waveform">
              {Array.from({ length: 25 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    height: `${20 + ((i * 17) % 45)}px`,
                  }}
                />
              ))}
            </div>

            <button
              className={`record-button ${
                voicePlaying ? "playing" : ""
              }`}
              onClick={toggleVoice}
            >
              {voicePlaying ? "Ⅱ STOP" : "▶ PLAY MESSAGE"}
            </button>

          </div>

        </div>

        {/* PASSWORD */}

        <div className="password-window">

          <div className="password-top">
            <span>🔐</span>
            <strong>RESTRICTED AREA</strong>
            <span>×</span>
          </div>

          <div className="password-inner">

            <div className="password-small">
              CLAR_ARCHIVE ACCESS
            </div>

            <div className="password-prompt">
              enter password
            </div>

            <form onSubmit={enterArchive}>

              <div className="password-input-row">

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="off"
                />

                <button type="submit">
                  ENTER ↵
                </button>

              </div>

            </form>

            {passwordError && (
              <div className="password-error">
                {passwordError}
              </div>
            )}

            <div className="password-hint">
              unauthorized people will be judged
            </div>

          </div>

        </div>

        {/* TASKBAR */}

        <div className="taskbar">

          <button className="start-button">
            ◈ START
          </button>

          <div className="task-item">
            📁 CLAR_ARCHIVE
          </div>

          <div className="task-item">
            💿 MUSIC
          </div>

          <div className="task-item">
            📷 PHOTOS
          </div>

          <div className="task-spacer" />

          <div className="task-status">
            ● SYSTEM OK
          </div>

        </div>

      </section>

      {/* HIDDEN AUDIO ELEMENTS */}

      <style jsx global>{desktopStyles}</style>

    </main>
  );
}

/* =========================================================
   FILE ITEM
   ========================================================= */

function FileItem({ icon, name }) {
  return (
    <div className="file-item">
      <div className="file-icon">{icon}</div>
      <div className="file-name">{name}</div>
    </div>
  );
}

/* =========================================================
   LOADING SCREEN CSS
   ========================================================= */

const loadingStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Press+Start+2P&family=VT323&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 999999;
  overflow: hidden;

  background:
    radial-gradient(circle at 50% 45%, #7778b5 0%, #555786 28%, #343655 65%, #20223c 100%);

  color: #fff4d6;

  font-family: "DM Mono", monospace;
}

.loading-grid {
  position: absolute;
  inset: -20%;
  opacity: .22;

  background-image:
    linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);

  background-size: 45px 45px;

  transform: perspective(500px) rotateX(62deg) scale(1.4);
  transform-origin: center bottom;

  animation: gridMove 5s linear infinite;
}

@keyframes gridMove {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 0 45px;
  }
}

.loading-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;

  background: repeating-linear-gradient(
    to bottom,
    rgba(255,255,255,.025) 0px,
    rgba(255,255,255,.025) 1px,
    transparent 1px,
    transparent 4px
  );

  mix-blend-mode: overlay;
}

.loading-noise {
  position: absolute;
  inset: -50%;
  pointer-events: none;
  z-index: 21;

  opacity: .07;

  background-image:
    repeating-radial-gradient(
      circle at 0 0,
      #fff 0,
      transparent 1px,
      transparent 3px
    );

  background-size: 5px 5px;

  animation: noiseMove .18s steps(2) infinite;
}

@keyframes noiseMove {
  0% { transform: translate(0,0); }
  25% { transform: translate(3%, -2%); }
  50% { transform: translate(-2%, 3%); }
  75% { transform: translate(2%, 2%); }
  100% { transform: translate(-3%, -2%); }
}

.load-corner {
  position: absolute;
  z-index: 30;

  font-family: "DM Mono", monospace;
  font-size: 10px;
  letter-spacing: 1px;

  opacity: .65;
}

.load-top-left {
  top: 18px;
  left: 22px;
}

.load-top-right {
  top: 18px;
  right: 22px;
}

.load-bottom-left {
  bottom: 18px;
  left: 22px;
}

.load-bottom-right {
  bottom: 18px;
  right: 22px;
}

.loading-window {
  position: absolute;

  width: min(760px, 90vw);
  min-height: 700px;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  background: #252743;

  border: 2px solid #f5e9ca;

  box-shadow:
    12px 12px 0 rgba(15,17,34,.35),
    0 0 0 1px #555a8d,
    0 0 70px rgba(128,131,255,.35);

  animation: windowIn .7s cubic-bezier(.16,1,.3,1);
}

@keyframes windowIn {
  from {
    opacity: 0;
    transform: translate(-50%, -47%) scale(.94);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.loading-window-bar {
  height: 35px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 11px;

  background: #eee2c1;
  color: #272945;

  font-family: "VT323", monospace;
  font-size: 20px;

  border-bottom: 2px solid #17182b;
}

.window-buttons {
  display: flex;
  gap: 12px;
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.loading-content {
  position: relative;
  min-height: 663px;
  padding: 32px 45px;
}

.loading-status {
  display: flex;
  align-items: center;
  gap: 9px;

  font-size: 10px;
  letter-spacing: 2px;

  color: #baf4a5;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #baf4a5;
  border-radius: 50%;

  box-shadow: 0 0 14px #baf4a5;

  animation: statusBlink 1s infinite;
}

@keyframes statusBlink {
  50% {
    opacity: .3;
  }
}

.loading-title {
  display: flex;
  flex-direction: column;

  margin-top: 18px;

  line-height: .78;
}

.title-small {
  font-family: "DM Mono", monospace;
  font-size: 11px;
  letter-spacing: 4px;
  margin-bottom: 12px;
  opacity: .65;
}

.title-big {
  font-family: "Press Start 2P", monospace;
  font-size: clamp(28px, 5vw, 51px);

  color: #fff0bd;

  text-shadow:
    4px 4px 0 #464977,
    0 0 20px rgba(255,240,189,.15);

  animation: titleFlicker 3s infinite;
}

.title-big.outline {
  color: transparent;
  -webkit-text-stroke: 1px #fff0bd;

  margin-left: 32px;
}

@keyframes titleFlicker {
  0%, 92%, 100% {
    opacity: 1;
  }

  94% {
    opacity: .4;
  }

  96% {
    opacity: 1;
  }
}

.loading-photo-zone {
  position: absolute;

  right: 48px;
  top: 103px;

  width: 205px;
  height: 245px;
}

.loading-photo-card {
  position: absolute;
  inset: 0;

  padding: 9px;
  padding-bottom: 38px;

  background: #f3e8c9;

  color: #252743;

  transform: rotate(3deg);

  box-shadow: 7px 8px 0 rgba(20,20,45,.3);

  overflow: hidden;
}

.loading-photo-card.card-back {
  transform: rotate(-8deg) translate(-8px, 8px);
  background: #dfd4b8;
}

.loading-photo-card img,
.fake-photo {
  width: 100%;
  height: 100%;

  object-fit: cover;

  background:
    linear-gradient(
      145deg,
      #d2d6ef,
      #8d8ebd 48%,
      #ee916e
    );
}

.photo-fallback-content {
  position: absolute;
  inset: 9px 9px 38px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,.12) 0,
      rgba(255,255,255,.12) 3px,
      transparent 3px,
      transparent 8px
    );

  font-family: "Press Start 2P", monospace;
  font-size: 9px;

  opacity: 0;
}

.photo-fallback-content strong {
  font-size: 40px;
  margin-top: 15px;
}

.photo-fallback .photo-fallback-content {
  opacity: 1;
}

.fake-sun {
  position: absolute;

  width: 45px;
  height: 45px;

  border-radius: 50%;

  background: #ffe1a5;

  top: 25px;
  right: 25px;
}

.fake-person {
  position: absolute;

  width: 65px;
  height: 105px;

  left: 66px;
  bottom: 20px;

  background: #343655;

  border-radius: 40px 40px 10px 10px;
}

.fake-ground {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 32%;

  background: #9e9cc6;
}

.photo-caption {
  position: absolute;
  bottom: 11px;
  left: 12px;

  font-family: "DM Mono", monospace;
  font-size: 7px;
  letter-spacing: 1px;
}

.photo-number {
  position: absolute;
  right: -25px;
  bottom: 4px;

  font-family: "Press Start 2P", monospace;
  font-size: 9px;

  transform: rotate(-90deg);
}

.loading-note {
  position: absolute;

  padding: 7px 9px;

  background: #d8ff77;
  color: #282a43;

  font-family: "VT323", monospace;
  font-size: 16px;

  box-shadow: 4px 4px 0 rgba(0,0,0,.25);
}

.note-one {
  right: 29px;
  top: 365px;
  transform: rotate(4deg);
}

.note-two {
  left: 30px;
  top: 408px;

  background: #ff9e77;

  transform: rotate(-3deg);
}

.note-three {
  right: 80px;
  top: 420px;

  background: #e4d7ff;

  transform: rotate(5deg);
}

.loading-terminal {
  position: absolute;

  left: 45px;
  bottom: 153px;

  width: 270px;

  font-size: 9px;
  line-height: 1.8;

  opacity: .82;
}

.terminal-green {
  color: #baff98;
}

.terminal-yellow {
  color: #ffd36e;
}

.progress-area {
  position: absolute;

  left: 45px;
  right: 45px;
  bottom: 68px;
}

.progress-label {
  display: flex;
  justify-content: space-between;

  margin-bottom: 8px;

  font-size: 9px;
  letter-spacing: 1px;
}

.progress-track {
  position: relative;

  height: 17px;

  border: 1px solid #eee2c1;

  padding: 3px;

  overflow: hidden;
}

.progress-fill {
  height: 100%;

  background:
    repeating-linear-gradient(
      90deg,
      #d8ff77 0,
      #d8ff77 12px,
      #a7d957 12px,
      #a7d957 16px
    );

  transition: width .06s linear;
}

.progress-shine {
  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.4),
    transparent
  );

  transform: translateX(-100%);

  animation: shine 1.2s linear infinite;
}

@keyframes shine {
  to {
    transform: translateX(100%);
  }
}

.progress-blocks {
  display: flex;
  gap: 4px;

  margin-top: 7px;
}

.progress-blocks span {
  flex: 1;
  height: 4px;

  background: #464866;
}

.progress-blocks span.active {
  background: #d8ff77;
  box-shadow: 0 0 6px rgba(216,255,119,.4);
}

.loading-bottom-text {
  position: absolute;

  left: 45px;
  right: 45px;
  bottom: 27px;

  display: flex;
  justify-content: space-between;

  font-size: 9px;
  letter-spacing: 2px;

  opacity: .55;
}

.loading-dots {
  display: flex;
  gap: 3px;
}

.loading-dots i {
  font-style: normal;
  animation: dot 1.2s infinite;
}

.loading-dots i:nth-child(2) {
  animation-delay: .2s;
}

.loading-dots i:nth-child(3) {
  animation-delay: .4s;
}

@keyframes dot {
  0%, 100% { opacity: .2; }
  50% { opacity: 1; }
}

.floating-disc {
  position: absolute;

  width: 145px;
  height: 145px;

  right: 9%;
  bottom: 9%;

  border-radius: 50%;

  background:
    repeating-radial-gradient(
      circle,
      #d8d9e6 0px,
      #8e91b8 2px,
      #d9d9e2 4px
    );

  border: 5px solid #c5c6d6;

  box-shadow:
    8px 10px 0 rgba(10,10,25,.25),
    0 0 30px rgba(255,255,255,.15);

  animation: discFloat 4s ease-in-out infinite;
}

.disc-hole {
  position: absolute;

  width: 26px;
  height: 26px;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background: #363856;

  border: 7px solid #aeb0ca;
}

.disc-label {
  position: absolute;

  left: 50%;
  top: 25%;

  transform: translateX(-50%);

  font-family: "Press Start 2P", monospace;
  font-size: 9px;

  color: #363856;
}

@keyframes discFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-14px) rotate(10deg);
  }
}

.floating-star {
  position: absolute;

  color: #d8ff77;

  font-size: 30px;

  animation: starFloat 3s ease-in-out infinite;
}

.star-one {
  left: 12%;
  top: 23%;
}

.star-two {
  left: 8%;
  bottom: 22%;

  animation-delay: .8s;
}

.star-three {
  right: 14%;
  top: 19%;

  animation-delay: 1.5s;
}

@keyframes starFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: .5;
  }

  50% {
    transform: translateY(-13px) rotate(15deg);
    opacity: 1;
  }
}

.floating-label {
  position: absolute;

  padding: 8px 12px;

  font-family: "VT323", monospace;
  font-size: 20px;

  background: #ff9e77;
  color: #272945;

  box-shadow: 5px 5px 0 rgba(0,0,0,.2);

  animation: labelFloat 4s ease-in-out infinite;
}

.label-one {
  left: 7%;
  top: 43%;

  transform: rotate(-7deg);
}

.label-two {
  right: 7%;
  top: 43%;

  background: #d8ff77;

  transform: rotate(7deg);

  animation-delay: 1s;
}

@keyframes labelFloat {
  0%, 100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -8px;
  }
}

@media (max-width: 700px) {

  .loading-window {
    width: 94vw;
    min-height: 620px;
  }

  .loading-content {
    min-height: 583px;
    padding: 25px;
  }

  .title-big {
    font-size: 25px;
  }

  .loading-photo-zone {
    right: 22px;
    top: 125px;
    width: 145px;
    height: 175px;
  }

  .loading-terminal {
    left: 25px;
    bottom: 150px;
    width: 210px;
    font-size: 7px;
  }

  .progress-area {
    left: 25px;
    right: 25px;
  }

  .note-one {
    right: 15px;
    top: 315px;
  }

  .note-two {
    left: 18px;
    top: 365px;
  }

  .note-three {
    display: none;
  }

  .floating-disc {
    width: 80px;
    height: 80px;
    right: 2%;
    bottom: 2%;
  }

  .floating-disc .disc-hole {
    width: 18px;
    height: 18px;
    border-width: 5px;
  }

  .floating-disc .disc-label {
    font-size: 6px;
  }

  .load-corner {
    font-size: 7px;
  }
}
`;

/* =========================================================
   DESKTOP CSS
   ========================================================= */

const desktopStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Press+Start+2P&family=VT323&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
}

button,
input {
  font: inherit;
}

.desktop {
  min-height: 100vh;

  background:
    radial-gradient(circle at 20% 20%, rgba(164,169,255,.5), transparent 28%),
    radial-gradient(circle at 80% 70%, rgba(255,150,120,.25), transparent 25%),
    #4a4b77;

  color: #fff0c7;

  font-family: "DM Mono", monospace;

  overflow: hidden;

  position: relative;
}

.background-video {
  position: fixed;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: .14;

  filter:
    saturate(.8)
    contrast(1.15)
    blur(.3px);

  pointer-events: none;
}

.desktop-overlay {
  position: fixed;
  inset: 0;
  z-index: 2;

  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      rgba(91,96,155,.72),
      rgba(44,45,78,.72)
    );
}

.scanlines {
  position: fixed;
  inset: 0;
  z-index: 99;

  pointer-events: none;

  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,.025) 0px,
      rgba(255,255,255,.025) 1px,
      transparent 1px,
      transparent 4px
    );
}

.topbar {
  position: relative;
  z-index: 20;

  height: 42px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  background: #e8ddbd;
  color: #292b48;

  border-bottom: 2px solid #20213a;

  font-family: "VT323", monospace;
  font-size: 20px;
}

.computer-name {
  display: flex;
  align-items: center;
  gap: 9px;
}

.computer-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  background: #83d26b;

  box-shadow: 0 0 7px #83d26b;
}

.topbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 9px;

  font-size: 16px;

  opacity: .65;
}

.clock {
  margin-left: auto;
}

.desktop-stage {
  position: relative;

  min-height: calc(100vh - 42px);

  max-width: 1500px;

  margin: 0 auto;

  padding: 25px;

  z-index: 10;
}

.intro-text {
  position: absolute;

  left: 6%;
  top: 7%;

  width: 380px;

  z-index: 5;

  animation: introFloat 5s ease-in-out infinite;
}

@keyframes introFloat {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.tiny-system {
  font-size: 9px;
  letter-spacing: 3px;

  opacity: .6;

  margin-bottom: 15px;
}

.intro-text h1 {
  margin: 0;

  font-family: "Press Start 2P", monospace;

  font-size: clamp(18px, 2.2vw, 29px);

  line-height: 1.5;

  color: #fff0c7;

  text-shadow:
    3px 3px 0 #35375d;
}

.intro-text h1 span {
  color: #d9ff75;
}

.intro-text p {
  font-family: "VT323", monospace;

  font-size: 20px;
  line-height: 1.1;

  margin-top: 15px;

  color: #e5def0;

  opacity: .9;
}

.window {
  position: absolute;

  background: rgba(40,42,70,.95);

  border: 2px solid #e7ddbf;

  box-shadow:
    8px 9px 0 rgba(20,20,40,.3),
    0 0 30px rgba(20,20,50,.18);

  overflow: hidden;

  animation: windowFloat 5s ease-in-out infinite;
}

@keyframes windowFloat {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.window-header {
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8px;

  background: #e8ddbd;
  color: #2b2c49;

  font-family: "VT323", monospace;
  font-size: 18px;

  border-bottom: 2px solid #20213a;
}

.window-header div {
  letter-spacing: 4px;
}

.files-window {
  left: 5%;
  bottom: 17%;
  width: 280px;

  animation-delay: .5s;
}

.files-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  padding: 20px 12px;
}

.file-item {
  text-align: center;

  cursor: pointer;

  transition: transform .2s;
}

.file-item:hover {
  transform: translateY(-5px) rotate(-2deg);
}

.file-icon {
  font-size: 38px;

  filter: drop-shadow(3px 3px 0 rgba(0,0,0,.25));
}

.file-name {
  margin-top: 5px;

  font-size: 8px;

  word-break: break-word;
}

.window-status {
  padding: 5px 8px;

  font-size: 8px;

  border-top: 1px solid rgba(255,255,255,.12);

  opacity: .5;
}

.notes-window {
  left: 29%;
  top: 7%;

  width: 250px;

  transform: rotate(-2deg);

  animation-delay: 1s;
}

.notes-paper {
  min-height: 230px;

  padding: 18px;

  background:
    repeating-linear-gradient(
      to bottom,
      #f0e6c9 0,
      #f0e6c9 23px,
      #c9c2a9 24px
    );

  color: #3d3950;

  position: relative;
}

.handwriting {
  font-family: "Comic Sans MS", "Bradley Hand", cursive;

  font-size: 17px;

  transform: rotate(-3deg);
}

.handwriting.large {
  font-size: 25px;

  font-weight: bold;

  margin: 12px 0;

  transform: rotate(2deg);
}

.scribble {
  font-size: 24px;

  margin-top: 10px;

  transform: rotate(-4deg);
}

.tiny-note {
  position: absolute;

  bottom: 9px;
  right: 10px;

  font-family: "Comic Sans MS", cursive;

  font-size: 10px;

  transform: rotate(4deg);
}

.photo-window {
  right: 5%;
  top: 8%;

  width: 320px;

  animation-delay: .8s;
}

.photo-viewer {
  padding: 12px;
}

.photo-main {
  position: relative;

  width: 100%;
  height: 220px;

  background:
    linear-gradient(135deg, #8789b9, #b6a9c8 50%, #d8846c);

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-main img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.photo-placeholder {
  font-family: "Press Start 2P", monospace;
  font-size: 11px;

  opacity: .7;
}

.photo-overlay-text {
  position: absolute;

  bottom: 7px;
  left: 7px;

  padding: 3px 5px;

  background: rgba(25,25,40,.7);

  font-size: 8px;
}

.photo-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 9px;

  font-size: 9px;
}

.photo-controls button {
  border: 1px solid #eee1c1;

  background: #343657;

  color: #fff0c7;

  padding: 4px 9px;

  cursor: pointer;
}

.music-window {
  left: 39%;
  top: 34%;

  width: 330px;

  animation-delay: 1.4s;
}

.music-content {
  display: flex;
  gap: 17px;

  padding: 17px;
}

.cd {
  width: 105px;
  height: 105px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    repeating-radial-gradient(
      circle,
      #ddddea 0px,
      #9294b8 2px,
      #d6d6e1 4px
    );

  border: 3px solid #c8c9d7;

  position: relative;

  cursor: pointer;
}

.cd::before {
  content: "";

  position: absolute;

  inset: 30px;

  border-radius: 50%;

  background: #a58a9e;
}

.cd-center {
  position: absolute;

  inset: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2;

  color: #fff0c7;

  font-size: 12px;
}

.cd.spinning {
  animation: spin 1.4s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.music-info {
  flex: 1;
}

.music-now {
  font-size: 8px;
  letter-spacing: 2px;

  opacity: .55;

  margin-bottom: 7px;
}

.music-info strong {
  font-family: "VT323", monospace;
  font-size: 20px;
}

.music-bars {
  display: flex;
  align-items: end;

  height: 42px;

  gap: 3px;

  margin: 8px 0;
}

.music-bars span {
  width: 5px;

  background: #d8ff77;

  animation: equalizer .8s ease-in-out infinite alternate;
}

.music-bars span:nth-child(1) { height: 15px; }
.music-bars span:nth-child(2) { height: 28px; animation-delay: .1s; }
.music-bars span:nth-child(3) { height: 21px; animation-delay: .2s; }
.music-bars span:nth-child(4) { height: 34px; animation-delay: .3s; }
.music-bars span:nth-child(5) { height: 17px; animation-delay: .4s; }
.music-bars span:nth-child(6) { height: 31px; animation-delay: .5s; }
.music-bars span:nth-child(7) { height: 23px; animation-delay: .6s; }
.music-bars span:nth-child(8) { height: 35px; animation-delay: .7s; }

@keyframes equalizer {
  to {
    transform: scaleY(.25);
  }
}

.retro-button,
.record-button {
  border: 1px solid #fff0c7;

  background: #343657;

  color: #fff0c7;

  padding: 6px 9px;

  cursor: pointer;

  font-size: 8px;
}

.retro-button:hover,
.record-button:hover {
  background: #d8ff77;
  color: #292b48;
}

.video-window {
  right: 6%;
  top: 43%;

  width: 290px;

  animation-delay: .2s;
}

.video-content {
  height: 180px;

  position: relative;

  background: #17182a;
}

.video-content video {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: .8;
}

.video-rec {
  position: absolute;

  top: 9px;
  left: 9px;

  color: #ff907b;

  font-size: 9px;

  animation: blink 1s infinite;
}

.video-time {
  position: absolute;

  bottom: 8px;
  right: 8px;

  font-size: 9px;
}

@keyframes blink {
  50% {
    opacity: .2;
  }
}

.recorder-window {
  left: 27%;
  bottom: 14%;

  width: 310px;

  animation-delay: 1.7s;
}

.recorder-content {
  padding: 15px;

  text-align: center;
}

.recorder-mic {
  font-size: 38px;

  margin-bottom: 5px;
}

.recording-title {
  font-family: "VT323", monospace;

  font-size: 19px;

  margin-bottom: 8px;
}

.waveform {
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 3px;

  margin-bottom: 10px;
}

.waveform span {
  width: 3px;

  background: #ff9b7d;

  animation: wave .7s ease-in-out infinite alternate;
}

.waveform span:nth-child(odd) {
  animation-delay: .15s;
}

@keyframes wave {
  to {
    transform: scaleY(.3);
  }
}

.record-button.playing {
  background: #ff9b7d;
  color: #282943;
}

.password-window {
  position: absolute;

  right: 33%;
  bottom: 5%;

  width: 390px;

  background: #292b4a;

  border: 2px solid #f1e5c5;

  box-shadow:
    9px 10px 0 rgba(20,20,40,.35),
    0 0 30px rgba(20,20,40,.2);

  z-index: 30;

  animation: passwordPulse 3s ease-in-out infinite;
}

@keyframes passwordPulse {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

.password-top {
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 9px;

  background: #ff9d7b;

  color: #2b2b49;

  font-size: 9px;
}

.password-inner {
  padding: 17px;
}

.password-small {
  font-size: 8px;

  letter-spacing: 2px;

  opacity: .5;

  margin-bottom: 7px;
}

.password-prompt {
  font-family: "VT323", monospace;

  font-size: 22px;

  margin-bottom: 9px;
}

.password-input-row {
  display: flex;
  gap: 6px;
}

.password-input-row input {
  min-width: 0;
  flex: 1;

  background: #17182a;

  border: 1px solid #eee3c6;

  color: #fff0c7;

  padding: 9px;

  outline: none;

  font-family: "DM Mono", monospace;
}

.password-input-row input:focus {
  box-shadow: 0 0 0 2px rgba(216,255,119,.35);
}

.password-input-row button {
  background: #d8ff77;

  color: #282943;

  border: 0;

  padding: 0 13px;

  cursor: pointer;

  font-size: 9px;

  font-weight: bold;
}

.password-input-row button:hover {
  background: #fff0c7;
}

.password-error {
  margin-top: 8px;

  color: #ff9b7d;

  font-size: 9px;
}

.password-hint {
  margin-top: 9px;

  font-size: 7px;

  opacity: .4;
}

.taskbar {
  position: absolute;

  left: 25px;
  right: 25px;
  bottom: 0;

  height: 40px;

  display: flex;
  align-items: center;

  gap: 4px;

  border-top: 2px solid #242641;

  background: #dcd2b4;

  color: #2a2c49;

  padding: 4px;

  z-index: 50;
}

.start-button {
  height: 30px;

  padding: 0 13px;

  background: #ff9d7b;

  border: 2px outset #fff0d0;

  color: #292b49;

  font-family: "Press Start 2P", monospace;

  font-size: 7px;

  cursor: pointer;
}

.task-item {
  height: 28px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  background: #c8bfd0;

  border: 1px inset #fff;

  font-size: 8px;
}

.task-spacer {
  flex: 1;
}

.task-status {
  padding: 0 8px;

  font-size: 8px;
}

.desktop-sticker {
  position: absolute;

  z-index: 40;

  font-size: 30px;

  color: #d8ff77;

  animation: stickerFloat 3s ease-in-out infinite;
}

.sticker-a {
  right: 34%;
  top: 23%;
}

.sticker-b {
  left: 48%;
  bottom: 25%;

  animation-delay: .8s;
}

.sticker-c {
  right: 24%;
  bottom: 28%;

  color: #ff9d7b;

  font-family: "Press Start 2P", monospace;
  font-size: 16px;

  animation-delay: 1.3s;
}

@keyframes stickerFloat {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }

  50% {
    transform: translateY(-8px) rotate(7deg);
  }
}

.desktop-label {
  position: absolute;

  z-index: 40;

  padding: 6px 10px;

  background: #d8ff77;

  color: #292b49;

  font-family: "VT323", monospace;

  font-size: 17px;

  box-shadow: 4px 4px 0 rgba(0,0,0,.2);
}

.label-a {
  right: 14%;
  top: 30%;

  transform: rotate(5deg);
}

.label-b {
  left: 3%;
  top: 45%;

  background: #e4d8ff;

  transform: rotate(-6deg);
}

@media (max-width: 1000px) {

  .desktop {
    overflow-y: auto;
  }

  .desktop-stage {
    min-height: 1500px;
  }

  .intro-text {
    left: 5%;
    top: 30px;
  }

  .photo-window {
    right: 4%;
    top: 30px;
  }

  .notes-window {
    left: 5%;
    top: 270px;
  }

  .music-window {
    left: 5%;
    top: 560px;
  }

  .video-window {
    right: 4%;
    top: 500px;
  }

  .files-window {
    left: 5%;
    bottom: 260px;
  }

  .recorder-window {
    left: 35%;
    bottom: 260px;
  }

  .password-window {
    right: 5%;
    bottom: 70px;
  }

  .taskbar {
    position: fixed;
    bottom: 0;
  }
}

@media (max-width: 700px) {

  .topbar-center {
    display: none;
  }

  .desktop-stage {
    min-height: 1750px;
    padding: 15px;
  }

  .intro-text {
    position: relative;
    left: auto;
    top: auto;

    width: 100%;

    margin: 20px 0 25px;
  }

  .window,
  .password-window {
    position: relative;

    left: auto;
    right: auto;
    top: auto;
    bottom: auto;

    width: 100%;

    margin: 18px 0;

    transform: none;
  }

  .notes-window,
  .photo-window,
  .music-window,
  .video-window,
  .files-window,
  .recorder-window,
  .password-window {
    animation: none;
  }

  .photo-main {
    height: 240px;
  }

  .files-content {
    grid-template-columns: repeat(3, 1fr);
  }

  .desktop-sticker,
  .desktop-label {
    display: none;
  }

  .taskbar {
    left: 0;
    right: 0;

    overflow: hidden;
  }

  .task-item:nth-of-type(n+3) {
    display: none;
  }
}
`;
