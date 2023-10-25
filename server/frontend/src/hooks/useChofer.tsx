import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Chofer, ChoferData } from '../types';

const createChoferFn = async (newChoferData: ChoferData) => {
  const response = await api.post('/choferes/', newChoferData);
  return response.data;
};

const useChofer = () => {
  const queryClient = useQueryClient();

  const queryChofer = useQuery<Chofer[]>({
    queryKey: ['choferes'],
    queryFn: () => api.get('/choferes/').then((res) => res.data),
  });

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

  return { queryChofer, createChofer };
};

export default useChofer;
