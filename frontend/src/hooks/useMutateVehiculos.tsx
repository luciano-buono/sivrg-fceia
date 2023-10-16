import { useMutation, useQueryClient } from 'react-query';
import api from '../api';
import { Vehiculo } from '../types';

const createVehiculo = async (newChoferData: Vehiculo) => {
  const response = await api.post('/vehiculos/', newChoferData);
  return response.data;
};

const useMutateVehiculos = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
