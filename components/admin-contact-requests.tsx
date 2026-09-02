'use client'

type ContactRequest={contact_request_id:string;created_at:string;contact_type:string;regarding:string;full_name:string;mobile:string;email:string;city:string;state:string;subject:string;message:string;status:string}

export default function AdminContactRequests({requests}:{requests:ContactRequest[]}){
  return <div className="admin-panel contact-request-inbox"><div className="panel-title">CONTACT REQUESTS <span>{requests.length} STORED</span></div>{requests.length===0?<p className="settings-copy">No contact requests have been submitted yet.</p>:<div className="contact-request-list">{requests.map(request=><article key={request.contact_request_id} className="contact-request-row"><div><b>{request.subject}</b><small>{request.full_name} · {request.email} · {request.mobile}</small><small>{request.city}, {request.state} · {request.contact_type} · {request.regarding}</small></div><span className="status-pill">{request.status}</span><p>{request.message}</p><time dateTime={request.created_at}>{new Date(request.created_at).toLocaleString('en-IN')}</time></article>)}</div>}</div>
}
