import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Turno, TurnoData } from '../types';

const createTurnoFn = async (newTurnoData: TurnoData) => {
  const response = await api.post('/turnos/', newTurnoData);
  return response.data;
};

const useMutateTurno = () => {
  const queryClient = useQueryClient();

  const createTurno = useMutation({
    mutationKey: ['turno'],
    mutationFn: createTurnoFn,
    onSuccess: (data: Turno) => {
      queryClient.setQueryData<Turno[]>(['turnos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });

  return { createTurno };
};

export default useMutateTurno;
