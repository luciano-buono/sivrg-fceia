import { Container, Card, Row, Col } from 'react-bootstrap';
import { ActionIcon, Center, RingProgress, Text, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

const StepCompleted = () => {
  return (
    <Container>
      <Card className="d-flex justify-content-center">
        <Card.Body className="d-flex justify-content-center">
          <Col>
            <Center>
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
            </Center>
            <Text className="h6 pb-3 text-center">Se ha agendado su turno!</Text>
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StepCompleted;
