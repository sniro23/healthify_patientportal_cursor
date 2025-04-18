
import { LabTestResult, MetricData } from '@/lib/fhir/types';

// Type guard for LabTestResult array
export function isLabTestResultArray(data: unknown): data is LabTestResult[] {
  return Array.isArray(data) && data.every(
    item =>
      typeof item === 'object' &&
      item !== null &&
      'testId' in item &&
      'testName' in item &&
      'value' in item &&
      'unit' in item &&
      'isAbnormal' in item
  );
}

// Type guard for MetricData record
export function isMetricDataRecord(data: unknown): data is Record<string, MetricData> {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    Object.values(data).every(
      v =>
        typeof v === 'object' &&
        v !== null &&
        'name' in v &&
        'unit' in v &&
        'readings' in v
    )
  );
}

// JSON parser with type validation
export function parseJSON<T>(
  rawData: unknown,
  typeGuard: (data: unknown) => data is T
): T | null {
  if (typeGuard(rawData)) {
    return rawData;
  }
  
  if (typeof rawData === 'string') {
    try {
      const parsed = JSON.parse(rawData);
      if (typeGuard(parsed)) {
        return parsed;
      }
    } catch {
      console.error('Failed to parse JSON data');
    }
  }
  
  return null;
}
