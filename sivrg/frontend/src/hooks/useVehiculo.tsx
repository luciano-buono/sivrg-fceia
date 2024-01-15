import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Vehiculo, VehiculoData } from '../types';

const createVehiculoFn = async (newVehiculoData: VehiculoData) => {
  const response = await api.post('/vehiculos/', newVehiculoData);
  return response.data;
};

const useVehiculo = () => {
  const queryClient = useQueryClient();

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

  const isMutatingVehiculo =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['vehiculo'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { createVehiculo, isMutatingVehiculo };
};

export default useVehiculo;
