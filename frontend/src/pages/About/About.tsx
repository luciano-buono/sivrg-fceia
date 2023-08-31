import { Loader } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { FC } from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';

const About: FC = () => {
  const { isLoading, data } = useQuery('data', () =>
    fetch('https://pokeapi.co/api/v2/pokemon/').then((res) => res.json()),
  );
  return (
    <Container className="d-flex flex-wrap flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex justify-content-center h-100 w-100">
        <Card.Body>
          <h1> Home </h1>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />{' '}
            </div>
          ) : (
            <>
              <ol>{data?.results?.map((pokemon: any, index: number) => <li key={index}>{pokemon.name}</li>)}</ol>
              <Row className="d-flex justify-content-center">
                <Card style={{ height: '300px', width: '300px' }}>
                  <Card.Body>
                    <DatePicker />
                  </Card.Body>
                </Card>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
