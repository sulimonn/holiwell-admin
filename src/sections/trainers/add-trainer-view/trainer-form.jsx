import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';

import { Box, Card, Avatar, Button, Container, TextField, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import AvatarCutter from 'src/components/cutter';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useAddTrainerMutation, useEditTrainerMutation } from 'src/store/reducers/trainers';

const TrainerForm = ({ trainer: initialTrainer, isFetching }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const avaRef = useRef(null);
  const bgRef = useRef(null);
  const [avatar, setAvatar] = useState(initialTrainer?.path_to_avatar);
  const [background, setBackground] = useState(initialTrainer?.path_to_background);
  const [trainer, setTrainer] = useState(initialTrainer);
  const [open, setOpen] = useState(false);

  const [addTrainer, { isLoading: isAdding }] = useAddTrainerMutation();
  const [editTrainer, { isLoading: isEditing }] = useEditTrainerMutation();

  React.useEffect(() => {
    if (initialTrainer?.path_to_avatar) {
      setAvatar(initialTrainer.path_to_avatar);
    }
    if (initialTrainer?.path_to_background) {
      setBackground(initialTrainer.path_to_background);
    }
    setTrainer({
      ...initialTrainer,
      avatar: initialTrainer?.path_to_avatar,
      background: initialTrainer?.path_to_background,
    });
  }, [initialTrainer]);

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        position: 'absolute',
        width: { xs: 300, sm: 400 },
        height: { xs: 150, sm: 200 },
        zIndex: 10,
        top: { xs: 215, sm: 186 },
        left: -1,
        color: 'background.paper',
      }}
    />
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(trainer).forEach((key) => {
      if (key === 'avatar' || key === 'background') {
        if (typeof trainer[key] !== 'string') {
          formData.append(key, trainer[key]);
        }
      } else {
        formData.append(key, trainer[key]);
      }
    });
    if (!initialTrainer) {
      const response = await addTrainer(formData);

      if (!response?.error) {
        router.push('/trainers');
        dispatch(toggleSnackbar({ message: 'Тренер добавлен', type: 'success' }));
      } else {
        dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
      }
    } else {
      const response = await editTrainer({ id: initialTrainer.id, data: formData });
      if (!response?.error) {
        router.push('/trainers');
        dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
      } else {
        dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
    setOpen(true);
  };

  return (
    <Container>
      <Card sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: 300,
            position: 'relative',
            backgroundColor: 'grey.400',
          }}
        >
          {background && (
            <Box
              component="img"
              sx={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              src={background}
              alt="cover"
            />
          )}

          <IconButton
            sx={{
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 9,

              p: 1.5,
            }}
            onClick={() => bgRef.current.click()}
          >
            <input
              type="file"
              hidden
              ref={bgRef}
              accept="image/*"
              onChange={(event) => {
                const bg = URL.createObjectURL(event.target.files[0]);
                setBackground(bg);
                setTrainer((prevTrainer) => ({
                  ...prevTrainer,
                  background: event.target.files[0],
                }));
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32, color: 'white' }} />
          </IconButton>
        </Box>
        <AvatarCutter
          image={avatar}
          setImage={(croppedAvatar) => {
            setAvatar(URL.createObjectURL(croppedAvatar)); // Set cropped image
            setTrainer((prevTrainer) => ({
              ...prevTrainer,
              avatar: croppedAvatar,
            }));
          }}
          open={open}
          handleClose={() => setOpen(false)}
        />

        {renderShape}
        <Box
          sx={{
            left: { xs: 90, sm: 125 },
            top: { xs: 235, sm: 215 },
            position: 'absolute',
            zIndex: 10,
          }}
        >
          <Avatar
            sx={{
              width: { xs: 115, sm: 150 },
              height: { xs: 115, sm: 150 },
            }}
            src={avatar}
            alt="avatar"
          />
          <IconButton
            sx={{
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 9,
              backgroundColor: 'grey.400',
            }}
            color="inherit"
            onClick={(event) => {
              avaRef.current.click();
            }}
          >
            <input type="file" hidden ref={avaRef} accept="image/*" onChange={handleImageUpload} />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32, color: 'white' }} />
          </IconButton>
        </Box>
        <Box display="flex" gap={1} flexDirection="column" px={{ xs: 4, sm: 10 }} py={5} mt={5}>
          <TextField
            variant="standard"
            label="Имя"
            value={trainer?.first_name || ''}
            onChange={(event) => {
              const newFirstName = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, first_name: newFirstName }));
            }}
            name="first_name"
          />
          <TextField
            variant="standard"
            label="Фамилия"
            value={trainer?.last_name || ''}
            onChange={(event) => {
              const newLastName = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, last_name: newLastName }));
            }}
            name="last_name"
          />
          <TextField
            variant="standard"
            label="Описание"
            multiline
            rows={4}
            value={trainer?.description || ''}
            onChange={(event) => {
              const newDescription = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, description: newDescription }));
            }}
            name="description"
          />
        </Box>
        <Box sx={{ width: '100%', px: { xs: 4, sm: 10 }, pb: 5 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ width: '100%' }}
            disabled={
              !trainer?.first_name ||
              !trainer?.last_name ||
              !trainer?.description ||
              !trainer?.avatar ||
              !trainer?.background ||
              isAdding ||
              isEditing
            }
          >
            Сохранить
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

TrainerForm.propTypes = {
  trainer: PropTypes.object,
  isFetching: PropTypes.bool,
};

export default TrainerForm;
