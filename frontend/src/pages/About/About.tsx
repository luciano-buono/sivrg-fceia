import { FC } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const About: FC = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
        <Card.Body className="d-flex flex-wrap justify-content-center">
          <Button
            style={{ width: '250px', height: '70px', borderRadius: '25px' }}
            className="d-flex flex-wrap justify-content-center align-content-center bg-primary"
          >
            <span className="text-white fw-bold fs-5">Sacar un turno</span>
          </Button>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <h1>Noticias</h1>
          <Card>
            <Card.Body>
              <ul>
                <li>a</li>
                <li>b</li>
              </ul>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
