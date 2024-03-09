import { User, useAuth0 } from '@auth0/auth0-react';

export type UserWithRoles = User & { roles?: string[]; isClient: boolean; isEmployee: boolean };

const useSession = () => {
  const data = useAuth0();

  const rolesKey = 'https://sivrg.methizul.com/roles';
  const userWithRoles = data.user ? { ...data.user, roles: data.user[rolesKey] } : null;

  const isEmployee = userWithRoles?.roles.includes('employee');

  const isClient = userWithRoles?.roles.includes('client');

  return {
    ...data,
    user: userWithRoles as UserWithRoles,
    isEmployee,
    isClient,
  };
};

export default useSession;
