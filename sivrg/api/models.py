from sqlalchemy import (
    Boolean,
    Column,
    Date,
    ForeignKey,
    Integer,
    BigInteger,
    String,
    ForeignKey,
    DECIMAL,
    TIMESTAMP,
    DateTime,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import ChoiceType

Base = declarative_base()

CHOICES_STATES = [
    ("pending", "Pendiente"),
    ("canceled", "Cancelado"),
    ("accepted", "Aceptado"),
    ("in_progress_entrada", "En progreso. Entrada planta"),
    ("in_progress_balanza_in", "En progreso. Balanza ingreso"),
    ("in_progress_balanza_out", "En progreso. Balanza egreso"),
    ("finished", "Finalizado"),
]


class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    RS = Column(String(255), nullable=False)
    CUIT = Column(String(255), nullable=False)
    direccion = Column(String(255), nullable=False)
    localidad = Column(String(255), nullable=False)
    provincia = Column(String(255), nullable=False)
    pais = Column(String(255), nullable=False)
    telefono = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False)


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    silo = relationship("Silo", backref="producto")


class Chofer(Base):
    __tablename__ = "choferes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rfid_uid = Column(BigInteger, nullable=True)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    dni = Column(Integer, nullable=False)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    habilitado = Column(Boolean, nullable=False)
    created_on = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    empresa = relationship("Empresa", backref="chofer")


class Pesada(Base):
    __tablename__ = "pesadas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_hora_planta_in = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    fecha_hora_balanza_in = Column(TIMESTAMP, nullable=True)
    fecha_hora_balanza_out = Column(TIMESTAMP, nullable=True)
    peso_bruto_in = Column(DECIMAL(9, 2), nullable=True)
    peso_bruto_out = Column(DECIMAL(9, 2), nullable=True)
    turno_id = Column(Integer)


class Silo(Base):
    __tablename__ = "silos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    capacidad = Column(Integer, nullable=False)
    utilizado = Column(Integer, nullable=False)
    habilitado = Column(Boolean, nullable=False)
    reservado  = Column(Integer, nullable=True)

class Turno(Base):
    __tablename__ = "turnos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state = Column(ChoiceType(CHOICES_STATES), default="pending")
    created_on = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    fecha = Column(TIMESTAMP, nullable=False)
    checking_time = Column(TIMESTAMP, nullable=True)
    cantidad_estimada = Column(Integer, nullable=False)
    chofer_id = Column(Integer, ForeignKey("choferes.id"))
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    producto_id = Column(Integer, ForeignKey("productos.id"))
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.id"))
    pesada_id = Column(Integer, ForeignKey("pesadas.id"), nullable=True)
    chofer = relationship("Chofer", backref="chofer_turno")
    empresa = relationship("Empresa", backref="empresa_turno")
    producto = relationship("Producto", backref="producto_turno")
    vehiculo = relationship(
        "Vehiculo", backref="vehiculo_turno", foreign_keys=[vehiculo_id]
    )
    pesada = relationship("Pesada", backref="pesada_turno", foreign_keys=[pesada_id])


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patente = Column(String, unique=True, nullable=False)
    seguro = Column(String(255), nullable=False)
    modelo = Column(String(255), nullable=False)
    año = Column(Integer, nullable=False)
    marca = Column(String(255), nullable=False)
    habilitado = Column(Boolean, nullable=False)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa = relationship("Empresa", backref="vehiculo")
