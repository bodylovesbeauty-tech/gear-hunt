import { PublicGroupDetail } from '@/components/public-groups'

type PageProps = { params: Promise<{ identifier: string }> }

export const metadata = {
  title: 'BBBT Group | BBBT',
  description: 'Public BBBT Group information and access pathway.',
}

export default async function Page({ params }: PageProps) {
  const { identifier } = await params
  return <PublicGroupDetail identifier={decodeURIComponent(identifier)} />
}
