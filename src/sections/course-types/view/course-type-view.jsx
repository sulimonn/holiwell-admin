import React, { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack, Container, Typography } from '@mui/material';

import CourseSort from 'src/sections/courses/course-sort';
import ShopCourseCard from 'src/sections/courses/course-card';
import CourseFilters from 'src/sections/courses/course-filters';

import { useGetCoursesQuery } from 'src/store/reducers/course';

const CourseTypeView = () => {
  const { data: courses = [], isSuccess } = useGetCoursesQuery();

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  if (!isSuccess) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Все курсы
      </Typography>

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
      <Box>
        <Grid container spacing={5}>
          {courses.map((course) => (
            <Grid key={course.id} xs={12} sm={6} md={3} sx={{ height: '100%' }}>
              <ShopCourseCard
                course={course}
                link={`/courses/${course.course_type_slug}/${course.id}`}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CourseTypeView;
