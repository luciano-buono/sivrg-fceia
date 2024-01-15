import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Chofer, ChoferData } from '../types';

const createChoferFn = async (newChoferData: ChoferData) => {
  const response = await api.post('/choferes/', newChoferData);
  return response.data;
};

const useChofer = () => {
  const queryClient = useQueryClient();
  const createChofer = useMutation({
    mutationKey: ['chofer'],
    mutationFn: createChoferFn,
    onSuccess: (data: Chofer) => {
      queryClient.setQueryData<Chofer[]>(['choferes'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });

  const isMutatingChofer =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['chofer'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { createChofer, isMutatingChofer };
};

export default useChofer;
