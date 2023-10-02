import { FC, useEffect, useState } from 'react';

import BaseNavbar from 'react-bootstrap/Navbar';
import { Container, Nav, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Navbar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';
import UserButton from '../Buttons/UserButton';

const Navbar: FC = () => {
  const { loginWithPopup, isAuthenticated, user, logout } = useSession();
  const [shouldRedirect, setShouldRedirect] = useState(true);

  const navigate = useNavigate();

  const isEmployee = user?.roles?.includes('employee');

  useEffect(() => {
    if (isAuthenticated && shouldRedirect) {
      navigate(isEmployee ? '/admin' : '/');
      setShouldRedirect(false);
    }
  }, [navigate, isEmployee, isAuthenticated, shouldRedirect]);

  return (
    <BaseNavbar style={{ height: 'auto' }} expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Nav>
          <LinkContainer to={isEmployee ? '/admin' : '/'}>
            <Nav.Link>Home {user?.roles} </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>Sobre nosotros</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact">
            <Nav.Link>Contacto</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          {isAuthenticated ? (
            <UserButton user={user} handleLogout={logout} />
          ) : (
            <Row>
              <Button
                style={{ width: '160px' }}
                className="me-2"
                variant="secondary"
                onClick={() => loginWithPopup({})}
              >
                Iniciar sesión
              </Button>
            </Row>
          )}
        </Nav>
      </Container>
    </BaseNavbar>
  );
};

export default Navbar;
