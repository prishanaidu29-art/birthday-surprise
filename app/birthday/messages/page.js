'use client'
import React,{useState,useEffect} from 'react'
import Link from 'next/link'
import {ArrowLeft,ChevronLeft,ChevronRight,Shuffle,X,Heart,MailOpen} from 'lucide-react'
import {useAuth} from '../../../hooks/useAuth'
export const dynamic='force-dynamic'
const LETTERS=[
  {
    "name": "Arsha",
    "wish": "happy birthday dear clary! I love you so much and wish you the best years with endless blessings love and success, I don’t even know where to begin of how mcuh of a true blessing you have been in my life! I love you so much and wish you so much love and happiness bb❤️💗",
    "appreciation": "",
    "photo": ""
  },
  {
    "name": "Hannah",
    "wish": "happiest birthday clarry !!! i love you so much i truly wish i could be there to celebrate with you in person . i hope you have an amazing day surrounded by the people you love, and may the following year be full of abundance for you in every shape, way, and form. i’ll always be so grateful to have met you, you are always such a delight to be around. may you continue to light up every room you walk into <3",
    "appreciation": "all the little gifts and messages she gives/sends. i suck at replying to them sometimes but im always so grateful to be reminded that people still think of me even when im not always around. plz never stop sending me tiktoks n reels ever ily clar",
    "photo": ""
  },
  {
    "name": "Cemmy",
    "wish": "JOYEUX ANNIVERSAIRE BWAINCELL (I hope this is correct I used google French ADAHSJAKAFS) I don't know about you, but I'm feeling 22! I can't believe I'm blessed to be a part of your life even until now🥹You're still the same person I knew from the day I met you.The only difference now is that you've matured into the most Independent version of yourself you can be! Look at you! You have a stable job, a cool degree and so many friends who love you more than you can ever imagine❤️\n\nWhenever I look at you,I see the same girl who I grew up with in highschool- kind, patient, hilarious and most importantly, understanding. You see things from all perspectives and taught me that I need to understand people and problems from all angels.Through you, I became more open minded and accepting toward my differences with everyone else. I pray that our friendship will never end and that it will only become stronger.I want you in the most important milestones in my life- graduation, marriage,work, retirement,death HAHAHAHA EVERYTHING. Thank you for being my ½ bwaincell since day one.I love you so much Clar💝",
    "appreciation": "Your attention to detail is WILD.What do you mean you remember everything everyone likes and make gifts that are so specific to that person? I've never ever met anyone else who does that.It makes everyone feel so seen and appreciated. None of your gifts were ever generic and that shows how much you really love your friends. None of us could ever replicate your gifts and surprises. But I bet you weren't expecting this surprise MWAHAHAHAHHA😈😈😈",
    "photo": ""
  },
  {
    "name": "Azrin",
    "wish": "Happy birthday to the most down to earth friend I’ve met in my life. I’m so glad, fate played the game of making us friends because god knew I needed a genuine one in my life. I love how you listen, even when your brain is scattered in different directions. The way you make time for things, even after putting yourself through shit for it. Believe me when I say this, the more I got to know you, the more you became a person I admire. I’m so so lucky to have been a part of your life and I hope no matter whatever distance we have that stance never runs out. I love you clarrr❤️✨ you’re the best!",
    "appreciation": "The way you make an effort, when you are already probably struggling with a zillion stuff. The way you smile, when you have a brainrot idea! Annnndd definitely how thoughtful and attentive you are to everyone. You’re so fucking brilliant and yet to humbled, that surprised me the most when I started to know you.",
    "photo": "/IMG_4034.jpeg"
  },
  {
    "name": "AK",
    "wish": "the person who stuck by my side when SHIT hit the fan (and became fuckin diarrhea atp) and made a promise of “always” that still stands now, Clar, you’ve saved my life in so many ways than just being a good friend. i’m forever grateful for you, your kindness and your magical ability to heal people’s wounds with your warm presence and comfort. it’s insane how amidst the shithole called s*yfol, i found an angel so pure in heart (but not in thoughts). happiest birthday fren! you OUT OF EVERYONE deserve all the happiness and love from the people who truly adore you. i hope we show you how loved you are, just like how you show the same to us. (sending you a 1:1 cutout of shane and ilya brb)",
    "appreciation": "i love how you always have the right thing to say in the moment. whether its a niche chronically-online reference about something even SLIGHTLY tangent to the topic that we’re discussing, or a comforting word of wisdom/reassurance when others need it most. i love how you get really giggly and excited whenever you talk about something you like, and how you talk so highly of your friends even when they’re not there.",
    "photo": "/ClarAK1.jpeg"
  },
  {
    "name": "Limini",
    "wish": "Oh!! claryyy\nOur manhwa addiction concerning fairly\nWhen u caught my eye on first day of FIS, I knew it was you that quickly\nThank you for sending voice notes many-ly\nThough I may not always listen and reply to them - sorry\nI know you are thinking of me lovely\nAdmire you for giving your all with your current ability\nAs always get your resty\nHappy 22nd our fairy :3",
    "appreciation": "Her gift-giving language and heart-touching letters - they truly bring tears to my eyes.\nWhen she makes sure no one is or feels excluded.\nWhen she sends me anything online like reels, tiktoks and voice notes - she reminds me that she loves, sees and hears me and I feel sooo warm that she thought of me at that time.",
    "photo": ""
  },
  {
    "name": "Mira",
    "wish": "Happy Birthday Clarissaa!!! You are a warm hug and the sun that comes out after the rain. I'm thankful to have met you. You’ve taught me so many things, and one of them is how to appreciate the people you love. Have a blast on your birthday, and remember that I'm here for you, always. I hope to see you soon Clar! I miss you and I love you! <3",
    "appreciation": "I love how you care for the people you love. You would spend sooo much time for the people you love. Besides that, you love animals so much! I miss Ash and Mei Mei !!! I also love the fact that im always comfortable around you. Whenever I need reassurance, I know who is the perfect person to find hehe <3. You are the best Clar!",
    "photo": ""
  },
  {
    "name": "Lak",
    "wish": "JOYEUX ANNIVERSAIRE CLAR!!\n\nAs my very first friend in Uni, you’ve seen me during all the good and the struggling times. You were there was it was fun but most importantly never stopped being there to support, provide a helping hand, a listening ear and advice when shit went down. I cannot count the amount of times I would have missed assignments, deadlines and birthdays had you not been there.\n\nThank you for always bringing that positivity to wherever you go, always being there for others and simply just being you.\n\nHave loads of fun on this special day, I SHALL BE THERE FOR DA NEXT ONE.",
    "appreciation": "The little attentions she always provides. The lil random gifts, the letters but above all that, the fact that she remembers all the little details noone else catches. She has that ability to make someone feel heard or seen in the most casual way possible.",
    "photo": ""
  }
]
export default function MessagesPage(){
 const {isAuthenticated,isLoading}=useAuth()
 const [index,setIndex]=useState(0),[opened,setOpened]=useState(false),[unfolded,setUnfolded]=useState(false)
 const [randomOrder,setRandomOrder]=useState(LETTERS.map((_,i)=>i))
 const selected=LETTERS[randomOrder[index]]
 const move=(delta)=>{setOpened(false);setUnfolded(false);setIndex(i=>(i+delta+LETTERS.length)%LETTERS.length)}
 const shuffle=()=>{setOpened(false);setUnfolded(false);setRandomOrder(o=>[...o].sort(()=>Math.random()-.5));setIndex(0)}
 useEffect(()=>{if(!opened)return;const t=setTimeout(()=>setUnfolded(true),470);return()=>clearTimeout(t)},[opened])
 useEffect(()=>{const onKey=e=>{if(e.key==='Escape'){setOpened(false);setUnfolded(false)}else if(e.key==='ArrowLeft')move(-1);else if(e.key==='ArrowRight')move(1)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[])
 if(isLoading)return <main className="loading">OPENING MAILBOX...</main>
 if(!isAuthenticated)return <main className="loading"><p>PRIVATE CORRESPONDENCE // ACCESS REQUIRED</p><Link href="/birthday">RETURN TO CLAR_OS</Link></main>
 return <main className="mail-page">
  <div className="grain"/>
  <header className="mail-head"><Link href="/birthday"><ArrowLeft size={16}/> CLAR_OS</Link><span>PRIVATE CORRESPONDENCE // 2026</span><span>♡ 22</span></header>
  <section className="mail-intro"><div className="eyebrow">INCOMING TRANSMISSIONS // 008 RECEIVED</div><h1>Letters for Clar<span>.</span></h1><p>Some things are better written down. Eight people left something for you. Pick an envelope, break the seal, and take your time.</p></section>
  <section className="mail-stage">
   <div className="mail-counter">LETTER {String(index+1).padStart(2,'0')} / {String(LETTERS.length).padStart(2,'0')}</div>
   <div className="desk">
    <div className="stack stack-back"/><div className="stack stack-middle"/>
    {!opened?<button className="envelope" onClick={()=>setOpened(true)} aria-label={`Open letter from ${selected.name}`}>
      <div className="env-body"><div className="env-top"/><div className="env-side"/><div className="env-to">TO: CLARISSA<br/><small>FROM: {selected.name.toUpperCase()}</small></div><div className="seal">♡</div><div className="env-stamp">22<br/>NOV</div></div>
      <span className="tap-hint">TAP TO BREAK THE SEAL ↗</span>
    </button>:<article className={`paper ${unfolded?'unfolded':''}`}>
      <button className="close-letter" onClick={()=>{setOpened(false);setUnfolded(false)}} aria-label="Fold letter"><X size={20}/></button>
      <div className="paper-top">A LETTER FROM {selected.name.toUpperCase()} <span>♡</span></div>
      <div className="letter-photo">{selected.photo?<img src={selected.photo} alt={`Clar and ${selected.name}`}/>:<div className="photo-wait"><Heart size={26}/><span>A PHOTO OF YOU TWO<br/>GOES HERE SOON</span></div>}<div className="tape"/></div>
      <div className="letter-body"><p className="dear">Dear Clar,</p>{selected.wish.split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}
      {selected.appreciation&&<div className="appreciation"><div className="appreciation-title">ONE MORE THING I LOVE ABOUT YOU...</div>{selected.appreciation.split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>}
      <p className="signoff">With love,<br/><strong>{selected.name} ♡</strong></p></div>
     </article>}
   </div>
   <div className="mail-controls"><button onClick={()=>move(-1)}><ChevronLeft size={18}/> PREVIOUS</button><button onClick={shuffle}><Shuffle size={16}/> SHUFFLE MAIL</button><button onClick={()=>move(1)}>NEXT <ChevronRight size={18}/></button></div>
   <div className="sender-strip">{LETTERS.map((l,i)=><button key={l.name} onClick={()=>{setIndex(randomOrder.indexOf(i));setOpened(false);setUnfolded(false)}} className={randomOrder[index]===i?'active':''}>{l.name}</button>)}</div>
  </section>
  <footer>NO TWO LETTERS ARE THE SAME. NONE OF THESE WORDS WERE GENERATED. ♡</footer>
  <style jsx global>{`
  *{box-sizing:border-box}.mail-page{min-height:100vh;background:radial-gradient(ellipse at 45% 10%,#39283e 0%,#1b1724 48%,#100e18 100%);color:#f4e5e0;font-family:Georgia,serif;padding:0 18px 60px;position:relative}.grain{position:fixed;inset:0;pointer-events:none;opacity:.12;background:repeating-linear-gradient(0deg,transparent 0px,#fff1 1px,transparent 3px);z-index:1}.mail-head{max-width:1180px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:24px 0;font:11px monospace;letter-spacing:.13em;color:#c9adbd}.mail-head a{color:inherit;text-decoration:none;display:flex;gap:9px;align-items:center}.mail-intro{text-align:center;max-width:650px;margin:35px auto 24px}.eyebrow,.mail-counter{font:11px monospace;letter-spacing:.17em;color:#d3acb7}.mail-intro h1{font-size:clamp(42px,8vw,85px);font-weight:normal;letter-spacing:-.055em;margin:13px 0}.mail-intro h1 span{color:#d18ca4}.mail-intro p{font-size:16px;line-height:1.7;color:#bcaab8}.mail-stage{max-width:900px;margin:auto;text-align:center}.mail-counter{margin:28px 0 12px}.desk{min-height:470px;display:flex;justify-content:center;align-items:center;position:relative;padding:35px 10px 55px;perspective:1200px}.stack{position:absolute;width:min(75vw,420px);height:260px;border-radius:5px;background:#b08d80;box-shadow:0 14px 40px #0008;transform:rotate(-9deg) translate(-12px,5px)}.stack-middle{background:#d0b4a0;transform:rotate(7deg) translate(13px,-3px)}.envelope{width:min(80vw,440px);height:285px;border:0;background:transparent;cursor:pointer;position:relative;transform:rotate(-2deg);transition:transform .35s;filter:drop-shadow(0 17px 20px #0007)}.envelope:hover{transform:rotate(0) translateY(-9px)}.env-body{position:absolute;inset:0;background:#e4c7a7;border:1px solid #ac8a77;border-radius:5px;overflow:hidden}.env-top{position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 62%);background:#f0d9bb;filter:drop-shadow(0 3px 2px #967b6b)}.env-side{position:absolute;inset:0;clip-path:polygon(0 100%,0 10%,50% 67%,100% 10%,100% 100%);background:#d9b898}.env-to{position:absolute;top:30px;left:30px;text-align:left;font:15px monospace;letter-spacing:.1em;color:#674a4c}.env-to small{font-size:12px}.seal{position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#c75d78,#762c47);color:#ffe5e7;display:grid;place-items:center;font-size:35px;box-shadow:0 3px 7px #5c283b88}.env-stamp{position:absolute;bottom:20px;right:25px;border:2px dotted #976c72;padding:8px;color:#8c6065;font:11px monospace}.tap-hint{position:absolute;top:calc(100% + 18px);left:0;right:0;color:#d8b3bd;font:11px monospace;letter-spacing:.15em}.paper{width:min(100%,650px);max-height:75vh;overflow:auto;position:relative;background:linear-gradient(90deg,#eadbc1,#fbf0d9 6%,#f9edda 94%,#e6d5b9);border:1px solid #e6d0aa;color:#493a3c;text-align:left;padding:clamp(22px,5vw,55px);box-shadow:0 22px 65px #0009;transform:rotateX(-75deg) scale(.8);opacity:0;transform-origin:top center;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .5s;z-index:2;border-radius:3px}.paper.unfolded{transform:rotateX(0) scale(1);opacity:1}.paper-top{font:10px monospace;letter-spacing:.15em;color:#99747c;border-bottom:1px solid #d3bca6;padding-bottom:16px;display:flex;justify-content:space-between}.close-letter{position:absolute;right:12px;top:11px;border:0;background:transparent;color:#74565d;cursor:pointer}.letter-photo{width:170px;max-width:55%;margin:24px auto 26px;background:#fff8ec;padding:8px 8px 22px;box-shadow:0 5px 16px #3e282833;transform:rotate(-3deg);position:relative}.letter-photo img{width:100%;height:170px;object-fit:cover}.photo-wait{height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#a38a87;background:#e9dfd0;font:9px monospace;letter-spacing:.06em;text-align:center}.tape{position:absolute;width:75px;height:20px;top:-9px;left:50%;transform:translateX(-50%) rotate(4deg);background:#d7bcb7aa}.letter-body{font-size:clamp(15px,2.5vw,18px);line-height:1.9;white-space:pre-wrap}.letter-body p{margin:0 0 19px}.dear{font-style:italic;font-size:22px}.appreciation{margin-top:32px;padding-top:24px;border-top:1px dashed #bfa79c}.appreciation-title{font:10px monospace;letter-spacing:.12em;color:#976b7b;margin-bottom:16px}.signoff{margin-top:35px!important;font-style:italic}.mail-controls{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin:12px auto 25px}.mail-controls button{border:1px solid #8b7085;background:#2c2434;color:#f4e5e0;border-radius:7px;padding:13px 17px;display:flex;align-items:center;gap:8px;cursor:pointer;font:11px monospace;letter-spacing:.07em}.mail-controls button:hover,.sender-strip button:hover{background:#4a334e}.sender-strip{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:24px auto 40px}.sender-strip button{border:1px solid #735b73;border-radius:30px;padding:9px 14px;background:#261e30;color:#d7c3d1;cursor:pointer;font:12px monospace}.sender-strip button.active{background:#e5c6b5;color:#33252d}.mail-page footer{text-align:center;color:#9e879b;font:10px monospace;letter-spacing:.1em}.loading{min-height:100vh;display:grid;place-items:center;background:#16101d;color:#f4e4ea;font:15px monospace}@media(max-width:600px){.mail-head span:nth-child(2){display:none}.mail-intro{margin-top:20px}.desk{min-height:410px;padding:20px 4px 45px}.envelope{height:230px}.paper{max-height:68vh}.mail-controls button{padding:11px 10px;font-size:10px}}
  `}</style>
 </main>
}
