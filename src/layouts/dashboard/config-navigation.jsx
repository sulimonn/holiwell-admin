import { getCourse } from 'src/utils/get-courses';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

let training;
let listening;
let meditation;
const fetchCourses = async () => {
  training = await getCourse('training');
  listening = await getCourse('listening');
  meditation = await getCourse('meditation');
};

fetchCourses();

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
        children: training?.courses
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
        children: listening?.courses
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
        children: meditation?.courses
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
    title: 'Тренеры',
    path: '/trainers',
    icon: icon('ic_trainers'),
    level: 1,
  },
];

export default navConfig;
