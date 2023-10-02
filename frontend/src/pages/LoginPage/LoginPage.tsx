import React from 'react';
import { Loader } from '@mantine/core';
import { Button, Card, Container } from 'react-bootstrap';
import useSession from '../../hooks/useSession';

const LoginPage = () => {
  const { loginWithPopup, isLoading } = useSession();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2 h-50">
      <Card className="d-flex flex-wrap justify-content-center mb-2 w-auto">
        <Card.Body className="d-flex flex-wrap justify-content-center">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          ) : (
            <Button
              style={{ width: '250px', height: '70px', borderRadius: '25px' }}
              className="d-flex flex-wrap justify-content-center align-content-center bg-primary"
              onClick={() => loginWithPopup()}
            >
              <span className="text-white fw-bold fs-5">Inicia sesión</span>
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
