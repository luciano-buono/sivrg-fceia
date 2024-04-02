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

import uvicorn

from sqlalchemy.orm import Session
from datetime import datetime

import crud, models, schemas
from database import SessionLocal, engine


from functools import lru_cache
import config

settings = config.Settings()

from pydantic import Field
from typing import Optional, Dict, List, Type

from auth0_extended import Auth0User, Auth0

import models, schemas


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
    # if employee get all empresas
    if "employee" in user.roles:
        if email:
            return crud.get_empresa_by_email(db=db, email=email)
        if nombre:
            return crud.get_empresa_by_name(db=db, nombre=nombre)
        return crud.get_empresas(db=db, skip=skip, limit=limit)
    return crud.get_empresa_by_email(db=db, email=user.email)


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

@app.delete("/empresas/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_empresa(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    empresa = crud.get_empresa(db, id)
    if empresa is None:
        raise HTTPException(status_code=404, detail="empresa not found")
    db.delete(empresa)
    db.commit()

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

@app.delete("/productos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    producto = crud.get_producto(db, id)
    if producto is None:
        raise HTTPException(status_code=404, detail="producto not found")
    db.delete(producto)
    db.commit()

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
):
    if empresa_id:
        return crud.get_choferes_by_empresa(
            db, empresa_id=empresa_id, skip=skip, limit=limit
        )
    if "employee" in user.roles:
        # Get all choferes
        return crud.get_choferes(db, skip=skip, limit=limit)
    # Get only the resources from that empresa
    empresa = crud.get_empresa_by_email(db=db, email=user.email)
    return crud.get_choferes_by_empresa(
        db=db, empresa_id=empresa.one().id, skip=skip, limit=limit
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

@app.delete("/choferes/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chofer(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    chofer = crud.get_chofer(db, id)
    if chofer is None:
        raise HTTPException(status_code=404, detail="chofer not found")
    db.delete(chofer)
    db.commit()

## ------------Pesada operations---------------------
# Create a Pesada
@app.post("/pesadas/", response_model=schemas.Pesada)
def create_pesada(
    pesada: schemas.PesadaCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_turno(db=db, id=pesada.turno_id):
        raise HTTPException(status_code=404, detail="Turno ID not found!")
    return crud.create_pesada(db, pesada)


# Get all Pesada records
@app.get("/pesadas/", response_model=list[schemas.Pesada])
def read_pesadas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    turno_id: int | None = None,
    fecha_hora_balanza_out_start_date: datetime | None = Query(datetime.now(), description="Fecha"),
    fecha_hora_balanza_out_end_date: datetime | None = Query(datetime.now(), description="Fecha"),
    user: Auth0User = Security(auth.get_user),
):
    q = db.query(models.Pesada)
    if turno_id:
        q = q.filter(models.Pesada.turno_id == turno_id)
    if fecha_hora_balanza_out_start_date and fecha_hora_balanza_out_end_date:
        q = q.filter(models.Turno.fecha.between(fecha_hora_balanza_out_start_date, fecha_hora_balanza_out_end_date))
    return q.all()


    pesadas = crud.get_pesada(db, skip=skip, limit=limit)
    return pesadas


# Get all Turnos
@app.get("/turnos/", response_model=list[schemas.Turno])
def read_turnos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    empresa_id: int | None = None,
    state: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    user: Auth0User = Security(auth.get_user),
):
    q = db.query(models.Turno)
    if "client" in user.roles:
        empresa_id = crud.get_empresa_by_email(db=db, email=user.email).one().id
    if empresa_id:
        q = q.filter(models.Turno.empresa_id == empresa_id)
    if state:
        q = q.filter(models.Turno.state == state)
    if start_date and end_date:
        q = q.filter(models.Turno.fecha.between(start_date, end_date))
    return q.all()


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


# Edit a Pesada
@app.put("/pesadas/{id}", response_model=schemas.Pesada)
def update_pesada(
    id: int,
    data: schemas.PesadaCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_pesada(db=db, id=id, data=data)

@app.delete("/pesadas/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pesada(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    pesada = crud.get_pesada(db, id)
    if pesada is None:
        raise HTTPException(status_code=404, detail="pesada not found")
    db.delete(pesada)
    db.commit()

## ------------Silos operations---------------------
# Create a Silo
@app.post("/silos/", response_model=schemas.Silo)
def create_silo(
    silo: schemas.SiloCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_producto(db=db, id=silo.producto_id):
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


@app.put("/silos/{id}", response_model=schemas.Silo)
def update_silo(
    id: int,
    data: schemas.SiloCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_silo(db=db, id=id, data=data)

@app.delete("/silos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_silo(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    silo = crud.get_silo(db, id)
    if silo is None:
        raise HTTPException(status_code=404, detail="silo not found")
    db.delete(silo)
    db.commit()

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
    if not crud.get_empresa(db=db, id=turno.empresa_id):
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
    empresa_id: int | None = None,
    state: str | None = None,
    start_date: datetime | None = Query(datetime.now(), description="Fecha"),
    end_date: datetime | None = Query(datetime.now(), description="Fecha"),
    user: Auth0User = Security(auth.get_user),
):
    q = db.query(models.Turno)
    if "client" in user.roles:
        empresa_id = crud.get_empresa_by_email(db=db, email=user.email).one().id
    if empresa_id:
        q = q.filter(models.Turno.empresa_id == empresa_id)
    if state:
        q = q.filter(models.Turno.state == state)
    if start_date and end_date:
        q = q.filter(models.Turno.fecha.between(start_date, end_date))
    return q.all()


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

# Validate turnos for OrangePI client
@app.get("/turnos/validate/", response_model=schemas.Turno)
def read_turno_by_patente_rfid(
    fecha: datetime = Query(datetime.now(), description="Fecha"),
    patente: str = Query("a", description="Patente"),
    rfid_uid: int = Query(0, description="RFID"),
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
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
    if state == "in_progress_entrada":
        instance = schemas.PesadaCreate(turno_id=id)
        pesada = crud.create_pesada(db=db, pesada=instance)
        checking_time = datetime.now()
        return crud.update_turno(
            db=db, id=id, state=state, checking_time=checking_time, pesada_id=pesada.id
        )
    return crud.update_turno(db=db, id=id, state=state)


@app.delete("/turnos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_turno(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    turno = crud.get_turno(db, id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno not found")
    db.delete(turno)
    db.commit()


## ------------Vehiculos operations---------------------
# Create a Vehiculo
@app.post("/vehiculos/", response_model=schemas.Vehiculo)
def create_vehiculo(
    vehiculo: schemas.VehiculoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if not crud.get_empresa(db=db, id=vehiculo.empresa_id):
        raise HTTPException(status_code=404, detail="Empresa ID not found!")
    if crud.get_vehiculo_by_patente(db=db, patente=vehiculo.patente):
        raise HTTPException(status_code=404, detail="Patente already in use!")
    return crud.create_vehiculo(db, vehiculo)


# Get all Vehiculos and by patente
@app.get("/vehiculos/", response_model=list[schemas.Vehiculo])
def read_vehiculos(
    patente: str | None = None,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    q = db.query(models.Vehiculo)
    if "client" in user.roles:
        empresa = crud.get_empresa_by_email(db=db, email=user.email)
        q = q.filter(models.Vehiculo.empresa_id == empresa.one().id)
    if patente:
        q = q.filter(models.Vehiculo.patente == patente)
    return q.all()


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


@app.put("/vehiculos/{id}", response_model=schemas.Vehiculo)
def update_vehiculo(
    id: int,
    data: schemas.VehiculoCreate,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    return crud.update_vehiculo(db=db, id=id, data=data)


@app.delete("/vehiculos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehiculo(
    id: int,
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    if "client" in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )
    vehiculo = crud.get_vehiculo(db, id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    db.delete(vehiculo)
    db.commit()


######################
# FastAPI auth AUTH0
@app.get("/api/get_auth0_user")
def get_secure(user: Auth0User = Security(auth.get_user)):
    return {"message": f"{user}"}


@app.get("/public")
def get_public():
    return {"message": "Anonymous user"}


@app.get("/test_create")
def test_create(
    db: Session = Depends(get_db),
    user: Auth0User = Security(auth.get_user),
):
    test_empresa = schemas.EmpresaCreate(
        nombre="Empresin",
        RS="RI",
        CUIT=3029139232,
        direccion="San Martin 123",
        localidad="Resistencia",
        provincia="Chaco",
        pais="Argentina",
        telefono="+54910410583",
        email="empresin@external.com.ar",
    )
    test_producto = schemas.ProductoCreate(nombre="Soja")
    test_chofer = schemas.ChoferCreate(
        rfid_uid=None,
        nombre="Gustavo",
        apellido="Figs",
        dni=40112012,
        empresa_id=1,
        habilitado=True,
    )
    test_vehiculo = schemas.VehiculoCreate(
        patente="ABC123",
        seguro="La segunda",
        modelo="Vento",
        año=2006,
        marca="Vento",
        habilitado=True,
        empresa_id=1,
    )
    test_turno = schemas.TurnoCreate(
        fecha=datetime.now(),
        cantidad_estimada=10000,
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
