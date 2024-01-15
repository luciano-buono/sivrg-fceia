from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):
    api_v1_prefix: str
    debug: bool
    project_name: str = "Awesome API"
    version: str
    description: str
    cors_origins_list: list[str]

    # Auth0:
    domain: str
    api_audience: str
    scopes: list[str]
    auth0_rule_namespace: str

    #Postgres:
    POSTGRES_USERNAME: str
    POSTGRES_PASSWORD: str
    POSTGRES_DATABASE: str
    POSTGRES_HOST: str
    DATABASE_URL: str

    # Local
    is_local: bool

    model_config = SettingsConfigDict(env_file=".env")
