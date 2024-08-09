import { Helmet } from 'react-helmet-async';

import { TrainersView } from 'src/sections/trainers/view';

// ----------------------------------------------------------------------

export default function CourseTypePage() {
  return (
    <>
      <Helmet>
        <title> Тренеры | Holiwell Admin </title>
      </Helmet>

      <TrainersView />
    </>
  );
}
