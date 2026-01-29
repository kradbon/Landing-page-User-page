import { Injectable, computed, signal } from '@angular/core';
import { OrgId } from '@features/org/model/org.store';
import { stablePercent } from '@shared/lib/stable-percent';
import { mockDelay } from '@shared/lib/mock-request';
import { fetchCoursesForOrg } from './mock-api';
import { Course, Lesson, Quiz, Test } from './types';

function computeCourseProgress(course: Pick<Course, 'lessons' | 'quizzes' | 'tests'>) {
  const total = course.lessons.length + course.quizzes.length + course.tests.length;
  const doneLessons = course.lessons.filter((l) => l.offlineStatus === 'Completed' || l.online.status === 'Completed')
    .length;
  const done =
    doneLessons +
    course.quizzes.filter((q) => q.completed).length +
    course.tests.filter((t) => t.status === 'Submitted').length;
  return Math.round((done / Math.max(1, total)) * 100);
}

@Injectable({ providedIn: 'root' })
export class CourseStore {
  private readonly coursesSignal = signal<Course[]>([]);
  readonly courses = this.coursesSignal.asReadonly();

  readonly loading = signal(false);

  readonly searchQuery = signal('');

  readonly filteredCourses = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.coursesSignal();
    return this.coursesSignal().filter((course) => {
      const haystack = [
        course.title,
        course.teacher,
        course.description,
        ...course.lessons.map((lesson) => lesson.title),
        ...course.quizzes.map((quiz) => quiz.title),
        ...course.tests.map((test) => test.title),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  });

  readonly activeCourseId = signal<string | null>(null);

  readonly activeCourse = computed(() => {
    const id = this.activeCourseId();
    if (!id) return null;
    return this.coursesSignal().find((c) => c.id === id) ?? null;
  });

  readonly coursesInProgressCount = computed(
    () => this.coursesSignal().filter((c) => c.progress > 0 && c.progress < 100).length,
  );

  readonly completedLessonsCount = computed(() =>
    this.coursesSignal().reduce(
      (acc, c) =>
        acc + c.lessons.filter((l) => l.offlineStatus === 'Completed' || l.online.status === 'Completed').length,
      0,
    ),
  );

  readonly nextUp = computed(() => {
    for (const course of this.coursesSignal()) {
      const lesson = course.lessons.find((l) => l.online.status === 'Available' || l.online.status === 'In progress');
      if (lesson) return { course, lesson };
    }
    return null;
  });

  private readonly loadedOrg = signal<OrgId | null>(null);

  async loadForOrg(org: OrgId) {
    if (this.loadedOrg() === org) return;
    this.loading.set(true);
    try {
      const courses = await fetchCoursesForOrg(org);
      this.coursesSignal.set(courses);
      this.activeCourseId.set(courses[0]?.id ?? null);
      this.loadedOrg.set(org);
    } finally {
      this.loading.set(false);
    }
  }

  setActiveCourse(courseId: string) {
    this.activeCourseId.set(courseId);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  async startOrContinueLesson(courseId: string, lessonId: string) {
    this.coursesSignal.update((courses) =>
      courses.map((course) => {
        if (course.id !== courseId) return course;
        const lessons = course.lessons.map((lesson): Lesson =>
          lesson.id !== lessonId
            ? lesson
            : lesson.online.status === 'Available'
              ? { ...lesson, online: { ...lesson.online, status: 'In progress' } }
              : lesson,
        );
        const updated: Course = { ...course, lessons };
        return { ...updated, progress: computeCourseProgress(updated) };
      }),
    );
    await mockDelay();
  }

  async completeQuiz(courseId: string, quizId: string) {
    this.coursesSignal.update((courses) =>
      courses.map((course) => {
        if (course.id !== courseId) return course;
        const quizzes = course.quizzes.map((quiz): Quiz => {
          if (quiz.id !== quizId) return quiz;
          if (quiz.completed) return quiz;
          return { ...quiz, completed: true, scorePercent: stablePercent(`${courseId}:${quizId}`, 72, 100) };
        });
        const updated: Course = { ...course, quizzes };
        return { ...updated, progress: computeCourseProgress(updated) };
      }),
    );
    await mockDelay();
  }

  async submitTest(courseId: string, testId: string) {
    this.coursesSignal.update((courses) =>
      courses.map((course) => {
        if (course.id !== courseId) return course;
        const tests = course.tests.map((test): Test => {
          if (test.id !== testId) return test;
          if (test.status === 'Submitted') return test;
          return { ...test, status: 'Submitted', scorePercent: stablePercent(`${courseId}:${testId}`, 65, 98) };
        });
        const updated: Course = { ...course, tests };
        return { ...updated, progress: computeCourseProgress(updated) };
      }),
    );
    await mockDelay();
  }
}
