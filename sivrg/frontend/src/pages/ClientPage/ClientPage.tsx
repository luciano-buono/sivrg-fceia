import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import NotFound from '../NotFound';
import { ProtectedRoutes } from '../../App';
import HomeClient from '../HomeClient/HomeClient';
import BookingStepper from '../BookingFormPage/BookingStepper';
import EmpresaPage from '../EmpresaPage';
import useSession from '../../hooks/useSession';
import { Skeleton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Empresa } from '../../types';
import ReservationsAdminPage from '../ReservationsPage';

const ClientPage = () => {
  const { user, isLoading } = useSession();

  const { data: empresa, isLoading: isLoadingEmpresa } = useQuery<Empresa[]>({
    queryKey: ['empresas', user?.email],
    queryFn: async () => await api.get(`/empresas/?email=${user?.email}`).then((res) => res.data),
  });

  if (isLoadingEmpresa) {
    return <></>;
  }
  return (
    <>
      <Skeleton visible={isLoadingEmpresa || isLoading}>
        <Container className="d-flex flex-wrap justify-content-center">
          <Routes>
            <Route element={<ProtectedRoutes allowedRoles={['client']} redirectPath="/restricted" />}>
              <Route index element={<HomeClient />} />
              <Route
                element={
                  <ProtectedRoutes isAllowed={empresa !== undefined && empresa.length > 0} redirectPath="/empresa" />
                }
              >
                <Route path="/booking" element={<BookingStepper />} />
                <Route path="/reservations" element={<ReservationsAdminPage filterByDay={false} />} />
                <Route path="/reservations/current" element={<ReservationsAdminPage filterByDay />} />
                <Route path="/error" element={<NotFound />} />
              </Route>
              <Route element={<ProtectedRoutes isAllowed={!empresa?.length} redirectPath="/" />}>
                <Route path="/empresa" element={<EmpresaPage />} />
              </Route>
            </Route>
          </Routes>
        </Container>
      </Skeleton>
    </>
  );
};

export default ClientPage;
