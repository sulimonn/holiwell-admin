import { Helmet } from 'react-helmet-async';

import { CourseView } from 'src/sections/courses/course-view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Курс | Holiwell Admin </title>
      </Helmet>

      <CourseView />
    </>
  );
}
