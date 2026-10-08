'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function BirthdayPage() {
  const router = useRouter()

  const [eggOpen, setEggOpen] = useState(null)
  const [notesOpen, setNotesOpen] = useState(true)
  const [musicOpen, setMusicOpen] = useState(true)
  const [filesOpen, setFilesOpen] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(true)
  const [videoOpen, setVideoOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [photoPaused, setPhotoPaused] = useState(false)
  const [photoMissing, setPhotoMissing] = useState({})
  const [videoIndex, setVideoIndex] = useState(0)
  const [videoMissing, setVideoMissing] = useState(false)
  const [launching, setLaunching] = useState(null)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLog, setTerminalLog] = useState(['CLAR_OS [Version 22.0]','Personal Archive Recovery System','[OK] Identity verified','[OK] Memory database mounted','Type HELP to begin.'])
  const [windowOrder, setWindowOrder] = useState({})
  const [windowPositions, setWindowPositions] = useState({})
  const dragRef = useRef(null)
  const nextZRef = useRef(20)
  const launchTimerRef = useRef(null)

  const [musicPlaying, setMusicPlaying] = useState(false)
  const [time, setTime] = useState(new Date())

  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const resumeAfterVideoRef = useRef(false)
  const archivePhotos = Array.from({length:8},(_,i)=>'/images/archive-'+String(i+1).padStart(2,'0')+'.jpg')
  const archiveVideos = Array.from({length:3},(_,i)=>'/media/clar-tape-'+String(i+1).padStart(2,'0')+'.mp4')
  const bringFront = (id) => { nextZRef.current += 1; setWindowOrder(p=>({...p,[id]:nextZRef.current})) }
  const openProgram = (section) => { setLaunching(section); clearTimeout(launchTimerRef.current); launchTimerRef.current=setTimeout(()=>router.push(section.link),1100) }
  const resetDesktop = () => { setNotesOpen(true);setMusicOpen(true);setFilesOpen(true);setPhotoOpen(true);setTerminalOpen(false);setVideoOpen(false);setWindowPositions({});setStartOpen(false) }
  useEffect(()=>()=>clearTimeout(launchTimerRef.current),[])
  useEffect(()=>{if(photoPaused||!photoOpen)return;const id=setInterval(()=>setPhotoIndex(i=>(i+1)%8),4300);return()=>clearInterval(id)},[photoPaused,photoOpen])
  useEffect(()=>{const move=e=>{const d=dragRef.current;if(!d)return;setWindowPositions(p=>({...p,[d.id]:{x:Math.max(0,d.x+e.clientX-d.startX),y:Math.max(0,d.y+e.clientY-d.startY)}}))};const stop=()=>dragRef.current=null;window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop)}},[])
  const startDrag=(e,id)=>{if(window.innerWidth<=850||e.target.closest('button'))return;const rect=e.currentTarget.parentElement.getBoundingClientRect();const desk=document.querySelector('.desktop').getBoundingClientRect();bringFront(id);dragRef.current={id,startX:e.clientX,startY:e.clientY,x:rect.left-desk.left,y:rect.top-desk.top};e.preventDefault()}
  const winProps=(id)=>({style:{zIndex:windowOrder[id]||10,...(windowPositions[id]?{left:windowPositions[id].x,top:windowPositions[id].y,right:'auto',bottom:'auto'}:{})},onPointerDown:()=>bringFront(id)})
  const terminalCommand=e=>{e.preventDefault();const cmd=terminalInput.trim().toUpperCase();setTerminalInput('');if(!cmd)return;if(cmd==='CLEAR'){setTerminalLog([]);return}if(cmd==='EXIT'){setTerminalOpen(false);return}if(cmd==='MEMORY'){openProgram(sections[0]);return}if(cmd==='CONNECTIONS'){openProgram(sections[5]);return}const responses={HELP:'HELP DIR WHOAMI DATE TIME RECOVER HOME MEMORY CONNECTIONS CLEAR EXIT',DIR:'MEMORIES MESSAGES SOUNDTRACK CHAOS QUIZ CONNECTIONS',WHOAMI:'CLAR // ARCHIVE OWNER',DATE:'19.11.2026 // ARCHIVE DATE',TIME:'Time passed. Some things stayed.',RECOVER:'Recovery complete. Nothing important was ever lost.',HOME:"Home is not always a place."};setTerminalLog(p=>[...p,'C:\\CLAR\\ARCHIVE> '+cmd,responses[cmd]||'Command not found. Type HELP.'].slice(-20))}

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const sections = [
    {
      number: '01',
      title: 'MEMORIES',
      sub: 'photos / places / moments',
      link: '/birthday/memories',
      icon: '📁',
      colour: 'purple',
    },
    {
      number: '02',
      title: 'MESSAGES',
      sub: 'things people wanted you to know',
      link: '/birthday/messages',
      icon: '💌',
      colour: 'pink',
    },
    {
      number: '03',
      title: 'SOUNDTRACK',
      sub: 'songs about you',
      link: '/birthday/playlist',
      icon: '💿',
      colour: 'blue',
    },
    {
      number: '04',
      title: 'CHAOS',
      sub: 'shits / giggles / questionable decisions',
      link: '/birthday/games',
      icon: '🎮',
      colour: 'yellow',
    },
    {
      number: '05',
      title: 'QUIZ',
      sub: 'how well do you actually know us?',
      link: '/birthday/quiz',
      icon: '❓',
      colour: 'green',
    },
    {
      number: '06',
      title: 'CONNECTIONS',
      sub: 'everywhere somehow led to here',
      link: '/birthday/journey',
      icon: '🌐',
      colour: 'red',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  const playMusic = () => {
    if (!audioRef.current) return

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          console.log('Add your music file to /public/audio/birthday-song.mp3')
        })
    }
  }

  const openEgg = (egg) => {
    setEggOpen(egg)
  }

  return (
    <main className="archive-screen">

      {/* =========================================================
          AUDIO
      ========================================================= */}

      <audio
        ref={audioRef}
        src="/audio/archive-song.mp3"
        loop
      />

      {/* =========================================================
          CRT / VHS EFFECTS
      ========================================================= */}

      <div className="crt-lines" />
      <div className="vhs-noise" />
      <div className="screen-flicker" />

      {/* =========================================================
          BACKGROUND FLOATING GRAPHICS
      ========================================================= */}

      <div className="floating-symbol symbol-1">✦</div>
      <div className="floating-symbol symbol-2">+</div>
      <div className="floating-symbol symbol-3">✧</div>
      <div className="floating-symbol symbol-4">×</div>
      <div className="floating-symbol symbol-5">◆</div>
      <div className="floating-symbol symbol-6">◇</div>

      <div className="scan-bar" />

      {/* =========================================================
          TOP COMPUTER BAR
      ========================================================= */}

      <header className="computer-bar">

        <div className="system-name">
          <span className="green-dot" />
          CLAR_OS
          <span className="version">v2.2.06</span>
        </div>

        <div className="system-center">
          PRIVATE MEMORY ARCHIVE
        </div>

        <div className="system-right">
          <span>SYS.OK</span>
          <span>{time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</span>

          <button
            onClick={handleLogout}
            className="exit-button"
          >
            EXIT ×
          </button>
        </div>

      </header>

      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <section className="desktop">

        {/* =====================================================
            DESKTOP ICONS
        ===================================================== */}

        <div className="desktop-icons">

          <div className="desktop-icon" onClick={() => setFilesOpen(true)}>
            <div className="icon-box purple">📁</div>
            <span>MEMORY</span>
          </div>

          <div className="desktop-icon" onClick={() => setMusicOpen(true)}>
            <div className="icon-box pink">💿</div>
            <span>SOUND</span>
          </div>

          <div className="desktop-icon" onClick={() => setVideoOpen(true)}>
            <div className="icon-box blue">📼</div>
            <span>VIDEO</span>
          </div>

          <div className="desktop-icon" onClick={() => setNotesOpen(true)}>
            <div className="icon-box yellow">TXT</div>
            <span>NOTES</span>
          </div>

        </div>

        {/* =====================================================
            WELCOME WINDOW
        ===================================================== */}

        <div className="window welcome-window" {...winProps("welcome")}>

          <div className="window-title purple-title" onPointerDown={e=>startDrag(e,"welcome")}>
            <span>WELCOME.EXE</span>

            <div className="window-buttons">
              <span>−</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>

          <div className="welcome-content">

            <div className="mini-status">
              <span className="blink-dot" />
              CONNECTION ESTABLISHED
            </div>

            <div className="glitch-title">
              ACCESS
              <span>GRANTED.</span>
            </div>

            <p className="welcome-copy">
              Welcome back, Clar.
              <br />
              We've recovered 22 years of memories, questionable decisions, and things that probably should've stayed in the group chat.
              <br />
              <span>Some things are worth keeping forever, though.</span>
            </p>

            <div className="terminal-line">
              <span>&gt;</span>
              22 YEARS OF DATA RECOVERED
              <span className="cursor">_</span>
            </div>

          </div>

        </div>

        {/* =====================================================
            NOTES WINDOW
        ===================================================== */}

        {notesOpen && (
          <div className="window notes-window" {...winProps("notes")}>

            <div className="window-title yellow-title" onPointerDown={e=>startDrag(e,"notes")}>
              <span>notes.txt</span>

              <button onClick={() => setNotesOpen(false)}>
                ×
              </button>
            </div>

            <div className="notes-paper archive-note">
              <p className="scribble big">to whoever finds this.</p>
              <p className="scribble">This computer has been holding onto things for a very long time.</p>
              <p className="scribble">Photographs, conversations, familiar faces, forgotten moments. Little pieces of a life that somehow found their way here.</p>
              <p className="scribble">Some files may seem insignificant. Some might bring back things you haven't thought about in years.</p>
              <p className="scribble">Nothing here is in any particular order. That's the thing about memories, isn't it?</p>
              <p className="scribble">They're never quite where you expect them to be.</p>
              <p className="scribble">Take your time. There's no rush to reach the end.</p>
              <p className="scribble">— an old friend</p>
              <div className="tiny-warning">LAST MODIFIED: 19.11.2026</div>
            </div>
          </div>
        )}

        {/* =====================================================
            MUSIC WINDOW
        ===================================================== */}

        {musicOpen && (
          <div className="window music-window" {...winProps("music")}>

            <div className="window-title pink-title" onPointerDown={e=>startDrag(e,"music")}>

              <span>CD_PLAYER.EXE</span>

              <button onClick={() => setMusicOpen(false)}>
                ×
              </button>

            </div>

            <div className="music-body">

              <div className={`cd ${musicPlaying ? 'spinning' : ''}`}>
                <div className="cd-shine" />
                <div className="cd-hole" />
                <div className="cd-label">
                  CLAR
                </div>
              </div>

              <div className="music-info">
                <span className="track-number">
                  TRACK 01 / 22
                </span>

                <strong>
                  untitled_memory.mp3
                </strong>

                <small>
                  main archive soundtrack
                </small>

                <div className="music-progress">
                  <span />
                </div>

                <button
                  onClick={playMusic}
                  className="play-button"
                >
                  {musicPlaying ? 'Ⅱ PAUSE' : '▶ PLAY'}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            PHOTO WINDOW
        ===================================================== */}

        {photoOpen && (
          <div className="window photo-window" {...winProps("photos")}>

            <div className="window-title blue-title" onPointerDown={e=>startDrag(e,"photos")}>

              <span>PHOTOS / RANDOM</span>

              <button onClick={() => setPhotoOpen(false)}>
                ×
              </button>

            </div>

            <div className="archive-photo-viewer">
              <div className="archive-photo-frame">
                {!photoMissing[photoIndex] ? <img src={archivePhotos[photoIndex]} alt={'Archive photo '+(photoIndex+1)} onError={()=>setPhotoMissing(p=>({...p,[photoIndex]:true}))}/> : <div className="archive-photo-pending">▧<br/>IMAGE {String(photoIndex+1).padStart(3,'0')} NOT YET RESTORED<br/><small>ADD PHOTO LATER</small></div>}
              </div>
              <div className="archive-photo-controls">
                <button onClick={()=>setPhotoIndex(i=>(i+7)%8)}>◀ PREV</button>
                <button onClick={()=>setPhotoPaused(p=>!p)}>{photoPaused?'▶ PLAY':'Ⅱ PAUSE'}</button>
                <button onClick={()=>setPhotoIndex(i=>(i+1)%8)}>NEXT ▶</button>
              </div>
              <div className="archive-photo-meta">{String(photoIndex+1).padStart(2,'0')} / 08 <button onClick={()=>openProgram(sections[0])}>OPEN FULL ARCHIVE ↗</button></div>
            </div>
          </div>
        )}

        {/* =====================================================
            VIDEO WINDOW
        ===================================================== */}

        {videoOpen && (
          <div className="window video-window" {...winProps("video")}>

            <div className="window-title purple-title" onPointerDown={e=>startDrag(e,"video")}>

              <span>VIDEO_ARCHIVE.exe</span>

              <button onClick={() => setVideoOpen(false)}>
                ×
              </button>

            </div>

            <div className="archive-video-viewer">
              <div className="archive-tapes">{archiveVideos.map((src,i)=><button key={src} className={videoIndex===i?'active':''} onClick={()=>{if(videoRef.current)videoRef.current.pause();setVideoIndex(i);setVideoMissing(false)}}>📼 TAPE_00{i+1}</button>)}</div>
              {!videoMissing ? <video key={archiveVideos[videoIndex]} ref={videoRef} src={archiveVideos[videoIndex]} controls playsInline onPlay={()=>{resumeAfterVideoRef.current=musicPlaying;if(audioRef.current)audioRef.current.pause();setMusicPlaying(false)}} onPause={()=>{if(resumeAfterVideoRef.current&&audioRef.current){audioRef.current.play().then(()=>setMusicPlaying(true)).catch(()=>{});resumeAfterVideoRef.current=false}}} onError={()=>setVideoMissing(true)}/> : <div className="archive-video-pending">NO SIGNAL // TAPE NOT INSERTED<br/><small>UPLOAD OLD CLIPS LATER</small></div>}
              <small>SP / VHS / TRACKING AUTO</small>
            </div>
          </div>
        )}

        {/* =====================================================
            FILES WINDOW
        ===================================================== */}

        {filesOpen && (
          <div className="window files-window" {...winProps("files")}>

            <div className="window-title green-title" onPointerDown={e=>startDrag(e,"files")}>

              <span>ARCHIVE / FILES</span>

              <button onClick={() => setFilesOpen(false)}>
                ×
              </button>

            </div>

            <div className="file-grid">

              {sections.map((section) => (
                <button
                  key={section.number}
                  onClick={() => openProgram(section)}
                  className="mini-file"
                >

                  <div className={`folder folder-${section.colour}`}>
                    <span>{section.icon}</span>
                  </div>

                  <div className="file-number">
                    {section.number}
                  </div>

                  <div className="file-name">
                    {section.title}
                  </div>

                </button>
              ))}

            </div>

          </div>
        )}

        {/* =====================================================
            SYSTEM TERMINAL
        ===================================================== */}

        {terminalOpen && (
          <div className="window terminal-window" {...winProps("terminal")}>

            <div className="window-title green-title">

              <span>SYSTEM_TERMINAL.exe</span>

              <button onClick={() => setTerminalOpen(false)}>
                ×
              </button>

            </div>

            <div className="terminal archive-terminal">
              {terminalLog.map((line,i)=><p key={i}>&gt; {line}</p>)}
              <form onSubmit={terminalCommand}><label>C:\\CLAR\\ARCHIVE&gt; <input value={terminalInput} onChange={e=>setTerminalInput(e.target.value)} spellCheck={false}/></label><button type="submit">↵</button></form>
              <div className="terminal-suggestions">{['HELP','DIR','WHOAMI','TIME'].map(x=><button key={x} onClick={()=>setTerminalInput(x)}>{x}</button>)}</div>
            </div>
          </div>
        )}

        {/* =====================================================
            APP DOCK
        ===================================================== */}

        <div className="dock">
          <button onClick={()=>setStartOpen(p=>!p)} title="Start menu">⊞</button>

          <button
            onClick={() => setNotesOpen(true)}
            title="Notes"
          >
            📝
          </button>

          <button
            onClick={() => setMusicOpen(true)}
            title="Music"
          >
            💿
          </button>

          <button
            onClick={() => setPhotoOpen(true)}
            title="Photos"
          >
            📸
          </button>

          <button
            onClick={() => setVideoOpen(true)}
            title="Video"
          >
            📼
          </button>

          <button
            onClick={() => setFilesOpen(true)}
            title="Files"
          >
            📁
          </button>

          <button
            onClick={() => setTerminalOpen(true)}
            title="Terminal"
          >
            &gt;_
          </button>

        </div>

        {/* =====================================================
            EASTER EGG #1
            VERY NOTICEABLE BUT STILL HIDDEN
        ===================================================== */}

        <button
          className="egg-hotspot egg-one"
          onClick={() => openEgg('one')}
          aria-label="Hidden archive object"
        >
          <span className="egg-glow" />
          <span className="egg-arrow">↗</span>
        </button>

        {/* =====================================================
            EASTER EGG #2
        ===================================================== */}

        <button
          className="egg-hotspot egg-two"
          onClick={() => openEgg('two')}
          aria-label="Hidden archive object"
        >
          <span className="egg-glow" />
          <span className="egg-arrow">←</span>
        </button>

        {/* =====================================================
            LITTLE BACKGROUND GAME OBJECTS
        ===================================================== */}

        <div className="game-object obj-one">
          <span>★</span>
        </div>

        <div className="game-object obj-two">
          <span>?</span>
        </div>

        <div className="game-object obj-three">
          <span>+</span>
        </div>

        <div className="game-object obj-four">
          <span>◇</span>
        </div>

        {/* =====================================================
            BOTTOM STATUS BAR
        ===================================================== */}

        {startOpen && <div className="archive-start-menu"><strong>CLAR_OS // START</strong>{[['WELCOME',null],['FILES',setFilesOpen],['NOTES',setNotesOpen],['MUSIC',setMusicOpen],['PHOTOS',setPhotoOpen],['VIDEOS',setVideoOpen],['TERMINAL',setTerminalOpen]].map(([label,setter])=><button key={label} onClick={()=>{if(setter)setter(true);setStartOpen(false)}}>▸ {label}</button>)}<button onClick={resetDesktop}>↺ RESET DESKTOP</button><button onClick={handleLogout}>⇥ LOG OUT</button></div>}
        <div className="bottom-status">

          <span>
            <i className="status-green" />
            ONLINE
          </span>

          <span>
            ARCHIVE 001
          </span>

          <span>
            ARCHIVE v22.0 // MEMORY PRESERVED
          </span>

          <span>
            [ TOUCH / CLICK TO EXPLORE ]
          </span>

        </div>

      </section>

      {launching && <div className="archive-launch"><div><small>CLAR_OS // EXECUTING PROGRAM</small><div className="launch-icon">{launching.icon}</div><h2>{launching.title}.exe</h2><p>RECOVERING ARCHIVED DATA...</p><div className="launch-bar"><span/></div><small>PLEASE WAIT // ESTABLISHING CONNECTION</small></div></div>}

      {/* =========================================================
          EASTER EGG MODAL
      ========================================================= */}

      {eggOpen && (
        <div className="egg-overlay">

          <div className="egg-window">

            <div className="egg-header">
              <span>
                SECRET_MESSAGE.EXE
              </span>

              <button
                onClick={() => setEggOpen(null)}
              >
                ×
              </button>
            </div>

            <div className="egg-content">

              <div className="egg-warning">
                ✦ SECRET OBJECT FOUND ✦
              </div>

              <h2>
                CONGRATS
                <br />
                YOU FOUND YOUR
                <br />
                {eggOpen === 'one'
                  ? 'FIRST'
                  : 'SECOND'}
                {' '}
                EASTER EGG
              </h2>

              <div className="egg-divider">
                ─────────
              </div>

              <p>
                apparently you actually looked around.
              </p>

              <p className="egg-small">
                most people would have just clicked
                the obvious stuff.
              </p>

              <div className="audio-card">

                <div className="audio-icon">
                  🎙
                </div>

                <div>
                  <strong>
                    SECRET VOICE MESSAGE
                  </strong>

                  <small>
                    from someone who knows you
                  </small>
                </div>

              </div>

              <audio
                controls
                className="secret-audio"
                src={
                  eggOpen === 'one'
                    ? '/audio/easter-egg-1.mp3'
                    : '/audio/easter-egg-2.mp3'
                }
              />

              <p className="audio-help">
                Replace the audio files in
                <br />
                <code>/public/audio/</code>
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          GLOBAL STYLES
      ========================================================= */}

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap');

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #09050f;
        }

        body {
          overflow-x: hidden;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* ======================================================
           MAIN SCREEN
        ====================================================== */

        .archive-screen {
          min-height: 100vh;
          color: #eee8ff;
          background:
            radial-gradient(circle at 15% 20%, rgba(108, 59, 180, .25), transparent 30%),
            radial-gradient(circle at 85% 70%, rgba(204, 46, 137, .16), transparent 30%),
            linear-gradient(135deg, #110a1b 0%, #171022 42%, #09070f 100%);
          font-family: 'Chakra Petch', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ======================================================
           CRT
        ====================================================== */

        .crt-lines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,.025) 0px,
            rgba(255,255,255,.025) 1px,
            transparent 2px,
            transparent 5px
          );
          mix-blend-mode: screen;
        }

        .vhs-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 998;
          opacity: .09;
          background-image:
            repeating-radial-gradient(
              circle at 20% 30%,
              rgba(255,255,255,.5) 0px,
              transparent 1px,
              transparent 3px
            );
          animation: noiseMove .18s steps(2) infinite;
        }

        .screen-flicker {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 997;
          background: rgba(120, 70, 255, .025);
          animation: flicker .12s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: .15; }
          45% { opacity: .03; }
          48% { opacity: .12; }
          50% { opacity: .04; }
          80% { opacity: .08; }
        }

        @keyframes noiseMove {
          0% { transform: translate(0,0); }
          25% { transform: translate(2%, -1%); }
          50% { transform: translate(-1%, 2%); }
          75% { transform: translate(1%, 1%); }
          100% { transform: translate(-2%, -1%); }
        }

        /* ======================================================
           TOP BAR
        ====================================================== */

        .computer-bar {
          height: 46px;
          border-bottom: 1px solid rgba(205, 171, 255, .2);
          background: rgba(13, 8, 22, .85);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          letter-spacing: .08em;
          position: relative;
          z-index: 50;
          box-shadow: 0 0 25px rgba(130, 75, 255, .1);
        }

        .system-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d7b9ff;
        }

        .version {
          color: #6f647c;
          font-size: 13px;
        }

        .green-dot,
        .blink-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8cffd1;
          box-shadow: 0 0 10px #8cffd1;
          display: inline-block;
          animation: blink 1.2s infinite;
        }

        .system-center {
          color: #70647c;
          font-size: 14px;
        }

        .system-right {
          display: flex;
          gap: 18px;
          align-items: center;
          color: #81758f;
        }

        .exit-button {
          background: transparent;
          border: 1px solid #3b2d4b;
          color: #8c789b;
          padding: 4px 9px;
          font-family: inherit;
          cursor: pointer;
        }

        .exit-button:hover {
          color: #fff;
          border-color: #bd63ff;
          box-shadow: 0 0 12px rgba(189,99,255,.4);
        }

        /* ======================================================
           DESKTOP
        ====================================================== */

        .desktop {
          min-height: calc(100vh - 46px);
          position: relative;
          overflow: hidden;
          padding: 35px;
        }

        /* ======================================================
           DESKTOP ICONS
        ====================================================== */

        .desktop-icons {
          position: absolute;
          left: 18px;
          top: 25px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 4;
        }

        .desktop-icon {
          width: 68px;
          text-align: center;
          color: #9c8daa;
          font-family: 'VT323', monospace;
          font-size: 14px;
          cursor: pointer;
          transition: transform .2s;
        }

        .desktop-icon:hover {
          transform: translateY(-4px);
          color: white;
        }

        .icon-box {
          width: 45px;
          height: 38px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.15);
          margin-bottom: 3px;
          font-size: 22px;
          background: rgba(30,20,42,.7);
          box-shadow: inset 0 0 12px rgba(255,255,255,.06);
        }

        .icon-box.purple { box-shadow: 0 0 14px rgba(173,93,255,.3); }
        .icon-box.pink { box-shadow: 0 0 14px rgba(255,71,184,.3); }
        .icon-box.blue { box-shadow: 0 0 14px rgba(91,189,255,.3); }
        .icon-box.yellow { box-shadow: 0 0 14px rgba(255,213,85,.3); }

        /* ======================================================
           WINDOWS
        ====================================================== */

        .window {
          position: absolute;
          background: rgba(19, 12, 28, .94);
          border: 1px solid rgba(194, 143, 255, .32);
          box-shadow:
            0 15px 50px rgba(0,0,0,.45),
            0 0 30px rgba(141, 65, 255, .08);
          backdrop-filter: blur(4px);
          overflow: hidden;
          animation: windowAppear .6s ease-out both;
        }

        @keyframes windowAppear {
          from {
            opacity: 0;
            transform: scale(.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .window-title {
          height: 29px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px 0 10px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          letter-spacing: .06em;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .window-title button {
          background: transparent;
          border: 0;
          color: inherit;
          font-size: 19px;
          cursor: pointer;
          font-family: inherit;
        }

        .purple-title {
          background: linear-gradient(90deg, #563083, #271639);
          color: #eadbff;
        }

        .pink-title {
          background: linear-gradient(90deg, #84355f, #33152d);
          color: #ffd9ef;
        }

        .blue-title {
          background: linear-gradient(90deg, #275c81, #152e42);
          color: #d7f3ff;
        }

        .yellow-title {
          background: linear-gradient(90deg, #80662b, #352c18);
          color: #fff0b1;
        }

        .green-title {
          background: linear-gradient(90deg, #246454, #102d27);
          color: #caffed;
        }

        /* ======================================================
           WELCOME
        ====================================================== */

        .welcome-window {
          width: 390px;
          left: 13%;
          top: 12%;
          z-index: 7;
        }

        .welcome-content {
          padding: 22px;
          min-height: 205px;
        }

        .mini-status {
          font-family: 'VT323', monospace;
          color: #8cffd1;
          font-size: 15px;
          letter-spacing: .12em;
          margin-bottom: 16px;
        }

        .glitch-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 26px;
          line-height: 1.45;
          color: #eee0ff;
          position: relative;
          text-shadow:
            3px 0 #ff3b9d,
            -3px 0 #53d8ff;
          animation: textGlitch 4s infinite;
        }

        .glitch-title span {
          display: block;
          color: #c58cff;
        }

        @keyframes textGlitch {
          0%, 88%, 100% {
            transform: translate(0);
            opacity: 1;
          }
          89% {
            transform: translate(-3px, 1px);
            opacity: .7;
          }
          90% {
            transform: translate(4px, -1px);
            opacity: .4;
          }
          91% {
            transform: translate(0);
            opacity: 1;
          }
        }

        .welcome-copy {
          font-family: 'VT323', monospace;
          font-size: 19px;
          line-height: 1.15;
          color: #9e91aa;
          margin: 17px 0;
        }

        .welcome-copy span {
          color: #e184ff;
        }

        .terminal-line {
          font-family: 'VT323', monospace;
          font-size: 15px;
          color: #71677d;
          border-top: 1px dashed #3a2d44;
          padding-top: 10px;
        }

        .terminal-line span:first-child {
          color: #8cffd1;
        }

        .cursor {
          animation: cursorBlink .7s infinite;
          color: #fff;
        }

        @keyframes cursorBlink {
          50% { opacity: 0; }
        }

        /* ======================================================
           NOTES
        ====================================================== */

        .notes-window {
          width: 330px;
          left: 5%;
          bottom: 16%;
          transform: rotate(-2deg);
          z-index: 8;
        }

        .notes-paper {
          background:
            linear-gradient(rgba(255,255,255,.95), rgba(235,226,202,.96)),
            #f2ecd9;
          color: #27202a;
          min-height: 285px;
          padding: 24px 22px;
          position: relative;
          overflow: hidden;
        }

        .paper-tape {
          position: absolute;
          top: 7px;
          left: 42%;
          width: 65px;
          height: 16px;
          background: rgba(209,183,128,.55);
          transform: rotate(-3deg);
        }

        .scribble {
          font-family: 'VT323', monospace;
          font-size: 17px;
          line-height: 1.05;
          margin: 0 0 11px;
          transform: rotate(-.5deg);
        }

        .scribble.big {
          font-size: 24px;
          color: #5e214f;
          font-weight: bold;
        }

        .scribble-arrow {
          font-family: monospace;
          color: #aa376b;
          font-size: 21px;
          animation: arrowBounce 1.2s infinite;
        }

        @keyframes arrowBounce {
          50% { transform: translateY(5px); }
        }

        .tiny-warning {
          font-family: 'VT323', monospace;
          font-size: 14px;
          margin-top: 8px;
          color: #69435f;
        }

        .tiny-warning span {
          color: #b43766;
        }

        /* ======================================================
           MUSIC
        ====================================================== */

        .music-window {
          width: 365px;
          right: 8%;
          top: 8%;
          z-index: 10;
        }

        .music-body {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 22px;
        }

        .cd {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background:
            conic-gradient(
              #e9e3f2,
              #6c5f82,
              #d9d0e7,
              #514364,
              #e8d9ff,
              #756584,
              #e9e3f2
            );
          position: relative;
          flex-shrink: 0;
          box-shadow:
            0 0 20px rgba(211,155,255,.3),
            inset 0 0 15px rgba(0,0,0,.4);
        }

        .cd.spinning {
          animation: cdSpin 1.8s linear infinite;
        }

        @keyframes cdSpin {
          to { transform: rotate(360deg); }
        }

        .cd-shine {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: linear-gradient(
            120deg,
            transparent 25%,
            rgba(255,255,255,.5) 40%,
            transparent 53%
          );
        }

        .cd-hole {
          position: absolute;
          width: 23px;
          height: 23px;
          background: #1a1122;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #c8bad4;
        }

        .cd-label {
          position: absolute;
          left: 50%;
          top: 32%;
          transform: translateX(-50%);
          font-family: 'VT323', monospace;
          font-size: 11px;
          color: #3d274c;
        }

        .music-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .track-number {
          font-family: 'VT323', monospace;
          color: #d679b0;
          font-size: 14px;
        }

        .music-info strong {
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
          line-height: 1.5;
          color: #f0e7ff;
        }

        .music-info small {
          font-family: 'VT323', monospace;
          color: #8b7e96;
          font-size: 15px;
        }

        .music-progress {
          width: 100%;
          height: 4px;
          background: #32253d;
          margin: 5px 0;
        }

        .music-progress span {
          display: block;
          width: 62%;
          height: 100%;
          background: linear-gradient(90deg, #b25cff, #ff5cb6);
          animation: progressPulse 2s infinite alternate;
        }

        @keyframes progressPulse {
          to { width: 82%; }
        }

        .play-button {
          width: max-content;
          border: 1px solid #a95dff;
          color: #dfc7ff;
          background: rgba(114,45,163,.2);
          padding: 6px 10px;
          font-family: 'VT323', monospace;
          font-size: 17px;
          cursor: pointer;
        }

        .play-button:hover {
          background: #9c4bdb;
          color: white;
          box-shadow: 0 0 15px rgba(183,77,255,.5);
        }

        /* ======================================================
           PHOTOS
        ====================================================== */

        .photo-window {
          right: 7%;
          top: 39%;
          width: 320px;
          z-index: 6;
        }

        .photo-collage {
          min-height: 245px;
          position: relative;
          background: #17101d;
          padding: 16px;
        }

        .photo-placeholder {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-family: 'VT323', monospace;
          font-size: 17px;
          color: #93859e;
          border: 3px solid #ddd4e5;
          background:
            linear-gradient(135deg, #433650, #21192b);
          box-shadow: 4px 5px 0 rgba(0,0,0,.35);
        }

        .photo-a {
          width: 145px;
          height: 105px;
          left: 20px;
          top: 20px;
          transform: rotate(-5deg);
        }

        .photo-b {
          width: 125px;
          height: 95px;
          right: 17px;
          top: 30px;
          transform: rotate(7deg);
        }

        .photo-c {
          width: 135px;
          height: 95px;
          left: 78px;
          bottom: 25px;
          transform: rotate(2deg);
        }

        .photo-caption {
          position: absolute;
          bottom: 7px;
          left: 12px;
          right: 12px;
          font-family: 'VT323', monospace;
          font-size: 11px;
          color: #655a6c;
        }

        /* ======================================================
           VIDEO
        ====================================================== */

        .video-window {
          width: 300px;
          right: 34%;
          bottom: 12%;
          z-index: 12;
        }

        .video-placeholder {
          height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background:
            radial-gradient(circle, #3e2d4f 0%, #120c18 70%);
          color: #87758e;
          font-family: 'VT323', monospace;
        }

        .play-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid #bf73ff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #d59bff;
          box-shadow: 0 0 22px rgba(194,104,255,.35);
          animation: videoPulse 2s infinite;
        }

        @keyframes videoPulse {
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 35px rgba(194,104,255,.6);
          }
        }

        .video-placeholder small {
          font-size: 12px;
          color: #51475a;
        }

        /* ======================================================
           FILES
        ====================================================== */

        .files-window {
          width: 420px;
          left: 37%;
          bottom: 7%;
          z-index: 15;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          padding: 17px;
        }

        .mini-file {
          text-decoration: none;
          color: #b6a9bf;
          padding: 7px;
          transition: .2s;
          position: relative;
        }

        .mini-file:hover {
          background: rgba(174,95,255,.08);
          color: white;
          transform: translateY(-4px);
        }

        .folder {
          height: 52px;
          position: relative;
          border: 1px solid rgba(255,255,255,.12);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          margin-bottom: 5px;
        }

        .folder::before {
          content: '';
          position: absolute;
          left: 0;
          top: -7px;
          width: 23px;
          height: 8px;
          background: inherit;
          border: inherit;
          border-bottom: 0;
        }

        .folder-purple { background: #342050; }
        .folder-pink { background: #50213e; }
        .folder-blue { background: #1d3d55; }
        .folder-yellow { background: #51411f; }
        .folder-green { background: #1e483b; }
        .folder-red { background: #51242e; }

        .file-number {
          position: absolute;
          right: 5px;
          top: 4px;
          font-family: 'VT323', monospace;
          color: #6e6079;
          font-size: 12px;
        }

        .file-name {
          font-family: 'VT323', monospace;
          font-size: 15px;
          text-align: center;
          letter-spacing: .04em;
        }

        /* ======================================================
           TERMINAL
        ====================================================== */

        .terminal-window {
          width: 310px;
          right: 15%;
          bottom: 20%;
          z-index: 20;
        }

        .terminal {
          min-height: 180px;
          padding: 16px;
          background: #070c0b;
          color: #63e7b2;
          font-family: 'VT323', monospace;
          font-size: 18px;
          line-height: 1.25;
        }

        .terminal-green {
          color: #a4ffdb;
          animation: cursorBlink .8s infinite;
        }

        /* ======================================================
           DOCK
        ====================================================== */

        .dock {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          gap: 7px;
          padding: 8px 11px;
          background: rgba(13,8,19,.88);
          border: 1px solid #40304e;
          box-shadow: 0 0 30px rgba(111,52,180,.25);
          z-index: 60;
        }

        .dock button {
          width: 42px;
          height: 37px;
          border: 1px solid #372842;
          background: #1b1124;
          color: #c7b1d4;
          font-family: 'VT323', monospace;
          font-size: 19px;
          cursor: pointer;
          transition: .2s;
        }

        .dock button:hover {
          transform: translateY(-5px);
          background: #35204b;
          color: white;
          box-shadow: 0 0 15px rgba(191,88,255,.4);
        }

        /* ======================================================
           EASTER EGGS
        ====================================================== */

        .egg-hotspot {
          position: absolute;
          border: 0;
          background: transparent;
          cursor: pointer;
          z-index: 40;
          width: 42px;
          height: 42px;
        }

        /*
          EASTER EGG #1 LOCATION:
          lower-right edge of the welcome window area.
          It looks like a tiny corrupted arrow.
        */

        .egg-one {
          left: 35%;
          top: 30%;
        }

        /*
          EASTER EGG #2 LOCATION:
          beside the photo window, slightly underneath it.
        */

        .egg-two {
          right: 25%;
          top: 63%;
        }

        .egg-glow {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #d15cff;
          filter: blur(8px);
          opacity: .18;
          animation: eggGlow 2s ease-in-out infinite;
        }

        .egg-arrow {
          position: relative;
          color: #d68aff;
          font-family: 'VT323', monospace;
          font-size: 26px;
          text-shadow:
            0 0 5px #c451ff,
            0 0 12px #c451ff;
          animation: eggFlicker 2.8s infinite;
        }

        @keyframes eggGlow {
          0%, 100% {
            opacity: .08;
            transform: scale(.7);
          }
          50% {
            opacity: .5;
            transform: scale(1.2);
          }
        }

        @keyframes eggFlicker {
          0%, 80%, 100% {
            opacity: .15;
          }
          82% {
            opacity: 1;
          }
          84% {
            opacity: .1;
          }
          86% {
            opacity: .9;
          }
        }

        .egg-hotspot:hover .egg-arrow {
          opacity: 1;
          transform: scale(1.3);
        }

        /* ======================================================
           BACKGROUND GAME OBJECTS
        ====================================================== */

        .game-object {
          position: absolute;
          font-family: 'VT323', monospace;
          pointer-events: none;
          color: #755987;
          opacity: .35;
          animation: objectFloat 4s ease-in-out infinite;
        }

        .obj-one {
          top: 14%;
          right: 30%;
          font-size: 25px;
        }

        .obj-two {
          bottom: 30%;
          right: 5%;
          font-size: 28px;
          color: #ca5aff;
        }

        .obj-three {
          top: 45%;
          left: 46%;
          font-size: 20px;
        }

        .obj-four {
          bottom: 9%;
          left: 28%;
          font-size: 30px;
        }

        @keyframes objectFloat {
          0%,100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-10px) rotate(10deg);
          }
        }

        /* ======================================================
           FLOATING SYMBOLS
        ====================================================== */

        .floating-symbol {
          position: fixed;
          color: #a866c7;
          opacity: .18;
          pointer-events: none;
          font-family: 'VT323', monospace;
          z-index: 1;
          animation: floatSymbol 7s ease-in-out infinite;
        }

        .symbol-1 {
          left: 20%;
          top: 20%;
          font-size: 25px;
        }

        .symbol-2 {
          right: 22%;
          top: 25%;
          font-size: 18px;
          animation-delay: 1s;
        }

        .symbol-3 {
          left: 50%;
          top: 10%;
          font-size: 30px;
          animation-delay: 2s;
        }

        .symbol-4 {
          right: 12%;
          bottom: 25%;
          font-size: 20px;
          animation-delay: 3s;
        }

        .symbol-5 {
          left: 8%;
          bottom: 30%;
          font-size: 18px;
          animation-delay: 4s;
        }

        .symbol-6 {
          right: 45%;
          bottom: 8%;
          font-size: 24px;
          animation-delay: 1.5s;
        }

        @keyframes floatSymbol {
          0%,100% {
            transform: translate(0,0) rotate(0);
          }
          50% {
            transform: translate(12px,-20px) rotate(180deg);
          }
        }

        /* ======================================================
           SCAN BAR
        ====================================================== */

        .scan-bar {
          position: fixed;
          left: 0;
          right: 0;
          top: -10%;
          height: 2px;
          background: rgba(213,153,255,.35);
          box-shadow: 0 0 20px rgba(213,153,255,.8);
          z-index: 1000;
          pointer-events: none;
          animation: scan 5s linear infinite;
        }

        @keyframes scan {
          from {
            top: -5%;
          }
          to {
            top: 105%;
          }
        }

        /* ======================================================
           STATUS
        ====================================================== */

        .bottom-status {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 26px;
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(9,5,14,.9);
          border-top: 1px solid #302339;
          color: #65596c;
          font-family: 'VT323', monospace;
          font-size: 13px;
          letter-spacing: .05em;
          z-index: 55;
        }

        .bottom-status span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-green {
          width: 5px;
          height: 5px;
          background: #72ffbd;
          box-shadow: 0 0 7px #72ffbd;
          border-radius: 50%;
        }

        /* ======================================================
           EASTER EGG MODAL
        ====================================================== */

        .egg-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(4,2,8,.72);
          backdrop-filter: blur(7px);
        }

        .egg-window {
          width: 450px;
          max-width: 100%;
          background: #10091a;
          border: 1px solid #c45cff;
          box-shadow:
            0 0 25px rgba(196,92,255,.5),
            0 0 100px rgba(138,51,255,.2);
          animation: eggOpen .35s ease-out;
        }

        @keyframes eggOpen {
          from {
            opacity: 0;
            transform: scale(.88) rotate(-1deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        .egg-header {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          background: linear-gradient(90deg,#71319b,#281335);
          font-family: 'VT323', monospace;
          font-size: 17px;
          color: #f1dfff;
        }

        .egg-header button {
          border: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 20px;
          cursor: pointer;
        }

        .egg-content {
          padding: 30px;
          text-align: center;
        }

        .egg-warning {
          color: #e88cff;
          font-family: 'VT323', monospace;
          font-size: 16px;
          letter-spacing: .14em;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          50% { opacity: .35; }
        }

        .egg-content h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 18px;
          line-height: 1.7;
          color: #f1e6ff;
          text-shadow:
            2px 0 #ff48a9,
            -2px 0 #4ddcff;
          margin: 20px 0;
          animation: glitchSmall 3s infinite;
        }

        @keyframes glitchSmall {
          0%,90%,100% {
            transform: translateX(0);
          }
          92% {
            transform: translateX(-3px);
          }
          94% {
            transform: translateX(3px);
          }
        }

        .egg-divider {
          color: #684477;
          margin: 14px 0;
        }

        .egg-content p {
          font-family: 'VT323', monospace;
          color: #b5a5bf;
          font-size: 19px;
          line-height: 1.1;
        }

        .egg-small {
          color: #71627b !important;
          font-size: 15px !important;
        }

        .audio-card {
          margin: 20px 0 12px;
          border: 1px solid #392348;
          background: #170e21;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .audio-icon {
          width: 43px;
          height: 43px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #38204d;
          border: 1px solid #9856be;
          font-size: 21px;
        }

        .audio-card strong {
          display: block;
          font-family: 'VT323', monospace;
          color: #e7d3f1;
          font-size: 18px;
        }

        .audio-card small {
          font-family: 'VT323', monospace;
          color: #71617b;
          font-size: 14px;
        }

        .secret-audio {
          width: 100%;
          height: 36px;
        }

        .audio-help {
          font-size: 13px !important;
          color: #5f5268 !important;
          margin-top: 14px;
        }

        code {
          color: #c67cff;
        }

        /* ======================================================
           MOBILE
        ====================================================== */

        @media (max-width: 850px) {

          .computer-bar {
            height: 40px;
            padding: 0 9px;
            font-size: 13px;
          }

          .system-center {
            display: none;
          }

          .system-right span:first-child {
            display: none;
          }

          .desktop {
            min-height: calc(100vh - 40px);
            padding: 12px;
            overflow-y: auto;
            height: calc(100vh - 40px);
          }

          .desktop-icons {
            display: none;
          }

          .window {
            position: relative;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            bottom: auto !important;
            width: min(100%, 430px);
            margin: 20px auto;
            transform: none !important;
          }

          .welcome-window {
            margin-top: 12px;
          }

          .music-window,
          .photo-window,
          .notes-window,
          .files-window,
          .video-window,
          .terminal-window {
            display: block;
          }

          .notes-window {
            order: 2;
          }

          .welcome-window {
            order: 1;
          }

          .music-window {
            order: 3;
          }

          .photo-window {
            order: 4;
          }

          .files-window {
            order: 5;
          }

          .video-window {
            order: 6;
          }

          .terminal-window {
            order: 7;
          }

          .dock {
            position: fixed;
            bottom: 30px;
          }

          .bottom-status {
            position: fixed;
            bottom: 0;
            font-size: 10px;
          }

          .bottom-status span:nth-child(2),
          .bottom-status span:nth-child(3) {
            display: none;
          }

          .egg-one {
            left: 75%;
            top: 175px;
          }

          .egg-two {
            right: 4%;
            top: 640px;
          }

          .floating-symbol {
            display: none;
          }

        }

        @media (max-width: 480px) {

          .desktop {
            padding-bottom: 75px;
          }

          .glitch-title {
            font-size: 20px;
          }

          .music-body {
            gap: 12px;
          }

          .cd {
            width: 95px;
            height: 95px;
          }

          .file-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .egg-content {
            padding: 20px;
          }

          .egg-content h2 {
            font-size: 14px;
          }

        }

/* Redesigned unlocked archive: functional media and draggable windows */
.window{touch-action:auto}.window-title{cursor:grab;touch-action:none;user-select:none}
.welcome-copy{line-height:1.7!important}.glitch-title{font-size:clamp(24px,3vw,42px)!important}
.archive-note{min-height:0!important;padding:20px!important}.archive-note .scribble{line-height:1.5!important;margin:0 0 13px!important}.archive-note .scribble.big{font-size:22px!important}
.archive-photo-viewer{padding:12px}.archive-photo-frame{aspect-ratio:4/3;background:#090614;border:4px solid #795c98;display:flex;align-items:center;justify-content:center;overflow:hidden}
.archive-photo-frame img{width:100%;height:100%;object-fit:cover}.archive-photo-pending{text-align:center;font:13px/1.8 monospace;color:#e2b8ef;padding:15px}
.archive-photo-controls{display:flex;gap:6px;margin-top:10px}.archive-photo-controls button,.archive-photo-meta button{background:#623984;color:#f2d5ff;border:1px solid #a87ac8;padding:7px;font:11px monospace;cursor:pointer}
.archive-photo-controls button{flex:1}.archive-photo-meta{display:flex;justify-content:space-between;align-items:center;margin-top:9px;font:11px monospace;color:#8de5e3}
.archive-video-viewer{padding:12px}.archive-tapes{display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap}.archive-tapes button{background:#2b183d;border:1px solid #8055a3;color:#edd0fa;padding:7px;font:10px monospace}.archive-tapes button.active{background:#77499d}
.archive-video-viewer video{width:100%;aspect-ratio:16/9;background:#080511}.archive-video-pending{min-height:170px;background:#080511;display:grid;place-items:center;text-align:center;color:#e0b5ed;font:12px monospace}.archive-video-viewer>small{font:10px monospace;color:#9fdedc}
.archive-terminal{max-height:340px;overflow:auto}.archive-terminal form{display:flex;gap:8px;align-items:center}.archive-terminal input{background:#090613;color:#9ce8d8;border:0;border-bottom:1px solid #5a4774;max-width:155px;outline:none}.archive-terminal button{background:#38204f;color:#a6e7e2;border:1px solid #6e4d87}
.terminal-suggestions{display:flex;gap:6px;margin-top:10px}
.archive-start-menu{position:fixed;bottom:74px;left:15px;width:240px;background:#20112f;border:1px solid #b47ddd;z-index:300;display:flex;flex-direction:column;padding:9px;box-shadow:0 0 25px #08040c}
.archive-start-menu strong{padding:10px;background:#633886;font:12px monospace}.archive-start-menu button{background:transparent;border:0;color:#e4c8f1;text-align:left;padding:8px;font:12px monospace}.archive-start-menu button:hover{background:#613986}
.archive-launch{position:fixed;inset:0;z-index:1200;background:#080511ed;display:grid;place-items:center;color:#e9c9ff;font-family:monospace}.archive-launch>div{border:1px solid #b482d8;background:#1d1030;box-shadow:0 0 50px #8e45bf55;padding:35px;text-align:center;width:min(90vw,470px)}.archive-launch small{color:#8be8dc}.launch-icon{font-size:55px;margin:22px}.archive-launch h2{font-size:24px}.launch-bar{height:9px;border:1px solid #a76acb;margin:20px 0}.launch-bar span{display:block;width:100%;height:100%;background:linear-gradient(90deg,#7de9e3,#d18cf0,#ffaad8);transform-origin:left;animation:archive-load 1.1s linear forwards}@keyframes archive-load{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:850px){.window-title{touch-action:auto}.archive-start-menu{bottom:90px}.archive-photo-viewer{padding:10px}}

      `}</style>

    </main>
  )
}
