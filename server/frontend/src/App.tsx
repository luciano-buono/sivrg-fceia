import { useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';
import { AppShell, MantineProvider, createTheme, em } from '@mantine/core';
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
import { useMediaQuery } from '@mantine/hooks';

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

  return (
    <>
      <AppShell header={{ height: isMobile ? 90 : 60, offset: true }}>
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ClientApp />} />
            <Route path="*" element={<ClientApp />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

const ClientApp = () => <ClientPage />;

const AdminApp = () => <AdminPage />;

export default AppWrapper;
