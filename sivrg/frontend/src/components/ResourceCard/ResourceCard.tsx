import { Center, Progress, RingProgress, Tooltip, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FC, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Silo } from '../../types';

const ResourceCard: FC<{ silo: Silo }> = ({ silo }) => {
  const percentageUsed = (silo.utilizado * 100) / silo.capacidad;
  const percentReserved = (silo.reservado * 100) / silo.capacidad;
  console.log(percentReserved, percentageUsed);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [opened, setOpened] = useState(false);

  return isMobile ? (
    <>
      <div className="fw-bold pb-2">{silo.producto.nombre}</div>
      <Center>
        <i className="fa-solid fa-plant-wilt" style={{ fontSize: '2em' }}></i>
      </Center>
      <Tooltip
        label={`${silo.producto.nombre}: ${silo.utilizado + silo.reservado}kg de ${silo.capacidad}kg (${
          percentageUsed + percentReserved
        }%)`}
        opened={opened}
        position="bottom"
      >
        <Progress.Root className="mt-2" onClick={() => setOpened((o) => !o)}>
          <Progress.Section value={percentageUsed} color="orange" />
          <Progress.Section value={percentReserved} color="purple" />
        </Progress.Root>
      </Tooltip>
    </>
  ) : (
    <Card style={{ width: 'auto' }}>
      <Card.Body>
        <Card.Title className="fw-bold">{`${silo.producto.nombre} (${percentageUsed + percentReserved}%)`}</Card.Title>
        <Center>
          <RingProgress
            label={
              <Center>
                <i className="fa-solid fa-plant-wilt" style={{ fontSize: '3em' }}></i>
              </Center>
            }
            sections={[
              { value: percentageUsed, color: 'orange' },
              { value: percentReserved, color: 'purple' },
            ]}
          />
        </Center>
        <div>{`${silo.utilizado + silo.reservado}kg de ${silo.capacidad}kg`}</div>
      </Card.Body>
    </Card>
  );
};

export default ResourceCard;
