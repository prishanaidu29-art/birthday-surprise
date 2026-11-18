'use client'

import { useEffect } from 'react'

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error('[CLAR_OS_APP_ERROR]', error)
  }, [error])

  return (
    <main style={{minHeight:'100vh',background:'#10091b',color:'#f6eaff',display:'grid',placeItems:'center',padding:24,fontFamily:'system-ui,sans-serif'}}>
      <section style={{width:'min(680px,100%)',border:'1px solid #a86bbf',borderRadius:16,padding:24,background:'#1d1230'}}>
        <p style={{letterSpacing:'.15em',fontSize:12,color:'#d5a5ef'}}>CLAR_OS // RECOVERY MODE</p>
        <h1 style={{fontSize:26,fontWeight:700,margin:'12px 0'}}>The archive hit an error.</h1>
        <p style={{color:'#d9c9e6',marginBottom:16}}>This diagnostic screen is temporary. Copy the error below so the issue can be fixed without guessing.</p>
        <pre id="clar-error" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:14,background:'#090510',borderRadius:10,fontSize:13,color:'#ffd1df'}}>{String(error?.message || error || 'Unknown client error')}{error?.digest ? '\nDigest: '+error.digest : ''}{error?.stack ? '\n\n'+error.stack : ''}</pre>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:18}}>
          <button onClick={() => navigator.clipboard?.writeText(document.getElementById('clar-error')?.innerText || '')} style={{padding:'11px 16px',borderRadius:9,background:'#a86bbf',color:'#160b20',fontWeight:700}}>Copy error</button>
          <button onClick={() => reset()} style={{padding:'11px 16px',borderRadius:9,border:'1px solid #c7a4dc',color:'#f6eaff'}}>Try again</button>
          <button onClick={() => location.reload()} style={{padding:'11px 16px',borderRadius:9,border:'1px solid #c7a4dc',color:'#f6eaff'}}>Reload</button>
        </div>
      </section>
    </main>
  )
}
