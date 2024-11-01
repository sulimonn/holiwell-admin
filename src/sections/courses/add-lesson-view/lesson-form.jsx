import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Card,
  alpha,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import AvatarCutterDialog from 'src/components/cutter';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useGetTrainersQuery } from 'src/store/reducers/trainers';
import { useAddLessonMutation, useEditLessonMutation } from 'src/store/reducers/course';

import Audio from '../audio';

const LessonForm = ({ lessonId, data }) => {
  const dispatch = useDispatch();
  const { progress } = useSelector((state) => state.snackbar);
  const { type, courseId: id } = useParams();
  const router = useRouter();
  const { data: trainers, isSuccess } = useGetTrainersQuery();

  const [openDialog, setOpenDialog] = useState(false);
  const [lesson, setLesson] = useState({
    ...data,
    trainer_id: data?.trainer?.id,
    cover: data?.path_to_cover,
    video: data?.path_to_video,
    audio: data?.path_to_audio,
  });
  const [cover, setCover] = useState(data?.path_to_cover);
  const [video, setVideo] = useState(data?.path_to_video);

  const [addLesson, { isLoading }] = useAddLessonMutation();
  const [editLesson, { isLoading: isEditing }] = useEditLessonMutation();

  React.useEffect(() => {
    if (data) {
      setLesson({
        ...data,
        trainer_id: data?.trainer?.id,
        cover: data?.path_to_cover,
        video: data?.path_to_video,
        audio: data?.path_to_audio,
      });
      setCover(data?.path_to_cover);
      setVideo(data?.path_to_video);
    }
  }, [data]);

  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.keys(lesson).forEach((key) => {
      if (lesson[key]) {
        if (key === 'cover' || key === 'video' || key === 'audio') {
          if (typeof lesson[key] === 'object') {
            formData.append(key, lesson[key]);
          }
        } else if (!key.startsWith('path_to')) {
          formData.append(key, lesson[key]);
        }
      }
    });
    formData.append('course_id', id);

    const response = lessonId
      ? await editLesson({ id: lessonId, data: formData })
      : await addLesson(formData);

    if (!response?.error) {
      setLesson({});
      router.push(`/courses/${type}/${id}`);
      dispatch(
        toggleSnackbar({
          message: lessonId ? 'Изменения сохранены' : 'Урок добавлен',
          type: 'success',
        })
      );
    } else {
      dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
    }
  };

  if (!isSuccess) return null;

  return (
    <Container component="form" onSubmit={handleSubmit}>
      <AvatarCutterDialog
        image={cover}
        setImage={(file) => {
          setLesson({ ...lesson, cover: file });
          setCover(URL.createObjectURL(file));
        }}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        shape="rect"
      />

      <Card sx={{ p: 3 }}>
        {type === 'training' && (
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
                  name="cover"
                  ref={fileInputRef}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setCover(URL.createObjectURL(file));
                    setOpenDialog(true);
                  }}
                />
                <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
          </Box>
        )}
        <Box display="flex" sx={{ my: 3 }} flexDirection="column" gap={2}>
          <TextField
            variant="standard"
            label="Название урока"
            required
            value={lesson?.title || ''}
            inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
            onChange={(event) => setLesson({ ...lesson, title: event.target.value })}
          />
          <TextField
            variant="standard"
            label="Описание урока"
            value={lesson?.description || ''}
            multiline
            rows={4}
            required
            inputProps={{
              sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
            }}
            onChange={(event) => setLesson({ ...lesson, description: event.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel id="trainer_id_label">Тренер</InputLabel>
            <Select
              variant="standard"
              id="trainer_id"
              labelId="trainer_id_label"
              label="Тренер"
              value={lesson?.trainer_id || lesson?.trainer?.id || ''}
              onChange={(event) => setLesson({ ...lesson, trainer_id: event.target.value })}
            >
              {trainers?.map((trainer) => (
                <MenuItem key={trainer.id} value={trainer.id}>
                  {trainer.first_name} {trainer.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {type === 'training' && (
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
                    accept="video/mp4"
                    hidden
                    name="video"
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

          {type !== 'training' && (
            <Audio
              path_to_audio={data?.path_to_audio}
              setPathToAudio={(path) => setLesson({ ...lesson, audio: path })}
              audio_length={data?.audio_length}
            />
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, width: '100%' }}
          disabled={
            !lesson?.title ||
            !lesson?.description ||
            (!lesson?.cover && type === 'training') ||
            isLoading ||
            !lesson?.trainer_id ||
            (type === 'training' && !lesson?.video) ||
            (type !== 'training' && !lesson?.audio) ||
            isEditing
          }
        >
          {isLoading || isEditing ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={24} sx={{ mr: 2 }} />
              Загрузка {progress}%
            </Box>
          ) : (
            'Сохранить'
          )}
        </Button>
      </Card>
    </Container>
  );
};

LessonForm.propTypes = {
  lessonId: PropTypes.number,
  data: PropTypes.object,
};

export default LessonForm;
