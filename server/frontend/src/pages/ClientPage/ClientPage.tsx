import { Container } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router';
import NotFound from '../NotFound';
import { ProtectedRoutes } from '../../App';
import HomeClient from '../HomeClient/HomeClient';
import ReservationsPage from '../ReservationsPage';
import BookingStepper from '../BookingFormPage/BookingStepper';
import EmpresaPage from '../EmpresaPage';
import { useEffect } from 'react';
import useSessionEmpresa from '../../hooks/useSessionEmpresa';
import useSession from '../../hooks/useSession';

const ClientPage = () => {
  const navigate = useNavigate();
  const { isLoading } = useSession();
  const { getEmpresaByUser } = useSessionEmpresa();

  useEffect(() => {
    if (!getEmpresaByUser.isLoading && !getEmpresaByUser.data?.length) {
      navigate('/empresa');
    }
  }, [getEmpresaByUser.data, getEmpresaByUser.isLoading, getEmpresaByUser.error, navigate, isLoading]);

  return (
    <>
      <Container className="d-flex flex-wrap justify-content-center">
        <Routes>
          <Route element={<ProtectedRoutes allowedRoles={['client']} redirectPath="/restricted" />}>
            <Route index element={<HomeClient />} />
            <Route path="/booking" element={<BookingStepper />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/empresa" element={<EmpresaPage />} />
            <Route path="/error" element={<NotFound />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
};

export default ClientPage;
