import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  alpha,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  Typography,
  IconButton,
  FormControl,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

import { useAddLessonMutation } from 'src/store/reducers/course';
import { useGetTrainersQuery } from 'src/store/reducers/trainers';

const LessonForm = () => {
  const { type, courseId: id } = useParams();
  const [lesson, setLesson] = useState();
  const [cover, setCover] = useState();
  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();
  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const audioInputRef = React.useRef(null);
  const router = useRouter();
  const { data: trainers, isSuccess } = useGetTrainersQuery();

  const [addLesson, { isLoading }] = useAddLessonMutation();

  console.log(video);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(lesson).forEach((key) => {
      formData.append(key, lesson[key]);
    });
    formData.append('course_id', id);
    const response = await addLesson(formData);
    if (!response?.data) {
      setLesson({});
      router.push(`/courses/${type}/${id}`);
    }
  };
  console.log(type);

  if (!isSuccess) {
    return null;
  }

  return (
    <Container>
      <Box width="100%" height={{ xs: 300, md: 500 }} overflow="hidden" position="relative">
        {cover && (
          <Box
            component="img"
            alt="cover"
            src={cover}
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
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) =>
              alpha(video ? theme.palette.grey[100] : theme.palette.grey[900], 0.4),
            color: (theme) => theme.palette.getContrastText(theme.palette.grey[900]),
          }}
        >
          <IconButton
            variant="contained"
            size="large"
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current.click();
            }}
            sx={{ p: 2, pointerEvents: 'auto' }}
            color="inherit"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files[0];
                setLesson({ ...lesson, cover: file });
                setCover(URL.createObjectURL(file));
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" sx={{ my: 3 }} flexDirection="column" gap={2}>
        <TextField
          variant="standard"
          label="Название урока"
          value={lesson?.title}
          inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
          onChange={(event) => setLesson({ ...lesson, title: event.target.value })}
        />
        <TextField
          variant="standard"
          label="Описание урока"
          value={lesson?.description}
          multiline
          rows={4}
          inputProps={{
            sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
          }}
          onChange={(event) => setLesson({ ...lesson, description: event.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="trainer_id_label">Тренер</InputLabel>
          <Select
            id="trainer_id"
            labelId="trainer_id_label"
            label="Тренер"
            value={lesson?.trainer_id || ''}
            onChange={(event) => setLesson({ ...lesson, trainer_id: event.target.value })}
          >
            {trainers?.map((trainer) => (
              <MenuItem key={trainer.id} value={trainer.id}>
                {trainer.first_name} {trainer.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {(type === 'meditation' || type === 'training') && (
          <Box
            width="100%"
            height={{ xs: 300, md: 500 }}
            my={2}
            overflow="hidden"
            position="relative"
          >
            {video && (
              <Box
                component="video"
                alt={type}
                src={video}
                controls
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
                pointerEvents: 'none',
                bgcolor: (theme) => alpha(theme.palette.grey[900], video ? 0 : 0.4),
                color: (theme) => theme.palette.getContrastText(theme.palette.grey[900]),
              }}
            >
              <IconButton
                variant="contained"
                size="large"
                onClick={(event) => {
                  event.stopPropagation();
                  videoInputRef.current.click();
                }}
                sx={{ p: 2, pointerEvents: 'auto' }}
                color="inherit"
              >
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  ref={videoInputRef}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setLesson({ ...lesson, video: file });
                    setVideo(URL.createObjectURL(file));
                  }}
                />
                <Iconify icon="eva:video-fill" sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
          </Box>
        )}
        {(type === 'listening' || type === 'training') && (
          <Box>
            <Typography variant="body1" color="text.secondary">
              Аудио
            </Typography>
            <Box
              width="100%"
              height={{ xs: 50, md: 60 }}
              mb={2}
              mt={1}
              overflow="hidden"
              position="relative"
              display="flex"
            >
              {audio && (
                <Box
                  component="audio"
                  alt={type}
                  src={audio}
                  controls
                  sx={{
                    pl: { xs: 4, sm: 5 },
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
                  pointerEvents: 'none',
                  justifyContent: 'flex-start',
                  borderRadius: '50px',
                  border: '2px solid',
                  borderColor: (theme) => theme.palette.grey[500],
                  color: (theme) => theme.palette.getContrastText(theme.palette.grey[900]),
                }}
              >
                <IconButton
                  variant="contained"
                  size="large"
                  onClick={(event) => {
                    event.stopPropagation();
                    audioInputRef.current.click();
                  }}
                  sx={{ p: 2, pointerEvents: 'auto' }}
                  color="primary"
                >
                  <input
                    type="file"
                    accept="audio/*"
                    hidden
                    ref={audioInputRef}
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setLesson({ ...lesson, audio: file });
                      setAudio(URL.createObjectURL(file));
                    }}
                  />
                  <Iconify
                    icon="eva:download-fill"
                    sx={{ width: { xs: 25, sm: 32 }, height: { xs: 25, sm: 32 } }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, width: '100%' }}
        onClick={handleSubmit}
        disabled={!lesson?.title || !lesson?.description || !lesson?.cover || isLoading}
      >
        Сохранить
      </Button>
    </Container>
  );
};

export default LessonForm;
