import { Center, RingProgress } from '@mantine/core';
import { useState } from 'react';
import { Button, Card, Container, Row } from 'react-bootstrap';

const HomeAdmin = () => {
  const [wheat, setWeath] = useState(70);
  const [tree, setTree] = useState(40);
  const [wilt, setWilt] = useState(20);

  return (
    <Container className="d-flex flex-column justify-content-center align-content-center pt-2">
      <Card className="d-flex flex-wrap justify-content-center mb-2">
        <Card.Body>
          <Row className="justify-content-between px-3">
            <Card style={{ width: 'auto' }}>
              <Card.Body>
                <RingProgress
                  label={
                    <Center>
                      <i className="fa-solid fa-wheat-awn" style={{ fontSize: '3em' }}></i>
                    </Center>
                  }
                  sections={[{ value: wheat, color: 'orange' }]}
                />
              </Card.Body>
            </Card>
            <Card style={{ width: 'auto' }}>
              <Card.Body>
                <RingProgress
                  label={
                    <Center>
                      <i className="fa-solid fa-tree" style={{ fontSize: '3em' }}></i>
                    </Center>
                  }
                  sections={[{ value: tree, color: 'orange' }]}
                />
              </Card.Body>
            </Card>
            <Card style={{ width: 'auto' }}>
              <Card.Body>
                <RingProgress
                  label={
                    <Center>
                      <i className="fa-solid fa-plant-wilt" style={{ fontSize: '3em' }}></i>
                    </Center>
                  }
                  sections={[{ value: wilt, color: 'orange' }]}
                />
              </Card.Body>
            </Card>
          </Row>
        </Card.Body>
      </Card>
      <Card className='mb-2'>
        <Card.Body>
          <Row className="justify-content-between px-5">
            <div style={{ width: 'auto' }}>
              <Button style={{ width: '40px' }} className="me-2" onClick={() => setWeath((prev) => prev + 1)}>
                +
              </Button>
              <Button style={{ width: '40px' }} onClick={() => setWeath((prev) => prev - 1)}>
                -
              </Button>
            </div>
            <div style={{ width: 'auto' }}>
              <Button style={{ width: '40px' }} className="me-2" onClick={() => setTree((prev) => prev + 1)}>
                +
              </Button>
              <Button style={{ width: '40px' }} onClick={() => setTree((prev) => prev - 1)}>
                -
              </Button>
            </div>
            <div style={{ width: 'auto' }}>
              <Button style={{ width: '40px' }} className="me-2" onClick={() => setWilt((prev) => prev + 1)}>
                +
              </Button>
              <Button style={{ width: '40px' }} onClick={() => setWilt((prev) => prev - 1)}>
                -
              </Button>
            </div>
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
