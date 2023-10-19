import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Vehiculo, VehiculoData } from '../types';

const createVehiculo = async (newVehiculoData: VehiculoData) => {
  const response = await api.post('/vehiculos/', newVehiculoData);
  return response.data;
};

const useMutateVehiculos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['vehiculo'],
    mutationFn: createVehiculo,
    onSuccess: (data: Vehiculo) => {
      queryClient.setQueryData<Vehiculo[]>(['vehiculos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });
};

export default useMutateVehiculos;
