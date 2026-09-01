export type FRCLevel = 'DISTRICT' | 'ZONE' | 'MASTER'
export type FRCApproval = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'BLOCKED' | 'EXPIRED' | 'APPROVED' | 'REJECTED' | 'ESCALATED'
export type GovernanceResource = 'OVERVIEW' | 'RIDER' | 'GROUP' | 'RIDE' | 'MARSHAL' | 'APPLICATION' | 'TRAINING' | 'SAFETY' | 'COMPLAINT' | 'STANDARD' | 'PRODUCT' | 'AUDIT' | 'REASSIGNMENT'
export type GovernanceAction = 'VIEW' | 'INVESTIGATE' | 'EVIDENCE' | 'NOTE' | 'ESCALATE' | 'REVIEW' | 'DISCIPLINE' | 'REASSIGN' | 'APPROVE' | 'FINAL_DECISION'
export type FRCProfile = { level: FRCLevel; scope: string; approval: FRCApproval; district?: string; zone?: string }

const districtActions: GovernanceAction[] = ['VIEW','INVESTIGATE','EVIDENCE','NOTE','ESCALATE']
const zoneActions: GovernanceAction[] = ['VIEW','INVESTIGATE','EVIDENCE','NOTE','ESCALATE','REVIEW','DISCIPLINE','REASSIGN','APPROVE']
const masterActions: GovernanceAction[] = ['VIEW','INVESTIGATE','EVIDENCE','NOTE','ESCALATE','REVIEW','DISCIPLINE','REASSIGN','APPROVE','FINAL_DECISION']

export function frcProfileFor(userId: string, scope?: Partial<FRCProfile>): FRCProfile {
  const level: FRCLevel = userId === 'council-approved' ? 'MASTER' : scope?.level || 'DISTRICT'
  return { level, scope: scope?.scope || (level === 'MASTER' ? 'NATIONAL' : level === 'ZONE' ? 'WEST ZONE' : 'PUNE DISTRICT'), approval: scope?.approval || 'ACTIVE', district: scope?.district || 'PUNE DISTRICT', zone: scope?.zone || 'WEST ZONE' }
}

export function canGovern(profile: FRCProfile | null, action: GovernanceAction, resource: GovernanceResource, resourceScope = 'NATIONAL') {
  if (!profile || profile.approval !== 'ACTIVE') return false
  const actions = profile.level === 'MASTER' ? masterActions : profile.level === 'ZONE' ? zoneActions : districtActions
  const scopeAllowed = profile.level === 'MASTER' || resourceScope === profile.scope || (profile.level === 'ZONE' && resourceScope === profile.zone)
  if (!scopeAllowed) return false
  if (resource === 'COMPLAINT' && profile.level === 'DISTRICT') return ['VIEW','INVESTIGATE','EVIDENCE','NOTE','ESCALATE'].includes(action)
  return actions.includes(action)
}

export function scopeLabel(profile: FRCProfile) { return profile.level === 'MASTER' ? 'NATIONAL' : `${profile.level} · ${profile.scope}` }
export const frcLevels: { level: FRCLevel; label: string; detail: string }[] = [
  { level: 'DISTRICT', label: 'District FRC', detail: 'Local governance and investigation authority' },
  { level: 'ZONE', label: 'Zone FRC', detail: 'Regional review and escalation authority' },
  { level: 'MASTER', label: 'Master FRC', detail: 'National governance and final authority' },
]
export { districtActions, zoneActions, masterActions }
