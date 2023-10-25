import { FC } from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useSession, { UserWithRoles } from '../../hooks/useSession';
import { Button, Menu, em, rem } from '@mantine/core';
import { IconCalendar, IconCalendarCheck, IconLogout } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const ClientActions = () => (
  <>
    <Menu.Item leftSection={<IconCalendarCheck style={{ width: rem(14), height: rem(14) }} />}>
      <LinkContainer to="/booking">
        <Nav.Link>Agendar turno</Nav.Link>
      </LinkContainer>
    </Menu.Item>
    <Menu.Item leftSection={<IconCalendar style={{ width: rem(14), height: rem(14) }} />}>
      <LinkContainer to="/reservations">
        <Nav.Link>Mis turnos</Nav.Link>
      </LinkContainer>
    </Menu.Item>
  </>
);

const EmployeeActions = () => <>{null}</>;

const LoggedUserMenu: FC = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { user, isClient, logout } = useSession();

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
          {isClient ? <ClientActions /> : <EmployeeActions />}
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
