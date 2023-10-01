from pydantic import BaseModel
from datetime import date, datetime

class EmpresaBase(BaseModel):
    empresa_nombre: str
    empresa_RS: str
    empresa_CUIT: int
    empresa_direccion: str
    empresa_localidad: str
    empresa_provincia: str
    empresa_pais: str
    empresa_telefono: str

class EmpresaCreate(EmpresaBase):
    pass

class Empresa(EmpresaBase):
    empresa_id: int

    class Config:
        orm_mode = True


class ProductoBase(BaseModel):
    producto_nombre: str
    unidad: str

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    producto_id: int

    class Config:
        orm_mode = True

class RfidBase(BaseModel):
    chofer_id: int

class RfidCreate(RfidBase):
    pass

class Rfid(RfidBase):
    rfid_uid: int

    class Config:
        orm_mode = True


class ChoferBase(BaseModel):
    rfid_uid: int
    nombre: str
    apellido: str
    dni: int
    empresa_id: int
    habilitado: bool

class ChoferCreate(ChoferBase):
    pass

class Chofer(ChoferBase):
    chofer_id: int

    class Config:
        orm_mode = True

class PesadaInBase(BaseModel):
    chofer_id: int
    peso_bruto: float
    patente: str
    empresa_id: int
    producto_id: int

class PesadaInCreate(PesadaInBase):
    pass

class PesadaIn(PesadaInBase):
    pesadaIn_id: int

    class Config:
        orm_mode = True

class PesadaOutBase(BaseModel):
    chofer_id: int
    peso_bruto: float
    patente: str
    empresa_id: int
    producto_id: int

class PesadaOutCreate(PesadaOutBase):
    pass

class PesadaOut(PesadaOutBase):
    pesadaOut_id: int

    class Config:
        orm_mode = True

class SiloBase(BaseModel):
    producto_id: int
    capacidad: int
    utilizado: int
    estado: int

class SiloCreate(SiloBase):
    pass

class Silo(SiloBase):
    silo_id: int

    class Config:
        orm_mode = True

class TurnoBase(BaseModel):
    turno_fecha: date
    # chofer_id: int
    # chofer_dni: int
    # chofer_nombre: str
    chofer: ChoferBase
    patente: str
    empresa_id: int
    producto_id: int

class TurnoCreate(TurnoBase):
    pass

class Turno(TurnoBase):
    turno_id: int
    created_on: datetime

    class Config:
        orm_mode = True


class VehiculoBase(BaseModel):
    patente: str
    capacidad: int
    seguro: str
    modelo: str
    año: int
    marca: str
    habilitado: bool

class VehiculoCreate(VehiculoBase):
    pass

class Vehiculo(VehiculoBase):
    vehiculo_id: int

    class Config:
        orm_mode = True
