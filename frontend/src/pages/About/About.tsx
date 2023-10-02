import React from 'react';
import { Loader } from '@mantine/core';
import { FC } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useQuery } from 'react-query';

const About: FC = () => {
  const { isLoading, data } = useQuery('data', () =>
    fetch('https://pokeapi.co/api/v2/pokemon/').then((res) => res.json()),
  );
  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex justify-content-center h-100 w-100">
        <Card.Body>
          <h1> About us </h1>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          ) : (
            <>
              <ol>{data?.results?.map((pokemon: any, index: number) => <li key={index}>{pokemon.name}</li>)}</ol>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
