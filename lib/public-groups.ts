'use client'

import { groupKey, type PrototypeGroup } from '@/lib/prototype-session'

export type PublicGroup = {
  targetId: string
  identifier: string
  name: string
  createdAt: string
  memberCount: number
  image: { name: string; dataUrl: string } | null
  description: string | null
  location: string | null
  status: 'ACTIVE'
}

function readStoredGroup(): PrototypeGroup | null {
  try {
    const raw = sessionStorage.getItem(groupKey)
    const group = raw ? JSON.parse(raw) as PrototypeGroup : null
    return group && typeof group === 'object' ? group : null
  } catch {
    return null
  }
}

function toPublicGroup(group: PrototypeGroup): PublicGroup | null {
  if (group.status && group.status !== 'ACTIVE') return null
  if (!group.shareToken || !group.name || !group.createdAt) return null
  return {
    targetId: group.id,
    identifier: group.shareToken,
    name: group.name,
    createdAt: group.createdAt,
    memberCount: Array.isArray(group.members) ? group.members.length : 0,
    image: group.image || null,
    description: group.description || null,
    location: null,
    status: 'ACTIVE',
  }
}

export function readPublicGroups(): PublicGroup[] {
  const group = readStoredGroup()
  const publicGroup = group ? toPublicGroup(group) : null
  return publicGroup ? [publicGroup] : []
}

export function findPublicGroup(identifier: string): PublicGroup | null {
  return readPublicGroups().find(group => group.identifier === identifier) || null
}

export function sortPublicGroups(groups: PublicGroup[], sort: 'newest' | 'members' | 'name'): PublicGroup[] {
  return [...groups].sort((a, b) => sort === 'members'
    ? b.memberCount - a.memberCount
    : sort === 'name'
      ? a.name.localeCompare(b.name)
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
