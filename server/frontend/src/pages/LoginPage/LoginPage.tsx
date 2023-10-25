import { Button, Center, Loader } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';
import useSession from '../../hooks/useSession';

const LoginPage = () => {
  const { loginWithPopup, isLoading } = useSession();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2 h-50">
      <Center>
        <Card className="d-flex flex-wrap justify-content-center mb-2 w-auto">
          <Card.Body className="d-flex flex-wrap justify-content-center">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Loader type="dots" />
              </div>
            ) : (
              <Button
                variant="outline"
                className="d-flex flex-wrap justify-content-center align-content-center"
                onClick={() => loginWithPopup()}
              >
                <span className="fw-bold fs-6 p-4">Iniciar sesión</span>
              </Button>
            )}
          </Card.Body>
        </Card>
      </Center>
    </Container>
  );
};

export default LoginPage;
