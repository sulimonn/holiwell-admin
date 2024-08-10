import { Link, useParams } from 'react-router-dom';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  alpha,
  Stack,
  Button,
  Container,
  TextField,
  IconButton,
  Unstable_Grid2 as Grid,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { debounce } from 'src/utils/utlities';

import Iconify from 'src/components/iconify';

import {
  useGetCourseQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
} from 'src/store/reducers/course';

import LessonCard from '../lesson-card';
import CourseSort from '../course-sort';

const CourseView = () => {
  const { courseId: id } = useParams();
  const { data = {}, isSuccess, isFetching } = useGetCourseQuery(id);
  const [editCourse] = useEditCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [course, setCourse] = useState(data);

  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      setCourse(data);
    }
  }, [isSuccess, data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (field, value) => {
      const formData = new FormData();
      formData.append(field, value);
      const response = await editCourse({ id, data: formData });
      if (!response?.data) {
        setCourse((prevCourse) => ({ ...prevCourse, [field]: value }));
      }
    }, 500),
    [id, setCourse]
  );

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setCourse((prevCourse) => ({ ...prevCourse, title: newTitle }));
    debouncedSave('title', newTitle);
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value;
    setCourse((prevCourse) => ({ ...prevCourse, description: newDescription }));
    debouncedSave('description', newDescription);
  };

  if (!isSuccess || isFetching) {
    return null;
  }

  return (
    <Container>
      <Box display="flex" mb={2}>
        <Button
          onClick={async () => {
            const response = await deleteCourse(id);
            if (!response?.data) {
              router.push(`/courses/${course.course_type_slug}`);
            }
          }}
          disabled={isDeleting}
          sx={{
            p: 1,
            minWidth: 0,
            ml: 'auto',
            mr: 0,
          }}
          color="error"
          endIcon={<Iconify icon="carbon:trash-can" />}
        >
          Удалить курс
        </Button>
      </Box>
      <Box width="100%" height={500} overflow="hidden" position="relative">
        <Box
          component="img"
          alt={course.title}
          src={course.path_to_cover}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
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
              hidden
              ref={fileInputRef}
              onChange={async (event) => {
                const file = event.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('cover', file);
                  const response = await editCourse({ id, data: formData });
                  if (!response?.data) {
                    setCourse((prevCourse) => ({
                      ...prevCourse,
                      path_to_cover: URL.createObjectURL(file),
                    }));
                  }
                }
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
          value={course.title}
          inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
          onChange={handleTitleChange}
        />
        <TextField
          variant="standard"
          label="Описание курса"
          value={course.description}
          multiline
          rows={4}
          inputProps={{
            sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
          }}
          onChange={handleDescriptionChange}
        />
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <CourseSort />
        <Button
          component={Link}
          to={`/courses/${course.course_type_slug}/${course.id}/add`}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Новый урок
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {course.lessons &&
          course.lessons.map((lesson, index) => (
            <LessonCard
              post={lesson}
              index={index}
              link={`/courses/${lesson.course_type_slug}/${lesson.course_id}/${lesson.id}`}
            />
          ))}
      </Grid>
    </Container>
  );
};

export default CourseView;
