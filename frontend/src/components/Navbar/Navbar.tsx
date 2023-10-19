import { FC, useEffect } from 'react';
import React from 'react';
import BaseNavbar from 'react-bootstrap/Navbar';
import { Card, Container, Nav, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Navbar.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';
import UserButton from '../Buttons/UserButton';
import { Loader } from '@mantine/core';

const Navbar: FC = () => {
  const { loginWithPopup, isAuthenticated, user, logout, isLoading } = useSession();

  const location = useLocation();
  const navigate = useNavigate();

  const isEmployee = user?.roles?.includes('employee');

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate(isEmployee ? '/admin' : '/');
    }
  }, [navigate, isEmployee, isAuthenticated, location]);

  return (
    <BaseNavbar style={{ height: 'auto' }} expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Nav>
          <LinkContainer to={isEmployee ? '/admin' : '/'}>
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>Sobre nosotros</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact">
            <Nav.Link>Contacto</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          <Row>
            <Card>
              <Card.Body className="p-3">
                {isAuthenticated ? (
                  <UserButton user={user} handleLogout={logout} />
                ) : isLoading ? (
                  <Loader color="gray" type="dots" />
                ) : (
                  <Button
                    style={{ width: '160px' }}
                    className="me-2"
                    variant="secondary"
                    onClick={() => loginWithPopup({})}
                  >
                    Iniciar sesión
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Row>
        </Nav>
      </Container>
    </BaseNavbar>
  );
};

export default Navbar;
