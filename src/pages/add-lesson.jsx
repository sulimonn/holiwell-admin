import { Helmet } from 'react-helmet-async';

import { AddLessonView } from 'src/sections/courses/add-lesson-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Новый урок | Holwell Admin </title>
      </Helmet>

      <AddLessonView />
    </>
  );
}
