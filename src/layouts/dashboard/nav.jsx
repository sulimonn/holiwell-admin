import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import { List, Collapse, TextField } from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { useAuth } from 'src/contexts';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useFetchAllTypesQuery } from 'src/store/reducers/course';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!user) {
    return null;
  }
  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        color: 'inherit',
        textDecoration: 'none',
      }}
      component={RouterLink}
      to="/user/me"
    >
      <Avatar src={user.path_to_avatar} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{`${user.first_name} ${user.last_name}`}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          SuperUser
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = pathname.includes(item.slug) || pathname.includes(item.path);
  const { data: services = [], isFetching } = useFetchAllTypesQuery();
  if (isFetching) {
    return null;
  }

  return (
    <>
      <ListItemButton
        component={RouterLink}
        href={item?.slug ? `/courses/${item.slug}` : item.path}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          my: 0.5,
          ...(active && {
            color: item.level === 1 ? 'primary.main' : 'text.primary',
            fontWeight: item.level === 1 ? 'fontWeightSemiBold' : 'fontWeightMedium',
            bgcolor: (theme) =>
              alpha(
                item.level === 1 ? theme.palette.primary.dark : theme.palette.primary.main,
                0.15
              ),
            '&:hover': {
              bgcolor: (theme) =>
                alpha(
                  item.level === 1 ? theme.palette.primary.dark : theme.palette.primary.main,
                  0.2
                ),
            },
          }),
        }}
      >
        {item.icon && (
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
        )}

        <Box
          component="span"
          sx={{ whiteSpace: 'nowrap', '&:first-letter': { textTransform: 'uppercase' } }}
          textTransform="lowercase"
        >
          {item.title.length > 16 ? `${item.title.slice(0, 16)}...` : item.title}
        </Box>
        {(item?.path === '/courses' || item?.children) && (
          <Iconify
            icon={active ? 'carbon:chevron-down' : 'carbon:chevron-right'}
            sx={{ ml: 'auto' }}
          />
        )}
      </ListItemButton>
      {(item?.path === '/courses' || item?.children) && (
        <NavSub
          open={active}
          items={item?.path === '/courses' ? services : item.children}
          addButton
        />
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

// ----------------------------------------------------------------------

function NavSub({ open, items, addButton = false }) {
  const [isAdd, setIsAdd] = React.useState(false);
  return (
    <Collapse in={open} timeout="auto" unmountOnExit sx={{ pl: 3 }}>
      <List
        component="div"
        sx={{
          '&:before': {
            top: '0px',
            left: '0px',
            width: '2px',
            content: '""',
            position: 'absolute',
            bottom: '30px',
            backgroundColor: 'primary.light',
          },
        }}
        disablePadding
      >
        {items.map((item) => (
          <Box
            key={item.title}
            sx={{
              position: 'relative',
              ml: 1.5,
              '&:before': {
                left: '0px',
                top: '15px',
                content: '""',
                position: 'absolute',
                width: '12px',
                height: '12px',
                transform: 'translate(calc(12px * -1), calc(12px * -0.4))',
                backgroundColor: 'primary.light',
                mask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 50% 50% / 100% no-repeat",
              },
            }}
          >
            <NavItem item={item} />
          </Box>
        ))}

        {addButton && (
          <Box
            sx={{
              position: 'relative',
              ml: 1.5,
              '&:before': {
                left: '0px',
                top: '15px',
                content: '""',
                position: 'absolute',
                width: '12px',
                height: '12px',
                transform: 'translate(calc(12px * -1), calc(12px * -0.4))',
                backgroundColor: 'primary.light',
                mask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 50% 50% / 100% no-repeat",
              },
            }}
          >
            {!isAdd ? (
              <ListItemButton
                onClick={() => setIsAdd(!isAdd)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{ whiteSpace: 'nowrap' }}
                  variant="body2"
                  color="text.secondary"
                >
                  Добавить сервис
                </Typography>
              </ListItemButton>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <TextField size="small" variant="outlined" label="Название сервиса" />

                <Iconify
                  icon="carbon:checkmark"
                  sx={{ color: 'success.main', cursor: 'pointer' }}
                />

                <Iconify
                  icon="carbon:close"
                  onClick={() => setIsAdd(!isAdd)}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            )}
          </Box>
        )}
      </List>
    </Collapse>
  );
}

NavSub.propTypes = {
  open: PropTypes.bool,
  items: PropTypes.array,
  addButton: PropTypes.bool,
};
