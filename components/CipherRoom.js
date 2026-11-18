'use client'
import {useEffect,useState} from 'react'
import {scopedStorage} from './ScopedSave'
import {readHuntStage,advanceHuntStage} from './HuntProgress'

const cipher={A:'△',B:'○',C:'□',D:'◇',E:'☆',F:'✧',G:'☾',H:'☼',I:'♧',J:'♢',K:'♤',L:'♡',M:'♩',N:'♫',O:'♬',P:'☁',Q:'☂',R:'☀',S:'⚑',T:'⚙',U:'⚓',V:'✿',W:'❖',X:'✖',Y:'☯',Z:'☕'}
const encoded='⚙ ☆ ♡ ♡ / □ ♡ △ ☀ ♧ ⚑ ⚑ △ / ⚙ ☼ ☆ / ⚑ ⚙ △ ☀ / ♧ ⚑ / ♧ ♫ / ⚙ ☼ ☆ / ✧ ♧ ☀ ⚑ ⚙ / ☆ ☾ ☾'
const solution='TELL CLARISSA THE STAR IS IN THE FIRST EGG'

export default function CipherRoom({onSolved,onClose}){
 const [answer,setAnswer]=useState('')
 const [won,setWon]=useState(()=>{try{return scopedStorage.getItem('clar_cipher_solved')==='yes'}catch{return false}})
 const [hint,setHint]=useState(false)
 const [bad,setBad]=useState(false)
 const stage=readHuntStage()
 useEffect(()=>{if(readHuntStage()===3&&won)advanceHuntStage(3,4)},[won,stage])
 const solve=()=>{
  if(readHuntStage()<3)return
  if(answer.trim().toUpperCase().replace(/[^A-Z]/g,'')===solution.replace(/[^A-Z]/g,'')){
   setWon(true);setBad(false)
   try{scopedStorage.setItem('clar_cipher_solved','yes');advanceHuntStage(3,4);window.dispatchEvent(new Event('clar-recovery'))}catch{}
   onSolved?.()
  }else setBad(true)
 }
 return <section className="cipher">
  <header>☾ CIPHER_ROOM.exe <span style={{display:'flex',alignItems:'center',gap:10}}>{won?'DECODED':'ENCRYPTED'}{onClose&&<button type="button" aria-label="Close cipher box" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.preventDefault();e.stopPropagation();onClose()}} style={{margin:0,minWidth:38,minHeight:34,padding:'4px 10px',fontSize:18,touchAction:'manipulation'}}>×</button>}</span></header>
  {stage<3?<div className="cipher-win"><strong>ACCESS LOCKED</strong><p>Restore VHS_02 first. This file will open when the memory tape is repaired.</p></div>:<>
   <h3>THE STATIC LETTER</h3>
   <p>Someone left a message in the desktop noise. Every symbol stands for one letter. Find the key and decode it.</p>
   <div className="cipher-text">{encoded}</div>
   <button className="cipher-hint" onClick={()=>setHint(!hint)}>{hint?'HIDE KEY':'OPEN SYMBOL KEY'}</button>
   {hint&&<div className="cipher-key">{Object.entries(cipher).map(([k,v])=><span key={k}>{v} = {k}</span>)}</div>}
   <label>DECODE MESSAGE<textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type the decoded message…"/></label>
   <button className="cipher-submit" onClick={solve}>SUBMIT DECODE</button>
   {bad&&<small className="cipher-error">NOT QUITE. CHECK THE SYMBOL KEY.</small>}
   {won&&<div className="cipher-win">✦ MESSAGE RECOVERED ✦<p>The first Easter egg is now unlocked on the desktop. Find the glowing object and play the voice recording all the way through.</p></div>}
  </>}
  <style jsx>{`.cipher{background:#1d102a;color:#f7ddf8;border:2px solid #bb86d5;padding:14px;font:12px/1.6 monospace}.cipher header{display:flex;justify-content:space-between;color:#a9eee8}.cipher h3{text-align:center;color:#ffb9df}.cipher-text{padding:14px;background:#10091b;border:1px dashed #a87cc4;text-align:center;line-height:2;font-size:16px;word-break:break-word}.cipher button{font:bold 11px monospace;padding:10px;background:#442456;color:#f9dff7;border:1px solid #bd8ad7;margin:10px 0}.cipher-key{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px;background:#10091b}.cipher-key span{font-size:10px}.cipher label{display:block}.cipher textarea{display:block;width:100%;min-height:75px;margin-top:8px;background:#10091b;color:#a8f3eb;border:1px solid #9569aa;padding:10px;font:12px monospace}.cipher-submit{background:#d88bc8!important;color:#25102f!important}.cipher-error{color:#ff8dbb}.cipher-win{border:1px solid #8ce9e8;padding:12px;margin-top:10px;color:#a8f3eb}.cipher-win p{color:#f6dff5}`}</style>
 </section>
}
