import React from 'react';

// ----------------------------------------------------------------------

import { Stack, Container, Typography } from '@mui/material';

import { InfoView } from './info';
import { SliderView } from './slider';

const MoreView = () => (
  <Container>
    <Stack spacing={2}>
      <Typography variant="h5">Допольнительно</Typography>
      <SliderView />
      <InfoView />
    </Stack>
  </Container>
);

export default MoreView;
