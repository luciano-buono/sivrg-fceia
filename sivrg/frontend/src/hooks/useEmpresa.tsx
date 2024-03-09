import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Empresa, EmpresaData } from '../types';
import useSession from './useSession';

const createEmpresaFn = async (newEmpresaData: EmpresaData) => {
  const response = await api.post('/empresas/', newEmpresaData);
  return response.data;
};

const useEmpresa = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();

  const createEmpresa = useMutation({
    mutationKey: ['empresa'],
    mutationFn: createEmpresaFn,
    onSuccess: (data: Empresa) => {
      queryClient.setQueryData<Empresa[]>(['empresas', user?.email], () => {
        return [data];
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
