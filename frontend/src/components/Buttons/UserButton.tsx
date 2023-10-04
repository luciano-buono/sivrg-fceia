import React from 'react';
import { FC } from 'react';
import { OverlayTrigger, Popover, Button, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { UserWithRoles } from '../../hooks/useSession';

const ClientActions = () => 
  <>
    <Button className="mb-2">
      <LinkContainer to="/booking">
        <Nav.Link>
          <i className="fa-solid fa-square-check pe-2" /> Agendar turno
        </Nav.Link>
      </LinkContainer>
    </Button>
    <Button className="mb-2">
      <LinkContainer to="/reservations">
        <Nav.Link>
          <i className="fa-solid fa-calendar-days pe-2" /> Mis turnos
        </Nav.Link>
      </LinkContainer>
    </Button>
  </>


const EmployeeActions = () => 
  <>
    {null}
  </>


const UserButton: FC<{ user: UserWithRoles; handleLogout: () => Promise<void> }> = ({ user, handleLogout }) => {
  return (
    <div className="d-flex flex-row flex-wrap align-content-center">
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        rootClose
        overlay={
          <Popover id="popover-basic">
            <Popover.Body className="d-flex flex-column ">
              {user.roles?.includes('client') ? <ClientActions /> : <EmployeeActions />}
              <Button variant="secondary" onClick={() => handleLogout()}>
                <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
              </Button>
            </Popover.Body>
          </Popover>
        }
      >
        <div className="d-flex flex-wrap align-content-center">
          <div style={{ cursor: 'pointer' }} className="no-select d-flex flex-wrap align-items-center">
            <div className="pe-2">Bienvenido {`${user.nickname ? user?.nickname.charAt(0).toUpperCase() + user.nickname.slice(1) : ''}!`}</div>
            <img style={{ borderRadius: '50%', height: '40px' }} src={user?.picture} alt={user?.name} />
          </div>
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default UserButton;
