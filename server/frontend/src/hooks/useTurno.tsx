import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Turno, TurnoData } from '../types';

const createTurnoFn = async (newTurnoData: TurnoData) => {
  const response = await api.post('/turnos/', newTurnoData);
  return response.data;
};

const useTurno = () => {
  const queryClient = useQueryClient();

  const queryTurno = useQuery<Turno[]>({
    queryKey: ['turnos'],
    queryFn: () => api.get('/turnos/').then((res) => res.data),
  });

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

  const isMutatingTurno =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['turno'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { queryTurno, createTurno, isMutatingTurno };
};

export default useTurno;
