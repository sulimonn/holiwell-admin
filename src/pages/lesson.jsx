import { Helmet } from 'react-helmet-async';

import { LessonView } from 'src/sections/courses/lesson-view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Урок | Holiwell Admin </title>
      </Helmet>

      <LessonView />
    </>
  );
}
