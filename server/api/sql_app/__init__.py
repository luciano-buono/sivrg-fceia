from os import getenv
from dotenv import load_dotenv

from .config import Settings

load_dotenv(getenv("ENV_FILE"))
print("APIV11111", getenv('API_V1_PREFIX'))
settings = Settings()
