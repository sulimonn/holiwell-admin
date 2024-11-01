/* eslint-disable no-cond-assign */
import React from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Form, Field, Formik } from 'formik';

import { Card, Stack, Button, Divider, TextField, Typography } from '@mui/material';

import { toggleSnackbar } from 'src/store/reducers/snackbar';
import { useGetSliderQuery, useEditSliderMutation } from 'src/store/reducers/sliders';

const allowedUrls = ['profile', 'calendar', 'meditation', 'listening', 'training', 'trainers'];
const allowedTags = ['user.first_name', 'user.last_name', 'user.email'];

const testLink = (value) => {
  if (!value) return true;
  const linkPattern = /([\wа-яА-ЯёЁ]+)\/(\b[\wа-яА-ЯёЁ-]+\b)/g;
  let match;
  while ((match = linkPattern.exec(value))) {
    console.log(match);

    if (!allowedUrls.includes(match[2])) {
      return false;
    }
  }
  return true;
};

const testTags = (value) => {
  if (!value) return true; // Skip validation if no value
  const tagPattern = /@([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)?)/g; // User tag pattern
  let match;
  while ((match = tagPattern.exec(value))) {
    if (!allowedTags.includes(match[1])) {
      return false; // Invalid tag found
    }
  }
  return true;
};

const validationSchema = Yup.object().shape({
  title_first: Yup.string()
    .max(255)
    .required('Заголовок обязателен')
    .test('allowed-links', 'Некорректный формат ссылки', testLink),
  text_first: Yup.string()
    .max(255)
    .required('Текст обязателен')
    .test('allowed-links', 'Некорректный формат ссылки', testLink),
  title_second: Yup.string()
    .max(255)
    .required('Заголовок обязателен')
    .test('allowed-links', 'Некорректный формат ссылки', testLink)
    .test('tags', 'Некорректный тег', testTags),
  text_second: Yup.string()
    .max(255)
    .required('Текст обязателен')
    .test('tags', 'Некорректный тег', testTags)
    .test('allowed-links', 'Некорректный формат ссылки', testLink),
});

const WelcomeView = () => {
  const { data = {}, isFetching } = useGetSliderQuery(7);
  const [editSlider] = useEditSliderMutation();

  const dispatch = useDispatch();

  if (isFetching) {
    return null;
  }

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Formik
          initialValues={{
            title_first: data?.title_first || '',
            text_first: data?.text_first || '',
            title_second: data?.title_second || '',
            text_second: data?.text_second || '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              formData.append(key, values[key]);
            });
            const response = await editSlider({ id: data?.id, data: formData });
            if (response?.error) {
              setStatus({ success: false });
              setSubmitting(false);
              dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
            } else {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <Typography variant="h5">Добро пожаловать</Typography>
                <Typography variant="body2">
                  Чтобы добавить ссылку, напишите название/ссылка, возможные ссылки:{' /'}
                  {allowedUrls.join(', /')}.<br /> Чтобы добавить тег, напишите @тег, возможные
                  теги:
                  {' @'}
                  {allowedTags.join(', @')}
                </Typography>

                <Divider>До авторизации</Divider>

                <Field
                  as={TextField}
                  fullWidth
                  name="title_first"
                  label="Заголовок до авторизации"
                  placeholder="Заголовок"
                  variant="outlined"
                  value={values.title_first}
                  onChange={handleChange}
                  error={Boolean(touched.title_first && errors.title_first)}
                  helperText={touched.title_first && errors.title_first}
                />

                <Stack>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={4}
                    name="text_first"
                    label="Текст до авторизации"
                    placeholder="Текст"
                    variant="outlined"
                    value={values.text_first}
                    onChange={handleChange}
                    error={Boolean(touched.text_first && errors.text_first)}
                    helperText={touched.text_first && errors.text_first}
                  />
                </Stack>

                <Divider>После авторизации</Divider>

                <Field
                  as={TextField}
                  fullWidth
                  name="title_second"
                  label="Заголовок после авторизации"
                  placeholder="Заголовок"
                  variant="outlined"
                  value={values.title_second}
                  onChange={handleChange}
                  error={Boolean(touched.title_second && errors.title_second)}
                  helperText={touched.title_second && errors.title_second}
                />

                <Field
                  as={TextField}
                  fullWidth
                  multiline
                  rows={4}
                  name="text_second"
                  label="Текст после авторизации"
                  placeholder="Текст"
                  variant="outlined"
                  value={values.text_second}
                  onChange={handleChange}
                  error={Boolean(touched.text_second && errors.text_second)}
                  helperText={touched.text_second && errors.text_second}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    isSubmitting ||
                    !values.title_first ||
                    !values.text_first ||
                    !values.title_second ||
                    !values.text_second ||
                    errors.title_first ||
                    errors.text_first ||
                    errors.title_second ||
                    errors.text_second
                  }
                >
                  Сохранить
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
      <Card sx={{ p: 3 }}>
        <Formik
          initialValues={{
            title_third: data?.title_third || '',
          }}
          validationSchema={Yup.object().shape({
            title_third: Yup.string()
              .max(255)
              .required('Текст обязателен')
              .test('allowed-links', 'Некорректный формат ссылки', testLink),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              formData.append(key, values[key]);
            });
            const response = await editSlider({ id: data?.id, data: formData });
            if (response?.error) {
              setStatus({ success: false });
              setSubmitting(false);
              dispatch(toggleSnackbar({ message: 'Произошла ошибка', type: 'error' }));
            } else {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(toggleSnackbar({ message: 'Изменения сохранены', type: 'success' }));
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <Typography variant="h5">Календарь</Typography>
                <Typography variant="body2">
                  Чтобы добавить ссылку, напишите название/ссылка, возможные ссылки:{' /'}
                  {allowedUrls.join(', /')}
                </Typography>

                <Field
                  as={TextField}
                  fullWidth
                  name="title_third"
                  label="Текст календаря"
                  placeholder="Текст календаря"
                  variant="outlined"
                  value={values.title_third}
                  onChange={handleChange}
                  error={Boolean(touched.title_third && errors.title_third)}
                  helperText={touched.title_third && errors.title_third}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !values.title_third}
                >
                  Сохранить
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default WelcomeView;
