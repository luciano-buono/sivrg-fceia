import { Container, Card, Row, Col } from 'react-bootstrap';
import { ActionIcon, Center, RingProgress, Text, rem } from '@mantine/core';
import { useBookingFormContext } from '../../contexts/BookingFormContext';
import { IconCheck } from '@tabler/icons-react';

const StepCompleted = () => {
  const form = useBookingFormContext();

  return (
    <Container>
      <Card>
        <Card.Body>
          <Row className="col-md-12">
            <Col className="col-md-2">
              <RingProgress
                sections={[{ value: 100, color: 'teal' }]}
                label={
                  <Center>
                    <ActionIcon color="teal" variant="light" radius="xl" size="xl">
                      <IconCheck style={{ width: rem(22), height: rem(22) }} />
                    </ActionIcon>
                  </Center>
                }
              />
            </Col>
            <Col className="d-flex col-md-10 justify-content-center">
              <Row className="col-md-12">
                <Text className="fw-bold pt-3">Se ha agendado su turno para el:</Text>
                <div>{JSON.stringify(form.values.turno_fecha).slice(1, 11)}</div>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StepCompleted;
