import React from 'react';
import { useDispatch } from 'react-redux';

import { Card, Stack, Button, TextField, Typography } from '@mui/material';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useGetInfoQuery, useUpdateInfoMutation } from 'src/store/reducers/sliders';

const InfoView = () => {
  const { data = {} } = useGetInfoQuery();
  const [edit, { isLoading }] = useUpdateInfoMutation();
  const [info, setInfo] = React.useState(data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();

    formData.append('title', info.title);
    formData.append('text', info.text);

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
