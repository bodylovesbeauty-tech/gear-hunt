import type { MetadataRoute } from 'next'
const routes=['','about','safety','emergency','care-pits','community','founding-rider-council','how-it-works','faq','contact','privacy','terms','community-guidelines']
export default function sitemap():MetadataRoute.Sitemap{return routes.map((route,i)=>({url:`https://www.bbbt.in/${route}`,lastModified:new Date(),changeFrequency:i<1?'weekly':'monthly',priority:i<1?1:.7}))}
