import { PublicRoleProfile } from "@/components/public-role-profile"

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  return <PublicRoleProfile roleSlug="founding-rider-council" handle={(await params).handle} />
}
