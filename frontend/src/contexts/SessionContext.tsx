import React, { useReducer, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

interface SessionContextActions {
  init: () => void;
  finish: () => void;
}
type SessionContextState = {
  isLoggedIn: boolean;
};

const SessionContext = React.createContext<[SessionContextState, SessionContextActions] | undefined>(undefined);

const initialState: SessionContextState = {
  isLoggedIn: false,
};

export type ActionMapper<T> = {
  [Key in keyof T]: {
    type: Key;
    payload?: T[Key];
  };
}[keyof T];

type SessionContextActionsMap = {
  SESSION_INIT: SessionContextState;
  SESSION_FINISH: SessionContextState;
};

type SessionContextAction = ActionMapper<SessionContextActionsMap>;

const reducer = (state: SessionContextState, action: SessionContextAction) => {
  switch (action.type) {
    case 'SESSION_INIT': {
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    case 'SESSION_FINISH': {
      return {
        ...initialState,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  });
  ``;

  const actions: SessionContextActions = useMemo(
    () => ({
      init: () =>
        dispatch({
          type: 'SESSION_INIT',
        }),
      finish: () =>
        dispatch({
          type: 'SESSION_FINISH',
        }),
    }),
    [dispatch],
  );

  const value: [SessionContextState, SessionContextActions] = useMemo(() => [state, actions], [state, actions]);

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
