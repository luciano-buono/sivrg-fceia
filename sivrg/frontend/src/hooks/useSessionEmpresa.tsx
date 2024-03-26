import { useQuery } from '@tanstack/react-query';
import useSession from './useSession';
import api from '../api';
import { Empresa } from '../types';

const useSessionEmpresa = () => {
  const { user } = useSession();
  const getEmpresaByUser = useQuery<Empresa[]>({
    queryKey: ['empresas', user?.email],
    queryFn: async () => await api.get(`/empresas/?email=${user?.email}`).then((res) => res.data),
  });

  const empresa_id = getEmpresaByUser.data?.[0]?.id || null;

  return { getEmpresaByUser, empresa_id };
};

export default useSessionEmpresa;
