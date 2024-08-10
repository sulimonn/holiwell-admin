import { Helmet } from 'react-helmet-async';

import { AddCourseView } from 'src/sections/courses/add-course-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Новый курс | Holwell Admin </title>
      </Helmet>

      <AddCourseView />
    </>
  );
}
