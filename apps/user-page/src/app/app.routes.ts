import { Routes } from '@angular/router';
import { authGuard } from '@features/auth/model/auth.guard';
import { AppShellComponent } from '@widgets/layout/ui/app-shell.component';
import { AiTutorPage } from '@pages/ai-tutor/ui/ai-tutor.page';
import { CoursesPage } from '@pages/courses/ui/courses.page';
import { DashboardPage } from '@pages/dashboard/ui/dashboard.page';
import { DidaPage } from '@pages/dida/ui/dida.page';
import { DownloadsPage } from '@pages/downloads/ui/downloads.page';
import { DomenPage } from '@pages/domen/ui/domen.page';
import { LessonsPage } from '@pages/lessons/ui/lessons.page';
import { LoginPage } from '@pages/login/ui/login.page';
import { NotebookPage } from '@pages/notebook/ui/notebook.page';
import { ProfilePage } from '@pages/profile/ui/profile.page';
import { QuizzesPage } from '@pages/quizzes/ui/quizzes.page';
import { SecurityPage } from '@pages/security/ui/security.page';
import { TestsPage } from '@pages/tests/ui/tests.page';
import { domainGuard } from '@features/domain/model/domain.guard';

export const appRoutes: Routes = [
  { path: 'domen', component: DomenPage },
  { path: 'login', component: LoginPage, canActivate: [domainGuard] },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'courses', component: CoursesPage },
      { path: 'lessons', component: LessonsPage },
      { path: 'quizzes', component: QuizzesPage },
      { path: 'tests', component: TestsPage },
      { path: 'dida', component: DidaPage },
      { path: 'downloads', component: DownloadsPage },
      { path: 'notebook', component: NotebookPage },
      { path: 'ai-tutor', component: AiTutorPage },
      { path: 'profile', component: ProfilePage },
      { path: 'security', component: SecurityPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
