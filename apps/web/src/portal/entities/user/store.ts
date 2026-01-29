import { createStore, useStore } from "@/portal/store";
import { initials } from "@/portal/lib/initials";
import { mockDelay } from "@/portal/lib/mock-request";
import { DEMO_STUDENT_PROFILE, DEMO_USER } from "@/portal/entities/user/demo";
import { StudentProfile, User } from "@/portal/entities/user/types";

type UserState = {
  user: User;
  studentProfile: StudentProfile;
};

const store = createStore<UserState>({
  user: DEMO_USER,
  studentProfile: DEMO_STUDENT_PROFILE
});

export function useUser() {
  return useStore(store, (state) => state.user);
}

export function useStudentProfile() {
  return useStore(store, (state) => state.studentProfile);
}

export function useUserFullName() {
  return useStore(store, (state) => {
    const name = `${state.user.first_name} ${state.user.last_name}`.trim();
    return name || state.user.email;
  });
}

export function useUserInitials() {
  return useStore(store, (state) => {
    const name = `${state.user.first_name} ${state.user.last_name}`.trim();
    return initials(name || state.user.email);
  });
}

export async function updateUser(patch: Partial<User>) {
  store.setState((current) => ({ ...current, user: { ...current.user, ...patch } }));
  await mockDelay();
}

export async function updateStudentProfile(patch: Partial<StudentProfile>) {
  store.setState((current) => ({ ...current, studentProfile: { ...current.studentProfile, ...patch } }));
  await mockDelay();
}

