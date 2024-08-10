import { Helmet } from 'react-helmet-async';

import { AddTrainerView } from 'src/sections/trainers/add-trainer-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Новый тренер | Holwell Admin </title>
      </Helmet>

      <AddTrainerView />
    </>
  );
}
