import { PublicRoleProfile } from "@/components/public-role-profile"

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  return <PublicRoleProfile roleSlug="group-marshal" handle={(await params).handle} />
}
