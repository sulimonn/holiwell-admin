import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Stack, Container, TextField, Unstable_Grid2 as Grid } from '@mui/material';

import { useGetCourseQuery } from 'src/store/reducers/course';

import CourseCard from '../course-card';
import CourseSort from '../course-sort';
import CourseFilters from '../course-filters';

const CourseView = () => {
  const { courseId: id } = useParams();
  const { data = {}, isSuccess, isFetching } = useGetCourseQuery(id);
  const [course, setCourse] = useState(data);
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  React.useEffect(() => {
    if (isSuccess) {
      setCourse(data);
    }
  }, [isSuccess, data]);

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  if (!isSuccess || isFetching) {
    return null;
  }
  return (
    <Container>
      <Box width="100%" height={500} overflow="hidden">
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
      </Box>
      <Box display="flex" alignItems="center" sx={{ my: 3 }}>
        <TextField
          variant="standard"
          value={course.title}
          inputProps={{ style: { fontSize: 24, fontWeight: 'bold' } }}
          onChange={(event) => {
            setCourse({ ...course, title: event.target.value });
          }}
        />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <CourseFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <CourseSort />
        </Stack>
      </Stack>
      <Grid container spacing={5}>
        {course.lessons &&
          course?.lessons.map((lesson) => (
            <Grid key={lesson.id} xs={12} sm={6} md={3} sx={{ height: '100%' }}>
              <CourseCard
                course={lesson}
                link={`/courses/${lesson.course_type_slug}/${lesson.course_id}/${lesson.id}`}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default CourseView;
