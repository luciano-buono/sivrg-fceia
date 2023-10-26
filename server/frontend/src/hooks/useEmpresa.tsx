import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Empresa, EmpresaData } from '../types';

const createEmpresaFn = async (newEmpresaData: EmpresaData) => {
  const response = await api.post('/empresas/', newEmpresaData);
  return response.data;
};

const useEmpresa = () => {
  const queryClient = useQueryClient();

  const createEmpresa = useMutation({
    mutationKey: ['empresa'],
    mutationFn: createEmpresaFn,
    onSuccess: (data: Empresa) => {
      queryClient.setQueryData<Empresa[]>(['empresas'], (oldData) => {
        oldData = oldData || [];
        return [...oldData, data];
      });
    },
  });

  const isMutatingEmpresa =
    useMutationState({
      filters: { status: 'pending', mutationKey: ['empresa'] },
      select: (mutation) => mutation.state.variables,
    }).length > 0;

  return { createEmpresa, isMutatingEmpresa };
};

export default useEmpresa;
