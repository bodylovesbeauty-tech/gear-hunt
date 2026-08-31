'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { dashboardFor, demoUsers, sessionKey, type DemoUser, type Role, type Status } from '@/lib/prototype-session'
import './signup-flow.css'

function AuthFrame({children, eyebrow='BBBT ACCESS'}:{children:React.ReactNode;eyebrow?:string}){return <main className="auth-shell"><aside className="auth-visual"><Link href="/" className="auth-brand">BBBT</Link><div className="auth-visual-copy"><span className="eyebrow cyan-text">RIDER WELFARE / TRUST INFRASTRUCTURE</span><h2>One account.<br/><em>Your role shapes the ride.</em></h2><p>A serious safety and community layer for India&apos;s riding communities.</p><div className="auth-visual-meta"><ShieldCheck aria-hidden="true"/><span>Prototype systems are clearly labelled before launch.</span></div></div></aside><section className="auth-panel"><div className="auth-card">{children}</div></section></main>}
function StatePage({status,role}:{status:Status;role:Role}){const copy={Pending:['Application Under Review','Your application is with the BBBT review team. We will share the next step after verification.'],Rejected:['Application Not Approved','Your current application was not approved. You may contact BBBT support if you believe this needs review.'],Suspended:['Account Suspended','Access is paused while BBBT reviews the account. Contact support for the next step.']}[status]||['',''];return <AuthFrame eyebrow={`APPLICATION STATUS / ${status.toUpperCase()}`}><span className={`eyebrow ${status==='Pending'?'orange-text':'red-text'}`}>{status==='Pending'?'REVIEW IN PROGRESS':'ACCESS STATUS'}</span><h1>{copy[0]}</h1><p className="auth-lede">{copy[1]}</p><div className="status-detail"><span>Role applied for</span><strong>{role}</strong><span>Application status</span><strong>{status}</strong></div><Link className="btn btn-cyan" href="/login">RETURN TO LOGIN <ArrowRight size={16}/></Link></AuthFrame>}
export function UniversalLogin(){const [demoId,setDemoId]=useState('rider-approved');const [busy,setBusy]=useState(false);const [state,setState]=useState<{status:Status;role:Role}|null>(null);useEffect(()=>{const p=new URLSearchParams(window.location.search);const status=p.get('status') as Status|null;const role=p.get('role') as Role|null;if(status&&role)setState({status,role})},[]);if(state)return <StatePage {...state}/>;const submit=(id=demoId)=>{const user=demoUsers.find(x=>x.id===id)!;setBusy(true);sessionStorage.setItem(sessionKey,JSON.stringify({user,activeRole:user.approvedRoles[0]||user.primaryRole}));setTimeout(()=>window.location.assign(user.status==='Approved'?dashboardFor(user.approvedRoles[0]||user.primaryRole):`/login?status=${user.status}&role=${encodeURIComponent(user.primaryRole)}`),250)};return <AuthFrame><Link className="auth-brand mobile-brand" href="/">BBBT</Link><span className="eyebrow cyan-text">UNIVERSAL LOGIN / ONE ACCOUNT</span><h1>Welcome<br/><em>back.</em></h1><p className="auth-lede">Use one BBBT account for your rider, community and approved role access.</p><form className="auth-form" onSubmit={e=>{e.preventDefault();submit()}}><label>EMAIL OR MOBILE<input required placeholder="Email or +91 mobile number"/></label><label>PASSWORD<input required type="password" placeholder="Enter prototype password"/></label><button className="btn btn-cyan" disabled={busy}>{busy?'AUTHENTICATING...':'LOGIN'} <ArrowRight size={16}/></button></form><div className="auth-links"><Link href="/signup">Create a BBBT account</Link><span>Prototype recovery flow</span></div><section className="demo-access"><span className="eyebrow orange-text">PROTOTYPE DEMO ACCESS</span><p>Choose a sample identity to preview approval, restriction and role-routing states.</p><select value={demoId} onChange={e=>setDemoId(e.target.value)}>{demoUsers.map(u=><option key={u.id} value={u.id}>{u.primaryRole} — {u.status}</option>)}</select><button className="btn btn-outline" type="button" onClick={()=>submit()}>USE DEMO IDENTITY</button></section></AuthFrame>}
export function UnifiedSignup(){
  const roleList:Role[]=['Rider','Group Admin','Marshal','Founding Rider Council Member']
  const descriptions:Record<Role,string>={
    Rider:'Ride with a clearer safety identity and trusted community access.',
    'Group Admin':'Connect your riding group to a structured safety layer.',
    Marshal:'Support safe, disciplined riding and community readiness.',
    'Founding Rider Council Member':'Bring experienced rider intelligence into BBBT design.',
  }
  const responsibilities:Record<Role,string[]>={
    Rider:[
      'Ride responsibly and follow traffic rules at all times.',
      'Keep your safety and identity information honest and up to date.',
      'Respect other riders, communities and the people around you.',
      'Use BBBT features in good faith and never to mislead others.',
    ],
    'Group Admin':[
      'Represent your riding group honestly and fairly.',
      'Help keep your community safe, disciplined and welcoming.',
      'Share accurate information about your group and its riders.',
      'Support BBBT safety standards within your community.',
    ],
    Marshal:[
      'Support safe and disciplined riding on every ride.',
      'Help other riders during group rides wherever you can.',
      'Stay calm and act responsibly in difficult moments.',
      'Follow BBBT safety guidance and complete required training.',
    ],
    'Founding Rider Council Member':[
      'Give honest rider feedback and real ground intelligence.',
      'Act in the interest of rider safety, not personal gain.',
      'Disclose any conflict of interest openly.',
      'Support fair, transparent and accountable community governance.',
    ],
  }
  const steps=['01 YOU','02 LANGUAGES','03 WHERE YOU RIDE','04 YOUR BIKE','05 YOUR SAFETY','06 YOUR ROLE','07 BBBT INTEREST','08 REVIEW']

  const [done,setDone]=useState(false)
  const [role,setRole]=useState<Role>('Rider')
  const [checked,setChecked]=useState(false)
  const [showResp,setShowResp]=useState(false)
  const [step,setStep]=useState(0)
  const [errors,setErrors]=useState<Record<string,string>>({})
  const [f,setF]=useState({
    fullName:'',handle:'',mobile:'',email:'',
    language:'English',
    baseLocation:'',address:'',city:'',district:'',state:'',pin:'',zone:'',
    bike:'',bikeReg:'',
    ecName:'',ecNumber:'',blood:'',
    groupName:'',groupProfile:'',groupSize:'',groupHandle:'',
    marshalExp:'',
    councilEmail:'',councilYears:'',councilRides:'',councilProfile:'',councilWhy:'',councilConflict:'',
    budget:'',
  })
  const set=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setF(p=>({...p,[k]:e.target.value}))
  const err=(k:string,label:string)=>errors[k]?<span className="field-error">{errors[k]}</span>:<span className="eyebrow" style={{fontSize:'.6rem'}}>{label}</span>

  function validateStep(i:number){
    const e:Record<string,string>={}
    if(i===0){
      if(!f.fullName.trim())e.fullName='Required'
      if(!f.handle.trim())e.handle='Required'
      const m=f.mobile.trim()
      if(!m)e.mobile='Required'
      else if(!/^\+?[0-9][0-9\s-]{7,14}$/.test(m))e.mobile='Invalid mobile'
      if(f.email.trim()&&!/^\S+@\S+\.\S+$/.test(f.email.trim()))e.email='Invalid email'
    }
    if(i===2){
      if(!f.baseLocation.trim())e.baseLocation='Required'
      if(f.pin.trim()&&!/^[0-9]{6}$/.test(f.pin.trim()))e.pin='Invalid PIN'
    }
    if(i===5){
      if(role==='Group Admin'){
        if(!f.groupName.trim())e.groupName='Required'
        if(!f.groupProfile.trim())e.groupProfile='Required'
      }
      if(role==='Founding Rider Council Member'){
        const ce=f.councilEmail.trim()
        if(!ce)e.councilEmail='Required'
        else if(!/^\S+@\S+\.\S+$/.test(ce))e.councilEmail='Invalid email'
        if(!f.councilProfile.trim())e.councilProfile='Required'
      }
    }
    return e
  }
  function next(){
    const e=validateStep(step)
    setErrors(e)
    if(Object.keys(e).length)return
    setStep(s=>Math.min(s+1,steps.length-1))
  }
  function back(){setErrors({});setStep(s=>Math.max(s-1,0))}
  function acknowledge(){setChecked(true);setShowResp(false)}
  function submit(ev:React.FormEvent){ev.preventDefault();if(step!==steps.length-1||!checked)return;setDone(true)}

  const initials=(f.fullName.trim()||'BB').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()
  const previewLocation=f.baseLocation.trim()||[f.city.trim(),f.state.trim()].filter(Boolean).join(', ')

  if(done)return <AuthFrame>
    <span className="eyebrow green-text">APPLICATION SUBMITTED</span>
    <h1>Application<br/><em>submitted.</em></h1>
    <div className="status-detail">
      <span>Role applied for</span><strong>{role}</strong>
      <span>Application status</span><strong>Pending / Prototype</strong>
    </div>
    <p className="auth-lede">Your responsibility acknowledgement was recorded for this prototype application. Role selection is a request and does not grant approval.</p>
    <div className="su-note"><strong>This is a prototype.</strong> No payment is being taken and this registration does not represent live emergency coverage.</div>
    <Link className="btn btn-cyan" href="/login">GO TO LOGIN <ArrowRight size={16}/></Link>
    <p className="su-help">Need help with signup? <a href="mailto:help@bbbt.in">help@bbbt.in</a></p>
  </AuthFrame>

  return <AuthFrame>
    <Link className="auth-brand mobile-brand" href="/">BBBT</Link>
    <span className="eyebrow cyan-text">CREATE ACCOUNT / JOIN THE NETWORK</span>
    <h1>Start your<br/><em>BBBT identity.</em></h1>

    <div className="su-top" aria-hidden="true">
      <div className="su-steprow">
        <span className="su-steplabel">{steps[step]}</span>
        <span className="su-stepcount">STEP {step+1} OF {steps.length}</span>
      </div>
      <div className="su-bar"><i style={{width:`${((step+1)/steps.length)*100}%`}}/></div>
    </div>

    {step>0&&<div className="su-preview">
      <div className="su-preview-head"><b>LIVE BBBT IDENTITY</b><span className="su-preview-tag">PROTOTYPE</span></div>
      <div className="su-preview-id">
        <span className="su-preview-avatar" aria-hidden="true">{initials}</span>
        <span>
          <strong>{f.fullName.trim()||'Your name'}</strong>
          <span>{f.handle.trim()||'@yourhandle'}</span>
        </span>
      </div>
      <div className="su-preview-meta">
        <div><small>Location</small><p className={previewLocation?'':'muted'}>{previewLocation||'Not added yet'}</p></div>
        <div><small>Bike</small><p className={f.bike.trim()?'':'muted'}>{f.bike.trim()||'Not added yet'}</p></div>
        <div><small>Rider role</small><p>{role}</p></div>
      </div>
    </div>}

    <form className="auth-form" onSubmit={submit}>
      {step===0&&<div className="su-step">
        <div className="form-grid">
          <label className={errors.fullName?'invalid':''}>FULL NAME {err('fullName','Required')}<input value={f.fullName} onChange={set('fullName')} placeholder="Your full name"/></label>
          <label className={errors.handle?'invalid':''}>HANDLE {err('handle','Required')}<input value={f.handle} onChange={set('handle')} placeholder="@yourriderhandle"/></label>
        </div>
        <div className="form-grid">
          <label className={errors.mobile?'invalid':''}>MOBILE NUMBER {err('mobile','Required')}<input value={f.mobile} onChange={set('mobile')} inputMode="tel" placeholder="+91 mobile number"/></label>
          <label className={errors.email?'invalid':''}>EMAIL {err('email','Optional')}<input value={f.email} onChange={set('email')} type="email" placeholder="you@example.com"/></label>
        </div>
      </div>}

      {step===1&&<div className="su-step">
        <p className="auth-lede">We use language to keep safety and community information clear for you.</p>
        <label>PRIMARY LANGUAGE<select value={f.language} onChange={set('language')}>
          <option>English</option><option>Hindi</option><option>Marathi</option><option>Tamil</option>
        </select></label>
      </div>}

      {step===2&&<div className="su-step">
        <label className={errors.baseLocation?'invalid':''}>BASE LOCATION {err('baseLocation','Required')}<input value={f.baseLocation} onChange={set('baseLocation')} placeholder="City / state you mostly ride from"/></label>
        <div className="form-grid">
          <label>ADDRESS<input value={f.address} onChange={set('address')} placeholder="Street or locality"/></label>
          <label>CITY<input value={f.city} onChange={set('city')} placeholder="City"/></label>
        </div>
        <div className="form-grid">
          <label>DISTRICT<input value={f.district} onChange={set('district')} placeholder="District"/></label>
          <label>STATE<input value={f.state} onChange={set('state')} placeholder="State"/></label>
        </div>
        <div className="form-grid">
          <label className={errors.pin?'invalid':''}>PIN CODE {err('pin','Optional')}<input value={f.pin} onChange={set('pin')} inputMode="numeric" placeholder="6-digit PIN"/></label>
          <label>ZONE<input value={f.zone} onChange={set('zone')} placeholder="Zone"/></label>
        </div>
      </div>}

      {step===3&&<div className="su-step">
        <p className="auth-lede">Your bike helps us tailor safety and community features. You can leave this for later.</p>
        <label>BIKE / VEHICLE<input value={f.bike} onChange={set('bike')} placeholder="Make, model and year"/></label>
        <label>BIKE REGISTRATION<input value={f.bikeReg} onChange={set('bikeReg')} placeholder="Registration number"/></label>
      </div>}

      {step===4&&<div className="su-step">
        <fieldset className="form-section">
          <legend>PRIVATE / SAFETY INFORMATION</legend>
          <p className="auth-lede" style={{margin:0}}>This stays private. It is never shown on your public rider identity.</p>
          <div className="form-grid">
            <label>EMERGENCY CONTACT NAME<input value={f.ecName} onChange={set('ecName')} placeholder="Name and relationship"/></label>
            <label>EMERGENCY CONTACT NUMBER<input value={f.ecNumber} onChange={set('ecNumber')} inputMode="tel" placeholder="+91 mobile number"/></label>
          </div>
          <label>BLOOD GROUP<select value={f.blood} onChange={set('blood')}>
            <option value="" disabled>Select blood group</option>
            <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
          </select></label>
        </fieldset>
      </div>}

      {step===5&&<div className="su-step">
        <fieldset className="role-fieldset">
          <legend>Choose your BBBT role</legend>
          <div className="role-checks">{roleList.map(r=>
            <label className="role-check" key={r}>
              <input type="radio" name="role" checked={role===r} onChange={()=>{setRole(r);setChecked(false)}}/>
              <span><strong>{r}</strong><small>{descriptions[r]}</small></span>
            </label>)}</div>
        </fieldset>
        <p className="auth-lede" style={{marginTop:0}}>Role selection is a request. It does not automatically grant approval.</p>

        {role==='Group Admin'&&<fieldset className="form-section">
          <legend>GROUP ADMIN INFORMATION</legend>
          <label className={errors.groupName?'invalid':''}>RIDING GROUP / COMMUNITY NAME {err('groupName','Required')}<input value={f.groupName} onChange={set('groupName')} placeholder="Community name"/></label>
          <label className={errors.groupProfile?'invalid':''}>PUBLIC COMMUNITY PROFILE {err('groupProfile','Required')}<input value={f.groupProfile} onChange={set('groupProfile')} placeholder="Instagram, Facebook or URL"/></label>
          <div className="form-grid">
            <label>COMMUNITY SIZE<input value={f.groupSize} onChange={set('groupSize')} inputMode="numeric" placeholder="Approximate riders"/></label>
            <label>COMMUNITY HANDLE<input value={f.groupHandle} onChange={set('groupHandle')} placeholder="@communityhandle"/></label>
          </div>
        </fieldset>}

        {role==='Marshal'&&<fieldset className="form-section">
          <legend>MARSHAL EXPERIENCE</legend>
          <label>RIDING / MARSHAL EXPERIENCE<textarea rows={3} value={f.marshalExp} onChange={set('marshalExp')} placeholder="Tell us about supporting rides or rider safety"/></label>
        </fieldset>}

        {role==='Founding Rider Council Member'&&<fieldset className="form-section">
          <legend>COUNCIL APPLICATION</legend>
          <label className={errors.councilEmail?'invalid':''}>EMAIL (REQUIRED FOR COUNCIL REVIEW) {err('councilEmail','Required')}<input value={f.councilEmail} onChange={set('councilEmail')} type="email" placeholder="you@example.com"/></label>
          <div className="form-grid">
            <label>YEARS RIDING<input value={f.councilYears} onChange={set('councilYears')} inputMode="numeric" placeholder="Years"/></label>
            <label>ORGANISED RIDES<input value={f.councilRides} onChange={set('councilRides')} inputMode="numeric" placeholder="Approximate number"/></label>
          </div>
          <label className={errors.councilProfile?'invalid':''}>PUBLIC SOCIAL / COMMUNITY PROFILE {err('councilProfile','At least one required')}<input value={f.councilProfile} onChange={set('councilProfile')} placeholder="At least one public profile (up to five, LinkedIn optional)"/></label>
          <label>WHY DO YOU WANT TO CONTRIBUTE?<textarea rows={3} value={f.councilWhy} onChange={set('councilWhy')} placeholder="Your rider intelligence, safety or product perspective"/></label>
          <label>CONFLICT OF INTEREST INFORMATION<textarea rows={2} value={f.councilConflict} onChange={set('councilConflict')} placeholder="Optional disclosure"/></label>
        </fieldset>}
      </div>}

      {step===6&&<div className="su-step">
        <label>ANNUAL SAFETY BUDGET RESEARCH<select value={f.budget} onChange={set('budget')}>
          <option value="" disabled>Select a range</option>
          <option>Under ₹1,000</option>
          <option>₹1,000–₹2,500</option>
          <option>₹2,500–₹5,000</option>
          <option>₹5,000+</option>
          <option>Prefer not to say</option>
        </select></label>
        <p className="auth-lede" style={{marginTop:0}}>How much would you personally be comfortable spending annually for a rider safety ecosystem like BBBT?</p>
        <div className="su-note"><strong>Research only</strong> — this is not a payment or purchase commitment.</div>
      </div>}

      {step===7&&<div className="su-step su-review">
        <div className="su-review-grid">
          <div><small>Name</small><p>{f.fullName.trim()||'—'}</p></div>
          <div><small>Handle</small><p>{f.handle.trim()||'—'}</p></div>
          <div><small>Mobile</small><p>{f.mobile.trim()||'—'}</p></div>
          <div><small>Language</small><p>{f.language}</p></div>
          <div><small>Base location</small><p className={previewLocation?'':'muted'}>{previewLocation||'Not added'}</p></div>
          <div><small>Bike</small><p className={f.bike.trim()?'':'muted'}>{f.bike.trim()||'Not added'}</p></div>
          <div><small>Role requested</small><p>{role}</p></div>
          <div><small>Safety details</small><p className="muted">Kept private</p></div>
        </div>

        <button type="button" className="responsibility-trigger" onClick={()=>setShowResp(true)}>Review responsibility acknowledgement</button>
        <label className="consent-row">
          <input type="checkbox" checked={checked} onChange={e=>{if(e.target.checked){setShowResp(true)}else{setChecked(false)}}}/>
          <span>I have read and understood my BBBT role responsibilities.</span>
        </label>
        {!checked&&errors.consent&&<div className="su-step-error">{errors.consent}</div>}

        <div className="su-note"><strong>This is a prototype.</strong> No payment is being taken and this registration does not represent live emergency coverage. Role selection is a request and does not grant approval.</div>
      </div>}

      <div className="su-nav">
        {step>0&&<button type="button" className="btn btn-outline su-back" onClick={back}>BACK</button>}
        {step<steps.length-1
          ? <button type="button" className="btn btn-cyan" onClick={next}>CONTINUE <ArrowRight size={16}/></button>
          : <button className="btn btn-cyan" type="submit" disabled={!checked} onClick={()=>{if(!checked)setErrors({consent:'Please acknowledge your role responsibilities to continue.'})}}>SUBMIT APPLICATION <ArrowRight size={16}/></button>}
      </div>
    </form>

    <p className="su-help">Need help with signup? <a href="mailto:help@bbbt.in">help@bbbt.in</a></p>

    {showResp&&<div className="su-modal" role="dialog" aria-modal="true" aria-label="BBBT role responsibilities" onClick={e=>{if(e.target===e.currentTarget)setShowResp(false)}}>
      <div className="su-modal-card">
        <button className="su-modal-close" aria-label="Close" onClick={()=>setShowResp(false)}>✕</button>
        <span className="eyebrow cyan-text">RESPONSIBILITY ACKNOWLEDGEMENT</span>
        <h2>Your responsibilities as {role}</h2>
        <p className="auth-lede">Joining BBBT begins with responsibility. Please read these before you continue.</p>
        <p className="su-resp-lang">ENGLISH</p>
        <ul className="su-resp-list">{responsibilities[role].map((r,i)=><li key={i}>{r}</li>)}</ul>
        {f.language!=='English'&&<p className="su-note" style={{marginTop:'1.25rem'}}>A {f.language} version of these responsibilities will be provided before launch. The English version above is authoritative for this prototype.</p>}
        <label className="consent-row">
          <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/>
          <span>I have read and understood my BBBT role responsibilities.</span>
        </label>
        <div className="su-modal-actions">
          <button type="button" className="btn btn-outline" onClick={()=>setShowResp(false)}>CLOSE</button>
          <button type="button" className="btn btn-cyan" disabled={!checked} onClick={acknowledge}>CONFIRM <ArrowRight size={16}/></button>
        </div>
      </div>
    </div>}
  </AuthFrame>
}
export type { DemoUser }
