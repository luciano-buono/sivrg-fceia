import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Turno, TurnoData } from '../types';

const createTurnoFn = async (newTurnoData: TurnoData) => {
  const response = await api.post('/turnos/', newTurnoData);
  return response.data;
};

const deleteTurnoFn = async (turnoId: string) => {
  const response = await api.delete(`/turnos/${turnoId}`);
  return response.data;
};

const acceptTurnoFn = async (turnoId: string) => {
  const response = await api.put(`/turnos/${turnoId}?state=accepted`);
  return response.data;
};

const useTurno = () => {
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

  const deleteTurno = useMutation({
    mutationKey: ['delete_turno'],
    mutationFn: deleteTurnoFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  const acceptTurno = useMutation(
    {
      mutationKey: ['accept_turno'],
      mutationFn: acceptTurnoFn,
      onSuccess: () => {
        return queryClient.invalidateQueries({ queryKey: ['turnos'] });
      },
    },
    // }
  );

  const isMutatingTurno =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['turno'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { createTurno, acceptTurno, isMutatingTurno, deleteTurno };
};

export default useTurno;
