'use client'
import React,{useCallback,useEffect,useRef,useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {ArrowLeft,RotateCcw,Sparkles,Volume2,VolumeX,Lightbulb} from 'lucide-react'
import {readHuntStage,advanceHuntStage} from '../../../components/HuntProgress'

const QUESTIONS = [
{id:1,category:'CHEMISTRY',question:'Which molecule gives vinegar its characteristic sour taste?',options:['Citric acid','Acetic acid','Lactic acid','Oxalic acid'],correct:1,explanation:'Vinegar contains dilute acetic acid (CH3COOH).'},
{id:2,category:'CHEMISTRY',question:'A solution with pH 3 is how many times more acidic than a solution with pH 5?',options:['2 times','10 times','100 times','1,000 times'],correct:2,explanation:'Each pH unit is a tenfold change; two units means 100 times.'},
{id:3,category:'RIDDLE',question:'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',options:['A shadow','An echo','A cloud','A whistle'],correct:1,explanation:'An echo returns sound without having a physical voice.'},
{id:4,category:'RIDDLE',question:'The more you take, the more you leave behind. What are they?',options:['Memories','Footsteps','Photographs','Breaths'],correct:1,explanation:'Every step you take leaves another footprint.'},
{id:5,category:'RESEARCH BASICS',question:'In a double-blind clinical trial, who is kept unaware of the treatment assignment?',options:['Only participants','Only researchers','Both participants and the relevant study team','Only the statistician'],correct:2,explanation:'Participants and the relevant study team do not know who receives which intervention.'},
{id:6,category:'GENERAL KNOWLEDGE',question:'Which instrument records atmospheric pressure?',options:['Hygrometer','Barometer','Anemometer','Seismometer'],correct:1,explanation:'A barometer measures atmospheric pressure.'},
{id:7,category:'HAIKYUU!!',question:'What position does Tobio Kageyama play?',options:['Wing spiker','Libero','Setter','Middle blocker'],correct:2,explanation:'Kageyama is Karasuno’s setter.'},
{id:8,category:'SAIKI K.',question:'What is the name of Saiki Kusuo’s older brother?',options:['Kusuke Saiki','Shun Kaidou','Riki Nendou','Aren Kuboyasu'],correct:0,explanation:'Kusuke is Saiki’s older brother, a highly intelligent inventor.'},
{id:9,category:'BBC SHERLOCK',question:'What is the name of Sherlock Holmes’s brother?',options:['Mycroft Holmes','Eurus Holmes','Greg Lestrade','Charles Augustus'],correct:0,explanation:'Mycroft Holmes is Sherlock’s older brother.'},
{id:10,category:'MY HERO ACADEMIA',question:'What was Izuku Midoriya’s original Quirk?',options:['One For All','Explosion','He was born Quirkless','Engine'],correct:2,explanation:'Izuku is initially Quirkless; All Might later passes One For All to him.'},
{id:11,category:'DEXTER',question:'What is the name of the code Dexter follows, taught by Harry?',options:['The Miami Rules','The Harry Code','The Code of Harry','The Dark Passenger Protocol'],correct:2,explanation:'Dexter follows the Code of Harry.'},
{id:12,category:'HANNIBAL',question:'In the TV series Hannibal, what is Will Graham’s profession?',options:['FBI profiler and instructor','Forensic pathologist','District attorney','Psychiatrist'],correct:0,explanation:'Will Graham is an FBI special investigator known for empathic profiling.'}
]
const SAVE_KEY='clar_trivia_run_v2'
const EMPTY={attempt:1,started:false,index:0,answers:{},finished:false,sound:true}

export default function QuizPage(){
 const router=useRouter()
 const [ready,setReady]=useState(false)
 const [blocked,setBlocked]=useState(false)
 const [game,setGame]=useState(EMPTY)
 const audioRef=useRef(null)
 const gameRef=useRef(game)
 useEffect(()=>{gameRef.current=game},[game])

 const tone=useCallback((kind='click')=>{
  if(!gameRef.current.sound||typeof window==='undefined')return
  try{
   const AC=window.AudioContext||window.webkitAudioContext
   if(!AC)return
   const ctx=audioRef.current||(audioRef.current=new AC())
   if(ctx.state==='suspended')ctx.resume().catch(()=>{})
   const now=ctx.currentTime
   const patterns={
    click:{notes:[620],duration:.045,wave:'sine',gain:.022},
    correct:{notes:[660,880,1100],duration:.24,wave:'triangle',gain:.045},
    wrong:{notes:[210,145],duration:.2,wave:'sawtooth',gain:.035},
    reveal:{notes:[440,660,880],duration:.34,wave:'triangle',gain:.04},
    finish:{notes:[523,659,784,1047],duration:.42,wave:'sine',gain:.045}
   }
   const p=patterns[kind]||patterns.click
   p.notes.forEach((freq,i)=>{
    const osc=ctx.createOscillator(),gain=ctx.createGain()
    const start=now+i*(kind==='click'?.0:.085)
    osc.type=p.wave;osc.frequency.setValueAtTime(freq,start)
    gain.gain.setValueAtTime(.0001,start)
    gain.gain.exponentialRampToValueAtTime(p.gain,start+.012)
    gain.gain.exponentialRampToValueAtTime(.0001,start+p.duration)
    osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+p.duration+.02)
   })
  }catch{}
 },[])
 const handleClickSound=()=>tone('click')

 useEffect(()=>{
  if(sessionStorage.getItem('birthday_authenticated')!=='true'){router.replace('/');return}
  if(readHuntStage()<4){setBlocked(true);setReady(true);return}
  try{
   const saved=localStorage.getItem(SAVE_KEY)
   if(saved){const parsed=JSON.parse(saved);setGame({...EMPTY,...parsed,answers:parsed.answers||{}})}
  }catch{}
  setReady(true)
 },[router])
 useEffect(()=>{
  if(ready){try{localStorage.setItem(SAVE_KEY,JSON.stringify(game))}catch{}}
 },[game,ready])
 useEffect(()=>()=>{if(audioRef.current)audioRef.current.close().catch(()=>{})},[])

 const q=QUESTIONS[game.index]
 const picked=game.answers[game.index]
 const answered=picked!==undefined
 const score=QUESTIONS.reduce((n,item,i)=>n+(game.answers[i]===item.correct?1:0),0)
 const unlocked=score>=9
 const helpingHand=game.attempt>=2
 const update=(patch)=>setGame(prev=>({...prev,...patch}))
 const start=()=>{tone('click');update({started:true})}
 const answer=(choice)=>{
  if(answered)return
  const correct=choice===q.correct
  tone(correct?'correct':'wrong')
  update({answers:{...game.answers,[game.index]:choice}})
 }
 const next=()=>{
  tone('click')
  if(game.index===QUESTIONS.length-1){tone('finish');update({finished:true});return}
  update({index:game.index+1})
 }
 const replay=()=>{
  tone('click')
  update({attempt:game.attempt+1,started:false,index:0,answers:{},finished:false})
 }
 const toggleSound=()=>{setGame(prev=>({...prev,sound:!prev.sound}));if(!game.sound)tone('click')}
 if(!ready)return <main style={{minHeight:'100vh',background:'#10091f'}}/>
 if(blocked)return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#10091f',color:'#f8eaff',fontFamily:'monospace'}}><section style={{maxWidth:520,padding:30,border:'2px solid #b46fd3',background:'#1a102e',textAlign:'center'}}><h1>TRIVIA.exe // LOCKED</h1><p>Complete the voice recording recovery before this terminal will accept visitors.</p><Link href='/birthday' className='trivia-back'>RETURN TO CLAR_OS</Link></section></main>

 return <main className="trivia-page" onClickCapture={handleClickSound}>
 <div className="trivia-shell">
 <div className="trivia-topline">
  <Link className="trivia-back" href="/birthday"><ArrowLeft size={17}/> BACK TO CLAR_OS</Link>
  <button className="trivia-sound" onClick={toggleSound} aria-label={game.sound?'Mute sound effects':'Enable sound effects'}>{game.sound?<Volume2 size={16}/>:<VolumeX size={16}/>} SOUND {game.sound?'ON':'OFF'}</button>
 </div>
 <div className="trivia-kicker">CLAR_OS / ENTERTAINMENT / 0xQUIZ</div>
 <h1>TRIVIA<span>.exe</span></h1><p className="trivia-sub">A tiny brain workout. Absolutely no pressure. Probably.</p>
 <section className="trivia-window"><div className="trivia-bar"><span>◉ QUESTION_TERMINAL</span><span>● ONLINE</span></div>
 {!game.started?<div className="trivia-body trivia-intro"><div className="trivia-emoji">✦ ? ✦</div><h2>{game.attempt===1?'READY, CLAR?':'BACK FOR MORE, CLAR?'}</h2><p>12 questions across chemistry, riddles, research basics and your favourite fictional universes. Score at least 9 to recover the next archive signal.</p><p className="trivia-note">CLEARANCE THRESHOLD: 09 / 12</p>{game.attempt>=2&&<p className="trivia-help-note">HELPING HAND PROTOCOL ENABLED // THE SYSTEM MAY INTERVENE.</p>}<button className="trivia-primary" onClick={start}>START TRIVIA →</button></div>
 :game.finished?<div className="trivia-body trivia-intro"><div className="trivia-emoji">✦ ★ ✦</div><div className="trivia-kicker">PLAYTHROUGH {game.attempt} COMPLETE</div><h2>{score} / {QUESTIONS.length}</h2><p>{unlocked?'SCAVENGER ACCESS GRANTED. YOUR NEXT CLUE IS WAITING.':'CLEARANCE DENIED. YOU NEED 9 / 12 TO CONTINUE.'}</p>{unlocked&&<button className="trivia-primary" onClick={()=>{tone('finish');advanceHuntStage(4,5);sessionStorage.setItem('clar_trivia_unlocked','true');router.push('/lost-save-file/chapter-one')}}>ENTER THE SCAVENGER HUNT →</button>}<button className="trivia-primary" onClick={replay}><RotateCcw size={16}/> {unlocked?'PLAY AGAIN':'RETRY THE QUIZ'}</button><p className="trivia-note">PLAYTHROUGH HISTORY SAVED ON THIS DEVICE.</p></div>
 :<div className="trivia-body"><div className="trivia-progress-row"><span>QUESTION {String(game.index+1).padStart(2,'0')} / {QUESTIONS.length}</span><span>RUN {game.attempt} · {Math.round(((game.index+(answered?1:0))/QUESTIONS.length)*100)}%</span></div><div className="trivia-progress"><div style={{width:((game.index+(answered?1:0))/QUESTIONS.length)*100+'%'}}/></div><div className="trivia-kicker">{q.category}</div><h2 className="trivia-question">{q.question}</h2><div className="trivia-options">{q.options.map((option,i)=><button key={i} disabled={answered} className={'trivia-option '+(answered&&picked===i?(picked===q.correct?'correct':'wrong'):'')} onClick={()=>answer(i)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
 {answered&&<div className={'trivia-feedback '+(picked===q.correct?'feedback-correct':'feedback-wrong')}>{picked===q.correct?<><Sparkles size={16}/><span>THAT'S IT. NICE ONE.</span></>:<><span className="feedback-mark">×</span><span>{helpingHand?<><strong>CLAR.EXE INTERVENTION // HELPING HAND ACTIVATED</strong><br/>Not quite. The correct answer is <strong>{q.options[q.correct]}</strong>.<br/>{q.explanation}</>:'NOT QUITE. THE SYSTEM IS NOT GIVING YOU THAT ONE. KEEP MOVING.'}</span></>}</div>}
 <div className="trivia-actions"><span>{answered?(picked===q.correct?'ANSWER ACCEPTED':helpingHand?'HINT PROTOCOL ACTIVE':'ANSWER LOCKED'):'CHOOSE ONE ANSWER'}</span><button className="trivia-primary" disabled={!answered} onClick={next}>{game.index===QUESTIONS.length-1?'SEE RESULTS →':'NEXT QUESTION →'}</button></div>
 </div>}
 </section><p className="trivia-foot">CLAR_OS © 2026 · 12 QUESTIONS // CLEARANCE REQUIRED</p></div>
 <style jsx global>{`body{margin:0}.trivia-page{min-height:100vh;padding:clamp(20px,4vw,56px) 16px;background:radial-gradient(ellipse at 50% 15%,#40205e 0%,#160b29 55%,#090513 100%);color:#f8eaff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.trivia-shell{max-width:790px;margin:0 auto}.trivia-topline{display:flex;justify-content:space-between;align-items:center;margin-bottom:38px;gap:12px}.trivia-back{display:inline-flex;align-items:center;gap:9px;color:#dfb8fa;text-decoration:none;font-size:12px}.trivia-sound{display:inline-flex;align-items:center;gap:7px;background:#241536;border:1px solid #8d65a8;color:#e9d5f6;padding:9px 12px;font:11px ui-monospace,monospace;cursor:pointer}.trivia-kicker{font-size:11px;letter-spacing:3px;color:#88e7e9}.trivia-shell h1{font-size:clamp(45px,9vw,84px);margin:9px 0 3px;line-height:1.1;letter-spacing:-3px;text-shadow:4px 4px #9b3f96}.trivia-shell h1 span{color:#ff9cdb}.trivia-sub{color:#d8b9e3;margin:15px 0 34px;font-size:14px}.trivia-window{border:2px solid #b46fd3;box-shadow:9px 9px 0 #080411,0 0 45px #a64dd42e;background:#1a102e}.trivia-bar{padding:12px 16px;background:linear-gradient(90deg,#823da3,#573177);display:flex;justify-content:space-between;gap:8px;font-size:11px;letter-spacing:1px}.trivia-body{padding:clamp(20px,5vw,45px)}.trivia-intro{text-align:center;padding-top:55px;padding-bottom:55px}.trivia-intro h2{font-size:clamp(30px,6vw,49px);margin:16px 0;color:#ffb1df}.trivia-intro p{max-width:460px;margin:15px auto;line-height:1.8;color:#e5d0ed}.trivia-emoji{font-size:38px;color:#a1e9f3}.trivia-note{font-size:12px;color:#a4ebea!important}.trivia-help-note{font-size:11px!important;color:#ffb2dd!important;letter-spacing:1px}.trivia-primary{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 22px;border:1px solid #ffd1ef;background:#d66ab6;color:#170920;font:700 12px ui-monospace,monospace;letter-spacing:1px;cursor:pointer;margin-top:20px;min-height:48px;box-shadow:4px 4px 0 #080411}.trivia-primary:disabled{opacity:.35;cursor:not-allowed}.trivia-progress-row,.trivia-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#a7e7ed;font-size:11px;letter-spacing:1px}.trivia-progress{height:7px;background:#38244f;margin:13px 0 35px;border:1px solid #755188}.trivia-progress div{height:100%;background:linear-gradient(90deg,#a275ff,#ff9ad6);transition:width .3s}.trivia-question{font-size:clamp(21px,4vw,32px);line-height:1.4;margin-bottom:28px}.trivia-options{display:grid;gap:12px}.trivia-option{display:flex;align-items:center;gap:15px;text-align:left;width:100%;padding:15px;background:#2a1b42;color:#f9eaff;border:1px solid #674a85;cursor:pointer;font:inherit;font-size:14px;min-height:58px}.trivia-option span{border:1px solid #9d73b7;color:#c5a7e2;min-width:30px;height:30px;display:grid;place-items:center}.trivia-option:not(:disabled):hover{border-color:#ffaddb;background:#412552}.trivia-option.correct{border-color:#7de4ce;background:#1c493e}.trivia-option.wrong{border-color:#ff9cad;background:#54263e}.trivia-feedback{display:flex;align-items:flex-start;gap:10px;margin-top:20px;font-size:13px;line-height:1.7}.feedback-correct{color:#b7f2e4}.feedback-wrong{color:#ffb8cc}.feedback-mark{font-size:22px;line-height:1}.trivia-feedback strong{color:#ffe0f1}.trivia-actions{margin-top:25px}.trivia-actions .trivia-primary{margin-top:0}.trivia-foot{margin:30px 0;text-align:center;color:#806b9a;font-size:10px;letter-spacing:1px}@media(max-width:480px){.trivia-bar{font-size:9px}.trivia-actions{align-items:flex-end}.trivia-actions>span{max-width:110px}}`}</style></main>
}
