import { Helmet } from 'react-helmet-async';

import { CoursesView } from 'src/sections/courses/view';

// ----------------------------------------------------------------------

export default function CoursesPage() {
  return (
    <>
      <Helmet>
        <title> Курсы | Holiwell Admin </title>
      </Helmet>

      <CoursesView />
    </>
  );
}
