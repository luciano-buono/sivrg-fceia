from fastapi import Depends, FastAPI, HTTPException, Query, Response, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer


from fastapi_auth0 import Auth0, Auth0User


import uvicorn
from utils import VerifyToken

from sqlalchemy.orm import Session
from datetime import datetime

import crud, models, schemas
from database import SessionLocal, engine


from functools import lru_cache
import config

settings = config.Settings()

models.Base.metadata.create_all(bind=engine)

@lru_cache()
def get_settings():
    return config.Settings()

# Scheme for the Authorization header
token_auth_scheme = HTTPBearer()

#Fastapi-Auth0
auth = Auth0(domain=settings.domain, api_audience=settings.api_audience,scopes={})

app = FastAPI(title=settings.project_name)

### Cors configuration
origins = settings.cors_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## ------------Empresa operations---------------------

@app.post("/empresas/", response_model=schemas.Empresa)
def create_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    db_empresa = crud.get_empresa_by_name(db, empresa_nombre=empresa.empresa_nombre)
    if db_empresa:
        raise HTTPException(status_code=400, detail="Name already registered")
    return crud.create_empresa(db=db, empresa=empresa)

@app.get("/empresas/", response_model=list[schemas.Empresa])
def read_empresas(empresa_nombre: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if empresa_nombre:
        return crud.get_empresa_by_name(db=db, empresa_nombre=empresa_nombre)
    return crud.get_empresas(db=db, skip=skip, limit=limit)

@app.get("/empresas/{empresa_id}", response_model=schemas.Empresa)
def read_empresa(empresa_id: int, db: Session = Depends(get_db)):
    db_empresa = crud.get_empresa(db, empresa_id=empresa_id)
    if db_empresa is None:
        raise HTTPException(status_code=404, detail="Empresa not found")
    return db_empresa

## ------------Producto operations---------------------
# Create a Producto
@app.post("/productos/", response_model=schemas.Producto)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return crud.create_producto(db, producto)

# Get all Productos
@app.get("/productos/", response_model=list[schemas.Producto])
def read_productos(producto_nombre: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if producto_nombre:
        producto = crud.get_producto_by_name(db=db, producto_nombre=producto_nombre)
        if producto is None:
            raise HTTPException(status_code=404, detail="Producto not found")
        return producto
    return crud.get_productos(db, skip=skip, limit=limit)

# Get Producto by ID
@app.get("/productos/{producto_id}", response_model=schemas.Producto)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = crud.get_producto(db, producto_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto not found")
    return producto

## ------------RFID operations---------------------
# Create an RFID
@app.post("/rfids/", response_model=schemas.Rfid)
def create_rfid(rfid: schemas.RfidCreate, db: Session = Depends(get_db)):
    return crud.create_rfid(db, rfid)

# Get all RFIDs
@app.get("/rfids/", response_model=list[schemas.Rfid])
def read_rfids(chofer_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if chofer_id:
        rfid = crud.get_rfid_by_chofer_id(db, chofer_id)
        if rfid is None:
            raise HTTPException(status_code=404, detail="RFID not found for chofer")
        return rfid
    rfids = crud.get_rfids(db, skip=skip, limit=limit)
    return rfids

# Get RFID by RFID UID
@app.get("/rfids/{rfid_uid}", response_model=schemas.Rfid)
def read_rfid(rfid_uid: str, db: Session = Depends(get_db)):
    rfid = crud.get_rfid(db, rfid_uid)
    if rfid is None:
        raise HTTPException(status_code=404, detail="RFID not found")
    return rfid

## ------------Chofer operations---------------------
# Create a Chofer
@app.post("/choferes/", response_model=schemas.Chofer)
def create_chofer(chofer: schemas.ChoferCreate, db: Session = Depends(get_db)):
    if crud.get_chofer_by_dni(db=db, dni=chofer.dni):
        raise HTTPException(status_code=404, detail="DNI already in use!")
    return crud.create_chofer(db, chofer)

# Get all Choferes
@app.get("/choferes/", response_model=list[schemas.Chofer])
def read_choferes(empresa_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if empresa_id:
        return crud.get_choferes_by_empresa(db, empresa_id, skip=skip, limit=limit)
    return crud.get_choferes(db, skip=skip, limit=limit)

# Get Chofer by ID
@app.get("/choferes/{chofer_id}", response_model=schemas.Chofer)
def read_chofer(chofer_id: int, db: Session = Depends(get_db)):
    chofer = crud.get_chofer(db, chofer_id)
    if chofer is None:
        raise HTTPException(status_code=404, detail="Chofer not found")
    return chofer

# Get Chofer by DNI
@app.get("/choferes/dni/{dni}", response_model=schemas.Chofer)
def read_chofer_by_dni(dni: int, db: Session = Depends(get_db)):
    chofer = crud.get_chofer_by_dni(db, dni)
    if chofer is None:
        raise HTTPException(status_code=404, detail="Chofer not found")
    return chofer

## ------------PesadaIn operations---------------------
# Create a PesadaIn
@app.post("/pesadasIn/", response_model=schemas.PesadaIn)
def create_pesada_in(pesada_in: schemas.PesadaInCreate, db: Session = Depends(get_db)):
    return crud.create_pesada_in(db, pesada_in)

# Get all PesadaIn records
@app.get("/pesadasIn/", response_model=list[schemas.PesadaIn])
def read_pesadas_in(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pesadas_in = crud.get_pesadas_in(db, skip=skip, limit=limit)
    return pesadas_in

# Get PesadaIn by ID
@app.get("/pesadasIn/{pesada_in_id}", response_model=schemas.PesadaIn)
def read_pesada_in(pesada_in_id: int, db: Session = Depends(get_db)):
    pesada_in = crud.get_pesada_in(db, pesada_in_id)
    if pesada_in is None:
        raise HTTPException(status_code=404, detail="PesadaIn not found")
    return pesada_in

# Get PesadaIn records by date range
@app.get("/pesadasIn/by-date-range/", response_model=list[schemas.PesadaIn])
def read_pesadas_in_by_date_range(
    start_date: datetime = Query(..., description="Start date of the date range"),
    end_date: datetime = Query(..., description="End date of the date range"),
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(100, description="Maximum number of records to retrieve"),
    db: Session = Depends(get_db)
):
    pesadas_in = crud.get_pesadas_in_by_date_range(db, start_date, end_date, skip, limit)
    return pesadas_in

## ------------PesadasOut operations---------------------


## ------------Silos operations---------------------
# Create a Silo
@app.post("/silos/", response_model=schemas.Silo)
def create_silo(silo: schemas.SiloCreate, db: Session = Depends(get_db)):
    return crud.create_silo(db, silo)

# Get all Silos
@app.get("/silos/", response_model=list[schemas.Silo])
def read_silos(producto_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if producto_id:
        return crud.get_silos_by_producto(db, producto_id, skip=skip, limit=limit)
    return crud.get_silos(db, skip=skip, limit=limit)

# Get Silo by ID
@app.get("/silos/{silo_id}", response_model=schemas.Silo)
def read_silo(silo_id: int, db: Session = Depends(get_db)):
    silo = crud.get_silo(db, silo_id)
    if silo is None:
        raise HTTPException(status_code=404, detail="Silo not found")
    return silo

## ------------Turnos operations---------------------
# Create a Turno
@app.post("/turnos/", response_model=schemas.Turno)
def create_turno(turno: schemas.TurnoCreate, db: Session = Depends(get_db)):
    print("-------Starting turno create--------")
    # empresa_id lo provee el front en el header
    # validar que empresa_id exista
    empresa = crud.get_empresa(db=db, empresa_id=turno.empresa_id)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa not found")

    # llega nombre, apellido, dni de chofer
    # validar si existe chofer
    # sino crearlo
    chofer = crud.get_chofer_by_dni(db=db, dni=turno.chofer.dni)
    if not chofer:
        chofer = crud.create_chofer(db=db, chofer=turno.chofer)
        print("Chofer created!")
    turno.chofer = chofer
    return crud.create_turno(db=db, turno=turno)

# Get all Turnos
@app.get("/turnos/", response_model=list[schemas.Turno])
def read_turnos(date: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if date:
        return crud.get_turnos_by_date(db, date, skip=skip, limit=limit)
    return crud.get_turnos(db, skip=skip, limit=limit)

# Get a Turno by ID
@app.get("/turnos/{turno_id}", response_model=schemas.Turno)
def read_turno(turno_id: int, db: Session = Depends(get_db)):
    turno = crud.get_turno(db, turno_id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno not found")
    return turno

# Get PesadaIn records by date range
@app.get("/turnos/by-date-range/", response_model=list[schemas.Turno])
def read_turnos_by_date_range(
    start_date: str = Query(..., description="Start date of the date range"),
    end_date: str = Query(..., description="End date of the date range"),
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(100, description="Maximum number of records to retrieve"),
    db: Session = Depends(get_db)
):
    return crud.get_turnos_by_date_range(db, start_date, end_date, skip, limit)

## ------------Vehiculos operations---------------------
# Create a Vehiculo
@app.post("/vehiculos/", response_model=schemas.Vehiculo)
def create_vehiculo(vehiculo: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    return crud.create_vehiculo(db, vehiculo)

# Get all Vehiculos and by patente
@app.get("/vehiculos/", response_model=list[schemas.Vehiculo])
def read_vehiculos(patente: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if patente:
        vehiculo = crud.get_vehiculo_by_patente(db, patente)
        if vehiculo is None:
            raise HTTPException(status_code=404, detail="Vehiculo not found")
        return vehiculo
    return crud.get_vehiculos(db, skip=skip, limit=limit)

# Get a Vehiculo by ID
@app.get("/vehiculos/{vehiculo_id}", response_model=schemas.Vehiculo)
def read_vehiculo(vehiculo_id: int, db: Session = Depends(get_db)):
    vehiculo = crud.get_vehiculo(db, vehiculo_id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    return vehiculo

# FastAPI auth AUTH0
@app.get("/api/private")
def private(response: Response, token: str = Depends(token_auth_scheme)):
    """A valid access token is required to access this route"""

    result = VerifyToken(token.credentials).verify()
    if result.get("status"):
        raise HTTPException(status_code=401, detail="result")

    return result

@app.get("/api/private2", dependencies=[Depends(auth.implicit_scheme)])
def get_secure(user: Auth0User = Security(auth.get_user)):
    return {"message": f"{user}"}


def main():
    uvicorn.run("main:app", port=5000, log_level="info", reload= True)

if __name__ == "__main__":
    main()
