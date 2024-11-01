import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

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
  },
  {
    title: 'Тренеры',
    path: '/trainers',
    icon: icon('ic_trainers'),
    level: 1,
  },
  {
    title: 'Еще',
    path: '/more',
    icon: icon('ic_settings'),
    level: 1,
  },
];

export default navConfig;
