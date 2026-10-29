'use client';
import {useEffect,useRef,useState,useCallback} from 'react';
import Link from 'next/link';
import {W,H,BUILDINGS,WORLD_OBJECTS,NPCS,INTRO,EXTRA,RIDDLE,START} from './chapterData';
import './chapter.css';
import {cameraFor,drawTown,drawClar,canWalk} from './townRender';

const SAVE='clar_lost_save_ch1_story_v1';
const clone=()=>({...START,gear:{...START.gear},notes:[],talked:[]});
const dist=(x,y,a,b)=>Math.hypot(x-a,y-b);
function fill(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
function box(c,x,y,w,h,color,edge='#44334c'){c.fillStyle=edge;c.fillRect(x-3,y-3,w+6,h+6);fill(c,x,y,w,h,color)}
function text(c,s,x,y,size=15,color='#fff0d7'){c.textAlign='center';c.font='bold '+size+'px monospace';c.fillStyle='#23172e';c.fillText(s,x+2,y+2);c.fillStyle=color;c.fillText(s,x,y)}
function light(c,x,y){const g=c.createRadialGradient(x,y,5,x,y,110);g.addColorStop(0,'#ffe7a588');g.addColorStop(1,'#ffe7a500');fill(c,x-110,y-110,220,220,g);box(c,x-4,y-36,8,51,'#52445c');box(c,x-12,y-49,24,22,'#ffe0a0')}
function bush(c,x,y){box(c,x-34,y-7,68,28,'#3d725b','#325549');box(c,x-24,y-22,43,25,'#679e79','#426e60');box(c,x+4,y-26,30,30,'#83b68b','#426e60');for(let i=0;i<5;i++)fill(c,x-19+i*9,y-19-i%2*6,4,4,'#f2c7dc')}
function person(c,x,y,hair='#a47a57',skin='#c78c76',shirt='#6d8c9d',glasses=false,t=0,kind=''){
 c.save();c.translate(x,y+Math.sin(t/390+x)*1.3);c.scale(1.16,1.16);
 c.fillStyle='#21152e55';c.beginPath();c.ellipse(0,24,22,7,0,0,Math.PI*2);c.fill();
 // Layered shoes, trousers, sleeves and garment highlights.
 box(c,-13,7,11,17,'#393446');box(c,3,7,11,17,'#393446');
 box(c,-15,21,14,6,'#252435');box(c,2,21,14,6,'#252435');
 box(c,-19,-17,38,28,shirt);box(c,-22,-13,7,22,shirt);box(c,15,-13,7,22,shirt);
 box(c,-22,7,7,6,skin);box(c,15,7,7,6,skin);
 box(c,-15,-14,3,21,'#ffffff20');box(c,-18,9,36,4,'#241c3555');
 box(c,-18,-48,36,36,skin);box(c,-19,-46,38,12,hair);
 for(let i=0;i<5;i++){const dx=-15+i*7;fill(c,dx,-47-(i%2)*4,8,10,hair)}
 fill(c,-18,-37,7,20,hair);fill(c,12,-37,7,17,hair);
 fill(c,-9,-27,4,3,'#32243c');fill(c,5,-27,4,3,'#32243c');
 fill(c,-1,-22,3,3,'#ae735e');fill(c,-3,-17,8,2,'#a46870');
 if(glasses){c.strokeStyle='#cdbf9c';c.lineWidth=2;for(const gx of [-9,9]){c.beginPath();c.arc(gx,-26,8,0,Math.PI*2);c.stroke()}box(c,-2,-27,4,2,'#cdbf9c')}
 if(kind==='jack'){fill(c,-16,-17,32,6,'#614232');fill(c,-14,-20,28,5,'#583a30');fill(c,-10,-45,20,4,'#5b352a');fill(c,-14,-7,28,5,'#23583d');fill(c,-3,-12,6,12,'#a4caa2')}
 if(kind==='jay'){fill(c,-19,-49,38,7,'#22212d');fill(c,-19,-43,9,14,'#22212d');fill(c,12,-43,7,12,'#22212d');fill(c,-14,-9,28,5,'#302c40');fill(c,-7,-33,4,3,'#3c2a31');fill(c,5,-33,4,3,'#3c2a31')}
 if(kind==='sherlock'){fill(c,-24,-21,9,30,'#272b3b');fill(c,15,-21,9,30,'#272b3b');fill(c,-16,-19,32,36,'#343b4e');fill(c,-5,-20,10,22,'#7c8190');for(let i=0;i<6;i++)O(c,-17+i*7,-49-(i%2)*5,7,6,'#29262e');fill(c,0,-9,3,3,'#c4b3a8')}
 if(kind==='will'){fill(c,-15,-13,30,4,'#b0b4a0');for(let i=0;i<3;i++)fill(c,-13+i*11,-16,2,24,'#d4c5a0');fill(c,-17,-47,13,7,'#4b392e');fill(c,5,-49,13,8,'#4b392e');fill(c,-4,-11,8,7,'#d5bb9c')}
 // Character-specific high-detail pixel accents: expressions, layered hair and signature silhouettes.
 if(kind==='jack'){for(const [xx,yy] of [[-16,-49],[-8,-53],[1,-51],[10,-50]]){fill(c,xx,yy,8,5,'#8b593d');fill(c,xx+2,yy-2,4,3,'#b7834c')}fill(c,-11,-18,22,4,'#422d2b');fill(c,-9,-14,18,3,'#71483c');fill(c,-10,-25,4,3,'#f1e3c7');fill(c,6,-25,4,3,'#f1e3c7');fill(c,-7,-5,14,4,'#f5d6a3')}
 if(kind==='jay'){fill(c,-18,-52,36,5,'#151923');fill(c,-18,-48,6,9,'#34303e');fill(c,10,-48,8,9,'#34303e');fill(c,-10,-28,5,3,'#171d2c');fill(c,6,-28,5,3,'#171d2c');fill(c,-5,-16,10,3,'#8d4d55');fill(c,-17,-8,34,3,'#7d668e');fill(c,-13,-3,26,3,'#3e354e')}
 if(kind==='sherlock'){for(const [xx,yy] of [[-19,-53],[-9,-58],[3,-56],[12,-53]]){fill(c,xx,yy,12,7,'#24222d');fill(c,xx+3,yy-2,6,4,'#484252')}fill(c,-10,-30,7,2,'#2c2535');fill(c,5,-31,7,2,'#2c2535');fill(c,-3,-14,8,3,'#906e70');fill(c,-5,-17,10,3,'#a1a0a9');fill(c,-19,-10,6,24,'#222936');fill(c,14,-10,6,24,'#222936')}
 if(kind==='will'){for(const [xx,yy] of [[-17,-50],[-8,-55],[3,-53],[12,-50]]){fill(c,xx,yy,11,6,'#4d352b');fill(c,xx+3,yy-2,5,3,'#755744')}fill(c,-10,-29,7,2,'#5a3b38');fill(c,5,-28,7,2,'#5a3b38');fill(c,-4,-16,9,2,'#94676a');fill(c,-12,-18,24,3,'#6b554c55');fill(c,-11,-7,22,3,'#a8b19b')}
 if(kind==='house'){fill(c,-16,-49,32,6,'#71655e');for(let i=0;i<4;i++)fill(c,-14+i*8,-51-(i%2)*3,9,5,'#96847b');fill(c,-12,-30,9,2,'#594b4a');fill(c,4,-29,9,2,'#594b4a');for(let i=0;i<7;i++)fill(c,-12+i*4,-17+(i%2)*2,2,3,'#75584e');fill(c,-6,-13,12,2,'#835d60');fill(c,-17,-7,34,4,'#404a57')}
 if(kind==='house'){fill(c,-21,-19,9,35,'#333b47');fill(c,12,-19,9,35,'#333b47');fill(c,-12,-18,24,30,'#606776');fill(c,-3,-17,6,23,'#a4a2a0');fill(c,-12,-23,24,5,'#77645d');fill(c,17,-13,3,42,'#b58e61');fill(c,15,25,8,3,'#b58e61');fill(c,-12,-21,24,4,'#665c5a')}
 c.restore()
}

function shop(c,p,t){
 const s=p.scene, bakery=s==='bakery',record=s==='record',game=s==='game';
 const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#41354e');bg.addColorStop(.63,'#766477');bg.addColorStop(.64,'#b9a2a0');bg.addColorStop(1,'#786477');fill(c,0,0,W,H,bg);
 // Floor planks and patterned wallpaper.
 for(let y=405;y<H;y+=31){fill(c,0,y,W,2,'#e6c6b32a');for(let x=(y%62)*11;x<W;x+=108)fill(c,x,y,2,31,'#2d233329')}
 for(let x=55;x<W-40;x+=120){fill(c,x,55,2,330,'#eed6ce17')}
 box(c,34,28,W-68,364,'#65506b','#d3b3c6');
 const sign=bakery?'MOONCRUMB  /  BAKERY':record?'SIDE B  /  RECORDS':'PIXEL PALACE  /  GAMES';
 box(c,325,30,470,51,'#332a45','#bfa1bb');text(c,sign,560,65,23,'#ffe4c9');
 if(bakery){
   // Glass patisserie counter with three actual shelves and individual desserts.
   box(c,60,230,520,248,'#ad7880','#ead2be');fill(c,69,240,502,196,'#9dc7c755');
   for(let y of [298,365,430]){fill(c,72,y,494,7,'#f7e2d0');fill(c,72,y+7,494,3,'#6b5367')}
   for(let i=0;i<7;i++){let x=105+i*66;
     // Cakes, cupcakes, macarons and fruit tarts, with readable silhouettes.
     if(i%3===0){box(c,x-20,263,40,30,'#f6c8bf','#f6e1cb');fill(c,x-17,256,34,11,'#fff0e5');fill(c,x-3,249,7,9,'#d76d7f')}
     else if(i%3===1){fill(c,x-17,275,34,15,'#b9795f');fill(c,x-12,260,24,18,'#f4c4ce');text(c,'♥',x,271,12)}
     else{for(let j=0;j<3;j++){fill(c,x-20+j*14,270,13,14,['#d6a0b5','#e7c48e','#a5bda8'][j]);fill(c,x-20+j*14,267,13,3,'#fff0dc')}}
     fill(c,x-22,337,44,16,'#d59d6f');fill(c,x-19,333,38,6,'#f6d7aa');fill(c,x-20,402,40,15,'#c8845b');fill(c,x-13,393,26,11,'#fff1d9');
   }
   for(let x of [115,285,455])fill(c,x,240,3,195,'#fff7ed66');
   box(c,630,132,426,323,'#755666','#e3bdac');
   for(let y of [216,315,410]){fill(c,650,y,390,12,'#d9ae87');for(let i=0;i<6;i++){let x=680+i*65;fill(c,x-24,y-31,49,28,'#bd7b4e');fill(c,x-19,y-38,39,12,'#e4af74');fill(c,x-18,y-35,36,3,'#ffe4ad')}}
   box(c,660,90,362,34,'#694656','#f2c5b8');text(c,'BREADS  •  PASTRIES  •  CAKES',841,114,17);
   text(c,'FRESH FROM THE OVEN',820,486,16,'#ffdfbc');
 }else if(record){
   for(let i=0;i<5;i++){let x=70+i*164;box(c,x,130,147,286,'#5c465f','#b899ad');
     for(let j=0;j<3;j++){let y=165+j*78;box(c,x+13,y,118,65,['#d2a1b1','#9fb7b8','#d9b997'][j]);for(let k=0;k<3;k++){let xx=x+34+k*38;c.strokeStyle='#44374e';c.lineWidth=4;c.beginPath();c.arc(xx,y+30,16,0,Math.PI*2);c.stroke();fill(c,xx-4,y+26,8,8,'#ffe7c3')}}}
   box(c,906,132,150,307,'#4d4057','#c6a5bf');box(c,922,154,117,75,'#87a6ad');text(c,'♫',980,203,37);text(c,'LISTEN',980,264,17);text(c,'STATION',980,290,17);
   box(c,83,447,820,58,'#765367','#e5b4c7');text(c,'NEW ARRIVALS     •     VINYL     •     CASSETTES',493,482,18);
 }else{
   for(let i=0;i<6;i++){let x=65+i*165;box(c,x,133,140,307,'#34384f','#b39bc9');box(c,x+14,150,111,111,'#456d80');fill(c,x+22,159,94,87,['#6a9f9c','#8773a4','#c68f99'][i%3]);text(c,['1UP','PIXEL','BOSS','PLAY','CO-OP','HIGH'][i],x+70,210,18,'#ffe9b9');box(c,x+19,282,100,66,'#51405e');fill(c,x+44,308,16,9,'#e5b0bf');fill(c,x+72,306,11,11,'#a7d6c7');box(c,x+24,368,92,10,'#7a6389')}
   box(c,60,451,450,53,'#46374f','#c7a5d1');text(c,'TOP SCORE  CLAR  01119',285,484,18,'#b8f2df');
   box(c,575,451,480,53,'#46374f','#c7a5d1');text(c,'RETRO CONSOLES  •  ARCADE',815,484,17);
 }
 // Lived-in shop details: distinctive merchandise, light fixtures and movement.
 if(bakery){
  for(let i=0;i<7;i++){const x=105+i*66;fill(c,x-16,271,32,20,['#d990a0','#c68d57','#e5b887'][i%3]);fill(c,x-18,266,36,7,'#f7d6c7');for(let j=0;j<3;j++)fill(c,x-11+j*10,262-(j%2)*3,5,5,['#d26e7b','#f2d2a0','#a2c3a2'][j])}
  for(let i=0;i<6;i++){const x=678+i*65;fill(c,x-19,185,38,18,'#ba7b4e');fill(c,x-14,180,28,8,'#f0c590');}
  for(const x of [180,480,835]){fill(c,x-2,85,4,33,'#58435a');fill(c,x-17,116,34,9,'#c4959b');fill(c,x-11,125,22,6,'#ffe2b4')}
  text(c,'HANDMADE CAKES',320,215,13,'#ffe4da');
 }else if(record){
  for(let i=0;i<5;i++){const x=70+i*164;for(let j=0;j<3;j++){const y=165+j*78;for(let k=0;k<3;k++){const xx=x+34+k*38;fill(c,xx-10,y+18,20,23,['#aa7395','#85aaa7','#d7ac88'][(i+j+k)%3]);fill(c,xx-7,y+21,14,12,'#e8d1bd');fill(c,xx-2,y+24,4,4,'#51425b')}}}
  fill(c,929,347,110,8,'#d7b19a');fill(c,947,311,67,33,'#3d3349');c.save();c.translate(980,327);c.rotate(t/2400);c.strokeStyle='#f1d1d9';c.lineWidth=3;c.beginPath();c.arc(0,0,13,0,Math.PI*2);c.stroke();c.restore();
 }else if(game){
  for(let i=0;i<6;i++){const x=88+i*165;fill(c,x,162,92,81,'#242b42');for(let j=0;j<7;j++){const xx=x+8+j*11;fill(c,xx,213-(j%3)*13,9,9,['#f1bf9a','#b7d9c3','#d5a4cf'][(i+j)%3])}fill(c,x+34+Math.sin(t/430+i)*13,177,14,13,'#f4d6aa')}
  text(c,'INSERT COIN  /  PRESS START',560,112,15,'#bdebdc');
 }
 if(record){box(c,952,270,125,185,'#3c2b50','#d4b3cf');text(c,'BACK ROOM',1014,316,15);text(c,p.keyGiven?'OPEN':'LOCKED',1014,392,16,p.keyGiven?'#b8e5ce':'#eab4c4')}
 if(record&&p.backRoom){box(c,225,85,670,262,'#332640','#dfb2d2');text(c,'BACK ROOM / CORRUPTED MESSAGE',560,125,22);text(c,'WHEN THE CLOCK STOPS,',560,202,21,'#ffe0bd');text(c,'FOLLOW THE REFLECTION.',560,242,21,'#ffe0bd')}
 else{const ids=bakery?['jack']:record?['jay','sherlock']:['will','house'];for(const id of ids){const n=NPCS[id];person(c,n.x,n.y,n.hair,n.skin,n.outfit,id==='house',t,id);box(c,n.x-80,n.y-100,160,28,'#292139dd','#d7b2d2');text(c,n.name,n.x,n.y-80,13,'#fff0df')}}
 drawClar(c,p,t);box(c,470,543,183,70,'#705679','#e3bcd2');text(c,'← LEAVE SHOP',562,582,18);
 const g=c.createRadialGradient(560,270,180,560,320,700);g.addColorStop(0,'#0000');g.addColorStop(1,'#170e2666');fill(c,0,0,W,H,g)
}
function Icon({id}){return <svg viewBox="0 0 80 80" width="64" height="64" aria-label={id}>{id==='letter'?<><rect x="11" y="22" width="58" height="39" rx="3" fill="#f8e6c9" stroke="#a68185" strokeWidth="3"/><path d="M12 24L40 46 68 24" fill="none" stroke="#a68185" strokeWidth="3"/><rect x="36" y="43" width="11" height="9" fill="#c27893"/></>:id==='key'?<><circle cx="25" cy="27" r="13" fill="none" stroke="#efd28e" strokeWidth="9"/><path d="M35 37L66 66 72 59 63 51 66 45 58 40 54 47 42 34" fill="#efd28e"/></>:id==='flashlight'?<><path d="M20 40L42 26 56 37 41 52 35 69 22 65Z" fill="#c5d9dc" stroke="#6c7d8d" strokeWidth="4"/><path d="M42 24L60 14 73 31 56 43Z" fill="#f1d997"/><circle cx="64" cy="27" r="7" fill="#fff9bc"/></>:id==='headphones'?<><path d="M17 48V35C17 5 63 5 63 35V48" fill="none" stroke="#e5b4d9" strokeWidth="10"/><rect x="10" y="40" width="18" height="28" rx="6" fill="#9277b6"/><rect x="52" y="40" width="18" height="28" rx="6" fill="#9277b6"/></>:id==='journal'?<><rect x="16" y="10" width="51" height="60" rx="5" fill="#9176ad" stroke="#e6c9e7" strokeWidth="4"/><rect x="24" y="12" width="6" height="56" fill="#524075"/><path d="M37 30H56M37 40H56M37 50H51" stroke="#fff0dd" strokeWidth="3"/></>:<><path d="M56 8L68 9 64 21 38 53 30 44Z" fill="#d7e5e5" stroke="#839ba4" strokeWidth="3"/><path d="M22 39L43 60" stroke="#d2a7cc" strokeWidth="8"/><path d="M28 52L14 66" stroke="#9c7966" strokeWidth="9"/></>}</svg>}
function ClarPortrait(){const el=useRef(null);useEffect(()=>{const c=el.current.getContext('2d');c.clearRect(0,0,168,220);drawClar(c,{x:84,y:203,facing:'down'},0,2.25)},[]);return <canvas className="ch1-clar-portrait" width="168" height="220" ref={el} aria-label="Clar: wavy brown hair, round gold glasses, dark outfit and patterned bag"/>}
function Portrait({id,line='',index=0}){
 const n=NPCS[id];if(id==='CLAR')return <ClarPortrait/>;if(!n)return <div className="ch1-symbol">✦</div>;
 const worried=/shadow|watch|scared|creep|flicker|dark|wrong|trapped|hallucinat/i.test(line);
 const excited=/CLAR|find|great|fantastic|way out|real|answer|finally/i.test(line) && !['house','will'].includes(id);
 const mood=id==='house'?'skeptical':id==='will'?(worried?'uneasy':'pensive'):worried?'uneasy':excited?'animated':id==='sherlock'?'focused':id==='jay'?'playful':'bright';
 const face={jack:'#e8b49a',jay:'#c99579',sherlock:'#e3b8a4',will:'#e3b9a0',house:'#dfb59e'}[id]||n.skin;
 const hair={jack:'#53362d',jay:'#24222a',sherlock:'#2b2730',will:'#513c31',house:'#72665e'}[id]||n.hair;
 const specs={
 jack:{hair:'#3d282b',skin:'#e6ac8d',coat:'#192d2a',accent:'#49b38b',style:'spiky',beard:true},
 jay:{hair:'#171720',skin:'#c88b6b',coat:'#211d2c',accent:'#e65b76',style:'cap',beard:false},
 sherlock:{hair:'#191923',skin:'#e3b8a9',coat:'#171e2e',accent:'#8993a9',style:'curly',beard:false},
 will:{hair:'#44332c',skin:'#dfb69d',coat:'#4a5744',accent:'#9eaa85',style:'messy',beard:true},
 house:{hair:'#5b504c',skin:'#d7a992',coat:'#353d4a',accent:'#ac9c8d',style:'short',beard:true}
 };
 const a=specs[id];const eye=mood==='uneasy'?'M 75 110 Q 85 105 95 111 M 126 110 Q 136 105 146 111':mood==='skeptical'?'M 75 111 L 96 107 M 126 109 L 147 112':'M 75 108 Q 85 105 96 109 M 126 109 Q 137 105 147 108';
 const hairShapes={
 spiky:'M 57 96 Q 37 72 45 51 L 30 52 L 52 33 L 44 20 L 72 30 L 80 12 L 100 27 L 124 12 L 136 33 L 161 27 L 152 49 L 170 62 L 155 82 L 157 103 Q 147 79 130 72 Q 108 84 83 68 Q 67 79 57 96',
 cap:'M 54 90 Q 47 54 78 39 Q 121 24 155 48 L 161 75 Q 137 67 114 74 L 66 81 Z',
 curly:'M 53 100 Q 34 87 45 69 Q 32 52 53 42 Q 49 23 71 26 Q 81 7 103 22 Q 124 5 137 28 Q 160 22 163 44 Q 183 53 165 74 Q 171 91 157 106 L 148 82 Q 132 86 124 68 Q 100 92 84 70 Q 63 83 53 100',
 messy:'M 56 92 Q 38 75 48 57 L 39 45 L 64 41 L 66 23 L 91 31 L 103 16 L 124 32 L 147 27 L 153 46 L 167 54 L 154 82 L 151 100 Q 136 73 117 79 Q 89 71 74 82 Z',
 short:'M 55 91 Q 43 67 59 48 L 51 37 L 74 39 L 85 26 L 102 35 L 122 25 L 137 38 L 157 42 L 154 91 Q 142 72 123 73 L 81 77 Z'
 };
 const mouth=mood==='animated'||mood==='bright'||mood==='playful'?'M 97 153 Q 111 171 126 153 Q 111 163 97 153':mood==='uneasy'?'M 105 156 Q 113 149 120 156':'M 100 157 Q 113 160 125 155';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${a.accent}"/><stop offset="1" stop-color="#181527"/></linearGradient><linearGradient id="face"><stop stop-color="#f9d9b8"/><stop offset=".45" stop-color="${a.skin}"/><stop offset="1" stop-color="#9a706b"/></linearGradient><linearGradient id="coat"><stop stop-color="${a.accent}"/><stop offset=".25" stop-color="${a.coat}"/><stop offset="1" stop-color="#11121d"/></linearGradient></defs><rect width="220" height="260" fill="url(#bg)"/><circle cx="110" cy="105" r="93" fill="none" stroke="#f3d9d1" opacity=".22"/><path d="M 8 260 Q 15 189 77 188 L 145 188 Q 207 194 215 260" fill="url(#coat)" stroke="#171422" stroke-width="5"/><path d="M 88 189 L 111 221 L 134 188 L 124 178 L 98 178 Z" fill="#e6c5b5"/><path d="M 61 106 Q 39 42 95 38 Q 168 24 162 108 L 160 158 Q 145 187 109 189 Q 70 184 60 154 Z" fill="${a.hair}" stroke="#29202a" stroke-width="5"/><path d="M 67 97 Q 70 64 110 61 Q 151 64 155 99 L 152 147 Q 144 180 112 181 Q 78 179 68 146 Z" fill="url(#face)" stroke="#946d6b" stroke-width="2"/><path d="${hairShapes[a.style]}" fill="${a.hair}" stroke="#241d27" stroke-width="4" stroke-linejoin="round"/><path d="M 72 77 Q 92 50 114 63 M 116 59 Q 141 48 154 77" fill="none" stroke="#ffffff" opacity=".15" stroke-width="5"/><path d="${eye}" fill="none" stroke="#3a2832" stroke-width="4" stroke-linecap="round"/><ellipse cx="85" cy="119" rx="6" ry="9" fill="#29303d"/><ellipse cx="137" cy="119" rx="6" ry="9" fill="#29303d"/><circle cx="87" cy="116" r="2" fill="#fff8ec"/><circle cx="139" cy="116" r="2" fill="#fff8ec"/><path d="M 110 122 L 106 141 Q 112 144 117 140" fill="none" stroke="#a66e69" stroke-width="2"/><path d="${mouth}" fill="none" stroke="#78464c" stroke-width="3" stroke-linecap="round"/>${a.beard?'<path d="M 77 146 Q 88 183 112 181 Q 139 181 148 146 Q 139 169 112 174 Q 89 170 77 146" fill="#514039" opacity=".45"/>':''}${id==='house'?'<path d="M 72 128 L 94 130 M 126 130 L 148 128 M 76 145 L 94 149 M 129 149 L 147 145" stroke="#866c67" stroke-width="2" opacity=".55"/><path d="M 176 182 L 163 252" stroke="#c5a783" stroke-width="7"/>':''}${id==='sherlock'?'<path d="M 87 190 L 115 244 L 138 189" fill="#6f7686" stroke="#323a4b" stroke-width="4"/>':''}${id==='jay'?'<path d="M 46 61 Q 112 13 175 54 L 180 70 Q 108 58 50 80 Z" fill="#18171d" stroke="#292331" stroke-width="4"/><path d="M 157 70 L 188 75 Q 171 85 152 81" fill="#16151e"/><path d="M 38 184 Q 30 121 48 96" fill="none" stroke="#d54d64" stroke-width="9"/><path d="M 177 184 Q 192 124 170 97" fill="none" stroke="#d54d64" stroke-width="9"/>':''}${id==='jack'?'<path d="M 82 200 L 113 227 L 143 200" fill="none" stroke="#50b78b" stroke-width="8"/>':''}<path d="M 11 14 L 45 14 M 11 14 L 11 48 M 209 14 L 175 14 M 209 14 L 209 48" stroke="#f5d7e5" stroke-width="2" opacity=".5"/></svg>`;
 return <div className="ch1-illustrated-portrait"><img src={'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)} alt={n.name+' 2D illustrated anime portrait, '+mood+' expression'}/><div className="ch1-illustrated-name">{n.name}</div></div>;
}
const labels={letter:'FOLDED LETTER',key:'BRASS KEY',flashlight:'FLASHLIGHT',headphones:'HEADPHONES',journal:'JOURNAL',sword:'PRACTICE SWORD'};
export default function ChapterOne(){
 const [p,setP]=useState(clone),ref=useRef(p),[loaded,setLoaded]=useState(false),[dialog,setDialog]=useState(null),dialogRef=useRef(null),[typed,setTyped]=useState(0),[panel,setPanel]=useState(null),panelRef=useRef(null),[toast,setToast]=useState(''),[music,setMusic]=useState(false),[glitch,setGlitch]=useState(false),glitchRef=useRef(false),[count,setCount]=useState(10);
 const canvas=useRef(null),held=useRef(new Set()),audio=useRef(null);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(SAVE)||'null');if(v&&v.gear&&Number.isFinite(v.x)){const q={...clone(),...v,gear:{...START.gear,...v.gear},notes:Array.isArray(v.notes)?v.notes:[],talked:Array.isArray(v.talked)?v.talked:[]};if(v.mapVersion!==2){q.mapVersion=2;if(q.scene==='town'){q.x=1120;q.y=890}}if(q.scene!=='town'&&(q.x<45||q.x>W-45||q.y<110||q.y>H-85)){q.x=558;q.y=500}if(!canWalk(q,q.x,q.y)){q.x=q.scene==='town'?1120:558;q.y=q.scene==='town'?890:500}setP(q);ref.current=q}}catch{}setLoaded(true)},[]);
 useEffect(()=>{ref.current=p;if(loaded)try{localStorage.setItem(SAVE,JSON.stringify(p))}catch{}},[p,loaded]);
 useEffect(()=>{dialogRef.current=dialog},[dialog]);useEffect(()=>{panelRef.current=panel;if(panel)held.current.clear()},[panel]);
 const patch=useCallback(fn=>setP(q=>{const v=typeof fn==='function'?fn(q):{...q,...fn};ref.current=v;return v}),[]);
 const note=useCallback(s=>patch(q=>({...q,notes:q.notes.includes(s)?q.notes:[...q.notes,s]})),[patch]);
 const beep=useCallback((freq=520,dur=.15,type='sine',vol=.04)=>{try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!audio.current)audio.current=new A();const a=audio.current;a.resume();const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch{}},[]);
 useEffect(()=>{if(!music||glitch)return;const seq=[261,329,392,329,293,349,440,349,261,329,392,523,440,392,329,293];let i=0;const t=setInterval(()=>beep(seq[i++%seq.length],.3,'sine',.012),345);return()=>clearInterval(t)},[music,glitch,beep]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3400);return()=>clearTimeout(t)},[toast]);
 const say=useCallback((who,lines,done)=>{setPanel(null);setDialog({who,lines:Array.isArray(lines)?lines:[lines],index:0,done})},[]);
 useEffect(()=>{if(!dialog)return;setTyped(0);const line=dialog.lines[dialog.index];const t=setInterval(()=>setTyped(n=>Math.min(n+2,line.length)),23);return()=>clearInterval(t)},[dialog]);
 const next=()=>{const d=dialogRef.current;if(!d)return;const line=d.lines[d.index];if(typed<line.length){setTyped(line.length);return}if(d.index<d.lines.length-1){setDialog({...d,index:d.index+1});return}setDialog(null);d.done?.()};
 const talk=useCallback(id=>{const v=ref.current;if(!v.talked.includes(id)){patch(q=>({...q,talked:[...q.talked,id]}));say(id,INTRO[id],()=>{if(id==='will'&&!ref.current.gear.flashlight){patch(q=>({...q,gear:{...q.gear,flashlight:true}}));note('Will gave me a working flashlight.');setToast('NEW ITEM · FLASHLIGHT')}if(id==='house'&&!ref.current.gear.journal){patch(q=>({...q,gear:{...q.gear,headphones:true,journal:true,sword:true}}));note('House gave me headphones, a journal and a wooden practice sword.');setToast('NEW ITEMS · HEADPHONES · JOURNAL · SWORD')}});return}
 if(id==='jack'&&v.letter&&!v.letterGiven){say(id,['You found my letter! Thank you, Clar. I thought the town had swallowed it.','It says: “When the clocks stop, the people who remember you will still find you.”','I think that might matter more than we realise.'],()=>{patch(q=>({...q,letterGiven:true}));note('Returned Jack’s letter. The message is about remembering people.');beep(740,.3)});return}
 if((id==='jay'||id==='sherlock')&&v.key&&!v.keyGiven){say(id,['That is our key! You actually found it!','We saw a strange mirror at the southwest corner of town. It appeared after the clock froze.','Look into it before you try to leave. It might know what the gate wants.'],()=>{patch(q=>({...q,keyGiven:true}));note('Returned the back-room key. Jay and Sherlock pointed me toward a mirror in the southwest.');beep(740,.3)});return}
 say(id,EXTRA[id][v.letterGiven||v.keyGiven?0:1]);},[patch,say,note,beep]);
 const interact=useCallback(id=>{if(dialogRef.current||panelRef.current||glitchRef.current)return;const v=ref.current;
 if(NPCS[id]){const n=NPCS[id];if(dist(v.x,v.y,n.x,n.y)>165){setToast('Walk closer to your friend.');return}talk(id);return}const target=WORLD_OBJECTS.find(o=>o.id===id);if(v.scene==='town'&&target&&dist(v.x,v.y,target.x,target.y)>150){setToast('Walk closer to investigate.');return}if(BUILDINGS.some(b=>b.id===id)){const b=BUILDINGS.find(b=>b.id===id);if(v.scene==='town'&&dist(v.x,v.y,b.doorX,b.y+b.h+25)>155){setToast('Walk up to the shop entrance first.');return}patch(q=>({...q,scene:id,backRoom:false,x:558,y:500}));beep();return}
 if(id==='leave'){patch(q=>({...q,scene:'town',backRoom:false,x:BUILDINGS.find(b=>b.id===v.scene)?.doorX||1120,y:(BUILDINGS.find(b=>b.id===v.scene)?.y||190)+(BUILDINGS.find(b=>b.id===v.scene)?.h||270)+42}));return}
 if(id==='back'){if(!v.keyGiven){say('LOCKED DOOR','A brass keyhole. Maybe Jay and Sherlock know where the key went.');return}patch(q=>({...q,backRoom:true,x:558,y:490}));note('In the record shop back room: “When the clock stops, follow the reflection.”');return}
 if(id==='clock'){patch(q=>({...q,clock:true}));note('The clock is frozen at exactly 11:19.');setPanel('clock');beep(410,.25);return}
 if(id==='letter'){if(v.letter)return;patch(q=>({...q,letter:true}));note('Found Jack’s folded envelope by the western path.');setToast('FOUND · FOLDED LETTER');beep(680,.25);return}
 if(id==='bush'){if(v.key){setToast('Nothing else hidden in this bush.');return}patch(q=>({...q,key:true}));note('Found the brass key hidden inside a bush east of the square.');say('CLAR',['Something glints beneath the leaves...','A little brass key! It was completely hidden in the bush.']);beep(750,.25);return}
 if(id==='mirror'){patch(q=>({...q,mirror:true}));note('The mirror says memories—not clocks, weapons or keys—open the exit.');setPanel('mirror');beep(390,.3,'triangle');return}
 if(id==='exit'){if(!v.clock){say('TOWN EXIT','The door says: “Look closely at the clock before leaving.”');return}if(!v.mirror){say('TOWN EXIT','The door says: “The mirror in the southwest remembers the answer.”');return}setPanel('riddle');return}
 if(id==='fountain')say('CLAR',['The fountain has run dry. Nineteen tiny hearts are scratched into the stone.']);
 if(id==='sign')say('TOWN NOTICE',['WELCOME TO STILLWATER. POPULATION: ERROR.','PLEASE DO NOT ASK THE CLOCK WHAT TIME IT IS.']);
 },[patch,talk,say,note,beep]);
 const clickCanvas=e=>{if(panelRef.current||dialogRef.current||glitchRef.current)return;const r=canvas.current.getBoundingClientRect(),v=ref.current,cam=cameraFor(v),x=(e.clientX-r.left)*W/r.width+cam.x,y=(e.clientY-r.top)*H/r.height+cam.y;if(v.scene==='town'){for(const b of BUILDINGS)if(x>b.x&&x<b.x+b.w&&y>b.y-15&&y<b.y+b.h+30){interact(b.id);return}for(const o of WORLD_OBJECTS)if(dist(x,y,o.x,o.y)<o.r+13||(['clock','mirror','exit','sign','fountain'].includes(o.id)&&Math.abs(x-o.x)<o.r&&y>o.y-145&&y<o.y+15)){interact(o.id);return}}else{if(y>530&&x>460&&x<665){interact('leave');return}if(v.scene==='record'&&x>940&&y>265&&y<475){interact('back');return}if(!v.backRoom)for(const [id,n] of Object.entries(NPCS))if(n.shop===v.scene&&dist(x,y,n.x,n.y)<75){interact(id);return}}};
 const near=useCallback(()=>{const v=ref.current;if(v.scene==='town'){const o=[...WORLD_OBJECTS.map(a=>({id:a.id,d:dist(v.x,v.y,a.x,a.y)})),...BUILDINGS.map(b=>({id:b.id,d:dist(v.x,v.y,b.doorX,b.y+b.h+16)}))].sort((a,b)=>a.d-b.d);if(o[0]?.d<110)interact(o[0].id);else setToast('Move closer to a landmark, then interact.');return}if(v.y>480){interact('leave');return}if(v.scene==='record'&&v.x>910){interact('back');return}const o=Object.entries(NPCS).filter(([,n])=>n.shop===v.scene).map(([id,n])=>({id,d:dist(v.x,v.y,n.x,n.y)})).sort((a,b)=>a.d-b.d);if(o[0]?.d<140)interact(o[0].id);else setToast('Walk closer to a friend, then interact.')},[interact]);
 useEffect(()=>{const clear=()=>held.current.clear();const down=e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e',' '].includes(k))e.preventDefault();if(k==='e'||k===' '){if(!dialogRef.current&&!panelRef.current)near()}else held.current.add(k)},up=e=>{held.current.delete(e.key.toLowerCase());patch(q=>({...q,x:ref.current.x,y:ref.current.y}))};window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[near,patch]);
 useEffect(()=>{let frame,last=0,steps=0;const loop=t=>{frame=requestAnimationFrame(loop);if(t-last<30)return;last=t;const c=canvas.current?.getContext('2d');if(!c)return;const v=ref.current;if(!panelRef.current&&!dialogRef.current&&!glitchRef.current){let dx=0,dy=0;const k=held.current;if(k.has('arrowup')||k.has('w'))dy--;if(k.has('arrowdown')||k.has('s'))dy++;if(k.has('arrowleft')||k.has('a'))dx--;if(k.has('arrowright')||k.has('d'))dx++;if(v.scene!=='town'&&(v.x<45||v.x>W-45||v.y<110||v.y>H-85)){v.x=558;v.y=500;patch(q=>({...q,x:558,y:500}))}if(dx||dy){const m=6.5/Math.hypot(dx,dy),x=v.x+dx*m,y=v.y+dy*m;v.facing=dx?(dx<0?'left':'right'):(dy<0?'up':'down');if(canWalk(v,x,v.y))v.x=x;if(canWalk(v,v.x,y))v.y=y;v.lastMoved=t;if(++steps%5===0)patch(q=>({...q,x:v.x,y:v.y,facing:v.facing,lastMoved:t}))}}c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.save();if(v.scene==='town'){const cam=cameraFor(v);c.translate(-cam.x,-cam.y);drawTown(c,v,t,glitchRef.current)}else{shop(c,v,t)};if(v.flashOn&&!glitchRef.current){const g=c.createRadialGradient(v.x,v.y,3,v.x,v.y,200);g.addColorStop(0,'#ffe5a766');g.addColorStop(1,'#ffe5a700');fill(c,v.x-200,v.y-200,400,400,g)}c.restore();if(v.headphonesOn&&!glitchRef.current)text(c,'♫ HIDDEN SIGNAL: 11:19 / REMEMBER',560,20,15,'#c5f7dc')};frame=requestAnimationFrame(loop);return()=>cancelAnimationFrame(frame)},[patch]);
 const glitchNow=()=>{glitchRef.current=true;setGlitch(true);setPanel(null);setCount(4);patch(q=>({...q,scene:'town',x:1885,y:835,gateSolved:true}));note('The gate opened. All the lights died. Everyone vanished. The Watcher warned me.');for(let i=0;i<7;i++)setTimeout(()=>beep(80+i*38,.42,i%2?'sawtooth':'square',.06),i*180);let n=4;const id=setInterval(()=>{n--;setCount(n);if(n<=0){clearInterval(id);glitchRef.current=false;setGlitch(false);patch(q=>({...q,complete:true}));setPanel('clear');beep(740,.4)}},1000)};
 const answer=i=>{if(i===RIDDLE.correct)glitchNow();else{beep(150,.2,'square');setToast('WRONG ANSWER · Remember the mirror’s hint.')}};
 const useItem=id=>{if(id==='journal'){setPanel('journal');return}if(id==='flashlight')patch(q=>({...q,flashOn:!q.flashOn}));if(id==='headphones')patch(q=>({...q,headphonesOn:!q.headphonesOn}));if(id==='sword')patch(q=>({...q,swordOn:!q.swordOn}));beep()};
 const items=[...(p.letter&&!p.letterGiven?['letter']:[]),...(p.key&&!p.keyGiven?['key']:[]),...Object.keys(p.gear).filter(k=>p.gear[k])];
 const objective=p.complete?'Chapter 1 completed.':!p.clock?'Inspect the frozen clock at the town square.':!p.keyGiven?'Explore the shops, find the letter and hidden key.':!p.mirror?'Find the mysterious mirror in the southwest corner.':'Use the mirror’s hint to solve the exit riddle.';
 const restart=()=>{if(!window.confirm('Restart Chapter 1 and overwrite this chapter save?'))return;patch(clone());setPanel(null);setDialog(null)};
 return <main className={"ch1-root "+(glitch?"ch1-corrupted":"")}><header className="ch1-header"><div><small>CLAR_OS / THE LOST SAVE FILE</small><h1>01 · THE GLITCHED TOWN</h1></div><div className="ch1-headright"><span>CHAPTER ONE · AUTOSAVED</span><button className="ch1-button" onClick={()=>{setMusic(x=>!x);beep()}}>{music?'♫ MUSIC ON':'♪ PLAY MUSIC'}</button></div></header>
 <div className="ch1-stage"><canvas ref={canvas} width={W} height={H} onClick={clickCanvas} aria-label="Interactive town, shops and characters. Tap to interact."/><div className="ch1-scene-name">{p.scene==='town'?'STILLWATER / THE TOWN THAT FORGOT':BUILDINGS.find(b=>b.id===p.scene)?.name}</div>{glitch&&<div className="ch1-glitch"><div className="ch1-watcher" aria-hidden="true"><div className="ch1-watcher-head"/><div className="ch1-watcher-body"/></div><strong data-text="WATCH OUT, CLAR_">WATCH OUT, CLAR_</strong><span>RECOVERING IN {count}s</span></div>}</div>
 <div className="ch1-bottom"><div className="ch1-objective"><b>OBJECTIVE:</b> {objective}<small>WASD / arrow keys / touch to move · Tap shops, people and objects · E to interact</small></div><div className="ch1-controls"><div className="ch1-dpad"><span/><button className="ch1-button" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);held.current.add('arrowup')}} onPointerUp={()=>held.current.delete('arrowup')} onPointerCancel={()=>held.current.delete('arrowup')} onLostPointerCapture={()=>held.current.delete('arrowup')}>▲</button><span/>{[['◀','arrowleft'],['▼','arrowdown'],['▶','arrowright']].map(([s,k])=><button key={k} className="ch1-button" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);held.current.add(k)}} onPointerUp={()=>held.current.delete(k)} onPointerCancel={()=>held.current.delete(k)} onLostPointerCapture={()=>held.current.delete(k)}>{s}</button>)}</div><button className="ch1-button" onClick={near}>✦ INTERACT</button><button className="ch1-button" onClick={()=>setPanel('inventory')}>▣ INVENTORY {items.length}</button><button className="ch1-button" onClick={()=>setPanel('journal')}>▤ JOURNAL</button></div></div>
 <p className="ch1-tip">Explore the streets and garden. The camera follows Clar. Tap landmarks to investigate; friends can help when you are stuck.</p>
 {dialog&&<div className="ch1-overlay"><section className="ch1-modal"><small>✦ TRANSMISSION · {dialog.index+1}/{dialog.lines.length}</small><div className="ch1-dialog"><Portrait id={dialog.who} line={dialog.lines[dialog.index]} index={dialog.index}/><div><h2>{NPCS[dialog.who]?.name||dialog.who}</h2><p>{dialog.lines[dialog.index].slice(0,typed)}{typed<dialog.lines[dialog.index].length&&<span className="ch1-cursor">▌</span>}</p></div></div><div className="ch1-actions"><button className="ch1-button" onClick={next}>{typed<dialog.lines[dialog.index].length?'SHOW FULL LINE ▸':dialog.index<dialog.lines.length-1?'CONTINUE ▸':'FINISH CONVERSATION ✓'}</button></div></section></div>}
 {panel&&<div className="ch1-overlay"><section className="ch1-modal"><small>CLAR_OS / {panel.toUpperCase()}</small>
 {panel==='clock'&&<><h2>THE FROZEN CLOCK</h2><div className="ch1-clock">{Array.from({length:12},(_,i)=><span key={i} style={{transform:'rotate('+(i*30)+'deg) translateY(-114px) rotate('+(-i*30)+'deg)'}}>{i||12}</span>)}<i className="hour"/><i className="minute"/><i className="second"/><i className="pin"/></div><h3 style={{textAlign:'center'}}>11:19</h3><p>Its second hand tries to move, then slips back. The town has been holding its breath at this exact minute.</p></>}
 {panel==='mirror'&&<><h2>THE MIRROR THAT REMEMBERS</h2><div className="ch1-mirror">◈</div><p>{RIDDLE.hint}</p><p>Clar's reflection moves a second before she does.</p></>}
 {panel==='riddle'&&<><h2>THE EXIT / FOUR ANSWERS</h2><p>{RIDDLE.question}</p><div className="ch1-answers">{RIDDLE.answers.map((a,i)=><button className="ch1-button" key={i} onClick={()=>answer(i)}>{['A','B','C','D'][i]}. {a}</button>)}</div><small>The mirror in the southwest knows the answer.</small></>}
 {panel==='inventory'&&<><div className="ch1-profile"><ClarPortrait/><div><small>STILLWATER / PLAYER 01</small><h2>CLAR'S INVENTORY</h2><p>Somewhere familiar. Something forgotten.</p></div></div>{items.length?<div className="ch1-items">{items.map(id=><button key={id} className={'ch1-item '+((id==='flashlight'&&p.flashOn)||(id==='headphones'&&p.headphonesOn)||(id==='sword'&&p.swordOn)?'active':'')} onClick={()=>useItem(id)}><Icon id={id}/><b>{labels[id]}</b><small>{id==='journal'?'OPEN NOTES':id==='flashlight'?(p.flashOn?'ON':'TAP TO SWITCH ON'):id==='headphones'?(p.headphonesOn?'EQUIPPED':'TAP TO EQUIP'):id==='sword'?(p.swordOn?'EQUIPPED':'TAP TO EQUIP'):'QUEST ITEM'}</small></button>)}</div>:<p>Empty. Talk to Will and House at the game store to collect useful gear.</p>}<p>Flashlight, headphones, journal and sword are interactive. The sword is equippable, but Chapter 1 has no combat.</p></>}
 {panel==='journal'&&<><h2>CLAR'S JOURNAL</h2><p>{objective}</p>{(p.notes.length?p.notes:['The town seems familiar. I should investigate the shops.']).map((s,i)=><div className="ch1-note" key={i}>{String(i+1).padStart(2,'0')} / {s}</div>)}</>}
 {panel==='clear'&&<><h2>CHAPTER 1 COMPLETE ♡</h2><div className="ch1-ending">✦ 11:19 ✦</div><p>The lights come back. The streets are normal. Your friends have returned.</p><p>But the Watcher's warning remains: <b>“Watch out, Clar. The next place remembers things differently.”</b></p><p>The gate did not lead home. It led to Platform Zero, where somebody has been trying to deliver a message to you.</p><div className="ch1-actions"><Link href="/lost-save-file/chapter-two" className="ch1-button">BOARD THE TRAIN — CHAPTER 2 ➜</Link></div></>}
 <div className="ch1-actions"><button className="ch1-button" onClick={()=>setPanel(null)}>✕ CLOSE</button></div></section></div>}
 {toast&&<div className="ch1-toast" role="status">{toast}</div>}
 <footer className="ch1-footer"><span>CHAPTER 1 OF 3 · THE LOST SAVE FILE · AUTOSAVED</span><button onClick={restart}>Restart chapter</button><Link href="/lost-save-file">Original prototype ↗</Link></footer>
 </main>
}
