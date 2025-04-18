import { supabase } from '../../integrations/supabase/client'
import type { LabTestResult } from '@/lib/fhir/types'

export async function addLabRecord(record: {
  name: string
  date: string
  status: 'normal' | 'abnormal' | 'pending'
  fileurl: string
  testresults: LabTestResult[]
  user_id: string
}) {
  const { data, error } = await supabase
    .from('health_lab_reports')
    .insert([
      {
        name: record.name,
        date: record.date,
        status: record.status,
        fileurl: record.fileurl,
        testresults: record.testresults as unknown as any,
        user_id: record.user_id,
      },
    ])

  if (error) {
    console.error('Error inserting lab record:', error)
    throw error
  }
  return data
}
export { useLabReports } from './useLabReports';
export { useHealthMetrics } from './useHealthMetrics';
export { usePersonalInfo } from './usePersonalInfo';
export { useVitalsInfo } from './useVitalsInfo';
export { useLifestyleInfo } from './useLifestyleInfo';
