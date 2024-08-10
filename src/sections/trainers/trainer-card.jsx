import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import { useDeleteTrainerMutation } from 'src/store/reducers/trainers';

// ----------------------------------------------------------------------

export default function TrainerCard({ trainer }) {
  const [deleteTrainer, { isLoading }] = useDeleteTrainerMutation();
  const {
    id,
    path_to_background: cover,
    path_to_avatar: avatarUrl,
    first_name: firstName,
    last_name: lastName,
  } = trainer;

  const renderAvatar = (
    <Avatar
      alt={firstName}
      src={avatarUrl}
      sx={{
        zIndex: 9,
        width: 90,
        height: 90,
        position: 'absolute',
        left: (theme) => theme.spacing(9),
        bottom: (theme) => theme.spacing(-5),
      }}
    />
  );

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      component={RouterLink}
      to={`/trainers/${trainer.id}`}
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        position: 'relative',
        zIndex: 9,
      }}
    >
      {firstName} {lastName}
    </Link>
  );

  const renderCover = (
    <Box
      component="img"
      alt={firstName}
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
        width: 230,
        height: 127,
        zIndex: 9,
        bottom: -56,
        position: 'absolute',
        color: 'background.paper',
        objectFit: 'cover',
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
      onClick={async () => {
        await deleteTrainer(id);
      }}
      disabled={isLoading}
    >
      <Iconify icon="carbon:trash-can" />
    </IconButton>
  );
  return (
    <Grid xs={12} sm={6} md={3}>
      <Card>
        {renderDelete}
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 5 / 6)',
          }}
        >
          {renderShape}

          {renderAvatar}

          {renderCover}
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(5, 3, 1, 3),
          }}
        >
          {renderTitle}
        </Box>
      </Card>
    </Grid>
  );
}

TrainerCard.propTypes = {
  trainer: PropTypes.object.isRequired,
};
