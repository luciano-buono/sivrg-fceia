import { useMutation, useQueryClient } from 'react-query';
import api from '../api';
import { Chofer, ChoferData } from '../types';

const createChofer = async (newChoferData: ChoferData) => {
  const response = await api.post('/choferes/', newChoferData);
  return response.data;
};

const useMutateChoferes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChofer,
    onSuccess: (data: Chofer) => {
      queryClient.setQueryData<Chofer[]>(['choferes'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });
};

export default useMutateChoferes;
