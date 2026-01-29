import { OrgId } from "@/portal/features/org/store";
import { mockDelay } from "@/portal/lib/mock-request";
import { makeCourses } from "@/portal/entities/course/demo";
import { Course } from "@/portal/entities/course/types";

export async function fetchCoursesForOrg(org: OrgId): Promise<Course[]> {
  await mockDelay({ delayMs: 420 });
  if (org === "B2B Tenant" || org === "Demo") return makeCourses();
  return [];
}

