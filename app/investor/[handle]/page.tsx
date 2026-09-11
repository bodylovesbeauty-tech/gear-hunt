import { PublicRoleProfile } from "@/components/public-role-profile"

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  return <PublicRoleProfile roleSlug="investor" handle={(await params).handle} />
}
