import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Box, Stack, alpha, Button, TextField, IconButton } from '@mui/material';

import { checkMediaType } from 'src/utils/utlities';

import Iconify from 'src/components/iconify';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useDeleteSliderMutation } from 'src/store/reducers/sliders';

const SliderCard = ({ slider, setSlider, index, sliders }) => {
  const inputRef = React.useRef(null);
  const dispatch = useDispatch();
  const [type, setType] = React.useState(checkMediaType(slider?.path_to_cover_first || ''));
  const [deleteSlider, { isLoading }] = useDeleteSliderMutation();

  const handleDeleteSlider = async () => {
    if (slider?.id) {
      const response = await deleteSlider(slider?.id);
      if (response?.error) {
        dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
      } else {
        dispatch(toggleSnackbar({ message: 'Слайд удален', type: 'success' }));
      }
    } else {
      const newSliders = [...sliders];
      newSliders.splice(index, 1);
      setSlider(newSliders);
    }
  };

  return (
    <Stack sx={{ flex: 1 }}>
      {sliders.length > 1 && (
        <Button
          onClick={handleDeleteSlider}
          sx={{ alignSelf: 'flex-end' }}
          color="error"
          disabled={isLoading}
        >
          Удалить слайд
        </Button>
      )}
      <Stack spacing={2} sx={{ px: { xs: 1, sm: 4, md: 6 }, flex: 1 }}>
        <Box width="100%" height={{ xs: 200, md: 500 }} overflow="hidden" position="relative">
          {slider.path_to_cover_first && (
            <Box
              component={type === 'video' ? 'video' : 'img'}
              alt="slider cover"
              src={slider.path_to_cover_first}
              autoPlay
              muted
              loop
              playsInline
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

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
                inputRef.current.click();
              }}
              sx={{ p: 2 }}
              color="inherit"
            >
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                ref={inputRef}
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    setSlider([
                      ...sliders.slice(0, index),
                      {
                        ...sliders[index],
                        path_to_cover_first: URL.createObjectURL(file),
                        cover_first: file,
                      },
                      ...sliders.slice(index + 1, sliders.length),
                    ]);
                    setType(checkMediaType(file.name));
                  }
                }}
              />
              <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>
        </Box>
        <TextField
          fullWidth
          label="Заголовок"
          value={slider.title_first || ''}
          onChange={(event) =>
            setSlider([
              ...sliders.slice(0, index),
              { ...sliders[index], title_first: event.target.value },
              ...sliders.slice(index + 1, sliders.length),
            ])
          }
        />
        <TextField
          fullWidth
          label="Описание"
          value={slider.text_first || ''}
          multiline
          rows={2}
          onChange={(event) =>
            setSlider([
              ...sliders.slice(0, index),
              { ...sliders[index], text_first: event.target.value },
              ...sliders.slice(index + 1, sliders.length),
            ])
          }
        />
      </Stack>
    </Stack>
  );
};

SliderCard.propTypes = {
  slider: PropTypes.object,
  setSlider: PropTypes.func,
  index: PropTypes.number,
  sliders: PropTypes.array,
};
export default SliderCard;
