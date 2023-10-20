import { FC } from 'react';
import { Card, Container } from 'react-bootstrap';
import useSession from '../../hooks/useSession';
import { Skeleton } from '@mantine/core';

const Contact: FC = () => {
  const { isLoading } = useSession();

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Skeleton visible={isLoading}>
        <Card className="d-flex justify-content-center h-100 w-100">
          <Card.Body>
            <h1> Contacto </h1>
          </Card.Body>
        </Card>
      </Skeleton>
    </Container>
  );
};

export default Contact;
