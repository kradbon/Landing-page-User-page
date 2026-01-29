import { Course, LessonMaterial, LessonMaterialFormat } from './types';

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

type MaterialSeed = Omit<LessonMaterial, 'formats'> & {
  formats: Array<Omit<LessonMaterialFormat, 'updatedAt'>>;
};

function materials(updatedAt: string, items: MaterialSeed[]): LessonMaterial[] {
  return items.map((item) => ({
    ...item,
    formats: item.formats.map((format) => ({ ...format, updatedAt })),
  }));
}

export function makeCourses(): Course[] {
  const courses: Omit<Course, 'progress'>[] = [
    {
      id: 'c1',
      title: 'Backend Engineering — APIs & Databases',
      teacher: 'Sarah Connor',
      description: 'Build REST APIs, auth, RBAC, and PostgreSQL schema design.',
      lessons: [
        {
          id: 'l1',
          title: 'HTTP + REST Basics',
          scheduledDate: '2025-12-01',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Completed', updatedAt: '2025-12-02' },
          materials: materials('2025-12-02', [
            { id: 'm1', title: 'Slides', formats: [{ fileType: 'PDF', sizeMb: 2.3 }, { fileType: 'DOCX', sizeMb: 0.8 }] },
            { id: 'm2', title: 'Class recording', formats: [{ fileType: 'MP4', sizeMb: 210 }, { fileType: 'MP3', sizeMb: 28.6 }] },
          ]),
        },
        {
          id: 'l2',
          title: 'JWT & Sessions',
          scheduledDate: '2025-12-08',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'In progress', updatedAt: '2025-12-09' },
          materials: materials('2025-12-09', [
            { id: 'm1', title: 'Worksheet', formats: [{ fileType: 'PDF', sizeMb: 1.1 }, { fileType: 'DOCX', sizeMb: 0.4 }] },
            { id: 'm2', title: 'Audio recap', formats: [{ fileType: 'MP3', sizeMb: 18.4 }] },
          ]),
        },
        {
          id: 'l3',
          title: 'PostgreSQL: Tables & Indexes',
          scheduledDate: '2025-12-15',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Available', updatedAt: '2025-12-16' },
          materials: materials('2025-12-16', [
            { id: 'm1', title: 'Notes', formats: [{ fileType: 'DOCX', sizeMb: 0.6 }, { fileType: 'PDF', sizeMb: 1.4 }] },
            { id: 'm2', title: 'Starter SQL', formats: [{ fileType: 'ZIP', sizeMb: 3.4 }] },
          ]),
        },
        {
          id: 'l4',
          title: 'Microservice Boundaries',
          scheduledDate: '2025-12-22',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Scheduled',
          online: { status: 'Locked' },
          materials: [],
        },
      ],
      quizzes: [
        { id: 'q1', title: 'Quiz: REST & Status Codes', questionsCount: 8, completed: true, scorePercent: 92 },
        { id: 'q2', title: 'Quiz: SQL Basics', questionsCount: 6, completed: false },
      ],
      tests: [{ id: 't1', title: 'Project: CRUD Service', dueDate: '2025-12-25', status: 'Not started' }],
    },
    {
      id: 'c2',
      title: 'Frontend Engineering — Angular UI',
      teacher: 'Emily Davis',
      description: 'Routing, state, forms, Tailwind UI, and best practices.',
      lessons: [
        {
          id: 'l1',
          title: 'Components & Templates',
          scheduledDate: '2025-12-03',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Available', updatedAt: '2025-12-04' },
          materials: materials('2025-12-04', [
            { id: 'm1', title: 'Slides', formats: [{ fileType: 'PDF', sizeMb: 1.8 }, { fileType: 'DOCX', sizeMb: 0.6 }] },
          ]),
        },
        {
          id: 'l2',
          title: 'Forms + Validation',
          scheduledDate: '2025-12-10',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Scheduled',
          online: { status: 'Locked' },
          materials: [],
        },
        {
          id: 'l3',
          title: 'UI Patterns with Tailwind',
          scheduledDate: '2025-12-17',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Scheduled',
          online: { status: 'Locked' },
          materials: [],
        },
      ],
      quizzes: [{ id: 'q1', title: 'Quiz: Routing', questionsCount: 10, completed: false }],
      tests: [{ id: 't1', title: 'Build: Dashboard Page', dueDate: '2025-12-29', status: 'Not started' }],
    },
    {
      id: 'c3',
      title: 'Biology — Cells to Systems',
      teacher: 'Alex Johnson',
      description: 'Cell structure, genetics basics, and human body systems.',
      lessons: [
        {
          id: 'l1',
          title: 'Cells & Organelles',
          scheduledDate: '2025-11-25',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Completed', updatedAt: '2025-11-26' },
          materials: materials('2025-11-26', [
            { id: 'm1', title: 'Workbook', formats: [{ fileType: 'PDF', sizeMb: 4.2 }, { fileType: 'DOCX', sizeMb: 1.1 }] },
            { id: 'm2', title: 'Class recording', formats: [{ fileType: 'MP4', sizeMb: 180 }, { fileType: 'MP3', sizeMb: 24.8 }] },
          ]),
        },
        {
          id: 'l2',
          title: 'DNA & Genetics',
          scheduledDate: '2025-12-02',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Completed', updatedAt: '2025-12-03' },
          materials: materials('2025-12-03', [
            { id: 'm1', title: 'Notes', formats: [{ fileType: 'DOCX', sizeMb: 0.8 }, { fileType: 'PDF', sizeMb: 1.9 }] },
          ]),
        },
        {
          id: 'l3',
          title: 'Human Systems Overview',
          scheduledDate: '2025-12-09',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Completed',
          online: { status: 'Available', updatedAt: '2025-12-10' },
          materials: materials('2025-12-10', [{ id: 'm1', title: 'Audio recap', formats: [{ fileType: 'MP3', sizeMb: 12.7 }] }]),
        },
        {
          id: 'l4',
          title: 'Homeostasis',
          scheduledDate: '2025-12-16',
          durationMinutes: 90,
          mode: 'Offline',
          offlineStatus: 'Scheduled',
          online: { status: 'Locked' },
          materials: [],
        },
      ],
      quizzes: [{ id: 'q1', title: 'Quiz: Cells', questionsCount: 7, completed: true, scorePercent: 88 }],
      tests: [{ id: 't1', title: 'Unit Test: Biology Fundamentals', dueDate: '2026-01-05', status: 'In progress' }],
    },
  ];

  return courses.map((course) => ({ ...course, progress: computeCourseProgress(course) }));
}
