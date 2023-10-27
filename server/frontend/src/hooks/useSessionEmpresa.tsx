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

  const empresa_id = getEmpresaByUser.data?.[0]?.empresa_id || null;

  return { getEmpresaByUser, empresa_id };
};

export default useSessionEmpresa;
