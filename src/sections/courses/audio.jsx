import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Slider, IconButton, Typography, CircularProgress } from '@mui/material';

import { timeToSeconds, formatDuration } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

const AudioInput = ({
  path_to_audio,
  setPathToAudio,
  audio_length = '00:00:00',
  audioLoading = false,
}) => {
  const [audio, setAudio] = useState(path_to_audio);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(timeToSeconds(audio_length));

  const audioInputRef = React.useRef(null);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    audioRef.current = new Audio(audio);

    audioRef.current.onplay = () => setPlaying(true);
    audioRef.current.onpause = () => setPlaying(false);
    audioRef.current.onended = () => setPlaying(false);

    // Update the duration when metadata is loaded
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    // Update the slider as the audio plays
    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    return () => {
      if (audioRef) audioRef.current.pause();
    };
  }, [audio]);

  React.useEffect(() => {
    setAudio(path_to_audio);
  }, [path_to_audio]);

  const handlePlayAudio = () => {
    if (audio) {
      // Toggle between play and pause
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  // Function to handle slider change (seeking audio)
  const handleSliderChange = (event, newValue) => {
    setCurrentTime(newValue);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary">
        Аудио
      </Typography>
      <Box width="100%" height={{ xs: 50, md: 60 }} mb={2} mt={1} overflow="hidden" display="flex">
        <IconButton
          variant="contained"
          size="large"
          onClick={(event) => {
            event.stopPropagation();
            audioInputRef.current.click();
          }}
          sx={{ pointerEvents: 'auto' }}
          color="primary"
        >
          <input
            type="file"
            accept="audio/mp3,audio/mpeg,audio/wav"
            hidden
            name="audio"
            ref={audioInputRef}
            onChange={(event) => {
              const file = event.target.files[0];
              setPathToAudio(file);
              setAudio(URL.createObjectURL(file));
            }}
          />
          {audioLoading ? (
            <CircularProgress size={28} color="primary" />
          ) : (
            <Iconify
              icon="eva:download-fill"
              sx={{ width: { xs: 25, sm: 28 }, height: { xs: 25, sm: 28 } }}
            />
          )}
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '50px',
            width: '100%',
            border: '1px solid',
            borderColor: 'primary.main',
            color: (theme) => theme.palette.getContrastText(theme.palette.grey[900]),
          }}
        >
          <IconButton variant="contained" size="large" onClick={handlePlayAudio} color="primary">
            <Iconify
              icon={playing ? 'eva:pause-circle-outline' : 'eva:arrow-right-outline'}
              sx={{ width: 28, height: 28 }}
            />
          </IconButton>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSliderChange}
            aria-labelledby="audio-slider"
            sx={{ width: '100%' }}
          />
          <Typography variant="subtitle2" component="span" color="text.primary" sx={{ mx: 1 }}>
            {formatDuration(currentTime)}/{formatDuration(path_to_audio ? duration : 0)}
          </Typography>
        </Box>
        <IconButton
          variant="contained"
          size="large"
          onClick={(event) => {
            event.stopPropagation();
            setPathToAudio(null);
            setAudio(null);
          }}
          sx={{ pointerEvents: 'auto' }}
          color="primary"
        >
          <Iconify
            icon="eva:trash-2-outline"
            sx={{ width: { xs: 25, sm: 28 }, height: { xs: 25, sm: 28 } }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

AudioInput.propTypes = {
  path_to_audio: PropTypes.string,
  setPathToAudio: PropTypes.func,
  audio_length: PropTypes.string,
  audioLoading: PropTypes.bool,
};

export default AudioInput;
