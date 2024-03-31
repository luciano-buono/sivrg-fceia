from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv

load_dotenv()

AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")
AUTH0_CLIENT_AUDIENCE = os.getenv("AUTH0_CLIENT_AUDIENCE")


class Settings(BaseSettings):
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_CLIENT_AUDIENCE: str
    AUTH0_DOMAIN: str
    CLIENT_TYPE: str
    FAST_API_SERVER: str
    LOCAL: bool = False

    MODBUS_HOST_PLAYON: str
    MODBUS_PORT_PLAYON: int
    MODBUS_HOST_INGRESO_BALANZA: str
    MODBUS_PORT_INGRESO_BALANZA: int
    MODBUS_HOST_EGRESO_BALANZA: str
    MODBUS_PORT_EGRESO_BALANZA: int

    model_config = SettingsConfigDict(env_file=".env")
