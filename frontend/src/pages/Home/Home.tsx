import { Card, Container, Row } from 'react-bootstrap';
import DatePicker from '../../components/DatePicker/DatePicker';

const Home = () => {
  return (
    <Container className='d-flex flex-wrap flex-column justify-content-center align-content-center pt-2'>
      <Card className='d-flex justify-content-center h-100 w-100'>
        <Card.Body>
          <h1> Home </h1>
          <Row className='d-flex justify-content-center'>
            <Card style={{ height: '300px', width: '300px' }}>
              <Card.Body>
                <DatePicker />
              </Card.Body>
            </Card>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Home