'use client'
import {scopedStorage} from './ScopedSave';
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {readRecovery,hasClue} from './RecoveryConsole'
const read=()=>{try{return {stage:readRecovery(),fragment:hasClue(0),circuit:scopedStorage.getItem('clar_circuit_restored')==='yes',email:scopedStorage.getItem('clar_email_restored')==='yes'}}catch{return {stage:0,fragment:false,circuit:false,email:false}}}
const steps=[
 {name:'DESKTOP CACHE / SIGNAL_01',where:'CLAR_OS desktop',detail:'Recover the first symbol pattern from CACHE_01 and save it to your journal.',hint:'Open the FILES window on the desktop → CACHE_01.',href:'/',cta:'RETURN TO DESKTOP'},
 {name:'LOVE_MAIL / SIGNAL_01',where:'LOVE_MAIL',detail:'Use the recovered symbols to repair the first mail signal.',hint:'Open LOVE_MAIL and press RESTORE SIGNAL. The pattern is ◆ → ✳ → ✦.',href:'/birthday/messages',cta:'OPEN LOVE_MAIL'},
 {name:'MEMORIES / VHS_02',where:'MEMORIES',detail:'Repair the corrupted VHS frames to recover the archive.',hint:'The mail signal unlocks Memories. Open VHS_02 / REPAIR CORRUPTED TAPE.',href:'/birthday/memories',cta:'OPEN MEMORIES'},
 {name:'VIDEO_ARCHIVE / CIRCUIT',where:'CLAR_OS desktop',detail:'Reconnect the three coloured ports to restore playback.',hint:'Return to the desktop and open VIDEO ARCHIVE. The repair circuit is now available.',href:'/birthday',cta:'RETURN TO DESKTOP'},
 {name:'LOVE_MAIL / LOST DRAFT',where:'LOVE_MAIL',detail:'Reconstruct the missing email fragments to finish the recovery.',hint:'Look for the incomplete LOST DRAFT inside LOVE_MAIL.',href:'/birthday/messages',cta:'OPEN LOVE_MAIL'}
]
export default function ClarJournal({onClose}){
 const [data,setData]=useState({stage:0,fragment:false,circuit:false,email:false})
 const [tab,setTab]=useState('guide')
 useEffect(()=>{const sync=()=>setData(read());sync();window.addEventListener('clar-recovery',sync);window.addEventListener('focus',sync);return()=>{window.removeEventListener('clar-recovery',sync);window.removeEventListener('focus',sync)}},[])
 const complete=[data.fragment,data.stage>=1,data.stage>=2,data.circuit,data.email]
 const current=complete.findIndex(v=>!v)
 const evidence=steps.map((x,i)=>({...x,ok:complete[i]}))
 const done=current===-1
 const active=done?null:steps[current]
 return <section className="cj-window" aria-label="Clar Journal"><header><span>▤ CLAR_JOURNAL.exe // HUNT GUIDE</span><button onClick={onClose} aria-label="Close journal">×</button></header><div className="cj-body">
 <div className="cj-heading">SCAVENGER HUNT <span>{complete.filter(Boolean).length}/{steps.length}</span></div>
 <p className="cj-intro">New here? Start with Step 1 and follow the trail. Your progress saves automatically. Optional secrets are separate from the main route.</p>
 <div className="cj-tabs"><button className={tab==='guide'?'active':''} onClick={()=>setTab('guide')}>START / NEXT STEP</button><button className={tab==='evidence'?'active':''} onClick={()=>setTab('evidence')}>PROGRESS</button><button className={tab==='map'?'active':''} onClick={()=>setTab('map')}>MAP</button></div>
 {tab==='guide'?<div className="cj-next">{done?<><div className="cj-status">✓ ALL MAIN SIGNALS RECOVERED</div><h3>HUNT COMPLETE</h3><p>You've restored the archive trail. You can revisit any recovered area or keep looking for optional secrets.</p><Link className="cj-go" href="/birthday">RETURN TO CLAR_OS</Link></>:<><div className="cj-status">NEXT OBJECTIVE · STEP {current+1} / {steps.length}</div><h3>{active.name}</h3><p className="cj-location">LOCATION: {active.where}</p><p>{active.hint}</p><Link className="cj-go" href={active.href}>{active.cta} ↗</Link></>}<div className="cj-mini-list">{steps.map((s,i)=><div key={i} className={complete[i]?'done':'future'}><span>{complete[i]?'✓':i===current?'▶':'🔒'}</span><span>{i+1}. {s.name}</span><small>{complete[i]?'RECOVERED':i===current?'CURRENT':'UP NEXT'}</small></div>)}</div></div>
 :tab==='evidence'?<div className="cj-evidence">{evidence.map((x,i)=><details key={i} className={x.ok?'unlocked':'locked'}><summary><span>{x.ok?'◈':'▧'} {x.name}</span><small>{x.ok?'RECOVERED':i===current?'NEXT':'LOCKED'}</small></summary><p>{x.ok?x.detail:x.hint}</p>{!x.ok&&i===current&&<Link className="cj-inline" href={x.href}>GO TO THIS STEP ↗</Link>}</details>)}</div>
 :<div className="cj-map">{steps.map((s,i)=><div key={i}><span className={complete[i]?'done':i===current?'current':''}>{complete[i]?'✓':i===current?'▶':'🔒'} {i+1}. {s.where}</span>{i<steps.length-1&&<div className="cj-connector">↓</div>}</div>)}</div>}
 <footer>LOCAL ARCHIVE // PROGRESS SAVES AUTOMATICALLY</footer></div><style jsx>{`
.cj-window{width:min(390px,calc(100vw - 32px));max-height:78vh;overflow:auto;border:3px solid #dc9ce3;background:#21122f;color:#f7ddf8;box-shadow:7px 7px #090513,0 0 24px #b976d966;font:12px/1.55 monospace}
header{background:linear-gradient(90deg,#6b3b91,#3a245d);padding:9px 11px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;color:#fff}header button{background:#f1a7d6;color:#291537;border:2px outset #fff;font-size:18px;line-height:1;cursor:pointer}
.cj-body{padding:16px}.cj-heading{font-size:15px;font-weight:bold;color:#9ae9e5;display:flex;justify-content:space-between}.cj-intro{color:#d7b7e2}.cj-tabs{display:flex;gap:6px;margin:15px 0;flex-wrap:wrap}.cj-tabs button{background:#39254f;border:2px solid #8864a6;color:#f9d9ef;padding:8px 10px;cursor:pointer;font:inherit;font-size:10px}.cj-tabs .active{background:#db92cf;color:#28122e}
.cj-next{border:1px solid #8c62a8;background:linear-gradient(150deg,#38204f,#241434);padding:15px}.cj-status{color:#9ae9e5;font-size:10px;letter-spacing:1px}.cj-next h3{font-size:18px;color:#ffaddc;margin:10px 0}.cj-location{font-size:10px;color:#bca1d4}.cj-go{display:block;text-align:center;background:#e59bd3;color:#251130;padding:12px;margin:14px 0;text-decoration:none;font-weight:bold;border:2px solid #ffe2f8}.cj-mini-list{display:grid;gap:6px;margin-top:17px}.cj-mini-list>div{display:grid;grid-template-columns:20px 1fr auto;gap:6px;align-items:center;padding:8px;background:#301d43;border:1px solid #65447e;font-size:10px}.cj-mini-list .done{border-color:#70cfc4;color:#b3f2e9}.cj-mini-list small{font-size:8px;color:#caa8dd}.cj-mini-list .future{opacity:.7}.cj-evidence{display:grid;gap:9px}details{border:1px solid #795591;background:#301c44}details.unlocked{border-color:#85dcd5}summary{display:flex;justify-content:space-between;gap:8px;align-items:center;cursor:pointer;padding:10px;font-weight:bold}summary small{font-size:9px;color:#a8e9df}details.locked summary small{color:#e2a3ca}details p{padding:0 10px 10px;margin:0;color:#f2d4ed}.cj-inline{display:inline-block;margin:0 10px 12px;color:#a8f3eb;font-size:10px}.cj-map{text-align:center;padding:14px}.cj-map span{display:inline-block;padding:9px 12px;border:1px dashed #9569aa;background:#352044}.cj-map span.done{border:1px solid #8ce3dc;color:#a8f3eb}.cj-map span.current{border:1px solid #f2a5d7;color:#ffb9df;box-shadow:0 0 12px #e98ac855}.cj-connector{color:#df9ddd}footer{margin-top:18px;font-size:10px;color:#a68ab6}
`}</style></section>
}
