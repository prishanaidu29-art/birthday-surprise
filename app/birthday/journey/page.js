'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe2, MapPin, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

// City-centre coordinates. Limin's UK city is not yet known.
const PEOPLE = [
  { id: 'clar', name: 'CLAR', city: 'Mont Kiara, Kuala Lumpur', lat: 3.170, lon: 101.652, color: 0xff80dc },
  { id: 'nut', name: 'NUT', city: 'Shah Alam, Selangor', lat: 3.0738, lon: 101.5183, color: 0x73e8ff },
  { id: 'naidu', name: 'NAIDU', city: 'Kuantan, Pahang', lat: 3.8077, lon: 103.3260, color: 0xc4a2ff },
  { id: 'limin', name: 'LIMIN', city: 'United Kingdom (city TBD)', lat: null, lon: null, color: 0xfbb4ea },
]
const RAD = Math.PI / 180
function distanceKm(a, b) {
  if (a.lat == null || b.lat == null) return null
  const dLat = (b.lat - a.lat) * RAD
  const dLon = (b.lon - a.lon) * RAD
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)))
}

export default function JourneyPage() {
  const router = useRouter()
  const mount = useRef(null)
  const selectRef = useRef(null)
  const [stage, setStage] = useState('checking')
  const [progress, setProgress] = useState(0)
  const [selected, setSelected] = useState(null)
  const [globeError, setGlobeError] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('birthday_authenticated') !== 'true') {
      router.replace('/')
      return
    }
    setStage('loading')
    const started = Date.now()
    const interval = window.setInterval(() => {
      const pct = Math.min(100, Math.round((Date.now() - started) / 23))
      setProgress(pct)
      if (pct >= 100) {
        window.clearInterval(interval)
        setStage('ready')
      }
    }, 35)
    return () => window.clearInterval(interval)
  }, [router])

  useEffect(() => { selectRef.current = setSelected }, [])

  useEffect(() => {
    if (stage !== 'ready' || !mount.current) return
    let disposed = false
    let renderer, earth, camera, scene, frame, resizeObserver
    let cleanupPointer = () => {}
    const host = mount.current

    async function setup() {
      try {
        const THREE = await import('three')
        if (disposed || !host) return
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(43, 1, 0.1, 200)
        camera.position.set(0, 0, 13.8)
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:grab'
        host.appendChild(renderer.domElement)

        const root = new THREE.Group()
        scene.add(root)
        earth = new THREE.Mesh(new THREE.SphereGeometry(4.4, 64, 48), new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 12 }))
        root.add(earth)
        const loader = new THREE.TextureLoader()
        loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
          texture => { if (!disposed) { earth.material.map = texture; earth.material.needsUpdate = true } else texture.dispose() },
          undefined, () => { if (!disposed) { earth.material.color.set(0x334c8c); earth.material.needsUpdate = true } })
        scene.add(new THREE.AmbientLight(0x9f9cdd, 1.45))
        const sunlight = new THREE.DirectionalLight(0xffffff, 2.3)
        sunlight.position.set(8, 5, 10)
        scene.add(sunlight)
        const halo = new THREE.Mesh(new THREE.SphereGeometry(4.52, 48, 32), new THREE.MeshBasicMaterial({ color: 0x8b63e9, transparent: true, opacity: 0.085, side: THREE.BackSide }))
        root.add(halo)

        const position = (lat, lon, radius = 4.48) => {
          const phi = (90 - lat) * RAD, theta = (lon + 180) * RAD
          return new THREE.Vector3(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), -radius * Math.sin(phi) * Math.sin(theta))
        }
        const pickables = []
        PEOPLE.filter(p => p.lat !== null).forEach(p => {
          const marker = new THREE.Mesh(new THREE.SphereGeometry(p.id === 'clar' ? 0.105 : 0.085, 16, 12), new THREE.MeshBasicMaterial({ color: p.color }))
          marker.position.copy(position(p.lat, p.lon))
          marker.userData.id = p.id
          earth.add(marker)
          pickables.push(marker)
          const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.28, depthWrite: false }))
          marker.add(glow)
        })
        const home = PEOPLE[0]
        PEOPLE.slice(1).filter(p => p.lat !== null).forEach(p => {
          const a = position(home.lat, home.lon, 4.5).normalize()
          const b = position(p.lat, p.lon, 4.5).normalize()
          const angle = a.angleTo(b)
          const pts = []
          for (let i = 0; i <= 64; i++) {
            const t = i / 64
            const dir = new THREE.Vector3().copy(a).lerp(b, t).normalize()
            pts.push(dir.multiplyScalar(4.52 + Math.sin(t * Math.PI) * Math.max(0.12, angle * 0.8)))
          }
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.85 }))
          earth.add(line)
        })
        const stars = new Float32Array(1400 * 3)
        for (let i = 0; i < stars.length; i += 3) {
          stars[i] = (Math.random() - .5) * 85
          stars[i + 1] = (Math.random() - .5) * 60
          stars[i + 2] = -10 - Math.random() * 30
        }
        const starGeo = new THREE.BufferGeometry()
        starGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3))
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc7b6ff, size: 0.055 })))

        earth.rotation.y = -1.7
        const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2()
        let dragging = false, moved = false, lastX = 0, lastY = 0
        const down = e => { dragging = true; moved = false; lastX = e.clientX; lastY = e.clientY; renderer.domElement.setPointerCapture(e.pointerId) }
        const move = e => {
          if (!dragging) return
          const dx = e.clientX - lastX, dy = e.clientY - lastY
          if (Math.abs(dx) + Math.abs(dy) > 2) moved = true
          earth.rotation.y += dx * 0.006
          earth.rotation.x = Math.max(-0.9, Math.min(0.9, earth.rotation.x + dy * 0.006))
          lastX = e.clientX; lastY = e.clientY
        }
        const up = e => {
          if (!dragging) return
          dragging = false
          if (moved) return
          const bounds = renderer.domElement.getBoundingClientRect()
          pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1
          pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1
          raycaster.setFromCamera(pointer, camera)
          const hits = raycaster.intersectObjects(pickables, false)
          if (hits.length) selectRef.current(PEOPLE.find(p => p.id === hits[0].object.userData.id))
        }
        renderer.domElement.addEventListener('pointerdown', down)
        renderer.domElement.addEventListener('pointermove', move)
        renderer.domElement.addEventListener('pointerup', up)
        cleanupPointer = () => {
          renderer?.domElement.removeEventListener('pointerdown', down)
          renderer?.domElement.removeEventListener('pointermove', move)
          renderer?.domElement.removeEventListener('pointerup', up)
        }
        const resize = () => {
          if (!host || !renderer) return
          const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h, false)
        }
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
        resize()
        const animate = () => {
          if (disposed) return
          frame = requestAnimationFrame(animate)
          if (!dragging) earth.rotation.y += 0.0008
          renderer.render(scene, camera)
        }
        animate()
      } catch (e) {
        console.error('Globe could not load', e)
        if (!disposed) setGlobeError(true)
      }
    }
    setup()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      cleanupPointer()
      if (scene) scene.traverse(obj => {
        obj.geometry?.dispose?.()
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material?.dispose?.()
      })
      renderer?.dispose()
      renderer?.domElement?.remove()
    }
  }, [stage])

  const panel = { background: 'rgba(17,9,34,.89)', border: '1px solid #a66add', boxShadow: '0 0 25px #8a35cf45', color: '#f5e8ff' }
  if (stage === 'checking') return <main style={{ minHeight:'100vh', background:'#090414' }} />
  if (stage === 'loading') return (
    <main style={{ minHeight:'100vh', display:'grid', placeItems:'center', padding:24, background:'radial-gradient(ellipse at center,#34144e,#10071f 65%,#06040d)', color:'#f4d7ff', fontFamily:'monospace' }}>
      <div style={{ width:'min(690px,100%)', ...panel, padding:'clamp(24px,5vw,50px)' }}>
        <div style={{ color:'#7de6ef', letterSpacing:3, fontSize:12 }}>CLAR_OS // NETWORK BOOT SEQUENCE</div>
        <h1 style={{ fontSize:'clamp(28px,6vw,60px)', letterSpacing:2, margin:'25px 0 8px', textShadow:'3px 3px #b836a6' }}>CONNECTIONS.exe</h1>
        <p style={{ color:'#c69fdc' }}>LOCATING SIGNALS ACROSS THE WORLD...</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, margin:'34px 0' }}>
          {['CLAR','NUT','NAIDU','LIMIN'].map((p,i) => <div key={p} style={{ border:'1px solid #8653b2', padding:'15px 3px', textAlign:'center', background:progress > i*23 ? '#4e2068' : '#170d27', fontSize:12 }}>◉<div style={{ marginTop:7 }}>{p}</div></div>)}
        </div>
        <div style={{ height:14, border:'1px solid #b985ea', padding:2 }}>
          <div style={{ height:'100%', width:progress+'%', background:'linear-gradient(90deg,#794bfa,#f58bd8,#75dfff)', transition:'width .05s linear' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:12 }}><span>ESTABLISHING CONNECTIONS...</span><span>{progress}%</span></div>
        <p style={{ marginTop:28, color:'#9e84bd', fontSize:12 }}>LOADING MAP DATA // NO SIGNAL LOST</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight:'100vh', padding:'clamp(16px,3vw,38px)', background:'radial-gradient(ellipse at 50% 20%,#301347,#10091f 65%,#070410)', color:'#f3eaff', fontFamily:'monospace' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <Link href="/birthday" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#e8c2ff', textDecoration:'none', marginBottom:24 }}><ArrowLeft size={18}/> BACK TO ARCHIVE</Link>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6, color:'#86dfea', letterSpacing:3, fontSize:12 }}><Globe2 size={17}/> CLAR_OS / NETWORK SYSTEM</div>
        <h1 style={{ fontSize:'clamp(34px,6vw,68px)', lineHeight:1.1, margin:'12px 0', textShadow:'3px 3px #ac359c' }}>CONNECTIONS.exe</h1>
        <p style={{ color:'#bda2d4', marginBottom:22 }}>Four locations. One home signal. Click a pin to see the distance from Clar.</p>
        <div style={{ ...panel, position:'relative', overflow:'hidden', borderRadius:4 }}>
          <div style={{ padding:'12px 18px', background:'linear-gradient(90deg,#74359e,#42235f)', display:'flex', justifyContent:'space-between', fontSize:12, letterSpacing:1 }}><span>◉ EARTH_VIEWER.exe</span><span>● SIGNAL ACTIVE</span></div>
          <div style={{ position:'relative', height:'min(66vw,580px)', minHeight:340, background:'radial-gradient(ellipse at center,#1e1744,#090615 70%)' }}>
            <div ref={mount} style={{ width:'100%', height:'100%' }} />
            {globeError && <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center', padding:24 }}>3D globe unavailable. Select a connection below to see its distance.</div>}
            <div style={{ position:'absolute', top:16, left:16, color:'#b9a3e1', fontSize:11, pointerEvents:'none' }}>DRAG TO ROTATE / TAP PIN TO INSPECT</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:12, marginTop:18 }}>
          {PEOPLE.map(p => <button key={p.id} onClick={() => setSelected(p)} style={{ ...panel, textAlign:'left', padding:17, cursor:'pointer', fontFamily:'inherit' }}><div style={{ color:p.id==='clar'?'#ff94da':'#89e3ff', fontSize:11, marginBottom:8 }}>● {p.id==='clar'?'ORIGIN':'CONNECTED'}</div><strong>{p.name}</strong><div style={{ color:'#bca8d2', fontSize:12, marginTop:5 }}>{p.city}</div></button>)}
        </div>
        {selected && <div role="dialog" aria-modal="true" aria-label="Connection details" style={{ position:'fixed', inset:0, zIndex:40, background:'#05020bd9', display:'grid', placeItems:'center', padding:20 }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ ...panel, width:'min(440px,100%)', padding:26, position:'relative' }}>
            <button aria-label="Close" onClick={() => setSelected(null)} style={{ position:'absolute', right:15, top:12, color:'white', background:'transparent', border:0, cursor:'pointer' }}><X size={20}/></button>
            <div style={{ color:'#86e5ef', fontSize:12, letterSpacing:2 }}>CONNECTION ESTABLISHED</div>
            <h2 style={{ fontSize:36, margin:'24px 0 6px' }}>{selected.name}</h2>
            <p style={{ color:'#bba6d2', display:'flex', alignItems:'center', gap:6 }}><MapPin size={16}/>{selected.city}</p>
            <hr style={{ border:'0', borderTop:'1px solid #674781', margin:'22px 0' }}/>
            <div style={{ color:'#d4b5e8', fontSize:12 }}>DISTANCE FROM CLAR</div>
            <div style={{ fontSize:38, fontWeight:'bold', color:'#f6b3f0', marginTop:8 }}>{selected.id==='clar'?'0 km':distanceKm(PEOPLE[0],selected)===null?'TBD':distanceKm(PEOPLE[0],selected).toLocaleString()+' km'}</div>
            <p style={{ fontSize:12, color:'#b49bc8' }}>{selected.lat===null?'UK city needed for an accurate distance.':'Approximate straight-line distance between city centres.'}</p>
          </div>
        </div>}
      </div>
    </main>
  )
}
