'use client'
import {scopedStorage} from './ScopedSave'

export const HUNT_STAGE_KEY='clar_hunt_stage_v2'
export const HUNT_STAGES=[
 {id:0,title:'DESKTOP CACHE',description:'Find the hidden pulse sequence.'},
 {id:1,title:'LOVE_MAIL SIGNAL',description:'Use the recovered sequence to decrypt the first three letters.'},
 {id:2,title:'VHS RECOVERY',description:'Repair the corrupted memory tape.'},
 {id:3,title:'THE SECOND CIPHER',description:'Decode the message hidden in the static.'},
 {id:4,title:'VOICE EGG',description:'Find and finish the hidden voice recording.'},
 {id:5,title:'TRIVIA CLEARANCE',description:'Complete the trivia terminal.'},
 {id:6,title:'THE RPG',description:'The final save file is ready.'}
]
export function readHuntStage(){
 if(typeof window==='undefined')return 0
 try{return Math.max(0,Math.min(6,Number(scopedStorage.getItem(HUNT_STAGE_KEY)||0)))}catch{return 0}
}
export function setHuntStage(stage){
 try{
  const next=Math.max(0,Math.min(6,Number(stage)||0))
  const current=readHuntStage()
  if(next>current)scopedStorage.setItem(HUNT_STAGE_KEY,String(next))
  window.dispatchEvent(new Event('clar-hunt-progress'))
  return Math.max(current,next)
 }catch{return readHuntStage()}
}
export function advanceHuntStage(expected,next){
 const current=readHuntStage()
 if(current>=next)return current
 if(current!==expected)return current
 return setHuntStage(next)
}
export function canOpenHuntStage(required){return readHuntStage()>=required}
