import { OpenRidePreview } from '@/components/open-rides'
export default async function Page({params}:{params:Promise<{token:string}>}){const {token}=await params;return <OpenRidePreview token={token}/>}
