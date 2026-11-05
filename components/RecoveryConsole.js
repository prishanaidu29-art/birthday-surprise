'use client'
import {scopedStorage} from './ScopedSave';
import {useEffect,useState} from 'react'
export const RECOVERY_KEY='clar_os_recovery_v1'
export function readRecovery(){if(typeof window==='undefined')return 0;try{return Math.min(4,Math.max(0,Number(scopedStorage.getItem(RECOVERY_KEY)||0)))}catch{return 0}}
export function collectClue(stage){try{scopedStorage.setItem('clar_clue_'+stage,'found');window.dispatchEvent(new Event('clar-recovery'))}catch{}}
export function hasClue(stage){try{return scopedStorage.getItem('clar_clue_'+stage)==='found'}catch{return false}}
export function saveRecovery(n){try{scopedStorage.setItem(RECOVERY_KEY,String(n));window.dispatchEvent(new Event('clar-recovery'))}catch{}}
const COLORS=['#ff83c8','#82e7e7','#ffcf78','#b999ff']
const GLYPHS=['✦','◆','♥','✳']
export default function RecoveryConsole({stage=0,onWin,heading='DECRYPT THE ARCHIVE'}){
 const [sequence,setSequence]=useState([])
 const [entered,setEntered]=useState([])
 const [phase,setPhase]=useState('ready')
 const [lit,setLit]=useState(-1)
 const [errors,setErrors]=useState(0)
 const [tick,setTick]=useState(0)
 const [clueFound,setClueFound]=useState(false)
 useEffect(()=>{const update=()=>setClueFound(hasClue(stage));update();window.addEventListener('focus',update);window.addEventListener('clar-recovery',update);return()=>{window.removeEventListener('focus',update);window.removeEventListener('clar-recovery',update)}},[stage])
 useEffect(()=>{if(phase!=='watch')return;let timers=[];sequence.forEach((n,i)=>{timers.push(setTimeout(()=>setLit(n),350+i*820));timers.push(setTimeout(()=>setLit(-1),900+i*820))});timers.push(setTimeout(()=>setPhase('play'),sequence.length*820+450));return()=>timers.forEach(clearTimeout)},[phase,tick,sequence])
 const begin=()=>{if(!clueFound)return;setEntered([]);setLit(-1);setSequence(stage===0?[1,3,0]:[2,0,3,1]);setTick(t=>t+1);setPhase('play')}
 const press=n=>{if(phase!=='play')return;const next=[...entered,n];if(n!==sequence[entered.length]){setErrors(e=>e+1);setEntered([]);setPhase('error');return}setEntered(next);if(next.length===sequence.length){setPhase('won');onWin?.()}}
 return <section className="recovery-console" aria-label="Interactive archive decryption game"><div className="recovery-top"><span>◉ CLAR_OS // SECURITY PROTOCOL</span><span className={phase==='error'?'recovery-error':''}>{phase==='won'?'ACCESS GRANTED':phase==='error'?'SIGNAL CORRUPTED':'ENCRYPTED'}</span></div><h2 className="recovery-title" data-text={heading}>{heading}</h2><p className="recovery-instructions">{phase==='ready'?'The pattern is NOT displayed here. Search the '+(stage===0?'CLAR_OS desktop':'MEMORIES archive')+' for the missing signal, collect it, then return to enter the symbols in order.':phase==='watch'?'WATCH THE COLOUR SIGNALS...':phase==='play'?'YOUR TURN — '+entered.length+' / '+sequence.length+' SIGNALS RESTORED':phase==='error'?'WRONG SIGNAL! The system scrambled. Retry as many times as you need.':'✦ DECRYPTION COMPLETE! MORE LETTERS RESTORED.'}</p><div className={'recovery-pads '+(phase==='error'?'recovery-shake':'')}>{GLYPHS.map((g,i)=><button key={g} type="button" disabled={phase!=='play'} aria-label={'Signal '+(i+1)} onClick={()=>press(i)} style={{'--pad':COLORS[i]}} className={'recovery-pad '+(lit===i?'active':'')}>{g}</button>)}</div><div className="recovery-bottom"><div className="recovery-meter">{Array.from({length:sequence.length||3},(_,i)=><span key={i} className={i<entered.length?'filled':''}/>)}</div>{!clueFound&&<a className="recovery-start" style={{textDecoration:'none'}} href={stage===0?'/birthday':'/birthday/memories'}>↗ SEARCH {stage===0?'DESKTOP':'MEMORIES'} FOR CLUE</a>}{clueFound&&['ready','error'].includes(phase)&&<button className="recovery-start" onClick={begin}>{phase==='error'?'↻ RECONNECT':'▶ ENTER RECOVERED SIGNAL'}</button>}{phase==='watch'&&<span>◌ READING SIGNAL...</span>}{phase==='play'&&<span>TOUCH THE PADS</span>}{phase==='won'&&<span>✓ FILES RECOVERED</span>}</div>{clueFound&&<small>✓ Signal fragment found. Use the order from the discovered clue.</small>}{errors>0&&<small>Attempts: {errors+1} · No progress lost.</small>}</section>
}
