import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency, getLessonWord } from 'src/utils/format-number';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function ShopCourseCard({ course, link }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(course.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {course.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={course.title}
      src={course.path_to_cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  // eslint-disable-next-line no-unused-vars
  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {course.priceSale && fCurrency(course.priceSale)}
      </Typography>
      &nbsp;
      {fCurrency(course.price)}
    </Typography>
  );

  const renderDescription = (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        {course.description.slice(0, 20)}...
      </Typography>
      {course.lessons && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {course.lessons.length} {getLessonWord(course.lessons.length)}
        </Typography>
      )}
    </Box>
  );
  return (
    <Box component={RouterLink} to={link} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '100%' }}>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {course.status && renderStatus}

          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
            {course.title}
          </Link>

          {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>  */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {renderDescription}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}

ShopCourseCard.propTypes = {
  course: PropTypes.object,
  link: PropTypes.string,
};
