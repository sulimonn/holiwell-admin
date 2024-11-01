/* eslint-disable arrow-body-style */
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  alpha,
  Stack,
  Button,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Unstable_Grid2 as Grid,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { debounce } from 'src/utils/utlities';

import Iconify from 'src/components/iconify';
import AvatarCutterDialog from 'src/components/cutter';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import {
  useGetCourseQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useAddNextLessonMutation,
  useAddPrevLessonMutation,
  useDeleteNextLessonMutation,
  useDeletePrevLessonMutation,
} from 'src/store/reducers/course';

import AudioInput from '../audio';
import AudioCard from '../audio-card';
import ReorderLessons from './reorder';
import LessonCard from '../lesson-card';
import CourseSort from '../course-sort';

// const orderLessons = (lessons) => {
//   const lessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));

//   let currentLesson = lessons.find((lesson) => !lesson.prev_lesson_id);

//   const orderedLessons = [];

//   while (currentLesson) {
//     orderedLessons.push(currentLesson);
//     currentLesson = lessonsById[currentLesson.next_lesson_id] || null; // Переходим к следующему уроку
//   }

//   return orderedLessons;
// };

const CourseView = () => {
  const { courseId: id } = useParams();
  const dispatch = useDispatch();
  const [sortOption, setSortOption] = useState('default');
  const { data = {}, isSuccess, isFetching } = useGetCourseQuery({ id, sort_by: sortOption });
  const [editCourse] = useEditCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [addNext] = useAddNextLessonMutation();
  const [deleteNext] = useDeleteNextLessonMutation();
  const [addPrev] = useAddPrevLessonMutation();
  const [deletePrev] = useDeletePrevLessonMutation();
  const [course, setCourse] = useState(data);
  const [reorder, setReorder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cover, setCover] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const audioRef = useRef(new Audio());
  const [playing, setPlaying] = React.useState(false);

  useEffect(() => {
    if (isSuccess) {
      setCourse(data);
      setCover(data?.path_to_cover);
    }
  }, [isSuccess, data]);

  const handlePlayPause = (audio_id, audioPath) => {
    if (playing === audio_id) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      if (audioRef.current.src !== audioPath) {
        audioRef.current.src = audioPath;
      }
      audioRef.current
        .play()
        .then(() => setPlaying(audio_id))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.onended = () => {
        setPlaying(null);
      };
    }
    return () => {
      if (audio) audio.pause();
    };
  }, []);

  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleMediaChange = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('cover_audio', file);
    const response = await editCourse({ id, data: formData });
    if (!response?.data) {
      setCourse((prevLesson) => ({
        ...prevLesson,
        [`path_to_url_audio`]: file ? URL.createObjectURL(file) : null,
      }));
      dispatch(toggleSnackbar({ open: true, message: 'Аудио обновлено', type: 'success' }));
    }

    setIsLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (field, value) => {
      const formData = new FormData();
      formData.append(field, value);
      const response = await editCourse({ id, data: formData });
      if (!response?.data) {
        setCourse((prevCourse) => ({ ...prevCourse, [field]: value }));
      }
    }, 500),
    [id, setCourse]
  );

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setCourse((prevCourse) => ({ ...prevCourse, title: newTitle }));
    debouncedSave('title', newTitle);
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value;
    setCourse((prevCourse) => ({ ...prevCourse, description: newDescription }));
    debouncedSave('description', newDescription);
  };

  const handlePriceChange = (event) => {
    const newPrice = event.target.value;
    setCourse((prevCourse) => ({ ...prevCourse, price_cource: newPrice }));
    debouncedSave('price_cource', newPrice);
  };

  const handleReorder = async () => {
    course.lessons.forEach(async (lesson) => {
      if (lesson.links_after?.id) {
        // await deleteNext(lesson.links_after.linked_lesson_id);
        // await deleteNext(lesson.links_after.lesson_id);
        await deleteNext(lesson.links_after.id);
      }
      if (lesson.links_before?.id) {
        // await deletePrev(lesson.links_before.linked_lesson_id);
        // await deletePrev(lesson.links_before.lesson_id);
        await deletePrev(lesson.links_before.id);
      }
      if (lesson.next_lesson_id) {
        await addNext({ lesson_id: lesson.id, link_after_lesson_id: lesson.next_lesson_id });
      }
      if (lesson.prev_lesson_id) {
        await addPrev({ lesson_id: lesson.id, link_before_lesson_id: lesson.prev_lesson_id });
      }
    });
    dispatch(
      toggleSnackbar({
        open: true,
        message: 'Уроки перемещены',
        severity: 'success',
      })
    );
    setReorder(false);
  };
  if (!isSuccess || isFetching) {
    return null;
  }
  const handleSortChange = (value) => {
    setSortOption(value);
  };

  return (
    <Container>
      <AvatarCutterDialog
        image={cover}
        setImage={async (file) => {
          if (file) {
            const formData = new FormData();
            formData.append('cover', file);
            const response = await editCourse({ id, data: formData });
            if (!response?.data) {
              setCourse((prevCourse) => ({
                ...prevCourse,
                path_to_cover: URL.createObjectURL(file),
              }));
              setCover(URL.createObjectURL(file));
            }
          }
        }}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        shape="rect"
      />
      <Box display="flex" mb={2}>
        <Button
          onClick={async () => {
            const response = await deleteCourse(id);
            if (!response?.data) {
              router.push(`/courses/${course.course_type_slug}`);
            }
          }}
          disabled={isDeleting}
          sx={{
            p: 1,
            minWidth: 0,
            ml: 'auto',
            mr: 0,
          }}
          color="error"
          endIcon={<Iconify icon="carbon:trash-can" />}
        >
          Удалить курс
        </Button>
      </Box>
      <Box width="100%" height={500} overflow="hidden" position="relative">
        <Box
          component="img"
          alt={course.title}
          src={cover}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
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
              fileInputRef.current.click();
            }}
            sx={{ p: 2 }}
            color="inherit"
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={(event) => {
                const file = event.target.files[0];
                setCover(URL.createObjectURL(file));
                setOpenDialog(true);
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" sx={{ my: 3 }} flexDirection="column" gap={2}>
        <TextField
          variant="standard"
          label="Название курса"
          value={course.title || ''}
          inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
          onChange={handleTitleChange}
        />
        <TextField
          variant="standard"
          label="Описание курса"
          value={course.description || ''}
          multiline
          rows={4}
          inputProps={{
            sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
          }}
          onChange={handleDescriptionChange}
        />
        <TextField
          variant="standard"
          label="Цена"
          value={course?.price_cource || ''}
          name="price_cource"
          onChange={handlePriceChange}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">₽</InputAdornment>,
          }}
          min="0"
          sx={{
            mb: 2,
          }}
        />

        <AudioInput
          path_to_audio={course?.path_to_url_audio}
          setPathToAudio={(file) => {
            handleMediaChange(file);
          }}
          audioLoading={isLoading}
        />
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
        gap={1}
        sx={{ mb: 5 }}
      >
        <CourseSort onSort={handleSortChange} sortOption={sortOption} />
        <Stack direction="row" spacing={1}>
          <Button
            component={Link}
            to={`/courses/${course.course_type_slug}/${course.id}/add`}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {course.course_type_slug === 'training' ? 'Новый урок' : 'Добавить аудио'}
          </Button>
          {!reorder ? (
            <Button onClick={() => setReorder((prev) => !prev)} variant="contained" color="inherit">
              Изменить порядок
            </Button>
          ) : (
            <Button onClick={handleReorder} variant="contained" color="inherit">
              Сохранить
            </Button>
          )}
        </Stack>
      </Stack>
      {!reorder ? (
        <Grid container spacing={3}>
          {course.lessons &&
            (course.course_type_slug === 'training' ? (
              course.lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  post={lesson}
                  index={index}
                  link={`/courses/${lesson.course_type_slug}/${lesson.course_id}/${lesson.id}`}
                />
              ))
            ) : (
              <Box maxWidth={800} width="100%" display="flex" flexDirection="column" mx="auto">
                {course.lessons.map((lesson) => (
                  <AudioCard
                    lesson={lesson}
                    key={lesson.id}
                    handlePlayPause={handlePlayPause}
                    playing={playing}
                  />
                ))}
              </Box>
            ))}
        </Grid>
      ) : (
        <ReorderLessons
          initialLessons={course?.lessons || []}
          setLessons={(lessons) => setCourse({ ...course, lessons })}
        />
      )}
    </Container>
  );
};

export default CourseView;
