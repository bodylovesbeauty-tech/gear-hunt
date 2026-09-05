'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Users } from 'lucide-react'
import { StatusBadge } from '@/components/public-site'
import { findPublicGroup, readPublicGroups, sortPublicGroups, type PublicGroup } from '@/lib/public-groups'
import { groupKey, identityKey, type PrototypeGroup, type PrototypeIdentity } from '@/lib/prototype-session'
import { createReferral, syncLegacyGroupMembership } from '@/lib/prototype-network'

const PAGE_SIZE = 12
const fallbackImage = '/bbbt-logo-red.png'

function GroupImage({ group, priority = false }: { group: PublicGroup; priority?: boolean }) {
  return group.image?.dataUrl ? <Image src={group.image.dataUrl} alt={group.name} width={640} height={360} priority={priority} className="public-group-image" /> : <div className="public-group-fallback" aria-label={`${group.name} BBBT fallback image`}><img src={fallbackImage} alt="BBBT" /></div>
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function GroupCard({ group }: { group: PublicGroup }) {
  return <Link className="public-group-card" href={`/community/groups/${encodeURIComponent(group.identifier)}`}>
    <GroupImage group={group} />
    <div className="public-group-card-body"><StatusBadge tone="prototype">ACTIVE</StatusBadge><h2>{group.name}</h2><div className="public-group-meta"><span><Users size={16} aria-hidden="true" />{group.memberCount} members</span><span>Created {formatDate(group.createdAt)}</span></div>{group.location && <p>{group.location}</p>}<span className="public-group-link">View group <ArrowRight size={16} aria-hidden="true" /></span></div>
  </Link>
}

export function PublicGroupDirectory() {
  const [groups, setGroups] = useState<PublicGroup[]>([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'newest' | 'members' | 'name'>('newest')
  const [page, setPage] = useState(1)
  useEffect(() => setGroups(readPublicGroups()), [])
  const filtered = useMemo(() => sortPublicGroups(groups.filter(group => `${group.name} ${group.description || ''}`.toLowerCase().includes(query.toLowerCase())), sort), [groups, query, sort])
  const visible = filtered.slice(0, page * PAGE_SIZE)
  return <main className="public-group-page"><section className="public-group-hero"><div><p className="section-label">THE BBBT RIDER NETWORK</p><h1>Discover groups built by riders.</h1><p>Discover BBBT Groups created by riders and Group Admins.</p></div><StatusBadge tone="prototype">REAL GROUP DATA</StatusBadge></section><section className="public-group-toolbar" aria-label="Group directory controls"><label><span className="sr-only">Search groups</span><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search group name" /></label><label><span className="sr-only">Sort groups</span><select value={sort} onChange={event => { setSort(event.target.value as typeof sort); setPage(1) }}><option value="newest">Newest</option><option value="members">Most Members</option><option value="name">Name A–Z</option></select></label></section>{visible.length ? <><div className="public-group-grid">{visible.map(group => <GroupCard key={group.identifier} group={group} />)}</div>{visible.length < filtered.length && <button className="button button-outline public-group-load" onClick={() => setPage(value => value + 1)}>Load more groups</button>}</> : <section className="public-group-empty"><Users size={28} aria-hidden="true" /><h2>NO PUBLIC GROUPS YET</h2><p>BBBT Groups will appear here as riders and Group Admins create them.</p></section>}</main>
}

export function PublicGroupDetail({ identifier }: { identifier: string }) {
  const [group, setGroup] = useState<PublicGroup | null>(null)
  const [notice, setNotice] = useState('')
  useEffect(() => setGroup(findPublicGroup(identifier)), [identifier])
  const joinGroup = () => {
    if (!group) return
    const identity = (() => { try { return JSON.parse(sessionStorage.getItem(identityKey) || 'null') as PrototypeIdentity | null } catch { return null } })()
    const stored = (() => { try { return JSON.parse(sessionStorage.getItem(groupKey) || 'null') as PrototypeGroup | null } catch { return null } })()
    if (!identity || !stored || stored.id !== group.targetId) { window.location.href = `/signup?role=Rider&group=${encodeURIComponent(group.identifier)}&returnTo=${encodeURIComponent(`/community/groups/${group.identifier}`)}`; return }
    const next = syncLegacyGroupMembership(stored, identity)
    sessionStorage.setItem(groupKey, JSON.stringify(next))
    setNotice(next.members.some(member => member.id === identity.id) ? 'Already a member or membership saved.' : 'Membership saved.')
  }
  return <main className="public-group-page">{group ? <><Link className="public-group-back" href="/community/groups"><ArrowLeft size={16} aria-hidden="true" /> Back to groups</Link><section className="public-group-detail"><GroupImage group={group} priority /><div className="public-group-detail-copy"><StatusBadge tone="prototype">ACTIVE GROUP</StatusBadge><h1>{group.name}</h1><div className="public-group-detail-stats"><span><strong>{group.memberCount}</strong> MEMBERS</span><span><strong>{formatDate(group.createdAt)}</strong> CREATED</span>{group.location && <span><strong>{group.location}</strong> LOCATION</span>}</div><h2>ABOUT</h2><p>{group.description || 'This group has not published a public description yet.'}</p><button className="button button-red" type="button" onClick={joinGroup}>JOIN / SIGN UP <ArrowRight size={16} aria-hidden="true" /></button><button className="button button-outline" type="button" onClick={() => { const identity = (() => { try { return JSON.parse(sessionStorage.getItem(identityKey) || 'null') as PrototypeIdentity | null } catch { return null } })(); const referral = createReferral(identity?.id || 'anonymous', 'GROUP', group.targetId); navigator.clipboard?.writeText(`${window.location.origin}/community/groups/${encodeURIComponent(group.identifier)}?ref=${referral.publicToken}`); setNotice('Group referral link copied.') }}>SHARE GROUP</button>{notice && <p role="status">{notice}</p>}<p className="public-group-note">Sign in or sign up to request access. This page does not show private member information.</p></div></section></> : <section className="public-group-empty"><h1>GROUP NOT FOUND</h1><p>This public group is unavailable, private, or has not been created in the current prototype session.</p><Link className="button button-outline" href="/community/groups">Back to groups</Link></section>}</main>
}
