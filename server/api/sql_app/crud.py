from datetime import datetime, timedelta
from sqlalchemy.orm import Session

import models, schemas

## ------------Empresa operations---------------------


def get_empresa(db: Session, empresa_id: int):
    return (
        db.query(models.Empresa).filter(models.Empresa.empresa_id == empresa_id).first()
    )


def get_empresa_by_name(db: Session, empresa_nombre: str):
    return (
        db.query(models.Empresa)
        .filter(models.Empresa.empresa_nombre == empresa_nombre)
        .first()
    )


def get_empresas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Empresa).offset(skip).limit(limit).all()


def create_empresa(db: Session, empresa: schemas.EmpresaCreate):
    db_empresa = models.Empresa(
        empresa_nombre=empresa.empresa_nombre,
        empresa_RS=empresa.empresa_RS,
        empresa_CUIT=empresa.empresa_CUIT,
        empresa_direccion=empresa.empresa_direccion,
        empresa_localidad=empresa.empresa_localidad,
        empresa_provincia=empresa.empresa_provincia,
        empresa_pais=empresa.empresa_pais,
        empresa_telefono=empresa.empresa_telefono,
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa


def update_empresa(db: Session, empresa_id: int, data: schemas.EmpresaCreate):
    empresa = (
        db.query(models.Empresa)
        .filter(models.Empresa.empresa_id == empresa_id)
        .one_or_none()
    )
    for var, value in vars(data).items():
        setattr(empresa, var, value) if value else None
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


## ------------Producto operations---------------------


def get_producto(db: Session, producto_id: int):
    return (
        db.query(models.Producto)
        .filter(models.Producto.producto_id == producto_id)
        .first()
    )


def get_producto_by_name(db: Session, producto_nombre: str):
    return (
        db.query(models.Producto)
        .filter(models.Producto.producto_nombre == producto_nombre)
        .first()
    )


def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Producto).offset(skip).limit(limit).all()


def create_producto(db: Session, producto: schemas.ProductoCreate):
    db_producto = models.Producto(producto_nombre=producto.producto_nombre)
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto


## ------------Chofer operations---------------------


def get_chofer(db: Session, chofer_id: int):
    return db.query(models.Chofer).filter(models.Chofer.chofer_id == chofer_id).first()


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


## ------------Pesada operations---------------------


def get_pesada(db: Session, pesada_id: int):
    return db.query(models.Pesada).filter(models.Pesada.pesada_id == pesada_id).first()


def get_pesadas_in(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pesada).offset(skip).limit(limit).all()


def get_pesadas_in_by_chofer(
    db: Session, chofer_id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Pesada)
        .filter(models.Pesada.chofer_id == chofer_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


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


def get_pesadas_in_by_date_range(
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
        chofer_id=pesada.chofer_id,
        peso_bruto=pesada.peso_bruto,
        patente=pesada.patente,
        empresa_id=pesada.empresa_id,
        producto_id=pesada.producto_id,
    )
    db.add(db_pesada)
    db.commit()
    db.refresh(db_pesada)
    return db_pesada


## ------------PesadasOut operations---------------------


## ------------Silos operations---------------------
# Create a Silo
def create_silo(db: Session, silo: schemas.SiloCreate):
    db_silo = models.Silo(
        producto_id=silo.producto_id,
        capacidad=silo.capacidad,
        utilizado=silo.utilizado,
        estado=silo.estado,
    )
    db.add(db_silo)
    db.commit()
    db.refresh(db_silo)
    return db_silo


# Get a Silo by ID
def get_silo(db: Session, silo_id: int):
    return db.query(models.Silo).filter(models.Silo.silo_id == silo_id).first()


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
        turno_fecha=turno.turno_fecha,
        cantidad_estimada=turno.cantidad_estimada,
        chofer_id=turno.chofer_id,
        empresa_id=turno.empresa_id,
        producto_id=turno.producto_id,
        vehiculo_id=turno.vehiculo_id,
    )
    db.add(db_turno)
    db.commit()
    db.refresh(db_turno)
    return db_turno


# Get a Turno by ID
def get_turno(db: Session, turno_id: int):
    return db.query(models.Turno).filter(models.Turno.turno_id == turno_id).first()


# Get all Turnos
def get_turnos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Turno).offset(skip).limit(limit).all()


# Get Turnos by date
def get_turnos_by_date(db: Session, date: str, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Turno)
        .filter(models.Turno.turno_fecha == date)
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
        .filter(models.Turno.turno_fecha.between(start_date, end_date))
        .offset(skip)
        .limit(limit)
        .all()
    )


# Get Turnos by patente and RFID_UID
def get_turnos_by_patente_rfid(db: Session, patente: str, rfid_uid: int):
    return (
        db.query(models.Turno)
        .filter(models.Turno.vehiculo.patente == patente)
        .one_or_none()
    )


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
def get_vehiculo(db: Session, vehiculo_id: int):
    return (
        db.query(models.Vehiculo)
        .filter(models.Vehiculo.vehiculo_id == vehiculo_id)
        .first()
    )


# Get a Vehiculo by patente
def get_vehiculo_by_patente(db: Session, patente: str):
    return db.query(models.Vehiculo).filter(models.Vehiculo.patente == patente).first()


# Get all Vehiculos
def get_vehiculos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vehiculo).offset(skip).limit(limit).all()
