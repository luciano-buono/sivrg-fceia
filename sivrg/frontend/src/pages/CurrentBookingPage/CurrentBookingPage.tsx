import { useQuery } from '@tanstack/react-query';
import { Silo, Turno } from '../../types';
import api from '../../api';
import { Button } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { Table } from 'react-bootstrap';

const CurrentBookingPage = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const { ref, toggle, fullscreen } = useFullscreen();

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () =>
      api
        .get(
          `/turnos/?start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}&state=in_progress_balanza_in&sort=checking_time`,
        )
        .then((res) => res.data),
    refetchInterval: 10000,
  });

  const querySilo = useQuery<Silo[]>({
    queryKey: ['silos'],
    queryFn: () => api.get(`/silos/`).then((res) => res.data),

    refetchInterval: 10000,
  });

  const turnos: { patente: string; productId: string }[] =
    queryTurno.data?.map((x) => ({
      patente: x.vehiculo.patente,
      productId: x.producto_id,
    })) ?? [];

  // TODO: could be moved to select function on the useQuery hook
  const silos: { [key: string]: number } | undefined = querySilo.data?.reduce(
    (acc, current) => ({
      ...acc,
      [current.producto_id]: current.id,
    }),
    {},
  );

  return (
    <>
      <div className="d-flex vw-100 flex-column">
        <div className="min-vh-100" style={{ backgroundColor: '#228be6' }} ref={ref}>
          <div className="fw-bold fs-1 text-black ps-2 text-center">TURNOS</div>
          <Table
            bordered
            striped
            className="text-center"
            style={{ fontSize: 45, backgroundColor: '#228be6 !important' }}
          >
            <tr>
              <th className="fw-bold">Patente</th>
              <th className="fw-bold">Dirigirse a:</th>
            </tr>
            {turnos?.map((x, index) => (
              <tr className={`${index === 0 ? 'bg-info' : ''}`} key={index}>
                <td>{`${x.patente}`}</td>
                <td>{`Silo ${silos?.[x.productId]}`}</td>
              </tr>
            ))}
          </Table>
        </div>
        <Button onClick={toggle} color={'blue'} hidden={fullscreen}>
          Pantalla completa
        </Button>
      </div>
    </>
  );
};

export default CurrentBookingPage;
