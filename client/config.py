from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv

load_dotenv()

AUTH_CLIENT_ID = os.getenv("AUTH_CLIENT_ID")
AUTH_CLIENT_SECRET = os.getenv("AUTH_CLIENT_SECRET")
AUTH_CLIENT_AUDIENCE = os.getenv("AUTH_CLIENT_AUDIENCE")


class Settings(BaseSettings):
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_CLIENT_AUDIENCE: str
    AUTH0_DOMAIN: str
    CLIENT_TYPE: str

    model_config = SettingsConfigDict(env_file=".env")
