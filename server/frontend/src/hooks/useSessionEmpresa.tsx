import { useQuery } from '@tanstack/react-query';
import useSession from './useSession';
import api from '../api';
import { Empresa } from '../types';

const useSessionEmpresa = () => {
  const { user } = useSession();
  const getEmpresaByUser = useQuery<Empresa[]>({
    queryKey: ['empresa', user?.email ? user?.email : 'a'],
    queryFn: () => api.get(`/empresas/?empresa_email=${user?.email}`).then((res) => res.data),
  });

  return { getEmpresaByUser };
};

export default useSessionEmpresa;
