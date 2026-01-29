import { createStore, useStore } from "@/portal/store";
import { stablePercent } from "@/portal/lib/stable-percent";
import { mockDelay } from "@/portal/lib/mock-request";
import { fetchCoursesForOrg } from "@/portal/entities/course/mock-api";
import { Course, Lesson, Quiz, Test } from "@/portal/entities/course/types";
import { OrgId } from "@/portal/features/org/store";

function computeCourseProgress(course: Pick<Course, "lessons" | "quizzes" | "tests">) {
  const total = course.lessons.length + course.quizzes.length + course.tests.length;
  const doneLessons = course.lessons.filter((l) => l.offlineStatus === "Completed" || l.online.status === "Completed").length;
  const done =
    doneLessons +
    course.quizzes.filter((q) => q.completed).length +
    course.tests.filter((t) => t.status === "Submitted").length;
  return Math.round((done / Math.max(1, total)) * 100);
}

type CoursesState = {
  courses: Course[];
  loading: boolean;
  searchQuery: string;
  activeCourseId: string | null;
  loadedOrg: OrgId | null;
};

const store = createStore<CoursesState>({
  courses: [],
  loading: false,
  searchQuery: "",
  activeCourseId: null,
  loadedOrg: null
});

export function useCourses() {
  return useStore(store, (state) => state.courses);
}

export function useLoadingCourses() {
  return useStore(store, (state) => state.loading);
}

export function useSearchQuery() {
  return useStore(store, (state) => state.searchQuery);
}

export function useFilteredCourses() {
  return useStore(store, (state) => {
    const query = state.searchQuery.trim().toLowerCase();
    if (!query) return state.courses;
    return state.courses.filter((course) => {
      const haystack = [
        course.title,
        course.teacher,
        course.description,
        ...course.lessons.map((lesson) => lesson.title),
        ...course.quizzes.map((quiz) => quiz.title),
        ...course.tests.map((test) => test.title)
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  });
}

export function useActiveCourse() {
  return useStore(store, (state) => state.courses.find((c) => c.id === state.activeCourseId) ?? null);
}

export function useActiveCourseTitle() {
  return useStore(store, (state) => state.courses.find((c) => c.id === state.activeCourseId)?.title ?? null);
}

export function useCoursesInProgressCount() {
  return useStore(store, (state) => state.courses.filter((c) => c.progress > 0 && c.progress < 100).length);
}

export function useCompletedLessonsCount() {
  return useStore(store, (state) =>
    state.courses.reduce(
      (acc, c) => acc + c.lessons.filter((l) => l.offlineStatus === "Completed" || l.online.status === "Completed").length,
      0
    )
  );
}

export function useNextUp() {
  return useStore(store, (state) => {
    for (const course of state.courses) {
      const lesson = course.lessons.find((l) => l.online.status === "Available" || l.online.status === "In progress");
      if (lesson) return { course, lesson };
    }
    return null;
  });
}

export async function loadCoursesForOrg(org: OrgId) {
  const current = store.getState();
  if (current.loadedOrg === org) return;
  store.setState({ ...current, loading: true });
  try {
    const courses = await fetchCoursesForOrg(org);
    store.setState({
      courses,
      loading: false,
      searchQuery: "",
      activeCourseId: courses[0]?.id ?? null,
      loadedOrg: org
    });
  } catch {
    store.setState({ ...store.getState(), loading: false });
  }
}

export function setActiveCourse(courseId: string) {
  store.setState({ ...store.getState(), activeCourseId: courseId });
}

export function setSearchQuery(query: string) {
  store.setState({ ...store.getState(), searchQuery: query });
}

export async function startOrContinueLesson(courseId: string, lessonId: string) {
  store.setState((state) => ({
    ...state,
    courses: state.courses.map((course) => {
      if (course.id !== courseId) return course;
      const lessons = course.lessons.map((lesson): Lesson =>
        lesson.id !== lessonId
          ? lesson
          : lesson.online.status === "Available"
            ? { ...lesson, online: { ...lesson.online, status: "In progress" } }
            : lesson
      );
      const updated: Course = { ...course, lessons };
      return { ...updated, progress: computeCourseProgress(updated) };
    })
  }));
  await mockDelay();
}

export async function completeQuiz(courseId: string, quizId: string) {
  store.setState((state) => ({
    ...state,
    courses: state.courses.map((course) => {
      if (course.id !== courseId) return course;
      const quizzes = course.quizzes.map((quiz): Quiz => {
        if (quiz.id !== quizId) return quiz;
        if (quiz.completed) return quiz;
        return { ...quiz, completed: true, scorePercent: stablePercent(`${courseId}:${quizId}`, 72, 100) };
      });
      const updated: Course = { ...course, quizzes };
      return { ...updated, progress: computeCourseProgress(updated) };
    })
  }));
  await mockDelay();
}

export async function submitTest(courseId: string, testId: string) {
  store.setState((state) => ({
    ...state,
    courses: state.courses.map((course) => {
      if (course.id !== courseId) return course;
      const tests = course.tests.map((test): Test => {
        if (test.id !== testId) return test;
        if (test.status === "Submitted") return test;
        return { ...test, status: "Submitted", scorePercent: stablePercent(`${courseId}:${testId}`, 65, 98) };
      });
      const updated: Course = { ...course, tests };
      return { ...updated, progress: computeCourseProgress(updated) };
    })
  }));
  await mockDelay();
}

