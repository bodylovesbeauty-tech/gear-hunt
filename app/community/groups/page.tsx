import { PublicGroupDirectory } from '@/components/public-groups'

export const metadata = {
  title: 'The BBBT Rider Network | BBBT',
  description: 'Discover BBBT Groups created by riders and Group Admins.',
  alternates: { canonical: '/community/groups' },
}

export default function Page() {
  return <PublicGroupDirectory />
}
