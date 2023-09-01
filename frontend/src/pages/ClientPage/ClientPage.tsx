import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import About from '../About';
import Contact from '../Contact';
import Login from '../Login';
import NotFound from '../NotFound';
import { PrivateRoutes } from '../../App';
import ClientNavbar from '../../components/Navbar/ClientNavbar';
import HomeClient from '../HomeClient/HomeClient';

const ClientPage = () => (
  <>
    <ClientNavbar />
    <Container className="d-flex flex-wrap">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomeClient />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Container>
  </>
);

export default ClientPage;
