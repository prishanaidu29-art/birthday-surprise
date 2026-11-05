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
 jack:["CLAR! Oh, thank God. Right, before you panic: yes, the bakery's haunted, the road loops, and that bloody clock is taking the piss.","I ran through the exit three times. Three! Came back here every single time. Fantastic game design. Ten out of ten, absolutely cursed.","But hey, we're not leaving anyone behind. There's an envelope on the west path. Grab it and we'll figure this mess out together."],
 jay:["YO, CLAR! Nah, nah, tell me you heard that record scratch by itself. Bro, I almost launched myself over the counter.","This is some horror-game bullshit. You already know the second I see a locked back room, I'm checking it.","I saw something shiny in the bushes outside. You find it, I'll stand here and pretend I'm not scared. Deal?"],
 sherlock:["Clar. You're late. Not chronologically; the clock is incapable of that. I mean you missed the interesting part.","Eleven nineteen. Every reflection disagrees with it, yet the mechanism makes a sound. An apparent contradiction. Finally, something useful.","A key has been hidden, very deliberately. Find it. And do try not to mistake coincidence for evidence."],
 will:["Clar? Sorry. I heard footsteps, but they kept stopping when I stopped breathing.","Something's moving between the arcade cabinets. It doesn't want to be seen. I can tell from where it chooses to stand.","Here. Take my flashlight. Please. I'd rather you see it before it sees you."],
 house:["Oh good. Another volunteer for the world's least competent escape room. And nobody even bothered to provide snacks.","Diagnosis: reality's broken. Differential includes mass hallucination, terrible writing, and an idiot with a clock obsession.","Take the headphones, journal and wooden sword. One detects noise, one records evidence, and one is medically useless. Guess which one's your favourite."]
};
export const EXTRA={
 jack:["You're doing great, Clar. Seriously. We can be scared and still get the hell out of here.","That envelope's important. I can feel it. Or maybe that's the haunted croissants. Hard to say."],
 jay:["Bro, that music started AGAIN. I swear if a ghost asks me to dance, I'm uninstalling.","Check the bushes, Clar. Every horror game hides the important shit somewhere ridiculous."],
 sherlock:["You looked at the clue. Good. Now ask yourself what it contradicts.","Eleven nineteen. Not because I enjoy repeating myself, but because you've apparently decided to ignore the evidence."],
 will:["I don't like how quiet it gets when you turn the light off.","The thing in the dark isn't running towards us. It's waiting. That's worse, somehow."],
 house:["Try actually using the things in your inventory. Radical concept, I know.","If the wooden sword saves us, I'm retiring from medicine and opening a toy shop."]
};
export const RIDDLE={
 question:'I stand still while the world forgets. I show the hour that never passed. What must you carry through this door?',
 answers:['A weapon to fight the dark','A memory that cannot be erased','The hands of the frozen clock','A key to every locked room'],
 correct:1,
 hint:'THE MIRROR WHISPERS: “The clock can stop, the lights can die, and the roads can loop. But the thing that opens the way is not time or a key. It is what you choose to remember.”'
};
export const START={mapVersion:2,x:1120,y:890,facing:'down',scene:'town',letter:false,key:false,letterGiven:false,keyGiven:false,backRoom:false,mirror:false,clock:false,gear:{flashlight:false,headphones:false,journal:false,sword:false},flashOn:false,headphonesOn:false,swordOn:false,notes:[],talked:[],gateSolved:false,complete:false};
