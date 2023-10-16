import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Producto } from '../types';

const createProducto = async (newProductoData: Producto) => {
  const response = await api.post('/productos/', newProductoData);
  return response.data;
};

const useMutateProductos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['producto'],
    mutationFn: createProducto,
    onSuccess: (data: Producto) => {
      queryClient.setQueryData<Producto[]>(['productos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });
};

export default useMutateProductos;
