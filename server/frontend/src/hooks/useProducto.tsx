import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { ProductoData, Producto } from '../types';

const createProductoFn = async (newProductoData: ProductoData) => {
  const response = await api.post('/productos/', newProductoData);
  return response.data;
};

const useProducto = () => {
  const queryClient = useQueryClient();

  const queryProducto = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos/').then((res) => res.data),
  });

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

  const isMutatingProducto =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['producto'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { queryProducto, createProducto, isMutatingProducto };
};

export default useProducto;
