import { AppState, Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate: FC<Omit<Auth0ProviderOptions, 'domain' | 'clientId'>> = ({ children }) => {
  const navigate = useNavigate();

  const domain = 'methizul.us.auth0.com';
  const clientId = 'vum6xRm32RbmlDjMEaQb84dAxGD0AbgV';
  const redirectUri = window.location.origin;
  const audience = 'https://api.sivrg.methizul.com';

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
