'use client'
import {scopedStorage} from './ScopedSave';
import {useState} from 'react'
import {readRecovery} from './RecoveryConsole'
const PORTS=[{id:'pink',color:'#ff8fca',name:'AUDIO'},{id:'cyan',color:'#7ce5e3',name:'VIDEO'},{id:'gold',color:'#ffcf7d',name:'POWER'}]
export default function CircuitRepair({onWin}){
 const [connected,setConnected]=useState([])
 const [active,setActive]=useState(null)
 const [failed,setFailed]=useState(0)
 const [hint,setHint]=useState(0)
 const [won,setWon]=useState(false)
 const left=[0,1,2],right=[2,0,1]
 const choose=(side,id)=>{
  if(won)return
  if(side==='left'){setActive(id);return}
  if(active===null)return
  if(active!==id){setFailed(v=>v+1);setActive(null);return}
  const next=[...connected,id];setConnected(next);setActive(null)
  if(next.length===3){setWon(true);try{scopedStorage.setItem('clar_circuit_restored','yes');window.dispatchEvent(new Event('clar-recovery'))}catch{}onWin?.()}
 }
 return <div className="circuit-game"><div className="circuit-head"><b>◉ CIRCUIT_REPAIR.exe</b><span>{won?'● SIGNAL RESTORED':'● NO SIGNAL'}</span></div><h3>{won?'PLAYBACK RESTORED':'RECONNECT THE SIGNAL'}</h3><p>Three channels have been disconnected. Select a source port on the left, then its matching destination on the right. An incorrect connection causes interference.</p><div className="circuit-board"><div className="circuit-column">{left.map(i=><button key={i} disabled={connected.includes(i)||won} onClick={()=>choose('left',i)} className={active===i?'picked':''} style={{'--wire':PORTS[i].color}}><i/> {PORTS[i].name}</button>)}</div><div className="circuit-wires">{PORTS.map((p,i)=><div key={p.id} style={{color:connected.includes(i)?p.color:'#65466f'}}>{connected.includes(i)?'━━━━━━━━━━':'┄┄┄┄┄┄┄┄'}</div>)}</div><div className="circuit-column">{right.map(i=><button key={i} disabled={connected.includes(i)||won} onClick={()=>choose('right',i)} style={{'--wire':PORTS[i].color}}><i/> CH-{i+1}</button>)}</div></div><div className="circuit-footer"><span>{won?'✓ ALL CHANNELS CONNECTED':active===null?'SELECT A SOURCE PORT':'SELECT THE DESTINATION PORT'}</span><button onClick={()=>setHint(h=>(h+1)%3)}> {hint===0?'? HINT':hint===1?'? MORE HELP':'HIDE HINTS'}</button></div>{hint>0&&!won&&<p className="circuit-hint">{hint===1?'Look closely at the coloured sockets. Labels are not in the same order on both sides.':'Match each source to a destination with the same socket colour. Connect all three.'}</p>}{failed>0&&!won&&<small>Interference detected: {failed}. Connections already repaired remain saved.</small>}{won&&<p>◈ A hidden system file has been restored. The next part of the mystery is ready.</p>}<style jsx>{`
.circuit-game{background:repeating-linear-gradient(0deg,#211432,#211432 5px,#29193b 6px);border:3px solid #c48ad7;padding:18px;color:#f7e0f8;font:12px/1.6 monospace;box-shadow:5px 5px #11081e}
.circuit-head,.circuit-footer{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;color:#91e5e3;font-size:11px}
.circuit-game h3{font-size:21px;color:#ffb1de;text-shadow:2px 0 #6ddad9;margin:12px 0}
.circuit-board{display:grid;grid-template-columns:minmax(0,1fr) 90px minmax(0,1fr);gap:6px;align-items:center;margin:18px 0;padding:12px 5px;background:#170d26;border:2px solid #5b4074}
.circuit-column{display:grid;gap:12px}.circuit-column button{min-width:0;display:flex;align-items:center;gap:6px;justify-content:center;padding:12px 4px;border:2px solid var(--wire);color:#fff3fa;background:#332044;font:700 11px monospace;cursor:pointer;touch-action:manipulation}.circuit-column button.picked{background:#73528c;box-shadow:0 0 15px var(--wire)}.circuit-column button:disabled{opacity:.45;cursor:default}.circuit-column i{height:11px;width:11px;border-radius:50%;background:var(--wire);box-shadow:0 0 10px var(--wire)}.circuit-wires{display:grid;gap:16px;text-align:center;font-size:15px;overflow:hidden}.circuit-footer button{padding:8px 12px;background:#da8dcf;border:1px solid #ffe2f3;color:#261232;cursor:pointer}.circuit-hint{border-left:3px solid #ffcf7d;padding-left:12px}
@media(max-width:500px){.circuit-board{grid-template-columns:minmax(0,1fr) 35px minmax(0,1fr)}.circuit-wires{font-size:9px}.circuit-column button{font-size:9px;padding:10px 2px}}
`}</style></div>
}
