import { Button, Skeleton, Text } from '@mantine/core';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';

const HomeClient = () => {
  const navigate = useNavigate();
  const { isLoading } = useSession();

  return (
    <Row className="col-md-12">
      <Col className="col-md-9 justify-content-center pt-3">
        <Card>
          <Card.Body>
            <Text className="fs-2">Noticias</Text>
            <Skeleton visible={isLoading}>
              <Card>
                <Card.Body>
                  <ul>
                    <li>Noticia1</li>
                    <li>Noticia2</li>
                    <li>Noticia3</li>
                  </ul>
                </Card.Body>
              </Card>
            </Skeleton>
          </Card.Body>
        </Card>
      </Col>
      <Col className="col-md-3 align-items-center pt-3">
        <Card style={{ width: '300px' }} className="d-flex justify-content-center mb-2">
          <Card.Body className="d-flex justify-content-center">
            <Button
              style={{ width: '250px', height: '70px' }}
              className="d-flex justify-content-center"
              onClick={() => navigate('/booking')}
            >
              <span className="text-white fw-bold fs-5">Agendar turno</span>
            </Button>
          </Card.Body>
        </Card>
        <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
          <Card.Body className="d-flex flex-wrap justify-content-center">
            <Button
              style={{ width: '250px', height: '70px' }}
              className="d-flex flex-wrap justify-content-center"
              onClick={() => navigate('/reservations')}
            >
              <span className="text-white fw-bold fs-5">Mis turnos</span>
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default HomeClient;
