import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useGetCourseByTypeQuery } from 'src/store/reducers/course';

import CourseCard from '../course-card';
import CourseSort from '../course-sort';
import CourseFilters from '../course-filters';
import CourseCartWidget from '../course-cart-widget';

// ----------------------------------------------------------------------

export default function CoursesView() {
  const { type } = useParams();
  const { data: course = {}, isSuccess } = useGetCourseByTypeQuery(type);
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
      <Typography variant="h4" sx={{ mb: 5 }} textTransform="capitalize">
        {course.slug}
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

      <CourseCartWidget />
    </Container>
  );
}
