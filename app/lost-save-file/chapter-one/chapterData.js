// Chapter One: bespoke short-story RPG slice. Original experimental build remains at /lost-save-file.
export const W=1120,H=640;
export const BUILDINGS=[
 {id:'bakery',name:'MOONCRUMB BAKERY',x:340,y:330,w:310,h:270,doorX:500,color:'#c48273',roof:'#85465e',accent:'#efc69c'},
 {id:'record',name:'SIDE B RECORDS',x:1000,y:190,w:320,h:270,doorX:1160,color:'#887099',roof:'#4e416d',accent:'#c8b1cf'},
 {id:'game',name:'PIXEL PALACE',x:1600,y:365,w:310,h:295,doorX:1755,color:'#578c88',roof:'#344e68',accent:'#a8d8cb'}
];
export const WORLD_OBJECTS=[
 {id:'clock',x:1120,y:760,r:44,label:'THE FROZEN CLOCK'},
 {id:'letter',x:665,y:850,r:22,label:'FOLDED LETTER'},
 {id:'bush',x:1660,y:940,r:40,label:'LEAFY BUSH'},
 {id:'mirror',x:310,y:1160,r:35,label:'THE CORNER MIRROR'},
 {id:'exit',x:1990,y:785,r:48,label:'TOWN EXIT'},
 {id:'fountain',x:1120,y:1030,r:66,label:'STILLWATER FOUNTAIN'},
 {id:'sign',x:850,y:680,r:28,label:'TOWN NOTICE'}
];
export const NPCS={
 jack:{name:'JACKSEPTICEYE',shop:'bakery',x:600,y:385,color:'#426a4e',hair:'#5c392b',skin:'#e5b49c',outfit:'#2e664e',expression:'energetic'},
 jay:{name:'KUBZ SCOUTS JAY',shop:'record',x:380,y:290,color:'#d2b2ff',hair:'#25232b',skin:'#c99579',outfit:'#594a70',expression:'playful'},
 sherlock:{name:'SHERLOCK',shop:'record',x:640,y:290,color:'#ffc4a3',hair:'#29252c',skin:'#e4b8a0',outfit:'#353d55',expression:'analytical'},
 will:{name:'WILL GRAHAM',shop:'game',x:375,y:295,color:'#9fe0c9',hair:'#4a342a',skin:'#e1b89e',outfit:'#617c69',expression:'uneasy'},
 house:{name:'DR HOUSE',shop:'game',x:650,y:295,color:'#f4ce90',hair:'#6d625e',skin:'#dfb69d',outfit:'#424952',expression:'skeptical'}
};
export const INTRO={
 jack:["CLAR! There you are! Right, we've got a haunted bakery, a town that loops, and a clock that refuses to move. Fantastic.","I've tried every exit. Same square, every time. But we're not giving up.","There's a letter outside. Find it, and we'll figure out this glitch together!"],
 jay:["YO, CLAR! Tell me you saw that! The record player just started talking to itself.","This place is straight out of a horror game. And you KNOW I'm checking the locked room.","Find that key, okay? I'll keep an eye on the creepy music."],
 sherlock:["Clar. You arrived at precisely the wrong moment. Or perhaps the only possible one.","Observe the clock: 11:19. Every reflection shows a different time. That isn't random.","Find the back-room key. The answer is almost certainly where someone doesn't want us looking."],
 will:["Clar? I thought I heard someone coming. I wasn't sure it was real.","Something is watching the arcade. I can almost feel where it will appear next.","Take this flashlight. Stay in the light when the screen starts to flicker."],
 house:["Great. Another person trapped in a town with terrible architecture and worse logic.","Here's the diagnosis: reality is malfunctioning. Unfortunately, the treatment isn't in my bag.","Take these headphones, this journal, and the ridiculous practice sword. Try not to make things worse."]
};
export const EXTRA={
 jack:["Keep moving, Clar. We'll find a way out.","That letter has to mean something. Nothing here happens by accident."],
 jay:["That record player is cursed, I'm telling you.","Check the bushes for the key. Horror games love hiding stuff in plain sight."],
 sherlock:["The smallest inconsistency is usually the most revealing.","Eleven nineteen. Remember it."],
 will:["The shadow doesn't move like a person.","Trust your instincts. And keep the flashlight ready."],
 house:["The journal records clues. Try reading them.","If the sword solves anything, I'll be deeply disappointed."]
};
export const RIDDLE={
 question:'I stand still while the world forgets. I show the hour that never passed. What must you carry through this door?',
 answers:['A weapon to fight the dark','A memory that cannot be erased','The hands of the frozen clock','A key to every locked room'],
 correct:1,
 hint:'THE MIRROR WHISPERS: “The clock can stop, the lights can die, and the roads can loop. But the thing that opens the way is not time or a key. It is what you choose to remember.”'
};
export const START={mapVersion:2,x:1120,y:890,facing:'down',scene:'town',letter:false,key:false,letterGiven:false,keyGiven:false,backRoom:false,mirror:false,clock:false,gear:{flashlight:false,headphones:false,journal:false,sword:false},flashOn:false,headphonesOn:false,swordOn:false,notes:[],talked:[],gateSolved:false,complete:false};
