export type LessonOfflineStatus = "Scheduled" | "Completed" | "Cancelled";

export type LessonOnlineStatus = "Locked" | "Available" | "In progress" | "Completed";

export type LessonMaterialType = "PDF" | "DOCX" | "ZIP" | "MP3" | "MP4";

export type LessonMaterialFormat = {
  fileType: LessonMaterialType;
  sizeMb: number;
  updatedAt: string;
};

export type LessonMaterial = {
  id: string;
  title: string;
  formats: LessonMaterialFormat[];
};

export type Lesson = {
  id: string;
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  mode: "Offline" | "Online";
  offlineStatus: LessonOfflineStatus;
  online: { status: LessonOnlineStatus; updatedAt?: string };
  materials: LessonMaterial[];
};

export type Quiz = {
  id: string;
  title: string;
  questionsCount: number;
  completed: boolean;
  scorePercent?: number;
};

export type TestStatus = "Not started" | "In progress" | "Submitted";

export type Test = {
  id: string;
  title: string;
  dueDate: string;
  status: TestStatus;
  scorePercent?: number;
};

export type Course = {
  id: string;
  title: string;
  teacher: string;
  description: string;
  lessons: Lesson[];
  quizzes: Quiz[];
  tests: Test[];
  progress: number;
};

