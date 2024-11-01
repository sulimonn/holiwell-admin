import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';

import { Card, Stack, Button, Typography } from '@mui/material';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import {
  useGetSlidersQuery,
  useAddSliderMutation,
  useEditSliderMutation,
} from 'src/store/reducers/sliders';

import './pagination.css';
import SliderCard from './slider-card';

const Slider = () => {
  const { data = [], isFetching } = useGetSlidersQuery();
  const [editSlider, { isLoading }] = useEditSliderMutation();
  const [addSlider, { isLoading: isAdding }] = useAddSliderMutation();
  const dispatch = useDispatch();

  const [sliders, setSliders] = useState(data || []);

  React.useEffect(() => {
    if (data.length > 0) setSliders(data.filter((slider) => slider?.id !== 7));
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    sliders.forEach(async (slider) => {
      const formData = new FormData();
      Object.keys(slider).forEach((key) => {
        if (!key.startsWith('path_to')) formData.append(key, slider[key]);
      });
      if (slider?.id) {
        const response = await editSlider({ id: slider?.id, data: formData });

        if (response?.error) {
          dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
        } else {
          dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
        }
      } else {
        const response = await addSlider(formData);

        if (response?.error) {
          dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
        } else {
          dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
        }
      }
    });
  };
  if (isFetching) {
    return null;
  }

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
          style={{
            overflow: 'visible',
          }}
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={slider.id}>
              <Stack direction="row" justifyContent="center">
                <SliderCard
                  slider={slider}
                  setSlider={setSliders}
                  index={index}
                  sliders={sliders}
                />
                {index === sliders.length - 1 && (
                  <Button
                    variant="contained"
                    sx={{
                      px: { xs: 1, sm: 2 },
                      minWidth: 0,
                    }}
                    onClick={() =>
                      setSliders([
                        ...sliders,
                        {
                          path_to_cover_first: null,
                          title_first: null,
                          text_first: null,
                        },
                      ])
                    }
                  >
                    +
                  </Button>
                )}
              </Stack>
            </SwiperSlide>
          ))}
          {sliders.length === 0 && (
            <SwiperSlide>
              <Stack direction="row" justifyContent="stretch">
                <Button
                  variant="outlined"
                  sx={{ p: 7, width: '100%' }}
                  onClick={() =>
                    setSliders([
                      ...sliders,
                      {
                        path_to_cover_first: null,
                        title_first: null,
                        text_first: null,
                      },
                    ])
                  }
                >
                  Добавить слайд
                </Button>
              </Stack>
            </SwiperSlide>
          )}
        </Swiper>
        <Button variant="contained" type="submit" disabled={isLoading || isAdding}>
          Сохранить
        </Button>
      </Stack>
    </Card>
  );
};

export default Slider;
