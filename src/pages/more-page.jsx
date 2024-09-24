import { Helmet } from 'react-helmet-async';

import { MoreView } from 'src/sections/more';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Еще | Holwell Admin </title>
      </Helmet>

      <MoreView />
    </>
  );
}
