import { User, useAuth0 } from '@auth0/auth0-react';

export type UserWithRoles = User & { roles?: string[] };

const useSession = () => {
  const data = useAuth0();

  const rolesKey = 'https://sivrg.methizul.com/roles';
  const userWithRoles = data.user ? { ...data.user, roles: data.user[rolesKey] } : null;

  return {
    ...data,
    user: userWithRoles as UserWithRoles,
  };
};

export default useSession;
