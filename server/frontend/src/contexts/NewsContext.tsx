import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

type NewsContextState = {
  news: string[];
};

const initialState: NewsContextState = {
  news: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ],
};

const NewsContext = createContext<NewsContextState | null>(null);

const NewsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useState(initialState);

  return <NewsContext.Provider value={state}>{children}</NewsContext.Provider>;
};

const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNewsContext must be used within an NewsProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { NewsProvider, useNewsContext };
