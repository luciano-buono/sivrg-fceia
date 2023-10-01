from fastapi import FastAPI
import uvicorn
# from pydantic import BaseModel


uvicorn.run("sql_app.main:app", port=5001, log_level="info", reload= True, host="0.0.0.0")


# class LicensePlate(BaseModel):
#     tag_id: str
#     license_plate: str

# app = FastAPI()


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# # Return OK or NOTOK to Validator client
# @app.post("/validate")
# async def validate(license_plate: LicensePlate):
#     ## llamar a la base de datos con un where tag=tag
#     # si patente coincide y su turno coincide
#     # devolver 200 OK a raspberry
#     return {
#         "message": {
#             "tag_id": license_plate.tag_id,
#             "license_plate": license_plate.license_plate,
#         }
#     }

# # Get info from NODERED VALIDATOR and store in DB
# @app.get("/storeweight")
# async def root():
#     return {"message": "Hello World"}

# # Frontend

# if __name__ == "__main__":
#     uvicorn.run("main:app", port=5000, log_level="info", reload= True)

