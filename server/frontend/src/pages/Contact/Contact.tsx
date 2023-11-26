import { FC } from 'react';
import { Card, Container } from 'react-bootstrap';
import useSession from '../../hooks/useSession';
import { Skeleton, Text } from '@mantine/core';

const Contact: FC = () => {
  const { isLoading } = useSession();

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Skeleton visible={isLoading}>
        <Card className="d-flex justify-content-center h-100 w-100">
          <Card.Body>
            <Text className="fs-2">Contacto</Text>
          </Card.Body>
        </Card>
      </Skeleton>
    </Container>
  );
};

export default Contact;
