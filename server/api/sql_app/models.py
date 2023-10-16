from sqlalchemy import (
    Boolean,
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
    ForeignKey,
    DECIMAL,
    TIMESTAMP,
    DateTime,
    func,
    text,
)
from sqlalchemy.orm import relationship
from database import Base


class Empresa(Base):
    __tablename__ = "empresas"

    empresa_id = Column(Integer, primary_key=True, autoincrement=True)
    empresa_nombre = Column(String(255), nullable=False)
    empresa_RS = Column(String(255), nullable=False)
    empresa_CUIT = Column(String(255), nullable=False)
    empresa_direccion = Column(String(255), nullable=False)
    empresa_localidad = Column(String(255), nullable=False)
    empresa_provincia = Column(String(255), nullable=False)
    empresa_pais = Column(String(255), nullable=False)
    empresa_telefono = Column(String(255), nullable=True)


class Producto(Base):
    __tablename__ = "productos"

    producto_id = Column(Integer, primary_key=True, autoincrement=True)
    producto_nombre = Column(String(255), nullable=False)
    silo = relationship("Silo", backref="producto")


class Chofer(Base):
    __tablename__ = "choferes"

    chofer_id = Column(Integer, primary_key=True, autoincrement=True)
    rfid_uid = Column(String(255), nullable=True)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    dni = Column(Integer, nullable=False)
    empresa_id = Column(Integer, ForeignKey("empresas.empresa_id"))
    habilitado = Column(Boolean, nullable=False)
    created_on = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    empresa = relationship("Empresa", backref="empresa_chofer")


class Pesada(Base):
    __tablename__ = "pesadasIn"

    pesada_id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_hora_in = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    fecha_hora_out = Column(TIMESTAMP, nullable=False)
    chofer_id = Column(Integer, ForeignKey("choferes.chofer_id"))
    peso_bruto_in = Column(DECIMAL(9, 2), nullable=False)
    peso_bruto_out = Column(DECIMAL(9, 2), nullable=True)
    empresa_id = Column(Integer, ForeignKey("empresas.empresa_id"))
    producto_id = Column(Integer, ForeignKey("productos.producto_id"))
    chofer = relationship("Chofer")
    empresa = relationship("Empresa")
    producto = relationship("Producto")


class Silo(Base):
    __tablename__ = "silos"

    silo_id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.producto_id"))
    capacidad = Column(Integer, nullable=False)
    utilizado = Column(Integer, nullable=False)
    estado = Column(Integer, nullable=False)


class Turno(Base):
    __tablename__ = "turnos"

    turno_id = Column(Integer, primary_key=True, autoincrement=True)
    created_on = Column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    turno_fecha = Column(TIMESTAMP, nullable=False)
    cantidad_estimada = Column(Integer, nullable=False)
    chofer_id = Column(Integer, ForeignKey("choferes.chofer_id"))
    empresa_id = Column(Integer, ForeignKey("empresas.empresa_id"))
    producto_id = Column(Integer, ForeignKey("productos.producto_id"))
    vehiculo_id = Column(Integer, ForeignKey("vehiculos.vehiculo_id"))
    chofer = relationship("Chofer", backref="chofer_turno")
    empresa = relationship("Empresa", backref="empresa_turno")
    producto = relationship("Producto", backref="producto_turno")
    vehiculo = relationship(
        "Vehiculo", backref="vehiculo_turno", foreign_keys=[vehiculo_id]
    )


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    vehiculo_id = Column(Integer, primary_key=True, autoincrement=True)
    patente = Column(String, unique=True, nullable=False)
    seguro = Column(String(255), nullable=False)
    modelo = Column(String(255), nullable=False)
    año = Column(Integer, nullable=False)
    marca = Column(String(255), nullable=False)
    habilitado = Column(Boolean, nullable=False)
    empresa_id = Column(Integer, ForeignKey("empresas.empresa_id"))
    empresa = relationship("Empresa", backref="empresa_vehiculo")
