import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const CourseTypePage = lazy(() => import('src/pages/course-type'));
export const CoursesPage = lazy(() => import('src/pages/courses'));
export const CoursePage = lazy(() => import('src/pages/course'));
export const AddCoursePage = lazy(() => import('src/pages/add-course'));
export const AddLessonPage = lazy(() => import('src/pages/add-lesson'));
export const LessonPage = lazy(() => import('src/pages/lesson'));
export const TrainersPage = lazy(() => import('src/pages/trainers'));
export const TrainerPage = lazy(() => import('src/pages/trainer'));
export const AddTrainerPage = lazy(() => import('src/pages/add-trainer'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'courses', element: <CourseTypePage /> },
        { path: 'courses/:type', element: <CoursesPage /> },
        { path: 'courses/:id/add', element: <AddCoursePage /> },
        { path: 'courses/:type/:courseId', element: <CoursePage /> },
        { path: 'courses/:type/:courseId/add', element: <AddLessonPage /> },
        { path: 'courses/:type/:courseId/:lessonId', element: <LessonPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'trainers', element: <TrainersPage /> },
        { path: 'trainers/:id', element: <TrainerPage /> },
        { path: 'trainers/add', element: <AddTrainerPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
