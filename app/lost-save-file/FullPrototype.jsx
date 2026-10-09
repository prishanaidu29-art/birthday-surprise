'use client'
import {useEffect,useRef,useState,useCallback} from 'react'
import Link from 'next/link'

/* THE LOST SAVE FILE — full playable story prototype.
   Entirely isolated to /lost-save-file on rpg-experiment.
   No external assets or backend required; all artwork is procedural.
*/
const T=32, W=34, H=22, SAVE='clar_lost_save_full_v3'
const ZONES=[
 {id:'town',name:'FAMILIAR TOWN',subtitle:'A place that remembers',floor:'#354e48',dark:'#273c3a',road:'#77687c',accent:'#e6bc9d',exit:[31,11],spawn:[2,11],riddle:'The town clock is frozen. What time does it show?',answers:['11:19','12:00','03:33'],correct:0,log:'A town was built around a birthday that nobody wanted to forget.',memory:'A clock ticked backwards. Somewhere, eighteen voices were laughing.'},
 {id:'station',name:'THE LAST TRAIN',subtitle:'Platform 00',floor:'#3d3c50',dark:'#302e40',road:'#777184',accent:'#f4c994',exit:[31,11],spawn:[2,11],riddle:'The timetable says the last train arrives...',answers:['Yesterday','Tomorrow','Never'],correct:1,log:'A train can leave a place without ever leaving a memory.',memory:'The ticket was addressed to someone who had not yet arrived.'},
 {id:'arcade',name:'MIDNIGHT ARCADE',subtitle:'INSERT COIN // DO NOT PRESS',floor:'#3d3051',dark:'#30243e',road:'#67577d',accent:'#eeb2ed',exit:[31,11],spawn:[2,11],riddle:'The cabinet demands a password. Which one is written on the back?',answers:['GAME OVER','REMEMBER','RESET'],correct:1,log:'The first corrupted cabinet kept a record of every choice, including the choices never made.',memory:'The arcade remembers a joke no one has told yet.'},
 {id:'forest',name:'FORGOTTEN WOODS',subtitle:'The trees are listening',floor:'#284a43',dark:'#1d3737',road:'#526b5f',accent:'#b4e3b4',exit:[31,11],spawn:[2,11],riddle:'The compass spins. What should Clar follow?',answers:['The loudest voice','The familiar melody','The darkest path'],correct:1,log:'Some paths can only be found when you stop searching for an exit.',memory:'The forest grew around an old photograph.'},
 {id:'hospital',name:'THE CORRUPTED WING',subtitle:'DO NOT LOOK BEHIND YOU',floor:'#444655',dark:'#343543',road:'#7a798b',accent:'#a8e0df',exit:[31,11],spawn:[2,11],riddle:'The patient file has no diagnosis. What is recorded instead?',answers:['A birthday','A room number','An expiration date'],correct:0,log:'A name was removed from the records. The blank space still remembered its owner.',memory:'The corridor lights blinked in the rhythm of a song.'},
 {id:'archive',name:'THE LOST ARCHIVE',subtitle:'END OF SAVE FILE?',floor:'#372c45',dark:'#292035',road:'#725f7d',accent:'#e3b3eb',exit:[31,11],spawn:[2,11],riddle:'Six logs are recovered. What is the seventh record?',answers:['The Watcher','Clar herself','An empty file'],correct:1,log:'The seventh record was never lost. It was the person opening all the others.',memory:'This file was never about escaping. It was about remembering together.'}
]
const PEOPLE=[
 ['Naidu',0,6,7,'#b87bd3','I know more about this town than I should.','Find the letter I hid near the bakery.'],
 ['Yanaal',0,15,6,'#d6b08b','Did the streetlights just blink in Morse code?','Listen to the clock when the town goes quiet.'],
 ['Nesma',0,25,16,'#c9a3d9','Take this clue. No, I will not explain it.','The mirror shows a different version of the town.'],
 ['Trisha',0,11,15,'#f1a3ce','Riri and I found a suspicious bakery. Obviously we went inside.','The bakery sign changes when nobody is watching.'],
 ['Riri',0,12,15,'#ad99e9','I said we should NOT go inside. Nobody listens.','Check the window after the lights flicker.'],
 ['Arsha',1,8,7,'#efb2a8','Mashriq and I have waited for a train since yesterday.','Someone left a ticket under the bench.'],
 ['Mashriq',1,10,7,'#8bd7b6','The schedule says it arrived tomorrow. Normal, right?','The station bell rings when the platform is empty.'],
 ['Shah',1,24,15,'#9cbded','You can hear footsteps when the platform is empty.','The footsteps stop whenever you stop.'],
 ['Aaron',2,8,7,'#9cc8f5','Lakshay owes me a rematch. The cabinet is rigged.','Try talking to the cabinet instead of fighting it.'],
 ['Lakshay',2,10,7,'#e0c49d','Skill issue. Also, the screen just said your name.','The high score has one extra letter.'],
 ['AK',2,24,15,'#c6a0f1','The high score belongs to someone who does not exist.','The token machine knows too much.'],
 ['Limin',3,9,8,'#f1ce8e','Nut insists the compass is pointing at us.','If you find a lost charm, I definitely did not drop it.'],
 ['Nut',3,11,8,'#81d9c8','I did not get us lost. The forest moved.','There is a shortcut behind the glowing tree.'],
 ['Mira',3,24,16,'#e6a9cb','The trees whisper secrets they should not know.','Follow the melody, not the shadows.'],
 ['Hannah',4,8,7,'#b7d7ee','The patient files have birthdays instead of diagnoses.','A missing file is hidden in the west ward.'],
 ['Cem',4,24,15,'#d0b2d8','You recognise my voice? I hoped you would.','The emergency light turns on for a reason.'],
 ['Azrin',5,9,8,'#a3d5bb','I was the reflection in the mirror. Sorry.','The archive is not the first place we have met.'],
 ['Mukshanna',5,23,15,'#e7bd92','I have waited at the end of the world for you.','Look for the record with no number.']
].map(([name,zone,x,y,color,line,quest],id)=>({name,zone,x,y,color,line,quest,id}))
const ITEMS=[
 [{x:9,y:6,type:'letter',name:'Folded letter'},{x:23,y:6,type:'mirror',name:'Broken mirror'},{x:19,y:17,type:'clock',name:'Stopped clock'},{x:27,y:7,type:'keepsake',name:'Old photograph'}],
 [{x:11,y:16,type:'ticket',name:'Train ticket'},{x:23,y:6,type:'bench',name:'Empty bench'},{x:18,y:17,type:'keepsake',name:'Forgotten luggage'}],
 [{x:12,y:16,type:'cabinet',name:'Corrupted cabinet'},{x:24,y:7,type:'token',name:'Arcade token'},{x:6,y:17,type:'keepsake',name:'Rubber duck'}],
 [{x:7,y:16,type:'charm',name:'Lost charm'},{x:25,y:7,type:'tree',name:'Glowing tree'},{x:20,y:17,type:'keepsake',name:'Torn map'}],
 [{x:11,y:16,type:'file',name:'Missing patient file'},{x:24,y:6,type:'light',name:'Emergency light'},{x:20,y:17,type:'keepsake',name:'Old wristband'}],
 [{x:9,y:16,type:'record',name:'Unnumbered record'},{x:23,y:7,type:'terminal',name:'Final terminal'},{x:18,y:17,type:'keepsake',name:'Group photo frame'}]
]
const ENDINGS=[
 {id:'dawn',name:'THE DAWN',hint:'Choose to keep the memories and step into tomorrow.',line:'The sky becomes gold. The town stays strange, but you are not alone. Some things are worth remembering.'},
 {id:'loop',name:'THE LOOP',hint:'Trust the clock. Repeat the moment you wanted to save.',line:'11:19. The same song starts again. This time, you recognise the footsteps behind you.'},
 {id:'shadow',name:'THE SHADOW',hint:'Face the Watcher after surviving its attention.',line:'You stand still. The silhouette does too. It was never trying to steal your memories. It was afraid of losing its own.'},
 {id:'escape',name:'THE ESCAPE',hint:'Save enough coins to open the emergency exit.',line:'An emergency door opens into daylight. Behind you, the arcade machine quietly prints another ticket.'},
 {id:'forgotten',name:'THE FORGOTTEN',hint:'Let go of the archive rather than holding on.',line:'DELETE? The screen turns white. Someone calls your name, and you remember why it mattered.'},
 {id:'true',name:'THE TRUE SAVE FILE',hint:'Recover six logs and meet at least twelve friends.',line:'The seventh record opens. It is not a file. It is you, and every person who helped make this memory.'}
]
const at=(x,y)=>({x:x*T+T/2,y:y*T+T/2})
const startState=()=>({zone:0,x:at(2,11).x,y:at(2,11).y,dir:'down',step:0,elapsed:0,visited:[0],met:[],quests:[],collected:[],logs:[],solved:[],coins:0,hp:5,watcherSeen:0,watcherX:0,watcherY:0,watcherTime:0,hidden:false,chapterBranches:[],echoes:[],notes:['11:19. The town feels familiar. I should speak to the people I recognise.'],terminalVisits:[],checkpoints:[{zone:0,x:at(2,11).x,y:at(2,11).y}],lastDecision:null,finale:false,ending:null,photo:false,cake:false,character:{hair:0,skin:1,outfit:0,accessory:0},settings:{music:true,effects:true,reduced:false,timers:true},battleWon:[],inventory:[],secret:[],currentQuest:0})
const cleanSave=(v)=>{const base=startState();if(!v||typeof v!=='object')return base;const s={...base,...v,character:{...base.character,...v.character},settings:{...base.settings,...v.settings}};if(!Number.isInteger(s.zone)||s.zone<0||s.zone>=6)return base;for(const key of ['met','quests','collected','logs','solved','visited','echoes','notes','terminalVisits','checkpoints','battleWon','inventory','secret','chapterBranches'])if(!Array.isArray(s[key]))s[key]=base[key];if(!Number.isFinite(s.x)||!Number.isFinite(s.y)){s.x=base.x;s.y=base.y}return s}
const col=['#b87bd3','#84cbbf','#e6a2bd','#e2b880','#96aee7','#bf93ce']
function sprite(c,x,y,color,dir,frame,variant=0,character=null){
 const hair=['#302033','#78483b','#e0b66e','#28283c','#aa7a8d'][character?.hair??variant%5]
 const skin=['#e7b79a','#b87f66','#d89b80','#8f5f51'][character?.skin??variant%4]
 const coat=character?col[character.outfit%col.length]:color
 c.save();c.translate(Math.round(x),Math.round(y));c.imageSmoothingEnabled=false
 const p=(a,b,w,h,k)=>{c.fillStyle=k;c.fillRect(a,b,w,h)}
 p(-12,28,24,5,'#17142266')
 p(-9,-13,18,19,'#201929');p(-7,-11,14,15,skin)
 p(-10,-18,20,8,hair);p(-11,-12,5,16,hair);p(6,-12,5,16,hair)
 if((character?.hair??variant)%3===1){p(-12,-18,4,25,hair);p(8,-18,4,25,hair)}
 if((character?.hair??variant)%3===2){p(-8,-21,16,5,hair)}
 if(dir==='down'){p(-5,-5,3,3,'#291d31');p(3,-5,3,3,'#291d31');p(-1,1,3,1,'#8e5565')}
 if(dir==='left')p(-6,-5,3,3,'#291d31')
 if(dir==='right')p(3,-5,3,3,'#291d31')
 if(dir==='up')p(-7,-9,14,7,hair)
 p(-10,4,20,16,'#231b30');p(-8,5,16,13,coat);p(-2,5,4,3,'#f6e0cb')
 p(-12,8,4,11,skin);p(8,8,4,11,skin)
 const swing=frame?3:0;p(-8,19,7,9+swing,'#31273e');p(1,19,7,9-swing,'#31273e')
 p(-9,27+swing,9,4,'#171421');p(1,27-swing,9,4,'#171421')
 if(character?.accessory===1)p(-9,-7,18,3,'#dfd4ec')
 if(character?.accessory===2){p(-13,5,4,4,'#edc75e');p(9,5,4,4,'#edc75e')}
 if(character?.accessory===3)p(7,-19,7,6,'#d9a1da')
 c.restore()
}
function draw(c,s,time){
 const z=ZONES[s.zone],vw=c.canvas.width,vh=c.canvas.height,camX=Math.max(0,Math.min(W*T-vw,s.x-vw/2)),camY=Math.max(0,Math.min(H*T-vh,s.y-vh/2))
 c.imageSmoothingEnabled=false;c.fillStyle='#0f0a18';c.fillRect(0,0,vw,vh);c.save();c.translate(-Math.floor(camX),-Math.floor(camY))
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const road=(y>=10&&y<=12)||(x>=15&&x<=18)
  const xx=x*T,yy=y*T
  rect(xx,yy,T,T,road?z.road:(x+y)%3===0?z.dark:z.floor)
  if(road){rect(xx+2,yy+T-3,T-5,2,'#241c3460');if((x+y)%2===0)rect(xx+T-3,yy+4,2,T-9,'#bfa3b225')}
  else {if((x*17+y*23+s.zone*7)%11===0)rect(xx+9,yy+13,3,4,'#e8d2e13a');if((x*13+y*11)%29===0){rect(xx+12,yy+11,3,4,'#e4a4c6');rect(xx+18,yy+14,3,3,'#f5d3a1')}}
 }
 // Background architecture is different in every region; doors can be entered.
 for(let i=0;i<5;i++){
  const bx=(3+i*6)*T, by=(i%2?15:2)*T, bw=4*T,bh=4*T
  if(s.zone===3){ // thick trunks and layered canopies
   rect(bx+52,by+30,24,105,'#332c3a');rect(bx+40,by+20,48,40,'#456d59')
   rect(bx+8,by+2,112,46,'#35654f');rect(bx+28,by-16,80,26,'#5c8468')
  }else if(s.zone===1){ // station platforms
   rect(bx-6,by+17,bw+12,bh-12,'#383342');rect(bx-12,by+10,bw+24,20,'#7f687e')
   rect(bx+15,by+48,96,7,'#d1b4b1');rect(bx+15,by+70,96,7,'#d1b4b1')
  }else if(s.zone===2){ // arcade cabinets
   rect(bx+10,by+18,bw-20,bh-25,'#25192e');rect(bx+17,by+30,bw-34,54,i%2?'#5e326d':'#354b77')
   rect(bx+27,by+41,bw-54,30,'#d4a2d855');rect(bx+28,by+91,bw-56,7,'#c6a1d1')
  }else if(s.zone===4){ // hospital
   rect(bx,by+15,bw,bh-15,'#b6b6c0');rect(bx-7,by+8,bw+14,18,'#666275')
   for(let q=0;q<3;q++)rect(bx+14+q*36,by+40,23,32,'#475368')
   rect(bx+49,by+86,32,38,'#454153')
  }else if(s.zone===5){ // towering archive stacks
   rect(bx-4,by+14,bw+8,bh-16,'#241b30');rect(bx-7,by+5,bw+14,16,'#7a577f')
   for(let q=0;q<4;q++)for(let r=0;r<3;r++)rect(bx+10+q*29,by+27+r*27,21,22,['#b278a5','#a993bd','#7c9bb2'][q%3])
  }else{ // homes with roof overhang, window glows and stairs
   rect(bx+6,by+27,bw-12,bh-24,'#171527')
   rect(bx,by+24,bw,bh-28,i%2?'#92768d':'#837b99')
   rect(bx-12,by+10,bw+24,25,i%2?'#835e88':'#6d6a92')
   rect(bx-12,by+10,bw+24,6,'#bc89b6')
   for(let q=0;q<2;q++){rect(bx+16+q*72,by+49,28,31,'#4a354b');rect(bx+20+q*72,by+53,20,23,'#f1cf9a')}
   rect(bx+51,by+83,26,41,'#281d32');rect(bx+60,by+105,3,3,'#f3c99d')
   rect(bx+47,by+120,35,5,'#b9a4a9')
  }
 }
 // Streetlights, shrubs and animated motes
 for(const [lx,ly] of [[2,8],[14,8],[29,8],[2,15],[17,15],[31,15]]){
  const x=lx*T+16,y=ly*T+16;rect(x-3,y-29,6,34,'#251e30');rect(x-7,y-39,14,12,'#f1d4a3')
  const g=c.createRadialGradient(x,y-30,4,x,y-30,65);g.addColorStop(0,'#f8d59d55');g.addColorStop(1,'#f8d59d00');c.fillStyle=g;c.fillRect(x-65,y-95,130,130)
 }
 for(let i=0;i<30;i++){const x=((i*79+time*7)% (W*T)),y=(i*173)% (H*T);rect(x,y,2,2,i%3?'#cda6e450':'#fff1b455')}
 ITEMS[s.zone].forEach((o,i)=>{
  const x=o.x*T+16,y=o.y*T+16,key=s.zone+':'+o.type
  if(s.collected.includes(key))return
  rect(x-13,y+9,26,5,'#1d172a80')
  if(o.type==='mirror'){rect(x-10,y-20,20,37,'#c9a7ce');rect(x-7,y-17,14,31,'#698aa5')}
  else if(o.type==='tree'){rect(x-5,y-3,10,26,'#3d2c40');rect(x-22,y-24,44,27,'#80b6a0')}
  else if(o.type==='cabinet'){rect(x-14,y-20,28,40,'#251b37');rect(x-11,y-16,22,22,'#b06cca');rect(x-6,y+10,12,3,'#f2c5b6')}
  else if(o.type==='terminal'){rect(x-17,y-17,34,30,'#1a1325');rect(x-13,y-13,26,20,'#af8ad1');rect(x-10,y+14,20,4,'#ddd0e4')}
  else{rect(x-9,y-8,18,18,'#e3bd87');rect(x-5,y-5,10,9,i%2?'#aa79a3':'#8db7a6')}
  if(Math.sin(time*3+i)>0.4)rect(x+11,y-24,3,4,'#ffdaef')
 })
 // checkpoint save terminal
 const sx=16*T+16,sy=5*T+16
 rect(sx-14,sy-15,28,32,'#271b38');rect(sx-10,sy-12,20,22,'#9f81c9');rect(sx-6,sy-7,12,10,'#e9d0ec');rect(sx-7,sy+17,14,3,'#a9cbbf')
 // puzzle and chapter gate
 const px=26*T+16,py=16*T+16
 rect(px-13,py-18,26,34,'#3a284c');rect(px-9,py-14,18,23,s.solved.includes(s.zone)?'#88cbb7':'#e2afcb')
 const gx=31*T+16,gy=11*T+16
 rect(gx-13,gy-28,26,55,'#261c32');rect(gx-9,gy-23,18,46,s.solved.includes(s.zone)?'#9fcbb2':'#745a86')
 rect(gx-2,gy-6,4,7,'#f6d8b0')
 PEOPLE.filter(p=>p.zone===s.zone).forEach(p=>{
  sprite(c,p.x*T+16,p.y*T+16+Math.sin(time*2+p.id)*2,p.color,p.id%2?'left':'down',Math.floor(time*2+p.id)%2,p.id)
  c.fillStyle='#f7e8f5';c.font='bold 11px monospace';c.textAlign='center';c.fillText(p.name.toUpperCase(),p.x*T+16,p.y*T-14)
 })
 if(s.watcherTime>0){
  const x=s.watcherX,y=s.watcherY
  c.fillStyle='#150d20';c.beginPath();c.ellipse(x,y,20,33,0,0,Math.PI*2);c.fill()
  rect(x-11,y-8,6,4,'#ec8bb6');rect(x+5,y-8,6,4,'#ec8bb6')
  for(let i=0;i<3;i++)rect(x-14+i*13,y+27+(i%2)*5,7,10,'#24152d')
 }
 sprite(c,s.x,s.y,col[s.character.outfit%col.length],s.dir,Math.floor(s.step)%2,0,s.character)
 c.restore()
 if(s.watcherTime>0){c.fillStyle='rgba(119,40,116,'+(0.05+0.035*Math.sin(time*8))+')';c.fillRect(0,0,vw,vh)}
 if(s.settings.effects&&s.zone>=3){c.fillStyle='#f6b5ff06';for(let i=0;i<8;i++)c.fillRect(0,(i*81+Math.floor(time*13))%vh,vw,2)}
 // visible canvas label
 c.fillStyle='#100b1acc';c.fillRect(9,9,Math.min(vw-18,310),40)
 c.fillStyle='#f3dcef';c.textAlign='left';c.font='bold 13px monospace';c.fillText(String(s.zone+1).padStart(2,'0')+' / '+z.name,19,25)
 c.font='10px monospace';c.fillStyle='#bba4c9';c.fillText(z.subtitle,19,41)
}
function tone(freq=440,len=.13,type='sine',volume=.035){
 try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;window.__clarAudio=window.__clarAudio||new C();const a=window.__clarAudio;if(a.state==='suspended')a.resume();const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+len);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+len)}catch{}
}
const btn={background:'#65427d',color:'#fff0ff',border:'2px solid #b68aca',borderRadius:8,padding:'11px 15px',font:'inherit',cursor:'pointer',touchAction:'manipulation',userSelect:'none',WebkitUserSelect:'none'}
const panel={background:'#21162e',border:'2px solid #b286c8',borderRadius:12,padding:18,maxHeight:'86dvh',overflowY:'auto',width:'min(650px,96vw)',boxSizing:'border-box',boxShadow:'0 14px 60px #05020acc'}
const rows={display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}
export default function FullPrototype(){
 const canvas=useRef(null),world=useRef(startState()),keys=useRef({}),held=useRef({}),last=useRef(0),uiRef=useRef(null),musicRef=useRef(0),interactRef=useRef(null)
 const [ready,setReady]=useState(false),[started,setStarted]=useState(false),[view,setView]=useState(null),[dialog,setDialog]=useState(null),[hud,setHud]=useState({}),[tab,setTab]=useState('notes'),[choice,setChoice]=useState(null),[battle,setBattle]=useState(null),[arena,setArena]=useState(null),[endingChoice,setEndingChoice]=useState(null),[ending,setEnding]=useState(null),[finale,setFinale]=useState(false),[reaction,setReaction]=useState(null),[backup,setBackup]=useState(''),[hint,setHint]=useState(0),[message,setMessage]=useState('')
 const [global,setGlobal]=useState({endings:[],cosmetics:[],photos:0})
 const [interiorId,setInteriorId]=useState(0)
 uiRef.current={view,dialog,battle,arena,ending,finale,started}
 const notify=(v)=>{setMessage(v);window.setTimeout(()=>setMessage(m=>m===v?'':m),4000)}
 const sync=()=>{const s=world.current;setHud({zone:s.zone,met:s.met.length,logs:s.logs.length,coins:s.coins,hp:s.hp,watcher:s.watcherTime,solved:s.solved.length})}
 const persist=useCallback(()=>{try{window.localStorage.setItem(SAVE,JSON.stringify({version:3,state:world.current,global,started:true}))}catch{}},[global])
 const addNote=(line)=>{const s=world.current;if(!s.notes.includes(line))s.notes.push(line)}
 const echo=(who,line,kind='conversation')=>{const s=world.current;s.echoes.push({id:Date.now()+Math.random(),who,line,kind,zone:s.zone,chapter:s.zone+1});if(s.echoes.length>120)s.echoes.shift()}
 const say=(who,line,options=null,done=null)=>{echo(who,line);setDialog({who,line,options,done})}
 const play=(freq=440,d=.13,type='triangle')=>{if(world.current.settings.music)tone(freq,d,type)}
 const checkpoint=()=>{const s=world.current;s.checkpoints.push({zone:s.zone,x:s.x,y:s.y});if(s.checkpoints.length>10)s.checkpoints.shift();addNote('The save terminal blinked. I think it recognised me.');play(523,.23);persist();sync()}
 const restore=()=>{const s=world.current,p=s.checkpoints[s.checkpoints.length-1]||{zone:0,...at(2,11)};s.zone=p.zone;s.x=p.x;s.y=p.y;s.hp=5;s.watcherTime=0;s.hidden=false;setArena(null);setBattle(null);setView(null);setDialog(null);addNote('I woke at a save terminal. Something followed me back.');sync();persist()}
 useEffect(()=>{try{const raw=window.localStorage.getItem(SAVE);if(raw){const d=JSON.parse(raw);if(d.version===3){world.current=cleanSave(d.state);setGlobal({endings:[],cosmetics:[],photos:0,...d.global});setStarted(Boolean(d.started));setFinale(Boolean(d.state?.finale));setEnding(d.state?.ending||null)}}}catch{}setReady(true);sync()},[])
 useEffect(()=>{if(!ready)return;const timer=window.setInterval(persist,2500);const leave=()=>persist();window.addEventListener('pagehide',leave);return()=>{window.clearInterval(timer);window.removeEventListener('pagehide',leave);persist()}},[ready,persist])
 useEffect(()=>{const down=e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();keys.current[k]=true;if((k==='e'||k===' ')&&!e.repeat)interactRef.current?.()};const up=e=>{keys.current[e.key.toLowerCase()]=false};const blur=()=>{keys.current={};held.current={}};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)}},[])
 useEffect(()=>{if(!ready||!started)return;let raf;const frame=(time)=>{const dt=Math.min((time-(last.current||time))/1000,.045);last.current=time;const s=world.current,ui=uiRef.current;s.elapsed+=dt
  if(!ui.view&&!ui.dialog&&!ui.battle&&!ui.arena&&!ui.ending&&!ui.finale){
   const k=keys.current,b=held.current
   let dx=Number(!!(k.arrowright||k.d||b.right))-Number(!!(k.arrowleft||k.a||b.left))
   let dy=Number(!!(k.arrowdown||k.s||b.down))-Number(!!(k.arrowup||k.w||b.up))
   if(dx||dy){const m=Math.hypot(dx,dy);dx/=m;dy/=m;const speed=s.hidden?70:146;const nx=s.x+dx*speed*dt,ny=s.y+dy*speed*dt;s.x=Math.max(30,Math.min(W*T-30,nx));s.y=Math.max(35,Math.min(H*T-35,ny));s.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';s.step+=dt*9;s.hidden=false}
   // The Watcher adapts moderately, and retreats at checkpoints.
   if(s.zone>=2&&s.zone<=5&&s.watcherTime<=0&&Math.floor(s.elapsed)%38===11&&s.elapsed-musicRef.current>28){s.watcherTime=13;s.watcherX=Math.min(W*T-40,s.x+200);s.watcherY=Math.max(40,s.y-120);s.watcherSeen++;musicRef.current=s.elapsed;play(125,.7,'sawtooth')}
   if(s.watcherTime>0){s.watcherTime=Math.max(0,s.watcherTime-dt);if(!s.hidden){const dd=Math.hypot(s.x-s.watcherX,s.y-s.watcherY)||1;s.watcherX+=(s.x-s.watcherX)/dd*dt*(s.watcherSeen>2?76:57);s.watcherY+=(s.y-s.watcherY)/dd*dt*(s.watcherSeen>2?76:57);if(dd<27){s.watcherTime=0;setDialog({who:'UNKNOWN PROCESS',line:'You were not supposed to see that. ...Actually, neither was I.',done:restore});play(80,.4,'sawtooth')}}}
  }
  const c=canvas.current?.getContext('2d');if(c)draw(c,s,s.elapsed)
  raf=window.requestAnimationFrame(frame)
 };raf=window.requestAnimationFrame(frame);return()=>{window.cancelAnimationFrame(raf);last.current=0}},[ready,started])
 useEffect(()=>{if(!ready||!started||!world.current.settings.music)return;let n=0;const notes=[262,330,392,330,294,349,440,349];const id=window.setInterval(()=>{if(document.hidden||uiRef.current.arena||uiRef.current.battle||uiRef.current.ending)return;const s=world.current;const f=notes[n++%notes.length]*(s.watcherTime>0?.5:1);tone(f,.16,s.zone>3?'sine':'triangle',.011)},720);return()=>window.clearInterval(id)},[ready,started])
 const getNear=()=>{const s=world.current;const p={x:s.x,y:s.y};const d=(x,y)=>Math.hypot(p.x-(x*T+16),p.y-(y*T+16));const npc=PEOPLE.filter(n=>n.zone===s.zone).find(n=>d(n.x,n.y)<68);if(npc)return {type:'npc',data:npc};const obj=ITEMS[s.zone].find(o=>d(o.x,o.y)<66);if(obj)return {type:'item',data:obj};if(d(16,5)<73)return {type:'save'};for(let i=0;i<5;i++)if(d(5+i*6,i%2?19:6)<52)return {type:'interior',data:i};if(d(26,16)<75)return {type:'puzzle'};if(d(31,11)<79)return {type:'gate'};if(d(15,11)<58)return {type:'hide'};return null}
 const meet=(n)=>{const s=world.current,first=!s.met.includes(n.id);if(first){s.met.push(n.id);s.coins+=2;addNote('I met '+n.name+'. '+n.line);play(660,.14);sync()}
  say(n.name,n.line,[{label:'Ask about their memory',value:'memory'},{label:'Offer to help',value:'quest'},{label:'Make a ridiculous joke',value:'joke'}],v=>{
   if(v==='memory'){addNote(n.name+' remembers: '+n.quest);say(n.name,n.quest);echo(n.name,n.quest,'clue')}
   if(v==='quest'){if(!s.quests.includes(n.id)){s.quests.push(n.id);s.coins+=3;addNote('I helped '+n.name+' remember something. It might matter later.');sync()}say(n.name,'That actually helped. I owe you one. [+3 coins on first quest]')}
   if(v==='joke')say(n.name,['That was terrible. Do it again.','I am reporting you to the town council.','Please never change, Clar.'][n.id%3])
  })
 }
 const collect=(o)=>{const s=world.current,key=s.zone+':'+o.type;if(s.collected.includes(key)){say('CLAR','I already checked this.');return}
  s.collected.push(key);s.inventory.push(o.name);s.coins+=4;addNote('I found '+o.name.toLowerCase()+' in '+ZONES[s.zone].name+'.');play(740,.17)
  if(o.type==='mirror'||o.type==='record'){s.watcherSeen++;say('UNKNOWN PROCESS','That was not yours to remember. Or was it?')}
  else if(o.type==='cabinet'){say('ARCADE MACHINE','The screen glitches. A figure waits behind the glass.',[{label:'TALK',value:'talk'},{label:'ACT',value:'act'}],()=>beginBattle('CABINET GHOST'))}
  else if(o.type==='terminal'){setView('endings');say('FINAL TERMINAL','Six save protocols are available. Their stories do not all agree.')}
  else say('RECOVERED OBJECT',o.name+' added to your keepsakes. [+4 coins]')
  sync();persist()
 }
 const solve=(i)=>{const s=world.current,z=ZONES[s.zone];if(i!==z.correct){setHint(h=>h+1);play(180,.16,'square');say('MEMORY PUZZLE','Not quite. '+(hint>=1?'The answer is hidden in the people and objects around you.':'Maybe a conversation has the answer.'));return}
  if(!s.solved.includes(s.zone)){s.solved.push(s.zone);s.coins+=6;addNote('I solved the memory puzzle in '+z.name+'. The eastern gate unlocked.');play(784,.25);checkpoint()}
  setView(null);say('MEMORY RESTORED','The world shudders. A familiar melody returns. [+6 coins]');sync()
 }
 const beginBattle=(name)=>{setDialog(null);setView(null);setBattle({name,trust:0,turn:0,guard:false});play(220,.28,'square')}
 const command=(cmd)=>{if(!battle)return;const next={...battle,turn:battle.turn+1,trust:battle.trust+(cmd==='MEMORY'?2:cmd==='TALK'?2:cmd==='ACT'?1:0),guard:cmd==='DEFEND'}
  if(next.trust>=4){const s=world.current;if(!s.battleWon.includes(s.zone))s.battleWon.push(s.zone);addNote('I resolved the encounter with '+battle.name+' without hurting anyone.');setBattle(null);setArena(null);play(660,.25);say(battle.name,'...You listened. I thought everyone had forgotten.');sync();return}
  setBattle(next);setArena({until:Date.now()+4200,heart:50,hit:0,guard:next.guard,enemy:next.name})
 }
 useEffect(()=>{if(!arena)return;let ticks=0;const id=window.setInterval(()=>{setArena(a=>{if(!a)return null;const s=world.current;if(Date.now()>=a.until){return null}const hazard=(ticks*23)%100;const collide=Math.abs(a.heart-hazard)<9;if(collide&&ticks%5===0&&!a.guard){s.hp=Math.max(0,s.hp-1);play(110,.08);sync();if(s.hp===0){window.setTimeout(restore,0);return null}}ticks++;return {...a,hit:hazard}})},140);return()=>window.clearInterval(id)},[arena?.until])
 const travel=(next)=>{const s=world.current;s.zone=next;s.x=at(2,11).x;s.y=at(2,11).y;s.watcherTime=0;s.hidden=false;if(!s.visited.includes(next))s.visited.push(next);addNote('I arrived at '+ZONES[next].name+'. The save file looks different here.');checkpoint();sync();setView(null);play(494,.2)}
 const interact=()=>{if(uiRef.current.dialog||uiRef.current.view||uiRef.current.battle||uiRef.current.arena||uiRef.current.ending||uiRef.current.finale)return
  const s=world.current,n=getNear();if(!n){say('CLAR','The air smells like old electronics and unfinished conversations.');return}
  if(n.type==='npc'){meet(n.data);return}
  if(n.type==='interior'){setInteriorId(n.data);setView('interior');return}
  if(n.type==='item'){collect(n.data);return}
  if(n.type==='save'){if(!s.terminalVisits.includes(s.zone))s.terminalVisits.push(s.zone);checkpoint();say('SAVE TERMINAL',s.terminalVisits.length<3?'Progress recorded. Please do not unplug your memories.':s.terminalVisits.length<5?'You keep returning. That is either courage or terrible navigation.':'I am beginning to think I was built to remember you.');return}
  if(n.type==='hide'){s.hidden=true;s.watcherTime=Math.max(0,s.watcherTime-6);say('HIDING PLACE','Clar crouches behind a pile of boxes. The footsteps grow distant.');return}
  if(n.type==='puzzle'){setHint(0);setView('puzzle');return}
  if(n.type==='gate'){
   if(!s.solved.includes(s.zone)){say('LOCKED GATE','The memory seal is incomplete. Find the puzzle pedestal southeast of the path.');return}
   if(s.zone===5){setView('endings');return}
   if([1,3].includes(s.zone)&&!s.battleWon.includes(s.zone)){beginBattle(s.zone===1?'PLATFORM ECHO':'HOLLOW MEMORY');return}
   if(!s.logs.includes(s.zone)){say('SAVE FILE','A missing log is still here. Inspect the glowing log icon in your journal to recover it.');return}
   travel(s.zone+1)
  }
 }
 interactRef.current=interact
 const recoverLog=()=>{const s=world.current;if(s.logs.includes(s.zone))return;const z=ZONES[s.zone];s.logs.push(s.zone);addNote('Recovered log '+(s.zone+1)+'/6: '+z.log);echo('RECOVERED LOG',z.log,'log');play(523,.25);sync();persist();say('LOG '+String(s.zone+1).padStart(2,'0')+' / 06',z.log)}
 const chooseEnding=(id)=>{const s=world.current;if(id==='true'&&(s.logs.length<6||s.met.length<12)){say('LOCKED PROTOCOL','The true file requires six logs and at least twelve friends.');return}
  if(id==='shadow'&&s.watcherSeen<1){say('LOCKED PROTOCOL','You must first encounter the Watcher.');return}
  if(id==='escape'&&s.coins<20){say('LOCKED PROTOCOL','The emergency exit requires 20 coins.');return}
  s.lastDecision={zone:s.zone,ending:s.ending,coins:s.coins}
  setEndingChoice(id)
 }
 const commitEnding=()=>{const id=endingChoice,s=world.current;if(!id)return;if(id==='escape')s.coins-=20;s.ending=id;setGlobal(g=>({...g,endings:[...new Set([...g.endings,id])]}));setEnding(id);setEndingChoice(null);setView(null);s.finale=false;setFinale(false);addNote('I discovered '+ENDINGS.find(e=>e.id===id).name+'. But the story is not over.');play(392,.5);sync()}
 const toFinale=()=>{const s=world.current;s.finale=true;setFinale(true);setEnding(null);setReaction(null);persist()}
 const newTimeline=(chapter=0)=>{const s=world.current,kept={...s,zone:chapter,x:at(2,11).x,y:at(2,11).y,hp:5,watcherTime:0,hidden:false,finale:false,ending:null};kept.chapterBranches=[...s.chapterBranches,{from:s.zone,to:chapter,at:Date.now()}];kept.visited=[...new Set([...s.visited,chapter])];kept.checkpoints=[...s.checkpoints,{zone:chapter,x:kept.x,y:kept.y}];world.current=kept;setEnding(null);setFinale(false);setView(null);setDialog(null);sync();persist()}
 const undo=()=>{const s=world.current;if(!s.lastDecision){notify('No critical decision to undo.');return}const d=s.lastDecision;s.ending=d.ending;s.coins=d.coins;s.lastDecision=null;setEnding(null);setFinale(false);setView(null);sync();persist();notify('Last critical choice undone. Ending gallery remains unlocked.')}
 const exportSave=()=>{setBackup(JSON.stringify({version:3,state:world.current,global,started:true},null,2));notify('Copy the backup text and store it safely.')}
 const importSave=()=>{try{const d=JSON.parse(backup);if(d.version!==3||!d.state||!d.global||!Array.isArray(d.global.endings))throw Error('Invalid backup');world.current=cleanSave(d.state);setGlobal(d.global);setStarted(true);setFinale(!!d.state.finale);setEnding(d.state.ending||null);setView(null);sync();notify('Backup restored.');}catch{notify('Invalid save file. Nothing was changed.')}}
 const control=(dir,glyph)=><button key={dir} aria-label={'Move '+dir} style={{...btn,minWidth:64,minHeight:60,fontSize:23,background:'#694485',touchAction:'none',WebkitUserSelect:'none'}} onContextMenu={e=>e.preventDefault()} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);held.current[dir]=true}} onPointerUp={()=>held.current[dir]=false} onPointerCancel={()=>held.current[dir]=false} onLostPointerCapture={()=>held.current[dir]=false}>{glyph}</button>
 const closeDialog=(value)=>{const d=dialog;setDialog(null);if(d?.done)d.done(value)}
 const s=world.current,z=ZONES[s.zone],canMove=!view&&!dialog&&!battle&&!arena&&!ending&&!finale
 const modal=(children)=><div style={{position:'fixed',inset:0,background:'#070410e8',zIndex:40,display:'grid',placeItems:'center',padding:12,overflow:'auto'}}><section style={panel}>{children}</section></div>
 return <main style={{background:'radial-gradient(ellipse at 50% 0%,#322044,#100a19 70%)',color:'#f5e6f6',fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',minHeight:'100dvh',padding:'12px 12px 30px',textAlign:'center',userSelect:'none',WebkitUserSelect:'none',touchAction:'pan-y'}}>
  <header style={{maxWidth:850,margin:'0 auto 12px',...rows,justifyContent:'space-between'}}>
   <div style={{textAlign:'left'}}><div style={{fontSize:12,color:'#a9d6ce'}}>CLAR_OS / RESTORED MEMORY</div><h1 style={{margin:'3px 0',fontSize:'clamp(19px,3vw,30px)',letterSpacing:2}}>THE LOST SAVE FILE.exe</h1></div>
   <Link href="/birthday" style={{...btn,fontSize:12,textDecoration:'none'}}>↗ CLAR_OS</Link>
  </header>
  {!ready?<p>READING SAVE FILE...</p>:!started?<section style={{...panel,margin:'30px auto'}}>
   <h2>CREATE_PLAYER.exe</h2><p>Six chapters. Eighteen friends. Six endings. One birthday that refuses to be forgotten.</p>
   <div style={{display:'flex',justifyContent:'center',gap:15,alignItems:'center',flexWrap:'wrap'}}>
    <canvas width={1} height={1} style={{display:'none'}}/>
    {['hair','skin','outfit','accessory'].map((k,i)=><label key={k} style={{display:'grid',gap:8,textAlign:'left',fontSize:12}}>{k.toUpperCase()}<select style={btn} value={s.character[k]} onChange={e=>{s.character[k]=Number(e.target.value);sync()}}>{(i===0?['Dark','Auburn','Blonde','Midnight','Rose']:i===1?['Warm','Tan','Golden','Deep']:i===2?['Lavender','Teal','Pink','Gold','Blue','Violet']:['None','Glasses','Earrings','Hair bow']).map((a,j)=><option key={a} value={j}>{a}</option>)}</select></label>)}
   </div>
   <p style={{color:'#c8aed2',fontSize:13}}>Appearance is cosmetic. No outfit can lock a story ending.</p>
   <button style={btn} onClick={()=>{setStarted(true);play(523,.2);say('SAVE FILE 001','11:19. Find the memory puzzle in Familiar Town, meet your friends and recover the six lost logs.');sync()}}>▶ BEGIN STORY</button>
  </section>:<>
   <div style={{maxWidth:800,margin:'0 auto',textAlign:'left',fontSize:12,color:'#cbb2d4',...rows,justifyContent:'space-between'}}>
    <span>CH {s.zone+1}/6 · 🪙 {hud.coins??0} · ♥ {hud.hp??5}/5 · FRIENDS {hud.met??0}/18 · LOGS {hud.logs??0}/6</span>
    <span>{s.watcherTime>0?'◉ THE WATCHER IS NEAR':'◌ SIGNAL STABLE'}</span>
   </div>
   <div style={{border:'3px solid #ac79c7',borderRadius:5,maxWidth:800,margin:'8px auto',boxShadow:'0 0 30px #8e48ad35',overflow:'hidden'}}>
    <canvas ref={canvas} width={800} height={480} style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated',touchAction:'none'}}/>
   </div>
   <p style={{fontSize:12,color:'#c8b0d0',maxWidth:800,margin:'8px auto'}}>Explore, talk, recover this chapter&apos;s log, solve the puzzle pedestal, then reach the eastern gate. Arrow keys / WASD or touch buttons. E / SPACE to interact.</p>
   <div style={{...rows,justifyContent:'center',margin:'10px auto',maxWidth:820}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,64px)',gap:4}}><span/>{control('up','▲')}<span/>{control('left','◀')}{control('down','▼')}{control('right','▶')}</div>
    <button style={{...btn,minHeight:63}} onClick={interact} disabled={!canMove}>✦ INTERACT</button>
    <button style={{...btn,minHeight:63}} onClick={()=>{setView('journal');setTab('notes')}}>📓 JOURNAL</button>
    <button style={{...btn,minHeight:63}} onClick={()=>setView('map')}>🗺 MAP</button>
    <button style={{...btn,minHeight:63}} onClick={()=>setView('settings')}>⚙ SETTINGS</button>
   </div>
   <div style={{...rows,justifyContent:'center',marginTop:12}}>
    <button style={{...btn,fontSize:12}} onClick={recoverLog} disabled={s.logs.includes(s.zone)}>📼 {s.logs.includes(s.zone)?'CHAPTER LOG RECOVERED':'RECOVER NEARBY LOG'}</button>
    <button style={{...btn,fontSize:12}} onClick={()=>setView('echoes')}>✉ ECHOES.exe</button>
    <button style={{...btn,fontSize:12}} onClick={()=>setView('quests')}>♥ FRIEND QUESTS</button>
   </div>
  </>}
  {message&&<div role="status" style={{position:'fixed',bottom:15,left:'50%',transform:'translateX(-50%)',zIndex:80,background:'#4d3164',padding:12,borderRadius:8}}>{message}</div>}
  {dialog&&modal(<><div style={{fontSize:11,color:'#a8ddd5',letterSpacing:2}}>{dialog.who}</div><p style={{lineHeight:1.8,textAlign:'left'}}>{dialog.line}</p><div style={{...rows,justifyContent:'flex-end'}}>{dialog.options?dialog.options.map(o=><button key={o.value} style={btn} onClick={()=>closeDialog(o.value)}>{o.label}</button>):<button style={btn} onClick={()=>closeDialog()}>CONTINUE ▸</button>}</div></>)}
  {view==='puzzle'&&modal(<><h2>MEMORY SEAL / CHAPTER {s.zone+1}</h2><p>{z.riddle}</p><div style={{display:'grid',gap:10}}>{z.answers.map((a,i)=><button style={btn} key={i} onClick={()=>solve(i)}>{a}</button>)}</div>{hint>=2&&<p style={{color:'#d6b9df'}}>Hint: Talk to the friends here and inspect the local objects.</p>}<button style={{...btn,marginTop:15}} onClick={()=>setView(null)}>CLOSE</button></>)}
  {view==='interior'&&modal(<><div style={{fontSize:11,color:'#a8ddd5'}}>ROOM FILE / {ZONES[s.zone].name}</div><h2>{['OLD HOME','RECORD SHOP','CLOSED CAFÉ','FORGOTTEN CLASSROOM','HIDDEN STORAGE'][interiorId]}</h2><div style={{height:155,background:'repeating-linear-gradient(90deg,#55455e 0 32px,#4c3c58 32px 64px)',border:'9px solid #31243c',position:'relative',margin:'12px auto',maxWidth:430}}><div style={{position:'absolute',top:18,left:22,width:76,height:45,background:'#9d739b',border:'5px solid #281b34'}}/><div style={{position:'absolute',top:18,right:30,width:60,height:50,background:'#e6c69b',border:'6px solid #5e475e'}}/><div style={{position:'absolute',bottom:12,left:'42%',width:75,height:29,background:'#866b90',border:'5px solid #2d2039'}}/></div><p>Dusty furniture, old photographs and a note that looks suspiciously recent. Something about this room changes after memory restoration.</p><div style={{...rows,justifyContent:'center'}}><button style={btn} onClick={()=>{const key=s.zone+':room:'+interiorId;if(!s.secret.includes(key)){s.secret.push(key);s.coins+=5;addNote('I searched a hidden room in '+z.name+'. The furniture remembered a different arrangement.');echo('ROOM MEMORY','A half-erased note: '+z.memory,'clue');play(659,.2);sync();notify('Hidden room discovered. +5 coins and a memory clue.')}else notify('You have already searched this room.')}}>✦ INVESTIGATE ROOM</button><button style={btn} onClick={()=>setView(null)}>LEAVE ROOM</button></div></>)}
  {view==='map'&&modal(<><h2>WORLD_MAP.exe</h2><p>Previously visited regions can be revisited from a save terminal&apos;s memory map.</p><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8}}>{ZONES.map((a,i)=><button key={a.id} style={{...btn,opacity:s.visited.includes(i)?1:.5}} disabled={!s.visited.includes(i)} onClick={()=>travel(i)}>{String(i+1).padStart(2,'0')} / {s.visited.includes(i)?a.name:'???'}</button>)}</div><button style={{...btn,marginTop:16}} onClick={()=>setView(null)}>CLOSE</button></>)}
  {(view==='journal'||view==='quests'||view==='echoes')&&modal(<><div style={{fontSize:11,color:'#a8ddd5'}}>CLAR_OS / PRIVATE FILES</div><h2 style={{marginTop:5}}>THINGS I REMEMBER.txt</h2><div style={{...rows,justifyContent:'center',marginBottom:15}}>{[['notes','MY NOTES'],['friends','FRIENDS'],['logs','LOST LOGS'],['quests','QUESTS'],['echoes','ECHOES'],['endings','ENDINGS'],['replay','REPLAY']].map(([id,name])=><button key={id} style={{...btn,padding:9,fontSize:11,background:tab===id?'#a16cb6':'#4d315e'}} onClick={()=>setTab(id)}>{name}</button>)}</div>
   {tab==='notes'&&<div style={{textAlign:'left'}}>{s.notes.slice().reverse().map((a,i)=><p key={i} style={{background:'#342440',padding:11,fontSize:13}}>✎ {a}</p>)}</div>}
   {tab==='friends'&&<div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:7}}>{PEOPLE.map(p=><div key={p.id} style={{padding:10,background:'#342440',fontSize:12}}>{s.met.includes(p.id)?p.name:'???'}{s.quests.includes(p.id)?' ♥':''}</div>)}</div>}
   {tab==='logs'&&<div style={{textAlign:'left'}}>{ZONES.map((a,i)=><p key={a.id} style={{background:'#342440',padding:12}}>{s.logs.includes(i)?'📼 '+a.log:'🔒 LOG '+(i+1)+' / 06'}</p>)}<p>SEVENTH RECORD: {s.logs.length===6?'The person opening the files was the missing record.':'CORRUPTED // 6 RECORDS REQUIRED'}</p></div>}
   {tab==='quests'&&<div style={{textAlign:'left'}}>{PEOPLE.filter(p=>s.met.includes(p.id)).map(p=><p key={p.id} style={{background:'#342440',padding:11}}><b>{p.name}</b> — {s.quests.includes(p.id)?'♥ Shared memory recovered':'A conversation remains unfinished'}<br/><small>{p.quest}</small></p>)}</div>}
   {tab==='echoes'&&<div style={{textAlign:'left'}}>{s.echoes.slice().reverse().slice(0,40).map(e=><p key={e.id} style={{background:'#342440',padding:11,fontSize:12}}><b>{e.who} · CH {e.chapter}</b><br/>{e.line}</p>)}<p>Replay is canonical. Comedy sandbox is non-canonical and does not alter saves.</p><button style={btn} onClick={()=>setView('sandbox')}>OPEN COMEDY SANDBOX</button></div>}
   {tab==='endings'&&<div style={{textAlign:'left'}}>{ENDINGS.map(e=><p key={e.id} style={{background:'#342440',padding:11}}>{global.endings.includes(e.id)?'✓ '+e.name:'? UNKNOWN ENDING'}<br/><small>{e.hint}</small></p>)}</div>}
   {tab==='replay'&&<><p>Chapter Replay creates an alternate timeline. Previously unlocked endings and discovered records remain preserved.</p><div style={{...rows,justifyContent:'center'}}>{ZONES.filter((a,i)=>s.visited.includes(i)).map(a=><button key={a.id} style={btn} onClick={()=>newTimeline(ZONES.indexOf(a))}>↶ {a.name}</button>)}</div><button style={{...btn,marginTop:10}} onClick={undo}>UNDO LAST CRITICAL DECISION</button></>}
   <div style={{...rows,justifyContent:'center',marginTop:16}}><button style={btn} onClick={()=>{setView(null);sync()}}>CLOSE</button><button style={btn} onClick={restore}>RESTORE CHECKPOINT</button></div>
  </>)}
  {view==='sandbox'&&modal(<><h2>ECHOES.exe / NON-CANONICAL</h2><p>Try a different joke. Nothing here changes your active timeline.</p><div style={{display:'grid',gap:9}}>{['Press it again. For science.','Maybe unplug it first?','Does this machine give refunds for emotional damage?'].map((a,i)=><button key={i} style={btn} onClick={()=>setChoice(i)}>{a}</button>)}</div>{choice!==null&&<p style={{background:'#3d2a4d',padding:13}}>{['LIMIN: CLAR GETS IT! NUT: I am leaving both of you.','LIMIN: That sounds responsible. Ew.','NUT: No, but it gives out rubber ducks.'][choice]}</p>}<button style={btn} onClick={()=>{setView('echoes');setTab('echoes')}}>BACK TO ARCHIVE</button></>)}
  {view==='settings'&&modal(<><h2>SETTINGS / SAVE FILE</h2>{[['music','Music and sound effects'],['effects','Visual glitches and effects'],['reduced','Reduce horror flashes'],['timers','Optional dialogue timers']].map(([k,label])=><label key={k} style={{display:'flex',gap:12,justifyContent:'space-between',padding:11,background:'#382646',marginBottom:7}}>{label}<input type="checkbox" checked={!!s.settings[k]} onChange={e=>{s.settings[k]=e.target.checked;sync();persist()}}/></label>)}<p style={{fontSize:12}}>Browser storage can be cleared. Export your save to keep a separate copy.</p><div style={{...rows,justifyContent:'center'}}><button style={btn} onClick={exportSave}>EXPORT SAVE</button><button style={btn} onClick={importSave}>IMPORT BACKUP</button></div><textarea aria-label="Save backup text" style={{width:'100%',minHeight:90,marginTop:10,background:'#100a19',color:'#f4dcef',boxSizing:'border-box'}} value={backup} onChange={e=>setBackup(e.target.value)}/><button style={btn} onClick={()=>setView(null)}>CLOSE</button></>)}
  {battle&&!arena&&modal(<><div style={{color:'#a8ddd5',fontSize:12}}>MEMORY ENCOUNTER / PEACEFUL ROUTE</div><h2>{battle.name}</h2><p>A frightened memory blocks the path. It does not want to be forgotten.</p><p>♥ {s.hp}/5 · UNDERSTANDING {battle.trust}/4</p><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8}}>{['ACT','TALK','DEFEND','MEMORY'].map(a=><button key={a} style={btn} onClick={()=>command(a)}>{a}</button>)}</div><p style={{fontSize:12,color:'#c8aed2'}}>Choose dialogue or memory to calm the encounter. Dodge the next wave using arrows or touch.</p></>)}
  {arena&&modal(<><h2>DODGE THE CORRUPTION</h2><p>Move the heart away from the moving shadow. Survive until the timer ends.</p><div style={{position:'relative',height:140,border:'3px solid #b78ac9',background:'#130c20',overflow:'hidden',touchAction:'none'}} onPointerMove={e=>{if(e.buttons){const b=e.currentTarget.getBoundingClientRect();setArena(a=>a?{...a,heart:Math.max(6,Math.min(94,(e.clientX-b.left)/b.width*100))}:a)}}}>
   <div style={{position:'absolute',left:arena.heart+'%',top:'60%',fontSize:24,transform:'translateX(-50%)',color:'#ff9ac7'}}>♥</div>
   <div style={{position:'absolute',left:arena.hit+'%',top:'30%',width:20,height:75,background:'#6b427f',transform:'translateX(-50%)'}}/>
  </div><div style={{...rows,justifyContent:'center',marginTop:12}}><button style={btn} onClick={()=>setArena(a=>a?{...a,heart:Math.max(5,a.heart-12)}:a)}>◀</button><button style={btn} onClick={()=>setArena(a=>a?{...a,heart:Math.min(95,a.heart+12)}:a)}>▶</button></div><p>Time remaining: {Math.max(0,Math.ceil((arena.until-Date.now())/1000))} seconds</p></>)}
  {view==='endings'&&modal(<><div style={{fontSize:12,color:'#a8ddd5'}}>FINAL_SAVE_PROTOCOL.exe</div><h2>SIX POSSIBLE ENDINGS</h2><p>Critical decisions are confirmed. Each ending reveals a different part of the mystery. The birthday surprise is accessible after any ending.</p><div style={{display:'grid',gap:8}}>{ENDINGS.map(e=><button key={e.id} style={{...btn,textAlign:'left'}} onClick={()=>chooseEnding(e.id)}><b>{e.name}</b><div style={{fontSize:11,opacity:.85}}>{e.hint}</div></button>)}</div><button style={{...btn,marginTop:14}} onClick={()=>setView(null)}>RETURN TO WORLD</button></>)}
  {endingChoice&&modal(<><div style={{color:'#a8ddd5',letterSpacing:2,fontSize:12}}>CRITICAL TIMELINE DECISION</div><h2>{ENDINGS.find(e=>e.id===endingChoice)?.name}</h2><p>This choice determines this timeline&apos;s ending. A previous checkpoint and the last-decision undo option remain available.</p><div style={{...rows,justifyContent:'center'}}><button style={btn} onClick={commitEnding}>CONFIRM ENDING</button><button style={btn} onClick={()=>setEndingChoice(null)}>GO BACK</button></div></>)}
  {ending&&modal(<><div style={{color:'#a8ddd5',fontSize:12}}>ENDING RECOVERED / {global.endings.length} OF 6</div><h2>{ENDINGS.find(e=>e.id===ending)?.name}</h2><p style={{lineHeight:1.9}}>{ENDINGS.find(e=>e.id===ending)?.line}</p><p style={{fontSize:12}}>A fragment of the Watcher&apos;s story is clearer now. Other endings hold different answers.</p><div style={{...rows,justifyContent:'center'}}><button style={btn} onClick={toFinale}>CONTINUE TO BIRTHDAY REUNION ♡</button><button style={btn} onClick={()=>newTimeline(0)}>NEW GAME+ / REPLAY</button></div></>)}
  {finale&&modal(<><div style={{color:'#b5dacf',fontSize:12}}>RECOVERED DESKTOP / BIRTHDAY.exe</div><h2>HAPPY BIRTHDAY, CLAR ♡</h2><p style={{fontSize:13}}>All eighteen friends are here. Someone hid the cake. Someone else already ate the decorations.</p><div style={{background:'#342440',padding:12,display:'grid',gridTemplateColumns:'repeat(6,minmax(0,1fr))',gap:7}}>{PEOPLE.map(p=><div key={p.id} style={{fontSize:10,padding:'8px 2px',background:p.color+'40',borderRadius:5}}><span style={{fontSize:20}}>♥</span><br/>{p.name}</div>)}</div>
   {!reaction?<><p><b>LIMIN:</b> SURPRISE!! <b>NUT:</b> Please act surprised. We practised.</p><div style={{...rows,justifyContent:'center'}}>{['Scream','Laugh','Pretend to be shocked','Cry a little'].map(a=><button key={a} style={btn} onClick={()=>setReaction(a)}>{a}</button>)}</div></>:<p><b>CLAR:</b> {reaction}! <b>FRIENDS:</b> That is exactly the reaction we were hoping for.</p>}
   <div style={{...rows,justifyContent:'center',marginTop:14}}><button style={btn} onClick={()=>{s.cake=true;play(523,.4);sync();notify('The candles go out. Everyone cheers. Make a wish!')}}>🎂 {s.cake?'CAKE CUT!':'MAKE A WISH'}</button><button style={btn} onClick={()=>{s.photo=true;setGlobal(g=>({...g,photos:g.photos+1}));notify('Group photo saved to your journal keepsakes.')}}>📸 GROUP PHOTO</button></div>
   {s.cake&&s.photo&&<p style={{color:'#a8ddd5'}}>WATCHER: I arranged all of this. Well. I supervised. From a suspicious distance. Happy birthday, Clar.</p>}
   <div style={{...rows,justifyContent:'center',marginTop:15}}><Link href="/birthday" style={{...btn,textDecoration:'none'}}>↗ OPEN RECOVERED CLAR_OS DESKTOP</Link><button style={btn} onClick={()=>{setFinale(false);setView('journal');setTab('replay')}}>RETURN TO RPG / REPLAY</button></div>
  </>)}
 </main>
}
