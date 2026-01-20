import { Injectable, computed, signal } from '@angular/core';
import { initials } from '@shared/lib/initials';
import { mockDelay } from '@shared/lib/mock-request';
import { DEMO_STUDENT_PROFILE, DEMO_USER } from './demo';
import { StudentProfile, User } from './types';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly userSignal = signal<User>(DEMO_USER);
  readonly user = this.userSignal.asReadonly();

  private readonly studentProfileSignal = signal<StudentProfile>(DEMO_STUDENT_PROFILE);
  readonly studentProfile = this.studentProfileSignal.asReadonly();

  readonly fullName = computed(() => {
    const user = this.userSignal();
    const name = `${user.first_name} ${user.last_name}`.trim();
    return name || user.email;
  });

  readonly initials = computed(() => initials(this.fullName()));

  async updateUser(patch: Partial<User>) {
    this.userSignal.update((current) => ({ ...current, ...patch }));
    await mockDelay();
  }

  async updateStudentProfile(patch: Partial<StudentProfile>) {
    this.studentProfileSignal.update((current) => ({ ...current, ...patch }));
    await mockDelay();
  }
}
