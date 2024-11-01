import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PauseIcon from '@mui/icons-material/PauseRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrowRounded';
import {
  Box,
  Stack,
  Avatar,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import { timeToSeconds, formatDuration } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import { useDeleteLessonMutation } from 'src/store/reducers/course';

const AudioCard = ({ lesson, handlePlayPause, playing }) => {
  const [duration, setDuration] = React.useState(0);
  const [deleteLesson, { isLoading }] = useDeleteLessonMutation();

  React.useEffect(() => {
    setDuration(timeToSeconds(lesson.audio_length));
  }, [lesson]);

  const handleDelete = async () => {
    await deleteLesson(lesson.id);
  };

  return (
    <ListItem
      divider
      sx={{
        py: { xs: 2.4, md: 2.7 },
        px: { xs: 0, md: 'inherit' },
        '&.MuiListItem-divider:last-of-type': {
          borderBottom: 'none',
        },
        flexWrap: 'wrap',
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight="100"
        color="primary.main"
        width="100%"
        textAlign="right"
      >
        {formatDuration(duration)}
      </Typography>
      <Box display="grid" gridTemplateColumns="auto 1fr auto" width="100%" alignItems="center">
        <ListItemAvatar>
          <IconButton
            onClick={() => handlePlayPause(lesson.id, lesson.path_to_audio)}
            disabled={duration === 0}
          >
            <Avatar
              sx={{
                bgcolor: duration === 0 ? 'primary.light' : 'primary.main',
                transition: 'all 0.3s',
              }}
            >
              {playing === lesson.id ? (
                <PauseIcon sx={{ fontSize: '1.75rem' }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: '1.75rem' }} />
              )}
            </Avatar>
          </IconButton>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ textDecoration: 'none', display: 'block' }}
              component={Link}
              to={`/courses/${lesson.course_type_slug}/${lesson.course_id}/${lesson.id}`}
            >
              {lesson.title}
            </Typography>
          }
          secondary={
            <Typography
              variant="subtitle2"
              fontWeight="100"
              color="primary.main"
              mt={0.5}
              style={{ textDecoration: 'none', width: 'fit-content' }}
            >
              {lesson.trainer?.first_name} {lesson.trainer?.last_name}
            </Typography>
          }
          sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            component={Link}
            to={`/courses/${lesson.course_type_slug}/${lesson.course_id}/${lesson.id}`}
          >
            <ArrowBackIosIcon
              sx={{
                width: '0.75rem',
                height: '0.75rem',
                color: 'primary.light',
                transform: 'rotate(180deg)',
              }}
            />
          </Typography>
          <IconButton onClick={handleDelete} disabled={isLoading}>
            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
          </IconButton>
        </Stack>
      </Box>
    </ListItem>
  );
};

AudioCard.propTypes = {
  lesson: PropTypes.object,
  handlePlayPause: PropTypes.func,
  playing: PropTypes.number,
};

export default AudioCard;
