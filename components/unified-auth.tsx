'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { applicationKey, dashboardFor, demoUsers, duplicateField, identityKey, isAutoApproved, normEmail, normHandle, normMobile, prototypeApplicationId, readRegistry, saveIdentityToRegistry, sessionKey, type DemoUser, type PrototypeIdentity, type PrototypeVehicle, type Role, type Status } from '@/lib/prototype-session'
import './signup-flow.css'

function VehiclePhoto({label,helper,photo,onChange,onRemove,inputId}:{label:string;helper:string;photo:{name:string;dataUrl:string}|null;onChange:(file?:File)=>void;onRemove:()=>void;inputId:string}){return <div className="vehicle-photo"><b>{label}</b><small>{helper} JPG, JPEG, PNG or WEBP up to 5 MB.</small>{photo?<div className="vehicle-photo-preview"><img src={photo.dataUrl} alt={label}/><span>{photo.name}</span><button type="button" className="text-button" onClick={onRemove}>Remove</button></div>:<label className="btn btn-outline photo-picker" htmlFor={inputId}>CHOOSE FILE / CAMERA<input id={inputId} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>onChange(e.target.files?.[0])}/></label>}</div>}

function AuthFrame({children, eyebrow='BBBT ACCESS'}:{children:React.ReactNode;eyebrow?:string}){return <main className="auth-shell"><aside className="auth-visual"><Link href="/" className="auth-brand"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link><div className="auth-visual-copy"><span className="eyebrow cyan-text">RIDER WELFARE / TRUST INFRASTRUCTURE</span><h2>One account.<br/><em>Your role shapes the ride.</em></h2><p>A serious safety and community layer for India&apos;s riding communities.</p><div className="auth-visual-meta"><ShieldCheck aria-hidden="true"/><span>Prototype systems are clearly labelled before launch.</span></div></div></aside><section className="auth-panel"><div className="auth-card">{children}</div></section></main>}
function StatePage({status,role}:{status:Status;role:Role}){const copy={Pending:['Application Under Review','Your application is with the BBBT review team. We will share the next step after verification.'],Rejected:['Application Not Approved','Your current application was not approved. You may contact BBBT support if you believe this needs review.'],Suspended:['Account Suspended','Access is paused while BBBT reviews the account. Contact support for the next step.']}[status]||['',''];let identity:PrototypeIdentity|null=null;try{identity=JSON.parse(sessionStorage.getItem(identityKey)||'null')}catch{}return <AuthFrame eyebrow={`APPLICATION STATUS / ${status.toUpperCase()}`}><span className={`eyebrow ${status==='Pending'?'orange-text':'red-text'}`}>{status==='Pending'?'REVIEW IN PROGRESS':'ACCESS STATUS'}</span><h1>{copy[0]}</h1><p className="auth-lede">{status==='Pending'?'This is a prototype review state. Approval shown here is simulated and does not represent production approval.':copy[1]}</p><div className="status-detail">{identity&&<><span>Application ID</span><strong>{identity.applicationId}</strong><span>Submitted</span><strong>{new Date(identity.createdAt).toLocaleString()}</strong></>}<span>Role applied for</span><strong>{role}</strong><span>Application status</span><strong>{status}{status==='Pending'&&' / Prototype'}</strong></div>{status==='Pending'&&<p className="su-help">Need help with this prototype application? <a href="mailto:help@bbbt.in">help@bbbt.in</a></p>}<Link className="btn btn-cyan" href="/login">BACK TO LOGIN <ArrowRight size={16}/></Link></AuthFrame>}
export function UniversalLogin(){const [busy,setBusy]=useState(false);const [state,setState]=useState<{status:Status;role:Role}|null>(null);const [prototype,setPrototype]=useState<PrototypeIdentity|null>(null);const [loginId,setLoginId]=useState('');const [loginPwd,setLoginPwd]=useState('');const [loginError,setLoginError]=useState('');useEffect(()=>{const p=new URLSearchParams(window.location.search);const status=p.get('status') as Status|null;const role=p.get('role') as Role|null;if(status&&role)setState({status,role});try{setPrototype(JSON.parse(sessionStorage.getItem(identityKey)||'null'))}catch{}},[]);if(state)return <StatePage {...state}/>;const submit=()=>{const q=loginId.trim();if(!q){setLoginError('Enter your registered email or mobile number.');return}if(!loginPwd){setLoginError('Enter your prototype password.');return}const reg=readRegistry();const nEmail=normEmail(q);const nMobile=normMobile(q);const nHandle=normHandle(q);const identity=reg.find(u=>(u.email&&normEmail(u.email)===nEmail)||(nMobile&&u.mobile&&normMobile(u.mobile)===nMobile)||normHandle(u.handle)===nHandle);const demo=!identity?demoUsers.find(u=>normHandle(u.handle)===nHandle):undefined;if(!identity&&!demo){setLoginError('No registered BBBT identity was found for these details. Please sign up first.');return}setLoginError('');setBusy(true);if(identity){const approved=identity.status==='Approved';const user:DemoUser={id:identity.id,name:identity.fullName,handle:identity.handle,primaryRole:identity.requestedRole,approvedRoles:approved?[identity.requestedRole]:[],status:identity.status,referral:`BBBT.in/join/${normHandle(identity.handle)}`};if(approved){sessionStorage.setItem(sessionKey,JSON.stringify({user,activeRole:identity.requestedRole}));window.location.assign(dashboardFor(identity.requestedRole))}else window.location.assign(`/login?status=${identity.status}&role=${encodeURIComponent(identity.requestedRole)}`);return}sessionStorage.setItem(sessionKey,JSON.stringify({user:demo!,activeRole:demo!.approvedRoles[0]||demo!.primaryRole}));window.location.assign(demo!.status==='Approved'?dashboardFor(demo!.approvedRoles[0]||demo!.primaryRole):`/login?status=${demo!.status}&role=${encodeURIComponent(demo!.primaryRole)}`)};const review=(status:Status)=>{if(!prototype)return;const next={...prototype,status};const application=JSON.parse(sessionStorage.getItem(applicationKey)||'{}');sessionStorage.setItem(applicationKey,JSON.stringify({...application,status}));sessionStorage.setItem(identityKey,JSON.stringify(next));saveIdentityToRegistry(next);setPrototype(next);if(status==='Approved'){const user:DemoUser={id:next.id,name:next.fullName,handle:next.handle,primaryRole:next.requestedRole,approvedRoles:[next.requestedRole],status:'Approved',referral:`BBBT.in/join/${next.handle.replace('@','')}`};sessionStorage.setItem(sessionKey,JSON.stringify({user,activeRole:next.requestedRole}));window.location.assign(dashboardFor(next.requestedRole));}else window.location.assign(`/login?status=${status}&role=${encodeURIComponent(next.requestedRole)}`)};return <AuthFrame>{prototype&&<section className="prototype-review"><span className="eyebrow orange-text">PROTOTYPE REVIEW</span><p>This is a simulated prototype approval flow, not production approval.</p><div className="status-detail"><span>Application ID</span><strong>{prototype.applicationId}</strong><span>Applicant Name</span><strong>{prototype.fullName}</strong><span>Requested Role</span><strong>{prototype.requestedRole}</strong><span>Submitted</span><strong>{new Date(prototype.createdAt).toLocaleString()}</strong><span>Current Status</span><strong>{prototype.status}</strong></div><div><button type="button" className="btn btn-cyan" onClick={()=>review('Approved')}>APPROVE</button><button type="button" className="btn btn-outline" onClick={()=>review('Rejected')}>REJECT</button><button type="button" className="btn btn-outline" onClick={()=>review('Suspended')}>SUSPEND</button></div></section>}<Link className="auth-brand mobile-brand" href="/"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link><span className="eyebrow cyan-text">UNIVERSAL LOGIN / ONE ACCOUNT</span><h1>Welcome<br/><em>back.</em></h1><p className="auth-lede">Use one BBBT account for your rider, community and approved role access.</p><form className="auth-form" onSubmit={e=>{e.preventDefault();submit()}}><label>EMAIL OR MOBILE<input required value={loginId} onChange={e=>{setLoginId(e.target.value);setLoginError('')}} placeholder="Registered email or mobile number"/></label><label>PASSWORD<input required type="password" value={loginPwd} onChange={e=>setLoginPwd(e.target.value)} placeholder="Enter prototype password"/></label>{loginError&&<p className="field-error" role="alert">{loginError}</p>}<button className="btn btn-cyan" disabled={busy}>{busy?'AUTHENTICATING...':'LOGIN'} <ArrowRight size={16}/></button></form><div className="auth-links"><Link href="/signup">Create a BBBT account</Link><span>Prototype recovery flow</span></div>{prototype&&<section className="prototype-application"><span className="eyebrow orange-text">YOUR PROTOTYPE APPLICATION</span><p><b>Name:</b> {prototype.fullName}</p><p><b>Role:</b> {prototype.requestedRole}</p><p><b>Status:</b> {prototype.status.toUpperCase()}</p><p className="su-help">Application ID: {prototype.applicationId}</p><button className="btn btn-outline" type="button" onClick={()=>{setBusy(true);window.location.assign(`/login?status=${prototype.status}&role=${encodeURIComponent(prototype.requestedRole)}`)}}>CONTINUE <ArrowRight size={16}/></button></section>}{prototype&&<section className="prototype-review"><span className="eyebrow orange-text">PROTOTYPE REVIEW CONTROLS</span><p>DEMO / PROTOTYPE — changes apply only to this stored application.</p><div><button type="button" className="btn btn-cyan" onClick={()=>review('Approved')}>APPROVE</button><button type="button" className="btn btn-outline" onClick={()=>review('Rejected')}>REJECT</button><button type="button" className="btn btn-outline" onClick={()=>review('Suspended')}>SUSPEND</button></div></section>}</AuthFrame>}
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
  const [pinStatus,setPinStatus]=useState('')
  const [photoPreview,setPhotoPreview]=useState('')
  const [photoName,setPhotoName]=useState('')
  const [availability,setAvailability]=useState<Record<string,string>>({})
  const [vehicles,setVehicles]=useState<PrototypeVehicle[]>([])
  const [f,setF]=useState({
    fullName:'',handle:'',mobile:'',email:'',
    language:'English',
    additionalLanguages:[] as string[],
    baseLocation:'',address:'',city:'',district:'',state:'',pin:'',zone: '',
    bikeMake:'',bikeModel:'',bikeYear:'',bikeKm:'',bikeReg:'',
    ecName:'',ecNumber:'',blood:'',bloodReport:'',
    groupName:'',groupProfile:'',groupSize:'',groupHandle:'',
    marshalExp:'',
    councilEmail:'',councilYears:'',councilRides:'',councilProfile:'',councilWhy:'',councilConflict:'',
    budget:'',
  })
  const set=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setF(p=>({...p,[k]:e.target.value}))
  const bbbtZones={
    north:['Jammu and Kashmir','Ladakh','Himachal Pradesh','Punjab','Haryana','Chandigarh','Delhi','Uttarakhand'],
    northCentral:['Uttar Pradesh','Rajasthan'],
    west:['Gujarat','Goa','Maharashtra'],
    centralWest:['Madhya Pradesh','Chhattisgarh'],
    southCentral:['Telangana','Andhra Pradesh','Karnataka'],
    south:['Tamil Nadu','Kerala','Puducherry','Andaman and Nicobar Islands'],
    eastNorthEast:['West Bengal','Odisha','Assam','Arunachal Pradesh','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura'],
    eastCentral:['Bihar','Jharkhand']
  } as const
  function resolveBbbtZone(state:string,district:string){
    const normalized=state.trim().toLowerCase()
    const entry=Object.entries(bbbtZones).find(([,states])=>states.some(value=>value.toLowerCase()===normalized))
    if(!entry)return ''
    const names:{[key:string]:string}={north:'Z01 — NORTH',northCentral:'Z02 — NORTH-CENTRAL',west:'Z03 — WEST',centralWest:'Z04 — CENTRAL-WEST',southCentral:'Z05 — SOUTH-CENTRAL',south:'Z06 — SOUTH',eastNorthEast:'Z07 — EAST + NORTH-EAST',eastCentral:'Z08 — EAST-CENTRAL'}
    return names[entry[0]]||''
  }
  async function lookupPin(value:string){
    const pin=value.replace(/\D/g,'').slice(0,6)
    setF(p=>({...p,pin,state:'',district:'',zone:''}))
    setPinStatus('')
    if(pin.length!==6)return
    if(pin.startsWith('9')){setPinStatus('Special postal service / APS context. Civilian BBBT geography was not assigned.');return}
    setPinStatus('Detecting location…')
    try{
      const response=await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      if(!response.ok)throw new Error('postal lookup failed')
      const data=await response.json()
      const offices=data?.[0]?.Status==='Success'?data[0].PostOffice||[]:[]
      const postOffice=offices[0]
      if(!postOffice){setPinStatus('Unable to detect location from this PIN right now.');return}
      const state=postOffice.State||''
      const district=postOffice.District||''
      const zone=resolveBbbtZone(state,district)
      setF(p=>({...p,state,district,zone}))
      setPinStatus(zone?'Location detected. State, District and BBBT Zone are auto-detected.':'State and District detected. BBBT Zone is not mapped for this location yet.')
    }catch{setPinStatus('Unable to detect location from this PIN right now.')}
  }
  const err=(k:string,label:string)=>errors[k]?<span className="field-error">{errors[k]}</span>:<span className="eyebrow" style={{fontSize:'.6rem'}}>{label}</span>
  function normalizeHandle(value:string){return value.trim().replace(/^@/,'').toLowerCase()}
  function normalizeEmail(value:string){return value.trim().toLowerCase()}
  function normalizeMobile(value:string){return value.replace(/\\D/g,'').replace(/^0/,'')}
  function checkAvailability(field:'handle'|'email'|'mobile',value:string){
    const normalized=field==='handle'?normalizeHandle(value):field==='email'?normalizeEmail(value):normalizeMobile(value)
    if(!normalized||(field==='email'&&!/^\\S+@\\S+\\.\\S+$/.test(normalized))||(field==='mobile'&&!/^\\d{10,12}$/.test(normalized)))return
    setAvailability(p=>({...p,[field]:'Checking availability…'}))
    window.setTimeout(()=>{
      const duplicate=duplicateField(field,value)
      setAvailability(p=>({...p,[field]:duplicate?'Already in use ✕':'Available ✓'}))
    },300)
  }
  function addPhoto(file?:File){
    if(!file)return
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){setPhotoPreview('');setPhotoName('');return}
    if(photoPreview)URL.revokeObjectURL(photoPreview)
    setPhotoPreview(URL.createObjectURL(file));setPhotoName(file.name)
  }
  function removePhoto(){if(photoPreview)URL.revokeObjectURL(photoPreview);setPhotoPreview('');setPhotoName('')}
  function emptyVehicle(index:number):PrototypeVehicle{return{id:`VEHICLE-${String(index+1).padStart(2,'0')}`,make:'',model:'',modelYear:'',currentKm:'',registration:'',fullBikePhoto:null,meterPhoto:null}}
  function updateVehicle(id:string,key:keyof PrototypeVehicle,value:string){setVehicles(list=>list.map(v=>v.id===id?{...v,[key]:value}:v))}
  function removeVehicle(id:string){setVehicles(list=>list.filter(v=>v.id!==id).map((v,i)=>({...v,id:`VEHICLE-${String(i+1).padStart(2,'0')}`})))}
  function addVehicle(){if(vehicles.length<5)setVehicles(list=>[...list,emptyVehicle(list.length)])}
  function addVehiclePhoto(id:string,key:'fullBikePhoto'|'meterPhoto',file?:File){if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)return;const reader=new FileReader();reader.onload=()=>setVehicles(list=>list.map(v=>v.id===id?{...v,[key]:{name:file.name,dataUrl:String(reader.result)}}:v));reader.readAsDataURL(file)}
  function removeVehiclePhoto(id:string,key:'fullBikePhoto'|'meterPhoto'){setVehicles(list=>list.map(v=>v.id===id?{...v,[key]:null}:v))}
  function normalizeRegistration(value:string){return value.toUpperCase().replace(/[^A-Z0-9]/g,'')}

  function validateStep(i:number){
    const e:Record<string,string>={}
    if(i===0){
      if(!f.fullName.trim())e.fullName='Required'
      if(!f.handle.trim())e.handle='Required'
      const m=f.mobile.trim()
      if(!m)e.mobile='Required'
      else if(!/^\+?[0-9][0-9\s-]{7,14}$/.test(m))e.mobile='Invalid mobile'
      if(f.email.trim()&&!/^\S+@\S+\.\S+$/.test(f.email.trim()))e.email='Invalid email'
      if(availability.handle==='Already in use ✕')e.handle='This handle is already registered'
      if(availability.email==='Already in use ✕')e.email='This email is already registered'
      if(availability.mobile==='Already in use ✕')e.mobile='This mobile number is already registered'
    }
    if(i===3){const registrations=vehicles.map(v=>normalizeRegistration(v.registration)).filter(Boolean);if(new Set(registrations).size!==registrations.length)e.vehicleRegistration='This registration number is already used for another vehicle in this application.'}
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
  function submit(ev:React.FormEvent){
    ev.preventDefault()
    if(step!==steps.length-1||!checked)return
    const dupes:Record<string,string>={}
    if(duplicateField('handle',f.handle))dupes.handle='This handle is already taken.'
    if(f.email.trim()&&duplicateField('email',f.email))dupes.email='This email address is already registered.'
    if(duplicateField('mobile',f.mobile))dupes.mobile='This mobile number is already registered.'
    if(Object.keys(dupes).length){setErrors(dupes);setStep(0);return}
    const submittedAt=new Date().toISOString()
    const status:Status=isAutoApproved(role)?'Approved':'Pending'
    const application={...f,vehicles,role,status,submittedAt,responsibilityAcknowledged:true}
    const applicationId=prototypeApplicationId(application)
    const identity:PrototypeIdentity={id:applicationId,applicationId,fullName:f.fullName.trim(),handle:f.handle.trim(),mobile:f.mobile.trim(),email:f.email.trim(),requestedRole:role,status,selectedLanguages:[f.language,...f.additionalLanguages],vehicles,createdAt:submittedAt}
    sessionStorage.setItem(applicationKey,JSON.stringify({...application,applicationId}))
    sessionStorage.setItem(identityKey,JSON.stringify(identity))
    saveIdentityToRegistry(identity)
    setDone(true)
  }
  function toggleLanguage(language:string){
    setF(p=>({ ...p, additionalLanguages:p.additionalLanguages.includes(language)?p.additionalLanguages.filter(x=>x!==language):p.additionalLanguages.length<2?[...p.additionalLanguages,language]:p.additionalLanguages }))
  }

  const initials=(f.fullName.trim()||'BB').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()
  const previewLocation=f.baseLocation.trim()||[f.city.trim(),f.state.trim()].filter(Boolean).join(', ')

  if(done){const approved=isAutoApproved(role);return <AuthFrame>
    <span className={`eyebrow ${approved?'green-text':'orange-text'}`}>{approved?'PROFILE CREATED & APPROVED':'APPLICATION SUBMITTED'}</span>
    <h1>{approved?<>Profile<br/><em>approved.</em></>:<>Application<br/><em>submitted.</em></>}</h1>
    <div className="status-detail">
      <span>Role applied for</span><strong>{role}</strong>
      <span>Application ID</span><strong>{JSON.parse(sessionStorage.getItem(applicationKey)||'{}').applicationId||'BBBT-PROTO-PENDING'}</strong><span>Application status</span><strong>{approved?'Approved':'Pending / Prototype'}</strong>
    </div>
    <p className="auth-lede">{approved?'Your BBBT profile has been created and approved. You can now log in.':'Your application has been submitted and is awaiting approval. You will be able to log in once it is approved.'}</p>
    <div className="su-note"><strong>This is a prototype.</strong> No payment is being taken and this registration does not represent live emergency coverage.</div>
    <Link className="btn btn-cyan" href="/login">GO TO LOGIN <ArrowRight size={16}/></Link>
    <p className="su-help">Need help with signup? <a href="mailto:help@bbbt.in">help@bbbt.in</a></p>
  </AuthFrame>}

  return <AuthFrame>
<Link className="auth-brand mobile-brand" href="/"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link>
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
        <div><small>Bike</small><p className={f.bikeMake.trim()?'':'muted'}>{[f.bikeMake,f.bikeModel].filter(Boolean).join(' ')||'Not added yet'}</p></div>
        <div><small>Rider role</small><p>{role}</p></div>
      </div>
    </div>}

    <form className="auth-form" onSubmit={submit}>
      {step===0&&<div className="su-step">
        <div className="form-grid">
          <label className={errors.fullName?'invalid':''}>FULL NAME (Required){errors.fullName&&<span className="field-error">{errors.fullName}</span>}<input value={f.fullName} onChange={set('fullName')} placeholder="Your full name"/></label>
          <label className={errors.handle?'invalid':''}>HANDLE (Required) {availability.handle&&<span className={availability.handle.includes('✕')?'field-error':'eyebrow'}>{availability.handle}</span>}<input value={f.handle} onChange={set('handle')} onBlur={()=>checkAvailability('handle',f.handle)} placeholder="@yourriderhandle"/></label>
        </div>
        <div className="profile-photo-control">
          <span className="profile-photo-label">Profile Picture (Optional)</span>
          {photoPreview?<div className="profile-photo-selected"><img src={photoPreview} alt="Profile preview"/><div><span className="su-file-row">{photoName}</span><button type="button" onClick={()=>document.getElementById('profile-photo-input')?.click()}>Change photo</button><button type="button" onClick={removePhoto}>Remove</button></div></div>:<div className="profile-photo-actions"><label className="btn btn-outline" htmlFor="profile-photo-input">Choose from Gallery / Files</label><label className="btn btn-outline" htmlFor="profile-camera-input">Open Camera</label></div>}
          <input id="profile-photo-input" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>addPhoto(e.target.files?.[0])}/>
          <input id="profile-camera-input" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={e=>addPhoto(e.target.files?.[0])}/>
          <small>JPG, JPEG, PNG or WEBP up to 5 MB. Preview-only in this prototype.</small>
        </div>
        <div className="form-grid">
          <label className={errors.mobile?'invalid':''}>MOBILE NUMBER (Required) {availability.mobile&&<span className={availability.mobile.includes('✕')?'field-error':'eyebrow'}>{availability.mobile}</span>}<input value={f.mobile} onChange={set('mobile')} onBlur={()=>checkAvailability('mobile',f.mobile)} inputMode="tel" placeholder="+91 mobile number"/></label>
          <label className={errors.email?'invalid':''}>EMAIL (Optional) {availability.email&&<span className={availability.email.includes('✕')?'field-error':'eyebrow'}>{availability.email}</span>}<input value={f.email} onChange={set('email')} onBlur={()=>checkAvailability('email',f.email)} type="email" placeholder="you@example.com"/></label>
        </div>
      </div>}

      {step===1&&<div className="su-step">
        <p className="auth-lede">We use language to keep safety and community information clear for you.</p>
        <label>PRIMARY LANGUAGE (Required)<select value={f.language} onChange={set('language')}>
          <option>English</option>
        </select></label>
        <fieldset className="language-options">
          <legend>ADDITIONAL REGIONAL LANGUAGES <span className="eyebrow">UP TO 2</span></legend>
          <p className="auth-lede" style={{margin:0}}>English is primary. Choose up to two additional languages. Translations are not yet live.</p>
          <div className="language-checks">
            {['Hindi','Bengali','Marathi','Telugu','Tamil','Gujarati','Kannada','Malayalam','Punjabi','Assamese','Odia'].map(language=><label key={language} className="language-check">
              <input type="checkbox" checked={f.additionalLanguages.includes(language)} onChange={()=>toggleLanguage(language)} disabled={!f.additionalLanguages.includes(language)&&f.additionalLanguages.length>=2}/><span>{language}</span>
            </label>)}
          </div>
        </fieldset>
      </div>}

      {step===2&&<div className="su-step">
        <label className={errors.baseLocation?'invalid':''}>BASE LOCATION (Required) {err('baseLocation','Required')}<input value={f.baseLocation} onChange={set('baseLocation')} placeholder="City / state you mostly ride from"/></label>
        <div className="form-grid">
          <label>ADDRESS (Optional)<input value={f.address} onChange={set('address')} placeholder="Street or locality"/></label>
          <label>CITY (Optional)<input value={f.city} onChange={set('city')} placeholder="City"/></label>
        </div>
        <div className="form-grid">
<label className="su-auto-field">DISTRICT (Auto-detected)<input value={f.district} readOnly aria-readonly="true" placeholder="Detected from PIN"/></label>
  <label className="su-auto-field">STATE / UNION TERRITORY (Auto-detected)<input value={f.state} readOnly aria-readonly="true" placeholder="Detected from PIN"/></label>
        </div>
        <div className="form-grid">
          <label className={errors.pin?'invalid':''}>PIN CODE (Optional) {err('pin','Optional')}<input value={f.pin} onChange={e=>lookupPin(e.target.value)} inputMode="numeric" maxLength={6} placeholder="6-digit PIN"/>{pinStatus&&<small className="su-pin-status">{pinStatus}</small>}</label>
          <label className="su-auto-field">BBBT ZONE (Auto-detected)<input value={f.zone} readOnly aria-readonly="true" placeholder="Detected from State + District"/></label>
        </div>
      </div>}

      {step===3&&<div className="su-step">
        <p className="auth-lede">YOUR VEHICLES (Optional). Add up to 5 vehicles. You can continue with zero.</p>
        {vehicles.map((vehicle,index)=><fieldset className="vehicle-card" key={vehicle.id}><legend>VEHICLE {String(index+1).padStart(2,'0')}</legend><div className="bike-grid"><label>BIKE COMPANY / MAKE (Optional)<input value={vehicle.make} onChange={e=>updateVehicle(vehicle.id,'make',e.target.value)} placeholder="Royal Enfield"/></label><label>BIKE MODEL (Optional)<input value={vehicle.model} onChange={e=>updateVehicle(vehicle.id,'model',e.target.value)} placeholder="Classic 350"/></label><label>BIKE MODEL YEAR (Optional)<input value={vehicle.modelYear} onChange={e=>updateVehicle(vehicle.id,'modelYear',e.target.value)} inputMode="numeric" placeholder="2024"/></label><label>CURRENT KM / ODOMETER (Optional)<input value={vehicle.currentKm} onChange={e=>updateVehicle(vehicle.id,'currentKm',e.target.value)} inputMode="numeric" placeholder="18,500"/></label><label>BIKE REGISTRATION / NUMBER PLATE (Optional)<input value={vehicle.registration} onChange={e=>updateVehicle(vehicle.id,'registration',e.target.value)} placeholder="UP32AB1234"/></label></div><div className="vehicle-photos"><VehiclePhoto label="PHOTO 1 — FULL BIKE + REGISTRATION NUMBER VISIBLE (Optional)" helper="For vehicle identity/reference." photo={vehicle.fullBikePhoto} onChange={file=>addVehiclePhoto(vehicle.id,'fullBikePhoto',file)} onRemove={()=>removeVehiclePhoto(vehicle.id,'fullBikePhoto')} inputId={`${vehicle.id}-full`}/><VehiclePhoto label="PHOTO 2 — METER / CONSOLE + KM READING VISIBLE (Optional)" helper="For current odometer/KM reference." photo={vehicle.meterPhoto} onChange={file=>addVehiclePhoto(vehicle.id,'meterPhoto',file)} onRemove={()=>removeVehiclePhoto(vehicle.id,'meterPhoto')} inputId={`${vehicle.id}-meter`}/></div><button type="button" className="text-button" onClick={()=>removeVehicle(vehicle.id)}>Remove vehicle</button></fieldset>)}{errors.vehicleRegistration&&<div className="su-step-error">{errors.vehicleRegistration}</div>}{vehicles.length<5?<button type="button" className="btn btn-outline" onClick={addVehicle}>+ ADD ANOTHER VEHICLE</button>:<p className="su-note">Maximum 5 vehicles can be added.</p>}</div>}

      {step===4&&<div className="su-step">
        <fieldset className="form-section">
          <legend>PRIVATE / SAFETY INFORMATION</legend>
          <p className="auth-lede" style={{margin:0}}>This stays private. It is never shown on your public rider identity.</p>
          <div className="form-grid">
            <label>EMERGENCY CONTACT NAME (Optional)<input value={f.ecName} onChange={set('ecName')} placeholder="Name and relationship"/></label>
            <label>EMERGENCY CONTACT NUMBER (Optional)<input value={f.ecNumber} onChange={set('ecNumber')} inputMode="tel" placeholder="+91 mobile number"/></label>
          </div>
          <label>YOUR BLOOD GROUP (Optional)<select value={f.blood} onChange={set('blood')}>
            <option value="">Select blood group</option>
            <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
          </select></label>
          <label>LATEST BLOOD GROUP TEST REPORT — LAST 1 MONTH (Optional)
            <input type="file" accept=".pdf,image/jpeg,image/png" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(!['application/pdf','image/jpeg','image/png'].includes(file.type)){e.currentTarget.value='';setF(p=>({...p,bloodReport:''}));return}if(file.size>5*1024*1024){e.currentTarget.value='';setF(p=>({...p,bloodReport:''}));return}setF(p=>({...p,bloodReport:file.name}))}}/>
            <small className="su-upload-note">Optional — not required to continue. PDF, JPG or PNG up to 5 MB. Stored locally for this prototype only.</small>
            {f.bloodReport&&<span className="su-file-row">{f.bloodReport}<button type="button" onClick={e=>{const input=e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement|null;if(input)input.value='';setF(p=>({...p,bloodReport:''}))}}>Clear</button></span>}
          </label>
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
          <label className={errors.groupName?'invalid':''}>RIDING GROUP / COMMUNITY NAME (Required) {err('groupName','Required')}<input value={f.groupName} onChange={set('groupName')} placeholder="Community name"/></label>
          <label className={errors.groupProfile?'invalid':''}>PUBLIC COMMUNITY PROFILE (Required) {err('groupProfile','Required')}<input value={f.groupProfile} onChange={set('groupProfile')} placeholder="Instagram, Facebook or URL"/></label>
          <div className="form-grid">
            <label>COMMUNITY SIZE (Optional)<input value={f.groupSize} onChange={set('groupSize')} inputMode="numeric" placeholder="Approximate riders"/></label>
            <label>COMMUNITY HANDLE (Optional)<input value={f.groupHandle} onChange={set('groupHandle')} placeholder="@communityhandle"/></label>
          </div>
        </fieldset>}

        {role==='Marshal'&&<fieldset className="form-section">
          <legend>MARSHAL EXPERIENCE</legend>
          <label>RIDING / MARSHAL EXPERIENCE (Optional)<textarea rows={3} value={f.marshalExp} onChange={set('marshalExp')} placeholder="Tell us about supporting rides or rider safety"/></label>
        </fieldset>}

        {role==='Founding Rider Council Member'&&<fieldset className="form-section">
          <legend>COUNCIL APPLICATION</legend>
          <div className="su-note su-verification-note"><strong>EMAIL VERIFICATION REQUIRED BEFORE COUNCIL ACCESS</strong><br/>This prototype does not verify email yet. Council access remains pending until verification is implemented.</div>
          <label className={errors.councilEmail?'invalid':''}>EMAIL (REQUIRED FOR COUNCIL REVIEW) {err('councilEmail','Required')}<input value={f.councilEmail} onChange={set('councilEmail')} type="email" placeholder="you@example.com"/></label>
          <div className="form-grid">
            <label>YEARS RIDING (Optional)<input value={f.councilYears} onChange={set('councilYears')} inputMode="numeric" placeholder="Years"/></label>
            <label>ORGANISED RIDES (Optional)<input value={f.councilRides} onChange={set('councilRides')} inputMode="numeric" placeholder="Approximate number"/></label>
          </div>
          <label className={errors.councilProfile?'invalid':''}>PUBLIC SOCIAL / COMMUNITY PROFILE (Required) {err('councilProfile','At least one required')}<input value={f.councilProfile} onChange={set('councilProfile')} placeholder="At least one public profile (up to five, LinkedIn optional)"/></label>
          <label>WHY DO YOU WANT TO CONTRIBUTE? (Optional)<textarea rows={3} value={f.councilWhy} onChange={set('councilWhy')} placeholder="Your rider intelligence, safety or product perspective"/></label>
          <label>CONFLICT OF INTEREST INFORMATION (Optional)<textarea rows={2} value={f.councilConflict} onChange={set('councilConflict')} placeholder="Optional disclosure"/></label>
        </fieldset>}
      </div>}

      {step===6&&<div className="su-step">
        <label>ANNUAL SAFETY BUDGET RESEARCH (Optional)<select value={f.budget} onChange={set('budget')}>
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
          <div><small>Email</small><p>{f.email.trim()||'Not added'}</p></div>
          <div><small>Profile Picture</small><p className={photoPreview?'':'muted'}>{photoPreview?'Added':'Not added'}</p></div>
          <div><small>Languages</small><p>{[f.language,...f.additionalLanguages].join(', ')}</p></div>
          <div><small>Base location</small><p className={previewLocation?'':'muted'}>{previewLocation||'Not added'}</p></div>
          <div><small>Vehicles</small><p className={vehicles.length?'':'muted'}>{vehicles.length?`${vehicles.length} vehicle${vehicles.length===1?'':'s'} added`:'Not added'}</p></div>
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
