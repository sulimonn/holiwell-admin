import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';

import { Box, Card, alpha, Stack, Button, TextField, IconButton, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useGetSliderQuery, useEditSliderMutation } from 'src/store/reducers/sliders';

const Slider = () => {
  const { data = [] } = useGetSliderQuery(1);
  const [editSlider, { isLoading }] = useEditSliderMutation();
  const dispatch = useDispatch();

  const [sliders, setSlider] = useState(data);

  React.useEffect(() => {
    setSlider(data);
  }, [data]);

  const firstRef = React.useRef(null);
  const secondRef = React.useRef(null);
  const thirdRef = React.useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.keys(sliders).forEach((key) => {
      if (!key.startsWith('path_to')) formData.append(key, sliders[key]);
    });
    const response = await editSlider({ id: 1, data: formData });

    if (response?.error) {
      dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
    } else {
      dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6">Слайдер</Typography>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Pagination, Navigation, A11y]}
        >
          {[
            {
              id: 'first',
              ref: firstRef,
            },
            {
              id: 'second',
              ref: secondRef,
            },
            {
              id: 'third',
              ref: thirdRef,
            },
          ].map((slider, index) => (
            <SwiperSlide key={slider.id}>
              <Stack spacing={2} sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
                <Box
                  width="100%"
                  height={{ xs: 200, md: 500 }}
                  overflow="hidden"
                  position="relative"
                >
                  <IconButton
                    sx={{ position: 'absolute', top: 10, right: 10, zIndex: 9 }}
                    color="error"
                    variant="contained"
                    onClick={() =>
                      setSlider({
                        ...sliders,
                        [`path_to_cover_${slider.id}`]: null,
                        [`cover_${slider.id}`]: null,
                      })
                    }
                  >
                    <Iconify icon="carbon:close" />
                  </IconButton>
                  {sliders[`path_to_cover_${slider.id}`] && (
                    <Box
                      component="img"
                      alt="path_to_cover_first"
                      src={sliders[`path_to_cover_${slider.id}`]}
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
                        slider.ref.current.click();
                      }}
                      sx={{ p: 2 }}
                      color="inherit"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={slider.ref}
                        onChange={(event) => {
                          const file = event.target.files[0];
                          if (file) {
                            setSlider({
                              ...sliders,
                              [`path_to_cover_${slider.id}`]: URL.createObjectURL(file),
                              [`cover_${slider.id}`]: file,
                            });
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
                  value={sliders[`title_${slider.id}`] || ''}
                  onChange={(event) =>
                    setSlider({ ...sliders, [`title_${slider.id}`]: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Описание"
                  value={sliders[`text_${slider.id}`] || ''}
                  multiline
                  rows={2}
                  onChange={(event) =>
                    setSlider({ ...sliders, [`text_${slider.id}`]: event.target.value })
                  }
                />
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
        <Button variant="contained" type="submit" disabled={isLoading}>
          Сохранить
        </Button>
      </Stack>
    </Card>
  );
};

export default Slider;
