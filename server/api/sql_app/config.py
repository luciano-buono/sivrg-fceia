from pydantic_settings import BaseSettings, SettingsConfigDict


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

    model_config = SettingsConfigDict(env_file=".env")
