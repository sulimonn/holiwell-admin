import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetLessonQuery } from 'src/store/reducers/course';

import LessonForm from '../add-lesson-view/lesson-form';

const Lesson = () => {
  const { lessonId } = useParams();
  const { data, isFetching } = useGetLessonQuery(lessonId);
  if (isFetching) return <div>Loading...</div>;

  return <LessonForm lessonId={parseInt(lessonId, 10)} data={data} />;
};

export default Lesson;
