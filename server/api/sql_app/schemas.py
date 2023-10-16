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
        from_attributes = True


class ProductoBase(BaseModel):
    producto_nombre: str


class ProductoCreate(ProductoBase):
    pass


class Producto(ProductoBase):
    producto_id: int

    class Config:
        from_attributes = True


class ChoferBase(BaseModel):
    rfid_uid: int | None = None
    nombre: str
    apellido: str
    dni: int
    empresa_id: int
    habilitado: bool


class ChoferCreate(ChoferBase):
    pass


class Chofer(ChoferBase):
    chofer_id: int
    empresa: Empresa

    class Config:
        from_attributes = True


class PesadaBase(BaseModel):
    chofer_id: int
    peso_bruto: float
    patente: str
    empresa_id: int
    producto_id: int


class PesadaCreate(PesadaBase):
    pass


class Pesada(PesadaBase):
    pesada_id: int

    class Config:
        from_attributes = True


class SiloBase(BaseModel):
    producto_id: int
    capacidad: int
    utilizado: int
    estado: int


class SiloCreate(SiloBase):
    pass


class Silo(SiloBase):
    silo_id: int
    producto: Producto

    class Config:
        from_attributes = True


class TurnoBase(BaseModel):
    turno_fecha: date
    cantidad_estimada: int
    chofer_id: int
    empresa_id: int
    producto_id: int
    vehiculo_id: int


class TurnoCreate(TurnoBase):
    pass


class VehiculoBase(BaseModel):
    patente: str
    seguro: str
    modelo: str
    año: int
    marca: str
    habilitado: bool
    empresa_id: int


class VehiculoCreate(VehiculoBase):
    pass


class Vehiculo(VehiculoBase):
    vehiculo_id: int
    empresa: Empresa

    class Config:
        from_attributes = True


class Turno(TurnoBase):
    turno_id: int
    created_on: datetime
    empresa: Empresa
    chofer: Chofer
    producto: Producto
    vehiculo: Vehiculo

    class Config:
        from_attributes = True
