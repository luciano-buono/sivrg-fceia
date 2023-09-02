import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SessionProvider, useSession } from './contexts/SessionContext';
import ClientPage from './pages/ClientPage/ClientPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

export const PrivateRoutes = () => {
  const { role } = useSession();
  // @HINT: "Outlet" component should be used in parent route elements to render their child route elements
  return !role ? <Navigate to="/login" /> : <Outlet />;
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
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<ClientApp />} />
      <Route path="*" element={<ClientApp />} />
    </Routes>
  );
};

const ClientApp = () => <ClientPage />;

const AdminApp = () => <AdminPage />;

export default AppWrapper;
