import { FC } from 'react';
import { OverlayTrigger, Popover, Button, Nav, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { UserWithRoles } from '../../hooks/useSession';

const UserButton: FC<{ user: UserWithRoles; handleLogout: () => Promise<void> }> = ({ user, handleLogout }) => {
  return (
    <Card>
      <Card.Body className="p-3">
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
                  <Button variant="secondary" onClick={() => handleLogout()}>
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
      </Card.Body>
    </Card>
  );
};

export default UserButton;
