'use client'
import {useEffect,useRef,useState} from 'react'

const TILE=32,WW=32,HH=22,SPEED=118
const ZONES=[
 {id:'town',name:'01 / FAMILIAR TOWN',color:'#31443f',ground:'#3d5049',path:'#76647d',music:'A place that remembers',door:[30,11],entry:[2,11],portal:'station',need:0,objects:[{x:11,y:13,type:'chest',label:'Old chest'},{x:7,y:8,type:'mirror',label:'Broken mirror'},{x:22,y:7,type:'key',label:'Rusted key'}]},
 {id:'station',name:'02 / THE LAST TRAIN',color:'#393443',ground:'#4b4252',path:'#887080',music:'Platform 00',door:[30,11],entry:[2,11],portal:'arcade',need:1,objects:[{x:15,y:5,type:'ticket',label:'Lost ticket'},{x:20,y:16,type:'switch',label:'Signal switch'}]},
 {id:'arcade',name:'03 / MIDNIGHT ARCADE',color:'#292044',ground:'#392959',path:'#70578a',music:'Insert coin',door:[30,11],entry:[2,11],portal:'forest',need:2,objects:[{x:12,y:7,type:'machine',label:'Corrupted cabinet'},{x:23,y:15,type:'token',label:'Arcade token'}]},
 {id:'forest',name:'04 / FORGOTTEN WOODS',color:'#183c3d',ground:'#29534b',path:'#506e61',music:'The trees are listening',door:[30,11],entry:[2,11],portal:'hospital',need:3,objects:[{x:10,y:5,type:'lantern',label:'Unlit lantern'},{x:24,y:16,type:'compass',label:'Broken compass'}]},
 {id:'hospital',name:'05 / CORRUPTED WING',color:'#39404c',ground:'#505668',path:'#818096',music:'Do not look behind you',door:[30,11],entry:[2,11],portal:'archive',need:4,objects:[{x:9,y:15,type:'record',label:'Patient record'},{x:21,y:6,type:'generator',label:'Backup generator'}]},
 {id:'archive',name:'06 / THE LOST ARCHIVE',color:'#30223c',ground:'#422b50',path:'#745781',music:'End of the save file',door:[30,11],entry:[2,11],portal:null,need:5,objects:[{x:15,y:9,type:'terminal',label:'Final terminal'},{x:23,y:15,type:'fragment',label:'Final memory'}]}
]
const CAST=[
 ['Naidu','town',5,11,'#b87bd3','I know more about this place than I should. Keep your memories close.'],
 ['Yanaal','town',14,7,'#d6b08b','Did the streetlights just blink in Morse code?'],
 ['Nesma','town',19,16,'#c9a3d9','Take this clue. No, I will not explain it.'],
 ['Trisha','town',11,6,'#f1a3ce','Riri and I found a suspicious bakery. Obviously we went inside.'],
 ['Riri','town',12,6,'#ad99e9','I said we should NOT go inside. Nobody listens to me.'],
 ['Arsha','station',10,9,'#efb2a8','Mashriq and I have been waiting for a train since yesterday.'],
 ['Mashriq','station',11,9,'#8bd7b6','The schedule says it arrived tomorrow. That seems normal.'],
 ['Shah','station',23,7,'#9cbded','You can hear footsteps when the platform is empty.'],
 ['Aaron','arcade',9,9,'#9cc8f5','Lakshay owes me a rematch. This machine is definitely rigged.'],
 ['Lakshay','arcade',10,9,'#e0c49d','Skill issue. Also, the screen just said your name.'],
 ['AK','arcade',22,16,'#c6a0f1','The high score belongs to someone who does not exist.'],
 ['Limin','forest',9,8,'#f1ce8e','Nut keeps insisting the compass is pointing at us.'],
 ['Nut','forest',10,8,'#81d9c8','I did not get us lost. The forest moved.'],
 ['Mira','forest',22,14,'#e6a9cb','The trees keep whispering secrets they should not know.'],
 ['Hannah','hospital',10,9,'#b7d7ee','The patient files have birthdays instead of diagnoses.'],
 ['Cem','hospital',20,15,'#d0b2d8','You recognise my voice? I was hoping you would.'],
 ['Azrin','archive',11,16,'#a3d5bb','I was the reflection in the mirror. Sorry about that.'],
 ['Mukshanna','archive',24,8,'#e7bd92','I have been waiting at the end of the world for you.']
].map(([name,zone,x,y,color,line],i)=>({name,zone,x,y,color,line,id:i}))
const COINS=ZONES.map((z,i)=>Array.from({length:9},(_,j)=>[4+(j*7+i*3)%24,4+(j*5+i*2)%14]))
const at=([x,y])=>({x:x*TILE+16,y:y*TILE+16})
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const choices=[
 {id:'dawn',name:'THE DAWN ENDING',req:'Reach the final terminal',desc:'Leave the nightmare and carry the memories into tomorrow.'},
 {id:'loop',name:'THE LOOP ENDING',req:'Reach the final terminal',desc:'Restart the world. Everything repeats, but one detail changes.'},
 {id:'shadow',name:'THE SHADOW ENDING',req:'Encounter the watcher',desc:'Accept the strange thing that has followed you.'},
 {id:'escape',name:'THE ESCAPE ENDING',req:'Find 20 coins',desc:'Buy your way out through an emergency exit.'},
 {id:'forgotten',name:'THE FORGOTTEN ENDING',req:'Leave memories behind',desc:'Erase the archive to end the haunting.'},
 {id:'true',name:'THE TRUE SAVE FILE',req:'Meet all 18 friends and recover 6 fragments',desc:'Restore everyone and reveal the world behind the corruption.'}
]
const endingLines={
 dawn:'Morning breaks over Familiar Town. The shadows vanish, but your friends remember every step. You are free to go.',
 loop:'The clock returns to 11:19. The same street. The same music. Except this time, someone is waiting where nobody stood before.',
 shadow:'You turn toward the darkness instead of running. It was never trying to catch you. It was trying not to be forgotten.',
 escape:'The emergency exit opens with a metallic scream. You step into daylight, pockets empty, carrying a story nobody else will believe.',
 forgotten:'DELETE ALL? Y/N. The screen goes white. For a moment you cannot remember why you came. Then a familiar voice calls your name.',
 true:'Eighteen familiar faces gather in the restored archive. The final save file opens: YOU WERE NEVER ALONE. HAPPY BIRTHDAY, CLAR.'
}
function sprite(ctx,x,y,color,dir,walk,variant=0){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.imageSmoothingEnabled=false
 const p=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(a,b,w,h)}
 const hair=['#352139','#4b2938','#6d443b','#242b43','#af7c4f'][variant%5],skin=['#d5a088','#a97662','#ebba9b','#bd8a72'][variant%4],s=walk?2:0
 p(-9,-14,18,18,'#171321');p(-7,-12,14,14,skin)
 p(-10,-17,20,8,hair);p(-10,-10,4,12,hair);p(6,-10,4,12,hair)
 if(variant%3===1){p(-12,-13,4,18,hair);p(8,-13,4,18,hair)}
 if(variant%3===2){p(-6,-20,13,5,hair);p(-11,-14,5,7,hair)}
 if(dir==='down'){p(-5,-6,3,3,'#24162a');p(3,-6,3,3,'#24162a');p(-1,0,3,1,'#874f5c')}
 if(dir==='left')p(-6,-5,3,3,'#24162a')
 if(dir==='right')p(3,-5,3,3,'#24162a')
 if(dir==='up')p(-7,-10,14,7,hair)
 p(-10,3,20,16,'#191326');p(-8,4,16,14,color);p(-3,4,6,3,'#f3d7c5');p(-11,8,3,10,skin);p(8,8,3,10,skin)
 p(-7,19,6,9+s,'#332638');p(1,19,6,11-s,'#332638');p(-8,27+s,8,4,'#161322');p(1,29-s,8,4,'#161322')
 ctx.restore()
}

const TOWN_BUILDINGS=[
 {x:3,y:3,w:5,h:3,name:'BAKERY',roof:'#a46c91'},
 {x:18,y:3,w:5,h:3,name:'RECORDS',roof:'#6c78a2'},
 {x:4,y:16,w:5,h:3,name:'HOME',roof:'#8e699c'},
 {x:24,y:16,w:5,h:3,name:'CLOSED',roof:'#66577c'}
]
function townSolid(x,y){
 const tx=x/TILE,ty=y/TILE
 return TOWN_BUILDINGS.some(h=>tx>h.x-.15&&tx<h.x+h.w+.15&&ty>h.y-.15&&ty<h.y+h.h+.15)
}
function drawTown(ctx,s){
 const t=s.elapsed
 const tile=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x*TILE,y*TILE,w*TILE,h*TILE)}
 // Pavement borders, staggered cobblestones, and recessed curbs
 tile(0,9,WW,1,'#51465d');tile(0,13,WW,1,'#51465d')
 for(let x=0;x<WW;x++){tile(x,9,.8,.08,'#8b7a92');tile(x,13,.8,.08,'#8b7a92')}
 for(let x=0;x<WW;x++)for(let y=10;y<13;y++){
  const px=x*TILE+(y%2)*11,py=y*TILE
  ctx.strokeStyle='#3c354d';ctx.lineWidth=2;ctx.strokeRect(px,py,30,29)
 }
 // Gardens, shrubs, flowers and short wooden fences
 for(let x=1;x<31;x+=2){
  if(x>=12&&x<=17)continue
  for(const y of [2,20]){
   tile(x,y,.8,.3,'#352a42');tile(x+.1,y-.3,.12,.7,'#b28b75');tile(x+.7,y-.3,.12,.7,'#b28b75')
  }
 }
 for(let x=1;x<WW-1;x++)for(let y=1;y<HH-1;y++){
  if((x*13+y*17)%29===0&&!(y>=9&&y<=13)){tile(x+.25,y+.3,.12,.18,'#d8a0c9');tile(x+.48,y+.44,.1,.12,'#f0d38b')}
 }
 TOWN_BUILDINGS.forEach((h,i)=>{
  const px=h.x*TILE,py=h.y*TILE,w=h.w*TILE,height=h.h*TILE
  ctx.fillStyle='#1b1427';ctx.fillRect(px+7,py+18,w,height)
  ctx.fillStyle=i%2?'#82748f':'#94738c';ctx.fillRect(px,py+24,w,height-24)
  ctx.fillStyle='#382b48';ctx.fillRect(px-8,py+5,w+16,24)
  ctx.fillStyle=h.roof;ctx.fillRect(px-8,py+5,w+16,6)
  for(let j=0;j<2;j++){
   const wx=px+24+j*(w-55);ctx.fillStyle='#392841';ctx.fillRect(wx,py+42,24,28)
   ctx.fillStyle='#f6d29c';ctx.fillRect(wx+3,py+45,18,22)
   ctx.fillStyle='#e8b878';ctx.globalAlpha=.15+.1*Math.sin(t*1.2+i);ctx.fillRect(wx-6,py+39,36,37);ctx.globalAlpha=1
   ctx.fillStyle='#614660';ctx.fillRect(wx+11,py+45,2,22)
  }
  ctx.fillStyle='#25192f';ctx.fillRect(px+w/2-14,py+height-34,28,34)
  ctx.fillStyle='#d7a0bc';ctx.fillRect(px+w/2+7,py+height-18,3,3)
  ctx.fillStyle='#281b37';ctx.fillRect(px+w/2-31,py+22,62,14)
  ctx.fillStyle='#f6d4e8';ctx.textAlign='center';ctx.font='bold 9px monospace';ctx.fillText(h.name,px+w/2,py+32)
 })
 // Lamp posts and halos, drawn behind the characters
 for(const [x,y] of [[2,8],[16,8],[29,8],[2,15],[16,15],[29,15]]){
  const px=x*TILE+16,py=y*TILE+16
  ctx.fillStyle='#231c2e';ctx.fillRect(px-3,py-37,6,43)
  ctx.fillStyle='#efcf91';ctx.fillRect(px-7,py-44,14,12)
  const g=ctx.createRadialGradient(px,py-37,4,px,py-37,65)
  g.addColorStop(0,'#f6d78a55');g.addColorStop(1,'#f6d78a00')
  ctx.fillStyle=g;ctx.fillRect(px-65,py-102,130,130)
 }
 // A small pond and stepping stones, well away from the main path
 tile(24,3,5,3,'#253e58')
 for(let i=0;i<7;i++){const x=24*TILE+10+(i*37)%145,y=3*TILE+12+(i*19)%75;ctx.fillStyle='#79a8c1';ctx.fillRect(x,y,12,3)}
 for(let i=0;i<7;i++){const x=(1+i*4)*TILE,y=(i%2?18:7)*TILE;ctx.fillStyle='#253b37';ctx.fillRect(x+2,y+10,28,20);ctx.fillStyle='#547c65';ctx.fillRect(x-5,y-6,40,24);ctx.fillStyle='#719b7c';ctx.fillRect(x,y-11,28,11)}
}

function scene(ctx,s,hair,outfit){
 const z=ZONES[s.zone],vw=ctx.canvas.width,vh=ctx.canvas.height,camX=Math.max(0,Math.min(WW*TILE-vw,s.x-vw/2)),camY=Math.max(0,Math.min(HH*TILE-vh,s.y-vh/2))
 ctx.fillStyle=z.color;ctx.fillRect(0,0,vw,vh);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY))
 for(let y=0;y<HH;y++)for(let x=0;x<WW;x++){
  const path=y>=10&&y<=12||x>=14&&x<=17
  ctx.fillStyle=path?z.path:((x+y)%2?z.color:z.ground);ctx.fillRect(x*TILE,y*TILE,TILE,TILE)
  if(!path&&(x*17+y*23)%19===0){ctx.fillStyle='#ffffff24';ctx.fillRect(x*TILE+10,y*TILE+13,3,4)}
 }
 if(s.zone===0)drawTown(ctx,s)
 const draw=(x,y,emoji)=>{ctx.font='25px monospace';ctx.textAlign='center';ctx.fillText(emoji,x*TILE+16,y*TILE+23)}
 
 if(s.zone===1){for(let x=3;x<29;x++){ctx.fillStyle='#9b879d';ctx.fillRect(x*TILE,5*TILE,27,5);ctx.fillRect(x*TILE,17*TILE,27,5)}draw(17,4,'🚉')}
 if(s.zone===2){[[5,5],[15,6],[24,7],[6,16],[19,16]].forEach(([x,y])=>draw(x,y,'🕹️'))}
 if(s.zone===3){for(let x=3;x<30;x+=4)for(let y=3;y<19;y+=5){if((x+y)%3)draw(x,y,'🌲')}}
 if(s.zone===4){for(let x=4;x<28;x+=5){draw(x,4,'🛏️');draw(x,17,'🛏️')}}
 if(s.zone===5){for(let x=3;x<29;x+=5){draw(x,4,'📁');draw(x,18,'📁')}}
 z.objects.forEach(o=>{if(!s.taken.includes(s.zone+':'+o.type)){const symbols={chest:'📦',mirror:'🪞',key:'🗝️',ticket:'🎫',switch:'🔌',machine:'🕹️',token:'🪙',lantern:'🏮',compass:'🧭',record:'📋',generator:'⚡',terminal:'💻',fragment:'💎'};draw(o.x,o.y,symbols[o.type])}})
 COINS[s.zone].forEach((c,i)=>{if(!s.collected.includes(s.zone+':'+i)){const p=at(c);ctx.fillStyle='#f5c85e';ctx.fillRect(p.x-5,p.y-8,10,16);ctx.fillStyle='#fff3a8';ctx.fillRect(p.x-2,p.y-6,3,12)}})
 const gate=z.door;draw(gate[0],gate[1],s.unlocked.includes(s.zone)?'🚪':'🔒')
 CAST.filter(n=>n.zone===z.id).forEach(n=>{const sway=Math.sin(s.elapsed*1.6+n.id)*5;sprite(ctx,n.x*TILE+16+sway,n.y*TILE+16,n.color,n.id%2?'left':'down',Math.floor(s.elapsed*3+n.id)%2,n.id);ctx.fillStyle='#fce8ff';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(n.name.toUpperCase(),n.x*TILE+16,n.y*TILE-10)})
 if(s.haunt){const hx=at([Math.min(28,Math.floor(s.x/TILE)+3),Math.max(3,Math.floor(s.y/TILE)-2)]);ctx.fillStyle='#110d1e';ctx.beginPath();ctx.ellipse(hx.x+Math.sin(s.elapsed*3)*13,hx.y,17,27,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ef739c';ctx.fillRect(hx.x-9,hx.y-6,5,4);ctx.fillRect(hx.x+4,hx.y-6,5,4)}
 sprite(ctx,s.x,s.y,outfit,s.dir,s.walk?Math.floor(s.elapsed*8)%2:0,0)
 ctx.restore()
 if(s.haunt){ctx.fillStyle='rgba(180,28,80,'+(0.04+0.04*Math.sin(s.elapsed*9))+')';ctx.fillRect(0,0,vw,vh)}
 if(s.blackout>0){ctx.fillStyle='rgba(0,0,0,'+Math.min(.88,s.blackout)+')';ctx.fillRect(0,0,vw,vh);ctx.fillStyle='#f28dbd';ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.fillText('FILE CORRUPTED // DO NOT TRUST THE LIGHTS',vw/2,vh/2)}
}
const initial=()=>({zone:0,x:at([2,11]).x,y:at([2,11]).y,dir:'down',walk:false,elapsed:0,gold:0,met:[],fragments:[],taken:[],collected:[],unlocked:[],key:false,haunt:false,blackout:0,haunts:0,decisions:[],visited:[0],finished:[],pending:null,notes:['11:19. The clock stopped. I should find the rusted key and ask the others what they remember.'],logs:[],checkpoint:{zone:0,x:at([2,11]).x,y:at([2,11]).y}})
export default function Game(){
 const ref=useRef(null),state=useRef(initial()),pressed=useRef({}),keyboard=useRef({}),clock=useRef(0),dialogRef=useRef(null)
 const [started,setStarted]=useState(false),[hair,setHair]=useState('#3b233d'),[outfit,setOutfit]=useState('#b479d2'),[dialog,setDialog]=useState(null),[status,setStatus]=useState({}),[journal,setJournal]=useState(false),[journalTab,setJournalTab]=useState('notes'),[pendingEnding,setPendingEnding]=useState(null),[saveReady,setSaveReady]=useState(false),[ending,setEnding]=useState(null),[endingMenu,setEndingMenu]=useState(false)
 dialogRef.current=dialog
 const SAVE_KEY='clar_lost_save_file_rpg_v2'
 const save=()=>{try{window.localStorage.setItem(SAVE_KEY,JSON.stringify({version:2,started:started||state.current.visited.length>1,state:state.current,hair,outfit}))}catch(e){console.warn('Local save unavailable',e)}}
 const update=()=>{const s=state.current;setStatus({zone:s.zone,gold:s.gold,met:s.met.length,fragments:s.fragments.length,finished:s.finished.length,haunts:s.haunts,logs:(s.logs||[]).length})}
 const note=(message)=>{const s=state.current;if(!s.notes)s.notes=[];if(!s.notes.includes(message))s.notes.push(message)}
 useEffect(()=>{try{const raw=window.localStorage.getItem(SAVE_KEY);if(raw){const data=JSON.parse(raw);if(data?.version===2&&data.state&&Number.isInteger(data.state.zone)&&data.state.zone>=0&&data.state.zone<ZONES.length&&Array.isArray(data.state.met)&&Array.isArray(data.state.finished)){state.current={...initial(),...data.state,walk:false,blackout:0};setHair(data.hair||'#3b233d');setOutfit(data.outfit||'#b479d2');setStarted(Boolean(data.started));update()}}}catch(e){console.warn('Save load failed',e)}setSaveReady(true)},[])
 useEffect(()=>{if(!saveReady)return;const id=window.setInterval(save,2000);const flush=()=>save();window.addEventListener('pagehide',flush);return()=>{window.clearInterval(id);window.removeEventListener('pagehide',flush);flush()}},[saveReady,started,hair,outfit])
 const say=(who,text,opts=null)=>{setDialog({who,text,opts})}
 const reward=(type)=>{const s=state.current,k=s.zone+':'+type;if(s.taken.includes(k))return false;s.taken.push(k);return true}
 const interact=()=>{if(dialogRef.current){setDialog(null);return}if(ending||endingMenu)return;const s=state.current,z=ZONES[s.zone],p={x:s.x,y:s.y}
 const n=CAST.filter(n=>n.zone===z.id).find(n=>distance(p,at([n.x,n.y]))<69)
 if(n){if(!s.met.includes(n.id)){s.met.push(n.id);s.gold+=2;note('I met '+n.name+' in '+z.name.split(' / ')[1]+'. '+n.line);update()}say(n.name,n.line+'  [+2 coins on first meeting]');return}
 const o=z.objects.find(o=>distance(p,at([o.x,o.y]))<67)
 if(o){const first=reward(o.type);if(first){note('I examined '+o.label.toLowerCase()+' in '+z.name.split(' / ')[1]+'. It might be connected to the missing save.');if(!s.logs.includes(s.zone)){s.logs.push(s.zone);note('Recovered log '+String(s.zone+1).padStart(2,'0')+' / 06. There may be a seventh record.')}}if(o.type==='terminal'){setEndingMenu(true);say('FINAL TERMINAL','Six save-file protocols detected. Choose how this story ends. Some protocols require more memories.');return}
 if(o.type==='key'){s.key=true;s.gold+=3;s.fragments.push('town');say('RUSTED KEY','A cold key marked 11:19. The town gate can now be opened. [+3 coins]')}
 else if(o.type==='mirror'){s.haunt=true;s.blackout=1.2;s.haunts++;say('MIRROR.exe','The reflection smiles after you turn away. A voice whispers: FIND ALL EIGHTEEN.');}
 else if(o.type==='chest'){if(first){s.gold+=8;s.fragments.push('chest');say('TREASURE CHEST','Eight coins and a torn memory fragment. Something scratches the inside of the chest.')}else say('CHEST','Nothing left but dust.')}
 else if(o.type==='fragment'){if(first){s.fragments.push('archive');say('FINAL MEMORY','The last fragment is warm to the touch. The archive begins to remember.')}else say('MEMORY','Already recovered.')}
 else if(first){s.gold+=4;s.fragments.push(z.id+':'+o.type);s.haunt=true;s.blackout=.7;s.haunts++;say('RECOVERED: '+o.label.toUpperCase(),'An object flickers between two timelines. You collect it. [+4 coins, +1 fragment]')}
 else say(o.label,'You have already searched this object.')
 update();return}
 if(distance(p,at(z.door))<74){if(s.zone===0&&!s.key){say('LOCKED GATE','The town gate needs the rusted key. Look northeast.');return}
 if(s.zone>0&&!s.taken.some(t=>t.startsWith(s.zone+':'))){say('LOCKED GATE','This door needs one recovered object from this area. Explore the room.');return}
 if(z.portal){s.unlocked.push(s.zone);s.zone++;s.x=at([2,11]).x;s.y=at([2,11]).y;s.haunt=false;s.blackout=.45;s.visited.push(s.zone);s.checkpoint={zone:s.zone,x:s.x,y:s.y};note('I reached '+ZONES[s.zone].name.split(' / ')[1]+'. My last safe location has been recorded.');update();save();say('AREA UNLOCKED',ZONES[s.zone].name+' — The save file shifts around you.');return}
 setEndingMenu(true);say('FINAL TERMINAL','You have reached the last door. Six outcomes are possible.');return}
 say('CLAR','Just an ordinary corner of a very suspicious world.')
 }
 const finish=(id)=>{const s=state.current;if(id==='true'&&(s.met.length!==18||s.fragments.length<6)){say('ACCESS DENIED','TRUE SAVE FILE requires all 18 friends and at least 6 recovered fragments.');return}
 if(id==='escape'&&s.gold<20){say('ACCESS DENIED','Emergency exit costs 20 coins.');return}
 if(id==='shadow'&&s.haunts<1){say('ACCESS DENIED','You must first encounter the watcher.');return}
 if(id==='escape')s.gold-=20
 if(!s.finished.includes(id))s.finished.push(id);note('I reached '+choices.find(e=>e.id===id)?.name+'. The archive remembers this ending.');update();setPendingEnding(null);setEndingMenu(false);setDialog(null);setEnding(id);save()}
 const restart=()=>{const finished=[...state.current.finished];state.current=initial();state.current.finished=finished;setDialog(null);setEnding(null);setPendingEnding(null);setEndingMenu(false);setJournal(false);update();setStarted(true);window.setTimeout(save,0)}
 useEffect(()=>{const down=e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','e'].includes(k))e.preventDefault();keyboard.current[k]=true;if(k==='e'||k===' ')interact()};const up=e=>{keyboard.current[e.key.toLowerCase()]=false};const blur=()=>{keyboard.current={};pressed.current={}};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)}})
 useEffect(()=>{if(!started)return;let raf;const frame=t=>{const ctx=ref.current?.getContext('2d');if(!ctx)return;const dt=Math.min((t-(clock.current||t))/1000,.04);clock.current=t;const s=state.current;s.elapsed+=dt;s.blackout=Math.max(0,s.blackout-dt*1.5)
 if(!dialogRef.current&&!ending&&!endingMenu&&!journal){const k=keyboard.current,b=pressed.current;let dx=Number(!!(k.arrowright||k.d||b.right))-Number(!!(k.arrowleft||k.a||b.left)),dy=Number(!!(k.arrowdown||k.s||b.down))-Number(!!(k.arrowup||k.w||b.up));const len=Math.hypot(dx,dy);s.walk=len>0;if(len){dx/=len;dy/=len;s.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';const speed=SPEED*dt;const free=(x,y)=>x>26&&x<(WW-1)*TILE&&y>30&&y<(HH-1)*TILE&&(s.zone!==0||![[x-9,y-9],[x+9,y-9],[x-9,y+10],[x+9,y+10]].some(([a,b])=>townSolid(a,b)))
 if(free(s.x+dx*speed,s.y))s.x+=dx*speed;if(free(s.x,s.y+dy*speed))s.y+=dy*speed}
 COINS[s.zone].forEach((c,i)=>{const key=s.zone+':'+i;if(!s.collected.includes(key)&&distance({x:s.x,y:s.y},at(c))<22){s.collected.push(key);s.gold++;update()}})
 if(s.zone>=3&&Math.sin(s.elapsed*.45)>0.96&&!s.haunt){s.haunt=true;s.blackout=.8;s.haunts++;update();say('SIGNAL INTERRUPTED','Something is following you. The air smells like old cassette tape.')}
 }else s.walk=false
 scene(ctx,s,hair,outfit);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(raf);clock.current=0}},[started,hair,outfit,ending,endingMenu,journal])
 const btn={background:'#72418e',border:'2px solid #bd85d7',color:'#fff',borderRadius:8,padding:'13px 17px',fontFamily:'inherit',cursor:'pointer',touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}
 const control=(d,symbol)=><button type="button" aria-label={'Move '+d} onContextMenu={e=>e.preventDefault()} onSelectStart={e=>e.preventDefault()} onDragStart={e=>e.preventDefault()} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);pressed.current[d]=true}} onPointerUp={()=>pressed.current[d]=false} onPointerCancel={()=>pressed.current[d]=false} onLostPointerCapture={()=>pressed.current[d]=false} style={{...btn,width:67,height:62,padding:0,fontSize:23,touchAction:'none',userSelect:'none',WebkitUserSelect:'none',WebkitTouchCallout:'none',WebkitTapHighlightColor:'transparent'}}>{symbol}</button>
 return <main style={{minHeight:'100dvh',background:'radial-gradient(circle at top,#382047,#0d0916 75%)',color:'#f0d8fb',fontFamily:'ui-monospace,Menlo,monospace',padding:'15px 12px 40px',boxSizing:'border-box',WebkitUserSelect:'none',userSelect:'none'}}>
 <div style={{maxWidth:850,margin:'auto'}}><p style={{color:'#9be8e0',letterSpacing:3,fontSize:11}}>CLAR_OS / ARCADE / FULL STORY PROTOTYPE / FOUNDATION_006</p><h1 style={{fontSize:'clamp(19px,4vw,29px)',margin:'5px 0'}}>THE LOST SAVE FILE.exe</h1><p style={{fontSize:12,color:'#d4b8df'}}>🪙 {status.gold||0} COINS　👥 {status.met||0}/18 FRIENDS　📼 {status.fragments||0} FRAGMENTS　🏁 {status.finished||0}/6 ENDINGS</p>
 {!started?<section style={{border:'2px solid #ae77d1',background:'#23132e',padding:24,marginTop:20}}><h2>CREATE_PLAYER.exe</h2><p>Six places. Eighteen familiar faces. Six ways this story could end.</p><label>HAIR　<select value={hair} onChange={e=>setHair(e.target.value)} style={btn}><option value="#3b233d">Dark</option><option value="#96533f">Auburn</option><option value="#dfbc83">Blonde</option></select></label><br/><br/><label>OUTFIT　<select value={outfit} onChange={e=>setOutfit(e.target.value)} style={btn}><option value="#b479d2">Purple</option><option value="#78c8b9">Teal</option><option value="#e4a0ba">Pink</option></select></label><p><button style={btn} onClick={()=>{setStarted(true);update();say('SAVE FILE 001','The clock stopped at 11:19. Find the rusted key, collect memories, and meet your friends. Your choices decide which of six endings you unlock.')}}>▶ START GAME</button></p></section>:<>
 <p style={{fontSize:12,color:'#b8a3c9'}}>{ZONES[status.zone||0].name}　//　{ZONES[status.zone||0].music}</p>
 <div style={{border:'3px solid #a86cc7',maxWidth:768,margin:'auto',boxShadow:'0 0 22px #7d3b9c44'}}><canvas ref={ref} width={768} height={448} style={{width:'100%',display:'block',imageRendering:'pixelated',touchAction:'none'}}/></div>
 <p style={{fontSize:12,color:'#c6a6d3'}}>Explore • Talk to friends • Collect fragments • Use INTERACT near objects and the eastern gate. Each area has a different secret.</p>
 <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,flexWrap:'wrap',marginTop:14}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,67px)',gap:4}}><span/>{control('up','▲')}<span/>{control('left','◀')}{control('down','▼')}{control('right','▶')}</div><button style={{...btn,minHeight:66}} onClick={interact}>✦ INTERACT</button><button style={{...btn,minHeight:66}} onClick={()=>setJournal(true)}>🎒 JOURNAL</button></div>
 </>}
 {journal&&<div style={{position:'fixed',inset:0,background:'#090611e8',zIndex:30,display:'grid',placeItems:'center',padding:18}}><section style={{background:'#281637',border:'2px solid #af7ccf',padding:23,width:'min(520px,100%)',maxHeight:'85vh',overflow:'auto'}}><h2>PEOPLE_I_FOUND.dat</h2><p>Friends: {state.current.met.length}/18 · Coins: {state.current.gold} · Fragments: {state.current.fragments.length}</p><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>{CAST.map(n=><div key={n.id} style={{background:'#3b264c',padding:9,fontSize:11}}>{state.current.met.includes(n.id)?n.name:'???'}</div>)}</div><p>Areas discovered: {state.current.visited.map(i=>ZONES[i].name.split('/ ')[1]).join(' · ')}</p><p>Endings found: {state.current.finished.map(i=>choices.find(e=>e.id===i)?.name).join(' · ')||'None yet'}</p><button style={btn} onClick={()=>setJournal(false)}>CLOSE</button></section></div>}
 {dialog&&<div style={{position:'fixed',inset:0,background:'#090510dd',zIndex:40,display:'grid',placeItems:'center',padding:18}}><section style={{background:'#291737',border:'2px solid #bd85d7',padding:24,maxWidth:520,width:'100%',boxSizing:'border-box'}}><h3 style={{color:'#a2e7df'}}>{dialog.who}</h3><p style={{lineHeight:1.7}}>{dialog.text}</p><button style={btn} onClick={()=>setDialog(null)}>CONTINUE ▸</button></section></div>}
 {endingMenu&&!dialog&&<div style={{position:'fixed',inset:0,background:'#090510ed',zIndex:45,display:'grid',placeItems:'center',padding:12}}><section style={{background:'#261433',border:'2px solid #bd85d7',padding:20,maxWidth:610,width:'100%',boxSizing:'border-box',maxHeight:'92vh',overflowY:'auto'}}><h2>FINAL_SAVE_PROTOCOL.exe</h2><p style={{fontSize:12}}>Choose your fate. Different decisions reveal different endings. Replay to discover all six.</p><div style={{display:'grid',gap:9}}>{choices.map(e=><button key={e.id} style={{...btn,textAlign:'left',background:'#422657'}} onClick={()=>setPendingEnding(e.id)}><strong>{e.name}</strong><div style={{fontSize:11,opacity:.8,marginTop:4}}>{e.desc}</div><div style={{fontSize:10,color:'#a9e6df',marginTop:3}}>{e.req}</div></button>)}</div><button style={{...btn,marginTop:12}} onClick={()=>setEndingMenu(false)}>RETURN TO WORLD</button></section></div>}
 {pendingEnding&&!dialog&&<div style={{position:'fixed',inset:0,background:'#08040eef',zIndex:55,display:'grid',placeItems:'center',padding:16}}><section style={{background:'#291935',border:'2px solid #e0a3e4',padding:22,maxWidth:520,width:'100%',boxSizing:'border-box'}}><p style={{color:'#9be8e0',letterSpacing:2,fontSize:12}}>CRITICAL TIMELINE DECISION</p><h2>{choices.find(e=>e.id===pendingEnding)?.name}</h2><p style={{lineHeight:1.7}}>This decision changes Clar's ending. Previously unlocked endings and discoveries remain available.</p><p style={{color:'#d7b5df',fontSize:12}}>A checkpoint will be preserved before confirming.</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button style={btn} onClick={()=>{state.current.checkpoint={zone:state.current.zone,x:state.current.x,y:state.current.y};finish(pendingEnding)}}>CONFIRM ENDING</button><button style={btn} onClick={()=>setPendingEnding(null)}>GO BACK</button></div></section></div>}
 {ending&&<div style={{position:'fixed',inset:0,background:'#06030cf2',zIndex:60,display:'grid',placeItems:'center',padding:18}}><section style={{background:'#1f132e',border:'2px solid #d39ae9',padding:30,maxWidth:580,width:'100%',textAlign:'center',boxSizing:'border-box',boxShadow:'0 0 80px #bd61c344'}}><p style={{color:'#8ee3d8',letterSpacing:3}}>SAVE FILE COMPLETE</p><h2>{choices.find(e=>e.id===ending)?.name}</h2><p style={{lineHeight:1.9,fontSize:16}}>{endingLines[ending]}</p><p style={{color:'#d1a5e1'}}>ENDING {choices.findIndex(e=>e.id===ending)+1} / 6</p><button style={btn} onClick={restart}>↻ NEW SAVE FILE</button><a href="/birthday" style={{...btn,display:'inline-block',margin:'8px',textDecoration:'none'}}>🎂 OPEN CLAR_OS</a><button style={{...btn,marginLeft:8}} onClick={()=>{setEnding(null);state.current.zone=5;state.current.x=at([14,11]).x;state.current.y=at([14,11]).y;setEndingMenu(true);update()}}>TRY ANOTHER ENDING</button></section></div>}
 </div></main>
}
