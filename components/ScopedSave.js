'use client'
const PREFIX='claros_save_v2_'
export function saveMode(){if(typeof window==='undefined')return 'player';try{const params=new URLSearchParams(window.location.search);if(params.get('test')==='1'){sessionStorage.setItem('claros_creator_test','1');return 'test'}if(params.get('play')==='1'){sessionStorage.removeItem('claros_creator_test');return 'player'}return sessionStorage.getItem('claros_creator_test')==='1'?'test':'player'}catch{return 'player'}}
export const scopedStorage={
 getItem(key){if(typeof window==='undefined')return null;return window.localStorage.getItem(PREFIX+saveMode()+'_'+key)},
 setItem(key,value){if(typeof window==='undefined')return;window.localStorage.setItem(PREFIX+saveMode()+'_'+key,String(value))},
 removeItem(key){if(typeof window==='undefined')return;window.localStorage.removeItem(PREFIX+saveMode()+'_'+key)}
}
export function resetCurrentSave(){if(typeof window==='undefined')return;const prefix=PREFIX+saveMode()+'_';for(let i=window.localStorage.length-1;i>=0;i--){const key=window.localStorage.key(i);if(key&&key.startsWith(prefix))window.localStorage.removeItem(key)}window.dispatchEvent(new Event('clar-recovery'))}
