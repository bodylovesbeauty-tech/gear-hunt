export type Role = 'Rider' | 'Group Admin' | 'Group Marshal' | 'Independent Marshal' | 'Marshal' | 'Founding Rider Council Member' | 'Investor'
export type Status = 'Approved' | 'Pending' | 'Rejected' | 'Suspended'
export type DemoUser = { id:string; name:string; handle:string; primaryRole:Role; approvedRoles:Role[]; status:Status; referral:string }

export const demoUsers: DemoUser[] = [
{id:'rider-approved',name:'Aarav Mehta',handle:'@aarav.rides',primaryRole:'Rider',approvedRoles:['Rider'],status:'Approved',referral:'BBBT.in/join/aarav-rides'},
{id:'admin-approved',name:'Priya Nair',handle:'@priya.community',primaryRole:'Group Admin',approvedRoles:['Rider','Group Admin'],status:'Approved',referral:'BBBT.in/join/priya-community'},
{id:'marshal-approved',name:'Kabir Singh',handle:'@kabir.marshal',primaryRole:'Marshal',approvedRoles:['Marshal'],status:'Approved',referral:'BBBT.in/join/kabir-marshal'},
{id:'council-approved',name:'Meera Shah',handle:'@meera.council',primaryRole:'Founding Rider Council Member',approvedRoles:['Founding Rider Council Member'],status:'Approved',referral:'BBBT.in/join/meera-council'},
{id:'rider-pending',name:'Demo Rider',handle:'@pending.rider',primaryRole:'Rider',approvedRoles:[],status:'Pending',referral:'BBBT.in/join/pending-rider'},
{id:'admin-pending',name:'Demo Admin',handle:'@pending.admin',primaryRole:'Group Admin',approvedRoles:[],status:'Pending',referral:'BBBT.in/join/pending-admin'},
{id:'council-pending',name:'Demo Council Applicant',handle:'@pending.council',primaryRole:'Founding Rider Council Member',approvedRoles:[],status:'Pending',referral:'BBBT.in/join/pending-council'},
{id:'rider-suspended',name:'Demo Suspended Rider',handle:'@suspended.rider',primaryRole:'Rider',approvedRoles:[],status:'Suspended',referral:'BBBT.in/join/suspended-rider'}]
export const sessionKey='bbbt-prototype-session'
export const applicationKey='bbbt-prototype-application'
export const identityKey='bbbt-prototype-identity'
export const returnContextKey='bbbt-prototype-return-context'
export type PrototypeVehicle={id:string;make:string;model:string;modelYear:string;currentKm:string;registration:string;fullBikePhoto:{name:string;dataUrl:string}|null;meterPhoto:{name:string;dataUrl:string}|null}
export type PrototypeSafetyKit={status:'NOT ACTIVATED'|'ACTIVE';linkedVehicleId:string|null;activatedAt:string|null;kitId:string}
export type GovernanceMember={id:string;name:string;handle:string;role:Role;joinedAt:string;office?:'GROUP ADMIN'|'GROUP MARSHAL'}
export type GovernanceElection={id:string;office:'GROUP ADMIN'|'GROUP MARSHAL';candidateIds:string[];votes:Record<string,string>;status:'OPEN'|'CLOSED';winnerId?:string;createdAt:string;rideId?:string}
export type RideReadiness={profile:boolean;vehicleId:string|null;safetyKitStatus:'ACTIVE'|'NOT ACTIVATED';safetyKitVehicleId:string|null;checks:{vehicle:boolean;kit:boolean;ready:boolean};state:'READY'|'ATTENTION'|'NOT READY';missing:string[]}
export type GovernanceRide={id:string;title:string;route:string;date:string;meetingPoint:string;notes:string;startTime?:string;destinationType?:string;status:'DRAFT'|'CONFIRMED'|'ACTIVE'|'COMPLETED';createdAt:string;startedAt?:string;completedAt?:string;readiness?:Record<string,RideReadiness>;participants?:Record<string,GovernanceMember>;officialKmStatus?:'NOT TRACKED YET'}
export type GovernanceNotification={id:string;message:string;createdAt:string;read:boolean}
export type GovernanceScope='DISTRICT'|'ZONE'|'MASTER_FRC'
export type GovernanceCapability={role:Role;scope:GovernanceScope;actions:string[];approval:'APPROVED'|'PENDING'|'SUSPENDED'}
export type ComplaintRecord={id:string;subjectId:string;filedBy:string;evidence:{name:string;type:string;url?:string}[];status:'OPEN'|'UNDER_REVIEW'|'RESOLVED';scope?:string;outcome?:'NO_ACTION'|'WARNING'|'SUSPENSION'|'PERMANENT_BLOCK';createdAt:string;resolvedAt?:string}
export type GovernanceAudit={id:string;action:string;actorId:string;createdAt:string;immutable:true;metadata?:Record<string,string>}
export type PrototypeGroup={id:string;name:string;createdAt:string;cycleStart?:string;cycleEnd?:string;adminId:string;members:GovernanceMember[];elections:GovernanceElection[];rides:GovernanceRide[];notifications:GovernanceNotification[];shareToken?:string;image?:{name:string;dataUrl:string}|null;description?:string;groupSize?:string;groupHandle?:string;status?:'ACTIVE'|'SUSPENDED'|'REASSIGNMENT_REQUIRED';marshalIds?:string[];complaints?:ComplaintRecord[];audit?:GovernanceAudit[];scope?:GovernanceScope;permanent?:true;capabilities?:GovernanceCapability[]}
export type OpenRideParticipant={id:string;name:string;handle:string;joinedAt:string;verified:boolean}
export type OpenRide={id:string;type:'OPEN_RIDE';title:string;route:string;date:string;startTime:string;meetingPoint:string;destination:string;notes:string;creatorId:string;creatorName:string;coverImage:{name:string;dataUrl:string}|null;inviteToken:string;status:'CREATED'|'CONFIRMED'|'ACTIVE'|'COMPLETED';participants:OpenRideParticipant[];createdAt:string;startedAt?:string;completedAt?:string}
export type PrototypeGroupShare={image:{name:string;dataUrl:string}|null;shareToken:string}
export const openRidesKey='bbbt-prototype-open-rides'
export const groupShareKey='bbbt-prototype-group-share'
export const groupKey='bbbt-prototype-group'
export type PrototypeIdentity={id:string;applicationId:string;fullName:string;handle:string;mobile:string;email:string;requestedRole:Role;status:Status;selectedLanguages:string[];vehicles:PrototypeVehicle[];groupName?:string;groupProfile?:string;groupSize?:string;groupHandle?:string;safetyKit?:PrototypeSafetyKit;address?:string;city?:string;state?:string;district?:string;pinCode?:string;bbbtZone?:string;emergencyName?:string;emergencyNumber?:string;emergencyContacts?:{fullName:string;mobile:string;relationship:string}[];bloodGroup?:string;profilePhoto?:{name:string;dataUrl:string}|null;bloodReport?:{name:string;dataUrl:string;reportDate:string;uploadedAt:string;status:'REPORT UPLOADED'}|null;termsConsent?:{accepted:true;version:string;acceptedAt:string;role:'Rider'};safetySpendingPreference?:{selectedRange:string|null;otherAmount:number|null;skipped:boolean;role:'Rider';recordedAt:string}|null;createdAt:string}
export function prototypeApplicationId(application:{submittedAt?:string;fullName?:string;handle?:string}){const source=`${application.submittedAt||''}|${application.fullName||''}|${application.handle||''}`;let hash=0;for(let i=0;i<source.length;i++)hash=(hash*31+source.charCodeAt(i))>>>0;return `BBBT-PROTO-${hash.toString(16).toUpperCase().padStart(8,'0')}`}
export function dashboardFor(role:Role){return role==='Rider'?'/rider-dashboard':role==='Group Admin'?'/group-admin-dashboard':role==='Group Marshal'?'/group-marshal-dashboard':role==='Independent Marshal'?'/independent-marshal-dashboard':role==='Investor'?'/investor-dashboard':role==='Marshal'?'/marshal-dashboard':'/founding-rider-council-dashboard'}
export function roleForPath(path:string):Role|undefined{return path.includes('group-admin')?'Group Admin':path.includes('group-marshal')?'Group Marshal':path.includes('independent-marshal')?'Independent Marshal':path.includes('marshal')?'Marshal':path.includes('founding-rider')?'Founding Rider Council Member':path.includes('investor-dashboard')?'Investor':path.includes('rider-dashboard')?'Rider':undefined}
// Roles that are auto-approved on successful signup. Council and Investor remain pending in this prototype.
export const registryKey='bbbt-prototype-registry'
export const autoApprovedRoles:Role[]=['Rider','Group Admin','Group Marshal','Independent Marshal','Marshal']
export function isAutoApproved(role:Role){return autoApprovedRoles.includes(role)}
// Prototype-level normalisers for cross-role uniqueness. Not production-grade — no server/Supabase auth is connected yet.
export function normEmail(v:string){return (v||'').trim().toLowerCase()}
export function normHandle(v:string){return (v||'').trim().replace(/^@/,'').toLowerCase()}
export function normMobile(v:string){let d=(v||'').replace(/[^0-9]/g,'');if(d.length===12&&d.startsWith('91'))d=d.slice(2);if(d.length===11&&d.startsWith('0'))d=d.slice(1);return d}
export function readRegistry():PrototypeIdentity[]{try{if(typeof window==='undefined')return [];const raw=sessionStorage.getItem(registryKey);const list=raw?JSON.parse(raw):[];return Array.isArray(list)?list:[]}catch{return []}}
export function saveIdentityToRegistry(identity:PrototypeIdentity){try{const list=readRegistry().filter(x=>x.id!==identity.id);list.push(identity);sessionStorage.setItem(registryKey,JSON.stringify(list))}catch{}}
export function duplicateField(field:'mobile'|'email'|'handle',value:string,excludeId?:string):boolean{const reg=readRegistry();if(field==='handle'){const n=normHandle(value);if(!n)return false;return demoUsers.some(u=>normHandle(u.handle)===n)||reg.some(u=>u.id!==excludeId&&normHandle(u.handle)===n)}if(field==='email'){const n=normEmail(value);if(!n)return false;return reg.some(u=>u.id!==excludeId&&u.email&&normEmail(u.email)===n)}const n=normMobile(value);if(!n)return false;return reg.some(u=>u.id!==excludeId&&u.mobile&&normMobile(u.mobile)===n)}
