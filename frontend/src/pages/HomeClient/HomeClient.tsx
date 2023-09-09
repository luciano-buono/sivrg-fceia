import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const HomeClient = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h1>Noticias</h1>
              <Card>
                <Card.Body>
                  <ul>
                    <li>Dame</li>
                    <li>Noticias</li>
                    <li>Lucho</li>
                  </ul>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
            <Card.Body className="d-flex flex-wrap justify-content-center">
              <Button
                style={{ width: '250px', height: '70px', borderRadius: '25px' }}
                className="d-flex flex-wrap justify-content-center align-content-center bg-primary"
                onClick={() => navigate('/booking')}
              >
                <span className="text-white fw-bold fs-5">Sacar un turno</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeClient;
