from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, ForeignKey, DECIMAL, TIMESTAMP, DateTime, func, text
from sqlalchemy.orm import relationship
from database import Base

class Empresa(Base):
    __tablename__ = 'empresas'

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
    __tablename__ = 'productos'

    producto_id = Column(Integer, primary_key=True, autoincrement=True)
    producto_nombre = Column(String(255), nullable=False)
    unidad = Column(String(255), nullable=False)

class Rfid(Base):
    __tablename__ = 'rfid'

    rfid_uid = Column(String(255), primary_key=True)
    chofer_id = Column(Integer, ForeignKey('choferes.chofer_id'))

class Chofer(Base):
    __tablename__ = 'choferes'

    chofer_id = Column(Integer, primary_key=True, autoincrement=True)
    rfid_uid = Column(String(255), nullable=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    dni = Column(Integer, nullable=False)
    empresa_id = Column(Integer, ForeignKey('empresas.empresa_id'))
    habilitado = Column(Boolean, nullable=False)
    created_on = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    empresa = relationship("Empresa")

class PesadaIn(Base):
    __tablename__ = 'pesadasIn'

    pesadaIn_id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_hora = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    chofer_id = Column(Integer, ForeignKey('choferes.chofer_id'))
    peso_bruto = Column(DECIMAL(9, 2), nullable=False)
    patente = Column(String, nullable=False)
    empresa_id = Column(Integer, ForeignKey('empresas.empresa_id'))
    producto_id = Column(Integer, ForeignKey('productos.producto_id'))
    chofer = relationship("Chofer")
    empresa = relationship("Empresa")
    producto = relationship("Producto")

class PesadaOut(Base):
    __tablename__ = 'pesadasOut'

    pesadaOut_id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_hora = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    chofer_id = Column(Integer, ForeignKey('choferes.chofer_id'))
    peso_bruto = Column(DECIMAL(9, 2), nullable=False)
    patente = Column(String, nullable=False)
    empresa_id = Column(Integer, ForeignKey('empresas.empresa_id'))
    producto_id = Column(Integer, ForeignKey('productos.producto_id'))
    chofer = relationship("Chofer")
    empresa = relationship("Empresa")
    producto = relationship("Producto")

class Silo(Base):
    __tablename__ = 'silos'

    silo_id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey('productos.producto_id'))
    capacidad = Column(Integer, nullable=False)
    utilizado = Column(Integer, nullable=False)
    estado = Column(Integer, nullable=False)
    producto = relationship("Producto")

class Turno(Base):
    __tablename__ = 'turnos'

    turno_id = Column(Integer, primary_key=True, autoincrement=True)
    turno_fecha = Column(Date, nullable=False)
    chofer_id = Column(Integer, ForeignKey('choferes.chofer_id'))
    patente = Column(String, ForeignKey('vehiculos.patente'))
    empresa_id = Column(Integer, ForeignKey('empresas.empresa_id'))
    producto_id = Column(Integer, ForeignKey('productos.producto_id'))
    created_on = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    chofer = relationship("Chofer")
    empresa = relationship("Empresa")
    producto = relationship("Producto")
    vehiculo = relationship("Vehiculo")

class Vehiculo(Base):
    __tablename__ = 'vehiculos'

    vehiculo_id = Column(Integer, primary_key=True, autoincrement=True)
    patente = Column(String, unique=True, nullable=False)
    capacidad = Column(Integer, nullable=False)
    seguro = Column(String(255), nullable=False)
    modelo = Column(String(255), nullable=False)
    año = Column(Integer, nullable=False)
    marca = Column(String(255), nullable=False)
    habilitado = Column(Boolean, nullable=False)
