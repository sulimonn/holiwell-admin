import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts';
import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const { login } = useAuth();
  const theme = useTheme();

  const router = useRouter();

  const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    const response = await login(formData);

    if (response?.data) {
      router.push('/');
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3} mt={3}>
        <TextField
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          label="Email address"
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Holiwell Admin</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}