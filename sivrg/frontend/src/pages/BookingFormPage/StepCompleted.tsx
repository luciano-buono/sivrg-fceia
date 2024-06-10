import { Container, Card, Col } from 'react-bootstrap';
import { ActionIcon, Center, RingProgress, Text, rem } from '@mantine/core';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import { FC, PropsWithChildren } from 'react';

const StepCompleted: FC<PropsWithChildren<{ error: boolean }>> = ({ children, error }) => {
  return (
    <Container>
      <Card className="d-flex justify-content-center">
        <Card.Body className="d-flex justify-content-center">
          <Col>
            <Center>
              {children}
              <RingProgress
                sections={[{ value: 100, color: error ? 'red' : 'teal' }]}
                label={
                  <Center>
                    <ActionIcon color={error ? 'red' : 'teal'} variant="light" radius="xl" size="xl">
                      {error ? (
                        <IconExclamationCircle style={{ width: rem(22), height: rem(22) }} />
                      ) : (
                        <IconCheck style={{ width: rem(22), height: rem(22) }} />
                      )}
                    </ActionIcon>
                  </Center>
                }
              />
            </Center>
            {error ? (
              <Text className="h6 pb-3 text-center">Ha ocurrido un error generando el turno</Text>
            ) : (
              <Text className="h6 pb-3 text-center">Se ha agendado su turno!</Text>
            )}
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StepCompleted;
