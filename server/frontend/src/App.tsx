import { useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';
import { AppShell, Burger, Container, Image, MantineProvider, Text, createTheme, em } from '@mantine/core';
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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Col, Row, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const queryClient = new QueryClient();

export const PrivateRoutes: FC<{ redirect_to: string }> = ({ redirect_to }) => {
  const { isAuthenticated, isLoading } = useSession();

  return !isAuthenticated && !isLoading ? <Navigate to={redirect_to} /> : <Outlet />;
};

const theme = createTheme({
  fontFamily: 'sans-serif',
  primaryColor: 'blue',
});

function AppWrapper() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain="methizul.us.auth0.com"
          clientId="vum6xRm32RbmlDjMEaQb84dAxGD0AbgV"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: 'https://api.sivrg.methizul.com',
          }}
        >
          <MantineProvider theme={theme}>
            <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 0, weekendDays: [0] }}>
              <Notifications />
              <App />
            </DatesProvider>
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Auth0Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const App = () => {
  const { getAccessTokenSilently, isAuthenticated } = useSession();
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

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: isMobile ? 90 : 60, offset: true }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        footer={{ height: 45, offset: true }}
      >
        <AppShell.Header>
          <Header openNavbar={toggle} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Col>
            <LinkContainer to="/contact">
              <Nav.Link>
                <Text className={`${isMobile ? 'h6' : 'h5'}`}>Contacto</Text>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>
                <Text className={`${isMobile ? 'h6' : 'h5'}`}>Sobre nosotros</Text>
              </Nav.Link>
            </LinkContainer>
          </Col>
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ClientApp />} />
            <Route path="*" element={<ClientApp />} />
          </Routes>
        </AppShell.Main>
        <AppShell.Footer>
          <Container fluid>
            <Row className="d-flex flex-wrap align-content-center ">
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
