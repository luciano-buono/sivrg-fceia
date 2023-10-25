import { FC } from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useSession from '../../hooks/useSession';
import { Button, Menu, em, rem } from '@mantine/core';
import { IconCalendar, IconCalendarCheck, IconLogout } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const clientActions = [
  {
    icon: <IconCalendarCheck style={{ width: rem(14), height: rem(14) }} />,
    redirect: '/booking',
    label: 'Agendar turno',
  },
  {
    icon: <IconCalendar style={{ width: rem(14), height: rem(14) }} />,
    redirect: '/reservations',
    label: 'Mis turnos',
  },
];

const employeeActions = [
  {
    icon: <IconCalendar style={{ width: rem(14), height: rem(14) }} />,
    redirect: 'admin/reservations',
    label: 'Turnos',
  },
];

const LoggedUserMenu: FC = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { user, isClient, logout } = useSession();

  const Actions = () => {
    const actions = isClient ? clientActions : employeeActions;
    return (
      <>
        {actions.map((action) => (
          <Menu.Item leftSection={action.icon}>
            <LinkContainer to={action.redirect}>
              <Nav.Link>{action.label}</Nav.Link>
            </LinkContainer>
          </Menu.Item>
        ))}
      </>
    );
  };

  return (
    <Menu shadow="md" width={200} withArrow>
      <div className="d-flex flex-row flex-wrap align-content-center">
        <Menu.Target>
          <Button className="d-flex flex-wrap align-content-center h-auto py-2">
            <div style={{ cursor: 'pointer' }} className="no-select d-flex flex-wrap align-items-center">
              {isMobile ? null : (
                <div className="pe-2">
                  Bienvenido,
                  {`${user.nickname ? user?.nickname.charAt(0).toUpperCase() + user.nickname.slice(1) : ''}!`}
                </div>
              )}
              <img
                style={{ borderRadius: '50%', height: `${isMobile ? '30px' : '25px'}` }}
                src={user?.picture}
                alt={user?.name}
              />
            </div>
          </Button>
        </Menu.Target>
        <Menu.Dropdown style={{ zIndex: 9999 }}>
          <Menu.Label>Acciones</Menu.Label>
          <Actions />
          <Menu.Divider />
          <Menu.Label>Cuenta</Menu.Label>
          <Menu.Item
            onClick={() => logout()}
            color="red"
            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          >
            Cerrar sesión
          </Menu.Item>
        </Menu.Dropdown>
      </div>
    </Menu>
  );
};

export default LoggedUserMenu;
