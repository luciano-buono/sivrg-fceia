import { Button, Skeleton } from '@mantine/core';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';

const HomeClient = () => {
  const navigate = useNavigate();
  const { isLoading } = useSession();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Row>
        <Col>
          <Skeleton visible={isLoading}>
            <Card>
              <Card.Body>
                <h1>Noticias</h1>
                <Card>
                  <Card.Body>
                    <ul>
                      <li>Noticia1</li>
                      <li>Noticia2</li>
                      <li>Noticia3</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Skeleton>
        </Col>
        <Col>
          <Skeleton visible={isLoading}>
            <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
              <Card.Body className="d-flex flex-wrap justify-content-center">
                <Button
                  style={{ width: '250px', height: '70px' }}
                  className="d-flex flex-wrap justify-content-center align-content-center"
                  onClick={() => navigate('/booking')}
                >
                  <span className="text-white fw-bold fs-5">Agendar turno</span>
                </Button>
              </Card.Body>
            </Card>
          </Skeleton>
          <Skeleton visible={isLoading}>
            <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
              <Card.Body className="d-flex flex-wrap justify-content-center">
                <Button
                  style={{ width: '250px', height: '70px' }}
                  className="d-flex flex-wrap justify-content-center align-content-center"
                  onClick={() => navigate('/reservations')}
                >
                  <span className="text-white fw-bold fs-5">Mis turnos</span>
                </Button>
              </Card.Body>
            </Card>
          </Skeleton>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeClient;
