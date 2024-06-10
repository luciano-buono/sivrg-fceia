import { Center, Progress, RingProgress, Tooltip, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Silo } from '../../types';

const ResourceCard: FC<{ silo: Silo }> = ({ silo }) => {
  const percentageUsed = (silo.utilizado * 100) / silo.capacidad;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [opened, setOpened] = useState(false);

  return isMobile ? (
    <>
      <div className="fw-bold pb-2">{silo.producto.nombre}</div>
      <Center>
        <i className="fa-solid fa-plant-wilt" style={{ fontSize: '2em' }}></i>
      </Center>
      <Tooltip
        label={`${silo.producto.nombre}: ${silo.utilizado}kg de ${silo.capacidad}kg (${percentageUsed}%)`}
        opened={opened}
        position="bottom"
      >
        <Progress color="orange" className="mt-2" value={percentageUsed} onClick={() => setOpened((o) => !o)} />
      </Tooltip>
    </>
  ) : (
    <Card style={{ width: 'auto' }}>
      <Card.Body>
        <Card.Title className="fw-bold">{`${silo.producto.nombre} (${percentageUsed}%)`}</Card.Title>
        <Center>
          <RingProgress
            label={
              <Center>
                <i className="fa-solid fa-plant-wilt" style={{ fontSize: '3em' }}></i>
              </Center>
            }
            sections={[{ value: percentageUsed, color: 'orange' }]}
          />
        </Center>
        <div>{`${silo.utilizado}kg de ${silo.capacidad}kg`}</div>
      </Card.Body>
    </Card>
  );
};

export default ResourceCard;
