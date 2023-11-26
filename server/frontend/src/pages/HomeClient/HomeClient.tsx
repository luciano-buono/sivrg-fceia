import { Button, Skeleton, Text } from '@mantine/core';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useSession from '../../hooks/useSession';
import { useNewsContext } from '../../contexts/NewsContext';

const HomeClient = () => {
  const navigate = useNavigate();
  const state = useNewsContext();
  const { isLoading } = useSession();

  return (
    <Row className="col-md-12">
      <Col className="col-md-4 align-items-center pt-3">
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
      <Col className="col-md-8 justify-content-center pt-3">
        <Card>
          <Card.Body>
            <Text className="fs-2">Noticias</Text>
            <Skeleton visible={isLoading}>
              <Card>
                <Card.Body>
                  <ul>{state?.news?.map((n: string, index: number) => <li key={index + n}>{n}</li>)}</ul>
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
