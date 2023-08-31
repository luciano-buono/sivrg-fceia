import { BrowserRouter, Navigate } from 'react-router-dom';
import { Outlet, Route, Routes } from 'react-router';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import MyNavbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import { Container } from 'react-bootstrap';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SessionProvider, useSession } from './contexts/SessionContext';

const queryClient = new QueryClient();

const PrivateRoutes = () => {
  const [sessionState] = useSession();
  // @HINT: "Outlet" component should be used in parent route elements to render their child route elements
  return !sessionState.isLoggedIn ? <Navigate to="/login" /> : <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <SessionProvider>
            <MyNavbar />
            <Container className="d-flex flex-wrap">
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </Container>
          </SessionProvider>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
