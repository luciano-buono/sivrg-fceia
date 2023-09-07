import { FC, useEffect, useMemo, useState } from 'react';

import BaseNavbar from 'react-bootstrap/Navbar';
import { Card, Container, Nav, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Navbar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router';

const UserButton: FC = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="d-flex flex-row flex-wrap align-content-center">
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        rootClose
        overlay={
          <Popover id="popover-basic">
            <Popover.Body className="d-flex flex-column ">
              <Button className="mb-2">
                <LinkContainer to="/">
                  <Nav.Link>
                    <i className="fa-solid fa-calendar-days pe-2" /> Mis turnos
                  </Nav.Link>
                </LinkContainer>
              </Button>
              <Button variant="secondary" onClick={() => logout()}>
                <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
              </Button>
            </Popover.Body>
          </Popover>
        }
      >
        <div className="d-flex flex-wrap align-content-center">
          <div style={{ cursor: 'pointer' }} className="no-select d-flex flex-wrap align-items-center">
            <div className="pe-2">Bienvenido {`${user?.name} Cliente`}!</div>
            <img style={{ borderRadius: '50%', height: '40px' }} src={user?.picture} alt={user?.name} />
          </div>
        </div>
      </OverlayTrigger>
    </div>
  );
};

const Navbar: FC = () => {
  const { loginWithPopup, isAuthenticated, user } = useAuth0();
  const [shouldRedirect, setShouldRedirect] = useState(true);

  const navigate = useNavigate();

  const roles = user ? user['https://sivrg.methizul.com/roles'] : [];
  const isEmployee = roles.includes('employee');

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
            <Nav.Link>Home {roles} </Nav.Link>
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
            <Card>
              <Card.Body className="p-2">
                <UserButton />
              </Card.Body>
            </Card>
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
