import { Button, Loader } from '@mantine/core';
import { Card, Container } from 'react-bootstrap';
import useSession from '../../hooks/useSession';

const MyBookingsPage = () => {
  const { loginWithPopup, isLoading } = useSession();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2 h-50">
      <Card className="d-flex flex-wrap justify-content-center mb-2 w-auto">
        <Card.Body className="d-flex flex-wrap justify-content-center">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader type="dots" />
            </div>
          ) : (
            <Button
              className="d-flex flex-wrap justify-content-center align-content-center"
              onClick={() => loginWithPopup()}
            >
              <span className="text-white fw-bold fs-5 p-4">Iniciar sesión</span>
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyBookingsPage;