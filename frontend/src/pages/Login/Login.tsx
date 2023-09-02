import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '@mantine/core';
// import { useEffect } from 'react';
import { Button, Card, Container, Row } from 'react-bootstrap';
import { useSession } from '../../contexts/SessionContext';
// import { useQuery } from 'react-query';

const Login = () => {
  const { loginWithPopup, logout, user, isLoading, isAuthenticated } = useAuth0();

  const { role } = useSession();
  console.log(role);

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex justify-content-center h-100 w-100">
        <Card.Body>
          <Row className="d-flex justify-content-center">
            <Card style={{ height: 'auto', width: 'auto' }}>
              <Card.Body>
                {isLoading ? (
                  <Loader />
                ) : (
                  <div>
                    {!isAuthenticated ? (
                      <Button onClick={() => loginWithPopup()}>Iniciar Sesión</Button>
                    ) : (
                      <div>
                        <div>
                          <img src={user?.picture} alt={user?.name} />
                          <h2>{user?.name}</h2>
                          <p>{user?.email}</p>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                          Cerrar Sesión
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
