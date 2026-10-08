'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PASSWORD = 'thee.archivess'

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
  const [openFile, setOpenFile] = useState(null)
  const [photoPaused, setPhotoPaused] = useState(false)
  const [showRecycle, setShowRecycle] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [windowOpen, setWindowOpen] = useState({notes:true, cd:true, photos:true, files:false, recording:false, terminal:false})
  const [windowPositions, setWindowPositions] = useState({})
  const [maximized, setMaximized] = useState(null)
  const [startOpen, setStartOpen] = useState(false)
  const [controlPanelOpen, setControlPanelOpen] = useState(false)
  const [controlTab, setControlTab] = useState('appearance')
  const [wallpaper, setWallpaper] = useState('nebula')
  const [accent, setAccent] = useState('violet')
  const [crtOn, setCrtOn] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const [screensaver, setScreensaver] = useState(false)
  const [finderOpen, setFinderOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('')
  const [terminalCommand, setTerminalCommand] = useState('')
  const [terminalHistory, setTerminalHistory] = useState(['CLAR_OS TERMINAL [Version 22.04]', 'Type HELP to list commands.'])
  const dragRef = useRef(null)

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
    if (screen !== 'boot' || photoPaused) return

    const timer = setInterval(() => {
      setPhotoIndex((previous) => (previous + 1) % PHOTOS.length)
    }, 2600)

    return () => clearInterval(timer)
  }, [screen, photoPaused])

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

  useEffect(() => {if(audioRef.current)audioRef.current.muted=!soundOn;if(recordingRef.current)recordingRef.current.muted=!soundOn},[soundOn])

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

    if (newAttempts === 2) {
      setHintType(1)
      setShowHint(true)
    }

    if (newAttempts >= 4) {
      setHintType(2)
      setShowHint(true)
    }
  }

  function closeHint() {
    setShowHint(false)
  }

  function focusWindow(name) { setActiveWindow(name) }
  function showWindow(name) {
    setWindowOpen(prev => ({...prev, [name]:true}))
    if (name === 'terminal') setTerminalOpen(true)
    setActiveWindow(name)
    setStartOpen(false)
  }
  function hideWindow(name) {
    setWindowOpen(prev => ({...prev, [name]:false}))
    if (name === 'terminal') setTerminalOpen(false)
    if (maximized === name) setMaximized(null)
  }
  function windowStyle(name) {
    if (maximized === name) return {left:'2%',top:'6%',right:'auto',width:'96%',height:'87%',rotate:'0deg',zIndex:120,display:windowOpen[name]?undefined:'none'}
    if (name === 'terminal') return {left:'34%',top:'31%',right:'auto',width:'42%',height:'43%',rotate:'0deg',...(windowPositions[name] || {}),zIndex:activeWindow === 'terminal' ? 115 : 25,display:windowOpen[name]?undefined:'none'}
    return {...(windowPositions[name] || {}),zIndex:activeWindow===name?105:10,display:windowOpen[name]?undefined:'none'}
  }
  function beginDrag(event,name) {
    if (event.target.closest('button') || window.innerWidth<=760 || maximized===name) return
    const element=event.currentTarget.closest('.desktop-window')
    const desktop=event.currentTarget.closest('.desktop')
    if (!element || !desktop) return
    const rect=element.getBoundingClientRect(),parent=desktop.getBoundingClientRect()
    dragRef.current={name,startX:event.clientX,startY:event.clientY,left:rect.left-parent.left,top:rect.top-parent.top,maxLeft:parent.width-rect.width,maxTop:parent.height-rect.height-38}
    event.currentTarget.setPointerCapture(event.pointerId)
    focusWindow(name)
  }
  function moveDrag(event) {
    const d=dragRef.current
    if (!d) return
    const left=Math.max(0,Math.min(d.maxLeft,d.left+event.clientX-d.startX))
    const top=Math.max(36,Math.min(d.maxTop,d.top+event.clientY-d.startY))
    setWindowPositions(prev=>({...prev,[d.name]:{left:left+'px',top:top+'px',right:'auto',rotate:'0deg'}}))
  }
  function endDrag(){dragRef.current=null}
  function openDesktopFile(name){setOpenFile(name);showWindow('files')}
  function openShortcut(name){
    if(name==='secret'){setOpenFile('SECRET');return}
    if(name==='recycle'){setOpenFile('RECYCLE');return}
    if(name==='control'){setControlPanelOpen(true);setStartOpen(false);return}
    if(name==='find'){setFinderOpen(true);setStartOpen(false);return}
    if(name==='screensaver'){setScreensaver(true);setStartOpen(false);return}
    showWindow(name)
  }
  function desktopIconClick(event,name,action){
    event.stopPropagation();setSelectedIcon(name)
    if(event.detail===0||event.detail>=2||window.matchMedia('(pointer: coarse)').matches)action()
  }
  function runCommand(raw){
    const command=raw.trim().toLowerCase()
    if(!command)return
    let output=''
    if(command==='help')output='COMMANDS: HELP, DIR, SCAN, WHOAMI, HINT, READ ONLINE_ALIAS.TXT, BENEDICT, CLEAR, EXIT'
    else if(command==='dir'||command==='ls')output='C:\\CLAR\\ NOTES.TXT  ONLINE_ALIAS.TXT  ARCHIVE\\  MUSIC\\  [LOCKED]'
    else if(command==='whoami')output='USER: CLAR // STATUS: CHRONICALLY ONLINE // ADMINISTRATOR: NAIDU // CLEARANCE: PENDING'
    else if(command==='scan')output='SCAN COMPLETE. 22 YEARS INDEXED. PASSWORD STILL REQUIRED.'
    else if(command==='hint')output='The answer is closer to your online life than your offline one.'
    else if(command==='read online_alias.txt'||command==='cat online_alias.txt')output='Not the main account. The other username. You know the one.'
    else if(command==='benedict'||command==='sherlock')output='Benedict cumberbatch lowkey would have solved this in 1 sec.'
    else if(command==='clear'||command==='cls'){setTerminalHistory([]);setTerminalCommand('');return}
    else if(command==='exit'){hideWindow('terminal');setTerminalCommand('');return}
    else output='Bad command or file name. Type HELP.'
    setTerminalHistory(prev=>[...prev.slice(-10),'C:\\CLAR> '+raw,output]);setTerminalCommand('')
  }

  function changePhoto(step) {
    setPhotoPaused(true)
    setPhotoIndex((previous) => (previous + step + PHOTOS.length) % PHOTOS.length)
    focusWindow('photos')
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

                <div className={`desktop wallpaper-${wallpaper} accent-${accent} ${crtOn ? "" : "crt-off"}`}>

                  {/* CRT overlays */}

                  {crtOn && <div className="scanlines" />}
                  {crtOn && <div className="screen-noise" />}
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

                  <div className="desktop-sticker sticker-a" aria-hidden="true">✿</div>
                  <div className="desktop-sticker sticker-b" aria-hidden="true">♡</div>

                  {/* =================================================
                      NOTES WINDOW
                  ================================================= */}

                  <div
                    className={`desktop-window notes-window ${
                      activeWindow === 'notes' ? 'window-active' : ''
                    }`}
                    style={windowStyle("notes")}
                    onClick={() => focusWindow('notes')}
                  >
                    <WindowBar
                      title="notes.txt"
                      icon="▤"
                      active={activeWindow === 'notes'}
                      onClose={() => hideWindow("notes")}
                      onMaximize={() => setMaximized(maximized === "notes" ? null : "notes")}
                      onPointerDown={(event) => beginDrag(event, "notes")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
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
                        <p className="note-postscript">(click around, I know you well enough you’ll look every goddamn place so I trust your instincts that you’d be able to find the password ehehe)</p>
                        <p className="note-whisper">it’s kinddaaa related to your social media, that’s all I can give you</p>

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
                    style={windowStyle("files")}
                    onClick={() => focusWindow('files')}
                  >
                    <WindowBar
                      title="ARCHIVE / FILES"
                      icon="▦"
                      active={activeWindow === 'files'}
                      onClose={() => hideWindow("files")}
                      onMaximize={() => setMaximized(maximized === "files" ? null : "files")}
                      onPointerDown={(event) => beginDrag(event, "files")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
                    />

                    <div className="file-grid">

                      <FakeFile
                        icon="🥚"
                        name="EGGS"
                        onOpen={() => openDesktopFile('EGGS')}
                      />

                      <FakeFile
                        icon="🦶"
                        name="FEETGANG"
                        onOpen={() => openDesktopFile('FEETGANG')}
                      />

                      <FakeFile
                        icon="🎓"
                        name="GRADUATION"
                        onOpen={() => openDesktopFile('GRADUATION')}
                      />

                      <FakeFile
                        icon="📸"
                        name="MEMORIES"
                        onOpen={() => openDesktopFile('MEMORIES')}
                      />

                      <FakeFile
                        icon="💌"
                        name="MESSAGES"
                        onOpen={() => openDesktopFile('MESSAGES')}
                      />

                      <FakeFile
                        icon="☠"
                        name="DO_NOT_OPEN"
                        onOpen={() => openDesktopFile('DO_NOT_OPEN')}
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
                    style={windowStyle("cd")}
                    onClick={() => focusWindow('cd')}
                  >
                    <WindowBar
                      title="CD PLAYER.exe"
                      icon="◉"
                      active={activeWindow === 'cd'}
                      onClose={() => hideWindow("cd")}
                      onMaximize={() => setMaximized(maximized === "cd" ? null : "cd")}
                      onPointerDown={(event) => beginDrag(event, "cd")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
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
                    style={windowStyle("photos")}
                    onClick={() => focusWindow('photos')}
                  >
                    <WindowBar
                      title="PHOTOS / IMG_VIEWER"
                      icon="▣"
                      active={activeWindow === 'photos'}
                      onClose={() => hideWindow("photos")}
                      onMaximize={() => setMaximized(maximized === "photos" ? null : "photos")}
                      onPointerDown={(event) => beginDrag(event, "photos")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
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

                      <div className="photo-toolbar">
                        <button type="button" onClick={(event) => { event.stopPropagation(); changePhoto(-1) }} aria-label="Previous memory photo">◀ PREV</button>
                        <span>CAMERA_ROLL / 2004—2026</span>
                        <button type="button" onClick={(event) => { event.stopPropagation(); setPhotoPaused((value) => !value) }}>{photoPaused ? '▶ AUTO' : '❚❚ PAUSE'}</button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); changePhoto(1) }} aria-label="Next memory photo">NEXT ▶</button>
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
                              setPhotoPaused(true)
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
                    style={windowStyle("recording")}
                    onClick={() => focusWindow('recording')}
                  >
                    <WindowBar
                      title="VOICE_NOTE.wav"
                      icon="♫"
                      active={activeWindow === 'recording'}
                      onClose={() => hideWindow("recording")}
                      onMaximize={() => setMaximized(maximized === "recording" ? null : "recording")}
                      onPointerDown={(event) => beginDrag(event, "recording")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
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
                    style={windowStyle("terminal")}
                    onClick={() => focusWindow('terminal')}
                  >
                    <WindowBar
                      title="SYSTEM_TERMINAL"
                      icon=">"
                      active={activeWindow === 'terminal'}
                      onClose={() => hideWindow("terminal")}
                      onMaximize={() => setMaximized(maximized === "terminal" ? null : "terminal")}
                      onPointerDown={(event) => beginDrag(event, "terminal")}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
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
                        {terminalHistory.map((line,index) => <div key={index}>{line}</div>)}
                        <div className="terminal-last">{terminalText}</div>
                      </div>
                      <form className="terminal-command-form" onSubmit={event => {event.preventDefault();runCommand(terminalCommand)}}>
                        <span>C:\CLAR&gt;</span>
                        <input aria-label="Terminal command" value={terminalCommand} onChange={event=>setTerminalCommand(event.target.value)} placeholder="type HELP" spellCheck="false" />
                      </form>

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

                  <div className="password-panel" onPointerDown={() => setActiveWindow("password")}>

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

                  <div className="retro-taskbar">
                    <button type="button" className="retro-start" onClick={() => setStartOpen(value => !value)}>▦ START</button>
                    <button type="button" className="retro-tab" onClick={() => showWindow('notes')}>▤ notes.txt</button>
                    <button type="button" className="retro-tab" onClick={() => showWindow('cd')}>◉ CD PLAYER.exe</button>
                    <button type="button" className="retro-tab" onClick={() => showWindow('files')}>📁 FILES</button>
                     <button type="button" className="retro-terminal" onClick={() => showWindow('terminal')}>⌘ terminal</button>
                    <span className="retro-clock">CLAR_OS 22:04</span>
                  </div>

                  <div className="desktop-shortcuts" aria-label="Desktop shortcuts">
                    {[
                      ['📁','archive','files'],['♫','voice_note.wav','recording'],
                      ['⚙','control panel','control'],['⌕','find files','find'],
                      ['💌','secret.txt','secret'],['💻','terminal.exe','terminal'],
                      ['🗑️','recycle bin','recycle']
                    ].map(([icon,label,action]) => (
                      <button key={label} type="button" className={selectedIcon===label?'selected':''} onClick={event=>desktopIconClick(event,label,()=>openShortcut(action))} onDoubleClick={()=>openShortcut(action)} title="Double-click on computer, tap on mobile">
                        <span>{icon}</span>{label}
                      </button>
                    ))}
                  </div>

                  {openFile && (
                    <div className="retro-dialog-backdrop" onClick={() => setOpenFile(null)}>
                      <section className="retro-dialog file-dialog" role="dialog" aria-modal="true" aria-label={openFile} onClick={event => event.stopPropagation()}>
                        <div className="retro-dialog-title">
                          <span>▣ C:\CLAR\{openFile.toLowerCase()}</span>
                          <button type="button" onClick={() => setOpenFile(null)} aria-label="Close">×</button>
                        </div>
                        <div className="retro-dialog-body">
                          {['EGGS','GRADUATION','MEMORIES'].includes(openFile) ? (
                            <div className="file-locked"><div className="file-lock-icon">🔒</div><strong>ACCESS DENIED</strong><p>Enter password to access.</p><small>THIS DIRECTORY IS LOCKED UNTIL ARCHIVE LOGIN.</small></div>
                          ) : openFile === 'DO_NOT_OPEN' ? (
                            <div className="file-locked"><div className="file-lock-icon">☒</div><strong>NO ACCESS</strong><p>Be patient.</p></div>
                          ) : openFile === 'FEETGANG' ? (
                            <div className="feetgang-content"><div className="file-lock-icon">🦶</div><strong>FEETGANG / CASE FILE 001</strong><p>Somewhere along the way, Clar and Yanaal decided there needed to be an investigation into who had a thing for feet.</p><p>There was no evidence. There was no conclusion. There was, unfortunately, a group name.</p><small>STATUS: THE ALLEGATIONS REMAIN UNPROVEN.</small></div>
                          ) : openFile === 'MESSAGES' ? (
                            <div className="message-archive">
                              <div className="message-archive-header">✉ messages.log <small>recovered chat fragments</small></div>
                              {[
                                ['Clar','if you were an egg what color egg would you be',true],
                                ['Clar','open ended question since am in a mood',true],
                                ['Naidu','is he the one who holds the sandwich and says idiot sand which',false],
                                ['Clar','HELP',true],
                                ['Naidu','Century egg',false],
                                ['Naidu','with or without the wrapper part',false],
                                ['Clar','Black on the outside\nGreen on the inside',true]
                              ].map(([sender,body,forwarded],index) => (
                                <div key={index} className={'chat-bubble ' + (sender === 'Naidu' ? 'chat-naidu' : 'chat-clar')}>
                                  <small>{sender}{forwarded ? ' · Forwarded' : ''}</small>
                                  <p>{body}</p><span>11:39 AM</span>
                                </div>
                              ))}
                              <div className="chat-end">END OF RECOVERED MESSAGES</div>
                            </div>
                          ) : openFile === 'SECRET' ? (
                            <div className="secret-file"><strong>secret.txt</strong><p>not everything worth keeping lives on the main account.</p><p className="secret-muted">file origin: SOCIAL / ALTERNATE PROFILE</p></div>
                          ) : (
                            <div className="file-locked"><div className="file-lock-icon">🗑️</div><strong>RECYCLE BIN</strong><p>Nothing here. The embarrassing memories are still backed up.</p></div>
                          )}
                          <button type="button" className="retro-ok" onClick={() => setOpenFile(null)}>OK</button>
                        </div>
                      </section>
                    </div>
                  )}

                  {startOpen && (
                    <div className="start-menu" role="menu" aria-label="CLAR OS Start menu">
                      <div className="start-menu-side">CLAR_OS <span>22.04</span></div>
                      <div className="start-menu-items">
                        <div className="start-menu-heading">CLAR'S COMPUTER</div>
                        {[
                          ['▣','My Computer','files'],['▤','My Documents','notes'],
                          ['◉','CD Player','cd'],['♫','Voice Recorder','recording'],
                          ['▧','Photo Viewer','photos'],['>_','Terminal','terminal'],
                          ['⚙','Control Panel','control'],['⌕','Find Files','find'],
                          ['🗑','Recycle Bin','recycle'],['☾','Screen Saver','screensaver']
                        ].map(([icon,label,action]) => (
                          <button key={label} type="button" onClick={() => {setStartOpen(false);openShortcut(action)}}><span>{icon}</span>{label}<small>›</small></button>
                        ))}
                        <div className="start-menu-footer">CLAR_OS · ALL RIGHTS RESERVED (probably)</div>
                      </div>
                    </div>
                  )}

                  {controlPanelOpen && (
                    <div className="retro-dialog-backdrop" onClick={() => setControlPanelOpen(false)}>
                      <section className="retro-dialog control-panel" role="dialog" aria-modal="true" aria-label="Control Panel" onClick={event => event.stopPropagation()}>
                        <div className="retro-dialog-title"><span>⚙ CONTROL_PANEL.exe</span><button type="button" onClick={() => setControlPanelOpen(false)}>×</button></div>
                        <div className="control-tabs">
                          {['appearance','display','audio','screensaver','system'].map(tab => <button key={tab} type="button" className={controlTab===tab?'chosen':''} onClick={() => setControlTab(tab)}>{tab.toUpperCase()}</button>)}
                        </div>
                        <div className="control-content">
                          {controlTab === 'appearance' && <><strong>DESKTOP PERSONALISATION</strong><p>Choose your wallpaper.</p><div className="control-options">{['nebula','stars','plain'].map(value => <button type="button" key={value} className={wallpaper===value?'chosen':''} onClick={() => setWallpaper(value)}>{value}</button>)}</div><p>Window colour</p><div className="control-options">{['violet','rose','blue'].map(value => <button type="button" key={value} className={accent===value?'chosen':''} onClick={() => setAccent(value)}>{value}</button>)}</div><small>Changes are applied immediately.</small></>}
                          {controlTab === 'display' && <><strong>MONITOR SETTINGS</strong><p>CRT scanlines &amp; screen grain</p><button type="button" className="control-toggle" onClick={() => setCrtOn(!crtOn)}>{crtOn?'☑ ENABLED':'☐ DISABLED'}</button><p>For the full 2000s computer feeling, leave this on.</p></>}
                          {controlTab === 'audio' && <><strong>SOUND SETTINGS</strong><p>Audio output</p><button type="button" className="control-toggle" onClick={() => setSoundOn(!soundOn)}>{soundOn?'♫ UNMUTED':'♫ MUTED'}</button><p>This controls the CD player and voice note.</p></>}
                          {controlTab === 'screensaver' && <><strong>SCREEN SAVER</strong><p>CLAR_OS / floating stars / deep violet</p><button type="button" className="control-toggle" onClick={() => {setControlPanelOpen(false);setScreensaver(true)}}>▶ PREVIEW</button><p>Move back to the desktop by clicking anywhere.</p></>}
                           {controlTab === 'system' && <><strong>CLAR_OS // SYSTEM PROPERTIES</strong><p>Registered user: CLAR</p><p>System administrator: <strong>NAIDU</strong></p><p>Operating system: CLAR_OS 22.04</p><p>Archive status: LOCKED // AWAITING PASSWORD</p><small>Some files are best discovered, not explained.</small></>}
                        </div>
                        <div className="control-bottom"><button type="button" className="retro-ok" onClick={() => setControlPanelOpen(false)}>CLOSE</button></div>
                      </section>
                    </div>
                  )}

                  {finderOpen && (
                    <div className="retro-dialog-backdrop" onClick={() => setFinderOpen(false)}>
                      <section className="retro-dialog finder-dialog" role="dialog" aria-modal="true" aria-label="Find Files" onClick={event => event.stopPropagation()}>
                        <div className="retro-dialog-title"><span>⌕ FIND_FILES.exe</span><button type="button" onClick={() => setFinderOpen(false)}>×</button></div>
                        <div className="finder-content">
                          <label htmlFor="clar-file-search">Search Clar's computer</label>
                          <input id="clar-file-search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Type a file or folder name..." />
                          {['notes','files','cd','photos','recording','terminal','secret','EGGS','FEETGANG','GRADUATION','MEMORIES','MESSAGES','DO_NOT_OPEN'].filter(name => name.toLowerCase().includes(searchTerm.toLowerCase())).map(name =>
                            <button type="button" key={name} onClick={() => {setFinderOpen(false);['EGGS','FEETGANG','GRADUATION','MEMORIES','MESSAGES','DO_NOT_OPEN'].includes(name)?openDesktopFile(name):openShortcut(name)}}>▣ {name}</button>
                          )}
                        </div>
                      </section>
                    </div>
                  )}

                  {screensaver && <div className="clar-screensaver" role="button" tabIndex={0} onClick={() => setScreensaver(false)} onKeyDown={event => {if(event.key==='Enter'||event.key==='Escape')setScreensaver(false)}}>
                    <div className="screensaver-stars">✧ · ✦ · ✧</div><div className="screensaver-logo">CLAR_OS</div><p>press anywhere to return</p>
                  </div>}

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
                                it’s kinddaaa related to your social media, that’s all I can give you
                              </p>
                            </>
                          ) : (
                            <>
                              <strong>
                                FINE. ANOTHER HINT.
                              </strong>

                              <p>
                                it’s your instagram username
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

function WindowBar({ title, icon, active, onClose, onMaximize, onPointerDown, onPointerMove, onPointerUp }) {
  return (
    <div
      className={
        active
          ? 'window-titlebar window-titlebar-active'
          : 'window-titlebar'
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
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
        <button type="button" title="Minimise" onClick={event => {event.stopPropagation();onClose?.()}}>—</button>
        <button type="button" title="Maximise or restore" onClick={event => {event.stopPropagation();onMaximize?.()}}>□</button>
        <button type="button" title="Close" onClick={event => {event.stopPropagation();onClose?.()}}>×</button>
      </div>

    </div>
  )
}


/* =============================================================
   FILE COMPONENT
============================================================= */

function FakeFile({ icon, name, onOpen }) {
  return (
    <button
      className="fake-file"
      type="button"
      onClick={(event) => { event.stopPropagation(); if (event.detail === 0 || event.detail >= 2 || window.matchMedia('(pointer: coarse)').matches) onOpen?.() }}
      onDoubleClick={(event) => { event.stopPropagation(); onOpen?.() }}
      title={`Double-click to open ${name} (tap on mobile)`}
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


/* ==============================================================
   PERSONAL 2000s COMPUTER: ENTRY SCREEN ONLY.
   The password, loading transition and post-login pages are intact.
================================================================ */
.birthday-shell .desktop {background:radial-gradient(ellipse at 23% 76%,#ed7bb022,transparent 44%),radial-gradient(ellipse at 74% 16%,#7cbfdb22,transparent 42%),linear-gradient(140deg,#281a35,#151022 58%,#2b1a38);}
.birthday-shell .desktop-header {background:linear-gradient(90deg,#775a96,#4b517c 54%,#77548b);border-bottom:2px solid #b5a3c4;}
.birthday-shell .desktop-window {border:2px solid #d2bddb;box-shadow:5px 6px 0 #0008,0 16px 28px #0007;}
.birthday-shell .window-titlebar {color:#2e233c;background:linear-gradient(90deg,#b8a9d8,#e6c4dc);border-bottom:1px solid #8b7098;font-weight:bold;}
.birthday-shell .window-titlebar-active {background:linear-gradient(90deg,#b5e4de,#a5bcd6);color:#213b49;}
.birthday-shell .notes-window {left:4%;top:12%;width:29%;height:37%;rotate:-1.8deg;z-index:9;}
.birthday-shell .notes-window .window-titlebar {background:linear-gradient(90deg,#c4a064,#e5c58f);}
.birthday-shell .notes-paper {background:linear-gradient(110deg,#fff4dc,#f7e8d2);padding:19px 18px 16px 30px;}
.birthday-shell .note-heading {color:#9b416f;}
.birthday-shell .handwriting {font-size:clamp(11px,.94vw,15px);line-height:1.45;}
.birthday-shell .cd-window {left:auto;right:4%;top:13%;width:29%;height:28%;rotate:1.5deg;z-index:12;}
.birthday-shell .cd-window .window-titlebar {background:linear-gradient(90deg,#a2d9e3,#c6a9d8);}
.birthday-shell .cd-player-body {gap:10px;padding:13px;}
.birthday-shell .cd-spin-container {width:min(125px,42%);}
.birthday-shell .cd-information {min-width:0;}
.birthday-shell .recording-window {right:34%;top:12%;width:25%;height:19%;rotate:-1deg;z-index:8;}
.birthday-shell .recording-window .window-titlebar {background:linear-gradient(90deg,#c6aed5,#a6bddf);}
.birthday-shell .recording-body {gap:7px;padding:8px;}
.birthday-shell .photos-window {left:6%;top:60%;width:27%;height:31%;rotate:2.2deg;z-index:9;}
.birthday-shell .photos-window .window-titlebar {background:linear-gradient(90deg,#e5b1c9,#f1d5bc);}
.birthday-shell .photo-main {border:5px solid #f1e5d6;background:#241825;box-shadow:3px 3px 0 #0006;}
.birthday-shell .photo-main img {filter:sepia(.18) saturate(.73) contrast(1.09);}
.birthday-shell .photo-viewer {padding:8px;}
.birthday-shell .photo-toolbar {display:flex;align-items:center;justify-content:space-between;gap:3px;padding:5px 0 1px;color:#c7abc8;font:7px 'Courier New',monospace;}
.birthday-shell .photo-toolbar button {background:#e5c5da;color:#4d304c;border:1px outset #fff;padding:3px 4px;font:7px 'Courier New',monospace;}
.birthday-shell .files-window {left:auto;right:4%;top:56%;width:30%;height:32%;rotate:-1.4deg;z-index:9;}
.birthday-shell .files-window .window-titlebar {background:linear-gradient(90deg,#b5cda3,#d3d9b3);}
.birthday-shell .fake-file {font-size:9px;gap:6px;padding:8px 4px;border:1px solid transparent;}
.birthday-shell .fake-file:hover,.birthday-shell .fake-file:focus-visible {background:#d4a7e433;border-color:#b5a6cd;outline:none;}
.birthday-shell .fake-file-icon {width:44px;height:35px;background:linear-gradient(145deg,#b998c9,#6e517d);font-size:20px;border:1px outset #dac4e8;}
.birthday-shell .fake-file-name {max-width:96px;color:#eee0f4;}
.birthday-shell .terminal-window {left:39%;top:78%;width:24%;height:13%;rotate:.7deg;z-index:7;}
.birthday-shell .terminal-window .window-titlebar {background:linear-gradient(90deg,#adb1bb,#d0c5d1);}
.birthday-shell .password-panel {
  left:50%;top:43%;width:34%;min-width:0;padding:0;
  border:3px ridge #f7d7ef;background:#f5ebef;color:#35283e;
  box-shadow:8px 9px 0 #0009,0 14px 38px #0009;
  animation:none;z-index:80;
}
.birthday-shell .password-panel::before {
  content:'🔒  password_required.exe      _  □  ×';
  margin:0 0 0;padding:9px 12px;background:linear-gradient(90deg,#b56a9f,#8069a4);
  color:#fff9fe;font:bold 11px 'Courier New',monospace;letter-spacing:0;
  border-bottom:2px solid #fff6;
}
.birthday-shell .password-topline {padding:13px 17px 0;margin:0;color:#80677f;font-size:9px;}
.birthday-shell .password-title {padding:0 17px;margin:8px 0 8px;color:#422d4b;font:bold clamp(17px,1.7vw,26px) 'Trebuchet MS',sans-serif;text-shadow:none;}
.birthday-shell .password-title .glitch {color:#563a62;text-shadow:none;animation:none;}
.birthday-shell .password-title .glitch::before,.birthday-shell .password-title .glitch::after {display:none;}
.birthday-shell .password-intro {padding:0 17px;color:#402f40;font:clamp(12px,.97vw,15px)/1.45 'Trebuchet MS',sans-serif;}
.birthday-shell .password-subtext {padding:0 17px;color:#765e74;font:clamp(11px,.85vw,13px)/1.45 'Trebuchet MS',sans-serif;}
.birthday-shell .password-form {padding:4px 17px 0;margin-top:9px;gap:7px;}
.birthday-shell .password-input-wrap {height:41px;background:#fff;border:2px inset #b6a0b4;}
.birthday-shell .password-input-wrap input {color:#38223b;background:#fff;font-size:12px;}
.birthday-shell .password-input-wrap input::placeholder {color:#907e90;}
.birthday-shell .input-prefix {color:#84688b;}
.birthday-shell .cursor-block {color:#ac72a4;}
.birthday-shell .enter-button {height:41px;background:linear-gradient(#f3c4dc,#dca3c5);color:#492d48;border:2px outset #fff;box-shadow:none;font:bold 10px 'Trebuchet MS',sans-serif;}
.birthday-shell .enter-button:hover {background:#f8d8e9;}
.birthday-shell .password-status {margin:0;padding:12px 17px 14px;color:#7b697e;font:10px 'Courier New',monospace;}
.birthday-shell .password-status.status-error {color:#af366b;}
.birthday-shell .desktop-doodle {top:36%;left:38%;color:#e7b5d0;font:20px 'Comic Sans MS',cursive;}
.birthday-shell .desktop-sticker {opacity:.7;}
.birthday-shell .retro-taskbar {background:linear-gradient(#9c85b2,#5c4878);border-top:2px solid #d7c3df;gap:5px;}
.birthday-shell .retro-taskbar button {cursor:pointer;font-size:10px;}
.birthday-shell .retro-start {background:linear-gradient(#e9c3da,#b57dba);color:#402b50;border:2px outset #f8e2ef;}
.birthday-shell .retro-tab {background:#e1c9e2;color:#473852;border:2px outset #fff2;}
.birthday-shell .retro-tab:hover {background:#f4e0f0;}
.birthday-shell .desktop-shortcuts {position:absolute;left:36%;top:33%;display:flex;gap:12px;z-index:7;}
.birthday-shell .desktop-shortcuts button {border:1px solid transparent;background:transparent;color:#e9d6f1;display:flex;flex-direction:column;align-items:center;gap:3px;font:9px 'Courier New',monospace;cursor:pointer;}
.birthday-shell .desktop-shortcuts button span {font-size:25px;}
.birthday-shell .desktop-shortcuts button:hover {background:#ffffff24;border-color:#ffffff77;}
.birthday-shell .retro-dialog-backdrop {position:absolute;inset:36px 0 38px;z-index:120;background:#10071988;display:flex;align-items:center;justify-content:center;padding:15px;}
.birthday-shell .retro-dialog {width:min(360px,95%);background:#f4eaf1;border:3px ridge #d6b4d3;box-shadow:9px 11px 0 #0008;color:#412c42;font:13px 'Trebuchet MS',sans-serif;}
.birthday-shell .retro-dialog-title {background:linear-gradient(90deg,#a35c9b,#7661a1);color:white;display:flex;align-items:center;justify-content:space-between;padding:7px 10px;font:bold 11px 'Courier New',monospace;}
.birthday-shell .retro-dialog-title button {background:#ead3e7;color:#4b3150;border:2px outset #fff;font-size:15px;line-height:1;}
.birthday-shell .retro-dialog-body {padding:20px;text-align:center;}
.birthday-shell .retro-dialog-icon {font-size:40px;margin-bottom:9px;}
.birthday-shell .retro-dialog-body strong {display:block;font-size:16px;}
.birthday-shell .retro-dialog-body p {line-height:1.5;}
.birthday-shell .retro-ok {background:#eac8e1;color:#50314e;border:2px outset #fff;padding:7px 20px;font-weight:bold;}
@media (min-width:761px) and (max-width:1150px) {
  .birthday-shell .desktop {min-height:900px;}
  .birthday-shell .notes-window {left:3%;top:10%;width:31%;height:37%;}
  .birthday-shell .cd-window {right:2%;top:11%;width:31%;height:28%;}
  .birthday-shell .recording-window {right:34%;top:11%;width:30%;height:18%;}
  .birthday-shell .password-panel {top:44%;width:37%;}
  .birthday-shell .photos-window {left:3%;top:60%;width:31%;height:31%;}
  .birthday-shell .files-window {right:2%;top:58%;width:31%;height:30%;}
  .birthday-shell .terminal-window {left:37%;top:80%;width:28%;height:12%;}
  .birthday-shell .desktop-shortcuts {display:none;}
  .birthday-shell .photo-toolbar span {display:none;}
}
@media (max-width:760px) {
  .birthday-shell .desktop {padding:54px 12px 58px;min-height:0;display:flex;flex-direction:column;gap:16px;}
  .birthday-shell .password-panel {order:0;width:100%;padding:0;top:auto;left:auto;transform:none;rotate:none;}
  .birthday-shell .password-panel::before {margin:0;}
  .birthday-shell .notes-window {order:1;height:310px;rotate:none;}
  .birthday-shell .cd-window {order:2;min-height:230px;rotate:none;}
  .birthday-shell .photos-window {order:3;height:350px;rotate:none;}
  .birthday-shell .files-window {order:4;min-height:255px;rotate:none;}
  .birthday-shell .recording-window {order:5;min-height:170px;rotate:none;}
  .birthday-shell .terminal-window {order:6;min-height:160px;rotate:none;}
  .birthday-shell .desktop-shortcuts,.birthday-shell .desktop-doodle {display:none;}
  .birthday-shell .retro-taskbar {position:sticky;bottom:0;min-height:38px;}
  .birthday-shell .retro-tab {display:none;}
  .birthday-shell .retro-dialog-backdrop {position:fixed;inset:0;}
  .birthday-shell .photo-toolbar span {display:none;}
}



/* Deep violet Y2K desktop refinements: password page only. */
.birthday-shell {background:radial-gradient(ellipse at 48% 24%,#54278b55,transparent 62%),#090515;}
.birthday-shell .desktop {
  min-height:850px;
  background:radial-gradient(ellipse at 16% 74%,#853cc944,transparent 43%),
    radial-gradient(ellipse at 85% 19%,#a642d62e,transparent 41%),
    radial-gradient(ellipse at 53% 43%,#4020793b,transparent 58%),
    linear-gradient(140deg,#28104a,#140b2c 52%,#241043);
}
.birthday-shell .desktop::before {background-image:radial-gradient(#d6a9ff44 .8px,transparent .8px);background-size:23px 23px;}
.birthday-shell .desktop-header {background:linear-gradient(90deg,#512384,#30185b 58%,#54257f);border-bottom:2px solid #8f57bb;color:#eee0ff;}
.birthday-shell .desktop-window {border:2px solid #a97bd7;background:#170b2bf5;box-shadow:5px 7px 0 #06030b99,0 14px 34px #0009,0 0 13px #7b37bf2b;}
.birthday-shell .window-active {box-shadow:6px 8px 0 #06030b88,0 0 25px #b16cfb55;}
.birthday-shell .window-titlebar,
.birthday-shell .notes-window .window-titlebar,
.birthday-shell .recording-window .window-titlebar,
.birthday-shell .cd-window .window-titlebar,
.birthday-shell .photos-window .window-titlebar,
.birthday-shell .files-window .window-titlebar,
.birthday-shell .terminal-window .window-titlebar {
  background:linear-gradient(90deg,#65369c,#8a5cbd 65%,#a77bd0);
  color:#fff5ff;border-bottom:1px solid #d7b6f0;
}
.birthday-shell .window-titlebar-active {background:linear-gradient(90deg,#9b4bd0,#6832a7);color:#fff;}
.birthday-shell .window-controls span {border:1px solid #e5c5ffb5;background:#3d1e6a66;color:#f5e7ff;}
.birthday-shell .notes-window {left:4%;top:11%;width:29%;height:37%;rotate:-1.4deg;}
.birthday-shell .notes-paper {background:linear-gradient(110deg,#fff8e8,#f3e6d9);padding:19px 18px 16px 30px;}
.birthday-shell .note-heading {color:#8b3889;}
.birthday-shell .recording-window {right:35%;top:12%;width:25%;height:19%;rotate:.9deg;}
.birthday-shell .cd-window {right:3.5%;top:11%;width:29%;height:29%;rotate:1.2deg;}
.birthday-shell .photos-window {left:4.5%;top:55%;width:31%;height:36%;rotate:1.3deg;}
.birthday-shell .photo-main {border:5px solid #d9c1eb;box-shadow:3px 3px 0 #0008;}
.birthday-shell .photo-toolbar button {background:#d3b4ef;color:#3e235f;border:1px outset #f2e2ff;}
.birthday-shell .files-window {right:4%;top:56%;width:30%;height:33%;rotate:-1deg;}
.birthday-shell .fake-file-icon {background:linear-gradient(145deg,#b58be8,#573184);border:1px outset #ddc2ff;}
.birthday-shell .terminal-window {left:38%;top:75%;width:26%;height:17%;rotate:.7deg;}
.birthday-shell .password-panel {
  left:50%;top:41%;width:30%;min-width:0;border:3px ridge #bb90ed;
  background:#efe7f8;color:#332047;box-shadow:7px 9px 0 #000a,0 0 26px #a65dff66;
}
.birthday-shell .password-panel::before {background:linear-gradient(90deg,#7135ae,#4b247f);border-bottom:2px solid #cba8ed;color:#f9f0ff;}
.birthday-shell .password-title {color:#48226e;}
.birthday-shell .password-title .glitch {color:#502776;}
.birthday-shell .password-intro {color:#3e3051;}
.birthday-shell .password-subtext {color:#775e89;}
.birthday-shell .password-input-wrap {border:2px inset #a88cc8;}
.birthday-shell .enter-button {background:linear-gradient(#e4c7ff,#b98ce8);border:2px outset #f4e6ff;color:#452268;}
.birthday-shell .enter-button:hover {background:#ead6ff;}
.birthday-shell .password-status {color:#715887;}
.birthday-shell .desktop-doodle {left:36%;top:37%;font-size:18px;color:#d5a4f2;rotate:-5deg;}
.birthday-shell .desktop-doodle small {color:#b497d0;}
.birthday-shell .desktop-shortcuts {left:35%;top:32%;gap:9px;display:flex;flex-wrap:wrap;max-width:30%;}
.birthday-shell .desktop-shortcuts button {min-width:68px;max-width:90px;padding:5px 3px;color:#e6d2ff;text-shadow:1px 1px #170a2d;}
.birthday-shell .desktop-shortcuts button:hover,
.birthday-shell .desktop-shortcuts button:focus-visible {background:#a46bdf44;border-color:#dfbdff;}
.birthday-shell .retro-taskbar {background:linear-gradient(#674093,#32195b);border-top:2px solid #ad77d8;color:#f4e6ff;}
.birthday-shell .retro-start {background:linear-gradient(#bb8ae9,#7c43b5);color:#fff;border:2px outset #e3c5ff;}
.birthday-shell .retro-tab {background:#492673;color:#f2e5ff;border:2px outset #9c6fc5;}
.birthday-shell .retro-tab:hover {background:#6937a1;}
.birthday-shell .retro-terminal {background:#422366;color:#e8d6ff;border:1px solid #a778d6;padding:5px 8px;cursor:pointer;font:10px 'Courier New',monospace;}
.birthday-shell .retro-terminal:hover {background:#683a96;}
.birthday-shell .retro-dialog-title {background:linear-gradient(90deg,#753ab3,#4b247f);}
.birthday-shell .retro-dialog {border-color:#a57ad1;}
.birthday-shell .retro-ok {background:#d8b4f5;color:#432267;}
@media (min-width:761px) and (max-width:1150px) {
  .birthday-shell .desktop {min-height:900px;}
  .birthday-shell .notes-window {left:3%;top:10%;width:31%;height:37%;}
  .birthday-shell .recording-window {right:34%;top:11%;width:29%;height:18%;}
  .birthday-shell .cd-window {right:2%;top:11%;width:31%;height:28%;}
  .birthday-shell .password-panel {top:41%;width:35%;}
  .birthday-shell .photos-window {left:3%;top:55%;width:32%;height:35%;}
  .birthday-shell .files-window {right:2%;top:55%;width:32%;height:34%;}
  .birthday-shell .desktop-shortcuts {display:flex;left:35%;top:32%;max-width:30%;}
  .birthday-shell .desktop-doodle {display:none;}
}
@media (max-width:760px) {
  .birthday-shell .desktop {min-height:0;}
  .birthday-shell .password-panel {top:auto;left:auto;width:100%;transform:none;}
  .birthday-shell .notes-window,
  .birthday-shell .cd-window,
  .birthday-shell .recording-window,
  .birthday-shell .photos-window,
  .birthday-shell .files-window,
  .birthday-shell .terminal-window {top:auto;left:auto;right:auto;width:100%;rotate:none;}
  .birthday-shell .notes-window {height:310px;}
  .birthday-shell .photos-window {height:350px;}
  .birthday-shell .files-window {min-height:255px;}
  .birthday-shell .desktop-shortcuts {display:none;}
  .birthday-shell .retro-terminal {font-size:9px;padding:5px 7px;}
}



/* Retro login polish — only the password desktop, not loading/archive. */
.birthday-shell .desktop-shortcuts {
  left:37%;top:84%;max-width:26%;width:26%;justify-content:center;
  gap:12px;z-index:12;
}
.birthday-shell .desktop-shortcuts button {
  min-width:73px;max-width:94px;
  padding:7px 4px 5px;border:1px solid transparent;
  font:11px/1.25 'Courier New',monospace;
  text-shadow:0 1px 2px #000,1px 1px #1b0835;
}
.birthday-shell .desktop-shortcuts button span {
  font-size:26px;filter:drop-shadow(1px 2px 2px #070310);
}
.birthday-shell .desktop-shortcuts button:hover,
.birthday-shell .desktop-shortcuts button:focus-visible {
  border:1px dotted #eed7ff;
  background:#ad73ec38;
}
.birthday-shell .password-panel {
  top:41%;width:30%;overflow:visible;
  border:3px ridge #c9a5ef;
  background:#eee6f8;
  box-shadow:7px 8px 0 #0a0416c9,0 0 28px #ac67e177, inset 0 0 0 2px #fff8;
}
.birthday-shell .password-panel::before {
  content:'🔒  PASSWORD_REQUIRED.EXE    _  □  ×';
  padding:10px 12px 9px;
  background:linear-gradient(90deg,#59218e,#8d4bbf 75%,#ae7bd3);
  border-bottom:2px solid #d9b7f1;
  color:#fff6ff;
  font:700 11px 'Courier New',monospace;
  letter-spacing:.15px;
}
.birthday-shell .password-panel::after {
  content:'✦';
  position:absolute;right:-15px;top:31px;
  color:#f4b4ee;font-size:26px;
  text-shadow:0 0 10px #d671e9;
  rotate:14deg;pointer-events:none;
}
.birthday-shell .password-topline {
  margin:0;padding:14px 18px 2px;
  color:#8461a2;font-size:10px;
}
.birthday-shell .password-title {
  margin:7px 0 10px;padding:0 18px;
  color:#492272;
  font:bold clamp(19px,1.9vw,28px) 'Trebuchet MS',sans-serif;
  letter-spacing:.35px;
}
.birthday-shell .password-intro {
  padding:0 18px;
  font:clamp(12px,1.02vw,15px)/1.48 'Trebuchet MS',sans-serif;
}
.birthday-shell .password-subtext {
  padding:0 18px;
  font:clamp(12px,.92vw,14px)/1.5 'Trebuchet MS',sans-serif;
}
.birthday-shell .password-form {padding:6px 18px 0;gap:8px;}
.birthday-shell .password-input-wrap {
  height:44px;background:#fffaff;border:2px inset #ab82c9;
  box-shadow:inset 1px 1px 3px #49226a44;
}
.birthday-shell .password-input-wrap input {font-size:13px;}
.birthday-shell .enter-button {
  height:44px;min-width:115px;
  background:linear-gradient(#e8cbfa,#bc91e5);
  border:2px outset #fff0ff;color:#402062;
  font:bold 11px 'Trebuchet MS',sans-serif;
  box-shadow:1px 2px 0 #6c4592;
}
.birthday-shell .enter-button:active {border-style:inset;box-shadow:none;}
.birthday-shell .password-status {padding:12px 18px 15px;font-size:10px;}
.birthday-shell .photo-toolbar {font-size:10px;gap:5px;}
.birthday-shell .photo-toolbar button {
  font:10px 'Courier New',monospace;
  padding:5px 6px;min-height:24px;
}
.birthday-shell .fake-file-name {font:10px/1.35 'Courier New',monospace;max-width:110px;}
.birthday-shell .fake-file {font-size:10px;}
.birthday-shell .window-titlebar {font-size:10px;letter-spacing:.55px;height:27px;}
.birthday-shell .window-controls span {width:13px;height:13px;font-size:9px;}
.birthday-shell .desktop-sticker {opacity:.55;}
@media (min-width:761px) and (max-width:1150px) {
  .birthday-shell .desktop-shortcuts {
    display:flex;left:35%;top:84%;width:30%;max-width:30%;gap:3px;
  }
  .birthday-shell .desktop-shortcuts button {min-width:62px;font-size:9px;}
  .birthday-shell .password-panel {top:41%;width:35%;}
  .birthday-shell .password-title {font-size:21px;}
  .birthday-shell .password-intro {font-size:12px;}
  .birthday-shell .password-subtext {font-size:12px;}
  .birthday-shell .photo-toolbar button {font-size:9px;padding:4px;}
}
@media (max-width:760px) {
  .birthday-shell .desktop-shortcuts {display:none;}
  .birthday-shell .password-panel {top:auto;left:auto;width:100%;overflow:visible;}
  .birthday-shell .password-panel::after {right:6px;top:30px;}
  .birthday-shell .password-title {font-size:21px;}
  .birthday-shell .password-intro,.birthday-shell .password-subtext {font-size:13px;}
  .birthday-shell .enter-button {min-width:105px;}
  .birthday-shell .photo-toolbar button {font-size:9px;padding:4px;}
}

/* ============================================================
   CLAR_OS FINAL PASSWORD DESKTOP — OCTOBER 2026
   These styles intentionally affect only the login CRT.
   ============================================================ */
.birthday-shell .desktop {
  background:
    radial-gradient(ellipse at 54% 16%,rgba(137,79,204,.21),transparent 36%),
    radial-gradient(ellipse at 12% 82%,rgba(103,35,175,.32),transparent 43%),
    radial-gradient(ellipse at 90% 73%,rgba(68,33,134,.3),transparent 39%),
    repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.045) 3px 4px),
    linear-gradient(130deg,#1b0b33 0%,#10071f 55%,#230f40 100%);
}
.birthday-shell .desktop.wallpaper-stars {
  background:radial-gradient(#d3afff80 1px,transparent 1.4px) 0 0/31px 31px,
  radial-gradient(#9a71d680 .6px,transparent 1.2px) 12px 9px/19px 19px,
  linear-gradient(125deg,#140b28,#080414 70%,#2c174e);
}
.birthday-shell .desktop.wallpaper-plain {background:linear-gradient(130deg,#21143c,#100920 65%,#271646);}
.birthday-shell .desktop.accent-rose .window-titlebar,
.birthday-shell .desktop.accent-rose .notes-window .window-titlebar,
.birthday-shell .desktop.accent-rose .cd-window .window-titlebar,
.birthday-shell .desktop.accent-rose .photos-window .window-titlebar,
.birthday-shell .desktop.accent-rose .files-window .window-titlebar,
.birthday-shell .desktop.accent-rose .recording-window .window-titlebar,
.birthday-shell .desktop.accent-rose .terminal-window .window-titlebar {background:linear-gradient(90deg,#7a295d,#bc6098)!important;}
.birthday-shell .desktop.accent-blue .window-titlebar,
.birthday-shell .desktop.accent-blue .notes-window .window-titlebar,
.birthday-shell .desktop.accent-blue .cd-window .window-titlebar,
.birthday-shell .desktop.accent-blue .photos-window .window-titlebar,
.birthday-shell .desktop.accent-blue .files-window .window-titlebar,
.birthday-shell .desktop.accent-blue .recording-window .window-titlebar,
.birthday-shell .desktop.accent-blue .terminal-window .window-titlebar {background:linear-gradient(90deg,#273c86,#527dc3)!important;}
.birthday-shell .desktop-window {rotate:0deg!important;border:2px solid #b88cdd;box-shadow:5px 6px 0 #070313b3,0 14px 28px #0009;}
.birthday-shell .window-titlebar {
  touch-action:none;cursor:grab;user-select:none;
  background:linear-gradient(90deg,#4e267f,#7941a7 60%,#a16ad0)!important;
  color:#f9f2ff;letter-spacing:.4px;
}
.birthday-shell .window-titlebar:active {cursor:grabbing;}
.birthday-shell .window-titlebar-active {background:linear-gradient(90deg,#7133ad,#a35bc8)!important;}
.birthday-shell .window-controls {display:flex;gap:3px;}
.birthday-shell .window-controls button {
  width:17px;height:16px;min-width:17px;padding:0;line-height:12px;
  color:#291341;background:#d6b7ee;border:2px outset #f7e8ff;
  font:700 11px 'Courier New',monospace;cursor:pointer;
}
.birthday-shell .window-controls button:active {border-style:inset;}
.birthday-shell .desktop-header {background:linear-gradient(90deg,#391a66,#291447 55%,#47246e);}
.birthday-shell .notes-window {left:3%;top:10%;width:30%;height:38%;}
.birthday-shell .cd-window {right:3%;top:10%;width:29%;height:29%;}
.birthday-shell .photos-window {left:3%;top:56%;width:31%;height:35%;}
.birthday-shell .files-window {right:3%;top:54%;width:31%;height:35%;}
.birthday-shell .recording-window {right:35%;top:11%;width:29%;height:22%;}
.birthday-shell .terminal-window {left:36%;top:73%;width:29%;height:19%;}
.birthday-shell .password-panel {left:50%;top:41%;width:31%;z-index:80;}
.birthday-shell .desktop-shortcuts {
  position:absolute;left:35%;top:10%;width:30%;max-width:30%;
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:9px 4px;justify-items:center;align-content:start;z-index:13;
}
.birthday-shell .desktop-shortcuts button {
  min-width:0;width:100%;max-width:95px;min-height:52px;
  padding:5px 2px;color:#f1e4ff;font:10px/1.2 'Courier New',monospace;
  overflow-wrap:anywhere;
}
.birthday-shell .desktop-shortcuts button span {font-size:22px;line-height:25px;}
.birthday-shell .desktop-shortcuts button.selected {background:#ad73ec55;border:1px dotted #f4d8ff;}
.birthday-shell .notes-paper {overflow-y:auto;}
.birthday-shell .handwriting {padding-bottom:12px;}
.birthday-shell .note-postscript {font-size:11px;line-height:1.45;color:#72557e;margin-top:17px;}
.birthday-shell .note-whisper {font-size:11px;font-style:italic;color:#6e368d;border-top:1px dashed #bc9fb6;padding-top:10px;}
.birthday-shell .terminal-window .terminal-body {overflow:auto;max-height:calc(100% - 29px);padding:9px;font-size:9px;}
.birthday-shell .terminal-output {white-space:pre-wrap;overflow-wrap:anywhere;max-height:95px;overflow-y:auto;font:9px/1.5 'Courier New',monospace;}
.birthday-shell .terminal-output div {margin-bottom:2px;}
.birthday-shell .terminal-last {color:#8ef1ca;}
.birthday-shell .terminal-command-form {display:flex;gap:4px;align-items:center;color:#b5f9d6;margin:5px 0;}
.birthday-shell .terminal-command-form input {
  background:#0d0b17;border:1px solid #528f79;color:#b4ffd5;
  width:100%;min-width:0;padding:4px;font:10px 'Courier New',monospace;
}
.birthday-shell .terminal-button {margin-top:4px;}
.birthday-shell .retro-dialog-backdrop {z-index:125;}
.birthday-shell .file-dialog {width:min(475px,96%);}
.birthday-shell .file-dialog .retro-dialog-body {max-height:min(60vh,560px);overflow-y:auto;}
.birthday-shell .file-lock-icon {font-size:34px;margin:8px 0 15px;}
.birthday-shell .file-locked small,.birthday-shell .feetgang-content small {font:9px 'Courier New',monospace;color:#80648d;}
.birthday-shell .feetgang-content p {line-height:1.5;}
.birthday-shell .message-archive {text-align:left;max-height:370px;overflow-y:auto;padding:4px;}
.birthday-shell .message-archive-header {font:700 12px 'Courier New',monospace;padding:8px;border-bottom:1px solid #c6a3d9;margin-bottom:10px;}
.birthday-shell .message-archive-header small {display:block;font-size:9px;font-weight:400;margin-top:4px;}
.birthday-shell .chat-bubble {width:85%;max-width:340px;padding:9px 11px;margin:9px 0;border:1px solid #c6a7d5;background:#e3d1f2;border-radius:5px;}
.birthday-shell .chat-naidu {margin-left:auto;background:#c7a6e6;}
.birthday-shell .chat-bubble small {display:block;font:700 10px 'Courier New',monospace;color:#54316f;}
.birthday-shell .chat-bubble p {white-space:pre-line;margin:5px 0 2px;line-height:1.35;}
.birthday-shell .chat-bubble span {display:block;text-align:right;font:9px 'Courier New',monospace;color:#725883;}
.birthday-shell .chat-end {text-align:center;font:9px 'Courier New',monospace;color:#8d709b;margin:12px;}
.birthday-shell .secret-muted {font:10px 'Courier New',monospace;color:#826895;}
.birthday-shell .start-menu {
  position:absolute;bottom:37px;left:8px;z-index:125;
  width:min(330px,calc(100% - 16px));max-height:calc(100% - 60px);
  display:flex;background:#e9dcf2;color:#352148;border:3px ridge #c5a5e2;
  box-shadow:6px 8px 0 #0009;font:12px 'Trebuchet MS',sans-serif;
}
.birthday-shell .start-menu-side {
  writing-mode:vertical-rl;transform:rotate(180deg);text-align:right;
  padding:12px 9px;background:linear-gradient(#341359,#7446a3);
  color:#fff;font:bold 19px 'Courier New',monospace;letter-spacing:2px;
}
.birthday-shell .start-menu-side span {font-size:11px;opacity:.7;}
.birthday-shell .start-menu-items {flex:1;min-width:0;overflow-y:auto;padding:6px;}
.birthday-shell .start-menu-heading {padding:8px;font:700 10px 'Courier New',monospace;color:#7a5894;border-bottom:1px solid #b79ec8;}
.birthday-shell .start-menu-items button {
  display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  background:transparent;border:0;padding:8px 10px;color:#39224d;font-size:12px;
}
.birthday-shell .start-menu-items button:hover,.birthday-shell .start-menu-items button:focus-visible {background:#8654b5;color:white;outline:0;}
.birthday-shell .start-menu-items button span {font-size:17px;width:23px;text-align:center;}
.birthday-shell .start-menu-items button small {margin-left:auto;}
.birthday-shell .start-menu-footer {border-top:1px solid #b69acb;margin-top:5px;padding:8px 4px;font:9px 'Courier New',monospace;color:#765e8a;}
.birthday-shell .control-panel {width:min(530px,96%);text-align:left;}
.birthday-shell .control-tabs {display:flex;gap:2px;flex-wrap:wrap;padding:10px 12px 0;border-bottom:1px solid #d1b8df;}
.birthday-shell .control-tabs button,.birthday-shell .control-options button,.birthday-shell .control-toggle {
  padding:8px 10px;background:#e3d2f0;border:2px outset #fff;color:#51336a;
  font:11px 'Courier New',monospace;
}
.birthday-shell .control-tabs button.chosen,.birthday-shell .control-options button.chosen {background:#9a67c6;color:white;border-style:inset;}
.birthday-shell .control-content {padding:17px 20px;min-height:205px;font-size:13px;}
.birthday-shell .control-content p {margin:13px 0 7px;}
.birthday-shell .control-content small {display:block;margin-top:15px;color:#80638f;}
.birthday-shell .control-options {display:flex;flex-wrap:wrap;gap:7px;}
.birthday-shell .control-bottom {padding:8px 15px 14px;text-align:right;}
.birthday-shell .finder-dialog {width:min(430px,96%);}
.birthday-shell .finder-content {padding:15px;display:flex;flex-direction:column;gap:7px;max-height:60vh;overflow-y:auto;}
.birthday-shell .finder-content label {font:700 12px 'Courier New',monospace;}
.birthday-shell .finder-content input {padding:9px;border:2px inset #bda5cc;font-size:12px;}
.birthday-shell .finder-content button {text-align:left;padding:8px;background:#e5d5f1;border:1px solid #b89ad0;color:#4c3164;}
.birthday-shell .finder-content button:hover {background:#c6a6e0;}
.birthday-shell .clar-screensaver {
  position:absolute;inset:0;z-index:160;display:flex;flex-direction:column;
  align-items:center;justify-content:center;cursor:pointer;
  background:radial-gradient(ellipse at 50% 40%,#3d1972,#090412 75%);
  color:#d8bbff;overflow:hidden;
}
.birthday-shell .screensaver-stars {font:60px Georgia,serif;animation:clarSaverFloat 6s ease-in-out infinite alternate;color:#dfb6ff;}
.birthday-shell .screensaver-logo {font:700 clamp(45px,9vw,120px) 'Courier New',monospace;letter-spacing:.12em;text-shadow:0 0 25px #b077ff;}
.birthday-shell .clar-screensaver p {font:11px 'Courier New',monospace;opacity:.7;}
@keyframes clarSaverFloat {from{transform:translate(-45px,-25px) rotate(-8deg)}to{transform:translate(45px,35px) rotate(8deg)}}
@media (min-width:761px) and (max-width:1150px) {
  .birthday-shell .desktop-shortcuts {left:35%;top:10%;width:30%;max-width:30%;display:grid;}
  .birthday-shell .desktop-shortcuts button {font-size:9px;min-height:47px;}
  .birthday-shell .password-panel {width:36%;}
}
@media (max-width:760px) {
  .birthday-shell .desktop {min-height:0;padding:54px 12px 58px;display:flex;flex-direction:column;gap:14px;}
  .birthday-shell .desktop-window {position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;max-width:100%;height:auto!important;rotate:0deg!important;}
  .birthday-shell .password-panel {position:relative;top:auto;left:auto;width:100%;order:0;transform:none;}
  .birthday-shell .notes-window {order:1;min-height:320px;max-height:380px;}
  .birthday-shell .cd-window {order:2;min-height:215px;}
  .birthday-shell .photos-window {order:3;min-height:325px;}
  .birthday-shell .files-window {order:4;min-height:250px;}
  .birthday-shell .recording-window {order:5;min-height:170px;}
  .birthday-shell .terminal-window {order:6;min-height:230px;}
  .birthday-shell .desktop-shortcuts {position:relative;left:auto;top:auto;right:auto;order:7;width:100%;max-width:100%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;}
  .birthday-shell .desktop-shortcuts button {font-size:9px;min-height:58px;}
  .birthday-shell .retro-taskbar {order:8;position:sticky;bottom:0;z-index:70;}
  .birthday-shell .window-titlebar {touch-action:auto;cursor:default;}
  .birthday-shell .start-menu {position:fixed;bottom:35px;left:10px;max-height:65vh;z-index:155;}
  .birthday-shell .retro-dialog-backdrop {position:fixed;inset:0;z-index:155;}
  .birthday-shell .clar-screensaver {position:fixed;}
}

/* Tech-forward CLAR_OS refinement: the original archive/loading screens remain intact. */
.birthday-shell .desktop {font-family:"Lucida Console","Courier New",monospace;}
.birthday-shell .desktop-header,.birthday-shell .window-titlebar,
.birthday-shell .fake-file-name,.birthday-shell .desktop-shortcuts button,
.birthday-shell .retro-taskbar,.birthday-shell .start-menu,
.birthday-shell .control-panel,.birthday-shell .finder-dialog,
.birthday-shell .retro-dialog-title,.birthday-shell .password-panel,
.birthday-shell .cd-information {
  font-family:"Lucida Console","Courier New",monospace!important;
}
.birthday-shell .window-titlebar {letter-spacing:.07em;font-size:11px;}
.birthday-shell .password-title,.birthday-shell .password-title .glitch {
  font:700 clamp(18px,1.9vw,28px)/1.15 "Lucida Console","Courier New",monospace!important;
  letter-spacing:.045em;color:#4c2b6b;text-shadow:1px 0 #b776d455;
}
.birthday-shell .password-intro {
  font:clamp(11px,.94vw,14px)/1.55 "Lucida Console","Courier New",monospace!important;
}
.birthday-shell .password-subtext {
  font:clamp(10px,.83vw,12px)/1.5 "Lucida Console","Courier New",monospace!important;
}
.birthday-shell .enter-button,.birthday-shell .password-input-wrap input {
  font:700 11px "Lucida Console","Courier New",monospace!important;
}
.birthday-shell .password-panel::before {letter-spacing:.065em;}
.birthday-shell .terminal-window {
  border-color:#c38aff;background:#0d091b;
  box-shadow:7px 9px 0 #08030ecc,0 0 36px #a35aff55;
}
.birthday-shell .terminal-window .terminal-body {
  padding:17px 19px;font:12px/1.6 "Lucida Console","Courier New",monospace;
  max-height:calc(100% - 30px);overflow:auto;
}
.birthday-shell .terminal-output {
  max-height:175px;font:11px/1.55 "Lucida Console","Courier New",monospace;
}
.birthday-shell .terminal-command-form input {
  font:12px "Lucida Console","Courier New",monospace;min-height:32px;
}
.birthday-shell .terminal-window .window-titlebar {
  background:linear-gradient(90deg,#522485,#8a50b7)!important;color:#fff;
}
.birthday-shell .terminal-button {padding:7px 12px;font-size:11px;}
.birthday-shell .control-content strong {letter-spacing:.04em;}
@media (max-width:760px) {
  .birthday-shell .terminal-window {min-height:320px!important;}
  .birthday-shell .terminal-window .terminal-body {min-height:270px;max-height:none;}
  .birthday-shell .terminal-output {max-height:150px;}
  .birthday-shell .password-title,.birthday-shell .password-title .glitch {font-size:20px!important;}
}

`;
