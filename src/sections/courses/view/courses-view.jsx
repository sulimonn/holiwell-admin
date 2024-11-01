import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { useGetCourseByTypeQuery } from 'src/store/reducers/course';

import CourseCard from '../course-card';
import CourseSort from '../course-sort';

// ----------------------------------------------------------------------

export default function CoursesView() {
  const { type } = useParams();
  const [sortOption, setSortOption] = React.useState('new');
  const { data: course = {}, isSuccess } = useGetCourseByTypeQuery({ type, sort_by: sortOption });
  if (!isSuccess) {
    return null;
  }
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }} textTransform="capitalize">
        {course.slug}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <CourseSort onSort={setSortOption} sortOption={sortOption} exclude={['default']} />
        </Stack>
        <Button
          component={Link}
          to={`/courses/${course.slug}/add?course_id=${course.id}`}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Новый курс
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {course.courses?.map((courseItem) => (
          <Grid key={courseItem.id} xs={12} sm={6} md={3}>
            <CourseCard
              course={courseItem}
              link={`/courses/${courseItem.course_type_slug}/${courseItem.id}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
