'use client'

import AdminConsole from '@/components/admin-console'

export default function AdminPreviewPage() {
  return <AdminConsole adminId="preview-admin" adminEmail="brandbikebrotherhoodtrust@gmail.com" role="admin" riders={[{ id: 'preview-rider-1', display_name: 'Demo rider', phone: '+91 98765 43210', blood_group: 'O+', blood_report_path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]} bikes={[{ id: 'preview-bike-1', rider_id: 'preview-rider-1', registration_number: 'MH 12 AB 1234', brand: 'Royal Enfield', model: 'Classic 350', model_year: 2024 }]} audit={[{ id: 'preview-audit-1', action: 'Dashboard preview opened', target_id: null, created_at: new Date().toISOString() }]} locations={[]} settings={null} statuses={[{ rider_id: 'preview-rider-1', status: 'pending', notes: 'Preview record only', updated_at: new Date().toISOString() }]} />
}
