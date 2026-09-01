import { appendActivity } from '@/lib/rider-journey-data'
import type { DemoUser } from '@/lib/prototype-session'
export function recordPrototypeActivity(user:DemoUser|null,eventType:string,targetType:string|null,targetId:string|null,metadata:Record<string,string|number|boolean|null>={},source='prototype'){return appendActivity({eventType,actorRiderId:user?.id||null,role:user?.primaryRole||null,scope:null,targetType,targetId,metadata,source})}
