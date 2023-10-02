import React from 'react';
import { Skeleton } from '@mantine/core';
import { FC } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import useSession from '../../hooks/useSession';

const About: FC = () => {
  const { isLoading: isLoadingRequest, data } = useQuery('data', () =>
    fetch('https://pokeapi.co/api/v2/pokemon/').then((res) => res.json()),
  );

  const { isLoading: isLoadingUser } = useSession();

  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Skeleton visible={isLoadingUser || isLoadingRequest}>
        <Card className="d-flex justify-content-center h-100 w-100">
          <Card.Body>
            <h1> About us </h1>
            <ol>{data?.results?.map((pokemon: any, index: number) => <li key={index}>{pokemon.name}</li>)}</ol>
          </Card.Body>
        </Card>
      </Skeleton>
    </Container>
  );
};

export default About;
