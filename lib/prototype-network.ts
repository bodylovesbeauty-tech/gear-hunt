import { groupKey, openRidesKey, type OpenRide, type PrototypeGroup, type PrototypeIdentity } from '@/lib/prototype-session'

export type NetworkTargetType = 'HOME' | 'GROUP' | 'RIDE'
export type MembershipStatus = 'ACTIVE' | 'LEFT'
export type ReferralStatus = 'CREATED' | 'CLICKED' | 'REGISTERED' | 'JOINED'

export type PrototypeMembership = {
  id: string
  userId: string
  targetId: string
  targetType: 'GROUP' | 'RIDE'
  joinedAt: string
  status: MembershipStatus
  sourceReferralId?: string
}

export type PrototypeReferral = {
  id: string
  referrerUserId: string
  publicToken: string
  targetType: NetworkTargetType
  targetId?: string
  createdAt: string
  firstClickAt?: string
  signupAt?: string
  joinAt?: string
  status: ReferralStatus
}

export type PrototypeNetworkStore = {
  memberships: PrototypeMembership[]
  referrals: PrototypeReferral[]
}

export const networkKey = 'bbbt-prototype-network'
export const returnContextKey = 'bbbt-prototype-return-context'

function token(prefix: string) {
  const value = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()
    : Math.random().toString(36).slice(2, 18).toUpperCase()
  return `${prefix}-${value}`
}

export function emptyNetwork(): PrototypeNetworkStore {
  return { memberships: [], referrals: [] }
}

export function readNetwork(): PrototypeNetworkStore {
  if (typeof window === 'undefined') return emptyNetwork()
  try {
    const parsed = JSON.parse(sessionStorage.getItem(networkKey) || '{}') as Partial<PrototypeNetworkStore>
    return {
      memberships: Array.isArray(parsed.memberships) ? parsed.memberships : [],
      referrals: Array.isArray(parsed.referrals) ? parsed.referrals : [],
    }
  } catch {
    return emptyNetwork()
  }
}

export function writeNetwork(store: PrototypeNetworkStore) {
  if (typeof window !== 'undefined') sessionStorage.setItem(networkKey, JSON.stringify(store))
}

export function publicPath(targetType: NetworkTargetType, tokenValue?: string) {
  if (targetType === 'HOME') return '/?ref=' + encodeURIComponent(tokenValue || '')
  return targetType === 'GROUP'
    ? `/community/groups/${encodeURIComponent(tokenValue || '')}`
    : `/open-rides/${encodeURIComponent(tokenValue || '')}`
}

export function createReferral(referrerUserId: string, targetType: NetworkTargetType, targetId?: string) {
  const store = readNetwork()
  const existing = store.referrals.find(referral => referral.referrerUserId === referrerUserId && referral.targetType === targetType && referral.targetId === targetId)
  if (existing) return existing
  const referral: PrototypeReferral = { id: token('REF'), referrerUserId, publicToken: token('SHARE'), targetType, targetId, createdAt: new Date().toISOString(), status: 'CREATED' }
  writeNetwork({ ...store, referrals: [referral, ...store.referrals] })
  return referral
}

export function recordReferralClick(publicToken: string) {
  const store = readNetwork()
  const now = new Date().toISOString()
  const referral = store.referrals.find(item => item.publicToken === publicToken)
  if (!referral) return null
  if (!referral.firstClickAt) referral.firstClickAt = now
  if (referral.status === 'CREATED') referral.status = 'CLICKED'
  writeNetwork(store)
  return referral
}

export function setReturnContext(path: string, referralToken?: string) {
  if (typeof window !== 'undefined') sessionStorage.setItem(returnContextKey, JSON.stringify({ path, referralToken, createdAt: new Date().toISOString() }))
}

export function readReturnContext() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(sessionStorage.getItem(returnContextKey) || 'null') as { path: string; referralToken?: string } | null } catch { return null }
}

export function clearReturnContext() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(returnContextKey)
}

export function joinTarget(user: PrototypeIdentity, targetType: 'GROUP' | 'RIDE', targetId: string, referralToken?: string) {
  const store = readNetwork()
  const existing = store.memberships.find(item => item.userId === user.id && item.targetType === targetType && item.targetId === targetId && item.status === 'ACTIVE')
  if (existing) return { membership: existing, created: false }
  const referral = referralToken ? store.referrals.find(item => item.publicToken === referralToken) : undefined
  const membership: PrototypeMembership = { id: token('MEM'), userId: user.id, targetId, targetType, joinedAt: new Date().toISOString(), status: 'ACTIVE', sourceReferralId: referral?.id }
  if (referral) { referral.joinAt = membership.joinedAt; referral.status = 'JOINED' }
  writeNetwork({ memberships: [membership, ...store.memberships], referrals: store.referrals })
  return { membership, created: true }
}

export function groupMemberCount(group: PrototypeGroup) {
  const store = readNetwork()
  const joined = store.memberships.filter(item => item.targetType === 'GROUP' && item.targetId === group.id && item.status === 'ACTIVE').length
  return Math.max(group.members?.length || 0, joined)
}

export function rideParticipantCount(ride: OpenRide) {
  const store = readNetwork()
  const joined = store.memberships.filter(item => item.targetType === 'RIDE' && item.targetId === ride.id && item.status === 'ACTIVE').length
  return Math.max(ride.participants?.length || 0, joined)
}

export function referralMetrics(userId: string) {
  const store = readNetwork()
  const referrals = store.referrals.filter(item => item.referrerUserId === userId)
  const referralIds = new Set(referrals.map(item => item.id))
  const memberships = store.memberships.filter(item => item.sourceReferralId && referralIds.has(item.sourceReferralId))
  return { links: referrals.length, clicks: referrals.filter(item => item.firstClickAt).length, registrations: referrals.filter(item => item.signupAt).length, groupJoins: memberships.filter(item => item.targetType === 'GROUP').length, rideJoins: memberships.filter(item => item.targetType === 'RIDE').length, successful: memberships.length }
}

export function syncLegacyGroupMembership(group: PrototypeGroup, user: PrototypeIdentity) {
  const result = joinTarget(user, 'GROUP', group.id)
  if (!result.created) return group
  const next: PrototypeGroup = { ...group, members: [...(group.members || []), { id: user.id, name: user.fullName, handle: user.handle, role: user.requestedRole, joinedAt: result.membership.joinedAt }] }
  sessionStorage.setItem(groupKey, JSON.stringify(next))
  return next
}

export function syncLegacyRideMembership(ride: OpenRide, user: PrototypeIdentity, referralToken?: string) {
  const result = joinTarget(user, 'RIDE', ride.id, referralToken)
  if (!result.created) return ride
  const next: OpenRide = { ...ride, participants: [...(ride.participants || []), { id: user.id, name: user.fullName, handle: user.handle, joinedAt: result.membership.joinedAt, verified: true }] }
  const rides = JSON.parse(sessionStorage.getItem(openRidesKey) || '[]') as OpenRide[]
  sessionStorage.setItem(openRidesKey, JSON.stringify(rides.map(item => item.id === ride.id ? next : item)))
  return next
}
