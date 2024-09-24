import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Card, Stack, Button, Container, TextField, Typography } from '@mui/material';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import {
  useGetUserQuery,
  useEditUserMutation,
  useUpdateAvatarMutation,
} from 'src/store/reducers/users';

import Default from './default.png';

const ProfileView = () => {
  const { id } = useParams();
  const [userData, setUserData] = React.useState();
  const [avatar, setAvatar] = React.useState();

  const dispatch = useDispatch();

  const { data, isSuccess, isFetching } = useGetUserQuery(id);
  const [editUser, { isLoading }] = useEditUserMutation();
  const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();

  React.useEffect(() => {
    if (data) {
      setUserData(data);
      setAvatar({ path_to_avatar: data?.path_to_avatar, avatar: data?.path_to_avatar });
    }
  }, [data]);
  if (!isSuccess) {
    return null;
  }
  if (isFetching) {
    return (
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          Загрузка...
        </Typography>
      </Stack>
    );
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = userData;
    const response = await editUser({ data: user, id });

    if (response?.error) {
      dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
    } else if (typeof avatar?.avatar === 'object' && avatar?.avatar) {
      const formData = new FormData();
      formData.append('avatar', avatar?.avatar);
      const respons = await updateAvatar(formData);
      if (respons?.error) {
        dispatch(
          toggleSnackbar({ message: 'Произошла ошибка при обновлении аватара', type: 'error' })
        );
      } else {
        dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
      }
    } else {
      dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
    }
  };
  return (
    <Container>
      <Card sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            {id === 'me' ? 'Мой профиль' : 'Профиль пользователя'}
          </Typography>
          <Stack spacing={3} sx={{ width: { xs: '100%', md: 400 } }}>
            <Stack spacing={2} sx={{ width: '100%' }} alignItems="center">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={avatar?.path_to_avatar || Default}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Button sx={{ position: 'relative' }}>
                <input
                  accept="image/*"
                  type="file"
                  style={{
                    width: '100%',
                    height: '100%',
                    inset: 0,
                    zIndex: 1,
                    opacity: 0,
                    position: 'absolute',
                  }}
                  multiple={false}
                  name="path_to_avatar"
                  id="path_to_avatar"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatar((prevData) => ({
                      path_to_avatar: URL.createObjectURL(file),
                      avatar: file,
                    }));
                  }}
                />
                <Typography variant="body2" color="text.primary">
                  СМЕНИТЬ ФОТО
                </Typography>
              </Button>
            </Stack>
            <TextField
              fullWidth
              label="Имя"
              name="first_name"
              value={userData?.first_name || ''}
              onChange={handleChange}
              type="text"
            />
            <TextField
              fullWidth
              label="Фамилия"
              name="last_name"
              value={userData?.last_name || ''}
              onChange={handleChange}
              type="text"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData?.email || ''}
              onChange={handleChange}
              type="email"
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: { xs: '100%', md: 400 } }}
            disabled={
              isLoading ||
              !userData?.first_name ||
              !userData?.last_name ||
              !userData?.email ||
              avatarLoading
            }
          >
            Сохранить
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default ProfileView;
