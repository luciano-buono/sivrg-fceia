import { FC, useEffect } from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import './Header.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';
import LoggedUserMenu from '../Menus/LoggedUserMenu';
import { Loader, Button, Container, Text, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const Header: FC = () => {
  const { loginWithPopup, isAuthenticated, user, logout, isLoading } = useSession();

  const location = useLocation();
  const navigate = useNavigate();

  const isEmployee = user?.roles?.includes('employee');

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate(isEmployee ? '/admin' : '/');
    }
  }, [navigate, isEmployee, isAuthenticated, location]);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Container fluid className="no-select">
      <Row className="col-md-12" style={{ margin: '0px' }}>
        <Col className="col-md-4 col-xs-6 d-flex align-content-center">
          <Row style={{ columnGap: '40px' }}>
            <LinkContainer className="col-md-1 d-flex flex-wrap align-content-center" to={isEmployee ? '/admin' : '/'}>
              <Nav.Link>
                <Text className={`${isMobile ? 'h6' : 'h5'}`}>Home</Text>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer className="col-md-2 d-flex flex-wrap align-content-center" to="/contact">
              <Nav.Link>
                <Text className={`${isMobile ? 'h6' : 'h5'}`}>Contacto</Text>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer className="col-md-5 d-flex flex-wrap align-content-center" to="/about">
              <Nav.Link>
                <Text className={`${isMobile ? 'h6' : 'h5'}`}>Sobre nosotros</Text>
              </Nav.Link>
            </LinkContainer>
          </Row>
        </Col>
        <Col className="col-md-4" />
        <Col className="col-md-4">
          <div className="d-flex justify-content-end py-2">
            {isAuthenticated ? (
              <LoggedUserMenu user={user} handleLogout={logout} />
            ) : isLoading ? (
              <Card>
                <Card.Body className="py-1 px-4">
                  <Loader size="sm" color="gray" type="dots" />
                </Card.Body>
              </Card>
            ) : (
              <Button style={{ width: '160px' }} className="me-2" variant="outline" onClick={() => loginWithPopup({})}>
                Iniciar sesión
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
