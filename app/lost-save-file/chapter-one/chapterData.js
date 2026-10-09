// Chapter One: bespoke short-story RPG slice. Original experimental build remains at /lost-save-file.
export const W=1120,H=640;
export const BUILDINGS=[
 {id:'bakery',name:'MOONCRUMB BAKERY',x:105,y:65,w:245,h:176,doorX:224,color:'#d88d88',roof:'#9e536d',accent:'#ffe4b5'},
 {id:'record',name:'SIDE B RECORDS',x:420,y:55,w:258,h:186,doorX:552,color:'#9677b8',roof:'#614b89',accent:'#f2d3ec'},
 {id:'game',name:'PIXEL PALACE',x:750,y:70,w:255,h:172,doorX:873,color:'#76aeb3',roof:'#3e738a',accent:'#c5f7ec'}
];
export const WORLD_OBJECTS=[
 {id:'clock',x:558,y:324,r:43,label:'THE FROZEN CLOCK'},
 {id:'letter',x:166,y:452,r:25,label:'FOLDED LETTER'},
 {id:'bush',x:804,y:475,r:37,label:'A SUSPICIOUS BUSH'},
 {id:'mirror',x:80,y:552,r:38,label:'THE CORNER MIRROR'},
 {id:'exit',x:1066,y:367,r:42,label:'TOWN EXIT'},
 {id:'fountain',x:555,y:477,r:48,label:'DRY FOUNTAIN'},
 {id:'sign',x:363,y:340,r:26,label:'TOWN NOTICE'}
];
export const NPCS={
 naidu:{name:'NAIDU',shop:'bakery',x:270,y:270,color:'#f4ad90',hair:'#372e42',skin:'#b97963',outfit:'#9b698b',expression:'worried'},
 riri:{name:'RIRI',shop:'record',x:380,y:290,color:'#d2b2ff',hair:'#402b43',skin:'#c48e7d',outfit:'#d98ba8',expression:'uneasy'},
 trisha:{name:'TRISHA',shop:'record',x:640,y:290,color:'#ffc4a3',hair:'#5b3247',skin:'#c98975',outfit:'#9f88d8',expression:'animated'},
 aaron:{name:'AARON',shop:'game',x:375,y:295,color:'#9fe0c9',hair:'#25293f',skin:'#d2a18a',outfit:'#7298c9',expression:'nervous'},
 lakshay:{name:'LAKSHAY',shop:'game',x:650,y:295,color:'#f4ce90',hair:'#393147',skin:'#bd8266',outfit:'#a59a66',expression:'curious'}
};
export const INTRO={
 naidu:[
  "Clar?! CLAR! Okay, good, it's actually you. Please tell me you know where we are.",
  "I've walked past this bakery five times trying to leave town. Every road loops back here. Even the bread keeps coming out of the oven cold.",
  "I dropped a folded letter somewhere outside. I can't remember where, and every time I try to think about it, the streetlights flicker.",
  "Could you find it for me? I'd rather not go back out there alone."
 ],
 riri:[
  "CLAR! Oh my god. Trisha, I told you she was real! I recognised those glasses immediately.",
  "We've been stuck in this record shop while the same song plays backwards. The front door is fine, but the back-room key has vanished.",
  "And the clock in the square? It's been stuck at 11:19 the whole time. I swear the hands moved when I looked away.",
  "Find our key if you can. I think the shop's back room has something we need to see."
 ],
 trisha:[
  "CLAR! Finally, another normal person. Well. Relatively normal. This town is doing my head in.",
  "Riri and I tried resetting the record player. It started playing a conversation we haven't had yet. Explain THAT.",
  "That clock outside is frozen at 11:19. It looks ordinary until you stare at it for too long.",
  "Help us find the back-room key, yeah? I want to know what's behind that locked door. Riri thinks it's a terrible idea."
 ],
 aaron:[
  "Clar! Thank goodness. Lakshay and I were starting to think the arcade was making people up.",
  "There's a figure at the edge of town. Tall, dark, flickering like a bad TV signal. Whenever I point it out, it disappears.",
  "Could be a hallucination. Could be the whole town hallucinating. Either way, the lights are unreliable.",
  "Take this flashlight. Click it in your inventory to switch it on. You might need it if the town goes dark."
 ],
 lakshay:[
  "CLAR? Okay, you're real. Great. We have exactly zero answers and several very bad theories.",
  "Aaron saw that shadow too. It doesn't walk so much as skip between frames. I'm not going near it without a soundtrack.",
  "Here: headphones, a journal and a little wooden practice sword. They're yours. Use the inventory to equip things.",
  "The headphones let you hear the town's hidden signal. The journal keeps your clues. And the sword? Hopefully decorative."
 ]
};
export const EXTRA={
 naidu:['The road out of town bends back on itself. I watched my own footprints come toward me.','Please find the letter. It should be folded like an actual envelope, not a scrap of rubbish.'],
 riri:['Look for the key outside. Trisha keeps insisting it is somewhere obvious.','Once you have the key, the back room is all yours.'],
 trisha:['The clock is the weirdest thing here. And I say that as someone who has heard a record player speak.','Maybe check the bushes? Something shiny caught my eye near the road.'],
 aaron:['I have a bad feeling about that figure. Keep the flashlight ready.','The flashlight has its own switch. You can use it anywhere.'],
 lakshay:['Equip the headphones if you want to hear the hidden frequency.','The journal saves clues automatically. I made sure it has actual pages.']
};
export const RIDDLE={
 question:'I stand still while the world forgets. I show the hour that never passed. What must you carry through this door?',
 answers:['A weapon to fight the dark','A memory that cannot be erased','The hands of the frozen clock','A key to every locked room'],
 correct:1,
 hint:'THE MIRROR WHISPERS: “The clock can stop, the lights can die, and the roads can loop. But the thing that opens the way is not time or a key. It is what you choose to remember.”'
};
export const START={x:558,y:548,scene:'town',letter:false,key:false,letterGiven:false,keyGiven:false,backRoom:false,mirror:false,clock:false,gear:{flashlight:false,headphones:false,journal:false,sword:false},flashOn:false,headphonesOn:false,swordOn:false,notes:[],talked:[],gateSolved:false,complete:false};
