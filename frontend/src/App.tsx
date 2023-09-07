import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SessionProvider } from './contexts/SessionContext';
import ClientPage from './pages/ClientPage/ClientPage';
import AdminPage from './pages/AdminPage';
import { FC } from 'react';
import Navbar from './components/Navbar/Navbar';

const queryClient = new QueryClient();

export const PrivateRoutes: FC<{ redirect_to: string }> = ({ redirect_to }) => {
  // const { role } = useSession();
  const { isAuthenticated } = useAuth0();
  return !isAuthenticated ? <Navigate to={redirect_to} /> : <Outlet />;
};

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
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <SessionProvider>
              <App />
            </SessionProvider>
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
        <Route path="/*" element={<ClientApp />} />
        <Route path="*" element={<ClientApp />} />
      </Routes>
    </>
  );
};

const ClientApp = () => <ClientPage />;

const AdminApp = () => <AdminPage />;

export default AppWrapper;
