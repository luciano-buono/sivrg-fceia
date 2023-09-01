import { Card, Container, Row } from 'react-bootstrap';
import ResourceCard from '../../components/ResourceCard';

const HomeAdmin = () => {
  const mockResources = [
    { icon: 'fa-solid fa-wheat-awn', initialQuantity: 70 },
    { icon: 'fa-solid fa-tree', initialQuantity: 20 },
    { icon: 'fa-solid fa-plant-wilt', initialQuantity: 40 },
  ];

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex flex-wrap justify-content-center mb-2">
        <Card.Body>
          <Row className="justify-content-between px-3">
            {mockResources.map((r) => (
              <ResourceCard {...r} />
            ))}
          </Row>
        </Card.Body>
      </Card>
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
    </Container>
  );
};

export default HomeAdmin;
