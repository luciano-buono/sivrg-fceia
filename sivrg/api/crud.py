from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

import models, schemas

## ------------Empresa operations---------------------


def get_empresa(db: Session, id: int):
    return db.query(models.Empresa).filter(models.Empresa.id == id).first()


def get_empresa_by_name(db: Session, nombre: str):
    return db.query(models.Empresa).filter(
        models.Empresa.nombre == nombre if nombre else True
    )


def get_empresa_by_email(db: Session, email: str):
    return db.query(models.Empresa).filter(
        models.Empresa.email == email if email else True
    )


def get_empresas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Empresa).offset(skip).limit(limit).all()


def create_empresa(db: Session, empresa: schemas.EmpresaCreate):
    db_empresa = models.Empresa(
        nombre=empresa.nombre,
        RS=empresa.RS,
        CUIT=empresa.CUIT,
        direccion=empresa.direccion,
        localidad=empresa.localidad,
        provincia=empresa.provincia,
        pais=empresa.pais,
        telefono=empresa.telefono,
        email=empresa.email,
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa


def update_empresa(db: Session, id: int, data: schemas.EmpresaCreate):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == id).one_or_none()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa not found")
    for var, value in vars(data).items():
        setattr(empresa, var, value) if value else None
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


## ------------Producto operations---------------------


def get_producto(db: Session, id: int):
    return db.query(models.Producto).filter(models.Producto.id == id).first()


def get_producto_by_name(db: Session, nombre: str):
    return db.query(models.Producto).filter(models.Producto.nombre == nombre).first()


def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Producto).offset(skip).limit(limit).all()


def create_producto(db: Session, producto: schemas.ProductoCreate):
    db_producto = models.Producto(nombre=producto.nombre)
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto


## ------------Chofer operations---------------------


def get_chofer(db: Session, id: int):
    return db.query(models.Chofer).filter(models.Chofer.id == id).first()


def get_chofer_by_dni(db: Session, dni: int):
    return db.query(models.Chofer).filter(models.Chofer.dni == dni).first()


def get_choferes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Chofer).offset(skip).limit(limit).all()


def get_choferes_by_empresa(
    db: Session, empresa_id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Chofer)
        .filter(models.Chofer.empresa_id == empresa_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_chofer(db: Session, chofer: schemas.ChoferCreate):
    db_chofer = models.Chofer(
        rfid_uid=chofer.rfid_uid,
        nombre=chofer.nombre,
        apellido=chofer.apellido,
        dni=chofer.dni,
        empresa_id=chofer.empresa_id,
        habilitado=chofer.habilitado,
    )
    db.add(db_chofer)
    db.commit()
    db.refresh(db_chofer)
    return db_chofer


def update_chofer(db: Session, id: int, data: schemas.ChoferCreate):
    chofer = db.query(models.Chofer).filter(models.Chofer.id == id).one_or_none()
    if not chofer:
        raise HTTPException(status_code=404, detail="Chofer not found")
    for var, value in vars(data).items():
        setattr(chofer, var, value) if value else None
    db.add(chofer)
    db.commit()
    db.refresh(chofer)
    return chofer


## ------------Pesada operations---------------------


def get_pesada(db: Session, id: int):
    return db.query(models.Pesada).filter(models.Pesada.id == id).first()


def get_pesadas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pesada).offset(skip).limit(limit).all()


def get_pesadas_by_turno_id(db: Session, turno_id):
    return db.query(models.Pesada).filter(models.Pesada.turno_id == turno_id).first()


def get_pesadas_in_by_date(
    db: Session, target_date: datetime, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Pesada)
        .filter(db.func.date(models.Pesada.fecha_hora) == target_date.date())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_pesadas_by_date_range(
    db: Session,
    start_date: datetime,
    end_date: datetime,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(models.Pesada)
        .filter(models.Pesada.fecha_hora.between(start_date, end_date))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_pesada(db: Session, pesada: schemas.PesadaCreate):
    db_pesada = models.Pesada(
        fecha_hora_balanza_in=pesada.fecha_hora_balanza_in,
        fecha_hora_balanza_out=pesada.fecha_hora_balanza_out,
        peso_bruto_in=pesada.peso_bruto_in,
        peso_bruto_out=pesada.peso_bruto_out,
        turno_id=pesada.turno_id,
    )
    db.add(db_pesada)
    db.commit()
    db.refresh(db_pesada)
    return db_pesada


def update_pesada(db: Session, id: int, data: schemas.PesadaCreate):
    pesada = db.query(models.Pesada).filter(models.Pesada.id == id).one_or_none()
    if not pesada:
        raise HTTPException(status_code=404, detail="Pesada not found")
    for var, value in vars(data).items():
        setattr(pesada, var, value) if value else None
    db.add(pesada)
    db.commit()
    db.refresh(pesada)
    return pesada


## ------------PesadasOut operations---------------------


## ------------Silos operations---------------------
# Create a Silo
def create_silo(db: Session, silo: schemas.SiloCreate):
    db_silo = models.Silo(
        id=silo.id,
        capacidad=silo.capacidad,
        utilizado=silo.utilizado,
        estado=silo.estado,
    )
    db.add(db_silo)
    db.commit()
    db.refresh(db_silo)
    return db_silo


# Get a Silo by ID
def get_silo(db: Session, id: int):
    return db.query(models.Silo).filter(models.Silo.id == id).first()


# Get Silos by producto_id
def get_silos_by_producto(
    db: Session, producto_id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Silo)
        .filter(models.Silo.producto_id == producto_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Get all Silos
def get_silos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Silo).offset(skip).limit(limit).all()


## ------------Turnos operations---------------------
# Create a Turno
def create_turno(db: Session, turno: schemas.TurnoCreate):
    db_turno = models.Turno(
        state=turno.state,
        fecha=turno.fecha,
        cantidad_estimada=turno.cantidad_estimada,
        chofer_id=turno.chofer_id,
        empresa_id=turno.empresa_id,
        producto_id=turno.producto_id,
        vehiculo_id=turno.vehiculo_id,
    )
    db.add(db_turno)
    db.commit()
    db.refresh(db_turno)
    # db_turno.state = db_turno.state.code
    return db_turno


# Get a Turno by ID
def get_turno(db: Session, id: int):
    return db.query(models.Turno).filter(models.Turno.id == id).first()


# Get all Turnos
def get_turnos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Turno).offset(skip).limit(limit).all()


# Get turno by empresa ID
def get_turnos_by_empresa(db: Session, id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Turno)
        .filter(models.Turno.id == id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Get Turnos by date
def get_turnos_by_date(
    db: Session, date: str, id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Turno)
        .filter(models.Turno.fecha == date)
        # .filter(models.Turno.id == id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Get Turnos by date
def get_turnos_by_date_range(
    db: Session, start_date: str, end_date: str, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Turno)
        .filter(models.Turno.fecha.between(start_date, end_date))
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_turnos_by_date_range_by_empresa(
    db: Session,
    start_date: str,
    end_date: str,
    id: int,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(models.Turno)
        .filter(models.Turno.fecha.between(start_date, end_date))
        .filter(models.Turno.id == id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Get Turnos by patente and RFID_UID
def get_turnos_by_patente_rfid(
    db: Session, patente: str, rfid_uid: int, fecha: datetime
):
    return (
        db.query(models.Turno)
        .filter(func.date(models.Turno.fecha) == fecha.date())
        .filter(models.Turno.vehiculo.has(patente=patente))
        .filter(models.Turno.chofer.has(rfid_uid=rfid_uid))
        .first()
    )


def update_turno(db: Session, id: int, state: str):
    turno = db.query(models.Turno).filter(models.Turno.id == id).one_or_none()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno not found")
    setattr(turno, "state", state)
    db.add(turno)
    db.commit()
    db.refresh(turno)
    return turno


## ------------Vehiculos operations---------------------
# Create a Vehiculo
def create_vehiculo(db: Session, vehiculo: schemas.VehiculoCreate):
    db_vehiculo = models.Vehiculo(
        patente=vehiculo.patente,
        seguro=vehiculo.seguro,
        modelo=vehiculo.modelo,
        año=vehiculo.año,
        marca=vehiculo.marca,
        empresa_id=vehiculo.empresa_id,
        habilitado=vehiculo.habilitado,
    )
    db.add(db_vehiculo)
    db.commit()
    db.refresh(db_vehiculo)
    return db_vehiculo


# Get a Vehiculo by ID
def get_vehiculo(db: Session, id: int):
    return db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()


# Get a Vehiculo by empresa
def get_vehiculo_by_empresa(db: Session, empresa_id: str):
    return (
        db.query(models.Vehiculo)
        .filter(models.Vehiculo.empresa_id == empresa_id)
        .first()
    )


# Get a Vehiculo by patente
def get_vehiculo_by_patente(db: Session, patente: str):
    return db.query(models.Vehiculo).filter(models.Vehiculo.patente == patente).first()


# Get all Vehiculos
def get_vehiculos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vehiculo).offset(skip).limit(limit).all()


# Update Vehiculo
def update_vehiculo(db: Session, id: int, data: schemas.VehiculoCreate):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).one_or_none()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    for var, value in vars(data).items():
        setattr(vehiculo, var, value) if value else None
    db.add(vehiculo)
    db.commit()
    db.refresh(vehiculo)
    return vehiculo
