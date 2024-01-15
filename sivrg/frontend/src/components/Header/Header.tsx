import { FC } from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import './Header.css';
import { LinkContainer } from 'react-router-bootstrap';
import useSession from '../../hooks/useSession';
import LoggedUserMenu from '../Menus/LoggedUserMenu';
import { Loader, Button, Container, ActionIcon, Center, Burger, em } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const Header: FC<{ openNavbar: any; openedNavbar: boolean }> = ({ openNavbar, openedNavbar }) => {
  const { loginWithRedirect, isAuthenticated, isLoading, isEmployee } = useSession();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Container fluid className="no-select">
      <Row className="col-md-12" style={{ margin: '0px' }}>
        <Col className="col-md-4 col-xs-6 d-flex align-content-center">
          <Center>
            <Burger opened={openedNavbar} size={'md'} onClick={openNavbar} hiddenFrom="sm" />
          </Center>
        </Col>
        <Col className="col-md-4 d-flex align-content-center justify-content-center">
          <Center>
            {isMobile && (
              <LinkContainer className="pe-2" to={isEmployee ? '/admin' : '/'}>
                <Nav.Link>
                  <ActionIcon variant="outline" aria-label="Home" size={'xl'}>
                    <IconHome style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Nav.Link>
              </LinkContainer>
            )}
          </Center>
        </Col>
        <Col className="col-md-4">
          <div className="d-flex justify-content-end py-2">
            <Center>
              {isAuthenticated ? (
                <LoggedUserMenu />
              ) : isLoading ? (
                <Card>
                  <Card.Body className="py-1 px-4">
                    <Loader size="sm" color="gray" type="dots" />
                  </Card.Body>
                </Card>
              ) : (
                <Button
                  style={{ width: '160px' }}
                  className="me-2"
                  variant="outline"
                  onClick={() => loginWithRedirect({ appState: { returnTo: '/' } })}
                >
                  Iniciar sesión
                </Button>
              )}
            </Center>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
