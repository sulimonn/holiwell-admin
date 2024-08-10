import { useParams } from 'react-router-dom';
import React, { useRef, useState } from 'react';

import { Box, alpha, Button, Container, TextField, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

import { useAddCourseMutation } from 'src/store/reducers/course';

const CourseForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const [addCourse, { isLoading }] = useAddCourseMutation();
  const [course, setCourse] = useState({});
  const [cover, setCover] = useState();
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(course).forEach((key) => {
      formData.append(key, course[key]);
    });
    formData.append('course_type_id', id);
    const response = await addCourse(formData);
    if (!response?.data) {
      setCourse({});
      router.push('/courses');
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
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, width: '100%' }}
        onClick={handleSubmit}
        disabled={!course?.title || !course?.description || !course?.cover || isLoading}
      >
        Сохранить
      </Button>
    </Container>
  );
};

export default CourseForm;
