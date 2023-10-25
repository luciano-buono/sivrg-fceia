import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Vehiculo, VehiculoData } from '../types';

const createVehiculoFn = async (newVehiculoData: VehiculoData) => {
  const response = await api.post('/vehiculos/', newVehiculoData);
  return response.data;
};

const useVehiculo = () => {
  const queryClient = useQueryClient();

  const queryVehiculo = useQuery<Vehiculo[]>({
    queryKey: ['vehiculos'],
    queryFn: () => api.get('/vehiculos/').then((res) => res.data),
  });

  const createVehiculo = useMutation({
    mutationKey: ['vehiculo'],
    mutationFn: createVehiculoFn,
    onSuccess: (data: Vehiculo) => {
      queryClient.setQueryData<Vehiculo[]>(['vehiculos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });

  return { queryVehiculo, createVehiculo };
};

export default useVehiculo;
