import { useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import BookingModal from '../../components/Modals/BookingModal';

const Home = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Card style={{ width: '300px' }} className="d-flex flex-wrap justify-content-center mb-2">
        <Card.Body className="d-flex flex-wrap justify-content-center">
          <Button
            style={{ width: '250px', height: '70px', borderRadius: '25px' }}
            className="d-flex flex-wrap justify-content-center align-content-center bg-primary"
            onClick={handleShow}
          >
            <span className="text-white fw-bold fs-5">Sacar un turno</span>
          </Button>
          <BookingModal show={show} handleClose={handleClose} />
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

export default Home;
