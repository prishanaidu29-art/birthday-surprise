'use client'
import {useEffect,useState} from 'react'
import {saveMode,resetCurrentSave} from './ScopedSave'
export default function SaveManager(){
 const [mode,setMode]=useState('player'),[open,setOpen]=useState(false),[confirm,setConfirm]=useState(false)
 useEffect(()=>setMode(saveMode()),[])
 const reset=()=>{if(!confirm){setConfirm(true);return}resetCurrentSave();setConfirm(false);setOpen(false);window.location.reload()}
 return <div style={{position:'fixed',top:12,right:12,zIndex:10050,fontFamily:'monospace',fontSize:11}}>
 <button onClick={()=>setOpen(v=>!v)} style={{background:'#321c48',color:'#e8b6eb',border:'1px solid #bb87c6',padding:'7px 10px',cursor:'pointer'}}>▣ {mode==='test'?'TEST SAVE':'AUTOSAVED'} ▾</button>
 {open&&<div style={{marginTop:5,width:'min(310px,calc(100vw - 28px))',background:'#271635',border:'2px solid #c89ad8',color:'#f8e7f8',padding:14,boxShadow:'5px 5px #0a0613'}}>
 <strong>CLAR_OS // SAVE MANAGER</strong><p>Mode: {mode==='test'?'Creator testing':'Private player'}</p><p>Progress saves automatically on this browser. Finished puzzles and RPG checkpoints survive closing the page. Unfinished puzzle moves may restart.</p>
 {mode==='test'?<a href="/birthday?play=1" style={{color:'#9de8e6'}}>EXIT TEST MODE / PLAYER VIEW</a>:<span style={{color:'#d7b7e2'}}>For creator testing, open /birthday?test=1 in a separate tab.</span>}
 <div style={{marginTop:14}}><button onClick={reset} style={{background:confirm?'#d66a93':'#6a3c7f',color:'white',padding:'9px 12px',border:'1px solid #e7b5e5'}}>{confirm?'CONFIRM: ERASE THIS MODE SAVE':'START NEW GAME / RESET'}</button>{confirm&&<button onClick={()=>setConfirm(false)} style={{marginLeft:7}}>CANCEL</button>}</div>
 <small style={{display:'block',marginTop:9,color:'#bfa2c9'}}>Reset only affects {mode==='test'?'test':'player'} progress on this browser.</small>
 </div>}
 </div>
}
