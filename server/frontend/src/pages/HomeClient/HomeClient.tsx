import { Button, Skeleton, Text } from '@mantine/core';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';

const HomeClient = () => {
  const navigate = useNavigate();
  const { isLoading } = useSession();

  return (
    <Row className="col-md-12">
      <Col className="col-md-3 align-items-center pt-3">
        <Row className="col-md-12">
          <Card className="justify-content-center mb-2 p-0">
            <Card.Body className="justify-content-center">
              <Button onClick={() => navigate('/booking')} className="w-100 py-">
                <span className="text-white fw-bold fs-5">Agendar turno</span>
              </Button>
            </Card.Body>
          </Card>
          <Row className="col-md-12"></Row>
          <Card className="mb-2 p-0">
            <Card.Body className="justify-content-center">
              <Button className="w-100" onClick={() => navigate('/reservations')}>
                <span className="text-white fw-bold fs-5">Mis turnos</span>
              </Button>
            </Card.Body>
          </Card>
        </Row>
      </Col>
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
                    <li>Noticia1</li>
                    <li>Noticia2</li>
                    <li>Noticia3</li>
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
    </Row>
  );
};

export default HomeClient;
