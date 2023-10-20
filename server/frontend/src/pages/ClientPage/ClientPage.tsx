import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import About from '../About';
import Contact from '../Contact';
import NotFound from '../NotFound';
import { PrivateRoutes } from '../../App';
import HomeClient from '../HomeClient/HomeClient';
import ReservationsPage from '../ReservationsPage';
import BookingStepper from '../BookingFormPage/BookingStepper';

const ClientPage = () => (
  <>
    <Container className="d-flex flex-wrap">
      <Routes>
        <Route element={<PrivateRoutes redirect_to="/login" />}>
          <Route path="/" element={<HomeClient />} />
          <Route path="/booking" element={<BookingStepper />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route element={<NotFound />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Container>
  </>
);

export default ClientPage;
