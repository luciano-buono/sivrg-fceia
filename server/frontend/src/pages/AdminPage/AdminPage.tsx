import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import { ProtectedRoutes } from '../../App';
import HomeAdmin from '../HomeAdmin';
import useSession from '../../hooks/useSession';

const AdminPage = () => {
  const { isAuthenticated } = useSession();
  return (
    <>
      <Container className="d-flex flex-wrap">
        <Routes>
          <Route element={<ProtectedRoutes isAllowed={isAuthenticated} redirectPath="/login" />}>
            <Route path="/" element={<HomeAdmin />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
};

export default AdminPage;
