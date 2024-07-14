import { useQuery } from '@tanstack/react-query';
import { Turno } from '../../types';
import api from '../../api';
import { Button } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { Table } from 'react-bootstrap';

const MonitorPage = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const { ref, toggle, fullscreen } = useFullscreen();

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () =>
      api
        .get(
          `/turnos/?start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}&state=in_progress_entrada&sort=checking_time`,
        )
        .then((res) => res.data),
    refetchInterval: 10000,
  });

  const turnos = queryTurno.data?.map(x => ({"patente": x.vehiculo.patente}))
  return (
    <>
      <div className="d-flex vw-100 flex-column">
        <div style={{ backgroundColor: '#228be6' }} ref={ref}>
          <div className="fw-bold fs-1 text-black ps-2 text-center">TURNOS</div>
          {fullscreen ? (
            <Table bordered striped className="text-center" style={{ fontSize: 45,backgroundColor: '#228be6 !important' }}>
                <tr>
                  <th className="fw-bold">Posición</th>
                  <th className="fw-bold">Patente</th>
                </tr>
                {turnos?.map((x, index) => (
                  <tr className={`${index === 0 ? 'bg-info' : ''}`} key={index}>
                    <td>{`${index + 1}`}</td>
                    <td>{`${x.patente}`}</td>
                  </tr>
                ))}
            </Table>
          ) : null}
        </div>
        <Button onClick={toggle} color={'blue'} hidden={fullscreen}>
          Pantalla completa
        </Button>
      </div>
    </>
  );
};

export default MonitorPage;
