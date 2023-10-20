import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router';
import { PrivateRoutes } from '../../App';
import HomeAdmin from '../HomeAdmin';

const AdminPage = () => (
  <>
    <Container className="d-flex flex-wrap">
      <Routes>
        <Route element={<PrivateRoutes redirect_to="/login" />}>
          <Route path="/" element={<HomeAdmin />} />
        </Route>
      </Routes>
    </Container>
  </>
);

export default AdminPage;
