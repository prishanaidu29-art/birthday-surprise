'use client'
import {useState} from 'react'
import {saveRecovery} from './RecoveryConsole'
const FRAMES=[
 {id:0,name:'SUNRISE',symbol:'☀',caption:'The screen wakes',bg:'linear-gradient(140deg,#ffbb88,#ed76b6,#5b398d)'},
 {id:1,name:'FIRST PLAY',symbol:'▶',caption:'The tape begins',bg:'linear-gradient(140deg,#72e8de,#5889c9,#4e2c80)'},
 {id:2,name:'REVERSE',symbol:'↶',caption:'The memory rewinds',bg:'linear-gradient(140deg,#ffd078,#ee8e9f,#9d5ec5)'},
 {id:3,name:'KEEPSAKE',symbol:'♥',caption:'The memory is saved',bg:'linear-gradient(140deg,#b9a0ff,#dd7ecf,#493c8b)'}
]
export default function VHSRepair({onComplete}){
 const [order,setOrder]=useState([2,0,3,1])
 const [selected,setSelected]=useState(null)
 const [attempts,setAttempts]=useState(0)
 const [won,setWon]=useState(false)
 const [hint,setHint]=useState(0)
 const swap=i=>{
  if(won)return
  if(selected===null){setSelected(i);return}
  if(selected===i){setSelected(null);return}
  const next=[...order];[next[selected],next[i]]=[next[i],next[selected]];setOrder(next);setSelected(null)
  if(next.every((n,j)=>n===j)){setWon(true);saveRecovery(2);onComplete?.()}
  else setAttempts(n=>n+1)
 }
 return <section className="vhs-repair" aria-label="Playable VHS frame restoration puzzle">
 <div className="vhs-repair-top"><span>◉ VHS_REPAIR.exe</span><span>{won?'● RESTORED':'● SIGNAL LOST'}</span></div>
 <h2 className="vhs-repair-heading">{won?'MEMORY RESTORED':'THE TAPE IS OUT OF ORDER'}</h2>
 <p>{won?'The corrupted footage is playing again. Four more letters have been recovered in LOVE_MAIL.':'Four damaged scenes are out of order. Tap two frames to swap them. The tape has a beginning, a turning point, and an ending — can you reconstruct it?'}</p>
 <div className="vhs-repair-grid">{order.map((id,i)=>{const f=FRAMES[id];return <button type="button" key={id} onClick={()=>swap(i)} disabled={won} className={'vhs-repair-frame '+(selected===i?'selected ':'')+(won?'restored':'')} aria-label={'Frame '+f.name+', position '+(i+1)}><span className="vhs-repair-screen" style={{background:f.bg}}><span className="vhs-repair-noise"/><strong>{f.symbol}</strong><small>CH-{String(i+1).padStart(2,'0')}</small></span><b>{f.name}</b><span>{f.caption}</span></button>})}</div>
 <div className="vhs-repair-bottom"><span>{won?'✓ 11 / 11 FRIEND LETTERS UNLOCKED':selected!==null?'SELECT ANOTHER FRAME TO SWAP':'TAP ANY FRAME TO PICK IT UP'}</span>{!won&&<button onClick={()=>setHint(v=>(v+1)%3)}>{hint===0?'? HINT 1':hint===1?'? HINT 2':'HIDE HINTS'}</button>}</div>
 {hint>0&&!won&&<p className="vhs-repair-hint">{hint===1?'Think of what happens to a tape before you can revisit its contents. The keepsake is the last thing left behind.':'First the screen wakes, then the tape plays. Rewind comes after playback, and the keepsake is saved at the end.'}</p>}
 {won&&<a className="vhs-repair-return" href="/birthday/messages">✉ RETURN TO LOVE_MAIL →</a>}
 <style jsx>{`
 .vhs-repair{color:#fbe7ff;background:repeating-linear-gradient(0deg,#1d102c,#1d102c 5px,#281536 6px);border:3px solid #d68ee7;box-shadow:7px 7px #080511,0 0 35px #ad5ccc55;padding:20px;max-width:760px;font-family:monospace}
 .vhs-repair-top,.vhs-repair-bottom{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:11px;color:#8fe6e2;letter-spacing:1px}
 .vhs-repair-heading{color:#ffaad8;text-shadow:3px 0 #5ee4e4,-2px 0 #985bd6;font-size:clamp(20px,4vw,31px);margin:16px 0}
 .vhs-repair p{line-height:1.6;font-size:13px;color:#e5c9ed}
 .vhs-repair-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:22px 0}
 .vhs-repair-frame{border:3px solid #7954a5;background:#302044;padding:8px;color:#f9e1fa;text-align:left;cursor:pointer;touch-action:manipulation;min-width:0;box-shadow:3px 3px #0d0716;transition:transform .15s,border-color .15s}
 .vhs-repair-frame.selected{border-color:#ffdd77;transform:translateY(-5px);box-shadow:0 0 20px #ffce7b88}
 .vhs-repair-frame.restored{border-color:#8be9df}
 .vhs-repair-screen{height:105px;position:relative;display:grid;place-items:center;overflow:hidden;border:3px solid #120c24}
 .vhs-repair-screen strong{font-size:52px;color:#fff3fa;text-shadow:3px 3px #412452;z-index:1}
 .vhs-repair-screen small{position:absolute;bottom:5px;right:6px;background:#180d2d99;padding:2px 4px;font-size:9px}
 .vhs-repair-noise{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,#190c2c38 4px);pointer-events:none}
 .vhs-repair-frame b{display:block;font-size:12px;margin:8px 0 3px;color:#ffc3e6}.vhs-repair-frame>span:last-child{font-size:11px;color:#cdb3dd}
 .vhs-repair-bottom button{background:#d98bd4;color:#25102f;border:2px solid #ffd3ef;padding:9px 14px;font-weight:bold;cursor:pointer}
 .vhs-repair-return{display:inline-block;margin-top:15px;background:#8de3df;color:#1c1431;padding:12px 18px;text-decoration:none;font-weight:bold}
 .vhs-repair-hint{border-left:3px solid #ffcd76;padding-left:12px}
 @media(max-width:500px){.vhs-repair{padding:12px}.vhs-repair-screen{height:85px}.vhs-repair-frame{padding:5px}.vhs-repair-screen strong{font-size:40px}}
 @media(prefers-reduced-motion:reduce){.vhs-repair-frame{transition:none}}
 `}</style></section>
}
