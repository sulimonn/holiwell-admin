import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/user/profile';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Профиль | Holwell Admin </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
