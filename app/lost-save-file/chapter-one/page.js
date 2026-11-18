'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import ChapterOne from './ChapterOne';
export const dynamic = 'force-dynamic';
export default function ChapterOnePage(){
  const [allowed,setAllowed]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const ok=sessionStorage.getItem('birthday_authenticated')==='true' && sessionStorage.getItem('clar_trivia_unlocked')==='true';
    setAllowed(ok);
    setReady(true);
  },[]);
  if(!ready)return <main style={{minHeight:'100vh',background:'#10091f'}}/>;
  if(!allowed)return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'radial-gradient(ellipse at center,#34144e,#10071f 65%,#06040d)',color:'#f4d7ff',fontFamily:'monospace'}}><div style={{width:'min(560px,100%)',padding:32,textAlign:'center',background:'#21132f',border:'2px solid #b47ddd',boxShadow:'8px 8px #080411'}}><div style={{color:'#86e5ef',letterSpacing:3,fontSize:11}}>CLAR_OS // SCAVENGER ACCESS</div><div style={{fontSize:48,margin:'20px 0'}}>🔐</div><h1 style={{fontSize:32,margin:0}}>SAVE FILE LOCKED</h1><p style={{lineHeight:1.8,color:'#d8b9e3'}}>The scavenger hunt begins with a 12-question clearance test. Score at least 9 to unlock this chapter.</p><Link href="/birthday/quiz" style={{display:'inline-block',marginTop:18,padding:'14px 20px',background:'#d66ab6',color:'#170920',fontWeight:700,textDecoration:'none'}}>GO TO TRIVIA →</Link></div></main>;
  return <ChapterOne/>;
}