import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { AppShell, Container, Image, MantineProvider, NavLink, Text, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ClientPage from './pages/ClientPage/ClientPage';
import AdminPage from './pages/AdminPage';
import { FC } from 'react';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/es';
import LoginPage from './pages/LoginPage';
import useSession from './hooks/useSession';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import Header from './components/Header/';
import { useDisclosure } from '@mantine/hooks';
import { Col, Row } from 'react-bootstrap';
import { IconCalendar, IconHome, IconPhone, IconSocial } from '@tabler/icons-react';
import { IconCalendarCheck } from '@tabler/icons-react';
import About from './pages/About';
import Contact from './pages/Contact';
import NotAllowedPage from './pages/NotAllowedPage';
import useSessionEmpresa from './hooks/useSessionEmpresa';
import { Empresa } from './types';
import { Auth0ProviderWithNavigate } from './contexts/Auth0ProviderWithRedirect';

const queryClient = new QueryClient();

export const ProtectedRoutes: FC<{ allowedRoles?: string[]; redirectPath: string }> = ({
  allowedRoles,
  redirectPath,
}) => {
  const { isAuthenticated, user } = useSession();
  return user?.roles?.some((role) => (allowedRoles ? allowedRoles.includes(role) : true)) ? (
    <Outlet />
  ) : !isAuthenticated ? (
    <Navigate to={'/login'} replace />
  ) : (
    <Navigate to={redirectPath} replace />
  );
};

const theme = createTheme({
  fontFamily: 'sans-serif',
  primaryColor: 'blue',
});

function AppWrapper() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigate>
          <MantineProvider theme={theme}>
            <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 0, weekendDays: [0] }}>
              <Notifications />
              <App />
            </DatesProvider>
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const App = () => {
  const { getAccessTokenSilently, isAuthenticated, isClient, isLoading } = useSession();
  useEffect(() => {
    const getNewToken = async () => {
      let newAccessToken = '';
      try {
        newAccessToken = await getAccessTokenSilently();
      } catch (e) {
        console.log('Login required!');
      }
      window.localStorage.setItem('token', newAccessToken);
    };

    getNewToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  const [opened, { close, toggle }] = useDisclosure();

  const [active, setActive] = useState<number | undefined>();

  const { getEmpresaByUser } = useSessionEmpresa();
  const empresa: Empresa = getEmpresaByUser.data ? getEmpresaByUser.data[0] : null;

  const topNavbar = [
    {
      icon: IconHome,
      label: 'Home',
      to: isClient ? '/' : '/admin',
    },
  ];

  const bottomNavbar = [
    { icon: IconPhone, label: 'Contacto', to: '/contact' },
    {
      icon: IconSocial,
      label: 'Sobre nosotros',
      to: '/about',
    },
  ];

  const employeeHeader = [
    ...topNavbar,
    { icon: IconCalendar, label: 'Turnos', to: 'admin/reservations/' },
    ...bottomNavbar,
  ];

  const clientHeader = [
    ...topNavbar,
    { icon: IconCalendarCheck, label: 'Agendar turno', to: '/booking' },
    { icon: IconCalendar, label: 'Mis turnos', to: '/reservations' },
    ...bottomNavbar,
  ];

  const headerOptions = isClient ? clientHeader : employeeHeader;

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <AppShell
        header={{ height: 62, offset: true }}
        navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        footer={{ height: 45, offset: true }}
      >
        <AppShell.Header>
          <Header openNavbar={toggle} openedNavbar={opened} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Col>
            {headerOptions.map((item, index) => (
              <NavLink
                key={index}
                active={index === active}
                variant="filled"
                leftSection={<item.icon size="1rem" stroke={1.5} />}
                label={item.label}
                component={Link}
                to={item.to}
                onClick={() => {
                  close();
                  setActive(index);
                }}
              />
            ))}
          </Col>
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            <Route index element={isClient ? <ClientApp /> : <AdminApp />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/restricted" element={<NotAllowedPage />} />
            <Route path="*" element={<ClientApp />} />
          </Routes>
        </AppShell.Main>
        <AppShell.Footer>
          <Container fluid>
            <Row className="d-flex flex-wrap align-items-center">
              {isClient ? <Text className="w-auto">{empresa?.empresa_nombre}, powered by:</Text> : null}
              <Image className="px-0 pt-1" w={70} h={40} src={'https://i.imgur.com/gB7134o.png'} />
            </Row>
          </Container>
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

const ClientApp = () => <ClientPage />;

const AdminApp = () => <AdminPage />;

export default AppWrapper;
