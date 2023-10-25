import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import NotFound from '../NotFound';
import { ProtectedRoutes } from '../../App';
import HomeClient from '../HomeClient/HomeClient';
import ReservationsPage from '../ReservationsPage';
import BookingStepper from '../BookingFormPage/BookingStepper';

const ClientPage = () => {
  return (
    <>
      <Container className="d-flex flex-wrap justify-content-center">
        <Routes>
          <Route element={<ProtectedRoutes allowedRoles={['client']} redirectPath="/restricted" />}>
            <Route path="/" element={<HomeClient />}>
              <Route index element={<HomeClient />} />
              <Route path="/booking" element={<BookingStepper />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Container>
    </>
  );
};

export default ClientPage;
