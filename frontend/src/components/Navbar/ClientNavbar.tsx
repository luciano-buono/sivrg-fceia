import { FC } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import { Card, Container, Nav, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './ClientNavbar.css';
import { LinkContainer } from 'react-router-bootstrap';

const UserButton: FC = () => {
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
              <Button variant="secondary" onClick={() => {}}>
                <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
              </Button>
            </Popover.Body>
          </Popover>
        }
      >
        <div className="d-flex flex-wrap align-content-center">
          <span style={{ cursor: 'pointer' }} className="no-select d-flex flex-wrap align-content-center pe-2">
            Bienvenido {'Methizul Cliente'}!
          </span>
          <Button style={{ borderRadius: '50%', height: '40px' }} variant="primary">
            <i className="fa-solid fa-circle-user"></i>
          </Button>
        </div>
      </OverlayTrigger>
    </div>
  );
};

const ClientNavbar: FC = () => {
  return (
    <Navbar style={{ height: '80px' }} expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Nav>
          <LinkContainer to="/">
            <Nav.Link>Home Cliente </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link>Sobre nosotros</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact">
            <Nav.Link>Contacto</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav>
          {true ? (
            <Card>
              <Card.Body className="p-2">
                <UserButton />
              </Card.Body>
            </Card>
          ) : (
            <Row>
              <Button style={{ width: '160px' }} className="me-2" variant="secondary" onClick={() => {}}>
                Iniciar sesión
              </Button>
              <Button style={{ width: '180px' }} variant="secondary" onClick={() => {}}>
                Iniciar sesión Admin
              </Button>
            </Row>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default ClientNavbar;
