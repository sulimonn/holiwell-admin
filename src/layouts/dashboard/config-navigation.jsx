import { getCourse } from 'src/utils/get-courses';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const training = await getCourse('training');
const listening = await getCourse('listening');
const meditation = await getCourse('meditation');

const navConfig = [
  {
    title: 'Пользователи',
    path: '/user',
    icon: icon('ic_user'),
    level: 1,
  },
  {
    title: 'Курсы',
    path: '/courses',
    icon: icon('ic_cart'),
    level: 1,
    children: [
      {
        title: 'Тренируйся',
        path: '/courses/training',
        level: 2,
        children: training.courses
          ? [
              ...training.courses.map((item) => ({
                ...item,
                path: `/courses/training/${item.id}`,
                level: 3,
              })),
            ]
          : null,
      },
      {
        title: 'Слушай',
        path: '/courses/listening',
        level: 2,
        children: listening.courses
          ? [
              ...listening.courses.map((item) => ({
                ...item,
                path: `/courses/listening/${item.id}`,
                level: 3,
              })),
            ]
          : null,
      },
      {
        title: 'Медитируй',
        path: '/courses/meditation',
        level: 2,
        children: meditation.courses
          ? [
              ...meditation.courses.map((item) => ({
                ...item,
                path: `/courses/meditation/${item.id}`,
                level: 3,
              })),
            ]
          : null,
      },
    ],
  },
  {
    title: 'Трейнеры',
    path: '/trainers',
    icon: icon('ic_settings'),
    level: 1,
  },
];

export default navConfig;
