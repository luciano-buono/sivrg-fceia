from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_CLIENT_AUDIENCE: str
    AUTH0_DOMAIN: str
    CLIENT_TYPE: str
    FAST_API_SERVER: str
    LOCAL: bool = False
    DISABLE_PLC: bool = False
    DISABLE_LPR: bool = False
    DISABLE_RFID: bool = False
    EXAMPLE_RFID_UID: int
    EXAMPLE_PATENTE: str
    EXAMPLE_PESO_IN: int
    EXAMPLE_PESO_OUT: int

    MODBUS_HOST_PLAYON: str
    MODBUS_PORT_PLAYON: int
    MODBUS_HOST_INGRESO_BALANZA: str
    MODBUS_PORT_INGRESO_BALANZA: int
    MODBUS_HOST_EGRESO_BALANZA: str
    MODBUS_PORT_EGRESO_BALANZA: int

    ACCESS_TOKEN: str

    model_config = SettingsConfigDict(env_file=".env")
