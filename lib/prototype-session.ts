export type Role = 'Rider' | 'Group Admin' | 'Marshal' | 'Founding Rider Council Member'
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
export type PrototypeIdentity={id:string;applicationId:string;fullName:string;handle:string;mobile:string;email:string;requestedRole:Role;status:Status;selectedLanguages:string[];createdAt:string}
export function prototypeApplicationId(application:{submittedAt?:string;fullName?:string;handle?:string}){const source=`${application.submittedAt||''}|${application.fullName||''}|${application.handle||''}`;let hash=0;for(let i=0;i<source.length;i++)hash=(hash*31+source.charCodeAt(i))>>>0;return `BBBT-PROTO-${hash.toString(16).toUpperCase().padStart(8,'0')}`}
export function dashboardFor(role:Role){return role==='Rider'?'/rider-dashboard':role==='Group Admin'?'/group-admin-dashboard':role==='Marshal'?'/marshal-dashboard':'/founding-rider-council-dashboard'}
export function roleForPath(path:string):Role|undefined{return path.includes('group-admin')?'Group Admin':path.includes('marshal')?'Marshal':path.includes('founding-rider')?'Founding Rider Council Member':path.includes('rider-dashboard')?'Rider':undefined}
