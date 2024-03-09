import { Center, Progress, RingProgress, Tooltip, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FC, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

const ResourceCard: FC<{ initialQuantity: number; icon: string }> = ({ initialQuantity, icon }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return isMobile ? (
    <>
      <i className={icon} style={{ fontSize: '2em' }}></i>
      <Progress color="orange" className="mt-2" value={quantity} />
    </>
  ) : (
    <Card style={{ width: 'auto' }}>
      <Card.Body>
        <Tooltip label={quantity}>
          <RingProgress
            label={
              <Center>
                <i className={icon} style={{ fontSize: '3em' }}></i>
              </Center>
            }
            sections={[{ value: quantity, color: 'orange' }]}
          />
        </Tooltip>
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
