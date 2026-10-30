// CLAR.exe: connected three-act birthday mystery. Original fan-fiction scenes and puzzle text.
export const ACTS = {
  2: {
    id: 2, title: 'PLATFORM ZERO', subtitle: 'THE LAST TRAIN DOES NOT TAKE PASSENGERS',
    save: 'clar_exe_three_act_2_v1', spawn: [180, 660], width: 1920, height: 1200,
    colors: {sky:'#191b35', ground:'#333852', path:'#686578', accent:'#80d9d4', warm:'#ffd2a8'},
    intro: [
      'The gate behind you dissolves into a loading bar. When it reaches 99%, a train bell rings from nowhere.',
      'PLATFORM 00. LAST DEPARTURE: 11:19. PASSENGERS: ONE. UNDELIVERED MESSAGES: ONE.',
      'Three signals have gone missing. Restore them before the departure board decides you were never here.'
    ],
    cast: {
      watson: {name:'DR JOHN WATSON',x:435,y:390,color:'#9eb8bb',hair:'#9a775c',coat:'#555d6a',portrait:'watson',intro:[
        'Clar? You look remarkably alive for somebody this station has listed as MISSING.',
        'I found a clinical note inside the ticket machine. No patient, no pulse, yet the handwriting changes whenever you look away.',
        'Sherlock would call it fascinating. I call it an excellent reason to get on a different train. Try the medical console, just beyond me.'
      ],after:'The note belongs to someone who was trying very hard to get a message to you. I think the station misfiled the sender as a patient.'},
      sakusa: {name:'KIYOOMI SAKUSA',x:1410,y:400,color:'#d8c8e6',hair:'#27212d',coat:'#493953',portrait:'sakusa',intro:[
        'Do not touch that speaker. It is covered in something. Possibly static. Possibly worse.',
        'There is a real voice beneath the interference. The system is treating it like contamination and trying to scrub it out.',
        'If you recalibrate the signal tower, remove the noise. Not the voice. And wash your hands afterwards.'
      ],after:'Better. The interference was engineered to hide the sender, not to destroy the recording. I still dislike this station.'},
      suna: {name:'RINTAROU SUNA',x:1100,y:915,color:'#c4aa91',hair:'#40382e',coat:'#444a5c',portrait:'suna',intro:[
        'So, Clar. This photo booth took my picture before I stepped inside. Pretty talented for a machine with no power.',
        'There is a silhouette over your shoulder in every frame. Same posture, same stupidly dramatic entrance.',
        'Look at the contact sheet. Frame three is the only one that was taken after you got here. The timestamp is the clue.'
      ],after:'The shadow was trying to photobomb a memory. Respect the commitment. Terrible hiding skills, though.'}
    },
    objects: [
      {id:'medical',name:'MEDICAL CONSOLE',x:655,y:430,type:'puzzle',quest:'pulse',icon:'✚',hint:'Watson has been reading the patient note.'},
      {id:'signal',name:'SIGNAL TOWER',x:1535,y:485,type:'puzzle',quest:'static',icon:'♫',hint:'Sakusa knows which part of the signal matters.'},
      {id:'photobooth',name:'PHOTO BOOTH',x:1280,y:965,type:'puzzle',quest:'snapshot',icon:'▣',hint:'Suna noticed something about the third frame.'},
      {id:'luggage',name:'UNCLAIMED LUGGAGE',x:490,y:885,type:'story',icon:'◇',lines:['The luggage tag says: RETURN TO SENDER. Underneath, someone has crossed out RETURN and written REMEMBER.','A small purple ribbon is tied to the handle. It smells like someone packed in a hurry.']},
      {id:'board',name:'DEPARTURE BOARD',x:965,y:355,type:'story',icon:'⌑',lines:['PLATFORM 00 — NEVER. PLATFORM 01 — YESTERDAY. PLATFORM 02 — TOMORROW.','For half a second, a fourth line appears: PLATFORM 29 — HOME.']},
      {id:'window',name:'RAIN-STREAKED WINDOW',x:835,y:980,type:'story',icon:'◈',lines:['Your reflection waves. You did not wave.','A handprint blooms on the other side of the glass: NOT DEAD. JUST BAD AT GOODBYES.']},
      {id:'gate',name:'TRAIN TO THE ARCHIVE',x:1800,y:665,type:'gate',icon:'➜'}
    ],
    quests: [
      {id:'pulse',title:'THE IMPOSSIBLE PATIENT',reward:'Ink-stained case file',speaker:'watson',
        pre:'The file describes a person with no heartbeat but a very persistent pen. What is actually trapped inside the record?',
        answers:['An invisible passenger','The train conductor','An unfinished message'],correct:2,
        success:['CASE 01 RECOVERED. The writer was never a patient. The station mistook their unsent words for a ghost.','In the margin: “I had one more thing to tell Clar.”'],
        journal:'Watson’s patient is a message that was never sent. The sender is somewhere inside the system.'},
      {id:'static',title:'THE CLEAN FREQUENCY',reward:'Warm cassette fragment',speaker:'sakusa',
        pre:'The tower labels three signals. Only one belongs to the sender. What should be preserved?',
        answers:['A steady, familiar laugh beneath the static','The loudest alarm','The silence after the recording'],correct:0,
        success:['SIGNAL 02 RECOVERED. The station’s speakers play a little laugh, abruptly cut short.','Someone whispers through the hiss: “If you can hear me, follow the wrong shadows.”'],
        journal:'The interference concealed a familiar laugh. The real message survived the static.'},
      {id:'snapshot',title:'THE PHOTO THAT ARRIVED FIRST',reward:'Photograph from tomorrow',speaker:'suna',
        pre:'The contact sheet has three frames. Which one proves the shadow is not hunting Clar?',
        answers:['The empty platform','A blacked-out photograph','The frame where a hand holds open a door behind her'],correct:2,
        success:['FRAME 03 RECOVERED. The shadow is holding the door, not blocking it.','Written along the bottom: “I could never get the timing right.”'],
        journal:'Suna’s third frame shows the shadow opening a door for me. It may be trying to help.'}
    ],
    gate: {title:'THE DEPARTURE CODE',prompt:'The train asks why the signal, the file and the photograph were preserved.',answers:['Because unfinished things deserve to be heard','Because the station needs more passengers','Because memories should stay locked'],correct:0,
      hint:'Think about the sender behind all three clues.'},
    outro:['The station folds like a paper ticket. Every speaker calls your name in a different voice.','A figure stands at the far end of the train. For one second you see a familiar hand holding an envelope.','WATCH OUT CLAR_ / FILE TRANSFER INTERRUPTED', 'The train doors open onto a room that has no right to exist.']
  },
  3: {
    id:3,title:'THE UNWRITTEN ROOM',subtitle:'IF THE FILE IS LOST, FOLLOW THE HANDWRITING',
    save:'clar_exe_three_act_3_v1',spawn:[175,650],width:1920,height:1200,
    colors:{sky:'#291626',ground:'#493047',path:'#79546b',accent:'#eda7d3',warm:'#ffe0a8'},
    intro:[
      'You arrive at a ballroom floating inside a broken desktop. The ceiling is an unfinished night sky.',
      'Every door bears a different name. Every mirror insists that the file was deleted.',
      'Somewhere a fourth wall is cracking. The Watcher has learned how to knock.'
    ],
    cast: {
      hannibal:{name:'HANNIBAL LECTER',x:435,y:390,color:'#aa6478',hair:'#55443c',coat:'#473844',portrait:'hannibal',intro:[
        'Clar. There is a place set for you. Naturally, the guest of honour has arrived last.',
        'The table offers a beautiful illusion: one perfect memory, kept untouched forever. But a memory that cannot change is merely a display.',
        'The red invitation will ask what you truly wish to keep. Choose carefully. Sentiment is not the enemy of discernment.'
      ],after:'A good celebration is not a mausoleum. It moves, laughs, makes a mess, and begins again.'},
      nightwing:{name:'NIGHTWING',x:1460,y:390,color:'#65b9e3',hair:'#242533',coat:'#1a293c',portrait:'nightwing',intro:[
        'Hey, birthday girl. The rooftops are doing that thing where they change position when nobody looks.',
        'I found a zipline leading straight to a folder marked DELETE ME. So obviously I checked it out.',
        'The skybridge locks whenever the Watcher appears. Follow the blue trail and choose the route that protects the person behind you.'
      ],after:'Nice landing. For the record, I absolutely meant for that bridge to collapse behind us. Mostly.'},
      azusa:{name:'AZUSA',x:1040,y:925,color:'#eab6e9',hair:'#75497e',coat:'#505a82',portrait:'azusa',intro:[
        'Clar! The core is still responding to you. That means the last save has not disappeared.',
        'The machine thinks ghosts are corrupted data. But maybe some ghosts are just someone who stayed too long trying to finish a gift.',
        'I can keep the repair circuit stable if you choose the right source. Follow the purple light, not the red warning.'
      ],after:'The repair is holding! A name is forming in the code. It looks like someone you know...'}
    },
    objects:[
      {id:'banquet',name:'THE RED INVITATION',x:665,y:435,type:'puzzle',quest:'banquet',icon:'♡',hint:'Hannibal knows why the table was set for Clar.'},
      {id:'skybridge',name:'THE BLUE SKYBRIDGE',x:1585,y:480,type:'puzzle',quest:'bridge',icon:'✧',hint:'Nightwing knows which route to take.'},
      {id:'core',name:'MEMORY REPAIR CORE',x:1190,y:985,type:'puzzle',quest:'core',icon:'✺',hint:'Azusa can explain the repair circuit.'},
      {id:'mirror',name:'THE UNSENT MIRROR',x:795,y:795,type:'story',icon:'◈',lines:['Your reflection turns away from you. Behind it, a ghost with a familiar silhouette is writing furiously on a fogged-up pane.','It underlines the same sentence three times: NOT A GOODBYE. A DELIVERY.']},
      {id:'chair',name:'THE EMPTY CHAIR',x:305,y:925,type:'story',icon:'♧',lines:['A place card reads: NAIDU. Its ink drifts above the paper like fireflies.','The chair pulls itself out as if the person meant to sit here was only running late.']},
      {id:'door',name:'THE FINAL SAVE SLOT',x:1800,y:655,type:'gate',icon:'✉'}
    ],
    quests:[
      {id:'banquet',title:'THE IMPERFECT MEMORY',reward:'The red invitation',speaker:'hannibal',
        pre:'The table offers three memories. Which should be saved for Clar?',
        answers:['A perfect picture where nobody ever changes','A messy evening full of laughing friends','An empty room that never gets old'],correct:1,
        success:['THE RED INVITATION ACCEPTED. The chandelier flickers back to life.','A note appears beneath Clar’s plate: “Save the laughter, including the ugly laugh.”'],
        journal:'The best memory is the one that feels lived in, not the one that never changes.'},
      {id:'bridge',title:'THE WAY BACK',reward:'A strip of blue light',speaker:'nightwing',
        pre:'A shadow follows you across a collapsing bridge. Nightwing offers three routes. Which one reaches the other side together?',
        answers:['Jump ahead and leave the shadow behind','Cut the bridge and run','Hold the hand reaching through the glitch'],correct:2,
        success:['SKYBRIDGE RESTORED. For once, the Watcher does not chase. It follows, almost shyly.','A hand reaches through the static and briefly squeezes yours.'],
        journal:'The shadow needed help across, not another person running away.'},
      {id:'core',title:'THE PURPLE CIRCUIT',reward:'The restored name',speaker:'azusa',
        pre:'The repair core asks which file deserves its last reserve of power.',
        answers:['DELETE_UNKNOWN.exe','UNSENT_LETTER_FOR_CLAR.txt','RESET_EVERYTHING.exe'],correct:1,
        success:['RESTORE COMPLETE. A new entry appears: FROM / NAIDU. TO / CLAR. STATUS / ALMOST THERE.','The Watcher loses its threatening outline. Underneath is a small ghost holding a letter that is much too big for its hands.'],
        journal:'The ghost is Naidu’s unsent letter, trying to find Clar through every glitch.'}
    ],
    gate:{title:'THE LAST DECISION',prompt:'The Watcher asks: “What should I do with a message I was too frightened to send?”',
      answers:['Erase it before somebody judges it','Open it. A little imperfect is still real.','Lock it away and pretend it never existed'],correct:1,
      hint:'The answer is the same as the lesson from every recovered memory.'},
    outro:['The world glitches one last time. The terrifying shadow peels away like dark paper.','Inside is a tiny, mortified ghost with an oversized envelope and an absolutely terrible sense of dramatic timing.','“Okay. I know. This was a bit much,” it says. “I had ONE letter to deliver.”','GHOST_NAIDU.exe would like to give Clar something.']
  }
};

export const GHOST_LETTER = [
 'HIIII CLARRRR ♡',
 'If you are reading this, congratulations. You survived three chapters, a haunted train, at least one deeply suspicious dinner, and a ghost with absolutely no concept of personal space.',
 'Surprise. It was me. Well, the extremely dramatic, slightly broken, pixelated version of me. I kept trying to send you one little letter, and somehow turned it into an entire RPG. Very normal behaviour.',
 'Here is the actual message, though.',
 'I hope you know how loved you are. Not in the neat, easy, pretty-sentence way. I mean in the way people remember the smallest things about you; the way your presence turns an ordinary day into a story people keep telling; the way you make room for everyone else without even realising it.',
 'You deserve adventures that feel magical, people who choose you again and again, and ridiculous amounts of laughter. On the difficult days, I hope you remember there is a whole little universe of us rooting for you.',
 'Happy 22nd birthday, Clar. If life ever corrupts your save file, I will be there with an aggressively unnecessary troubleshooting guide, a dramatic entrance, and probably snacks.',
 'Now stop being sentimental and GO ENJOY YOUR BIRTHDAY. HEHEHE.',
 'Love, your very suspicious ghost,',
 'NAIDU ♡'
];