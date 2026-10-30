'use client'
import React,{useEffect,useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {ArrowLeft,RotateCcw,Sparkles} from 'lucide-react'

// PLACEHOLDERS: replace the questions, options, correct index (0-3), and explanation here.
const QUESTIONS = [
  {
    "id": 1,
    "question": "Which organ pumps blood around the human body?",
    "options": [
      "Lungs",
      "Heart",
      "Liver",
      "Kidneys"
    ],
    "correct": 1,
    "explanation": "The heart pumps blood through the circulatory system."
  },
  {
    "id": 2,
    "question": "Which planet is known as the Red Planet?",
    "options": [
      "Venus",
      "Jupiter",
      "Mars",
      "Mercury"
    ],
    "correct": 2,
    "explanation": "Mars is nicknamed the Red Planet."
  },
  {
    "id": 3,
    "question": "What is the chemical symbol for gold?",
    "options": [
      "Ag",
      "Au",
      "Fe",
      "Cu"
    ],
    "correct": 1,
    "explanation": "Gold's chemical symbol is Au."
  },
  {
    "id": 4,
    "question": "How many sides does a hexagon have?",
    "options": [
      "Five",
      "Six",
      "Seven",
      "Eight"
    ],
    "correct": 1,
    "explanation": "A hexagon has six sides."
  },
  {
    "id": 5,
    "question": "Which ocean is the largest?",
    "options": [
      "Atlantic",
      "Indian",
      "Arctic",
      "Pacific"
    ],
    "correct": 3,
    "explanation": "The Pacific Ocean is the largest."
  },
  {
    "id": 6,
    "question": "Who wrote Sherlock Holmes?",
    "options": [
      "Agatha Christie",
      "Arthur Conan Doyle",
      "J. R. R. Tolkien",
      "Charles Dickens"
    ],
    "correct": 1,
    "explanation": "Arthur Conan Doyle created Sherlock Holmes."
  },
  {
    "id": 7,
    "question": "What is the capital of Japan?",
    "options": [
      "Kyoto",
      "Osaka",
      "Tokyo",
      "Sapporo"
    ],
    "correct": 2,
    "explanation": "Tokyo is Japan's capital."
  },
  {
    "id": 8,
    "question": "What gas do plants absorb during photosynthesis?",
    "options": [
      "Oxygen",
      "Helium",
      "Carbon dioxide",
      "Nitrogen"
    ],
    "correct": 2,
    "explanation": "Plants absorb carbon dioxide for photosynthesis."
  },
  {
    "id": 9,
    "question": "What is the smallest prime number?",
    "options": [
      "0",
      "1",
      "2",
      "3"
    ],
    "correct": 2,
    "explanation": "Two is the smallest prime number."
  },
  {
    "id": 10,
    "question": "How many bones are typically in the adult human body?",
    "options": [
      "186",
      "206",
      "226",
      "246"
    ],
    "correct": 1,
    "explanation": "The adult human skeleton typically has 206 bones."
  }
]
export default function QuizPage(){
 const router=useRouter()
 const [ready,setReady]=useState(false),[started,setStarted]=useState(false),[index,setIndex]=useState(0),[answers,setAnswers]=useState({}),[finished,setFinished]=useState(false)
 useEffect(()=>{if(sessionStorage.getItem('birthday_authenticated')!=='true')router.replace('/');else setReady(true)},[router])
 const q=QUESTIONS[index],picked=answers[index],answered=picked!==undefined
 const score=QUESTIONS.reduce((n,item,i)=>n+(answers[i]===item.correct?1:0),0)
 const restart=()=>{setStarted(false);setIndex(0);setAnswers({});setFinished(false)}
 if(!ready)return <main style={{minHeight:'100vh',background:'#10091f'}}/>
 return <main className="trivia-page"><div className="trivia-shell">
 <Link className="trivia-back" href="/birthday"><ArrowLeft size={17}/> BACK TO CLAR_OS</Link>
 <div className="trivia-kicker">CLAR_OS / ENTERTAINMENT / 0xQUIZ</div>
 <h1>TRIVIA<span>.exe</span></h1><p className="trivia-sub">A tiny brain workout. Absolutely no pressure. Probably.</p>
 <section className="trivia-window"><div className="trivia-bar"><span>◉ QUESTION_TERMINAL</span><span>● ONLINE</span></div>
 {!started?<div className="trivia-body trivia-intro"><div className="trivia-emoji">✦ ? ✦</div><h2>READY, CLAR?</h2><p>10 quick multiple-choice questions. One answer per question. Your score appears at the end.</p><p className="trivia-note">Temporary sample questions — real trivia coming soon!</p><button className="trivia-primary" onClick={()=>setStarted(true)}>START TRIVIA →</button></div>
 :finished?<div className="trivia-body trivia-intro"><div className="trivia-emoji">✦ ★ ✦</div><div className="trivia-kicker">QUIZ COMPLETE</div><h2>{score} / {QUESTIONS.length}</h2><p>{score===QUESTIONS.length?'PERFECT SCORE. THE MACHINE IS IMPRESSED.':score>=7?'VERY NICE. CLAR_OS APPROVES.':score>=4?'NOT BAD. THE MACHINE HAS QUESTIONS.':'CLAR_OS WOULD LIKE A WORD.'}</p><button className="trivia-primary" onClick={restart}><RotateCcw size={16}/> PLAY AGAIN</button></div>
 :<div className="trivia-body"><div className="trivia-progress-row"><span>QUESTION {String(index+1).padStart(2,'0')} / {QUESTIONS.length}</span><span>{Math.round((index/QUESTIONS.length)*100)}% COMPLETE</span></div><div className="trivia-progress"><div style={{width:(index/QUESTIONS.length)*100+'%'}}/></div><h2 className="trivia-question">{q.question}</h2><div className="trivia-options">{q.options.map((option,i)=><button key={i} disabled={answered} className={'trivia-option '+(answered&&i===q.correct?'correct':answered&&i===picked?'wrong':'')} onClick={()=>setAnswers(a=>({...a,[index]:i}))}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{answered&&<div className="trivia-feedback"><Sparkles size={16}/><span>{picked===q.correct?'CORRECT! ':'NOT QUITE! '}{q.explanation}</span></div>}<div className="trivia-actions"><span>{answered?'ANSWER LOCKED':'CHOOSE ONE ANSWER'}</span><button className="trivia-primary" disabled={!answered} onClick={()=>index===QUESTIONS.length-1?setFinished(true):setIndex(i=>i+1)}>{index===QUESTIONS.length-1?'SEE RESULTS →':'NEXT QUESTION →'}</button></div></div>}
 </section><p className="trivia-foot">CLAR_OS © 2026 · TEST BUILD / QUESTIONS ARE PLACEHOLDERS</p></div>
 <style jsx global>{`body{margin:0}.trivia-page{min-height:100vh;padding:clamp(20px,4vw,56px) 16px;background:radial-gradient(ellipse at 50% 15%,#40205e 0%,#160b29 55%,#090513 100%);color:#f8eaff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.trivia-shell{max-width:790px;margin:0 auto}.trivia-back{display:inline-flex;align-items:center;gap:9px;color:#dfb8fa;text-decoration:none;font-size:12px;margin-bottom:38px}.trivia-kicker{font-size:11px;letter-spacing:3px;color:#88e7e9}.trivia-shell h1{font-size:clamp(45px,9vw,84px);margin:9px 0 3px;line-height:1.1;letter-spacing:-3px;text-shadow:4px 4px #9b3f96}.trivia-shell h1 span{color:#ff9cdb}.trivia-sub{color:#d8b9e3;margin:15px 0 34px;font-size:14px}.trivia-window{border:2px solid #b46fd3;box-shadow:9px 9px 0 #080411,0 0 45px #a64dd42e;background:#1a102e}.trivia-bar{padding:12px 16px;background:linear-gradient(90deg,#823da3,#573177);display:flex;justify-content:space-between;gap:8px;font-size:11px;letter-spacing:1px}.trivia-body{padding:clamp(20px,5vw,45px)}.trivia-intro{text-align:center;padding-top:55px;padding-bottom:55px}.trivia-intro h2{font-size:clamp(30px,6vw,49px);margin:16px 0;color:#ffb1df}.trivia-intro p{max-width:460px;margin:15px auto;line-height:1.8;color:#e5d0ed}.trivia-emoji{font-size:38px;color:#a1e9f3}.trivia-note{font-size:12px;color:#a4ebea!important}.trivia-primary{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 22px;border:1px solid #ffd1ef;background:#d66ab6;color:#170920;font:700 12px ui-monospace,monospace;letter-spacing:1px;cursor:pointer;margin-top:20px;min-height:48px;box-shadow:4px 4px 0 #080411}.trivia-primary:disabled{opacity:.35;cursor:not-allowed}.trivia-progress-row,.trivia-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#a7e7ed;font-size:11px;letter-spacing:1px}.trivia-progress{height:7px;background:#38244f;margin:13px 0 35px;border:1px solid #755188}.trivia-progress div{height:100%;background:linear-gradient(90deg,#a275ff,#ff9ad6);transition:width .3s}.trivia-question{font-size:clamp(21px,4vw,32px);line-height:1.4;margin-bottom:28px}.trivia-options{display:grid;gap:12px}.trivia-option{display:flex;align-items:center;gap:15px;text-align:left;width:100%;padding:15px;background:#2a1b42;color:#f9eaff;border:1px solid #674a85;cursor:pointer;font:inherit;font-size:14px;min-height:58px}.trivia-option span{border:1px solid #9d73b7;color:#c5a7e2;min-width:30px;height:30px;display:grid;place-items:center}.trivia-option:not(:disabled):hover{border-color:#ffaddb;background:#412552}.trivia-option.correct{border-color:#7de4ce;background:#1c493e}.trivia-option.wrong{border-color:#ff9cad;background:#54263e}.trivia-feedback{display:flex;align-items:flex-start;gap:10px;margin-top:20px;color:#b7f2e4;font-size:13px;line-height:1.6}.trivia-actions{margin-top:25px}.trivia-actions .trivia-primary{margin-top:0}.trivia-foot{margin:30px 0;text-align:center;color:#806b9a;font-size:10px;letter-spacing:1px}@media(max-width:480px){.trivia-bar{font-size:9px}.trivia-actions{align-items:flex-end}.trivia-actions>span{max-width:110px}}`}</style></main>
}
