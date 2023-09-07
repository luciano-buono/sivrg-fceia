import { useAuth0 } from '@auth0/auth0-react';

const useRole = () => {
  const { user } = useAuth0();
  const roleKey = 'https://sivrg.methizul.com/roles';
  const role = user ? user[roleKey] : null;
  return role;
};

export default useRole;
