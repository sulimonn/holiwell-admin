import React from 'react';
import { useDispatch } from 'react-redux';

import { Box, Card, Stack, alpha, Button, TextField, Typography, IconButton } from '@mui/material';

import Iconify from 'src/components/iconify';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useGetInfoQuery, useUpdateInfoMutation } from 'src/store/reducers/sliders';

const InfoView = () => {
  const { data = {} } = useGetInfoQuery();
  const [edit, { isLoading }] = useUpdateInfoMutation();
  const [info, setInfo] = React.useState(data);
  const inputRef = React.useRef(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('title', info.title);
    formData.append('text', info.text);
    if (typeof info?.video === 'object' && info?.video) {
      formData.append('video', info?.video);
    }

    const response = await edit(formData);

    if (response?.error) {
      dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
    } else {
      dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5">Информация о сайте</Typography>
        <Box width="100%" height={{ xs: 200, md: 500 }} overflow="hidden" position="relative">
          {info?.path_to_video && (
            <Box
              component="img"
              alt="info cover"
              src={info.path_to_video}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
              color: (theme) => theme.palette.getContrastText(theme.palette.grey[900]),
            }}
          >
            <IconButton
              variant="contained"
              size="large"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current.click();
              }}
              sx={{ p: 2 }}
              color="inherit"
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={inputRef}
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    setInfo({ ...info, path_to_video: URL.createObjectURL(file), video: file });
                  }
                }}
              />
              <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>
        </Box>
        <TextField
          fullWidth
          label="Заголовок"
          value={info.title || ''}
          onChange={(event) => setInfo({ ...info, title: event.target.value })}
        />
        <TextField
          fullWidth
          multiline
          label="Описание сайта"
          rows={3}
          value={info.text || ''}
          onChange={(event) => setInfo({ ...info, text: event.target.value })}
        />
        <Button variant="contained" type="submit" disabled={isLoading}>
          Сохранить
        </Button>
      </Stack>
    </Card>
  );
};

export default InfoView;
