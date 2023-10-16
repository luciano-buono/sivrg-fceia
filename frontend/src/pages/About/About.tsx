import React from 'react';
import { Skeleton } from '@mantine/core';
import { FC } from 'react';
import { Container, Card } from 'react-bootstrap';
import useSession from '../../hooks/useSession';

const About: FC = () => {
  const { isLoading: isLoadingUser } = useSession();

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Skeleton visible={isLoadingUser}>
        <Card className="d-flex justify-content-center h-100 w-100">
          <Card.Body>
            <h1> About us </h1>
          </Card.Body>
        </Card>
      </Skeleton>
    </Container>
  );
};

export default About;
