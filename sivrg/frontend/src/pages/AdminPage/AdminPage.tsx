import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import { ProtectedRoutes } from '../../App';
import HomeAdmin from '../HomeAdmin';
import ReservationsAdminPage from '../ReservationsPage';
import MonitorPage from '../MonitorPage';
import CurrentBookingPage from '../CurrentBookingPage';

const AdminPage = () => {
  return (
    <>
      <Container className="d-flex flex-wrap">
        <Routes>
          <Route element={<ProtectedRoutes allowedRoles={['employee']} redirectPath="/restricted" />}>
            <Route index element={<HomeAdmin />} />
            <Route path="/reservations" element={<ReservationsAdminPage filterByDay={false} />} />
            <Route path="/reservations/current" element={<ReservationsAdminPage filterByDay />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/current-booking" element={<CurrentBookingPage />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
};

export default AdminPage;
