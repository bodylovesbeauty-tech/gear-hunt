'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { applicationKey, dashboardFor, demoUsers, duplicateField, groupKey, identityKey, isAutoApproved, normEmail, normHandle, normMobile, prototypeApplicationId, readRegistry, saveIdentityToRegistry, sessionKey, type DemoUser, type PrototypeIdentity, type PrototypeVehicle, type Role, type Status } from '@/lib/prototype-session'
import { languages, readPreferences, savePreferences, type LanguageCode } from '@/lib/global-preferences'
import './signup-flow.css'

function VehiclePhoto({label,helper,photo,error,onChange,onRemove,inputId}:{label:string;helper:string;photo:{name:string;dataUrl:string}|null;error?:string;onChange:(file?:File)=>void;onRemove:()=>void;inputId:string}){return <div className="vehicle-photo"><b>{label}</b><small>{helper} JPG, JPEG, PNG or WEBP up to 5 MB.</small>{photo?<div className="vehicle-photo-preview"><img src={photo.dataUrl} alt={label}/><span>{photo.name}</span><button type="button" className="text-button" onClick={onRemove}>Remove</button></div>:<label className="btn btn-outline photo-picker" htmlFor={inputId}>CHOOSE FILE / CAMERA<input id={inputId} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>onChange(e.target.files?.[0])}/></label>}{error&&<span className="field-error" role="alert">{error}</span>}</div>}

function AuthFrame({children, eyebrow='BBBT ACCESS'}:{children:React.ReactNode;eyebrow?:string}){return <main className="auth-shell"><aside className="auth-visual"><Link href="/" className="auth-brand"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link><div className="auth-visual-copy"><span className="eyebrow cyan-text">RIDER WELFARE / TRUST INFRASTRUCTURE</span><h2>One account.<br/><em>Your role shapes the ride.</em></h2><p>A serious safety and community layer for India&apos;s riding communities.</p><div className="auth-visual-meta"><ShieldCheck aria-hidden="true"/><span>Prototype systems are clearly labelled before launch.</span></div></div></aside><section className="auth-panel"><div className="auth-card">{children}</div></section></main>}
function StatePage({status,role}:{status:Status;role:Role}){const copy={Pending:['Application Under Review','Your application is with the BBBT review team. We will share the next step after verification.'],Rejected:['Application Not Approved','Your current application was not approved. You may contact BBBT support if you believe this needs review.'],Suspended:['Account Suspended','Access is paused while BBBT reviews the account. Contact support for the next step.']}[status]||['',''];let identity:PrototypeIdentity|null=null;try{identity=JSON.parse(sessionStorage.getItem(identityKey)||'null')}catch{}return <AuthFrame eyebrow={`APPLICATION STATUS / ${status.toUpperCase()}`}><span className={`eyebrow ${status==='Pending'?'orange-text':'red-text'}`}>{status==='Pending'?'REVIEW IN PROGRESS':'ACCESS STATUS'}</span><h1>{copy[0]}</h1><p className="auth-lede">{status==='Pending'?'This is a prototype review state. Approval shown here is simulated and does not represent production approval.':copy[1]}</p><div className="status-detail">{identity&&<><span>Application ID</span><strong>{identity.applicationId}</strong><span>Submitted</span><strong>{new Date(identity.createdAt).toLocaleString()}</strong></>}<span>Role applied for</span><strong>{role}</strong><span>Application status</span><strong>{status}{status==='Pending'&&' / Prototype'}</strong></div>{status==='Pending'&&<p className="su-help">Need help with this prototype application? <a href="mailto:connect@bbbt.in">connect@bbbt.in</a></p>}<Link className="btn btn-cyan" href="/login">BACK TO LOGIN <ArrowRight size={16}/></Link></AuthFrame>}
export function UniversalLogin(){const [busy,setBusy]=useState(false);const [state,setState]=useState<{status:Status;role:Role}|null>(null);const [prototype,setPrototype]=useState<PrototypeIdentity|null>(null);const [loginId,setLoginId]=useState('');const [loginPwd,setLoginPwd]=useState('');const [loginError,setLoginError]=useState('');useEffect(()=>{const p=new URLSearchParams(window.location.search);const status=p.get('status') as Status|null;const role=p.get('role') as Role|null;if(status&&role)setState({status,role});try{setPrototype(JSON.parse(sessionStorage.getItem(identityKey)||'null'))}catch{}},[]);if(state)return <StatePage {...state}/>;const submit=()=>{const q=loginId.trim();if(!q){setLoginError('Enter your registered email or mobile number.');return}if(!loginPwd){setLoginError('Enter your prototype password.');return}const reg=readRegistry();const nEmail=normEmail(q);const nMobile=normMobile(q);const nHandle=normHandle(q);const identity=reg.find(u=>(u.email&&normEmail(u.email)===nEmail)||(nMobile&&u.mobile&&normMobile(u.mobile)===nMobile)||normHandle(u.handle)===nHandle);const demo=!identity?demoUsers.find(u=>normHandle(u.handle)===nHandle):undefined;if(!identity&&!demo){setLoginError('No registered BBBT identity was found for these details. Please sign up first.');return}setLoginError('');setBusy(true);if(identity){const approved=identity.status==='Approved';const user:DemoUser={id:identity.id,name:identity.fullName,handle:identity.handle,primaryRole:identity.requestedRole,approvedRoles:approved?[identity.requestedRole]:[],status:identity.status,referral:`BBBT.in/join/${normHandle(identity.handle)}`};if(approved){sessionStorage.setItem(sessionKey,JSON.stringify({user,activeRole:identity.requestedRole}));window.location.assign(dashboardFor(identity.requestedRole))}else window.location.assign(`/login?status=${identity.status}&role=${encodeURIComponent(identity.requestedRole)}`);return}sessionStorage.setItem(sessionKey,JSON.stringify({user:demo!,activeRole:demo!.approvedRoles[0]||demo!.primaryRole}));window.location.assign(demo!.status==='Approved'?dashboardFor(demo!.approvedRoles[0]||demo!.primaryRole):`/login?status=${demo!.status}&role=${encodeURIComponent(demo!.primaryRole)}`)};const review=(status:Status)=>{if(!prototype)return;const next={...prototype,status};const application=JSON.parse(sessionStorage.getItem(applicationKey)||'{}');sessionStorage.setItem(applicationKey,JSON.stringify({...application,status}));sessionStorage.setItem(identityKey,JSON.stringify(next));saveIdentityToRegistry(next);setPrototype(next);if(status==='Approved'){const user:DemoUser={id:next.id,name:next.fullName,handle:next.handle,primaryRole:next.requestedRole,approvedRoles:[next.requestedRole],status:'Approved',referral:`BBBT.in/join/${next.handle.replace('@','')}`};sessionStorage.setItem(sessionKey,JSON.stringify({user,activeRole:next.requestedRole}));window.location.assign(dashboardFor(next.requestedRole));}else window.location.assign(`/login?status=${status}&role=${encodeURIComponent(next.requestedRole)}`)};return <AuthFrame>{prototype&&<section className="prototype-review"><span className="eyebrow orange-text">PROTOTYPE REVIEW</span><p>This is a simulated prototype approval flow, not production approval.</p><div className="status-detail"><span>Application ID</span><strong>{prototype.applicationId}</strong><span>Applicant Name</span><strong>{prototype.fullName}</strong><span>Requested Role</span><strong>{prototype.requestedRole}</strong><span>Submitted</span><strong>{new Date(prototype.createdAt).toLocaleString()}</strong><span>Current Status</span><strong>{prototype.status}</strong></div><div><button type="button" className="btn btn-cyan" onClick={()=>review('Approved')}>APPROVE</button><button type="button" className="btn btn-outline" onClick={()=>review('Rejected')}>REJECT</button><button type="button" className="btn btn-outline" onClick={()=>review('Suspended')}>SUSPEND</button></div></section>}<Link className="auth-brand mobile-brand" href="/"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link><span className="eyebrow cyan-text">UNIVERSAL LOGIN / ONE ACCOUNT</span><h1>Welcome<br/><em>back.</em></h1><p className="auth-lede">Use one BBBT account for your rider, community and approved role access.</p><form className="auth-form" onSubmit={e=>{e.preventDefault();submit()}}><label>EMAIL OR MOBILE<input required value={loginId} onChange={e=>{setLoginId(e.target.value);setLoginError('')}} placeholder="Registered email or mobile number"/></label><label>PASSWORD<input required type="password" value={loginPwd} onChange={e=>setLoginPwd(e.target.value)} placeholder="Enter prototype password"/></label>{loginError&&<p className="field-error" role="alert">{loginError}</p>}<button className="btn btn-cyan" disabled={busy}>{busy?'AUTHENTICATING...':'LOGIN'} <ArrowRight size={16}/></button></form><div className="auth-links"><Link href="/signup">Create a BBBT account</Link><span>Prototype recovery flow</span></div>{prototype&&<section className="prototype-application"><span className="eyebrow orange-text">YOUR PROTOTYPE APPLICATION</span><p><b>Name:</b> {prototype.fullName}</p><p><b>Role:</b> {prototype.requestedRole}</p><p><b>Status:</b> {prototype.status.toUpperCase()}</p><p className="su-help">Application ID: {prototype.applicationId}</p><button className="btn btn-outline" type="button" onClick={()=>{setBusy(true);window.location.assign(`/login?status=${prototype.status}&role=${encodeURIComponent(prototype.requestedRole)}`)}}>CONTINUE <ArrowRight size={16}/></button></section>}{prototype&&<section className="prototype-review"><span className="eyebrow orange-text">PROTOTYPE REVIEW CONTROLS</span><p>DEMO / PROTOTYPE — changes apply only to this stored application.</p><div><button type="button" className="btn btn-cyan" onClick={()=>review('Approved')}>APPROVE</button><button type="button" className="btn btn-outline" onClick={()=>review('Rejected')}>REJECT</button><button type="button" className="btn btn-outline" onClick={()=>review('Suspended')}>SUSPEND</button></div></section>}</AuthFrame>}
export function UnifiedSignup(){
  const roleList:Role[]=['Rider','Group Admin','Group Marshal','Independent Marshal','Founding Rider Council Member','Investor']
  const descriptions:Record<Role,string>={
    Rider:'Join BBBT as a rider and participate in the rider safety ecosystem.',
    'Group Admin':'Create and manage eligible BBBT Groups and coordinate rides.',
    'Group Marshal':'Support BBBT Groups and rides in the Group Marshal role.',
    'Independent Marshal':'Join the independent Marshal network and support eligible rides.',
    Marshal:'Support safe, disciplined riding and community readiness.',
    'Founding Rider Council Member':'Apply to contribute to rider safety, governance, research and product development.',
    Investor:'Register for controlled investor information and access.',
  }
  const roleSelectionKey='bbbt-signup-role'
  const signupDraftKey='bbbt-signup-draft'
  const reportMetadataKey='bbbt-signup-report-metadata'
  const readDraftVehicles=():PrototypeVehicle[]=>{try{if(typeof window==='undefined')return [];const saved=JSON.parse(sessionStorage.getItem(signupDraftKey)||'null');return Array.isArray(saved?.vehicles)?saved.vehicles:[]}catch{return []}}
  const [roleChosen,setRoleChosen]=useState(false)
  const [languageChosen,setLanguageChosen]=useState(false)
  const [languageSearch,setLanguageSearch]=useState('')
  const languageOptions=languages.filter(option=>`${option.label} ${option.nativeLabel} ${option.code}`.toLowerCase().includes(languageSearch.toLowerCase()))
  const responsibilities:Partial<Record<Role,string[]>>={
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
  const signupBranchByRole:Record<Role,{key:string;title:string;eyebrow:string;description:string}>={
    Rider:{key:'rider',title:'RIDER PROFILE & SAFETY',eyebrow:'RIDER BRANCH',description:'Your rider profile and safety readiness will continue here.'},
    'Group Admin':{key:'groupAdmin',title:'GROUP ADMIN APPLICATION',eyebrow:'GROUP ADMIN BRANCH',description:'Your group administration details will continue here.'},
    'Group Marshal':{key:'groupMarshal',title:'GROUP MARSHAL APPLICATION',eyebrow:'GROUP MARSHAL BRANCH',description:'Your Group Marshal readiness and responsibilities will continue here.'},
    'Independent Marshal':{key:'independentMarshal',title:'INDEPENDENT MARSHAL APPLICATION',eyebrow:'INDEPENDENT MARSHAL BRANCH',description:'Your independent Marshal profile will continue here.'},
    'Founding Rider Council Member':{key:'frc',title:'FOUNDING RIDER COUNCIL APPLICATION',eyebrow:'FRC BRANCH',description:'Your council application details will continue here.'},
    Investor:{key:'investor',title:'INVESTOR APPLICATION',eyebrow:'INVESTOR BRANCH',description:'Your controlled investor access request will continue here.'},
  }
  const showVehicleStep=(selectedRole:Role)=>selectedRole==='Rider'

  const [done,setDone]=useState(false)
  const [draftReady,setDraftReady]=useState(false)
  const [role,setRole]=useState<Role>('Rider')
  const isInvestor=role==='Investor'
  const signupStepKeys=['identity',...(showVehicleStep(role)?['vehicle']:[]),'location',...(showVehicleStep(role)?['blood','bloodReport','emergencyContacts','responsibilities','safetySpending']:[]),...(role==='Rider'?[]:['branch']),...(isInvestor||role==='Rider'?[]:['safety']),'role','review','submit'] as const
  const stepLabels:Record<(typeof signupStepKeys)[number],string>={identity:'01 YOU',vehicle:'04 YOUR RIDE',location:'05 WHERE YOU RIDE',blood:'06 BLOOD GROUP',bloodReport:'07 LATEST BLOOD GROUP / LAB REPORT',emergencyContacts:'08 EMERGENCY CONTACTS',responsibilities:'09 RIDER RESPONSIBILITIES & TERMS',safetySpending:'10 SAFETY-SPENDING PREFERENCE',branch:'11 ROLE BRANCH',safety:'08 YOUR SAFETY',role:'09 YOUR ROLE',review:'11 REVIEW YOUR APPLICATION',submit:'12 SUBMIT APPLICATION'}
  const steps=signupStepKeys.map(key=>stepLabels[key])
  const activeSignupBranch=signupBranchByRole[role]
  const languageLabel=(code:string)=>languages.find(option=>option.code===code)?.label||code
  const languageOption=(code:string)=>languages.find(option=>option.code===code)
  useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem('bbbt-signup-languages')||'null');if(saved?.primaryCode){setF(previous=>({...previous,language:saved.primaryCode,additionalLanguages:saved.additionalCodes||[]}));if(!sessionStorage.getItem(signupDraftKey))setLanguageChosen(true)}}catch{}},[])
  useEffect(()=>{const requested=new URLSearchParams(window.location.search).get('role') as Role|null;let stored:Role|null=null;try{stored=sessionStorage.getItem(roleSelectionKey) as Role|null}catch{};const selected=requested&&roleList.includes(requested)?requested:stored&&roleList.includes(stored)?stored:null;if(selected){setRole(selected);try{if(sessionStorage.getItem(roleSelectionKey)||requested)setRoleChosen(true);const saved=JSON.parse(sessionStorage.getItem('bbbt-signup-languages')||'null');if(saved?.primaryCode)setLanguageChosen(true)}catch{}}},[])
  const [checked,setChecked]=useState(false)
  const [showResp,setShowResp]=useState(false)
  const [step,setStep]=useState(0)
  const currentStep=signupStepKeys[step]
  const roleStepIndex=(selectedRole:Role)=>{const keys=['identity',...(showVehicleStep(selectedRole)?['vehicle']:[]),'location',...(showVehicleStep(selectedRole)?['blood','bloodReport','emergencyContacts','responsibilities','safetySpending']:[]),...(selectedRole==='Rider'?[]:['branch']),...(selectedRole==='Investor'||selectedRole==='Rider'?[]:['safety']),'role','review'];return keys.indexOf(selectedRole==='Rider'?'safetySpending':'role')}
  const [errors,setErrors]=useState<Record<string,string>>({})
  const [pinStatus,setPinStatus]=useState('')
  const [photoPreview,setPhotoPreview]=useState('')
  const [photoName,setPhotoName]=useState('')
  const [bloodReportPreview,setBloodReportPreview]=useState('')
  const [bloodReportName,setBloodReportName]=useState('')
  const [availability,setAvailability]=useState<Record<string,string>>({})
  const [photoErrors,setPhotoErrors]=useState<Record<string,string>>({})
  const [vehicles,setVehicles]=useState<PrototypeVehicle[]>(readDraftVehicles)
  const [f,setF]=useState({
    fullName:'',handle:'',mobile:'',email:'',
    language:'en',
    additionalLanguages:[] as string[],
    baseLocation:'',address:'',city:'',district:'',state:'',pin:'',zone: '',
    bikeMake:'',bikeModel:'',bikeYear:'',bikeKm:'',bikeReg:'',
    ecName:'',ecNumber:'',ec1Name:'',ec1Number:'',ec1Relationship:'',ec2Name:'',ec2Number:'',ec2Relationship:'',blood:'',bloodReport:'',bloodReportDate:'',
    groupName:'',groupProfile:'',groupSize:'',groupHandle:'',
    marshalExp:'',
    councilEmail:'',councilYears:'',councilRides:'',councilProfile:'',councilWhy:'',councilConflict:'',
    budget:'',safetySpendingPreference:'',otherSafetyAmount:'',
  })
  const set=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setF(p=>({...p,[k]:e.target.value}))
  useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem(signupDraftKey)||'null');const report=JSON.parse(sessionStorage.getItem(reportMetadataKey)||'null');if(saved&&typeof saved==='object'){if(saved.f&&typeof saved.f==='object')setF(previous=>({...previous,...saved.f,additionalLanguages:Array.isArray(saved.f.additionalLanguages)?saved.f.additionalLanguages:previous.additionalLanguages}));if(Array.isArray(saved.vehicles))setVehicles(saved.vehicles);if(typeof saved.role==='string'&&roleList.includes(saved.role))setRole(saved.role);if(typeof saved.roleChosen==='boolean')setRoleChosen(saved.roleChosen);if(typeof saved.languageChosen==='boolean')setLanguageChosen(saved.languageChosen);if(typeof saved.step==='number')setStep(saved.step);if(typeof saved.checked==='boolean')setChecked(saved.checked);if(typeof saved.photoPreview==='string')setPhotoPreview(saved.photoPreview);if(typeof saved.photoName==='string')setPhotoName(saved.photoName)}if(report&&typeof report.name==='string')setBloodReportName(report.name)}catch{}finally{setDraftReady(true)}},[])
  useEffect(()=>{if(!draftReady)return;try{sessionStorage.setItem(signupDraftKey,JSON.stringify({f,vehicles,role,roleChosen,languageChosen,step,checked,photoPreview,photoName}));sessionStorage.setItem(reportMetadataKey,JSON.stringify({name:bloodReportName,status:bloodReportName?'Uploaded':'Not uploaded',updatedAt:bloodReportName?new Date().toISOString():null}))}catch{}},[draftReady,f,vehicles,role,roleChosen,languageChosen,step,checked,photoPreview,photoName,bloodReportName])
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
  function normalizeMobile(value:string){return normMobile(value)}
  function maskContact(value:string){const compact=value.replace(/\s|-/g,'');return compact.length>4?`${compact.slice(0,2)}••••${compact.slice(-4)}`:'••••'}
  function checkAvailability(field:'handle'|'email'|'mobile',value:string){
    const normalized=field==='handle'?normalizeHandle(value):field==='email'?normalizeEmail(value):normalizeMobile(value)
    if(!normalized||(field==='email'&&!/^\S+@\S+\.\S+$/.test(normalized))||(field==='mobile'&&!/^\d{10,12}$/.test(normalized)))return
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
  function addBloodReport(file?:File){if(!file)return;const extension=file.name.toLowerCase().split('.').pop()||'';const allowed=['application/pdf','image/jpeg','image/png'];const allowedExtension=['pdf','jpg','jpeg','png'].includes(extension);if((!allowed.includes(file.type)&&!allowedExtension)||file.size>5*1024*1024){setBloodReportPreview('');setBloodReportName('');try{sessionStorage.removeItem(reportMetadataKey)}catch{};return}const reader=new FileReader();reader.onload=()=>{setBloodReportPreview(String(reader.result));setBloodReportName(file.name);try{sessionStorage.setItem(reportMetadataKey,JSON.stringify({name:file.name,status:'Uploaded',updatedAt:new Date().toISOString()}))}catch{}};reader.readAsDataURL(file)}
  function removeBloodReport(){setBloodReportPreview('');setBloodReportName('')}
  function emptyVehicle(index:number):PrototypeVehicle{return{id:`VEHICLE-${String(index+1).padStart(2,'0')}`,make:'',model:'',modelYear:'',currentKm:'',registration:'',fullBikePhoto:null,meterPhoto:null}}
  function updateVehicle(id:string,key:keyof PrototypeVehicle,value:string){setVehicles(list=>list.map(v=>v.id===id?{...v,[key]:value}:v))}
  function removeVehicle(id:string){setVehicles(list=>list.filter(v=>v.id!==id).map((v,i)=>({...v,id:`VEHICLE-${String(i+1).padStart(2,'0')}`})))}
  function addVehicle(){if(vehicles.length<5)setVehicles(list=>[...list,emptyVehicle(list.length)])}
  useEffect(()=>{if(currentStep==='vehicle'&&showVehicleStep(role)&&vehicles.length===0)addVehicle()},[currentStep,role,vehicles.length])
  async function addVehiclePhoto(id:string,key:'fullBikePhoto'|'meterPhoto',file?:File){
    const errorKey=`${id}-${key}`
    if(!file)return
    const extension=file.name.toLowerCase().split('.').pop()||''
    const allowedType=['image/jpeg','image/png','image/webp'].includes(file.type)
    const allowedExtension=['jpg','jpeg','png','webp'].includes(extension)
    if((!allowedType&&!allowedExtension)||file.size>5*1024*1024){setPhotoErrors(previous=>({...previous,[errorKey]:'Use a JPG, PNG or WEBP image up to 5 MB.'}));return}
    setPhotoErrors(previous=>{const next={...previous};delete next[errorKey];return next})
    try{
      const mime=file.type||({'jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png','webp':'image/webp'} as Record<string,string>)[extension]||'application/octet-stream'
  if(typeof file.arrayBuffer==='function'){
    const bytes=new Uint8Array(await file.arrayBuffer())
    let binary=''
    const chunkSize=0x8000
    for(let offset=0;offset<bytes.length;offset+=chunkSize)binary+=String.fromCharCode(...bytes.subarray(offset,offset+chunkSize))
    const dataUrl=`data:${mime};base64,${btoa(binary)}`
    setVehicles(list=>list.map(vehicle=>vehicle.id===id?{...vehicle,[key]:{name:file.name,dataUrl}}:vehicle))
    return
  }
  const reader=new FileReader()
  reader.onload=()=>{const dataUrl=String(reader.result||'');if(!dataUrl.startsWith('data:image/')){setPhotoErrors(previous=>({...previous,[errorKey]:'This image could not be read. Please choose it again.'}));return}setVehicles(list=>list.map(vehicle=>vehicle.id===id?{...vehicle,[key]:{name:file.name,dataUrl}}:vehicle))}
  reader.onerror=()=>setPhotoErrors(previous=>({...previous,[errorKey]:'This image could not be read. Please choose it again.'}))
  reader.readAsDataURL(file)
    }catch{setPhotoErrors(previous=>({...previous,[errorKey]:'This image could not be read. Please choose it again.'}))}
  }
  function removeVehiclePhoto(id:string,key:'fullBikePhoto'|'meterPhoto'){setVehicles(list=>list.map(vehicle=>vehicle.id===id?{...vehicle,[key]:null}:vehicle));setPhotoErrors(previous=>{const next={...previous};delete next[`${id}-${key}`];return next})}
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
    if(currentStep==='vehicle'&&showVehicleStep(role)){const registrations=vehicles.map(v=>normalizeRegistration(v.registration)).filter(Boolean);if(new Set(registrations).size!==registrations.length)e.vehicleRegistration='This registration number is already used for another vehicle in this application.'}
    if(currentStep==='location'){
      if(!f.baseLocation.trim())e.baseLocation='Required'
      if(f.pin.trim()&&!/^[0-9]{6}$/.test(f.pin.trim()))e.pin='Invalid PIN'
    }
    if(currentStep==='blood'&&role==='Rider'&&!f.blood)e.blood='Select your blood group'
    if(currentStep==='emergencyContacts'&&role==='Rider'){
      const contacts=[{name:f.ec1Name,number:f.ec1Number,relationship:f.ec1Relationship},{name:f.ec2Name,number:f.ec2Number,relationship:f.ec2Relationship}]
      contacts.forEach((contact,index)=>{const prefix=`ec${index+1}`;if(!contact.name.trim())e[`${prefix}Name`]='Full name is required';if(!contact.number.trim())e[`${prefix}Number`]='Mobile number is required';else if(!/^\+?[0-9][0-9\s-]{7,14}$/.test(contact.number.trim()))e[`${prefix}Number`]='Invalid mobile';if(!contact.relationship.trim())e[`${prefix}Relationship`]='Relationship is required'})
    }
    if(currentStep==='responsibilities'&&role==='Rider'&&!checked)e.consent='You must agree before continuing'
    if(currentStep==='safetySpending'&&role==='Rider'&&f.safetySpendingPreference==='Other Amount'&&f.otherSafetyAmount&&!/^\d+$/.test(f.otherSafetyAmount.trim()))e.otherSafetyAmount='Enter a numeric amount'
    if(currentStep==='bloodReport'&&role==='Rider'){
      if(!f.bloodReportDate)e.bloodReportDate='Report date is required'
      else {const reportDate=new Date(`${f.bloodReportDate}T00:00:00`);const now=new Date();const oldest=new Date(now);oldest.setMonth(now.getMonth()-1);if(Number.isNaN(reportDate.getTime())||reportDate>now)e.bloodReportDate='Report date cannot be in the future';else if(reportDate<oldest)e.bloodReportDate='Report must be from within the last 1 month'}
      if(!bloodReportPreview)e.bloodReport='Upload your latest report'
    }
    if(currentStep==='review'&&role==='Rider'){
      if(!f.blood)e.blood='Select your blood group before submitting'
      if(!bloodReportPreview)e.bloodReport='Upload your latest report before submitting'
      if(!f.bloodReportDate)e.bloodReportDate='Report date is required before submitting'
      if(!f.ec1Name.trim())e.ec1Name='Full name is required'
      if(!f.ec1Number.trim())e.ec1Number='Mobile number is required'
      if(!f.ec1Relationship.trim())e.ec1Relationship='Relationship is required'
      if(!f.ec2Name.trim())e.ec2Name='Full name is required'
      if(!f.ec2Number.trim())e.ec2Number='Mobile number is required'
      if(!f.ec2Relationship.trim())e.ec2Relationship='Relationship is required'
      if(!checked)e.consent='You must acknowledge the Rider Terms before submitting'
    }
    if(currentStep==='branch'&&role==='Group Admin'){
      if(!f.groupName.trim())e.groupName='Community name is required'
      if(!f.groupProfile.trim())e.groupProfile='Public profile is required'
    }
    if(currentStep==='role'){
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
  function editStep(key:string){const target=signupStepKeys.indexOf(key as (typeof signupStepKeys)[number]);if(target>=0){setErrors({});setStep(target)}}
  function acknowledge(){setChecked(true);setShowResp(false)}
  function submit(ev:React.FormEvent){
    ev.preventDefault()
    if(currentStep!=='submit'||role==='Rider'&&!checked)return
    const reviewErrors=validateStep(signupStepKeys.indexOf('review'))
    if(Object.keys(reviewErrors).length){setErrors(reviewErrors);return}
    const dupes:Record<string,string>={}
    if(duplicateField('handle',f.handle))dupes.handle='This handle is already taken.'
    if(f.email.trim()&&duplicateField('email',f.email))dupes.email='This email address is already registered.'
    if(duplicateField('mobile',f.mobile))dupes.mobile='This mobile number is already registered.'
    if(Object.keys(dupes).length){setErrors(dupes);setStep(0);return}
    const submittedAt=new Date().toISOString()
    const status:Status=isAutoApproved(role)?'Approved':'Pending'
    const safetyPreference=role==='Rider'?{selectedRange:f.safetySpendingPreference&&f.safetySpendingPreference!=='Other Amount'?f.safetySpendingPreference:null,otherAmount:f.safetySpendingPreference==='Other Amount'&&f.otherSafetyAmount?Number(f.otherSafetyAmount):null,skipped:!f.safetySpendingPreference,role:'Rider' as const,recordedAt:submittedAt}:null
    if(typeof window!=='undefined'&&role==='Rider')window.dispatchEvent(new CustomEvent('bbbt:safety-spending-preference',{detail:safetyPreference}))
    const application={...f,safetySpendingPreference:safetyPreference,vehicles,role,status,submittedAt,responsibilityAcknowledged:true,termsConsent:role==='Rider'?{accepted:true,version:'BBBT-RIDER-RESPONSIBILITIES-2026-09-05',acceptedAt:submittedAt,role:'Rider' as const}:undefined}
    const applicationId=prototypeApplicationId(application)
          const identity:PrototypeIdentity={id:applicationId,applicationId,fullName:f.fullName.trim(),handle:f.handle.trim(),mobile:f.mobile.trim(),email:f.email.trim(),requestedRole:role,status,selectedLanguages:[f.language,...f.additionalLanguages],vehicles,groupName:role==='Group Admin'?f.groupName.trim():undefined,groupProfile:role==='Group Admin'?f.groupProfile.trim():undefined,groupSize:role==='Group Admin'?f.groupSize.trim():undefined,groupHandle:role==='Group Admin'?f.groupHandle.trim():undefined,profilePhoto:photoPreview?{name:photoName,dataUrl:photoPreview}:null,address:f.address.trim(),city:f.city.trim(),state:f.state.trim(),district:f.district.trim(),pinCode:f.pin.trim(),bbbtZone:f.zone.trim(),emergencyName:role==='Rider'?f.ec1Name.trim():undefined,emergencyNumber:role==='Rider'?f.ec1Number.trim():undefined,emergencyContacts:role==='Rider'?[{fullName:f.ec1Name.trim(),mobile:f.ec1Number.trim(),relationship:f.ec1Relationship.trim()},{fullName:f.ec2Name.trim(),mobile:f.ec2Number.trim(),relationship:f.ec2Relationship.trim()}]:undefined,bloodGroup:role==='Rider'?f.blood.trim():undefined,bloodReport:role==='Rider'&&bloodReportPreview?{name:bloodReportName,dataUrl:bloodReportPreview,reportDate:f.bloodReportDate,uploadedAt:submittedAt,status:'REPORT UPLOADED'}:null,termsConsent:role==='Rider'?{accepted:true,version:'BBBT-RIDER-RESPONSIBILITIES-2026-09-05',acceptedAt:submittedAt,role:'Rider'}:undefined,safetySpendingPreference:safetyPreference,createdAt:submittedAt}
    sessionStorage.setItem(applicationKey,JSON.stringify({...application,applicationId}))
    sessionStorage.setItem(identityKey,JSON.stringify(identity))
    saveIdentityToRegistry(identity)
    if(role==='Group Admin'){
      const groupHandle=normalizeHandle(f.groupHandle)||normalizeHandle(f.handle)
      sessionStorage.setItem(groupKey,JSON.stringify({id:`BBBT-GRP-${applicationId.slice(-8)}`,name:f.groupName.trim(),createdAt:submittedAt,cycleStart:submittedAt,cycleEnd:new Date(Date.now()+90*24*60*60*1000).toISOString(),adminId:identity.id,members:[{id:identity.id,name:identity.fullName,handle:identity.handle,role:'Group Admin',joinedAt:submittedAt}],elections:[],rides:[],notifications:[],shareToken:groupHandle.toUpperCase(),image:null,status:'ACTIVE',permanent:true,capabilities:[{role:'Group Admin',scope:'DISTRICT',actions:['CREATE_GROUP','MANAGE_GROUP','CREATE_RIDE'],approval:'APPROVED'}],description:f.groupProfile.trim(),groupSize:f.groupSize.trim(),groupHandle:f.groupHandle.trim()}))
    }
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
    <p className="su-help">Need help with signup? <a href="mailto:connect@bbbt.in">connect@bbbt.in</a></p>
  </AuthFrame>}

  if(!roleChosen)return <AuthFrame>
    <Link className="auth-brand mobile-brand" href="/"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link>
    <span className="eyebrow cyan-text">UNIVERSAL SIGNUP / STEP 1</span>
    <h1>What are you joining<br/><em>BBBT as?</em></h1>
    <p className="auth-lede">Choose how you want to participate in the BBBT ecosystem.</p>
    <div className="signup-role-grid" role="radiogroup" aria-label="Choose your BBBT signup role">{roleList.map(option=><button key={option} type="button" className={`signup-role-card ${role===option?'is-selected':''}`} role="radio" aria-checked={role===option} onClick={()=>setRole(option)}><span className="signup-role-name">{option}</span><span className="signup-role-description">{descriptions[option]}</span><span className="signup-role-check" aria-hidden="true">{role===option?'SELECTED':'SELECT'}</span></button>)}</div>
    <button type="button" className="btn btn-cyan signup-role-continue" onClick={()=>{try{sessionStorage.setItem(roleSelectionKey,role)}catch{};setRoleChosen(true)}}>CONTINUE <ArrowRight size={16}/></button>
  </AuthFrame>

  if(roleChosen&&!languageChosen)return <AuthFrame>
    <Link className="auth-brand mobile-brand" href="/"><img src="/bbbt-logo-red.png" alt="BBBT"/></Link>
    <span className="eyebrow cyan-text">UNIVERSAL SIGNUP / STEP 2</span>
    <h1>LANGUAGE<br/><em>PREFERENCES</em></h1>
    <p className="auth-lede">Choose your preferred language for the BBBT ecosystem and Voice Assistant.</p>
    <div className="language-step-card">
      <label>PRIMARY LANGUAGE <span className="field-hint">Required</span><select value={f.language} onChange={event=>setF(previous=>({...previous,language:event.target.value,additionalLanguages:previous.additionalLanguages.filter(item=>item!==event.target.value)}))} aria-label="Primary language">{languages.map(option=><option key={option.code} value={option.code}>{option.label} — {option.nativeLabel} · {option.code}</option>)}</select></label>
      <fieldset className="language-options"><legend><span>ADDITIONAL LANGUAGES</span><strong>{f.additionalLanguages.length} / 2 SELECTED</strong></legend><p className="auth-lede language-helper">Choose up to 2 additional languages.</p><label className="language-search"><span className="sr-only">Search languages</span><input value={languageSearch} onChange={event=>setLanguageSearch(event.target.value)} placeholder="Search by English name, native name or code" type="search"/></label><div className="language-checks searchable-language-list">{languageOptions.filter(option=>option.code!==f.language).map(option=><label key={option.code} className="language-check"><input type="checkbox" checked={f.additionalLanguages.includes(option.code)} onChange={()=>toggleLanguage(option.code)} disabled={!f.additionalLanguages.includes(option.code)&&f.additionalLanguages.length>=2}/><span><strong>{option.label}</strong><small>{option.nativeLabel} · {option.code}</small></span></label>)}{languageOptions.length===0&&<p className="auth-lede">No languages match your search.</p>}</div></fieldset>
    </div>
    <div className="selected-language-summary" aria-live="polite"><span>LANGUAGES SELECTED</span><strong>{1+f.additionalLanguages.length} / 3</strong><small>{[f.language,...f.additionalLanguages].map(languageLabel).join(' · ')}</small></div>
    <button type="button" className="btn btn-cyan" onClick={()=>{try{sessionStorage.setItem('bbbt-signup-languages',JSON.stringify({primaryCode:f.language,additionalCodes:f.additionalLanguages}));savePreferences({...readPreferences(),language:f.language as LanguageCode})}catch{};setLanguageChosen(true)}}>CONTINUE <ArrowRight size={16}/></button>
  </AuthFrame>

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
      {currentStep==='identity'&&<div className="su-step">
        <div className="form-grid">
          <label className={errors.fullName?'invalid':''}>FULL NAME (Required){errors.fullName&&<span className="field-error" role="alert">{errors.fullName}</span>}<input value={f.fullName} onChange={set('fullName')} placeholder="Your full name" aria-required="true"/></label>
          <label className={errors.handle?'invalid':''}>HANDLE / USERNAME (Required) {availability.handle&&<span className={availability.handle.includes('��')?'field-error':'eyebrow'}>{availability.handle}</span>}<input value={f.handle} onChange={set('handle')} onBlur={()=>checkAvailability('handle',f.handle)} placeholder="@yourriderhandle" aria-required="true"/>{errors.handle&&<span className="field-error" role="alert">{errors.handle}</span>}</label>
        </div>
        <div className="form-grid">
          <label className={errors.mobile?'invalid':''}>MOBILE NUMBER (Required) {availability.mobile&&<span className={availability.mobile.includes('✕')?'field-error':'eyebrow'}>{availability.mobile}</span>}<input value={f.mobile} onChange={set('mobile')} onBlur={()=>checkAvailability('mobile',f.mobile)} inputMode="tel" placeholder="+91 mobile number" aria-required="true"/>{errors.mobile&&<span className="field-error" role="alert">{errors.mobile}</span>}</label>
          <label className={errors.email?'invalid':''}>EMAIL (Optional) {availability.email&&<span className={availability.email.includes('✕')?'field-error':'eyebrow'}>{availability.email}</span>}<input value={f.email} onChange={set('email')} onBlur={()=>checkAvailability('email',f.email)} type="email" placeholder="you@example.com" aria-required="false"/>{errors.email&&<span className="field-error" role="alert">{errors.email}</span>}</label>
        </div>
        <div className="profile-photo-control">
          <span className="profile-photo-label">PROFILE PHOTO <span className="field-hint">Optional</span></span>
          {photoPreview?<div className="profile-photo-selected"><img src={photoPreview} alt="Profile preview"/><div><span className="su-file-row">{photoName}</span><button type="button" onClick={()=>document.getElementById('profile-photo-input')?.click()}>Change photo</button><button type="button" onClick={removePhoto}>Remove</button></div></div>:<div className="profile-photo-actions"><label className="btn btn-outline" htmlFor="profile-photo-input">Choose from Gallery / Files</label><label className="btn btn-outline" htmlFor="profile-camera-input">Open Camera</label></div>}
          <input id="profile-photo-input" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>addPhoto(e.target.files?.[0])}/>
          <input id="profile-camera-input" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={e=>addPhoto(e.target.files?.[0])}/>
          <small>JPG, JPEG, PNG or WEBP up to 5 MB. Optional; preview-only in this prototype.</small>
        </div>
        <p className="su-note identity-privacy-note">Your account information is used to create your BBBT identity and support authorized ecosystem services. <Link href="/privacy">Privacy</Link></p>
      </div>}


      {currentStep==='location'&&<div className="su-step">
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

      {currentStep==='vehicle'&&<div className="su-step">
        <p className="auth-lede">YOUR RIDE</p><p className="su-note">Add the vehicle you currently ride with BBBT. You can manage additional vehicles after login.</p>
        {vehicles.slice(0,1).map((vehicle,index)=><fieldset className="vehicle-card" key={vehicle.id}><legend>VEHICLE {String(index+1).padStart(2,'0')}</legend>{[vehicle.make,vehicle.model,vehicle.modelYear,vehicle.currentKm,vehicle.registration].some(value=>value.trim())&&<span className="vehicle-primary-badge">PRIMARY VEHICLE ADDED</span>}<div className="bike-grid"><label>BIKE COMPANY / MAKE (Optional)<input value={vehicle.make} onChange={e=>updateVehicle(vehicle.id,'make',e.target.value)} placeholder="Royal Enfield"/></label><label>BIKE MODEL (Optional)<input value={vehicle.model} onChange={e=>updateVehicle(vehicle.id,'model',e.target.value)} placeholder="Classic 350"/></label><label>BIKE MODEL YEAR (Optional)<input value={vehicle.modelYear} onChange={e=>updateVehicle(vehicle.id,'modelYear',e.target.value)} inputMode="numeric" placeholder="2024"/></label><label>CURRENT KM / ODOMETER (Optional)<input value={vehicle.currentKm} onChange={e=>updateVehicle(vehicle.id,'currentKm',e.target.value)} inputMode="numeric" placeholder="18,500"/></label><label>BIKE REGISTRATION / NUMBER PLATE (Optional)<input value={vehicle.registration} onChange={e=>updateVehicle(vehicle.id,'registration',e.target.value)} placeholder="UP32AB1234"/></label></div><div className="vehicle-photos"><VehiclePhoto label="PHOTO 1 — FULL BIKE + REGISTRATION NUMBER VISIBLE (Optional)" helper="For vehicle identity/reference." photo={vehicle.fullBikePhoto} error={photoErrors[`${vehicle.id}-fullBikePhoto`]} onChange={file=>addVehiclePhoto(vehicle.id,'fullBikePhoto',file)} onRemove={()=>removeVehiclePhoto(vehicle.id,'fullBikePhoto')} inputId={`${vehicle.id}-full`}/><VehiclePhoto label="PHOTO 2 — METER / CONSOLE + KM READING VISIBLE (Optional)" helper="For current odometer/KM reference." photo={vehicle.meterPhoto} error={photoErrors[`${vehicle.id}-meterPhoto`]} onChange={file=>addVehiclePhoto(vehicle.id,'meterPhoto',file)} onRemove={()=>removeVehiclePhoto(vehicle.id,'meterPhoto')} inputId={`${vehicle.id}-meter`}/></div><button type="button" className="text-button" onClick={()=>removeVehicle(vehicle.id)}>Remove vehicle</button></fieldset>)}{errors.vehicleRegistration&&<div className="su-step-error">{errors.vehicleRegistration}</div>}{false?<button type="button" className="btn btn-outline" onClick={addVehicle}>+ ADD ANOTHER VEHICLE</button>:<p className="su-note">Maximum 5 vehicles can be added.</p>}</div>}

      {currentStep==='blood'&&role==='Rider'&&<div className="su-step">
        <span className="eyebrow cyan-text">RIDER SAFETY PROFILE</span>
        <h2>BLOOD GROUP</h2>
        <p className="auth-lede">Your blood group helps BBBT prepare authorized safety and emergency support information.</p>
        <label className={errors.blood?'invalid':''}>BLOOD GROUP <span className="field-hint">Required</span><select value={f.blood} onChange={set('blood')} aria-required="true" aria-describedby="blood-group-note"><option value="">Select blood group</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select>{errors.blood&&<span className="field-error" role="alert">{errors.blood}</span>}</label>
        <p id="blood-group-note" className="su-note"><strong>Self-reported blood group.</strong> Do not treat this as a substitute for hospital blood typing/cross-match.</p>
      </div>}

      {currentStep==='bloodReport'&&role==='Rider'&&<div className="su-step">
        <span className="eyebrow cyan-text">RIDER SAFETY PROFILE</span>
        <h2>LATEST BLOOD GROUP / LAB REPORT</h2>
        <p className="auth-lede">Upload your latest blood-group/lab report from within the last 1 month.</p>
        <label className={errors.bloodReportDate?'invalid':''}>REPORT DATE <span className="field-hint">Required</span><input type="date" value={f.bloodReportDate} max={new Date().toISOString().slice(0,10)} onChange={set('bloodReportDate')} aria-required="true" />{errors.bloodReportDate&&<span className="field-error" role="alert">{errors.bloodReportDate}</span>}</label>
        <label className={errors.bloodReport?'invalid':''}>UPLOAD REPORT <span className="field-hint">Required · PDF, JPG, JPEG or PNG · Max 5 MB</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e=>addBloodReport(e.currentTarget.files?.[0])} onInput={e=>addBloodReport(e.currentTarget.files?.[0])} aria-required="true" />{bloodReportName&&<span className="su-file-row">{bloodReportName}<button type="button" onClick={removeBloodReport}>Remove</button></span>}{errors.bloodReport&&<span className="field-error" role="alert">{errors.bloodReport}</span>}</label>
        {bloodReportName&&<div className="su-report-status"><strong>REPORT UPLOADED</strong><span>{bloodReportName} · {f.bloodReportDate||'Date pending'}</span></div>}{bloodReportPreview&&bloodReportName.match(/\.(jpg|jpeg|png)$/i)&&<img className="su-report-preview" src={bloodReportPreview} alt="Blood group report preview" />}
        <p className="su-note"><strong>REPORT UPLOADED</strong> status will be stored with your profile. Uploading a report does not mean BBBT has medically verified your blood group. Do not treat this as a substitute for hospital blood typing/cross-match.</p>
      </div>}

      {currentStep==='emergencyContacts'&&role==='Rider'&&<div className="su-step">
        <span className="eyebrow cyan-text">RIDER SAFETY PROFILE</span>
        <h2>EMERGENCY CONTACTS</h2>
        <p className="auth-lede">Add trusted contacts who may be reached if you need help during an emergency.</p>
        <fieldset className="form-section"><legend>EMERGENCY CONTACT 1</legend><div className="form-grid"><label className={errors.ec1Name?'invalid':''}>FULL NAME <span className="field-hint">Required</span><input value={f.ec1Name} onChange={set('ec1Name')} autoComplete="off" />{errors.ec1Name&&<span className="field-error" role="alert">{errors.ec1Name}</span>}</label><label className={errors.ec1Number?'invalid':''}>MOBILE NUMBER <span className="field-hint">Required</span><input value={f.ec1Number} onChange={set('ec1Number')} inputMode="tel" placeholder="+91 mobile number" autoComplete="off" />{errors.ec1Number&&<span className="field-error" role="alert">{errors.ec1Number}</span>}</label></div><label className={errors.ec1Relationship?'invalid':''}>RELATIONSHIP <span className="field-hint">Required</span><input value={f.ec1Relationship} onChange={set('ec1Relationship')} placeholder="Parent, partner, sibling or trusted contact" autoComplete="off" />{errors.ec1Relationship&&<span className="field-error" role="alert">{errors.ec1Relationship}</span>}</label></fieldset>
        <fieldset className="form-section"><legend>EMERGENCY CONTACT 2</legend><div className="form-grid"><label className={errors.ec2Name?'invalid':''}>FULL NAME <span className="field-hint">Required</span><input value={f.ec2Name} onChange={set('ec2Name')} autoComplete="off" />{errors.ec2Name&&<span className="field-error" role="alert">{errors.ec2Name}</span>}</label><label className={errors.ec2Number?'invalid':''}>MOBILE NUMBER <span className="field-hint">Required</span><input value={f.ec2Number} onChange={set('ec2Number')} inputMode="tel" placeholder="+91 mobile number" autoComplete="off" />{errors.ec2Number&&<span className="field-error" role="alert">{errors.ec2Number}</span>}</label></div><label className={errors.ec2Relationship?'invalid':''}>RELATIONSHIP <span className="field-hint">Required</span><input value={f.ec2Relationship} onChange={set('ec2Relationship')} placeholder="Parent, partner, sibling or trusted contact" autoComplete="off" />{errors.ec2Relationship&&<span className="field-error" role="alert">{errors.ec2Relationship}</span>}</label></fieldset>
        <p className="su-note"><strong>PRIVATE</strong> Emergency contacts are used for authorized safety and emergency communication purposes.</p>
      </div>}

      {currentStep==='responsibilities'&&role==='Rider'&&<div className="su-step su-terms-step">
        <span className="eyebrow cyan-text">RIDER ACCOUNT TERMS</span>
        <h2>RIDER RESPONSIBILITIES &amp; TERMS</h2>
        <p className="auth-lede">Please review the responsibilities that apply to your BBBT account.</p>
        <ul className="su-terms-summary">
          <li>Provide accurate account information.</li>
          <li>Use BBBT responsibly and follow applicable riding and safety laws.</li>
          <li>Respect riders and community members.</li>
          <li>Do not misuse SOS or emergency systems.</li>
          <li>Do not misuse another user&apos;s information.</li>
          <li>Understand prototype and future-feature limitations.</li>
          <li>Emergency services remain authoritative.</li>
          <li>Do not misuse BBBT groups, rides or governance.</li>
          <li>Use the platform in accordance with BBBT rules.</li>
        </ul>
        <Link href="/terms" className="su-terms-link">READ FULL TERMS &amp; CONDITIONS <ArrowRight size={15} aria-hidden="true" /></Link>
        <label className="consent-row su-terms-consent"><input type="checkbox" checked={checked} onChange={event=>setChecked(event.target.checked)} aria-describedby="rider-terms-consent-note"/><span>I agree to the BBBT Rider Responsibilities, Terms &amp; Conditions.</span></label>
        {errors.consent&&<div id="rider-terms-consent-note" className="su-step-error" role="alert">{errors.consent}</div>}
      </div>}

      {currentStep==='safetySpending'&&role==='Rider'&&<div className="su-step su-safety-spending-step">
        <span className="eyebrow cyan-text">RIDER RESEARCH</span>
        <h2>YOUR SAFETY SPENDING PREFERENCE</h2>
        <p className="auth-lede">This helps BBBT understand what riders are comfortable investing in their safety each year.</p>
        <p className="su-question">How much would you be comfortable spending on your safety in a year?</p>
        <p className="su-question-hindi" lang="hi">Aap apni safety ke liye ek saal mein kitna kharch karna comfortable samajhte hain?</p>
        <label>SAFETY-SPENDING PREFERENCE <span className="field-hint">Optional</span><select value={f.safetySpendingPreference} onChange={set('safetySpendingPreference')}><option value="">Not provided</option><option value="₹1,499">₹1,499</option><option value="₹2,499">₹2,499</option><option value="₹3,499">₹3,499</option><option value="₹4,499">₹4,499</option><option value="₹5,499">₹5,499</option><option value="Other Amount">Other Amount</option></select></label>
        {f.safetySpendingPreference==='Other Amount'&&<label className={errors.otherSafetyAmount?'invalid':''}>OTHER AMOUNT <span className="field-hint">Numbers only · Optional</span><input value={f.otherSafetyAmount} onChange={event=>setF(previous=>({...previous,otherSafetyAmount:event.target.value.replace(/[^0-9]/g,'')}))} inputMode="numeric" pattern="[0-9]*" placeholder="Enter amount in rupees" aria-describedby="safety-spending-note"/>{errors.otherSafetyAmount&&<span className="field-error" role="alert">{errors.otherSafetyAmount}</span>}</label>}
        <p id="safety-spending-note" className="su-note"><strong>Research only.</strong> Your response is a self-declared preference and does not determine BBBT&apos;s final membership price.</p>
      </div>}

      {currentStep==='branch'&&<div className="su-step signup-branch-step" data-branch={activeSignupBranch.key}>
        <span className="eyebrow cyan-text">{activeSignupBranch.eyebrow}</span>
        <h2>{activeSignupBranch.title}</h2>
        <p className="auth-lede">{activeSignupBranch.description}</p>
        {role==='Group Admin'?<fieldset className="form-section"><legend>GROUP ADMIN INFORMATION</legend><label className={errors.groupName?'invalid':''}>GROUP / COMMUNITY NAME <span className="field-hint">Required</span><input value={f.groupName} onChange={set('groupName')} placeholder="BBBT QA GROUP — DO NOT RETAIN" aria-required="true"/>{errors.groupName&&<span className="field-error" role="alert">{errors.groupName}</span>}</label><label className={errors.groupProfile?'invalid':''}>PUBLIC COMMUNITY PROFILE <span className="field-hint">Required</span><textarea rows={4} value={f.groupProfile} onChange={set('groupProfile')} placeholder="Public description or community profile URL" aria-required="true"/>{errors.groupProfile&&<span className="field-error" role="alert">{errors.groupProfile}</span>}</label><div className="form-grid"><label>COMMUNITY SIZE <span className="field-hint">Optional</span><input value={f.groupSize} onChange={set('groupSize')} inputMode="numeric" placeholder="Approximate riders"/></label><label>COMMUNITY HANDLE <span className="field-hint">Optional</span><input value={f.groupHandle} onChange={set('groupHandle')} placeholder="@bbbt-qa-group"/></label></div></fieldset>:<div className="signup-branch-panel"><strong>{role}</strong><span>Role-specific onboarding begins here.</span><small>Additional {activeSignupBranch.key === 'rider' ? 'rider safety' : 'application'} fields will be added in the next dedicated phase.</small></div>}
      </div>}

      {currentStep==='safety'&&<div className="su-step">
        <fieldset className="form-section">
          <legend>PRIVATE / SAFETY INFORMATION</legend>
          <p className="auth-lede" style={{margin:0}}>This stays private. It is never shown on your public rider identity.</p>
          <div className="form-grid">
            <label>EMERGENCY CONTACT NAME (Optional)<input value={f.ecName} onChange={set('ecName')} placeholder="Name and relationship"/></label>
            <label>EMERGENCY CONTACT NUMBER (Optional)<input value={f.ecNumber} onChange={set('ecNumber')} inputMode="tel" placeholder="+91 mobile number"/></label>
          </div>
        </fieldset>
      </div>}

      {currentStep==='role'&&<div className="su-step">
        <fieldset className="role-fieldset">
          <legend>Choose your BBBT role</legend>
          <div className="role-checks">{roleList.map(r=>
            <label className="role-check" key={r}>
              <input type="radio" name="role" checked={role===r} onChange={()=>{setRole(r);setStep(roleStepIndex(r));setChecked(false);setErrors({})}}/>
              <span><strong>{r}</strong><small>{descriptions[r]}</small></span>
            </label>)}</div>
        </fieldset>
        <p className="auth-lede" style={{marginTop:0}}>Role selection is a request. It does not automatically grant approval.</p>

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

      {currentStep==='budget'&&<div className="su-step">
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

      {currentStep==='submit'&&<div className="su-step su-submit-step">
        <span className="eyebrow cyan-text">FINAL APPLICATION ACTION</span>
        <h2>SUBMIT APPLICATION</h2>
        <p className="auth-lede">Your application has been reviewed. Submit the same canonical BBBT signup draft to the existing prototype submission mechanism.</p>
        <div className="su-note"><strong>Prototype only.</strong> No production account is created, no payment is taken, and the result below is a simulated application status.</div>
      </div>}

      {currentStep==='review'&&<div className="su-step su-review">
        <div className="su-review-grid">
          <div className="su-review-section-title"><strong>IDENTITY & LANGUAGE</strong><button type="button" className="text-button" onClick={()=>editStep('identity')}>EDIT</button></div>
          <div><small>Full name</small><p>{f.fullName.trim()||'—'}</p></div>
          <div><small>Handle</small><p>{f.handle.trim()||'—'}</p></div>
          <div><small>Mobile</small><p>{f.mobile.trim()||'—'}</p></div>
          <div><small>Email</small><p>{f.email.trim()||'Not added'}</p></div>
          <div><small>Profile photo</small><p className={photoPreview?'':'muted'}>{photoPreview?'UPLOADED':'Not added'}</p></div>
          <div><small>Primary language</small><p>{languageLabel(f.language)}</p></div>
          <div><small>Additional languages</small><p>{f.additionalLanguages.length?f.additionalLanguages.map(languageLabel).join(', '):'None added'}</p></div>
          <div><small>Base location</small><p className={previewLocation?'':'muted'}>{previewLocation||'Not added'}</p></div>
          <div><small>Vehicles</small><p className={vehicles.length?'':'muted'}>{vehicles.length?`${vehicles.length} vehicle${vehicles.length===1?'':'s'} added`:'Not added'}</p></div>
          <div><small>Role requested</small><p>{role}</p></div>
          {role==='Group Admin'&&<div className="su-review-section-title"><strong>GROUP ADMIN INFORMATION</strong><button type="button" className="text-button" onClick={()=>editStep('branch')}>EDIT</button></div>}
          {role==='Group Admin'&&<><div><small>Group / community name</small><p>{f.groupName.trim()||'—'}</p></div><div><small>Public community profile</small><p>{f.groupProfile.trim()||'—'}</p></div><div><small>Community size</small><p>{f.groupSize.trim()||'Not provided'}</p></div><div><small>Community handle</small><p>{f.groupHandle.trim()||'Not provided'}</p></div></>}
          {role==='Rider'&&<>
            <div className="su-review-section-title"><strong>RIDER SAFETY & VEHICLE</strong><button type="button" className="text-button" onClick={()=>editStep('vehicle')}>EDIT</button></div>
            <div><small>Primary vehicle</small><p className={vehicles.length?'':'muted'}>{vehicles[0]?[vehicles[0].make,vehicles[0].model,vehicles[0].modelYear,vehicles[0].currentKm,vehicles[0].registration].filter(Boolean).join(' · ')||'Vehicle added':'Not added'}</p></div>
            <div><small>Vehicle image 1 — full vehicle + plate</small><p>{vehicles[0]?.fullBikePhoto?'UPLOADED':'Not uploaded'}</p>{vehicles[0]?.fullBikePhoto&&<img className="su-review-thumbnail" src={vehicles[0].fullBikePhoto.dataUrl} alt="Private full vehicle preview"/>}</div>
            <div><small>Vehicle image 2 — meter / console</small><p>{vehicles[0]?.meterPhoto?'UPLOADED':'Not uploaded'}</p>{vehicles[0]?.meterPhoto&&<img className="su-review-thumbnail" src={vehicles[0].meterPhoto.dataUrl} alt="Private meter console preview"/>}</div>
            <div><small>Privacy-safe location</small><p>{[f.city.trim(),f.state.trim(),f.zone.trim()].filter(Boolean).join(' · ')||f.baseLocation.trim()||'Not added'}</p></div>
            <div><small>Blood group</small><p>{f.blood?`${f.blood} · SELF-REPORTED`:'Not added'}</p></div>
            <div><small>Latest blood group / lab report</small><p>{bloodReportName?`REPORT UPLOADED · ${f.bloodReportDate||'Date recorded'}`:'Not uploaded'}</p></div>
            <div><small>Emergency contact 1</small><p>{f.ec1Name.trim()&&f.ec1Number.trim()?`${f.ec1Name.trim()} · ${f.ec1Relationship.trim()||'Relationship not added'} · ${maskContact(f.ec1Number)}`:'Not added'}</p></div>
            <div><small>Emergency contact 2</small><p>{f.ec2Name.trim()&&f.ec2Number.trim()?`${f.ec2Name.trim()} · ${f.ec2Relationship.trim()||'Relationship not added'} · ${maskContact(f.ec2Number)}`:'Not added'}</p></div>
            <div><small>Rider responsibilities & terms</small><p>{checked?'✓ Accepted · BBBT-RIDER-RESPONSIBILITIES-2026-09-05':'Not accepted'}</p></div>
            <div><small>Safety-spending preference</small><p>{f.safetySpendingPreference==='Other Amount'&&f.otherSafetyAmount?`₹${f.otherSafetyAmount}`:f.safetySpendingPreference||'Not provided'}</p></div>
            <div className="su-review-section-title"><strong>LOCATION, REPORT & CONTACTS</strong><button type="button" className="text-button" onClick={()=>editStep('location')}>EDIT</button></div>
          </>}
          <div><small>Safety details</small><p className="muted">Kept private</p></div>
        </div>

        <button type="button" className="responsibility-trigger" onClick={()=>setShowResp(true)}>Review responsibility acknowledgement</button>
        <label className="consent-row">
          <input type="checkbox" checked={checked} onChange={e=>{if(e.target.checked){setShowResp(true)}else{setChecked(false)}}}/>
          <span>I have read and understood my BBBT role responsibilities.</span>
        </label>
        {!checked&&errors.consent&&<div className="su-step-error">{errors.consent}</div>}
        {role==='Rider'&&Object.keys(errors).some(key=>['blood','bloodReport','bloodReportDate','ec1Name','ec1Number','ec1Relationship','ec2Name','ec2Number','ec2Relationship'].includes(key))&&<div className="su-step-error" role="alert">Please return to the required Rider safety steps and complete the highlighted fields before submitting.</div>}

        <div className="su-note"><strong>This is a prototype.</strong> No payment is being taken and this registration does not represent live emergency coverage. Role selection is a request and does not grant approval.</div>
      </div>}

      <div className="su-nav">
        {step>0&&<button type="button" className="btn btn-outline su-back" onClick={back}>BACK</button>}
        {step<steps.length-1
          ? <button type="button" className="btn btn-cyan" onClick={next}>CONTINUE <ArrowRight size={16}/></button>
          : <button className="btn btn-cyan" type="submit" disabled={!checked} onClick={()=>{if(!checked)setErrors({consent:'Please acknowledge your role responsibilities to continue.'})}}>SUBMIT APPLICATION <ArrowRight size={16}/></button>}
      </div>
    </form>

    <p className="su-help">Need help with signup? <a href="mailto:connect@bbbt.in">connect@bbbt.in</a></p>

    {showResp&&<div className="su-modal" role="dialog" aria-modal="true" aria-label="BBBT role responsibilities" onClick={e=>{if(e.target===e.currentTarget)setShowResp(false)}}>
      <div className="su-modal-card">
        <button className="su-modal-close" aria-label="Close" onClick={()=>setShowResp(false)}>✕</button>
        <span className="eyebrow cyan-text">RESPONSIBILITY ACKNOWLEDGEMENT</span>
        <h2>Your responsibilities as {role}</h2>
        <p className="auth-lede">Joining BBBT begins with responsibility. Please read these before you continue.</p>
        <p className="su-resp-lang">ENGLISH</p>
        <ul className="su-resp-list">{(responsibilities[role]||['Follow BBBT responsibilities, safety guidance and applicable review requirements.']).map((r,i)=><li key={i}>{r}</li>)}</ul>
        {f.language!=='en'&&<p className="su-note" style={{marginTop:'1.25rem'}}>A {languageLabel(f.language)} version of these responsibilities will be provided before launch. The English version above is authoritative for this prototype.</p>}
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
