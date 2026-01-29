import { OrgId } from '@features/org/model/org.store';
import { mockDelay } from '@shared/lib/mock-request';
import { makeCourses } from './demo';
import { Course } from './types';

export async function fetchCoursesForOrg(org: OrgId): Promise<Course[]> {
  await mockDelay({ delayMs: 420 });
  if (org === 'B2B Tenant' || org === 'Demo') return makeCourses();
  return [];
}
