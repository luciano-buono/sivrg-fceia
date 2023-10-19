import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Turno, TurnoData } from '../types';

const createTurno = async (newTurnoData: TurnoData) => {
  const response = await api.post('/turnos/', newTurnoData);
  return response.data;
};

const useMutateTurno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['turno'],
    mutationFn: createTurno,
    onSuccess: (data: Turno) => {
      queryClient.setQueryData<Turno[]>(['turnos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });
};

export default useMutateTurno;
