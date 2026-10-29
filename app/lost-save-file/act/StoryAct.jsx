'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ACTS,GHOST_LETTER} from './actData';
import {drawClar} from '../chapter-one/townRender';
import './act.css';

const CW=1120,CH=640;
const storage=typeof window!=='undefined'?window.localStorage:null;
const makeStart=act=>({x:act.spawn[0],y:act.spawn[1],facing:'right',started:false,solved:[],talked:[],notes:['I followed the broken save into '+act.title+'.'],gateSolved:false,letterOpened:false,letterKept:false,ghostSeen:false});
const D=(a,b,x,y)=>Math.hypot(a-x,b-y);
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const ellipse=(c,x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
function print(c,s,x,y,sz=16,col='#fce6d8'){
 c.textAlign='center';c.font='bold '+sz+'px monospace';c.fillStyle='#140e25';c.fillText(s,x+2,y+2);c.fillStyle=col;c.fillText(s,x,y);
}
const getCamera=(p,a)=>({x:Math.max(0,Math.min(a.width-CW,p.x-CW/2)),y:Math.max(0,Math.min(a.height-CH,p.y-CH/2))});
function platform(c,a,t){
 const night=a.id===2;
 const bg=c.createLinearGradient(0,0,0,a.height);bg.addColorStop(0,a.colors.sky);bg.addColorStop(1,a.colors.ground);rect(c,0,0,a.width,a.height,bg);
 // A 2D environment with clean tiles, glowing signs, subtle parallax and details.
 for(let y=0;y<a.height;y+=80){rect(c,0,y,a.width,2,'#f8d9cc18');for(let x=((y/80)%2)*40;x<a.width;x+=80)rect(c,x,y,2,80,'#100f2430')}
 for(let i=0;i<90;i++){let x=(i*251+37)%a.width,y=(i*173+55)%a.height;rect(c,x,y,3+i%3,3,'#f9d7c03d')}
 rect(c,90,250,a.width-180,75,a.colors.path);
 rect(c,95,620,a.width-190,128,a.colors.path);
 rect(c,250,320,124,700,a.colors.path);
 rect(c,885,260,135,750,a.colors.path);
 rect(c,1380,318,138,650,a.colors.path);
 for(let i=0;i<25;i++){rect(c,145+i*64,624,40,5,'#ffffff19');rect(c,145+i*64,744,40,5,'#14112426')}
 if(night){
  // Station canopy, rail tracks, waiting cars and timetable.
  rect(c,0,145,a.width,90,'#21243d');rect(c,0,225,a.width,14,'#bdadbd');
  for(let i=0;i<12;i++){rect(c,85+i*155,102,11,154,'#8c86a0');rect(c,72+i*155,85,37,20,'#e9d3b4');ellipse(c,92+i*155,255,45,12,'#ffe2b338')}
  rect(c,95,775,a.width-190,102,'#21283a');rect(c,95,792,a.width-190,11,'#bbafc0');rect(c,95,860,a.width-190,10,'#9f97a3');
  for(let x=140;x<1830;x+=95){rect(c,x,779,65,9,'#d9d4db');rect(c,x,845,65,9,'#d9d4db')}
  rect(c,890,305,220,92,'#1e2034');rect(c,900,310,200,74,'#b6b7bf');
  rect(c,910,319,180,59,'#35394c');print(c,'PLATFORM 00',1000,344,19,'#b8f7ee');print(c,'11:19 / DELAYED',1000,370,14,'#ffe5af');
  for(let x of [265,660,1150,1690]){rect(c,x-60,1010,120,19,'#c1a9ae');rect(c,x-48,1027,10,25,'#55465b');rect(c,x+40,1027,10,25,'#55465b')}
  print(c,'NO REFUNDS FOR LOST MEMORIES',900,153,20,'#ffdbc6');
  // Ticket windows.
  for(let x of [310,590,1450]){rect(c,x-75,320,150,110,'#48445e');rect(c,x-65,331,130,77,'#a5bec1');rect(c,x-50,344,95,48,'#33495a');rect(c,x-66,409,131,8,'#d3a6a3')}
 }else{
  // Floating ballroom / broken desktop: chandeliers, staircases, rooftop bridge.
  for(let i=0;i<25;i++){let x=95+i*73;rect(c,x,100+(i%3)*12,35,3,'#e2b2db55')}
  rect(c,70,105,1780,125,'#56324d');rect(c,70,223,1780,11,'#d2a5bc');
  for(let x=180;x<1770;x+=210){rect(c,x-13,130,26,220,'#70445f');rect(c,x-31,126,62,20,'#d0a0b6');rect(c,x-25,336,50,14,'#d0a0b6')}
  for(let i=0;i<3;i++){const x=620+i*300;rect(c,x-3,115,6,155,'#dabbd1');ellipse(c,x,285,115,30,'#e8c6a833');for(let k=0;k<8;k++){ellipse(c,x-78+k*22,285+Math.sin(t/600+k)*4,6,12,'#ffe7b8')}}
  ellipse(c,670,535,215,95,'#815468');ellipse(c,670,535,195,83,'#b78889');ellipse(c,670,535,155,60,'#4b364c');
  for(let i=0;i<8;i++){let theta=i*Math.PI/4;const x=670+170*Math.cos(theta),y=535+115*Math.sin(theta);rect(c,x-12,y-12,24,23,'#b78b7e')}
  rect(c,1290,580,470,26,'#86aec1');for(let i=0;i<11;i++)rect(c,1300+i*42,610,7,86,'#91a9c1');
  rect(c,1282,685,490,21,'#33405b');print(c,'ROOFTOP / MEMORY SKYBRIDGE',1520,568,18,'#d1edff');
  // A distant window with city lights.
  rect(c,1280,140,440,255,'#302941');rect(c,1295,151,410,223,'#1a2540');
  for(let i=0;i<29;i++){let x=1310+(i*79)%380,ht=35+(i*37)%145;rect(c,x,370-ht,29,ht,'#252c48');for(let k=0;k<4;k++)rect(c,x+6+k%2*12,370-ht+13+Math.floor(k/2)*20,4,5,'#eacbaa')}
  print(c,'THE UNWRITTEN ROOM',1000,166,28,'#ffe3d7');
 }
 // Mini-labels become visible while exploring.
 for(const obj of a.objects){const complete=obj.quest&&a._solved?.includes(obj.quest);const pulse=.6+Math.sin(t/400+obj.x)*.15;
   if(obj.id==='gate'||obj.id==='door'){
     rect(c,obj.x-67,obj.y-172,134,188,'#35223e');rect(c,obj.x-58,obj.y-160,116,170,complete?'#ba8ac1':'#79617d');
     rect(c,obj.x-46,obj.y-147,92,151,'#1b1a31');rect(c,obj.x-38,obj.y-137,76,132,'#7a6588');
     rect(c,obj.x-26,obj.y-127,52,112,'#29213b');rect(c,obj.x-6,obj.y-55,12,12,'#f6e9b5');print(c,'EXIT',obj.x,obj.y-187,17);
   }else{
     ellipse(c,obj.x,obj.y+12,57,14,'#0b0d1f77');rect(c,obj.x-33,obj.y-42,66,55,night?'#70647f':'#875875');rect(c,obj.x-24,obj.y-33,48,39,night?'#a5d5d0':'#dc9cbf');
     print(c,obj.icon,obj.x,obj.y-5,32,night?'#30435a':'#4f2f56');
   }
   c.globalAlpha=complete?.5:pulse;rect(c,obj.x-6,obj.y-84,12,12,complete?'#b7dac3':'#ffe1ac');c.globalAlpha=1;
   print(c,obj.name,obj.x,obj.y-94,13,'#fff0dc');
 }
}
function drawFriend(c,n,t,spoken){
 const x=n.x,y=n.y,bob=Math.sin(t/300+n.x)*2;
 ellipse(c,x,y+10,26,7,'#15102075');
 rect(c,x-13,y-5+bob,10,23,'#292537');rect(c,x+3,y-5+bob,10,23,'#292537');
 rect(c,x-20,y-40+bob,40,39,n.coat);rect(c,x-24,y-33+bob,8,27,n.coat);rect(c,x+16,y-33+bob,8,27,n.coat);
 rect(c,x-20,y-10+bob,40,5,'#241d3255');
 ellipse(c,x,y-57+bob,20,22,'#e0ae96');rect(c,x-20,y-80+bob,40,16,n.hair);rect(c,x-20,y-72+bob,8,22,n.hair);
 rect(c,x-12,y-58+bob,6,3,'#382f3e');rect(c,x+7,y-58+bob,6,3,'#382f3e');
 if(n.portrait==='nightwing'){rect(c,x-20,y-38+bob,40,13,'#267eb5');rect(c,x-13,y-62+bob,26,9,'#202c42');}
 if(n.portrait==='sakusa'){rect(c,x-14,y-55+bob,27,11,'#e1d9db');}
 if(n.portrait==='hannibal'){rect(c,x-8,y-34+bob,16,32,'#352d37');rect(c,x-4,y-33+bob,8,10,'#d6b6a7');}
 if(n.portrait==='azusa'){rect(c,x-11,y-70+bob,23,8,'#e3c3f8');rect(c,x-8,y-43+bob,16,15,'#a984d5');}
 if(spoken)print(c,'♥',x,y-91+bob,15,'#ffbddc');
 rect(c,x-70,y-119,140,23,'#271b36');print(c,n.name,x,y-102,12);
}
function drawGame(c,a,p,t,glitch){
 const cam=getCamera(p,a);c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,CW,CH);c.save();c.translate(-cam.x,-cam.y);a._solved=p.solved;platform(c,a,t);
 for(const [id,n] of Object.entries(a.cast))drawFriend(c,n,t,p.talked.includes(id));
 drawClar(c,{...p,lastMoved:p.lastMoved||0},t);
 if(a.id===3&&p.solved.length>=1&&!p.gateSolved){c.save();c.globalAlpha=.3+Math.sin(t/280)*.18;ellipse(c,890,702,21,24,'#171025');rect(c,875,716,30,55,'#150f21');print(c,'...',891,683,18,'#bfa2ce');c.restore()}
 c.restore();
 // HUD stays fixed while map moves.
 rect(c,18,17,225,54,'#1c1835d9');print(c,'CLAR.exe / '+String(a.id).padStart(2,'0'),129,38,17,a.colors.accent);
 print(c,'SAVE FILE: ACTIVE',129,59,12,'#ffe6cb');
 if(glitch){for(let i=0;i<14;i++){let x=(i*143+t/7)%CW,y=(i*83+t/19)%CH;rect(c,x,y,80+(i%4)*45,3+(i%3),'#da72b866')}rect(c,0,0,CW,CH,'#0a041a5d')}
}
function Face({person,id}){
 if(!person)return <div className="act-system-face">✶<small>{id==='GHOST_NAIDU.exe'?'UNKNOWN SENDER':'CLAR.exe'}</small></div>;
 const dark=person.portrait==='nightwing'||person.portrait==='sakusa';
 return <div className="act-face">
 <svg viewBox="0 0 200 230" role="img" aria-label={person.name+' stylised portrait'}>
  <defs><linearGradient id="actSkin" x1="0" x2="1"><stop stopColor="#f9d4b3"/><stop offset="1" stopColor="#c78f89"/></linearGradient></defs>
  <rect width="200" height="230" fill={person.color}/><circle cx="100" cy="85" r="79" fill="none" stroke="#fff4e3" opacity=".36" strokeWidth="2"/>
  <path d="M10 230 Q16 165 67 166 L135 166 Q189 170 197 230Z" fill={person.coat} stroke="#262039" strokeWidth="6"/>
  <rect x="85" y="147" width="29" height="33" fill="#d3a28f"/>
  <path d="M47 88 Q38 27 98 22 Q157 25 155 87 L151 139 Q140 166 100 172 Q61 166 51 137Z" fill={person.hair}/>
  <path d="M57 85 Q59 44 99 44 Q145 47 146 90 L140 137 Q127 164 101 161 Q68 155 61 133Z" fill="url(#actSkin)" stroke="#956d6e" strokeWidth="2"/>
  <path d={person.portrait==='sakusa'?'M44 91 Q34 34 72 28 L79 12 L99 25 L126 14 L153 40 L160 96 Q139 57 125 60 Q108 78 91 61 Q70 74 44 91Z':person.portrait==='suna'?'M42 92 Q45 40 72 33 L92 27 L106 37 L135 31 L160 48 L156 84 Q135 68 116 71 L83 63Z':person.portrait==='nightwing'?'M46 95 Q35 34 70 27 L93 16 L115 29 L149 24 L162 63 L153 97 L143 65 L62 78Z':person.portrait==='hannibal'?'M53 87 Q40 28 77 28 L107 14 L142 27 L156 47 L150 89 Q130 49 108 53 L79 52Z':person.portrait==='azusa'?'M38 101 Q28 48 73 29 L93 11 L118 28 L154 18 L160 90 L141 68 L99 65 L61 86Z':'M48 87 Q39 40 64 32 L93 19 L115 33 L150 29 L157 76 Q131 59 114 55 L84 62Z'} fill={person.hair} stroke="#242032" strokeWidth="4"/>
  <path d="M71 108 Q81 103 91 108 M111 108 Q121 103 131 108" fill="none" stroke="#40303c" strokeWidth="4" strokeLinecap="round"/>
  <ellipse cx="82" cy="116" rx="5" ry="7" fill="#34303b"/><ellipse cx="121" cy="116" rx="5" ry="7" fill="#34303b"/>
  <path d="M98 117 L95 132 Q100 138 106 132 M91 146 Q100 152 112 144" fill="none" stroke="#a57275" strokeWidth="2.5" strokeLinecap="round"/>
  {person.portrait==='sakusa'&&<path d="M65 126 Q101 116 138 126 L132 146 Q99 156 71 144Z" fill="#f0eaec" stroke="#b4bac0" strokeWidth="2"/>}
  {person.portrait==='nightwing'&&<><path d="M66 108 L98 115 L134 108 L126 125 L105 119 L91 125 L71 124Z" fill="#12253a"/><path d="M32 205 L100 193 L170 205" stroke="#27a7e4" strokeWidth="14"/></>}
  {person.portrait==='hannibal'&&<path d="M95 173 L102 212 L109 173" stroke="#ba7182" strokeWidth="7"/>}
  {person.portrait==='azusa'&&<path d="M63 101 Q101 91 142 101" fill="none" stroke="#f4e1fa" strokeWidth="8"/>}
  {person.portrait==='suna'&&<path d="M75 111 L91 108 M114 108 L130 111" stroke="#352e39" strokeWidth="2"/>}
  {person.portrait==='watson'&&<path d="M71 149 Q101 165 135 146" stroke="#765c57" strokeWidth="2" opacity=".6"/>}
  <path d="M15 14 H53 M15 14 V50 M185 14 H147 M185 14 V50" stroke="#ffe5d1" opacity=".65" fill="none" strokeWidth="3"/>
 </svg><div>{person.name}</div></div>;
}
export default function StoryAct({chapter=2}){
 const act=ACTS[chapter],router=useRouter();
 const [p,setP]=useState(()=>makeStart(act)),ref=useRef(p),[loaded,setLoaded]=useState(false);
 const [dialog,setDialog]=useState(null),[typed,setTyped]=useState(0),[panel,setPanel]=useState(null),[toast,setToast]=useState('');
 const [glitch,setGlitch]=useState(false),[music,setMusic]=useState(false),[reduced,setReduced]=useState(false);
 const keys=useRef(new Set()),canvas=useRef(null),audio=useRef(null),dialogRef=useRef(null),panelRef=useRef(null);
 const show=useCallback((who,lines,after)=>{keys.current.clear();setPanel(null);setDialog({who,lines:Array.isArray(lines)?lines:[lines],index:0,after})},[]);
 const patch=useCallback(fn=>setP(prev=>{const v=typeof fn==='function'?fn(prev):{...prev,...fn};ref.current=v;return v}),[]);
 const note=useCallback(s=>patch(v=>({...v,notes:v.notes.includes(s)?v.notes:[...v.notes,s]})),[patch]);
 const sound=useCallback((freq=440,duration=.13)=>{try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!audio.current)audio.current=new A();audio.current.resume();const o=audio.current.createOscillator(),g=audio.current.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.026,audio.current.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audio.current.currentTime+duration);o.connect(g).connect(audio.current.destination);o.start();o.stop(audio.current.currentTime+duration)}catch{}},[]);
 const flash=useCallback((ms=1100)=>{if(reduced)return;setGlitch(true);sound(93,.3);window.setTimeout(()=>setGlitch(false),ms)},[reduced,sound]);
 useEffect(()=>{try{const raw=localStorage.getItem(act.save),v=raw?JSON.parse(raw):null;if(v&&Number.isFinite(v.x)&&Number.isFinite(v.y)){const q={...makeStart(act),...v,solved:Array.isArray(v.solved)?v.solved:[],talked:Array.isArray(v.talked)?v.talked:[],notes:Array.isArray(v.notes)?v.notes:[]};ref.current=q;setP(q)}}catch{}setLoaded(true)},[act]);
 useEffect(()=>{ref.current=p;if(loaded)try{localStorage.setItem(act.save,JSON.stringify(p))}catch{}},[p,loaded,act.save]);
 useEffect(()=>{dialogRef.current=dialog},[dialog]);useEffect(()=>{panelRef.current=panel;if(panel)keys.current.clear()},[panel]);
 useEffect(()=>{if(!loaded||ref.current.started)return;patch(v=>({...v,started:true}));show('SYSTEM',act.intro)},[loaded,act,patch,show]);
 useEffect(()=>{if(!dialog)return;setTyped(0);const line=dialog.lines[dialog.index]||'';const id=window.setInterval(()=>setTyped(n=>Math.min(line.length,n+2)),22);return()=>window.clearInterval(id)},[dialog]);
 useEffect(()=>{if(!toast)return;const id=window.setTimeout(()=>setToast(''),3200);return()=>window.clearTimeout(id)},[toast]);
 useEffect(()=>{if(!music)return;const tones=chapter===2?[294,349,440,392,349,294,261,330]:[220,261,330,392,330,294,261,196];let i=0;const id=setInterval(()=>sound(tones[i++%tones.length],.24),460);return()=>clearInterval(id)},[music,chapter,sound]);
 const nextLine=()=>{const d=dialogRef.current;if(!d)return;const line=d.lines[d.index]||'';if(typed<line.length){setTyped(line.length);return}if(d.index<d.lines.length-1){setDialog({...d,index:d.index+1});return}setDialog(null);if(d.after)d.after()};
 const talk=useCallback(id=>{const n=act.cast[id],v=ref.current;if(D(v.x,v.y,n.x,n.y)>165){setToast('Walk closer to '+n.name+'.');return}const first=!v.talked.includes(id);
 if(first)patch(q=>({...q,talked:[...q.talked,id]}));
 show(id,first?n.intro:[n.after,v.solved.length<3?'There are more clues in this room. Keep looking.':'The way forward is ready. You know what to do.']);sound(610)},[act,patch,show,sound]);
 const openObject=useCallback(obj=>{const v=ref.current;if(D(v.x,v.y,obj.x,obj.y)>150){setToast('Move closer to '+obj.name+'.');return}sound(520);
 if(obj.type==='story'){show('CLAR',obj.lines);note('Investigated '+obj.name.toLowerCase()+'.');return}
 if(obj.type==='puzzle'){if(v.solved.includes(obj.quest)){setToast('Already restored. The memory is safe.');return}setPanel({type:'puzzle',id:obj.quest});return}
 if(obj.type==='gate'){const missing=act.quests.filter(q=>!v.solved.includes(q.id));if(missing.length){setPanel({type:'locked'});return}if(v.gateSolved){setPanel({type:chapter===2?'transition':'ghost'});return}setPanel({type:'gate'});return}
 },[act,chapter,note,show,sound]);
 const near=useCallback(()=>{const v=ref.current;let all=[...Object.entries(act.cast).map(([id,n])=>({kind:'npc',id,x:n.x,y:n.y})),...act.objects.map(o=>({kind:'object',...o}))];all.sort((a,b)=>D(v.x,v.y,a.x,a.y)-D(v.x,v.y,b.x,b.y));const hit=all[0];if(!hit||D(v.x,v.y,hit.x,hit.y)>148){setToast('Explore the map and approach something glowing.');return}if(hit.kind==='npc')talk(hit.id);else openObject(hit)},[act,talk,openObject]);
 const clickCanvas=e=>{if(dialogRef.current||panelRef.current||glitch)return;const r=canvas.current.getBoundingClientRect(),cam=getCamera(ref.current,act);const x=(e.clientX-r.left)*CW/r.width+cam.x,y=(e.clientY-r.top)*CH/r.height+cam.y;
 const candidates=[...Object.entries(act.cast).map(([id,n])=>({kind:'npc',id,x:n.x,y:n.y})),...act.objects.map(o=>({kind:'object',...o}))].sort((a,b)=>D(x,y,a.x,a.y)-D(x,y,b.x,b.y));let hit=candidates[0];if(!hit||D(x,y,hit.x,hit.y)>130)return;if(hit.kind==='npc')talk(hit.id);else openObject(hit)};
 const submitAnswer=(which,kind,id)=>{const quest=kind==='gate'?act.gate:act.quests.find(q=>q.id===id);if(!quest||which!==quest.correct){setToast('Not quite. Try the hint — no attempts are lost.');sound(170,.24);return}
 sound(780,.32);
 if(kind==='gate'){patch(v=>({...v,gateSolved:true}));setPanel(null);flash(chapter===2?4000:1450);
 show('SYSTEM',act.outro,()=>setPanel({type:chapter===2?'transition':'ghost'}));return}
 patch(v=>({...v,solved:[...v.solved,quest.id],notes:[...v.notes,quest.journal]}));setPanel({type:'success',id:quest.id});
 if(ref.current.solved.length===2&&!ref.current.ghostSeen){patch(v=>({...v,ghostSeen:true}));flash(1100)}
 };
 const reset=()=>{if(!window.confirm('Restart Chapter '+chapter+' and overwrite this chapter save?'))return;patch(makeStart(act));setPanel(null);setDialog(null);setGlitch(false)};
 useEffect(()=>{const clear=()=>keys.current.clear(),down=e=>{const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e',' '].includes(key))e.preventDefault();if(e.repeat&&(key==='e'||key===' '))return;if(key==='e'||key===' '){if(dialogRef.current){nextLine();return}if(!panelRef.current)near();return}keys.current.add(key)},up=e=>{keys.current.delete(e.key.toLowerCase())};
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[near,dialog,typed]);
 useEffect(()=>{let frame,last=0,steps=0;const loop=t=>{frame=requestAnimationFrame(loop);if(t-last<30)return;last=t;const v=ref.current;if(!panelRef.current&&!dialogRef.current&&!glitch){let dx=0,dy=0;const k=keys.current;if(k.has('arrowup')||k.has('w'))dy--;if(k.has('arrowdown')||k.has('s'))dy++;if(k.has('arrowleft')||k.has('a'))dx--;if(k.has('arrowright')||k.has('d'))dx++;if(dx||dy){const m=6/Math.hypot(dx,dy),x=Math.min(act.width-85,Math.max(85,v.x+dx*m)),y=Math.min(act.height-100,Math.max(250,v.y+dy*m));v.x=x;v.y=y;v.facing=dx?(dx>0?'right':'left'):(dy>0?'down':'up');v.lastMoved=t;if(++steps%4===0)patch(q=>({...q,x,y,facing:v.facing,lastMoved:t}))}}const c=canvas.current?.getContext('2d');if(c)drawGame(c,act,v,t,glitch)};frame=requestAnimationFrame(loop);return()=>cancelAnimationFrame(frame)},[act,patch,glitch]);
 const quest=panel?.id?act.quests.find(q=>q.id===panel.id):null;
 const remaining=act.quests.filter(q=>!p.solved.includes(q.id));
 const objective=p.gateSolved?'The next door is open.':remaining.length?'Recover '+remaining.length+' signal'+(remaining.length===1?'':'s')+' to find the sender.':'All three memories recovered. Approach the exit.';
 const keepLetter=()=>{patch(v=>({...v,letterKept:true}));sound(900,.3)};
 return <main className={'act-root '+(glitch?'act-glitch':'')} style={{'--accent':act.colors.accent}}>
  <header className="act-header"><div><small>CLAR_OS ▸ THE LOST SAVE FILE</small><h1>0{chapter} · {act.title}</h1><p>{act.subtitle}</p></div><div className="act-header-controls"><span>● AUTOSAVED</span><button onClick={()=>{setMusic(q=>!q);sound()}}>{music?'♫ AUDIO ON':'♪ PLAY AUDIO'}</button><button onClick={()=>setReduced(v=>!v)}>{reduced?'EFFECTS LOW':'EFFECTS FULL'}</button></div></header>
  <div className="act-stage"><canvas width={CW} height={CH} ref={canvas} onClick={clickCanvas} aria-label="Walkable pixel-art chapter map. Tap people and glowing objects when nearby."/>
   <div className="act-hud">{p.solved.length}/3 MEMORY FRAGMENTS</div>
   {glitch&&<div className="act-corruption"><div className="act-shadow"/><b data-text="WATCH OUT, CLAR_">WATCH OUT, CLAR_</b><span>GHOST_NAIDU.exe / SIGNAL DETECTED</span></div>}
  </div>
  <section className="act-toolbar">
   <div className="act-objective"><b>OBJECTIVE</b><p>{objective}</p><small>WASD / ARROWS · E TO INTERACT · HOLD TOUCH ARROWS ON MOBILE</small></div>
   <div className="act-actions"><div className="act-dpad"><span/><button onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current.add('arrowup')}} onPointerUp={()=>keys.current.delete('arrowup')} onPointerCancel={()=>keys.current.delete('arrowup')} onLostPointerCapture={()=>keys.current.delete('arrowup')}>▲</button><span/>{[['◀','arrowleft'],['▼','arrowdown'],['▶','arrowright']].map(([s,k])=><button key={k} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(k)}} onPointerUp={()=>keys.current.delete(k)} onPointerCancel={()=>keys.current.delete(k)} onLostPointerCapture={()=>keys.current.delete(k)}>{s}</button>)}</div><button onClick={near}>✦ INTERACT</button><button onClick={()=>setPanel({type:'journal'})}>▤ JOURNAL</button><button onClick={()=>setPanel({type:'map'})}>⌖ MAP / HINTS</button></div>
  </section>
  <div className="act-progress">{act.quests.map((q,i)=><div key={q.id} className={p.solved.includes(q.id)?'done':''}><span>{p.solved.includes(q.id)?'◆':'◇'}</span>{q.title}</div>)}</div>
  {dialog&&<div className="act-overlay"><article className="act-modal"><small>TRANSMISSION // {dialog.index+1}/{dialog.lines.length}</small><div className="act-dialog"><Face id={dialog.who} person={act.cast[dialog.who]}/><div><h2>{act.cast[dialog.who]?.name||dialog.who}</h2><p>{(dialog.lines[dialog.index]||'').slice(0,typed)}{typed<(dialog.lines[dialog.index]||'').length&&<span className="act-caret">▌</span>}</p></div></div><div className="act-modal-actions"><button onClick={nextLine}>{typed<(dialog.lines[dialog.index]||'').length?'SHOW FULL LINE ▸':dialog.index<dialog.lines.length-1?'CONTINUE ▸':'CLOSE TRANSMISSION ✓'}</button></div></article></div>}
  {panel&&!dialog&&<div className="act-overlay"><article className={'act-modal '+(panel.type==='letter'?'act-letter-shell':'')}><small>{panel.type==='letter'?'UNSENT_LETTER_FOR_CLAR.txt':'CLAR.exe / '+panel.type.toUpperCase()}</small>
   {panel.type==='puzzle'&&quest&&<><h2>{quest.title}</h2><p>{quest.pre}</p><div className="act-choices">{quest.answers.map((a,i)=><button key={a} onClick={()=>submitAnswer(i,'quest',quest.id)}>{i+1}. {a}</button>)}</div><p className="act-muted">HINT: {act.objects.find(o=>o.quest===quest.id)?.hint}</p></>}
   {panel.type==='success'&&quest&&<><h2>✦ MEMORY RESTORED</h2>{quest.success.map((s,i)=><p key={i}>{s}</p>)}<div className="act-reward">◆ NEW FILE: {quest.reward}</div></>}
   {panel.type==='gate'&&<><h2>{act.gate.title}</h2><p>{act.gate.prompt}</p><div className="act-choices">{act.gate.answers.map((s,i)=><button onClick={()=>submitAnswer(i,'gate')} key={s}>{i+1}. {s}</button>)}</div><p className="act-muted">HINT: {act.gate.hint}</p></>}
   {panel.type==='locked'&&<><h2>ACCESS DENIED — FOR NOW</h2><p>The exit will not open until all three memory fragments have been restored.</p>{remaining.map(q=><p className="act-muted" key={q.id}>◇ {q.title} — Find {act.objects.find(o=>o.quest===q.id)?.name}</p>)}</>}
   {panel.type==='journal'&&<><h2>CLAR'S JOURNAL</h2><p>{objective}</p>{p.notes.map((s,i)=><div className="act-journal-entry" key={i}><b>{String(i+1).padStart(2,'0')}</b>{s}</div>)}</>}
   {panel.type==='map'&&<><h2>FIELD NOTES</h2><p>All clues are available in any order. Walk towards the labels on the map and press INTERACT (or E). Speak to characters for hints; wrong answers never cost progress.</p>{act.quests.map(q=><div className="act-journal-entry" key={q.id}><b>{p.solved.includes(q.id)?'✓':'◇'}</b>{q.title}: {act.objects.find(o=>o.quest===q.id)?.name} — near {act.cast[q.speaker]?.name}.</div>)}</>}
   {panel.type==='transition'&&<><h2>CHAPTER TWO COMPLETE</h2><div className="act-glyph">✧</div><p>The three signals combine into an address. A ghost is writing something for you inside the last room.</p><p>It has been waiting since 11:19.</p><div className="act-modal-actions"><Link href="/lost-save-file/chapter-three" className="act-action-primary">ENTER CHAPTER THREE ➜</Link></div></>}
   {panel.type==='ghost'&&<><h2>GHOST_NAIDU.exe</h2><div className="act-friendly-ghost"><div className="act-ghost-eyes">•　•</div><div className="act-ghost-letter">✉</div></div><p className="act-center">“HEY. Okay. I have been practicing this entrance for three chapters. PLEASE act surprised.”</p><p className="act-center">A tiny ghost holds out a letter with your name on it.</p><div className="act-modal-actions"><button className="act-action-primary" onClick={()=>{patch(q=>({...q,letterOpened:true}));setPanel({type:'letter'})}}>✉ OPEN THE LETTER</button></div></>}
   {panel.type==='letter'&&<><h2>FOR CLAR, FROM YOUR GHOST ♡</h2><div className="act-paper"><div className="act-paper-top">TO: CLAR　　FROM: NAIDU　　TIME: 11:19</div>{GHOST_LETTER.map((s,i)=><p key={i}>{s}</p>)}<div className="act-paper-heart">♡</div></div><div className="act-modal-actions"><button className="act-action-primary" onClick={keepLetter}>{p.letterKept?'♡ LETTER SAVED IN THIS BROWSER':'♡ KEEP THIS LETTER'}</button><Link className="act-action-primary" href="/birthday">RETURN TO CLAR_OS ✦</Link></div><small className="act-muted">You can reopen this letter by returning to the final save slot.</small></>}
   <div className="act-modal-actions"><button onClick={()=>setPanel(null)}>✕ CLOSE</button></div></article></div>}
   {toast&&<div className="act-toast" role="status">{toast}</div>}
   <footer className="act-footer"><Link href={chapter===2?'/lost-save-file/chapter-one':'/lost-save-file/chapter-two'}>← PREVIOUS CHAPTER</Link><button onClick={reset}>Restart chapter</button><span>Experimental story branch · no production changes</span></footer>
  </main>;
}