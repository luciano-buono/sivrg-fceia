import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { ProductoData, Producto } from '../types';

const createProductoFn = async (newProductoData: ProductoData) => {
  const response = await api.post('/productos/', newProductoData);
  return response.data;
};

const useMutateProductos = () => {
  const queryClient = useQueryClient();

  const createProducto = useMutation({
    mutationKey: ['producto'],
    mutationFn: createProductoFn,
    onSuccess: (data: Producto) => {
      queryClient.setQueryData<Producto[]>(['productos'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });

  return { createProducto };
};

export default useMutateProductos;
