import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Box,
  alpha,
  Button,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useAddCourseMutation } from 'src/store/reducers/course';

import AudioInput from '../audio';

const CourseForm = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('course_id');
  const router = useRouter();
  const [addCourse, { isLoading }] = useAddCourseMutation();
  const [course, setCourse] = useState({});
  const [cover, setCover] = useState();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(course).forEach((key) => {
      formData.append(key, course[key]);
    });
    formData.append('course_type_id', id);
    formData.append('price_cource', id);
    const response = await addCourse(formData);

    if (!response?.data && !response?.error) {
      setCourse({});
      router.push(`/courses/${type}`);
      dispatch(toggleSnackbar({ message: 'Курс добавлен', type: 'success' }));
    } else {
      dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
    }
  };

  return (
    <Container component="form" onSubmit={handleSubmit}>
      <Box width="100%" height={500} overflow="hidden" position="relative">
        {cover && (
          <Box
            component="img"
            alt={course?.title}
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
              fileInputRef.current.click();
            }}
            sx={{ p: 2 }}
            color="inherit"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files[0];
                setCover(URL.createObjectURL(file));
                setCourse({ ...course, cover: file });
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" sx={{ my: 3 }} flexDirection="column" gap={2}>
        <TextField
          variant="standard"
          label="Название курса"
          value={course?.title || ''}
          inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
          onChange={(event) => setCourse({ ...course, title: event.target.value })}
          name="title"
        />
        <TextField
          variant="standard"
          label="Описание курса"
          value={course?.description || ''}
          onChange={(event) => setCourse({ ...course, description: event.target.value })}
          multiline
          rows={4}
          inputProps={{
            sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
          }}
          name="description"
        />
        <TextField
          variant="standard"
          label="Цена"
          value={course?.price_cource || ''}
          name="price_cource"
          onChange={(event) => setCourse({ ...course, price_cource: event.target.value })}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">₽</InputAdornment>,
          }}
          min="0"
          sx={{
            mb: 2,
          }}
        />

        {type === 'training' && (
          <AudioInput
            path_to_audio={course?.cover_audio}
            setPathToAudio={(path) => setCourse({ ...course, cover_audio: path })}
          />
        )}
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, width: '100%' }}
        onClick={handleSubmit}
        disabled={
          !course?.title ||
          !course?.description ||
          !course?.cover ||
          !course?.price_cource ||
          !course?.cover_audio ||
          isLoading
        }
      >
        Сохранить {isLoading && <CircularProgress sx={{ ml: 1 }} size={15} />}
      </Button>
    </Container>
  );
};

export default CourseForm;
