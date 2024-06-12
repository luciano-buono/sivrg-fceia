// import { useQuery } from '@tanstack/react-query';
// import { Turno } from '../../types';
// import api from '../../api';
import { Button, Divider } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { Row } from 'react-bootstrap';

const MonitorPage = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const { ref, toggle, fullscreen } = useFullscreen();

  // @TODO: FILTRAR CON status=in_progress_entrada       accepted, 10 turnos
  // sorted by checking_time

  // const queryTurno = useQuery<Turno[]>({
  //   queryKey: ['turnos'],
  //   queryFn: () =>
  //     api.get(`/turnos/?start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}`).then((res) => res.data),
  // });

  const mockedTurnos = [
    { vehiculo: { patente: 'AB523K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB223K2' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB525K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'A5523K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB523K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB223K2' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB525K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'A5523K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB523K1' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
    { vehiculo: { patente: 'AB223K2' }, chofer: { nombre: 'juan', apellido: 'perez' }, empresa: { nombre: 'empresa' } },
  ];

  // const { data: turnos } = queryTurno;
  return (
    <>
      <div className="d-flex vh-100 vw-100 flex-column" style={{ backgroundColor: '#228be6' }} ref={ref}>
        <div>
        <Button onClick={toggle} color={'blue'} hidden={fullscreen}>
          Pantalla completa
      </Button>
          <div className="fw-bold fs-1 d-flex text-black ps-2">TURNOS EN CURSO</div>
          <Divider my={6} />
          <ol className="d-flex flex-column" style={{ listStyle: 'none' }}>
            {mockedTurnos?.map((x) => (
              <Row className="h3 d-flex text-black">
                <li>{`${x.vehiculo.patente} - ${x.chofer.apellido} ${x.chofer.nombre} - ${x.empresa.nombre}`}</li>
              </Row>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default MonitorPage;
