from typing import Literal
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Query,
    Response,
    status,
    Security,
    Header,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi_auth0 import Auth0, Auth0User


import uvicorn

from sqlalchemy.orm import Session
from datetime import datetime

import crud, models, schemas
from database import SessionLocal, engine


from functools import lru_cache
import config

settings = config.Settings()


@lru_cache()
def get_settings():
    return config.Settings()


# Fastapi-Auth0
auth = Auth0(domain=settings.domain, api_audience=settings.api_audience, scopes={})

app = FastAPI(title=settings.project_name, dependencies=[Depends(auth.implicit_scheme)])

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
def create_empresa(
    empresa: schemas.EmpresaCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if crud.get_empresa_by_name(db, nombre=empresa.nombre).count():
        raise HTTPException(status_code=400, detail="Name already registered")
    if crud.get_empresa_by_email(db, email=empresa.email).count():
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_empresa(db=db, empresa=empresa)


@app.get("/empresas/", response_model=list[schemas.Empresa])
def read_empresas(
    nombre: str | None = None,
    email: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if email:
        return crud.get_empresa_by_email(db=db, email=email)
    if nombre:
        return crud.get_empresa_by_name(db=db, nombre=nombre)
    if user.email:
        return crud.get_empresa_by_email(db=db, email=user.email)
    return crud.get_empresas(db=db, skip=skip, limit=limit)


@app.get("/empresas/{id}", response_model=schemas.Empresa)
def read_empresa(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    db_empresa = crud.get_empresa(db, id=id)
    if db_empresa is None:
        raise HTTPException(status_code=404, detail="Empresa not found")
    return db_empresa


@app.put("/empresas/{id}", response_model=schemas.Empresa)
def update_empresa(
    id: int,
    data: schemas.EmpresaCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_empresa(db=db, id=id, data=data)


## ------------Producto operations---------------------
# Create a Producto
@app.post("/productos/", response_model=schemas.Producto)
def create_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.create_producto(db, producto)


# Get all Productos
@app.get("/productos/", response_model=list[schemas.Producto])
def read_productos(
    nombre: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if nombre:
        producto = crud.get_producto_by_name(db=db, nombre=nombre)
        if producto is None:
            raise HTTPException(status_code=404, detail="Producto not found")
        return producto
    return crud.get_productos(db, skip=skip, limit=limit)


# Get Producto by ID
@app.get("/productos/{id}", response_model=schemas.Producto)
def read_producto(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    producto = crud.get_producto(db, id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto not found")
    return producto


## ------------Chofer operations---------------------
# Create a Chofer
@app.post("/choferes/", response_model=schemas.Chofer)
def create_chofer(
    chofer: schemas.ChoferCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_empresa(db=db, id=chofer.empresa_id):
        raise HTTPException(status_code=404, detail="Empresa ID not found!")
    if crud.get_chofer_by_dni(db=db, dni=chofer.dni):
        raise HTTPException(status_code=404, detail="DNI already in use!")
    return crud.create_chofer(db, chofer)


# Get all Choferes
@app.get("/choferes/", response_model=list[schemas.Chofer])
def read_choferes(
    empresa_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
    is_employee: int = 0,
):
    if is_employee:
        # Get all choferes
        return crud.get_choferes(db, skip=skip, limit=limit)
    if empresa_id:
        return crud.get_choferes_by_empresa(db, id, skip=skip, limit=limit)
    # Get only the resources from that empresa
    empresa = crud.get_empresa_by_email(db=db, email=user.email)
    return crud.get_choferes_by_empresa(
        db=db, id=empresa.one().id, skip=skip, limit=limit
    )


# Get Chofer by ID
@app.get("/choferes/{id}", response_model=schemas.Chofer)
def read_chofer(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    chofer = crud.get_chofer(db, id)
    if chofer is None:
        raise HTTPException(status_code=404, detail="Chofer not found")
    return chofer


# Get Chofer by DNI
@app.get("/choferes/dni/{dni}", response_model=schemas.Chofer)
def read_chofer_by_dni(
    dni: int, db: Session = Depends(get_db), user: Auth0User = Security(auth.get_user)
):
    chofer = crud.get_chofer_by_dni(db, dni)
    if chofer is None:
        raise HTTPException(status_code=404, detail="Chofer not found")
    return chofer


# Edit a Chofer
@app.put("/choferes/{id}", response_model=schemas.Chofer)
def update_chofer(
    id: int,
    data: schemas.ChoferCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_chofer(db=db, id=id, data=data)


## ------------Pesada operations---------------------
# Create a Pesada
@app.post("/pesadas/", response_model=schemas.Pesada)
def create_pesada(
    pesada: schemas.PesadaCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.create_pesada(db, pesada)


# Get all Pesada records
@app.get("/pesadas/", response_model=list[schemas.Pesada])
def read_pesadas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    pesadas = crud.get_pesada(db, skip=skip, limit=limit)
    return pesadas


# Get Pesada by ID
@app.get("/pesadas/{id}", response_model=schemas.Pesada)
def read_pesada(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    pesada = crud.get_pesada(db, id)
    if pesada is None:
        raise HTTPException(status_code=404, detail="Pesada not found")
    return pesada


# Get Pesada records by date range
@app.get("/pesadas/by-date-range/", response_model=list[schemas.Pesada])
def read_pesadas_by_date_range(
    start_date: datetime = Query(..., description="Start date of the date range"),
    end_date: datetime = Query(..., description="End date of the date range"),
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(100, description="Maximum number of records to retrieve"),
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    pesadas = crud.get_pesadas_by_date_range(db, start_date, end_date, skip, limit)
    return pesadas


## ------------PesadasOut operations---------------------


## ------------Silos operations---------------------
# Create a Silo
@app.post("/silos/", response_model=schemas.Silo)
def create_silo(
    silo: schemas.SiloCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_producto(db=db, id=silo.id):
        raise HTTPException(status_code=404, detail="Producto ID not found!")
    return crud.create_silo(db, silo)


# Get all Silos
@app.get("/silos/", response_model=list[schemas.Silo])
def read_silos(
    producto_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if producto_id:
        return crud.get_silos_by_producto(db, producto_id, skip=skip, limit=limit)
    return crud.get_silos(db, skip=skip, limit=limit)


# Get Silo by ID
@app.get("/silos/{id}", response_model=schemas.Silo)
def read_silo(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    silo = crud.get_silo(db, id)
    if silo is None:
        raise HTTPException(status_code=404, detail="Silo not found")
    return silo


## ------------Turnos operations---------------------
# Create a Turno
@app.post("/turnos/", response_model=schemas.Turno)
def create_turno(
    turno: schemas.TurnoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    print("-------Starting turno create--------")
    # id lo provee el front en el header
    if not crud.get_empresa(db=db, id=turno.id):
        raise HTTPException(status_code=404, detail="Empresa ID not found")
    if not crud.get_chofer(db=db, id=turno.chofer_id):
        raise HTTPException(status_code=404, detail="Chofer ID not found")
    if not crud.get_producto(db=db, id=turno.producto_id):
        raise HTTPException(status_code=404, detail="Producto ID not found")
    if not crud.get_vehiculo(db=db, id=turno.vehiculo_id):
        raise HTTPException(status_code=404, detail="Vehiculo ID not found")
    return crud.create_turno(db=db, turno=turno)


# Get all Turnos
@app.get("/turnos/", response_model=list[schemas.Turno])
def read_turnos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
    is_employee: int = 0,
):
    if is_employee:
        # Get all turns
        return crud.get_turnos(db, skip=skip, limit=limit)
    # Get only the resources from that empresa
    empresa = crud.get_empresa_by_email(db=db, email=user.email)
    return crud.get_turnos_by_empresa(db, id=empresa.one().id, skip=skip, limit=limit)


# Get a Turno by ID
@app.get("/turnos/{id}", response_model=schemas.Turno)
def read_turno(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    turno = crud.get_turno(db, id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno not found")
    return turno


# Get a Turno by ID
@app.get("/turnos/{turno_id}/pesada", response_model=schemas.Pesada)
def read_pesada_by_turno_id(
    turno_id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    turno = crud.get_turno(db, turno_id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno not found")
    pesada = crud.get_pesadas_by_turno_id(db=db, turno_id=turno_id)
    if pesada is None:
        raise HTTPException(status_code=404, detail="Pesada not found")
    return pesada


# Get Pesada records by date range
@app.get("/turnos/by-date-range/", response_model=list[schemas.Turno])
def read_turnos_by_date_range(
    start_date: str = Query(..., description="Start date of the date range"),
    end_date: str = Query(..., description="End date of the date range"),
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(100, description="Maximum number of records to retrieve"),
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
    is_employee: int = 0,
):
    if is_employee:
        return crud.get_turnos_by_date_range(
            db, start_date, end_date, skip=skip, limit=limit
        )
    empresa = crud.get_by_email(db=db, email=user.email)
    return crud.get_turnos_by_date_range_by_empresa(
        db, start_date, end_date, id=empresa.one().id, skip=skip, limit=limit
    )


# Validate turnos for OrangePI client
@app.get("/public/turnos/validate", response_model=schemas.Turno)
def read_turno_by_patente_rfid(
    fecha: datetime = Query(datetime.now(), description="Fecha"),
    patente: str = Query("a", description="Patente"),
    rfid_uid: int = Query(0, description="RFID"),
    db: Session = Depends(get_db),
):
    data = crud.get_turnos_by_patente_rfid(
        db=db, patente=patente, rfid_uid=rfid_uid, fecha=fecha
    )
    if not data:
        raise HTTPException(
            status_code=404, detail="Turno with that patente and RFID_UID not found!"
        )
    return data


@app.put("/turnos/{id}", response_model=schemas.Turno)
def update_turno(
    id: int,
    state: schemas.TURNO_STATE,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if state == "in_progress":
        instance = schemas.PesadaCreate(turno_id=id)
        crud.create_pesada(db=db, pesada=instance)
    return crud.update_turno(db=db, id=id, state=state)


## ------------Vehiculos operations---------------------
# Create a Vehiculo
@app.post("/vehiculos/", response_model=schemas.Vehiculo)
def create_vehiculo(
    vehiculo: schemas.VehiculoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_empresa(db=db, id=vehiculo.id):
        raise HTTPException(status_code=404, detail="Empresa ID not found!")
    if crud.get_vehiculo_by_patente(db=db, patente=vehiculo.patente):
        raise HTTPException(status_code=404, detail="Patente already in use!")
    return crud.create_vehiculo(db, vehiculo)


# Get all Vehiculos and by patente
@app.get("/vehiculos/", response_model=list[schemas.Vehiculo])
def read_vehiculos(
    patente: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
    is_employee: int = 0,
):
    if is_employee:
        # Get all turns
        return crud.get_vehiculos(db, skip=skip, limit=limit)
    if patente:
        vehiculo = crud.get_vehiculo_by_patente(db, patente)
        if vehiculo is None:
            raise HTTPException(status_code=404, detail="Vehiculo not found")
        return vehiculo
    # Get only the resources from that empresa
    empresa = crud.get_empresa_by_email(db=db, email=user.email)
    return crud.get_vehiculo_by_empresa(
        db, empresa_id=empresa.one().id, skip=skip, limit=limit
    )


# Get a Vehiculo by ID
@app.get("/vehiculos/{id}", response_model=schemas.Vehiculo)
def read_vehiculo(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    vehiculo = crud.get_vehiculo(db, id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    return vehiculo


# Get a Vehiculo by ID SECURE
@app.get("/vehiculos/secure/{id}", response_model=schemas.Vehiculo)
def read_vehiculo(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    vehiculo = crud.get_vehiculo(db, id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    return vehiculo


@app.put("/vehiculos/{id}", response_model=schemas.Vehiculo)
def update_vehiculo(
    id: int,
    data: schemas.VehiculoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_vehiculo(db=db, id=id, data=data)


######################
# FastAPI auth AUTH0
@app.get("/api/get_auth0_user")
def get_secure(user: Auth0User = Security(auth.get_user)):
    return {"message": f"{user}"}


@app.get("/public")
def get_public():
    return {"message": "Anonymous user"}


@app.get("/public/test_create")
def test_create(
    db: Session = Depends(get_db),
):
    test_empresa = schemas.EmpresaCreate(
        nombre="HOLA",
        RS="HOLA",
        CUIT=123,
        direccion="HOLA",
        localidad="HOLA",
        provincia="HOLA",
        pais="HOLA",
        telefono="HOLA",
        email="HOLA",
    )
    test_producto = schemas.ProductoCreate(nombre="str")
    test_chofer = schemas.ChoferCreate(
        rfid_uid=None,
        nombre="hola|",
        apellido="aps",
        dni=123,
        empresa_id=1,
        habilitado=True,
    )
    test_vehiculo = schemas.VehiculoCreate(
        patente="str",
        seguro="str",
        modelo="str",
        año=1,
        marca="str",
        habilitado=True,
        empresa_id=1,
    )
    test_turno = schemas.TurnoCreate(
        fecha=datetime.now(),
        cantidad_estimada=1,
        chofer_id=1,
        empresa_id=1,
        producto_id=1,
        vehiculo_id=1,
        state="pending",
    )
    print(test_producto)
    print(test_vehiculo)

    crud.create_empresa(db=db, empresa=test_empresa)
    crud.create_producto(db=db, producto=test_producto)
    crud.create_chofer(db=db, chofer=test_chofer)
    crud.create_vehiculo(db=db, vehiculo=test_vehiculo)
    crud.create_turno(db=db, turno=test_turno)
    return {"message": "DONE"}


def main():
    uvicorn.run("main:app", port=5000, log_level="info", reload=True, host="0.0.0.0")


if __name__ == "__main__":
    main()
