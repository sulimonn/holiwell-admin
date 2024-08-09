import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Link, Card, Stack, Avatar, Typography, IconButton } from '@mui/material';

import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function LessonCard({ post, index, link }) {
  const { path_to_cover: cover, title, number_of_views: view, trainer } = post;

  const latestPostLarge = index === 0;

  const latestPost = index === 1 || index === 2;

  const renderAvatar = (
    <Box
      display="flex"
      gap={1}
      position="absolute"
      sx={{
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
        ...((latestPostLarge || latestPost) && {
          zIndex: 9,
          top: 24,
          left: 24,
          width: 40,
          height: 40,
        }),
        zIndex: 9,
        alignItems: latestPostLarge || latestPost ? 'center' : 'flex-end',
      }}
    >
      <Avatar
        alt={trainer.first_name}
        src={trainer.path_to_avatar}
        sx={{
          width: 32,
          height: 32,
        }}
      />
      <Typography
        variant="caption"
        color={latestPostLarge || latestPost ? 'common.white' : 'common.black'}
        sx={{ mb: latestPostLarge || latestPost ? 0 : -0.5 }}
      >
        {trainer.first_name} {trainer.last_name}
      </Typography>
    </Box>
  );

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      component={RouterLink}
      to={link}
      sx={{
        height: 'auto',
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
      style={{
        height: 'auto',
      }}
    >
      {title}
    </Link>
  );

  const renderInfo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      {[{ number: view, icon: 'eva:eye-fill' }].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          sx={{
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderCover = (
    <Box
      component="img"
      alt={title}
      src={cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );
  const renderDelete = (
    <IconButton
      sx={{
        position: 'absolute',
        right: 24,
        top: 24,
        zIndex: 9,
        backgroundColor: 'grey.100',
        '&:hover': {
          backgroundColor: 'grey.500',
        },
      }}
    >
      <Iconify icon="carbon:trash-can" />
    </IconButton>
  );

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {renderDelete}

          {renderShape}

          {renderAvatar}

          {renderCover}
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(4, 3, 3, 3),
            ...((latestPostLarge || latestPost) && {
              width: 1,
              bottom: 0,
              position: 'absolute',
            }),
          }}
        >
          {renderTitle}

          {renderInfo}
        </Box>
      </Card>
    </Grid>
  );
}

LessonCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
  link: PropTypes.string,
};
