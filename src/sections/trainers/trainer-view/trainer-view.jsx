import { useParams } from 'react-router-dom';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Card, Avatar, Container, TextField, IconButton } from '@mui/material';

import { debounce } from 'src/utils/utlities';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import { useGetTrainerQuery, useEditTrainerMutation } from 'src/store/reducers/trainers';

const TrainerView = () => {
  const { id } = useParams();
  const avaRef = useRef(null);
  const bgRef = useRef(null);
  const { data = {}, isSuccess } = useGetTrainerQuery(id);
  const [editTrainer, { isLoading: isEditing }] = useEditTrainerMutation();
  const [trainer, setTrainer] = useState(data);

  useEffect(() => {
    if (isSuccess) {
      setTrainer(data);
    }
  }, [isSuccess, data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (field, value) => {
      const formData = new FormData();
      formData.append(field, value);
      const response = await editTrainer({ id: trainer.id, data: formData });
      if (!response?.data) {
        setTrainer((prevTrainer) => ({ ...prevTrainer, [field]: value }));
      }
    }, 500),
    [id, trainer.id, editTrainer]
  );

  if (!isSuccess) {
    return null;
  }

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

  return (
    <Container>
      <Card sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: 300,
            position: 'relative',
          }}
        >
          <Box
            component="img"
            sx={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            src={trainer?.path_to_background}
            alt="cover"
          />

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
            disabled={isEditing}
          >
            <input
              type="file"
              hidden
              ref={bgRef}
              accept="image/*"
              onChange={async (event) => {
                const formData = new FormData();
                formData.append('background', event.target.files[0]);
                const response = await editTrainer({ id: trainer.id, data: formData });
                if (!response?.data) {
                  setTrainer((prevTrainer) => ({
                    ...prevTrainer,
                    path_to_background: URL.createObjectURL(event.target.files[0]),
                  }));
                }
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32, color: 'white' }} />
          </IconButton>
        </Box>
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
            src={trainer?.path_to_avatar}
            alt="avatar"
          />
          <IconButton
            sx={{
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 9,
            }}
            color="inherit"
            disabled={isEditing}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              avaRef.current.click();
            }}
          >
            <input
              type="file"
              hidden
              ref={avaRef}
              accept="image/*"
              onChange={async (event) => {
                const formData = new FormData();
                formData.append('avatar', event.target.files[0]);
                const response = await editTrainer({ id: trainer.id, data: formData });
                if (!response?.data) {
                  setTrainer((prevTrainer) => ({
                    ...prevTrainer,
                    path_to_avatar: URL.createObjectURL(event.target.files[0]),
                  }));
                }
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32, color: 'white' }} />
          </IconButton>
        </Box>
        <Box display="flex" gap={1} flexDirection="column" px={10} py={5} mt={5}>
          <TextField
            variant="standard"
            label="Имя"
            value={trainer?.first_name}
            onChange={(event) => {
              const newFirstName = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, first_name: newFirstName }));
              debouncedSave('first_name', newFirstName);
            }}
          />
          <TextField
            variant="standard"
            label="Фамилия"
            value={trainer?.last_name}
            onChange={(event) => {
              const newLastName = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, last_name: newLastName }));
              debouncedSave('last_name', newLastName);
            }}
          />
          <TextField
            variant="standard"
            label="Описание"
            multiline
            rows={4}
            value={trainer?.description}
            onChange={(event) => {
              const newDescription = event.target.value;
              setTrainer((prevTrainer) => ({ ...prevTrainer, description: newDescription }));
              debouncedSave('description', newDescription);
            }}
          />
        </Box>
      </Card>
    </Container>
  );
};

export default TrainerView;
