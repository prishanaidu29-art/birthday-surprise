'use client'
import {useEffect,useRef,useState} from 'react'

const TILE=32, WORLD_W=42,WORLD_H=29, SPEED=105
const npcSeeds=[
 {name:'TRISHA',x:8,y:7,color:'#e8a0d4',line:'Riri and I saw a door move by itself. I am NOT checking it alone.'},
 {name:'RIRI',x:10,y:7,color:'#c7a0ff',line:'It was definitely there a minute ago. Want to help us investigate?'},
 {name:'NUT',x:19,y:11,color:'#78e0c9',line:'I was supposed to bring a map. I brought snacks instead.'},
 {name:'LIMIN',x:21,y:11,color:'#f1ca8c',line:'The forest changes when you stop looking at it.'}
]
const coinSeeds=[[5,5],[13,6],[15,12],[24,8],[29,14],[34,17],[8,18],[18,22],[27,23],[37,7],[31,5]]
const keySpot=[25,10],doorSpot=[32,14],fragmentSpot=[38,14],chestSpot=[12,17],mirrorSpot=[7,11]
const rect=(x,y,w,h)=>({x,y,w,h})
const houses=[rect(3,3,7,5),rect(15,3,7,5),rect(4,15,8,6),rect(25,3,7,5)]
const blocked=(x,y,opened)=>{
 if(x<1||y<1||x>WORLD_W-2||y>WORLD_H-2)return true
 if(houses.some(h=>x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h))return true
 if(x>=32&&x<=32.8&&y>=11&&y<=18&&!opened)return true
 return false
}
const isNear=(a,b,r=39)=>Math.hypot(a.x-b.x,a.y-b.y)<r
const worldPoint=([x,y])=>({x:x*TILE+16,y:y*TILE+16})
function drawSprite(ctx,x,y,hair,outfit,dir,frame,scale=1){
 const s=scale;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.imageSmoothingEnabled=false
 const px=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(a*s),Math.round(b*s),Math.round(w*s),Math.round(h*s))}
 const bob=frame?1:0
 px(-6,7+bob,5,3,'#18131e');px(2,7+bob,5,3,'#18131e')
 px(-7,-2+bob,14,10,outfit);px(-5,-11+bob,10,10,'#c99179')
 px(-7,-13+bob,14,5,hair);px(-7,-9+bob,3,9,hair);px(4,-9+bob,3,9,hair)
 if(dir==='down'){px(-3,-6+bob,2,2,'#26152c');px(2,-6+bob,2,2,'#26152c')}
 if(dir==='left')px(-5,-6+bob,2,2,'#26152c')
 if(dir==='right')px(3,-6+bob,2,2,'#26152c')
 px(-10,0+bob,3,6,'#c99179');px(7,0+bob,3,6,'#c99179')
 ctx.restore()
}
function drawWorld(ctx,player,npcs,coins,hasKey,opened,fragment,shadow,elapsed,hair,outfit,dir,walking){
 const vw=ctx.canvas.width,vh=ctx.canvas.height
 const camX=Math.max(0,Math.min(WORLD_W*TILE-vw,player.x-vw/2)),camY=Math.max(0,Math.min(WORLD_H*TILE-vh,player.y-vh/2))
 ctx.fillStyle='#151321';ctx.fillRect(0,0,vw,vh);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY))
 const x0=Math.max(0,Math.floor(camX/TILE)),x1=Math.min(WORLD_W,Math.ceil((camX+vw)/TILE)+1)
 const y0=Math.max(0,Math.floor(camY/TILE)),y1=Math.min(WORLD_H,Math.ceil((camY+vh)/TILE)+1)
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const px=x*TILE,py=y*TILE
  const path=(x>=12&&x<=14)||(y>=12&&y<=14)||(x>=31&&x<=33&&y>=9&&y<=20)
  ctx.fillStyle=path?((x+y)%2?'#5b4c64':'#62536c'):((x+y)%3?'#303f3d':'#354943')
  if(x>32)ctx.fillStyle=(x+y)%2?'#30243e':'#362943'
  ctx.fillRect(px,py,TILE,TILE)
  if(!path&&x<=32&&((x*17+y*13)%9===0)){ctx.fillStyle='#73937b';ctx.fillRect(px+7,py+9,3,6);ctx.fillRect(px+17,py+20,4,3)}
  if((x*19+y*11)%41===0&&x<32){ctx.fillStyle='#d3b4e1';ctx.fillRect(px+14,py+12,4,4)}
 }
 houses.forEach((h,i)=>{let x=h.x*TILE,y=h.y*TILE,w=h.w*TILE,ht=h.h*TILE
  ctx.fillStyle='#191321';ctx.fillRect(x+5,y+8,w,ht)
  ctx.fillStyle=i%2?'#73518b':'#89678c';ctx.fillRect(x,y+20,w,ht-20)
  ctx.fillStyle=i%2?'#392447':'#50324e';ctx.fillRect(x-9,y+12,w+18,24)
  ctx.fillStyle='#ae85bd';ctx.fillRect(x-9,y+12,w+18,5)
  ctx.fillStyle='#171326';ctx.fillRect(x+w/2-12,y+ht-38,24,38)
  ctx.fillStyle='#e5bd8b';ctx.fillRect(x+20,y+65,24,23);ctx.fillRect(x+w-44,y+65,24,23)
  ctx.fillStyle='#4b3358';ctx.fillRect(x+23,y+68,18,17);ctx.fillRect(x+w-41,y+68,18,17)
 })
 for(let y=2;y<WORLD_H-1;y++){if(y%3===0){const x=1*TILE;ctx.fillStyle='#1c312f';ctx.fillRect(x,y*TILE,27,27);ctx.fillStyle='#587c66';ctx.fillRect(x-8,y*TILE-13,44,22)}}
 const obj=(p,emoji)=>{ctx.font='24px monospace';ctx.textAlign='center';ctx.fillText(emoji,p.x,p.y+8)}
 coinSeeds.forEach((c,i)=>{if(!coins.includes(i)){const p=worldPoint(c);ctx.fillStyle='#f8c95b';ctx.fillRect(p.x-5,p.y-7,10,14);ctx.fillStyle='#fff0a2';ctx.fillRect(p.x-2,p.y-5,3,10)}})
 if(!hasKey)obj(worldPoint(keySpot),'🗝️')
 obj(worldPoint(chestSpot),'📦');obj(worldPoint(mirrorSpot),'🪞')
 const d=worldPoint(doorSpot);ctx.fillStyle=opened?'#74d7bb':'#bd88d6';ctx.fillRect(d.x-9,d.y-15,18,30);ctx.fillStyle='#201526';ctx.fillRect(d.x-5,d.y-11,10,22)
 if(!fragment)obj(worldPoint(fragmentSpot),'💎')
 if(shadow){const sx=35*TILE+16+Math.sin(elapsed*1.6)*35,sy=14*TILE+16+Math.cos(elapsed)*27;ctx.fillStyle='#11091d';ctx.beginPath();ctx.ellipse(sx,sy,17,25,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ef7fb2';ctx.fillRect(sx-9,sy-5,5,4);ctx.fillRect(sx+4,sy-5,5,4)}
 npcs.forEach(n=>{drawSprite(ctx,n.x,n.y,'#312036',n.color,n.dir,Math.floor(elapsed*3)%2);ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#ffffff';ctx.fillText(n.name,n.x,n.y-23)})
 drawSprite(ctx,player.x,player.y,hair,outfit,dir,walking?Math.floor(elapsed*8)%2:0,1.25)
 ctx.restore()
 if(shadow){ctx.fillStyle='rgba(178,38,102,'+(0.05+0.03*Math.sin(elapsed*7))+')';ctx.fillRect(0,0,vw,vh)}
}
export default function LostSaveFile(){
 const canvas=useRef(null),game=useRef(null),keys=useRef({}),buttons=useRef({}),last=useRef(0)
 const [started,setStarted]=useState(false),[hair,setHair]=useState('#34243b'),[outfit,setOutfit]=useState('#b774d3'),[stats,setStats]=useState({gold:0,friends:0,key:false,fragment:false}),[dialog,setDialog]=useState(null)
 const state=useRef({player:{x:2*TILE+16,y:13*TILE+16},npcs:npcSeeds.map(n=>({...n,x:n.x*TILE+16,y:n.y*TILE+16,dir:'down',vx:0,vy:0,until:0})),coins:[],gold:0,key:false,opened:false,fragment:false,chest:false,shadow:false,encounter:false,met:[],dir:'down',walking:false,elapsed:0,invulnerable:0})
 const sync=()=>{const s=state.current;setStats({gold:s.gold,friends:s.met.length,key:s.key,fragment:s.fragment})}
 const show=(who,text)=>setDialog({who,text})
 const interact=()=>{if(!started)return;if(dialog){setDialog(null);return}const s=state.current,p=s.player
  const n=s.npcs.find(n=>isNear(p,n,53));if(n){if(!s.met.includes(n.name))s.met.push(n.name);sync();show(n.name,n.line);return}
  if(!s.key&&isNear(p,worldPoint(keySpot),54)){s.key=true;sync();show('ITEM FOUND','Rusted key acquired! Find the locked archive gate to the east.');return}
  if(isNear(p,worldPoint(doorSpot),57)){if(s.key){s.opened=true;show('ARCHIVE UNLOCKED','The gate creaks open. Something stirs beyond it.')}else show('LOCKED','You need a rusted key. Look near the eastern houses.');return}
  if(isNear(p,worldPoint(chestSpot),55)){if(!s.chest){s.chest=true;s.gold+=3;sync();show('TREASURE','Three coins found!')}else show('EMPTY CHEST','You already collected the treasure.');return}
  if(isNear(p,worldPoint(mirrorSpot),55)){show('MIRROR.exe','Your reflection moves a moment too late. For one second, it wears an outfit you never chose.');return}
  show('CLAR','Nothing here... maybe explore further.')
 }
 useEffect(()=>{const down=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.current[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'||e.key===' ')interact()};const up=e=>{keys.current[e.key.toLowerCase()]=false};window.addEventListener('keydown',down);window.addEventListener('keyup',up);const blur=()=>{keys.current={};buttons.current={}};window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)}})
 useEffect(()=>{if(!started)return;let id;const tick=t=>{const ctx=canvas.current?.getContext('2d');if(!ctx)return;const dt=Math.min((t-(last.current||t))/1000,.045);last.current=t;const s=state.current;s.elapsed+=dt
 if(!dialog){const k=keys.current,b=buttons.current;let dx=Number(!!(k.arrowright||k.d||b.right))-Number(!!(k.arrowleft||k.a||b.left)),dy=Number(!!(k.arrowdown||k.s||b.down))-Number(!!(k.arrowup||k.w||b.up));let len=Math.hypot(dx,dy);s.walking=len>0;if(len){dx/=len;dy/=len;s.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';const speed=SPEED*dt;const tryX=s.player.x+dx*speed,tryY=s.player.y+dy*speed;const free=(x,y)=>![[x-9,y-6],[x+9,y-6],[x-9,y+8],[x+9,y+8]].some(([a,b])=>blocked(a/TILE,b/TILE,s.opened));if(free(tryX,s.player.y))s.player.x=tryX;if(free(s.player.x,tryY))s.player.y=tryY}
  coinSeeds.forEach((c,i)=>{if(!s.coins.includes(i)&&isNear(s.player,worldPoint(c),20)){s.coins.push(i);s.gold++;sync()}})
  if(s.opened&&s.player.x>33*TILE&&!s.encounter&&!s.fragment){s.encounter=true;s.shadow=true;show('SIGNAL LOST','The archive lights flicker. Something is watching. Find the memory crystal to the east.')}
  if(s.shadow&&isNear(s.player,{x:35*TILE+16+Math.sin(s.elapsed*1.6)*35,y:14*TILE+16+Math.cos(s.elapsed)*27},27)&&s.invulnerable<=0){s.player={x:31*TILE+16,y:14*TILE+16};s.invulnerable=4;show('SAVE FILE ERROR','YOU WERE NOT SUPPOSED TO SEE THAT. Restored to checkpoint. Coins and items retained.')}
  if(s.opened&&!s.fragment&&isNear(s.player,worldPoint(fragmentSpot),23)){s.fragment=true;s.shadow=false;sync();show('MEMORY RESTORED','You recovered the lost memory! Prototype chapter complete. The world remembers you.')}
  s.invulnerable=Math.max(0,s.invulnerable-dt)
  s.npcs.forEach(n=>{n.until-=dt;if(n.until<=0){const dirs=[[0,0],[1,0],[-1,0],[0,1],[0,-1]];const v=dirs[Math.floor(Math.random()*dirs.length)];n.vx=v[0];n.vy=v[1];n.until=1+Math.random()*2.5}const nx=n.x+n.vx*dt*16,ny=n.y+n.vy*dt*16;if(!blocked(nx/TILE,ny/TILE,false)&&Math.hypot(nx-npcSeeds.find(q=>q.name===n.name).x*TILE-16,ny-npcSeeds.find(q=>q.name===n.name).y*TILE-16)<65){n.x=nx;n.y=ny}n.dir=n.vx>0?'right':n.vx<0?'left':n.vy<0?'up':'down'})
 }else s.walking=false
 drawWorld(ctx,s.player,s.npcs,s.coins,s.key,s.opened,s.fragment,s.shadow,s.elapsed,hair,outfit,s.dir,s.walking);id=requestAnimationFrame(tick)};id=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(id);last.current=0}},[started,dialog,hair,outfit])
 const control=(dir,label)=> <button aria-label={dir} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);buttons.current[dir]=true}} onPointerUp={()=>buttons.current[dir]=false} onPointerCancel={()=>buttons.current[dir]=false} onLostPointerCapture={()=>buttons.current[dir]=false} style={{background:'#694084',border:'2px solid #b985d7',borderRadius:8,color:'white',fontSize:23,width:58,height:54,touchAction:'none',userSelect:'none'}}>{label}</button>
 const actionStyle={background:'#744391',color:'#fff',border:'2px solid #c38ee0',borderRadius:8,padding:'14px 16px',fontFamily:'inherit',fontSize:13}
 return <main style={{minHeight:'100dvh',background:'radial-gradient(circle at top,#341d47,#100b1c 70%)',color:'#f4dcff',fontFamily:'ui-monospace,Menlo,monospace',padding:'20px 12px 40px',boxSizing:'border-box'}}>
 <div style={{maxWidth:880,margin:'auto'}}><p style={{color:'#91e1d8',fontSize:11,letterSpacing:3}}>CLAR_OS / ARCADE / BUILD_002</p><h1 style={{fontSize:'clamp(20px,4vw,30px)',margin:'5px 0'}}>THE LOST SAVE FILE.exe</h1><p style={{color:'#cbb1d8',fontSize:12}}>🪙 {stats.gold} COINS　🗝️ {stats.key?'KEY FOUND':'NO KEY'}　👥 {stats.friends}/4 FRIENDS　💎 {stats.fragment?'RESTORED':'MISSING'}</p>
 {!started?<section style={{border:'2px solid #b37ed4',background:'#241331',padding:25,marginTop:25}}><h2>CREATE_PLAYER.exe</h2><p>Hi Clar. Choose your look before entering the forgotten town.</p><label>HAIR　<select value={hair} onChange={e=>setHair(e.target.value)} style={actionStyle}><option value="#34243b">Dark</option><option value="#9d533e">Auburn</option><option value="#e5c18c">Blonde</option></select></label><br/><br/><label>OUTFIT　<select value={outfit} onChange={e=>setOutfit(e.target.value)} style={actionStyle}><option value="#b774d3">Purple</option><option value="#7bd0c1">Teal</option><option value="#e9a4b8">Pink</option></select></label><p><button style={actionStyle} onClick={()=>setStarted(true)}>▶ ENTER THE LOST SAVE FILE</button></p></section>:<>
 <div style={{border:'3px solid #a26cc5',boxShadow:'0 0 25px #8e43a122',marginTop:17,maxWidth:768,marginInline:'auto'}}><canvas ref={canvas} width={768} height={448} style={{width:'100%',height:'auto',display:'block',imageRendering:'pixelated',background:'#282134'}}/></div>
 <p style={{fontSize:12,color:'#bca4ca'}}>Hold arrows to walk smoothly. Explore the town, meet friends, find the rusted key and unlock the archive. Keyboard: WASD / arrows + E.</p>
 <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap',gap:15,marginTop:14}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,58px)',gap:4}}><span/>{control('up','▲')}<span/>{control('left','◀')}{control('down','▼')}{control('right','▶')}</div><button style={{...actionStyle,minHeight:65}} onClick={interact}>✦ INTERACT</button><button style={{...actionStyle,minHeight:65}} onClick={()=>{const s=state.current;show('INVENTORY',`Coins: ${s.gold} | Key: ${s.key?'YES':'NO'} | Memory: ${s.fragment?'YES':'NO'} | Friends: ${s.met.join(', ')||'none'}`)}}>🎒 INVENTORY</button></div>
 </>}
 {dialog&&<div style={{position:'fixed',inset:0,background:'#090510d9',zIndex:100,display:'grid',placeItems:'center',padding:18}}><section style={{background:'#291637',border:'2px solid #b985da',maxWidth:490,width:'100%',boxSizing:'border-box',padding:24,boxShadow:'0 0 40px #713d9444'}}><h3 style={{color:'#a0e9df'}}>{dialog.who}</h3><p style={{lineHeight:1.7}}>{dialog.text}</p><button style={actionStyle} onClick={()=>setDialog(null)}>CONTINUE ▸</button></section></div>}
 </div></main>
}
