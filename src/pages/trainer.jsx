import { Helmet } from 'react-helmet-async';

import { TrainerView } from 'src/sections/trainers/trainer-view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Тренер | Holiwell Admin </title>
      </Helmet>

      <TrainerView />
    </>
  );
}
