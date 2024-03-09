import json, urllib
import config
from pydantic import BaseModel, Field, ValidationError
from typing_extensions import TypedDict
from typing import Optional, Dict, List, Type

settings = config.Settings()
from fastapi_auth0 import Auth0User as Auth0UserBase
from fastapi_auth0 import Auth0 as Auth0Base
from fastapi_auth0.auth import OAuth2ImplicitBearer,OAuth2PasswordBearer,OAuth2AuthorizationCodeBearer,OpenIdConnect,JwksDict

class Auth0User(Auth0UserBase):
    roles: list[str] = Field(None, alias=f'{settings.auth0_rule_namespace}/roles')  # type: ignore [literal-required]

class Auth0(Auth0Base):
    def __init__(self, domain: str, api_audience: str, scopes: Dict[str, str]={},
            auto_error: bool=True, scope_auto_error: bool=True, email_auto_error: bool=False,
            auth0user_model: Type[Auth0User]=Auth0User):
        self.domain = domain
        self.audience = api_audience

        self.auto_error = auto_error
        self.scope_auto_error = scope_auto_error
        self.email_auto_error = email_auto_error

        self.auth0_user_model = auth0user_model

        self.algorithms = ['RS256']
        r = urllib.request.urlopen(f'https://{domain}/.well-known/jwks.json')
        self.jwks: JwksDict = json.loads(r.read())

        authorization_url_qs = urllib.parse.urlencode({'audience': api_audience})
        authorization_url = f'https://{domain}/authorize?{authorization_url_qs}'
        self.implicit_scheme = OAuth2ImplicitBearer(
            authorizationUrl=authorization_url,
            scopes=scopes,
            scheme_name='Auth0ImplicitBearer')
        self.password_scheme = OAuth2PasswordBearer(tokenUrl=f'https://{domain}/oauth/token', scopes=scopes)
        self.authcode_scheme = OAuth2AuthorizationCodeBearer(
            authorizationUrl=authorization_url,
            tokenUrl=f'https://{domain}/oauth/token',
            scopes=scopes)
        self.oidc_scheme = OpenIdConnect(openIdConnectUrl=f'https://{domain}/.well-known/openid-configuration')
