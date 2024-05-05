import { useQuery } from '@tanstack/react-query';
import { Turno } from '../../types';
import api from '../../api';
import useSession from '../../hooks/useSession';


const MonitorPage = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const {logout} = useSession()

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () =>
      api.get(`/turnos/?start_date=${yesterday.toISOString()}&end_date=${today.toISOString()}`).then((res) => res.data),
  });

  const { data: turnos } = queryTurno;
  return (
    <>
    <div className="d-flex bg-primary vh-100">
      <div className="fw-bold fs-1">TURNOS: </div>
      {turnos?.map(x=> <div>{x.vehiculo.patente}</div>)}
    </div>
      <button onClick={() => logout()}></button>
      </>
  );
};

export default MonitorPage;
