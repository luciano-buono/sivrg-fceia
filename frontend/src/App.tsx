import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SessionProvider, useSession } from './contexts/SessionContext';
import ClientPage from './pages/ClientPage/ClientPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

export const PrivateRoutes = () => {
  const [sessionState] = useSession();
  // @HINT: "Outlet" component should be used in parent route elements to render their child route elements
  return !sessionState.isLoggedIn ? <Navigate to="/login" /> : <Outlet />;
};

function AppWrapper() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <SessionProvider>
            <App />
          </SessionProvider>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
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
