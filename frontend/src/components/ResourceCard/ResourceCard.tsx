import { Center, RingProgress } from '@mantine/core';
import { FC, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

const ResourceCard: FC<{ initialQuantity: number; icon: string }> = ({ initialQuantity, icon }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <Card style={{ width: 'auto' }}>
      <Card.Body>
        <RingProgress
          label={
            <Center>
              <i className={icon} style={{ fontSize: '3em' }}></i>
            </Center>
          }
          sections={[{ value: quantity, color: 'orange' }]}
        />
        <Row style={{ width: 'auto' }} className="justify-content-center">
          <Button style={{ width: '40px' }} className="me-2" onClick={() => setQuantity((prev) => prev + 1)}>
            +
          </Button>
          <Button style={{ width: '40px' }} onClick={() => setQuantity((prev) => prev - 1)}>
            -
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ResourceCard;
