import { Helmet } from 'react-helmet-async';

import { CourseTypeView } from 'src/sections/course-types/view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Курсы | Holiwell Admin </title>
      </Helmet>

      <CourseTypeView />
    </>
  );
}
