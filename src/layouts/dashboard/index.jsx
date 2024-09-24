import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Alert, Snackbar } from '@mui/material';

import { closeSnackbar } from 'src/store/reducers/snackbar';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const { snackbar } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [openNav, setOpenNav] = useState(false);

  const handleCloseSnackbar = () => {
    dispatch(closeSnackbar());
  };

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
      <Snackbar
        open={snackbar.opened}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.type} sx={{ width: '100%' }} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
