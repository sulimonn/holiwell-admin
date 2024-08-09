import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, alpha, Button, Container, TextField, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { debounce } from 'src/utils/utlities';

import Iconify from 'src/components/iconify';

import {
  useGetLessonQuery,
  useEditLessonMutation,
  useDeleteLessonMutation,
} from 'src/store/reducers/course';

const LessonView = () => {
  const { lessonId: id } = useParams();
  const { data = {}, isSuccess } = useGetLessonQuery(id);
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
  const [editLesson] = useEditLessonMutation(id);
  const [lesson, setLesson] = useState(data);
  const fileInputRef = React.useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      setLesson(data);
    }
  }, [isSuccess, data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (field, value) => {
      const formData = new FormData();
      formData.append(field, value);
      const response = await editLesson({ id, data: formData });
      if (!response?.data) {
        setLesson((prevLesson) => ({ ...prevLesson, [field]: value }));
      }
    }, 500),
    [id]
  );

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setLesson((prevLesson) => ({ ...prevLesson, title: newTitle }));
    debouncedSave('title', newTitle);
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value;
    setLesson((prevLesson) => ({ ...prevLesson, description: newDescription }));
    debouncedSave('description', newDescription);
  };

  if (!isSuccess) {
    return null;
  }

  return (
    <Container>
      <Box display="flex" mb={2}>
        <Button
          onClick={async () => {
            const response = await deleteLesson(id);
            console.log(1);
            if (!response?.data) {
              router.push(`/courses/${lesson.course_type_slug}/${lesson.course_id}`);
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
          Удалить урок
        </Button>
      </Box>
      <Box width="100%" height={{ xs: 300, md: 500 }} overflow="hidden" position="relative">
        <Box
          component="img"
          alt={lesson.title}
          src={lesson.path_to_cover}
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
              onChange={async (event) => {
                const file = event.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('cover', file);
                  const response = await editLesson({ id, data: formData });
                  if (!response?.data) {
                    setLesson((prevLesson) => ({
                      ...prevLesson,
                      path_to_cover: URL.createObjectURL(file),
                    }));
                  }
                }
              }}
            />
            <Iconify icon="eva:camera-fill" sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" sx={{ my: 3 }} flexDirection="column" gap={2}>
        <TextField
          variant="standard"
          label="Название урока"
          value={lesson.title}
          inputProps={{ sx: { fontSize: { xs: 18, sm: 24 }, fontWeight: 'bold' } }}
          onChange={handleTitleChange}
        />
        <TextField
          variant="standard"
          label="Описание урока"
          value={lesson.description}
          multiline
          rows={4}
          inputProps={{
            sx: { fontSize: { xs: 15, sm: 22 }, fontWeight: '400', lineHeight: 1.2 },
          }}
          onChange={handleDescriptionChange}
        />
      </Box>
    </Container>
  );
};

export default LessonView;
