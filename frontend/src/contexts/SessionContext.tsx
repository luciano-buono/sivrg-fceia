import React, { useContext } from 'react';
import PropTypes from 'prop-types';

type SessionContextState = {
  role: string | null;
};

const SessionContext = React.createContext<SessionContextState | undefined>(undefined);

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = { role: '' };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('`useSession` must be used within a `SessionProvider`');
  }
  return context;
};

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export { SessionContext, SessionProvider, useSession };
