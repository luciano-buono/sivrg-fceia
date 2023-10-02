import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ClientPage from './pages/ClientPage/ClientPage';
import AdminPage from './pages/AdminPage';
import { FC } from 'react';
import Navbar from './components/Navbar/Navbar';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/es';
import LoginPage from './pages/LoginPage';
import useSession from './hooks/useSession';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';



const queryClient = new QueryClient();

export const PrivateRoutes: FC<{ redirect_to: string }> = ({ redirect_to }) => {
  const { isAuthenticated } = useSession();
  return !isAuthenticated ? <Navigate to={redirect_to} /> : <Outlet />;
};

const theme = createTheme({
  fontFamily: 'sans-serif',
  primaryColor: 'blue',
});

function AppWrapper() {
  return (
    <BrowserRouter>
      <Auth0Provider
        domain="methizul.us.auth0.com"
        clientId="vum6xRm32RbmlDjMEaQb84dAxGD0AbgV"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 0, weekendDays: [0] }}>
              <Notifications />
              <App />
            </DatesProvider>
          </MantineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Auth0Provider>
    </BrowserRouter>
  );
}

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ClientApp />} />
        <Route path="*" element={<ClientApp />} />
      </Routes>
    </>
  );
};

const ClientApp = () => <ClientPage />;

const AdminApp = () => <AdminPage />;

export default AppWrapper;
